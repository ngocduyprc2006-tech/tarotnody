/* ============================================================
   perf.js — tự nhận biết máy yếu/khoẻ, chạy ĐẦU TIÊN trên mọi trang
   ------------------------------------------------------------
   Mục tiêu: web nhìn "8D" trên máy khoẻ nhưng KHÔNG giật lag trên
   máy yếu — bằng cách tắt bớt hiệu ứng nặng khi phát hiện máy đuối.
   Người dùng cũng có thể tự bấm nút ✨ ở đầu trang để ép Bật/Tắt,
   ghi đè lên phần tự động — lựa chọn được nhớ trên máy đó.

   API công khai: window.NodyPerf
     .tier            'low' | 'mid' | 'high'  — mức hiệu ứng ĐANG áp dụng
     .autoTier        mức mà hệ thống tự đoán/đo được (không tính ép buộc)
     .overrideMode    null (tự động) | 'on' | 'off'
     .low / .mid / .high   cờ tiện dùng ứng với .tier hiện tại
     .setOverride(mode)    'on' | 'off' | 'auto' (hoặc null) — gọi từ nút ✨
   ============================================================ */
(function () {
  'use strict';
  var html = document.documentElement;
  var autoTier = 'mid';
  var overrideMode = null;

  function scoreDevice() {
    var score = 0;
    var mem = navigator.deviceMemory;       // GB — không phải trình duyệt nào cũng có
    var cores = navigator.hardwareConcurrency || 4;

    if (mem != null) { if (mem <= 2) score -= 2; else if (mem <= 4) score -= 1; else score += 1; }
    if (cores <= 2) score -= 2; else if (cores <= 4) score -= 1; else score += 1;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) score -= 3;

    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && (conn.saveData || /^(slow-2g|2g)$/.test(conn.effectiveType || ''))) score -= 2;

    if (window.innerWidth < 380) score -= 1;
    return score;
  }

  function tierFromScore(s) {
    if (s <= -3) return 'low';
    if (s <= 0) return 'mid';
    return 'high';
  }

  autoTier = tierFromScore(scoreDevice());
  try {
    var saved = localStorage.getItem('nody.fx');
    if (saved === 'on' || saved === 'off') overrideMode = saved;
  } catch (e) {}

  function paint() {
    var t = overrideMode === 'off' ? 'low' : overrideMode === 'on' ? 'high' : autoTier;
    html.setAttribute('data-perf', t);
    window.NodyPerf = {
      tier: t,
      autoTier: autoTier,
      overrideMode: overrideMode,
      low: t === 'low', mid: t === 'mid', high: t === 'high',
      setOverride: setOverride
    };
  }

  function setOverride(mode) {
    overrideMode = (mode === 'on' || mode === 'off') ? mode : null;
    try {
      if (overrideMode) localStorage.setItem('nody.fx', overrideMode);
      else localStorage.removeItem('nody.fx');
    } catch (e) {}
    paint();
    window.dispatchEvent(new CustomEvent('nody:fx-change', { detail: overrideMode }));
  }

  paint();

  /* ---------- Đo FPS thật, tự hạ cấp phần "tự động" nếu máy đuối hơn dự đoán ----------
     Chỉ ảnh hưởng khi người dùng chưa tự ép Bật/Tắt (overrideMode == null). */
  var frames = 0, start = null;
  function sample(t) {
    if (start === null) start = t;
    frames++;
    var elapsed = t - start;
    if (elapsed < 1200) { requestAnimationFrame(sample); return; }
    var fps = frames / (elapsed / 1000);
    if (fps < 40 && autoTier !== 'low') {
      autoTier = 'low';
      if (!overrideMode) { paint(); window.dispatchEvent(new CustomEvent('nody:perf-downgrade')); }
    } else if (fps < 52 && autoTier === 'high') {
      autoTier = 'mid';
      if (!overrideMode) paint();
    }
  }
  if ('requestAnimationFrame' in window) requestAnimationFrame(sample);

  /* Tab đang ẩn (chuyển sang tab khác) → báo cho scene.js tạm nghỉ hiệu ứng nặng */
  document.addEventListener('visibilitychange', function () {
    html.toggleAttribute('data-tab-hidden', document.hidden);
    window.dispatchEvent(new CustomEvent('nody:visibility', { detail: !document.hidden }));
  });
})();
