# Nody Tarot 🐾

Web xem bói online cho dự án Firebase **nodytarot** — trải bài Tarot, lá bài hôm nay,
thần số học, chiêm tinh, ghép đôi, giải mã giấc mơ, vòng quay may mắn, thư gửi mai sau,
**photobooth**, **ví & gói thành viên**, **trang quản trị**, và giờ có thêm **5 ngôn ngữ**
(Việt / Anh / Trung / Hàn / Nhật), **trợ lý Nody AI**, **nút hỗ trợ nổi kéo-thả được**.
Linh vật là Nody. Có đăng nhập/đăng ký và lưu lịch sử qua Firebase.

---

## 🆕 Bản cập nhật lần này — làm gì, còn thiếu gì (đọc phần này trước)

Mình đã làm thật, chạy được ngay hôm nay, **không cần thêm khoá API hay tài khoản
doanh nghiệp nào**:

1. **Đa ngôn ngữ 5 thứ tiếng** — nút cờ quốc gia ở đầu trang, đổi là dịch toàn bộ
   giao diện (menu, nút, form, trang quản trị, ví...) **và cả 78 lá bài** (tên, từ khoá,
   nghĩa xuôi/ngược). Bản tiếng Việt gốc giữ nguyên 100%, đầy đủ nhất. Bản Anh dịch sát
   nghĩa đầy đủ. Bản Trung/Hàn/Nhật được viết **súc tích hơn** bản Việt để chất lượng đều
   nhau ở lần bàn giao đầu — xem mục "Mở rộng bản dịch" bên dưới nếu muốn viết dài hơn.
2. **Giao diện "8D"** — nền cực quang chuyển động, hiệu ứng kính mờ (glass), nghiêng 3D
   khi rê chuột qua lá bài, giữ nguyên hiệu ứng lật bài 3D gốc của bạn.
3. **Đồng bộ PC / laptop / điện thoại + tự chống giật lag** — chữ co giãn mượt (`clamp()`),
   có đệm an toàn cho điện thoại tai thỏ/thanh cử chỉ (`env(safe-area-inset-*)`), phông chữ
   có chuỗi dự phòng riêng cho Windows/Mac/Android/iOS lẫn tiếng Trung/Hàn/Nhật. File mới
   `js/perf.js` chạy đầu tiên trên mọi trang, tự đoán máy yếu/khoẻ rồi **đo FPS thật** trong
   ~1.2 giây đầu để tự hạ hiệu ứng nếu máy đuối hơn dự đoán — xem thêm mục 9 bên dưới.
4. **Nút hỗ trợ nổi 🐾** — kéo-thả đặt ở bất kỳ đâu (nhớ vị trí qua `localStorage`), bấm
   vào mở bảng hướng dẫn dùng web đầy đủ, dịch theo ngôn ngữ đang chọn.
5. **Trợ lý Nody AI** — khung chat 💬 ở góc màn hình, trả lời theo luật (không cần server,
   luôn chạy được). Đây **chưa phải** mô hình AI thật như ChatGPT/Claude — xem phần
   "Nâng lên AI thật" bên dưới nếu bạn muốn bước tiếp.
6. **Photobooth** — bật camera, chọn khung viền, chụp, tự vẽ lá bài vừa rút gần nhất làm
   nhãn dán + logo Nody, tải ảnh PNG về máy. Chạy hoàn toàn ở trình duyệt.
7. **Ví & Nạp tiền (`wallet.html`)** — 3 gói (Free / Plus / VIP), form gửi yêu cầu nạp
   theo kiểu **chuyển khoản tay + admin duyệt** (an toàn, không cần tích hợp cổng thanh
   toán thật), lịch sử nạp tiền theo từng người dùng.
8. **Trang Quản trị (`admin.html`)** — chỉ tài khoản có `role: "admin"` trong Firestore
   mới vào được: tab **Tổng quan** (số người dùng, tổng số dư ví, số yêu cầu nạp đang chờ,
   tổng lượt xem bói), danh sách người dùng (cấp/thu hồi quyền admin ngay trên web — có nút
   ⚙️ xuất hiện ở đầu trang khi tài khoản đang đăng nhập là admin), duyệt/từ chối nạp tiền,
   xem lượt xem bói & thư gửi mai sau.
