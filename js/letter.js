/* ============================================================
   letter.js — Hộp thư thời gian
   Viết thư cho chính mình ở tương lai. Thư nằm trong Firestore,
   đến ngày hẹn mới mở được. Chưa tới hạn thì Nody giữ kín.
   ============================================================ */

(function () {
  'use strict';
  const Sh = window.Shell;
  const $ = (id) => document.getElementById(id);
  const T = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);
  const LOCALE = { vi: 'vi-VN', en: 'en-US', zh: 'zh-CN', ko: 'ko-KR', ja: 'ja-JP' };
  const locale = () => LOCALE[(window.I18N && window.I18N.get()) || 'vi'] || 'vi-VN';

  function QUICK() {
    return [
      { d: 30,  label: T('letter.q30') },
      { d: 100, label: T('letter.q100') },
      { d: 365, label: T('letter.q365') }
    ];
  }

  function iso(daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().slice(0, 10);
  }

  function prettyDate(s) {
    try { return new Date(s).toLocaleDateString(locale(), { day: 'numeric', month: 'numeric', year: 'numeric' }); }
    catch (e) { return s; }
  }

  function daysLeft(s) {
    return Math.ceil((new Date(s + 'T00:00:00') - new Date()) / 86400000);
  }

  /* ---------- Danh sách thư ---------- */
  async function loadList() {
    const box = $('letterList');
    if (!window.Nody || !window.Nody.user) {
      box.innerHTML = `
        <div class="empty">
          ${Sh.pupSVG()}
          <p>${T('letter.loginHint')}</p>
          <button class="btn btn-ghost btn-sm" id="btnLoginHere">${T('auth.login')}</button>
        </div>`;
      const b = $('btnLoginHere');
      if (b) b.onclick = () => Sh.openAuth('login');
      return;
    }

    box.innerHTML = `<div class="thinking"><i></i><i></i><i></i> ${T('letter.opening')}</div>`;
    try {
      const rows = await window.Nody.myLetters();
      if (!rows.length) {
        box.innerHTML = `<div class="empty">${Sh.pupSVG()}<p>${T('letter.empty')}</p></div>`;
        return;
      }
      box.innerHTML = rows.map(r => {
        const left = daysLeft(r.openAt);
        const open = left <= 0;
        return `
          <div class="log-item">
            <div class="log-kind">${open ? '💌' : '🔒'}</div>
            <div>
              <h4>${T('letter.opensOn', { date: prettyDate(r.openAt) })}</h4>
              <div class="cards">${open
                ? escapeHTML(r.body).slice(0, 400).replace(/\n/g, '<br>')
                : T('letter.stillSealed', { n: left })}</div>
            </div>
            <button class="btn-quiet tiny" data-del="${r.id}">${T('common.delete')}</button>
          </div>`;
      }).join('');

      box.querySelectorAll('[data-del]').forEach(b => {
        b.onclick = async () => {
          if (!confirm(T('letter.confirmDelete'))) return;
          try { await window.Nody.deleteLetter(b.dataset.del); Sh.toast(T('letter.deleted')); loadList(); }
          catch (e) { Sh.toast(T('letter.deleteFail'), true); }
        };
      });
    } catch (e) {
      box.innerHTML = `<div class="empty"><p>${T('letter.loadFail')}</p></div>`;
      console.warn(e);
    }
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  }

  /* ---------- Gửi thư ---------- */
  async function send() {
    const body = $('letterBody').value.trim();
    const when = $('letterDate').value;

    if (body.length < 20) return Sh.toast(T('letter.errShort'), true);
    if (!when) return Sh.toast(T('letter.errNoDate'), true);
    if (daysLeft(when) < 1) return Sh.toast(T('letter.errPastDate'), true);
    if (!Sh.requireLogin(T('letter.needLogin'))) return;

    $('btnSendLetter').disabled = true;
    try {
      await window.Nody.saveLetter({ body, openAt: when });
      $('letterBody').value = '';
      Sh.toast(T('letter.sent', { date: prettyDate(when) }));
      loadList();
    } catch (e) {
      Sh.toast(T('letter.sendFail'), true);
      console.warn(e);
    }
    $('btnSendLetter').disabled = false;
  }

  function paintQuick() {
    $('quickDates').innerHTML = QUICK()
      .map(q => `<button class="chip" data-days="${q.d}">${q.label}</button>`).join('');
    $('quickDates').querySelectorAll('[data-days]').forEach(b => {
      b.onclick = () => { $('letterDate').value = iso(+b.dataset.days); };
    });
  }

  function init() {
    if (!$('btnSendLetter')) return;

    $('letterDate').min = iso(1);
    $('letterDate').value = iso(100);

    paintQuick();
    $('btnSendLetter').onclick = send;

    loadList();
    window.addEventListener('nody:auth', loadList);
    window.addEventListener('nody:lang', () => { paintQuick(); loadList(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
