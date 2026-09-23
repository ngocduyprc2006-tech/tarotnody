# Bảo mật cho Nody Tarot

Tài liệu này nói thật, không thổi phồng: **không có web nào "an toàn tuyệt đối"**,
kể cả web của các công ty lớn. Việc có thể làm là chặn hết các lỗ hổng phổ biến,
giới hạn thiệt hại nếu có sự cố, và không để lộ những thứ không nên lộ. Dưới đây
là những gì đã làm trong bản này, và những gì **bạn cần tự làm** (không ai làm
thay được vì cần quyền truy cập vào project Firebase thật của bạn).

## Đã làm trong code

### 1. `firestore.rules` — quan trọng nhất
File luật bảo mật cho database. Không có file này (hoặc để Firestore ở "chế độ thử
nghiệm"), **bất kỳ ai** mở DevTools (F12 → Console) trên trình duyệt của họ cũng có
thể gọi thẳng Firestore SDK để đọc/sửa dữ liệu của người khác — kể cả tự phong mình
làm admin, tự cộng tiền vào ví. Luật này chặn:
- Mỗi người chỉ đọc/xoá được lịch sử bói, thư tương lai **của chính mình**.
- Không ai tự đổi được `role` (vai trò) hay `wallet` (số dư ví) của chính mình —
  chỉ admin mới đổi được.
- Yêu cầu nạp tiền chỉ tạo được ở trạng thái `"pending"` (chờ duyệt), không tự tạo
  được đơn đã `"approved"`.
- Mọi collection khác không được khai báo rõ ràng đều bị **chặn hoàn toàn** theo
  mặc định (an toàn hơn là quên chặn một thứ gì đó).

**Bạn cần làm:** dán file này vào Firebase Console → Firestore Database → Rules →
Publish (xem hướng dẫn trong README.md). **Nếu chưa làm bước này, coi như dữ liệu
của web đang mở toang.**

### 2. `firebase.json` — các header bảo mật HTTP
Thêm các header chuẩn ngành cho mọi trang:
- `Content-Security-Policy` — giới hạn web chỉ được tải script/ảnh/font từ đúng các
  nguồn cần thiết (Firebase, Google Fonts, wsrv.nl, sacred-texts.com), chặn mọi
  nguồn lạ khác. Đây là lớp chống lại việc nếu có script độc hại bị chèn vào thì
  cũng khó gọi ra ngoài hoặc tải thêm mã độc.
- `X-Frame-Options: DENY` — không ai nhúng web của bạn vào iframe trên trang khác
  (chặn kiểu tấn công "clickjacking" — giả web của bạn để lừa người dùng bấm nhầm).
- `X-Content-Type-Options: nosniff` — trình duyệt không tự đoán sai loại file.
- `Referrer-Policy` — không rò rỉ đường link đầy đủ (có thể chứa thông tin) khi
  người dùng bấm ra trang ngoài.
- `Strict-Transport-Security` — luôn bắt buộc HTTPS, không cho quay lại HTTP.
- `Permissions-Policy` — chỉ cho phép Camera (dùng cho Photobooth), chặn hết
  micro/định vị/thanh toán mà web này không cần.

**Bạn cần làm:** nếu deploy bằng `firebase deploy`, các header này tự có hiệu lực
— không cần làm gì thêm.

### 3. Điều thật lòng cần nói về `unsafe-inline`
CSP ở trên có cho phép `'unsafe-inline'` cho script và style, vì code hiện tại dùng
khá nhiều `onclick="..."` viết thẳng trong HTML (một cách viết phổ biến, không sai,
nhưng khiến CSP không thể chặn 100% kiểu tấn công XSS nếu có lỗ hổng chèn HTML ở
đâu đó). Muốn siết chặt hơn nữa (bỏ hẳn `unsafe-inline`) cần viết lại các
`onclick=""` thành `addEventListener()` trong file `.js` — đây là việc làm được,
nhưng khá tốn công vì phải sửa ở rất nhiều nơi. Nếu bạn muốn, nói mình làm tiếp ở
một lượt sau, mình sẽ làm dần từng trang một.

## Bạn cần tự làm thêm (cần quyền truy cập Firebase Console của bạn)

Đây là những việc không có trong code mà chỉ bạn — người có quyền truy cập project
Firebase thật — mới bấm được:

1. **Dán `firestore.rules` vào Console** (xem trên) — việc quan trọng nhất, làm ngay.
2. **Bật App Check** (Firebase Console → App Check) — một lớp xác minh request thật
   sự đến từ web của bạn (chặn bot/script gọi thẳng API Firebase từ nơi khác dùng
   khoá config lấy được từ code công khai — khoá `apiKey` trong `firebase-init.js`
   vốn KHÔNG bí mật, ai xem "View source" cũng thấy được, đây là chuyện bình
   thường với web Firebase, App Check mới là lớp chặn thật).
3. **Giới hạn khoá API** (Google Cloud Console → APIs & Services → Credentials) —
   giới hạn khoá `apiKey` chỉ dùng được từ domain web của bạn (HTTP referrer),
   không dùng được nếu ai đó copy khoá sang web khác.
4. **Bật cảnh báo ngân sách** (Firebase Console → Usage and billing → Budget
   alerts) — để biết ngay nếu có ai spam request khiến chi phí tăng bất thường.
5. **Kiểm tra Authorized domains** (Authentication → Settings) — chỉ nên có đúng
   domain thật bạn deploy, xoá domain lạ nếu có.
6. **Không commit file cấu hình bí mật** — nếu sau này bạn thêm Cloud Functions có
   khoá API của bên thứ ba (ví dụ khoá AI, khoá thanh toán), khoá đó phải nằm ở
   biến môi trường của Function, **không bao giờ** để trong file JS chạy ở trình
   duyệt như `firebase-init.js` (khác với `apiKey` của Firebase, các khoá bí mật
   thật sự phải giấu ở backend).

## Danh sách không có trong phạm vi (và tại sao)

- Không thể "quét lỗ hổng" web thật của bạn từ đây vì mình không truy cập được vào
  domain đã deploy hay project Firebase thật của bạn.
- Không viết công cụ dò quét/khai thác lỗ hổng — việc đó nằm ngoài phạm vi hỗ trợ
  an toàn, kể cả khi mục đích là để tự kiểm tra web của chính bạn.
- "Bảo mật tuyệt đối" không tồn tại. Mục tiêu thực tế là: chặn các lỗi phổ biến
  nhất (thiếu Firestore Rules, thiếu header HTTP, XSS cơ bản), và giới hạn thiệt
  hại nếu có sự cố — không phải "không thể bị tấn công".
