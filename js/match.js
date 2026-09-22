/* ============================================================
   match.js — Ghép đôi
   Điểm hợp được ghép từ ba lớp: số đường đời, hành của hai cung,
   và một lớp "duyên" cố định theo cặp tên (không đổi mỗi lần bấm).
   ============================================================ */

(function () {
  'use strict';
  const L = window.Lore, Sh = window.Shell, LI = window.LoreI18N;
  const $ = (id) => document.getElementById(id);
  const T = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);
  const lang = () => (window.I18N ? window.I18N.get() : 'vi');

  function signName(z) {
    const n = LI && LI.zodiac[z.id] && LI.zodiac[z.id].name;
    return (n && n[lang()]) || z.vi;
  }
  function elName(el) { return T('horo.el.' + el); }

  /* Hành nào hợp hành nào */
  const ELEM_FIT = {
    'Lửa-Lửa': 82, 'Lửa-Khí': 90, 'Lửa-Đất': 58, 'Lửa-Nước': 52,
    'Khí-Khí': 80, 'Khí-Đất': 56, 'Khí-Nước': 60,
    'Đất-Đất': 84, 'Đất-Nước': 88,
    'Nước-Nước': 83
  };
  const fitOf = (a, b) => ELEM_FIT[a + '-' + b] ?? ELEM_FIT[b + '-' + a] ?? 65;

  /* Số đường đời hợp nhau */
  function numFit(a, b) {
    const ra = L.reduce(a), rb = L.reduce(b);
    if (ra === rb) return 86;
    const pairs = { '1-5': 88, '2-6': 92, '3-9': 90, '4-8': 89, '1-3': 84, '2-4': 80, '5-7': 82, '6-9': 87, '7-9': 78 };
    const k1 = ra + '-' + rb, k2 = rb + '-' + ra;
    if (pairs[k1] || pairs[k2]) return pairs[k1] || pairs[k2];
    const gap = Math.abs(ra - rb);
    return 62 + (gap % 3) * 7;
  }

  function lifePath(dob) {
    const [y, m, d] = dob.split('-').map(Number);
    return L.reduce(L.reduce(d) + L.reduce(m) + L.reduce(y));
  }

  function run(a, b) {
    const za = L.signOf(+a.dob.split('-')[1], +a.dob.split('-')[2]);
    const zb = L.signOf(+b.dob.split('-')[1], +b.dob.split('-')[2]);
    const la = lifePath(a.dob), lb = lifePath(b.dob);

    const elem = fitOf(za.el, zb.el);
    const nums = numFit(la, lb);

    // lớp duyên: cố định theo cặp tên, xếp thứ tự để A-B và B-A ra cùng kết quả
    const key = [L.deaccent(a.name), L.deaccent(b.name)].sort().join('|');
    const rnd = Sh.seeded(key);
    const fate = 55 + Math.round(rnd() * 40);

    const total = Math.round(elem * 0.3 + nums * 0.4 + fate * 0.3);

    return { a, b, za, zb, la, lb, elem, nums, fate, total };
  }

  function verdict(n) {
    if (n >= 88) return [T('match.v0.title'), T('match.v0.text')];
    if (n >= 76) return [T('match.v1.title'), T('match.v1.text')];
    if (n >= 62) return [T('match.v2.title'), T('match.v2.text')];
    if (n >= 48) return [T('match.v3.title'), T('match.v3.text')];
    return [T('match.v4.title'), T('match.v4.text')];
  }

  function render(r) {
    const [title, text] = verdict(r.total);
    const C = 2 * Math.PI * 70;

    $('matchBody').innerHTML = `
      <div class="score-ring">
        <svg viewBox="0 0 160 160" width="168" height="168">
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--line-soft)" stroke-width="9"/>
          <circle id="ringArc" cx="80" cy="80" r="70" fill="none" stroke="var(--moon)" stroke-width="9"
                  stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"
                  style="transition:stroke-dashoffset 1.3s var(--ease)"/>
        </svg>
        <span class="val">${r.total}%</span>
      </div>

      <div class="center"><h3>${title}</h3><p>${text}</p></div>

      <div class="chips" style="justify-content:center;margin-top:18px">
        <span class="chip">${r.za.sym} ${r.a.name} · ${signName(r.za)}</span>
        <span class="chip alt">${r.zb.sym} ${r.b.name} · ${signName(r.zb)}</span>
      </div>

      <div class="stat-grid">
        <div class="stat"><div class="n">${r.elem}%</div><div class="k">${T('horo.element')} ${elName(r.za.el)} × ${elName(r.zb.el)}</div></div>
        <div class="stat"><div class="n">${r.nums}%</div><div class="k">${T('num.number')} ${r.la} × ${r.lb}</div></div>
        <div class="stat"><div class="n">${r.fate}%</div><div class="k">${T('match.nameFate')}</div></div>
      </div>

      <h4>${T('match.strongWhere')}</h4>
      <p>${strength(r)}</p>

      <h4>${T('match.frictionWhere')}</h4>
      <p>${friction(r)}</p>

      <h4>${T('match.weekTask')}</h4>
      <p>${advice(r)}</p>

      <blockquote>${T('match.disclaimer')}</blockquote>`;

    $('matchResult').classList.remove('hidden');
    setTimeout(() => {
      const arc = $('ringArc');
      if (arc) arc.style.strokeDashoffset = C * (1 - r.total / 100);
    }, 120);
    $('matchResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    Sh.log({
      kind: 'match',
      title: T('nav.match') + ` · ${r.a.name} & ${r.b.name}`,
      summary: `${r.total}% — ${title}. ${signName(r.za)} (${elName(r.za.el)}) × ${signName(r.zb)} (${elName(r.zb.el)}), ${T('num.lifePathShort')} ${r.la} × ${r.lb}.`
    });
  }

  function strength(r) {
    if (r.za.el === r.zb.el) return T('match.strength.sameEl', { el: elName(r.za.el) });
    if (r.elem >= 85) return T('match.strength.feedEl', { elA: elName(r.za.el), elB: elName(r.zb.el) });
    if (r.nums >= 85) return T('match.strength.numComplement', { la: r.la, lb: r.lb });
    return T('match.strength.different', { a: r.a.name, elA: elName(r.za.el).toLowerCase(), b: r.b.name, elB: elName(r.zb.el).toLowerCase() });
  }

  function friction(r) {
    if (r.elem < 60) return T('match.friction.elemGap', { elA: elName(r.za.el), elB: elName(r.zb.el) });
    if (Math.abs(L.reduce(r.la) - L.reduce(r.lb)) >= 5) return T('match.friction.numGap');
    return T('match.friction.bothTired');
  }

  function advice(r) {
    const list = [T('match.advice.0'), T('match.advice.1'), T('match.advice.2'), T('match.advice.3')];
    const rnd = Sh.seeded(L.deaccent(r.a.name + r.b.name));
    return list[Math.floor(rnd() * list.length)];
  }

  function init() {
    if (!$('btnMatch')) return;
    $('btnMatch').onclick = () => {
      const a = { name: $('mA').value.trim(), dob: $('mADob').value };
      const b = { name: $('mB').value.trim(), dob: $('mBDob').value };
      if (!a.name || !b.name) return Sh.toast(T('match.errName'), true);
      if (!a.dob || !b.dob)   return Sh.toast(T('match.errDob'), true);
      render(run(a, b));
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