9. **Nút bật/tắt hiệu ứng ✨** ở đầu trang — bấm để chuyển giữa Tự động → Bật → Tắt. Máy
   yếu vẫn có thể ép "Bật" nếu muốn xem đủ hiệu ứng (chấp nhận có thể hơi giật), máy khoẻ
   vẫn có thể ép "Tắt" để tiết kiệm pin. Lựa chọn được nhớ riêng theo từng máy.
10. **Cờ ngôn ngữ hình tròn** — bộ chọn ngôn ngữ giờ hiện quốc kỳ dạng huy hiệu tròn (lấy từ
    flagcdn.com, tự rơi về emoji cờ nếu không có mạng) thay vì chỉ chữ.
11. **Photobooth có bộ lọc màu** kiểu app chụp ảnh hiện đại: Gốc / Vintage / Đen trắng / Ấm /
    Lạnh / Mộng mơ / Neon — xem trước trực tiếp trên camera và được "nướng" luôn vào ảnh tải
    về, cộng thêm tuỳ chọn đếm ngược 3 giây trước khi chụp.
12. **Lật bài "5D/8D"** — khi mở một lá bài (ở bàn trải Tarot và Lá bài hôm nay), lá bài giờ
    xoay ảo diệu hơn: nghiêng nhẹ theo trục Z, phát sáng theo màu chủ đạo, có một vệt sáng
    lướt qua mặt bài lúc lật xong — tự tắt trên máy yếu hoặc khi hiệu ứng đang ở chế độ Tắt.

### Còn thiếu — cần bạn quyết định trước khi làm tiếp

- **Cổng thanh toán thật (Momo/VNPay/ZaloPay/Stripe)**: cần bạn đăng ký tài khoản merchant
  và có backend (Cloud Functions) giữ khoá bí mật — web tĩnh (Firebase Hosting) không tự
  làm được việc này một cách an toàn. Bản hiện tại dùng "chuyển khoản tay + admin duyệt"
  để bạn thương mại hoá được ngay hôm nay, và có thể thay bằng cổng thật sau mà không đổi
  luồng dữ liệu.
- **Trợ lý AI thật (Claude/GPT)**: cần gọi API từ Cloud Functions (không gọi thẳng từ
  trình duyệt vì sẽ lộ khoá bí mật), tức là cần gói Firebase **Blaze**. Khi bạn sẵn sàng,
  chỉ cần thêm một Cloud Function nhỏ nhận câu hỏi → gọi API → trả lời, rồi đổi hàm
  `answerAssistant()` trong `js/shell.js` để gọi function đó thay vì trả lời theo luật.
- **Firestore Security Rules cho các collection mới** (`users`, `topups`) — xem ngay
  bên dưới, cần bật trước khi công khai web thật.

---

## Cấu trúc thư mục

```
Tarot/
├── index.html            trang chủ
├── tarot.html             trải bài Tarot (4 bước)
├── daily.html              lá bài hôm nay
├── numerology.html          thần số học
├── horoscope.html            chiêm tinh
├── match.html                  ghép đôi
├── dream.html                    giải mã giấc mơ
├── wheel.html                     vòng quay Nody
├── letter.html                     thư gửi mai sau
├── photobooth.html                   🆕 chụp ảnh cùng lá bài
├── wallet.html                         🆕 ví, gói thành viên, nạp tiền
├── admin.html                            🆕 trang quản trị (chỉ admin)
├── history.html                            hồ sơ & lịch sử
├── 404.html                                  trang lỗi
├── firebase.json
├── .firebaserc
├── css/
│   ├── tokens.css        màu sắc, phông chữ, biến CSS — SỬA MÀU Ở ĐÂY
│   ├── scene.css         nền trời 3D (sao, cực quang, cánh hoa)
│   ├── shell.css         header, footer, hộp đăng nhập, toast
│   ├── components.css    nút, ô nhập, thẻ, panel dùng chung
│   ├── tarot.css         bộ bài 3D, bàn trải, vòng quay
│   ├── pages.css         phần riêng từng trang (hero, moon-panel...)
│   └── upgrade.css       🆕 hiệu ứng "8D", responsive, đa ngôn ngữ, ví/admin/photobooth
└── js/
    ├── perf.js            🆕 tự nhận biết máy yếu/khoẻ + nút bật/tắt hiệu ứng ✨
    ├── i18n.js            🆕 bộ máy đa ngôn ngữ — bảng dịch giao diện nằm ở đây
    ├── firebase-init.js  DUY NHẤT nói chuyện với Firebase — đừng sửa config
    ├── shell.js           header/footer/đăng nhập/nút hỗ trợ/trợ lý AI dùng chung mọi trang
    ├── scene.js            hiệu ứng nền 3D + nghiêng theo chuột
    ├── home.js / tarot.js / daily.js / numerology.js / horoscope.js /
    │   match.js / dream.js / wheel.js / letter.js / history.js
    │                        — mỗi trang một file, độc lập với nhau
    ├── wallet.js          🆕 trang Ví & Nạp tiền
    ├── admin.js           🆕 trang Quản trị
    ├── photobooth.js      🆕 camera + khung + tải ảnh
    └── data/
        ├── deck.js           78 lá bài + lời giải tiếng Việt (KHÔNG đổi, vẫn là gốc)
        ├── deck-i18n.js    🆕 lớp dịch 78 lá bài sang EN/ZH/KO/JA
        ├── deck-localize.js 🆕 dán bản dịch vào deck.js lúc chạy, không sửa file gốc
        ├── spreads.js        6 kiểu trải bài + chủ đề
        ├── lore.js           cung hoàng đạo + thần số học
        └── dreams.js         từ điển biểu tượng giấc mơ
```

