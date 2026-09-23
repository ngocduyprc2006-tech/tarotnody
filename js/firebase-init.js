/* ============================================================
   firebase-init.js  —  LỚP DUY NHẤT NÓI CHUYỆN VỚI FIREBASE
   ------------------------------------------------------------
   Cấu hình dự án "nodytarot" giữ NGUYÊN như bản cũ của bạn.
   Collection "readings" cũng giữ nguyên tên + nguyên các trường cũ
   (userId, userEmail, topic, question, spread, drawnCards, createdAt)
   nên dữ liệu đã lưu trước đây vẫn đọc được bình thường.

   File này là module. Nó gắn mọi thứ vào window.Nody rồi bắn sự kiện
   'nody:auth' để các file .js thường (không phải module) dùng được.

   Nếu Firebase không tải được (ví dụ bạn mở file bằng file://),
   cả web vẫn chạy — chỉ phần đăng nhập & lưu lịch sử là tạm nghỉ.
   ============================================================ */

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* ---------- CẤU HÌNH GỐC — ĐỪNG SỬA ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyBcQvVK1BLQ9EtffcQggLBLAbOJPZhBJTs",
  authDomain: "nodytarot.firebaseapp.com",
  projectId: "nodytarot",
  storageBucket: "nodytarot.firebasestorage.app",
  messagingSenderId: "592759055543",
  appId: "1:592759055543:web:4dede040734856c9505932",
  measurementId: "G-91Q88CNMPJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/* ---------- Dịch mã lỗi Firebase sang tiếng Việt dễ hiểu ---------- */
const ERRORS = {
  'auth/invalid-email': 'Email chưa đúng định dạng.',
  'auth/missing-password': 'Bạn chưa nhập mật khẩu.',
  'auth/weak-password': 'Mật khẩu cần ít nhất 6 ký tự.',
  'auth/email-already-in-use': 'Email này đã có tài khoản rồi. Bạn thử đăng nhập nhé.',
  'auth/user-not-found': 'Không tìm thấy tài khoản với email này.',
  'auth/wrong-password': 'Mật khẩu chưa đúng.',
  'auth/invalid-credential': 'Email hoặc mật khẩu chưa đúng.',
  'auth/too-many-requests': 'Thử hơi nhiều lần rồi. Bạn đợi vài phút rồi thử lại nhé.',
  'auth/popup-closed-by-user': 'Cửa sổ Google đã đóng trước khi xong.',
  'auth/popup-blocked': 'Trình duyệt chặn cửa sổ Google. Bạn cho phép pop-up rồi thử lại.',
  'auth/network-request-failed': 'Mạng đang chập chờn. Kiểm tra kết nối rồi thử lại.',
  'auth/unauthorized-domain': 'Tên miền này chưa được bật trong Firebase Authentication.',
  'auth/operation-not-allowed': 'Cách đăng nhập này chưa được bật trong Firebase Console.'
};

// Viết tường minh bằng if để trình duyệt/format code không bị lỗi
const readError = (e) => {
  if (e && e.code && ERRORS[e.code]) {
    return ERRORS[e.code];
  }
  return 'Có trục trặc nhỏ. Bạn thử lại giúp mình nhé.';
};

/* ============================================================
   API công khai
   ============================================================ */
