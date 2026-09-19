/* ============================================================
   horoscope.js — Chiêm tinh nhẹ nhàng
   Tra cung từ ngày sinh, rồi ghép với pha trăng hôm nay để ra
   một bản đọc cho hôm nay. Cùng ngày thì cùng kết quả.
   ============================================================ */

(function () {
  'use strict';
  const L = window.Lore, Sh = window.Shell;
  const $ = (id) => document.getElementById(id);

  const AREAS = [
    { k: 'Tình cảm',   base: 62 },
    { k: 'Công việc',  base: 66 },
    { k: 'Tiền bạc',   base: 58 },
    { k: 'Sức khoẻ',   base: 64 },
    { k: 'Tinh thần',  base: 70 }
  ];

  const LUCKY_COLORS = ['xanh lam', 'ngọc lam', 'tím lam', 'trắng ngà', 'xanh dương đậm', 'xanh rêu', 'bạc ánh trăng'];

  function buildGrid() {
    $('signGrid').innerHTML = L.ZODIAC.map(z => `
      <button class="tool" data-tilt="8" data-sign="${z.id}">
        <span class="glyph">${z.sym}</span>
        <h3>${z.vi}</h3>
        <p>${z.from[1]}/${z.from[0]} – ${z.to[1]}/${z.to[0]} · hành ${z.el}</p>
      </button>`).join('');

    $('signGrid').querySelectorAll('[data-sign]').forEach(b => {
      b.onclick = () => show(L.ZODIAC.find(z => z.id === b.dataset.sign));
    });
    if (window.Scene) window.Scene.autoTilt($('signGrid'));
  }

  function show(z) {
    const moon = Sh.moonPhase();
    const rnd = Sh.seeded(Sh.today() + '·' + z.id);
    const day = L.ELEMENT_DAY[z.el];

    const scores = AREAS.map(a => {
      const v = Math.round(a.base + (rnd() * 34 - 15) + (moon.frac > .45 && moon.frac < .55 ? 6 : 0));
      return { k: a.k, v: Math.max(38, Math.min(97, v)) };
    });

    const color = LUCKY_COLORS[Math.floor(rnd() * LUCKY_COLORS.length)];
    const hour = Math.floor(rnd() * 12) + 8;
    const best = scores.reduce((a, b) => a.v > b.v ? a : b);
    const weak = scores.reduce((a, b) => a.v < b.v ? a : b);

    $('signBody').innerHTML = `
      <div class="center" style="margin-bottom:18px">
        <div style="font-size:3rem;line-height:1">${z.sym}</div>
        <h3 style="margin-top:6px">${z.vi}</h3>
        <p class="tiny mute">hành ${z.el} · ${z.from[1]}/${z.from[0]} – ${z.to[1]}/${z.to[0]}</p>
      </div>

      <div class="chips">
        <span class="chip">${Sh.moonGlyph(moon.index)} ${moon.name}</span>
        <span class="chip alt">Màu hợp hôm nay: ${color}</span>
        <span class="chip alt">Khung giờ dễ chịu: ${hour}h–${hour + 2}h</span>
      </div>

      <h4>Bạn là kiểu người thế nào</h4>
      <p>${z.trait} ${z.care}</p>

      <h4>Hôm nay</h4>
      <p>${day[0]} ${day[1]} ${moon.advice}</p>

      <h4>Các mặt trong ngày</h4>
      ${scores.map(s => `
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:.86rem">
            <span>${s.k}</span><span class="mute">${s.v}%</span>
          </div>
          <div class="meter"><i style="width:0"></i></div>
        </div>`).join('')}

      <h4>Gọn lại một câu</h4>
      <p>Hôm nay <b style="color:var(--moon)">${best.k.toLowerCase()}</b> là chỗ dễ thở nhất của bạn — cứ dồn sức vào đó.
      Còn <b style="color:var(--blossom)">${weak.k.toLowerCase()}</b> thì hạ kỳ vọng xuống một nấc, mai tính tiếp cũng chẳng sao.</p>

      <blockquote>Chiêm tinh mô tả thời tiết, không quyết định bạn đi đâu. Trời mưa thì mang ô, vậy thôi.</blockquote>`;

    $('signResult').classList.remove('hidden');
    $('signResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // chạy thanh đo sau một nhịp cho mượt
    setTimeout(() => {
      $('signBody').querySelectorAll('.meter i').forEach((el, i) => {
        el.style.width = scores[i].v + '%';
      });
    }, 90);

    Sh.log({
      kind: 'horoscope',
      title: 'Chiêm tinh · ' + z.vi,
      summary: `${z.vi} ngày ${Sh.today()} — mạnh nhất ở ${best.k}, cần nhẹ tay với ${weak.k}. ${moon.name}.`
    });
  }

  function init() {
    if (!$('signGrid')) return;
    buildGrid();

    $('btnFindSign').onclick = () => {
      const dob = $('signDob').value;
      if (!dob) return Sh.toast('Bạn chọn ngày sinh giúp mình nhé.', true);
      const [, m, d] = dob.split('-').map(Number);
      show(L.signOf(m, d));
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
