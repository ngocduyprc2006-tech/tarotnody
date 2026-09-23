/* ============================================================
   data/dreams-i18n.js — bản dịch hiển thị cho dreams.js
   Từ khoá DÒ (để nhận diện giấc mơ) đã nằm sẵn trong dreams.js theo
   từng ngôn ngữ. File này chỉ dịch phần HIỂN THỊ (tên/ý nghĩa/câu
   hỏi) theo id, tra bởi dreams.js khi ngôn ngữ khác 'vi'.
   ============================================================ */
window.DreamI18N = {
  falling: {
    en: { name: 'Falling', mean: "Falling dreams often show up when real life has a place where you feel out of control, or you're straining to hold something too heavy.", ask: 'What have you been gripping with all your strength lately?' },
    zh: { name: '坠落', mean: '坠落的梦常在现实中你感到失控，或正咬牙撑着一件太重的事时出现。', ask: '最近你在用尽全力抓住什么？' },
    ko: { name: '떨어짐', mean: '떨어지는 꿈은 현실에서 통제력을 잃었다고 느끼거나, 너무 벅찬 것을 애써 붙들고 있을 때 자주 찾아와요.', ask: '요즘 온 힘을 다해 붙잡고 있는 게 뭔가요?' },
    ja: { name: '落下', mean: '落ちる夢は、現実で自分がコントロールを失っていると感じる時や、重すぎるものを必死に支えている時によく現れる。', ask: '最近、全力で握りしめているものは何？' }
  },
  flying: {
    en: { name: 'Flying', mean: "Flying signals you've just been freed from a constraint, or deeply long to be.", ask: 'If you could drop one responsibility tomorrow, which would it be?' },
    zh: { name: '飞翔', mean: '飞翔预示着你刚从某种束缚中解脱，或非常渴望解脱。', ask: '如果明天能少一份责任，你希望是哪一件？' },
    ko: { name: '비행', mean: '나는 꿈은 방금 어떤 속박에서 풀려났거나, 그렇게 되길 간절히 바란다는 신호예요.', ask: '내일 책임 하나를 내려놓을 수 있다면 무엇을 내려놓고 싶나요?' },
    ja: { name: '飛行', mean: '飛ぶ夢は、何かの束縛から解放されたばかり、あるいは強く解放を望んでいることを示す。', ask: '明日ひとつ責任を手放せるとしたら、何を手放したい？' }
  },
  chased: {
    en: { name: 'Being chased', mean: "What's chasing you in a dream is rarely another person. It's usually something you're postponing, or a feeling you're avoiding.", ask: "Is there a conversation you keep putting off?" },
    zh: { name: '被追赶', mean: '梦里追你的东西很少真的是别人，通常是你在拖延的一件事，或在躲避的一种情绪。', ask: '有没有一场对话你一直在拖延？' },
    ko: { name: '쫓김', mean: '꿈에서 당신을 쫓는 것은 대개 다른 사람이 아니에요. 보통은 미루고 있는 일이나 피하고 있는 감정이에요.', ask: '계속 미루고 있는 대화가 있나요?' },
    ja: { name: '追われる', mean: '夢の中であなたを追いかけてくるものが、他人であることは稀。たいていは先延ばしにしていることや避けている感情。', ask: 'ずっと先延ばしにしている会話はある？' }
  },
  teeth: {
    en: { name: 'Losing teeth', mean: 'Connected to your words and how you appear to others. Often shows up before moments you fear saying the wrong thing.', ask: 'Who do you have an important conversation with coming up?' },
    zh: { name: '掉牙', mean: '与你的言语和在他人面前的形象有关，常在你害怕说错话的场合前出现。', ask: '接下来你要和谁进行一场重要的谈话？' },
    ko: { name: '이가 빠짐', mean: '말과 남에게 비치는 모습과 관련이 있어요. 잘못 말할까 봐 두려운 순간 전에 자주 나타나요.', ask: '곧 누군가와 중요한 대화를 앞두고 있나요?' },
    ja: { name: '歯が抜ける', mean: '言葉や他人からの見え方に関係する。言い間違いを恐れる場面の前によく現れる。', ask: 'これから誰かと大事な話をする予定はある？' }
  },
  water: {
    en: { name: 'Water', mean: 'Water is emotion. Calm water is a settled heart; churning water is feeling built up without release.', ask: 'When did you last cry, or say something truly honest?' },
    zh: { name: '水', mean: '水代表情绪。平静的水是安定的心，翻涌的水是积压已久未曾释放的情绪。', ask: '你上一次哭泣或说真心话是什么时候？' },
    ko: { name: '물', mean: '물은 감정이에요. 잔잔한 물은 평온한 마음, 요동치는 물은 오래 쌓여 풀리지 않은 감정이에요.', ask: '마지막으로 울거나 진심을 말한 게 언제인가요?' },
    ja: { name: '水', mean: '水は感情。穏やかな水は落ち着いた心、荒れる水は長く溜め込んで発散されていない感情。', ask: '最後に泣いたり、本音を話したりしたのはいつ？' }
  },
  house: {
    en: { name: 'House', mean: 'A house in a dream is you. An unfamiliar room is a part unexplored; an old house is something unfinished.', ask: 'Is there a part of yourself you haven\'t visited in a while?' },
    zh: { name: '房子', mean: '梦里的房子就是你自己。陌生的房间是尚未探索的部分，旧房子是未了结的事。', ask: '有没有一部分的自己，你很久没有去探望了？' },
    ko: { name: '집', mean: '꿈속의 집은 바로 당신이에요. 낯선 방은 아직 탐색하지 않은 부분, 오래된 집은 끝내지 못한 일이에요.', ask: '오랫동안 들여다보지 않은 자신의 어떤 부분이 있나요?' },
    ja: { name: '家', mean: '夢の中の家はあなた自身。見知らぬ部屋はまだ探っていない部分、古い家はまだ終わっていないこと。', ask: 'しばらく訪れていない自分の一部はある？' }
  },
  dog: {
    en: { name: 'Dog', mean: 'A dog is loyalty and friendship. A gentle dog is support arriving; an aggressive one means you\'re wary of someone.', ask: "Who do you trust most right now, and have you told them?" },
    zh: { name: '狗', mean: '狗代表忠诚与友谊。温顺的狗预示支持即将到来，凶恶的狗则是你在提防某人。', ask: '现在你最信任的人是谁，你告诉他们了吗？' },
    ko: { name: '개', mean: '개는 충성과 우정을 뜻해요. 순한 개는 다가오는 지지, 사나운 개는 누군가를 경계하고 있다는 뜻이에요.', ask: '지금 가장 믿는 사람은 누구이고, 그 사람에게 말했나요?' },
    ja: { name: '犬', mean: '犬は忠誠と友情。優しい犬は支えが訪れる兆し、獰猛な犬は誰かを警戒していること。', ask: '今一番信頼している人は誰？その人に伝えた？' }
  },
  cat: {
    en: { name: 'Cat', mean: 'A cat corresponds to intuition and the independent part of you. It nudges you to trust your gut more.', ask: 'Is there a hunch you\'ve been pushing aside?' },
    zh: { name: '猫', mean: '猫对应直觉与你内心独立的一面，提醒你更相信自己的直觉。', ask: '有没有一种直觉，你一直在推开不去理会？' },
    ko: { name: '고양이', mean: '고양이는 직관과 당신 안의 독립적인 면을 나타내요. 자신의 직감을 더 믿으라고 일깨워줘요.', ask: '자꾸 밀어내고 있는 예감이 있나요?' },
    ja: { name: '猫', mean: '猫は直感とあなたの中の独立した部分に対応する。もっと直感を信じるよう促している。', ask: '押しのけている予感はある？' }
  },
  snake: {
    en: { name: 'Snake', mean: 'Snakes shed skin, so they\'re tied to transformation. Fearing a snake often means fearing the change you\'re heading toward.', ask: 'What in you is aging and needs to be shed?' },
    zh: { name: '蛇', mean: '蛇会蜕皮，因此与蜕变相关。梦中怕蛇，往往是害怕自己正走向的改变。', ask: '你身上有什么正在老去、需要蜕去？' },
    ko: { name: '뱀', mean: '뱀은 허물을 벗기에 변화와 연결돼요. 뱀이 무서운 건 자신이 향하는 변화가 두렵다는 뜻이에요.', ask: '당신 안에서 낡아가고 있어서 벗어내야 할 것은 무엇인가요?' },
    ja: { name: '蛇', mean: '蛇は脱皮するので変容と結びつく。蛇を怖がるのは、自分が向かう変化そのものを恐れていることが多い。', ask: 'あなたの中で古くなり、脱ぎ捨てる必要があるものは？' }
  },
  exam: {
    en: { name: 'Taking an exam', mean: "Exam dreams come when you're being graded somewhere in real life, or judging yourself too harshly.", ask: 'Who\'s grading you — someone else, or yourself?' },
    zh: { name: '考试', mean: '考试梦出现在你在现实中某处正被评判，或对自己过于苛刻的时候。', ask: '正在给你打分的是别人，还是你自己？' },
    ko: { name: '시험', mean: '시험 꿈은 현실에서 어딘가에서 평가받고 있거나, 스스로를 너무 가혹하게 채점하고 있을 때 찾아와요.', ask: '지금 당신을 채점하는 사람은 남인가요, 자신인가요?' },
    ja: { name: '試験', mean: '試験の夢は、現実のどこかで評価されている時や、自分に厳しすぎる採点をしている時に訪れる。', ask: '今あなたを採点しているのは他人？それとも自分自身？' }
  },
  missed: {
    en: { name: 'Missing the ride', mean: "Fear of missing out. Often paired with a feeling that others are moving faster than you.", ask: 'Whose pace are you comparing yourself to?' },
    zh: { name: '错过班次', mean: '错过的恐惧，常伴随着别人比自己走得快的感觉。', ask: '你在拿自己的节奏和谁比较？' },
    ko: { name: '놓침', mean: '뒤처질까 두려운 마음이에요. 남들이 나보다 빠르다는 느낌이 함께 따라와요.', ask: '지금 누구의 속도와 자신을 비교하고 있나요?' },
    ja: { name: '乗り遅れ', mean: '取り残される恐れ。他人が自分より速く進んでいるという感覚を伴うことが多い。', ask: '誰のペースと自分を比べている？' }
  },
  deceased: {
    en: { name: 'Someone who has passed', mean: 'Usually the mind\'s way of continuing to grieve. This dream tends to bring comfort, not an omen.', ask: 'Is there something you still want to say to them?' },
    zh: { name: '已故的人', mean: '通常是心灵延续思念的方式，这类梦往往带来安慰，而非预兆。', ask: '有没有什么话，你还想对那个人说？' },
    ko: { name: '고인', mean: '보통 마음이 그리움을 이어가는 방식이에요. 이런 꿈은 대개 불길한 징조가 아니라 위안을 줘요.', ask: '아직 그 사람에게 하고 싶은 말이 있나요?' },
    ja: { name: '故人', mean: 'たいてい心が悲しみを続ける方法。この夢は前兆というより、慰めをもたらすことが多い。', ask: 'その人にまだ伝えたいことはある？' }
  },
  wedding: {
    en: { name: 'A wedding', mean: 'Commitment and union — perhaps with a person, or with a choice in life.', ask: "What are you about to say yes to?" },
    zh: { name: '婚礼', mean: '承诺与结合——可能是与某个人，也可能是与人生中的某个选择。', ask: '你正准备对什么点头答应？' },
    ko: { name: '결혼식', mean: '헌신과 결합 — 어떤 사람과의 것일 수도, 인생의 어떤 선택과의 것일 수도 있어요.', ask: '지금 무엇에 대해 승낙하려 하고 있나요?' },
    ja: { name: '結婚式', mean: 'コミットメントと結合——ある人との、あるいは人生の選択との。', ask: '今、何に対して頷こうとしている？' }
  },
  baby: {
    en: { name: 'A baby', mean: 'Something newly formed in you: a project, a relationship, or a new version of yourself.', ask: "What's new in you that still needs tending?" },
    zh: { name: '婴儿', mean: '你身上刚刚成形的新事物：一个项目、一段关系，或一个全新的自己。', ask: '你身上有什么新生的东西还需要被照顾？' },
    ko: { name: '아기', mean: '당신 안에서 막 형성된 새로운 것: 프로젝트, 관계, 혹은 새로운 버전의 자신이에요.', ask: '당신 안에서 새로 생겨나 아직 돌봄이 필요한 건 무엇인가요?' },
    ja: { name: '赤ちゃん', mean: 'あなたの中で新しく形になったもの：プロジェクト、関係、あるいは新しい自分。', ask: 'あなたの中でまだ世話が必要な新しいものは？' }
  },
  money: {
    en: { name: 'Money', mean: 'Rarely about actual money. Usually a feeling about self-worth and security.', ask: 'When did you last feel most valuable, doing what?' },
    zh: { name: '钱', mean: '很少真的和钱有关，通常是关于自我价值与安全感的感受。', ask: '最近你觉得自己最有价值，是在做什么的时候？' },
    ko: { name: '돈', mean: '실제 돈에 관한 것인 경우는 드물어요. 보통 자기 가치와 안전감에 관한 감정이에요.', ask: '최근 무엇을 할 때 자신이 가장 가치 있다고 느꼈나요?' },
    ja: { name: 'お金', mean: '実際のお金についてであることは稀。たいていは自己価値と安全感についての感情。', ask: '最近、何をしている時に自分が一番価値があると感じた？' }
  },
  fire: {
    en: { name: 'Fire', mean: 'Fire is passion or anger. It demands to be seen, not extinguished.', ask: "What's making you angry that you're pushing down?" },
    zh: { name: '火', mean: '火代表激情或愤怒，它要求被看见，而不是被扑灭。', ask: '有什么让你生气却一直压着的事？' },
    ko: { name: '불', mean: '불은 열정 또는 분노예요. 꺼지길 원하는 게 아니라 보여지길 원해요.', ask: '억누르고 있는, 화나는 일이 있나요?' },
    ja: { name: '火', mean: '火は情熱または怒り。消されることではなく、見られることを求めている。', ask: '押し殺している、怒りを感じることは？' }
  },
  lost: {
    en: { name: 'Being lost', mean: "You're between two choices without a map yet. This dream isn't a reproach.", ask: 'If no one were judging, which way would you turn?' },
    zh: { name: '迷路', mean: '你正处在两个选择之间，还没有地图。这个梦不是在责怪你。', ask: '如果没有人评判，你会往哪个方向走？' },
    ko: { name: '길을 잃음', mean: '아직 지도 없이 두 선택 사이에 있는 거예요. 이 꿈은 당신을 탓하는 게 아니에요.', ask: '아무도 평가하지 않는다면 어느 방향으로 가고 싶나요?' },
    ja: { name: '道に迷う', mean: 'まだ地図のないまま、二つの選択の間にいる。この夢はあなたを責めているのではない。', ask: '誰にも評価されないなら、どちらへ進みたい？' }
  },
  dark: {
    en: { name: 'Darkness', mean: "An unclear phase. Often comes right before a significant realization.", ask: "Are you waiting for someone to turn the light on for you?" },
    zh: { name: '黑暗', mean: '一个尚不明朗的阶段，常在一次重大领悟之前出现。', ask: '你是不是在等别人替你开灯？' },
    ko: { name: '어둠', mean: '아직 명확하지 않은 시기예요. 큰 깨달음이 오기 직전에 자주 나타나요.', ask: '누군가 대신 불을 켜주길 기다리고 있나요?' },
    ja: { name: '暗闇', mean: 'まだ明確でない段階。大きな気づきの直前に現れることが多い。', ask: '誰かが代わりに明かりをつけてくれるのを待っている？' }
  },
  sky: {
    en: { name: 'The sky', mean: 'A long view, and a longing to rise above the small daily things.', ask: "What's the biggest thing you want in the next five years?" },
    zh: { name: '天空', mean: '长远的目光，以及超越日常琐事的渴望。', ask: '未来五年你最想要的一件大事是什么？' },
    ko: { name: '하늘', mean: '멀리 보는 시야, 그리고 소소한 일상을 넘어서고 싶은 갈망이에요.', ask: '앞으로 5년 안에 가장 원하는 큰 일은 무엇인가요?' },
    ja: { name: '空', mean: '遠くを見る視野、そして日々の些事を超えたいという渇望。', ask: 'この先5年で一番望む大きなことは？' }
  },
  mirror: {
    en: { name: 'A mirror', mean: "You're looking back at yourself, sometimes rather sternly.", ask: 'If you spoke to yourself the way you speak to a close friend, what would you say?' },
    zh: { name: '镜子', mean: '你在回望自己，有时相当严厉。', ask: '如果用对好朋友说话的语气对自己说，你会说什么？' },
    ko: { name: '거울', mean: '스스로를 돌아보고 있어요, 때론 꽤 엄격하게요.', ask: '친한 친구에게 하듯 자신에게 말한다면 뭐라고 하겠어요?' },
    ja: { name: '鏡', mean: '自分自身を振り返っている、時にかなり厳しく。', ask: '親しい友人に話すように自分に話すなら、何と言う？' }
  },
  storm: {
    en: { name: 'Rain and storm', mean: 'Emotion pouring down. Rain in a dream is also often a cleansing.', ask: "What do you need to have one full, proper cry about?" },
    zh: { name: '雨与暴风', mean: '情绪正在倾泻。梦中的雨也常常是一种洗涤。', ask: '有什么事，你需要痛痛快快哭一场？' },
    ko: { name: '비와 폭풍', mean: '감정이 쏟아지고 있어요. 꿈속의 비는 정화이기도 해요.', ask: '한 번 제대로 울어버려야 할 일이 있나요?' },
    ja: { name: '雨と嵐', mean: '感情が降り注いでいる。夢の中の雨は浄化でもあることが多い。', ask: '一度きちんと泣いてしまうべきことは？' }
  },
  climb: {
    en: { name: 'Climbing', mean: "A long effort. A staircase in a dream matches a journey you're partway through.", ask: 'How far have you already come — and do you remember to acknowledge it?' },
    zh: { name: '攀爬', mean: '一段漫长的努力。梦中的台阶对应你正走到一半的旅程。', ask: '你已经走了多远，有记得肯定自己吗？' },
    ko: { name: '오르기', mean: '오랜 노력이에요. 꿈속의 계단은 지금 절반쯤 지나온 여정과 맞닿아 있어요.', ask: '이미 얼마나 왔는지, 그걸 인정해준 적 있나요?' },
    ja: { name: '登る', mean: '長い努力。夢の中の階段は、今途中にある旅と対応する。', ask: 'すでにどれだけ来たか、それを認めてあげたことはある？' }
  },
  stuck: {
    en: { name: 'Being stuck', mean: "Very common when real life has you feeling unable to speak up or move forward.", ask: 'Where in your life do you feel you have no way out?' },
    zh: { name: '被困', mean: '当现实中你感到无法发声、无法前进时，很常出现。', ask: '生活中哪个地方让你觉得无路可走？' },
    ko: { name: '갇힘', mean: '현실에서 말하지도 나아가지도 못한다고 느낄 때 자주 나타나요.', ask: '삶의 어느 부분에서 출구가 없다고 느끼나요?' },
    ja: { name: '身動きが取れない', mean: '現実で声を上げられず、前に進めないと感じている時によくある。', ask: '人生のどこで出口がないと感じている？' }
  },
  ex: {
    en: { name: 'An old flame', mean: "Rarely about them. Usually about the version of you back then, or a feeling you're missing now.", ask: 'When you were with that person, what version of yourself got to show up?' },
    zh: { name: '旧情人', mean: '很少真的关于他们，通常是关于那时的你，或你现在所缺失的一种感觉。', ask: '和那个人在一起时，你活出的是哪个版本的自己？' },
    ko: { name: '옛 인연', mean: '그 사람에 관한 게 아니라, 그때의 당신 모습이나 지금 그리운 감정에 관한 걸 때가 많아요.', ask: '그 사람과 있을 때 당신은 어떤 모습의 자신일 수 있었나요?' },
    ja: { name: '過去の恋人', mean: 'その人についてであることは稀。たいていはその頃の自分や、今欠けている感覚について。', ask: 'その人といた時、どんな自分でいられた？' }
  },
  fear: {
    en: { name: 'fear', note: "Fear in a dream is often the mind rehearsing a real but smaller-than-it-feels worry." },
    zh: { name: '害怕', note: '梦中的恐惧常是心灵在为一个真实但没那么严重的担忧做演练。' },
    ko: { name: '두려움', note: '꿈속의 두려움은 실제 걱정이지만 느낌보다는 작은 것을 마음이 미리 연습하는 것일 때가 많아요.' },
    ja: { name: '恐怖', note: '夢の中の恐怖は、実在するが感じるほど大きくはない心配事を心がリハーサルしていることが多い。' }
  },
  sad: {
    en: { name: 'sadness', note: 'Sadness in a dream is often daytime emotion that hasn\'t had anywhere to land.' },
    zh: { name: '悲伤', note: '梦中的悲伤常是白天没有地方安放的情绪。' },
    ko: { name: '슬픔', note: '꿈속의 슬픔은 낮 동안 내려놓을 곳이 없던 감정일 때가 많아요.' },
    ja: { name: '悲しみ', note: '夢の中の悲しみは、日中どこにも置き場のなかった感情であることが多い。' }
  },
  happy: {
    en: { name: 'ease', note: "A pleasant dream is a good sign: your nervous system is getting real rest." },
    zh: { name: '愉快', note: '愉快的梦是好兆头：你的神经系统正在得到真正的休息。' },
    ko: { name: '편안함', note: '기분 좋은 꿈은 좋은 신호예요: 신경계가 진짜 휴식을 취하고 있다는 뜻이에요.' },
    ja: { name: '心地よさ', note: '心地よい夢は良い兆し：あなたの神経系が本当に休息を取れている。' }
  },
  angry: {
    en: { name: 'anger', note: 'Anger in a dream is often a boundary being crossed that you haven\'t spoken up about by day.' },
    zh: { name: '愤怒', note: '梦中的愤怒常是白天未曾说出口、被侵犯的界限。' },
    ko: { name: '분노', note: '꿈속의 분노는 낮 동안 말하지 못한, 침범당한 경계일 때가 많아요.' },
    ja: { name: '怒り', note: '夢の中の怒りは、日中口に出せなかった、侵された境界線であることが多い。' }
  },
  anxious: {
    en: { name: 'anxiety', note: 'The rush in a dream mirrors a deadline, real or self-imposed.' },
    zh: { name: '焦虑', note: '梦中的匆忙感反映了一个截止日期，真实的或自己设定的。' },
    ko: { name: '불안', note: '꿈속의 조급함은 실제든 스스로 정한 것이든 마감기한을 반영해요.' },
    ja: { name: '不安', note: '夢の中の急かされる感覚は、現実あるいは自分で課した締め切りを映している。' }
  }
};
