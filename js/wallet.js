/* ============================================================
   wallet.js — trang Nạp & Gói thành viên
   ------------------------------------------------------------
   Không có cổng thanh toán thật trong bản này (Momo/VNPay/Stripe
   cần backend + tài khoản doanh nghiệp). Luồng ở đây là "chuyển
   khoản tay + admin duyệt", chạy được ngay hôm nay, không cần
   khoá bí mật nào. Muốn nối cổng thật: xem README, phần "Thương mại".
   ========================================================== */
(function () {
  'use strict';

  const FEATURES = {
    vi: {
      free: ['3 lượt trải bài Tarot mỗi ngày', 'Lá bài hôm nay & Vòng quay', 'Thần số học, Chiêm tinh cơ bản'],
      plus: ['Trải bài không giới hạn', 'Luận giải sâu hơn cho mỗi lá', 'Không chờ quảng cáo', 'Photobooth khung cao cấp'],
      vip: ['Mọi quyền lợi của Plus', 'Ưu tiên hỗ trợ từ Nody', 'Xuất PDF lịch sử xem bói', 'Huy hiệu VIP trên hồ sơ']
    },
    en: {
      free: ['3 tarot readings per day', 'Card of the Day & Lucky Wheel', 'Basic numerology & horoscope'],
      plus: ['Unlimited readings', 'Deeper interpretation per card', 'No ad waiting', 'Premium photobooth frames'],
      vip: ['Everything in Plus', 'Priority support from Nody', 'Export reading history as PDF', 'VIP badge on your profile']
    },
    zh: {
      free: ['每天3次塔罗占卜', '每日一牌 & 幸运转盘', '基础生命数字与星座运势'],
      plus: ['占卜次数不限', '每张牌更深入的解读', '无需等待广告', '高级拍照亭相框'],
      vip: ['包含 Plus 全部权益', '诺迪优先客服支持', '导出占卜记录 PDF', '个人主页 VIP 徽章']
    },
    ko: {
      free: ['하루 3회 타로 리딩', '오늘의 카드 & 행운의 룰렛', '기본 수비학 & 별자리 운세'],
      plus: ['무제한 리딩', '카드마다 더 깊은 해석', '광고 대기 없음', '프리미엄 포토부스 프레임'],
      vip: ['Plus의 모든 혜택', '노디의 우선 지원', '점술 기록 PDF 내보내기', '프로필 VIP 배지']
    },
    ja: {
      free: ['1日3回のタロット占い', '今日のカード & ラッキーホイール', '基本の数秘術・星占い'],
      plus: ['占い回数無制限', 'カードごとのより深い解釈', '広告待ちなし', 'プレミアムフォトブースフレーム'],
      vip: ['Plusの全特典', 'ノディの優先サポート', '占い履歴のPDF書き出し', 'プロフィールにVIPバッジ']
    }
  };

  const BANK_INFO = {
    vi: 'Chuyển khoản tới: <b>Vietcombank — 0123 456 789 — NODY TAROT</b>. Nội dung ghi rõ email tài khoản của bạn. Sau khi chuyển, điền số tiền + ghi chú bên dưới rồi bấm Xác nhận — Nody sẽ xét duyệt trong vòng 24 giờ.',
    en: 'Transfer to: <b>Vietcombank — 0123 456 789 — NODY TAROT</b>. Include your account email in the transfer note. After transferring, fill in the amount and note below, then submit — Nody will review it within 24 hours.',
    zh: '请转账至：<b>Vietcombank — 0123 456 789 — NODY TAROT</b>，备注请填写你的账号邮箱。转账后填写下方金额与备注并提交，诺迪会在24小时内审核。',
    ko: '다음 계좌로 송금하세요: <b>Vietcombank — 0123 456 789 — NODY TAROT</b>. 송금 메모에 계정 이메일을 적어주세요. 송금 후 아래에 금액과 메모를 입력하고 제출하면, 노디가 24시간 이내에 확인합니다.',
    ja: '振込先：<b>Vietcombank — 0123 456 789 — NODY TAROT</b>。振込メモにアカウントのメールアドレスを記入してください。振込後、下記に金額とメモを入力して送信すると、24時間以内にノディが確認します。'
  };

  const STATUS_LABEL = {
    pending:  { vi: 'Đang chờ duyệt', en: 'Pending', zh: '待审核', ko: '대기 중', ja: '承認待ち' },
    approved: { vi: 'Đã duyệt', en: 'Approved', zh: '已通过', ko: '승인됨', ja: '承認済み' },
    rejected: { vi: 'Từ chối', en: 'Rejected', zh: '已拒绝', ko: '거절됨', ja: '却下' }
  };

  function lang() { return (window.I18N && window.I18N.get()) || 'vi'; }

  function renderPlans() {
    const f = FEATURES[lang()] || FEATURES.vi;
    document.getElementById('planFreeList').innerHTML = f.free.map(x => `<li>${x}</li>`).join('');
    document.getElementById('planPlusList').innerHTML = f.plus.map(x => `<li>${x}</li>`).join('');
    document.getElementById('planVipList').innerHTML = f.vip.map(x => `<li>${x}</li>`).join('');
    document.getElementById('bankInfo').innerHTML = BANK_INFO[lang()] || BANK_INFO.vi;
  }

  function renderBalance() {
    const line = document.getElementById('walletBalanceLine');
    if (!window.Nody || !window.Nody.user) {
      line.textContent = '';
      return;
    }
    const p = window.Nody.profile;
    const label = window.I18N ? window.I18N.t('wallet.balance') : 'Số dư hiện tại';
    line.innerHTML = `${label}: <b style="color:var(--moon)">${(p && p.wallet || 0).toLocaleString('vi-VN')}đ</b>`;
  }

  /* Bắt buộc đăng nhập mới nạp được: khoá sẵn các ô nhập + nút gửi,
     kèm dòng nhắc, thay vì chỉ chặn lúc bấm gửi (đỡ bất ngờ cho người dùng). */
  function updateLoginGate() {
    const loggedIn = !!(window.Nody && window.Nody.user);
    const note = document.getElementById('topupLoginNote');
    const amount = document.getElementById('topupAmount');
    const note2 = document.getElementById('topupNote');
    const btn = document.getElementById('btnRequestTopup');
    if (note) note.style.display = loggedIn ? 'none' : 'block';
    [amount, note2, btn].forEach(el => { if (el) el.disabled = !loggedIn; });
  }

  async function loadTopups() {
    const host = document.getElementById('topupRows');
    if (!window.Nody || !window.Nody.user) {
      host.innerHTML = `<tr><td colspan="5" class="mute">—</td></tr>`;
      return;
    }
    try {
      const rows = await window.Nody.myTopups();
      if (!rows.length) {
        host.innerHTML = `<tr><td colspan="5" class="mute">—</td></tr>`;
        return;
      }
      host.innerHTML = rows.map(r => {
        const when = r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString('vi-VN') : '—';
        const st = STATUS_LABEL[r.status] || STATUS_LABEL.pending;
        return `<tr>
          <td>${when}</td>
          <td>${(r.amount || 0).toLocaleString('vi-VN')}đ</td>
          <td>${r.method || 'bank'}</td>
          <td>${escapeHTML(r.note || '')}</td>
          <td><span class="status-pill ${r.status || 'pending'}">${st[lang()] || st.vi}</span></td>
        </tr>`;
      }).join('');
    } catch (e) {
      host.innerHTML = `<tr><td colspan="5" class="mute">—</td></tr>`;
    }
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function wire() {
    document.querySelectorAll('.js-choose-plan').forEach(b => {
      b.onclick = () => {
        document.getElementById('topupAmount').value = b.dataset.amount;
        document.getElementById('topupAmount').scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
    });

    document.getElementById('btnRequestTopup').onclick = async () => {
      const msg = document.getElementById('topupMsg');
      if (!window.Shell.requireLogin(window.I18N ? window.I18N.t('wallet.loginToTopup') : undefined)) return;
      const amount = Number(document.getElementById('topupAmount').value);
      const note = document.getElementById('topupNote').value.trim();
      if (!amount || amount < 10000) { msg.textContent = 'Nhập số tiền hợp lệ (tối thiểu 10.000đ) nhé.'; return; }
      msg.textContent = '…';
      try {
        await window.Nody.requestTopup({ amount, method: 'bank', note });
        msg.textContent = 'Đã gửi yêu cầu! Nody sẽ duyệt trong 24 giờ.';
        document.getElementById('topupNote').value = '';
        loadTopups();
      } catch (e) {
        msg.textContent = window.Nody.readError ? window.Nody.readError(e) : 'Có lỗi, thử lại nhé.';
      }
    };
  }

  window.addEventListener('nody:auth', () => { renderBalance(); loadTopups(); updateLoginGate(); });
  window.addEventListener('nody:lang', renderPlans);

  document.addEventListener('DOMContentLoaded', () => {
    renderPlans();
    renderBalance();
    loadTopups();
    updateLoginGate();
    wire();
  });
})();
