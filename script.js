/* ============ BACKGROUND: stars + wisps ============ */
(function() {
    const skyEl = document.getElementById('stars');
    const n = window.innerWidth < 640 ? 60 : 120;
    for (let i = 0; i < n; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const size = Math.random() * 2 + 0.6;
        s.style.width = size + 'px';
        s.style.height = size + 'px';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.animationDelay = (Math.random() * 4) + 's';
        s.style.animationDuration = (3 + Math.random() * 3) + 's';
        skyEl.appendChild(s);
    }
    const w1 = document.createElement('div');
    w1.className = 'wisp';
    w1.style.cssText += 'width:420px;height:420px;left:-100px;top:-80px;background:var(--gold-soft);';
    const w2 = document.createElement('div');
    w2.className = 'wisp';
    w2.style.cssText += 'width:360px;height:360px;right:-80px;bottom:-60px;background:var(--gold);';
    document.body.appendChild(w1);
    document.body.appendChild(w2);
})();

/* ============ THAY ĐỔI GIAO DIỆN SÁNG / TỐI ============ */
const themeBtn = document.getElementById('themeToggle');
themeBtn.onclick = () => {
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('light-theme')) {
        themeBtn.textContent = '🌙';
    } else {
        themeBtn.textContent = '☀️';
    }
    if (document.getElementById('screen-reading').classList.contains('active')) {
        const sp = SPREADS.find(s => s.id === state.spread);
        if (sp) buildReadingTable(sp);
    }
};

