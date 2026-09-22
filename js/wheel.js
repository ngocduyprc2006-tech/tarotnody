/* ============================================================
   wheel.js — Vòng quay Nody
   Mỗi ngày một lượt quay miễn phí. Kết quả cố định theo ngày để
   không ai quay lại mãi cho tới khi ra ô mình thích.
   ============================================================ */

(function () {
  'use strict';
  const Sh = window.Shell;
  const $ = (id) => document.getElementById(id);
  const T = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);

  const COLORS = ['#3d5aa8', '#5fb4ec', '#8b9bf6', '#6fe0d6', '#6fd0a8', '#7a8fd8', '#3480c4', '#4fc3d9'];
  const KEYS = ['rest', 'speak', 'start', 'meet', 'tidy', 'trust', 'slow', 'treat'];

  function slice(i) {
    return { label: T('wheel.' + KEYS[i] + '.label'), color: COLORS[i], text: T('wheel.' + KEYS[i] + '.text') };
  }
  const N = KEYS.length;

  let spinning = false;
  let turns = 0;

  function paint() {
    const wheel = $('wheel');
    const step = 360 / N;

    // vẽ các múi bằng conic-gradient cho gọn, nhãn đặt chồng lên
    const stops = COLORS.map((c, i) => `${c} ${i * step}deg ${(i + 1) * step}deg`).join(', ');
    wheel.style.background = `conic-gradient(${stops})`;

    wheel.querySelectorAll('.wheel-label').forEach(e => e.remove());
    // bán kính đặt nhãn tính theo kích thước thật của vòng quay, không cố định px,
    // để trên màn hình nhỏ nhãn vẫn nằm đúng giữa mỗi múi
    const radius = (wheel.offsetWidth || 340) * 0.335;
    for (let i = 0; i < N; i++) {
      const el = document.createElement('span');
      el.className = 'wheel-label';
      el.textContent = T('wheel.' + KEYS[i] + '.label');
      const mid = i * step + step / 2;
      el.style.transform = `rotate(${mid - 90}deg) translate(${radius}px, -7px)`;
      wheel.appendChild(el);
    }
  }

  function spin() {
    if (spinning) return;

    const day = Sh.today();
    const used = Sh.store.get('wheelDay', null);
    const rnd = Sh.seeded('wheel·' + day + '·' + (Sh.store.get('guest', 'x')));
    const idx = Math.floor(rnd() * N);

    if (used === day) {
      Sh.toast(T('wheel.alreadySpun'));
      landOn(idx, true);
      return;
    }

    spinning = true;
    $('btnSpin').disabled = true;
    landOn(idx, false);
    Sh.store.set('wheelDay', day);
  }

  function landOn(idx, instant) {
    const step = 360 / N;
    const target = 360 - (idx * step + step / 2);
    turns += instant ? 0 : 5;
    const deg = turns * 360 + target;
    const dur = (window.NodyPerf && window.NodyPerf.low) ? 2.4 : 5.2;

    const wheel = $('wheel');

    if (instant) {
      wheel.style.transition = 'none';
      wheel.style.transform = `rotateX(16deg) rotate(${deg}deg)`;
    } else {
      // Ép trình duyệt "chốt" giá trị transform HIỆN TẠI trước khi gắn
      // transition mới, rồi mới đổi sang giá trị đích ở khung hình kế
      // tiếp — tránh kiểu giật/nhảy cỡ lớn giữa chừng khi trình duyệt
      // gộp hai lần đổi style làm một. Đường cong dưới đây (easeOutQuint,
      // rất hay dùng cho bánh xe quay) tăng tốc đều rồi giảm dần mượt
      // trong suốt cả quá trình, không bị "khựng gần hết rồi vọt nhanh"
      // như đường cong cũ.
      wheel.style.transition = 'none';
      void wheel.offsetWidth; // ép reflow, chốt trạng thái hiện tại
      requestAnimationFrame(() => {
        wheel.style.transition = `transform ${dur}s cubic-bezier(.16,.86,.22,1)`;
        wheel.style.transform = `rotateX(16deg) rotate(${deg}deg)`;
      });
    }

    setTimeout(() => {
      const s = slice(idx);
      $('wheelBody').innerHTML = `
        <div class="chips" style="justify-content:center">
          <span class="chip">${s.label}</span>
        </div>
        <p class="center" style="font-size:1.02rem">${s.text}</p>
        <blockquote>${T('wheel.disclaimer')}</blockquote>`;
      $('wheelResult').classList.remove('hidden');
      spinning = false;
      $('btnSpin').disabled = false;

      if (!instant) {
        Sh.log({ kind: 'wheel', title: T('nav.wheel') + ' · ' + s.label, summary: s.text });
      }
    }, instant ? 60 : dur * 1000 + 120);
  }

  function init() {
    if (!$('wheel')) return;
    paint();
    $('btnSpin').onclick = spin;
    window.addEventListener('nody:theme', paint);
    window.addEventListener('nody:lang', () => {
      paint();
      if (!$('wheelResult').classList.contains('hidden')) {
        // vẽ lại nhãn kết quả cuối cùng bằng ngôn ngữ mới, không quay lại
        const day = Sh.today();
        const rnd = Sh.seeded('wheel·' + day + '·' + (Sh.store.get('guest', 'x')));
        const idx = Math.floor(rnd() * N);
        const s = slice(idx);
        $('wheelBody').innerHTML = `
          <div class="chips" style="justify-content:center"><span class="chip">${s.label}</span></div>
          <p class="center" style="font-size:1.02rem">${s.text}</p>
          <blockquote>${T('wheel.disclaimer')}</blockquote>`;
      }
    });

    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(paint, 200);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
