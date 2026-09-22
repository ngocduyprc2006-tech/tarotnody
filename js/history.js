/* ============================================================
   history.js — Hồ sơ & lịch sử xem bói
   Đọc từ collection "readings" (giữ nguyên tên cũ), lọc theo loại,
   sắp xếp ở phía trình duyệt nên không cần tạo index Firestore.
   ============================================================ */

(function () {
  'use strict';
  const Sh = window.Shell;
  const $ = (id) => document.getElementById(id);
  const T = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);
  const LOCALE = { vi: 'vi-VN', en: 'en-US', zh: 'zh-CN', ko: 'ko-KR', ja: 'ja-JP' };
  const locale = () => LOCALE[(window.I18N && window.I18N.get()) || 'vi'] || 'vi-VN';

  function KIND() {
    return {
      tarot:      { icon: '🃏', name: T('nav.tarot') },
      daily:      { icon: '🌙', name: T('nav.daily') },
      numerology: { icon: '✦',  name: T('nav.numerology') },
      horoscope:  { icon: '♒',  name: T('nav.horoscope') },
      match:      { icon: '🌸', name: T('nav.match') },
      dream:      { icon: '☁',  name: T('nav.dream') },
      wheel:      { icon: '🎡', name: T('nav.wheel') }
    };
  }

  let rows = [];
  let filter = 'all';

  /* ---------- Phần hồ sơ ---------- */
  function paintProfile(user) {
    const box = $('profileBox');
    if (!user) {
      box.innerHTML = `
        <div class="empty">
          ${Sh.pupSVG()}
          <h3 style="margin-bottom:8px">${T('hist.noOne')}</h3>
          <p>${T('hist.loginToView')}</p>
          <button class="btn btn-moon" id="btnLoginHere" style="margin-top:14px">${T('hist.loginOrSignup')}</button>
        </div>`;
      $('btnLoginHere').onclick = () => Sh.openAuth('login');
      $('logBox').innerHTML = '';
      $('filterBar').classList.add('hidden');
      return;
    }

    const name = user.displayName || (user.email || '').split('@')[0] || T('hist.you');
    box.innerHTML = `
      <div class="profile-head">
        <span class="avatar">${name.charAt(0).toUpperCase()}</span>
        <div style="flex:1;min-width:180px">
          <h2>${escapeHTML(name)}</h2>
          <div class="mail">${escapeHTML(user.email || T('hist.loggedViaGoogle'))}</div>
        </div>
        <div style="display:flex;gap:9px;flex-wrap:wrap">
          <button class="btn btn-ghost btn-sm" id="btnRename">${T('hist.rename')}</button>
          <button class="btn btn-ghost btn-sm" id="btnLogout">${T('auth.logout')}</button>
        </div>
      </div>`;

    $('btnRename').onclick = async () => {
      const v = prompt(T('hist.renamePrompt'), name);
      if (!v || !v.trim()) return;
      try { await window.Nody.renameMe(v); Sh.toast(T('hist.renamed')); }
      catch (e) { Sh.toast(T('hist.renameFail'), true); }
    };

    $('btnLogout').onclick = async () => {
      await window.Nody.logout();
      Sh.toast(T('hist.loggedOut'));
    };

    $('filterBar').classList.remove('hidden');
    loadLog();
  }

  /* ---------- Lịch sử ---------- */
  async function loadLog() {
    const box = $('logBox');
    box.innerHTML = `<div class="thinking"><i></i><i></i><i></i> ${T('hist.loading')}</div>`;
    try {
      rows = await window.Nody.myReadings();
      paintLog();
    } catch (e) {
      console.warn(e);
      box.innerHTML = `<div class="empty"><p>${T('hist.loadFail')}</p></div>`;
    }
  }

  function paintLog() {
    const box = $('logBox');
    const list = filter === 'all' ? rows : rows.filter(r => (r.kind || 'tarot') === filter);
    const K = KIND();

    $('logCount').textContent = rows.length ? T('hist.savedCount', { n: rows.length }) : '';

    if (!list.length) {
      box.innerHTML = `<div class="empty">${Sh.pupSVG()}
        <p>${rows.length ? T('hist.emptyFilter') : T('hist.emptyAll')}</p>
        <a class="btn btn-moon btn-sm" href="tarot.html" style="margin-top:12px">${T('hist.spreadNow')}</a></div>`;
      return;
    }

    box.innerHTML = list.map(r => {
      const k = K[r.kind || 'tarot'] || K.tarot;
      const cards = (r.drawnCards || [])
        .map(c => (c.vi || c.name) + (c.isReversed ? ' (' + T('read.reversedShort') + ')' : ''))
        .join(' · ');
      return `
        <div class="log-item">
          <div class="log-kind" title="${k.name}">${k.icon}</div>
          <div>
            <h4>${escapeHTML(r.title || k.name)}</h4>
            ${cards ? `<div class="cards">${escapeHTML(cards)}</div>` : ''}
            ${r.question ? `<div class="cards poem">“${escapeHTML(String(r.question).slice(0, 160))}”</div>` : ''}
            ${r.summary ? `<div class="cards mute tiny">${escapeHTML(String(r.summary).slice(0, 220))}</div>` : ''}
          </div>
          <div style="text-align:right">
            <div class="when">${fmt(r.when)}</div>
            <button class="btn-quiet tiny" data-del="${r.id}">${T('common.delete')}</button>
          </div>
        </div>`;
    }).join('');

    box.querySelectorAll('[data-del]').forEach(b => {
      b.onclick = async () => {
        if (!confirm(T('hist.confirmDelete'))) return;
        try {
          await window.Nody.deleteReading(b.dataset.del);
          rows = rows.filter(r => r.id !== b.dataset.del);
          paintLog();
          Sh.toast(T('letter.deleted'));
        } catch (e) { Sh.toast(T('hist.deleteFail'), true); }
      };
    });
  }

  function fmt(d) {
    if (!d || d.getTime() === 0) return '';
    const diff = (Date.now() - d) / 86400000;
    if (diff < 1) return T('hist.today');
    if (diff < 2) return T('hist.yesterday');
    if (diff < 7) return T('hist.daysAgo', { n: Math.floor(diff) });
    return d.toLocaleDateString(locale(), { day: 'numeric', month: 'numeric', year: 'numeric' });
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  }

  function paintFilterBar() {
    const K = KIND();
    $('filterBar').innerHTML =
      `<button class="chip" data-f="all">${T('hist.all')}</button>` +
      Object.keys(K).map(k => `<button class="chip" data-f="${k}">${K[k].icon} ${K[k].name}</button>`).join('');

    $('filterBar').querySelectorAll('[data-f]').forEach(b => {
      if (b.dataset.f === filter) b.style.borderColor = 'var(--moon)';
      b.onclick = () => {
        filter = b.dataset.f;
        $('filterBar').querySelectorAll('[data-f]').forEach(x =>
          x.style.borderColor = x === b ? 'var(--moon)' : '');
        paintLog();
      };
    });
  }

  function init() {
    if (!$('profileBox')) return;

    paintFilterBar();

    paintProfile(window.Nody && window.Nody.user);
    window.addEventListener('nody:auth', (e) => paintProfile(e.detail));
    window.addEventListener('nody:lang', () => {
      paintFilterBar();
      if (window.Nody && window.Nody.user) { paintProfile(window.Nody.user); }
    });

    // Firebase có thể chưa tải xong ở thời điểm này
    setTimeout(() => {
      if (!window.Nody) {
        $('profileBox').innerHTML = `<div class="empty">${Sh.pupSVG()}
          <p>${T('hist.noFirebase')}</p></div>`;
      }
    }, 2500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