/* ============ SIGIL GENERATOR (Dành cho Lưng Bài & Icon Spread) ============ */
function sigilSVG(seed, colorVar) {
    const color = colorVar || 'var(--gold-soft)';
    let s = seed * 2654435761 % 2147483647;
    if (s < 0) s += 2147483647;

    function rnd() { s = s * 16807 % 2147483647; return s / 2147483647; }
    const points = 5 + Math.floor(rnd() * 3);
    const r1 = 24,
        r2 = 12;
    let d = '';
    for (let i = 0; i < points * 2; i++) {
        const ang = (Math.PI * 2 * i) / (points * 2) - Math.PI / 2;
        const r = i % 2 === 0 ? r1 : r2;
        const x = 32 + r * Math.cos(ang);
        const y = 32 + r * Math.sin(ang);
        d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
    }
    d += 'Z';
    const circles = [];
    const cn = 1 + Math.floor(rnd() * 2);
    for (let i = 0; i < cn; i++) {
        circles.push(`<circle cx="32" cy="32" r="${(28-i*8)}" fill="none" stroke="${color}" stroke-width="0.6" opacity="${0.5-i*0.15}"/>`);
    }
    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    ${circles.join('')}
    <path d="${d}" fill="none" stroke="${color}" stroke-width="1.1" stroke-linejoin="round"/>
    <circle cx="32" cy="32" r="2.4" fill="${color}"/>
  </svg>`;
}

/* ============ DECK DATA ============ */
const MAJORS = [
    ["The Fool", "Khởi đầu mới đầy hồn nhiên, dám bước đi mà không sợ hãi, tin tưởng vào hành trình phía trước.", "Hành động bốc đồng, thiếu chuẩn bị, hoặc bỏ lỡ cơ hội vì do dự quá lâu."],
    ["The Magician", "Bạn có đủ mọi công cụ cần thiết để biến ý tưởng thành hiện thực; ý chí và hành động đang hòa làm một.", "Năng lực bị lãng phí, thao túng, hoặc kế hoạch thiếu tập trung."],
    ["The High Priestess", "Trực giác đang lên tiếng; hãy lắng nghe những gì chưa được nói ra, tin vào tiếng nói bên trong.", "Bí mật bị che giấu, mất kết nối với trực giác, hoặc thông tin bị bóp méo."],
    ["The Empress", "Sự sung túc, sáng tạo và nuôi dưỡng đang nở rộ trong đời bạn; hãy đón nhận sự dồi dào.", "Phụ thuộc quá mức, sáng tạo bị chặn lại, hoặc thiếu chăm sóc bản thân."],
    ["The Emperor", "Cấu trúc, kỷ luật và quyền lực vững chắc giúp bạn xây dựng nền móng lâu dài.", "Kiểm soát quá mức, cứng nhắc, hoặc lạm quyền."],
    ["The Hierophant", "Truyền thống, sự chỉ dẫn và các giá trị chung dẫn dắt bạn đi đúng hướng.", "Nổi loạn chống lại quy tắc cũ, hoặc giáo điều cứng nhắc kìm hãm bạn."],
    ["The Lovers", "Một lựa chọn quan trọng dựa trên giá trị thật của trái tim; sự hòa hợp và kết nối sâu sắc.", "Mất cân bằng trong mối quan hệ, lựa chọn sai lầm, hoặc bất hòa nội tâm."],
    ["The Chariot", "Ý chí mạnh mẽ giúp bạn vượt qua xung đột và tiến về phía trước với quyết tâm.", "Mất phương hướng, thiếu kiểm soát, hoặc năng lượng bị phân tán."],
    ["Strength", "Lòng dũng cảm dịu dàng và sự kiên nhẫn chinh phục mọi thử thách hơn là vũ lực.", "Nghi ngờ bản thân, yếu đuối nội tâm, hoặc mất kiên nhẫn."],
    ["The Hermit", "Đã đến lúc lùi lại, tìm sự tĩnh lặng và lắng nghe trí tuệ bên trong bạn.", "Cô lập quá mức, cô đơn, hoặc từ chối tìm kiếm sự giúp đỡ."],
    ["Wheel of Fortune", "Một vòng xoay của định mệnh đang đưa đến những thay đổi bất ngờ và cơ hội mới.", "Vận rủi tạm thời, kháng cự sự thay đổi, hoặc vòng lặp lặp lại."],
    ["Justice", "Sự thật, trách nhiệm và cân bằng sẽ được thiết lập; mọi hành động đều có hệ quả tương xứng.", "Bất công, thiếu trách nhiệm, hoặc quyết định thiên vị."],
    ["The Hanged Man", "Tạm dừng để nhìn mọi việc từ góc độ khác; sự hy sinh nhỏ mang đến sáng suốt lớn.", "Trì hoãn không cần thiết, chống lại sự thay đổi, hoặc hy sinh vô ích."],
    ["Death", "Một kết thúc cần thiết mở đường cho sự chuyển hóa và khởi đầu mới.", "Sợ hãi thay đổi, bám víu vào quá khứ, hoặc chuyển đổi bị trì bảo."],
    ["Temperance", "Sự cân bằng, kiên nhẫn và hòa hợp giữa các thái cực mang lại chữa lành.", "Mất cân bằng, thái quá, hoặc thiếu kiên nhẫn trong quá trình hàn gắn."],
    ["The Devil", "Những ràng buộc, cám dỗ hoặc thói quen xấu đang kìm giữ bạn lại.", "Giải phóng bản thân khỏi ràng buộc, nhận ra và phá vỡ chuỗi xiềng xích."],
    ["The Tower", "Một biến động đột ngột phá vỡ những gì không còn vững chắc, mở đường cho sự thật.", "Tránh né khủng hoảng sắp xảy ra, hoặc sợ hãi thay đổi cần thiết."],
    ["The Star", "Hy vọng, niềm tin và sự chữa lành đang soi sáng con đường phía trước.", "Mất niềm tin, tuyệt vọng, hoặc ngắt kết nối với ước mơ."],
    ["The Moon", "Những điều mơ hồ, sợ hãi tiềm ẩn hoặc ảo giác đang cần được soi rọi.", "Sự thật dần được hé lộ, vượt qua nỗi sợ, hoặc nhầm lẫn được giải tỏa."],
    ["The Sun", "Niềm vui, thành công và sự sống động tràn đầy đang chiếu sáng con đường bạn đi.", "Lạc quan thái quá, trì hoãn niềm vui, hoặc thành công bị che khuất tạm thời."],
    ["Judgement", "Một sự thức tỉnh, đánh giá lại bản thân để bước vào một chương mới trọn vẹn hơn.", "Tự phán xét quá khắt khe, nghi ngờ bản thân, hoặc bỏ lỡ lời kêu gọi thức tỉnh."],
    ["The World", "Sự hoàn thành trọn vẹn một chu kỳ lớn; mọi mảnh ghép đã khớp lại với nhau.", "Một chu kỳ chưa khép lại, cảm giác thiếu trọn vẹn, hoặc trì hoãn kết thúc."]
];

const SUITS = [
    { key: 'wands', name: 'Wands', domain: 'đam mê, sáng tạo và con đường sự nghiệp', el: 'Lửa' },
    { key: 'cups', name: 'Cups', domain: 'cảm xúc, tình cảm và các mối quan hệ', el: 'Nước' },
    { key: 'swords', name: 'Swords', domain: 'tư duy, lời nói và những xung đột nội tâm', el: 'Khí' },
    { key: 'pentacles', name: 'Pentacles', domain: 'vật chất, tài chính và sức khỏe', el: 'Đất' }
];
const RANKS = [
    { label: 'A', name: 'Ace', up: 'một khởi đầu thuần khiết, tràn đầy tiềm năng chưa khai phá', rev: 'cơ hội bị bỏ lỡ hoặc khởi đầu chững lại' },
    { label: '2', name: 'Two', up: 'sự cân bằng, một lựa chọn hoặc mối liên kết cần được vun đắp', rev: 'mất cân bằng, do dự kéo dài giữa hai lựa chọn' },
    { label: '3', name: 'Three', up: 'sự phát triển và kết nối đang mở rộng ra bên ngoài', rev: 'tăng trưởng bị chậm lại hoặc thiếu sự hợp tác' },
    { label: '4', name: 'Four', up: 'nền tảng ổn định được thiết lập vững chắc', rev: 'sự trì trệ hoặc bám víu vào nền tảng đã cũ' },
    { label: '5', name: 'Five', up: 'một thử thách hoặc xung đột buộc bạn phải trưởng thành hơn', rev: 'căng thẳng đang lắng xuống, học được bài học từ mất mát' },
    { label: '6', name: 'Six', up: 'sự hòa hợp, hỗ trợ và hàn gắn đang diễn ra', rev: 'mất cân bằng trong việc cho và nhận' },
    { label: '7', name: 'Seven', up: 'thời điểm để suy ngẫm, đánh giá lại và kiên nhẫn chờ đợi', rev: 'thiếu kiên nhẫn hoặc đánh giá sai tình huống' },
    { label: '8', name: 'Eight', up: 'một bước chuyển động nhanh chóng, làm chủ kỹ năng của mình', rev: 'tiến độ bị đình trệ hoặc thiếu định hướng' },
    { label: '9', name: 'Nine', up: 'gần đến đích, sức mạnh nội tại được tôi luyện qua thử thách', rev: 'lo âu, kiệt sức hoặc nghi ngờ ngay trước vạch đích' },
    { label: '10', name: 'Ten', up: 'sự hoàn tất trọn vẹn của một chu kỳ dài', rev: 'gánh nặng kéo dài hơn cần thiết, chu kỳ khó khép lại' },
    { label: 'P', name: 'Page', up: 'một tin tức mới, sự tò mò và tinh thần học hỏi', rev: 'tin tức bị trì hoãn hoặc thiếu chín chắn' },
    { label: 'K', name: 'Knight', up: 'hành động nhanh chóng, theo đuổi mục tiêu với đầy nhiệt huyết', rev: 'hành động vội vàng, thiếu suy nghĩ hoặc bốc đồng' },
    { label: 'Q', name: 'Queen', up: 'làm chủ nội tâm, thấu hiểu và nuôi dưỡng lĩnh vực của mình', rev: 'mất kết nối với chính mình hoặc thiếu tự tin' },
    { label: 'Vua', name: 'King', up: 'làm chủ hoàn toàn, quyền lực và trách nhiệm vững vàng', rev: 'lạm quyền, cứng nhắc hoặc kiểm soát thái quá' }
];

function buildDeck() {
    const deck = [];
    const baseUrl = 'sacred-texts.com/tarot/pkt/img/';
    const proxyUrl = 'https://wsrv.nl/?url=';

    MAJORS.forEach((m, i) => {
        const code = 'ar' + i.toString().padStart(2, '0');
        const imgPath = code + '.jpg';
        deck.push({
            id: 'm' + i,
            name: m[0],
            type: 'major',
            up: m[1],
            rev: m[2],
            seed: i + 1,
            imgUrl: `${proxyUrl}${baseUrl}${imgPath}`,
            backupUrl: `https://${baseUrl}${imgPath}`
        });
    });

    SUITS.forEach((s, si) => {
        RANKS.forEach((r, ri) => {
            const nm = (r.label === 'A' || r.label === 'P' || r.label === 'K' || r.label === 'Q' || r.label === 'Vua') ? `${r.name} of ${s.name}` : `${r.name} of ${s.name}`;

            const suitCode = s.key.substring(0, 2);
            const rankCode = (ri + 1).toString().padStart(2, '0');
            const imgPath = suitCode + rankCode + '.jpg';

            deck.push({
                id: 's' + si + 'r' + ri,
                name: nm,
                type: 'minor',
                suit: s.key,
                label: r.label,
                up: `Trong lĩnh vực ${s.domain}, đây là ${r.up}.`,
                rev: `Trong lĩnh vực ${s.domain}, đây là ${r.rev}.`,
                seed: 100 + si * 20 + ri,
                imgUrl: `${proxyUrl}${baseUrl}${imgPath}`,
                backupUrl: `https://${baseUrl}${imgPath}`
            });
        });
    });
    return deck;
}
const FULL_DECK = buildDeck();

