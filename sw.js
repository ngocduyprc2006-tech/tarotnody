/* ============================================================
   sw.js — Service Worker cho Nody Tarot
   ------------------------------------------------------------
   Mục đích chính: cho phép "Cài đặt vào màn hình chính" (PWA) và
   giúp trang mở lại nhanh hơn, có thể xem lại nội dung tĩnh (giao
   diện, ảnh lá bài đã xem) khi mất mạng.

   KHÔNG đụng vào dữ liệu thật (Firebase Auth/Firestore) — mọi
   request sang domain khác (googleapis.com, gstatic.com,
   firebaseapp.com, fonts.googleapis.com...) đều được bỏ qua ngay
   từ đầu, để luôn lấy dữ liệu mới nhất, không cache nhầm số dư ví
   hay lịch sử bói.

   Chiến lược cache:
   - Trang .html: network-first (luôn thử lấy bản mới nhất trước,
     có mạng chậm/mất mạng mới dùng bản đã lưu) — tránh kẹt ở giao
     diện cũ sau khi có bản cập nhật.
   - .js/.css/ảnh/font cùng gốc: stale-while-revalidate (trả ngay
     bản đã lưu cho nhanh, đồng thời âm thầm tải bản mới cho lần
     sau) — vừa nhanh vừa tự cập nhật.
   ============================================================ */

const VERSION = 'nody-tarot-v1';
const STATIC_CACHE = VERSION + '-static';

// Vài trang cốt lõi tải trước để lần đầu cài đặt đã có sẵn, mở
// được ngay cả khi đang offline. Không liệt kê hết mọi trang —
// các trang khác sẽ tự được lưu dần khi người dùng ghé qua.
const PRECACHE_URLS = [
  '/', '/index.html', '/tarot.html', '/daily.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch(() => {
        // Offline ngay lúc cài thì bỏ qua, không chặn cài đặt SW.
      })
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== STATIC_CACHE).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Chỉ xử lý GET cùng gốc (same-origin). Mọi thứ khác (Firebase,
  // Google Fonts, wsrv.nl, sacred-texts.com, POST/PUT...) để trình
  // duyệt tự xử lý như bình thường, không can thiệp.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  const isHTML = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');

  if (isHTML) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(staleWhileRevalidate(req));
  }
});

async function networkFirst(req) {
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await caches.match(req);
    return cached || caches.match('/index.html');
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req).then((fresh) => {
    if (fresh && fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  }).catch(() => cached);
  return cached || fetchPromise;
}
