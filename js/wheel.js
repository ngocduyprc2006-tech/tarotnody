/* ============================================================
   wheel.js — Vòng quay Cún Nody
   Mỗi ngày một lượt quay miễn phí. Kết quả cố định theo ngày để
   không ai quay lại mãi cho tới khi ra ô mình thích.
   ============================================================ */

(function () {
  'use strict';
  const Sh = window.Shell;
  const $ = (id) => document.getElementById(id);

  const SLICES = [
    { label: 'Nghỉ đi', color: '#3d5aa8',
      text: 'Hôm nay vũ trụ cho phép bạn không cố gắng. Làm ít lại một nửa, và đừng thấy có lỗi.' },
    { label: 'Nói ra', color: '#5fb4ec',
      text: 'Có một câu bạn giữ trong lòng lâu rồi. Hôm nay là ngày đẹp để nói nó ra, nhẹ nhàng thôi.' },
    { label: 'Bắt đầu', color: '#8b9bf6',
      text: 'Việc bạn hoãn mãi ấy — mở nó ra mười lăm phút thôi. Không cần xong, chỉ cần mở.' },
    { label: 'Gặp người', color: '#6fe0d6',
      text: 'Nhắn cho một người bạn nghĩ tới sáng nay. Cuộc trò chuyện đó sẽ dễ chịu hơn bạn tưởng.' },
    { label: 'Dọn gọn', color: '#6fd0a8',
      text: 'Dọn một góc nhỏ. Bàn làm việc, ví tiền, hay danh sách việc — gọn ngoài thì nhẹ trong.' },
    { label: 'Tin mình', color: '#7a8fd8',
      text: 'Linh cảm sáng nay của bạn đúng đấy. Đừng hỏi thêm người thứ ba nữa.' },
    { label: 'Chậm lại', color: '#3480c4',
      text: 'Bạn đang đi nhanh hơn sức mình. Bớt một việc trong danh sách hôm nay đi.' },
    { label: 'Tự thưởng', color: '#4fc3d9',
      text: 'Mua cho mình một thứ nhỏ, hoặc ngủ thêm nửa tiếng. Bạn xứng đáng, thật đấy.' }
  ];

  let spinning = false;
  let turns = 0;

  function paint() {
    const wheel = $('wheel');
    const n = SLICES.length;
    const step = 360 / n;

    // vẽ các múi bằng conic-gradient cho gọn, nhãn đặt chồng lên
    const stops = SLICES.map((s, i) =>
      `${s.color} ${i * step}deg ${(i + 1) * step}deg`).join(', ');
    wheel.style.background = `conic-gradient(${stops})`;

    wheel.querySelectorAll('.wheel-label').forEach(e => e.remove());
    // bán kính đặt nhãn tính theo kích thước thật của vòng quay, không cố định px,
    // để trên màn hình nhỏ nhãn vẫn nằm đúng giữa mỗi múi
    const radius = (wheel.offsetWidth || 340) * 0.335;
    SLICES.forEach((s, i) => {
      const el = document.createElement('span');
      el.className = 'wheel-label';
      el.textContent = s.label;
      const mid = i * step + step / 2;
      el.style.transform = `rotate(${mid - 90}deg) translate(${radius}px, -7px)`;
      wheel.appendChild(el);
    });
  }

  function spin() {
    if (spinning) return;

    const day = Sh.today();
    const used = Sh.store.get('wheelDay', null);
    const rnd = Sh.seeded('wheel·' + day + '·' + (Sh.store.get('guest', 'x')));
    const idx = Math.floor(rnd() * SLICES.length);

    if (used === day) {
      Sh.toast('Hôm nay bạn quay rồi. Mai ghé lại nhé 🐾');
      landOn(idx, true);
      return;
    }

    spinning = true;
    $('btnSpin').disabled = true;
    landOn(idx, false);
    Sh.store.set('wheelDay', day);
  }

  function landOn(idx, instant) {
    const step = 360 / SLICES.length;
    const target = 360 - (idx * step + step / 2);
    turns += instant ? 0 : 5;
    const deg = turns * 360 + target;

    const wheel = $('wheel');
    wheel.style.transition = instant ? 'none' : 'transform 4.6s cubic-bezier(.13,.78,.18,1)';
    wheel.style.transform = `rotateX(16deg) rotate(${deg}deg)`;

    setTimeout(() => {
      const s = SLICES[idx];
      $('wheelBody').innerHTML = `
        <div class="chips" style="justify-content:center">
          <span class="chip">${s.label}</span>
        </div>
        <p class="center" style="font-size:1.02rem">${s.text}</p>
        <blockquote>Một lời nhắc nhỏ vẫn đổi được cả một ngày. Mai vòng quay sẽ đổi ô khác.</blockquote>`;
      $('wheelResult').classList.remove('hidden');
      spinning = false;
      $('btnSpin').disabled = false;

      if (!instant) {
        Sh.log({ kind: 'wheel', title: 'Vòng quay · ' + s.label, summary: s.text });
      }
    }, instant ? 60 : 4700);
  }

  function init() {
    if (!$('wheel')) return;
    paint();
    $('btnSpin').onclick = spin;
    window.addEventListener('nody:theme', paint);

    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(paint, 200);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