Mỗi file làm đúng một việc. Muốn sửa gì thì vào đúng file đó, không phải lục cả web.

## Chạy thử trên máy

Firebase Authentication (đăng nhập Google, email...) **không chạy được** nếu mở file
bằng cách nháy đúp (`file://`). Bạn cần một máy chủ nhỏ:

```bash
cd Tarot
python3 -m http.server 8080
# rồi mở http://localhost:8080
```

Hoặc nếu đã cài Firebase CLI:

```bash
firebase serve
```

## Triển khai lên Firebase Hosting

```bash
cd Tarot
firebase deploy --only hosting
```

`.firebaserc` đã trỏ sẵn tới dự án `nodytarot`, không cần cấu hình lại.

## Firebase — collection cũ giữ nguyên, có thêm 2 collection mới

Cấu hình trong `js/firebase-init.js` giữ nguyên y hệt bản cũ của bạn (`apiKey`,
`authDomain`, `projectId`...). Collection `readings` và `letters` giữ nguyên tên và
nguyên các trường cũ — dữ liệu bạn đã lưu từ trước vẫn đọc được bình thường.

Có thêm hai collection mới:

- **`users/{uid}`** — tự tạo lúc đăng nhập lần đầu, gồm `email`, `name`, `role`
  (`"user"` hoặc `"admin"`), `wallet` (số dư, đơn vị đồng).
- **`topups/{id}`** — mỗi lần người dùng gửi yêu cầu nạp tiền ở trang Ví, gồm
  `userId`, `userEmail`, `amount`, `method`, `note`, `status`
  (`"pending"` / `"approved"` / `"rejected"`), `createdAt`.

### 🔑 Cách cấp quyền admin cho chính bạn (làm 1 lần)

1. Đăng nhập vào web bằng tài khoản bạn muốn làm admin — việc này tự tạo doc trong
   `users/{uid}`.
2. Vào **Firebase Console → Firestore Database → users** → tìm đúng doc theo email →
   sửa trường `role` từ `"user"` thành `"admin"`.
3. Tải lại web, đăng nhập lại, vào `admin.html` — từ giờ có thể cấp/thu hồi quyền admin
   cho người khác ngay trên trang Quản trị mà không cần vào Console nữa.

### Luật Firestore cần có (bắt buộc trước khi công khai web thật)

Luật đầy đủ giờ nằm sẵn trong file **`firestore.rules`** ở thư mục gốc (không cần
gõ lại tay). Hai cách dùng:

**Cách 1 — dán tay (nhanh nhất):** mở file `firestore.rules`, copy toàn bộ, dán vào
Firebase Console → Firestore Database → Rules → **Publish**.

**Cách 2 — deploy bằng Firebase CLI:**
```bash
firebase deploy --only firestore:rules
```
(file `firebase.json` đã trỏ sẵn tới `firestore.rules`, không cần cấu hình thêm)

