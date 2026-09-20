/* ============================================================
   data/deck-i18n.js — lớp dịch 78 lá bài sang EN / ZH / KO / JA
   ------------------------------------------------------------
   KHÔNG đụng vào deck.js gốc (tiếng Việt giữ nguyên, đầy đủ nhất).
   File này chỉ "phủ" thêm bản dịch, và DeckData.localize(card)
   sẽ chọn đúng bản theo ngôn ngữ đang bật (I18N.get()).

   Cấu trúc:
     DeckI18N.major[number]        → { en:{keys,up,rev}, zh:{...}, ko:{...}, ja:{...} }
     DeckI18N.suits[suitKey]       → { en:{name,el,domain}, zh:{...}, ko:{...}, ja:{...} }
     DeckI18N.ranks[lang][index]   → tên hạng bài (Ace, Two, ... King)
     DeckI18N.minor[suitKey][idx]  → { en:{up,rev}, zh:{...}, ko:{...}, ja:{...} }

   Ghi chú thật thà: bản dịch EN đầy đủ ý; bản ZH/KO/JA được viết
   súc tích hơn bản gốc tiếng Việt để giữ chất lượng đều nhau giữa
   các ngôn ngữ trong lần bàn giao đầu tiên — có thể mở rộng thêm
   sau bằng cách sửa thẳng object bên dưới, không cần đụng code.
   ============================================================ */

