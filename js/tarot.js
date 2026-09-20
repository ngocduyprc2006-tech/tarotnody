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
  let st = { topic: 'open', spread: null, question: '', pool: [], drawn: [] };

  const $ = (id) => document.getElementById(id);

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

    for (let i = 0; i < FAN_N; i++) {
      const c = document.createElement('div');
      c.className = 'fan-card';
      const t = i - (FAN_N - 1) / 2;
      const ang = t * 3.6;
      const lift = Math.abs(t) * 2.6;
      const depth = -Math.abs(t) * 9;
      c.dataset.base = `rotateZ(${ang}deg) translateY(${lift}px) translateZ(${depth}px)`;
      c.style.transform = c.dataset.base;
      c.style.zIndex = 40 - Math.abs(Math.round(t));
      c.innerHTML = `<div class="card-back">${Sh.sigil(i * 7 + 13, 'var(--moon)')}</div>`;

      c.onmouseenter = () => {
        if (c.classList.contains('taken')) return;
        c.style.transform = c.dataset.base + ' translateY(-22px) translateZ(46px)';
      };
      c.onmouseleave = () => {
        if (c.classList.contains('taken')) return;
        c.style.transform = c.dataset.base;
      };
      c.onclick = () => takeCard(c, sp);

      fan.appendChild(c);
    }
    paintProgress(sp);
  }

  function paintProgress(sp) {
    $('drawCount').textContent = `Đã rút ${st.drawn.length} trên ${sp.count} lá`;
    $('drawHint').textContent = st.drawn.length === 0
      ? 'Nhắm mắt, nghĩ về điều bạn đang vướng, rồi chạm vào lá nào gọi bạn.'
      : (st.drawn.length >= sp.count ? 'Đủ rồi. Đang bày ra bàn…' : 'Còn nữa, cứ chậm rãi.');
  }

  function takeCard(el, sp) {
    if (el.classList.contains('taken') || st.drawn.length >= sp.count) return;
    const card = st.pool[st.drawn.length];
    st.drawn.push({ card, reversed: Math.random() < 0.32 });

    el.style.transform = el.dataset.base + ' translateY(-130px) translateZ(120px) rotateZ(0deg)';
    el.classList.add('taken');
    paintProgress(sp);

    if (st.drawn.length >= sp.count) setTimeout(() => buildTable(sp), 700);
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
    Sh.toast('Đã xáo lại bộ bài ✨');
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
              <div class="or${d.reversed ? ' rev' : ''}">${d.reversed ? 'ngược' : 'xuôi'}</div>
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

    $('detailBody').innerHTML = `
      <div class="detail-top">
        <div class="detail-img">${D.imgTag(d.card, d.reversed ? 'upside' : '')}</div>
        <div>
          <div class="detail-pos">${label}</div>
          <h3>${d.card.vi}</h3>
          <div class="tiny mute">${d.card.name}</div>
          <div class="detail-or${d.reversed ? ' rev' : ''}">${d.reversed ? 'Nằm ngược' : 'Nằm xuôi'}</div>
        </div>
      </div>
      <div class="chips"><span class="chip">${d.card.keys}</span></div>
      <div class="detail-body">
        <p>${d.reversed ? d.card.rev : d.card.up}</p>
        <h4>Đặt vào chuyện ${topicName.toLowerCase()} của bạn</h4>
        <p>${d.reversed ? voice.rev : voice.up}</p>
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
    if (suitInfo && topN > 1) chips.push(`<span class="chip">Nhiều lá ${suitInfo.vi} · hành ${suitInfo.el}</span>`);
    if (majors) chips.push(`<span class="chip">${majors} lá Ẩn Chính</span>`);
    chips.push(`<span class="chip alt">${revs} lá ngược</span>`);

    // mạch năng lượng
    let flow;
    if (majors >= Math.ceil(cards.length / 2)) {
      flow = 'Nhiều lá Ẩn Chính cùng xuất hiện, nghĩa là chuyện bạn hỏi không phải chuyện vặt của tuần này. ' +
             'Nó thuộc về một chương lớn hơn, và những gì bạn quyết lúc này sẽ còn vang khá lâu.';
    } else if (majors === 0) {
      flow = 'Không có lá Ẩn Chính nào, và đó là tin lành. Chuyện này nằm trong tay bạn, xử lý được bằng ' +
             'những việc rất đời thường chứ không cần phép màu nào cả.';
    } else {
      flow = 'Bài pha giữa chuyện lớn và chuyện thường ngày. Có một dòng chảy nền đang đẩy bạn đi, ' +
             'nhưng phần lớn kết quả vẫn phụ thuộc vào những lựa chọn nhỏ mỗi ngày.';
    }

    if (suitInfo && topN > 1) {
      flow += ` Chất ${suitInfo.vi} lặp lại ${topN} lần, kéo trọng tâm về phía ${suitInfo.domain}.`;
    }

    // độ nghiêng xuôi/ngược
    let tone;
    const ratio = revs / cards.length;
    if (ratio === 0) {
      tone = 'Tất cả các lá đều nằm xuôi. Năng lượng đang chảy thuận, không có gì chặn bạn ngoài chính sự do dự.';
    } else if (ratio < 0.4) {
      tone = 'Phần lớn lá nằm xuôi, vài lá ngược chỉ là chỗ cần chậm lại chứ không phải lời cảnh báo.';
    } else if (ratio < 0.8) {
      tone = 'Khá nhiều lá ngược. Không phải điềm xấu đâu — nó thường có nghĩa là bạn đang mệt hơn mình thừa nhận, ' +
             'và cơ thể lẫn tâm trí đang xin một quãng nghỉ thật sự.';
    } else {
      tone = 'Gần như cả bài nằm ngược. Đây là lúc dừng hẳn việc cố gắng hướng ra ngoài và quay vào chăm mình. ' +
             'Mọi thứ sẽ mở lại, nhưng không phải trong tuần này.';
    }

    // mạch theo từng vị trí
    const chain = cards.map((c, i) => {
      const label = sp.slots[i].label;
      const gist = (c.reversed ? c.card.rev : c.card.up).split('.')[0];
      return `<li><b style="color:var(--moon)">${label}</b> — ${c.card.vi}: ${gist}.</li>`;
    }).join('');

    // một lời dặn khép lại
    const closings = [
      'Đừng cố hiểu hết bài trong hôm nay. Chọn một dòng khiến bạn hơi nhói, rồi làm một việc nhỏ theo nó.',
      'Bài không bảo bạn phải làm gì. Nó chỉ nói ra điều bạn đã biết, để bạn khỏi phải một mình biết nữa.',
      'Nếu đọc xong thấy nhẹ đi một chút, vậy là đủ rồi. Phần còn lại cứ để ngày mai lo.',
      'Nody chỉ nhắc một điều: bạn đang xoay xở tốt hơn bạn tự chấm cho mình nhiều lắm.'
    ];
    const closing = closings[Math.floor(Math.random() * closings.length)];

    $('synthBody').innerHTML = `
      <div class="chips">${chips.join('')}</div>
      <p>${flow}</p>
      <h4>Bài đang nghiêng về đâu</h4>
      <p>${tone}</p>
      <h4>Đọc theo mạch</h4>
      <ul class="soft" style="padding-left:20px;line-height:1.85">${chain}</ul>
      ${st.question ? `<h4>Về câu bạn hỏi</h4><p>Bạn hỏi: “${escapeHTML(st.question)}”. Câu trả lời gần nhất nằm ở lá <b>${cards[0].card.vi}</b> — ${(cards[0].reversed ? cards[0].card.rev : cards[0].card.up)}</p>` : ''}
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
      if (window.Nody && window.Nody.user) Sh.toast('Đã cất vào lịch sử của bạn 🌙');
    });
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  }

  /* ==========================================================
     Khởi động trang
     ========================================================== */
  function reset() {
    st = { topic: 'open', spread: null, question: '', pool: [], drawn: [] };
    $('questionInput').value = '';
    $('synth').classList.add('hidden');
    buildTopics();
    go('topic');
  }

  function init() {
    if (!$('stage-topic')) return;
    buildTopics();
    paintSteps('topic');

    $('btnToDeck').onclick = () => {
      if (!st.spread) { Sh.toast('Bạn chọn một kiểu trải bài trước nhé.', true); return; }
      st.question = $('questionInput').value.trim();
      const sp = S.spread(st.spread);
      $('deckTitle').textContent = 'Xáo bài rồi rút ' + sp.count + ' lá';
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
