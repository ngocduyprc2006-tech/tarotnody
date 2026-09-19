/* ============================================================
   data/dreams.js — từ điển biểu tượng giấc mơ
   Mỗi mục: từ khoá nhận dạng + ý nghĩa + câu hỏi gợi mở.
   Thêm biểu tượng mới: cứ nối thêm vào mảng, không cần sửa gì khác.
   ============================================================ */

window.DreamBook = (function () {
  'use strict';

  const SYMBOLS = [
    { key: ['rơi', 'té', 'ngã', 'rớt xuống'], name: 'Rơi',
      mean: 'Giấc mơ rơi thường đến khi đời thực có chỗ bạn thấy mình mất kiểm soát, hoặc đang gồng giữ một thứ quá sức.',
      ask: 'Gần đây bạn đang cố giữ điều gì bằng hết sức mình?' },
    { key: ['bay', 'lơ lửng', 'bay lên'], name: 'Bay',
      mean: 'Bay báo hiệu bạn vừa được nới ra khỏi một ràng buộc, hoặc rất khao khát được nới ra.',
      ask: 'Nếu ngày mai bớt đi một trách nhiệm, bạn muốn đó là việc gì?' },
    { key: ['bị rượt', 'bị đuổi', 'rượt đuổi', 'chạy trốn', 'truy đuổi'], name: 'Bị rượt',
      mean: 'Thứ đuổi theo bạn trong mơ hiếm khi là người khác. Thường là một việc bạn đang trì hoãn hoặc một cảm xúc bạn né.',
      ask: 'Có cuộc trò chuyện nào bạn đang hoãn mãi không?' },
    { key: ['răng', 'rụng răng', 'gãy răng'], name: 'Rụng răng',
      mean: 'Liên quan đến lời nói và hình ảnh của bạn trước người khác. Hay xuất hiện trước những dịp bạn sợ nói sai.',
      ask: 'Sắp tới bạn phải nói chuyện quan trọng với ai?' },
    { key: ['nước', 'biển', 'sông', 'hồ', 'bơi', 'lụt', 'ngập'], name: 'Nước',
      mean: 'Nước là cảm xúc. Nước lặng là lòng yên, nước cuộn là cảm xúc dồn lâu chưa được xả.',
      ask: 'Lần gần nhất bạn khóc hoặc nói thật lòng là khi nào?' },
    { key: ['nhà', 'căn nhà', 'ngôi nhà', 'phòng'], name: 'Nhà',
      mean: 'Nhà trong mơ là chính bạn. Phòng lạ là phần bạn chưa khám phá, nhà cũ là chuyện chưa khép.',
      ask: 'Có phần nào trong bạn lâu rồi chưa được ghé thăm?' },
    { key: ['chó', 'cún', 'chó con'], name: 'Chó',
      mean: 'Chó là lòng trung thành và tình bạn. Chó hiền là sự nâng đỡ đang tới, chó dữ là bạn đang cảnh giác với ai đó.',
      ask: 'Ai là người bạn tin nhất lúc này, và bạn đã nói với họ chưa?' },
    { key: ['mèo'], name: 'Mèo',
      mean: 'Mèo ứng với trực giác và phần độc lập trong bạn. Nó nhắc bạn tin linh cảm của mình hơn.',
      ask: 'Có linh cảm nào bạn đang cố gạt đi?' },
    { key: ['rắn'], name: 'Rắn',
      mean: 'Rắn lột da nên nó gắn với chuyển hoá. Sợ rắn trong mơ thường là sợ chính sự thay đổi mình đang đi tới.',
      ask: 'Điều gì trong bạn đang cũ đi và cần lột bỏ?' },
    { key: ['thi', 'kỳ thi', 'đi thi', 'bài kiểm tra', 'trễ giờ thi'], name: 'Đi thi',
      mean: 'Mơ thi cử đến khi bạn đang bị chấm điểm ở đâu đó trong đời thật, hoặc tự chấm mình quá khắt khe.',
      ask: 'Ai là người đang chấm điểm bạn — người khác hay chính bạn?' },
    { key: ['trễ', 'muộn', 'lỡ chuyến', 'lỡ xe', 'lỡ tàu', 'lỡ máy bay'], name: 'Lỡ chuyến',
      mean: 'Nỗi sợ bỏ lỡ. Thường đi kèm cảm giác người khác đang đi nhanh hơn mình.',
      ask: 'Bạn đang so nhịp của mình với ai?' },
    { key: ['người đã mất', 'người chết', 'ông bà', 'người thân đã mất'], name: 'Người đã khuất',
      mean: 'Thường là cách tâm trí tiếp tục thương nhớ. Giấc mơ này hay mang lại sự dịu chứ không phải điềm gì.',
      ask: 'Có điều gì bạn còn muốn nói với người ấy không?' },
    { key: ['cưới', 'đám cưới', 'hôn lễ'], name: 'Đám cưới',
      mean: 'Sự cam kết và hợp nhất — có thể là với một người, mà cũng có thể là với một lựa chọn trong đời.',
      ask: 'Bạn đang sắp gật đầu với điều gì?' },
    { key: ['em bé', 'trẻ con', 'sinh con', 'mang thai'], name: 'Em bé',
      mean: 'Một điều mới vừa hình thành trong bạn: dự án, mối quan hệ, hoặc một phiên bản mới của chính bạn.',
      ask: 'Điều gì trong bạn mới mẻ và còn cần được chăm?' },
    { key: ['tiền', 'vàng', 'nhặt được tiền', 'mất tiền'], name: 'Tiền',
      mean: 'Ít khi nói về tiền thật. Thường là cảm giác về giá trị bản thân và sự an toàn.',
      ask: 'Gần đây bạn thấy mình có giá trị nhất khi làm gì?' },
    { key: ['lửa', 'cháy', 'hoả hoạn'], name: 'Lửa',
      mean: 'Lửa là đam mê hoặc cơn giận. Nó đòi được nhìn thấy chứ không muốn bị dập.',
      ask: 'Có điều gì làm bạn giận mà bạn đang nén xuống?' },
    { key: ['đường', 'lạc đường', 'con đường', 'ngã ba', 'lạc'], name: 'Lạc đường',
      mean: 'Bạn đang ở giữa hai lựa chọn và chưa có bản đồ. Giấc mơ này không phải lời trách.',
      ask: 'Nếu không ai đánh giá, bạn sẽ rẽ hướng nào?' },
    { key: ['bóng tối', 'tối', 'mất điện', 'không thấy gì'], name: 'Bóng tối',
      mean: 'Giai đoạn chưa rõ ràng. Thường đi trước một hiểu ra khá lớn.',
      ask: 'Bạn đang chờ ai đó bật đèn hộ mình à?' },
    { key: ['bay lên trời', 'trăng', 'sao', 'bầu trời'], name: 'Bầu trời',
      mean: 'Tầm nhìn xa và khao khát vượt khỏi chuyện vụn vặt hằng ngày.',
      ask: 'Điều lớn nhất bạn muốn trong năm năm tới là gì?' },
    { key: ['gương', 'soi gương'], name: 'Gương',
      mean: 'Bạn đang nhìn lại chính mình, đôi khi hơi nghiêm khắc.',
      ask: 'Nếu nói với mình bằng giọng bạn dùng với bạn thân, bạn sẽ nói gì?' },
    { key: ['mưa', 'bão', 'giông'], name: 'Mưa bão',
      mean: 'Cảm xúc đang đổ xuống. Mưa trong mơ cũng thường là sự gột rửa.',
      ask: 'Có chuyện gì bạn cần khóc cho xong một lần?' },
    { key: ['leo', 'núi', 'cầu thang', 'trèo'], name: 'Leo cao',
      mean: 'Nỗ lực dài hơi. Bậc thang trong mơ ứng với hành trình bạn đang ở giữa chừng.',
      ask: 'Bạn đã đi được bao xa rồi, và có nhớ ghi nhận điều đó không?' },
    { key: ['bị kẹt', 'không nhúc nhích', 'không kêu được', 'bóng đè'], name: 'Bị kẹt',
      mean: 'Rất hay gặp khi đời thực có chuyện bạn thấy mình không nói được và không đi được.',
      ask: 'Ở đâu trong đời bạn đang thấy mình không có lối ra?' },
    { key: ['người yêu cũ', 'bạn cũ', 'người cũ'], name: 'Người cũ',
      mean: 'Hiếm khi là về họ. Thường là về phiên bản của bạn hồi đó, hoặc một cảm giác bạn đang thiếu.',
      ask: 'Hồi ở bên người đó, bạn được là mình theo kiểu nào?' }
  ];

  const GENERIC = {
    mean: 'Giấc mơ này chưa khớp với biểu tượng nào trong sổ tay của Cún, nhưng điều đó không sao cả. ' +
          'Giấc mơ nói bằng ngôn ngữ riêng của mỗi người, và bạn là người dịch giỏi nhất.',
    ask: 'Trong giấc mơ đó, cảm xúc mạnh nhất bạn thấy là gì? Cảm xúc ấy gần đây xuất hiện lúc nào trong đời thật?'
  };

  const MOODS = [
    { key: ['sợ', 'hoảng', 'kinh hãi', 'ác mộng'], name: 'sợ hãi',
      note: 'Sợ trong mơ thường là cách tâm trí tập dượt cho một nỗi lo có thật nhưng nhỏ hơn bạn tưởng.' },
    { key: ['buồn', 'khóc', 'cô đơn'], name: 'buồn',
      note: 'Nỗi buồn trong mơ hay là phần cảm xúc ban ngày bạn chưa có chỗ để đặt xuống.' },
    { key: ['vui', 'hạnh phúc', 'ấm'], name: 'dễ chịu',
      note: 'Giấc mơ dễ chịu là dấu hiệu tốt: hệ thần kinh của bạn đang được nghỉ thật.' },
    { key: ['giận', 'tức', 'cãi'], name: 'giận',
      note: 'Giận trong mơ thường là ranh giới của bạn đang bị lấn mà ban ngày bạn chưa lên tiếng.' },
    { key: ['lo', 'gấp', 'vội', 'áp lực'], name: 'lo lắng',
      note: 'Sự vội vã trong mơ phản chiếu một cái deadline, thật hoặc tự đặt ra.' }
  ];

  function lookup(text) {
    const t = text.toLowerCase();
    const found = SYMBOLS.filter(s => s.key.some(k => t.includes(k)));
    const mood = MOODS.find(m => m.key.some(k => t.includes(k)));
    return { symbols: found, mood, generic: GENERIC };
  }

  return { SYMBOLS, MOODS, lookup, GENERIC };
})();