window.DeckI18N = (function () {
  'use strict';

  const major = [
    /* 0 Fool */ { en:{keys:'new beginnings · innocence · leap of faith', up:"A fresh start — you don't need the whole map before taking the first step. Naivety here is a strength, not a flaw.", rev:'A step taken too soon before you were steady, or standing at the edge too long out of fear, missing your own trip.'},
      zh:{keys:'新的开始 · 天真 · 放手一试', up:'新的篇章正在展开，你不必先知道全部路线才敢迈步。', rev:'脚步太急却站不稳，或在悬崖边站太久，怕摔而错过旅程。'},
      ko:{keys:'새로운 시작 · 순수함 · 한 걸음의 용기', up:'새 장이 열리고 있어요. 길을 다 알아야 걸을 수 있는 건 아니에요.', rev:'다리가 채 서기도 전에 너무 서두르거나, 무서워서 벼랑 끝에만 머물러 여정을 놓쳐요.'},
      ja:{keys:'新しい始まり · 無邪気さ · 一歩の勇気', up:'新しい章が開こうとしている。すべての道を知らなくても踏み出していい。', rev:'足がまだ整わないのに急ぎすぎる、あるいは怖くて崖の縁に立ち続け旅を逃す。'} },
    /* 1 Magician */ { en:{keys:'willpower · tools · action', up:'Everything you need is already on the table. Choose one thing and follow through, instead of waiting for perfect conditions.', rev:"Your energy is scattered across too many directions, or you're using nice words to hide an intention that isn't fully honest."},
      zh:{keys:'意志 · 工具 · 行动', up:'需要的一切都已在桌上，剩下的是选一件事并做到底。', rev:'力量分散在太多方向，或用漂亮的话掩饰不够真诚的意图。'},
      ko:{keys:'의지 · 도구 · 실행', up:'필요한 모든 것이 이미 앞에 있어요. 남은 건 하나를 골라 끝까지 하는 것.', rev:'힘이 너무 여러 방향으로 흩어졌거나, 좋은 말로 진심 아닌 의도를 가리고 있어요.'},
      ja:{keys:'意志 · 道具 · 行動', up:'必要なものはもうすべて手元にある。あとは一つ選んでやり遂げるだけ。', rev:'力があまりに多方向に散っている、あるいは美しい言葉で本心でない意図を隠している。'} },
    /* 2 High Priestess */ { en:{keys:'intuition · silence · the unspoken', up:'The answer has been inside you since before you asked. Ask others a little less, and sit with yourself a little more.', rev:"You're ignoring your own intuition, or a truth is being kept hidden, making everything feel unclear."},
      zh:{keys:'直觉 · 沉默 · 未言之事', up:'答案早已在你心里，少问别人一点，多听自己一点。', rev:'你在忽视自己的直觉，或有真相被藏着而变得模糊。'},
      ko:{keys:'직관 · 침묵 · 말하지 않은 것', up:'답은 이미 당신 안에 있어요. 묻기보다 조금 더 자신의 말을 들어보세요.', rev:'자신의 직감을 외면하고 있거나, 감춰진 진실이 모든 걸 흐리게 해요.'},
      ja:{keys:'直感 · 沈黙 · 言葉にならないもの', up:'答えはすでにあなたの中にある。人に聞くより自分の声を少し聞いて。', rev:'自分の直感を無視している、あるいは隠された真実が全てをぼやけさせている。'} },
    /* 3 Empress */ { en:{keys:'nurture · abundance · gentleness', up:'What you tend is really growing. This is a season for softness — care for others, for your work, and remember to care for yourself too.', rev:"You've given until you're nearly empty, or your creativity has stalled because you forgot to rest."},
      zh:{keys:'滋养 · 丰盛 · 温柔', up:'你照料的东西正在真实成长，这是柔软的季节：照顾人、照顾事，也记得照顾自己。', rev:'付出到快要枯竭，或创造力停滞是因为忘了休息。'},
      ko:{keys:'양육 · 풍요 · 부드러움', up:'돌보는 것이 정말로 자라고 있어요. 부드러움의 계절이에요, 남도 일도 그리고 자신도 챙기세요.', rev:'바닥이 드러날 만큼 내주었거나, 쉬지 못해 창조성이 멈췄어요.'},
      ja:{keys:'育む · 豊かさ · 優しさ', up:'世話しているものが本当に育っている。柔らかさの季節、人にも仕事にも、そして自分にも心を配って。', rev:'与えすぎて枯れかけている、あるいは休まないから創造力が止まっている。'} },
    /* 4 Emperor */ { en:{keys:'structure · discipline · boundaries', up:"Time to build a frame: a clear schedule, a clear boundary, a clear no. Order is what freedom looks like right now.", rev:"Control has tightened into rigidity, or you're resisting a rule you actually need."},
      zh:{keys:'秩序 · 纪律 · 界限', up:'该立起框架了：清晰的日程、清晰的界限、清晰的拒绝，此刻秩序就是自由。', rev:'控制得太紧让一切僵化，或在抵抗一个其实需要的规则。'},
      ko:{keys:'질서 · 규율 · 경계', up:'틀을 세울 때예요: 분명한 일정, 분명한 경계, 분명한 거절. 지금 질서가 곧 자유예요.', rev:'통제가 너무 굳어졌거나, 사실 필요한 규칙에 저항하고 있어요.'},
      ja:{keys:'秩序 · 規律 · 境界線', up:'枠組みを立てる時。明確な予定、明確な境界、明確な拒否。今は秩序こそが自由。', rev:'締め付けすぎて全てが硬くなっている、あるいは本当は必要な規律に抗っている。'} },
    /* 5 Hierophant */ { en:{keys:'tradition · guidance · learning', up:"There is a path many people have safely walked. Ask someone experienced, or return to a value you once trusted.", rev:"The old framework has grown too tight. You're allowed to do it differently, as long as you understand why."},
      zh:{keys:'传统 · 指引 · 学习', up:'有一条许多人安全走过的路，问问有经验的人，或回到你曾相信的价值。', rev:'旧框架已经太窄，你可以走不同的路，只要清楚为什么。'},
      ko:{keys:'전통 · 안내 · 배움', up:'많은 이들이 안전하게 걸어온 길이 있어요. 경험자에게 묻거나 믿었던 가치로 돌아가세요.', rev:'낡은 틀이 너무 좁아졌어요. 이유를 알고 있다면 다르게 해도 괜찮아요.'},
      ja:{keys:'伝統 · 導き · 学び', up:'多くの人が安全に歩んだ道がある。経験者に尋ねるか、信じていた価値に戻って。', rev:'古い枠組みがもう窮屈。理由がわかっているなら違うやり方をしてもいい。'} },
    /* 6 Lovers */ { en:{keys:'choice · harmony · honesty', up:"Not just about romance — a choice that truly matches your values. Whatever lets you stop performing is the right fit.", rev:"Your heart is torn between two paths, or a relationship is out of step because something is left unsaid."},
      zh:{keys:'选择 · 和谐 · 真诚', up:'不只是爱情，而是一个真正符合你价值观的选择，不必伪装的那个才合适。', rev:'心里正在分裂，或一段关系因有话没说而失衡。'},
      ko:{keys:'선택 · 조화 · 솔직함', up:'사랑만이 아니라 진짜 가치와 맞는 선택이에요. 연기하지 않아도 되는 쪽이 맞는 쪽이에요.', rev:'마음이 둘로 갈라졌거나, 말하지 못한 무언가로 관계가 어긋나고 있어요.'},
      ja:{keys:'選択 · 調和 · 誠実さ', up:'恋愛だけでなく、本当の価値観に合った選択。演じなくていい方が合っている。', rev:'心が二つに割れている、あるいは言えていない何かで関係のリズムがずれている。'} },
    /* 7 Chariot */ { en:{keys:'determination · control · forward motion', up:"You're holding two opposing forces steady in one pair of reins. Keep your eyes on the road ahead, not the lane beside you.", rev:'Moving fast without knowing where, or your energy is split across too many races at once.'},
      zh:{keys:'决心 · 掌控 · 前进', up:'两股相反的力量同时握在你手中，眼睛看前方，别看旁边的车。', rev:'跑得快却不知去哪，或精力被分给太多场竞赛。'},
      ko:{keys:'결단 · 통제 · 전진', up:'서로 반대되는 두 힘을 동시에 붙잡고 있어요. 옆 마차 말고 앞만 보세요.', rev:'어디로 가는지 모른 채 빨리 달리거나, 너무 많은 경주에 힘이 나뉘어요.'},
      ja:{keys:'決意 · 制御 · 前進', up:'相反する二つの力を同時に手綱で握っている。隣の馬車ではなく前だけを見て。', rev:'どこへ向かうか分からず速く走っている、あるいは力が多くの競争に分散している。'} },
    /* 8 Strength */ { en:{keys:'gentleness · patience · taming', up:"Real strength doesn't roar. It's a hand placed on your own fear, saying: I'm here, I won't leave you.", rev:"You're being too hard on yourself, or your patience ran out right before things were about to soften."},
      zh:{keys:'温柔 · 耐心 · 驯服', up:'真正的力量不会咆哮，它是一只放在自己恐惧上的手，说：我在，我不会丢下你。', rev:'对自己太苛刻，或耐心刚好在一切要软化前用完。'},
      ko:{keys:'부드러움 · 인내 · 길들임', up:'진짜 힘은 소리치지 않아요. 자신의 두려움 위에 얹은 손, 곁에 있다는 말이에요.', rev:'스스로에게 너무 가혹하거나, 부드러워지기 직전에 인내가 바닥났어요.'},
      ja:{keys:'優しさ · 忍耐 · 手なずける', up:'本当の強さは吠えない。自分の恐れの上に置いた手、そばにいるという意味。', rev:'自分に厳しすぎる、あるいは物事が和らぐ直前で忍耐が尽きている。'} },
    /* 9 Hermit */ { en:{keys:'stillness · reflection · a single light', up:"Stepping back isn't giving up. Time alone can answer what a hundred conversations couldn't.", rev:"Too much solitude has quietly become hiding, or you feel awkward asking anyone for a hand."},
      zh:{keys:'静默 · 内省 · 一盏灯', up:'后退不是放弃，独处一段时间会回答百次谈话都回答不了的问题。', rev:'独处太久变成躲藏，或不好意思求人搭把手。'},
      ko:{keys:'고요 · 성찰 · 한 줄기 빛', up:'물러서는 건 포기가 아니에요. 혼자만의 시간이 백 번의 대화가 못한 답을 줘요.', rev:'너무 오래 혼자 있어 숨는 게 됐거나, 도움 청하기가 겸연쩍어요.'},
      ja:{keys:'静けさ · 内省 · 一つの灯', up:'退くことは諦めることではない。一人の時間が百の会話でも出ない答えをくれる。', rev:'一人でいすぎて隠れることになっている、あるいは頼むのが気恥ずかしい。'} },
    /* 10 Wheel of Fortune */ { en:{keys:'cycles · timing · change', up:'The wheel is turning to a new rhythm, usually faster than you can prepare for. Hold the axle, not the rim.', rev:"An old cycle is repeating, or you're resisting a change that would actually be good for you."},
      zh:{keys:'循环 · 时机 · 转变', up:'命运之轮正转向新的节奏，通常比你能准备的更快，抓住轴心，别抓轮边。', rev:'旧循环在重演，或在抵抗一个其实对你有益的改变。'},
      ko:{keys:'순환 · 때 · 변화', up:'수레바퀴가 새 박자로 돌아요, 대개 준비보다 빠르게. 바퀴살이 아니라 축을 붙잡으세요.', rev:'옛 순환이 반복되거나, 사실 좋은 변화에 저항하고 있어요.'},
      ja:{keys:'循環 · 時機 · 変化', up:'輪が新しいリズムへ回っている、たいてい備えより速く。輪の縁ではなく軸を掴んで。', rev:'古い循環が繰り返している、あるいは本当は良い変化に抗っている。'} },
    /* 11 Justice */ { en:{keys:'balance · truth · consequence', up:'Things are being weighed at their true value. Telling the truth and owning your part is the shortest way through.', rev:"Something here isn't fair, or you're making excuses instead of facing the part you didn't handle well."},
      zh:{keys:'平衡 · 真相 · 因果', up:'一切正被公平地衡量，说实话并承担自己的责任是最短的路。', rev:'有地方不公平，或你在为自己辩护而不是正视做得不好的部分。'},
      ko:{keys:'균형 · 진실 · 결과', up:'모든 게 정당한 무게로 저울질되고 있어요. 진실을 말하고 몫을 인정하는 게 가장 빠른 길이에요.', rev:'불공평한 부분이 있거나, 잘못한 부분을 보기보다 변명하고 있어요.'},
      ja:{keys:'均衡 · 真実 · 結果', up:'すべてが正しい重さで量られている。真実を言い自分の分を引き受けるのが一番の近道。', rev:'不公平な部分がある、あるいは自分がうまくやれなかった部分を見る代わりに言い訳している。'} },
    /* 12 Hanged Man */ { en:{keys:'pause · new perspective · surrender', up:"It's okay to hang suspended a while. Some things only become clear once you stop pushing and see them upside down.", rev:"You're waiting with no real reason left, or sacrificing something nobody actually asked for."},
      zh:{keys:'暂停 · 换个角度 · 放下', up:'暂时悬着也没关系，有些事只有停止硬推、愿意倒过来看才会清楚。', rev:'等待已没有理由，或牺牲了一件没人要求的事。'},
      ko:{keys:'멈춤 · 새로운 시각 · 내려놓음', up:'잠시 매달려 있어도 괜찮아요. 밀어붙이길 멈추고 거꾸로 볼 때만 보이는 것들이 있어요.', rev:'이유 없이 계속 기다리거나, 아무도 요구하지 않은 걸 희생하고 있어요.'},
      ja:{keys:'停止 · 視点の転換 · 明け渡し', up:'しばらく宙ぶらりんでもいい。押すのをやめて逆さまに見た時だけ見えることがある。', rev:'理由もなく待ち続けている、あるいは誰も求めていないことを犠牲にしている。'} },
    /* 13 Death */ { en:{keys:'ending · transformation · letting go', up:'This card rarely means real loss. It says: one chapter has ended, and closing it is exactly what opens the next.', rev:"You're holding on to something long finished. It won't come back, and you don't need it to be okay."},
      zh:{keys:'结束 · 蜕变 · 放手', up:'这张牌很少真指失去，它说：一个篇章结束了，正是合上它才能翻开下一页。', rev:'抓着早已结束的东西不放，它不会回来，你也不需要它才能安好。'},
      ko:{keys:'끝맺음 · 변화 · 놓아줌', up:'이 카드는 진짜 상실을 말하는 게 드물어요. 한 장이 끝났고, 닫아야 다음 장이 열려요.', rev:'오래전에 끝난 것을 붙잡고 있어요. 돌아오지 않고, 없어도 당신은 괜찮아요.'},
      ja:{keys:'終わり · 変容 · 手放す', up:'このカードが本当の喪失を指すことは少ない。ある章が終わり、閉じることで次が開く。', rev:'とうに終わったものを手放せずにいる。それは戻らないし、なくても大丈夫。'} },
    /* 14 Temperance */ { en:{keys:'blending · healing · moderation', up:"Nothing pulled too far to one side. A steady rhythm and the right dose take you further than any burst of speed.", rev:"You're overdoing it on one end — working too hard, overthinking, or rushing a wound that needs time."},
      zh:{keys:'调和 · 疗愈 · 适度', up:'不偏向任何一端，稳定的节奏和恰当的分量会带你走得更远。', rev:'在某一端过度了：太拼、想太多，或对需要时间的伤太急躁。'},
      ko:{keys:'조화 · 치유 · 절제', up:'어느 쪽으로도 치우치지 않게. 꾸준한 리듬과 알맞은 양이 어떤 전력질주보다 멀리 데려가요.', rev:'한쪽에서 과해요: 너무 애쓰거나, 생각이 많거나, 시간이 필요한 상처를 서두르고 있어요.'},
      ja:{keys:'調和 · 癒し · 節度', up:'どちらにも偏らずに。安定したリズムと適量が、どんな全力疾走よりも遠くへ運んでくれる。', rev:'どこかで過剰になっている：頑張りすぎ、考えすぎ、あるいは時間が必要な傷を急いでいる。'} },
    /* 15 Devil */ { en:{keys:'attachment · habit · temptation', up:"There's a cord holding you back, usually one you tied yourself. Naming it already loosens half of it.", rev:"You're undoing the chains. A little uncomfortable, a little empty, but the direction is right."},
      zh:{keys:'束缚 · 习惯 · 诱惑', up:'有条绳子拴着你，通常是自己系上的，说出它的名字就已解开一半。', rev:'你正在解开锁链，有点不适、有点空落，但方向是对的。'},
      ko:{keys:'얽매임 · 습관 · 유혹', up:'대개 스스로 묶은 끈이 당신을 붙잡고 있어요. 이름 붙이는 순간 절반은 풀려요.', rev:'사슬을 풀고 있는 중이에요. 조금 불편하고 허전해도 방향은 맞아요.'},
      ja:{keys:'束縛 · 習慣 · 誘惑', up:'たいてい自分で結んだ紐があなたを繋いでいる。名前をつけるだけで半分は解ける。', rev:'鎖を解いている最中。少し落ち着かず空しくても方向は合っている。'} },
    /* 16 Tower */ { en:{keys:'collapse · truth · clearing ground', up:'A shake brings down what was built on a false foundation. It hurts, but afterward you finally know where the real ground is.', rev:"A crisis is only being delayed, or you're patching over something that needs to be rebuilt."},
      zh:{keys:'崩塌 · 真相 · 清理地基', up:'一次震动让建在假地基上的东西倒下，痛，但之后你才知道真正的地基在哪。', rev:'危机只是被推迟，或在勉强修补一个需要重建的地方。'},
      ko:{keys:'붕괴 · 진실 · 기반 정리', up:'거짓 기초 위에 세운 것이 흔들려 무너져요. 아프지만 그 후 진짜 바닥을 알게 돼요.', rev:'위기가 미뤄졌을 뿐이거나, 다시 지어야 할 곳을 임시로 때우고 있어요.'},
      ja:{keys:'崩壊 · 真実 · 土台の整理', up:'偽りの土台の上に建てたものが揺れて崩れる。痛いが、その後本当の地面が分かる。', rev:'危機が先延ばしにされているだけ、あるいは建て直すべき場所を仮に繕っている。'} },
    /* 17 Star */ { en:{keys:'hope · healing · trust again', up:"After the storm, a very clear sky. You're allowed to hope again — a little more gently this time.", rev:"Faith is running low. You don't need to believe in the future yet — trust one small thing today."},
      zh:{keys:'希望 · 疗愈 · 重新相信', up:'暴风雨过后天空格外清澈，这张牌说你可以再次抱有希望，这次更温柔一点。', rev:'信念快耗尽了，还不必急着相信未来，先信一件今天的小事就好。'},
      ko:{keys:'희망 · 치유 · 다시 믿기', up:'폭풍 뒤 아주 맑은 하늘. 다시 희망해도 괜찮아요, 이번엔 좀 더 부드럽게.', rev:'믿음이 바닥나고 있어요. 미래까진 아니어도 오늘의 작은 것 하나만 믿어보세요.'},
      ja:{keys:'希望 · 癒し · 再び信じる', up:'嵐の後のとても澄んだ空。もう一度、今度はもっと優しく希望していい。', rev:'信じる力が尽きかけている。未来までは無理でも、今日の小さな一つだけ信じてみて。'} },
    /* 18 Moon */ { en:{keys:'uncertainty · fear · dreams', up:'The path is unclear, and what you fear might only be a shadow, not a beast. Go slowly, and don\'t turn back.', rev:"The fog is lifting. What once confused you is finally showing its real shape."},
      zh:{keys:'迷茫 · 恐惧 · 梦境', up:'路径模糊，你害怕的也许只是影子而非野兽，慢慢走，别回头。', rev:'雾正在散去，曾让你困惑的事正显出它真实的样子。'},
      ko:{keys:'불확실 · 두려움 · 꿈', up:'길이 흐릿하고, 두려운 것이 짐승이 아니라 그림자일 수 있어요. 천천히, 돌아보지 말고.', rev:'안개가 걷히고 있어요. 혼란스러웠던 것이 진짜 모습을 드러내요.'},
      ja:{keys:'不安 · 恐れ · 夢', up:'道はぼやけていて、恐れているものは獣ではなく影かもしれない。ゆっくり、振り返らずに。', rev:'霧が晴れつつある。あなたを混乱させていたものが本当の姿を現す。'} },
    /* 19 Sun */ { en:{keys:'clarity · joy · being seen', up:'Everything is clear and warm. This is a time to be genuinely happy, without apologizing for it.', rev:"Joy is briefly hidden — it hasn't disappeared, a cloud is just passing over."},
      zh:{keys:'明朗 · 喜悦 · 被看见', up:'一切清晰而温暖，此刻可以真心快乐，不必为此道歉。', rev:'喜悦暂时被遮住，它没有消失，只是云飘过去了。'},
      ko:{keys:'명료함 · 기쁨 · 드러남', up:'모든 게 밝고 따뜻해요. 진심으로 기뻐해도, 그에 대해 사과할 필요 없는 때예요.', rev:'기쁨이 잠시 가려졌어요. 사라진 게 아니라 구름이 지나가는 중이에요.'},
      ja:{keys:'明るさ · 喜び · 見られること', up:'すべてが明るく暖かい。心から喜んでいい時、それを謝る必要はない。', rev:'喜びが一時的に隠れている。消えたのではなく、雲が通り過ぎているだけ。'} },
    /* 20 Judgement */ { en:{keys:'awakening · calling · renewal', up:"There's a call you've heard for a while and pretended not to. It's time to answer it.", rev:"You're judging yourself too harshly, or hesitating before a decision your heart has already made."},
      zh:{keys:'觉醒 · 召唤 · 重生', up:'有个声音你听了很久却假装没听见，是时候回应它了。', rev:'对自己评判太重，或在一个心里其实已有答案的决定前犹豫。'},
      ko:{keys:'각성 · 부름 · 새로 시작', up:'오래 들었지만 못 들은 척한 부름이 있어요. 이제 응답할 때예요.', rev:'자신을 너무 심하게 심판하거나, 마음은 이미 정한 결정을 망설이고 있어요.'},
      ja:{keys:'目覚め · 呼びかけ · 再生', up:'ずっと聞こえていたのに聞こえないふりをしてきた呼び声がある。今こそ応える時。', rev:'自分を厳しく裁きすぎている、あるいは心はもう決めている決断をためらっている。'} },
    /* 21 World */ { en:{keys:'completion · closing a cycle · celebration', up:'A cycle has completed. Pause long enough to celebrate before you start the next one.', rev:"One piece still doesn't fit. Don't declare it finished until it truly feels whole."},
      zh:{keys:'圆满 · 完成循环 · 庆祝', up:'一个循环走完了，停下来好好庆祝，再开始下一圈。', rev:'还有一块没拼上，别急着宣布结束，等心里真的觉得圆满。'},
      ko:{keys:'완성 · 순환의 끝 · 축하', up:'한 바퀴를 다 돌았어요. 다음을 시작하기 전에 충분히 멈춰 축하하세요.', rev:'아직 안 맞는 조각이 있어요. 마음이 정말 찰 때까지 끝났다고 말하지 마세요.'},
      ja:{keys:'完成 · 循環の終わり · 祝福', up:'一つの輪が閉じた。次に進む前に十分に立ち止まって祝って。', rev:'まだ噛み合わない一片がある。心から満たされるまで終わりだと急いで言わないで。'} }
  ];

  const suits = {
    wands:     { en:{name:'Wands',     el:'Fire',  domain:'passion'},  zh:{name:'权杖', el:'火', domain:'热情'}, ko:{name:'완드', el:'불', domain:'열정'}, ja:{name:'ワンド', el:'火', domain:'情熱'} },
    cups:      { en:{name:'Cups',      el:'Water', domain:'emotion'},  zh:{name:'圣杯', el:'水', domain:'情感'}, ko:{name:'컵',   el:'물', domain:'감정'}, ja:{name:'カップ', el:'水', domain:'感情'} },
    swords:    { en:{name:'Swords',    el:'Air',   domain:'thought'},  zh:{name:'宝剑', el:'风', domain:'思绪'}, ko:{name:'소드', el:'공기', domain:'생각'}, ja:{name:'ソード', el:'風', domain:'思考'} },
    pentacles: { en:{name:'Pentacles', el:'Earth', domain:'money'},    zh:{name:'钱币', el:'土', domain:'金钱'}, ko:{name:'펜타클', el:'땅', domain:'돈'},   ja:{name:'ペンタクル', el:'地', domain:'お金'} }
  };

  const ranks = {
    en: ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King'],
    zh: ['王牌','二','三','四','五','六','七','八','九','十','侍从','骑士','王后','国王'],
    ko: ['에이스','2','3','4','5','6','7','8','9','10','시종','기사','여왕','왕'],
    ja: ['エース','2','3','4','5','6','7','8','9','10','ペイジ','ナイト','クイーン','キング']
  };

  const minor = {
    wands: [
      { en:{up:"A spark of excitement just lit — don't overanalyze it, take one small action today.", rev:'A good idea with nowhere to start yet, or a fire just lit that got doused too soon.'}, zh:{up:'灵感乍现，别多想，今天就试一小步。', rev:'好点子还没落地，或热情刚被浇灭。'}, ko:{up:'설렘이 막 피어올랐어요. 따지지 말고 오늘 작은 한 걸음을 떼어보세요.', rev:'좋은 아이디어인데 시작할 곳이 없거나, 막 붙은 불이 꺼졌어요.'}, ja:{up:'ひらめきが灯った。深く考えず、今日小さな一歩を試してみて。', rev:'良いアイデアなのに始める場所がない、あるいは灯った火がすぐ消えた。'} },
      { en:{up:'You stand at a fork and can see both paths — choose the one that makes you nervous, not the safe one out of fear.', rev:'Endless planning without a step taken, or fear of leaving what is familiar.'}, zh:{up:'你已看清两条路，选让你心跳的那条，别因怕而选安全牌。', rev:'计划再多也没迈步，或不敢离开熟悉的地方。'}, ko:{up:'두 갈래 길이 다 보이는 지금, 안전한 쪽 말고 설레는 쪽을 고르세요.', rev:'계획만 세우고 발은 못 뗐거나, 익숙한 곳을 떠나기 두려워요.'}, ja:{up:'二つの道が見えている。怖くて安全な方ではなく、心が動く方を選んで。', rev:'計画ばかりで動けない、あるいは慣れた場所を離れるのが怖い。'} },
      { en:{up:'The ship has sailed. Now it is about waiting the right way — preparing for what is coming.', rev:'Results are arriving slower than hoped, or you are missing someone to share the load.'}, zh:{up:'船已启航，现在要好好等待，为将来的事做准备。', rev:'结果比预期慢，或缺人同行。'}, ko:{up:'배는 이미 떠났어요. 이제는 올바르게 기다릴 차례, 오는 것을 준비하세요.', rev:'결과가 예상보다 늦거나, 함께 짊어질 사람이 부족해요.'}, ja:{up:'船はもう出た。今は正しく待つ時、来るものに備えて。', rev:'結果が思ったより遅い、あるいは一緒に担ぐ人がいない。'} },
      { en:{up:'A moment of celebration, a home, a group that makes you feel steady. Accept it.', rev:'A feeling of not belonging yet, or joy delayed because you have not let yourself feel it.'}, zh:{up:'一场庆祝、一个家、一群让你安心的人，接受它吧。', rev:'还没有归属感，或还没允许自己开心。'}, ko:{up:'축하의 순간, 안식처, 편안해지는 사람들. 그냥 받아들이세요.', rev:'아직 소속감이 없거나, 스스로 기쁨을 허락하지 않았어요.'}, ja:{up:'お祝いの時、居場所、安心できる人たち。受け取っていい。', rev:'まだ居場所を感じられない、あるいは喜びを自分に許していない。'} },
      { en:{up:'Small friction, healthy competition — it sharpens you rather than tearing you down.', rev:'Circular arguments are wearing everyone out. Step out of this particular fight.'}, zh:{up:'小摩擦、良性竞争，是磨砺而非打击。', rev:'争论在消耗彼此，退出这场争执吧。'}, ko:{up:'작은 부딪힘, 건강한 경쟁. 깎아내리는 게 아니라 다듬어주는 거예요.', rev:'맴도는 다툼이 서로를 지치게 해요. 이 논쟁에서 빠져나오세요.'}, ja:{up:'小さな衝突、健全な競争。削るためではなく磨くためのもの。', rev:'堂々巡りの言い争いが互いを疲れさせる。この争いから離れて。'} },
      { en:{up:'Your effort is being seen. Accept the praise without shrinking yourself.', rev:'Doing well with no one noticing, or needing validation more than is healthy.'}, zh:{up:'努力被看见了，坦然接受赞美。', rev:'做得好却无人知晓，或过于渴望认可。'}, ko:{up:'노력이 눈에 띄었어요. 스스로를 낮추지 말고 칭찬을 받아들이세요.', rev:'잘했는데 아무도 몰라주거나, 인정이 필요 이상으로 절실해요.'}, ja:{up:'努力が見てもらえている。素直に称賛を受け取って。', rev:'よくやったのに誰も気づかない、あるいは認められたい気持ちが強すぎる。'} },
      { en:{up:'Hold your ground. You are in a stronger position than you think.', rev:'Defending yourself has become exhausting. Some battles are not worth fighting.'}, zh:{up:'守住你的立场，你比想象中更有优势。', rev:'防御太久太累，有些仗不必打。'}, ko:{up:'자리를 지키세요. 생각보다 유리한 위치에 있어요.', rev:'방어하느라 지쳤어요. 싸울 가치 없는 싸움도 있어요.'}, ja:{up:'自分の立場を守って。思っているより有利な位置にいる。', rev:'守り続けて疲れた。戦う価値のない戦いもある。'} },
      { en:{up:'Everything is speeding up — messages, trips, long-awaited answers. Catch this rhythm.', rev:'Rushed and tangled, or a long silence has frozen everything in place.'}, zh:{up:'一切在加速：消息、旅程、等待已久的答案，抓住这个节奏。', rev:'匆忙混乱，或长久的沉默让一切停滞。'}, ko:{up:'메시지, 여행, 오래 기다린 답이 한꺼번에 빨라져요. 이 흐름을 잡으세요.', rev:'서두르다 엉키거나, 긴 침묵이 모든 걸 멈춰버렸어요.'}, ja:{up:'メッセージ、旅、待っていた答えが一気に動き出す。この流れに乗って。', rev:'急いで絡まる、あるいは長い沈黙がすべてを止めている。'} },
      { en:{up:'Tired but still standing. You are closer than you think — just one more round.', rev:'Exhausted and guarding yourself even against people who mean well.'}, zh:{up:'累但仍站着，你比想的更接近终点。', rev:'精疲力竭，连善意也提防，放松一点肩膀。'}, ko:{up:'지쳤지만 아직 서 있어요. 생각보다 가까워요, 한 라운드만 더.', rev:'기진맥진해서 좋은 사람마저 경계해요. 어깨에 힘을 조금 빼보세요.'}, ja:{up:'疲れてもまだ立っている。思うより近い、あと一勝負。', rev:'疲れ切って善意すら警戒している。肩の力を少し抜いて。'} },
      { en:{up:'You are carrying too much. Setting a few things down will not make you less capable.', rev:'The load is starting to be shared. Asking for help is a skill, not a defeat.'}, zh:{up:'你扛得太多了，放下几件不会让你变弱。', rev:'负担开始被分担，求助是能力而非认输。'}, ko:{up:'너무 많이 짊어졌어요. 몇 가지 내려놓아도 능력이 줄지 않아요.', rev:'짐이 나눠지기 시작해요. 도움을 청하는 건 실력이지 패배가 아니에요.'}, ja:{up:'抱えすぎている。いくつか下ろしても能力は減らない。', rev:'負担が分かち合われ始めている。助けを求めるのは能力であって敗北ではない。'} },
      { en:{up:'Good news, an invitation, a childlike curiosity worth following.', rev:'Excitement that fades fast, or news that is not fully confirmed yet.'}, zh:{up:'好消息、一个邀请、一份值得跟随的好奇心。', rev:'兴奋来得快去得也快，或消息还未证实。'}, ko:{up:'좋은 소식, 초대, 따라가볼 만한 순수한 호기심.', rev:'설렘이 금방 식거나, 아직 확인되지 않은 소식이에요.'}, ja:{up:'良い知らせ、誘い、追いかける価値のある子どもらしい好奇心。', rev:'高揚がすぐ冷める、あるいはまだ確かでない知らせ。'} },
      { en:{up:'Riding fully into something you believe in — this passion fits the moment.', rev:'Overpromising and acting on impulse.'}, zh:{up:'全情投入你相信的事，此刻的热情正合时宜。', rev:'冲动过头，承诺多于能做到的。'}, ko:{up:'믿는 일에 온 힘을 쏟으세요. 지금 이 열정은 시기가 맞아요.', rev:'과하게 약속하거나 충동적으로 움직여요.'}, ja:{up:'信じることに全力を注いで。今のこの情熱はタイミングが合っている。', rev:'約束しすぎ、あるいは衝動的に動きすぎている。'} },
      { en:{up:'You are warm and naturally magnetic — people come to you because you are grounded, not because you are trying.', rev:'Confidence is shaky, or someone is draining your energy.'}, zh:{up:'你温暖且自带吸引力，人们靠近你是因为你稳，不是因为你刻意。', rev:'自信在动摇，或能量被他人耗尽。'}, ko:{up:'당신은 따뜻하고 자연스럽게 사람을 끌어요. 애쓰지 않아도 사람들이 다가와요.', rev:'자신감이 흔들리거나, 누군가 당신 에너지를 빼앗고 있어요.'}, ja:{up:'あなたは温かく自然と人を惹きつける。無理せずとも人が集まる。', rev:'自信が揺らいでいる、あるいは誰かにエネルギーを吸い取られている。'} },
      { en:{up:'Long-range vision and the courage to follow through — a good time to lead.', rev:'Pushing your vision onto others, or impatience wrecking something that was going well.'}, zh:{up:'远见与胆识兼具，此刻适合带领。', rev:'把想法强加于人，或急躁毁了本来顺利的事。'}, ko:{up:'멀리 보는 시야와 밀고 나갈 배짱. 지금은 이끌기 좋은 때예요.', rev:'자기 비전을 남에게 강요하거나, 조급함이 잘 되던 일을 망쳐요.'}, ja:{up:'長い視野とやり抜く度胸。今は導くのに良い時。', rev:'自分のビジョンを人に押し付けている、あるいは焦りがうまくいっていたことを壊す。'} }
    ],
    cups: [
      { en:{up:'The heart has just been refilled — a new feeling, a forgiveness, a softening.', rev:'Emotions are blocked. You are holding back words you have not said to someone.'}, zh:{up:'心刚被重新填满：新的感情、一次原谅、一份柔软。', rev:'情绪被堵住，你藏着没说出口的话。'}, ko:{up:'마음이 막 다시 채워졌어요. 새로운 감정, 용서, 부드러움.', rev:'감정이 막혀 있어요. 누군가에게 못한 말을 품고 있어요.'}, ja:{up:'心がちょうど満たされ直した。新しい感情、赦し、柔らかさ。', rev:'感情が塞がれている。誰かに言えなかった言葉を抱えている。'} },
      { en:{up:'Two people truly seeing each other. This connection is balanced and healthy.', rev:'A relationship is out of step — someone is trying harder than the other.'}, zh:{up:'两个人真正看见彼此，这段关系平衡而健康。', rev:'关系失衡，有人付出更多。'}, ko:{up:'두 사람이 진짜로 서로를 봐줘요. 균형 잡히고 건강한 연결이에요.', rev:'관계의 박자가 어긋나요. 누군가 더 애쓰고 있어요.'}, ja:{up:'二人が本当に見つめ合っている。バランスの取れた健やかな繋がり。', rev:'関係のリズムがずれている。誰かがより多く頑張っている。'} },
      { en:{up:'Friends, a small gathering, family — let yourself enjoy being with others.', rev:'Something feels off in the group, or the fun is a way to avoid thinking.'}, zh:{up:'朋友、小聚、家人，让自己享受与人同乐。', rev:'圈子里有点不对劲，或用狂欢逃避思考。'}, ko:{up:'친구, 작은 모임, 가족. 함께하는 기쁨을 스스로에게 허락하세요.', rev:'무리 안에 뭔가 걸리거나, 생각하지 않으려고 너무 신나게 놀아요.'}, ja:{up:'友人、小さな集まり、家族。人と楽しむことを自分に許して。', rev:'グループの中に何か引っかかりがある、あるいは考えたくなくて騒いでいる。'} },
      { en:{up:'A gift is being offered that you have stopped noticing out of boredom. Look up and check again.', rev:'You are starting to see what you already have. Even boredom has an ending.'}, zh:{up:'有份礼物摆在眼前，你却因倦怠没看见，抬头再看看。', rev:'你开始看见自己拥有的，倦怠也会过去。'}, ko:{up:'지루해서 못 본 선물이 내밀어져 있어요. 고개 들어 다시 보세요.', rev:'이미 가진 것이 다시 보이기 시작해요. 지루함도 끝이 있어요.'}, ja:{up:'退屈で見えなくなった贈り物が差し出されている。顔を上げてもう一度見て。', rev:'自分が持っているものが再び見え始めている。退屈にも終わりがある。'} },
      { en:{up:'A real loss, and sadness here is valid — but two cups behind you have not spilled.', rev:'The sadness is easing. You are able to turn back around now.'}, zh:{up:'真实的失去，悲伤是合理的，但身后还有两杯未倒。', rev:'悲伤在减退，你可以回头了。'}, ko:{up:'진짜 상실이고, 슬퍼해도 괜찮아요. 하지만 뒤에는 아직 안 쏟아진 잔 두 개가 있어요.', rev:'슬픔이 가라앉고 있어요. 이제 돌아설 수 있어요.'}, ja:{up:'本当の喪失で、悲しんでいい。でも背後にはまだこぼれていない二つのカップがある。', rev:'悲しみが和らいでいる。もう振り返れる。'} },
      { en:{up:'A memory or someone from the past returns gently, not painfully.', rev:'You have been living in the past a little too long. Today deserves to be lived too.'}, zh:{up:'一段回忆或旧人温柔归来，不带伤痛。', rev:'活在过去太久了，今天也值得好好过。'}, ko:{up:'추억이나 옛 인연이 아프지 않고 부드럽게 스쳐가요.', rev:'과거에 조금 오래 머물렀어요. 오늘도 살 가치가 있어요.'}, ja:{up:'思い出や昔の人が、痛みなく優しく訪れる。', rev:'過去に少し長く留まりすぎた。今日も生きる価値がある。'} },
      { en:{up:'Too many choices, and each one looks dazzling. Let go of the ones that only shine in your imagination.', rev:'The fog clears and you can see what is real. You are ready to choose.'}, zh:{up:'选择太多，个个都诱人，放下只在幻想中美好的那些。', rev:'迷雾散去，你看清真相，可以选择了。'}, ko:{up:'선택지가 너무 많고 다 반짝여요. 상상 속에서만 예쁜 것들은 내려놓으세요.', rev:'안개가 걷히고 진짜가 보여요. 이제 선택할 수 있어요.'}, ja:{up:'選択肢が多すぎてどれも輝いて見える。想像の中でしか美しくないものは手放して。', rev:'霧が晴れて本物が見える。選べる時が来た。'} },
      { en:{up:'Walking away from something good but no longer right for you. It takes courage, and you have it.', rev:'Leaving, then turning back again. Ask yourself: is it love, or fear of the empty space?'}, zh:{up:'转身离开一件好的但不再合适的事，需要勇气，而你有。', rev:'走了又回头，问问自己：是不舍，还是怕空。'}, ko:{up:'좋지만 더는 맞지 않는 것에서 돌아서요. 용기가 필요하고, 당신에게 있어요.', rev:'떠났다가 다시 돌아봐요. 물어보세요, 애정 때문인지 빈자리가 두려운 건지.'}, ja:{up:'良いけれどもう合わないものから立ち去る。勇気がいるが、あなたにはある。', rev:'去ってはまた振り返る。愛情からか、空白が怖いからか自分に聞いて。'} },
      { en:{up:'A wish comes true. Let yourself be satisfied without guilt.', rev:'Getting what you wanted and still feeling short. Maybe what you wanted is not what you need.'}, zh:{up:'心愿成真，允许自己满足而不内疚。', rev:'得到想要的却仍觉不够，也许想要的不是需要的。'}, ko:{up:'소원이 이루어져요. 죄책감 없이 만족을 허락하세요.', rev:'원하던 걸 얻고도 부족해요. 원했던 게 필요한 게 아니었을 수도 있어요.'}, ja:{up:'願いが叶う。罪悪感なく満足を自分に許して。', rev:'欲しかったものを得てもまだ足りない。欲しいものが必要なものではないのかも。'} },
      { en:{up:'A deep, quiet warmth — family in the widest sense. Real peace.', rev:'A pretty picture on the outside while something at home is off. Time to talk.'}, zh:{up:'深沉安稳的温暖，广义上的家人，真正的平静。', rev:'表面美好，家里其实有裂痕，该谈谈了。'}, ko:{up:'깊고 조용한 따뜻함, 가장 넓은 의미의 가족. 진짜 평온이에요.', rev:'겉은 예쁜데 집안 어딘가 어긋나요. 대화가 필요해요.'}, ja:{up:'深く静かな温かさ、広い意味での家族。本当の安らぎ。', rev:'表面は美しいが家の中で何かがずれている。話す時。'} },
      { en:{up:'A confession, a new feeling, a bit of sweet awkwardness.', rev:'Overly sensitive, or sulking instead of saying it plainly.'}, zh:{up:'一次表白、一份新感情、一点可爱的害羞。', rev:'过于敏感，或用赌气代替直说。'}, ko:{up:'고백, 새로운 감정, 사랑스러운 어색함.', rev:'지나치게 예민하거나, 솔직히 말하는 대신 삐쳐요.'}, ja:{up:'告白、新しい感情、少し可愛らしい照れ。', rev:'過敏になりすぎている、あるいは率直に言わずすねている。'} },
      { en:{up:'Someone is offering a genuine invitation — or you should be the one to offer it.', rev:'Nice words without follow-through yet. Give it a little more time.'}, zh:{up:'有人真诚发出邀请，或该由你主动开口。', rev:'话说得好听，行动还没跟上，再等等看。'}, ko:{up:'누군가 진심 어린 초대를 건네요. 혹은 당신이 먼저 말을 걸어야 해요.', rev:'말은 좋은데 행동이 아직이에요. 조금 더 지켜보세요.'}, ja:{up:'誰かが心からの誘いを差し出している。あるいはあなたから声をかける番。', rev:'言葉は良いが行動がまだ伴っていない。もう少し様子を見て。'} },
      { en:{up:'You understand others and yourself. Listening matters more than advice right now.', rev:'You are holding too much of other people\'s feelings. You need support too.'}, zh:{up:'你懂别人也懂自己，此刻倾听比建议更珍贵。', rev:'扛了太多别人的情绪，你也需要被托住。'}, ko:{up:'남의 마음도 내 마음도 이해해요. 지금은 조언보다 경청이 귀해요.', rev:'남의 감정을 너무 많이 안고 있어요. 당신도 받쳐줄 사람이 필요해요.'}, ja:{up:'人の心も自分の心も理解している。今は助言より傾聴が大切。', rev:'他人の感情を抱え込みすぎている。あなたも支えが必要。'} },
      { en:{up:'Calm within the storm. You keep your center while staying kind to others.', rev:'Suppressing feelings and calling it maturity. Let some of it out.'}, zh:{up:'风浪中的平静，你守住自己也善待他人。', rev:'把压抑情绪叫作成熟，释放一点吧。'}, ko:{up:'파도 속의 고요함. 자신을 지키면서도 다정할 수 있어요.', rev:'감정을 억누르고 성숙이라 불러요. 조금은 흘려보내세요.'}, ja:{up:'嵐の中の静けさ。自分を保ちながら人にも優しくできる。', rev:'感情を抑え込んで成熟と呼んでいる。少し解き放って。'} }
    ],
    swords: [
      { en:{up:'A clear thought cuts through the fog. This truth is sharp but necessary.', rev:'Your head is spinning — too much information, not enough clarity.'}, zh:{up:'一个念头划破迷雾，这真相锋利却必要。', rev:'头脑嗡嗡，信息很多却理不清。'}, ko:{up:'생각 하나가 안개를 가르네요. 날카롭지만 꼭 필요한 진실이에요.', rev:'머리가 웅웅거려요. 정보는 많은데 명확하지 않아요.'}, ja:{up:'一つの考えが霧を切り裂く。鋭いが必要な真実。', rev:'頭がぼんやりして、情報は多いのに整理がつかない。'} },
      { en:{up:'You have been avoiding a decision with your eyes closed. Take off the blindfold, then choose.', rev:'The deadlock is breaking. You are close to deciding.'}, zh:{up:'你蒙着眼躲避一个决定，摘下眼罩再选择。', rev:'僵局正在打破，你快要能选择了。'}, ko:{up:'눈을 가리고 결정을 피하고 있어요. 눈가리개를 풀고 선택하세요.', rev:'교착 상태가 풀리고 있어요. 곧 선택할 수 있어요.'}, ja:{up:'目を閉じて決断を避けている。目隠しを外してから選んで。', rev:'行き詰まりが崩れつつある。もうすぐ選べる。'} },
      { en:{up:'Words that hurt, and the pain is real. Do not rush yourself into being fine.', rev:'The wound is closing. It is okay to heal slowly.'}, zh:{up:'有句话真的伤人，痛是真实的，别急着说自己没事。', rev:'伤口在愈合，慢慢来也可以。'}, ko:{up:'아프게 하는 말이 있었고, 그 아픔은 진짜예요. 서둘러 괜찮은 척하지 마세요.', rev:'상처가 아물고 있어요. 천천히 나아도 괜찮아요.'}, ja:{up:'傷つく言葉があった。その痛みは本物。無理に大丈夫なふりをしないで。', rev:'傷が癒えつつある。ゆっくりでいい。'} },
      { en:{up:'Rest. This is not giving up, it is recharging. You are allowed to switch off.', rev:'Resting endlessly and still tired, or it is time to get back in the game.'}, zh:{up:'休息，不是放弃，是充电，你可以允许自己关机。', rev:'休息很久仍累，或该回到场上了。'}, ko:{up:'쉬세요. 포기가 아니라 충전이에요. 잠시 꺼둬도 괜찮아요.', rev:'쉬어도 아직 지쳐 있거나, 다시 뛰어들 때가 됐어요.'}, ja:{up:'休んで。諦めではなく充電。電源を切ってもいい。', rev:'休んでもまだ疲れている、あるいはそろそろ戻る時。'} },
      { en:{up:'What do you actually gain from winning this argument? Some wins cost more than losing.', rev:'You are laying down your weapon. Making peace is the stronger choice.'}, zh:{up:'赢了这场争论又能得到什么？有些胜利比输更亏。', rev:'你正放下武器，和解是更强大的选择。'}, ko:{up:'이 논쟁에서 이기면 무얼 얻을까요? 지는 것보다 비싼 승리도 있어요.', rev:'무기를 내려놓고 있어요. 화해가 더 강한 선택이에요.'}, ja:{up:'この言い争いに勝って何が得られる？負けるより高くつく勝利もある。', rev:'武器を下ろしている。和解の方が強い選択。'} },
      { en:{up:'Leaving choppy water for calmer waters. This move is the right one.', rev:'Wanting to leave but still tangled, or carrying old baggage into the new shore.'}, zh:{up:'离开动荡的水域，驶向更平静的地方，这一步是对的。', rev:'想走却还牵绊，或把旧行李带去了新岸。'}, ko:{up:'거친 물을 떠나 잔잔한 곳으로. 이 이동은 옳아요.', rev:'떠나고 싶은데 얽혀 있거나, 옛 짐을 새 땅까지 들고 가요.'}, ja:{up:'荒れた水を離れ、静かな場所へ。この移動は正しい。', rev:'離れたいのに絡まっている、あるいは古い荷物を新しい岸へ持っていく。'} },
      { en:{up:'Something is not fully honest — theirs or your own.', rev:'The truth comes out. Confessing early makes it lighter sooner.'}, zh:{up:'有些事不够坦诚，可能是别人的，也可能是自己的。', rev:'真相浮出水面，早坦白就早轻松。'}, ko:{up:'완전히 정직하지 않은 무언가가 있어요, 남의 것이든 자신의 것이든.', rev:'진실이 드러나요. 일찍 인정할수록 일찍 가벼워져요.'}, ja:{up:'完全には誠実でない何かがある、相手のものか自分のものか。', rev:'真実が明らかになる。早く認めれば早く軽くなる。'} },
      { en:{up:'You feel trapped, but the ropes are looser than they look. Try moving just a little.', rev:'You are untying yourself. Keep going.'}, zh:{up:'你觉得被困住，但绳子比想象中松，试着动一动。', rev:'你正在自己松绑，继续下去。'}, ko:{up:'갇힌 느낌이지만 밧줄은 보기보다 헐거워요. 조금 움직여보세요.', rev:'스스로를 풀어주고 있어요. 계속하세요.'}, ja:{up:'閉じ込められた気がするが、縄は見た目より緩い。少し動いてみて。', rev:'自分で縄を解いている。続けて。'} },
      { en:{up:'3am and your mind will not shut off. The worry is bigger than the truth.', rev:'The anxiety is easing. Things look smaller in the morning.'}, zh:{up:'凌晨三点脑子停不下来，忧虑比事实更大。', rev:'焦虑在退去，早上一切都变小了。'}, ko:{up:'새벽 세 시, 머리가 멈추질 않아요. 걱정이 사실보다 커요.', rev:'불안이 가라앉고 있어요. 아침이면 작아 보일 거예요.'}, ja:{up:'夜中の三時、頭が止まらない。不安が事実より大きい。', rev:'不安が和らいでいる。朝には小さく見える。'} },
      { en:{up:'You have hit bottom. The one comfort of the bottom is that from here it is only up.', rev:'You are getting back up. Try not to retell the old story too many times.'}, zh:{up:'已经触底，触底唯一的好处是接下来只会往上走。', rev:'正在爬起来，别把旧事重复讲太多次。'}, ko:{up:'바닥을 쳤어요. 바닥의 유일한 위안은 이제 올라갈 일만 남았다는 것.', rev:'다시 일어서는 중이에요. 옛이야기를 너무 여러 번 하지 마세요.'}, ja:{up:'底を打った。底の唯一の慰めは、ここからは上がるだけということ。', rev:'立ち直りつつある。昔の話をあまり繰り返さないで。'} },
      { en:{up:'Curiosity, gossip, learning something new. Ask directly rather than guess.', rev:'Overhearing half a story, or speaking before understanding enough.'}, zh:{up:'好奇、听八卦、学新东西，直接问比猜更好。', rev:'听风就是雨，或没搞懂就先开口。'}, ko:{up:'호기심, 소문, 새로운 배움. 짐작보다 직접 물어보는 게 나아요.', rev:'어설프게 듣고 넘겨짚거나, 충분히 알기 전에 말해버려요.'}, ja:{up:'好奇心、噂話、新しい学び。推測より直接聞く方がいい。', rev:'半分聞いただけで判断する、あるいは十分理解する前に話す。'} },
      { en:{up:'Cutting straight to the issue with clear logic. Fast and direct fits right now.', rev:'Words too sharp, or moving forward without listening to anyone.'}, zh:{up:'用清晰的逻辑直击问题，此刻快而直接是对的。', rev:'话说得太重，或没听任何人就往前冲。'}, ko:{up:'명확한 논리로 문제를 정면으로 봐요. 지금은 빠르고 직접적인 게 맞아요.', rev:'말이 너무 날카롭거나, 아무 말도 듣지 않고 밀어붙여요.'}, ja:{up:'明確な論理で問題に真っすぐ向き合う。今は速く率直でいい。', rev:'言葉が鋭すぎる、あるいは誰の話も聞かず突き進む。'} },
      { en:{up:'Seeing things clearly, without lying to yourself. This clarity was earned through past pain.', rev:'Too cold has become distant, or self-criticism has gotten too harsh.'}, zh:{up:'看清一切且不自欺，这份清醒来自曾经的痛。', rev:'冷漠变成疏离，或自我批评太重。'}, ko:{up:'스스로를 속이지 않고 또렷하게 봐요. 이 명료함은 지난 아픔에서 왔어요.', rev:'냉정함이 거리감이 되거나, 자기비판이 너무 심해요.'}, ja:{up:'自分を偽らずに物事をはっきり見ている。この明晰さは過去の痛みから来た。', rev:'冷たさが距離になっている、あるいは自己批判が厳しすぎる。'} },
      { en:{up:'Reason is in charge, fair and direct. Decide — you are clear-headed enough.', rev:'Rigid, judgmental, or using logic to avoid feeling.'}, zh:{up:'理智掌舵，公正直接，做决定吧，你够清醒。', rev:'僵化、评判，或用道理逃避感受。'}, ko:{up:'이성이 키를 잡아요, 공정하고 솔직하게. 결정하세요, 충분히 맑아요.', rev:'경직되고 판단하려 들거나, 논리로 감정을 피해요.'}, ja:{up:'理性が舵を取り、公正で率直。決めていい、十分に冴えている。', rev:'硬直して裁こうとする、あるいは論理で感情を避けている。'} }
    ],
    pentacles: [
      { en:{up:'A very concrete opportunity: a job, some money, an offer. Take it and follow through.', rev:'An opportunity slipping away from hesitation, or a plan that is not realistic enough.'}, zh:{up:'一个非常具体的机会：工作、一笔钱、一个邀约，抓住并做到底。', rev:'因犹豫错过机会，或计划不够现实。'}, ko:{up:'아주 구체적인 기회예요: 일, 돈, 제안. 잡고 끝까지 해보세요.', rev:'망설이다 기회가 흘러가거나, 계획이 충분히 현실적이지 않아요.'}, ja:{up:'とても具体的なチャンス：仕事、お金、申し出。掴んでやり遂げて。', rev:'ためらってチャンスが流れる、あるいは計画が現実的でない。'} },
      { en:{up:'Juggling several things while staying balanced — just do not add a third ball.', rev:'Overloaded. Dropping one task is the only way through.'}, zh:{up:'同时兼顾几件事还能保持平衡，只是别再加第三件。', rev:'超负荷了，放下一件才是出路。'}, ko:{up:'여러 일을 동시에 저글링하면서도 균형을 잡고 있어요. 세 번째 공은 넣지 마세요.', rev:'과부하예요. 하나를 내려놓는 게 유일한 길이에요.'}, ja:{up:'いくつも同時にこなしながらバランスを保っている。ただ三つ目は加えないで。', rev:'抱えすぎている。一つ手放すことが唯一の道。'} },
      { en:{up:'Working alongside people who are good at this, learning the craft, honest feedback. A growth phase.', rev:'The teamwork is uneven, or you are doing three people\'s share alone.'}, zh:{up:'与高手同行、学手艺、听直接的反馈，这是进阶期。', rev:'团队分工不均，或一人扛了三人份。'}, ko:{up:'실력자와 함께 일하고, 배우고, 솔직한 피드백을 받는 성장기예요.', rev:'팀워크가 한쪽으로 쏠렸거나, 세 사람 몫을 혼자 하고 있어요.'}, ja:{up:'上手な人と働き、技を学び、率直な意見をもらう成長期。', rev:'チームの分担が偏っている、あるいは一人で三人分を担っている。'} },
      { en:{up:'Holding tight can be a strategy — just check whether you are holding on, or holding back out of fear.', rev:'You are opening your hands. A little generosity feels lighter than it looks.'}, zh:{up:'握紧也是一种策略，但check一下是握着，还是怕失去。', rev:'你正在松手，慷慨一点会更轻松。'}, ko:{up:'꽉 쥐는 것도 전략이지만, 붙잡는 건지 두려운 건지 확인해보세요.', rev:'손을 펴고 있어요. 조금의 관대함이 더 편할 거예요.'}, ja:{up:'しっかり握ることも戦略だが、握っているのか怖くて離せないのか確かめて。', rev:'手を開き始めている。少しの寛大さが軽さをくれる。'} },
      { en:{up:'Real lack, or the feeling of being left out in the cold. There is a light indoors — knock.', rev:'The hard stretch is passing. Help is arriving from an unexpected place.'}, zh:{up:'真实的匮乏，或被关在门外的感觉，屋里有灯，敲门吧。', rev:'艰难期正在过去，帮助从意想不到的地方到来。'}, ko:{up:'진짜 궁핍함, 문밖에 남겨진 느낌. 안에는 불빛이 있어요, 두드려보세요.', rev:'힘든 시기가 지나가고 있어요. 뜻밖의 곳에서 도움이 와요.'}, ja:{up:'本当の不足感、締め出された感覚。中には明かりがある、ノックしてみて。', rev:'厳しい時期が過ぎつつある。思わぬところから助けが来る。'} },
      { en:{up:'Giving and receiving are in rhythm. Help someone today, someone helps you tomorrow.', rev:'Help with strings attached, or an awkward debt of gratitude.'}, zh:{up:'给予与接受节奏正好，今天你帮人，明天有人帮你。', rev:'附带条件的帮助，或人情债让人为难。'}, ko:{up:'주고받음이 딱 맞는 리듬이에요. 오늘 도우면 내일 도움받아요.', rev:'조건이 붙은 도움이거나, 곤란한 마음의 빚이에요.'}, ja:{up:'与えることと受け取ることがちょうど噛み合っている。今日助ければ明日助けられる。', rev:'条件付きの助け、あるいは気まずい恩義。'} },
      { en:{up:'Pause and look at what you have planted. Not harvesting yet does not mean you planted wrong.', rev:'Pulling it up early to check the roots. Give it one more season.'}, zh:{up:'停下看看自己种下的东西，还没收成不代表种错了。', rev:'心急拔起来看根，再耐心一季。'}, ko:{up:'잠시 멈춰 심어놓은 걸 살펴보세요. 아직 못 거뒀다고 잘못 심은 건 아니에요.', rev:'조급해서 뿌리를 확인하려 뽑아봐요. 한 계절만 더 참으세요.'}, ja:{up:'立ち止まって自分が植えたものを見てみて。まだ収穫できていなくても間違いではない。', rev:'焦って根を確認しようと引き抜く。あと一季節待って。'} },
      { en:{up:'Repeating the work until it is refined. This unglamorous stretch is exactly how skill is built.', rev:'Just going through the motions, or losing interest. Revisit why you started.'}, zh:{up:'反复练习直到精，这段枯燥期正是练就手艺的时候。', rev:'敷衍了事，或对这行失去兴趣，想想当初为何开始。'}, ko:{up:'다듬어질 때까지 반복해요. 이 지루한 시기가 바로 실력이 만들어지는 때예요.', rev:'대충 끝내거나 흥미를 잃었어요. 왜 시작했는지 돌아보세요.'}, ja:{up:'洗練されるまで繰り返す。この地味な時期こそ技が身につく時。', rev:'こなすだけになっている、あるいは飽きている。始めた理由を思い出して。'} },
      { en:{up:'Able to provide for yourself and actually enjoying it. This independence is worth having.', rev:'Too busy earning a living to actually live, or leaning on others a bit too long.'}, zh:{up:'能养活自己且乐在其中，这份独立很值得。', rev:'忙着谋生忘了生活，或依赖他人太久。'}, ko:{up:'스스로를 책임지고 그걸 즐기고 있어요. 이 독립은 가질 만한 가치가 있어요.', rev:'먹고사느라 바빠 정작 삶을 잊거나, 너무 오래 기대고 있어요.'}, ja:{up:'自分で自分を養い、それを楽しんでいる。この自立には価値がある。', rev:'生計に追われて生きることを忘れている、あるいは長く頼りすぎている。'} },
      { en:{up:'Long-term, family, legacy. What you are building is holding up.', rev:'Money matters at home need an honest talk — do not put it off.'}, zh:{up:'长远、家族、留下的东西，你建立的正在稳固。', rev:'家里的钱事该说清楚，别再拖了。'}, ko:{up:'장기적인 것, 가족, 남기는 것. 쌓아온 것이 든든해요.', rev:'집안 돈 문제는 솔직히 이야기해야 해요. 미루지 마세요.'}, ja:{up:'長期的なもの、家族、残していくもの。築いてきたものが安定している。', rev:'家のお金のことは率直に話す必要がある。先延ばしにしないで。'} },
      { en:{up:'Good news about study, money, a very practical fresh start. Sign up for it.', rev:'Procrastinating, or a plan that only exists in your head so far.'}, zh:{up:'关于学业、金钱、一个很实际的新开始的好消息，去报名吧。', rev:'一拖再拖，或计划还只停在脑子里。'}, ko:{up:'학업, 돈, 아주 현실적인 새 출발에 대한 좋은 소식이에요. 등록해보세요.', rev:'미루고 있거나, 계획이 아직 머릿속에만 있어요.'}, ja:{up:'学び、お金、とても現実的な新しい始まりについての良い知らせ。申し込んでみて。', rev:'先延ばしにしている、あるいは計画がまだ頭の中だけにある。'} },
      { en:{up:'Slow but sure, steady and lasting. Not flashy, but it gets there.', rev:'Standing still, or too cautious and missing the moment.'}, zh:{up:'慢而稳，扎实而持久，不亮眼但能到达。', rev:'原地踏步，或太谨慎而错过时机。'}, ko:{up:'느리지만 확실하게, 꾸준하고 오래가요. 화려하진 않아도 도착해요.', rev:'제자리걸음이거나, 너무 신중해서 기회를 놓쳐요.'}, ja:{up:'ゆっくりでも確実に、着実に長く続く。派手ではないが到達する。', rev:'足踏みしている、あるいは慎重すぎて機会を逃す。'} },
      { en:{up:'Practical care: cook a meal, tidy a corner, get a check-up. This fits right now.', rev:'Forgetting to take care of yourself, or caring for others until you are empty.'}, zh:{up:'实际的照顾：做一顿饭、整理一角、去检查一次，此刻很合适。', rev:'忘了照顾自己，或照顾别人到透支。'}, ko:{up:'실질적인 돌봄: 밥 한 끼, 정리 한 구석, 검진 한 번. 지금 딱 맞아요.', rev:'자신을 돌보는 걸 잊거나, 남을 챙기다 지쳐요.'}, ja:{up:'実際的な世話：一食作る、一角を片付ける、一度診てもらう。今にぴったり。', rev:'自分の世話を忘れている、あるいは他人の世話をしすぎて尽きている。'} },
      { en:{up:'Solid, comfortable, good at holding onto both money and people. You are in a position of strength.', rev:'Gripping material things too tightly, or stubborn against advice that is actually right.'}, zh:{up:'稳固、宽裕，懂得留住财富也留住人，你正处于强势位置。', rev:'抓物质抓太紧，或对正确的建议太固执。'}, ko:{up:'든든하고 여유 있고, 재물도 사람도 지킬 줄 알아요. 강한 자리에 있어요.', rev:'물질에 너무 집착하거나, 맞는 조언에도 고집을 부려요.'}, ja:{up:'安定していて余裕があり、財産も人も守り方を知っている。強い立場にいる。', rev:'物質に固執しすぎている、あるいは正しい助言に頑固になっている。'} }
    ]
  };

  /* Tên riêng 22 lá Ẩn Chính theo từng ngôn ngữ (EN dùng thẳng card.name có sẵn) */
  const majorNames = {
    zh: ['愚者','魔术师','女祭司','女皇','皇帝','教皇','恋人','战车','力量','隐士','命运之轮','正义','倒吊人','死神','节制','恶魔','高塔','星星','月亮','太阳','审判','世界'],
    ko: ['바보','마법사','여사제','여황제','황제','교황','연인','전차','힘','은둔자','운명의 수레바퀴','정의','매달린 사람','죽음','절제','악마','탑','별','달','태양','심판','세계'],
    ja: ['愚者','魔術師','女教皇','女帝','皇帝','教皇','恋人','戦車','力','隠者','運命の輪','正義','吊された男','死神','節制','悪魔','塔','星','月','太陽','審判','世界']
  };

  return { major, suits, ranks, minor, majorNames };
})();
