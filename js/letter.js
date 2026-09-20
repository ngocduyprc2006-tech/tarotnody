/* ============================================================
   letter.js — Hộp thư thời gian
   Viết thư cho chính mình ở tương lai. Thư nằm trong Firestore,
   đến ngày hẹn mới mở được. Chưa tới hạn thì Nody giữ kín.
   ============================================================ */

(function () {
  'use strict';
  const Sh = window.Shell;
  const $ = (id) => document.getElementById(id);

  const QUICK = [
    { d: 30,  label: 'một tháng nữa' },
    { d: 100, label: '100 ngày nữa' },
    { d: 365, label: 'một năm nữa' }
  ];

  function iso(daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().slice(0, 10);
  }

  function prettyDate(s) {
    try { return new Date(s).toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' }); }
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
          <p>Đăng nhập để Nody cất giúp bạn những lá thư này và nhắc bạn đúng hẹn.</p>
          <button class="btn btn-ghost btn-sm" id="btnLoginHere">Đăng nhập</button>
        </div>`;
      const b = $('btnLoginHere');
      if (b) b.onclick = () => Sh.openAuth('login');
      return;
    }

    box.innerHTML = '<div class="thinking"><i></i><i></i><i></i> Đang mở hộp thư</div>';
    try {
      const rows = await window.Nody.myLetters();
      if (!rows.length) {
        box.innerHTML = `<div class="empty">${Sh.pupSVG()}<p>Hộp thư còn trống. Viết lá đầu tiên ở trên nhé.</p></div>`;
        return;
      }
      box.innerHTML = rows.map(r => {
        const left = daysLeft(r.openAt);
        const open = left <= 0;
        return `
          <div class="log-item">
            <div class="log-kind">${open ? '💌' : '🔒'}</div>
            <div>
              <h4>Thư mở ngày ${prettyDate(r.openAt)}</h4>
              <div class="cards">${open
                ? escapeHTML(r.body).slice(0, 400).replace(/\n/g, '<br>')
                : 'Nody đang giữ kín. Còn ' + left + ' ngày nữa.'}</div>
            </div>
            <button class="btn-quiet tiny" data-del="${r.id}">Xoá</button>
          </div>`;
      }).join('');

      box.querySelectorAll('[data-del]').forEach(b => {
        b.onclick = async () => {
          if (!confirm('Xoá lá thư này? Không lấy lại được đâu.')) return;
          try { await window.Nody.deleteLetter(b.dataset.del); Sh.toast('Đã xoá.'); loadList(); }
          catch (e) { Sh.toast('Chưa xoá được. Thử lại giúp mình.', true); }
        };
      });
    } catch (e) {
      box.innerHTML = `<div class="empty"><p>Chưa đọc được hộp thư. Có thể quy tắc Firestore đang chặn.
        Bạn xem mục hướng dẫn trong README nhé.</p></div>`;
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

    if (body.length < 20) return Sh.toast('Viết dài hơn một chút nhé, bạn của tương lai sẽ thích đọc.', true);
    if (!when) return Sh.toast('Bạn chọn ngày mở thư giúp mình.', true);
    if (daysLeft(when) < 1) return Sh.toast('Chọn một ngày trong tương lai nhé.', true);
    if (!Sh.requireLogin('Đăng nhập để Nody giữ thư cho bạn.')) return;

    $('btnSendLetter').disabled = true;
    try {
      await window.Nody.saveLetter({ body, openAt: when });
      $('letterBody').value = '';
      Sh.toast('Nody đã cất thư. Hẹn bạn ngày ' + prettyDate(when) + ' 💌');
      loadList();
    } catch (e) {
      Sh.toast('Chưa gửi được. Kiểm tra kết nối rồi thử lại.', true);
      console.warn(e);
    }
    $('btnSendLetter').disabled = false;
  }

  function init() {
    if (!$('btnSendLetter')) return;

    $('letterDate').min = iso(1);
    $('letterDate').value = iso(100);

    $('quickDates').innerHTML = QUICK
      .map(q => `<button class="chip" data-days="${q.d}">${q.label}</button>`).join('');
    $('quickDates').querySelectorAll('[data-days]').forEach(b => {
      b.onclick = () => { $('letterDate').value = iso(+b.dataset.days); };
    });

    $('btnSendLetter').onclick = send;

    loadList();
    window.addEventListener('nody:auth', loadList);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
