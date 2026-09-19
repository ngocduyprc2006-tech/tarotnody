/* ============================================================
   numerology.js — Thần số học
   Tính 5 chỉ số chính + năm cá nhân từ họ tên và ngày sinh.
   Công thức Pythagoras, có giữ số bậc thầy 11/22/33.
   ============================================================ */

(function () {
  'use strict';
  const L = window.Lore, Sh = window.Shell;
  const $ = (id) => document.getElementById(id);

  function compute(name, dob) {
    const [y, m, d] = dob.split('-').map(Number);

    // Đường đời: cộng dồn ngày + tháng + năm, mỗi phần rút gọn trước
    const life = L.reduce(L.reduce(d, true) + L.reduce(m, true) + L.reduce(y, true), true);

    const soul   = L.nameNumber(name, 'soul');
    const person = L.nameNumber(name, 'person');
    const expr   = L.nameNumber(name, 'all');
    const birth  = L.reduce(d, true);

    const thisYear = new Date().getFullYear();
    const py = L.reduce(L.reduce(d) + L.reduce(m) + L.reduce(thisYear));

    return { life, soul, person, expr, birth, py, thisYear, name, dob, y, m, d };
  }

  function card(num, role) {
    const info = L.num(num);
    return `
      <div style="margin-bottom:22px">
        <h4 style="margin-top:0">${role.name} · số ${num}</h4>
        <p class="tiny mute" style="margin:-4px 0 8px">${role.note}</p>
        <p><b style="color:var(--moon)">${info[0]}.</b> ${info[1]}</p>
      </div>`;
  }

  function render(r) {
    const life = L.num(r.life);

    $('numBody').innerHTML = `
      <div class="center" style="margin-bottom:6px">
        <span class="big-num">${r.life}</span>
        <p class="poem" style="margin-top:6px">${life[0]} — con số đường đời của bạn</p>
      </div>

      <div class="stat-grid">
        <div class="stat"><div class="n">${r.soul}</div><div class="k">Linh hồn</div></div>
        <div class="stat"><div class="n">${r.person}</div><div class="k">Nhân cách</div></div>
        <div class="stat"><div class="n">${r.expr}</div><div class="k">Sứ mệnh</div></div>
        <div class="stat"><div class="n">${r.birth}</div><div class="k">Ngày sinh</div></div>
        <div class="stat"><div class="n">${r.py}</div><div class="k">Năm ${r.thisYear}</div></div>
      </div>

      <h4>Đường đời số ${r.life}</h4>
      <p><b style="color:var(--moon)">${life[0]}.</b> ${life[1]}</p>

      ${card(r.soul,   L.NUM_ROLES[1])}
      ${card(r.person, L.NUM_ROLES[2])}
      ${card(r.expr,   L.NUM_ROLES[3])}
      ${card(r.birth,  L.NUM_ROLES[4])}

      <h4>Năm cá nhân ${r.thisYear} của bạn: số ${r.py}</h4>
      <p>${L.PERSONAL_YEAR[r.py] || L.PERSONAL_YEAR[9]}</p>

      <h4>Khi các con số gặp nhau</h4>
      <p>${blend(r)}</p>

      <blockquote>Con số không quyết định bạn là ai. Nó chỉ mô tả cái khuôn bạn được trao —
      còn xây gì trong khuôn đó thì hoàn toàn là việc của bạn.</blockquote>`;

    $('numResult').classList.remove('hidden');
    $('numResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    Sh.log({
      kind: 'numerology',
      title: 'Thần số học · ' + r.name,
      summary: `Đường đời ${r.life}, linh hồn ${r.soul}, nhân cách ${r.person}, sứ mệnh ${r.expr}, năm cá nhân ${r.py}.`
    });
  }

  function blend(r) {
    if (r.soul === r.person)
      return 'Linh hồn và nhân cách của bạn trùng số — nghĩa là bên trong bạn muốn gì thì bên ngoài bạn để lộ đúng như vậy. Bạn sống thật, và người ta cảm được điều đó ngay lần đầu gặp.';
    if (r.life === r.expr)
      return 'Đường đời và sứ mệnh trùng nhau: việc bạn giỏi cũng chính là bài học đời bạn. Con đường sẽ thẳng hơn người khác, nhưng cũng ít chỗ trốn hơn.';
    if ([11, 22, 33].includes(r.life) || [11, 22, 33].includes(r.expr))
      return 'Bạn mang một số bậc thầy. Nó cho bạn độ nhạy và sức ảnh hưởng lớn hơn bình thường, kèm theo cái giá là dễ quá tải. Nghỉ ngơi với bạn không phải xa xỉ, nó là bảo trì.';
    if (Math.abs(r.soul - r.person) >= 4)
      return 'Linh hồn và nhân cách của bạn cách nhau khá xa. Bên trong bạn muốn một kiểu, còn bên ngoài lại thể hiện một kiểu khác. Không sai, nhưng sẽ mệt nếu kéo dài. Thử để người thân thấy phần thật nhiều hơn một chút.';
    return 'Các con số của bạn đứng khá gần nhau, tạo thành một tính cách nhất quán. Bạn ít mâu thuẫn nội tâm, đổi lại đôi khi cần chủ động tìm cái mới để không đi mãi một lối mòn.';
  }

  function init() {
    if (!$('btnNum')) return;

    $('btnNum').onclick = () => {
      const name = $('numName').value.trim();
      const dob = $('numDob').value;
      if (!name) return Sh.toast('Bạn nhập họ tên khai sinh giúp mình nhé.', true);
      if (!dob)  return Sh.toast('Còn thiếu ngày sinh.', true);
      if (L.deaccent(name).length < 2) return Sh.toast('Tên này ngắn quá, mình chưa tính được.', true);
      render(compute(name, dob));
    };

    $('numName').addEventListener('keydown', e => { if (e.key === 'Enter') $('btnNum').click(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
