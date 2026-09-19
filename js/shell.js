/* ============================================================
   shell.js — bộ khung dùng chung cho MỌI trang
   ------------------------------------------------------------
   Dựng thanh đầu trang, menu, chân trang, hộp đăng nhập, thông báo.
   Muốn thêm một trang mới vào menu: sửa mảng MENU bên dưới là xong.
   Đây là script thường (không phải module) nên chạy được cả khi
   mở bằng file:// — Firebase hỏng thì web vẫn dùng bình thường.
   ============================================================ */

(function () {
  'use strict';

  /* ==========================================================
     1. Danh mục — sửa ở đây là đổi menu toàn web
     ========================================================== */
  const MENU = [
    { href: 'tarot.html',      label: 'Trải bài Tarot' },
    { href: 'daily.html',      label: 'Lá bài hôm nay' },
    { href: 'numerology.html', label: 'Thần số học' },
    { href: 'horoscope.html',  label: 'Chiêm tinh' },
    { href: 'match.html',      label: 'Ghép đôi' },
    { href: 'dream.html',      label: 'Giải mã giấc mơ' },
    { href: 'wheel.html',      label: 'Vòng quay' },
    { href: 'letter.html',     label: 'Thư gửi mai sau' }
  ];

  /* ==========================================================
     2. Cún Nody — linh vật, vẽ bằng SVG nên không cần file ảnh
     ========================================================== */
  function pupSVG(cls) {
    const id = 'm' + Math.random().toString(36).slice(2, 7);
    return `
<svg class="pup ${cls || ''}" viewBox="0 0 64 64" role="img" aria-label="Cún Nody">
  <defs>
    <radialGradient id="${id}" cx="36%" cy="32%" r="70%">
      <stop offset="0%" stop-color="#fff6e2"/>
      <stop offset="60%" stop-color="var(--moon)"/>
      <stop offset="100%" stop-color="var(--moon-deep)"/>
    </radialGradient>
  </defs>
  <path d="M44 4a28 28 0 1 0 6 55 24 24 0 1 1-6-55z" fill="url(#${id})" opacity=".32"/>
  <g>
    <ellipse cx="16.5" cy="29" rx="6.6" ry="11.5" transform="rotate(-20 16.5 29)" fill="var(--moon-deep)"/>
    <ellipse cx="47.5" cy="29" rx="6.6" ry="11.5" transform="rotate(20 47.5 29)" fill="var(--moon-deep)"/>
    <circle cx="32" cy="32" r="16.5" fill="url(#${id})"/>
    <ellipse cx="32" cy="38.6" rx="9.6" ry="7.6" fill="#fff4e0" opacity=".92"/>
    <ellipse cx="32" cy="35.6" rx="3.1" ry="2.3" fill="#2e2140"/>
    <path d="M32 38v2.4M32 40.4c-1.5 2-4.4 1.6-5.2-.4M32 40.4c1.5 2 4.4 1.6 5.2-.4"
          stroke="#2e2140" stroke-width="1.25" fill="none" stroke-linecap="round"/>
    <circle cx="25.2" cy="29" r="2.5" fill="#2e2140"/>
    <circle cx="38.8" cy="29" r="2.5" fill="#2e2140"/>
    <circle cx="26" cy="28.2" r=".85" fill="#fff"/>
    <circle cx="39.6" cy="28.2" r=".85" fill="#fff"/>
    <path d="M32 17.2l1.5 3.1 3.4.5-2.5 2.4.6 3.4-3-1.6-3 1.6.6-3.4-2.5-2.4 3.4-.5z"
          fill="var(--blossom)" opacity=".95"/>
  </g>
</svg>`;
  }

  /* ==========================================================
     3. Ấn triện tròn — dùng cho lưng lá bài, mỗi hạt một hình
     ========================================================== */
  function sigil(seed, color) {
    const c = color || 'var(--moon)';
    let s = (seed * 2654435761) % 2147483647;
    if (s < 0) s += 2147483647;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;

    const pts = 5 + Math.floor(rnd() * 4);
    let d = '';
    for (let i = 0; i < pts * 2; i++) {
      const a = (Math.PI * 2 * i) / (pts * 2) - Math.PI / 2;
      const r = i % 2 === 0 ? 24 : 11;
      d += (i ? 'L' : 'M') + (32 + r * Math.cos(a)).toFixed(1) + ',' + (32 + r * Math.sin(a)).toFixed(1) + ' ';
    }
    d += 'Z';

    let rings = '';
    const n = 1 + Math.floor(rnd() * 2);
    for (let i = 0; i < n; i++) {
      rings += `<circle cx="32" cy="32" r="${28 - i * 8}" fill="none" stroke="${c}" stroke-width=".6" opacity="${0.5 - i * 0.16}"/>`;
    }
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${rings}
      <path d="${d}" fill="none" stroke="${c}" stroke-width="1.1" stroke-linejoin="round"/>
      <circle cx="32" cy="32" r="2.3" fill="${c}"/></svg>`;
  }

  /* ==========================================================
     4. Pha trăng — lớp "thời gian" của web
     ========================================================== */
  function moonPhase(date) {
    const d = date || new Date();
    // mốc trăng non 06/01/2000 18:14 UTC, chu kỳ 29.530588853 ngày
    const days = (d - new Date(Date.UTC(2000, 0, 6, 18, 14))) / 86400000;
    let age = days % 29.530588853;
    if (age < 0) age += 29.530588853;
    const frac = age / 29.530588853;

    const names = [
      ['Trăng non', 'Một khởi đầu vừa nhen. Hợp để đặt ý định, chưa cần vội làm.'],
      ['Trăng lưỡi liềm đầu', 'Ý định bắt đầu có hình. Ghi ra điều bạn muốn giữ.'],
      ['Trăng bán nguyệt đầu', 'Lúc phải chọn. Bỏ bớt một việc để việc còn lại thở được.'],
      ['Trăng khuyết đầu', 'Mọi thứ đang lớn dần. Kiên nhẫn thêm một nhịp nữa.'],
      ['Trăng tròn', 'Điều khuất bấy nay lộ rõ. Hợp để nhìn thẳng và nói thật.'],
      ['Trăng khuyết cuối', 'Đã đủ đầy, giờ là lúc chia lại và biết ơn.'],
      ['Trăng bán nguyệt cuối', 'Buông một điều đã hết duyên. Nhẹ hơn thì đi xa hơn.'],
      ['Trăng tàn', 'Khoảng lặng trước vòng mới. Nghỉ thật sự cũng là làm việc.']
    ];
    const idx = Math.floor(frac * 8 + 0.5) % 8;
    return { age, frac, name: names[idx][0], advice: names[idx][1], index: idx };
  }

  /* ==========================================================
     5. Giao diện sáng / tối (nhớ lựa chọn của bạn)
     ========================================================== */
  function applyTheme(mode) {
    document.body.classList.toggle('dawn', mode === 'dawn');
    const btn = document.getElementById('themeBtn');
    if (btn) {
      btn.textContent = mode === 'dawn' ? '🌙' : '☀️';
      btn.title = mode === 'dawn' ? 'Chuyển sang đêm' : 'Chuyển sang ban mai';
    }
    try { localStorage.setItem('nody.theme', mode); } catch (e) {}
    window.dispatchEvent(new CustomEvent('nody:theme', { detail: mode }));
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('nody.theme'); } catch (e) {}
    if (!saved) {
      const h = new Date().getHours();      // lần đầu ghé: tự chọn theo giờ thật
      saved = (h >= 6 && h < 18) ? 'dawn' : 'night';
    }
    applyTheme(saved);
  }

  /* ==========================================================
     6. Thông báo nhỏ
     ========================================================== */
  function toast(msg, isError) {
    let box = document.getElementById('toasts');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toasts';
      document.body.appendChild(box);
    }
    const t = document.createElement('div');
    t.className = 'toast' + (isError ? ' err' : '');
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity .3s, transform .3s';
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
      setTimeout(() => t.remove(), 320);
    }, 3200);
  }

  /* ==========================================================
     7. Dựng thanh đầu trang & chân trang
     ========================================================== */
  // Tên trang đang mở. Chấp nhận cả "/tarot" lẫn "/tarot.html" lẫn "/" .
  const here = (function () {
    let p = (location.pathname.split('/').pop() || '').toLowerCase();
    if (!p) return 'index.html';
    if (!p.endsWith('.html')) p += '.html';
    return p;
  })();

  function buildHeader() {
    const host = document.getElementById('site-head');
    if (!host) return;
    const m = moonPhase();

    host.className = 'site-head';
    host.innerHTML = `
      <div class="wrap head-row">
        <a class="brand" href="index.html">
          ${pupSVG()}
          <span class="brand-name">Nody <b>Tarot</b></span>
        </a>

        <button class="nav-toggle" id="navToggle" aria-label="Mở danh mục" aria-expanded="false">☰</button>

        <nav class="nav" id="nav">
          ${MENU.map(i => `<a href="${i.href}"${i.href.toLowerCase() === here ? ' class="on"' : ''}>${i.label}</a>`).join('')}
        </nav>

        <div class="head-tools">
          <button class="icon-btn" id="themeBtn" title="Đổi giao diện">☀️</button>
          <button class="acct-btn" id="acctBtn">
            <span class="avatar" id="acctAvatar">?</span>
            <span id="acctText">Đăng nhập</span>
          </button>
        </div>
      </div>

      <div class="moon-strip">
        <span>Hôm nay <b>${new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}</b></span>
        <i class="dot"></i>
        <span>${moonGlyph(m.index)} <b>${m.name}</b></span>
        <i class="dot"></i>
        <span class="mute">${m.advice}</span>
      </div>`;

    document.getElementById('navToggle').onclick = (e) => {
      const nav = document.getElementById('nav');
      const open = nav.classList.toggle('open');
      e.currentTarget.setAttribute('aria-expanded', open);
      e.currentTarget.textContent = open ? '✕' : '☰';
    };

    document.getElementById('themeBtn').onclick = () => {
      applyTheme(document.body.classList.contains('dawn') ? 'night' : 'dawn');
    };

    document.getElementById('acctBtn').onclick = () => {
      if (window.Nody && window.Nody.user) location.href = 'history.html';
      else openAuth('login');
    };
  }

  function moonGlyph(i) {
    return ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'][i] || '🌙';
  }

  function buildFooter() {
    const host = document.getElementById('site-foot');
    if (!host) return;
    host.className = 'site-foot';
    host.innerHTML = `
      <div class="wrap foot-grid">
        <div>
          <a class="brand" href="index.html">${pupSVG()}<span class="brand-name">Nody <b>Tarot</b></span></a>
          <p class="soft" style="font-size:.9rem;margin-top:14px;max-width:34ch">
            Một góc nhỏ để bạn ngồi xuống, thở một nhịp và tự hỏi mình đang cần gì.
            Cún Nody luận giải dịu dàng, không doạ ai bao giờ.
          </p>
        </div>
        <div>
          <h4>Bói bài &amp; con số</h4>
          <div class="foot-links">
            <a href="tarot.html">Trải bài Tarot</a>
            <a href="daily.html">Lá bài hôm nay</a>
            <a href="numerology.html">Thần số học</a>
            <a href="horoscope.html">Chiêm tinh</a>
            <a href="match.html">Ghép đôi</a>
          </div>
        </div>
        <div>
          <h4>Nhẹ nhàng hơn</h4>
          <div class="foot-links">
            <a href="dream.html">Giải mã giấc mơ</a>
            <a href="wheel.html">Vòng quay Cún Nody</a>
            <a href="letter.html">Thư gửi mai sau</a>
            <a href="history.html">Lịch sử &amp; hồ sơ</a>
          </div>
        </div>
      </div>
      <div class="wrap foot-note">
        <span>© ${new Date().getFullYear()} Nody Tarot</span>
        <span>Tarot là tấm gương soi, không phải bản án. Quyết định luôn là của bạn.</span>
      </div>`;
  }

  /* ==========================================================
     8. Hộp đăng nhập / đăng ký
     ========================================================== */
  function buildAuthModal() {
    if (document.getElementById('authModal')) return;
    const el = document.createElement('div');
    el.className = 'modal';
    el.id = 'authModal';
    el.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true" aria-label="Đăng nhập">
        <button class="modal-x" data-close>✕</button>

        <div class="auth-head">
          ${pupSVG()}
          <h3 id="authTitle">Chào bạn trở lại</h3>
          <p id="authSub">Đăng nhập để Cún giữ giúp bạn mọi lá bài đã rút.</p>
        </div>

        <div class="auth-tabs">
          <button id="tabLogin" class="on" data-tab="login">Đăng nhập</button>
          <button id="tabReg" data-tab="reg">Đăng ký</button>
        </div>

        <div class="auth-pane on" id="paneLogin">
          <div class="field"><label for="liMail">Email</label>
            <input class="input" type="email" id="liMail" autocomplete="email" placeholder="ban@email.com"></div>
          <div class="field"><label for="liPass">Mật khẩu</label>
            <input class="input" type="password" id="liPass" autocomplete="current-password" placeholder="••••••"></div>
          <div style="text-align:right;margin:-6px 0 14px">
            <button class="link-btn tiny" id="btnForgot">Quên mật khẩu?</button>
          </div>
          <button class="btn btn-moon btn-block" id="btnDoLogin">Vào không gian của bạn</button>
        </div>

        <div class="auth-pane" id="paneReg">
          <div class="field"><label for="rgName">Bạn muốn Cún gọi bạn là gì?</label>
            <input class="input" type="text" id="rgName" autocomplete="name" placeholder="Tên hiển thị"></div>
          <div class="field"><label for="rgMail">Email</label>
            <input class="input" type="email" id="rgMail" autocomplete="email" placeholder="ban@email.com"></div>
          <div class="field"><label for="rgPass">Mật khẩu</label>
            <input class="input" type="password" id="rgPass" autocomplete="new-password" placeholder="Ít nhất 6 ký tự"></div>
          <button class="btn btn-moon btn-block" id="btnDoReg">Tạo tài khoản</button>
        </div>

        <div class="divider"><span>hoặc</span></div>

        <button class="btn btn-ghost google-btn" id="btnGoogle">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Tiếp tục với Google
        </button>

        <div class="auth-msg" id="authMsg"></div>
        <div class="auth-foot" id="authOffline"></div>
      </div>`;
    document.body.appendChild(el);

    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.hasAttribute('data-close')) closeAuth();
    });

    el.querySelectorAll('[data-tab]').forEach(b => {
      b.onclick = () => switchTab(b.dataset.tab);
    });

    document.getElementById('btnDoLogin').onclick = doLogin;
    document.getElementById('btnDoReg').onclick = doRegister;
    document.getElementById('btnGoogle').onclick = doGoogle;
    document.getElementById('btnForgot').onclick = doForgot;

    // Enter để gửi
    ['liPass', 'liMail'].forEach(id =>
      document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); }));
    ['rgPass', 'rgMail', 'rgName'].forEach(id =>
      document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') doRegister(); }));
  }

  function switchTab(tab) {
    document.getElementById('tabLogin').classList.toggle('on', tab === 'login');
    document.getElementById('tabReg').classList.toggle('on', tab === 'reg');
    document.getElementById('paneLogin').classList.toggle('on', tab === 'login');
    document.getElementById('paneReg').classList.toggle('on', tab === 'reg');
    document.getElementById('authTitle').textContent =
      tab === 'login' ? 'Chào bạn trở lại' : 'Tạo một góc riêng';
    document.getElementById('authSub').textContent =
      tab === 'login'
        ? 'Đăng nhập để Cún giữ giúp bạn mọi lá bài đã rút.'
        : 'Có tài khoản rồi thì lịch sử xem bói sẽ theo bạn qua mọi thiết bị.';
    msg('');
  }

  function msg(text, type) {
    const el = document.getElementById('authMsg');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'auth-msg' + (type ? ' ' + type : '');
  }

  function openAuth(tab) {
    buildAuthModal();
    switchTab(tab || 'login');
    document.getElementById('authModal').classList.add('open');
    const note = document.getElementById('authOffline');
    if (!window.Nody) {
      note.innerHTML = 'Chưa kết nối được Firebase. Nếu bạn đang mở web bằng cách nháy đúp vào file, ' +
        'hãy chạy <b>firebase serve</b> hoặc mở qua địa chỉ http:// để đăng nhập được.';
    } else { note.textContent = ''; }
    setTimeout(() => {
      const f = document.getElementById(tab === 'reg' ? 'rgName' : 'liMail');
      if (f && window.innerWidth > 760) f.focus();
    }, 220);
  }

  function closeAuth() {
    const el = document.getElementById('authModal');
    if (el) el.classList.remove('open');
    msg('');
  }

  function needFirebase() {
    if (!window.Nody) {
      msg('Chưa kết nối được Firebase. Bạn mở web qua http:// giúp mình nhé.', 'err');
      return false;
    }
    return true;
  }

  async function doLogin() {
    if (!needFirebase()) return;
    const mail = document.getElementById('liMail').value.trim();
    const pass = document.getElementById('liPass').value;
    if (!mail || !pass) return msg('Bạn nhập email và mật khẩu giúp mình nhé.', 'err');
    msg('Đang mở cửa…');
    try {
      await window.Nody.login(mail, pass);
      closeAuth();
      toast('Chào bạn trở lại 🌙');
    } catch (e) { msg(window.Nody.readError(e), 'err'); }
  }

  async function doRegister() {
    if (!needFirebase()) return;
    const name = document.getElementById('rgName').value.trim();
    const mail = document.getElementById('rgMail').value.trim();
    const pass = document.getElementById('rgPass').value;
    if (!name || !mail || !pass) return msg('Còn thiếu một ô chưa điền.', 'err');
    if (pass.length < 6) return msg('Mật khẩu cần ít nhất 6 ký tự.', 'err');
    msg('Đang tạo tài khoản…');
    try {
      await window.Nody.register(name, mail, pass);
      closeAuth();
      toast('Xong rồi, chào ' + name + ' 🐾');
    } catch (e) { msg(window.Nody.readError(e), 'err'); }
  }

  async function doGoogle() {
    if (!needFirebase()) return;
    msg('Đang mở cửa sổ Google…');
    try {
      await window.Nody.loginGoogle();
      closeAuth();
      toast('Đăng nhập xong 🌙');
    } catch (e) { msg(window.Nody.readError(e), 'err'); }
  }

  async function doForgot() {
    if (!needFirebase()) return;
    const mail = document.getElementById('liMail').value.trim();
    if (!mail) return msg('Nhập email vào ô trên rồi bấm lại giúp mình.', 'err');
    try {
      await window.Nody.resetPassword(mail);
      msg('Đã gửi link đặt lại mật khẩu vào email của bạn.', 'ok');
    } catch (e) { msg(window.Nody.readError(e), 'err'); }
  }

  /* ==========================================================
     9. Cập nhật nút tài khoản khi trạng thái đăng nhập đổi
     ========================================================== */
  function paintAccount(user) {
    const txt = document.getElementById('acctText');
    const av  = document.getElementById('acctAvatar');
    if (!txt || !av) return;
    if (user) {
      const name = user.displayName || (user.email || '').split('@')[0] || 'Bạn';
      txt.textContent = name;
      av.textContent = name.trim().charAt(0).toUpperCase();
      av.style.background = 'linear-gradient(140deg, var(--moon), var(--blossom))';
    } else {
      txt.textContent = 'Đăng nhập';
      av.textContent = '🐾';
      av.style.background = 'transparent';
    }
    document.body.classList.toggle('signed-in', !!user);
  }

  /* ==========================================================
     10. Khởi động
     ========================================================== */
  function boot() {
    initTheme();
    buildHeader();
    buildFooter();
    applyTheme(document.body.classList.contains('dawn') ? 'dawn' : 'night');
    paintAccount(window.Nody && window.Nody.user);

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
    });
  }

  window.addEventListener('nody:auth', (e) => paintAccount(e.detail));

  /* ---------- Xuất ra cho các file khác dùng ---------- */
  window.Shell = {
    pupSVG, sigil, moonPhase, moonGlyph,
    toast, openAuth, closeAuth, applyTheme,
    menu: MENU,

    /* Yêu cầu đăng nhập; trả về true nếu đã đăng nhập */
    requireLogin(why) {
      if (window.Nody && window.Nody.user) return true;
      toast(why || 'Bạn đăng nhập trước nhé, để Cún giữ giúp kết quả.', true);
      openAuth('login');
      return false;
    },

    /* Lưu một lượt xem — im lặng bỏ qua nếu chưa đăng nhập */
    async log(data) {
      if (!window.Nody || !window.Nody.user) return;
      try { await window.Nody.saveReading(data); } catch (e) { console.warn('Không lưu được:', e); }
    },

    /* Bộ sinh số ngẫu nhiên có hạt giống — cùng hạt thì cùng kết quả */
    seeded(seedStr) {
      let h = 2166136261;
      for (let i = 0; i < seedStr.length; i++) {
        h ^= seedStr.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      let s = h >>> 0;
      return function () {
        s ^= s << 13; s >>>= 0;
        s ^= s >> 17;
        s ^= s << 5;  s >>>= 0;
        return s / 4294967296;
      };
    },

    /* Xáo mảng tại chỗ */
    shuffle(arr, rnd) {
      const r = rnd || Math.random;
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    /* Ngày dạng 2026-09-19 */
    today() {
      const d = new Date();
      return d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
    },

    /* Lưu tạm trên máy, an toàn cả khi trình duyệt chặn */
    store: {
      get(k, fallback) {
        try { const v = localStorage.getItem('nody.' + k); return v === null ? fallback : JSON.parse(v); }
        catch (e) { return fallback; }
      },
      set(k, v) {
        try { localStorage.setItem('nody.' + k, JSON.stringify(v)); } catch (e) {}
      }
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
