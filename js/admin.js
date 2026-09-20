/* ============================================================
   admin.js — trang Quản trị (chỉ admin vào được)
   ------------------------------------------------------------
   An toàn THẬT SỰ phải nằm ở Firestore Security Rules (xem
   README) — cái ẩn/hiện ở đây chỉ là giao diện, không phải khoá.
   Rules mẫu chặn mọi người dùng thường đọc/ghi collection "users"
   và "topups" của người khác, chỉ role=="admin" mới được.
   ========================================================== */
(function () {
  'use strict';

  function fmtMoney(n) { return (n || 0).toLocaleString('vi-VN') + 'đ'; }
  function fmtWhen(ts) { return ts?.toDate ? ts.toDate().toLocaleString('vi-VN') : '—'; }
  function esc(s) { return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  let checked = false;

  async function gate() {
    if (!window.Nody || !window.Nody.loaded) { setTimeout(gate, 200); return; }
    if (!window.Nody.user || !window.Nody.isAdmin()) {
      document.getElementById('adminDenied').classList.remove('hidden');
      document.getElementById('adminBody').classList.add('hidden');
      return;
    }
    document.getElementById('adminDenied').classList.add('hidden');
    document.getElementById('adminBody').classList.remove('hidden');
    if (!checked) { checked = true; loadOverview(); }
  }

  function fmtWhen2(ts) { return fmtWhen(ts); }

  async function loadOverview() {
    try {
      const [users, topups, readings] = await Promise.all([
        window.Nody.adminListUsers(),
        window.Nody.adminListTopups(),
        window.Nody.adminListReadings()
      ]);
      document.getElementById('ovUsers').textContent = users.length;
      document.getElementById('ovWallet').textContent = fmtMoney(users.reduce((s, u) => s + (u.wallet || 0), 0));
      document.getElementById('ovPending').textContent = topups.filter(t => t.status === 'pending').length;
      document.getElementById('ovReadings').textContent = readings.length;
    } catch (e) {
      ['ovUsers', 'ovWallet', 'ovPending', 'ovReadings'].forEach(id => document.getElementById(id).textContent = '—');
    }
  }

  async function loadUsers() {
    const host = document.getElementById('usersRows');
    try {
      const rows = await window.Nody.adminListUsers();
      if (!rows.length) { host.innerHTML = `<tr><td colspan="5" class="mute">—</td></tr>`; return; }
      host.innerHTML = rows.map(u => `
        <tr>
          <td>${esc(u.email)}</td>
          <td>${esc(u.name)}</td>
          <td>${esc(u.role || 'user')}</td>
          <td>${fmtMoney(u.wallet)}</td>
          <td>
            ${u.role === 'admin'
              ? `<button class="btn btn-ghost tiny js-revoke" data-uid="${u.id}">Thu hồi admin</button>`
              : `<button class="btn btn-ghost tiny js-grant" data-uid="${u.id}">Cấp admin</button>`}
          </td>
        </tr>`).join('');
      host.querySelectorAll('.js-grant').forEach(b => b.onclick = () => setRole(b.dataset.uid, 'admin'));
      host.querySelectorAll('.js-revoke').forEach(b => b.onclick = () => setRole(b.dataset.uid, 'user'));
    } catch (e) {
      host.innerHTML = `<tr><td colspan="5" class="mute">Không tải được (kiểm tra Firestore Rules).</td></tr>`;
    }
  }

  async function setRole(uid, role) {
    try { await window.Nody.adminSetRole(uid, role); loadUsers(); }
    catch (e) { window.Shell.toast('Không đổi được vai trò.', true); }
  }

  async function loadTopups() {
    const host = document.getElementById('topupsRows');
    try {
      const rows = await window.Nody.adminListTopups();
      if (!rows.length) { host.innerHTML = `<tr><td colspan="6" class="mute">—</td></tr>`; return; }
      host.innerHTML = rows.map(r => `
        <tr>
          <td>${fmtWhen(r.createdAt)}</td>
          <td>${esc(r.userEmail)}</td>
          <td>${fmtMoney(r.amount)}</td>
          <td>${esc(r.note)}</td>
          <td><span class="status-pill ${r.status}">${esc(r.status)}</span></td>
          <td>
            ${r.status === 'pending'
              ? `<button class="btn btn-moon tiny js-approve" data-id="${r.id}">Duyệt</button>
                 <button class="btn btn-ghost tiny js-reject" data-id="${r.id}">Từ chối</button>`
              : '—'}
          </td>
        </tr>`).join('');
      host.querySelectorAll('.js-approve').forEach(b => {
        b.onclick = async () => {
          const row = rows.find(r => r.id === b.dataset.id);
          try { await window.Nody.adminApproveTopup(row); loadTopups(); loadUsers(); }
          catch (e) { window.Shell.toast('Không duyệt được.', true); }
        };
      });
      host.querySelectorAll('.js-reject').forEach(b => {
        b.onclick = async () => {
          try { await window.Nody.adminRejectTopup(b.dataset.id); loadTopups(); }
          catch (e) { window.Shell.toast('Không từ chối được.', true); }
        };
      });
    } catch (e) {
      host.innerHTML = `<tr><td colspan="6" class="mute">Không tải được (kiểm tra Firestore Rules).</td></tr>`;
    }
  }

  async function loadReadings() {
    const host = document.getElementById('readingsRows');
    try {
      const rows = await window.Nody.adminListReadings();
      if (!rows.length) { host.innerHTML = `<tr><td colspan="5" class="mute">—</td></tr>`; return; }
      host.innerHTML = rows.map(r => `
        <tr>
          <td>${fmtWhen(r.createdAt)}</td>
          <td>${esc(r.userEmail)}</td>
          <td>${esc(r.kind)}</td>
          <td>${esc(r.topic)}</td>
          <td>${esc((r.summary || '').slice(0, 80))}</td>
        </tr>`).join('');
    } catch (e) {
      host.innerHTML = `<tr><td colspan="5" class="mute">Không tải được.</td></tr>`;
    }
  }

  async function loadLetters() {
    const host = document.getElementById('lettersRows');
    try {
      const rows = await window.Nody.adminListLetters();
      if (!rows.length) { host.innerHTML = `<tr><td colspan="4" class="mute">—</td></tr>`; return; }
      host.innerHTML = rows.map(r => `
        <tr>
          <td>${esc(r.email)}</td>
          <td>${esc(r.openAt)}</td>
          <td>${r.opened ? '✓' : '—'}</td>
          <td>${esc((r.body || '').slice(0, 80))}</td>
        </tr>`).join('');
    } catch (e) {
      host.innerHTML = `<tr><td colspan="4" class="mute">Không tải được.</td></tr>`;
    }
  }

  const LOADERS = { overview: loadOverview, users: loadUsers, topups: loadTopups, readings: loadReadings, letters: loadLetters };

  function wireTabs() {
    document.querySelectorAll('#adminTabs [data-tab]').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('#adminTabs [data-tab]').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        document.querySelectorAll('.admin-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById('pane-' + btn.dataset.tab).classList.remove('hidden');
        (LOADERS[btn.dataset.tab] || function(){})();
      };
    });
  }

  window.addEventListener('nody:auth', gate);
  document.addEventListener('DOMContentLoaded', () => { wireTabs(); gate(); });
})();
