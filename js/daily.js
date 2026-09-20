/* ============================================================
   daily.js — Lá bài hôm nay
   Cùng một ngày thì luôn ra cùng một lá, kể cả khi tải lại trang.
   Làm được thế nhờ bộ sinh ngẫu nhiên có hạt giống = ngày + người.
   ============================================================ */

(function () {
  'use strict';
  const D = window.DeckData, Sh = window.Shell;
  const $ = (id) => document.getElementById(id);

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
          <span class="chip alt">${d.reversed ? 'nằm ngược' : 'nằm xuôi'}</span>
          <span class="chip">${d.card.keys}</span>
        </div>
        <h3>${d.card.vi}</h3>
        <p class="tiny mute" style="margin-top:-8px">${d.card.name}</p>
        <p>${text}</p>
        <h4>Một việc nhỏ cho hôm nay</h4>
        <p>${todayTask(d)}</p>
        <blockquote>${closing(n)}</blockquote>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">
          <button class="btn btn-ghost btn-sm" id="btnCopy">Chép thông điệp</button>
          <a class="btn btn-moon btn-sm" href="tarot.html">Trải bài đầy đủ</a>
        </div>`;
      $('dailyResult').classList.remove('hidden');

      $('btnCopy').onclick = () => {
        const txt = `Lá bài hôm nay của mình: ${d.card.vi} (${d.reversed ? 'ngược' : 'xuôi'})\n${text}\n— Nody Tarot`;
        navigator.clipboard?.writeText(txt)
          .then(() => Sh.toast('Đã chép, bạn dán đi đâu cũng được 🌙'))
          .catch(() => Sh.toast('Trình duyệt không cho chép. Bạn bôi đen rồi copy tay nhé.', true));
      };

      Sh.log({
        kind: 'daily',
        title: 'Lá bài ngày ' + d.day,
        summary: d.card.vi + ' — ' + text,
        drawnCards: [{ name: d.card.name, vi: d.card.vi, isReversed: d.reversed }]
      });
    }, 620);
  }

  function todayTask(d) {
    const tasks = {
      wands:     'Làm một việc bạn đã hoãn ba lần. Chỉ mười lăm phút thôi, không cần xong.',
      cups:      'Nhắn cho một người bạn nghĩ tới hôm nay. Không cần lý do gì cả.',
      swords:    'Viết ra ba dòng về điều đang làm bạn rối. Viết tay càng tốt.',
      pentacles: 'Dọn một góc nhỏ: bàn làm việc, ví tiền, hoặc màn hình điện thoại.'
    };
    if (d.card.suit) return tasks[d.card.suit];
    return d.reversed
      ? 'Hôm nay xin phép làm ít lại một chút. Bỏ một việc khỏi danh sách và đừng áy náy.'
      : 'Chọn một việc quan trọng nhất hôm nay rồi làm nó trước tiên, trước khi mở tin nhắn.';
  }

  function closing(n) {
    if (n >= 7) return `Bạn đã ghé đây ${n} ngày liền. Nody nhớ mặt bạn rồi đó 🐾`;
    if (n >= 3) return `${n} ngày liên tiếp rồi. Một thói quen nhỏ đang thành hình.`;
    return 'Mai ghé lại nhé, lá bài sẽ đổi khi trời sáng.';
  }

  function init() {
    if (!$('dailyCard')) return;
    picked = pickToday();
    paintStreak();

    $('dailyCard').innerHTML = `
      <div class="face rear">${Sh.sigil(picked.day.length * 7 + picked.card.seed, 'var(--moon)')}</div>
      <div class="face front">
        ${D.imgTag(picked.card, picked.reversed ? 'upside' : '')}
        <div class="card-strip">
          <div class="nm">${picked.card.vi}</div>
          <div class="or${picked.reversed ? ' rev' : ''}">${picked.reversed ? 'ngược' : 'xuôi'}</div>
        </div>
      </div>`;

    $('dailyCard').onclick = reveal;
    $('btnReveal').onclick = reveal;

    // đã lật hôm nay rồi thì mở luôn cho khỏi phải bấm lại
    const seen = Sh.store.get('dailySeen', null);
    if (seen === picked.day) setTimeout(reveal, 400);
    Sh.store.set('dailySeen', picked.day);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
