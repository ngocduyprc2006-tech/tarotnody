/* ============================================================
   scene.js — bầu trời 3D nhiều lớp + hiệu ứng nghiêng theo chuột
   Nhẹ và tự giảm tải trên điện thoại. Tôn trọng "giảm chuyển động".
   ============================================================ */

(function () {
  'use strict';

  const slowMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.innerWidth < 720;

  /* ==========================================================
     1. Dựng trời
     ========================================================== */
  function build() {
    if (document.getElementById('scene')) return;

    const scene = document.createElement('div');
    scene.id = 'scene';
    scene.setAttribute('aria-hidden', 'true');

    scene.innerHTML =
      '<div class="sky"></div>' +
      '<div class="aurora a1"></div><div class="aurora a2"></div><div class="aurora a3"></div>' +
      '<div class="star-layer l1"></div><div class="star-layer l2"></div><div class="star-layer l3"></div>';

    document.body.insertBefore(scene, document.body.firstChild);

    // ba lớp sao, lớp xa thì nhỏ và mờ hơn
    const layers = [
      { el: scene.querySelector('.l1'), n: small ? 34 : 70, size: [.6, 1.3], dim: .45 },
      { el: scene.querySelector('.l2'), n: small ? 24 : 48, size: [1.0, 2.0], dim: .7 },
      { el: scene.querySelector('.l3'), n: small ? 14 : 26, size: [1.6, 2.9], dim: 1 }
    ];

    layers.forEach(L => {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < L.n; i++) {
        const s = document.createElement('i');
        s.className = 'star';
        const size = L.size[0] + Math.random() * (L.size[1] - L.size[0]);
        s.style.width = s.style.height = size.toFixed(2) + 'px';
        s.style.left = (Math.random() * 100).toFixed(2) + '%';
        s.style.top = (Math.random() * 100).toFixed(2) + '%';
        s.style.opacity = L.dim;
        s.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
        s.style.animationDuration = (3 + Math.random() * 4).toFixed(2) + 's';
        frag.appendChild(s);
      }
      L.el.appendChild(frag);
    });

    if (!slowMotion) {
      petals(scene);
      scheduleShootingStar(scene);
    }
    return scene;
  }

  /* ==========================================================
     2. Cánh hoa rơi chậm
     ========================================================== */
  function petals(scene) {
    const n = small ? 6 : 12;
    const tints = ['var(--blossom)', 'var(--moon)', 'var(--mist)'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.className = 'petal';
      const w = 5 + Math.random() * 7;
      p.style.width = w.toFixed(1) + 'px';
      p.style.height = (w * .72).toFixed(1) + 'px';
      p.style.left = (Math.random() * 100).toFixed(1) + '%';
      p.style.background = tints[i % tints.length];
      p.style.animationDuration = (16 + Math.random() * 18).toFixed(1) + 's';
      p.style.animationDelay = (-Math.random() * 26).toFixed(1) + 's';
      frag.appendChild(p);
    }
    scene.querySelector('.l3').appendChild(frag);
  }

  /* ==========================================================
     3. Sao băng, thưa thôi cho quý
     ========================================================== */
  function scheduleShootingStar(scene) {
    const layer = scene.querySelector('.l2');
    const fire = () => {
      const s = document.createElement('i');
      s.className = 'shooting';
      s.style.left = (Math.random() * 40) + '%';
      s.style.top = (Math.random() * 38) + '%';
      layer.appendChild(s);
      setTimeout(() => s.remove(), 1700);
      setTimeout(fire, 14000 + Math.random() * 22000);
    };
    setTimeout(fire, 5000 + Math.random() * 9000);
  }

  /* ==========================================================
     4. Trời nghiêng theo chuột / theo nghiêng điện thoại
     ========================================================== */
  function parallax() {
    if (slowMotion) return;
    const scene = document.getElementById('scene');
    if (!scene) return;
    const L = [
      { el: scene.querySelector('.l1'), z: -220, sc: 1.26, amt: 26 },
      { el: scene.querySelector('.l2'), z: -110, sc: 1.13, amt: 15 },
      { el: scene.querySelector('.l3'), z: 0,    sc: 1,    amt: 7  }
    ];

    let tx = 0, ty = 0, cx = 0, cy = 0, running = false;

    function loop() {
      cx += (tx - cx) * .06;
      cy += (ty - cy) * .06;
      L.forEach(l => {
        l.el.style.transform =
          `translate3d(${(-cx * l.amt).toFixed(2)}px, ${(-cy * l.amt).toFixed(2)}px, ${l.z}px) scale(${l.sc})`;
      });
      if (Math.abs(tx - cx) > .001 || Math.abs(ty - cy) > .001) requestAnimationFrame(loop);
      else running = false;
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(loop); } }

    window.addEventListener('mousemove', (e) => {
      tx = (e.clientX / window.innerWidth - .5) * 2;
      ty = (e.clientY / window.innerHeight - .5) * 2;
      kick();
    }, { passive: true });

    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 34));
      ty = Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / 34));
      kick();
    }, { passive: true });
  }

  /* ==========================================================
     5. Nghiêng thẻ theo con trỏ — dùng cho thẻ công cụ, lá bài
        Gắn bằng: <div data-tilt> hoặc Scene.tilt(el, 12)
     ========================================================== */
  function tilt(el, strength) {
    if (slowMotion || window.matchMedia('(hover: none)').matches) return;
    const max = strength || 10;
    let raf = null;

    function move(e) {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform =
          `perspective(760px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(8px)`;
      });
    }
    function leave() {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    }
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
  }

  function autoTilt(root) {
    (root || document).querySelectorAll('[data-tilt]').forEach(el => {
      if (el.dataset.tiltOn) return;
      el.dataset.tiltOn = '1';
      tilt(el, parseFloat(el.dataset.tilt) || 10);
    });
  }

  /* ==========================================================
     6. Hiện dần khi cuộn tới — một nhịp duy nhất, không lạm dụng
     ========================================================== */
  function revealOnScroll() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    if (slowMotion || !('IntersectionObserver' in window)) {
      items.forEach(i => i.style.opacity = 1);
      return;
    }
    items.forEach(i => {
      i.style.opacity = '0';
      i.style.transform = 'translateY(16px)';
      i.style.transition = 'opacity .7s var(--ease), transform .7s var(--ease)';
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.style.opacity = '1';
        en.target.style.transform = 'none';
        io.unobserve(en.target);
      });
    }, { threshold: .14 });
    items.forEach(i => io.observe(i));
  }

  function start() {
    build();
    parallax();
    autoTilt();
    revealOnScroll();
  }

  window.Scene = { tilt, autoTilt, revealOnScroll };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
