/* ============================================================
   bg.js — nền hiệu ứng "bụi trăng" nhẹ nhàng cho các trang hero
   ------------------------------------------------------------
   Đây KHÔNG phải bản sao của bất kỳ thư viện WebGL trả phí nào
   (ví dụ các mẫu trên threeui.com) — mình không có và không dùng
   mã nguồn của họ. Đây là hiệu ứng gốc, viết bằng Canvas 2D thuần,
   nhẹ máy hơn WebGL nhiều lần, lấy cảm hứng ở tinh thần "vệt sáng
   trôi nhẹ trong nền tối" chứ không sao chép bất kỳ shader nào.

   Tự tắt hẳn khi NodyPerf ở mức 'low' (máy yếu / người dùng đã bấm
   nút ✨ để tắt hiệu ứng), và tự bật/tắt lại ngay khi người dùng đổi
   nút đó — không cần tải lại trang.
   ============================================================ */
(function () {
  'use strict';

  function mount(canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, motes = [], raf = null;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seedMotes() {
      const tier = window.NodyPerf ? window.NodyPerf.tier : 'mid';
      const n = tier === 'high' ? 70 : tier === 'mid' ? 38 : 0;
      motes = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.6 + .4,
        vx: (Math.random() - .5) * .12,
        vy: -Math.random() * .18 - .04,
        a: Math.random() * .5 + .15,
        tw: Math.random() * Math.PI * 2
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      const dark = !document.body.classList.contains('dawn');
      motes.forEach(m => {
        m.x += m.vx; m.y += m.vy; m.tw += .02;
        if (m.y < -6) { m.y = h + 6; m.x = Math.random() * w; }
        if (m.x < -6) m.x = w + 6;
        if (m.x > w + 6) m.x = -6;
        const flicker = m.a * (0.65 + 0.35 * Math.sin(m.tw));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(210,225,255,${flicker})`
          : `rgba(255,225,190,${flicker * .8})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(frame);
    }

    function start() {
      stop();
      resize();
      seedMotes();
      if (motes.length && !document.hidden) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (motes.length) raf = requestAnimationFrame(frame);
    });

    let resizeT;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(start, 200);
    });
    window.addEventListener('nody:fx-change', start);
    window.addEventListener('nody:theme', () => {}); // màu tự đổi ở frame(), không cần vẽ lại riêng

    start();
  }

  function init() {
    document.querySelectorAll('[data-nody-bg]').forEach(host => {
      if (host.querySelector('canvas.nody-bg-canvas')) return;
      const cv = document.createElement('canvas');
      cv.className = 'nody-bg-canvas';
      cv.setAttribute('aria-hidden', 'true');
      host.insertBefore(cv, host.firstChild);
      mount(cv);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
