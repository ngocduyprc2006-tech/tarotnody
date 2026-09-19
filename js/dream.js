/* ============================================================
   dream.js — Giải mã giấc mơ
   Dò biểu tượng trong đoạn bạn kể, gắn với cảm xúc, rồi rút thêm
   một lá bài làm lời gợi ý khép lại.
   ============================================================ */

(function () {
  'use strict';
  const B = window.DreamBook, D = window.DeckData, Sh = window.Shell;
  const $ = (id) => document.getElementById(id);

  function interpret(text) {
    const { symbols, mood, generic } = B.lookup(text);
    const rnd = Sh.seeded(text.slice(0, 80));
    const card = D.all[Math.floor(rnd() * D.all.length)];
    const reversed = rnd() < 0.3;

    let html = '';

    if (symbols.length) {
      html += `<div class="chips">${symbols.map(s => `<span class="chip">${s.name}</span>`).join('')}
        ${mood ? `<span class="chip alt">cảm xúc: ${mood.name}</span>` : ''}</div>`;
      html += `<p>Trong đoạn bạn kể, Cún nhận ra ${symbols.length === 1 ? 'một biểu tượng' : symbols.length + ' biểu tượng'} quen thuộc. Đọc từng cái nhé.</p>`;

      symbols.slice(0, 4).forEach(s => {
        html += `<h4>${s.name}</h4><p>${s.mean}</p>
          <p class="poem" style="margin-top:-6px">${s.ask}</p>`;
      });
    } else {
      html += `<div class="chips">${mood ? `<span class="chip alt">cảm xúc: ${mood.name}</span>` : '<span class="chip">giấc mơ riêng của bạn</span>'}</div>`;
      html += `<p>${generic.mean}</p><p class="poem">${generic.ask}</p>`;
    }

    if (mood) html += `<h4>Về cảm xúc trong giấc mơ</h4><p>${mood.note}</p>`;

    html += `
      <h4>Một lá bài cho giấc mơ này</h4>
      <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
        <div class="detail-img" style="width:96px">${D.imgTag(card, reversed ? 'upside' : '')}</div>
        <div style="flex:1;min-width:200px">
          <b style="color:var(--moon)">${card.vi}</b>
          <span class="tiny mute"> · ${reversed ? 'ngược' : 'xuôi'}</span>
          <p style="margin-top:6px">${reversed ? card.rev : card.up}</p>
        </div>
      </div>

      <blockquote>Giấc mơ không phải lời tiên tri. Nó là cách tâm trí bạn dọn dẹp ban đêm —
      và đôi khi nó để lại một mẩu giấy nhắn.</blockquote>`;

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
        ta.value = (ta.value ? ta.value.trim() + ', ' : 'Đêm qua mình mơ thấy ') + b.dataset.hint;
        ta.focus();
      };
    });

    $('btnDream').onclick = () => {
      const text = $('dreamText').value.trim();
      if (text.length < 10) return Sh.toast('Kể thêm một chút nữa nhé, ít nhất một câu.', true);

      $('dreamResult').classList.remove('hidden');
      $('dreamBody').innerHTML = '<div class="thinking"><i></i><i></i><i></i> Cún đang lật sổ tay giấc mơ</div>';
      $('dreamResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => {
        const r = interpret(text);
        $('dreamBody').innerHTML = r.html;
        Sh.log({
          kind: 'dream',
          title: 'Giấc mơ ' + new Date().toLocaleDateString('vi-VN'),
          question: text.slice(0, 300),
          summary: (r.symbols.map(s => s.name).join(', ') || 'không rõ biểu tượng') + ' · lá ' + r.card.vi,
          drawnCards: [{ name: r.card.name, vi: r.card.vi, isReversed: r.reversed }]
        });
      }, 750);
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
