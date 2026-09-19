/* ============================================================
   match.js — Ghép đôi
   Điểm hợp được ghép từ ba lớp: số đường đời, hành của hai cung,
   và một lớp "duyên" cố định theo cặp tên (không đổi mỗi lần bấm).
   ============================================================ */

(function () {
  'use strict';
  const L = window.Lore, Sh = window.Shell;
  const $ = (id) => document.getElementById(id);

  /* Hành nào hợp hành nào */
  const ELEM_FIT = {
    'Lửa-Lửa': 82, 'Lửa-Khí': 90, 'Lửa-Đất': 58, 'Lửa-Nước': 52,
    'Khí-Khí': 80, 'Khí-Đất': 56, 'Khí-Nước': 60,
    'Đất-Đất': 84, 'Đất-Nước': 88,
    'Nước-Nước': 83
  };
  const fitOf = (a, b) => ELEM_FIT[a + '-' + b] ?? ELEM_FIT[b + '-' + a] ?? 65;

  /* Số đường đời hợp nhau */
  function numFit(a, b) {
    const ra = L.reduce(a), rb = L.reduce(b);
    if (ra === rb) return 86;
    const pairs = { '1-5': 88, '2-6': 92, '3-9': 90, '4-8': 89, '1-3': 84, '2-4': 80, '5-7': 82, '6-9': 87, '7-9': 78 };
    const k1 = ra + '-' + rb, k2 = rb + '-' + ra;
    if (pairs[k1] || pairs[k2]) return pairs[k1] || pairs[k2];
    const gap = Math.abs(ra - rb);
    return 62 + (gap % 3) * 7;
  }

  function lifePath(dob) {
    const [y, m, d] = dob.split('-').map(Number);
    return L.reduce(L.reduce(d) + L.reduce(m) + L.reduce(y));
  }

  function run(a, b) {
    const za = L.signOf(+a.dob.split('-')[1], +a.dob.split('-')[2]);
    const zb = L.signOf(+b.dob.split('-')[1], +b.dob.split('-')[2]);
    const la = lifePath(a.dob), lb = lifePath(b.dob);

    const elem = fitOf(za.el, zb.el);
    const nums = numFit(la, lb);

    // lớp duyên: cố định theo cặp tên, xếp thứ tự để A-B và B-A ra cùng kết quả
    const key = [L.deaccent(a.name), L.deaccent(b.name)].sort().join('|');
    const rnd = Sh.seeded(key);
    const fate = 55 + Math.round(rnd() * 40);

    const total = Math.round(elem * 0.3 + nums * 0.4 + fate * 0.3);

    return { a, b, za, zb, la, lb, elem, nums, fate, total };
  }

  function verdict(n) {
    if (n >= 88) return ['Hợp lạ thường', 'Hai bạn khớp nhau ở tầng sâu, kiểu ngồi im cạnh nhau cũng không thấy ngượng. Cái cần giữ là đừng lấy sự hợp này làm lý do để ngừng cố gắng.'];
    if (n >= 76) return ['Rất hợp', 'Nền tảng tốt và hai bạn bù cho nhau khá đẹp. Có vài chỗ lệch nhưng đều thuộc loại nói ra là gỡ được.'];
    if (n >= 62) return ['Hợp, cần chăm', 'Duyên có thật, hợp có thật, nhưng mối này sống được nhờ giao tiếp chứ không nhờ may mắn. Chịu khó nói thì đi xa.'];
    if (n >= 48) return ['Khác nhau nhiều', 'Hai bạn nhìn đời bằng hai kiểu khác hẳn. Không phải không được, chỉ là cần nhiều kiên nhẫn và ít kỳ vọng "người kia phải hiểu mình".'];
    return ['Rất khác nhau', 'Chỉ số thấp không có nghĩa là không thể. Nó chỉ nói rằng nếu chọn nhau, hai bạn sẽ phải chọn một cách rất có ý thức, mỗi ngày.'];
  }

  function render(r) {
    const [title, text] = verdict(r.total);
    const C = 2 * Math.PI * 70;

    $('matchBody').innerHTML = `
      <div class="score-ring">
        <svg viewBox="0 0 160 160" width="168" height="168">
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--line-soft)" stroke-width="9"/>
          <circle id="ringArc" cx="80" cy="80" r="70" fill="none" stroke="var(--moon)" stroke-width="9"
                  stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"
                  style="transition:stroke-dashoffset 1.3s var(--ease)"/>
        </svg>
        <span class="val">${r.total}%</span>
      </div>

      <div class="center"><h3>${title}</h3><p>${text}</p></div>

      <div class="chips" style="justify-content:center;margin-top:18px">
        <span class="chip">${r.za.sym} ${r.a.name} · ${r.za.vi}</span>
        <span class="chip alt">${r.zb.sym} ${r.b.name} · ${r.zb.vi}</span>
      </div>

      <div class="stat-grid">
        <div class="stat"><div class="n">${r.elem}%</div><div class="k">Hành ${r.za.el} × ${r.zb.el}</div></div>
        <div class="stat"><div class="n">${r.nums}%</div><div class="k">Số ${r.la} × ${r.lb}</div></div>
        <div class="stat"><div class="n">${r.fate}%</div><div class="k">Duyên tên gọi</div></div>
      </div>

      <h4>Hai bạn mạnh ở đâu</h4>
      <p>${strength(r)}</p>

      <h4>Chỗ dễ va nhất</h4>
      <p>${friction(r)}</p>

      <h4>Một việc nên làm tuần này</h4>
      <p>${advice(r)}</p>

      <blockquote>Không có cặp nào hợp sẵn 100%. Điểm số chỉ nói hai bạn xuất phát từ đâu,
      còn đi được bao xa thì do hai người chọn.</blockquote>`;

    $('matchResult').classList.remove('hidden');
    setTimeout(() => {
      const arc = $('ringArc');
      if (arc) arc.style.strokeDashoffset = C * (1 - r.total / 100);
    }, 120);
    $('matchResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    Sh.log({
      kind: 'match',
      title: `Ghép đôi · ${r.a.name} & ${r.b.name}`,
      summary: `${r.total}% — ${title}. ${r.za.vi} (${r.za.el}) × ${r.zb.vi} (${r.zb.el}), đường đời ${r.la} × ${r.lb}.`
    });
  }

  function strength(r) {
    if (r.za.el === r.zb.el)
      return `Cùng hành ${r.za.el} nên hai bạn hiểu nhau gần như không cần giải thích. Nhịp sống, tốc độ, cách phản ứng đều na ná — cái này rất quý.`;
    if (r.elem >= 85)
      return `Hành ${r.za.el} và hành ${r.zb.el} nuôi nhau. Người này làm người kia sáng lên mà không phải cố.`;
    if (r.nums >= 85)
      return `Số đường đời ${r.la} và ${r.lb} là một cặp bổ khuyết đẹp: chỗ người này thiếu thì người kia có sẵn.`;
    return `${r.a.name} mang chất ${r.za.el.toLowerCase()}, ${r.b.name} mang chất ${r.zb.el.toLowerCase()}. Khác nhau nhưng chính khác nhau mới làm hai bạn thấy đối phương thú vị.`;
  }

  function friction(r) {
    if (r.elem < 60)
      return `Hành ${r.za.el} và ${r.zb.el} vốn đi khác tốc độ. Người muốn quyết nhanh, người cần ngẫm lâu — và cả hai đều nghĩ mình đúng. Thoả thuận trước một khung thời gian cho các quyết định lớn sẽ đỡ nhiều.`;
    if (Math.abs(L.reduce(r.la) - L.reduce(r.lb)) >= 5)
      return `Hai con số đường đời cách nhau khá xa nên ưu tiên trong đời cũng khác. Đừng cố thuyết phục nhau đổi ưu tiên, hãy chia lịch để cả hai đều được sống theo ưu tiên của mình.`;
    return `Chỗ dễ va nhất là khi cả hai cùng mệt. Lúc đó hai bạn có xu hướng im lặng chờ người kia mở lời trước — và thế là im cả tuần.`;
  }

  function advice(r) {
    const list = [
      'Hỏi nhau một câu hai bạn chưa từng hỏi: "Dạo này cái gì làm bạn mệt nhất mà mình không biết?"',
      'Dành một buổi không điện thoại. Không cần đi đâu sang, ngồi ăn với nhau là đủ.',
      'Mỗi người viết ra ba điều biết ơn về người kia rồi đọc cho nhau nghe. Ngượng thì ngượng, nhưng hiệu nghiệm.',
      'Nói trước một ranh giới nhỏ của mình, thay vì đợi bị lấn rồi mới giận.'
    ];
    const rnd = Sh.seeded(L.deaccent(r.a.name + r.b.name));
    return list[Math.floor(rnd() * list.length)];
  }

  function init() {
    if (!$('btnMatch')) return;
    $('btnMatch').onclick = () => {
      const a = { name: $('mA').value.trim(), dob: $('mADob').value };
      const b = { name: $('mB').value.trim(), dob: $('mBDob').value };
      if (!a.name || !b.name) return Sh.toast('Cần tên của cả hai người.', true);
      if (!a.dob || !b.dob)   return Sh.toast('Cần ngày sinh của cả hai người.', true);
      render(run(a, b));
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
