/* ============================================================
   data/lore.js — chiêm tinh & thần số học
   Toàn bộ lời luận nằm ở đây, tách khỏi phần tính toán để
   bạn sửa chữ nghĩa mà không đụng vào logic.
   ============================================================ */

window.Lore = (function () {
  'use strict';

  /* ---------- 12 cung hoàng đạo ---------- */
  const ZODIAC = [
    { id: 'aries',  vi: 'Bạch Dương', sym: '♈', el: 'Lửa',  from: [3, 21],  to: [4, 19],
      trait: 'Bạn khởi động nhanh hơn mọi người và không ngại đi đầu.',
      care:  'Điều cần tập là kiên nhẫn với những việc chín chậm.' },
    { id: 'taurus', vi: 'Kim Ngưu', sym: '♉', el: 'Đất', from: [4, 20], to: [5, 20],
      trait: 'Bạn xây chắc và giữ bền, ai dựa vào bạn cũng thấy yên.',
      care:  'Điều cần tập là buông một thứ đã hết hợp, dù nó quen.' },
    { id: 'gemini', vi: 'Song Tử', sym: '♊', el: 'Khí', from: [5, 21], to: [6, 20],
      trait: 'Bạn nối người với người, hiểu nhanh và nói khéo.',
      care:  'Điều cần tập là ở lại đủ lâu với một việc để thấy nó ra quả.' },
    { id: 'cancer', vi: 'Cự Giải', sym: '♋', el: 'Nước', from: [6, 21], to: [7, 22],
      trait: 'Bạn cảm được điều người khác chưa nói và chăm người rất giỏi.',
      care:  'Điều cần tập là chăm chính mình bằng đúng sự dịu dàng đó.' },
    { id: 'leo', vi: 'Sư Tử', sym: '♌', el: 'Lửa', from: [7, 23], to: [8, 22],
      trait: 'Bạn toả sáng tự nhiên và làm người quanh bạn ấm lên.',
      care:  'Điều cần tập là vẫn thấy mình đủ khi không ai vỗ tay.' },
    { id: 'virgo', vi: 'Xử Nữ', sym: '♍', el: 'Đất', from: [8, 23], to: [9, 22],
      trait: 'Bạn nhìn ra chi tiết ai cũng bỏ sót và sửa mọi thứ cho gọn.',
      care:  'Điều cần tập là để một việc "đủ tốt" mà không sửa nữa.' },
    { id: 'libra', vi: 'Thiên Bình', sym: '♎', el: 'Khí', from: [9, 23], to: [10, 22],
      trait: 'Bạn giữ hoà khí và thấy được lẽ phải của cả hai phía.',
      care:  'Điều cần tập là chọn phe của chính mình khi cần.' },
    { id: 'scorpio', vi: 'Bọ Cạp', sym: '♏', el: 'Nước', from: [10, 23], to: [11, 21],
      trait: 'Bạn đi tới tận đáy vấn đề và không sợ sự thật khó nghe.',
      care:  'Điều cần tập là tin người sớm hơn một nhịp.' },
    { id: 'sagittarius', vi: 'Nhân Mã', sym: '♐', el: 'Lửa', from: [11, 22], to: [12, 21],
      trait: 'Bạn cần chân trời rộng và truyền cảm hứng bằng sự thẳng thắn.',
      care:  'Điều cần tập là ở lại khi mọi thứ trở nên buồn tẻ.' },
    { id: 'capricorn', vi: 'Ma Kết', sym: '♑', el: 'Đất', from: [12, 22], to: [1, 19],
      trait: 'Bạn leo bền bỉ và làm được những việc dài hơi ít ai theo nổi.',
      care:  'Điều cần tập là nghỉ mà không thấy mình đang lười.' },
    { id: 'aquarius', vi: 'Bảo Bình', sym: '♒', el: 'Khí', from: [1, 20], to: [2, 18],
      trait: 'Bạn nghĩ khác đám đông và quan tâm tới cái chung.',
      care:  'Điều cần tập là để người thân đến gần hơn một chút.' },
    { id: 'pisces', vi: 'Song Ngư', sym: '♓', el: 'Nước', from: [2, 19], to: [3, 20],
      trait: 'Bạn giàu tưởng tượng và thương người rất thật.',
      care:  'Điều cần tập là dựng ranh giới mà vẫn không hết dịu dàng.' }
  ];

  function signOf(month, day) {
    for (const z of ZODIAC) {
      const [fm, fd] = z.from, [tm, td] = z.to;
      if (fm <= tm) {
        if ((month === fm && day >= fd) || (month === tm && day <= td)) return z;
      } else { // Ma Kết vắt qua năm mới
        if ((month === fm && day >= fd) || (month === tm && day <= td)) return z;
      }
    }
    return ZODIAC[9];
  }

  /* ---------- Giọng ngày cho từng hành ---------- */
  const ELEMENT_DAY = {
    'Lửa':  ['Hôm nay hợp để bắt đầu, dù chỉ là mở một file trắng.', 'Đừng đốt hết củi trong buổi sáng.'],
    'Đất':  ['Hôm nay hợp việc tay chân và những thứ nhìn thấy được.', 'Một việc dọn dẹp nhỏ sẽ gỡ được một nút thắt trong đầu.'],
    'Khí':  ['Hôm nay hợp để nói chuyện, hỏi thẳng, viết ra.', 'Nghĩ ít lại một chút, nói ra nhiều hơn một chút.'],
    'Nước': ['Hôm nay hợp để nghỉ, nghe nhạc, ở gần người thương.', 'Cảm xúc dâng là bình thường, nó rút đi nhanh hơn bạn nghĩ.']
  };

  /* ---------- Thần số học: ý nghĩa 1–9 và số bậc thầy ---------- */
  const NUMBERS = {
    1: ['Người mở đường', 'Bạn sinh ra để đi trước và tự quyết. Độc lập là sức mạnh, nhưng nhớ rằng nhờ vả không làm bạn kém đi.'],
    2: ['Người kết nối', 'Bạn cảm được nhịp của người khác và giỏi làm cầu nối. Việc của bạn là học nói "không" mà vẫn dịu dàng.'],
    3: ['Người kể chuyện', 'Bạn diễn đạt hay, sáng tạo và làm không khí nhẹ đi. Giữ cho mình một việc làm tới nơi tới chốn.'],
    4: ['Người dựng nền', 'Bạn kỷ luật, đáng tin, xây được thứ bền. Nhớ chừa chỗ cho những việc không có trong kế hoạch.'],
    5: ['Người đi xa', 'Bạn cần tự do và đổi thay để thấy mình sống. Một vài cái neo sẽ giúp chuyến đi có nơi để về.'],
    6: ['Người chăm sóc', 'Bạn gánh và chăm rất giỏi, ai cũng muốn dựa vào. Học nhận sự chăm sóc ngược lại nhé.'],
    7: ['Người tìm hiểu', 'Bạn thích chiều sâu, hay quan sát và cần khoảng riêng. Đừng để khoảng riêng thành bức tường.'],
    8: ['Người cầm lái', 'Bạn có bản năng về quyền lực, tiền bạc và tổ chức. Cân lại giữa thành tựu và những buổi tối bình thường.'],
    9: ['Người cho đi', 'Bạn rộng lòng và nghĩ cho cái chung. Cho vừa sức thì mới cho được lâu.'],
    11: ['Số bậc thầy 11 — Người truyền cảm hứng', 'Trực giác rất mạnh và bạn lay động người khác chỉ bằng sự có mặt. Đổi lại, bạn nhạy hơn nên cũng mệt hơn.'],
    22: ['Số bậc thầy 22 — Người kiến tạo', 'Bạn có thể biến giấc mơ lớn thành công trình thật. Đừng ôm cả giấc mơ trong một mình.'],
    33: ['Số bậc thầy 33 — Người thầy dịu dàng', 'Bạn chữa lành người khác bằng sự hiện diện. Nhớ dành phần chữa lành cho chính mình.']
  };

  const NUM_ROLES = [
    { key: 'life',   name: 'Đường đời',   note: 'bài học chính của cả đời bạn' },
    { key: 'soul',   name: 'Linh hồn',    note: 'điều bạn thật sự khao khát' },
    { key: 'person', name: 'Nhân cách',   note: 'ấn tượng người khác thấy ở bạn' },
    { key: 'expr',   name: 'Sứ mệnh',     note: 'năng lực bạn mang ra đời' },
    { key: 'birth',  name: 'Ngày sinh',   note: 'món quà bẩm sinh của bạn' }
  ];

  /* ---------- Năm cá nhân ---------- */
  const PERSONAL_YEAR = {
    1: 'Năm mở màn. Gieo hạt, bắt đầu, dám đứng tên một việc.',
    2: 'Năm của quan hệ và kiên nhẫn. Chậm mà chắc, hợp tác hơn là solo.',
    3: 'Năm bày tỏ. Sáng tạo, giao tiếp, cho phép mình vui.',
    4: 'Năm xây móng. Ít hào nhoáng, nhiều việc thật, rất đáng.',
    5: 'Năm xáo trộn dễ chịu. Đổi chỗ, đổi việc, mở rộng vòng tròn.',
    6: 'Năm của nhà và người thân. Trách nhiệm nhiều hơn, tình cũng đậm hơn.',
    7: 'Năm quay vào trong. Học, nghỉ, hiểu mình. Đừng ép mình phải bận.',
    8: 'Năm gặt. Tiền bạc, vị trí, kết quả của mấy năm trước dồn lại.',
    9: 'Năm khép vòng. Dọn dẹp, tha thứ, buông. Chỗ trống là để dành cho năm 1.'
  };

  /* ---------- Rút gọn số ---------- */
  function reduce(n, keepMaster) {
    while (n > 9) {
      if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
      n = String(n).split('').reduce((a, c) => a + (+c), 0);
    }
    return n;
  }

  /* ---------- Chữ cái → số (bảng Pythagoras) ---------- */
  const LETTER = {};
  'ABCDEFGHI'.split('').forEach((c, i) => LETTER[c] = i + 1);
  'JKLMNOPQR'.split('').forEach((c, i) => LETTER[c] = i + 1);
  'STUVWXYZ'.split('').forEach((c, i) => LETTER[c] = i + 1);

  const VOWELS = 'AEIOU';

  /* Bỏ dấu tiếng Việt để tính được với tên có dấu */
  function deaccent(s) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .toUpperCase().replace(/[^A-Z]/g, '');
  }

  function nameNumber(name, mode) {
    const s = deaccent(name);
    let sum = 0;
    for (const ch of s) {
      const isV = VOWELS.includes(ch);
      if (mode === 'soul' && !isV) continue;
      if (mode === 'person' && isV) continue;
      sum += LETTER[ch] || 0;
    }
    return reduce(sum, true);
  }

  return {
    ZODIAC, signOf, ELEMENT_DAY,
    NUMBERS, NUM_ROLES, PERSONAL_YEAR,
    reduce, nameNumber, deaccent,
    num: (n) => NUMBERS[n] || NUMBERS[reduce(n)] || NUMBERS[9]
  };
})();
