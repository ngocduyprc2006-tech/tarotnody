/* ============================================================
   dream.js — Giải mã giấc mơ
   Dò biểu tượng trong đoạn bạn kể, gắn với cảm xúc, rồi rút thêm
   một lá bài làm lời gợi ý khép lại.
   ============================================================ */

(function () {
  'use strict';
  const B = window.DreamBook, D = window.DeckData, Sh = window.Shell;
  const $ = (id) => document.getElementById(id);
  const T = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);

  function interpret(text) {
    const { symbols, mood, generic } = B.lookup(text);
    const rnd = Sh.seeded(text.slice(0, 80));
    const card = D.all[Math.floor(rnd() * D.all.length)];
    const reversed = rnd() < 0.3;

    let html = '';

    if (symbols.length) {
      html += `<div class="chips">${symbols.map(s => `<span class="chip">${s.name}</span>`).join('')}
        ${mood ? `<span class="chip alt">${T('dream.mood')}: ${mood.name}</span>` : ''}</div>`;
      html += `<p>${T('dream.foundIntro', { n: symbols.length })}</p>`;

      symbols.slice(0, 4).forEach(s => {
        html += `<h4>${s.name}</h4><p>${s.mean}</p>
          <p class="poem" style="margin-top:-6px">${s.ask}</p>`;
      });
    } else {
      html += `<div class="chips">${mood ? `<span class="chip alt">${T('dream.mood')}: ${mood.name}</span>` : `<span class="chip">${T('dream.ownDream')}</span>`}</div>`;
      html += `<p>${generic.mean}</p><p class="poem">${generic.ask}</p>`;
    }

    if (mood) html += `<h4>${T('dream.aboutMood')}</h4><p>${mood.note}</p>`;

    html += `
      <h4>${T('dream.cardFor')}</h4>
      <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
        <div class="detail-img" style="width:96px">${D.imgTag(card, reversed ? 'upside' : '')}</div>
        <div style="flex:1;min-width:200px">
          <b style="color:var(--moon)">${card.vi}</b>
          <span class="tiny mute"> · ${reversed ? T('read.reversedShort') : T('read.uprightShort')}</span>
          <p style="margin-top:6px">${reversed ? card.rev : card.up}</p>
        </div>
      </div>

      <blockquote>${T('dream.disclaimer')}</blockquote>`;

    return { html, symbols, mood, card, reversed };
  }

  function init() {
    if (!$('btnDream')) return;

    // gợi ý vài biểu tượng cho người chưa biết viết gì
    $('dreamHints').innerHTML = B.SYMBOLS.slice(0, 12)
      .map(s => `<button class="chip" data-hint="${s.key[0]}">${s.name}</button>`).join('');
    $('dreamHints').querySelectorAll('[data-hint]').forEach(b => {
      b.onclick = () => {
        const ta = $('dreamText');
        ta.value = (ta.value ? ta.value.trim() + ', ' : T('dream.lastNight')) + b.dataset.hint;
        ta.focus();
      };
    });

    $('btnDream').onclick = () => {
      const text = $('dreamText').value.trim();
      if (text.length < 10) return Sh.toast(T('dream.errShort'), true);

      $('dreamResult').classList.remove('hidden');
      $('dreamBody').innerHTML = `<div class="thinking"><i></i><i></i><i></i> ${T('dream.thinking')}</div>`;
      $('dreamResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => {
        const r = interpret(text);
        $('dreamBody').innerHTML = r.html;
        Sh.log({
          kind: 'dream',
          title: T('nav.dream') + ' ' + new Date().toLocaleDateString('vi-VN'),
          question: text.slice(0, 300),
          summary: (r.symbols.map(s => s.name).join(', ') || T('dream.noSymbol')) + ' · ' + r.card.vi,
          drawnCards: [{ name: r.card.name, vi: r.card.vi, isReversed: r.reversed }]
        });
      }, 750);
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
