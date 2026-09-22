/* ============================================================
   numerology.js — Thần số học
   Tính 5 chỉ số chính + năm cá nhân từ họ tên và ngày sinh.
   Công thức Pythagoras, có giữ số bậc thầy 11/22/33.
   ============================================================ */

(function () {
  'use strict';
  const L = window.Lore, Sh = window.Shell, LI = window.LoreI18N;
  const $ = (id) => document.getElementById(id);
  const T = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);
  const lang = () => (window.I18N ? window.I18N.get() : 'vi');

  function numOf(n) {
    const row = LI && LI.numbers[n] && LI.numbers[n][lang()];
    return row || L.num(n);
  }

  function roleLabel(role) {
    const lg = lang();
    if (lg === 'vi' || !LI) return { name: role.name, note: role.note };
    if (lg === 'en') return { name: LI.numRoles[role.key], note: LI.numRoles.en ? LI.numRoles.en : role.note };
    return { name: role.name, note: role.note };
  }

  // Bảng nhãn vai trò theo ngôn ngữ — tách riêng cho rõ vì cấu trúc
  // dữ liệu gốc (LI.numRoles) gộp theo ngôn ngữ, không theo vai trò.
  function roleName(role) {
    const lg = lang();
    if (lg === 'vi' || !LI) return role.name;
    const table = { en: LI.numRoles.en, zh: LI.numRoles.zh, ko: LI.numRoles.ko, ja: LI.numRoles.ja };
    const t = table[lg];
    return (t && t[role.key]) || role.name;
  }
  function roleNote(role) {
    const lg = lang();
    if (lg === 'vi' || !LI) return role.note;
    if (lg === 'en') return (LI.numRoles.en && LI.numRoles.en.note) || role.note; // unused fallback
    const table = { zh: LI.numRoles.zhNote, ko: LI.numRoles.koNote, ja: LI.numRoles.jaNote };
    const t = table[lg];
    return (t && t[role.key]) || role.note;
  }
  const EN_ROLE_NOTE = {
    life: 'the main lesson of your whole life', soul: 'what you truly long for',
    person: 'the impression others get from you', expr: 'the ability you bring into the world',
    birth: 'your innate gift'
  };
  function roleNoteFinal(role) {
    if (lang() === 'en') return EN_ROLE_NOTE[role.key] || role.note;
    return roleNote(role);
  }

  function personalYearText(py) {
    const row = LI && LI.personalYear[py] && LI.personalYear[py][lang()];
    return row || L.PERSONAL_YEAR[py] || L.PERSONAL_YEAR[9];
  }

  function compute(name, dob) {
    const [y, m, d] = dob.split('-').map(Number);

    // Đường đời: cộng dồn ngày + tháng + năm, mỗi phần rút gọn trước
    const life = L.reduce(L.reduce(d, true) + L.reduce(m, true) + L.reduce(y, true), true);

    const soul   = L.nameNumber(name, 'soul');
    const person = L.nameNumber(name, 'person');
    const expr   = L.nameNumber(name, 'all');
    const birth  = L.reduce(d, true);

    const thisYear = new Date().getFullYear();
    const py = L.reduce(L.reduce(d) + L.reduce(m) + L.reduce(thisYear));

    return { life, soul, person, expr, birth, py, thisYear, name, dob, y, m, d };
  }

  function card(num, role) {
    const info = numOf(num);
    return `
      <div style="margin-bottom:22px">
        <h4 style="margin-top:0">${roleName(role)} · ${T('num.number')} ${num}</h4>
        <p class="tiny mute" style="margin:-4px 0 8px">${roleNoteFinal(role)}</p>
        <p><b style="color:var(--moon)">${info[0]}.</b> ${info[1]}</p>
      </div>`;
  }

  function render(r) {
    const life = numOf(r.life);

    $('numBody').innerHTML = `
      <div class="center" style="margin-bottom:6px">
        <span class="big-num">${r.life}</span>
        <p class="poem" style="margin-top:6px">${life[0]} — ${T('num.lifePathOf')}</p>
      </div>

      <div class="stat-grid">
        <div class="stat"><div class="n">${r.soul}</div><div class="k">${roleName(L.NUM_ROLES[1])}</div></div>
        <div class="stat"><div class="n">${r.person}</div><div class="k">${roleName(L.NUM_ROLES[2])}</div></div>
        <div class="stat"><div class="n">${r.expr}</div><div class="k">${roleName(L.NUM_ROLES[3])}</div></div>
        <div class="stat"><div class="n">${r.birth}</div><div class="k">${roleName(L.NUM_ROLES[4])}</div></div>
        <div class="stat"><div class="n">${r.py}</div><div class="k">${T('num.year')} ${r.thisYear}</div></div>
      </div>

      <h4>${roleName(L.NUM_ROLES[0])} ${T('num.number')} ${r.life}</h4>
      <p><b style="color:var(--moon)">${life[0]}.</b> ${life[1]}</p>

      ${card(r.soul,   L.NUM_ROLES[1])}
      ${card(r.person, L.NUM_ROLES[2])}
      ${card(r.expr,   L.NUM_ROLES[3])}
      ${card(r.birth,  L.NUM_ROLES[4])}

      <h4>${T('num.personalYearOf', { year: r.thisYear })}: ${T('num.number')} ${r.py}</h4>
      <p>${personalYearText(r.py)}</p>

      <h4>${T('num.whenMeet')}</h4>
      <p>${blend(r)}</p>

      <blockquote>${T('num.disclaimer')}</blockquote>`;

    $('numResult').classList.remove('hidden');
    $('numResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    Sh.log({
      kind: 'numerology',
      title: T('nav.numerology') + ' · ' + r.name,
      summary: `${T('num.lifePathShort')} ${r.life}, ${roleName(L.NUM_ROLES[1])} ${r.soul}, ${roleName(L.NUM_ROLES[2])} ${r.person}, ${roleName(L.NUM_ROLES[3])} ${r.expr}, ${T('num.year')} ${r.py}.`
    });
  }

  function blend(r) {
    if (r.soul === r.person) return T('num.blend.soulPersonSame');
    if (r.life === r.expr) return T('num.blend.lifeExprSame');
    if ([11, 22, 33].includes(r.life) || [11, 22, 33].includes(r.expr)) return T('num.blend.master');
    if (Math.abs(r.soul - r.person) >= 4) return T('num.blend.farApart');
    return T('num.blend.default');
  }

  let lastResult = null;

  function init() {
    if (!$('btnNum')) return;

    $('btnNum').onclick = () => {
      const name = $('numName').value.trim();
      const dob = $('numDob').value;
      if (!name) return Sh.toast(T('num.errName'), true);
      if (!dob)  return Sh.toast(T('num.errDob'), true);
      if (L.deaccent(name).length < 2) return Sh.toast(T('num.errNameShort'), true);
      lastResult = compute(name, dob);
      render(lastResult);
    };

    $('numName').addEventListener('keydown', e => { if (e.key === 'Enter') $('btnNum').click(); });

    window.addEventListener('nody:lang', () => {
      if (lastResult && !$('numResult').classList.contains('hidden')) render(lastResult);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
