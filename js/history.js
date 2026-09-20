/* ============================================================
   history.js — Hồ sơ & lịch sử xem bói
   Đọc từ collection "readings" (giữ nguyên tên cũ), lọc theo loại,
   sắp xếp ở phía trình duyệt nên không cần tạo index Firestore.
   ============================================================ */

(function () {
  'use strict';
  const Sh = window.Shell;
  const $ = (id) => document.getElementById(id);

  const KIND = {
    tarot:      { icon: '🃏', name: 'Trải bài' },
    daily:      { icon: '🌙', name: 'Lá hôm nay' },
    numerology: { icon: '✦',  name: 'Thần số học' },
    horoscope:  { icon: '♒',  name: 'Chiêm tinh' },
    match:      { icon: '🌸', name: 'Ghép đôi' },
    dream:      { icon: '☁',  name: 'Giấc mơ' },
    wheel:      { icon: '🎡', name: 'Vòng quay' }
  };

  let rows = [];
  let filter = 'all';

  /* ---------- Phần hồ sơ ---------- */
  function paintProfile(user) {
    const box = $('profileBox');
    if (!user) {
      box.innerHTML = `
        <div class="empty">
          ${Sh.pupSVG()}
          <h3 style="margin-bottom:8px">Chưa có ai đăng nhập</h3>
          <p>Đăng nhập để xem lại mọi lá bài bạn từng rút, trên bất kỳ máy nào.</p>
          <button class="btn btn-moon" id="btnLoginHere" style="margin-top:14px">Đăng nhập hoặc tạo tài khoản</button>
        </div>`;
      $('btnLoginHere').onclick = () => Sh.openAuth('login');
      $('logBox').innerHTML = '';
      $('filterBar').classList.add('hidden');
      return;
    }

    const name = user.displayName || (user.email || '').split('@')[0] || 'Bạn';
    box.innerHTML = `
      <div class="profile-head">
        <span class="avatar">${name.charAt(0).toUpperCase()}</span>
        <div style="flex:1;min-width:180px">
          <h2>${escapeHTML(name)}</h2>
          <div class="mail">${escapeHTML(user.email || 'đăng nhập bằng Google')}</div>
        </div>
        <div style="display:flex;gap:9px;flex-wrap:wrap">
          <button class="btn btn-ghost btn-sm" id="btnRename">Đổi tên hiển thị</button>
          <button class="btn btn-ghost btn-sm" id="btnLogout">Đăng xuất</button>
        </div>
      </div>`;

    $('btnRename').onclick = async () => {
      const v = prompt('Bạn muốn Nody gọi bạn là gì?', name);
      if (!v || !v.trim()) return;
      try { await window.Nody.renameMe(v); Sh.toast('Đổi tên xong rồi 🐾'); }
      catch (e) { Sh.toast('Chưa đổi được tên.', true); }
    };

    $('btnLogout').onclick = async () => {
      await window.Nody.logout();
      Sh.toast('Đã đăng xuất. Hẹn gặp lại bạn 🌙');
    };

    $('filterBar').classList.remove('hidden');
    loadLog();
  }

  /* ---------- Lịch sử ---------- */
  async function loadLog() {
    const box = $('logBox');
    box.innerHTML = '<div class="thinking"><i></i><i></i><i></i> Đang lần giở lại</div>';
    try {
      rows = await window.Nody.myReadings();
      paintLog();
    } catch (e) {
      console.warn(e);
      box.innerHTML = `<div class="empty">
        <p>Chưa đọc được lịch sử. Thường là do quy tắc bảo mật Firestore chưa cho phép đọc.
        Bạn mở README xem phần “Quy tắc Firestore” nhé.</p></div>`;
    }
  }

  function paintLog() {
    const box = $('logBox');
    const list = filter === 'all' ? rows : rows.filter(r => (r.kind || 'tarot') === filter);

    $('logCount').textContent = rows.length
      ? `${rows.length} lượt đã lưu` : '';

    if (!list.length) {
      box.innerHTML = `<div class="empty">${Sh.pupSVG()}
        <p>${rows.length ? 'Chưa có lượt nào thuộc mục này.' : 'Chưa có gì ở đây. Rút một lá rồi quay lại xem nhé.'}</p>
        <a class="btn btn-moon btn-sm" href="tarot.html" style="margin-top:12px">Trải bài ngay</a></div>`;
      return;
    }

    box.innerHTML = list.map(r => {
      const k = KIND[r.kind || 'tarot'] || KIND.tarot;
      const cards = (r.drawnCards || [])
        .map(c => (c.vi || c.name) + (c.isReversed ? ' (ngược)' : ''))
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
            <button class="btn-quiet tiny" data-del="${r.id}">Xoá</button>
          </div>
        </div>`;
    }).join('');

    box.querySelectorAll('[data-del]').forEach(b => {
      b.onclick = async () => {
        if (!confirm('Xoá lượt này khỏi lịch sử?')) return;
        try {
          await window.Nody.deleteReading(b.dataset.del);
          rows = rows.filter(r => r.id !== b.dataset.del);
          paintLog();
          Sh.toast('Đã xoá.');
        } catch (e) { Sh.toast('Chưa xoá được.', true); }
      };
    });
  }

  function fmt(d) {
    if (!d || d.getTime() === 0) return '';
    const diff = (Date.now() - d) / 86400000;
    if (diff < 1) return 'hôm nay';
    if (diff < 2) return 'hôm qua';
    if (diff < 7) return Math.floor(diff) + ' ngày trước';
    return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' });
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  }

  function init() {
    if (!$('profileBox')) return;

    $('filterBar').innerHTML =
      `<button class="chip" data-f="all">Tất cả</button>` +
      Object.keys(KIND).map(k => `<button class="chip" data-f="${k}">${KIND[k].icon} ${KIND[k].name}</button>`).join('');

    $('filterBar').querySelectorAll('[data-f]').forEach(b => {
      b.onclick = () => {
        filter = b.dataset.f;
        $('filterBar').querySelectorAll('[data-f]').forEach(x =>
          x.style.borderColor = x === b ? 'var(--moon)' : '');
        paintLog();
      };
    });

    paintProfile(window.Nody && window.Nody.user);
    window.addEventListener('nody:auth', (e) => paintProfile(e.detail));

    // Firebase có thể chưa tải xong ở thời điểm này
    setTimeout(() => {
      if (!window.Nody) {
        $('profileBox').innerHTML = `<div class="empty">${Sh.pupSVG()}
          <p>Chưa kết nối được Firebase. Nếu bạn đang mở web bằng cách nháy đúp vào file,
          hãy chạy <b>firebase serve</b> hoặc mở qua http:// để dùng phần tài khoản.</p></div>`;
      }
    }, 2500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
