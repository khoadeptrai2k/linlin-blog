/** Topic theory for units that had only generic grammar, plus extra frames for older units. Original Linlin notes. */

function lang(vi, en, zh, th) {
  return { vi, en, zh, th };
}

function block(structure, patterns, usage, apply) {
  return { structure, patterns, usage, apply };
}

function pat(form, use, example, note) {
  return { form, use, example, note };
}

export const UNIT_THEORY_MORE = {
  sounds: block(
    lang(
      "Trước hết nghe và đọc. Một âm một lần. Chưa vào câu đời sống.",
      "Hear and read first. One sound at a time. Daily sentences come next.",
      "先听再认读。一个音一次。生活句子放后面。",
      "ฟังและอ่านก่อน หนึ่งเสียงหนึ่งครั้ง ประโยคชีวิตไว้ทีหลัง",
    ),
    [
      pat(
        lang("Nghe → lặp lại.", "Listen → repeat.", "听 → 重复。", "ฟัง → พูดซ้ำ"),
        lang("Vào lớp âm.", "The sounds class.", "读音课。", "คาบเสียง"),
        lang("Nghe rồi lặp lại.", "Listen, then repeat.", "先听，再重复。", "ฟังแล้วพูดซ้ำ"),
        lang("Bấm loa nếu chưa đọc được chữ.", "Use the speaker if you cannot read yet.", "不认识字就先听。", "อ่านไม่ได้ให้กดลำโพง"),
      ),
      pat(
        lang("Đọc chậm + một chữ.", "Say slowly + one unit.", "慢读 + 一个单位。", "อ่านช้า + หนึ่งหน่วย"),
        lang("Tách âm.", "Split the sound.", "把音拆开。", "แยกเสียง"),
        lang("Đọc chậm, một âm một lần.", "Say it slowly, one sound at a time.", "慢一点，一个音一次。", "อ่านช้า หนึ่งเสียงหนึ่งครั้ง"),
        lang("Đừng ghép cả câu hôm nay.", "Do not join a full sentence today.", "今天不要连成整句。", "วันนี้ยังไม่ต่อทั้งประโยค"),
      ),
    ],
    [
      lang("Chữ bản địa có thể lạ. Loa và phiên âm đi cùng.", "The script may be new. Speaker and reading go together.", "字可能陌生。声音和拼音一起给。", "ตัวอักษรอาจแปลก ลำโพงกับคำอ่านไปด้วยกัน"),
      lang("Phiên âm kiểu Việt chỉ là cầu. Tai mới là chuẩn.", "Vietnamese reading is a bridge. The ear is the model.", "越南读法只是桥。耳朵才是标准。", "คำอ่านแบบเวียดเป็นสะพาน หูคือมาตรฐาน"),
    ],
    [
      {
        prompt: lang("Nghe và lặp một âm.", "Hear and repeat one sound.", "听并重复一个音。", "ฟังแล้วพูดซ้ำหนึ่งเสียง"),
        frame: lang("Nghe rồi ____.", "Listen, then ____.", "先听，再____。", "ฟังแล้ว ____"),
        sample: lang("Nghe rồi lặp lại.", "Listen, then repeat.", "先听，再重复。", "ฟังแล้วพูดซ้ำ"),
      },
    ],
  ),
  greet: block(
    lang(
      "Chào, xưng, cảm ơn, xin lỗi — bốn mẫu riêng, đừng dồn một câu.",
      "Greet, name, thank, apologise — four separate frames.",
      "问好、报名、谢谢、对不起，四个句型分开用。",
      "ทัก บอกชื่อ ขอบคุณ ขอโทษ — สี่โครง อย่ายัดประโยคเดียว",
    ),
    [
      pat(
        lang("Cảm ơn. / Không có gì.", "Thank you. / You're welcome.", "谢谢。/ 不客气。", "ขอบคุณ / ไม่เป็นไร"),
        lang("Sau khi được giúp.", "After someone helps you.", "别人帮了你之后。", "หลังจากมีคนช่วย"),
        lang("Cảm ơn nhiều.", "Thank you so much.", "非常感谢。", "ขอบคุณมาก"),
        lang("Không có gì = chấp nhận lời cảm ơn.", "You're welcome accepts the thanks.", "不客气接住谢谢。", "ไม่เป็นไร รับคำขอบคุณ"),
      ),
      pat(
        lang("Xin lỗi. / Không sao.", "Sorry. / It's okay.", "对不起。/ 没关系。", "ขอโทษ / ไม่เป็นไร"),
        lang("Lỗi nhỏ đời sống.", "A small everyday apology.", "生活里的小道歉。", "ขอโทษเรื่องเล็ก"),
        lang("Xin lỗi mình trễ.", "Sorry I am late.", "对不起我迟到了。", "ขอโทษที่สาย"),
        lang("Không sao không có nghĩa là không có lỗi.", "It's okay does not mean nothing happened.", "没关系不是说没发生。", "ไม่เป็นไร ไม่ได้แปลว่าไม่มีเรื่อง"),
      ),
    ],
    [lang("Một lượt chào chỉ một việc.", "One turn, one job.", "一轮只办一件事。", "หนึ่งรอบ หนึ่งเรื่อง")],
    [
      {
        prompt: lang("Cảm ơn sau khi được giúp.", "Thank someone who helped.", "别人帮了你，说谢谢。", "ขอบคุณคนที่ช่วย"),
        frame: lang("Cảm ơn ____.", "Thank you for ____.", "谢谢你____。", "ขอบคุณที่ ____"),
        sample: lang("Cảm ơn bạn đã đợi.", "Thank you for waiting.", "谢谢你等我。", "ขอบคุณที่รอ"),
      },
    ],
  ),
  market: block(
    lang(
      "Chợ: hỏi còn không, hỏi giá, xin bớt, lấy túi. Số + loại từ + hàng.",
      "Market: still have it, price, a bit off, a bag. Number + item.",
      "市场：还有吗、多少钱、便宜点、拿袋子。数量 + 货。",
      "ตลาด: ยังมีไหม ราคา ขอลด ขอถุง จำนวน + ของ",
    ),
    [
      pat(
        lang("Còn + hàng không?", "Do you still have + item?", "还有 + 货 吗？", "ยังมี + ของ ไหม"),
        lang("Hỏi hàng còn.", "Ask if it is left.", "问还剩不剩。", "ถามว่ายังมีไหม"),
        lang("Còn cam không?", "Do you still have oranges?", "还有橙子吗？", "ยังมีส้มไหม"),
        lang("Hết = không còn bán.", "Sold out = none left.", "卖完了=没有了。", "หมด = ไม่เหลือ"),
      ),
      pat(
        lang("Bao nhiêu một + đơn vị?", "How much for one + unit?", "多少钱一 + 单位？", "เท่าไหร่ ต่อ + หน่วย"),
        lang("Hỏi giá.", "Ask the price.", "问价。", "ถามราคา"),
        lang("Bao nhiêu một cân?", "How much a kilo?", "多少钱一公斤？", "กิโลละเท่าไหร่"),
        lang("Lặp đơn vị: cân, trái, túi.", "Repeat the unit: kilo, piece, bag.", "重复单位。", "พูดหน่วยซ้ำ"),
      ),
      pat(
        lang("Bớt một chút được không?", "Could you take a bit off?", "便宜一点可以吗？", "ลดหน่อยได้ไหม"),
        lang("Xin giá mềm, lịch sự.", "Ask for a softer price, politely.", "客气地讲价。", "ต่อราคาแบบสุภาพ"),
        lang("Bớt một chút được không?", "Could you take a bit off?", "便宜一点可以吗？", "ลดหน่อยได้ไหม"),
        lang("Giọng hỏi, không ra lệnh.", "A question, not an order.", "疑问口气。", "น้ำเสียงถาม"),
      ),
    ],
    [
      lang("Hỏi còn trước, hỏi giá sau.", "Ask if it is left, then the price.", "先问还有吗，再问价。", "ถามยังมีก่อน แล้วค่อยถามราคา"),
      lang("Lấy / cân / túi là ba việc khác nhau.", "Take / weigh / bag are three jobs.", "要、称、袋子是三件事。", "เอา ชั่ง ถุง คนละเรื่อง"),
    ],
    [
      {
        prompt: lang("Hỏi còn cam.", "Ask if oranges are left.", "问还有没有橙子。", "ถามว่ายังมีส้มไหม"),
        frame: lang("Còn ____ không?", "Do you still have ____?", "还有____吗？", "ยังมี ____ ไหม"),
        sample: lang("Còn cam không?", "Do you still have oranges?", "还有橙子吗？", "ยังมีส้มไหม"),
      },
      {
        prompt: lang("Hỏi giá một cân.", "Ask the price per kilo.", "问一公斤多少钱。", "ถามราคากิโล"),
        frame: lang("Bao nhiêu một ____?", "How much a ____?", "多少钱一____？", "____ ละเท่าไหร่"),
        sample: lang("Bao nhiêu một cân?", "How much a kilo?", "多少钱一公斤？", "กิโลละเท่าไหร่"),
      },
    ],
  ),
  city: block(
    lang(
      "Trong thành phố: hỏi đường bằng gần / xa / bên trái / đi thẳng, rồi điểm mốc.",
      "In the city: ask the way with near / far / left / straight, then a landmark.",
      "城里问路：近、远、左边、直走，再加地标。",
      "ในเมือง: ถามทางด้วย ใกล้ ไกล ซ้าย ตรง แล้วจุดสังเกต",
    ),
    [
      pat(
        lang("____ ở đâu?", "Where is ____?", "____在哪里？", "____ อยู่ไหน"),
        lang("Hỏi địa điểm.", "Ask for a place.", "问地点。", "ถามสถานที่"),
        lang("Nhà ga ở đâu?", "Where is the station?", "车站在哪里？", "สถานีอยู่ไหน"),
        lang("Trả lời: ở + gần + mốc.", "Answer: at / near + landmark.", "回答：在 + 靠近 + 地标。", "ตอบ: อยู่ + ใกล้ + จุด"),
      ),
      pat(
        lang("Đi thẳng, rồi rẽ trái / phải.", "Go straight, then turn left / right.", "直走，然后左转 / 右转。", "ไปตรง แล้วเลี้ยวซ้าย / ขวา"),
        lang("Chỉ đường từng bước.", "Give the way one step at a time.", "一步一步指路。", "ชี้ทางทีละขั้น"),
        lang("Đi thẳng, rồi rẽ trái.", "Go straight, then turn left.", "直走，然后左转。", "ไปตรง แล้วเลี้ยวซ้าย"),
        lang("Một câu một bước.", "One sentence, one step.", "一句一步。", "หนึ่งประโยค หนึ่งก้าว"),
      ),
      pat(
        lang("Xa không? / Gần đây không?", "Is it far? / Is it near here?", "远吗？/ 近吗？", "ไกลไหม / ใกล้ที่นี่ไหม"),
        lang("Hỏi khoảng cách.", "Ask about distance.", "问距离。", "ถามระยะ"),
        lang("Xa không?", "Is it far?", "远吗？", "ไกลไหม"),
        lang("Có thể thêm: đi bộ được.", "You can add: you can walk.", "可补：可以走着去。", "เติมได้: เดินได้"),
      ),
    ],
    [
      lang("Hỏi chỗ trước, hỏi xa sau.", "Ask where, then ask if it is far.", "先问在哪，再问远不远。", "ถามที่ก่อน แล้วค่อยถามไกล"),
      lang("Dùng điểm mốc đời sống: ngân hàng, đèn đỏ.", "Use everyday landmarks: bank, traffic light.", "用地标：银行、红绿灯。", "ใช้จุดสังเกต: ธนาคาร ไฟแดง"),
    ],
    [
      {
        prompt: lang("Hỏi nhà ga.", "Ask for the station.", "问车站。", "ถามสถานี"),
        frame: lang("____ ở đâu?", "Where is ____?", "____在哪里？", "____ อยู่ไหน"),
        sample: lang("Nhà ga ở đâu?", "Where is the station?", "车站在哪里？", "สถานีอยู่ไหน"),
      },
    ],
  ),
  study: block(
    lang(
      "Học: nói môn, nói chưa hiểu, xin nói chậm, hẹn ôn.",
      "Study: name the subject, say you do not get it, ask to slow down, set a review.",
      "学习：说科目、说还没懂、请说慢、约复习。",
      "เรียน: บอกวิชา บอกว่ายังไม่เข้าใจ ขอพูดช้า นัดทบทวน",
    ),
    [
      pat(
        lang("Mình chưa hiểu ____.", "I do not understand ____ yet.", "我还没懂____。", "ฉันยังไม่เข้าใจ ____"),
        lang("Báo chưa theo kịp.", "Say you have not caught it.", "说明还没跟上。", "บอกว่ายังตามไม่ทัน"),
        lang("Mình chưa hiểu câu này.", "I do not understand this sentence yet.", "我还没懂这句。", "ฉันยังไม่เข้าใจประโยคนี้"),
        lang("Chưa hiểu ≠ không muốn học.", "Not yet ≠ I do not want to learn.", "还没懂不等于不想学。", "ยังไม่เข้าใจ ≠ ไม่อยากเรียน"),
      ),
      pat(
        lang("Nói chậm được không?", "Could you speak slowly?", "请说慢一点，可以吗？", "พูดช้าได้ไหม"),
        lang("Xin nhịp vừa.", "Ask for a kinder pace.", "请求放慢。", "ขอน้ำเสียงช้าลง"),
        lang("Nói chậm được không?", "Could you speak slowly?", "请说慢一点，可以吗？", "พูดช้าได้ไหม"),
        lang("Giọng hỏi.", "Keep it a question.", "疑问口气。", "น้ำเสียงถาม"),
      ),
      pat(
        lang("Mai mình ôn + bài.", "Tomorrow I will review + lesson.", "明天我复习 + 课。", "พรุ่งนี้ฉันทบทวน + บท"),
        lang("Hẹn việc ôn.", "Set a review job.", "约定复习。", "นัดทบทวน"),
        lang("Mai mình ôn bài này.", "Tomorrow I will review this lesson.", "明天我复习这一课。", "พรุ่งนี้ฉันทบทวนบทนี้"),
        lang("Ôn = làm lại, không phải bài mới.", "Review = again, not a new lesson.", "复习不是新课。", "ทบทวน = ทำอีก ไม่ใช่บทใหม่"),
      ),
    ],
    [
      lang("Nói rõ chỗ chưa hiểu, đừng chỉ im.", "Name the stuck point; do not only go quiet.", "把卡住的地方说出来。", "บอกจุดที่ติด อย่าเงียบ"),
      lang("Xin chậm trước khi xin dịch.", "Ask to slow down before asking for a translation.", "先请说慢，再请翻译。", "ขอช้าก่อน แล้วค่อยขอแปล"),
    ],
    [
      {
        prompt: lang("Báo chưa hiểu.", "Say you do not get it yet.", "说还没懂。", "บอกว่ายังไม่เข้าใจ"),
        frame: lang("Mình chưa hiểu ____.", "I do not understand ____ yet.", "我还没懂____。", "ฉันยังไม่เข้าใจ ____"),
        sample: lang("Mình chưa hiểu câu này.", "I do not understand this sentence yet.", "我还没懂这句。", "ฉันยังไม่เข้าใจประโยคนี้"),
      },
    ],
  ),
  clothes: block(
    lang(
      "Quần áo: mặc / cởi, cỡ, vừa / chật / rộng, xin thử.",
      "Clothes: put on / take off, size, fits / tight / loose, try on.",
      "衣服：穿 / 脱、尺码、合身 / 紧 / 松，试穿。",
      "เสื้อผ้า: ใส่ / ถอด ไซซ์ พอดี / คับ / หลวม ขอลอง",
    ),
    [
      pat(
        lang("Mình mặc + áo / quần.", "I am wearing + item.", "我穿着 + 衣服。", "ฉันใส่ + เสื้อ / กางเกง"),
        lang("Nói đang mặc gì.", "Say what you have on.", "说身上穿着什么。", "พูดว่าใส่อะไรอยู่"),
        lang("Hôm nay mình mặc áo trắng.", "Today I am wearing a white shirt.", "今天我穿白上衣。", "วันนี้ฉันใส่เสื้อขาว"),
        lang("Mặc cho quần áo; đeo cho kính, mũ (tuỳ).", "Wear for clothes; glasses may use a different verb.", "衣服用穿，眼镜常用戴。", "ใส่ สำหรับเสื้อ กางเกง"),
      ),
      pat(
        lang("Cho mình thử cỡ + lớn / nhỏ.", "I'd like to try a + bigger / smaller size.", "我想试 + 大 / 小 一号。", "ขอลองไซซ์ + ใหญ่ / เล็ก"),
        lang("Xin thử trước khi mua.", "Try before you buy.", "买前先试。", "ลองก่อนซื้อ"),
        lang("Cho mình thử cỡ lớn.", "I'd like to try a larger size.", "我想试大一号。", "ขอลองไซซ์ใหญ่"),
        lang("Cỡ không phải màu.", "Size is not colour.", "尺码不是颜色。", "ไซซ์ไม่ใช่สี"),
      ),
      pat(
        lang("Cái này chật / rộng / vừa.", "This is tight / loose / it fits.", "这个紧 / 松 / 合身。", "อันนี้คับ / หลวม / พอดี"),
        lang("Nhận xét khi thử.", "Comment while trying on.", "试穿时的评价。", "ตอนลองแล้วพูด"),
        lang("Giày này chật.", "These shoes are tight.", "这双鞋有点紧。", "รองเท้าคู่นี้คับ"),
        lang("Chật = không vào; rộng = thừa chỗ.", "Tight = no room; loose = extra room.", "紧=进不去，松=太大。", "คับ = ไม่เข้า หลวม = เหลือที่"),
      ),
    ],
    [
      lang("Thử rồi mới nói mua.", "Try it, then say you will take it.", "先试再决定买。", "ลองก่อน แล้วค่อยบอกว่าเอา"),
      lang("Cởi khi vào nhà người khác nếu họ xin.", "Take shoes off if the host asks.", "进门按主人习惯脱鞋。", "ถอดรองเท้าถ้าเจ้าของบ้านขอ"),
    ],
    [
      {
        prompt: lang("Xin thử cỡ lớn.", "Ask to try a larger size.", "请试大一号。", "ขอลองไซซ์ใหญ่"),
        frame: lang("Cho mình thử ____.", "I'd like to try ____.", "我想试____。", "ขอลอง ____"),
        sample: lang("Cho mình thử cỡ lớn.", "I'd like to try a larger size.", "我想试大一号。", "ขอลองไซซ์ใหญ่"),
      },
    ],
  ),
  weather: block(
    lang(
      "Thời tiết: hôm nay + tính từ, mang theo đồ, hỏi có mưa không.",
      "Weather: today + adjective, bring an item, ask if it will rain.",
      "天气：今天 + 形容词，带上东西，问会不会下雨。",
      "อากาศ: วันนี้ + คำคุณศัพท์ พกของ ถามว่าฝนจะตกไหม",
    ),
    [
      pat(
        lang("Hôm nay + nóng / lạnh / mưa.", "Today it is + hot / cold / rainy.", "今天 + 热 / 冷 / 下雨。", "วันนี้ + ร้อน / หนาว / ฝนตก"),
        lang("Mở đầu bằng thời tiết.", "Open with the weather.", "先说天气。", "เปิดด้วยอากาศ"),
        lang("Hôm nay nóng quá.", "It is too hot today.", "今天太热了。", "วันนี้ร้อนมาก"),
        lang("Quá / lắm tăng mức độ.", "Too / so raises the degree.", "太 / 很 加强。", "มาก / เกินไป เพิ่มระดับ"),
      ),
      pat(
        lang("Mang + áo / ô theo.", "Bring + a jacket / an umbrella.", "带上 + 外套 / 伞。", "พก + เสื้อ / ร่ม"),
        lang("Khuyên theo trời.", "Advise from the sky.", "按天气提醒。", "แนะนำตามฟ้า"),
        lang("Mang ô theo.", "Bring an umbrella.", "带把伞。", "พกร่มไปด้วย"),
        lang("Theo = mang đi cùng.", "Along = take it with you.", "「随」=一起带。", "ด้วย = เอาไปด้วย"),
      ),
      pat(
        lang("Mai có mưa không?", "Will it rain tomorrow?", "明天会下雨吗？", "พรุ่งนี้ฝนตกไหม"),
        lang("Hỏi dự báo đời sống.", "Ask a daily forecast.", "问生活里的预报。", "ถามพยากรณ์แบบ일상"),
        lang("Mai có mưa không?", "Will it rain tomorrow?", "明天会下雨吗？", "พรุ่งนี้ฝนตกไหม"),
        lang("Có… không? cho thời tiết cũng được.", "Yes–no works for weather too.", "天气也可用吗。", "ไหม ใช้กับอากาศได้"),
      ),
    ],
    [
      lang("Nói trời trước, khuyên đồ sau.", "Weather first, then what to bring.", "先说天气，再提醒带什么。", "พูดฟ้าก่อน แล้วค่อยบอกให้พก"),
      lang("Nóng quá là cảm xúc, không phải số độ.", "Too hot is a feeling, not a number.", "太热是感觉，不是温度计。", "ร้อนมาก คือความรู้สึก"),
    ],
    [
      {
        prompt: lang("Khuyên mang ô.", "Advise bringing an umbrella.", "提醒带伞。", "แนะนำให้พกร่ม"),
        frame: lang("Mang ____ theo.", "Bring ____.", "带上____。", "พก ____ ไปด้วย"),
        sample: lang("Mang ô theo.", "Bring an umbrella.", "带把伞。", "พกร่มไปด้วย"),
      },
    ],
  ),
  colors: block(
    lang(
      "Màu đứng sau danh từ tiếng Việt: áo trắng. Chọn màu khi mua hoặc tả đồ.",
      "Colour usually comes before the noun in English: a white shirt.",
      "中文颜色常在名词前：白上衣。也可以：白色的。",
      "ไทย สีหลังคำนามได้: เสื้อขาว",
    ),
    [
      pat(
        lang("Mình thích màu + màu.", "I like + colour.", "我喜欢 + 颜色。", "ฉันชอบสี + สี"),
        lang("Nói sở thích màu.", "Say a colour you like.", "说喜欢的颜色。", "พูดสีที่ชอบ"),
        lang("Mình thích màu xanh.", "I like blue.", "我喜欢蓝色。", "ฉันชอบสีฟ้า"),
        lang("Tên màu là tính từ, không cần động từ khác.", "The colour word is enough.", "颜色词本身就能用。", "ชื่อสีพอ"),
      ),
      pat(
        lang("Cho mình cái + màu này.", "I'll take this + colour one.", "要这个 + 颜色 的。", "ขออันสีนี้"),
        lang("Chọn khi mua.", "Choose while shopping.", "买东西时选颜色。", "เลือกตอนซื้อ"),
        lang("Cho mình cái xanh này.", "I'll take this blue one.", "要这个蓝色的。", "ขออันสีฟ้านี่"),
        lang("Cái này / cái kia để chỉ.", "This one / that one to point.", "用这个 / 那个指。", "อันนี้ / อันนั้น เพื่อชี้"),
      ),
    ],
    [
      lang("Tả đồ: danh từ + màu (Việt). English: colour + noun.", "Match the language's colour order.", "按该语言的颜色语序。", "เรียงสีให้ถูกภาษานั้น"),
      lang("Hỏi màu: màu gì?", "Ask: what colour?", "问：什么颜色？", "ถาม: สีอะไร"),
    ],
    [
      {
        prompt: lang("Nói màu mình thích.", "Say a colour you like.", "说喜欢的颜色。", "พูดสีที่ชอบ"),
        frame: lang("Mình thích màu ____.", "I like ____.", "我喜欢____。", "ฉันชอบสี ____"),
        sample: lang("Mình thích màu xanh.", "I like blue.", "我喜欢蓝色。", "ฉันชอบสีฟ้า"),
      },
    ],
  ),
  daily: block(
    lang(
      "Ngày thường: dậy, ăn, đi làm / học, về, ngủ — gắn giờ.",
      "Daily routine: get up, eat, go to work / class, come back, sleep — add a time.",
      "日常：起床、吃饭、去上班 / 上学、回来、睡觉 — 加上时间。",
      "วันธรรมดา: ตื่น กิน ไปทำงาน / เรียน กลับ นอน — ใส่เวลา",
    ),
    [
      pat(
        lang("Mình + động từ + lúc + giờ.", "I + verb + at + time.", "我 + 动词 + 点。", "ฉัน + กริยา + ตอน + โมง"),
        lang("Nói thói quen có giờ.", "A habit with a clock time.", "带钟点的习惯。", "นิสัยที่มีนาฬิกา"),
        lang("Mình dậy lúc bảy giờ.", "I get up at seven.", "我七点起床。", "ฉันตื่นเจ็ดโมง"),
        lang("Lúc / at / 点  không bỏ.", "Do not drop the time marker.", "时间标记不要省。", "อย่าลืมจุดเวลา"),
      ),
      pat(
        lang("Sau đó mình + động từ.", "Then I + verb.", "然后我 + 动词。", "แล้วฉันก็ + กริยา"),
        lang("Nối hai việc trong ngày.", "Link two jobs in the day.", "把一天两件事连上。", "เชื่อมสองอย่างในวัน"),
        lang("Sau đó mình đi làm.", "Then I go to work.", "然后我去上班。", "แล้วฉันก็ไปทำงาน"),
        lang("Sau đó = bước kế, không phải lý do.", "Then = next step, not a reason.", "然后是下一步。", "แล้ว = ก้าวถัดไป"),
      ),
      pat(
        lang("Cuối ngày mình + động từ.", "At the end of the day I + verb.", "晚上我 + 动词。", "ท้ายวันฉัน + กริยา"),
        lang("Đóng ngày.", "Close the day.", "结束一天。", "ปิดวัน"),
        lang("Cuối ngày mình ngủ sớm.", "At the end of the day I sleep early.", "晚上我早点睡。", "ท้ายวันฉันนอนเร็ว"),
        lang("Sớm / muộn so với thói quen mình.", "Early / late vs your own habit.", "早 / 晚相对自己的习惯。", "เร็ว / ดึก เทียบนิสัยตัวเอง"),
      ),
    ],
    [
      lang("Một câu một việc + một giờ.", "One sentence: one job + one time.", "一句：一件事 + 一个时间。", "หนึ่งประโยค หนึ่งงาน หนึ่งเวลา"),
      lang("Đừng kể cả ngày trong một hơi.", "Do not narrate the whole day in one breath.", "不要一口气说完整天。", "อย่าเล่าทั้งวันในลมเดียว"),
    ],
    [
      {
        prompt: lang("Nói giờ dậy.", "Say when you get up.", "说几点起床。", "บอกเวลาตื่น"),
        frame: lang("Mình dậy lúc ____.", "I get up at ____.", "我____点起床。", "ฉันตื่น ____"),
        sample: lang("Mình dậy lúc bảy giờ.", "I get up at seven.", "我七点起床。", "ฉันตื่นเจ็ดโมง"),
      },
    ],
  ),
  restaurant: block(
    lang(
      "Quán ăn: xin bàn, gọi món, hỏi cay, xin thêm, tính tiền.",
      "Restaurant: a table, order, spice, one more, the bill.",
      "餐馆：要位子、点菜、问辣、再来、买单。",
      "ร้านอาหาร: ขอโต๊ะ สั่ง ถามเผ็ด ขอเพิ่ม จ่าย",
    ),
    [
      pat(
        lang("Cho mình bàn + số người.", "A table for + number, please.", "请给我们 + 人数 的位子。", "ขอโต๊ะ + จำนวนคน"),
        lang("Vào cửa.", "At the door.", "进门时。", "ตอนเข้าประตู"),
        lang("Cho mình bàn hai người.", "A table for two, please.", "请给我们两人桌。", "ขอโต๊ะสองคน"),
        lang("Số người trước, chỗ ngồi sau.", "People first, then the seat.", "先说人数。", "บอกจำนวนคนก่อน"),
      ),
      pat(
        lang("Mình gọi + món này.", "I'll have + this dish.", "我点 + 这个。", "ฉันสั่ง + เมนูนี้"),
        lang("Chọn món.", "Choose the dish.", "点菜。", "เลือกเมนู"),
        lang("Mình gọi món này.", "I'll have this one.", "我点这个。", "ฉันสั่งเมนูนี้"),
        lang("Cái này / món này khi chỉ menu.", "This one when you point at the menu.", "指菜单时用这个。", "ชี้เมนูว่า อันนี้"),
      ),
      pat(
        lang("Không cay / ít cay được không?", "No chilli / not too spicy, please?", "不要辣 / 微辣可以吗？", "ไม่เผ็ด / น้อยเผ็ดได้ไหม"),
        lang("Xin chỉnh vị.", "Ask to adjust the heat.", "要求调味。", "ขอปรับรส"),
        lang("Không cay được không?", "No chilli, is that okay?", "不要辣可以吗？", "ไม่เผ็ดได้ไหม"),
        lang("Nói lúc gọi, đừng đợi món lên.", "Say it when you order, not after the plate arrives.", "点的时候说。", "พูดตอนสั่ง"),
      ),
    ],
    [
      lang("Gọi món xong mới xin thêm.", "Order first, then ask for extras.", "先点再加。", "สั่งก่อน แล้วค่อยขอเพิ่ม"),
      lang("Tính tiền: xin hoá đơn, rồi nói tách hay chung.", "Bill: ask for it, then split or together.", "买单时再说分开还是一起。", "คิดเงิน: ขอบิล แล้วค่อยแยกหรือรวม"),
    ],
    [
      {
        prompt: lang("Xin bàn hai người.", "Ask for a table for two.", "要两人桌。", "ขอโต๊ะสองคน"),
        frame: lang("Cho mình bàn ____ người.", "A table for ____, please.", "请给我们____人桌。", "ขอโต๊ะ ____ คน"),
        sample: lang("Cho mình bàn hai người.", "A table for two, please.", "请给我们两人桌。", "ขอโต๊ะสองคน"),
      },
    ],
  ),
  phone: block(
    lang(
      "Điện thoại: nghe máy, tự xưng, xin chờ, nhắn lại, sóng yếu.",
      "Phone: pick up, say who you are, hold on, call back, weak signal.",
      "打电话：接听、报身份、请等、回拨、信号不好。",
      "โทรศัพท์: รับสาย บอกตัว ขอรอ โทรกลับ สัญญาณอ่อน",
    ),
    [
      pat(
        lang("Alo, mình là + tên.", "Hello, this is + name.", "喂，我是 + 名字。", "ฮัลโหล ฉันคือ + ชื่อ"),
        lang("Mở máy.", "Open the call.", "开口。", "เปิดสาย"),
        lang("Alo, mình là Lan.", "Hello, this is Lan.", "喂，我是兰。", "ฮัลโหล ฉันคือลาน"),
        lang("Tự xưng sớm, đừng để đối phương đoán.", "Name yourself early.", "早点报名字。", "บอกชื่อเร็ว"),
      ),
      pat(
        lang("Chờ mình một chút được không?", "Can you hold on a second?", "请稍等一下，可以吗？", "รอฉันสักครู่ได้ไหม"),
        lang("Xin giữ máy.", "Ask them to wait on the line.", "请对方别挂。", "ขอให้อยู่บนสาย"),
        lang("Chờ mình một chút được không?", "Can you hold on a second?", "请稍等一下，可以吗？", "รอฉันสักครู่ได้ไหม"),
        lang("Một chút = ngắn, đừng biến thành năm phút im.", "A second should stay short.", "一下要真的短。", "สักครู่ ต้องสั้นจริง"),
      ),
      pat(
        lang("Mình gọi lại sau.", "I'll call you back.", "我等会儿打回去。", "ฉันจะโทรกลับทีหลัง"),
        lang("Sóng yếu hoặc đang bận.", "Weak signal or you are busy.", "信号差或正忙。", "สัญญาณอ่อน หรือกำลังยุ่ง"),
        lang("Mình gọi lại sau.", "I'll call you back.", "我等会儿打回去。", "ฉันจะโทรกลับทีหลัง"),
        lang("Hẹn sau thì nên thêm giờ nếu được.", "Add a time if you can.", "能补时间就补。", "ถ้านัดเวลาได้ ให้เติม"),
      ),
    ],
    [
      lang("Điện thoại: ngắn hơn tin nhắn mặt đối mặt.", "Calls run shorter than face-to-face chat.", "电话比当面更短。", "โทรสั้นกว่าคุยต่อหน้า"),
      lang("Nếu nghe không rõ: Xin nói lại.", "If you missed it: please say that again.", "没听清就请再说一遍。", "ถ้าไม่ได้ยิน: พูดอีกที"),
    ],
    [
      {
        prompt: lang("Mở máy và xưng tên.", "Pick up and say your name.", "接电话并报名字。", "รับสายแล้วบอกชื่อ"),
        frame: lang("Alo, mình là ____.", "Hello, this is ____.", "喂，我是____。", "ฮัลโหล ฉันคือ ____"),
        sample: lang("Alo, mình là Lan.", "Hello, this is Lan.", "喂，我是兰。", "ฮัลโหล ฉันคือลาน"),
      },
    ],
  ),
  hobbies: block(
    lang(
      "Sở thích: mình thích + động từ / môn, tần suất, rủ người cùng.",
      "Hobbies: I like + verb / activity, how often, invite someone along.",
      "爱好：我喜欢 + 动词 / 活动，频率，约人一起。",
      "งานอดิเรก: ฉันชอบ + กริยา ความถี่ ชวนคน",
    ),
    [
      pat(
        lang("Mình thích + động từ.", "I like + verb-ing.", "我喜欢 + 动词。", "ฉันชอบ + กริยา"),
        lang("Nói sở thích.", "Name a hobby.", "说爱好。", "บอกรายการที่ชอบ"),
        lang("Mình thích nấu ăn.", "I like cooking.", "我喜欢做饭。", "ฉันชอบทำอาหาร"),
        lang("Thích + động từ, không cần rất mỗi lần.", "Like + verb; you do not need very every time.", "不一定每次都加很。", "ไม่ต้องใส่ มาก ทุกครั้ง"),
      ),
      pat(
        lang("Mỗi tuần mình + động từ + số lần.", "I + verb + n times a week.", "我每周 + 动词 + 几次。", "ทุกสัปดาห์ฉัน + กริยา + กี่ครั้ง"),
        lang("Tần suất.", "How often.", "频率。", "ความถี่"),
        lang("Mỗi tuần mình chạy hai lần.", "I run twice a week.", "我每周跑两次。", "ทุกสัปดาห์ฉันวิ่งสองครั้ง"),
        lang("Số lần cụ thể dễ hơn luôn / đôi khi.", "A number is clearer than always / sometimes.", "数字比总是/有时清楚。", "ตัวเลขชัดกว่า เสมอ / บางครั้ง"),
      ),
      pat(
        lang("Đi ____ với mình không?", "Do you want to ____ with me?", "要不要和我一起____？", "ไป ____ กับฉันไหม"),
        lang("Rủ.", "Invite along.", "约人。", "ชวน"),
        lang("Đi xem phim với mình không?", "Do you want to see a film with me?", "要不要和我一起看电影？", "ไปดูหนังกับฉันไหม"),
        lang("Giọng hỏi, dễ từ chối.", "A question, easy to decline.", "疑问，方便拒绝。", "น้ำเสียงถาม ปฏิเสธได้"),
      ),
    ],
    [
      lang("Thích khác với giỏi: thích hát không có nghĩa hát hay.", "Like ≠ be good at.", "喜欢不等于擅长。", "ชอบ ≠ เก่ง"),
      lang("Rủ thì đưa việc, có thể thêm giờ.", "When you invite, name the activity, maybe a time.", "约人要说出做什么。", "ชวนแล้วบอกว่าทำอะไร"),
    ],
    [
      {
        prompt: lang("Nói một sở thích.", "Name one hobby.", "说一个爱好。", "บอกรายการที่ชอบหนึ่งอย่าง"),
        frame: lang("Mình thích ____.", "I like ____.", "我喜欢____。", "ฉันชอบ ____"),
        sample: lang("Mình thích nấu ăn.", "I like cooking.", "我喜欢做饭。", "ฉันชอบทำอาหาร"),
      },
    ],
  ),
  sports: block(
    lang(
      "Thể thao: chơi / xem, đội, thắng–thua, mời tập.",
      "Sport: play / watch, team, win–lose, invite a session.",
      "运动：打 / 看，球队，赢–输，约练。",
      "กีฬา: เล่น / ดู ทีม ชนะ–แพ้ ชวนซ้อม",
    ),
    [
      pat(
        lang("Mình chơi + môn.", "I play + sport.", "我打 / 踢 + 项目。", "ฉันเล่น + กีฬา"),
        lang("Nói môn mình chơi.", "Name what you play.", "说自己玩的项目。", "บอกกีฬาที่เล่น"),
        lang("Mình chơi bóng đá.", "I play football.", "我踢足球。", "ฉันเล่นฟุตบอล"),
        lang("Một số ngôn ngữ đổi động từ theo môn (打 / 踢).", "Some languages change the verb by sport.", "项目不同动词不同。", "บางภาษาเปลี่ยนกริยาตามชนิด"),
      ),
      pat(
        lang("Đội mình thắng / thua.", "My team won / lost.", "我们队赢了 / 输了。", "ทีมฉันชนะ / แพ้"),
        lang("Kể kết quả.", "Report the result.", "说比赛结果。", "เล่าผล"),
        lang("Đội mình thắng.", "My team won.", "我们队赢了。", "ทีมฉันชนะ"),
        lang("Thắng / thua là kết quả, không phải đang đá.", "Won / lost is the result, not the match in progress.", "赢/输是结果。", "ชนะ / แพ้ คือผล"),
      ),
      pat(
        lang("Tập cùng mình không?", "Want to train with me?", "要不要和我一起练？", "ซ้อมกับฉันไหม"),
        lang("Mời buổi tập.", "Invite a session.", "约训练。", "ชวนซ้อม"),
        lang("Tập cùng mình không?", "Want to train with me?", "要不要和我一起练？", "ซ้อมกับฉันไหม"),
        lang("Có thể thêm: chiều nay / cuối tuần.", "You can add: this afternoon / this weekend.", "可补时间。", "เติมเวลาได้"),
      ),
    ],
    [
      lang("Chơi khác xem: mình xem bóng đá, không nhất chơi.", "Play ≠ watch.", "看不等于打。", "เล่น ≠ ดู"),
      lang("Khen đối thủ cũng được: họ chơi hay.", "You can praise the other side.", "也可以夸对方。", "ชมฝั่งตรงข้ามได้"),
    ],
    [
      {
        prompt: lang("Nói môn mình chơi.", "Say a sport you play.", "说自己打的项目。", "บอกกีฬาที่เล่น"),
        frame: lang("Mình chơi ____.", "I play ____.", "我____。", "ฉันเล่น ____"),
        sample: lang("Mình chơi bóng đá.", "I play football.", "我踢足球。", "ฉันเล่นฟุตบอล"),
      },
    ],
  ),
  money: block(
    lang(
      "Tiền: hỏi giá, trả, thiếu–đủ, đổi, chuyển khoản.",
      "Money: ask the price, pay, short–enough, change, transfer.",
      "钱：问价、付款、不够–够、找零、转账。",
      "เงิน: ถามราคา จ่าย ไม่พอ–พอ ทอน โอน",
    ),
    [
      pat(
        lang("Cái này bao nhiêu?", "How much is this?", "这个多少钱？", "อันนี้เท่าไหร่"),
        lang("Hỏi giá một món.", "Ask one price.", "问一件的价格。", "ถามราคาชิ้นเดียว"),
        lang("Cái này bao nhiêu?", "How much is this?", "这个多少钱？", "อันนี้เท่าไหร่"),
        lang("Chỉ món khi hỏi.", "Point at the item.", "问的时候指着。", "ชี้ของตอนถาม"),
      ),
      pat(
        lang("Mình trả bằng + tiền mặt / thẻ.", "I'll pay by + cash / card.", "我用 + 现金 / 卡 付。", "ฉันจ่ายด้วย + เงินสด / บัตร"),
        lang("Chọn cách trả.", "Choose how to pay.", "选支付方式。", "เลือกวิธีจ่าย"),
        lang("Mình trả bằng thẻ.", "I'll pay by card.", "我用卡付。", "ฉันจ่ายด้วยบัตร"),
        lang("Nói trước khi máy xin.", "Say it before the till asks, if you can.", "能早说就早说。", "บอกก่อนเครื่องถาม ถ้าได้"),
      ),
      pat(
        lang("Thiếu / đủ / làm ơn thối.", "I'm short / that's enough / change please.", "不够 / 刚好 / 请找零。", "ไม่พอ / พอ / ขอเงินทอน"),
        lang("Khi đưa tiền.", "When you hand the money over.", "递钱时。", "ตอนยื่นเงิน"),
        lang("Làm ơn thối.", "Change, please.", "请找零。", "ขอเงินทอน"),
        lang("Thối = tiền dư trả lại.", "Change = money back.", "找零=退回多的。", "ทอน = เงินคืน"),
      ),
    ],
    [
      lang("Hỏi giá trước khi đưa thẻ.", "Ask the price before you tap the card.", "刷卡前先问价。", "ถามราคาก่อนรูด"),
      lang("Số tiền nói chậm, từng nhóm.", "Say amounts slowly, in groups.", "金额要说慢。", "พูดจำนวนช้าๆ"),
    ],
    [
      {
        prompt: lang("Hỏi giá món đang chỉ.", "Ask the price of the item you point at.", "问你指着的东西多少钱。", "ถามราคาของที่ชี้"),
        frame: lang("____ bao nhiêu?", "How much is ____?", "____多少钱？", "____ เท่าไหร่"),
        sample: lang("Cái này bao nhiêu?", "How much is this?", "这个多少钱？", "อันนี้เท่าไหร่"),
      },
    ],
  ),
  cooking: block(
    lang(
      "Nấu: cắt, rang, luộc, nêm; thứ tự trước–sau; xin nếm.",
      "Cooking: cut, fry, boil, season; order of steps; ask to taste.",
      "做饭：切、炒、煮、调味；先后顺序；请尝。",
      "ทำอาหาร: หั่น ทอด ต้ม ปรุง ลำดับก่อนหลัง ชิม",
    ),
    [
      pat(
        lang("Trước hết + động từ.", "First + verb.", "先 + 动词。", "ก่อนอื่น + กริยา"),
        lang("Bước 1.", "Step one.", "第一步。", "ขั้นแรก"),
        lang("Trước hết cắt rau.", "First cut the vegetables.", "先切菜。", "ก่อนอื่นหั่นผัก"),
        lang("Một bước một động từ.", "One step, one verb.", "一步一个动词。", "หนึ่งขั้น หนึ่งกริยา"),
      ),
      pat(
        lang("Rồi / sau đó + động từ.", "Then + verb.", "然后 + 动词。", "แล้ว / จากนั้น + กริยา"),
        lang("Bước kế.", "Next step.", "下一步。", "ขั้นถัด"),
        lang("Sau đó rang tỏi.", "Then fry the garlic.", "然后炒蒜。", "จากนั้นทอดกระเทียม"),
        lang("Không nhảy bước.", "Do not skip the order.", "不要跳步。", "อย่าข้ามลำดับ"),
      ),
      pat(
        lang("Nếm được không? / Thêm + muối / cay.", "Can I taste? / Add + salt / chilli.", "可以尝尝吗？/ 再加 + 盐 / 辣。", "ชิมได้ไหม / เติม + เกลือ / เผ็ด"),
        lang("Chỉnh vị.", "Adjust the taste.", "调味。", "ปรับรส"),
        lang("Thêm muối một chút.", "Add a little salt.", "再加一点盐。", "เติมเกลือนิดหน่อย"),
        lang("Một chút trước, nếm sau.", "A little first, then taste.", "先少后尝。", "นิดก่อน แล้วค่อยชิม"),
      ),
    ],
    [
      lang("Kể món như hướng dẫn ngắn, không như bài văn.", "Tell a dish as short steps, not a paragraph.", "像短步骤，不像作文。", "เล่าเป็นขั้นสั้น ไม่ใช่เรียงความ"),
      lang("Nóng / chín / sống là trạng thái, không phải gia vị.", "Hot / cooked / raw are states, not seasonings.", "熟/生是状态。", "สุก / ดิบ คือสภาพ"),
    ],
    [
      {
        prompt: lang("Nói bước đầu.", "Say the first step.", "说第一步。", "พูดขั้นแรก"),
        frame: lang("Trước hết ____.", "First ____.", "先____。", "ก่อนอื่น ____"),
        sample: lang("Trước hết cắt rau.", "First cut the vegetables.", "先切菜。", "ก่อนอื่นหั่นผัก"),
      },
    ],
  ),
  cleaning: block(
    lang(
      "Dọn: lau, rửa, quét, cất; xin giúp; xong chưa.",
      "Cleaning: wipe, wash, sweep, put away; ask for help; is it done.",
      "打扫：擦、洗、扫、收；请帮忙；好了没。",
      "เก็บงาน: เช็ด ล้าง กวาด เก็บ ขอช่วย เสร็จยัง",
    ),
    [
      pat(
        lang("Mình + lau / rửa / quét + chỗ.", "I + wipe / wash / sweep + place.", "我 + 擦 / 洗 / 扫 + 地方。", "ฉัน + เช็ด / ล้าง / กวาด + ที่"),
        lang("Nói việc đang làm.", "Name the chore.", "说正在做的家务。", "บอกงานบ้าน"),
        lang("Mình lau bàn.", "I am wiping the table.", "我擦桌子。", "ฉันเช็ดโต๊ะ"),
        lang("Động từ khớp bề mặt: lau bàn, rửa chén, quét sàn.", "Match the verb to the surface.", "动词要配表面。", "กริยาให้เข้าพื้นผิว"),
      ),
      pat(
        lang("Cất + đồ vào chỗ.", "Put + thing away.", "把 + 东西 收好。", "เก็บ + ของ เข้าที่"),
        lang("Kết thúc dọn.", "Finish by putting away.", "用收纳收尾。", "จบด้วยการเก็บ"),
        lang("Cất chén vào tủ.", "Put the bowls in the cupboard.", "把碗收进柜子。", "เก็บชามเข้าตู้"),
        lang("Vào + nơi.", "Into + place.", "收进 + 地方。", "เข้า + ที่"),
      ),
      pat(
        lang("Giúp mình ____ được không?", "Could you help me ____?", "能帮我____吗？", "ช่วยฉัน ____ ได้ไหม"),
        lang("Chia việc.", "Share the chore.", "分工。", "แบ่งงาน"),
        lang("Giúp mình rửa chén được không?", "Could you help me wash up?", "能帮我洗碗吗？", "ช่วยฉันล้างจานได้ไหม"),
        lang("Giọng nhờ.", "A request, not a command.", "请求口气。", "น้ำเสียงขอ"),
      ),
    ],
    [
      lang("Một câu một việc nhà.", "One sentence, one chore.", "一句一项家务。", "หนึ่งประโยค หนึ่งงาน"),
      lang("Xong rồi khác đang làm.", "Done is not the same as in progress.", "做完了不是正在做。", "เสร็จแล้ว ≠ กำลังทำ"),
    ],
    [
      {
        prompt: lang("Nhờ rửa chén.", "Ask someone to wash up.", "请人洗碗。", "ขอให้ล้างจาน"),
        frame: lang("Giúp mình ____ được không?", "Could you help me ____?", "能帮我____吗？", "ช่วยฉัน ____ ได้ไหม"),
        sample: lang("Giúp mình rửa chén được không?", "Could you help me wash up?", "能帮我洗碗吗？", "ช่วยฉันล้างจานได้ไหม"),
      },
    ],
  ),
  pets: block(
    lang(
      "Thú cưng: loài, tên, ăn–đi dạo, xin giữ hộ, dị ứng.",
      "Pets: type, name, eat–walk, ask someone to look after, allergy.",
      "宠物：种类、名字、吃–遛，请人照看，过敏。",
      "สัตว์เลี้ยง: ชนิด ชื่อ กิน–เดิน ฝากเลี้ยง แพ้",
    ),
    [
      pat(
        lang("Nhà mình có + con + loài.", "I have a + pet.", "我家有 + 只 + 动物。", "บ้านฉันมี + ตัว + สัตว์"),
        lang("Giới thiệu thú.", "Introduce the pet.", "介绍宠物。", "แนะนำสัตว์เลี้ยง"),
        lang("Nhà mình có một con mèo.", "I have a cat.", "我家有一只猫。", "บ้านฉันมีแมวหนึ่งตัว"),
        lang("Loài + loại từ.", "Type + classifier / article.", "种类 + 量词。", "ชนิด + ลักษณนาม"),
      ),
      pat(
        lang("Nó + ăn / ngủ / đi dạo.", "It + eats / sleeps / goes for a walk.", "它 + 吃 / 睡 / 散步。", "มัน + กิน / นอน / เดิน"),
        lang("Nói thói quen thú.", "A pet habit.", "说宠物习惯。", "นิสัยสัตว์"),
        lang("Nó đi dạo mỗi chiều.", "It goes for a walk every afternoon.", "它每天下午散步。", "มันเดินเล่นทุกบ่าย"),
        lang("Nó / it / 它 / มัน — đừng dùng người trừ khi đùa thân.", "Use it unless you are being playful.", "一般不用他/她。", "ใช้ มัน เว้นแต่เล่น"),
      ),
      pat(
        lang("Giữ hộ mình được không?", "Could you look after it for me?", "能帮我照看一下吗？", "ช่วยเลี้ยงแทนได้ไหม"),
        lang("Nhờ trông.", "Ask for pet-sitting.", "请人照看。", "ฝากเลี้ยง"),
        lang("Giữ hộ mình được không?", "Could you look after it for me?", "能帮我照看一下吗？", "ช่วยเลี้ยงแทนได้ไหม"),
        lang("Nói rõ ngày và đồ ăn.", "Name the day and the food.", "说清哪天和吃什么。", "บอกวันและอาหาร"),
      ),
    ],
    [
      lang("Hỏi dị ứng trước khi mang thú đến nhà người.", "Ask about allergies before you bring a pet over.", "带宠物上门前先问过敏。", "ถามเรื่องแพ้ก่อนพาไปบ้านคน"),
      lang("Tên thú là tên riêng, không dịch.", "A pet's name stays a name.", "名字不必翻译。", "ชื่อสัตว์ไม่ต้องแปล"),
    ],
    [
      {
        prompt: lang("Giới thiệu thú nhà.", "Introduce your pet.", "介绍家里的宠物。", "แนะนำสัตว์ที่บ้าน"),
        frame: lang("Nhà mình có ____.", "I have ____.", "我家有____。", "บ้านฉันมี ____"),
        sample: lang("Nhà mình có một con mèo.", "I have a cat.", "我家有一只猫。", "บ้านฉันมีแมวหนึ่งตัว"),
      },
    ],
  ),
  holidays: block(
    lang(
      "Ngày lễ: chúc, tặng, về quê, nghỉ làm, hỏi kế hoạch.",
      "Holidays: wish, gift, go home, time off, ask about plans.",
      "节日：祝福、送礼、回老家、放假、问安排。",
      "วันหยุด: อวยพร ของขวัญ กลับบ้าน หยุดงาน ถามแผน",
    ),
    [
      pat(
        lang("Chúc + người + lễ.", "Happy + holiday.", "祝 + 人 + 节日快乐。", "สุขสันต์ + วัน"),
        lang("Câu chúc ngắn.", "A short wish.", "短祝福。", "คำอวยพรสั้น"),
        lang("Chúc năm mới vui vẻ.", "Happy New Year.", "新年快乐。", "สุขสันต์วันปีใหม่"),
        lang("Một câu là đủ; đừng đọc diễn văn.", "One line is enough.", "一句就够。", "一句พอ"),
      ),
      pat(
        lang("Mình về quê / nghỉ + số ngày.", "I am going home / off for + days.", "我回老家 / 休息 + 几天。", "ฉันกลับบ้าน / หยุด + กี่วัน"),
        lang("Nói kế hoạch lễ.", "Holiday plans.", "说节日安排。", "แผนวันหยุด"),
        lang("Mình về quê ba ngày.", "I am going home for three days.", "我回老家三天。", "ฉันกลับบ้านสามวัน"),
        lang("Số ngày cụ thể.", "Name the number of days.", "把天数说清。", "บอกจำนวนวัน"),
      ),
      pat(
        lang("Lễ này bạn làm gì?", "What are you doing for this holiday?", "这个节日你做什么？", "วันนี้นี้คุณทำอะไร"),
        lang("Hỏi kế hoạch người khác.", "Ask about their plan.", "问对方安排。", "ถามแผนคนอื่น"),
        lang("Lễ này bạn làm gì?", "What are you doing for this holiday?", "这个节日你做什么？", "วันนี้นี้คุณทำอะไร"),
        lang("Giọng tò mò nhẹ, không soi.", "Curious, not nosy.", "好奇，不是盘问。", "อยากรู้ ไม่ใช่สอบ"),
      ),
    ],
    [
      lang("Chúc trước, hỏi kế hoạch sau nếu thân.", "Wish first; ask plans only if you are close.", "先祝福，熟了再问安排。", "อวยพรก่อน ถามแผนเมื่อสนิท"),
      lang("Tặng: nhỏ và nói rõ cho ai.", "Gifts: small, and say who it is for.", "礼物要小，并说给谁。", "ของขวัญเล็ก และบอกว่าให้ใคร"),
    ],
    [
      {
        prompt: lang("Chúc một câu.", "Give one holiday wish.", "说一句祝福。", "อวยพรหนึ่งประโยค"),
        frame: lang("Chúc ____.", "Happy ____.", "祝____。", "สุขสันต์ ____"),
        sample: lang("Chúc năm mới vui vẻ.", "Happy New Year.", "新年快乐。", "สุขสันต์วันปีใหม่"),
      },
    ],
  ),
  neighbors: block(
    lang(
      "Hàng xóm: chào cửa, xin lỗi ồn, nhờ giữ đồ, hỏi giờ yên.",
      "Neighbours: door hello, sorry for noise, hold a parcel, quiet hours.",
      "邻居：门口问好、抱歉吵到、帮忙收件、安静时间。",
      "เพื่อนบ้าน: ทักหน้าประตู ขอโทษเสียงดัง ฝากของ ชั่วโมงเงียบ",
    ),
    [
      pat(
        lang("Xin lỗi nhà mình ồn.", "Sorry we were noisy.", "抱歉我们家有点吵。", "ขอโทษบ้านฉันเสียงดัง"),
        lang("Xin lỗi ồn.", "Apologise for noise.", "为噪音道歉。", "ขอโทษเรื่องเสียง"),
        lang("Xin lỗi nhà mình ồn tối qua.", "Sorry we were noisy last night.", "抱歉昨晚我们家有点吵。", "ขอโทษเมื่อคืนบ้านฉันเสียงดัง"),
        lang("Thêm mốc thời cho rõ.", "Add the time so it is clear.", "补时间更清楚。", "เติมเวลาให้ชัด"),
      ),
      pat(
        lang("Giữ hộ mình + đồ được không?", "Could you hold + item for me?", "能帮我收一下 + 东西 吗？", "ช่วยรับ + ของ แทนได้ไหม"),
        lang("Nhờ nhận hộ.", "Ask them to take something in.", "请代收。", "ฝากรับของ"),
        lang("Giữ hộ mình bưu kiện được không?", "Could you hold a parcel for me?", "能帮我收一下快递吗？", "ช่วยรับพัสดุแทนได้ไหม"),
        lang("Nói rõ ngày giao nếu biết.", "Name the delivery day if you know it.", "知道送达日就说。", "ถ้ารู้วันส่ง ให้บอก"),
      ),
      pat(
        lang("Sau + giờ thì nhà mình yên.", "After + time we keep it quiet.", "过了 + 点 我们就安静。", "หลัง + โมง บ้านฉันเงียบ"),
        lang("Giờ yên.", "Quiet hours.", "安静时间。", "ชั่วโมงเงียบ"),
        lang("Sau mười giờ nhà mình yên.", "After ten we keep it quiet.", "十点以后我们就安静。", "หลังสี่ทุ่มบ้านฉันเงียบ"),
        lang("Cam kết cụ thể hơn xin lỗi chung.", "A concrete time beats a vague sorry.", "具体时间比空道歉好。", "เวลาชัด ดีกว่าขอโทษลอย"),
      ),
    ],
    [
      lang("Chào cửa ngắn: chào cô, chào anh.", "A short door greeting is enough.", "门口短呼一声就好。", "ทักสั้นพอ"),
      lang("Ồn: xin lỗi + sẽ nhỏ hơn / sẽ xong giờ nào.", "Noise: sorry + we will keep it down / we will finish by…", "噪音：道歉 + 何时结束。", "เสียงดัง: ขอโทษ + จะเบาลง / เสร็จกี่โมง"),
    ],
    [
      {
        prompt: lang("Xin lỗi vì ồn.", "Apologise for noise.", "为噪音道歉。", "ขอโทษเรื่องเสียงดัง"),
        frame: lang("Xin lỗi nhà mình ____.", "Sorry we were ____.", "抱歉我们家____。", "ขอโทษบ้านฉัน ____"),
        sample: lang("Xin lỗi nhà mình ồn tối qua.", "Sorry we were noisy last night.", "抱歉昨晚我们家有点吵。", "ขอโทษเมื่อคืนบ้านฉันเสียงดัง"),
      },
    ],
  ),
  internet: block(
    lang(
      "Mạng: wifi, mật khẩu, chậm, gửi file, họp trực tuyến.",
      "Internet: wifi, password, slow, send a file, join a call.",
      "网络：无线网、密码、很慢、发文件、线上开会。",
      "เน็ต: ไวไฟ รหัส ช้า ส่งไฟล์ ประชุมออนไลน์",
    ),
    [
      pat(
        lang("Cho mình mật khẩu wifi được không?", "Could I have the wifi password?", "能给我无线网密码吗？", "ขอรหัสไวไฟได้ไหม"),
        lang("Xin mạng.", "Ask for the network.", "要网络。", "ขอเน็ต"),
        lang("Cho mình mật khẩu wifi được không?", "Could I have the wifi password?", "能给我无线网密码吗？", "ขอรหัสไวไฟได้ไหม"),
        lang("Wifi / mạng — cùng việc.", "Wifi / network — the same job.", "无线网 / 网络同一件事。", "ไวไฟ / เน็ต เรื่องเดียวกัน"),
      ),
      pat(
        lang("Mạng chậm quá. / Mình không vào được.", "The network is too slow. / I cannot get in.", "网太慢了。/ 我进不去。", "เน็ตช้ามาก / ฉันเข้าไม่ได้"),
        lang("Báo lỗi.", "Report a problem.", "报故障。", "แจ้งปัญหา"),
        lang("Mạng chậm quá.", "The network is too slow.", "网太慢了。", "เน็ตช้ามาก"),
        lang("Nói triệu chứng, đừng đoán nguyên nhân dài.", "Name the symptom, not a long diagnosis.", "说现象，不长篇猜原因。", "พูดอาการ ไม่วินิจฉัยยาว"),
      ),
      pat(
        lang("Mình gửi + file / link cho bạn.", "I'll send you + a file / a link.", "我把 + 文件 / 链接 发给你。", "ฉันส่ง + ไฟล์ / ลิงก์ ให้คุณ"),
        lang("Chuyển đồ trên mạng.", "Pass something online.", "网上传东西。", "ส่งของทางเน็ต"),
        lang("Mình gửi link cho bạn.", "I'll send you the link.", "我把链接发给你。", "ฉันส่งลิงก์ให้คุณ"),
        lang("Nói kênh: tin nhắn / mail.", "Name the channel: message / mail.", "说清发哪里。", "บอกช่อง: แชท / เมล"),
      ),
    ],
    [
      lang("Họp: mình vào máy / mình nghe không rõ.", "A call: I am in / I cannot hear clearly.", "开会：我进来了 / 我听不清。", "ประชุม: ฉันเข้าแล้ว / ฉันได้ยินไม่ชัด"),
      lang("Mật khẩu đọc từng cụm, không nuốt chữ.", "Read a password in chunks.", "密码要分组读。", "อ่านรหัสเป็นกลุ่ม"),
    ],
    [
      {
        prompt: lang("Xin mật khẩu wifi.", "Ask for the wifi password.", "要无线网密码。", "ขอรหัสไวไฟ"),
        frame: lang("Cho mình ____ được không?", "Could I have ____?", "能给我____吗？", "ขอ ____ ได้ไหม"),
        sample: lang("Cho mình mật khẩu wifi được không?", "Could I have the wifi password?", "能给我无线网密码吗？", "ขอรหัสไวไฟได้ไหม"),
      },
    ],
  ),
  school: block(
    lang(
      "Trường: môn, tiết, bài tập, xin nghỉ, hỏi hạn nộp.",
      "School: subject, period, homework, ask for leave, due date.",
      "学校：科目、课节、作业、请假、截止日期。",
      "โรงเรียน: วิชา คาบ การบ้าน ลาก ถามกำหนดส่ง",
    ),
    [
      pat(
        lang("Tiết này học + môn.", "This period is + subject.", "这节课上 + 科目。", "คาบนี้เรียน + วิชา"),
        lang("Nói lịch trong ngày.", "Name the day's timetable.", "说当天课表。", "บอกตารางวัน"),
        lang("Tiết này học toán.", "This period is maths.", "这节课上数学。", "คาบนี้เรียนคณิต"),
        lang("Môn là danh từ, không cần động từ thêm nếu đã có học / is.", "The subject is a noun.", "科目是名词。", "วิชาเป็นคำนาม"),
      ),
      pat(
        lang("Bài này nộp khi nào?", "When is this due?", "这个什么时候交？", "งานนี้ส่งเมื่อไหร่"),
        lang("Hỏi hạn.", "Ask the deadline.", "问截止日期。", "ถามกำหนด"),
        lang("Bài này nộp khi nào?", "When is this due?", "这个什么时候交？", "งานนี้ส่งเมื่อไหร่"),
        lang("Khi nào / when / 什么时候 rõ hơn sớm.", "When is clearer than soon.", "何时比早点清楚。", "เมื่อไหร่ ชัดกว่า เร็วๆ"),
      ),
      pat(
        lang("Mai mình xin nghỉ.", "I need to take tomorrow off.", "我明天想请假。", "พรุ่งนี้ฉันขอลาง"),
        lang("Xin vắng.", "Ask for leave.", "请假。", "ลาก"),
        lang("Mai mình xin nghỉ.", "I need to take tomorrow off.", "我明天想请假。", "พรุ่งนี้ฉันขอลาง"),
        lang("Nêu lý do ngắn nếu cần: ốm / việc nhà.", "Give a short reason if needed: ill / family.", "需要就补短理由。", "ใส่เหตุสั้นถ้าต้อง"),
      ),
    ],
    [
      lang("Bài tập: mình làm xong / mình chưa hiểu câu 3.", "Homework: I have finished / I do not get question 3.", "作业：做完了 / 第三题还没懂。", "การบ้าน: ทำเสร็จ / ข้อ 3 ยังไม่เข้าใจ"),
      lang("Hỏi hạn trước khi hẹn đi chơi.", "Ask the due date before you make other plans.", "约出去之前先问截止日期。", "ถามกำหนดส่งก่อนนัดเล่น"),
    ],
    [
      {
        prompt: lang("Hỏi hạn nộp.", "Ask when it is due.", "问什么时候交。", "ถามกำหนดส่ง"),
        frame: lang("____ nộp khi nào?", "When is ____ due?", "____什么时候交？", "____ ส่งเมื่อไหร่"),
        sample: lang("Bài này nộp khi nào?", "When is this due?", "这个什么时候交？", "งานนี้ส่งเมื่อไหร่"),
      },
    ],
  ),
  advice: block(
    lang(
      "Khuyên: nên / không nên, thử, nếu mình là bạn; không ra lệnh.",
      "Advice: should / shouldn't, try, if I were you; do not order.",
      "建议：应该 / 不应该、试试、如果我是你；不要下命令。",
      "คำแนะนำ: ควร / ไม่ควร ลอง ถ้าฉันเป็นคุณ อย่าสั่ง",
    ),
    [
      pat(
        lang("Bạn nên + động từ.", "You should + verb.", "你应该 + 动词。", "คุณควร + กริยา"),
        lang("Khuyên nhẹ.", "Soft advice.", "轻建议。", "แนะนำเบา"),
        lang("Bạn nên hỏi lại.", "You should ask again.", "你应该再问一次。", "คุณควรถามอีกครั้ง"),
        lang("Nên ≠ phải.", "Should ≠ must.", "应该 ≠ 必须。", "ควร ≠ ต้อง"),
      ),
      pat(
        lang("Nếu mình là bạn, mình sẽ + động từ.", "If I were you, I would + verb.", "如果我是你，我会 + 动词。", "ถ้าฉันเป็นคุณ ฉันจะ + กริยา"),
        lang("Khuyên từ chỗ đứng của mình.", "Advice from your seat, not a rule.", "从自己的位置给建议。", "แนะนำจากที่นั่งเรา"),
        lang("Nếu mình là bạn, mình sẽ nghỉ một ngày.", "If I were you, I would take a day off.", "如果我是你，我会休息一天。", "ถ้าฉันเป็นคุณ ฉันจะพักหนึ่งวัน"),
        lang("Giả định, người kia vẫn chọn.", "Hypothetical; they still choose.", "是假设，对方仍可选择。", "เป็นสมมติ เขาเลือกเองได้"),
      ),
      pat(
        lang("Thử + động từ xem.", "Try + verb-ing.", "试试 + 动词。", "ลอง + กริยา ดู"),
        lang("Gợi ý thí nghiệm nhỏ.", "Suggest a small experiment.", "建议小试一下。", "ชวนทดลองเล็ก"),
        lang("Thử nhắn trước xem.", "Try messaging first.", "先试着发个消息。", "ลองทักก่อนดู"),
        lang("Xem / 看 / ดู = kiểm tra kết quả.", "See = check what happens.", "看=看结果。", "ดู = ดูผล"),
      ),
    ],
    [
      lang("Khuyên xong để họ quyết, đừng ép.", "Advise, then let them decide.", "建议完让对方决定。", "แนะนำแล้วให้เขาตัดสิน"),
      lang("Không nên mạnh hơn nên một bậc, vẫn chưa phải cấm.", "Shouldn't is stronger than should, still not a ban.", "不应该比应该重，仍不是禁止。", "ไม่ควร แรงกว่า ควร แต่ยังไม่ใช่ห้าม"),
    ],
    [
      {
        prompt: lang("Khuyên hỏi lại.", "Advise asking again.", "建议再问一次。", "แนะนำให้ถามอีก"),
        frame: lang("Bạn nên ____.", "You should ____.", "你应该____。", "คุณควร ____"),
        sample: lang("Bạn nên hỏi lại.", "You should ask again.", "你应该再问一次。", "คุณควรถามอีกครั้ง"),
      },
    ],
  ),
  relationships: block(
    lang(
      "Quan hệ: mình và…, cần nói chuyện, xin lỗi, ranh giới nhẹ.",
      "Relationships: I and…, we need to talk, sorry, a soft boundary.",
      "关系：我和…、需要谈谈、道歉、轻轻设边界。",
      "ความสัมพันธ์: ฉันกับ... ต้องคุย ขอโทษ เส้นแบ่งเบา",
    ),
    [
      pat(
        lang("Mình cần nói chuyện với bạn.", "I need to talk with you.", "我需要和你谈谈。", "ฉันต้องคุยกับคุณ"),
        lang("Mở lời nghiêm nhưng không mắng.", "Open seriously, without scolding.", "认真开口，但不骂。", "เปิดจริงจัง ไม่ด่า"),
        lang("Mình cần nói chuyện với bạn.", "I need to talk with you.", "我需要和你谈谈。", "ฉันต้องคุยกับคุณ"),
        lang("Cần = quan trọng, chưa phải cãi.", "Need = important, not yet a fight.", "需要≠吵架。", "ต้อง ≠ ทะเลาะ"),
      ),
      pat(
        lang("Mình xin lỗi vì ____.", "I am sorry for ____.", "我为____感到抱歉。", "ฉันขอโทษที่ ____"),
        lang("Xin lỗi có việc cụ thể.", "Apologise for a named thing.", "为具体的事道歉。", "ขอโทษเรื่องชัด"),
        lang("Mình xin lỗi vì trễ.", "I am sorry for being late.", "抱歉我迟到了。", "ฉันขอโทษที่สาย"),
        lang("Vì + việc, không xin lỗi chung chung.", "For + the act, not a vague sorry.", "为事情，不为空气。", "ที่ + เรื่อง ไม่ลอย"),
      ),
      pat(
        lang("Mình cần một chút không gian.", "I need a little space.", "我需要一点空间。", "ฉันต้องการพื้นที่นิดหน่อย"),
        lang("Ranh giới nhẹ.", "A soft boundary.", "轻边界。", "เส้นแบ่งเบา"),
        lang("Mình cần một chút không gian.", "I need a little space.", "我需要一点空间。", "ฉันต้องการพื้นที่นิดหน่อย"),
        lang("Một chút = tạm, không phải cắt đứt.", "A little = for now, not a break-up.", "一点=暂时。", "นิดหน่อย = ชั่วคราว"),
      ),
    ],
    [
      lang("Nói cảm xúc: mình thấy… rồi mới kể chuyện.", "Feel first: I feel… then the story.", "先说感受，再讲事。", "พูดความรู้สึกก่อน แล้วค่อยเล่า"),
      lang("Không giải quyết ba việc trong một câu.", "Do not fix three issues in one line.", "一句不处理三件事。", "อย่าแก้สามเรื่องในประโยคเดียว"),
    ],
    [
      {
        prompt: lang("Xin lỗi vì một việc cụ thể.", "Apologise for one named thing.", "为具体的事道歉。", "ขอโทษหนึ่งเรื่องชัด"),
        frame: lang("Mình xin lỗi vì ____.", "I am sorry for ____.", "我为____感到抱歉。", "ฉันขอโทษที่ ____"),
        sample: lang("Mình xin lỗi vì trễ.", "I am sorry for being late.", "抱歉我迟到了。", "ฉันขอโทษที่สาย"),
      },
    ],
  ),
  news: block(
    lang(
      "Tin: mình nghe là…, chưa chắc, nguồn, hỏi lại.",
      "News: I heard that…, not sure, the source, ask again.",
      "消息：我听说…、不一定、来源、再确认。",
      "ข่าว: ฉันได้ยินว่า... ไม่แน่ แหล่ง ถามซ้ำ",
    ),
    [
      pat(
        lang("Mình nghe là ____.", "I heard that ____.", "我听说____。", "ฉันได้ยินว่า ____"),
        lang("Kể tin chưa kiểm.", "Pass on unverified news.", "转述未核实的消息。", "เล่าข่าวที่ยังไม่ตรวจ"),
        lang("Mình nghe là đường đang kẹt.", "I heard that the road is jammed.", "我听说路上堵着。", "ฉันได้ยินว่ารถติด"),
        lang("Nghe là ≠ mình thấy.", "Heard ≠ I saw it.", "听说≠亲眼。", "ได้ยิน ≠ เห็นเอง"),
      ),
      pat(
        lang("Chưa chắc. / Có lẽ vậy.", "Not sure. / Maybe so.", "不一定。/ 也许是。", "ไม่แน่ / อาจจะ"),
        lang("Giảm độ tin.", "Lower certainty.", "降低确定度。", "ลดความชัวร์"),
        lang("Chưa chắc đâu.", "I am not sure about that.", "那可不一定。", "ไม่แน่นะ"),
        lang("Dùng khi chưa có bằng.", "Use when you have no proof.", "没证据时用。", "ใช้ตอนยังไม่มีหลัก"),
      ),
      pat(
        lang("Bạn nghe từ đâu?", "Where did you hear that?", "你从哪听说的？", "คุณได้ยินจากไหน"),
        lang("Hỏi nguồn.", "Ask the source.", "问来源。", "ถามแหล่ง"),
        lang("Bạn nghe từ đâu?", "Where did you hear that?", "你从哪听说的？", "คุณได้ยินจากไหน"),
        lang("Giọng tò mò, không xử người.", "Curious, not a prosecution.", "好奇，不是审讯。", "อยากรู้ ไม่ไต่สวน"),
      ),
    ],
    [
      lang("Đời sống: tin đường, tin trường, tin giá — không cần giọng phát thanh.", "Everyday news: road, school, prices — not a broadcast voice.", "生活消息，不要播音腔。", "ข่าวชีวิต ไม่ใช่โทนประกาศ"),
      lang("Chia tin xong có thể thêm: mình sẽ hỏi lại.", "After sharing, you can add: I will check.", "转完可补：我再确认。", "เล่าแล้วเติม: ฉันจะถามอีก"),
    ],
    [
      {
        prompt: lang("Kể một tin chưa chắc.", "Pass on one uncertain piece of news.", "转述一条不确定的消息。", "เล่าข่าวที่ไม่ชัวร์"),
        frame: lang("Mình nghe là ____.", "I heard that ____.", "我听说____。", "ฉันได้ยินว่า ____"),
        sample: lang("Mình nghe là đường đang kẹt.", "I heard that the road is jammed.", "我听说路上堵着。", "ฉันได้ยินว่ารถติด"),
      },
    ],
  ),
  appearance: block(
    lang(
      "Ngoại hình: tóc, cao, mắt, mặc; tả nhẹ, không soi.",
      "Appearance: hair, height, eyes, clothes; light description, not a scan.",
      "外貌：头发、高、眼睛、穿着；轻描，不打量。",
      "รูปร่าง: ผม สูง ตา เสื้อผ้า บรรยายเบา ไม่จ้อง",
    ),
    [
      pat(
        lang("Người ấy + tính từ.", "They are + adjective.", "那个人 + 形容词。", "คนนั้น + คำคุณศัพท์"),
        lang("Tả một nét.", "One feature.", "只描一个特点。", "บรรยายหนึ่งอย่าง"),
        lang("Người ấy cao.", "They are tall.", "那个人很高。", "คนนั้นสูง"),
        lang("Một tính từ một câu.", "One adjective per sentence.", "一句一个形容词。", "หนึ่งคำคุณศัพท์ต่อประโยค"),
      ),
      pat(
        lang("Tóc + dài / ngắn / màu.", "Hair + long / short / colour.", "头发 + 长 / 短 / 颜色。", "ผม + ยาว / สั้น / สี"),
        lang("Tả tóc.", "Describe hair.", "说头发。", "บรรยายผม"),
        lang("Tóc cô ấy ngắn.", "Her hair is short.", "她头发短。", "ผมเธอสั้น"),
        lang("Không cần rất trừ khi thật sự nổi.", "Skip very unless it really stands out.", "不一定加很。", "ไม่ต้อง มาก เว้นแต่เด่นจริง"),
      ),
      pat(
        lang("Hôm nay trông bạn + tính từ.", "You look + adjective today.", "你今天看起来 + 形容词。", "วันนี้คุณดู + คำคุณศัพท์"),
        lang("Khen nhẹ.", "A light compliment.", "轻夸。", "ชมเบา"),
        lang("Hôm nay trông bạn khỏe.", "You look well today.", "你今天看起来挺精神。", "วันนี้คุณดูสบาย"),
        lang("Khỏe / tươi / gọn — an toàn hơn soi cân.", "Well / fresh / neat — safer than weight.", "精神 / 清爽比体重安全。", "สบาย / สด ปลอดภัยกว่าน้ำหนัก"),
      ),
    ],
    [
      lang("Tả để nhận người, không để chấm điểm.", "Describe to recognise someone, not to score them.", "为了认出，不是打分。", "บรรยายเพื่อจำ ไม่ให้คะแนน"),
      lang("Nếu không chắc, hỏi: bạn là… phải không?", "If unsure, ask: are you…?", "不确定就问：你是…吗？", "ถ้าไม่ชัวร์ ถาม: คุณคือ...ใช่ไหม"),
    ],
    [
      {
        prompt: lang("Tả một nét nhận ra người.", "Describe one feature to recognise someone.", "用一个特点认出人。", "บรรยายหนึ่งอย่างเพื่อจำคน"),
        frame: lang("Người ấy ____.", "They are ____.", "那个人____。", "คนนั้น ____"),
        sample: lang("Người ấy cao.", "They are tall.", "那个人很高。", "คนนั้นสูง"),
      },
    ],
  ),
  forms: block(
    lang(
      "Tờ khai: họ tên, ngày sinh, địa chỉ, số giấy; xin nói chậm, điền thiếu.",
      "Forms: name, date of birth, address, ID number; ask to slow down, missing field.",
      "表格：姓名、出生日期、地址、证件号；请说慢、漏填。",
      "ฟอร์ม: ชื่อ วันเกิด ที่อยู่ เลขเอกสาร ขอพูดช้า ช่องว่าง",
    ),
    [
      pat(
        lang("Họ tên mình là ____.", "My full name is ____.", "我的姓名是____。", "ชื่อเต็มของฉันคือ ____"),
        lang("Điền tên.", "Fill in the name.", "填姓名。", "กรอกชื่อ"),
        lang("Họ tên mình là Lan Nguyễn.", "My full name is Lan Nguyen.", "我的姓名是兰。", "ชื่อเต็มของฉันคือลาน"),
        lang("Thứ tự họ–tên theo tờ, không theo thói quen chat.", "Follow the form order, not chat habit.", "按表格顺序。", "เรียงตามฟอร์ม"),
      ),
      pat(
        lang("Ngày sinh / địa chỉ là ____.", "Date of birth / address is ____.", "出生日期 / 地址是____。", "วันเกิด / ที่อยู่ คือ ____"),
        lang("Điền số liệu.", "Fill a fact.", "填信息。", "กรอกข้อมูล"),
        lang("Ngày sinh là 1 tháng 5.", "Date of birth is 1 May.", "出生日期是5月1日。", "วันเกิดคือ 1 พฤษภาคม"),
        lang("Nói chậm từng phần: ngày, tháng, năm.", "Slow chunks: day, month, year.", "分段说：日、月、年。", "พูดทีละส่วน"),
      ),
      pat(
        lang("Ô này điền gì? / Mình thiếu ô này.", "What goes in this box? / I am missing this field.", "这一栏填什么？/ 我漏了这一栏。", "ช่องนี้กรอกอะไร / ฉันขาดช่องนี้"),
        lang("Hỏi khi kẹt.", "Ask when stuck.", "卡住就问。", "ติดแล้วถาม"),
        lang("Ô này điền gì?", "What goes in this box?", "这一栏填什么？", "ช่องนี้กรอกอะไร"),
        lang("Tốt hơn đoán sai.", "Better than guessing wrong.", "比填错好。", "ดีกว่าเดาผิด"),
      ),
    ],
    [
      lang("Đánh vần tên nếu người kia viết.", "Spell the name if they are writing it down.", "对方在写就逐字报。", "สะกดชื่อถ้าเขาเขียน"),
      lang("Không đưa thêm giấy nếu chưa được xin.", "Do not hand extra papers until asked.", "没要求就不要多交材料。", "อย่ายื่นเอกสารเกินจนกว่าจะขอ"),
    ],
    [
      {
        prompt: lang("Hỏi ô đang kẹt.", "Ask about the box you are stuck on.", "问卡住的那一栏。", "ถามช่องที่ติด"),
        frame: lang("____ điền gì?", "What goes in ____?", "____填什么？", "____ กรอกอะไร"),
        sample: lang("Ô này điền gì?", "What goes in this box?", "这一栏填什么？", "ช่องนี้กรอกอะไร"),
      },
    ],
  ),
  taxi: block(
    lang(
      "Xe: nói điểm đến, hỏi giá, rẽ, dừng, app hay xe ngoài.",
      "Taxi: destination, fare, turn, stop, app or street hail.",
      "打车：说目的地、问价、转弯、停车、网约还是路边。",
      "แท็กซี่: จุดหมาย ราคา เลี้ยว จอด แอปหรือเรียกข้างทาง",
    ),
    [
      pat(
        lang("Mình đến + nơi.", "To + place, please.", "去 + 地点。", "ไป + ที่"),
        lang("Điểm đến ngay khi lên.", "Destination as you get in.", "上车就说目的地。", "บอกจุดหมายตอนขึ้น"),
        lang("Mình đến nhà ga.", "To the station, please.", "去车站。", "ไปสถานี"),
        lang("Nơi cụ thể hơn gần đây nếu được.", "A named place beats near here if you can.", "具体地点更好。", "ชื่อที่ชัดดีกว่า แถวนี้"),
      ),
      pat(
        lang("Khoảng bao nhiêu tiền?", "About how much is it?", "大概多少钱？", "ประมาณเท่าไหร่"),
        lang("Hỏi giá trước hoặc xác nhận app.", "Ask the fare or confirm the app price.", "先问价或确认软件价。", "ถามราคาก่อน หรือยืนยันแอป"),
        lang("Khoảng bao nhiêu tiền?", "About how much is it?", "大概多少钱？", "ประมาณเท่าไหร่"),
        lang("Khoảng = chưa chốt, lịch sự.", "About = not fixed yet, polite.", "大概=还没定死。", "ประมาณ = ยังไม่ล็อก"),
      ),
      pat(
        lang("Dừng đây được không? / Rẽ trái.", "Can you stop here? / Turn left.", "能停这儿吗？/ 左转。", "จอดตรงนี้ได้ไหม / เลี้ยวซ้าย"),
        lang("Chỉ trên đường.", "Direct on the way.", "路上指挥。", "ชี้ระหว่างทาง"),
        lang("Dừng đây được không?", "Can you stop here?", "能停这儿吗？", "จอดตรงนี้ได้ไหม"),
        lang("Một câu một chỉ dẫn.", "One sentence, one direction.", "一句一个指示。", "หนึ่งประโยค หนึ่งคำสั่งทาง"),
      ),
    ],
    [
      lang("App: mình đặt rồi, biển số là…", "App: I have a booking, the plate is…", "网约：我约好了，车牌是…", "แอป: ฉันจองแล้ว ทะเบียนคือ..."),
      lang("Không cần chuyện dài với tài xế nếu họ đang tập trung.", "Skip small talk if the driver is concentrating.", "司机在开就少闲聊。", "ถ้าคนขับกำลังโฟกัส อย่าคุยยาว"),
    ],
    [
      {
        prompt: lang("Nói điểm đến.", "Give the destination.", "说目的地。", "บอกจุดหมาย"),
        frame: lang("Mình đến ____.", "To ____, please.", "去____。", "ไป ____"),
        sample: lang("Mình đến nhà ga.", "To the station, please.", "去车站。", "ไปสถานี"),
      },
    ],
  ),
  airport: block(
    lang(
      "Sân bay: check-in, cửa, hành lý, chậm chuyến, xin chỉ đường.",
      "Airport: check-in, gate, luggage, delay, ask the way.",
      "机场：值机、登机口、行李、延误、问路。",
      "สนามบิน: เช็กอิน ประตู กระเป๋า ไฟลต์ช้า ถามทาง",
    ),
    [
      pat(
        lang("Mình check-in chuyến + mã.", "Checking in for flight + code.", "办理 + 航班号 值机。", "เช็กอินเที่ยว + รหัส"),
        lang("Quầy.", "At the desk.", "在柜台。", "ที่เคาน์เตอร์"),
        lang("Mình check-in chuyến này.", "Checking in for this flight.", "办理这个航班值机。", "เช็กอินเที่ยวนี้"),
        lang("Đưa hộ chiếu / vé khi được xin.", "Hand passport / ticket when asked.", "按要求出示证件。", "ยื่นพาสปอร์ตเมื่อขอ"),
      ),
      pat(
        lang("Cửa + số ở đâu?", "Where is gate + number?", "登机口 + 号 在哪？", "ประตู + หมายเลข อยู่ไหน"),
        lang("Hỏi cửa.", "Ask for the gate.", "问登机口。", "ถามประตู"),
        lang("Cửa 12 ở đâu?", "Where is gate 12?", "12号登机口在哪？", "ประตู 12 อยู่ไหน"),
        lang("Số cửa đổi được — hỏi lại bảng.", "Gate numbers change — check the board.", "登机口会变。", "เบอร์ประตูเปลี่ยนได้"),
      ),
      pat(
        lang("Chuyến chậm / hành lý chưa ra.", "The flight is delayed / the luggage is not out yet.", "航班延误 / 行李还没出来。", "ไฟลต์ช้า / กระเป๋ายังไม่ออก"),
        lang("Báo tình trạng.", "Report the status.", "说明状况。", "บอกสถานะ"),
        lang("Hành lý chưa ra.", "The luggage is not out yet.", "行李还没出来。", "กระเป๋ายังไม่ออก"),
        lang("Chưa = đang chờ, không phải mất chắc.", "Not yet = waiting, not surely lost.", "还没=在等。", "ยังไม่ = กำลังรอ"),
      ),
    ],
    [
      lang("Câu sân bay ngắn, giấy tờ sẵn.", "Keep airport lines short; papers ready.", "机场句子要短，证件拿好。", "ประโยคสนามบินสั้น เอกสารพร้อม"),
      lang("Hỏi nhân viên: làm ơn chỉ giúp.", "Ask staff: please show me.", "问工作人员：请帮我指一下。", "ถามเจ้าหน้าที่: ช่วยชี้ให้ที"),
    ],
    [
      {
        prompt: lang("Hỏi cửa.", "Ask for the gate.", "问登机口。", "ถามประตูขึ้นเครื่อง"),
        frame: lang("Cửa ____ ở đâu?", "Where is gate ____?", "____号登机口在哪？", "ประตู ____ อยู่ไหน"),
        sample: lang("Cửa 12 ở đâu?", "Where is gate 12?", "12号登机口在哪？", "ประตู 12 อยู่ไหน"),
      },
    ],
  ),
  emergency: block(
    lang(
      "Khẩn: nơi, việc gì, cần giúp, đau chỗ nào; nói chậm, một việc.",
      "Emergency: where, what happened, I need help, where it hurts; slow, one fact.",
      "紧急：在哪、发生什么、需要帮助、哪里疼；说慢，一件事。",
      "ฉุกเฉิน: ที่ไหน เกิดอะไร ต้องการความช่วย ปวดตรงไหน พูดช้า หนึ่งเรื่อง",
    ),
    [
      pat(
        lang("Giúp với! / Mình cần giúp.", "Help! / I need help.", "救命！/ 我需要帮助。", "ช่วยด้วย / ฉันต้องการความช่วย"),
        lang("Mở lời khẩn.", "Open an emergency.", "紧急开口。", "เปิดเหตุฉุกเฉิน"),
        lang("Mình cần giúp.", "I need help.", "我需要帮助。", "ฉันต้องการความช่วย"),
        lang("Một câu trước, chi tiết sau.", "One line first, details after.", "先一句，再细节。", "一句ก่อน รายหลัง"),
      ),
      pat(
        lang("Ở + nơi. Có người + việc.", "At + place. Someone + happened.", "在 + 地点。有人 + 事情。", "ที่ + ที่ มีคน + เรื่อง"),
        lang("Nơi và việc.", "Place and event.", "地点和事情。", "ที่และเรื่อง"),
        lang("Ở góc phố. Có người ngã.", "At the corner. Someone has fallen.", "在街角。有人摔倒了。", "ที่มุมถนน มีคนล้ม"),
        lang("Không kể dài.", "Do not narrate.", "不要长篇。", "อย่าเล่ายาว"),
      ),
      pat(
        lang("Mình đau + chỗ.", "It hurts + here / body part.", "我 + 部位 疼。", "ฉันปวด + ที่"),
        lang("Đau.", "Pain.", "疼痛。", "ปวด"),
        lang("Mình đau ngực.", "My chest hurts.", "我胸口疼。", "ฉันปวดอก"),
        lang("Chỗ trên người, không cần nguyên nhân y khoa.", "Body place, not a medical theory.", "说部位，不猜病理。", "บอกตำแหน่ง ไม่ต้องวินิจฉัย"),
      ),
    ],
    [
      lang("Nói chậm hơn bình thường, không la dài.", "Slower than usual, not a long shout.", "比平时更慢，不要长吼。", "ช้ากว่าปกติ ไม่วี๊ดยาว"),
      lang("Tên, nơi, việc — ba mảnh, có thể ba câu.", "Name, place, event — three pieces, maybe three sentences.", "姓名、地点、事情。", "ชื่อ ที่ เรื่อง — สามชิ้น"),
    ],
    [
      {
        prompt: lang("Nói cần giúp và nơi.", "Say you need help and where.", "说需要帮助和地点。", "บอกว่าต้องการความช่วยและที่"),
        frame: lang("Mình cần giúp. Ở ____.", "I need help. At ____.", "我需要帮助。在____。", "ฉันต้องการความช่วย ที่ ____"),
        sample: lang("Mình cần giúp. Ở góc phố.", "I need help. At the corner.", "我需要帮助。在街角。", "ฉันต้องการความช่วย ที่มุมถนน"),
      },
    ],
  ),
  rent: block(
    lang(
      "Thuê: giá tháng, cọc, gồm điện nước không, hẹn xem nhà, hỏng gì.",
      "Rent: monthly price, deposit, bills included, viewing, what is broken.",
      "租房：月租、押金、包不包水电、预约看房、哪里坏。",
      "เช่า: รายเดือน มัดจำ รวมค่าน้ำไฟไหม นัดดู ของเสีย",
    ),
    [
      pat(
        lang("Tháng này bao nhiêu? Có cọc không?", "How much a month? Is there a deposit?", "一个月多少？有押金吗？", "เดือนละเท่าไหร่ มีมัดจำไหม"),
        lang("Hỏi tiền.", "Ask about money.", "问钱。", "ถามเงิน"),
        lang("Tháng này bao nhiêu?", "How much a month?", "一个月多少？", "เดือนละเท่าไหร่"),
        lang("Tháng / cọc là hai số riêng.", "Rent and deposit are two numbers.", "月租和押金是两个数。", "ค่าเช่ากับมัดจำ คนละตัว"),
      ),
      pat(
        lang("Gồm điện nước không?", "Are bills included?", "包水电吗？", "รวมค่าน้ำค่าไฟไหม"),
        lang("Hỏi phí phụ.", "Ask about extras.", "问额外费用。", "ถามค่าใช้จ่ายเสริม"),
        lang("Gồm điện nước không?", "Are bills included?", "包水电吗？", "รวมค่าน้ำค่าไฟไหม"),
        lang("Gồm = đã nằm trong giá tháng.", "Included = already in the monthly price.", "包含=已在月租里。", "รวม = อยู่ในรายเดือนแล้ว"),
      ),
      pat(
        lang("Hẹn xem nhà lúc + giờ được không?", "Can I view it at + time?", "能预约 + 点 看房吗？", "นัดดูบ้านตอน + โมง ได้ไหม"),
        lang("Hẹn xem.", "Book a viewing.", "预约看房。", "นัดดู"),
        lang("Hẹn xem nhà lúc mười giờ được không?", "Can I view it at ten?", "能预约十点看房吗？", "นัดดูบ้านตอนสิบโมงได้ไหม"),
        lang("Giờ cụ thể.", "A clock time.", "要具体钟点。", "ต้องมีนาฬิกา"),
      ),
    ],
    [
      lang("Hỏng: cái này không chạy, xin sửa.", "Broken: this does not work, please fix it.", "坏了：这个不转，请修。", "เสีย: อันนี้ไม่ทำงาน ขอซ่อม"),
      lang("Đừng đồng ý miệng nếu chưa rõ cọc.", "Do not agree verbally if the deposit is unclear.", "押金不清不要口头答应。", "อย่าตอบรับปากถ้ามัดจำไม่ชัด"),
    ],
    [
      {
        prompt: lang("Hỏi giá tháng.", "Ask the monthly rent.", "问月租。", "ถามค่ารายเดือน"),
        frame: lang("____ bao nhiêu?", "How much is ____?", "____多少？", "____ เท่าไหร่"),
        sample: lang("Tháng này bao nhiêu?", "How much a month?", "一个月多少？", "เดือนละเท่าไหร่"),
      },
    ],
  ),
  cinema: block(
    lang(
      "Phim: suất, ghế, vé, không tiếng / có phụ đề, xin đổi suất.",
      "Cinema: showing, seat, ticket, no sound / subtitles, change the time.",
      "电影：场次、座位、票、没声音 / 字幕、改场。",
      "หนัง: รอบ ที่นั่ง ตั๋ว ไม่มีเสียง / คำบรรยาย ขอเปลี่ยนรอบ",
    ),
    [
      pat(
        lang("Cho mình hai vé suất + giờ.", "Two tickets for the + time showing.", "两张 + 点 的票。", "ขอตั๋วสองใบรอบ + โมง"),
        lang("Mua vé.", "Buy tickets.", "买票。", "ซื้อตั๋ว"),
        lang("Cho mình hai vé suất bảy giờ.", "Two tickets for the seven showing.", "两张七点的票。", "ขอตั๋วสองใบรอบหนึ่งทุ่ม"),
        lang("Số vé + suất.", "Number of tickets + showing.", "张数 + 场次。", "จำนวนใบ + รอบ"),
      ),
      pat(
        lang("Còn ghế giữa không?", "Are there seats in the middle?", "还有中间的位子吗？", "ยังมีที่นั่งกลางไหม"),
        lang("Chọn ghế.", "Pick seats.", "选座。", "เลือกที่"),
        lang("Còn ghế giữa không?", "Are there seats in the middle?", "还有中间的位子吗？", "ยังมีที่นั่งกลางไหม"),
        lang("Giữa / rìa / hàng trước.", "Middle / edge / front row.", "中间 / 边上 / 前排。", "กลาง / ริม / แถวหน้า"),
      ),
      pat(
        lang("Phim này có phụ đề không?", "Does this film have subtitles?", "这部有字幕吗？", "หนังนี้มีคำบรรยายไหม"),
        lang("Hỏi chữ / tiếng.", "Ask about subs / language.", "问字幕 / 语言。", "ถามคำบรรยาย / ภาษา"),
        lang("Phim này có phụ đề không?", "Does this film have subtitles?", "这部有字幕吗？", "หนังนี้มีคำบรรยายไหม"),
        lang("Hỏi trước khi mua nếu bạn cần chữ.", "Ask before you buy if you need the text.", "需要字幕就先问再买。", "ถามก่อนซื้อถ้าต้องการตัวอักษร"),
      ),
    ],
    [
      lang("Suất hết: còn suất sau không?", "Sold out: is there a later showing?", "这场没了：还有下一场吗？", "รอบเต็ม: ยังมีรอบหลังไหม"),
      lang("Trong rạp: nói nhỏ, điện thoại tắt.", "Inside: keep it down, phone off.", "进场后小声，手机静音。", "ในโรง: เบา ปิดเสียงมือถือ"),
    ],
    [
      {
        prompt: lang("Mua hai vé một suất.", "Buy two tickets for one showing.", "买一场的两张票。", "ซื้อตั๋วสองใบหนึ่งรอบ"),
        frame: lang("Cho mình ____ vé suất ____.", "____ tickets for the ____ showing.", "____张____的票。", "ขอตั๋ว ____ ใบรอบ ____"),
        sample: lang("Cho mình hai vé suất bảy giờ.", "Two tickets for the seven showing.", "两张七点的票。", "ขอตั๋วสองใบรอบหนึ่งทุ่ม"),
      },
    ],
  ),
  seasons: block(
    lang(
      "Mùa: tên mùa, đồ theo trời, thích mùa nào, so với năm ngoái.",
      "Seasons: name the season, clothes for the sky, which you like, versus last year.",
      "季节：季节名、按天穿衣服、喜欢哪一季、和去年比。",
      "ฤดู: ชื่อฤดู เสื้อผ้าตามฟ้า ชอบฤดูไหน เทียบปีก่อน",
    ),
    [
      pat(
        lang("Bây giờ là mùa + tên.", "It is + season now.", "现在是 + 季节。", "ตอนนี้เป็นฤดู + ชื่อ"),
        lang("Nói mùa hiện tại.", "Name the current season.", "说当前季节。", "บอกฤดูปัจจุบัน"),
        lang("Bây giờ là mùa mưa.", "It is the rainy season now.", "现在是雨季。", "ตอนนี้เป็นฤดูฝน"),
        lang("Tên mùa là danh từ.", "The season name is a noun.", "季节名是名词。", "ชื่อฤดูเป็นคำนาม"),
      ),
      pat(
        lang("Mùa này mình mặc + đồ.", "In this season I wear + item.", "这季节我穿 + 衣服。", "ฤดูนี้ฉันใส่ + ของ"),
        lang("Đồ theo mùa.", "Clothes for the season.", "按季穿衣服。", "เสื้อผ้าตามฤดู"),
        lang("Mùa này mình mặc áo khoác.", "In this season I wear a jacket.", "这季节我穿外套。", "ฤดูนี้ฉันใส่เสื้อคลุม"),
        lang("Một món tiêu biểu là đủ.", "One typical item is enough.", "一件代表就够。", "หนึ่งชิ้นพอ"),
      ),
      pat(
        lang("Mình thích mùa + tên hơn.", "I prefer + season.", "我更喜欢 + 季节。", "ฉันชอบฤดู + ชื่อ กว่า"),
        lang("So sở thích.", "Compare likes.", "比较喜好。", "เทียบความชอบ"),
        lang("Mình thích mùa khô hơn.", "I prefer the dry season.", "我更喜欢旱季。", "ฉันชอบฤดูแล้งกว่า"),
        lang("Hơn / 更 / กว่า khi có hai mùa trong đầu.", "Use the comparative when two seasons are in mind.", "心里有两季再用更。", "มีสองฤดูในหัวค่อยใช้ กว่า"),
      ),
    ],
    [
      lang("Mùa khác thời tiết một ngày: mùa là khoảng dài.", "A season is a stretch, not one day's weather.", "季节是一段时间。", "ฤดูคือช่วงยาว ไม่ใช่ฟ้าวันเดียว"),
      lang("Năm ngoái mùa này… để so nhẹ.", "Last year this season… for a light compare.", "可用去年这个季节。", "ปีก่อนฤดูนี้... เพื่อเทียบเบา"),
    ],
    [
      {
        prompt: lang("Nói mùa hiện tại.", "Name the current season.", "说现在是什么季节。", "บอกฤดูปัจจุบัน"),
        frame: lang("Bây giờ là mùa ____.", "It is ____ now.", "现在是____。", "ตอนนี้เป็นฤดู ____"),
        sample: lang("Bây giờ là mùa mưa.", "It is the rainy season now.", "现在是雨季。", "ตอนนี้เป็นฤดูฝน"),
      },
    ],
  ),
  lost: block(
    lang(
      "Lạc / mất: mình lạc, mình mất + đồ, lần cuối ở đâu, xin giúp tìm.",
      "Lost: I am lost, I lost + thing, last seen where, please help me look.",
      "迷路 / 丢失：我迷路了、我丢了 + 东西、最后在哪、请帮我找。",
      "หลง / หาย: ฉันหลง ฉันทำ + ของ หาย เห็นครั้งสุดท้ายที่ไหน ช่วยหา",
    ),
    [
      pat(
        lang("Mình lạc. / Đường về + nơi ở đâu?", "I am lost. / Which way back to + place?", "我迷路了。/ 回 + 地点 怎么走？", "ฉันหลงทาง / ทางกลับ + ที่ อยู่ไหน"),
        lang("Lạc đường.", "Lost on the way.", "迷路。", "หลงทาง"),
        lang("Mình lạc. Nhà ga ở đâu?", "I am lost. Where is the station?", "我迷路了。车站在哪？", "ฉันหลงทาง สถานีอยู่ไหน"),
        lang("Nơi mình cần, không kể cả hành trình.", "The place you need, not the whole journey.", "说要去的地方。", "บอกที่ที่ต้องการ"),
      ),
      pat(
        lang("Mình mất + đồ.", "I have lost + thing.", "我丢了 + 东西。", "ฉันทำ + ของ หาย"),
        lang("Mất đồ.", "Lost an item.", "丢东西。", "ของหาย"),
        lang("Mình mất ví.", "I have lost my wallet.", "我丢了钱包。", "ฉันทำกระเป๋าสตางค์หาย"),
        lang("Đồ cụ thể: ví, điện thoại, túi.", "Name the item: wallet, phone, bag.", "要具体物件。", "บอกของชัด"),
      ),
      pat(
        lang("Lần cuối ở + nơi. Màu + tả ngắn.", "Last at + place. Colour + short look.", "最后在 + 地点。颜色 + 短描述。", "ครั้งสุดท้ายที่ + ที่ สี + บรรยายสั้น"),
        lang("Giúp người khác tìm.", "Help someone search.", "帮别人找。", "ให้คนอื่นช่วยหา"),
        lang("Lần cuối ở quán. Ví màu đen.", "Last at the café. A black wallet.", "最后在咖啡馆。黑色钱包。", "ครั้งสุดท้ายที่ร้านกาแฟ กระเป๋าสีดำ"),
        lang("Hai câu: nơi, rồi hình.", "Two lines: place, then look.", "两句：地点，再外形。", "สองประโยค: ที่ แล้วรูป"),
      ),
    ],
    [
      lang("Lạc người khác mất đồ — hai mẫu, đừng trộn.", "Lost (person) vs lost (thing) — two frames.", "迷路和丢失是两套。", "หลงคน กับ ของหาย คนละโครง"),
      lang("Nhờ quán / bảo vệ trước khi đăng ồn.", "Ask the café / staff before you post loudly.", "先问店员/保安。", "ถามร้าน / รปภ. ก่อนโพสต์ดัง"),
    ],
    [
      {
        prompt: lang("Báo mất một món.", "Report one lost item.", "报告丢了一件东西。", "แจ้งของหายหนึ่งชิ้น"),
        frame: lang("Mình mất ____.", "I have lost ____.", "我丢了____。", "ฉันทำ ____ หาย"),
        sample: lang("Mình mất ví.", "I have lost my wallet.", "我丢了钱包。", "ฉันทำกระเป๋าสตางค์หาย"),
      },
    ],
  ),
  opinion: block(
    lang(
      "Ý kiến: mình nghĩ, mình không hẳn, lý do ngắn, hỏi ý người kia.",
      "Opinion: I think, not really, a short reason, ask what they think.",
      "看法：我觉得、不完全是、短理由、问对方怎么看。",
      "ความเห็น: ฉันคิดว่า ไม่เชิง เหตุสั้น ถามว่าคุณว่าอย่างไร",
    ),
    [
      pat(
        lang("Mình nghĩ ____.", "I think ____.", "我觉得____。", "ฉันคิดว่า ____"),
        lang("Nêu ý.", "State a view.", "提出看法。", "ให้ความเห็น"),
        lang("Mình nghĩ nên đi sớm.", "I think we should go early.", "我觉得该早点走。", "ฉันคิดว่าควรไปเร็ว"),
        lang("Nghĩ nhẹ hơn chắc.", "Think is softer than I am sure.", "想比确定轻。", "คิดว่า อ่อนกว่า แน่ใจ"),
      ),
      pat(
        lang("Mình không hẳn đồng ý, vì ____.", "I don't really agree, because ____.", "我不完全同意，因为____。", "ฉันไม่เชิงเห็นด้วย เพราะ ____"),
        lang("Không đồng ý có lý do.", "Disagree with a reason.", "反对要有理由。", "ไม่เห็นด้วยต้องมีเหตุ"),
        lang("Mình không hẳn đồng ý, vì chỗ đó ồn.", "I don't really agree, because that place is noisy.", "我不完全同意，因为那里有点吵。", "ฉันไม่เชิงเห็นด้วย เพราะที่นั่นเสียงดัง"),
        lang("Vì + một lý do, không phải bài luận.", "Because + one reason, not an essay.", "因为 + 一个理由。", "เพราะ + หนึ่งเหตุ"),
      ),
      pat(
        lang("Bạn nghĩ sao?", "What do you think?", "你怎么看？", "คุณว่าอย่างไร"),
        lang("Trả lượt.", "Hand the turn back.", "把话轮还回去。", "ส่งตาให้เขา"),
        lang("Bạn nghĩ sao?", "What do you think?", "你怎么看？", "คุณว่าอย่างไร"),
        lang("Hỏi thật, đừng hỏi rồi nói tiếp ngay.", "Ask for real; do not talk over the answer.", "真的在问。", "ถามจริง อย่าทับคำตอบ"),
      ),
    ],
    [
      lang("Đời sống: ý về quán, giờ, cách đi — không cần giọng hội nghị.", "Daily views: a café, a time, a route — not a conference tone.", "生活看法，不要会议腔。", "ความเห็นชีวิต ไม่ใช่โทนประชุม"),
      lang("Một ý một lý do.", "One view, one reason.", "一个看法一个理由。", "หนึ่งความเห็น หนึ่งเหตุ"),
    ],
    [
      {
        prompt: lang("Nêu ý và hỏi lại.", "Give a view and ask back.", "提出看法并问回去。", "ให้ความเห็นแล้วถามกลับ"),
        frame: lang("Mình nghĩ ____. Bạn nghĩ sao?", "I think ____. What do you think?", "我觉得____。你怎么看？", "ฉันคิดว่า ____ คุณว่าอย่างไร"),
        sample: lang("Mình nghĩ nên đi sớm. Bạn nghĩ sao?", "I think we should go early. What do you think?", "我觉得该早点走。你怎么看？", "ฉันคิดว่าควรไปเร็ว คุณว่าอย่างไร"),
      },
    ],
  ),
  work: block(
    lang(
      "Việc: đang làm gì, họp, deadline, xin nghỉ, nhờ hỗ trợ.",
      "Work: what I do, a meeting, a deadline, time off, ask for support.",
      "工作：在做什么、开会、截止日期、请假、请同事帮忙。",
      "งาน: กำลังทำอะไร ประชุม เดดไลน์ ลาก ขอความช่วยจากเพื่อนร่วมงาน",
    ),
    [
      pat(
        lang("Mình đang + động từ + việc này.", "I am + verb-ing + this.", "我正在 + 动词 + 这个。", "ฉันกำลัง + กริยา + งานนี้"),
        lang("Nói việc lúc này.", "Say the current task.", "说眼下的工作。", "บอกงานตอนนี้"),
        lang("Mình đang soạn file này.", "I am preparing this file.", "我正在整理这个文件。", "ฉันกำลังจัดไฟล์นี้"),
        lang("Đang = chưa xong.", "Am doing = not finished.", "正在=还没完。", "กำลัง = ยังไม่เสร็จ"),
      ),
      pat(
        lang("Deadline lúc + giờ / ngày.", "The deadline is + time / day.", "截止日期是 + 时间 / 日期。", "เดดไลน์คือ + โมง / วัน"),
        lang("Chốt hạn.", "Name the due point.", "把期限说清。", "บอกกำหนด"),
        lang("Deadline lúc sáu giờ chiều.", "The deadline is six this evening.", "截止日期是下午六点。", "เดดไลน์คือหกโมงเย็น"),
        lang("Giờ cụ thể hơn sớm nếu được.", "A clock time beats soon.", "具体时间比早点好。", "นาฬิกาชัดกว่า เร็วๆ"),
      ),
      pat(
        lang("Giúp mình xem giúp được không?", "Could you take a look for me?", "能帮我看一下吗？", "ช่วยดูให้ทีได้ไหม"),
        lang("Nhờ đồng nghiệp.", "Ask a colleague.", "请同事。", "ขอเพื่อนร่วมงาน"),
        lang("Giúp mình xem giúp được không?", "Could you take a look for me?", "能帮我看一下吗？", "ช่วยดูให้ทีได้ไหม"),
        lang("Xem giúp = nhờ mắt, chưa nhờ làm hộ cả việc.", "A look ≠ doing the whole job.", "看一下≠代做全部。", "ดูให้ ≠ ทำทั้งงานแทน"),
      ),
    ],
    [
      lang("Họp: mình vào máy / mình xin nói sau.", "Meeting: I am in / I will speak after.", "开会：我进来了 / 我稍后说。", "ประชุม: ฉันเข้าแล้ว / ฉันขอพูดทีหลัง"),
      lang("Xin nghỉ: ngày + lý do ngắn.", "Time off: the day + a short reason.", "请假：哪天 + 短理由。", "ลาก: วัน + เหตุสั้น"),
    ],
    [
      {
        prompt: lang("Nói hạn một việc.", "Name one deadline.", "说一个截止日期。", "บอกเดดไลน์หนึ่งงาน"),
        frame: lang("Deadline lúc ____.", "The deadline is ____.", "截止日期是____。", "เดดไลน์คือ ____"),
        sample: lang("Deadline lúc sáu giờ chiều.", "The deadline is six this evening.", "截止日期是下午六点。", "เดดไลน์คือหกโมงเย็น"),
      },
    ],
  ),
  environment: block(
    lang(
      "Môi trường đời sống: rác, tái chế, bớt túi, đường ồn, cây / sông gần nhà.",
      "Living environment: rubbish, recycle, fewer bags, noisy road, trees / river nearby.",
      "生活里的环境：垃圾、回收、少用袋子、马路吵、家附近的树 / 河。",
      "สิ่งแวดล้อมในชีวิต: ขยะ รีไซเคิล ลดถุง ถนนเสียงดัง ต้นไม้ / แม่น้ำใกล้บ้าน",
    ),
    [
      pat(
        lang("Bỏ rác vào + thùng.", "Put rubbish in + the bin.", "把垃圾放进 + 桶。", "ทิ้งขยะลง + ถัง"),
        lang("Việc nhỏ hằng ngày.", "A small daily act.", "日常小事。", "เรื่องเล็กทุกวัน"),
        lang("Bỏ rác vào thùng này.", "Put rubbish in this bin.", "把垃圾放进这个桶。", "ทิ้งขยะลงถังนี้"),
        lang("Thùng đúng loại nếu có tách.", "The right bin if they are sorted.", "有分类就对桶。", "ถังให้ถูกประเภทถ้าแยก"),
      ),
      pat(
        lang("Mình bớt dùng + túi / nhựa.", "I use fewer + bags / less plastic.", "我少用 + 袋子 / 塑料。", "ฉันลดใช้ + ถุง / พลาสติก"),
        lang("Thói quen.", "A habit.", "习惯。", "นิสัย"),
        lang("Mình bớt dùng túi nilon.", "I use fewer plastic bags.", "我少用塑料袋。", "ฉันลดใช้ถุงพลาสติก"),
        lang("Bớt = giảm, không phải cấm tuyệt đối.", "Fewer = reduce, not a total ban.", "少用≠完全不用。", "ลด ≠ ห้ามสิ้นเชิง"),
      ),
      pat(
        lang("Đường này ồn / gần đây có + cây / sông.", "This road is noisy / there are + trees / a river nearby.", "这条路很吵 / 这附近有 + 树 / 河。", "ถนนนี้เสียงดัง / แถวนี้มี + ต้นไม้ / แม่น้ำ"),
        lang("Tả chỗ ở.", "Describe the area.", "描述住的地方。", "บรรยายย่าน"),
        lang("Gần đây có sông.", "There is a river nearby.", "这附近有河。", "แถวนี้มีแม่น้ำ"),
        lang("Một nét một câu.", "One feature per sentence.", "一句一个特点。", "หนึ่งอย่างต่อประโยค"),
      ),
    ],
    [
      lang("Nói việc mình làm được, không giảng bài.", "Talk about what you can do, not a lecture.", "说自己做得到的，不讲课。", "พูดสิ่งที่เราทำได้ ไม่บรรยาย"),
      lang("Không đồng ý một cách: mình hiểu, nhưng gần nhà mình…", "Disagree with: I see that, but near my place…", "可以用：我理解，但我家附近…", "ไม่เห็นด้วย: ฉันเข้าใจ แต่ใกล้บ้านฉัน..."),
    ],
    [
      {
        prompt: lang("Nói một thói quen nhỏ.", "Name one small habit.", "说一个小习惯。", "บอกนิสัยเล็กหนึ่งอย่าง"),
        frame: lang("Mình bớt dùng ____.", "I use fewer ____.", "我少用____。", "ฉันลดใช้ ____"),
        sample: lang("Mình bớt dùng túi nilon.", "I use fewer plastic bags.", "我少用塑料袋。", "ฉันลดใช้ถุงพลาสติก"),
      },
    ],
  ),
  education: block(
    lang(
      "Học lâu dài: cách học, lớp, tự học, mình nhớ hơn khi…, hạn chế của lớp đông.",
      "Longer study: how you learn, class, self-study, I remember better when…, limits of a big class.",
      "较长期的学习：怎么学、课、自学、怎样记得更牢、大班的局限。",
      "การเรียนระยะยาว: วิธีเรียน ห้องเรียน เรียนเอง จำได้ดีเมื่อ... ข้อจำกัดของห้องใหญ่",
    ),
    [
      pat(
        lang("Mình nhớ hơn khi + động từ.", "I remember better when I + verb.", "我 + 动词 的时候记得更牢。", "ฉันจำได้ดีขึ้นเมื่อ + กริยา"),
        lang("Nói cách học của mình.", "Name your way of learning.", "说自己的学习方式。", "บอกวิธีเรียนของเรา"),
        lang("Mình nhớ hơn khi nói thành tiếng.", "I remember better when I say it aloud.", "我大声说的时候记得更牢。", "ฉันจำได้ดีขึ้นเมื่อพูดออกเสียง"),
        lang("Khi + việc cụ thể.", "When + a concrete act.", "当 + 具体动作。", "เมื่อ + ทำชัด"),
      ),
      pat(
        lang("Lớp đông thì ____, tự học thì ____.", "In a big class ____; on my own ____.", "大班的话____，自学的话____。", "ห้องใหญ่แล้ว ____ เรียนเองแล้ว ____"),
        lang("So hai cách.", "Compare two ways.", "比较两种方式。", "เทียบสองทาง"),
        lang("Lớp đông thì ít được nói, tự học thì thiếu người sửa.", "In a big class you speak less; on your own nobody corrects you.", "大班开口少，自学没人改。", "ห้องใหญ่ได้น้อย พูดเองไม่มีคนแก้"),
        lang("Mỗi vế một ý.", "One idea per half.", "一半一个意思。", "แต่ละครึ่ง หนึ่งความ"),
      ),
      pat(
        lang("Mình cần + thời / người / bài + để ____.", "I need + time / a person / a lesson + in order to ____.", "我需要 + 时间 / 人 / 课 才能____。", "ฉันต้องการ + เวลา / คน / บท เพื่อ ____"),
        lang("Nêu nhu cầu học.", "Name a study need.", "说出学习需求。", "บอกความต้องการเรียน"),
        lang("Mình cần người sửa để khỏi sai mãi.", "I need someone to correct me so I do not keep getting it wrong.", "我需要有人纠正，才不会一直错。", "ฉันต้องการคนแก้ เพื่อจะได้ไม่ผิดซ้ำ"),
        lang("Để + mục đích.", "To / in order to + purpose.", "为了 + 目的。", "เพื่อ + จุดประสงค์"),
      ),
    ],
    [
      lang("Giọng đời sống, không phải đề thi giáo dục.", "Spoken, not an education-exam essay.", "生活口气，不是教育论文。", "โทนพูด ไม่ใช่เรียงความสอบ"),
      lang("Không phủ nhận lớp hay tự học tuyệt đối — nói chỗ vừa.", "Do not ban class or self-study; name the fit.", "不要一刀切。", "อย่าตัดขาดห้องหรือเรียนเอง"),
    ],
    [
      {
        prompt: lang("Nói cách mình nhớ.", "Say how you remember.", "说你怎样记得住。", "บอกว่าจำได้อย่างไร"),
        frame: lang("Mình nhớ hơn khi ____.", "I remember better when I ____.", "我____的时候记得更牢。", "ฉันจำได้ดีขึ้นเมื่อ ____"),
        sample: lang("Mình nhớ hơn khi nói thành tiếng.", "I remember better when I say it aloud.", "我大声说的时候记得更牢。", "ฉันจำได้ดีขึ้นเมื่อพูดออกเสียง"),
      },
    ],
  ),
};
