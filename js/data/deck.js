/* ============================================================
   data/deck.js — bộ bài 78 lá
   ------------------------------------------------------------
   Ảnh dùng bộ Rider–Waite–Smith (đã hết hạn bản quyền), lấy qua
   wsrv.nl cho nhanh, có link dự phòng nếu proxy chết.
   Muốn đổi lời giải: sửa thẳng trong hai bảng ARCANA và SUIT_LINES.
   ============================================================ */

window.DeckData = (function () {
  'use strict';

  /* ---------- 22 lá Ẩn Chính ---------- */
  // [tên, từ khoá, nghĩa xuôi, nghĩa ngược]
  const ARCANA = [
    ['The Fool', 'Gã Khờ', 'khởi đầu · hồn nhiên · liều một chút',
      'Một chương mới đang mở, và bạn chưa cần biết hết đường đi mới được phép bước. Sự ngây thơ ở đây là sức mạnh chứ không phải thiếu sót.',
      'Bước đi hơi vội khi chân chưa vững, hoặc đứng mãi ở mép vực vì sợ rơi nên bỏ lỡ chuyến đi của mình.'],
    ['The Magician', 'Nhà Ảo Thuật', 'ý chí · công cụ · biến ý thành việc',
      'Mọi thứ bạn cần đã nằm sẵn trên bàn. Việc còn lại là chọn một điều và làm cho tới, thay vì chờ một điều kiện hoàn hảo nào đó.',
      'Sức mạnh bị tản ra quá nhiều hướng, hoặc bạn đang dùng lời hay ý đẹp để che một ý định chưa thật lòng.'],
    ['The High Priestess', 'Nữ Tư Tế', 'trực giác · im lặng · điều chưa nói',
      'Câu trả lời đã có trong bạn từ trước khi bạn hỏi. Lá này khuyên bớt hỏi người khác lại một chút và ngồi yên nghe mình thêm một chút.',
      'Bạn đang bỏ ngoài tai linh cảm của chính mình, hoặc có một sự thật đang bị giữ kín khiến mọi thứ mờ đi.'],
    ['The Empress', 'Nữ Hoàng', 'nuôi dưỡng · dồi dào · dịu dàng',
      'Điều bạn chăm sóc đang lớn lên thật. Đây là mùa của sự mềm mại: chăm cho người, chăm cho việc, và nhớ chăm cả mình.',
      'Cho đi nhiều đến mức cạn, hoặc sáng tạo đang tắc vì bạn quên nghỉ ngơi.'],
    ['The Emperor', 'Hoàng Đế', 'nền móng · kỷ luật · ranh giới',
      'Đã đến lúc dựng khung: một lịch trình rõ, một ranh giới rõ, một lời từ chối rõ. Trật tự lúc này chính là sự tự do.',
      'Kiểm soát chặt quá làm mọi thứ cứng lại, hoặc bạn đang chống lại một nguyên tắc mà thật ra mình cần.'],
    ['The Hierophant', 'Giáo Hoàng', 'truyền thống · người dẫn đường · học hỏi',
      'Có một con đường đã được nhiều người đi qua an toàn. Hỏi một người từng trải, hoặc quay về một giá trị bạn từng tin.',
      'Khuôn khổ cũ đã chật. Bạn được phép làm khác, miễn là hiểu rõ vì sao mình làm khác.'],
    ['The Lovers', 'Đôi Tình Nhân', 'chọn lựa · hoà hợp · thành thật',
      'Không chỉ là tình yêu, mà là một lựa chọn đúng với giá trị thật của bạn. Thứ gì khiến bạn không phải diễn, thứ đó hợp.',
      'Trong lòng đang chia hai, hoặc một mối quan hệ đang lệch nhịp vì có điều chưa ai chịu nói ra.'],
    ['The Chariot', 'Cỗ Xe', 'quyết tâm · kiểm soát · tiến tới',
      'Hai luồng lực trái chiều đang được bạn cầm cương cùng lúc. Giữ hướng nhìn thẳng, đừng liếc sang xe bên cạnh.',
      'Đang chạy nhanh mà không rõ về đâu, hoặc năng lượng bị chia cho quá nhiều cuộc đua một lúc.'],
    ['Strength', 'Sức Mạnh', 'dịu dàng · kiên nhẫn · thuần phục',
      'Sức mạnh thật không gầm lên. Nó là bàn tay đặt lên nỗi sợ của mình và nói: mình ở đây, mình không bỏ bạn.',
      'Đang khắt khe với bản thân quá mức, hoặc hết kiên nhẫn ngay trước lúc mọi chuyện mềm ra.'],
    ['The Hermit', 'Ẩn Sĩ', 'tĩnh lặng · soi mình · một ngọn đèn',
      'Lui lại không phải là bỏ cuộc. Một quãng ở một mình sẽ trả lời được điều mà trăm cuộc trò chuyện không trả lời nổi.',
      'Ở một mình lâu quá thành ra trốn, hoặc bạn đang ngại nhờ người khác một tay.'],
    ['Wheel of Fortune', 'Bánh Xe Số Phận', 'chu kỳ · thời điểm · đổi chiều',
      'Bánh xe đang quay sang nhịp mới, thường là nhanh hơn bạn kịp chuẩn bị. Cứ bám trục mà ngồi, đừng bám vành.',
      'Một vòng lặp cũ đang lặp lại, hoặc bạn đang gồng chống một sự đổi thay vốn sẽ tốt cho mình.'],
    ['Justice', 'Công Lý', 'cân bằng · sự thật · hệ quả',
      'Mọi việc đang được cân đúng trọng lượng của nó. Nói thật và nhận phần trách nhiệm của mình là con đường ngắn nhất.',
      'Có chỗ chưa công bằng, hoặc bạn đang tự bào chữa thay vì nhìn thẳng vào phần mình làm chưa tốt.'],
    ['The Hanged Man', 'Người Treo Ngược', 'dừng lại · đổi góc nhìn · nhường',
      'Treo lơ lửng một chút cũng được. Có những việc chỉ sáng ra khi ta thôi cố đẩy và chịu nhìn nó ngược lại.',
      'Đang chờ đợi mà không còn lý do để chờ, hoặc hy sinh một thứ mà chẳng ai yêu cầu.'],
    ['Death', 'Cái Chết', 'kết thúc · lột xác · nhường chỗ',
      'Lá này hiếm khi nói về mất mát thật. Nó nói: có một chương đã hết, và chính việc khép lại mới mở được chương sau.',
      'Đang níu một thứ đã xong từ lâu. Nó không quay lại đâu, và bạn cũng không cần nó để ổn.'],
    ['Temperance', 'Điều Độ', 'pha trộn · chữa lành · vừa đủ',
      'Không quá tay bên nào. Nhịp đều và liều lượng vừa phải sẽ đưa bạn đi xa hơn mọi cú bứt tốc.',
      'Đang thái quá ở một đầu: làm quá sức, nghĩ quá nhiều, hoặc nóng vội với một vết thương cần thời gian.'],
    ['The Devil', 'Quỷ Dữ', 'ràng buộc · thói quen · cám dỗ',
      'Có một sợi dây đang giữ bạn lại, mà thường là bạn tự buộc. Gọi tên nó ra đã là cởi được một nửa.',
      'Bạn đang tháo xích. Hơi khó chịu, hơi trống trải, nhưng đúng hướng rồi đó.'],
    ['The Tower', 'Tòa Tháp', 'sụp đổ · sự thật · dọn nền',
      'Một cú rung khiến thứ xây trên nền giả rơi xuống. Đau, nhưng sau đó bạn mới biết nền thật nằm ở đâu.',
      'Khủng hoảng đang được trì hoãn chứ chưa qua, hoặc bạn đang vá tạm một chỗ cần đập đi xây lại.'],
    ['The Star', 'Ngôi Sao', 'hy vọng · chữa lành · tin lại',
      'Sau cơn giông là bầu trời rất trong. Lá này nói bạn được phép hy vọng lần nữa, lần này nhẹ nhàng hơn.',
      'Niềm tin đang cạn. Chưa cần tin vào tương lai vội, tin một việc nhỏ hôm nay thôi cũng được.'],
    ['The Moon', 'Mặt Trăng', 'mơ hồ · nỗi sợ · giấc mơ',
      'Đường đi đang mờ, và cái bạn sợ có thể chỉ là bóng chứ không phải thú. Đi chậm, đừng quay đầu.',
      'Sương đang tan. Điều từng làm bạn hoang mang dần lộ hình dạng thật của nó.'],
    ['The Sun', 'Mặt Trời', 'sáng rõ · niềm vui · được thấy',
      'Mọi thứ hiện ra rõ ràng và ấm áp. Đây là lúc để vui thật lòng và không phải xin lỗi vì điều đó.',
      'Niềm vui đang bị che tạm. Nó chưa mất, chỉ là mây đi ngang.'],
    ['Judgement', 'Phán Xét', 'thức tỉnh · gọi tên · làm lại',
      'Có một tiếng gọi bạn nghe đã lâu mà vờ như không nghe. Giờ là lúc trả lời nó.',
      'Tự phán xét mình nặng quá, hoặc còn do dự trước một quyết định mà trong lòng đã rõ.'],
    ['The World', 'Thế Giới', 'trọn vẹn · khép vòng · ăn mừng',
      'Một vòng đã đi hết. Hãy dừng lại đủ lâu để ăn mừng trước khi lao vào vòng kế tiếp.',
      'Còn một mảnh chưa khớp. Đừng vội tuyên bố kết thúc khi lòng chưa thấy đủ.']
  ];

  /* ---------- 4 chất ---------- */
  const SUITS = [
    { key: 'wands',     name: 'Wands',     vi: 'Gậy',    el: 'Lửa',  domain: 'đam mê, hành động và con đường sự nghiệp' },
    { key: 'cups',      name: 'Cups',      vi: 'Cốc',    el: 'Nước', domain: 'cảm xúc, tình thân và các mối quan hệ' },
    { key: 'swords',    name: 'Swords',    vi: 'Kiếm',   el: 'Khí',  domain: 'suy nghĩ, lời nói và những giằng co trong đầu' },
    { key: 'pentacles', name: 'Pentacles', vi: 'Tiền',   el: 'Đất',  domain: 'tiền bạc, sức khoẻ và những việc rất cụ thể' }
  ];

  const RANKS = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight',
                 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];

  const RANK_VI = ['Át', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám',
                   'Chín', 'Mười', 'Thị Đồng', 'Hiệp Sĩ', 'Hoàng Hậu', 'Đức Vua'];

  /* ---------- Lời giải 56 lá Ẩn Phụ ----------
     Mỗi chất 14 cặp [xuôi, ngược]. Viết ngắn để đọc trên điện thoại. */
  const SUIT_LINES = {
    wands: [
      ['Một tia hứng khởi vừa loé. Đừng phân tích nó, hãy làm thử một việc nhỏ ngay hôm nay.', 'Ý tưởng hay nhưng chưa có chỗ bắt đầu, hoặc lửa vừa nhen đã bị dội nước.'],
      ['Bạn đang đứng trước hai ngả và đã nhìn thấy cả hai. Chọn ngả làm bạn hồi hộp, đừng chọn ngả an toàn vì sợ.', 'Lên kế hoạch mãi mà chưa bước, hoặc sợ rời chỗ quen.'],
      ['Việc đã ra khơi. Giờ là lúc chờ đúng cách: chuẩn bị cho cái đang tới chứ không đứng ngóng.', 'Kết quả đến chậm hơn mong, hoặc thiếu người cùng gánh.'],
      ['Một khoảng ăn mừng, một mái nhà, một nhóm người khiến bạn thấy yên. Nhận lấy đi.', 'Cảm giác chưa thuộc về đâu, hoặc niềm vui bị hoãn vì bạn chưa cho phép mình vui.'],
      ['Va chạm nhỏ, cạnh tranh lành. Nó cọ cho bạn sắc lại chứ không phải để hạ bạn.', 'Cãi cọ vòng vo làm mòn sức cả hai. Bước ra khỏi cuộc tranh luận này đi.'],
      ['Công sức được nhìn thấy. Nhận lời khen mà không hạ thấp mình xuống.', 'Làm tốt mà chẳng ai hay, hoặc bạn đang cần được công nhận hơn mức cần thiết.'],
      ['Giữ vững vị trí của bạn. Bạn ở thế cao hơn mình tưởng.', 'Phòng thủ mệt quá rồi. Có trận nào không đáng đánh thì thôi.'],
      ['Mọi thứ tăng tốc: tin nhắn, chuyến đi, câu trả lời chờ mãi. Bắt lấy nhịp này.', 'Vội mà rối, hoặc im lặng kéo dài làm mọi thứ đứng hình.'],
      ['Mệt nhưng vẫn đứng. Bạn gần hơn bạn nghĩ, chỉ còn một hiệp nữa thôi.', 'Kiệt sức và đề phòng cả những người thật lòng. Hạ vai xuống một chút.'],
      ['Ôm hơi nhiều rồi. Bỏ bớt vài thứ xuống không làm bạn kém đi đâu.', 'Gánh nặng bắt đầu được san. Nhờ người khác là một kỹ năng, không phải thua.'],
      ['Một tin vui, một lời mời, một tò mò trẻ con đáng nghe theo.', 'Hào hứng rồi nguội nhanh, hoặc tin chưa chắc đã đúng.'],
      ['Lao đi hết mình vì một điều bạn tin. Nhiệt huyết này rất hợp lúc này.', 'Bốc đồng quá tay, hứa nhiều hơn làm được.'],
      ['Bạn ấm và có sức hút tự nhiên. Người ta tìm tới bạn vì bạn vững chứ không vì bạn cố.', 'Tự tin đang lung lay, hoặc năng lượng bị người khác hút cạn.'],
      ['Tầm nhìn dài và gan làm tới. Dẫn dắt được lúc này.', 'Áp đặt tầm nhìn của mình lên người khác, hoặc nóng nảy phá hỏng việc đang tốt.']
    ],
    cups: [
      ['Trái tim vừa được rót đầy. Một tình cảm mới, một sự tha thứ, một sự mềm lại.', 'Cảm xúc bị chặn. Bạn đang giữ lại lời chưa nói với ai đó.'],
      ['Hai người thật sự nhìn thấy nhau. Kết nối này cân bằng và lành.', 'Lệch nhịp trong một mối quan hệ. Ai đó đang cố nhiều hơn.'],
      ['Bạn bè, tiệc nhỏ, người thân. Hãy để mình được vui cùng người khác.', 'Nhóm bạn có điều gợn, hoặc vui quá đà để khỏi phải nghĩ.'],
      ['Có một món quà đang chìa ra mà bạn chán nên không nhìn. Ngẩng lên xem thử.', 'Bạn bắt đầu thấy lại điều mình đang có. Chán cũng có hồi kết.'],
      ['Có mất mát thật, và buồn là hợp lệ. Nhưng phía sau lưng bạn vẫn còn hai chiếc cốc chưa đổ.', 'Nỗi buồn đang nguôi. Bạn quay lại được rồi.'],
      ['Một kỷ niệm hoặc một người cũ ghé qua, dịu dàng chứ không đau.', 'Sống trong quá khứ hơi lâu. Hôm nay cũng đáng sống lắm.'],
      ['Nhiều lựa chọn quá và cái nào cũng lung linh. Bỏ bớt những cái chỉ đẹp trong tưởng tượng.', 'Sương tan, bạn thấy rõ đâu là thật. Chọn được rồi.'],
      ['Quay lưng bỏ đi một thứ tốt nhưng không còn đúng. Việc này cần can đảm, và bạn có.', 'Đi rồi lại quay đầu. Hỏi mình: mình quay lại vì thương hay vì sợ trống?'],
      ['Một điều ước thành. Cho phép mình hài lòng mà không thấy tội lỗi.', 'Được cái mình muốn mà vẫn hụt. Có thể điều bạn muốn không phải điều bạn cần.'],
      ['Sự ấm áp đủ đầy, một gia đình theo nghĩa rộng nhất. Yên thật sự.', 'Bức tranh đẹp ngoài mặt mà trong nhà đang lệch. Nói chuyện đi.'],
      ['Một lời tỏ bày, một cảm xúc mới, một chút ngại ngùng dễ thương.', 'Nhạy cảm quá mức, hoặc giận dỗi thay cho nói thẳng.'],
      ['Ai đó mang đến một lời mời chân thành. Hoặc chính bạn nên là người ngỏ lời.', 'Lời hay mà chưa có hành động kèm theo. Chờ xem thêm chút.'],
      ['Bạn hiểu lòng người và hiểu lòng mình. Lắng nghe lúc này quý hơn lời khuyên.', 'Ôm cảm xúc của người khác nhiều quá. Bạn cũng cần được đỡ.'],
      ['Bình tĩnh giữa sóng. Bạn giữ được lòng mình mà vẫn tử tế với người.', 'Đè nén cảm xúc rồi gọi đó là trưởng thành. Xả ra một chút đi.']
    ],
    swords: [
      ['Một ý nghĩ cắt qua sương mù. Sự thật này sắc nhưng cần thiết.', 'Đầu ong ong, thông tin nhiều mà chẳng rõ gì.'],
      ['Bạn đang bịt mắt né một quyết định. Tháo khăn ra, nhìn rồi hãy chọn.', 'Bế tắc đang vỡ. Bạn sắp chọn được rồi.'],
      ['Có một lời làm đau, và đau là thật. Đừng vội bảo mình phải ổn ngay.', 'Vết thương đang khép. Chậm thôi cũng được.'],
      ['Nghỉ. Không phải bỏ cuộc, là nạp lại. Bạn được phép tắt máy.', 'Nghỉ mãi mà vẫn mệt, hoặc đã đến lúc trở lại cuộc chơi.'],
      ['Thắng cuộc cãi này thì được gì? Có những trận thắng còn tốn hơn thua.', 'Bạn đang hạ vũ khí. Làm lành là lựa chọn mạnh mẽ.'],
      ['Rời khỏi vùng nước động, đi về phía lặng hơn. Chuyến đi này là đúng.', 'Muốn đi mà còn vướng, hoặc mang nguyên hành lý cũ sang bờ mới.'],
      ['Có điều gì đó chưa minh bạch, của người khác hoặc của chính bạn.', 'Sự thật lộ ra. Thú nhận sớm thì nhẹ sớm.'],
      ['Bạn thấy mình bị trói, nhưng dây lỏng hơn bạn tưởng. Thử nhúc nhích một chút.', 'Bạn đang tự cởi trói. Tiếp tục.'],
      ['Ba giờ sáng và đầu không chịu tắt. Nỗi lo đang to hơn sự thật.', 'Cơn lo qua dần. Sáng ra mọi thứ nhỏ lại.'],
      ['Chạm đáy rồi. Điều dễ chịu duy nhất của đáy là từ đây chỉ còn đi lên.', 'Đang gượng dậy. Đừng kể lại chuyện cũ quá nhiều lần.'],
      ['Tò mò, hóng chuyện, học cái mới. Hỏi thẳng thì hơn đoán.', 'Nghe hơi nồi chõ, hoặc nói khi chưa đủ hiểu.'],
      ['Lao thẳng vào vấn đề với lý lẽ rõ ràng. Nhanh và thẳng là đúng lúc này.', 'Nói quá gắt, hoặc lao đi mà chưa nghe ai hết.'],
      ['Nhìn mọi thứ rõ và không tự lừa mình. Sự sáng suốt này có được từ những lần đã đau.', 'Lạnh lùng quá hoá xa cách, hoặc tự phê bình quá nặng tay.'],
      ['Lý trí cầm lái, công bằng và thẳng thắn. Quyết định đi, bạn đủ tỉnh.', 'Cứng nhắc, phán xét, hoặc dùng lý lẽ để né cảm xúc.']
    ],
    pentacles: [
      ['Một cơ hội rất cụ thể: việc làm, khoản tiền, một lời đề nghị. Cầm lấy và làm tới.', 'Cơ hội trôi qua vì do dự, hoặc kế hoạch chưa đủ thực tế.'],
      ['Tung hứng nhiều việc mà vẫn giữ được thăng bằng. Nhưng đừng thêm quả thứ ba.', 'Quá tải. Bỏ bớt một việc là cách duy nhất.'],
      ['Làm cùng người giỏi, học nghề, được nhận xét thẳng. Đây là giai đoạn lên tay.', 'Việc nhóm lệch vai, hoặc bạn đang làm một mình phần của ba người.'],
      ['Giữ chặt cũng là một chiến lược, nhưng kiểm tra xem mình đang giữ hay đang sợ.', 'Bạn đang mở tay ra. Rộng rãi một chút thấy dễ thở hơn.'],
      ['Thiếu thốn, hoặc cảm giác bị bỏ lại ngoài cửa. Bên trong có ánh sáng, gõ cửa đi.', 'Giai đoạn khó đang qua. Sự giúp đỡ tới từ nơi bất ngờ.'],
      ['Cho và nhận đang đúng nhịp. Hôm nay bạn đỡ ai đó, mai sẽ có người đỡ bạn.', 'Giúp có điều kiện, hoặc mắc nợ ân tình khó xử.'],
      ['Dừng lại xem cây mình trồng. Chưa hái được không có nghĩa là trồng sai.', 'Sốt ruột nhổ lên xem rễ. Kiên nhẫn thêm một mùa.'],
      ['Làm đi làm lại cho tinh. Giai đoạn buồn tẻ này chính là lúc tay nghề hình thành.', 'Làm cho xong, hoặc chán nghề. Xem lại vì sao mình bắt đầu.'],
      ['Tự lo được cho mình và tận hưởng điều đó. Sự độc lập này rất đáng.', 'Quá bận kiếm sống mà quên sống, hoặc dựa dẫm hơi lâu.'],
      ['Dài hạn, gia đình, cái để lại. Những gì bạn xây đang bền.', 'Chuyện tiền bạc trong nhà cần nói rõ, đừng để mai tính.'],
      ['Tin tốt về học hành, tiền bạc, một khởi đầu rất thực tế. Ghi danh đi.', 'Trì hoãn, hoặc kế hoạch mới chỉ nằm trong đầu.'],
      ['Chậm mà chắc, đều mà bền. Không hào nhoáng nhưng về đích.', 'Giậm chân tại chỗ, hoặc quá thận trọng nên bỏ lỡ.'],
      ['Chăm sóc thực tế: nấu một bữa, dọn một góc, khám một lần. Rất hợp lúc này.', 'Quên chăm mình, hoặc lo cho người khác tới mức cạn.'],
      ['Vững chãi, dư dả, biết cách giữ của và giữ người. Bạn đang ở thế mạnh.', 'Bám vào vật chất quá chặt, hoặc cứng đầu trước lời khuyên đúng.']
    ]
  };

  /* ---------- Dựng bộ bài ---------- */
  function build() {
    const deck = [];
    const path = 'sacred-texts.com/tarot/pkt/img/';
    const proxy = 'https://wsrv.nl/?url=';

    ARCANA.forEach((a, i) => {
      const file = 'ar' + String(i).padStart(2, '0') + '.jpg';
      deck.push({
        id: 'major-' + i,
        name: a[0],
        vi: a[1],
        keys: a[2],
        up: a[3],
        rev: a[4],
        type: 'major',
        number: i,
        seed: i + 1,
        img: proxy + path + file,
        img2: 'https://' + path + file
      });
    });

    SUITS.forEach((s, si) => {
      RANKS.forEach((r, ri) => {
        const line = SUIT_LINES[s.key][ri];
        const file = s.key.slice(0, 2) + String(ri + 1).padStart(2, '0') + '.jpg';
        deck.push({
          id: s.key + '-' + (ri + 1),
          name: r + ' of ' + s.name,
          vi: RANK_VI[ri] + ' ' + s.vi,
          keys: s.el + ' · ' + s.domain.split(',')[0],
          up: line[0],
          rev: line[1],
          type: 'minor',
          suit: s.key,
          suitName: s.vi,
          element: s.el,
          domain: s.domain,
          number: ri + 1,
          seed: 100 + si * 20 + ri,
          img: proxy + path + file,
          img2: 'https://' + path + file
        });
      });
    });

    return deck;
  }

  const DECK = build();

  return {
    all: DECK,
    suits: SUITS,
    byId: (id) => DECK.find(c => c.id === id),

    /* Ảnh kèm sẵn phương án dự phòng nếu proxy lỗi */
    imgTag(card, cls) {
      const fb = "if(this.dataset.t){this.style.display='none';this.parentNode.classList.add('no-img');}" +
                 "else{this.dataset.t=1;this.src='" + card.img2 + "';}";
      return `<img src="${card.img}" alt="${card.name}" class="${cls || ''}" loading="lazy" onerror="${fb}">`;
    }
  };
})();