const SPREADS = [
    { id: 'single', name: 'Một Lá Bài', desc: 'Một cái nhìn nhanh, rõ ràng cho câu hỏi hiện tại.', count: 1, positions: [{ x: 50, y: 52, label: 'Thông điệp' }] },
    { id: 'three', name: 'Ba Lá Bài', desc: 'Quá khứ — Hiện tại — Tương lai.', count: 3, positions: [{ x: 22, y: 52, label: 'Quá khứ' }, { x: 50, y: 52, label: 'Hiện tại' }, { x: 78, y: 52, label: 'Tương lai' }] },
    {
        id: 'celtic',
        name: 'Thập Tự Celtic',
        desc: 'Khai thác sâu một vấn đề từ 10 góc độ.',
        count: 10,
        positions: [
            { x: 38, y: 52, label: 'Hiện tại' }, { x: 38, y: 52, label: 'Thách thức', cross: true }, { x: 38, y: 22, label: 'Mục tiêu' }, { x: 38, y: 82, label: 'Nền tảng' },
            { x: 16, y: 52, label: 'Quá khứ' }, { x: 60, y: 52, label: 'Tương lai gần' }, { x: 84, y: 86, label: 'Bản thân' }, { x: 84, y: 64, label: 'Môi trường' },
            { x: 84, y: 42, label: 'Hy vọng/Sợ hãi' }, { x: 84, y: 20, label: 'Kết quả' }
        ]
    }
];

