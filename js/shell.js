/* ============================================================
   shell.js — bộ khung dùng chung cho MỌI trang
   ------------------------------------------------------------
   Dựng thanh đầu trang, menu, chân trang, hộp đăng nhập, thông báo.
   Muốn thêm một trang mới vào menu: sửa mảng MENU bên dưới là xong.
   Đây là script thường (không phải module) nên chạy được cả khi
   mở bằng file:// — Firebase hỏng thì web vẫn dùng bình thường.
   ============================================================ */

(function () {
  'use strict';

  /* ==========================================================
     1. Danh mục — sửa ở đây là đổi menu toàn web
     ========================================================== */
  const MENU = [
    { href: 'tarot.html',      key: 'nav.tarot',      label: 'Trải bài Tarot' },
    { href: 'daily.html',      key: 'nav.daily',      label: 'Lá bài hôm nay' },
    { href: 'numerology.html', key: 'nav.numerology', label: 'Thần số học' },
    { href: 'horoscope.html',  key: 'nav.horoscope',  label: 'Chiêm tinh' },
    { href: 'match.html',      key: 'nav.match',      label: 'Ghép đôi' },
    { href: 'dream.html',      key: 'nav.dream',      label: 'Giải mã giấc mơ' },
    { href: 'wheel.html',      key: 'nav.wheel',      label: 'Vòng quay' },
    { href: 'letter.html',     key: 'nav.letter',     label: 'Thư gửi mai sau' },
    { href: 'photobooth.html', key: 'nav.photobooth', label: 'Photobooth' },
    { href: 'wallet.html',     key: 'nav.wallet',     label: 'Nạp & Gói' }
  ];

  function L(key, fallback) {
    return (window.I18N ? window.I18N.t(key) : null) || fallback;
  }

  /* ==========================================================
     2. Nody — linh vật, vẽ bằng SVG nên không cần file ảnh
     ========================================================== */
  function pupSVG(cls) {
    const id = 'm' + Math.random().toString(36).slice(2, 7);
    return `
<svg class="pup ${cls || ''}" viewBox="0 0 64 64" role="img" aria-label="Nody">
  <defs>
    <radialGradient id="${id}" cx="36%" cy="32%" r="70%">
      <stop offset="0%" stop-color="#fff6e2"/>
      <stop offset="60%" stop-color="var(--moon)"/>
      <stop offset="100%" stop-color="var(--moon-deep)"/>
    </radialGradient>
  </defs>
  <path d="M44 4a28 28 0 1 0 6 55 24 24 0 1 1-6-55z" fill="url(#${id})" opacity=".32"/>
  <g>
    <ellipse cx="16.5" cy="29" rx="6.6" ry="11.5" transform="rotate(-20 16.5 29)" fill="var(--moon-deep)"/>
    <ellipse cx="47.5" cy="29" rx="6.6" ry="11.5" transform="rotate(20 47.5 29)" fill="var(--moon-deep)"/>
    <circle cx="32" cy="32" r="16.5" fill="url(#${id})"/>
    <ellipse cx="32" cy="38.6" rx="9.6" ry="7.6" fill="#fff4e0" opacity=".92"/>
    <ellipse cx="32" cy="35.6" rx="3.1" ry="2.3" fill="#2e2140"/>
    <path d="M32 38v2.4M32 40.4c-1.5 2-4.4 1.6-5.2-.4M32 40.4c1.5 2 4.4 1.6 5.2-.4"
          stroke="#2e2140" stroke-width="1.25" fill="none" stroke-linecap="round"/>
    <circle cx="25.2" cy="29" r="2.5" fill="#2e2140"/>
    <circle cx="38.8" cy="29" r="2.5" fill="#2e2140"/>
    <circle cx="26" cy="28.2" r=".85" fill="#fff"/>
    <circle cx="39.6" cy="28.2" r=".85" fill="#fff"/>
    <path d="M32 17.2l1.5 3.1 3.4.5-2.5 2.4.6 3.4-3-1.6-3 1.6.6-3.4-2.5-2.4 3.4-.5z"
          fill="var(--blossom)" opacity=".95"/>
  </g>
</svg>`;
  }

  /* ==========================================================
     3. Ấn triện tròn — dùng cho lưng lá bài, mỗi hạt một hình
     ========================================================== */
  function sigil(seed, color) {
    const c = color || 'var(--moon)';
    let s = (seed * 2654435761) % 2147483647;
    if (s < 0) s += 2147483647;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;

    const pts = 5 + Math.floor(rnd() * 4);
    let d = '';
    for (let i = 0; i < pts * 2; i++) {
      const a = (Math.PI * 2 * i) / (pts * 2) - Math.PI / 2;
      const r = i % 2 === 0 ? 24 : 11;
      d += (i ? 'L' : 'M') + (32 + r * Math.cos(a)).toFixed(1) + ',' + (32 + r * Math.sin(a)).toFixed(1) + ' ';
    }
    d += 'Z';

    let rings = '';
    const n = 1 + Math.floor(rnd() * 2);
    for (let i = 0; i < n; i++) {
      rings += `<circle cx="32" cy="32" r="${28 - i * 8}" fill="none" stroke="${c}" stroke-width=".6" opacity="${0.5 - i * 0.16}"/>`;
    }
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${rings}
      <path d="${d}" fill="none" stroke="${c}" stroke-width="1.1" stroke-linejoin="round"/>
      <circle cx="32" cy="32" r="2.3" fill="${c}"/></svg>`;
  }

  /* ==========================================================
     4. Pha trăng — lớp "thời gian" của web
     ========================================================== */
  function moonPhase(date) {
    const d = date || new Date();
    // mốc trăng non 06/01/2000 18:14 UTC, chu kỳ 29.530588853 ngày
    const days = (d - new Date(Date.UTC(2000, 0, 6, 18, 14))) / 86400000;
    let age = days % 29.530588853;
    if (age < 0) age += 29.530588853;
    const frac = age / 29.530588853;

    const lg = (window.I18N && window.I18N.get()) || 'vi';
    const names = (MOON_PHASES[lg] || MOON_PHASES.vi);
    const idx = Math.floor(frac * 8 + 0.5) % 8;
    return { age, frac, name: names[idx][0], advice: names[idx][1], index: idx };
  }

  /* Bản dịch 8 pha trăng — dùng chung cho mọi trang gọi moonPhase().
     Thiếu ngôn ngữ nào thì rơi về tiếng Việt, không bao giờ để trống. */
  const MOON_PHASES = {
    vi: [
      ['Trăng non', 'Một khởi đầu vừa nhen. Hợp để đặt ý định, chưa cần vội làm.'],
      ['Trăng lưỡi liềm đầu', 'Ý định bắt đầu có hình. Ghi ra điều bạn muốn giữ.'],
      ['Trăng bán nguyệt đầu', 'Lúc phải chọn. Bỏ bớt một việc để việc còn lại thở được.'],
      ['Trăng khuyết đầu', 'Mọi thứ đang lớn dần. Kiên nhẫn thêm một nhịp nữa.'],
      ['Trăng tròn', 'Điều khuất bấy nay lộ rõ. Hợp để nhìn thẳng và nói thật.'],
      ['Trăng khuyết cuối', 'Đã đủ đầy, giờ là lúc chia lại và biết ơn.'],
      ['Trăng bán nguyệt cuối', 'Buông một điều đã hết duyên. Nhẹ hơn thì đi xa hơn.'],
      ['Trăng tàn', 'Khoảng lặng trước vòng mới. Nghỉ thật sự cũng là làm việc.']
    ],
    en: [
      ['New Moon', 'A beginning just lit. Good for setting an intention, no rush to act yet.'],
      ['Waxing Crescent', 'The intention starts taking shape. Write down what you want to keep.'],
      ['First Quarter', 'A moment to choose. Drop one thing so the rest can breathe.'],
      ['Waxing Gibbous', 'Everything is growing. A little more patience.'],
      ['Full Moon', 'What was hidden comes into view. Good for looking straight and speaking honestly.'],
      ['Waning Gibbous', 'You already have enough — time to share and give thanks.'],
      ['Last Quarter', 'Let go of something whose season has passed. Lighter travels farther.'],
      ['Waning Crescent', 'A quiet pause before the new cycle. Real rest is also work.']
    ],
    zh: [
      ['新月', '一个刚点亮的开始，适合许愿立意，还不急着行动。'],
      ['娥眉月', '想法开始成形，把想留住的东西写下来。'],
      ['上弦月', '该做选择了，放下一件事，让其余的能喘口气。'],
      ['盈凸月', '一切都在成长，再多一点耐心。'],
      ['满月', '藏着的东西显现出来，适合直视与坦诚表达。'],
      ['亏凸月', '已经足够圆满，是分享与感恩的时候。'],
      ['下弦月', '放下一段已尽的缘分，轻一点才能走更远。'],
      ['残月', '新周期前的安静停顿，好好休息也是一种功课。']
    ],
    ko: [
      ['삭 (신월)', '이제 막 켜진 시작이에요. 의도를 세우기 좋아요, 아직 서두를 필요는 없어요.'],
      ['초승달', '생각이 형태를 갖추기 시작해요. 지키고 싶은 걸 적어 두세요.'],
      ['상현달', '선택해야 할 때예요. 한 가지를 내려놓아야 나머지가 숨 쉴 수 있어요.'],
      ['상현망간달', '모든 게 자라나는 중이에요. 조금만 더 참을성을.'],
      ['보름달', '가려져 있던 게 드러나요. 똑바로 보고 솔직히 말하기 좋아요.'],
      ['하현망간달', '이미 충분히 찼어요, 이제 나누고 감사할 시간이에요.'],
      ['하현달', '인연이 다한 걸 놓아주세요. 가벼워야 더 멀리 가요.'],
      ['그믐달', '새 주기 전의 고요한 멈춤. 제대로 쉬는 것도 일이에요.']
    ],
    ja: [
      ['新月', 'ちょうど灯った始まり。意図を立てるのに向いていて、急いで動く必要はまだない。'],
      ['三日月', '意図が形になり始める。残しておきたいことを書き留めて。'],
      ['上弦の月', '選ぶべき時。ひとつ手放せば、残りが息をつける。'],
      ['十三夜月', 'すべてが育っている最中。もう少しだけ辛抱を。'],
      ['満月', '隠れていたものが見えてくる。まっすぐ見て、正直に話すのに向いている。'],
      ['寝待月', 'もう十分に満ちた。分かち合い、感謝する時。'],
      ['下弦の月', '縁が尽きたものを手放して。軽いほど遠くまで行ける。'],
      ['有明月', '新しい周期の前の静かな間。本当に休むこともまた仕事。']
    ]
  };

  /* ==========================================================
     5. Giao diện sáng / tối (nhớ lựa chọn của bạn)
     ========================================================== */
  function applyTheme(mode) {
    document.body.classList.toggle('dawn', mode === 'dawn');
    const btn = document.getElementById('themeBtn');
    if (btn) {
      btn.textContent = mode === 'dawn' ? '🌙' : '☀️';
      btn.title = mode === 'dawn' ? 'Chuyển sang đêm' : 'Chuyển sang ban mai';
    }
    try { localStorage.setItem('nody.theme', mode); } catch (e) {}
    window.dispatchEvent(new CustomEvent('nody:theme', { detail: mode }));
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('nody.theme'); } catch (e) {}
    if (!saved) {
      const h = new Date().getHours();      // lần đầu ghé: tự chọn theo giờ thật
      saved = (h >= 6 && h < 18) ? 'dawn' : 'night';
    }
    applyTheme(saved);
  }

  /* ==========================================================
     6. Thông báo nhỏ
     ========================================================== */
  function toast(msg, isError) {
    let box = document.getElementById('toasts');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toasts';
      document.body.appendChild(box);
    }
    const t = document.createElement('div');
    t.className = 'toast' + (isError ? ' err' : '');
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity .3s, transform .3s';
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
      setTimeout(() => t.remove(), 320);
    }, 3200);
  }

  /* ==========================================================
     7. Dựng thanh đầu trang & chân trang
     ========================================================== */
  // Tên trang đang mở. Chấp nhận cả "/tarot" lẫn "/tarot.html" lẫn "/" .
  const here = (function () {
    let p = (location.pathname.split('/').pop() || '').toLowerCase();
    if (!p) return 'index.html';
    if (!p.endsWith('.html')) p += '.html';
    return p;
  })();

  function buildHeader() {
    const host = document.getElementById('site-head');
    if (!host) return;
    const m = moonPhase();

    host.className = 'site-head';
    host.innerHTML = `
      <div class="wrap head-row">
        <a class="brand" href="index.html">
          ${pupSVG()}
          <span class="brand-name">Nody <b>Tarot</b></span>
        </a>

        <button class="nav-toggle" id="navToggle" aria-label="Mở danh mục" aria-expanded="false">☰</button>

        <nav class="nav" id="nav">
          ${MENU.map(i => `<a href="${i.href}"${i.href.toLowerCase() === here ? ' class="on"' : ''}>${L(i.key, i.label)}</a>`).join('')}
        </nav>

        <div class="head-tools">
          ${langSwitcherHTML()}
          <button class="icon-btn" id="fxBtn" title="${L('fx.auto', 'Hiệu ứng: Tự động')}">${fxIcon()}</button>
          <button class="icon-btn" id="themeBtn" title="Đổi giao diện">☀️</button>
          <span id="adminLinkSlot"></span>
          <button class="acct-btn" id="acctBtn">
            <span class="avatar" id="acctAvatar">?</span>
            <span id="acctText">${L('head.login', 'Đăng nhập')}</span>
          </button>
        </div>
      </div>

      <div class="moon-strip">
        <span>${L('head.today', 'Hôm nay')} <b>${new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}</b></span>
        <i class="dot"></i>
        <span>${moonGlyph(m.index)} <b>${m.name}</b></span>
        <i class="dot"></i>
        <span class="mute">${m.advice}</span>
      </div>`;

    document.getElementById('navToggle').onclick = (e) => {
      const nav = document.getElementById('nav');
      const open = nav.classList.toggle('open');
      e.currentTarget.setAttribute('aria-expanded', open);
      e.currentTarget.textContent = open ? '✕' : '☰';
    };

    document.getElementById('themeBtn').onclick = () => {
      applyTheme(document.body.classList.contains('dawn') ? 'night' : 'dawn');
    };

    document.getElementById('fxBtn').onclick = cycleFx;

    document.getElementById('acctBtn').onclick = () => {
      if (window.Nody && window.Nody.user) location.href = 'history.html';
      else openAuth('login');
    };

    wireLangSwitcher();
    paintAdminLink();
  }

  /* ==========================================================
     6b. Nút bật/tắt hiệu ứng — Tự động ⇄ Bật ⇄ Tắt, nhớ theo máy
     ========================================================== */
  function fxIcon() {
    // Chỉ 1 ký tự/emoji cho mỗi trạng thái — 2 emoji ghép lại sẽ tràn
    // ra ngoài vòng tròn 38px của .icon-btn (đây chính là lỗi tràn cũ).
    const mode = window.NodyPerf ? window.NodyPerf.overrideMode : null;
    if (mode === 'off') return '🌑';
    if (mode === 'on') return '✨';
    return '🌗';
  }

  function cycleFx() {
    if (!window.NodyPerf) return;
    const cur = window.NodyPerf.overrideMode; // null | 'on' | 'off'
    const next = cur === null ? 'off' : cur === 'off' ? 'on' : null;
    window.NodyPerf.setOverride(next);
    const btn = document.getElementById('fxBtn');
    if (btn) {
      btn.innerHTML = fxIcon();
      btn.title = next === 'off' ? L('fx.off', 'Hiệu ứng: Đã tắt (mượt hơn)')
                : next === 'on' ? L('fx.on', 'Hiệu ứng: Đang bật')
                : L('fx.auto', 'Hiệu ứng: Tự động');
    }
    if (window.Shell && window.Shell.toast) {
      window.Shell.toast(btn ? btn.title : '');
    }
  }

  /* ==========================================================
     6c. Lối vào trang Quản trị — chỉ hiện khi tài khoản là admin
     ========================================================== */
  function paintAdminLink() {
    const slot = document.getElementById('adminLinkSlot');
    if (!slot) return;
    const isAdmin = !!(window.Nody && window.Nody.isAdmin && window.Nody.isAdmin());
    slot.innerHTML = isAdmin
      ? `<a class="icon-btn" href="admin.html" title="${L('admin.linkTitle', 'Trang quản trị')}" style="text-decoration:none;display:grid;place-items:center">⚙️</a>`
      : '';
  }

  /* ==========================================================
     7b. Bộ chọn ngôn ngữ — 5 lá cờ, đổi là dịch toàn trang ngay
     ========================================================== */
  function flagBadge(code, size) {
    const meta = window.I18N.meta[code] || { flag: '🌐', cc: '' };
    const px = size || 20;
    if (!meta.cc) return `<span class="flag-badge" style="width:${px}px;height:${px}px;font-size:${px * .6}px">${meta.flag}</span>`;
    return `<span class="flag-badge" style="width:${px}px;height:${px}px">
      <img src="https://flagcdn.com/w80/${meta.cc}.png" alt=""
           onerror="this.parentElement.textContent='${meta.flag}'">
    </span>`;
  }

  function langSwitcherHTML() {
    if (!window.I18N) return '';
    const cur = window.I18N.get();
    const items = window.I18N.langs.map(code => {
      const m = window.I18N.meta[code];
      return `<button class="lang-item${code === cur ? ' on' : ''}" data-lang="${code}">
                ${flagBadge(code, 24)}<span>${m.label}</span>
              </button>`;
    }).join('');
    return `
      <div class="lang-switch" id="langSwitch">
        <button class="icon-btn lang-trigger" id="langBtn" title="${L('head.langLabel', 'Ngôn ngữ')}" aria-haspopup="true" aria-expanded="false">
          ${flagBadge(cur, 24)}
        </button>
        <div class="lang-menu" id="langMenu">${items}</div>
      </div>`;
  }

  function wireLangSwitcher() {
    const btn = document.getElementById('langBtn');
    const menu = document.getElementById('langMenu');
    const wrap = document.getElementById('langSwitch');
    if (!btn || !menu || !wrap) return;
    btn.onclick = (e) => {
      e.stopPropagation();
      const open = wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    };
    menu.querySelectorAll('[data-lang]').forEach(b => {
      b.onclick = () => {
        window.I18N.setLang(b.getAttribute('data-lang'));
        wrap.classList.remove('open');
      };
    });
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) wrap.classList.remove('open');
    });
  }

  function moonGlyph(i) {
    return ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'][i] || '🌙';
  }

  function buildFooter() {
    const host = document.getElementById('site-foot');
    if (!host) return;
    host.className = 'site-foot';
    host.innerHTML = `
      <div class="wrap foot-grid">
        <div>
          <a class="brand" href="index.html">${pupSVG()}<span class="brand-name">Nody <b>Tarot</b></span></a>
          <p class="soft" style="font-size:.9rem;margin-top:14px;max-width:34ch">${L('foot.slogan', 'Một góc nhỏ để bạn ngồi xuống, thở một nhịp và tự hỏi mình đang cần gì. Nody luận giải dịu dàng, không doạ ai bao giờ.')}</p>
        </div>
        <div>
          <h4>${L('foot.group1', 'Bói bài &amp; con số')}</h4>
          <div class="foot-links">
            <a href="tarot.html">${L('nav.tarot', 'Trải bài Tarot')}</a>
            <a href="daily.html">${L('nav.daily', 'Lá bài hôm nay')}</a>
            <a href="numerology.html">${L('nav.numerology', 'Thần số học')}</a>
            <a href="horoscope.html">${L('nav.horoscope', 'Chiêm tinh')}</a>
            <a href="match.html">${L('nav.match', 'Ghép đôi')}</a>
          </div>
        </div>
        <div>
          <h4>${L('foot.group2', 'Nhẹ nhàng hơn')}</h4>
          <div class="foot-links">
            <a href="dream.html">${L('nav.dream', 'Giải mã giấc mơ')}</a>
            <a href="wheel.html">${L('nav.wheel', 'Vòng quay Nody')}</a>
            <a href="letter.html">${L('nav.letter', 'Thư gửi mai sau')}</a>
            <a href="photobooth.html">${L('nav.photobooth', 'Photobooth')}</a>
            <a href="wallet.html">${L('nav.wallet', 'Nạp & Gói')}</a>
            <a href="history.html">${L('nav.history', 'Lịch sử &amp; hồ sơ')}</a>
          </div>
        </div>
      </div>
      <div class="wrap foot-note">
        <span>© ${new Date().getFullYear()} ${L('foot.rights', 'Nody Tarot')}</span>
        <span>${L('foot.note', 'Tarot là tấm gương soi, không phải bản án. Quyết định luôn là của bạn.')}</span>
      </div>`;
  }

  /* ==========================================================
     8. Hộp đăng nhập / đăng ký
     ========================================================== */
  function buildAuthModal() {
    if (document.getElementById('authModal')) return;
    const el = document.createElement('div');
    el.className = 'modal';
    el.id = 'authModal';
    el.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true" aria-label="Đăng nhập">
        <button class="modal-x" data-close>✕</button>

        <div class="auth-head">
          ${pupSVG()}
          <h3 id="authTitle">${L('auth.welcomeBack', 'Chào bạn trở lại')}</h3>
          <p id="authSub">${L('auth.welcomeSub', 'Đăng nhập để Nody giữ giúp bạn mọi lá bài đã rút.')}</p>
        </div>

        <div class="auth-tabs">
          <button id="tabLogin" class="on" data-tab="login">${L('auth.login', 'Đăng nhập')}</button>
          <button id="tabReg" data-tab="reg">${L('auth.register', 'Đăng ký')}</button>
        </div>

        <div class="auth-pane on" id="paneLogin">
          <div class="field"><label for="liMail">${L('auth.email', 'Email')}</label>
            <input class="input" type="email" id="liMail" autocomplete="email" placeholder="ban@email.com"></div>
          <div class="field"><label for="liPass">${L('auth.password', 'Mật khẩu')}</label>
            <input class="input" type="password" id="liPass" autocomplete="current-password" placeholder="••••••"></div>
          <div style="text-align:right;margin:-6px 0 14px">
            <button class="link-btn tiny" id="btnForgot">${L('auth.forgot', 'Quên mật khẩu?')}</button>
          </div>
          <button class="btn btn-moon btn-block" id="btnDoLogin">${L('auth.enterSpace', 'Vào không gian của bạn')}</button>
        </div>

        <div class="auth-pane" id="paneReg">
          <div class="field"><label for="rgName">${L('auth.displayName', 'Bạn muốn Nody gọi bạn là gì?')}</label>
            <input class="input" type="text" id="rgName" autocomplete="name" placeholder="Tên hiển thị"></div>
          <div class="field"><label for="rgMail">${L('auth.email', 'Email')}</label>
            <input class="input" type="email" id="rgMail" autocomplete="email" placeholder="ban@email.com"></div>
          <div class="field"><label for="rgPass">${L('auth.password', 'Mật khẩu')}</label>
            <input class="input" type="password" id="rgPass" autocomplete="new-password" placeholder="${L('auth.passwordPlaceholder', 'Tối thiểu 8 ký tự, có hoa + số + ký tự đặc biệt')}"></div>
          <div class="field"><label for="rgPass2">${L('auth.confirmPassword', 'Nhập lại mật khẩu')}</label>
            <input class="input" type="password" id="rgPass2" autocomplete="new-password" placeholder="${L('auth.confirmPasswordPlaceholder', 'Gõ lại y hệt mật khẩu ở trên')}"></div>
          <p class="tiny mute" id="pwHint" style="margin:-6px 0 12px;line-height:1.5">${L('auth.passwordRule', 'Mật khẩu cần từ 8 ký tự, có ít nhất 1 chữ HOA, 1 số và 1 ký tự đặc biệt (!@#$…).')}</p>
          <button class="btn btn-moon btn-block" id="btnDoReg">${L('auth.createAcct', 'Tạo tài khoản')}</button>
        </div>

        <div class="divider"><span>${L('auth.or', 'hoặc')}</span></div>

        <button class="btn btn-ghost google-btn" id="btnGoogle">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          ${L('auth.continueGoogle', 'Tiếp tục với Google')}
        </button>

        <div class="auth-msg" id="authMsg"></div>
        <div class="auth-foot" id="authOffline"></div>
      </div>`;
    document.body.appendChild(el);

    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.hasAttribute('data-close')) closeAuth();
    });

    el.querySelectorAll('[data-tab]').forEach(b => {
      b.onclick = () => switchTab(b.dataset.tab);
    });

    document.getElementById('btnDoLogin').onclick = doLogin;
    document.getElementById('btnDoReg').onclick = doRegister;
    document.getElementById('btnGoogle').onclick = doGoogle;
    document.getElementById('btnForgot').onclick = doForgot;

    // Đổi màu gợi ý mật khẩu theo thời gian thực để người dùng biết
    // ngay mình còn thiếu điều kiện nào, không cần bấm gửi mới biết sai.
    const pwHintEl = document.getElementById('pwHint');
    const updatePwHint = () => {
      if (!pwHintEl) return;
      const p1 = document.getElementById('rgPass').value;
      const p2 = document.getElementById('rgPass2').value;
      pwHintEl.classList.remove('ok', 'err');
      if (!p1 && !p2) return;
      if (passwordRuleOk(p1) && (!p2 || p1 === p2)) pwHintEl.classList.add('ok');
      else pwHintEl.classList.add('err');
    };
    document.getElementById('rgPass').addEventListener('input', updatePwHint);
    document.getElementById('rgPass2').addEventListener('input', updatePwHint);

    // Enter để gửi
    ['liPass', 'liMail'].forEach(id =>
      document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); }));
    ['rgPass', 'rgPass2', 'rgMail', 'rgName'].forEach(id =>
      document.getElementById(id).addEventListener('keydown', e => { if (e.key === 'Enter') doRegister(); }));
  }

  function switchTab(tab) {
    document.getElementById('tabLogin').classList.toggle('on', tab === 'login');
    document.getElementById('tabReg').classList.toggle('on', tab === 'reg');
    document.getElementById('paneLogin').classList.toggle('on', tab === 'login');
    document.getElementById('paneReg').classList.toggle('on', tab === 'reg');
    document.getElementById('authTitle').textContent =
      tab === 'login' ? L('auth.welcomeBack', 'Chào bạn trở lại') : L('auth.newSpace', 'Tạo một góc riêng');
    document.getElementById('authSub').textContent =
      tab === 'login'
        ? L('auth.welcomeSub', 'Đăng nhập để Nody giữ giúp bạn mọi lá bài đã rút.')
        : L('auth.newSpaceSub', 'Có tài khoản rồi thì lịch sử xem bói sẽ theo bạn qua mọi thiết bị.');
    msg('');
  }

  function msg(text, type) {
    const el = document.getElementById('authMsg');
    if (!el) return;
    el.textContent = text || '';
    el.className = 'auth-msg' + (type ? ' ' + type : '');
  }

  function openAuth(tab) {
    buildAuthModal();
    switchTab(tab || 'login');
    document.getElementById('authModal').classList.add('open');
    const note = document.getElementById('authOffline');
    if (!window.Nody) {
      note.innerHTML = 'Chưa kết nối được Firebase. Nếu bạn đang mở web bằng cách nháy đúp vào file, ' +
        'hãy chạy <b>firebase serve</b> hoặc mở qua địa chỉ http:// để đăng nhập được.';
    } else { note.textContent = ''; }
    setTimeout(() => {
      const f = document.getElementById(tab === 'reg' ? 'rgName' : 'liMail');
      if (f && window.innerWidth > 760) f.focus();
    }, 220);
  }

  function closeAuth() {
    const el = document.getElementById('authModal');
    if (el) el.classList.remove('open');
    msg('');
  }

  function needFirebase() {
    if (!window.Nody) {
      msg('Chưa kết nối được Firebase. Bạn mở web qua http:// giúp mình nhé.', 'err');
      return false;
    }
    return true;
  }

  async function doLogin() {
    if (!needFirebase()) return;
    const mail = document.getElementById('liMail').value.trim();
    const pass = document.getElementById('liPass').value;
    if (!mail || !pass) return msg('Bạn nhập email và mật khẩu giúp mình nhé.', 'err');
    msg('Đang mở cửa…');
    try {
      await window.Nody.login(mail, pass);
      closeAuth();
      toast('Chào bạn trở lại 🌙');
    } catch (e) { msg(window.Nody.readError(e), 'err'); }
  }

  /* Quy tắc mật khẩu: tối thiểu 8 ký tự, có ít nhất 1 chữ HOA,
     1 chữ số và 1 ký tự đặc biệt — tránh mật khẩu quá đơn giản
     hoặc đặt bậy bạ (chuỗi lặp, toàn số...). */
  function passwordRuleOk(pass) {
    if (!pass || pass.length < 8) return false;
    if (!/[A-Z]/.test(pass)) return false;
    if (!/[0-9]/.test(pass)) return false;
    if (!/[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/.test(pass)) return false;
    if (/^(.)\1+$/.test(pass)) return false;          // toàn 1 ký tự lặp lại
    if (/^(01234567|12345678|password|11111111)/i.test(pass)) return false;
    return true;
  }

  async function doRegister() {
    if (!needFirebase()) return;
    const name = document.getElementById('rgName').value.trim();
    const mail = document.getElementById('rgMail').value.trim();
    const pass = document.getElementById('rgPass').value;
    const pass2 = document.getElementById('rgPass2').value;
    if (!name || !mail || !pass || !pass2) return msg(L('auth.errMissing', 'Còn thiếu một ô chưa điền.'), 'err');
    if (!passwordRuleOk(pass)) {
      return msg(L('auth.passwordRule', 'Mật khẩu cần từ 8 ký tự, có ít nhất 1 chữ HOA, 1 số và 1 ký tự đặc biệt (!@#$…).'), 'err');
    }
    if (pass !== pass2) return msg(L('auth.passwordMismatch', 'Hai lần nhập mật khẩu chưa khớp nhau, bạn xem lại nhé.'), 'err');
    msg(L('auth.creating', 'Đang tạo tài khoản…'));
    try {
      await window.Nody.register(name, mail, pass);
      closeAuth();
      toast(L('auth.createdToast', 'Xong rồi, chào ') + name + ' 🐾');
    } catch (e) { msg(window.Nody.readError(e), 'err'); }
  }

  async function doGoogle() {
    if (!needFirebase()) return;
    msg('Đang mở cửa sổ Google…');
    try {
      await window.Nody.loginGoogle();
      closeAuth();
      toast('Đăng nhập xong 🌙');
    } catch (e) { msg(window.Nody.readError(e), 'err'); }
  }

  async function doForgot() {
    if (!needFirebase()) return;
    const mail = document.getElementById('liMail').value.trim();
    if (!mail) return msg('Nhập email vào ô trên rồi bấm lại giúp mình.', 'err');
    try {
      await window.Nody.resetPassword(mail);
      msg('Đã gửi link đặt lại mật khẩu vào email của bạn.', 'ok');
    } catch (e) { msg(window.Nody.readError(e), 'err'); }
  }

  /* ==========================================================
     9. Cập nhật nút tài khoản khi trạng thái đăng nhập đổi
     ========================================================== */
  function paintAccount(user) {
    const txt = document.getElementById('acctText');
    const av  = document.getElementById('acctAvatar');
    if (!txt || !av) return;
    if (user) {
      const name = user.displayName || (user.email || '').split('@')[0] || 'Bạn';
      txt.textContent = name;
      av.textContent = name.trim().charAt(0).toUpperCase();
      av.style.background = 'linear-gradient(140deg, var(--moon), var(--blossom))';
    } else {
      txt.textContent = L('head.login', 'Đăng nhập');
      av.textContent = '🐾';
      av.style.background = 'transparent';
    }
    document.body.classList.toggle('signed-in', !!user);
    paintAdminLink();
  }

  /* ==========================================================
     10. Khởi động
     ========================================================== */
  function boot() {
    initTheme();
    buildHeader();
    buildFooter();
    buildHelpButton();
    buildAssistant();
    applyTheme(document.body.classList.contains('dawn') ? 'dawn' : 'night');
    paintAccount(window.Nody && window.Nody.user);
    if (window.I18N) window.I18N.apply();

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
    });
  }

  window.addEventListener('nody:auth', (e) => paintAccount(e.detail));

  /* Đổi ngôn ngữ xong: vẽ lại toàn bộ khung để không sót chữ nào */
  window.addEventListener('nody:lang', () => {
    buildHeader();
    buildFooter();
    paintAccount(window.Nody && window.Nody.user);
    if (document.getElementById('authModal')) {
      switchTab(document.getElementById('tabLogin').classList.contains('on') ? 'login' : 'reg');
    }
    renderHelpBody();
    renderAssistantGreeting();
    if (window.I18N) window.I18N.apply();
  });

  /* ==========================================================
     11. Nút hỗ trợ nổi — kéo-thả tự do, có hướng dẫn dùng web
     ========================================================== */
  const HELP_SECTIONS = ['nav', 'tools', 'account', 'plans', 'photobooth', 'assistant'];

  function buildHelpButton() {
    if (document.getElementById('helpFab')) return;

    const fab = document.createElement('button');
    fab.id = 'helpFab';
    fab.className = 'floating-fab help-fab';
    fab.innerHTML = pupSVG('fab-pup');
    fab.setAttribute('aria-label', 'Help');
    fab.title = L('help.btnTitle', 'Trợ giúp — cách dùng web');
    document.body.appendChild(fab);

    const pos = Shell.store.get('helpFabPos', null);
    if (pos && typeof pos.right === 'number' && typeof pos.bottom === 'number') {
      fab.style.right = pos.right + 'px';
      fab.style.bottom = pos.bottom + 'px';
    }

    makeDraggable(fab, (right, bottom) => Shell.store.set('helpFabPos', { right, bottom }));

    fab.addEventListener('click', (e) => {
      if (fab.dataset.dragged === '1') { fab.dataset.dragged = '0'; return; }
      openHelp();
    });

    buildHelpModal();
  }

  function makeDraggable(el, onDrop) {
    let sx = 0, sy = 0, startRight = 0, startBottom = 0, dragging = false, moved = false;

    function start(x, y) {
      dragging = true; moved = false;
      sx = x; sy = y;
      const r = el.getBoundingClientRect();
      startRight = window.innerWidth - r.right;
      startBottom = window.innerHeight - r.bottom;
      el.classList.add('dragging');
    }
    function move(x, y) {
      if (!dragging) return;
      const dx = x - sx, dy = y - sy;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      let right = startRight - dx;
      let bottom = startBottom - dy;
      const w = el.offsetWidth, h = el.offsetHeight;
      right = Math.max(-w * 0.4, Math.min(window.innerWidth - w * 0.6, right));
      bottom = Math.max(-h * 0.4, Math.min(window.innerHeight - h * 0.6, bottom));
      el.style.right = right + 'px';
      el.style.bottom = bottom + 'px';
    }
    function end() {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('dragging');
      if (moved) {
        el.dataset.dragged = '1';
        const right = parseFloat(el.style.right) || 0;
        const bottom = parseFloat(el.style.bottom) || 0;
        onDrop(right, bottom);
      }
    }

    el.addEventListener('mousedown', (e) => { start(e.clientX, e.clientY); e.preventDefault(); });
    window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
    window.addEventListener('mouseup', end);

    el.addEventListener('touchstart', (e) => {
      const t = e.touches[0]; start(t.clientX, t.clientY);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      const t = e.touches[0]; move(t.clientX, t.clientY);
    }, { passive: true });
    window.addEventListener('touchend', end);
  }

  function buildHelpModal() {
    if (document.getElementById('helpModal')) return;
    const el = document.createElement('div');
    el.className = 'modal';
    el.id = 'helpModal';
    el.innerHTML = `
      <div class="modal-box help-box" role="dialog" aria-modal="true">
        <button class="modal-x" data-close>✕</button>
        <div id="helpBody"></div>
      </div>`;
    document.body.appendChild(el);
    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.hasAttribute('data-close')) el.classList.remove('open');
    });
    renderHelpBody();
  }

  function renderHelpBody() {
    const host = document.getElementById('helpBody');
    if (!host) return;
    host.innerHTML = `
      ${pupSVG()}
      <h3>${L('help.title', 'Hướng dẫn dùng Nody Tarot')}</h3>
      <p class="mute" style="font-size:.92rem">${L('help.dragHint', 'Mẹo: giữ và kéo nút 🐾 để đặt nó ở bất kỳ đâu trên màn hình.')}</p>
      <div class="help-sections">
        ${HELP_SECTIONS.map(s => `
          <div class="help-sec">
            <h4>${L('help.section.' + s + '.title', s)}</h4>
            <p>${L('help.section.' + s + '.body', '')}</p>
          </div>`).join('')}
      </div>`;
  }

  function openHelp() {
    buildHelpModal();
    document.getElementById('helpModal').classList.add('open');
  }

  /* ==========================================================
     12. Trợ lý Nody AI — hỏi đáp dựa trên luật, chạy offline
     ------------------------------------------------------------
     Không gọi API ngoài (không cần khoá bí mật) nên luôn hoạt
     động. Muốn nối vào Claude/API thật: xem ghi chú trong README.
     ========================================================== */
  const ASSIST_RULES = [
    { test: /(ngôn ngữ|language|语言|언어|言語|đổi tiếng)/i, key: 'help.section.nav.body' },
    { test: /(nạp|top.?up|충전|充值|チャージ|gói|plan|membership|vip)/i, key: 'help.section.plans.body' },
    { test: /(photobooth|chụp ảnh|拍照|포토|フォトブース|camera)/i, key: 'help.section.photobooth.body' },
    { test: /(lịch sử|history|hồ sơ|记录|기록|履歴|account|tài khoản)/i, key: 'help.section.account.body' },
    { test: /(admin|quản trị|管理)/i, key: 'admin.title' },
    { test: /(tarot|lá bài|card|카드|카드|牌|바로)/i, key: 'help.section.tools.body' }
  ];

  function buildAssistant() {
    if (document.getElementById('assistFab')) return;
    const fab = document.createElement('button');
    fab.id = 'assistFab';
    fab.className = 'floating-fab assist-fab';
    fab.innerHTML = '💬';
    fab.title = L('assist.title', 'Trợ lý Nody');
    document.body.appendChild(fab);

    const panel = document.createElement('div');
    panel.id = 'assistPanel';
    panel.className = 'assist-panel';
    panel.innerHTML = `
      <div class="assist-head">
        ${pupSVG()}
        <b id="assistTitle">${L('assist.title', 'Trợ lý Nody')}</b>
        <button class="modal-x" id="assistClose">✕</button>
      </div>
      <div class="assist-log" id="assistLog"></div>
      <form class="assist-form" id="assistForm">
        <input class="input" id="assistInput" data-i18n-placeholder="assist.placeholder" placeholder="${L('assist.placeholder', 'Hỏi Nody điều gì đó…')}" autocomplete="off">
        <button class="btn btn-moon" type="submit">➤</button>
      </form>`;
    document.body.appendChild(panel);

    fab.onclick = () => {
      panel.classList.toggle('open');
      if (panel.classList.contains('open') && !panel.dataset.greeted) {
        renderAssistantGreeting();
        panel.dataset.greeted = '1';
      }
    };
    document.getElementById('assistClose').onclick = () => panel.classList.remove('open');

    document.getElementById('assistForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('assistInput');
      const q = input.value.trim();
      if (!q) return;
      addAssistLine(q, 'me');
      input.value = '';
      setTimeout(() => addAssistLine(answerAssistant(q), 'bot'), 260);
    });
  }

  function addAssistLine(text, who) {
    const log = document.getElementById('assistLog');
    if (!log) return;
    const row = document.createElement('div');
    row.className = 'assist-line ' + who;
    row.textContent = text;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  function renderAssistantGreeting() {
    const log = document.getElementById('assistLog');
    if (!log) return;
    log.innerHTML = '';
    addAssistLine(L('assist.greeting', "Chào bạn 🐾 Mình là Nody."), 'bot');
  }

  function answerAssistant(q) {
    for (const rule of ASSIST_RULES) {
      if (rule.test.test(q)) return L(rule.key, '');
    }
    return L('assist.fallback', 'Mình chưa chắc câu này, thử hỏi cách khác nhé.');
  }

  /* ---------- Xuất ra cho các file khác dùng ---------- */
  window.Shell = {
    pupSVG, sigil, moonPhase, moonGlyph,
    toast, openAuth, closeAuth, applyTheme,
    menu: MENU,

    /* Yêu cầu đăng nhập; trả về true nếu đã đăng nhập */
    requireLogin(why) {
      if (window.Nody && window.Nody.user) return true;
      toast(why || 'Bạn đăng nhập trước nhé, để Nody giữ giúp kết quả.', true);
      openAuth('login');
      return false;
    },

    /* Lưu một lượt xem — im lặng bỏ qua nếu chưa đăng nhập */
    async log(data) {
      if (!window.Nody || !window.Nody.user) return;
      try { await window.Nody.saveReading(data); } catch (e) { console.warn('Không lưu được:', e); }
    },

    /* Bộ sinh số ngẫu nhiên có hạt giống — cùng hạt thì cùng kết quả */
    seeded(seedStr) {
      let h = 2166136261;
      for (let i = 0; i < seedStr.length; i++) {
        h ^= seedStr.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      let s = h >>> 0;
      return function () {
        s ^= s << 13; s >>>= 0;
        s ^= s >> 17;
        s ^= s << 5;  s >>>= 0;
        return s / 4294967296;
      };
    },

    /* Xáo mảng tại chỗ */
    shuffle(arr, rnd) {
      const r = rnd || Math.random;
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    /* Ngày dạng 2026-09-19 */
    today() {
      const d = new Date();
      return d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
    },

    /* Lưu tạm trên máy, an toàn cả khi trình duyệt chặn */
    store: {
      get(k, fallback) {
        try { const v = localStorage.getItem('nody.' + k); return v === null ? fallback : JSON.parse(v); }
        catch (e) { return fallback; }
      },
      set(k, v) {
        try { localStorage.setItem('nody.' + k, JSON.stringify(v)); } catch (e) {}
      }
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
