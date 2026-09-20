/* ============================================================
   data/deck-localize.js — dán bản dịch vào từng lá bài
   ------------------------------------------------------------
   Mẹo kỹ thuật: biến card.vi / card.keys / card.up / card.rev
   thành "getter" — mỗi lần trang đọc card.vi, nó tự trả về đúng
   bản dịch theo ngôn ngữ đang bật (I18N.get()), không cần sửa
   một dòng nào trong tarot.js / daily.js / wheel.js / history.js…
   Tiếng Việt gốc trong deck.js không hề bị mất, chỉ là lớp phủ.
   ============================================================ */
(function () {
  'use strict';
  if (!window.DeckData || !window.DeckI18N) return;
  const D = window.DeckI18N;

  function lang() { return (window.I18N && window.I18N.get()) || 'vi'; }

  function majorRow(card) {
    const m = D.major[card.number];
    if (!m) return null;
    const l = lang();
    return m[l] || m.en || null;
  }
  function minorRow(card) {
    const arr = D.minor[card.suit];
    const mi = arr && arr[card.number - 1];
    if (!mi) return null;
    const l = lang();
    return mi[l] || mi.en || null;
  }
  function suitRow(card) {
    const s = D.suits[card.suit];
    if (!s) return null;
    const l = lang();
    return s[l] || s.en || null;
  }

  window.DeckData.all.forEach(card => {
    const baseVi = card.vi, baseUp = card.up, baseRev = card.rev, baseKeys = card.keys;

    Object.defineProperty(card, 'vi', {
      configurable: true,
      get() {
        const l = lang();
        if (l === 'vi') return baseVi;
        if (card.type === 'major') {
          if (l === 'en') return card.name;
          const idx = card.number;
          const names = D.majorNames[l];
          return (names && names[idx]) || baseVi;
        }
        const ranks = D.ranks[l] || D.ranks.en;
        const sl = suitRow(card);
        const rankName = ranks && ranks[card.number - 1];
        if (l === 'en') return card.name;
        return (rankName && sl) ? (rankName + ' ' + sl.name) : baseVi;
      }
    });

    Object.defineProperty(card, 'keys', {
      configurable: true,
      get() {
        const l = lang();
        if (l === 'vi') return baseKeys;
        if (card.type === 'major') {
          const row = majorRow(card);
          return row ? row.keys : baseKeys;
        }
        const sl = suitRow(card);
        return sl ? (sl.el + ' · ' + sl.domain) : baseKeys;
      }
    });

    Object.defineProperty(card, 'up', {
      configurable: true,
      get() {
        const l = lang();
        if (l === 'vi') return baseUp;
        const row = card.type === 'major' ? majorRow(card) : minorRow(card);
        return row ? row.up : baseUp;
      }
    });

    Object.defineProperty(card, 'rev', {
      configurable: true,
      get() {
        const l = lang();
        if (l === 'vi') return baseRev;
        const row = card.type === 'major' ? majorRow(card) : minorRow(card);
        return row ? row.rev : baseRev;
      }
    });
  });

  /* Khi đổi ngôn ngữ, phát tín hiệu để các trang đang mở vẽ lại nếu cần */
  window.addEventListener('nody:lang', () => {
    window.dispatchEvent(new CustomEvent('nody:deck-lang'));
  });
})();
