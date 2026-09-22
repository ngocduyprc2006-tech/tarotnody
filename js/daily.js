/* ============================================================
   daily.js — Lá bài hôm nay
   Cùng một ngày thì luôn ra cùng một lá, kể cả khi tải lại trang.
   Làm được thế nhờ bộ sinh ngẫu nhiên có hạt giống = ngày + người.
   ============================================================ */

(function () {
  'use strict';
  const D = window.DeckData, Sh = window.Shell;
  const $ = (id) => document.getElementById(id);
  const T = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);

  let picked = null;

  function whoAmI() {
    if (window.Nody && window.Nody.user) return window.Nody.user.uid;
    let g = Sh.store.get('guest', null);
    if (!g) { g = 'g' + Math.random().toString(36).slice(2, 10); Sh.store.set('guest', g); }
    return g;
  }

  function pickToday() {
    const day = Sh.today();
    const rnd = Sh.seeded(day + '·' + whoAmI());
    const card = D.all[Math.floor(rnd() * D.all.length)];
    const reversed = rnd() < 0.3;
    return { day, card, reversed };
  }

  /* ---------- Chuỗi ngày liên tiếp ---------- */
  function bumpStreak(day) {
    const s = Sh.store.get('streak', { last: null, n: 0 });
    if (s.last === day) return s.n;

    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yest = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0');

    s.n = (s.last === yest) ? s.n + 1 : 1;
    s.last = day;
    Sh.store.set('streak', s);
    return s.n;
  }

  function paintStreak() {
    const s = Sh.store.get('streak', { n: 0 });
    $('streakN').textContent = s.n || 0;
  }

  /* ---------- Lật lá ---------- */
  function reveal() {
    const el = $('dailyCard');
    if (el.classList.contains('turned')) return;
    el.classList.add('turned');

    const n = bumpStreak(picked.day);
    paintStreak();

    setTimeout(() => {
      const d = picked;
      const text = d.reversed ? d.card.rev : d.card.up;
      Sh.store.set('lastCard', { name: d.card.vi, img: d.card.img, reversed: !!d.reversed });

      $('dailyBody').innerHTML = `
        <div class="chips">
          <span class="chip">${d.card.vi}</span>
          <span class="chip alt">${d.reversed ? T('daily.rev') : T('daily.up')}</span>
          <span class="chip">${d.card.keys}</span>
        </div>
        <h3>${d.card.vi}</h3>
        <p class="tiny mute" style="margin-top:-8px">${d.card.name}</p>
        <p>${text}</p>
        <h4>${T('daily.taskTitle')}</h4>
        <p>${todayTask(d)}</p>
        <blockquote>${closing(n)}</blockquote>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">
          <button class="btn btn-ghost btn-sm" id="btnCopy">${T('daily.copy')}</button>
          <a class="btn btn-moon btn-sm" href="tarot.html">${T('daily.fullSpread')}</a>
        </div>`;
      $('dailyResult').classList.remove('hidden');

      $('btnCopy').onclick = () => {
        const txt = T('daily.copyText', { name: d.card.vi, dir: d.reversed ? T('read.reversedShort') : T('read.uprightShort'), text });
        navigator.clipboard?.writeText(txt)
          .then(() => Sh.toast(T('daily.copied')))
          .catch(() => Sh.toast(T('daily.copyFail'), true));
      };

      Sh.log({
        kind: 'daily',
        title: T('daily.logTitle', { day: d.day }),
        summary: d.card.vi + ' — ' + text,
        drawnCards: [{ name: d.card.name, vi: d.card.vi, isReversed: d.reversed }]
      });
    }, 620);
  }

  function todayTask(d) {
    const tasks = {
      wands:     T('daily.task.wands'),
      cups:      T('daily.task.cups'),
      swords:    T('daily.task.swords'),
      pentacles: T('daily.task.pentacles')
    };
    if (d.card.suit) return tasks[d.card.suit];
    return d.reversed ? T('daily.task.majorRev') : T('daily.task.majorUp');
  }

  function closing(n) {
    if (n >= 7) return T('daily.closing.week', { n });
    if (n >= 3) return T('daily.closing.some', { n });
    return T('daily.closing.first');
  }

  function paintCard() {
    $('dailyCard').innerHTML = `
      <div class="face rear">${Sh.sigil(picked.day.length * 7 + picked.card.seed, 'var(--moon)')}</div>
      <div class="face front">
        ${D.imgTag(picked.card, picked.reversed ? 'upside' : '')}
        <div class="card-strip">
          <div class="nm">${picked.card.vi}</div>
          <div class="or${picked.reversed ? ' rev' : ''}">${picked.reversed ? T('read.reversedShort') : T('read.uprightShort')}</div>
        </div>
      </div>`;
  }

  function init() {
    if (!$('dailyCard')) return;
    picked = pickToday();
    paintStreak();
    paintCard();

    $('dailyCard').onclick = reveal;
    $('btnReveal').onclick = reveal;

    // đã lật hôm nay rồi thì mở luôn cho khỏi phải bấm lại
    const seen = Sh.store.get('dailySeen', null);
    if (seen === picked.day) setTimeout(reveal, 400);
    Sh.store.set('dailySeen', picked.day);

    window.addEventListener('nody:lang', () => {
      if (!$('dailyCard').classList.contains('turned')) paintCard();
      else reveal.calledOnce = true; // đã lật rồi thì để nguyên nội dung phiên hiện tại
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
