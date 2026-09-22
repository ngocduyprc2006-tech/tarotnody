/* ============================================================
   i18n.js — bộ máy đa ngôn ngữ dùng chung cho MỌI trang
   ------------------------------------------------------------
   5 ngôn ngữ: vi (mặc định/gốc), en, zh (Trung giản thể),
   ko (Hàn), ja (Nhật).

   Cách dùng trong HTML:
     <span data-i18n="nav.tarot"></span>
     <input data-i18n-placeholder="auth.emailPlaceholder">
     <button data-i18n-title="help.openTitle">?</button>

   Cách dùng trong JS:
     I18N.t('nav.tarot')            → chuỗi theo ngôn ngữ hiện tại
     I18N.t('card.up', {name:'Fool'}) → thay {name} trong chuỗi
     I18N.apply()                   → quét lại toàn bộ trang
     I18N.setLang('en')             → đổi ngôn ngữ + lưu + apply

   Thêm khoá mới: thêm một dòng vào STRINGS bên dưới, đủ 5 ngôn ngữ.
   Thiếu ngôn ngữ nào thì tự rơi về tiếng Việt (không bị trống).
   ============================================================ */

(function () {
  'use strict';

  const LANGS = ['vi', 'en', 'zh', 'ko', 'ja'];
  const LANG_META = {
    vi: { flag: '🇻🇳', label: 'Tiếng Việt', cc: 'vn' },
    en: { flag: '🇬🇧', label: 'English', cc: 'gb' },
    zh: { flag: '🇨🇳', label: '中文', cc: 'cn' },
    ko: { flag: '🇰🇷', label: '한국어', cc: 'kr' },
    ja: { flag: '🇯🇵', label: '日本語', cc: 'jp' }
  };

  /* ========================================================
     BẢNG DỊCH — mọi chữ dùng chung toàn site
     ======================================================== */
  const STRINGS = {
    /* ---------- menu & thương hiệu ---------- */
    'brand.tag':        { vi: 'Nody Tarot', en: 'Nody Tarot', zh: 'Nody 塔罗', ko: 'Nody 타로', ja: 'Nody タロット' },
    'nav.home':         { vi: 'Trang chủ', en: 'Home', zh: '首页', ko: '홈', ja: 'ホーム' },
    'nav.tarot':        { vi: 'Trải bài Tarot', en: 'Tarot Reading', zh: '塔罗牌阵', ko: '타로 리딩', ja: 'タロット占い' },
    'nav.daily':        { vi: 'Lá bài hôm nay', en: "Card of the Day", zh: '每日一牌', ko: '오늘의 카드', ja: '今日のカード' },
    'nav.numerology':   { vi: 'Thần số học', en: 'Numerology', zh: '生命数字', ko: '수비학', ja: '数秘術' },
    'nav.horoscope':    { vi: 'Chiêm tinh', en: 'Horoscope', zh: '星座运势', ko: '별자리 운세', ja: '星占い' },
    'nav.match':        { vi: 'Ghép đôi', en: 'Compatibility', zh: '缘分配对', ko: '궁합', ja: '相性診断' },
    'nav.dream':        { vi: 'Giải mã giấc mơ', en: 'Dream Meaning', zh: '解梦', ko: '꿈해몽', ja: '夢占い' },
    'nav.wheel':        { vi: 'Vòng quay', en: 'Lucky Wheel', zh: '幸运转盘', ko: '행운의 룰렛', ja: 'ラッキーホイール' },
    'nav.letter':       { vi: 'Thư gửi mai sau', en: 'Letter to the Future', zh: '给未来的信', ko: '미래에게 쓰는 편지', ja: '未来への手紙' },
    'nav.photobooth':   { vi: 'Photobooth', en: 'Photobooth', zh: '拍照亭', ko: '포토부스', ja: 'フォトブース' },
    'nav.wallet':       { vi: 'Nạp & Gói', en: 'Top-up & Plans', zh: '充值与套餐', ko: '충전 & 요금제', ja: 'チャージ＆プラン' },
    'nav.history':      { vi: 'Hồ sơ & lịch sử', en: 'Profile & History', zh: '我的与记录', ko: '내 정보 & 기록', ja: 'マイページ' },
    'nav.admin':        { vi: 'Quản trị', en: 'Admin', zh: '管理后台', ko: '관리자', ja: '管理画面' },

    /* ---------- trang chủ ---------- */
    'home.group.divination': { vi: 'Bói bài', en: 'Readings', zh: '占卜', ko: '점술', ja: '占い' },
    'home.group.birth':      { vi: 'Ngày sinh & con số', en: 'Birth date & numbers', zh: '生日与数字', ko: '생년월일 & 숫자', ja: '生年月日と数字' },
    'home.group.gentle':     { vi: 'Nhẹ nhàng hơn', en: 'Something gentler', zh: '更轻松一点', ko: '더 가볍게', ja: 'もっと気軽に' },
    'home.tag.full':    { vi: 'Đầy đủ', en: 'Full', zh: '完整版', ko: '전체', ja: 'フル版' },
    'home.tag.free':    { vi: 'Miễn phí', en: 'Free', zh: '免费', ko: '무료', ja: '無料' },
    'home.desc.tarot':      { vi: '6 kiểu trải, từ một lá tới Thập tự Celtic', en: '6 spreads, from a single card to the Celtic Cross', zh: '6种牌阵，从单张牌到凯尔特十字', ko: '6가지 스프레드, 한 장 뽑기부터 켈틱 크로스까지', ja: '1枚引きからケルト十字まで6種類のスプレッド' },
    'home.desc.daily':      { vi: 'Một lá, một việc nhỏ để làm hôm nay', en: 'One card, one small thing to do today', zh: '一张牌，今天一件小事', ko: '카드 한 장, 오늘 할 작은 일 하나', ja: '1枚のカードと、今日やる小さなこと' },
    'home.desc.numerology': { vi: '5 chỉ số cốt lõi và năm cá nhân của bạn', en: 'Your 5 core numbers and personal year', zh: '5个核心数字与你的个人年', ko: '핵심 숫자 5가지와 개인 연도', ja: '5つの中心数とあなたのパーソナルイヤー' },
    'home.desc.horoscope':  { vi: 'Cung hoàng đạo và thời tiết tâm trạng hôm nay', en: "Your zodiac sign and today's mood weather", zh: '星座与今日心情天气', ko: '별자리와 오늘의 기분 날씨', ja: '星座と今日の気分の天気' },
    'home.desc.match':      { vi: 'Hai cái tên, hai ngày sinh, một câu trả lời', en: 'Two names, two birthdates, one answer', zh: '两个名字，两个生日，一个答案', ko: '이름 둘, 생일 둘, 답 하나', ja: '2つの名前、2つの誕生日、ひとつの答え' },
    'home.desc.dream':      { vi: 'Kể lại giấc mơ, Nody lật sổ tay biểu tượng', en: 'Tell your dream, Nody flips through the symbol notebook', zh: '讲述你的梦，诺迪翻开象征笔记本', ko: '꿈을 들려주면 노디가 상징 노트를 펼쳐봐요', ja: '夢を話すと、ノディが象徴ノートをめくります' },
    'home.desc.wheel':      { vi: 'Một lượt mỗi ngày, một lời nhắc dễ thương', en: 'One spin a day, one sweet little reminder', zh: '每天一次，一句可爱的小提醒', ko: '하루 한 번, 사랑스러운 작은 메시지', ja: '1日1回、かわいいひとことのヒント' },
    'home.desc.letter':     { vi: 'Viết cho chính bạn của một năm nữa', en: 'Write to yourself, one year from now', zh: '写给一年后的自己', ko: '1년 뒤의 나에게 쓰는 편지', ja: '1年後の自分への手紙' },
    'home.moon.dayOf':      { vi: 'ngày thứ {n} của chu kỳ', en: 'day {n} of the cycle', zh: '周期第{n}天', ko: '주기 {n}일째', ja: '周期{n}日目' },
    'home.moon.fallback':   { vi: 'Trăng đi hết một vòng mất khoảng 29 ngày rưỡi, và tâm trạng con người cũng có nhịp của nó.', en: 'The Moon takes about 29.5 days for one full cycle, and moods have a rhythm of their own too.', zh: '月亮绕完一圈大约需要29天半，人的心情也有自己的节奏。', ko: '달은 한 바퀴 도는 데 약 29일 반이 걸리고, 사람의 기분에도 나름의 리듬이 있어요.', ja: '月は約29.5日で一周し、人の気分にもそれぞれのリズムがある。' },
    'home.hero.today':      { vi: 'lá của hôm nay', en: "today's card", zh: '今日之牌', ko: '오늘의 카드', ja: '今日のカード' },

    /* ---------- chiêm tinh ---------- */
    'horo.area.love':   { vi: 'Tình cảm', en: 'Love', zh: '感情', ko: '연애', ja: '恋愛' },
    'horo.area.work':   { vi: 'Công việc', en: 'Work', zh: '工作', ko: '일', ja: '仕事' },
    'horo.area.money':  { vi: 'Tiền bạc', en: 'Money', zh: '财运', ko: '금전', ja: 'お金' },
    'horo.area.health': { vi: 'Sức khoẻ', en: 'Health', zh: '健康', ko: '건강', ja: '健康' },
    'horo.area.spirit': { vi: 'Tinh thần', en: 'Mind', zh: '精神', ko: '마음', ja: '心' },
    'horo.element':     { vi: 'hành', en: 'element', zh: '属性', ko: '원소', ja: '属性' },
    'horo.el.Lửa':      { vi: 'Lửa', en: 'Fire', zh: '火', ko: '불', ja: '火' },
    'horo.el.Đất':      { vi: 'Đất', en: 'Earth', zh: '土', ko: '흙', ja: '土' },
    'horo.el.Khí':      { vi: 'Khí', en: 'Air', zh: '风', ko: '공기', ja: '風' },
    'horo.el.Nước':     { vi: 'Nước', en: 'Water', zh: '水', ko: '물', ja: '水' },
    'horo.luckyColor':  { vi: 'Màu hợp hôm nay', en: 'Lucky color today', zh: '今日幸运色', ko: '오늘의 행운 색', ja: '今日のラッキーカラー' },
    'horo.luckyHour':   { vi: 'Khung giờ dễ chịu', en: 'Comfortable hours', zh: '舒适时段', ko: '편안한 시간대', ja: '心地よい時間帯' },
    'horo.whatKind':    { vi: 'Bạn là kiểu người thế nào', en: 'What kind of person you are', zh: '你是怎样的人', ko: '당신은 어떤 사람인가요', ja: 'あなたはどんな人か' },
    'horo.today':       { vi: 'Hôm nay', en: 'Today', zh: '今天', ko: '오늘', ja: '今日' },
    'horo.areasToday':  { vi: 'Các mặt trong ngày', en: "Today's areas", zh: '今日各方面', ko: '오늘의 각 영역', ja: '今日の各分野' },
    'horo.inOneLine':   { vi: 'Gọn lại một câu', en: 'In one line', zh: '一句话总结', ko: '한 줄 요약', ja: 'ひとことで言うと' },
    'horo.summary':     { vi: 'Hôm nay <b style="color:var(--moon)">{best}</b> là chỗ dễ thở nhất của bạn — cứ dồn sức vào đó. Còn <b style="color:var(--blossom)">{weak}</b> thì hạ kỳ vọng xuống một nấc, mai tính tiếp cũng chẳng sao.',
                           en: 'Today <b style="color:var(--moon)">{best}</b> is where you can breathe easiest — put your energy there. As for <b style="color:var(--blossom)">{weak}</b>, ease your expectations a notch; it can wait until tomorrow.',
                           zh: '今天 <b style="color:var(--moon)">{best}</b> 是你最轻松的地方，把力气放在这里。而 <b style="color:var(--blossom)">{weak}</b> 可以放低一点期待，明天再说也没关系。',
                           ko: '오늘은 <b style="color:var(--moon)">{best}</b>가 가장 숨쉬기 편한 영역이에요 — 그쪽에 힘을 쏟아보세요. <b style="color:var(--blossom)">{weak}</b>은 기대를 한 단계 낮춰도 괜찮아요, 내일 다시 생각해도 늦지 않아요.',
                           ja: '今日は <b style="color:var(--moon)">{best}</b> が一番息をつきやすい分野です。そこに力を注ぎましょう。<b style="color:var(--blossom)">{weak}</b> は期待を少し下げても大丈夫。明日また考えればいい。' },
    'horo.disclaimer':  { vi: 'Chiêm tinh mô tả thời tiết, không quyết định bạn đi đâu. Trời mưa thì mang ô, vậy thôi.',
                           en: "Astrology describes the weather, not where you're headed. If it rains, bring an umbrella — that's all.",
                           zh: '占星描述的是天气，不是决定你要去哪里。下雨就带伞，仅此而已。',
                           ko: '점성술은 날씨를 알려줄 뿐, 당신이 어디로 갈지 결정하지 않아요. 비가 오면 우산을 챙기면 될 뿐이에요.',
                           ja: '占星術は天気を教えてくれるだけで、あなたの行き先を決めるものではない。雨が降るなら傘を持てばいいだけのこと。' },
    'horo.pickDob':     { vi: 'Bạn chọn ngày sinh giúp mình nhé.', en: 'Please choose your date of birth.', zh: '请选择你的出生日期。', ko: '생년월일을 선택해 주세요.', ja: '生年月日を選んでください。' },

    /* ---------- trải bài tarot ---------- */
    'tarot.errPickSpread': { vi: 'Bạn chọn một kiểu trải bài trước nhé.', en: 'Please choose a spread first.', zh: '请先选择一种牌阵。', ko: '먼저 스프레드를 선택해 주세요.', ja: '先にスプレッドを選んでください。' },
    'tarot.shuffleTitle':  { vi: 'Xáo bài rồi rút {n} lá', en: 'Shuffle, then draw {n} card(s)', zh: '洗牌后抽取{n}张', ko: '섞은 뒤 {n}장 뽑기', ja: 'シャッフルして{n}枚引く' },
    'tarot.profile.toggle': { vi: 'Xác nhận họ tên & ngày sinh để trải bài chính xác nhất (không bắt buộc)', en: 'Confirm your name & birth date for the most accurate reading (optional)', zh: '确认姓名与出生日期，让占卜更精准（可选）', ko: '이름과 생년월일을 확인하면 더 정확한 리딩이 돼요 (선택 사항)', ja: 'お名前と生年月日を確認すると、より正確な占いになります（任意）' },
    'tarot.profile.name': { vi: 'Tên của bạn', en: 'Your name', zh: '你的名字', ko: '이름', ja: 'お名前' },
    'tarot.profile.dob':  { vi: 'Ngày sinh', en: 'Date of birth', zh: '出生日期', ko: '생년월일', ja: '生年月日' },
    'tarot.profile.hint': { vi: 'Nody dùng ngày sinh để biết cung hoàng đạo và hành của bạn, rồi lồng vào lời luận giải mỗi lá — không lưu lại nếu bạn chưa đăng nhập.', en: "Nody uses your birth date to know your zodiac sign and element, then weaves it into each card's reading — not saved unless you're logged in.", zh: '诺迪会用出生日期得知你的星座与属性，并融入每张牌的解读——未登录时不会保存。', ko: '노디는 생년월일로 별자리와 원소를 파악해 각 카드 해석에 반영해요 — 로그인하지 않으면 저장되지 않아요.', ja: 'ノディは生年月日から星座と属性を知り、各カードの解釈に反映します。ログインしていなければ保存されません。' },
    'read.reversed':    { vi: 'Nằm ngược', en: 'Reversed', zh: '逆位', ko: '역방향', ja: '逆位置' },
    'read.upright':     { vi: 'Nằm xuôi', en: 'Upright', zh: '正位', ko: '정방향', ja: '正位置' },
    'read.forTopic':    { vi: 'Đặt vào chuyện {topic} của bạn', en: 'Applied to your {topic}', zh: '放入你的{topic}来看', ko: '당신의 {topic}에 적용해 보면', ja: 'あなたの{topic}に当てはめると' },
    'read.inLove':      { vi: 'Trong tình yêu', en: 'In love', zh: '在感情上', ko: '사랑에서는', ja: '恋愛では' },
    'read.inWork':      { vi: 'Trong công việc', en: 'In work', zh: '在工作上', ko: '일에서는', ja: '仕事では' },
    'read.todayAdvice': { vi: 'Việc nên làm hôm nay', en: 'What to do today', zh: '今天该做的事', ko: '오늘 할 일', ja: '今日やるべきこと' },
    'read.journalQ':    { vi: 'Câu hỏi để tự vấn', en: 'A question to sit with', zh: '留给自己的一个问题', ko: '스스로에게 물어볼 질문', ja: '自分に問いかける質問' },
    'read.ifNothing':   { vi: 'Nếu bạn cứ để yên, không làm gì', en: "If you leave it alone and do nothing", zh: '如果你什么都不做，就这样放着', ko: '아무것도 하지 않고 그냥 둔다면', ja: '何もせずそのままにしておくと' },
    'read.profileTie':  { vi: 'Vì bạn là {sign} (hành {el}), lá này còn gợi ý bạn để ý thêm phần trực giác riêng của {sign}.', en: 'Since you are {sign} ({el}), this card also nudges you to trust the intuition typical of {sign}.', zh: '因为你是{sign}（{el}属性），这张牌也在提醒你多留意{sign}特有的直觉。', ko: '당신은 {sign}({el})이기 때문에, 이 카드는 {sign} 특유의 직감에도 귀 기울여보라고 말하고 있어요.', ja: 'あなたは{sign}（{el}）なので、このカードは{sign}らしい直感にも耳を傾けるよう促している。' },
    'read.profileTieLong': { vi: 'Vì bạn mang cung {sign} (hành {el}), phần bản năng {el} trong bạn sẽ là chỗ dựa tốt để đọc bài lần này.', en: 'Since you carry the sign of {sign} ({el}), the {el} instinct in you is a good anchor for reading this spread.', zh: '因为你属于{sign}（{el}属性），你内在的{el}本能会是解读这次牌阵的好依靠。', ko: '당신은 {sign}({el}) 별자리를 지녔기에, 내면의 {el} 본능이 이번 리딩을 읽는 좋은 기준이 될 거예요.', ja: 'あなたは{sign}（{el}）の星座を持っているので、あなたの中の{el}の本能がこの展開を読み解くよい拠り所になる。' },
    'tarot.drawCount': { vi: 'Đã rút {n} trên {total} lá', en: 'Drawn {n} of {total} cards', zh: '已抽 {n}／{total} 张', ko: '{total}장 중 {n}장 뽑음', ja: '{total}枚中{n}枚を引いた' },
    'tarot.drawHint.start': { vi: 'Nhắm mắt, nghĩ về điều bạn đang vướng, rồi chạm vào lá nào gọi bạn.', en: "Close your eyes, think of what's on your mind, then touch whichever card calls to you.", zh: '闭上眼睛，想着你正困扰的事，然后触碰那张呼唤你的牌。', ko: '눈을 감고 마음에 걸리는 일을 떠올린 뒤, 끌리는 카드를 만져보세요.', ja: '目を閉じて、気にかかっていることを思い浮かべ、呼びかけてくるカードに触れて。' },
    'tarot.drawHint.done':  { vi: 'Đủ rồi. Đang bày ra bàn…', en: "That's enough. Laying them out…", zh: '够了，正在摆开牌面…', ko: '충분해요. 테이블에 펼치는 중…', ja: '十分です。テーブルに広げています…' },
    'tarot.drawHint.more':  { vi: 'Còn nữa, cứ chậm rãi.', en: 'A few more — no rush.', zh: '还有几张，慢慢来。', ko: '아직 남았어요, 천천히 하세요.', ja: 'まだ続きます。ゆっくりどうぞ。' },
    'tarot.shuffled': { vi: 'Đã xáo lại bộ bài ✨', en: 'Deck reshuffled ✨', zh: '牌已重新洗过 ✨', ko: '카드를 다시 섞었어요 ✨', ja: 'デッキをシャッフルしました ✨' },
    'read.reversedShort': { vi: 'ngược', en: 'reversed', zh: '逆位', ko: '역방향', ja: '逆位置' },
    'read.uprightShort':  { vi: 'xuôi', en: 'upright', zh: '正位', ko: '정방향', ja: '正位置' },
    'synth.flow.manyMajor': { vi: 'Nhiều lá Ẩn Chính cùng xuất hiện, nghĩa là chuyện bạn hỏi không phải chuyện vặt của tuần này. Nó thuộc về một chương lớn hơn, và những gì bạn quyết lúc này sẽ còn vang khá lâu.', en: "Several Major Arcana appearing together means what you're asking isn't just this week's small matter. It belongs to a bigger chapter, and what you decide now will echo for a while.", zh: '多张大阿尔卡纳同时出现，说明你问的不是这周的小事，而是属于更大的一个篇章，此刻的决定会回响很久。', ko: '메이저 아르카나가 여럿 함께 나왔다는 건, 지금 묻는 게 이번 주의 사소한 일이 아니라는 뜻이에요. 더 큰 장에 속한 일이라, 지금의 결정이 꽤 오래 울릴 거예요.', ja: '大アルカナが複数同時に現れたということは、あなたの尋ねていることが今週だけの小さな事ではないということ。もっと大きな章に属しており、今の決断はしばらく響き続ける。' },
    'synth.flow.noMajor': { vi: 'Không có lá Ẩn Chính nào, và đó là tin lành. Chuyện này nằm trong tay bạn, xử lý được bằng những việc rất đời thường chứ không cần phép màu nào cả.', en: "No Major Arcana at all — and that's good news. This is within your own hands, solvable with very ordinary actions, no magic required.", zh: '没有出现大阿尔卡纳，这是个好消息。这件事掌握在你自己手中，用很平常的方法就能处理，不需要什么奇迹。', ko: '메이저 아르카나가 하나도 없네요, 좋은 소식이에요. 이 일은 당신 손 안에 있고, 아주 평범한 방법으로 해결할 수 있어요, 기적이 필요한 게 아니에요.', ja: '大アルカナが一枚もない。これは良い知らせ。この件はあなた自身の手の中にあり、ごく普通のことで対処できる。奇跡は要らない。' },
    'synth.flow.mixed': { vi: 'Bài pha giữa chuyện lớn và chuyện thường ngày. Có một dòng chảy nền đang đẩy bạn đi, nhưng phần lớn kết quả vẫn phụ thuộc vào những lựa chọn nhỏ mỗi ngày.', en: "The spread mixes the big and the everyday. There's a background current pushing you along, but most of the outcome still depends on small daily choices.", zh: '这次牌阵大事与日常交织。有一股背景潮流在推着你走，但大部分结果仍取决于每天的小选择。', ko: '이번 카드는 큰일과 일상이 섞여 있어요. 배경에 흐르는 기류가 당신을 밀어주지만, 결과는 대부분 매일의 작은 선택에 달려 있어요.', ja: 'このリーディングは大きな事と日常が入り混じっている。背後に流れがあなたを押しているが、結果の大部分は日々の小さな選択にかかっている。' },
    'synth.flow.suitRepeat': { vi: 'Chất {suit} lặp lại {n} lần, kéo trọng tâm về phía {domain}.', en: 'The {suit} suit repeats {n} times, pulling the focus toward {domain}.', zh: '{suit}花色重复出现{n}次，把重心拉向了{domain}。', ko: '{suit} 슈트가 {n}번 반복되어, 초점이 {domain} 쪽으로 쏠려요.', ja: '{suit}のスートが{n}回繰り返され、焦点が{domain}へと引き寄せられている。' },
    'synth.tone.none': { vi: 'Tất cả các lá đều nằm xuôi. Năng lượng đang chảy thuận, không có gì chặn bạn ngoài chính sự do dự.', en: "All cards are upright. Energy is flowing smoothly — nothing is blocking you except your own hesitation.", zh: '所有牌都是正位。能量流动顺畅，唯一阻碍你的只有自己的犹豫。', ko: '모든 카드가 정방향이에요. 에너지가 순조롭게 흐르고 있고, 당신을 막는 건 오직 자신의 망설임뿐이에요.', ja: 'すべてのカードが正位置。エネルギーは順調に流れており、あなたを妨げているのは自分自身のためらいだけ。' },
    'synth.tone.some': { vi: 'Phần lớn lá nằm xuôi, vài lá ngược chỉ là chỗ cần chậm lại chứ không phải lời cảnh báo.', en: "Most cards are upright; the few reversed ones just mark places to slow down, not warnings.", zh: '大部分牌是正位，少数逆位只是提醒你放慢脚步，不是警告。', ko: '대부분 정방향이고, 몇 장의 역방향은 그저 속도를 늦추라는 뜻이지 경고가 아니에요.', ja: 'ほとんどが正位置で、少数の逆位置はただ速度を落とすべき箇所を示しているだけで、警告ではない。' },
    'synth.tone.many': { vi: 'Khá nhiều lá ngược. Không phải điềm xấu đâu — nó thường có nghĩa là bạn đang mệt hơn mình thừa nhận, và cơ thể lẫn tâm trí đang xin một quãng nghỉ thật sự.', en: "Quite a few reversed cards. It's not a bad omen — it usually means you're more tired than you admit, and body and mind are asking for real rest.", zh: '逆位牌不少。这不是坏兆头——通常意味着你比自己承认的更累，身心都在请求真正的休息。', ko: '역방향 카드가 꽤 많네요. 나쁜 징조가 아니에요 — 보통 스스로 인정하는 것보다 더 지쳐 있다는 뜻이고, 몸과 마음이 진짜 휴식을 원하고 있어요.', ja: '逆位置のカードがかなり多い。悪い兆しではなく、たいてい自分で認めている以上に疲れていて、心と体が本当の休息を求めているサイン。' },
    'synth.tone.most': { vi: 'Gần như cả bài nằm ngược. Đây là lúc dừng hẳn việc cố gắng hướng ra ngoài và quay vào chăm mình. Mọi thứ sẽ mở lại, nhưng không phải trong tuần này.', en: "Almost the whole spread is reversed. This is a time to stop pushing outward entirely and turn inward to care for yourself. Things will open up again, just not this week.", zh: '几乎整副牌都是逆位。这是彻底停止向外用力、转而照顾自己的时候。一切都会重新打开，只是不在这一周。', ko: '거의 모든 카드가 역방향이에요. 지금은 밖으로 애쓰는 걸 완전히 멈추고 자신을 돌볼 때예요. 모든 게 다시 열리겠지만, 이번 주는 아니에요.', ja: 'ほぼ全体が逆位置。今は外に向かって頑張るのを完全にやめ、自分自身を労わる時。物事はまた開けていくが、今週ではない。' },
    'synth.leaning':    { vi: 'Bài đang nghiêng về đâu', en: 'Which way the reading leans', zh: '这次牌局的倾向', ko: '카드가 기울어진 방향', ja: 'リーディングの傾き' },
    'synth.readChain':  { vi: 'Đọc theo mạch', en: 'Reading the thread', zh: '按脉络解读', ko: '흐름대로 읽기', ja: '流れで読む' },
    'synth.aboutQuestion': { vi: 'Về câu bạn hỏi', en: 'About your question', zh: '关于你的问题', ko: '당신의 질문에 대해', ja: 'あなたの質問について' },
    'synth.youAsked':   { vi: 'Bạn hỏi: "{q}".', en: 'You asked: "{q}".', zh: '你问："{q}"。', ko: '질문하셨어요: "{q}".', ja: 'あなたの質問：「{q}」。' },
    'synth.closestAnswer': { vi: 'Câu trả lời gần nhất nằm ở lá {card}', en: 'The closest answer lies in the {card} card', zh: '最贴近的答案在{card}这张牌里', ko: '가장 가까운 답은 {card} 카드에 있어요', ja: '最も近い答えは{card}のカードにある' },
    'synth.closing.0':  { vi: 'Đừng cố hiểu hết bài trong hôm nay. Chọn một dòng khiến bạn hơi nhói, rồi làm một việc nhỏ theo nó.', en: "Don't try to understand the whole reading today. Pick one line that stings a little, and do one small thing about it.", zh: '别急着今天就看懂整个牌局，挑一句让你有点触动的话，照它做一件小事就好。', ko: '오늘 다 이해하려 하지 마세요. 마음에 살짝 걸리는 한 줄을 골라, 그에 맞는 작은 일 하나만 해보세요.', ja: '今日ですべてを理解しようとしなくていい。少し胸に刺さった一行を選んで、それに沿って小さなことをひとつやってみて。' },
    'synth.closing.1':  { vi: 'Bài không bảo bạn phải làm gì. Nó chỉ nói ra điều bạn đã biết, để bạn khỏi phải một mình biết nữa.', en: "The cards aren't telling you what to do. They're just voicing what you already knew, so you're not alone in knowing it.", zh: '牌不会命令你做什么，它只是说出你早已知道的事，让你不必独自承担这份明白。', ko: '카드는 뭘 하라고 명령하지 않아요. 그저 당신이 이미 알고 있던 걸 말해줄 뿐, 그걸 혼자 알지 않게 해줘요.', ja: 'カードは何をすべきか命じているのではない。あなたがすでに知っていたことを声にして、ひとりで抱えなくていいようにしているだけ。' },
    'synth.closing.2':  { vi: 'Nếu đọc xong thấy nhẹ đi một chút, vậy là đủ rồi. Phần còn lại cứ để ngày mai lo.', en: "If you feel a little lighter after reading this, that's enough. Leave the rest for tomorrow.", zh: '如果读完后觉得轻松了一点，那就够了，剩下的交给明天。', ko: '다 읽고 나서 마음이 조금 가벼워졌다면 그걸로 충분해요. 나머지는 내일에게 맡기세요.', ja: '読み終えて少し軽くなったなら、それで十分。残りは明日に任せよう。' },
    'synth.closing.3':  { vi: 'Nody chỉ nhắc một điều: bạn đang xoay xở tốt hơn bạn tự chấm cho mình nhiều lắm.', en: "Nody just wants to remind you of one thing: you're handling this far better than you're giving yourself credit for.", zh: 'Nody 只想提醒一句：你处理得比自己给自己打的分数好得多。', ko: '노디는 한 가지만 말하고 싶어요: 당신은 스스로 매긴 점수보다 훨씬 더 잘 해내고 있어요.', ja: 'ノディはひとつだけ伝えたい。あなたは自分に付けている点数よりずっとうまくやれている。' },
    'synth.savedToast': { vi: 'Đã cất vào lịch sử của bạn 🌙', en: 'Saved to your history 🌙', zh: '已保存到你的历史记录 🌙', ko: '히스토리에 저장했어요 🌙', ja: '履歴に保存しました 🌙' },
    'synth.arc': { vi: 'Từ lá {firstLabel} ({firstCard}) tới lá {lastLabel} ({lastCard}), bài đang kể một hành trình có điểm bắt đầu và điểm đến rõ ràng — không phải một mớ sự kiện rời rạc.', en: 'From the {firstLabel} card ({firstCard}) to the {lastLabel} card ({lastCard}), this spread traces a journey with a clear start and destination — not a pile of unrelated events.', zh: '从"{firstLabel}"（{firstCard}）到"{lastLabel}"（{lastCard}），这次牌阵讲的是一段有始有终的旅程，而不是一堆零散的事。', ko: '"{firstLabel}"({firstCard}) 카드에서 "{lastLabel}"({lastCard}) 카드까지, 이 카드는 뚜렷한 시작과 도착지가 있는 하나의 여정을 말하고 있어요 — 흩어진 사건들의 나열이 아니에요.', ja: '「{firstLabel}」（{firstCard}）から「{lastLabel}」（{lastCard}）まで、このリーディングは始まりと終わりがはっきりした一つの旅を語っている。バラバラな出来事の寄せ集めではない。' },
    'synth.actionList': { vi: 'Ba việc nên làm, gọi thẳng từ các lá vừa rút', en: 'Three things to do, straight from the cards you drew', zh: '三件该做的事，直接来自你刚抽的牌', ko: '방금 뽑은 카드에서 바로 나온, 해볼 일 세 가지', ja: '引いたカードから直接導かれる、やるべき3つのこと' },

    /* ---------- giải mã giấc mơ ---------- */
    'dream.mood':      { vi: 'cảm xúc', en: 'mood', zh: '情绪', ko: '감정', ja: '感情' },
    'dream.foundIntro': { vi: 'Trong đoạn bạn kể, Nody nhận ra {n} biểu tượng quen thuộc. Đọc từng cái nhé.', en: 'In what you shared, Nody spotted {n} familiar symbol(s). Read through each one.', zh: '在你讲述的内容里，诺迪认出了{n}个熟悉的意象，一个个来看吧。', ko: '들려주신 이야기에서 노디가 익숙한 상징 {n}개를 찾았어요. 하나씩 읽어보세요.', ja: 'あなたの話の中に、ノディは{n}個の馴染みある象徴を見つけました。ひとつずつ読んでみて。' },
    'dream.ownDream':  { vi: 'giấc mơ riêng của bạn', en: 'your own unique dream', zh: '属于你自己的梦', ko: '당신만의 꿈', ja: 'あなただけの夢' },
    'dream.aboutMood': { vi: 'Về cảm xúc trong giấc mơ', en: 'About the feeling in your dream', zh: '关于梦里的情绪', ko: '꿈속 감정에 대해', ja: '夢の中の感情について' },
    'dream.cardFor':   { vi: 'Một lá bài cho giấc mơ này', en: 'A card for this dream', zh: '为这个梦抽的一张牌', ko: '이 꿈을 위한 카드 한 장', ja: 'この夢のための一枚' },
    'dream.disclaimer': { vi: 'Giấc mơ không phải lời tiên tri. Nó là cách tâm trí bạn dọn dẹp ban đêm — và đôi khi nó để lại một mẩu giấy nhắn.', en: "A dream isn't a prophecy. It's how your mind tidies up at night — and sometimes it leaves a little note behind.", zh: '梦不是预言，它是你的心在夜里做的整理——有时会留下一张小纸条。', ko: '꿈은 예언이 아니에요. 밤사이 마음이 정리를 하는 방식일 뿐이고, 가끔은 작은 쪽지를 남겨두기도 해요.', ja: '夢は予言ではない。心が夜のうちに片付けをしているだけ。時々、小さなメモを残していく。' },
    'dream.lastNight': { vi: 'Đêm qua mình mơ thấy ', en: 'Last night I dreamed of ', zh: '昨晚我梦见了', ko: '어젯밤 꿈에서 ', ja: '昨夜、夢で見たのは' },
    'dream.errShort':  { vi: 'Kể thêm một chút nữa nhé, ít nhất một câu.', en: 'Tell a bit more — at least one full sentence.', zh: '再多说一点吧，至少一句完整的话。', ko: '조금만 더 이야기해주세요, 최소 한 문장은요.', ja: 'もう少し話してください。最低でもひと文は。' },
    'dream.thinking':  { vi: 'Nody đang lật sổ tay giấc mơ', en: 'Nody is flipping through the dream notebook', zh: '诺迪正在翻阅解梦笔记本', ko: '노디가 꿈 노트를 넘겨보고 있어요', ja: 'ノディが夢のノートをめくっています' },
    'dream.noSymbol':  { vi: 'không rõ biểu tượng', en: 'no clear symbol', zh: '暂无明确意象', ko: '뚜렷한 상징 없음', ja: '明確な象徴なし' },

    /* ---------- ghép đôi ---------- */
    'match.v0.title': { vi: 'Hợp lạ thường', en: 'Unusually well matched', zh: '异常合拍', ko: '이상하게 잘 맞는 사이', ja: '不思議なほど相性がいい' },
    'match.v0.text':  { vi: 'Hai bạn khớp nhau ở tầng sâu, kiểu ngồi im cạnh nhau cũng không thấy ngượng. Cái cần giữ là đừng lấy sự hợp này làm lý do để ngừng cố gắng.', en: "You two click on a deep level — the kind where sitting in silence together never feels awkward. Just don't let this ease become a reason to stop trying.", zh: '你们在很深的层面契合，安静地坐在一起也不会尴尬。要留意的是，别把这份合拍当成停止努力的理由。', ko: '두 사람은 깊은 층위에서 잘 맞아요, 아무 말 없이 앉아 있어도 어색하지 않을 정도로요. 다만 이 잘 맞음을 노력을 멈출 핑계로 삼지 마세요.', ja: '二人は深いところで通じ合っていて、黙って隣にいても気まずくない。ただ、この相性の良さを努力をやめる理由にしないで。' },
    'match.v1.title': { vi: 'Rất hợp', en: 'Very compatible', zh: '非常合拍', ko: '아주 잘 맞아요', ja: 'とても相性がいい' },
    'match.v1.text':  { vi: 'Nền tảng tốt và hai bạn bù cho nhau khá đẹp. Có vài chỗ lệch nhưng đều thuộc loại nói ra là gỡ được.', en: 'A strong foundation, and you complement each other nicely. A few mismatches, but the kind that untangle once spoken aloud.', zh: '基础很好，彼此也互补得不错。有些小分歧，但都是说开就能解决的那种。', ko: '기반이 튼튼하고 서로를 꽤 잘 채워줘요. 몇 군데 어긋난 부분이 있지만 말하면 풀리는 종류예요.', ja: '土台がしっかりしていて、互いをうまく補い合っている。多少のズレはあるが、口に出せば解ける類のもの。' },
    'match.v2.title': { vi: 'Hợp, cần chăm', en: 'Compatible, needs care', zh: '合适，但需要用心', ko: '잘 맞지만 가꿔야 해요', ja: '相性は良いが手入れが必要' },
    'match.v2.text':  { vi: 'Duyên có thật, hợp có thật, nhưng mối này sống được nhờ giao tiếp chứ không nhờ may mắn. Chịu khó nói thì đi xa.', en: 'The chemistry is real and so is the fit, but this relationship survives on communication, not luck. Keep talking and it will go far.', zh: '缘分是真的，合拍也是真的，但这段关系靠沟通维系，不是靠运气。愿意多说，就能走得远。', ko: '인연도 진짜고 잘 맞는 것도 진짜지만, 이 관계는 운이 아니라 대화로 살아가요. 부지런히 말하면 멀리 갈 수 있어요.', ja: '縁も相性も本物だが、この関係は運ではなく対話で成り立つ。話し続ければ長く続く。' },
    'match.v3.title': { vi: 'Khác nhau nhiều', en: 'Quite different', zh: '差异较大', ko: '많이 달라요', ja: 'かなり違うタイプ' },
    'match.v3.text':  { vi: 'Hai bạn nhìn đời bằng hai kiểu khác hẳn. Không phải không được, chỉ là cần nhiều kiên nhẫn và ít kỳ vọng "người kia phải hiểu mình".', en: 'You two see life through very different lenses. Not impossible — it just needs more patience and less expecting the other to just get it.', zh: '你们看待生活的方式很不一样。不是不行，只是需要更多耐心，少一些"对方该懂我"的期待。', ko: '두 사람은 인생을 아주 다르게 바라봐요. 안 되는 건 아니지만, 인내심이 더 필요하고 "상대가 알아서 이해해주겠지"라는 기대는 줄여야 해요.', ja: '二人は人生をまったく違う視点で見ている。不可能ではないが、忍耐がより必要で、「相手が分かってくれるはず」という期待は控えめに。' },
    'match.v4.title': { vi: 'Rất khác nhau', en: 'Very different', zh: '非常不同', ko: '아주 많이 달라요', ja: 'とても異なるタイプ' },
    'match.v4.text':  { vi: 'Chỉ số thấp không có nghĩa là không thể. Nó chỉ nói rằng nếu chọn nhau, hai bạn sẽ phải chọn một cách rất có ý thức, mỗi ngày.', en: "A low score doesn't mean impossible. It just means that if you choose each other, you'll have to choose consciously, every day.", zh: '分数低不代表不可能，只是说明如果选择彼此，就要每天都非常有意识地去选择。', ko: '점수가 낮다고 불가능한 건 아니에요. 다만 서로를 선택한다면, 매일 아주 의식적으로 선택해야 한다는 뜻이에요.', ja: '数値が低いからといって不可能ではない。ただ、お互いを選ぶなら、毎日とても意識的に選び続ける必要があるということ。' },
    'match.nameFate': { vi: 'Duyên tên gọi', en: 'Name chemistry', zh: '姓名缘分', ko: '이름 궁합', ja: '名前の縁' },
    'match.strongWhere': { vi: 'Hai bạn mạnh ở đâu', en: 'Where you two are strong', zh: '你们的优势在哪里', ko: '두 사람의 강점은 어디에', ja: '二人の強みはどこにあるか' },
    'match.frictionWhere': { vi: 'Chỗ dễ va nhất', en: 'Where friction is likeliest', zh: '最容易碰撞的地方', ko: '가장 부딪히기 쉬운 지점', ja: '最も摩擦が起きやすい点' },
    'match.weekTask': { vi: 'Một việc nên làm tuần này', en: 'One thing to do this week', zh: '这周该做的一件事', ko: '이번 주에 해볼 일 하나', ja: '今週やってみるべきこと' },
    'match.disclaimer': { vi: 'Không có cặp nào hợp sẵn 100%. Điểm số chỉ nói hai bạn xuất phát từ đâu, còn đi được bao xa thì do hai người chọn.', en: 'No pair is 100% compatible out of the box. The score just says where you start — how far you go is up to the two of you.', zh: '没有天生100%契合的组合。分数只说明你们的起点，能走多远由两人自己决定。', ko: '처음부터 100% 잘 맞는 커플은 없어요. 점수는 두 사람이 어디서 출발하는지를 말해줄 뿐, 얼마나 멀리 가는지는 두 사람의 선택에 달렸어요.', ja: '最初から100%相性が良いカップルなどいない。スコアはスタート地点を示すだけで、どこまで行けるかは二人次第。' },
    'match.strength.sameEl': { vi: 'Cùng hành {el} nên hai bạn hiểu nhau gần như không cần giải thích. Nhịp sống, tốc độ, cách phản ứng đều na ná — cái này rất quý.', en: "Sharing the {el} element means you understand each other almost without explaining. Your pace and reactions are alike — that's rare and valuable.", zh: '同属{el}属性，你们几乎不用解释就能懂对方。生活节奏、反应方式都很相似——这很珍贵。', ko: '같은 {el} 원소라 서로 설명 없이도 거의 다 이해해요. 삶의 리듬과 반응 방식이 비슷한 건 정말 소중한 거예요.', ja: '同じ{el}の属性なので、説明なしでもほぼ理解し合える。生活のリズムや反応の仕方が似ているのはとても貴重。' },
    'match.strength.feedEl': { vi: 'Hành {elA} và hành {elB} nuôi nhau. Người này làm người kia sáng lên mà không phải cố.', en: 'The {elA} and {elB} elements feed each other — one brings out the best in the other without trying.', zh: '{elA}属性和{elB}属性相互滋养，一方能自然地让另一方发光。', ko: '{elA}와 {elB} 원소는 서로를 북돋아줘요. 애쓰지 않아도 서로를 빛나게 해요.', ja: '{elA}と{elB}の属性は互いを育て合う。無理せず相手を輝かせられる。' },
    'match.strength.numComplement': { vi: 'Số đường đời {la} và {lb} là một cặp bổ khuyết đẹp: chỗ người này thiếu thì người kia có sẵn.', en: 'Life Path {la} and {lb} complement each other beautifully — where one lacks, the other already has it.', zh: '生命数字{la}和{lb}是很好的互补组合：一方缺的，另一方正好有。', ko: '생명수 {la}와 {lb}는 아름답게 서로를 채워줘요 — 한쪽이 부족한 걸 다른 쪽이 이미 갖고 있어요.', ja: 'ライフパス{la}と{lb}は美しく補い合う。一方に足りないものを、もう一方がすでに持っている。' },
    'match.strength.different': { vi: '{a} mang chất {elA}, {b} mang chất {elB}. Khác nhau nhưng chính khác nhau mới làm hai bạn thấy đối phương thú vị.', en: "{a} carries {elA} energy, {b} carries {elB}. Different — but it's exactly that difference that makes each of you interesting to the other.", zh: '{a}带着{elA}的气质，{b}带着{elB}的气质。不同，但正是这份不同让彼此觉得对方有趣。', ko: '{a}는 {elA} 기질을, {b}는 {elB} 기질을 지녔어요. 다르지만, 바로 그 다름이 서로를 흥미롭게 만들어요.', ja: '{a}は{elA}の気質、{b}は{elB}の気質を持つ。違うけれど、その違いこそが互いを興味深く感じさせる。' },
    'match.friction.elemGap': { vi: 'Hành {elA} và {elB} vốn đi khác tốc độ. Người muốn quyết nhanh, người cần ngẫm lâu — và cả hai đều nghĩ mình đúng. Thoả thuận trước một khung thời gian cho các quyết định lớn sẽ đỡ nhiều.', en: 'The {elA} and {elB} elements naturally move at different speeds — one wants to decide fast, the other needs time, and both feel right. Agreeing on a timeframe for big decisions ahead of time helps a lot.', zh: '{elA}和{elB}属性本就步调不同——一个想快点决定，一个需要慢慢想，而两人都觉得自己没错。提前约定重大决定的时间框架会有很大帮助。', ko: '{elA}와 {elB} 원소는 원래 속도가 달라요. 한쪽은 빨리 결정하고 싶고, 한쪽은 오래 고민해야 하죠 — 그리고 둘 다 자기가 맞다고 생각해요. 큰 결정에 대해 미리 기한을 정해두면 훨씬 나아져요.', ja: '{elA}と{elB}の属性はもともと速度が違う。すぐ決めたい方と、じっくり考えたい方がいて、どちらも自分が正しいと思っている。大事な決断には前もって期限を決めておくとかなり楽になる。' },
    'match.friction.numGap': { vi: 'Hai con số đường đời cách nhau khá xa nên ưu tiên trong đời cũng khác. Đừng cố thuyết phục nhau đổi ưu tiên, hãy chia lịch để cả hai đều được sống theo ưu tiên của mình.', en: "Your Life Path numbers are quite far apart, so your life priorities differ too. Don't try to convert each other — split the schedule so you each get to live by your own priorities.", zh: '两个生命数字相差较大，人生的优先事项也不同。别试图说服对方改变优先级，不如分配时间，让两人都能按自己的重心生活。', ko: '두 생명수의 차이가 꽤 커서 인생의 우선순위도 달라요. 서로 우선순위를 바꾸라고 설득하기보다, 각자의 우선순위대로 살 수 있도록 일정을 나눠보세요.', ja: 'ライフパスの数字がかなり離れているので、人生の優先順位も違う。互いに優先順位を変えさせようとせず、それぞれの優先順位で生きられるようスケジュールを分けよう。' },
    'match.friction.bothTired': { vi: 'Chỗ dễ va nhất là khi cả hai cùng mệt. Lúc đó hai bạn có xu hướng im lặng chờ người kia mở lời trước — và thế là im cả tuần.', en: "The likeliest friction point is when you're both exhausted. You tend to go quiet, each waiting for the other to speak first — and a week of silence follows.", zh: '最容易碰撞的时候是两人都很累的时候。那时你们都倾向于沉默着等对方先开口——结果就沉默了一整周。', ko: '가장 부딪히기 쉬운 건 둘 다 지쳤을 때예요. 그럴 때 서로 먼저 말 걸기를 기다리며 침묵하다가 한 주 내내 조용해지곤 해요.', ja: '最も摩擦が起きやすいのは、二人とも疲れている時。そんな時は互いに黙って相手が先に話すのを待ち、結局一週間沈黙が続く。' },
    'match.advice.0': { vi: 'Hỏi nhau một câu hai bạn chưa từng hỏi: "Dạo này cái gì làm bạn mệt nhất mà mình không biết?"', en: 'Ask each other a question you\'ve never asked: "What\'s been tiring you out lately that I don\'t know about?"', zh: '问对方一个从未问过的问题："最近有什么让你累的事，是我不知道的？"', ko: '한 번도 물어본 적 없는 질문을 해보세요: "요즘 내가 모르는 것 중 널 가장 지치게 하는 게 뭐야?"', ja: '一度も聞いたことのない質問をしてみて：「最近、私が知らないことで一番疲れさせていることは何？」' },
    'match.advice.1': { vi: 'Dành một buổi không điện thoại. Không cần đi đâu sang, ngồi ăn với nhau là đủ.', en: 'Spend one evening with no phones. No need to go anywhere fancy — just eating together is enough.', zh: '安排一次不看手机的时光，不必去什么高级的地方，一起吃顿饭就够了。', ko: '휴대폰 없는 저녁을 보내보세요. 거창한 곳에 갈 필요 없이, 같이 밥 먹는 것만으로 충분해요.', ja: 'スマホなしの時間を作ろう。特別な場所に行く必要はなく、一緒に食事するだけで十分。' },
    'match.advice.2': { vi: 'Mỗi người viết ra ba điều biết ơn về người kia rồi đọc cho nhau nghe. Ngượng thì ngượng, nhưng hiệu nghiệm.', en: 'Each of you write down three things you\'re grateful for about the other, then read them aloud. Awkward, but it works.', zh: '各自写下对对方心存感激的三件事，然后读给彼此听。会有点尴尬，但很有效。', ko: '서로에게 고마운 점 세 가지씩 적어서 소리 내어 읽어주세요. 어색하긴 해도 효과가 있어요.', ja: 'それぞれ相手に感謝していることを3つ書き出して、読み上げてみて。照れくさいけれど効果的。' },
    'match.advice.3': { vi: 'Nói trước một ranh giới nhỏ của mình, thay vì đợi bị lấn rồi mới giận.', en: 'State one small boundary of yours upfront, instead of waiting to feel crossed and then getting upset.', zh: '提前说出自己的一个小界限，而不是等被侵犯了才生气。', ko: '침범당하고 나서 화내기보다, 자신의 작은 경계 하나를 미리 말해두세요.', ja: '踏み越えられてから怒るのではなく、自分の小さな境界線を先に伝えておこう。' },
    'match.errName': { vi: 'Cần tên của cả hai người.', en: "We need both people's names.", zh: '需要两个人的名字。', ko: '두 사람의 이름이 모두 필요해요.', ja: 'お二人のお名前が必要です。' },
    'match.errDob':  { vi: 'Cần ngày sinh của cả hai người.', en: "We need both people's dates of birth.", zh: '需要两个人的出生日期。', ko: '두 사람의 생년월일이 모두 필요해요.', ja: 'お二人の生年月日が必要です。' },

    /* ---------- vòng quay ---------- */
    'wheel.rest.label':  { vi: 'Nghỉ đi', en: 'Rest', zh: '休息一下', ko: '쉬어가요', ja: '休もう' },
    'wheel.rest.text':   { vi: 'Hôm nay vũ trụ cho phép bạn không cố gắng. Làm ít lại một nửa, và đừng thấy có lỗi.', en: "Today the universe gives you permission not to push. Do half as much, and don't feel guilty about it.", zh: '今天宇宙允许你不必努力，少做一半也没关系，别有负罪感。', ko: '오늘은 우주가 애쓰지 않아도 된다고 허락하는 날이에요. 절반만 해도 괜찮고, 죄책감 갖지 마세요.', ja: '今日は宇宙が「頑張らなくていい」と許してくれる日。半分でいいし、罪悪感を持たないで。' },
    'wheel.speak.label': { vi: 'Nói ra', en: 'Speak up', zh: '说出来', ko: '말해봐요', ja: '口に出そう' },
    'wheel.speak.text':  { vi: 'Có một câu bạn giữ trong lòng lâu rồi. Hôm nay là ngày đẹp để nói nó ra, nhẹ nhàng thôi.', en: "There's something you've held inside for a while. Today's a good day to say it, gently.", zh: '有句话你憋在心里很久了，今天是个不错的日子，轻轻地说出来吧。', ko: '오랫동안 마음에 담아둔 말이 있죠. 오늘은 그걸 부드럽게 꺼내놓기 좋은 날이에요.', ja: 'しばらく心にしまっていた言葉があるはず。今日は優しく口に出すのにいい日。' },
    'wheel.start.label': { vi: 'Bắt đầu', en: 'Begin', zh: '开始', ko: '시작해요', ja: '始めよう' },
    'wheel.start.text':  { vi: 'Việc bạn hoãn mãi ấy — mở nó ra mười lăm phút thôi. Không cần xong, chỉ cần mở.', en: "That thing you keep postponing — open it for just fifteen minutes. It doesn't need to be finished, just started.", zh: '那件你一直拖延的事——花十五分钟打开它就好，不必做完，只要开始。', ko: '계속 미뤄온 그 일, 딱 15분만 열어보세요. 끝낼 필요 없어요, 시작만 하면 돼요.', ja: 'ずっと先延ばしにしていること、15分だけ開いてみて。終わらせなくていい、始めるだけでいい。' },
    'wheel.meet.label':  { vi: 'Gặp người', en: 'Reach out', zh: '联系一个人', ko: '연락해봐요', ja: '会いに行こう' },
    'wheel.meet.text':   { vi: 'Nhắn cho một người bạn nghĩ tới sáng nay. Cuộc trò chuyện đó sẽ dễ chịu hơn bạn tưởng.', en: "Message someone you thought of this morning. That conversation will feel better than you expect.", zh: '给今早想到的那个人发条消息，这次对话会比你想象的更愉快。', ko: '오늘 아침 떠올랐던 사람에게 메시지를 보내보세요. 그 대화는 생각보다 훨씬 편안할 거예요.', ja: '今朝ふと思い浮かんだ人にメッセージを送ってみて。その会話は思ったより心地よいはず。' },
    'wheel.tidy.label':  { vi: 'Dọn gọn', en: 'Tidy up', zh: '整理一下', ko: '정리해요', ja: '片付けよう' },
    'wheel.tidy.text':   { vi: 'Dọn một góc nhỏ. Bàn làm việc, ví tiền, hay danh sách việc — gọn ngoài thì nhẹ trong.', en: "Tidy one small corner — a desk, a wallet, a to-do list. Order outside brings ease inside.", zh: '整理一个小角落，书桌、钱包，或者待办清单——外面整齐了，心里也会轻松。', ko: '작은 구석 하나만 정리해보세요. 책상, 지갑, 할 일 목록 — 겉이 정돈되면 속도 가벼워져요.', ja: '小さな一角を片付けて。机、財布、やることリスト——外が整うと中も軽くなる。' },
    'wheel.trust.label': { vi: 'Tin mình', en: 'Trust yourself', zh: '相信自己', ko: '스스로를 믿어요', ja: '自分を信じよう' },
    'wheel.trust.text':  { vi: 'Linh cảm sáng nay của bạn đúng đấy. Đừng hỏi thêm người thứ ba nữa.', en: "Your gut feeling this morning was right. No need to ask a third person again.", zh: '你今早的直觉是对的，不用再多问第三个人了。', ko: '오늘 아침 느낀 직감이 맞아요. 세 번째 사람에게 또 물어볼 필요 없어요.', ja: '今朝の直感は正しかった。もう三人目に聞き直す必要はない。' },
    'wheel.slow.label':  { vi: 'Chậm lại', en: 'Slow down', zh: '慢下来', ko: '천천히 가요', ja: 'ゆっくり行こう' },
    'wheel.slow.text':   { vi: 'Bạn đang đi nhanh hơn sức mình. Bớt một việc trong danh sách hôm nay đi.', en: "You're moving faster than your energy allows. Cross one thing off today's list.", zh: '你的步伐超过了自己的负荷，今天的清单上划掉一件事吧。', ko: '지금 감당할 수 있는 것보다 빠르게 가고 있어요. 오늘 할 일 목록에서 하나만 지워보세요.', ja: '自分のペースより速く進みすぎている。今日のリストからひとつ減らそう。' },
    'wheel.treat.label': { vi: 'Tự thưởng', en: 'Treat yourself', zh: '犒赏自己', ko: '스스로에게 선물해요', ja: '自分にご褒美を' },
    'wheel.treat.text':  { vi: 'Mua cho mình một thứ nhỏ, hoặc ngủ thêm nửa tiếng. Bạn xứng đáng, thật đấy.', en: "Buy yourself something small, or sleep half an hour more. You deserve it, truly.", zh: '给自己买件小东西，或者多睡半小时，你真的值得。', ko: '자신에게 작은 것 하나 사주거나, 30분 더 자보세요. 정말로 그럴 자격이 있어요.', ja: '自分に小さなものを買うか、あと30分眠ろう。あなたは本当にそれに値する。' },
    'wheel.disclaimer': { vi: 'Một lời nhắc nhỏ vẫn đổi được cả một ngày. Mai vòng quay sẽ đổi ô khác.', en: 'Even a small reminder can change a whole day. Tomorrow the wheel lands somewhere new.', zh: '一句小小的提醒也能改变一整天，明天转盘会停在别的格子。', ko: '작은 한마디가 하루 전체를 바꾸기도 해요. 내일은 룰렛이 다른 칸에 멈출 거예요.', ja: '小さなひとことでも一日を変えられる。明日はホイールが別のマスに止まる。' },
    'wheel.alreadySpun': { vi: 'Hôm nay bạn quay rồi. Mai ghé lại nhé 🐾', en: "You've already spun today. Come back tomorrow 🐾", zh: '今天你已经转过了，明天再来吧 🐾', ko: '오늘은 이미 돌렸어요. 내일 다시 와주세요 🐾', ja: '今日はもう回しました。また明日どうぞ 🐾' },

    /* ---------- thư gửi tương lai ---------- */
    'letter.q30':  { vi: 'một tháng nữa', en: 'in a month', zh: '一个月后', ko: '한 달 후', ja: '1ヶ月後' },
    'letter.q100': { vi: '100 ngày nữa', en: 'in 100 days', zh: '100天后', ko: '100일 후', ja: '100日後' },
    'letter.q365': { vi: 'một năm nữa', en: 'in a year', zh: '一年后', ko: '1년 후', ja: '1年後' },
    'letter.loginHint': { vi: 'Đăng nhập để Nody cất giúp bạn những lá thư này và nhắc bạn đúng hẹn.', en: 'Log in so Nody can keep these letters for you and remind you when the time comes.', zh: '登录后诺迪会替你保存这些信件，并在到期时提醒你。', ko: '로그인하면 노디가 이 편지들을 보관하고 때가 되면 알려드려요.', ja: 'ログインすると、ノディがこれらの手紙を保管し、時が来たら知らせてくれます。' },
    'letter.opening': { vi: 'Đang mở hộp thư', en: 'Opening the mailbox', zh: '正在打开信箱', ko: '편지함을 여는 중', ja: '郵便箱を開いています' },
    'letter.empty': { vi: 'Hộp thư còn trống. Viết lá đầu tiên ở trên nhé.', en: 'Your mailbox is empty. Write your first letter above.', zh: '信箱还是空的，在上面写下第一封信吧。', ko: '편지함이 비어 있어요. 위에서 첫 편지를 써보세요.', ja: '郵便箱はまだ空。上で最初の手紙を書いてみて。' },
    'letter.opensOn': { vi: 'Thư mở ngày {date}', en: 'Letter opens on {date}', zh: '信件开启日期：{date}', ko: '{date}에 열리는 편지', ja: '{date}に開く手紙' },
    'letter.stillSealed': { vi: 'Nody đang giữ kín. Còn {n} ngày nữa.', en: "Nody is keeping it sealed. {n} day(s) to go.", zh: '诺迪正为你保密，还有{n}天。', ko: '노디가 아직 비밀로 간직하고 있어요. {n}일 남았어요.', ja: 'ノディがまだ封をしています。あと{n}日。' },
    'letter.confirmDelete': { vi: 'Xoá lá thư này? Không lấy lại được đâu.', en: "Delete this letter? It can't be undone.", zh: '删除这封信？无法恢复。', ko: '이 편지를 삭제할까요? 되돌릴 수 없어요.', ja: 'この手紙を削除しますか？元には戻せません。' },
    'letter.deleted': { vi: 'Đã xoá.', en: 'Deleted.', zh: '已删除。', ko: '삭제했어요.', ja: '削除しました。' },
    'letter.deleteFail': { vi: 'Chưa xoá được. Thử lại giúp mình.', en: "Couldn't delete it. Please try again.", zh: '删除失败，请再试一次。', ko: '삭제하지 못했어요. 다시 시도해 주세요.', ja: '削除できませんでした。もう一度お試しください。' },
    'letter.loadFail': { vi: 'Chưa đọc được hộp thư. Có thể quy tắc Firestore đang chặn. Bạn xem mục hướng dẫn trong README nhé.', en: "Couldn't load the mailbox — Firestore rules may be blocking it. See the README for setup help.", zh: '无法读取信箱，可能是 Firestore 规则拦截了。请查看 README 中的说明。', ko: '편지함을 불러오지 못했어요. Firestore 규칙이 막고 있을 수 있어요. README의 안내를 확인해 주세요.', ja: '郵便箱を読み込めませんでした。Firestoreルールがブロックしている可能性があります。READMEをご確認ください。' },
    'letter.errShort': { vi: 'Viết dài hơn một chút nhé, bạn của tương lai sẽ thích đọc.', en: 'Write a bit more — your future self will enjoy reading it.', zh: '再多写一点吧，未来的你会喜欢读到更多内容。', ko: '조금 더 길게 써보세요, 미래의 당신이 더 좋아할 거예요.', ja: 'もう少し長く書いてみて。未来のあなたがきっと喜んで読むはず。' },
    'letter.errNoDate': { vi: 'Bạn chọn ngày mở thư giúp mình.', en: 'Please choose an opening date.', zh: '请选择开信日期。', ko: '편지를 열 날짜를 선택해 주세요.', ja: '開封する日付を選んでください。' },
    'letter.errPastDate': { vi: 'Chọn một ngày trong tương lai nhé.', en: 'Please choose a date in the future.', zh: '请选择一个未来的日期。', ko: '미래의 날짜를 선택해 주세요.', ja: '未来の日付を選んでください。' },
    'letter.needLogin': { vi: 'Đăng nhập để Nody giữ thư cho bạn.', en: 'Log in so Nody can keep the letter for you.', zh: '登录后诺迪会替你保存这封信。', ko: '로그인하면 노디가 편지를 보관해드려요.', ja: 'ログインすると、ノディが手紙を保管します。' },
    'letter.sent': { vi: 'Nody đã cất thư. Hẹn bạn ngày {date} 💌', en: "Nody has tucked the letter away. See you on {date} 💌", zh: '诺迪已经把信收好了，{date}再见 💌', ko: '노디가 편지를 잘 보관했어요. {date}에 만나요 💌', ja: 'ノディが手紙をしまいました。{date}にまた 💌' },
    'letter.sendFail': { vi: 'Chưa gửi được. Kiểm tra kết nối rồi thử lại.', en: "Couldn't send it. Check your connection and try again.", zh: '发送失败，请检查网络后重试。', ko: '보내지 못했어요. 연결 상태를 확인하고 다시 시도해 주세요.', ja: '送信できませんでした。接続を確認してもう一度お試しください。' },

    /* ---------- lá bài hôm nay ---------- */
    'daily.rev': { vi: 'nằm ngược', en: 'reversed', zh: '逆位', ko: '역방향', ja: '逆位置' },
    'daily.up':  { vi: 'nằm xuôi', en: 'upright', zh: '正位', ko: '정방향', ja: '正位置' },
    'daily.taskTitle': { vi: 'Một việc nhỏ cho hôm nay', en: 'One small thing for today', zh: '今天的一件小事', ko: '오늘을 위한 작은 일 하나', ja: '今日のための小さなこと' },
    'daily.copy': { vi: 'Chép thông điệp', en: 'Copy message', zh: '复制信息', ko: '메시지 복사', ja: 'メッセージをコピー' },
    'daily.fullSpread': { vi: 'Trải bài đầy đủ', en: 'Full spread', zh: '完整牌阵', ko: '전체 스프레드', ja: 'フルスプレッド' },
    'daily.copyText': { vi: 'Lá bài hôm nay của mình: {name} ({dir})\n{text}\n— Nody Tarot', en: "Today's card: {name} ({dir})\n{text}\n— Nody Tarot", zh: '我今天的牌：{name}（{dir}）\n{text}\n— Nody Tarot', ko: '오늘의 카드: {name} ({dir})\n{text}\n— Nody Tarot', ja: '今日のカード：{name}（{dir}）\n{text}\n— Nody Tarot' },
    'daily.copied': { vi: 'Đã chép, bạn dán đi đâu cũng được 🌙', en: "Copied — paste it anywhere you like 🌙", zh: '已复制，随你粘贴到哪里 🌙', ko: '복사했어요, 어디든 붙여넣으세요 🌙', ja: 'コピーしました。どこにでも貼り付けてください 🌙' },
    'daily.copyFail': { vi: 'Trình duyệt không cho chép. Bạn bôi đen rồi copy tay nhé.', en: "Your browser blocked copying. Please select the text and copy it manually.", zh: '浏览器不允许复制，请手动选中文本后复制。', ko: '브라우저가 복사를 허용하지 않았어요. 텍스트를 직접 선택해서 복사해 주세요.', ja: 'ブラウザがコピーを許可しませんでした。テキストを選択して手動でコピーしてください。' },
    'daily.logTitle': { vi: 'Lá bài ngày {day}', en: "Card for {day}", zh: '{day}的牌', ko: '{day}의 카드', ja: '{day}のカード' },
    'daily.task.wands': { vi: 'Làm một việc bạn đã hoãn ba lần. Chỉ mười lăm phút thôi, không cần xong.', en: "Do something you've put off three times. Just fifteen minutes — no need to finish.", zh: '做一件你已经拖延三次的事，只花十五分钟，不必做完。', ko: '세 번이나 미룬 일을 해보세요. 딱 15분만, 끝낼 필요는 없어요.', ja: '3回も先延ばしにしたことをやってみて。15分だけでいい、終わらせなくていい。' },
    'daily.task.cups': { vi: 'Nhắn cho một người bạn nghĩ tới hôm nay. Không cần lý do gì cả.', en: "Message someone you thought of today. No reason needed.", zh: '给今天想到的人发条消息，不需要理由。', ko: '오늘 떠오른 사람에게 메시지를 보내보세요. 이유는 필요 없어요.', ja: '今日思い浮かんだ人にメッセージを送って。理由は要らない。' },
    'daily.task.swords': { vi: 'Viết ra ba dòng về điều đang làm bạn rối. Viết tay càng tốt.', en: "Write three lines about what's confusing you. By hand is even better.", zh: '写下三行让你困扰的事，手写更好。', ko: '마음을 어지럽히는 일에 대해 세 줄 적어보세요. 손으로 쓰면 더 좋아요.', ja: '悩んでいることについて3行書いてみて。手書きだとなおいい。' },
    'daily.task.pentacles': { vi: 'Dọn một góc nhỏ: bàn làm việc, ví tiền, hoặc màn hình điện thoại.', en: "Tidy one small spot: your desk, your wallet, or your phone screen.", zh: '整理一个小角落：书桌、钱包，或手机屏幕。', ko: '작은 곳 하나만 정리해보세요: 책상, 지갑, 또는 휴대폰 화면.', ja: '小さな場所をひとつ片付けて：机、財布、あるいはスマホの画面。' },
    'daily.task.majorRev': { vi: 'Hôm nay xin phép làm ít lại một chút. Bỏ một việc khỏi danh sách và đừng áy náy.', en: "Give yourself permission to do a little less today. Drop one thing from the list, guilt-free.", zh: '今天允许自己少做一点，从清单上划掉一件事，别有负罪感。', ko: '오늘은 조금 덜 해도 괜찮다고 허락해보세요. 목록에서 하나를 지우고 죄책감은 갖지 마세요.', ja: '今日は少し休む許可を自分に出そう。リストから一つ消して、罪悪感は持たないで。' },
    'daily.task.majorUp': { vi: 'Chọn một việc quan trọng nhất hôm nay rồi làm nó trước tiên, trước khi mở tin nhắn.', en: "Pick today's single most important task and do it first, before opening any messages.", zh: '选出今天最重要的一件事，在打开消息之前先完成它。', ko: '오늘 가장 중요한 일 하나를 골라, 메시지를 열기 전에 먼저 해보세요.', ja: '今日一番大切なことをひとつ選び、メッセージを開く前に真っ先にやろう。' },
    'daily.closing.week': { vi: 'Bạn đã ghé đây {n} ngày liền. Nody nhớ mặt bạn rồi đó 🐾', en: "You've come by {n} days in a row. Nody remembers you now 🐾", zh: '你已经连续{n}天来这里了，诺迪都记住你了 🐾', ko: '{n}일 연속으로 와주셨네요. 노디가 이제 당신을 기억해요 🐾', ja: '{n}日連続で来てくれましたね。ノディはもうあなたを覚えています 🐾' },
    'daily.closing.some': { vi: '{n} ngày liên tiếp rồi. Một thói quen nhỏ đang thành hình.', en: '{n} days in a row now — a small habit is taking shape.', zh: '已经连续{n}天了，一个小习惯正在成形。', ko: '{n}일 연속이에요. 작은 습관이 만들어지고 있어요.', ja: '{n}日連続。小さな習慣ができつつある。' },
    'daily.closing.first': { vi: 'Mai ghé lại nhé, lá bài sẽ đổi khi trời sáng.', en: "Come back tomorrow — the card changes with the sunrise.", zh: '明天再来吧，天亮后牌会换。', ko: '내일 다시 와주세요, 해가 뜨면 카드가 바뀌어요.', ja: 'また明日どうぞ。夜が明けるとカードが変わります。' },

    /* ---------- hồ sơ & lịch sử ---------- */
    'hist.noOne':       { vi: 'Chưa có ai đăng nhập', en: 'No one logged in yet', zh: '还没有人登录', ko: '아직 로그인한 사람이 없어요', ja: 'まだログインしていません' },
    'hist.loginToView': { vi: 'Đăng nhập để xem lại mọi lá bài bạn từng rút, trên bất kỳ máy nào.', en: 'Log in to see every card you\'ve ever drawn, on any device.', zh: '登录后可在任何设备上查看你抽过的所有牌。', ko: '로그인하면 어떤 기기에서든 뽑았던 모든 카드를 다시 볼 수 있어요.', ja: 'ログインすると、どのデバイスからでも今まで引いたすべてのカードを見られます。' },
    'hist.loginOrSignup': { vi: 'Đăng nhập hoặc tạo tài khoản', en: 'Log in or create an account', zh: '登录或创建账号', ko: '로그인 또는 계정 만들기', ja: 'ログインまたはアカウント作成' },
    'hist.you':          { vi: 'Bạn', en: 'You', zh: '你', ko: '당신', ja: 'あなた' },
    'hist.loggedViaGoogle': { vi: 'đăng nhập bằng Google', en: 'logged in via Google', zh: '通过 Google 登录', ko: 'Google로 로그인함', ja: 'Googleでログイン' },
    'hist.rename':       { vi: 'Đổi tên hiển thị', en: 'Change display name', zh: '修改显示名称', ko: '표시 이름 변경', ja: '表示名を変更' },
    'hist.renamePrompt': { vi: 'Bạn muốn Nody gọi bạn là gì?', en: 'What would you like Nody to call you?', zh: '你希望诺迪怎么称呼你？', ko: '노디가 당신을 뭐라고 부르면 좋을까요?', ja: 'ノディにあなたを何と呼んでほしいですか？' },
    'hist.renamed':      { vi: 'Đổi tên xong rồi 🐾', en: 'Name updated 🐾', zh: '名字改好了 🐾', ko: '이름을 바꿨어요 🐾', ja: '名前を変更しました 🐾' },
    'hist.renameFail':   { vi: 'Chưa đổi được tên.', en: "Couldn't update the name.", zh: '改名失败。', ko: '이름을 바꾸지 못했어요.', ja: '名前を変更できませんでした。' },
    'hist.loggedOut':    { vi: 'Đã đăng xuất. Hẹn gặp lại bạn 🌙', en: "Logged out. See you again 🌙", zh: '已退出登录，下次再见 🌙', ko: '로그아웃했어요. 또 만나요 🌙', ja: 'ログアウトしました。また会いましょう 🌙' },
    'hist.loading':      { vi: 'Đang lần giở lại', en: 'Turning back the pages', zh: '正在翻阅记录', ko: '기록을 넘겨보는 중', ja: 'ページをめくり返しています' },
    'hist.loadFail':     { vi: 'Chưa đọc được lịch sử. Thường là do quy tắc bảo mật Firestore chưa cho phép đọc. Bạn mở README xem phần "Quy tắc Firestore" nhé.', en: 'Could not load history — usually because Firestore security rules don\'t allow reading yet. See the "Firestore Rules" section in the README.', zh: '无法读取历史记录，通常是因为 Firestore 安全规则还不允许读取。请查看 README 中的"Firestore 规则"部分。', ko: '기록을 불러오지 못했어요. 보통 Firestore 보안 규칙이 아직 읽기를 허용하지 않아서예요. README의 "Firestore 규칙" 부분을 확인해 주세요.', ja: '履歴を読み込めませんでした。通常はFirestoreのセキュリティルールがまだ読み取りを許可していないためです。READMEの「Firestoreルール」をご確認ください。' },
    'hist.savedCount':   { vi: '{n} lượt đã lưu', en: '{n} saved', zh: '已保存{n}条', ko: '{n}개 저장됨', ja: '{n}件保存済み' },
    'hist.emptyFilter':  { vi: 'Chưa có lượt nào thuộc mục này.', en: 'Nothing in this category yet.', zh: '这个分类还没有记录。', ko: '이 항목에는 아직 아무것도 없어요.', ja: 'このカテゴリーにはまだ何もありません。' },
    'hist.emptyAll':     { vi: 'Chưa có gì ở đây. Rút một lá rồi quay lại xem nhé.', en: "Nothing here yet. Draw a card, then come back.", zh: '这里还什么都没有，抽一张牌再回来看看吧。', ko: '아직 아무것도 없어요. 카드 한 장 뽑고 다시 와보세요.', ja: 'まだ何もありません。カードを引いてからまた見に来て。' },
    'hist.spreadNow':    { vi: 'Trải bài ngay', en: 'Do a reading now', zh: '立即占卜', ko: '지금 카드 뽑기', ja: '今すぐ占う' },
    'hist.confirmDelete': { vi: 'Xoá lượt này khỏi lịch sử?', en: 'Delete this entry from history?', zh: '要从历史记录中删除这条吗？', ko: '이 기록을 히스토리에서 삭제할까요?', ja: 'この履歴を削除しますか？' },
    'hist.deleteFail':   { vi: 'Chưa xoá được.', en: "Couldn't delete it.", zh: '删除失败。', ko: '삭제하지 못했어요.', ja: '削除できませんでした。' },
    'hist.today':        { vi: 'hôm nay', en: 'today', zh: '今天', ko: '오늘', ja: '今日' },
    'hist.yesterday':    { vi: 'hôm qua', en: 'yesterday', zh: '昨天', ko: '어제', ja: '昨日' },
    'hist.daysAgo':      { vi: '{n} ngày trước', en: '{n} days ago', zh: '{n}天前', ko: '{n}일 전', ja: '{n}日前' },
    'hist.all':          { vi: 'Tất cả', en: 'All', zh: '全部', ko: '전체', ja: 'すべて' },
    'hist.noFirebase':   { vi: 'Chưa kết nối được Firebase. Nếu bạn đang mở web bằng cách nháy đúp vào file, hãy chạy firebase serve hoặc mở qua http:// để dùng phần tài khoản.', en: "Couldn't connect to Firebase. If you're opening this by double-clicking the file, run firebase serve or open it over http:// to use accounts.", zh: '无法连接 Firebase。如果你是直接双击文件打开网页，请运行 firebase serve 或通过 http:// 打开以使用账号功能。', ko: 'Firebase에 연결하지 못했어요. 파일을 더블클릭해서 열었다면 firebase serve를 실행하거나 http://로 열어 계정 기능을 사용해 주세요.', ja: 'Firebaseに接続できませんでした。ファイルをダブルクリックして開いている場合は、firebase serveを実行するかhttp://経由で開いてアカウント機能を使ってください。' },

    /* ---------- đầu trang ---------- */
    'head.today':       { vi: 'Hôm nay', en: 'Today', zh: '今天', ko: '오늘', ja: '本日' },
    'head.login':       { vi: 'Đăng nhập', en: 'Log in', zh: '登录', ko: '로그인', ja: 'ログイン' },
    'head.themeToNight':{ vi: 'Chuyển sang đêm', en: 'Switch to night mode', zh: '切换到夜间模式', ko: '야간 모드로 전환', ja: 'ナイトモードに切替' },
    'head.themeToDawn': { vi: 'Chuyển sang ban mai', en: 'Switch to dawn mode', zh: '切换到晨间模式', ko: '새벽 모드로 전환', ja: '朝モードに切替' },
    'head.langLabel':   { vi: 'Ngôn ngữ', en: 'Language', zh: '语言', ko: '언어', ja: '言語' },
    'fx.auto':  { vi: 'Hiệu ứng: Tự động', en: 'Effects: Auto', zh: '特效：自动', ko: '효과: 자동', ja: 'エフェクト：自動' },
    'fx.on':    { vi: 'Hiệu ứng: Đang bật', en: 'Effects: On', zh: '特效：已开启', ko: '효과: 켜짐', ja: 'エフェクト：オン' },
    'fx.off':   { vi: 'Hiệu ứng: Đã tắt (mượt hơn)', en: 'Effects: Off (smoother)', zh: '特效：已关闭（更流畅）', ko: '효과: 꺼짐 (더 부드러움)', ja: 'エフェクト：オフ（より軽快）' },

    /* ---------- chân trang ---------- */
    'foot.slogan':      { vi: 'Một góc nhỏ để bạn ngồi xuống, thở một nhịp và tự hỏi mình đang cần gì. Nody luận giải dịu dàng, không doạ ai bao giờ.',
                           en: 'A quiet little corner to sit down, take a breath, and ask yourself what you truly need. Nody the pup reads gently — never to scare you.',
                           zh: '一个可以让你坐下来、深呼吸、问问自己需要什么的小角落。诺迪小狗的解读总是温柔的，从不吓唬人。',
                           ko: '잠시 앉아 숨을 고르고 지금 무엇이 필요한지 물어볼 수 있는 작은 공간입니다. 강아지 노디는 늘 부드럽게 풀이해줘요.',
                           ja: '腰を下ろして一息つき、自分に必要なものを問いかけられる小さな場所。ノディはいつも優しく読み解きます。' },
    'foot.group1':      { vi: 'Bói bài & con số', en: 'Cards & Numbers', zh: '占卜与数字', ko: '카드 & 숫자', ja: 'カード＆数秘' },
    'foot.group2':      { vi: 'Nhẹ nhàng hơn', en: 'Something lighter', zh: '轻松一下', ko: '좀 더 가볍게', ja: 'もっと気軽に' },
    'foot.rights':      { vi: 'Nody Tarot', en: 'Nody Tarot', zh: 'Nody 塔罗', ko: 'Nody 타로', ja: 'Nody タロット' },
    'foot.note':        { vi: 'Tarot là tấm gương soi, không phải bản án. Quyết định luôn là của bạn.',
                           en: 'Tarot is a mirror, not a verdict. The choice is always yours.',
                           zh: '塔罗是一面镜子，不是判决。选择权始终在你手中。',
                           ko: '타로는 거울일 뿐, 판결이 아니에요. 선택은 언제나 당신의 몫입니다.',
                           ja: 'タロットは鏡であり、判決ではありません。選ぶのはいつもあなた自身です。' },

    /* ---------- đăng nhập / đăng ký ---------- */
    'auth.welcomeBack': { vi: 'Chào bạn trở lại', en: 'Welcome back', zh: '欢迎回来', ko: '다시 오셨네요', ja: 'おかえりなさい' },
    'auth.welcomeSub':  { vi: 'Đăng nhập để Nody giữ giúp bạn mọi lá bài đã rút.',
                           en: 'Log in so Nody can keep every card you have drawn.',
                           zh: '登录后诺迪会帮你保存抽过的每一张牌。',
                           ko: '로그인하면 뽑았던 카드를 노디가 모두 저장해 드려요.',
                           ja: 'ログインすると、引いたカードをすべてノディが保存します。' },
    'auth.newSpace':    { vi: 'Tạo một góc riêng', en: 'Create your own space', zh: '创建专属空间', ko: '나만의 공간 만들기', ja: 'あなただけの場所を作る' },
    'auth.newSpaceSub': { vi: 'Có tài khoản rồi thì lịch sử xem bói sẽ theo bạn qua mọi thiết bị.',
                           en: 'With an account, your reading history follows you across every device.',
                           zh: '有了账号，占卜记录就能在任何设备上同步。',
                           ko: '계정을 만들면 어떤 기기에서든 기록이 그대로 이어져요.',
                           ja: 'アカウントがあれば、どの端末でも占い履歴が引き継がれます。' },
    'auth.login':       { vi: 'Đăng nhập', en: 'Log in', zh: '登录', ko: '로그인', ja: 'ログイン' },
    'auth.register':    { vi: 'Đăng ký', en: 'Sign up', zh: '注册', ko: '회원가입', ja: '新規登録' },
    'auth.email':       { vi: 'Email', en: 'Email', zh: '邮箱', ko: '이메일', ja: 'メールアドレス' },
    'auth.password':    { vi: 'Mật khẩu', en: 'Password', zh: '密码', ko: '비밀번호', ja: 'パスワード' },
    'auth.forgot':      { vi: 'Quên mật khẩu?', en: 'Forgot password?', zh: '忘记密码？', ko: '비밀번호를 잊으셨나요?', ja: 'パスワードをお忘れですか？' },
    'auth.enterSpace':  { vi: 'Vào không gian của bạn', en: 'Enter your space', zh: '进入我的空间', ko: '내 공간으로 들어가기', ja: 'マイスペースへ' },
    'auth.displayName': { vi: 'Bạn muốn Nody gọi bạn là gì?', en: 'What should Nody call you?', zh: '希望诺迪怎么称呼你？', ko: '노디가 뭐라고 부르면 될까요?', ja: 'ノディに呼んでほしい名前は？' },
    'auth.createAcct':  { vi: 'Tạo tài khoản', en: 'Create account', zh: '创建账号', ko: '계정 만들기', ja: 'アカウントを作成' },
    'auth.or':          { vi: 'hoặc', en: 'or', zh: '或', ko: '또는', ja: 'または' },
    'auth.continueGoogle': { vi: 'Tiếp tục với Google', en: 'Continue with Google', zh: '使用 Google 继续', ko: 'Google로 계속하기', ja: 'Googleで続ける' },
    'auth.logout':      { vi: 'Đăng xuất', en: 'Log out', zh: '退出登录', ko: '로그아웃', ja: 'ログアウト' },
    'head.scrollLeft':  { vi: 'Cuộn trái', en: 'Scroll left', zh: '向左滚动', ko: '왼쪽으로 스크롤', ja: '左にスクロール' },
    'head.scrollRight': { vi: 'Cuộn phải', en: 'Scroll right', zh: '向右滚动', ko: '오른쪽으로 스크롤', ja: '右にスクロール' },
    'auth.passwordPlaceholder': { vi: 'Tối thiểu 8 ký tự, có hoa + số + ký tự đặc biệt', en: 'At least 8 chars, incl. uppercase + number + symbol', zh: '至少8位，含大写字母+数字+特殊符号', ko: '8자 이상, 대문자+숫자+특수문자 포함', ja: '8文字以上、大文字＋数字＋記号を含む' },
    'auth.confirmPassword': { vi: 'Nhập lại mật khẩu', en: 'Confirm password', zh: '确认密码', ko: '비밀번호 확인', ja: 'パスワード（確認）' },
    'auth.confirmPasswordPlaceholder': { vi: 'Gõ lại y hệt mật khẩu ở trên', en: 'Type the same password again', zh: '再次输入与上方相同的密码', ko: '위와 동일하게 다시 입력', ja: '上と同じパスワードを再入力' },
    'auth.passwordRule': { vi: 'Mật khẩu cần từ 8 ký tự, có ít nhất 1 chữ HOA, 1 số và 1 ký tự đặc biệt (!@#$…).', en: 'Password needs 8+ characters with 1 uppercase letter, 1 number and 1 special character (!@#$…).', zh: '密码需至少8位，包含1个大写字母、1个数字和1个特殊符号（!@#$…）。', ko: '비밀번호는 8자 이상, 대문자 1개·숫자 1개·특수문자(!@#$…) 1개를 포함해야 해요.', ja: 'パスワードは8文字以上で、大文字1つ・数字1つ・記号（!@#$…）1つを含めてください。' },
    'auth.passwordMismatch': { vi: 'Hai lần nhập mật khẩu chưa khớp nhau, bạn xem lại nhé.', en: "The two passwords don't match — please check again.", zh: '两次输入的密码不一致，请再检查一次。', ko: '두 번 입력한 비밀번호가 서로 달라요. 다시 확인해 주세요.', ja: '2つのパスワードが一致していません。もう一度ご確認ください。' },
    'auth.errMissing':  { vi: 'Còn thiếu một ô chưa điền.', en: "You've left a field empty.", zh: '还有一栏没有填写。', ko: '아직 채우지 않은 칸이 있어요.', ja: '未入力の項目があります。' },
    'auth.creating':    { vi: 'Đang tạo tài khoản…', en: 'Creating your account…', zh: '正在创建账号…', ko: '계정을 만드는 중…', ja: 'アカウントを作成中…' },
    'auth.createdToast': { vi: 'Xong rồi, chào ', en: 'All set, hi ', zh: '完成啦，你好，', ko: '완료됐어요, 안녕하세요 ', ja: '完了しました。こんにちは、' },

    /* ---------- chung ---------- */
    'common.submit':    { vi: 'Xác nhận', en: 'Confirm', zh: '确认', ko: '확인', ja: '確定' },
    'common.close':     { vi: 'Đóng', en: 'Close', zh: '关闭', ko: '닫기', ja: '閉じる' },
    'common.cancel':    { vi: 'Huỷ', en: 'Cancel', zh: '取消', ko: '취소', ja: 'キャンセル' },
    'common.save':      { vi: 'Lưu', en: 'Save', zh: '保存', ko: '저장', ja: '保存' },
    'common.loading':   { vi: 'Đang tải…', en: 'Loading…', zh: '加载中…', ko: '불러오는 중…', ja: '読み込み中…' },
    'common.upright':   { vi: 'Xuôi', en: 'Upright', zh: '正位', ko: '정방향', ja: '正位置' },
    'common.reversed':  { vi: 'Ngược', en: 'Reversed', zh: '逆位', ko: '역방향', ja: '逆位置' },
    'common.back':      { vi: 'Quay lại', en: 'Back', zh: '返回', ko: '뒤로', ja: '戻る' },
    'common.next':      { vi: 'Tiếp tục', en: 'Continue', zh: '继续', ko: '계속', ja: '次へ' },
    'common.delete':    { vi: 'Xoá', en: 'Delete', zh: '删除', ko: '삭제', ja: '削除' },

    /* ---------- nút & bảng hướng dẫn nổi ---------- */
    'help.btnTitle':    { vi: 'Trợ giúp — cách dùng web', en: 'Help — how this site works', zh: '帮助 — 使用说明', ko: '도움말 — 사용법', ja: 'ヘルプ — 使い方' },
    'help.title':       { vi: 'Hướng dẫn dùng Nody Tarot', en: 'How to use Nody Tarot', zh: 'Nody 塔罗使用指南', ko: 'Nody 타로 이용 가이드', ja: 'Nody タロットの使い方' },
    'help.dragHint':    { vi: 'Mẹo: giữ và kéo nút 🐾 để đặt nó ở bất kỳ đâu trên màn hình. Bấm giữ 1 giây rồi thả ra ngoài mép để ẩn nút.',
                           en: 'Tip: press and drag the 🐾 button anywhere on screen. Hold for a second and drop it off the edge to hide it.',
                           zh: '小贴士：按住🐾按钮可拖到屏幕任意位置；按住一秒后拖到边缘外即可隐藏。',
                           ko: '팁: 🐾 버튼을 눌러 화면 어디로든 끌어놓을 수 있어요. 1초간 누른 뒤 가장자리 밖으로 놓으면 숨길 수 있습니다.',
                           ja: 'ヒント：🐾ボタンを長押ししてドラッグすると好きな場所に置けます。1秒長押しして端の外に離すと非表示にできます。' },
    'help.section.nav.title': { vi: '1. Menu & đổi ngôn ngữ', en: '1. Menu & language', zh: '1. 菜单与语言', ko: '1. 메뉴 & 언어', ja: '1. メニューと言語' },
    'help.section.nav.body':  { vi: 'Bấm ☰ để mở danh mục các trang. Bấm cờ quốc gia ở góc phải để đổi ngôn ngữ — toàn bộ web kể cả lời giải lá bài sẽ đổi theo ngay.',
                                 en: 'Tap ☰ to open the page menu. Tap the flag icon on the right to switch language — the whole site, including card meanings, updates instantly.',
                                 zh: '点击 ☰ 打开页面菜单。点击右上角的国旗图标即可切换语言——包括牌意在内的整个网站会立即更新。',
                                 ko: '☰를 누르면 페이지 메뉴가 열립니다. 오른쪽 국기 아이콘을 누르면 언어가 바뀌고, 카드 해석을 포함한 사이트 전체가 즉시 반영됩니다.',
                                 ja: '☰をタップするとページメニューが開きます。右上の国旗アイコンで言語を切り替えると、カードの意味を含むサイト全体がすぐに反映されます。' },
    'help.section.tools.title': { vi: '2. Các công cụ xem bói', en: '2. Reading tools', zh: '2. 占卜工具', ko: '2. 점술 도구', ja: '2. 占いツール' },
    'help.section.tools.body':  { vi: 'Trải bài Tarot: chọn chủ đề → chọn kiểu trải → xáo & rút → xem luận giải. Lá bài hôm nay, Thần số học, Chiêm tinh, Ghép đôi, Giải mã giấc mơ đều chỉ cần nhập một vài thông tin là ra kết quả.',
                                  en: 'Tarot Reading: pick a topic → pick a spread → shuffle & draw → read your interpretation. Card of the Day, Numerology, Horoscope, Compatibility and Dream Meaning each just need a bit of info to give you a result.',
                                  zh: '塔罗牌阵：选择主题 → 选择牌阵 → 洗牌抽牌 → 查看解读。每日一牌、生命数字、星座运势、缘分配对、解梦只需输入少量信息即可得出结果。',
                                  ko: '타로 리딩: 주제 선택 → 스프레드 선택 → 셔플 & 뽑기 → 해석 확인. 오늘의 카드, 수비학, 별자리 운세, 궁합, 꿈해몽은 간단한 정보만 입력하면 결과가 나옵니다.',
                                  ja: 'タロット占い：テーマを選ぶ→スプレッドを選ぶ→シャッフルして引く→解釈を読む。今日のカード・数秘術・星占い・相性診断・夢占いは、少しの情報を入力するだけで結果が出ます。' },
    'help.section.account.title': { vi: '3. Tài khoản & lịch sử', en: '3. Account & history', zh: '3. 账户与记录', ko: '3. 계정 & 기록', ja: '3. アカウントと履歴' },
    'help.section.account.body':  { vi: 'Đăng nhập để mọi lượt xem được lưu lại. Vào trang Hồ sơ & lịch sử để xem lại, lọc theo loại, đổi tên hiển thị, hoặc xem lịch sử nạp tiền.',
                                     en: 'Log in so every reading is saved. Visit Profile & History to review past results, filter by type, change your display name, or check your top-up history.',
                                     zh: '登录后每次占卜都会被保存。前往"我的与记录"页面可查看历史、按类型筛选、修改昵称或查看充值记录。',
                                     ko: '로그인하면 모든 결과가 저장됩니다. "내 정보 & 기록" 페이지에서 지난 결과 확인, 유형별 필터링, 표시 이름 변경, 충전 내역 확인이 가능해요.',
                                     ja: 'ログインするとすべての結果が保存されます。「マイページ」で履歴の確認、種類ごとの絞り込み、表示名の変更、チャージ履歴の確認ができます。' },
    'help.section.plans.title': { vi: '4. Miễn phí & nâng cấp', en: '4. Free & upgrading', zh: '4. 免费与升级', ko: '4. 무료 & 업그레이드', ja: '4. 無料とアップグレード' },
    'help.section.plans.body':  { vi: 'Nody Tarot dùng miễn phí. Trang Nạp & Gói cho phép nạp thêm để mở khoá luận giải chuyên sâu hơn, không giới hạn lượt trải bài mỗi ngày và bỏ chờ quảng cáo.',
                                   en: 'Nody Tarot is free to use. The Top-up & Plans page lets you add credit to unlock deeper interpretations, unlimited daily readings and no ad waiting.',
                                   zh: 'Nody 塔罗可免费使用。"充值与套餐"页面可让你充值以解锁更深入的解读、不限次数的每日占卜，并跳过广告等待。',
                                   ko: 'Nody 타로는 무료로 이용할 수 있습니다. "충전 & 요금제" 페이지에서 충전하면 더 깊은 해석, 무제한 일일 리딩, 광고 대기 없음 혜택이 열려요.',
                                   ja: 'Nody タロットは無料で使えます。「チャージ＆プラン」ページでチャージすると、より深い解釈・毎日無制限の占い・広告待ちなしが解放されます。' },
    'help.section.photobooth.title': { vi: '5. Photobooth', en: '5. Photobooth', zh: '5. 拍照亭', ko: '5. 포토부스', ja: '5. フォトブース' },
    'help.section.photobooth.body':  { vi: 'Chụp ảnh cùng lá bài vừa rút, chọn khung viền huyền bí, thêm nhãn dán rồi tải ảnh về hoặc chia sẻ.',
                                        en: 'Take a photo with the card you just drew, pick a mystical frame, add stickers, then download or share it.',
                                        zh: '与刚抽到的牌合影，选择神秘风格的相框，添加贴纸后即可下载或分享。',
                                        ko: '방금 뽑은 카드와 함께 사진을 찍고, 신비로운 프레임을 고르고, 스티커를 추가한 뒤 다운로드하거나 공유하세요.',
                                        ja: '引いたカードと一緒に写真を撮り、神秘的なフレームを選び、ステッカーを加えてダウンロード・共有できます。' },
    'help.section.assistant.title': { vi: '6. Trợ lý Nody AI', en: '6. Nody AI Assistant', zh: '6. 诺迪 AI 助手', ko: '6. 노디 AI 어시스턴트', ja: '6. ノディ AI アシスタント' },
    'help.section.assistant.body':  { vi: 'Bấm biểu tượng trò chuyện để hỏi Nody bất cứ điều gì về cách dùng web, ý nghĩa lá bài hay cách nạp tiền.',
                                       en: 'Tap the chat icon to ask Nody anything about using the site, card meanings, or how to top up.',
                                       zh: '点击聊天图标即可向诺迪询问关于网站使用、牌意或充值方式的任何问题。',
                                       ko: '채팅 아이콘을 눌러 사이트 이용법, 카드 의미, 충전 방법 등 무엇이든 노디에게 물어보세요.',
                                       ja: 'チャットアイコンをタップして、サイトの使い方・カードの意味・チャージ方法など何でもノディに聞いてみましょう。' },

    /* ---------- trợ lý AI ---------- */
    'assist.title':     { vi: 'Trợ lý Nody', en: 'Nody Assistant', zh: '诺迪助手', ko: '노디 어시스턴트', ja: 'ノディアシスタント' },
    'assist.placeholder': { vi: 'Hỏi Nody điều gì đó…', en: 'Ask Nody something…', zh: '问问诺迪…', ko: '노디에게 물어보세요…', ja: 'ノディに聞いてみよう…' },
    'assist.greeting':  { vi: 'Chào bạn 🐾 Mình là Nody. Bạn muốn hỏi về cách dùng web, ý nghĩa lá bài, hay nạp gói?',
                           en: "Hi 🐾 I'm Nody. Ask me about how the site works, card meanings, or top-ups.",
                           zh: '你好 🐾 我是诺迪。想问问网站怎么用、牌意，还是充值方式？',
                           ko: '안녕하세요 🐾 저는 노디예요. 사이트 이용법, 카드 의미, 충전에 대해 물어보세요.',
                           ja: 'こんにちは🐾 ノディです。使い方やカードの意味、チャージについて聞いてくださいね。' },
    'assist.fallback':  { vi: 'Mình chưa chắc câu này, nhưng bạn có thể xem mục Trợ giúp (nút 🐾) hoặc thử hỏi cách khác nhé.',
                           en: "I'm not fully sure about that — try the Help panel (🐾 button) or ask in a different way.",
                           zh: '我不太确定这个问题，可以看看帮助面板（🐾按钮）或换个问法试试。',
                           ko: '이 질문은 확실하지 않아요. 도움말 패널(🐾 버튼)을 보거나 다른 방식으로 물어봐 주세요.',
                           ja: 'その質問には自信がありません。ヘルプパネル（🐾ボタン）を見るか、別の聞き方を試してみてください。' },

    /* ---------- ví / gói / nạp tiền ---------- */
    'wallet.title':     { vi: 'Nạp & Gói thành viên', en: 'Top-up & Membership Plans', zh: '充值与会员套餐', ko: '충전 & 멤버십 요금제', ja: 'チャージ＆メンバープラン' },
    'wallet.balance':   { vi: 'Số dư hiện tại', en: 'Current balance', zh: '当前余额', ko: '현재 잔액', ja: '現在の残高' },
    'wallet.free.title':{ vi: 'Miễn phí', en: 'Free', zh: '免费版', ko: '무료', ja: '無料プラン' },
    'wallet.plus.title':{ vi: 'Nody Plus', en: 'Nody Plus', zh: 'Nody Plus', ko: 'Nody Plus', ja: 'Nody Plus' },
    'wallet.vip.title': { vi: 'Nody VIP', en: 'Nody VIP', zh: 'Nody VIP', ko: 'Nody VIP', ja: 'Nody VIP' },
    'wallet.topupBtn':  { vi: 'Nạp tiền', en: 'Top up', zh: '立即充值', ko: '충전하기', ja: 'チャージする' },
    'wallet.method':    { vi: 'Hình thức nạp', en: 'Top-up method', zh: '充值方式', ko: '충전 방법', ja: 'チャージ方法' },
    'wallet.pending':   { vi: 'Đang chờ duyệt', en: 'Pending approval', zh: '待审核', ko: '승인 대기 중', ja: '承認待ち' },
    'wallet.approved':  { vi: 'Đã duyệt', en: 'Approved', zh: '已通过', ko: '승인됨', ja: '承認済み' },
    'wallet.rejected':  { vi: 'Từ chối', en: 'Rejected', zh: '已拒绝', ko: '거절됨', ja: '却下' },
    'wallet.history':   { vi: 'Lịch sử nạp tiền', en: 'Top-up history', zh: '充值记录', ko: '충전 내역', ja: 'チャージ履歴' },
    'wallet.qrHint':    { vi: 'Quét mã QR để chuyển khoản nhanh, hoặc chuyển thủ công theo thông tin bên dưới.', en: 'Scan the QR code for a quick transfer, or transfer manually using the details below.', zh: '扫描二维码快速转账，或按下方信息手动转账。', ko: 'QR코드를 스캔해 빠르게 송금하거나, 아래 정보로 직접 송금하세요.', ja: 'QRコードを読み取って送金するか、下記の情報で手動で振り込んでください。' },
    'wallet.loginToTopup': { vi: 'Bạn cần đăng nhập trước để gửi yêu cầu nạp tiền.', en: 'Please log in first to submit a top-up request.', zh: '请先登录后再提交充值请求。', ko: '충전 요청을 보내려면 먼저 로그인해 주세요.', ja: 'チャージ申請を送るには先にログインしてください。' },

    /* ---------- admin ---------- */
    'admin.title':      { vi: 'Bảng quản trị', en: 'Admin Dashboard', zh: '管理后台', ko: '관리자 대시보드', ja: '管理ダッシュボード' },
    'admin.denied':     { vi: 'Bạn không có quyền vào trang này.', en: "You don't have access to this page.", zh: '你没有权限访问此页面。', ko: '이 페이지에 접근할 권한이 없습니다.', ja: 'このページへのアクセス権限がありません。' },
    'admin.users':      { vi: 'Người dùng', en: 'Users', zh: '用户', ko: '사용자', ja: 'ユーザー' },
    'admin.topups':     { vi: 'Yêu cầu nạp tiền', en: 'Top-up requests', zh: '充值申请', ko: '충전 요청', ja: 'チャージ申請' },
    'admin.readings':   { vi: 'Lượt xem bói', en: 'Readings', zh: '占卜记录', ko: '점술 기록', ja: '占い履歴' },
    'admin.letters':    { vi: 'Thư gửi mai sau', en: 'Future letters', zh: '给未来的信', ko: '미래 편지', ja: '未来への手紙' },
    'admin.approve':    { vi: 'Duyệt', en: 'Approve', zh: '通过', ko: '승인', ja: '承認' },
    'admin.reject':     { vi: 'Từ chối', en: 'Reject', zh: '拒绝', ko: '거절', ja: '却下' },
    'admin.makeAdmin':  { vi: 'Cấp quyền admin', en: 'Grant admin', zh: '设为管理员', ko: '관리자 지정', ja: '管理者に設定' },
    'admin.revokeAdmin':{ vi: 'Thu hồi quyền admin', en: 'Revoke admin', zh: '撤销管理员', ko: '관리자 해제', ja: '管理者を解除' },
    'admin.linkTitle':  { vi: 'Trang quản trị', en: 'Admin dashboard', zh: '管理后台', ko: '관리자 대시보드', ja: '管理ダッシュボード' },
    'admin.overview':   { vi: 'Tổng quan', en: 'Overview', zh: '概览', ko: '개요', ja: '概要' },
    'admin.totalUsers': { vi: 'Tổng người dùng', en: 'Total users', zh: '用户总数', ko: '전체 사용자', ja: '総ユーザー数' },
    'admin.totalWallet':{ vi: 'Tổng số dư ví', en: 'Total wallet balance', zh: '钱包总余额', ko: '전체 지갑 잔액', ja: '合計ウォレット残高' },
    'admin.pendingTopups': { vi: 'Yêu cầu đang chờ duyệt', en: 'Pending top-ups', zh: '待审核充值', ko: '대기 중인 충전', ja: '承認待ちチャージ' },
    'admin.totalReadings': { vi: 'Tổng lượt xem bói', en: 'Total readings', zh: '占卜总次数', ko: '전체 리딩 수', ja: '総占い回数' },

    /* ---------- photobooth ---------- */
    'photo.title':      { vi: 'Photobooth cùng Nody', en: 'Photobooth with Nody', zh: 'Nody 拍照亭', ko: 'Nody 포토부스', ja: 'Nody フォトブース' },
    'photo.start':      { vi: 'Bật máy ảnh', en: 'Start camera', zh: '开启摄像头', ko: '카메라 켜기', ja: 'カメラを起動' },
    'photo.capture':    { vi: 'Chụp', en: 'Capture', zh: '拍照', ko: '촬영', ja: '撮影' },
    'photo.retake':     { vi: 'Chụp lại', en: 'Retake', zh: '重拍', ko: '다시 찍기', ja: '撮り直す' },
    'photo.download':   { vi: 'Tải ảnh về', en: 'Download', zh: '下载照片', ko: '다운로드', ja: 'ダウンロード' },
    'photo.frame':      { vi: 'Khung viền', en: 'Frame', zh: '相框', ko: '프레임', ja: 'フレーム' },
    'photo.filter':     { vi: 'Bộ lọc', en: 'Filter', zh: '滤镜', ko: '필터', ja: 'フィルター' },
    'photo.filter.none':    { vi: 'Gốc', en: 'Original', zh: '原图', ko: '원본', ja: 'オリジナル' },
    'photo.filter.vintage': { vi: 'Vintage', en: 'Vintage', zh: '复古', ko: '빈티지', ja: 'ヴィンテージ' },
    'photo.filter.bw':      { vi: 'Đen trắng', en: 'B&W', zh: '黑白', ko: '흑백', ja: 'モノクロ' },
    'photo.filter.warm':    { vi: 'Ấm', en: 'Warm', zh: '暖色', ko: '따뜻하게', ja: 'ウォーム' },
    'photo.filter.cool':    { vi: 'Lạnh', en: 'Cool', zh: '冷色', ko: '시원하게', ja: 'クール' },
    'photo.filter.dreamy':  { vi: 'Mộng mơ', en: 'Dreamy', zh: '梦幻', ko: '몽환적', ja: 'ドリーミー' },
    'photo.filter.neon':    { vi: 'Neon', en: 'Neon', zh: '霓虹', ko: '네온', ja: 'ネオン' },
    'photo.noCamera':   { vi: 'Không mở được máy ảnh. Kiểm tra quyền truy cập camera của trình duyệt nhé.',
                           en: "Couldn't access the camera. Please check your browser's camera permission.",
                           zh: '无法访问摄像头，请检查浏览器的摄像头权限。',
                           ko: '카메라에 접근할 수 없습니다. 브라우저의 카메라 권한을 확인해 주세요.',
                           ja: 'カメラにアクセスできません。ブラウザのカメラ権限をご確認ください。' }
  };

  /* ========================================================
     Trạng thái & tiện ích
     ======================================================== */
  function detectDefault() {
    try {
      const nav = (navigator.language || 'vi').toLowerCase();
      if (nav.startsWith('en')) return 'en';
      if (nav.startsWith('zh')) return 'zh';
      if (nav.startsWith('ko')) return 'ko';
      if (nav.startsWith('ja')) return 'ja';
    } catch (e) {}
    return 'vi';
  }

  let current = 'vi';
  try {
    current = localStorage.getItem('nody.lang') || detectDefault();
  } catch (e) { current = detectDefault(); }
  if (LANGS.indexOf(current) === -1) current = 'vi';

  function t(key, vars) {
    const row = STRINGS[key];
    let str = row ? (row[current] || row.vi || key) : key;
    if (vars) {
      Object.keys(vars).forEach(k => { str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]); });
    }
    return str;
  }

  function apply(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    scope.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    document.documentElement.setAttribute('lang', current === 'zh' ? 'zh-CN' : current);
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1) return;
    current = lang;
    try { localStorage.setItem('nody.lang', lang); } catch (e) {}
    apply();
    window.dispatchEvent(new CustomEvent('nody:lang', { detail: lang }));
  }

  window.I18N = {
    langs: LANGS,
    meta: LANG_META,
    t, apply, setLang,
    get: () => current,
    /* Lấy field đa ngôn ngữ từ dữ liệu lá bài / lore, có rơi về vi/en */
    pick(obj) {
      if (!obj) return '';
      return obj[current] || obj.en || obj.vi || '';
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => apply());
  } else {
    apply();
  }
})();
