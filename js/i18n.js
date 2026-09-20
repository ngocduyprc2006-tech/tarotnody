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
    'foot.slogan':      { vi: 'Một góc nhỏ để bạn ngồi xuống, thở một nhịp và tự hỏi mình đang cần gì. Cún Nody luận giải dịu dàng, không doạ ai bao giờ.',
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
    'auth.welcomeSub':  { vi: 'Đăng nhập để Cún giữ giúp bạn mọi lá bài đã rút.',
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
    'auth.displayName': { vi: 'Bạn muốn Cún gọi bạn là gì?', en: 'What should Nody call you?', zh: '希望诺迪怎么称呼你？', ko: '노디가 뭐라고 부르면 될까요?', ja: 'ノディに呼んでほしい名前は？' },
    'auth.createAcct':  { vi: 'Tạo tài khoản', en: 'Create account', zh: '创建账号', ko: '계정 만들기', ja: 'アカウントを作成' },
    'auth.or':          { vi: 'hoặc', en: 'or', zh: '或', ko: '또는', ja: 'または' },
    'auth.continueGoogle': { vi: 'Tiếp tục với Google', en: 'Continue with Google', zh: '使用 Google 继续', ko: 'Google로 계속하기', ja: 'Googleで続ける' },
    'auth.logout':      { vi: 'Đăng xuất', en: 'Log out', zh: '退出登录', ko: '로그아웃', ja: 'ログアウト' },

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
    'help.section.assistant.title': { vi: '6. Trợ lý Cún AI', en: '6. Nody AI Assistant', zh: '6. 诺迪 AI 助手', ko: '6. 노디 AI 어시스턴트', ja: '6. ノディ AI アシスタント' },
    'help.section.assistant.body':  { vi: 'Bấm biểu tượng trò chuyện để hỏi Cún bất cứ điều gì về cách dùng web, ý nghĩa lá bài hay cách nạp tiền.',
                                       en: 'Tap the chat icon to ask Nody anything about using the site, card meanings, or how to top up.',
                                       zh: '点击聊天图标即可向诺迪询问关于网站使用、牌意或充值方式的任何问题。',
                                       ko: '채팅 아이콘을 눌러 사이트 이용법, 카드 의미, 충전 방법 등 무엇이든 노디에게 물어보세요.',
                                       ja: 'チャットアイコンをタップして、サイトの使い方・カードの意味・チャージ方法など何でもノディに聞いてみましょう。' },

    /* ---------- trợ lý AI ---------- */
    'assist.title':     { vi: 'Trợ lý Cún Nody', en: 'Nody Assistant', zh: '诺迪助手', ko: '노디 어시스턴트', ja: 'ノディアシスタント' },
    'assist.placeholder': { vi: 'Hỏi Cún điều gì đó…', en: 'Ask Nody something…', zh: '问问诺迪…', ko: '노디에게 물어보세요…', ja: 'ノディに聞いてみよう…' },
    'assist.greeting':  { vi: 'Chào bạn 🐾 Mình là Cún Nody. Bạn muốn hỏi về cách dùng web, ý nghĩa lá bài, hay nạp gói?',
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
    'photo.title':      { vi: 'Photobooth cùng Cún Nody', en: 'Photobooth with Nody', zh: 'Nody 拍照亭', ko: 'Nody 포토부스', ja: 'Nody フォトブース' },
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
