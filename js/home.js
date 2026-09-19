/* ============================================================
   home.js — trang chủ
   Vẽ pha trăng, lá bài mời gọi, và lưới công cụ.
   Muốn thêm một công cụ vào trang chủ: nối vào mảng TOOLS.
   ============================================================ */

(function () {
  'use strict';
  const Sh = window.Shell, D = window.DeckData;
  const $ = (id) => document.getElementById(id);

  const TOOLS = [
    { group: 'Bói bài', items: [
      { href: 'tarot.html',  glyph: '🃏', name: 'Trải bài Tarot', desc: '6 kiểu trải, từ một lá tới Thập tự Celtic', tag: 'Đầy đủ' },
      { href: 'daily.html',  glyph: '🌙', name: 'Lá bài hôm nay', desc: 'Một lá, một việc nhỏ để làm hôm nay', tag: 'Miễn phí', free: true }
    ]},
    { group: 'Ngày sinh & con số', items: [
      { href: 'numerology.html', glyph: '✦', name: 'Thần số học', desc: '5 chỉ số cốt lõi và năm cá nhân của bạn' },
      { href: 'horoscope.html',  glyph: '♒', name: 'Chiêm tinh', desc: 'Cung hoàng đạo và thời tiết tâm trạng hôm nay' },
      { href: 'match.html',      glyph: '🌸', name: 'Ghép đôi', desc: 'Hai cái tên, hai ngày sinh, một câu trả lời' }
    ]},
    { group: 'Nhẹ nhàng hơn', items: [
      { href: 'dream.html',  glyph: '☁',  name: 'Giải mã giấc mơ', desc: 'Kể lại giấc mơ, Cún lật sổ tay biểu tượng' },
      { href: 'wheel.html',  glyph: '🎡', name: 'Vòng quay Cún Nody', desc: 'Một lượt mỗi ngày, một lời nhắc dễ thương', tag: 'Miễn phí', free: true },
      { href: 'letter.html', glyph: '💌', name: 'Thư gửi mai sau', desc: 'Viết cho chính bạn của một năm nữa' }
    ]}
  ];

  function paintTools() {
    const box = $('homeTools');
    if (!box) return;
    box.innerHTML = TOOLS.map(g => `
      <h3 class="group-title">${g.group}</h3>
      <div class="tool-grid">
        ${g.items.map(t => `
          <a class="tool" href="${t.href}" data-tilt="9">
            ${t.tag ? `<span class="tag${t.free ? ' free' : ''}">${t.tag}</span>` : ''}
            <span class="glyph">${t.glyph}</span>
            <h3>${t.name}</h3>
            <p>${t.desc}</p>
          </a>`).join('')}
      </div>`).join('');
    if (window.Scene) window.Scene.autoTilt(box);
  }

  function paintMoon() {
    const box = $('moonPanel');
    if (!box) return;
    const m = Sh.moonPhase();

    // che khuất mặt trăng theo đúng pha: 0 = tối hẳn, .5 = tròn
    const cover = Math.abs(1 - m.frac * 2);   // 1 ở trăng non, 0 ở trăng tròn
    const shift = (m.frac < .5 ? -1 : 1) * cover * 92;

    box.innerHTML = `
      <div class="moon-disc"><span class="moon-shadow" style="transform:translateX(${shift}%)"></span></div>
      <div>
        <div class="label-sm">${Sh.moonGlyph(m.index)} ${m.name} · ngày thứ ${Math.round(m.age)} của chu kỳ</div>
        <h3>${m.advice.split('.')[0]}.</h3>
        <p>${m.advice.split('.').slice(1).join('.').trim() || 'Trăng đi hết một vòng mất khoảng 29 ngày rưỡi, và tâm trạng con người cũng có nhịp của nó.'}</p>
      </div>`;
  }

  function paintHeroCard() {
    const box = $('heroCard');
    if (!box) return;
    const rnd = Sh.seeded(Sh.today() + '·hero');
    const card = D.all[Math.floor(rnd() * D.all.length)];

    box.innerHTML = `
      ${Sh.sigil(card.seed + 3, 'var(--moon)')}
      <div class="hero-verse">“${card.vi}” — lá của hôm nay</div>`;
    box.querySelector('svg').classList.add('moon-face');
  }

  function init() {
    paintTools();
    paintMoon();
    paintHeroCard();

    const b = $('btnHomeAuth');
    if (b) b.onclick = () => {
      if (window.Nody && window.Nody.user) location.href = 'history.html';
      else Sh.openAuth('reg');
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