/* ============ STATE ============ */
let state = { topic: null, spread: null, question: '', deck: [], drawnCards: [], slotOrder: [] };

/* ============ NAV ============ */
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('btnResetTop').classList.toggle('show', id !== 'screen-topic');
}

function selectTopic(topicName) {
    state.topic = topicName;
    document.getElementById('display-topic').textContent = topicName;
    showScreen('screen-intro');
}

document.getElementById('btnStart').onclick = () => {
    renderSpreadList();
    showScreen('screen-spread');
};
document.getElementById('btnBackIntro').onclick = () => showScreen('screen-intro');
document.getElementById('btnResetTop').onclick = restartAll;
document.getElementById('btnRestart').onclick = restartAll;

function restartAll() {
    state = { topic: null, spread: null, question: '', deck: [], drawnCards: [], slotOrder: [] };
    document.getElementById('summaryBoard').style.display = 'none';
    document.getElementById('btnGetSummary').style.display = 'none';
    showScreen('screen-topic');
}

/* ============ SPREAD SELECT ============ */
function renderSpreadList() {
    const wrap = document.getElementById('spreadList');
    wrap.innerHTML = '';
    SPREADS.forEach(sp => {
        const el = document.createElement('div');
        el.className = 'spread-card' + (state.spread === sp.id ? ' selected' : '');
        el.innerHTML = `<div class="spread-icon">${sigilSVG(sp.count*7+3, 'var(--gold)')}</div>
      <h3>${sp.name}</h3><p>${sp.desc}</p>
      <span class="spread-count ui-font">${sp.count} lá bài</span>`;
        el.onclick = () => {
            state.spread = sp.id;
            renderSpreadList();
        };
        wrap.appendChild(el);
    });
}
document.getElementById('btnToDeck').onclick = () => {
    if (!state.spread) { state.spread = 'single'; }
    state.question = document.getElementById('questionInput').value.trim();
    const sp = SPREADS.find(s => s.id === state.spread);
    document.getElementById('deckHeading').textContent = `Xáo bài & rút ${sp.count} lá`;
    setupDeckScreen(sp);
    showScreen('screen-deck');
};

