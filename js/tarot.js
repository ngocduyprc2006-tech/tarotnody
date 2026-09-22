/* ============================================================
   tarot.js — luồng trải bài đầy đủ
   Bước: chọn chủ đề → chọn kiểu trải → xáo & rút → bàn trải → luận giải
   ============================================================ */

(function () {
  'use strict';

  const D = window.DeckData;
  const S = window.SpreadData;
  const Sh = window.Shell;

  /* ---------- Trạng thái một lượt ---------- */
  let st = { topic: 'open', spread: null, question: '', pool: [], drawn: [], profile: null };

  const $ = (id) => document.getElementById(id);
  const T = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);
  const lang = () => (window.I18N ? window.I18N.get() : 'vi');

  /* ==========================================================
     Góc nhìn mở rộng cho bảng chi tiết một lá — tình yêu / công
     việc / lời khuyên. Chọn ngẫu nhiên 1 trong 3 cách diễn đạt
     mỗi lần rút, để cùng một lá xuất hiện ở hai lượt bói khác
     nhau thì đọc không bị y hệt câu chữ (dù vẫn cùng một nghĩa
     gốc — nghĩa gốc lấy từ deck.js/deck-i18n.js).
     ========================================================== */
  const ANGLE = {
    fire: {
      love: [
        { vi: 'Trong chuyện tình cảm, đây là lúc để chủ động thay vì chờ đối phương ra tay trước.', en: 'In matters of the heart, this is a time to take the first step rather than wait for the other person.', zh: '在感情上，此刻适合主动出击，而不是等对方先开口。', ko: '연애에서는 상대가 먼저 움직이길 기다리기보다 스스로 다가설 때예요.', ja: '恋愛では、相手を待つより自分から動くべき時。' },
        { vi: 'Sức nóng đang có sẵn — cứ bày tỏ thẳng điều bạn muốn, vòng vo chỉ làm nguội đi thôi.', en: 'The spark is already there — say plainly what you want; hedging only lets it cool.', zh: '热度已经在了——直接说出你想要的，拐弯抹角只会让它冷却。', ko: '열기는 이미 있어요 — 원하는 걸 솔직히 말해보세요, 돌려 말하면 식어버릴 뿐이에요.', ja: '熱はもうそこにある。遠回しにすると冷めてしまうから、素直に伝えて。' },
        { vi: 'Một cuộc tranh luận nhỏ có thể bùng lên nếu cả hai đều nóng vội — chậm một nhịp trước khi nói.', en: 'A small disagreement could flare up if you both rush — take one beat before speaking.', zh: '如果双方都太急躁，小争执可能一触即发——开口前先缓一拍。', ko: '둘 다 서두르면 작은 다툼도 확 커질 수 있어요 — 말하기 전에 한 박자 쉬어가세요.', ja: '互いに急ぎすぎると小さな衝突が燃え上がるかも。話す前にひと呼吸を。' }
      ],
      work: [
        { vi: 'Công việc đang cần một người dám ra quyết định đầu tiên — có thể đó là bạn lúc này.', en: 'Work needs someone willing to make the first call — right now, that might be you.', zh: '工作正需要一个敢第一个拍板的人——此刻也许就是你。', ko: '일에는 먼저 결정을 내릴 사람이 필요해요 — 지금은 그게 당신일 수도 있어요.', ja: '仕事には最初に決断する人が必要。今、それはあなたかもしれない。' },
        { vi: 'Đừng chờ mọi thứ hoàn hảo mới bắt tay vào — bắt đầu trước, chỉnh sau.', en: "Don't wait for everything to be perfect before starting — begin first, adjust later.", zh: '别等一切完美才动手——先开始，再调整。', ko: '완벽해질 때까지 기다리지 마세요 — 먼저 시작하고 나중에 다듬으면 돼요.', ja: '完璧になるまで待たないで。まず始めて、後で調整すればいい。' },
        { vi: 'Năng lượng đang cao nhưng dễ tản mát — chọn đúng một việc rồi dồn hết vào đó.', en: "Energy is high but easily scattered — pick exactly one task and pour it all in.", zh: '能量很高但容易分散——只选一件事，全力投入。', ko: '에너지는 높지만 흩어지기 쉬워요 — 딱 한 가지 일을 골라 거기에 쏟아부으세요.', ja: 'エネルギーは高いが散りやすい。ひとつだけ選んで、そこに注ぎ込もう。' }
      ]
    },
    water: {
      love: [
        { vi: 'Cảm xúc đang chảy mạnh — đây là lúc nói thật lòng mình hơn là giữ trong bụng.', en: 'Feelings are running deep — this is a time to say what your heart holds, not keep it inside.', zh: '情感正在涌动——此刻适合说出真心话，而不是憋在心里。', ko: '감정이 깊이 흐르고 있어요 — 마음에 담아두기보다 솔직히 말할 때예요.', ja: '感情が深く流れている。心にしまわず、素直に伝える時。' },
        { vi: 'Một người thân thiết có thể đang cần bạn lắng nghe nhiều hơn là cần bạn giải quyết.', en: 'Someone close may need you to listen more than to fix anything.', zh: '身边的人也许更需要你倾听，而不是替他们解决问题。', ko: '가까운 사람은 해결책보다 그저 들어주는 게 더 필요할 수도 있어요.', ja: '身近な人は解決よりも、ただ聞いてほしいのかもしれない。' },
        { vi: 'Đừng để một cảm giác cũ chưa nguôi ảnh hưởng tới người đang ở bên bạn hôm nay.', en: "Don't let an old feeling that hasn't settled color how you treat the person beside you today.", zh: '别让一段还没平复的旧情绪，影响了今天在你身边的人。', ko: '아직 가라앉지 않은 지난 감정이 오늘 곁에 있는 사람에게 영향을 주지 않게 하세요.', ja: 'まだ落ち着いていない過去の感情で、今そばにいる人を扱わないで。' }
      ],
      work: [
        { vi: 'Trực giác về công việc đang khá chuẩn — nếu thấy không ổn thì có thể là nó thật sự không ổn.', en: "Your gut about work is fairly accurate right now — if something feels off, it probably is.", zh: '你对工作的直觉现在相当准——如果感觉不对，多半就是不对。', ko: '지금 일에 대한 직감이 꽤 정확해요 — 뭔가 이상하다고 느껴지면 실제로 그럴 거예요.', ja: '今、仕事に関する直感はかなり正確。何かおかしいと感じたら、実際そうかもしれない。' },
        { vi: 'Một đồng nghiệp cần được thấu hiểu hơn là bị đánh giá — thử đổi chỗ đứng một chút.', en: 'A colleague needs to be understood more than judged — try standing in their place for a moment.', zh: '一位同事更需要被理解，而不是被评判——试着站在他的角度想想。', ko: '동료는 평가받기보다 이해받고 싶어할 거예요 — 잠깐 그 입장이 되어보세요.', ja: '同僚は評価よりも理解を必要としている。少しその立場になってみて。' },
        { vi: 'Nếu công việc đang khiến bạn cạn cảm xúc, nghỉ một buổi cũng là làm việc, không phải trốn tránh.', en: "If work is draining you emotionally, taking an afternoon off is still working — not running away.", zh: '如果工作让你情绪枯竭，休息一个下午也是一种\"工作\"，不是逃避。', ko: '일이 감정을 소진시킨다면, 반나절 쉬는 것도 일의 일부예요, 도망이 아니에요.', ja: '仕事で感情がすり減っているなら、半日休むこともまた仕事の一部。逃げではない。' }
      ]
    },
    air: {
      love: [
        { vi: 'Một cuộc nói chuyện thẳng thắn sẽ gỡ được nút thắt hơn là im lặng chờ đối phương tự hiểu.', en: 'One honest conversation will untangle more than staying silent and hoping they figure it out.', zh: '一次坦诚的对话，比沉默等对方自己明白更能解开心结。', ko: '솔직한 대화 한 번이 침묵보다 매듭을 훨씬 잘 풀어줄 거예요.', ja: '率直な会話ひとつが、沈黙して相手が気づくのを待つより結び目を解く。' },
        { vi: 'Đừng phân tích cảm xúc quá nhiều tới mức quên mất cảm nhận nó.', en: "Don't analyze the feeling so much that you forget to actually feel it.", zh: '别把感情分析得太多，反而忘了去真正感受它。', ko: '감정을 너무 분석하다가 정작 느끼는 걸 잊지 마세요.', ja: '感情を分析しすぎて、実際に感じることを忘れないで。' },
        { vi: 'Một tin nhắn rõ ràng lúc này có giá trị hơn nhiều tin nhắn mơ hồ.', en: 'One clear message right now is worth more than many vague ones.', zh: '此刻一条清楚的消息，胜过许多含糊的信息。', ko: '지금은 애매한 메시지 여러 개보다 명확한 메시지 하나가 더 가치 있어요.', ja: '今は曖昧なメッセージを何通も送るより、はっきりした一言の方が価値がある。' }
      ],
      work: [
        { vi: 'Viết ra kế hoạch thay vì chỉ nghĩ trong đầu — nó sẽ rõ ràng hơn hẳn khi lên giấy.', en: 'Write the plan down instead of just thinking it — it gets far clearer on paper.', zh: '把计划写下来，而不是只在脑子里想——落到纸上会清楚得多。', ko: '머릿속으로만 생각하지 말고 계획을 적어보세요 — 종이에 옮기면 훨씬 명확해져요.', ja: '頭の中で考えるだけでなく計画を書き出して。紙にすると格段に明確になる。' },
        { vi: 'Một cuộc họp ngắn, thẳng vào vấn đề sẽ hiệu quả hơn nhiều email dài dòng.', en: 'One short, to-the-point meeting will do more than many long emails.', zh: '一次简短直接的会议，胜过很多冗长的邮件。', ko: '짧고 핵심만 담은 회의 한 번이 긴 이메일 여러 통보다 나아요.', ja: '短くて要点を突いた会議ひとつが、長いメールを何通も送るより効果的。' },
        { vi: 'Thông tin bạn cần có thể đang nằm ngay trong một cuộc trò chuyện bạn đã lỡ bỏ qua.', en: 'The information you need may already be sitting in a conversation you overlooked.', zh: '你需要的信息，也许就藏在一次被你忽略的对话里。', ko: '필요한 정보는 이미 놓쳤던 대화 속에 있을 수도 있어요.', ja: '必要な情報は、見過ごしていた会話の中にすでにあるかもしれない。' }
      ]
    },
    earth: {
      love: [
        { vi: 'Tình cảm ở đây không cần lãng mạn ồn ào, chỉ cần đều đặn và có mặt thật sự.', en: "Love here doesn't need grand romance — just steady presence, showing up again and again.", zh: '这里的感情不需要轰轰烈烈，只需要稳定与真实的陪伴。', ko: '여기서의 사랑은 요란한 로맨스가 아니라, 꾸준히 곁에 있어주는 것으로 충분해요.', ja: 'ここでの愛に大げさなロマンスは要らない。ただ着実に、本当にそばにいること。' },
        { vi: 'Một cử chỉ nhỏ, cụ thể (nấu một bữa, đón một chuyến) nói được nhiều hơn lời hứa suông.', en: 'One small, concrete gesture — cooking a meal, picking someone up — says more than a promise.', zh: '一个具体的小举动（做一顿饭、接一次送）比空口承诺说得更多。', ko: '한 끼 요리해주기, 데리러 가기 같은 작은 실천이 빈말보다 더 많은 걸 말해줘요.', ja: '一食作る、迎えに行く。そんな小さな具体的な行動が、口約束より雄弁。' },
        { vi: 'Nếu mối quan hệ đang chững lại, đừng vội kết luận — có khi nó chỉ đang xây móng.', en: "If the relationship feels stuck, don't rush to conclude — it may just be laying groundwork.", zh: '如果关系感觉停滞，别急着下结论——也许它只是在打基础。', ko: '관계가 정체된 것 같아도 성급히 결론짓지 마세요 — 그저 기초를 다지는 중일 수 있어요.', ja: '関係が止まっているように感じても急いで結論を出さないで。ただ土台を築いている最中かもしれない。' }
      ],
      work: [
        { vi: 'Đây là lúc hợp để làm những việc chân tay, cụ thể — dọn bàn, sắp lại kế hoạch, trả nợ giấy tờ.', en: 'This favors hands-on, concrete tasks — clear your desk, reorganize the plan, catch up on paperwork.', zh: '这适合做具体的实事——整理桌面、重排计划、补办文件。', ko: '지금은 손으로 하는 구체적인 일이 잘 맞아요 — 책상 정리, 계획 재정비, 밀린 서류 처리.', ja: '手を動かす具体的な作業に向いている。机の整理、計画の立て直し、書類の未処理分を片付けよう。' },
        { vi: 'Tiền bạc cần được nhìn thẳng vào con số hôm nay, chứ không phải né tránh thêm nữa.', en: 'Money needs a real look at the actual numbers today, not more avoidance.', zh: '财务需要今天正视真实数字，而不是继续回避。', ko: '돈 문제는 오늘 실제 숫자를 직시해야 해요, 더 이상 피하지 말고요.', ja: 'お金のことは今日、実際の数字と向き合うべき時。これ以上避けないで。' },
        { vi: 'Kết quả sẽ đến chậm nhưng chắc — đừng bỏ cuộc chỉ vì tuần này chưa thấy gì.', en: "Results will come slowly but surely — don't quit just because this week shows nothing yet.", zh: '结果会来得慢但很扎实——别因为这周还没看到成效就放弃。', ko: '결과는 느리지만 확실히 올 거예요 — 이번 주에 아직 안 보인다고 포기하지 마세요.', ja: '結果はゆっくりだが確実に来る。今週まだ見えないからと諦めないで。' }
      ]
    },
    major: {
      love: [
        { vi: 'Đây không chỉ là một chuyện tình cảm nhỏ, mà chạm vào cách bạn hiểu về chính mình trong một mối quan hệ.', en: "This isn't just a small romantic matter — it touches how you understand yourself within a relationship.", zh: '这不只是一件小小的感情事，它触及你在关系中如何理解自己。', ko: '단순한 연애 문제가 아니라, 관계 속에서 자신을 이해하는 방식과 맞닿아 있어요.', ja: 'これは単なる小さな恋の出来事ではなく、関係の中で自分をどう理解するかに触れている。' },
        { vi: 'Một bài học lớn về tình cảm đang được trao cho bạn — nó không dễ chịu ngay lúc này, nhưng sẽ đáng.', en: "A bigger lesson about love is being handed to you — uncomfortable right now, but worth it.", zh: '一堂关于爱的大功课正在交到你手上——此刻不轻松，但值得。', ko: '사랑에 대한 큰 교훈이 지금 당신에게 주어지고 있어요 — 지금은 편치 않지만 그만한 가치가 있어요.', ja: '愛についての大きな教訓が今、あなたに手渡されている。今は心地よくないが、それだけの価値がある。' }
      ],
      work: [
        { vi: 'Sự nghiệp của bạn đang ở một khúc quanh lớn hơn là chỉ một quyết định trong tuần.', en: 'Your career is at a bigger turning point than just one decision this week.', zh: '你的事业正处在一个比这周某个决定更大的转折点上。', ko: '당신의 커리어는 이번 주의 한 결정보다 더 큰 전환점에 있어요.', ja: 'あなたのキャリアは、今週のひとつの決断よりも大きな転換点にある。' },
        { vi: 'Cách bạn xử lý việc này sẽ đặt nền cho cách bạn làm việc trong một thời gian dài sau đó.', en: 'How you handle this will set the pattern for how you work for a long time after.', zh: '你处理这件事的方式，将为你之后很长一段时间的工作方式定下基调。', ko: '이 일을 다루는 방식이 앞으로 오랫동안 당신의 일하는 패턴을 결정할 거예요.', ja: 'これをどう扱うかが、その後長い間のあなたの働き方を決めることになる。' }
      ]
    }
  };

  const ADVICE = {
    up: [
      { vi: 'Việc cần làm hôm nay: chọn đúng một hành động nhỏ khớp với từ khoá "{keys}", rồi làm cho xong trước khi nghĩ tiếp việc khác.', en: 'What to do today: pick exactly one small action that fits "{keys}", and finish it before moving to the next thing.', zh: '今天要做的事：选一个符合"{keys}"的小行动，先把它做完，再想别的。', ko: '오늘 할 일: "{keys}"에 맞는 작은 행동 하나를 골라 다른 일을 생각하기 전에 끝내보세요.', ja: '今日やること：「{keys}」に合う小さな行動をひとつ選び、他のことを考える前にやり遂げよう。' },
      { vi: 'Không cần làm gì to tát — chỉ cần một bước nhỏ đúng hướng "{keys}" là đủ để bài này bắt đầu ứng nghiệm.', en: 'No grand gesture needed — one small step in the direction of "{keys}" is enough to set this in motion.', zh: '不需要做什么大事——朝"{keys}"方向迈出一小步，就足以让这张牌开始应验。', ko: '거창할 필요 없어요 — "{keys}" 방향으로 작은 한 걸음만 내디뎌도 이 카드는 움직이기 시작해요.', ja: '大それたことは要らない。「{keys}」の方向へ小さく一歩踏み出すだけで、このカードは動き始める。' }
    ],
    rev: [
      { vi: 'Việc cần làm hôm nay: dừng lại một nhịp trước khi phản ứng, và hỏi mình có đang lặp lại kiểu "{keys}" theo hướng chưa lành mạnh không.', en: 'What to do today: pause a beat before reacting, and ask whether you\'re repeating "{keys}" in an unhealthy way.', zh: '今天要做的事：反应前先停一拍，问问自己是否在以不健康的方式重复"{keys}"。', ko: '오늘 할 일: 반응하기 전에 한 박자 멈추고, "{keys}"를 건강하지 못한 방식으로 반복하고 있는 건 아닌지 물어보세요.', ja: '今日やること：反応する前にひと呼吸置き、「{keys}」を不健全な形で繰り返していないか自問しよう。' },
      { vi: 'Đừng cố ép mọi thứ đi nhanh hơn — lá ngược đang xin bạn chậm lại và nhìn kỹ phần "{keys}" đang bị lệch ở đâu.', en: "Don't force things to move faster — this reversal is asking you to slow down and see where \"{keys}\" has gone off balance.", zh: '别强迫事情加快——逆位牌是在请你放慢脚步，看清"{keys}"到底在哪里失衡了。', ko: '억지로 서두르지 마세요 — 역방향 카드는 속도를 늦추고 "{keys}"가 어디서 어긋났는지 살펴보라고 말하고 있어요.', ja: '無理に急がせないで。逆位置のカードは、立ち止まって「{keys}」がどこでバランスを崩したかを見つめるよう求めている。' }
    ]
  };

  /* Câu hỏi tự vấn khép lại — kéo dài phần đọc thêm một tầng suy ngẫm,
     khác nội dung "lời khuyên" ở trên vì đây là câu hỏi mở, không phải
     hành động cụ thể. */
  const JOURNAL = {
    up: [
      { vi: 'Nếu lá này đúng, thì việc đầu tiên bạn sẽ làm khác đi trong 24 giờ tới là gì?', en: 'If this card is right, what is the first thing you would do differently in the next 24 hours?', zh: '如果这张牌说的没错，接下来24小时你会先做出什么不同的事？', ko: '이 카드가 맞다면, 앞으로 24시간 안에 가장 먼저 다르게 해볼 일은 무엇일까요?', ja: 'このカードが正しいなら、これから24時間で最初に変えてみることは何だろう？' },
      { vi: 'Điều gì đang chờ bạn cho phép nó xảy ra, chứ không phải chờ bạn tạo ra nó?', en: "What is waiting for your permission to happen, rather than waiting for you to make it happen?", zh: '有什么事其实只是在等你允许它发生，而不是等你去创造它？', ko: '무언가가 당신이 만들어내길 기다리는 게 아니라, 그저 당신의 허락을 기다리고 있는 건 아닐까요?', ja: '何かが、あなたが起こすのを待っているのではなく、あなたの許可を待っているだけなのでは？' }
    ],
    rev: [
      { vi: 'Bạn đang cố kiểm soát điều gì mà thật ra chỉ cần buông nhẹ tay một chút?', en: "What are you trying to control that actually just needs you to loosen your grip a little?", zh: '你在努力控制的那件事，是不是其实只需要你稍微放手一点？', ko: '당신이 통제하려고 애쓰는 그 일, 사실은 조금만 힘을 빼면 되는 건 아닐까요?', ja: 'コントロールしようとしているそのこと、実は少し力を抜くだけでいいのでは？' },
      { vi: 'Nếu tuần trước bạn đã đủ mệt để cần lá này, thì ai hoặc điều gì đã âm thầm gánh đỡ cho bạn?', en: 'If you were already tired enough last week to need this card, who or what quietly carried you through?', zh: '如果上周你已经累到需要这张牌提醒，那是谁、或什么，一直在默默撑着你？', ko: '지난주에 이미 이 카드가 필요할 만큼 지쳐 있었다면, 누가 혹은 무엇이 조용히 당신을 버텨줬을까요?', ja: '先週すでにこのカードが必要なほど疲れていたなら、誰が、あるいは何が、静かにあなたを支えていたのだろう？' }
    ]
  };

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function elBucket(card) {
    if (!card.suit) return 'major';
    const map = { wands: 'fire', cups: 'water', swords: 'air', pentacles: 'earth' };
    return map[card.suit] || 'major';
  }

  /* Nếu cứ để yên, không làm gì theo lời khuyên ở trên thì sao — thêm
     một lớp chiều sâu nữa cho bảng chi tiết, tách hẳn khỏi phần "lời
     khuyên" vì đây là hệ quả nếu KHÔNG hành động, không phải việc nên làm. */
  const IFNOTHING = {
    fire: [
      { vi: 'Cơ hội này không đợi mãi — chần chừ thêm vài ngày, người khác sẽ là người bước lên trước.', en: "This chance won't wait forever — hesitate a few more days and someone else will step up first.", zh: '这个机会不会一直等你——再犹豫几天，别人就会先站出来。', ko: '이 기회는 영원히 기다려주지 않아요 — 며칠 더 망설이면 다른 사람이 먼저 나설 거예요.', ja: 'このチャンスはいつまでも待ってくれない。あと数日ためらえば、誰かが先に動き出す。' },
      { vi: 'Không phải gì to tát sẽ xảy ra ngay, nhưng ngọn lửa nhỏ này sẽ nguội dần nếu không ai thổi vào.', en: "Nothing dramatic happens right away, but this small flame will slowly cool if no one tends it.", zh: '不会马上发生什么大事，但这团小火苗如果没人添柴，会慢慢熄灭。', ko: '당장 큰일이 일어나지는 않겠지만, 아무도 지피지 않으면 이 작은 불씨는 서서히 식어갈 거예요.', ja: 'すぐに大きなことが起きるわけではないが、誰も吹き込まなければこの小さな炎は少しずつ冷めていく。' }
    ],
    water: [
      { vi: 'Cảm xúc không nói ra không biến mất, nó chỉ lặn xuống sâu hơn và khó gỡ hơn về sau.', en: "A feeling left unspoken doesn't disappear — it just sinks deeper and gets harder to untangle later.", zh: '没说出口的情绪不会消失，只会沉得更深，以后更难解开。', ko: '말하지 않은 감정은 사라지지 않아요, 더 깊이 가라앉아 나중에 풀기 더 어려워질 뿐이에요.', ja: '口にしなかった感情は消えるのではなく、より深く沈んでいき、後でほどくのが難しくなる。' },
      { vi: 'Người kia có thể sẽ ngừng chờ bạn mở lời trước, không phải vì họ hết yêu mà vì họ cũng mệt.', en: 'The other person may stop waiting for you to speak first — not because they stopped caring, but because they got tired too.', zh: '对方也许会不再等你先开口，不是因为不在乎了，而是因为也累了。', ko: '상대는 당신이 먼저 말하길 기다리는 걸 멈출 수도 있어요, 마음이 식어서가 아니라 그들도 지쳤기 때문이에요.', ja: '相手はあなたが先に話すのを待つのをやめるかもしれない。愛情が冷めたからではなく、相手も疲れたから。' }
    ],
    air: [
      { vi: 'Sự im lặng bạn chọn hôm nay sẽ được người khác tự diễn giải theo cách bất lợi nhất cho bạn.', en: "The silence you choose today will get interpreted by others in the worst possible way.", zh: '你今天选择的沉默，会被别人往最不利于你的方向去解读。', ko: '오늘 선택한 침묵은 결국 다른 사람들이 당신에게 가장 불리한 쪽으로 해석하게 될 거예요.', ja: '今日選ぶ沈黙は、他人によって最もあなたに不利な形で解釈されてしまう。' },
      { vi: 'Kế hoạch chỉ nằm trong đầu sẽ mờ dần theo thời gian — không viết ra thì coi như chưa từng có.', en: "A plan that only lives in your head fades over time — unwritten, it's as if it never existed.", zh: '只存在脑子里的计划会随时间淡去——不写下来，就等于从未存在过。', ko: '머릿속에만 있는 계획은 시간이 지나면 흐려져요 — 적어두지 않으면 없었던 것과 같아요.', ja: '頭の中だけにある計画は時間とともに薄れていく。書き留めなければ、なかったも同然。' }
    ],
    earth: [
      { vi: 'Vấn đề tiền bạc không được nhìn thẳng hôm nay sẽ lớn hơn một chút vào cuối tháng, không tự nhỏ đi.', en: "A money issue left unchecked today grows a little bigger by month's end — it never shrinks on its own.", zh: '今天不正视的财务问题，到月底只会变大一点，不会自己缩小。', ko: '오늘 직시하지 않은 돈 문제는 월말에 조금 더 커져 있을 거예요, 저절로 줄어들지 않아요.', ja: '今日向き合わないお金の問題は、月末には少し大きくなっている。自然に小さくなることはない。' },
      { vi: 'Cơ thể bạn đang ghi sổ nợ những lần bạn lờ đi tín hiệu mệt — sớm muộn nó cũng đòi trả.', en: "Your body is keeping a tab on every time you ignore its tired signals — sooner or later it collects.", zh: '身体正记着每一次你忽视疲惫信号的账，迟早会来讨债。', ko: '몸은 지친 신호를 무시할 때마다 빚으로 기록해두고 있어요 — 언젠가는 갚아야 해요.', ja: '体は疲労のサインを無視するたびに借りを記録している。遅かれ早かれ、それは請求される。' }
    ],
    major: [
      { vi: 'Đây không phải bài học sẽ biến mất nếu bạn né nó lần này — nó sẽ quay lại dưới một hình dạng khác, thường là khó chịu hơn.', en: "This isn't a lesson that disappears if you dodge it this time — it comes back in another shape, usually a harder one.", zh: '这不是躲过这次就会消失的功课——它会以另一种形式回来，通常更难缠。', ko: '이번에 피한다고 사라지는 교훈이 아니에요 — 다른 모습으로 다시 찾아올 거예요, 보통 더 까다로운 형태로요.', ja: 'これは今回避ければ消える教訓ではない。別の形で戻ってくる、たいてい今より厄介な形で。' },
      { vi: 'Chương này của cuộc đời bạn vẫn sẽ khép lại, có mặt bạn tham gia hay không — nhưng tham gia thì đỡ tiếc hơn.', en: 'This chapter of your life will close either way — but you\'ll regret it less if you actually took part in it.', zh: '人生的这一章无论如何都会翻页——但如果你亲自参与了，会少一些遗憾。', ko: '당신 인생의 이 장은 어차피 닫히게 되어 있어요 — 하지만 직접 참여했다면 후회가 덜할 거예요.', ja: 'あなたの人生のこの章はどのみち閉じる。だが、自分から関わった方が後悔は少ない。' }
    ]
  };

  /* ---------- Thông tin sinh (không bắt buộc) — gắn cung mệnh vào lời luận ---------- */
  function readProfile() {
    const nameEl = $('profileName'), dobEl = $('profileDob');
    if (!nameEl || !dobEl || !dobEl.value) return null;
    const [, m, d] = dobEl.value.split('-').map(Number);
    if (!window.Lore) return null;
    const z = window.Lore.signOf(m, d);
    const LI = window.LoreI18N;
    const nm = LI && LI.zodiac[z.id] && LI.zodiac[z.id].name;
    const signName = (nm && nm[lang()]) || z.vi;
    return { name: nameEl.value.trim(), sign: z, signName, el: z.el };
  }

  /* ==========================================================
     Điều hướng giữa các bước
     ========================================================== */
  const ORDER = ['topic', 'spread', 'deck', 'read'];

  function go(name) {
    document.querySelectorAll('.stage').forEach(s => s.classList.remove('on'));
    $('stage-' + name).classList.add('on');
    paintSteps(name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function paintSteps(name) {
    const i = ORDER.indexOf(name);
    document.querySelectorAll('.step').forEach((el, k) => {
      el.classList.toggle('on', k === i);
      el.classList.toggle('done', k < i);
    });
  }

  /* ==========================================================
     Bước 1 — chủ đề
     ========================================================== */
  function buildTopics() {
    $('topicGrid').innerHTML = S.TOPICS.map(t => `
      <button class="tool" data-tilt="8" data-topic="${t.id}">
        <span class="glyph">${t.glyph}</span>
        <h3>${t.name}</h3>
        <p>${t.hint}</p>
      </button>`).join('');

    $('topicGrid').querySelectorAll('[data-topic]').forEach(b => {
      b.onclick = () => {
        st.topic = b.dataset.topic;
        const t = S.topic(st.topic);
        $('spreadTopic').textContent = t.name.toLowerCase();
        buildSpreads();
        go('spread');
      };
    });
    if (window.Scene) window.Scene.autoTilt($('topicGrid'));
  }

  /* ==========================================================
     Bước 2 — kiểu trải bài
     ========================================================== */
  function buildSpreads() {
    $('spreadList').innerHTML = S.SPREADS.map(sp => `
      <button class="spread${st.spread === sp.id ? ' picked' : ''}" data-spread="${sp.id}">
        <span class="mini">${Array.from({ length: Math.min(sp.count, 6) })
          .map((_, i) => `<i style="height:${14 + (i % 3) * 7}px"></i>`).join('')}</span>
        <h3>${sp.name}</h3>
        <p>${sp.desc}</p>
        <span class="n">${sp.count} lá</span>
      </button>`).join('');

    $('spreadList').querySelectorAll('[data-spread]').forEach(b => {
      b.onclick = () => { st.spread = b.dataset.spread; buildSpreads(); };
    });
  }

  /* ==========================================================
     Bước 3 — nan quạt bài 3D
     ========================================================== */
  const FAN_N = 24;

  function buildFan() {
    const sp = S.spread(st.spread);
    st.pool = Sh.shuffle(D.all.slice());
    st.drawn = [];

    const fan = $('fan');
    fan.innerHTML = '';

    // Máy yếu (hoặc đã tắt hiệu ứng ở nút ✨) thì bỏ animation bay-vào,
    // bày thẳng lá lên nan quạt cho mượt, không giật máy.
    const fx = !(window.NodyPerf && window.NodyPerf.low);
    const vw = window.innerWidth, vh = window.innerHeight;

    for (let i = 0; i < FAN_N; i++) {
      const c = document.createElement('div');
      c.className = 'fan-card';
      const t = i - (FAN_N - 1) / 2;
      const ang = t * 3.6;
      const lift = Math.abs(t) * 2.6;
      const depth = -Math.abs(t) * 9;
      c.dataset.base = `rotateZ(${ang}deg) translateY(${lift}px) translateZ(${depth}px)`;
      c.style.zIndex = 40 - Math.abs(Math.round(t));
      c.innerHTML = `<div class="card-back">${Sh.sigil(i * 7 + 13, 'var(--moon)')}</div>`;

      if (fx) {
        // Xuất phát từ một cạnh ngẫu nhiên quanh màn hình rồi tụ vào giữa —
        // mỗi lá một góc, một độ trễ khác nhau cho cảm giác "bay tới, tụ lại".
        const edge = Math.floor(Math.random() * 4);
        const fromX = edge === 0 ? -vw * .6 : edge === 1 ? vw * .6 : (Math.random() * vw - vw / 2) * .7;
        const fromY = edge === 2 ? -vh * .5 : edge === 3 ? vh * .5 : (Math.random() * vh - vh / 2) * .5;
        const fromRot = (Math.random() * 140 - 70).toFixed(1);
        c.style.transition = 'none';
        c.style.opacity = '0';
        c.style.willChange = 'transform, opacity';
        c.style.transform = `translate(${fromX.toFixed(0)}px, ${fromY.toFixed(0)}px) rotateZ(${fromRot}deg) rotateY(70deg) scale(.5)`;
        fan.appendChild(c);
        const delay = (i / FAN_N) * .5 + Math.random() * .12;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          c.style.transition = `transform .85s cubic-bezier(.16,.9,.28,1) ${delay.toFixed(2)}s, opacity .5s ease ${delay.toFixed(2)}s`;
          c.style.opacity = '1';
          c.style.transform = c.dataset.base;
          setTimeout(() => { c.style.transition = ''; c.style.willChange = ''; }, (delay + .9) * 1000);
        }));
      } else {
        c.style.transform = c.dataset.base;
        fan.appendChild(c);
      }

      c.onmouseenter = () => {
        if (c.classList.contains('taken')) return;
        c.style.transform = c.dataset.base + ' translateY(-22px) translateZ(46px)';
      };
      c.onmouseleave = () => {
        if (c.classList.contains('taken')) return;
        c.style.transform = c.dataset.base;
      };
      c.onclick = () => takeCard(c, sp);
    }
    paintProgress(sp);
  }

  function paintProgress(sp) {
    $('drawCount').textContent = T('tarot.drawCount', { n: st.drawn.length, total: sp.count });
    $('drawHint').textContent = st.drawn.length === 0
      ? T('tarot.drawHint.start')
      : (st.drawn.length >= sp.count ? T('tarot.drawHint.done') : T('tarot.drawHint.more'));
  }

  function takeCard(el, sp) {
    if (el.classList.contains('taken') || st.drawn.length >= sp.count) return;
    const card = st.pool[st.drawn.length];
    const reversed = Math.random() < 0.32;
    const bucket = elBucket(card);
    st.drawn.push({
      card, reversed,
      loveAngle: pick(ANGLE[bucket].love),
      workAngle: pick(ANGLE[bucket].work),
      adviceAngle: pick(ADVICE[reversed ? 'rev' : 'up']),
      journalAngle: pick(JOURNAL[reversed ? 'rev' : 'up']),
      ifNothingAngle: pick(IFNOTHING[bucket])
    });

    const fx = !(window.NodyPerf && window.NodyPerf.low);
    el.classList.add('drawing');

    if (fx) {
      // Rút xong: lá lật nhẹ một vòng rồi bay lên và mờ dần, như đang rời
      // quạt bài để "đi vào tay bạn" — chứ không biến mất khô khốc tại chỗ.
      el.style.transition = 'transform .55s cubic-bezier(.2,.85,.25,1), opacity .5s ease .28s';
      el.style.transform = el.dataset.base + ' translateY(-150px) translateZ(160px) rotateY(360deg) scale(.72)';
      el.style.opacity = '0';
    } else {
      el.style.transform = el.dataset.base + ' translateY(-90px) translateZ(60px)';
      el.style.opacity = '0';
    }
    setTimeout(() => { el.classList.add('taken'); }, fx ? 560 : 260);

    paintProgress(sp);

    if (st.drawn.length >= sp.count) setTimeout(() => buildTable(sp), fx ? 780 : 380);
  }

  function shuffleFan() {
    const cards = $('fan').querySelectorAll('.fan-card:not(.taken)');
    cards.forEach(c => {
      c.style.transition = 'transform .2s ease';
      c.style.transform = c.dataset.base +
        ` translateX(${(Math.random() * 34 - 17).toFixed(1)}px) rotateZ(${(Math.random() * 18 - 9).toFixed(1)}deg)`;
    });
    setTimeout(() => {
      cards.forEach(c => {
        c.style.transition = 'transform .55s var(--ease)';
        c.style.transform = c.dataset.base;
      });
    }, 230);
    st.pool = Sh.shuffle(st.pool);
    Sh.toast(T('tarot.shuffled'));
  }

  /* ==========================================================
     Bước 4 — bàn trải 3D
     ========================================================== */
  function buildTable(sp) {
    $('readTitle').textContent = sp.name;
    $('readQuestion').textContent = st.question ? '“' + st.question + '”' : '';
    $('readQuestion').style.display = st.question ? '' : 'none';

    const table = $('table');
    table.style.height = (window.innerWidth < 720 ? sp.height * 0.86 : sp.height) + 'px';
    table.innerHTML = '';

    sp.slots.forEach((slot, i) => {
      const d = st.drawn[i];
      const box = document.createElement('div');
      box.className = 'slot' + (slot.cross ? ' crossed' : '');
      box.style.left = slot.x + '%';
      box.style.top = slot.y + '%';
      box.style.zIndex = slot.cross ? 5 : 2;
      box.style.animationDelay = (i * 0.09).toFixed(2) + 's';

      box.innerHTML = `
        <div class="pos-label">${slot.label}</div>
        <div class="flip">
          <div class="face rear">${Sh.sigil(i * 11 + 5, 'var(--moon)')}</div>
          <div class="face front">
            ${D.imgTag(d.card, d.reversed ? 'upside' : '')}
            <div class="card-strip">
              <div class="nm">${d.card.vi}</div>
              <div class="or${d.reversed ? ' rev' : ''}">${d.reversed ? T('read.reversedShort') : T('read.uprightShort')}</div>
            </div>
          </div>
        </div>`;

      const flip = box.querySelector('.flip');
      flip.onclick = () => {
        if (!flip.classList.contains('turned')) flip.classList.add('turned');
        else showDetail(d, slot.label);
      };
      table.appendChild(box);
    });

    $('btnSynth').classList.remove('hidden');
    $('synth').classList.add('hidden');
    go('read');
  }

  /* ==========================================================
     Bảng chi tiết một lá
     ========================================================== */
  function showDetail(d, label) {
    const voice = S.TOPIC_VOICE[st.topic] || S.TOPIC_VOICE.open;
    const topicName = S.topic(st.topic).name;
    Sh.store.set('lastCard', { name: d.card.vi, img: d.card.img, reversed: !!d.reversed });

    const lg = lang();
    const love = (d.loveAngle && (d.loveAngle[lg] || d.loveAngle.vi)) || '';
    const work = (d.workAngle && (d.workAngle[lg] || d.workAngle.vi)) || '';
    const advice = ((d.adviceAngle && (d.adviceAngle[lg] || d.adviceAngle.vi)) || '').replace('{keys}', d.card.keys);
    const journal = (d.journalAngle && (d.journalAngle[lg] || d.journalAngle.vi)) || '';
    const ifNothing = (d.ifNothingAngle && (d.ifNothingAngle[lg] || d.ifNothingAngle.vi)) || '';
    const profile = st.profile;
    const profileNote = profile
      ? `<p class="tiny mute" style="margin-top:10px">${T('read.profileTie', { sign: profile.signName, el: T('horo.el.' + profile.el) })}</p>`
      : '';

    $('detailBody').innerHTML = `
      <div class="detail-top">
        <div class="detail-img">${D.imgTag(d.card, d.reversed ? 'upside' : '')}</div>
        <div>
          <div class="detail-pos">${label}</div>
          <h3>${d.card.vi}</h3>
          <div class="tiny mute">${d.card.name}</div>
          <div class="detail-or${d.reversed ? ' rev' : ''}">${d.reversed ? T('read.reversed') : T('read.upright')}</div>
        </div>
      </div>
      <div class="chips"><span class="chip">${d.card.keys}</span></div>
      <div class="detail-body">
        <p>${d.reversed ? d.card.rev : d.card.up}</p>
        <h4>${T('read.forTopic', { topic: topicName.toLowerCase() })}</h4>
        <p>${d.reversed ? voice.rev : voice.up}</p>
        <h4>${T('read.inLove')}</h4>
        <p>${love}</p>
        <h4>${T('read.inWork')}</h4>
        <p>${work}</p>
        <h4>${T('read.todayAdvice')}</h4>
        <p>${advice}</p>
        <h4>${T('read.ifNothing')}</h4>
        <p>${ifNothing}</p>
        <h4>${T('read.journalQ')}</h4>
        <p class="poem">${journal}</p>
        ${profileNote}
      </div>`;
    $('detailModal').classList.add('open');
  }

  /* ==========================================================
     Luận giải tổng — dệt các lá lại thành một mạch
     ========================================================== */
  function synthesise() {
    const sp = S.spread(st.spread);
    const topicName = S.topic(st.topic).name;
    const cards = st.drawn;

    const revs = cards.filter(c => c.reversed).length;
    const majors = cards.filter(c => c.card.type === 'major').length;

    // chất nào trội
    const tally = {};
    cards.forEach(c => { if (c.card.suit) tally[c.card.suit] = (tally[c.card.suit] || 0) + 1; });
    let top = null, topN = 0;
    Object.keys(tally).forEach(k => { if (tally[k] > topN) { topN = tally[k]; top = k; } });
    const suitInfo = D.suits.find(s => s.key === top);

    const chips = [];
    chips.push(`<span class="chip">${topicName}</span>`);
    chips.push(`<span class="chip alt">${sp.name}</span>`);
    if (st.profile) chips.push(`<span class="chip">${st.profile.signName} · ${T('horo.el.' + st.profile.el)}</span>`);
    if (suitInfo && topN > 1) chips.push(`<span class="chip">Nhiều lá ${suitInfo.vi} · hành ${suitInfo.el}</span>`);
    if (majors) chips.push(`<span class="chip">${majors} lá Ẩn Chính</span>`);
    chips.push(`<span class="chip alt">${revs} lá ngược</span>`);

    // mạch năng lượng
    let flow;
    if (majors >= Math.ceil(cards.length / 2)) {
      flow = T('synth.flow.manyMajor');
    } else if (majors === 0) {
      flow = T('synth.flow.noMajor');
    } else {
      flow = T('synth.flow.mixed');
    }

    if (suitInfo && topN > 1) {
      flow += ' ' + T('synth.flow.suitRepeat', { suit: suitInfo.vi, n: topN, domain: suitInfo.domain });
    }
    if (st.profile) {
      flow += ` ${T('read.profileTieLong', { sign: st.profile.signName, el: T('horo.el.' + st.profile.el).toLowerCase() })}`;
    }

    // độ nghiêng xuôi/ngược
    let tone;
    const ratio = revs / cards.length;
    if (ratio === 0) {
      tone = T('synth.tone.none');
    } else if (ratio < 0.4) {
      tone = T('synth.tone.some');
    } else if (ratio < 0.8) {
      tone = T('synth.tone.many');
    } else {
      tone = T('synth.tone.most');
    }

    // mạch theo từng vị trí
    const chain = cards.map((c, i) => {
      const label = sp.slots[i].label;
      const gist = (c.reversed ? c.card.rev : c.card.up).split('.')[0];
      return `<li><b style="color:var(--moon)">${label}</b> — ${c.card.vi}: ${gist}.</li>`;
    }).join('');

    // một lời dặn khép lại
    const closings = [
      T('synth.closing.0'), T('synth.closing.1'), T('synth.closing.2'), T('synth.closing.3')
    ];
    const closing = closings[Math.floor(Math.random() * closings.length)];

    $('synthBody').innerHTML = `
      <div class="chips">${chips.join('')}</div>
      <p>${flow}</p>
      <h4>${T('synth.leaning')}</h4>
      <p>${tone}</p>
      <h4>${T('synth.readChain')}</h4>
      <ul class="soft" style="padding-left:20px;line-height:1.85">${chain}</ul>
      ${st.question ? `<h4>${T('synth.aboutQuestion')}</h4><p>${T('synth.youAsked', { q: escapeHTML(st.question) })} ${T('synth.closestAnswer', { card: cards[0].card.vi })} — ${(cards[0].reversed ? cards[0].card.rev : cards[0].card.up)}</p>` : ''}
      <blockquote>${closing}</blockquote>`;

    $('synth').classList.remove('hidden');
    $('btnSynth').classList.add('hidden');
    document.querySelectorAll('.flip').forEach(f => f.classList.add('turned'));
    $('synth').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // lưu vào Firestore, giữ đúng các trường cũ để dữ liệu trước đây vẫn hợp lệ
    Sh.log({
      kind: 'tarot',
      title: sp.name + ' · ' + topicName,
      topic: topicName,
      question: st.question,
      spread: sp.id,
      summary: flow + ' ' + tone,
      drawnCards: cards.map(c => ({ name: c.card.name, vi: c.card.vi, isReversed: c.reversed }))
    }).then(() => {
      if (window.Nody && window.Nody.user) Sh.toast(T('synth.savedToast'));
    });
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  }

  /* ==========================================================
     Khởi động trang
     ========================================================== */
  function reset() {
    st = { topic: 'open', spread: null, question: '', pool: [], drawn: [], profile: null };
    $('questionInput').value = '';
    if ($('profileName')) $('profileName').value = '';
    if ($('profileDob')) $('profileDob').value = '';
    $('synth').classList.add('hidden');
    buildTopics();
    go('topic');
  }

  function init() {
    if (!$('stage-topic')) return;
    buildTopics();
    paintSteps('topic');

    $('btnToDeck').onclick = () => {
      if (!st.spread) { Sh.toast(T('tarot.errPickSpread'), true); return; }
      st.question = $('questionInput').value.trim();
      st.profile = readProfile();
      const sp = S.spread(st.spread);
      $('deckTitle').textContent = T('tarot.shuffleTitle', { n: sp.count });
      buildFan();
      go('deck');
    };

    $('btnBackTopic').onclick = () => go('topic');
    $('btnBackSpread').onclick = () => go('spread');
    $('btnShuffle').onclick = shuffleFan;
    $('btnSynth').onclick = synthesise;

    $('btnRevealAll').onclick = () =>
      document.querySelectorAll('.flip').forEach(f => f.classList.add('turned'));

    $('btnOtherSpread').onclick = () => { buildSpreads(); go('spread'); };
    $('btnAgain').onclick = reset;

    $('detailModal').addEventListener('click', (e) => {
      if (e.target.id === 'detailModal' || e.target.hasAttribute('data-close'))
        $('detailModal').classList.remove('open');
    });

    // đổi giao diện khi đang ở bàn trải thì vẽ lại cho khớp màu
    window.addEventListener('nody:theme', () => {
      if ($('stage-read').classList.contains('on') && st.drawn.length) {
        const turned = Array.from(document.querySelectorAll('.flip')).map(f => f.classList.contains('turned'));
        buildTable(S.spread(st.spread));
        document.querySelectorAll('.flip').forEach((f, i) => { if (turned[i]) f.classList.add('turned'); });
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
