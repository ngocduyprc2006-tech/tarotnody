/* ============================================================
   data/spreads-i18n.js — bản dịch cho spreads.js
   Kiểu trải (tên, mô tả, nhãn từng vị trí), chủ đề (tên, gợi ý) và
   giọng lời khuyên theo chủ đề. spreads.js tự tra bảng này theo
   ngôn ngữ đang bật; thiếu thì rơi về tiếng Việt gốc.
   `slots` liệt kê nhãn theo ĐÚNG thứ tự các vị trí trong spreads.js.
   ============================================================ */
window.SpreadI18N = {
  spreads: {
    one: {
      en: { name: 'One card', desc: 'A short answer for a question that has you stuck.', slots: ['Message'] },
      zh: { name: '一张牌', desc: '为一个困住你的问题给出简短答案。', slots: ['讯息'] },
      ko: { name: '카드 한 장', desc: '막혀 있는 질문에 대한 짧은 답.', slots: ['메시지'] },
      ja: { name: '1枚引き', desc: '行き詰まっている問いへの短い答え。', slots: ['メッセージ'] }
    },
    three: {
      en: { name: 'Three cards', desc: 'What has passed, what is here, what is coming.', slots: ['Past', 'Present', 'Coming'] },
      zh: { name: '三张牌', desc: '已过去的、正在的、即将来的。', slots: ['过去', '现在', '将来'] },
      ko: { name: '카드 세 장', desc: '지나간 일, 지금의 일, 다가오는 일.', slots: ['과거', '현재', '다가옴'] },
      ja: { name: '3枚引き', desc: '過ぎたこと、今あること、来たること。', slots: ['過去', '現在', 'これから'] }
    },
    choice: {
      en: { name: 'Two paths', desc: 'Torn between two choices? Draw this spread.', slots: ['You right now', 'Path A', 'If you choose A', 'Path B', 'If you choose B'] },
      zh: { name: '两条路', desc: '在两个选择之间犹豫时，抽这个牌阵。', slots: ['此刻的你', '路A', '若选A', '路B', '若选B'] },
      ko: { name: '두 갈래 길', desc: '두 선택 사이에서 고민될 때 뽑는 스프레드.', slots: ['지금의 당신', 'A길', 'A를 고르면', 'B길', 'B를 고르면'] },
      ja: { name: '二つの道', desc: '二つの選択で迷っている時に引くスプレッド。', slots: ['今のあなた', '道A', 'Aを選ぶと', '道B', 'Bを選ぶと'] }
    },
    love: {
      en: { name: 'Love', desc: 'Five cards shining into a relationship, from both sides.', slots: ['Your heart', 'Their heart', 'Between you', 'What blocks', 'Direction'] },
      zh: { name: '感情', desc: '五张牌照进一段关系，双方都看。', slots: ['你的心', '对方的心', '你们之间', '阻碍', '走向'] },
      ko: { name: '사랑', desc: '한 관계를 양쪽에서 비추는 다섯 장.', slots: ['당신의 마음', '상대의 마음', '두 사람 사이', '가로막는 것', '나아갈 방향'] },
      ja: { name: '恋愛', desc: '一つの関係を両側から照らす5枚。', slots: ['あなたの心', 'あの人の心', '二人の間', '妨げるもの', '進む方向'] }
    },
    work: {
      en: { name: 'Work', desc: 'Five cards on career, money, and the next step.', slots: ['Where you stand', 'Strength', 'Bottleneck', 'What to do', 'Opening path'] },
      zh: { name: '工作', desc: '五张牌看事业、财运与下一步。', slots: ['目前位置', '优势', '瓶颈', '该做的事', '开启的方向'] },
      ko: { name: '일', desc: '커리어, 돈, 다음 단계에 대한 다섯 장.', slots: ['현재 위치', '강점', '막힌 곳', '해야 할 일', '열리는 방향'] },
      ja: { name: '仕事', desc: 'キャリア・お金・次の一歩についての5枚。', slots: ['現在の立ち位置', '強み', '詰まり', 'やるべきこと', '開ける道'] }
    },
    celtic: {
      en: { name: 'Celtic Cross', desc: 'Ten cards, dissecting one matter from every side.', slots: ['The matter', 'What crosses', 'What you aim for', 'Root', 'Recent past', 'Near future', 'Yourself', 'Surroundings', 'Hopes & fears', 'Outcome'] },
      zh: { name: '凯尔特十字', desc: '十张牌，从各个方向剖析一件事。', slots: ['核心事件', '阻挡之物', '你的目标', '根源', '不久前', '不久后', '你自己', '周遭环境', '希望与恐惧', '结果'] },
      ko: { name: '켈틱 크로스', desc: '열 장으로 한 가지 일을 모든 각도에서 해부해요.', slots: ['핵심 사안', '가로지르는 것', '향하는 목표', '뿌리', '최근의 과거', '가까운 미래', '당신 자신', '주변 환경', '바람과 두려움', '결과'] },
      ja: { name: 'ケルト十字', desc: '10枚で、ひとつの事柄をあらゆる角度から掘り下げる。', slots: ['中心の事柄', '横切るもの', '目指すもの', '根っこ', '少し前', 'もうすぐ', 'あなた自身', '周囲', '望みと恐れ', '結果'] }
    }
  },

  topics: {
    work: {
      en: { name: 'Work', hint: 'career, study, money' },
      zh: { name: '工作', hint: '事业、学业、财运' },
      ko: { name: '일', hint: '직업, 학업, 돈' },
      ja: { name: '仕事', hint: '仕事、学業、お金' }
    },
    love: {
      en: { name: 'Love', hint: 'partner, family, friends' },
      zh: { name: '感情', hint: '爱人、家人、朋友' },
      ko: { name: '사랑', hint: '연인, 가족, 친구' },
      ja: { name: '恋愛', hint: '恋人、家族、友人' }
    },
    change: {
      en: { name: 'Crossroads', hint: 'moving, changing jobs, big decisions' },
      zh: { name: '岔路口', hint: '搬迁、换工作、重大决定' },
      ko: { name: '갈림길', hint: '이사, 이직, 큰 결정' },
      ja: { name: '岐路', hint: '引っ越し、転職、大きな決断' }
    },
    create: {
      en: { name: 'Creativity', hint: 'personal projects, inspiration, self-expression' },
      zh: { name: '创作', hint: '个人项目、灵感、表达自我' },
      ko: { name: '창작', hint: '개인 프로젝트, 영감, 자기표현' },
      ja: { name: '創作', hint: '自分のプロジェクト、インスピレーション、自己表現' }
    },
    inner: {
      en: { name: 'Inner world', hint: 'healing, self-understanding, peace' },
      zh: { name: '内心', hint: '疗愈、了解自己、平静' },
      ko: { name: '내면', hint: '치유, 자기 이해, 평화' },
      ja: { name: '内面', hint: '癒し、自己理解、安らぎ' }
    },
    open: {
      en: { name: 'Not sure yet', hint: 'just draw, let the cards speak first' },
      zh: { name: '还不清楚', hint: '先抽，让牌先开口' },
      ko: { name: '아직 모르겠어요', hint: '일단 뽑고, 카드가 먼저 말하게 해요' },
      ja: { name: 'まだ分からない', hint: 'とにかく引いて、カードに先に語らせる' }
    }
  },

  voice: {
    work: {
      en: { up: "On the work front, this is a signal to push through. Pick one concrete task this week and finish it completely.", rev: "On the work front, the reversal advises slowing down a beat. Something is straining and you haven't yet admitted that it is." },
      zh: { up: '在工作上，这是让你向前推进的信号。这周选一件具体的事，把它完整做完。', rev: '在工作上，逆位牌劝你放慢一拍。有些地方你正在硬撑，却还没肯承认自己在硬撑。' },
      ko: { up: '일에 관해서는, 밀고 나아가라는 신호예요. 이번 주에 구체적인 일 하나를 골라 온전히 끝내보세요.', rev: '일에 관해서는, 역방향이 한 박자 늦추라고 권해요. 어딘가 무리하고 있는데 아직 그걸 인정하지 않고 있어요.' },
      ja: { up: '仕事に関しては、前へ進めというサイン。今週、具体的なことをひとつ選んで最後までやり遂げよう。', rev: '仕事に関しては、逆位置がひと呼吸置くよう勧めている。無理をしているところがあるのに、まだそれを認めていない。' }
    },
    love: {
      en: { up: "In matters of love, let your heart stay open. Say the true thing before it turns into distance.", rev: "In matters of love, something hasn't been said plainly. Ask yourself first: what do I actually need here?" },
      zh: { up: '在感情上，让你的心保持敞开。在它变成距离之前，说出真心话。', rev: '在感情上，有件事还没有直接说出口。先问问自己：我在这里真正需要的是什么？' },
      ko: { up: '사랑에 관해서는, 마음을 열어두세요. 거리가 되기 전에 진심을 말하세요.', rev: '사랑에 관해서는, 아직 솔직하게 말하지 않은 게 있어요. 먼저 스스로에게 물어보세요: 나는 여기서 진짜 무엇이 필요한가?' },
      ja: { up: '恋愛に関しては、心を開いたままに。距離になってしまう前に、本当のことを言おう。', rev: '恋愛に関しては、まだはっきり言葉にしていないことがある。まず自分に問おう：私はここで本当は何が必要なのか？' }
    },
    change: {
      en: { up: "For this crossroads, the cards say you already have enough information to choose. What you lack is your own permission.", rev: "For this crossroads, it isn't time to decide yet. Give yourself another week of observing, and don't let anyone rush you." },
      zh: { up: '面对这个岔路口，牌说你已经掌握足够的信息可以选择了。你缺的是自己的允许。', rev: '面对这个岔路口，还不是决定的时候。再给自己一周观察，别让任何人催你。' },
      ko: { up: '이 갈림길에 대해, 카드는 이미 고를 만큼의 정보가 충분하다고 말해요. 부족한 건 스스로에게 주는 허락이에요.', rev: '이 갈림길에 대해, 아직 결정할 때가 아니에요. 일주일 더 지켜볼 시간을 주고, 누구도 재촉하게 두지 마세요.' },
      ja: { up: 'この岐路について、カードは選ぶのに十分な情報がすでにあると言っている。足りないのは、自分自身の許可。', rev: 'この岐路について、まだ決める時ではない。もう一週間観察する時間を自分に与え、誰にも急かさせないで。' }
    },
    create: {
      en: { up: "Your creative side is open. A rough, ugly draft is fine as long as there is one.", rev: "Your creativity is blocked, often because you compare a bit too much. Switch the comparing off and start again." },
      zh: { up: '你的创作力正在敞开。做出一份粗糙的草稿也行，只要有一份。', rev: '你的创作力正受阻，常常是因为比较得有点多。关掉比较，重新开始。' },
      ko: { up: '창작 쪽이 열려 있어요. 못생긴 초안이어도 괜찮아요, 하나만 있으면 돼요.', rev: '창작이 막혀 있어요, 대개 비교를 조금 많이 해서예요. 비교하는 스위치를 끄고 다시 해보세요.' },
      ja: { up: 'あなたの創造性は開いている。下手な下書きでも構わない、ひとつあればいい。', rev: '創造性が詰まっているのは、たいてい比べすぎているから。比べるのをやめて、やり直そう。' }
    },
    inner: {
      en: { up: "For your inner world, you're heading the right way. One small daily habit is enough.", rev: "For your inner world, the reversal isn't blaming you. It only says: you need real rest, not rest while still worrying." },
      zh: { up: '在内心方面，你走对了方向。每天保持一个小习惯就足够了。', rev: '在内心方面，逆位牌并没有责怪你。它只是说：你需要真正的休息，而不是一边休息一边担心。' },
      ko: { up: '내면에 관해서는, 올바른 방향으로 가고 있어요. 매일 작은 습관 하나면 충분해요.', rev: '내면에 관해서는, 역방향은 당신을 탓하지 않아요. 그저 말할 뿐이에요: 걱정하면서 쉬는 게 아니라, 진짜 쉬어야 해요.' },
      ja: { up: '内面に関しては、正しい方向へ進んでいる。毎日ひとつの小さな習慣があれば十分。', rev: '内面に関しては、逆位置はあなたを責めていない。ただ言っているだけ：心配しながら休むのではなく、本当に休む必要がある。' }
    },
    open: {
      en: { up: "Having no clear question is fine. Just leave this card be; in a few days you'll understand what it was saying.", rev: "A reversal here is a gentle reminder: don't force yourself to be clear today." },
      zh: { up: '没有明确的问题也没关系。这张牌先放着，过几天你就会明白它在说什么。', rev: '这里的逆位牌是一句温柔的提醒：别逼自己今天就必须想清楚。' },
      ko: { up: '분명한 질문이 없어도 괜찮아요. 이 카드는 그냥 두세요, 며칠 뒤면 무슨 말이었는지 알게 될 거예요.', rev: '여기서의 역방향은 다정한 일깨움이에요: 오늘 꼭 분명해져야 한다고 자신을 몰아붙이지 마세요.' },
      ja: { up: 'はっきりした問いがなくても大丈夫。このカードはそのままにしておいて、数日後に何を言っていたか分かるはず。', rev: 'ここでの逆位置は優しい念押し：今日中にはっきりさせなければと自分を追い込まないで。' }
    }
  }
};