/* ============ DECK SCREEN ============ */
function setupDeckScreen(sp) {
    state.deck = shuffleArray(FULL_DECK.slice());
    state.drawnCards = [];
    const fan = document.getElementById('fannedDeck');
    fan.innerHTML = '';
    const n = 22;
    for (let i = 0; i < n; i++) {
        const c = document.createElement('div');
        c.className = 'deck-card';
        const angle = (i - (n - 1) / 2) * 4.2;
        const offsetY = Math.abs(i - (n - 1) / 2) * 3.5;
        c.style.transform = `rotate(${angle}deg) translateY(${offsetY}px)`;
        c.dataset.angle = angle;
        c.dataset.offsetY = offsetY;
        c.innerHTML = `<div class="back-face">${sigilSVG(i+50,'var(--bg-panel)')}</div>`;
        c.onclick = () => drawFromDeck(c, sp);
        fan.appendChild(c);
    }
    updateDrawProgress(sp);
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
document.getElementById('btnShuffle').onclick = () => {
    const cards = document.querySelectorAll('#fannedDeck .deck-card:not(.drawn)');
    cards.forEach(c => {
        const a = parseFloat(c.dataset.angle),
            oy = parseFloat(c.dataset.offsetY);
        c.style.transition = 'transform .18s ease';
        c.style.transform = `rotate(${a + (Math.random()*30-15)}deg) translateY(${oy}px) translateX(${Math.random()*24-12}px)`;
    });
    setTimeout(() => {
        cards.forEach(c => {
            const a = parseFloat(c.dataset.angle),
                oy = parseFloat(c.dataset.offsetY);
            c.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)';
            c.style.transform = `rotate(${a}deg) translateY(${oy}px)`;
        });
    }, 220);
    state.deck = shuffleArray(state.deck);
};

function updateDrawProgress(sp) {
    document.getElementById('drawProgress').textContent = `Đã rút ${state.drawnCards.length} / ${sp.count} lá`;
}

function drawFromDeck(el, sp) {
    if (el.classList.contains('drawn') || state.drawnCards.length >= sp.count) return;
    const card = state.deck[state.drawnCards.length % state.deck.length];
    const reversed = Math.random() < 0.35;
    state.drawnCards.push({ card, reversed });
    el.classList.add('drawn');
    updateDrawProgress(sp);
    if (state.drawnCards.length >= sp.count) {
        setTimeout(() => buildReadingTable(sp), 650);
    }
}

