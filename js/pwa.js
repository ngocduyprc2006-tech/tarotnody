/* ============================================================
   pwa.js — đăng ký Service Worker + nút "Cài đặt ứng dụng"
   ------------------------------------------------------------
   Chạy trên mọi trang. Tự thêm một nút nhỏ vào khay công cụ đầu
   trang (cạnh nút đổi ngôn ngữ) khi trình duyệt báo có thể cài đặt
   được — bấm vào là hiện đúng hộp thoại cài đặt gốc của trình
   duyệt, không phải hộp thoại tự vẽ. Trên iOS Safari (không hỗ trợ
   hộp thoại này), thay bằng một mẹo nhỏ hướng dẫn qua nút Chia sẻ.
   ============================================================ */
(function () {
  'use strict';

  // Đăng ký Service Worker — an toàn khi bỏ qua nếu trình duyệt cũ
  // không hỗ trợ, hoặc đang mở bằng file:// (không chạy được SW).
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Im lặng bỏ qua — thiếu SW không nên chặn người dùng dùng web.
      });
    });
  }

  const T = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);
  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

  let deferredPrompt = null;

  function mountButton() {
    const host = document.getElementById('headTools');
    if (!host || document.getElementById('installBtn')) return null;
    const btn = document.createElement('button');
    btn.className = 'icon-btn';
    btn.id = 'installBtn';
    btn.title = T('pwa.install', 'Cài đặt ứng dụng');
    btn.textContent = '📲';
    host.insertBefore(btn, host.firstChild);
    return btn;
  }

  function tryMount() {
    if (isStandalone()) return; // đã cài rồi thì khỏi hiện nút
    // headTools do shell.js vẽ động, có thể chưa kịp có lúc pwa.js
    // chạy — thử lại vài lần trong 3 giây đầu là đủ.
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      const btn = mountButton();
      if (btn || tries > 15) clearInterval(t);
      if (btn) wireButton(btn);
    }, 200);
  }

  function wireButton(btn) {
    btn.onclick = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted' && window.Shell) window.Shell.toast(T('pwa.installedToast', 'Đã cài xong, hẹn gặp lại trên màn hình chính 🌙'));
        deferredPrompt = null;
        btn.remove();
      } else if (isIOS()) {
        if (window.Shell) window.Shell.toast(T('pwa.iosHint', 'Trên iPhone: bấm nút Chia sẻ ở thanh dưới, rồi chọn "Thêm vào MH chính".'));
      }
    };
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    tryMount();
  });

  window.addEventListener('appinstalled', () => {
    const btn = document.getElementById('installBtn');
    if (btn) btn.remove();
    deferredPrompt = null;
  });

  // iOS Safari không bắn beforeinstallprompt — vẫn hiện nút để dẫn
  // sang mẹo "Thêm vào Màn hình chính" qua nút Chia sẻ.
  if (isIOS() && !isStandalone()) {
    document.addEventListener('DOMContentLoaded', tryMount);
  }

  // Rebuild theo header (đổi ngôn ngữ, đổi trang) — nếu nút bị mất vì
  // shell.js vẽ lại toàn bộ header thì gắn lại, giữ nguyên trạng thái
  // deferredPrompt đã lưu. Nút cũ (nếu còn) cũng được cập nhật lại
  // chú thích theo ngôn ngữ mới.
  window.addEventListener('nody:lang', () => {
    const existing = document.getElementById('installBtn');
    if (existing) existing.title = T('pwa.install', 'Cài đặt ứng dụng');
    if (deferredPrompt || (isIOS() && !isStandalone())) tryMount();
  });
})();