const Nody = {
  ok: true,
  user: null,
  loaded: false,

  /* ---------- Tài khoản ---------- */
  async register(name, email, pass) {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (name) {
      await updateProfile(cred.user, { displayName: name.trim() });
    }
    return cred.user;
  },

  login(email, pass) {
    return signInWithEmailAndPassword(auth, email.trim(), pass);
  },

  loginGoogle() {
    return signInWithPopup(auth, googleProvider);
  },

  resetPassword(email) {
    return sendPasswordResetEmail(auth, email.trim());
  },

  logout() {
    return signOut(auth);
  },

  async renameMe(name) {
    if (!auth.currentUser) throw new Error('chưa đăng nhập');
    await updateProfile(auth.currentUser, { displayName: name.trim() });
    Nody.user = auth.currentUser;
    broadcast();
  },

  readError,

  /* ---------- Lưu một lượt xem ---------- */
  async saveReading(data) {
    if (!auth.currentUser) return null;

    let safeCards = [];
    if (Array.isArray(data.drawnCards)) {
      safeCards = data.drawnCards;
    }

    const payload = {
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email || '',
      kind: data.kind || 'tarot',
      title: data.title || '',
      topic: data.topic || '',
      question: data.question || '',
      spread: data.spread || '',
      summary: (data.summary || '').slice(0, 1200),
      drawnCards: safeCards,
      createdAt: serverTimestamp()
    };
    const ref = await addDoc(collection(db, 'readings'), payload);
    return ref.id;
  },

  /* ---------- Đọc lịch sử ---------- */
  async myReadings() {
    if (!auth.currentUser) return [];
    const snap = await getDocs(
      query(collection(db, 'readings'), where('userId', '==', auth.currentUser.uid))
    );
    const rows = [];
    snap.forEach(d => {
      const v = d.data();
      let safeTime = new Date(0);
      if (v.createdAt && v.createdAt.toDate) {
        safeTime = v.createdAt.toDate();
      }
      rows.push({
        id: d.id,
        ...v,
        when: safeTime
      });
    });
    rows.sort((a, b) => b.when - a.when);
    return rows;
  },

  deleteReading(id) {
    return deleteDoc(doc(db, 'readings', id));
  },

  /* ---------- Hộp thư thời gian ---------- */
  async saveLetter({ body, openAt, email }) {
    if (!auth.currentUser) throw new Error('chưa đăng nhập');
    const ref = await addDoc(collection(db, 'letters'), {
      userId: auth.currentUser.uid,
      email: email || auth.currentUser.email || '',
      body: body.slice(0, 5000),
      openAt: openAt,
      opened: false,
      createdAt: serverTimestamp()
    });
    return ref.id;
  },

  async myLetters() {
    if (!auth.currentUser) return [];
    const snap = await getDocs(
      query(collection(db, 'letters'), where('userId', '==', auth.currentUser.uid))
    );
    const rows = [];
    snap.forEach(d => rows.push({ id: d.id, ...d.data() }));
    rows.sort((a, b) => new Date(a.openAt) - new Date(b.openAt));
    return rows;
  },

  deleteLetter(id) {
    return deleteDoc(doc(db, 'letters', id));
  },

  /* ==========================================================
     Hồ sơ người dùng
     ========================================================== */
  profile: null,

  // Đã thay đổi email admin theo yêu cầu của bạn
  ADMIN_EMAILS: ['ngocduyprc2006@gmail.com'],

  async ensureProfile() {
    if (!auth.currentUser) return null;
    const email = auth.currentUser.email || '';
    const isBootstrapAdmin = Nody.ADMIN_EMAILS.includes(email.toLowerCase());
    const ref = doc(db, 'users', auth.currentUser.uid);
    const snap = await getDoc(ref);

    let finalRole = 'user';
    let finalPlan = 'free';

    if (isBootstrapAdmin) {
      finalRole = 'admin';
      finalPlan = 'pro';
    }

    if (!snap.exists()) {
      const data = {
        email,
        name: auth.currentUser.displayName || '',
        role: finalRole,
        plan: finalPlan,
        wallet: 0,
        createdAt: serverTimestamp()
      };
      await setDoc(ref, data);
      return { id: auth.currentUser.uid, ...data };
    }

    const data = snap.data();
    if (isBootstrapAdmin) {
      if (data.role !== 'admin' || data.plan !== 'pro') {
        await updateDoc(ref, { role: 'admin', plan: 'pro' });
        data.role = 'admin';
        data.plan = 'pro';
      }
    }
    if (data.plan === undefined) {
      data.plan = 'free';
    }
    return { id: snap.id, ...data };
  },

  async myProfile() {
    if (!auth.currentUser) return null;
    const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  },

  isAdmin() {
    if (Nody.profile && Nody.profile.role === 'admin') {
      return true;
    }
    return false;
  },

  async renameProfile(name) {
    if (!auth.currentUser) throw new Error('chưa đăng nhập');
    await updateDoc(doc(db, 'users', auth.currentUser.uid), { name });
  },

  /* ---------- Nạp tiền / gói thành viên ---------- */
  async requestTopup({ amount, method, note }) {
    if (!auth.currentUser) throw new Error('chưa đăng nhập');
    const ref = await addDoc(collection(db, 'topups'), {
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email || '',
      amount: Number(amount) || 0,
      method: method || 'bank',
      note: (note || '').slice(0, 300),
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return ref.id;
  },

  async myTopups() {
    if (!auth.currentUser) return [];
    const snap = await getDocs(query(collection(db, 'topups'), where('userId', '==', auth.currentUser.uid)));
    const rows = [];
    snap.forEach(d => rows.push({ id: d.id, ...d.data() }));

    rows.sort((a, b) => {
      let timeB = 0;
      if (b.createdAt && b.createdAt.toMillis) timeB = b.createdAt.toMillis();

      let timeA = 0;
      if (a.createdAt && a.createdAt.toMillis) timeA = a.createdAt.toMillis();

      return timeB - timeA;
    });
    return rows;
  },

  /* ==========================================================
     Vùng dành cho Admin
     ========================================================== */
  async adminListUsers() {
    const snap = await getDocs(collection(db, 'users'));
    const rows = [];
    snap.forEach(d => rows.push({ id: d.id, ...d.data() }));
    return rows;
  },

  async adminSetRole(uid, role) {
    await updateDoc(doc(db, 'users', uid), { role });
  },

  async adminSetPlan(uid, plan) {
    await updateDoc(doc(db, 'users', uid), { plan });
  },

  async adminListTopups() {
    const snap = await getDocs(collection(db, 'topups'));
    const rows = [];
    snap.forEach(d => rows.push({ id: d.id, ...d.data() }));

    rows.sort((a, b) => {
      let timeB = 0;
      if (b.createdAt && b.createdAt.toMillis) timeB = b.createdAt.toMillis();

      let timeA = 0;
      if (a.createdAt && a.createdAt.toMillis) timeA = a.createdAt.toMillis();

      return timeB - timeA;
    });
    return rows;
  },

  async adminApproveTopup(topup) {
    await updateDoc(doc(db, 'topups', topup.id), { status: 'approved', decidedAt: serverTimestamp() });
    const uref = doc(db, 'users', topup.userId);
    const usnap = await getDoc(uref);

    let cur = 0;
    if (usnap.exists()) {
      cur = usnap.data().wallet || 0;
    }

    await updateDoc(uref, { wallet: cur + (Number(topup.amount) || 0) });
  },

  async adminRejectTopup(id) {
    await updateDoc(doc(db, 'topups', id), { status: 'rejected', decidedAt: serverTimestamp() });
  },

  async adminListReadings() {
    const snap = await getDocs(collection(db, 'readings'));
    const rows = [];
    snap.forEach(d => rows.push({ id: d.id, ...d.data() }));

    rows.sort((a, b) => {
      let timeB = 0;
      if (b.createdAt && b.createdAt.toMillis) timeB = b.createdAt.toMillis();

      let timeA = 0;
      if (a.createdAt && a.createdAt.toMillis) timeA = a.createdAt.toMillis();

      return timeB - timeA;
    });
    return rows.slice(0, 200);
  },

  async adminListLetters() {
    const snap = await getDocs(collection(db, 'letters'));
    const rows = [];
    snap.forEach(d => rows.push({ id: d.id, ...d.data() }));
    return rows;
  }
};

/* ---------- Bắn tin cho phần còn lại của web ---------- */
function broadcast() {
  window.dispatchEvent(new CustomEvent('nody:auth', { detail: Nody.user }));
}

onAuthStateChanged(auth, async (user) => {
  Nody.user = user;
  Nody.loaded = true;
  Nody.profile = null;
  if (user) {
    try {
      Nody.profile = await Nody.ensureProfile();
    } catch (e) {
      console.warn('Không lấy được hồ sơ người dùng:', e);
    }
  }
  broadcast();
});

window.Nody = Nody;
window.dispatchEvent(new Event('nody:ready'));