/* ============ READING TABLE ============ */
function buildReadingTable(sp) {
    document.getElementById('readingHeading').textContent = sp.name;
    document.getElementById('readingQuestion').textContent = state.question ? `“${state.question}”` : '';
    const area = document.getElementById('tableArea');
    area.innerHTML = '';
    area.style.height = sp.id === 'celtic' ? '560px' : '260px';

    sp.positions.forEach((pos, idx) => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.style.left = pos.x + '%';
        slot.style.top = pos.y + '%';
        if (pos.cross) { slot.style.zIndex = 2; }

        const drawn = state.drawnCards[idx];
        const flipWrap = document.createElement('div');
        flipWrap.className = 'card-flip';
        if (pos.cross) flipWrap.style.transform = 'rotate(90deg)';

        const fallbackHTML = `if(this.dataset.tried==='1'){this.outerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--gold-soft);color:#fff;border-radius:4px;font-weight:bold;font-size:0.8rem\\'>LỖI ẢNH</div>';}else{this.dataset.tried='1';this.src='${drawn.card.backupUrl}';}`;

        flipWrap.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">${sigilSVG(idx+7,'var(--bg-panel)')}</div>
        <div class="card-face card-front">
          <img src="${drawn.card.imgUrl}" class="tarot-img ${drawn.reversed ? 'reversed-img' : ''}" alt="${drawn.card.name}" onerror="${fallbackHTML}">
          <div class="card-overlay">
            <div class="cname">${drawn.card.name}</div>
            <div class="orient ${drawn.reversed ? '' : 'upright'}">${drawn.reversed ? 'Ngược' : 'Xuôi'}</div>
          </div>
        </div>
      </div>`;

        flipWrap.onclick = () => {
            if (!flipWrap.classList.contains('flipped')) { flipWrap.classList.add('flipped'); } else { openDetail(drawn, pos.label); }
        };
        slot.innerHTML = `<div class="label ui-font">${pos.label}</div>`;
        slot.appendChild(flipWrap);
        area.appendChild(slot);
    });

    document.getElementById('btnGetSummary').style.display = 'block';
    showScreen('screen-reading');
}
document.getElementById('btnRevealAll').onclick = () => {
    document.querySelectorAll('.card-flip').forEach(f => f.classList.add('flipped'));
};
document.getElementById('btnNewSpread').onclick = () => {
    renderSpreadList();
    showScreen('screen-spread');
};

/* ============ LOGIC BẢNG LUẬN GIẢI CHI TIẾT ============ */
document.getElementById('btnGetSummary').onclick = () => {
    const board = document.getElementById('summaryBoard');
    const content = document.getElementById('summaryContent');

    let astroZodiacs = ["Bạch Dương (♈ Lửa)", "Kim Ngưu (♉ Đất)", "Song Tử (♊ Khí)", "Cự Giải (♋ Nước)", "Sư Tử (♌ Lửa)", "Xử Nữ (♍ Đất)", "Thiên Bình (♎ Khí)", "Bọ Cạp (♏ Nước)", "Nhân Mã (♐ Lửa)", "Ma Kết (♑ Đất)", "Bảo Bình (♒ Khí)", "Song Ngư (♓ Nước)"];
    let planets = ["Mặt Trời (Sự sống)", "Mặt Trăng (Cảm xúc)", "Sao Kim (Tình yêu)", "Sao Mộc (May mắn)", "Sao Thủy (Giao tiếp)", "Sao Hỏa (Hành động)", "Sao Thổ (Kỷ luật)"];

    let mainZodiac = astroZodiacs[Math.floor(Math.random() * astroZodiacs.length)];
    let supportPlanet = planets[Math.floor(Math.random() * planets.length)];
    let randomHourStart = Math.floor(Math.random() * 12 + 1);

    let cardNames = state.drawnCards.map(d => `<strong>${d.card.name} ${d.reversed ? '(Ngược)' : ''}</strong>`).join(', ');

    let html = `
        <div class="astro-tags">
            <span class="astro-tag">Cung chi phối: ${mainZodiac}</span>
            <span class="astro-tag">Hành tinh: ${supportPlanet}</span>
            <span class="astro-tag">Giờ linh ứng: ${randomHourStart}h - ${randomHourStart + 2}h</span>
        </div>
        
        <p><strong>Dòng chảy năng lượng:</strong> Dưới sự chiếu mệnh của <b>${mainZodiac.split(' ')[0]}</b>, kết hợp cùng chủ đề <b>${state.topic || 'Tổng quan'}</b> mà bạn đang suy tư, sự xuất hiện của các lá bài ${cardNames} không phải là sự ngẫu nhiên. Vũ trụ đang điều hướng một nguồn năng lượng lớn đan xen giữa sự thử thách và cơ hội mở ra cho bạn.</p>
        
        <p><strong>Phân tích chiều sâu:</strong> Sự hiện diện của những lá bài này cho thấy bạn đang đứng trước một ngã rẽ quan trọng. Nếu có lá bài ngược, đó là tín hiệu từ vũ trụ yêu cầu bạn chậm lại, quay về chữa lành nội tâm thay vì cố gắng kiểm soát yếu tố bên ngoài. Ngược lại, những lá bài xuôi mang đến ánh sáng dẫn đường, xác nhận rằng trực giác của bạn đang vô cùng sắc bén và chính xác.</p>

        <p><strong>Thông điệp từ các vì sao:</strong> Được bảo trợ bởi năng lượng của <b>${supportPlanet}</b>, lời khuyên dành riêng cho bạn lúc này là: <i>"Đừng để nỗi sợ hãi cản bước tương lai. Mọi sự kiện diễn ra đều là những bài học cần thiết. Hãy hít một hơi thật sâu, tin tưởng vào nhịp điệu của vũ trụ và để mọi thứ diễn ra tự nhiên nhất."</i></p>
    `;

    content.innerHTML = html;
    board.style.display = 'block';
    board.scrollIntoView({ behavior: "smooth", block: "nearest" });
    document.querySelectorAll('.card-flip').forEach(f => f.classList.add('flipped'));

    // Đã liên kết gọi hàm lưu Database
    if (window.saveTarotReading) {
        window.saveTarotReading(state);
    }
};

/* ============ DETAIL OVERLAY (Click từng lá) ============ */
function openDetail(drawn, posLabel) {
    document.getElementById('detailPos').textContent = posLabel;
    document.getElementById('detailName').textContent = drawn.card.name;

    const fallbackHTML = `if(this.dataset.tried==='1'){this.outerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--gold-soft);color:#fff;border-radius:8px;font-weight:bold;min-height:150px;\\'>LỖI ẢNH</div>';}else{this.dataset.tried='1';this.src='${drawn.card.backupUrl}';}`;

    document.getElementById('detailSigil').innerHTML = `<img src="${drawn.card.imgUrl}" class="${drawn.reversed ? 'reversed-img' : ''}" style="transition: transform 0.3s; ${drawn.reversed ? 'transform: rotate(180deg);' : ''}" onerror="${fallbackHTML}">`;

    const orientEl = document.getElementById('detailOrient');
    orientEl.textContent = drawn.reversed ? 'Vị trí ngược' : 'Vị trí xuôi';
    orientEl.className = 'detail-orient ' + (drawn.reversed ? 'reversed' : 'upright');

    const baseMeaning = drawn.reversed ? drawn.card.rev : drawn.card.up;
    let topicAdvice = "";

    if (state.topic && state.topic !== 'Tổng quan' && state.topic !== 'IDK') {
        topicAdvice = `<br><br><b style="font-family:'Cinzel', serif; font-size: 1.1rem; color: var(--gold);">Lời khuyên cho "${state.topic}":</b><br>`;
        if (drawn.reversed) {
            topicAdvice += `Trong khía cạnh <b>${state.topic}</b>, vũ trụ nhắn nhủ bạn hãy kiên nhẫn hơn. Có thể đang có một sự tắc nghẽn hoặc áp lực nội tâm. Đừng cố gượng ép kết quả, hãy thư giãn.`;
        } else {
            topicAdvice += `Năng lượng về <b>${state.topic}</b> của bạn đang rất sáng sủa! Hãy dũng cảm thể hiện bản thân và đón nhận những điều tích cực đang tới.`;
        }
    }

    document.getElementById('detailMeaning').innerHTML = `<p>${baseMeaning}</p> <div>${topicAdvice}</div>`;
    document.getElementById('overlay').classList.add('active');
}
document.getElementById('detailClose').onclick = () => document.getElementById('overlay').classList.remove('active');
document.getElementById('overlay').addEventListener('click', (e) => { if (e.target.id === 'overlay') e.currentTarget.classList.remove('active'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.getElementById('overlay').classList.remove('active'); });