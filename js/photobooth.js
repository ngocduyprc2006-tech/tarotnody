/* ============================================================
   photobooth.js — chụp ảnh cùng lá bài, thêm khung, tải về
   ------------------------------------------------------------
   Chạy hoàn toàn ở trình duyệt (getUserMedia + canvas), không
   cần server hay API nào — nên luôn hoạt động kể cả khi Firebase
   nghỉ. Nếu có lá bài vừa rút gần nhất (Shell.store 'lastCard'),
   nó được vẽ làm nhãn dán ở góc ảnh.
   ========================================================== */
(function () {
  'use strict';

  const video   = document.getElementById('boothVideo');
  const canvas  = document.getElementById('boothCanvas');
  const frame   = document.getElementById('boothFrame');
  const stage   = document.getElementById('boothStage');
  const btnStart    = document.getElementById('btnStart');
  const btnCapture  = document.getElementById('btnCapture');
  const btnRetake   = document.getElementById('btnRetake');
  const btnDownload = document.getElementById('btnDownload');
  const msg = document.getElementById('boothMsg');

  let stream = null;
  let currentFrame = 'moon';
  let currentFilter = 'none';

  const FILTER_CSS = {
    none:    'none',
    vintage: 'sepia(.45) saturate(1.3) contrast(1.05) brightness(1.02)',
    bw:      'grayscale(1) contrast(1.08)',
    warm:    'saturate(1.25) sepia(.15) hue-rotate(-8deg) brightness(1.04)',
    cool:    'saturate(1.15) hue-rotate(15deg) brightness(1.02) contrast(1.03)',
    dreamy:  'brightness(1.12) contrast(.92) saturate(1.1) blur(.6px)',
    neon:    'saturate(1.7) contrast(1.25) hue-rotate(-4deg)'
  };

  document.querySelectorAll('.frame-swatch').forEach(sw => {
    sw.onclick = () => {
      document.querySelectorAll('.frame-swatch').forEach(x => x.classList.remove('on'));
      sw.classList.add('on');
      currentFrame = sw.dataset.frame;
      frame.className = 'booth-frame ' + currentFrame;
    };
  });

  document.querySelectorAll('.filter-swatch').forEach(sw => {
    sw.onclick = () => {
      document.querySelectorAll('.filter-swatch').forEach(x => x.classList.remove('on'));
      sw.classList.add('on');
      currentFilter = sw.dataset.filter;
      video.style.filter = FILTER_CSS[currentFilter] || 'none';
    };
  });

  async function start() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      video.srcObject = stream;
      btnStart.classList.add('hidden');
      btnCapture.classList.remove('hidden');
      msg.textContent = '';
    } catch (e) {
      msg.textContent = (window.I18N && window.I18N.t('photo.noCamera')) ||
        "Couldn't access the camera. Please check your browser's camera permission.";
    }
  }

  function stopStream() {
    if (stream) stream.getTracks().forEach(t => t.stop());
    stream = null;
  }

  function drawCardSticker(ctx, w, h) {
    let last = null;
    try { last = window.Shell ? window.Shell.store.get('lastCard', null) : null; } catch (e) {}
    if (!last || !last.img) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const cw = w * 0.24, ch = cw * 1.55;
      const x = w - cw - w * 0.05, y = h - ch - h * 0.06;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,.5)';
      ctx.shadowBlur = 18;
      if (last.reversed) {
        ctx.translate(x + cw / 2, y + ch / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(img, -cw / 2, -ch / 2, cw, ch);
      } else {
        ctx.drawImage(img, x, y, cw, ch);
      }
      ctx.restore();
    };
    img.src = last.img;
  }

  function watermark(ctx, w, h) {
    ctx.save();
    ctx.font = `${Math.round(w * 0.045)}px 'Lora', serif`;
    ctx.fillStyle = 'rgba(255,255,255,.88)';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0,0,0,.6)';
    ctx.shadowBlur = 8;
    ctx.fillText('🐾 Nody Tarot', w * 0.05, h * 0.94);
    ctx.restore();
  }

  function frameBorder(ctx, w, h) {
    const colors = {
      moon: ['#5fb4ec', '#8b9bf6'],
      gold: ['#f4d58d', '#b9852f'],
      sage: ['#6fd0a8', '#6fe0d6']
    }[currentFrame] || ['#5fb4ec', '#8b9bf6'];
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    const bw = Math.round(w * 0.028);
    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = bw;
    ctx.strokeRect(bw / 2, bw / 2, w - bw, h - bw);
    ctx.restore();
  }

  function capture() {
    const useTimer = document.getElementById('boothTimer').checked;
    if (useTimer) {
      let n = 3;
      showCountdown(n);
      const iv = setInterval(() => {
        n -= 1;
        if (n <= 0) { clearInterval(iv); hideCountdown(); doShoot(); }
        else showCountdown(n);
      }, 1000);
    } else {
      doShoot();
    }
  }

  function showCountdown(n) {
    let el = document.getElementById('boothCountdown');
    if (!el) {
      el = document.createElement('div');
      el.id = 'boothCountdown';
      el.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;font-family:\'Lora\',serif;font-size:5rem;color:#fff;text-shadow:0 4px 20px rgba(0,0,0,.6);pointer-events:none;z-index:5';
      stage.appendChild(el);
    }
    el.textContent = n;
  }
  function hideCountdown() {
    const el = document.getElementById('boothCountdown');
    if (el) el.remove();
  }

  function doShoot() {
    const w = video.videoWidth || 720, h = video.videoHeight || 960;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    // Lật ngang cho giống soi gương (tự nhiên hơn khi chụp selfie) + áp bộ lọc đang chọn
    ctx.filter = FILTER_CSS[currentFilter] || 'none';
    ctx.translate(w, 0); ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = 'none'; // khung/watermark/nhãn dán không bị ảnh hưởng bởi bộ lọc ảnh

    frameBorder(ctx, w, h);
    watermark(ctx, w, h);
    drawCardSticker(ctx, w, h);

    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png');
      video.classList.add('hidden');
      canvas.classList.remove('hidden');
      btnCapture.classList.add('hidden');
      btnRetake.classList.remove('hidden');
      btnDownload.classList.remove('hidden');
      btnDownload.href = dataUrl;
      stopStream();
    }, 120); // đợi ảnh lá bài (nếu có) vẽ xong
  }

  function retake() {
    video.classList.remove('hidden');
    canvas.classList.add('hidden');
    btnRetake.classList.add('hidden');
    btnDownload.classList.add('hidden');
    btnCapture.classList.remove('hidden');
    if (!stream) start(); else btnCapture.classList.remove('hidden');
  }

  btnStart.onclick = start;
  btnCapture.onclick = capture;
  btnRetake.onclick = retake;

  window.addEventListener('beforeunload', stopStream);
})();