Nội dung rules để làm gì — xem lại bên dưới nếu muốn hiểu, còn không thì cứ dán là được:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() { return request.auth != null; }
    function isAdmin() {
      return signedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /readings/{docId} {
      allow read, delete: if signedIn() && request.auth.uid == resource.data.userId;
      allow create: if signedIn() && request.auth.uid == request.resource.data.userId;
      allow read: if isAdmin();
    }

    match /letters/{docId} {
      allow read, delete: if signedIn() && request.auth.uid == resource.data.userId;
      allow create: if signedIn() && request.auth.uid == request.resource.data.userId;
      allow read: if isAdmin();
    }

    match /users/{uid} {
      allow read: if signedIn() && (request.auth.uid == uid || isAdmin());
      allow create: if signedIn() && request.auth.uid == uid;
      // Người dùng thường được sửa hồ sơ của mình nhưng KHÔNG được tự đổi role/wallet;
      // chỉ admin mới đổi được hai trường đó (chặn tự phong admin cho chính mình).
      allow update: if isAdmin() ||
        (signedIn() && request.auth.uid == uid &&
         request.resource.data.role == resource.data.role &&
         request.resource.data.wallet == resource.data.wallet);
    }

    match /topups/{docId} {
      allow create: if signedIn() && request.auth.uid == request.resource.data.userId;
      allow read: if signedIn() && (request.auth.uid == resource.data.userId || isAdmin());
      allow update: if isAdmin();
    }
  }
}
```

Luật này để: mỗi người chỉ đọc/xoá được đúng dữ liệu của mình; không ai tự phong admin
hay tự cộng tiền vào ví của chính mình; chỉ admin mới duyệt được yêu cầu nạp tiền.

### Nếu dùng Google đăng nhập trên domain mới

Vào Firebase Console → Authentication → Settings → Authorized domains,
thêm domain bạn deploy lên (ví dụ `nodytarot.web.app` đã có sẵn, nhưng nếu
gắn domain riêng thì cần thêm domain đó vào).

## Mở rộng bản dịch (thêm chữ, viết dài hơn cho ZH/KO/JA...)

- **Chữ giao diện** (menu, nút, form...): sửa object `STRINGS` trong `js/i18n.js`. Mỗi
  khoá có đủ 5 ngôn ngữ `{vi, en, zh, ko, ja}`. Thêm khoá mới thì dùng
  `data-i18n="khoa.moi"` trong HTML hoặc `I18N.t('khoa.moi')` trong JS.
- **Lời giải 78 lá bài**: sửa `js/data/deck-i18n.js`. Cấu trúc theo `major[số thứ tự]`
  (0 = The Fool … 21 = The World) và `minor[chất][hạng-1]` (`wands/cups/swords/pentacles`,
  hạng 1 = Ace … 14 = King). Không cần đụng `deck.js` gốc.
- Ngôn ngữ trình duyệt lần đầu ghé được tự nhận diện; sau đó nhớ theo lựa chọn của người
  dùng qua `localStorage` (`nody.lang`).

## Nâng "Trợ lý Nody AI" lên AI thật (Claude/GPT)

Trợ lý hiện tại (`answerAssistant()` trong `js/shell.js`) trả lời theo luật cố định —
luôn chạy được, không cần khoá API. Muốn nối vào một mô hình AI thật:

1. Bật gói **Blaze** cho dự án Firebase (trả phí theo dùng, có hạn mức miễn phí rộng).
2. Viết một Cloud Function (Node.js) nhận câu hỏi, gọi API Claude/GPT bằng khoá bí mật
   lưu ở biến môi trường của Function (không lưu khoá ở phía trình duyệt).
3. Trong `js/shell.js`, đổi hàm `answerAssistant(q)` thành gọi `fetch()` tới Function đó
   thay vì tra `ASSIST_RULES`.

## Nâng "Ví & Nạp tiền" lên cổng thanh toán thật

1. Đăng ký tài khoản merchant với Momo/VNPay/ZaloPay (Việt Nam) hoặc Stripe (quốc tế).
2. Cổng nào cũng cần một backend (Cloud Functions) để tạo đơn hàng và xác thực webhook
   thanh toán — không thể làm an toàn chỉ bằng JavaScript phía trình duyệt.
3. Khi thanh toán thành công, Cloud Function tự cộng `wallet` trong `users/{uid}` và ghi
   một dòng `topups` với `status: "approved"` — luồng dữ liệu y hệt bản hiện tại, chỉ khác
   là tự động thay vì admin duyệt tay.

## Muốn sửa gì thì sửa ở đâu

| Muốn đổi | Sửa file |
|---|---|
| Màu sắc, phông chữ | `css/tokens.css` |
| Hiệu ứng thị giác, responsive, phông đa ngôn ngữ | `css/upgrade.css` |
| Chữ giao diện theo 5 ngôn ngữ | `js/i18n.js` |
| Lời giải 78 lá bài (tiếng Việt) | `js/data/deck.js` |
| Lời giải 78 lá bài (EN/ZH/KO/JA) | `js/data/deck-i18n.js` |
| Thêm/sửa kiểu trải bài | `js/data/spreads.js` |
| Lời luận thần số học, chiêm tinh | `js/data/lore.js` |
| Từ điển giấc mơ | `js/data/dreams.js` |
| Menu đầu trang | mảng `MENU` đầu file `js/shell.js` |
| Nội dung bảng hướng dẫn (nút 🐾) | khoá `help.section.*` trong `js/i18n.js` |
| Câu trả lời của trợ lý AI | `ASSIST_RULES` + khoá `assist.*` trong `js/shell.js` / `js/i18n.js` |
| Gói giá / tính năng ví | `wallet.html` + `js/wallet.js` |
| Ngưỡng máy yếu/khoẻ, nút bật/tắt hiệu ứng | `js/perf.js` |
| Bộ lọc màu / khung ảnh Photobooth | `js/photobooth.js` (object `FILTER_CSS`) |
| Hiệu ứng lật bài "5D/8D" | `css/upgrade.css`, mục "Lật bài 5D/8D" |
| Chữ ở trang chủ | `index.html` |
| Linh vật Nody | hàm `pupSVG()` trong `js/shell.js` |

## Ghi chú về ảnh lá bài

Ảnh dùng bộ Rider–Waite–Smith (đã hết hạn bản quyền từ lâu), tải qua
`https://wsrv.nl/?url=sacred-texts.com/...` để nhanh và nhẹ, có link dự
phòng thẳng tới `sacred-texts.com` nếu proxy lỗi. Đây đúng là nguồn ảnh bản
gốc của bạn đã dùng, không đổi gì. Nếu bạn có bộ ảnh lá bài riêng, sửa
hai trường `img` và `img2` trong `js/data/deck.js`.

