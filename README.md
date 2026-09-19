# Nody Tarot 🐾

Web xem bói online cho dự án Firebase **nodytarot** — trải bài Tarot, lá bài hôm nay,
thần số học, chiêm tinh, ghép đôi, giải mã giấc mơ, vòng quay may mắn và thư gửi mai sau.
Linh vật là Cún Nody. Có đăng nhập/đăng ký và lưu lịch sử qua Firebase.

## Cấu trúc thư mục

```
Tarot/
├── index.html          trang chủ
├── tarot.html           trải bài Tarot (4 bước)
├── daily.html            lá bài hôm nay
├── numerology.html        thần số học
├── horoscope.html          chiêm tinh
├── match.html                ghép đôi
├── dream.html                  giải mã giấc mơ
├── wheel.html                   vòng quay Cún Nody
├── letter.html                   thư gửi mai sau
├── history.html                   hồ sơ & lịch sử
├── 404.html                        trang lỗi
├── firebase.json
├── .firebaserc
├── css/
│   ├── tokens.css        màu sắc, phông chữ, biến CSS — SỬA MÀU Ở ĐÂY
│   ├── scene.css         nền trời 3D (sao, cực quang, cánh hoa)
│   ├── shell.css         header, footer, hộp đăng nhập, toast
│   ├── components.css    nút, ô nhập, thẻ, panel dùng chung
│   ├── tarot.css         bộ bài 3D, bàn trải, vòng quay
│   └── pages.css         phần riêng từng trang (hero, moon-panel...)
└── js/
    ├── firebase-init.js  DUY NHẤT nói chuyện với Firebase — đừng sửa config
    ├── shell.js           header/footer/đăng nhập dùng chung mọi trang
    ├── scene.js            hiệu ứng nền 3D + nghiêng theo chuột
    ├── home.js / tarot.js / daily.js / numerology.js / horoscope.js /
    │   match.js / dream.js / wheel.js / letter.js / history.js
    │                        — mỗi trang một file, độc lập với nhau
    └── data/
        ├── deck.js         78 lá bài + lời giải tiếng Việt
        ├── spreads.js      6 kiểu trải bài + chủ đề
        ├── lore.js         cung hoàng đạo + thần số học
        └── dreams.js       từ điển biểu tượng giấc mơ
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

## Firebase — không có gì đổi

Cấu hình trong `js/firebase-init.js` giữ nguyên y hệt bản cũ của bạn (`apiKey`,
`authDomain`, `projectId`...). Collection `readings` cũng giữ nguyên tên và
nguyên các trường cũ (`userId`, `userEmail`, `topic`, `question`, `spread`,
`drawnCards`, `createdAt`) — dữ liệu bạn đã lưu từ trước vẫn đọc được bình thường.

Có thêm một collection mới, `letters`, dùng cho tính năng **Thư gửi mai sau**.

### Luật Firestore cần có

Nếu Firestore của bạn đang ở chế độ test (cho phép đọc/ghi tự do) thì mọi thứ đã
chạy được ngay. Khi chuyển sang chế độ production, bạn cần luật tối thiểu sau
(vào Firebase Console → Firestore Database → Rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /readings/{docId} {
      allow read, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }

    match /letters/{docId} {
      allow read, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

Luật này để mỗi người chỉ đọc/xoá được đúng dữ liệu của chính mình.

### Nếu dùng Google đăng nhập trên domain mới

Vào Firebase Console → Authentication → Settings → Authorized domains,
thêm domain bạn deploy lên (ví dụ `nodytarot.web.app` đã có sẵn, nhưng nếu
gắn domain riêng thì cần thêm domain đó vào).

## Muốn sửa gì thì sửa ở đâu

| Muốn đổi | Sửa file |
|---|---|
| Màu sắc, phông chữ | `css/tokens.css` |
| Lời giải 78 lá bài | `js/data/deck.js` |
| Thêm/sửa kiểu trải bài | `js/data/spreads.js` |
| Lời luận thần số học, chiêm tinh | `js/data/lore.js` |
| Từ điển giấc mơ | `js/data/dreams.js` |
| Menu đầu trang | mảng `MENU` đầu file `js/shell.js` |
| Chữ ở trang chủ | `index.html` |
| Linh vật Cún Nody | hàm `pupSVG()` trong `js/shell.js` |

## Ghi chú về ảnh lá bài

Ảnh dùng bộ Rider–Waite–Smith (đã hết hạn bản quyền từ lâu), tải qua
`https://wsrv.nl/?url=sacred-texts.com/...` để nhanh và nhẹ, có link dự
phòng thẳng tới `sacred-texts.com` nếu proxy lỗi. Đây đúng là nguồn ảnh bản
gốc của bạn đã dùng, không đổi gì. Nếu bạn có bộ ảnh lá bài riêng, sửa
hai trường `img` và `img2` trong `js/data/deck.js`.

## Tính năng theo trang

- **Trang chủ** — pha trăng hôm nay, lá bài gợi mở, lưới 8 công cụ, cảm nhận người dùng, FAQ
- **Trải bài Tarot** — chọn chủ đề → chọn 1 trong 6 kiểu trải → xáo & rút trên nan quạt 3D →
  bàn trải 3D lật từng lá → bản luận giải tổng dệt các lá lại thành một mạch
- **Lá bài hôm nay** — một lá cố định theo ngày, đếm chuỗi ngày ghé liên tiếp
- **Thần số học** — 5 chỉ số (đường đời, linh hồn, nhân cách, sứ mệnh, ngày sinh) + năm cá nhân
- **Chiêm tinh** — tra cung từ ngày sinh, ghép với pha trăng ra bản đọc trong ngày
- **Ghép đôi** — điểm hợp từ ba lớp: hành của cung, số đường đời, duyên tên gọi
- **Giải mã giấc mơ** — dò 23 biểu tượng thường gặp + 1 lá bài gợi ý
- **Vòng quay Cún Nody** — một lượt miễn phí mỗi ngày
- **Thư gửi mai sau** — viết thư hẹn ngày mở, lưu trên Firestore
- **Hồ sơ & lịch sử** — xem lại mọi lượt đã lưu, lọc theo loại, đổi tên, đăng xuất

Mọi trang đều dùng chung nền trời 3D và thanh đầu/chân trang từ `js/shell.js` và
`js/scene.js`, nên thêm một trang mới chỉ cần copy khung HTML của một trang có sẵn
rồi đổi phần `<main>`.
