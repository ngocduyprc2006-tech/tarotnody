/* ============================================================
   horoscope.js — Chiêm tinh nhẹ nhàng
   Tra cung từ ngày sinh, rồi ghép với pha trăng hôm nay để ra
   một bản đọc cho hôm nay. Cùng ngày thì cùng kết quả.
   ============================================================ */

(function () {
  'use strict';
  const L = window.Lore, Sh = window.Shell, LI = window.LoreI18N;
  const $ = (id) => document.getElementById(id);
  const T = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);
  const lang = () => (window.I18N ? window.I18N.get() : 'vi');

  const AREAS = [
    { k: 'Tình cảm',   key: 'love',   base: 62 },
    { k: 'Công việc',  key: 'work',   base: 66 },
    { k: 'Tiền bạc',   key: 'money',  base: 58 },
    { k: 'Sức khoẻ',   key: 'health', base: 64 },
    { k: 'Tinh thần',  key: 'spirit', base: 70 }
  ];

  const LUCKY_COLORS = {
    vi: ['xanh lam', 'ngọc lam', 'tím lam', 'trắng ngà', 'xanh dương đậm', 'xanh rêu', 'bạc ánh trăng'],
    en: ['azure blue', 'teal', 'lavender', 'ivory white', 'deep navy', 'moss green', 'moonlit silver'],
    zh: ['天蓝色', '青绿色', '薰衣草紫', '象牙白', '深藏青', '苔藓绿', '月光银'],
    ko: ['하늘색', '청록색', '라벤더', '아이보리 화이트', '짙은 남색', '이끼색 초록', '달빛 은색'],
    ja: ['スカイブルー', 'ティール', 'ラベンダー', 'アイボリー', 'ネイビー', 'モスグリーン', '月光シルバー']
  };

  function signName(z) {
    const n = LI && LI.zodiac[z.id] && LI.zodiac[z.id].name;
    return (n && n[lang()]) || z.vi;
  }
  function signTraitCare(z) {
    const row = LI && LI.zodiac[z.id] && LI.zodiac[z.id][lang()];
    return row ? [row.trait, row.care] : [z.trait, z.care];
  }
  function elementDay(z) {
    const row = LI && LI.elementDay[z.el] && LI.elementDay[z.el][lang()];
    return row || L.ELEMENT_DAY[z.el];
  }
  function areaLabel(a) {
    return T('horo.area.' + a.key);
  }

  function buildGrid() {
    $('signGrid').innerHTML = L.ZODIAC.map(z => `
      <button class="tool" data-tilt="8" data-sign="${z.id}">
        <span class="glyph">${z.sym}</span>
        <h3>${signName(z)}</h3>
        <p>${z.from[1]}/${z.from[0]} – ${z.to[1]}/${z.to[0]} · ${T('horo.element')} ${T('horo.el.' + z.el)}</p>
      </button>`).join('');

    $('signGrid').querySelectorAll('[data-sign]').forEach(b => {
      b.onclick = () => show(L.ZODIAC.find(z => z.id === b.dataset.sign));
    });
    if (window.Scene) window.Scene.autoTilt($('signGrid'));
  }

  let lastSign = null;

  function show(z) {
    lastSign = z;
    const moon = Sh.moonPhase();
    const rnd = Sh.seeded(Sh.today() + '·' + z.id);
    const day = elementDay(z);
    const colors = LUCKY_COLORS[lang()] || LUCKY_COLORS.vi;
    const [trait, care] = signTraitCare(z);

    const scores = AREAS.map(a => {
      const v = Math.round(a.base + (rnd() * 34 - 15) + (moon.frac > .45 && moon.frac < .55 ? 6 : 0));
      return { k: areaLabel(a), v: Math.max(38, Math.min(97, v)) };
    });

    const color = colors[Math.floor(rnd() * colors.length)];
    const hour = Math.floor(rnd() * 12) + 8;
    const best = scores.reduce((a, b) => a.v > b.v ? a : b);
    const weak = scores.reduce((a, b) => a.v < b.v ? a : b);

    $('signBody').innerHTML = `
      <div class="center" style="margin-bottom:18px">
        <div style="font-size:3rem;line-height:1">${z.sym}</div>
        <h3 style="margin-top:6px">${signName(z)}</h3>
        <p class="tiny mute">${T('horo.element')} ${T('horo.el.' + z.el)} · ${z.from[1]}/${z.from[0]} – ${z.to[1]}/${z.to[0]}</p>
      </div>

      <div class="chips">
        <span class="chip">${Sh.moonGlyph(moon.index)} ${moon.name}</span>
        <span class="chip alt">${T('horo.luckyColor')}: ${color}</span>
        <span class="chip alt">${T('horo.luckyHour')}: ${hour}h–${hour + 2}h</span>
      </div>

      <h4>${T('horo.whatKind')}</h4>
      <p>${trait} ${care}</p>

      <h4>${T('horo.today')}</h4>
      <p>${day[0]} ${day[1]} ${moon.advice}</p>

      <h4>${T('horo.areasToday')}</h4>
      ${scores.map(s => `
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:.86rem">
            <span>${s.k}</span><span class="mute">${s.v}%</span>
          </div>
          <div class="meter"><i style="width:0"></i></div>
        </div>`).join('')}

      <h4>${T('horo.inOneLine')}</h4>
      <p>${T('horo.summary', { best: best.k.toLowerCase(), weak: weak.k.toLowerCase() })}</p>

      <blockquote>${T('horo.disclaimer')}</blockquote>`;

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
      title: T('nav.horoscope') + ' · ' + signName(z),
      summary: `${signName(z)} ${Sh.today()} — ${best.k} / ${weak.k}. ${moon.name}.`
    });
  }

  function onLangChange() {
    buildGrid();
    if (lastSign && !$('signResult').classList.contains('hidden')) show(lastSign);
  }

  function init() {
    if (!$('signGrid')) return;
    buildGrid();

    $('btnFindSign').onclick = () => {
      const dob = $('signDob').value;
      if (!dob) return Sh.toast(T('horo.pickDob'), true);
      const [, m, d] = dob.split('-').map(Number);
      show(L.signOf(m, d));
    };

    window.addEventListener('nody:lang', onLangChange);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
