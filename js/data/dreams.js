/* ============================================================
   data/dreams.js — từ điển biểu tượng giấc mơ
   Mỗi mục: từ khoá nhận dạng (theo TỪNG ngôn ngữ) + ý nghĩa (tiếng
   Việt, bản gốc) + câu hỏi gợi mở. Bản dịch ý nghĩa/câu hỏi sang
   EN/ZH/KO/JA nằm ở dreams-i18n.js (tra theo `id`), tách riêng để
   không phải sửa 2 nơi khi thêm biểu tượng mới.

   QUAN TRỌNG: trước đây từ khoá chỉ có tiếng Việt, nên nếu người
   dùng đổi ngôn ngữ rồi kể giấc mơ bằng tiếng Anh/Trung/Hàn/Nhật,
   hệ thống sẽ không dò trúng gì cả. Giờ mỗi biểu tượng có bộ từ
   khoá RIÊNG cho từng ngôn ngữ, dò theo đúng ngôn ngữ đang bật.
   ============================================================ */

window.DreamBook = (function () {
  'use strict';

  const SYMBOLS = [
    { id: 'falling', name: 'Rơi',
      key: {
        vi: ['rơi', 'té', 'ngã', 'rớt xuống'],
        en: ['falling', 'fell', 'fall down', 'dropped'],
        zh: ['坠落', '掉落', '摔倒', '跌落'],
        ko: ['떨어지', '추락', '넘어지'],
        ja: ['落ちる', '落下', '転ぶ']
      },
      mean: 'Giấc mơ rơi thường đến khi đời thực có chỗ bạn thấy mình mất kiểm soát, hoặc đang gồng giữ một thứ quá sức.',
      ask: 'Gần đây bạn đang cố giữ điều gì bằng hết sức mình?' },
    { id: 'flying', name: 'Bay',
      key: {
        vi: ['bay', 'lơ lửng', 'bay lên'],
        en: ['flying', 'floating', 'flew', 'soaring'],
        zh: ['飞', '飞翔', '漂浮', '悬浮'],
        ko: ['날다', '날아', '떠다니'],
        ja: ['飛ぶ', '浮く', '空を飛']
      },
      mean: 'Bay báo hiệu bạn vừa được nới ra khỏi một ràng buộc, hoặc rất khao khát được nới ra.',
      ask: 'Nếu ngày mai bớt đi một trách nhiệm, bạn muốn đó là việc gì?' },
    { id: 'chased', name: 'Bị rượt',
      key: {
        vi: ['bị rượt', 'bị đuổi', 'rượt đuổi', 'chạy trốn', 'truy đuổi'],
        en: ['chased', 'chasing', 'being chased', 'running away', 'pursued'],
        zh: ['追赶', '被追', '逃跑', '追逐'],
        ko: ['쫓기', '쫓아오', '도망'],
        ja: ['追われる', '追いかけ', '逃げる']
      },
      mean: 'Thứ đuổi theo bạn trong mơ hiếm khi là người khác. Thường là một việc bạn đang trì hoãn hoặc một cảm xúc bạn né.',
      ask: 'Có cuộc trò chuyện nào bạn đang hoãn mãi không?' },
    { id: 'teeth', name: 'Rụng răng',
      key: {
        vi: ['răng', 'rụng răng', 'gãy răng'],
        en: ['teeth', 'tooth falling', 'losing teeth', 'broken tooth'],
        zh: ['牙齿', '掉牙', '牙齿脱落'],
        ko: ['이빨', '이가 빠지', '치아'],
        ja: ['歯', '歯が抜け']
      },
      mean: 'Liên quan đến lời nói và hình ảnh của bạn trước người khác. Hay xuất hiện trước những dịp bạn sợ nói sai.',
      ask: 'Sắp tới bạn phải nói chuyện quan trọng với ai?' },
    { id: 'water', name: 'Nước',
      key: {
        vi: ['nước', 'biển', 'sông', 'hồ', 'bơi', 'lụt', 'ngập'],
        en: ['water', 'ocean', 'sea', 'river', 'lake', 'swimming', 'flood'],
        zh: ['水', '海', '河', '湖', '游泳', '洪水'],
        ko: ['물', '바다', '강', '호수', '수영', '홍수'],
        ja: ['水', '海', '川', '湖', '泳ぐ', '洪水']
      },
      mean: 'Nước là cảm xúc. Nước lặng là lòng yên, nước cuộn là cảm xúc dồn lâu chưa được xả.',
      ask: 'Lần gần nhất bạn khóc hoặc nói thật lòng là khi nào?' },
    { id: 'house', name: 'Nhà',
      key: {
        vi: ['nhà', 'căn nhà', 'ngôi nhà', 'phòng'],
        en: ['house', 'home', 'room', 'apartment'],
        zh: ['房子', '家', '房间'],
        ko: ['집', '방', '아파트'],
        ja: ['家', '部屋']
      },
      mean: 'Nhà trong mơ là chính bạn. Phòng lạ là phần bạn chưa khám phá, nhà cũ là chuyện chưa khép.',
      ask: 'Có phần nào trong bạn lâu rồi chưa được ghé thăm?' },
    { id: 'dog', name: 'Chó',
      key: {
        vi: ['chó', 'cún', 'chó con'],
        en: ['dog', 'puppy'],
        zh: ['狗', '小狗'],
        ko: ['개', '강아지'],
        ja: ['犬', '子犬']
      },
      mean: 'Chó là lòng trung thành và tình bạn. Chó hiền là sự nâng đỡ đang tới, chó dữ là bạn đang cảnh giác với ai đó.',
      ask: 'Ai là người bạn tin nhất lúc này, và bạn đã nói với họ chưa?' },
    { id: 'cat', name: 'Mèo',
      key: { vi: ['mèo'], en: ['cat', 'kitten'], zh: ['猫', '小猫'], ko: ['고양이'], ja: ['猫'] },
      mean: 'Mèo ứng với trực giác và phần độc lập trong bạn. Nó nhắc bạn tin linh cảm của mình hơn.',
      ask: 'Có linh cảm nào bạn đang cố gạt đi?' },
    { id: 'snake', name: 'Rắn',
      key: { vi: ['rắn'], en: ['snake', 'serpent'], zh: ['蛇'], ko: ['뱀'], ja: ['蛇', 'ヘビ'] },
      mean: 'Rắn lột da nên nó gắn với chuyển hoá. Sợ rắn trong mơ thường là sợ chính sự thay đổi mình đang đi tới.',
      ask: 'Điều gì trong bạn đang cũ đi và cần lột bỏ?' },
    { id: 'exam', name: 'Đi thi',
      key: {
        vi: ['thi', 'kỳ thi', 'đi thi', 'bài kiểm tra', 'trễ giờ thi'],
        en: ['exam', 'test', 'taking a test', 'quiz'],
        zh: ['考试', '测验'],
        ko: ['시험'],
        ja: ['試験', 'テスト']
      },
      mean: 'Mơ thi cử đến khi bạn đang bị chấm điểm ở đâu đó trong đời thật, hoặc tự chấm mình quá khắt khe.',
      ask: 'Ai là người đang chấm điểm bạn — người khác hay chính bạn?' },
    { id: 'missed', name: 'Lỡ chuyến',
      key: {
        vi: ['trễ', 'muộn', 'lỡ chuyến', 'lỡ xe', 'lỡ tàu', 'lỡ máy bay'],
        en: ['missed the flight', 'missed the train', 'running late', 'late for'],
        zh: ['迟到', '错过航班', '错过火车'],
        ko: ['늦었', '놓치', '지각'],
        ja: ['遅刻', '乗り遅れ', '間に合わ']
      },
      mean: 'Nỗi sợ bỏ lỡ. Thường đi kèm cảm giác người khác đang đi nhanh hơn mình.',
      ask: 'Bạn đang so nhịp của mình với ai?' },
    { id: 'deceased', name: 'Người đã khuất',
      key: {
        vi: ['người đã mất', 'người chết', 'ông bà', 'người thân đã mất'],
        en: ['someone who died', 'deceased', 'my late', 'passed away'],
        zh: ['去世的人', '已故'],
        ko: ['돌아가신', '故人'],
        ja: ['亡くなった人', '故人']
      },
      mean: 'Thường là cách tâm trí tiếp tục thương nhớ. Giấc mơ này hay mang lại sự dịu chứ không phải điềm gì.',
      ask: 'Có điều gì bạn còn muốn nói với người ấy không?' },
    { id: 'wedding', name: 'Đám cưới',
      key: {
        vi: ['cưới', 'đám cưới', 'hôn lễ'],
        en: ['wedding', 'getting married', 'marriage'],
        zh: ['婚礼', '结婚'],
        ko: ['결혼식', '결혼'],
        ja: ['結婚式', '結婚']
      },
      mean: 'Sự cam kết và hợp nhất — có thể là với một người, mà cũng có thể là với một lựa chọn trong đời.',
      ask: 'Bạn đang sắp gật đầu với điều gì?' },
    { id: 'baby', name: 'Em bé',
      key: {
        vi: ['em bé', 'trẻ con', 'sinh con', 'mang thai'],
        en: ['baby', 'infant', 'pregnant', 'giving birth'],
        zh: ['婴儿', '宝宝', '怀孕'],
        ko: ['아기', '임신'],
        ja: ['赤ちゃん', '妊娠']
      },
      mean: 'Một điều mới vừa hình thành trong bạn: dự án, mối quan hệ, hoặc một phiên bản mới của chính bạn.',
      ask: 'Điều gì trong bạn mới mẻ và còn cần được chăm?' },
    { id: 'money', name: 'Tiền',
      key: {
        vi: ['tiền', 'vàng', 'nhặt được tiền', 'mất tiền'],
        en: ['money', 'gold', 'found money', 'lost money'],
        zh: ['钱', '金子', '捡到钱', '丢钱'],
        ko: ['돈', '금', '돈을 잃'],
        ja: ['お金', '金', 'お金を拾']
      },
      mean: 'Ít khi nói về tiền thật. Thường là cảm giác về giá trị bản thân và sự an toàn.',
      ask: 'Gần đây bạn thấy mình có giá trị nhất khi làm gì?' },
    { id: 'fire', name: 'Lửa',
      key: { vi: ['lửa', 'cháy', 'hoả hoạn'], en: ['fire', 'burning', 'flames'], zh: ['火', '着火', '火灾'], ko: ['불', '화재'], ja: ['火', '火事'] },
      mean: 'Lửa là đam mê hoặc cơn giận. Nó đòi được nhìn thấy chứ không muốn bị dập.',
      ask: 'Có điều gì làm bạn giận mà bạn đang nén xuống?' },
    { id: 'lost', name: 'Lạc đường',
      key: {
        vi: ['đường', 'lạc đường', 'con đường', 'ngã ba', 'lạc'],
        en: ['lost', 'lost my way', 'can\'t find the way'],
        zh: ['迷路', '找不到路'],
        ko: ['길을 잃', '헤매'],
        ja: ['道に迷う', '迷子']
      },
      mean: 'Bạn đang ở giữa hai lựa chọn và chưa có bản đồ. Giấc mơ này không phải lời trách.',
      ask: 'Nếu không ai đánh giá, bạn sẽ rẽ hướng nào?' },
    { id: 'dark', name: 'Bóng tối',
      key: {
        vi: ['bóng tối', 'tối', 'mất điện', 'không thấy gì'],
        en: ['darkness', 'pitch black', 'power outage', 'can\'t see anything'],
        zh: ['黑暗', '停电', '看不见'],
        ko: ['어둠', '정전', '캄캄'],
        ja: ['暗闇', '停電', '真っ暗']
      },
      mean: 'Giai đoạn chưa rõ ràng. Thường đi trước một hiểu ra khá lớn.',
      ask: 'Bạn đang chờ ai đó bật đèn hộ mình à?' },
    { id: 'sky', name: 'Bầu trời',
      key: {
        vi: ['bay lên trời', 'trăng', 'sao', 'bầu trời'],
        en: ['sky', 'moon', 'stars', 'the heavens'],
        zh: ['天空', '月亮', '星星'],
        ko: ['하늘', '달', '별'],
        ja: ['空', '月', '星']
      },
      mean: 'Tầm nhìn xa và khao khát vượt khỏi chuyện vụn vặt hằng ngày.',
      ask: 'Điều lớn nhất bạn muốn trong năm năm tới là gì?' },
    { id: 'mirror', name: 'Gương',
      key: { vi: ['gương', 'soi gương'], en: ['mirror', 'reflection'], zh: ['镜子', '照镜子'], ko: ['거울'], ja: ['鏡'] },
      mean: 'Bạn đang nhìn lại chính mình, đôi khi hơi nghiêm khắc.',
      ask: 'Nếu nói với mình bằng giọng bạn dùng với bạn thân, bạn sẽ nói gì?' },
    { id: 'storm', name: 'Mưa bão',
      key: { vi: ['mưa', 'bão', 'giông'], en: ['rain', 'storm', 'thunder'], zh: ['雨', '暴风雨', '雷'], ko: ['비', '폭풍', '천둥'], ja: ['雨', '嵐', '雷'] },
      mean: 'Cảm xúc đang đổ xuống. Mưa trong mơ cũng thường là sự gột rửa.',
      ask: 'Có chuyện gì bạn cần khóc cho xong một lần?' },
    { id: 'climb', name: 'Leo cao',
      key: {
        vi: ['leo', 'núi', 'cầu thang', 'trèo'],
        en: ['climbing', 'mountain', 'stairs', 'climbing up'],
        zh: ['爬', '山', '楼梯'],
        ko: ['오르', '산', '계단'],
        ja: ['登る', '山', '階段']
      },
      mean: 'Nỗ lực dài hơi. Bậc thang trong mơ ứng với hành trình bạn đang ở giữa chừng.',
      ask: 'Bạn đã đi được bao xa rồi, và có nhớ ghi nhận điều đó không?' },
    { id: 'stuck', name: 'Bị kẹt',
      key: {
        vi: ['bị kẹt', 'không nhúc nhích', 'không kêu được', 'bóng đè'],
        en: ['stuck', 'can\'t move', 'paralyzed', 'sleep paralysis'],
        zh: ['卡住', '动不了', '鬼压床'],
        ko: ['갇히', '움직이지 못', '가위눌'],
        ja: ['動けない', '金縛り']
      },
      mean: 'Rất hay gặp khi đời thực có chuyện bạn thấy mình không nói được và không đi được.',
      ask: 'Ở đâu trong đời bạn đang thấy mình không có lối ra?' },
    { id: 'ex', name: 'Người cũ',
      key: {
        vi: ['người yêu cũ', 'bạn cũ', 'người cũ'],
        en: ['my ex', 'old friend', 'former partner'],
        zh: ['前任', '旧情人', '老朋友'],
        ko: ['전 애인', '옛 친구'],
        ja: ['元恋人', '昔の友人']
      },
      mean: 'Hiếm khi là về họ. Thường là về phiên bản của bạn hồi đó, hoặc một cảm giác bạn đang thiếu.',
      ask: 'Hồi ở bên người đó, bạn được là mình theo kiểu nào?' }
  ];

  const GENERIC = {
    mean: 'Giấc mơ này chưa khớp với biểu tượng nào trong sổ tay của Nody, nhưng điều đó không sao cả. ' +
          'Giấc mơ nói bằng ngôn ngữ riêng của mỗi người, và bạn là người dịch giỏi nhất.',
    ask: 'Trong giấc mơ đó, cảm xúc mạnh nhất bạn thấy là gì? Cảm xúc ấy gần đây xuất hiện lúc nào trong đời thật?'
  };

  const MOODS = [
    { id: 'fear', name: 'sợ hãi',
      key: { vi: ['sợ', 'hoảng', 'kinh hãi', 'ác mộng'], en: ['scared', 'afraid', 'terrified', 'nightmare'], zh: ['害怕', '恐惧', '噩梦'], ko: ['무서', '두려', '악몽'], ja: ['怖い', '恐怖', '悪夢'] },
      note: 'Sợ trong mơ thường là cách tâm trí tập dượt cho một nỗi lo có thật nhưng nhỏ hơn bạn tưởng.' },
    { id: 'sad', name: 'buồn',
      key: { vi: ['buồn', 'khóc', 'cô đơn'], en: ['sad', 'crying', 'lonely'], zh: ['难过', '哭', '孤独'], ko: ['슬프', '울', '외로'], ja: ['悲しい', '泣く', '孤独'] },
      note: 'Nỗi buồn trong mơ hay là phần cảm xúc ban ngày bạn chưa có chỗ để đặt xuống.' },
    { id: 'happy', name: 'dễ chịu',
      key: { vi: ['vui', 'hạnh phúc', 'ấm'], en: ['happy', 'joyful', 'warm'], zh: ['开心', '快乐', '温暖'], ko: ['행복', '기쁘', '따뜻'], ja: ['嬉しい', '幸せ', '温かい'] },
      note: 'Giấc mơ dễ chịu là dấu hiệu tốt: hệ thần kinh của bạn đang được nghỉ thật.' },
    { id: 'angry', name: 'giận',
      key: { vi: ['giận', 'tức', 'cãi'], en: ['angry', 'furious', 'arguing'], zh: ['生气', '愤怒', '吵架'], ko: ['화나', '분노', '싸우'], ja: ['怒る', '腹立', '喧嘩'] },
      note: 'Giận trong mơ thường là ranh giới của bạn đang bị lấn mà ban ngày bạn chưa lên tiếng.' },
    { id: 'anxious', name: 'lo lắng',
      key: { vi: ['lo', 'gấp', 'vội', 'áp lực'], en: ['anxious', 'worried', 'rushed', 'pressure'], zh: ['焦虑', '担心', '匆忙', '压力'], ko: ['불안', '걱정', '급하', '압박'], ja: ['不安', '心配', '急', 'プレッシャー'] },
      note: 'Sự vội vã trong mơ phản chiếu một cái deadline, thật hoặc tự đặt ra.' }
  ];

  function lang() { return (window.I18N ? window.I18N.get() : 'vi'); }

  function localize(item) {
    const I = window.DreamI18N;
    const lg = lang();
    if (lg === 'vi' || !I || !I[item.id] || !I[item.id][lg]) return item;
    const t = I[item.id][lg];
    return Object.assign({}, item, t);
  }

  function keysFor(item) {
    const lg = lang();
    return (item.key && (item.key[lg] || item.key.vi)) || [];
  }

  function lookup(text) {
    const t = text.toLowerCase();
    const found = SYMBOLS.filter(s => keysFor(s).some(k => t.includes(k.toLowerCase()))).map(localize);
    const moodHit = MOODS.find(m => keysFor(m).some(k => t.includes(k.toLowerCase())));
    const mood = moodHit ? localize(moodHit) : null;
    return { symbols: found, mood, generic: GENERIC };
  }

  return { SYMBOLS, MOODS, lookup, GENERIC, localize, keysFor };
})();
