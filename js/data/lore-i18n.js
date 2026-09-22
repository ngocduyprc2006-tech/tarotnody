/* ============================================================
   data/lore-i18n.js — bản dịch cho lore.js (chiêm tinh + thần số học)
   ------------------------------------------------------------
   Cùng cách làm với deck-i18n.js: KHÔNG đụng vào lore.js gốc
   (tiếng Việt vẫn là bản đầy đủ nhất, giữ nguyên). File này chỉ
   cung cấp bản dịch để horoscope.js / numerology.js / match.js
   tra theo ngôn ngữ đang bật. Thiếu ngôn ngữ nào thì tự rơi về
   tiếng Việt ở nơi gọi, không bao giờ để trống.
   ============================================================ */
window.LoreI18N = (function () {
  'use strict';

  const zodiac = {
    aries: {
      name: { en: 'Aries', zh: '白羊座', ko: '양자리', ja: '牡羊座' },
      en: { trait: 'You start faster than everyone else and don\'t mind leading.', care: 'Practice patience with things that ripen slowly.' },
      zh: { trait: '你总能率先启动，不怕带头。', care: '练习对慢慢成熟的事保持耐心。' },
      ko: { trait: '당신은 누구보다 빨리 시작하고 앞장서는 걸 두려워하지 않아요.', care: '천천히 익는 일에 인내심을 연습해 보세요.' },
      ja: { trait: '誰よりも早く動き出し、先頭に立つことを恐れない。', care: 'ゆっくり熟すものに我慢強くなる練習を。' }
    },
    taurus: {
      name: { en: 'Taurus', zh: '金牛座', ko: '황소자리', ja: '牡牛座' },
      en: { trait: 'You build solidly and hold steady — people feel safe relying on you.', care: "Practice letting go of something that's outgrown its season, even if familiar." },
      zh: { trait: '你稳扎稳打，让依靠你的人安心。', care: '练习放下一件已经过时却熟悉的事。' },
      ko: { trait: '당신은 튼튼하게 쌓고 오래 지켜서, 기대는 사람들을 편안하게 해요.', care: '익숙하지만 이미 끝난 일을 놓아주는 연습을 하세요.' },
      ja: { trait: '着実に築き、支えてくれるので周りが安心する。', care: '慣れていても役目を終えたものを手放す練習を。' }
    },
    gemini: {
      name: { en: 'Gemini', zh: '双子座', ko: '쌍둥이자리', ja: '双子座' },
      en: { trait: 'You connect people, learn fast and speak with ease.', care: 'Practice staying with one thing long enough to see it bear fruit.' },
      zh: { trait: '你善于连接人与人，理解快，也很会说话。', care: '练习在一件事上多留一会儿，看到它开花结果。' },
      ko: { trait: '당신은 사람과 사람을 이어주고, 이해가 빠르며 말도 능숙해요.', care: '한 가지 일에 충분히 머물러 결실을 보는 연습을 하세요.' },
      ja: { trait: '人と人をつなぎ、理解が早く、話し上手。', care: 'ひとつのことに十分留まり、実を結ぶのを見る練習を。' }
    },
    cancer: {
      name: { en: 'Cancer', zh: '巨蟹座', ko: '게자리', ja: '蟹座' },
      en: { trait: 'You sense what others haven\'t said and care for people so well.', care: 'Practice giving yourself that same gentleness.' },
      zh: { trait: '你能感知别人没说出口的心情，很擅长照顾人。', care: '练习用同样的温柔照顾自己。' },
      ko: { trait: '말하지 않은 마음까지 느끼고, 사람을 돌보는 데 능숙해요.', care: '그 다정함을 자신에게도 베푸는 연습을 하세요.' },
      ja: { trait: '言葉にされない気持ちまで感じ取り、人の世話が上手。', care: 'その優しさを自分自身にも向ける練習を。' }
    },
    leo: {
      name: { en: 'Leo', zh: '狮子座', ko: '사자자리', ja: '獅子座' },
      en: { trait: 'You shine naturally and warm up everyone around you.', care: 'Practice still feeling enough when no one is applauding.' },
      zh: { trait: '你自然地闪耀，也温暖了身边的人。', care: '练习在没有掌声时也觉得自己已经足够好。' },
      ko: { trait: '자연스럽게 빛나고 주변 사람들을 따뜻하게 만들어요.', care: '박수가 없어도 스스로 충분하다고 느끼는 연습을 하세요.' },
      ja: { trait: '自然と輝き、周りの人を温める。', care: '拍手がなくても自分は十分だと感じる練習を。' }
    },
    virgo: {
      name: { en: 'Virgo', zh: '处女座', ko: '처녀자리', ja: '乙女座' },
      en: { trait: 'You spot the details everyone else misses and tidy everything up.', care: 'Practice leaving something "good enough" without one more fix.' },
      zh: { trait: '你能看到别人忽略的细节，把一切打理得井井有条。', care: '练习让\"足够好\"的事保持原样，不再修改。' },
      ko: { trait: '남들이 놓치는 디테일을 알아채고 모든 걸 깔끔하게 정리해요.', care: '\"이 정도면 충분해\"라고 두고 더 손대지 않는 연습을 하세요.' },
      ja: { trait: '誰も気づかない細部に気づき、すべてを整える。', care: '「もう十分」なものをそのままにしておく練習を。' }
    },
    libra: {
      name: { en: 'Libra', zh: '天秤座', ko: '천칭자리', ja: '天秤座' },
      en: { trait: 'You keep the peace and see both sides fairly.', care: 'Practice picking your own side when it matters.' },
      zh: { trait: '你善于维持和气，也能看到双方的道理。', care: '练习在重要时刻选择自己的立场。' },
      ko: { trait: '평화를 지키고 양쪽 입장을 공정하게 볼 줄 알아요.', care: '중요할 때는 자기 편을 선택하는 연습을 하세요.' },
      ja: { trait: '和を保ち、双方の言い分を公平に見られる。', care: '大事な時は自分の立場を選ぶ練習を。' }
    },
    scorpio: {
      name: { en: 'Scorpio', zh: '天蝎座', ko: '전갈자리', ja: '蠍座' },
      en: { trait: 'You go all the way to the bottom of things and aren\'t afraid of hard truths.', care: 'Practice trusting people one beat sooner.' },
      zh: { trait: '你会把事情追究到底，不怕难听的真相。', care: '练习早一点点相信别人。' },
      ko: { trait: '끝까지 파고들며 불편한 진실도 두려워하지 않아요.', care: '한 박자 더 빨리 사람을 믿어보는 연습을 하세요.' },
      ja: { trait: '物事を最後まで掘り下げ、厳しい真実も恐れない。', care: 'もう一拍早く人を信じる練習を。' }
    },
    sagittarius: {
      name: { en: 'Sagittarius', zh: '射手座', ko: '사수자리', ja: '射手座' },
      en: { trait: 'You need a wide horizon and inspire others with your honesty.', care: 'Practice staying when things turn ordinary.' },
      zh: { trait: '你需要广阔的天地，也用坦率激励着别人。', care: '练习在事情变得平淡时依然留下来。' },
      ko: { trait: '넓은 지평선이 필요하고, 솔직함으로 사람들에게 영감을 줘요.', care: '일이 지루해져도 자리를 지키는 연습을 하세요.' },
      ja: { trait: '広い地平線を必要とし、率直さで人を鼓舞する。', care: '物事が平凡になっても留まる練習を。' }
    },
    capricorn: {
      name: { en: 'Capricorn', zh: '摩羯座', ko: '염소자리', ja: '山羊座' },
      en: { trait: 'You climb steadily and finish long journeys few others can.', care: 'Practice resting without feeling lazy about it.' },
      zh: { trait: '你稳步向上，能完成别人难以坚持的长期目标。', care: '练习休息时不觉得自己懒惰。' },
      ko: { trait: '꾸준히 오르며, 남들이 못 하는 긴 여정을 해내요.', care: '쉬면서도 게으르다고 느끼지 않는 연습을 하세요.' },
      ja: { trait: '着実に登り、他の人にはできない長い道のりをやり遂げる。', care: '休むことを怠けだと感じない練習を。' }
    },
    aquarius: {
      name: { en: 'Aquarius', zh: '水瓶座', ko: '물병자리', ja: '水瓶座' },
      en: { trait: 'You think differently from the crowd and care about the collective good.', care: 'Practice letting people close a little more.' },
      zh: { trait: '你的想法与众不同，也关心公共的福祉。', care: '练习让亲近的人再靠近你一点。' },
      ko: { trait: '남들과 다르게 생각하고 공동체를 위해 신경 써요.', care: '가까운 사람이 조금 더 다가오게 두는 연습을 하세요.' },
      ja: { trait: '周りと違う視点を持ち、みんなの幸せを気にかける。', care: '身近な人をもう少し近くに招く練習を。' }
    },
    pisces: {
      name: { en: 'Pisces', zh: '双鱼座', ko: '물고기자리', ja: '魚座' },
      en: { trait: 'You have a rich imagination and love people with real tenderness.', care: 'Practice setting boundaries without losing your softness.' },
      zh: { trait: '你想象力丰富，也用真心去爱人。', care: '练习设立界限，同时不失去温柔。' },
      ko: { trait: '풍부한 상상력을 지녔고 진심으로 사람을 사랑해요.', care: '부드러움을 잃지 않으면서 경계를 세우는 연습을 하세요.' },
      ja: { trait: '豊かな想像力を持ち、心から人を愛する。', care: '優しさを失わずに境界線を引く練習を。' }
    }
  };

  const elementDay = {
    'Lửa':  { en: ["Today favors starting something, even just opening a blank file.", "Don't burn all your wood by morning."],
              zh: ['今天适合开始一件事，哪怕只是打开一份空白文件。', '别一早就把柴火烧光。'],
              ko: ['오늘은 무언가를 시작하기 좋은 날이에요, 빈 파일을 여는 것만으로도.', '아침부터 장작을 다 태우지는 마세요.'],
              ja: ['今日は何かを始めるのに向いている。空のファイルを開くだけでもいい。', '朝のうちに薪をすべて燃やさないで。'] },
    'Đất':  { en: ['Today favors hands-on work and things you can see and touch.', 'A small tidy-up will untangle a knot in your head.'],
              zh: ['今天适合动手做事，做看得见摸得着的事。', '一次小小的整理会解开心里的一个结。'],
              ko: ['오늘은 손으로 하는 일, 눈에 보이는 일에 좋은 날이에요.', '작은 정리 하나가 머릿속 매듭을 풀어줄 거예요.'],
              ja: ['今日は手を動かす作業や、目に見えるものごとに向いている。', 'ちょっとした片付けが頭の中のもつれを解いてくれる。'] },
    'Khí':  { en: ['Today favors talking, asking directly, writing things down.', 'Think a little less, say a little more.'],
              zh: ['今天适合交谈、直接提问、把想法写下来。', '少想一点，多说一点。'],
              ko: ['오늘은 대화하고, 직접 묻고, 글로 적기에 좋은 날이에요.', '생각은 조금 줄이고 말은 조금 더 해보세요.'],
              ja: ['今日は話す、率直に尋ねる、書き出すのに向いている。', '考えるのを少し減らし、話すのを少し増やそう。'] },
    'Nước': { en: ['Today favors rest, music, being near someone you love.', "It's normal for feelings to swell — they'll pass faster than you think."],
              zh: ['今天适合休息、听音乐、和亲近的人在一起。', '情绪涌上来很正常，它退去的速度比你想的快。'],
              ko: ['오늘은 쉬고, 음악을 듣고, 사랑하는 사람 곁에 있기 좋은 날이에요.', '감정이 북받치는 건 자연스러운 일이고, 생각보다 빨리 가라앉아요.'],
              ja: ['今日は休む、音楽を聴く、大切な人のそばにいるのに向いている。', '感情が高ぶるのは自然なこと。思うより早く引いていく。'] }
  };

  const numbers = {
    1:  { en: ['The Pathfinder', "You were born to go first and decide for yourself. Independence is your strength, but asking for help doesn't make you less."],
          zh: ['开路者', '你天生适合走在前面，自己做决定。独立是你的力量，但求助并不会让你变弱。'],
          ko: ['개척자', '당신은 앞장서고 스스로 결정하도록 태어났어요. 독립은 힘이지만, 도움을 청해도 약해지는 건 아니에요.'],
          ja: ['開拓者', 'あなたは先頭に立ち、自分で決めるために生まれた。独立は強さだが、頼ることは弱さではない。'] },
    2:  { en: ['The Connector', 'You feel other people\'s rhythm and bridge them well. Your work is learning to say "no" while staying gentle.'],
          zh: ['连接者', '你能感受别人的节奏，擅长搭建桥梁。你的课题是学会温柔地说\"不\"。'],
          ko: ['연결자', '당신은 다른 사람의 리듬을 느끼고 다리 역할을 잘해요. 다정하게 \"아니오\"라고 말하는 법을 배우는 게 과제예요.'],
          ja: ['つなぎ役', '他人のリズムを感じ取り、橋渡しが上手。優しく「ノー」と言えるようになるのが課題。'] },
    3:  { en: ['The Storyteller', 'You express things well, stay creative, and lighten the room. Keep one project you actually finish.'],
          zh: ['讲故事的人', '你表达力强、有创意，能让气氛轻松起来。留住一件真正完成到底的事。'],
          ko: ['이야기꾼', '표현력이 좋고 창의적이며 분위기를 가볍게 만들어요. 끝까지 해내는 일 하나를 지켜보세요.'],
          ja: ['語り手', '表現力があり、創造的で、場を軽くする。ひとつだけ最後までやり遂げる仕事を持とう。'] },
    4:  { en: ['The Builder', 'You are disciplined, reliable, and build things that last. Leave room for what isn\'t on the plan.'],
          zh: ['建造者', '你自律、可靠，能建造持久的东西。给计划外的事留一点空间。'],
          ko: ['건축가', '규율 있고 믿음직하며 오래가는 것을 만들어요. 계획에 없던 일을 위한 여유도 남겨두세요.'],
          ja: ['建築家', '規律正しく信頼でき、長く続くものを築く。計画にないことのための余白を残そう。'] },
    5:  { en: ['The Wanderer', 'You need freedom and change to feel alive. A few anchors will give the journey somewhere to return to.'],
          zh: ['远行者', '你需要自由与变化才能感到活着。留几个锚点，旅程才有地方可以回来。'],
          ko: ['여행자', '자유와 변화가 있어야 살아있음을 느껴요. 닻이 몇 개 있으면 여정에 돌아올 곳이 생겨요.'],
          ja: ['旅人', '自由と変化があってこそ生きている実感を得る。いくつかの錨があれば、旅に戻る場所ができる。'] },
    6:  { en: ['The Caretaker', 'You carry and care so well that everyone leans on you. Learn to receive care back.'],
          zh: ['照顾者', '你承担与照顾的能力很强，大家都愿意依靠你。学着也接受别人的照顾。'],
          ko: ['돌봄이', '짐을 지고 돌보는 데 능숙해 모두가 당신에게 기대요. 반대로 돌봄을 받는 법도 배워보세요.'],
          ja: ['世話役', '支え、世話をするのが上手で、みんなが頼ってくる。ケアを受け取ることも学ぼう。'] },
    7:  { en: ['The Seeker', 'You love depth, observe closely, and need your own space. Don\'t let that space turn into a wall.'],
          zh: ['探求者', '你喜欢深度，善于观察，需要属于自己的空间。别让那份空间变成一堵墙。'],
          ko: ['탐구자', '깊이를 좋아하고 관찰력이 뛰어나며 자기만의 공간이 필요해요. 그 공간이 벽이 되지 않게 하세요.'],
          ja: ['探求者', '深さを愛し、よく観察し、自分の空間を必要とする。その空間を壁にしないで。'] },
    8:  { en: ['The Commander', 'You have an instinct for power, money, and organization. Balance achievement against ordinary evenings.'],
          zh: ['掌舵者', '你对权力、金钱与组织有天生的直觉。在成就与平凡的夜晚之间找到平衡。'],
          ko: ['지휘관', '권력, 돈, 조직에 대한 본능이 있어요. 성취와 평범한 저녁 사이에서 균형을 잡아보세요.'],
          ja: ['指揮官', '力・お金・組織への直感がある。成果と平凡な夜のバランスを取ろう。'] },
    9:  { en: ['The Giver', 'You are generous and think of the collective good. Give within your means so you can keep giving.'],
          zh: ['给予者', '你慷慨大方，也为大众着想。量力而行地给予，才能给得长久。'],
          ko: ['베푸는 사람', '마음이 넓고 공동의 이익을 생각해요. 감당할 만큼만 베풀어야 오래 베풀 수 있어요.'],
          ja: ['与える人', '心が広く、みんなの幸せを考える。無理のない範囲で与えてこそ、長く与え続けられる。'] },
    11: { en: ['Master Number 11 — The Inspirer', 'Your intuition is very strong and you move people just by being present. In return, you feel more and tire more.'],
          zh: ['大师数 11 — 启发者', '你的直觉非常强，光是在场就能触动别人。相应地，你也更敏感、更容易累。'],
          ko: ['마스터 넘버 11 — 영감을 주는 사람', '직관이 매우 강해서 존재만으로도 사람들을 움직여요. 그만큼 더 예민하고 쉽게 지쳐요.'],
          ja: ['マスターナンバー11 — 鼓舞する人', '直感が非常に強く、いるだけで人を動かす。その分、敏感で疲れやすい。'] },
    22: { en: ['Master Number 22 — The Builder of Dreams', 'You can turn big dreams into real structures. Don\'t carry the whole dream alone.'],
          zh: ['大师数 22 — 造梦者', '你能把宏大的梦想变成真实的成就。别一个人扛起整个梦想。'],
          ko: ['마스터 넘버 22 — 꿈의 건축가', '큰 꿈을 실제 결과물로 만들 수 있어요. 그 꿈을 혼자 다 짊어지지 마세요.'],
          ja: ['マスターナンバー22 — 夢の建築家', '大きな夢を現実の形にできる。その夢をひとりで抱え込まないで。'] },
    33: { en: ['Master Number 33 — The Gentle Teacher', 'You heal others simply by your presence. Remember to save some healing for yourself.'],
          zh: ['大师数 33 — 温柔的老师', '你仅凭在场就能疗愈他人。也要记得留一份疗愈给自己。'],
          ko: ['마스터 넘버 33 — 다정한 스승', '존재만으로 다른 사람을 치유해요. 그 치유를 자신에게도 나눠주세요.'],
          ja: ['マスターナンバー33 — 優しい教師', 'ただそこにいるだけで人を癒す。その癒しを自分自身にも。'] }
  };

  const numRoles = {
    life:   { en: 'Life Path',      note: 'the main lesson of your whole life' },
    soul:   { en: "Soul Urge",      note: "what you truly long for" },
    person: { en: 'Personality',    note: 'the impression others get from you' },
    expr:   { en: 'Expression',     note: 'the ability you bring into the world' },
    birth:  { en: 'Birth Day',      note: 'your innate gift' },
    zh: { life: '生命之路', soul: '灵魂渴望', person: '人格', expr: '天赋使命', birth: '出生日' },
    zhNote: { life: '你一生的主要课题', soul: '你真正渴望的东西', person: '别人对你的印象', expr: '你带到世上的能力', birth: '你与生俱来的礼物' },
    ko: { life: '생명수', soul: '영혼 갈망', person: '인격', expr: '사명', birth: '탄생일' },
    koNote: { life: '평생의 주요 과제', soul: '진짜로 갈망하는 것', person: '남들이 받는 인상', expr: '세상에 내놓는 능력', birth: '타고난 선물' },
    ja: { life: 'ライフパス', soul: 'ソウルナンバー', person: 'パーソナリティ', expr: '使命', birth: '誕生日数' },
    jaNote: { life: '人生全体の主な課題', soul: '本当に渇望していること', person: '他人が受ける印象', expr: '世界にもたらす力', birth: '生まれ持った才能' }
  };

  const personalYear = {
    1: { en: 'A year of beginnings. Plant seeds, start out, dare to put your name on something.',
         zh: '开端之年。播种、开始、敢于把名字署在一件事上。',
         ko: '시작의 해예요. 씨를 뿌리고, 시작하고, 무언가에 자기 이름을 걸어보세요.',
         ja: '始まりの年。種をまき、動き出し、自分の名前で何かを始めよう。' },
    2: { en: 'A year of relationships and patience. Slow but steady, more partnership than solo.',
         zh: '关系与耐心之年。慢而稳，合作胜过单打独斗。',
         ko: '관계와 인내의 해예요. 느리지만 꾸준히, 혼자보다는 함께.',
         ja: '関係と忍耐の年。ゆっくり着実に、単独より協力を。' },
    3: { en: 'A year of expression. Create, communicate, let yourself have fun.',
         zh: '表达之年。创造、沟通，允许自己快乐。',
         ko: '표현의 해예요. 창작하고 소통하고, 스스로 즐거워도 괜찮아요.',
         ja: '表現の年。創造し、伝え、自分を楽しませよう。' },
    4: { en: 'A year of laying foundations. Less glamour, more real work, very worth it.',
         zh: '打基础之年。少些光鲜，多些实事，非常值得。',
         ko: '기초를 다지는 해예요. 화려함은 적어도 진짜 노력이 많고, 그만한 가치가 있어요.',
         ja: '土台を築く年。華やかさは少ないが、実のある仕事が多く、とても価値がある。' },
    5: { en: 'A year of pleasant upheaval. Change places, change jobs, widen your circle.',
         zh: '愉快变动之年。换地方、换工作，扩大你的圈子。',
         ko: '기분 좋은 변화의 해예요. 장소를 바꾸고, 일을 바꾸고, 인연의 폭을 넓혀보세요.',
         ja: '心地よい変動の年。場所を変え、仕事を変え、輪を広げよう。' },
    6: { en: 'A year of home and family. More responsibility, deeper love too.',
         zh: '家庭之年。责任更多，感情也更深。',
         ko: '가정과 가족의 해예요. 책임이 늘지만 사랑도 더 깊어져요.',
         ja: '家庭の年。責任が増えるが、愛も深まる。' },
    7: { en: 'A year of turning inward. Study, rest, understand yourself. Don\'t force yourself to stay busy.',
         zh: '向内转的一年。学习、休息、了解自己，别强迫自己忙碌。',
         ko: '안으로 향하는 해예요. 배우고, 쉬고, 자신을 이해하세요. 억지로 바쁘게 지내지 마세요.',
         ja: '内へ向かう年。学び、休み、自分を理解しよう。無理に忙しくしなくていい。' },
    8: { en: 'A year of harvest. Money, position, and results from past years come together.',
         zh: '收获之年。金钱、地位与往年的成果一并到来。',
         ko: '수확의 해예요. 돈, 지위, 지난 몇 년의 결과가 한꺼번에 모여요.',
         ja: '収穫の年。お金、地位、これまでの成果が集まってくる。' },
    9: { en: 'A year of closing a cycle. Clear out, forgive, let go — the empty space makes room for year 1.',
         zh: '收尾之年。清理、原谅、放下，空出来的地方是留给\"1\"年的。',
         ko: '한 사이클을 닫는 해예요. 정리하고, 용서하고, 놓아주세요. 비워진 자리는 1년을 위한 것.',
         ja: 'サイクルを閉じる年。片付け、許し、手放そう。空いた場所は1年目のためにある。' }
  };

  return { zodiac, elementDay, numbers, numRoles, personalYear };
})();