## Tính năng theo trang

- **Trang chủ** — pha trăng hôm nay, lá bài gợi mở, lưới công cụ, cảm nhận người dùng, FAQ
- **Trải bài Tarot** — chọn chủ đề → chọn 1 trong 6 kiểu trải → xáo & rút trên nan quạt 3D →
  bàn trải 3D lật từng lá → bản luận giải tổng dệt các lá lại thành một mạch
- **Lá bài hôm nay** — một lá cố định theo ngày, đếm chuỗi ngày ghé liên tiếp
- **Thần số học** — 5 chỉ số (đường đời, linh hồn, nhân cách, sứ mệnh, ngày sinh) + năm cá nhân
- **Chiêm tinh** — tra cung từ ngày sinh, ghép với pha trăng ra bản đọc trong ngày
- **Ghép đôi** — điểm hợp từ ba lớp: hành của cung, số đường đời, duyên tên gọi
- **Giải mã giấc mơ** — dò 23 biểu tượng thường gặp + 1 lá bài gợi ý
- **Vòng quay Nody** — một lượt miễn phí mỗi ngày
- **Thư gửi mai sau** — viết thư hẹn ngày mở, lưu trên Firestore
- **Photobooth** — chụp ảnh cùng lá bài vừa rút, chọn khung, tải PNG về máy
- **Ví & Nạp tiền** — xem gói, gửi yêu cầu nạp (chuyển khoản tay), lịch sử nạp tiền
- **Quản trị** (chỉ admin) — quản lý người dùng/quyền, duyệt nạp tiền, xem lượt xem bói & thư
- **Hồ sơ & lịch sử** — xem lại mọi lượt đã lưu, lọc theo loại, đổi tên, đăng xuất

Mọi trang đều dùng chung nền trời 3D và thanh đầu/chân trang từ `js/shell.js` và
`js/scene.js`, nên thêm một trang mới chỉ cần copy khung HTML của một trang có sẵn
rồi đổi phần `<main>`.
