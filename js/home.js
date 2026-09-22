/* ============================================================
   home.js — trang chủ
   Vẽ pha trăng, lá bài mời gọi, và lưới công cụ.
   Muốn thêm một công cụ vào trang chủ: nối vào mảng TOOLS.
   ============================================================ */

(function () {
  'use strict';
  const Sh = window.Shell, D = window.DeckData;
  const $ = (id) => document.getElementById(id);
  const T = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);

  function TOOLS() {
    return [
      { group: T('home.group.divination'), items: [
        { href: 'tarot.html',  glyph: '🃏', name: T('nav.tarot'), desc: T('home.desc.tarot'), tag: T('home.tag.full') },
        { href: 'daily.html',  glyph: '🌙', name: T('nav.daily'), desc: T('home.desc.daily'), tag: T('home.tag.free'), free: true }
      ]},
      { group: T('home.group.birth'), items: [
        { href: 'numerology.html', glyph: '✦', name: T('nav.numerology'), desc: T('home.desc.numerology') },
        { href: 'horoscope.html',  glyph: '♒', name: T('nav.horoscope'), desc: T('home.desc.horoscope') },
        { href: 'match.html',      glyph: '🌸', name: T('nav.match'), desc: T('home.desc.match') }
      ]},
      { group: T('home.group.gentle'), items: [
        { href: 'dream.html',  glyph: '☁',  name: T('nav.dream'), desc: T('home.desc.dream') },
        { href: 'wheel.html',  glyph: '🎡', name: T('nav.wheel') + ' Nody', desc: T('home.desc.wheel'), tag: T('home.tag.free'), free: true },
        { href: 'letter.html', glyph: '💌', name: T('nav.letter'), desc: T('home.desc.letter') }
      ]}
    ];
  }

  function paintTools() {
    const box = $('homeTools');
    if (!box) return;
    box.innerHTML = TOOLS().map(g => `
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
        <div class="label-sm">${Sh.moonGlyph(m.index)} ${m.name} · ${T('home.moon.dayOf', { n: Math.round(m.age) })}</div>
        <h3>${m.advice.split('.')[0]}.</h3>
        <p>${m.advice.split('.').slice(1).join('.').trim() || T('home.moon.fallback')}</p>
      </div>`;
  }

  function paintHeroCard() {
    const box = $('heroCard');
    if (!box) return;
    const rnd = Sh.seeded(Sh.today() + '·hero');
    const card = D.all[Math.floor(rnd() * D.all.length)];

    box.innerHTML = `
      ${Sh.sigil(card.seed + 3, 'var(--moon)')}
      <div class="hero-verse">“${card.vi}” — ${T('home.hero.today')}</div>`;
    box.querySelector('svg').classList.add('moon-face');
  }

  function paintAll() {
    paintTools();
    paintMoon();
    paintHeroCard();
  }

  function init() {
    paintAll();

    const b = $('btnHomeAuth');
    if (b) b.onclick = () => {
      if (window.Nody && window.Nody.user) location.href = 'history.html';
      else Sh.openAuth('reg');
    };
  }

  window.addEventListener('nody:lang', paintAll);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
