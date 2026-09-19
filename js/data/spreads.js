/* ============================================================
   data/spreads.js — các kiểu trải bài và chủ đề
   Toạ độ x/y tính theo % của bàn trải. Thêm kiểu mới chỉ cần
   thêm một phần tử vào mảng SPREADS.
   ============================================================ */

window.SpreadData = (function () {
  'use strict';

  const SPREADS = [
    {
      id: 'one',
      name: 'Một lá',
      desc: 'Câu trả lời gọn cho một câu hỏi đang vướng.',
      count: 1,
      height: 260,
      slots: [{ x: 50, y: 50, label: 'Thông điệp' }]
    },
    {
      id: 'three',
      name: 'Ba lá',
      desc: 'Chuyện đã qua, chuyện đang ở, chuyện đang tới.',
      count: 3,
      height: 280,
      slots: [
        { x: 18, y: 50, label: 'Đã qua' },
        { x: 50, y: 50, label: 'Đang ở' },
        { x: 82, y: 50, label: 'Đang tới' }
      ]
    },
    {
      id: 'choice',
      name: 'Hai ngả',
      desc: 'Đang phân vân giữa hai lựa chọn thì rút bài này.',
      count: 5,
      height: 330,
      slots: [
        { x: 50, y: 20, label: 'Bạn lúc này' },
        { x: 20, y: 52, label: 'Ngả A' },
        { x: 20, y: 84, label: 'Nếu chọn A' },
        { x: 80, y: 52, label: 'Ngả B' },
        { x: 80, y: 84, label: 'Nếu chọn B' }
      ]
    },
    {
      id: 'love',
      name: 'Tình cảm',
      desc: 'Năm lá soi vào một mối quan hệ, cả hai phía.',
      count: 5,
      height: 330,
      slots: [
        { x: 18, y: 32, label: 'Lòng bạn' },
        { x: 82, y: 32, label: 'Lòng người ấy' },
        { x: 50, y: 30, label: 'Giữa hai người' },
        { x: 26, y: 78, label: 'Điều cản' },
        { x: 74, y: 78, label: 'Hướng đi' }
      ]
    },
    {
      id: 'work',
      name: 'Công việc',
      desc: 'Năm lá về nghề nghiệp, tiền bạc và bước kế tiếp.',
      count: 5,
      height: 330,
      slots: [
        { x: 50, y: 20, label: 'Chỗ đứng hiện tại' },
        { x: 20, y: 54, label: 'Điểm mạnh' },
        { x: 80, y: 54, label: 'Điểm nghẽn' },
        { x: 34, y: 86, label: 'Việc nên làm' },
        { x: 66, y: 86, label: 'Hướng mở ra' }
      ]
    },
    {
      id: 'celtic',
      name: 'Thập tự Celtic',
      desc: 'Mười lá, mổ xẻ một chuyện từ mọi phía.',
      count: 10,
      height: 600,
      slots: [
        { x: 36, y: 46, label: 'Chuyện chính' },
        { x: 36, y: 46, label: 'Điều cắt ngang', cross: true },
        { x: 36, y: 17, label: 'Điều bạn hướng tới' },
        { x: 36, y: 76, label: 'Gốc rễ' },
        { x: 14, y: 46, label: 'Vừa qua' },
        { x: 58, y: 46, label: 'Sắp tới' },
        { x: 84, y: 82, label: 'Chính bạn' },
        { x: 84, y: 62, label: 'Xung quanh' },
        { x: 84, y: 40, label: 'Mong & sợ' },
        { x: 84, y: 17, label: 'Kết quả' }
      ]
    }
  ];

  /* Chủ đề — đổi giọng luận giải cho hợp chuyện bạn hỏi */
  const TOPICS = [
    { id: 'work',    glyph: '🌿', name: 'Công việc',   hint: 'nghề nghiệp, học hành, tiền bạc' },
    { id: 'love',    glyph: '🌸', name: 'Tình cảm',    hint: 'người thương, gia đình, bạn bè' },
    { id: 'change',  glyph: '🍃', name: 'Ngã rẽ',      hint: 'chuyển chỗ, đổi việc, quyết định lớn' },
    { id: 'create',  glyph: '✶',  name: 'Sáng tạo',    hint: 'dự án riêng, cảm hứng, thể hiện mình' },
    { id: 'inner',   glyph: '🌙', name: 'Nội tâm',     hint: 'chữa lành, tự hiểu mình, bình yên' },
    { id: 'open',    glyph: '☁',  name: 'Chưa rõ',     hint: 'cứ rút, để bài nói trước' }
  ];

  /* Giọng lời khuyên theo chủ đề */
  const TOPIC_VOICE = {
    work: {
      up: 'Ở chuyện công việc, đây là tín hiệu để bạn làm tới. Chọn một việc cụ thể trong tuần này và hoàn thành nó trọn vẹn.',
      rev: 'Ở chuyện công việc, lá ngược khuyên bạn chậm lại một nhịp. Có chỗ đang gồng mà bạn chưa chịu thừa nhận là đang gồng.'
    },
    love: {
      up: 'Trong chuyện tình cảm, cứ để lòng mình mở. Nói ra điều thật trước khi nó thành khoảng cách.',
      rev: 'Trong chuyện tình cảm, có một điều chưa được nói thẳng. Bạn hỏi mình trước: mình thật sự đang cần gì ở đây?'
    },
    change: {
      up: 'Với ngã rẽ này, bài nói bạn đã đủ dữ kiện để chọn. Thứ bạn còn thiếu là sự cho phép của chính mình.',
      rev: 'Với ngã rẽ này, chưa phải lúc quyết. Cho mình thêm một tuần quan sát, đừng để ai giục.'
    },
    create: {
      up: 'Phần sáng tạo của bạn đang mở. Làm bản nháp xấu cũng được, miễn là có một bản.',
      rev: 'Phần sáng tạo đang tắc, thường vì bạn so sánh hơi nhiều. Tắt chỗ so sánh đi rồi làm lại.'
    },
    inner: {
      up: 'Với nội tâm, bạn đang đi đúng hướng. Giữ một thói quen nhỏ mỗi ngày là đủ.',
      rev: 'Với nội tâm, lá ngược không trách bạn. Nó chỉ nói: bạn cần nghỉ thật, không phải nghỉ trong lúc vẫn lo.'
    },
    open: {
      up: 'Chưa có câu hỏi rõ cũng không sao. Lá này cứ để đó, vài hôm nữa bạn sẽ hiểu nó nói gì.',
      rev: 'Lá ngược ở đây là một lời nhắc dịu: đừng ép mình phải rõ ràng ngay hôm nay.'
    }
  };

  return { SPREADS, TOPICS, TOPIC_VOICE,
    spread: (id) => SPREADS.find(s => s.id === id),
    topic:  (id) => TOPICS.find(t => t.id === id)
  };
})();
