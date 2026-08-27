import { CORE_EXTRA } from "./learn-core-extra.mjs";
import { CORE_FRAMES } from "./learn-core-frames.mjs";
import { UNIT_THEORY_MORE } from "./learn-theory-more.mjs";

export function lang(vi, en, zh, th) {
  return { vi, en, zh, th };
}

/** Core grammar by CEFR-style level. Original notes, not copied from a textbook. */
export const CORE = {
  A1: {
    vi: {
      title: "Nền A1 · tiếng Việt",
      structure: "Câu thường đi theo: ai + làm gì + (ở đâu / với ai). Hỏi thì thêm gì / đâu / không? ở cuối.",
      points: [
        "Tôi / bạn / cô ấy — xưng hô đơn giản.",
        "Không đứng trước động từ: không ăn, không đi.",
        "Loại từ: một cái bàn, một người bạn, một con mèo.",
        "Là dùng khi xưng tên hoặc nói nghề: Tôi là Lan.",
        "À / ư / nhé làm câu mềm hơn, không đổi nghĩa gốc.",
      ],
      usage: ["Nói ngắn, đủ nghĩa. Một câu một ý.", "Học mẫu rồi thay từ, đừng dịch từng chữ."],
      tip: "Giữ đúng thứ tự: chủ ngữ trước, động từ sau.",
      applyPrompt: "Nói một câu theo mẫu, chỉ thay một từ.",
    },
    en: {
      title: "A1 core · English",
      structure: "Basic order is subject + verb + object. Questions often use be / do at the front.",
      points: [
        "I / you / she / he + am / is / are.",
        "A / an with a singular count noun: a café, an apple.",
        "Present simple for habits: I work, she works.",
        "There is / there are for what exists.",
        "Can for ability or a polite request: Can I have tea?",
      ],
      usage: ["Keep one idea per sentence.", "Learn a frame, then swap one word."],
      tip: "Do not drop be: I am Lan, not I Lan.",
      applyPrompt: "Say one sentence from the frame. Change only one word.",
    },
    zh: {
      title: "A1 基础 · 中文",
      structure: "基本语序是：谁 + 做什么 +（在哪里）。疑问句常在句尾加「吗」或疑问词。",
      points: [
        "我 / 你 / 他 / 她。",
        "是：我是兰。",
        "吗：你好吗？",
        "的：我的包。",
        "量词：一杯茶、一个人、一只猫。",
        "在：我在家。",
      ],
      usage: ["先记整句，再换一个词。", "不要按英文词序硬译。"],
      tip: "动词一般放在主语后面。",
      applyPrompt: "用句型说一句，只换一个词。",
    },
    th: {
      title: "A1 แกน · ไทย",
      structure: "ลำดับทั่วไปคือ คน + กริยา + (อะไร / ที่ไหน) คำถามมักมี ไหม หรือ คำถาม เช่น อะไร ที่ไหน",
      points: [
        "ฉัน / คุณ — และคำสุภาพ ครับ / ค่ะ ท้ายประโยค",
        "ไม่ วางหน้ากริยา: ไม่กิน ไม่ไป",
        "ลักษณนาม: หนึ่งแก้ว หนึ่งคน หนึ่งตัว",
        "คือ / เป็น เมื่อบอกชื่อหรืออาชีพ",
        "ไหม เพื่อถามแบบใช่–ไม่ใช่",
      ],
      usage: ["พูดสั้น หนึ่งประโยคหนึ่งความ", "จำโครงแล้วค่อยสลับคำ"],
      tip: "อย่าลืม ครับ/ค่ะ เมื่อพูดสุภาพ",
      applyPrompt: "พูดตามโครง เปลี่ยนแค่คำเดียว",
    },
  },
  A2: {
    vi: {
      title: "Nền A2 · tiếng Việt",
      structure: "Thêm thời và mức độ: đang / đã / rồi / sẽ / chưa. So sánh: hơn. Câu dài hơn một chút nhưng vẫn một ý chính.",
      points: [
        "Đang = việc đang xảy ra.",
        "Đã / rồi = xong hoặc qua.",
        "Sẽ = sắp tới.",
        "Chưa = chưa xong.",
        "Hơn: rẻ hơn, gần hơn.",
        "Được không? để nhờ lịch sự.",
      ],
      usage: ["Nói rõ đã xong hay chưa, đừng chỉ nói động từ trần.", "Nhờ vả: làm ơn / giúp mình / được không?"],
      tip: "Rồi thường đứng cuối: Ăn rồi.",
      applyPrompt: "Nói một câu có đang / rồi / sẽ.",
    },
    en: {
      title: "A2 core · English",
      structure: "Add time: past simple, going to, and comparatives. Countable vs uncountable starts to matter.",
      points: [
        "Past simple: I went, she had, we did.",
        "Going to for a near plan.",
        "Comparative: cheaper, nearer, more expensive.",
        "Some / any in offers and questions.",
        "Could I…? is softer than Can I…?",
      ],
      usage: ["Mark the time. Do not mix yesterday with present simple.", "Polite requests use could / would."],
      tip: "Regular past adds -ed; many daily verbs are irregular.",
      applyPrompt: "Make one past or plan sentence from the frame.",
    },
    zh: {
      title: "A2 基础 · 中文",
      structure: "开始标记时间：了、过、要 / 想、会 / 能 / 可以，以及比较句「比」。",
      points: [
        "了：变化或完成。",
        "过：曾经。",
        "要 / 想：打算或想要。",
        "会 / 能 / 可以：能力、可能、许可。",
        "比：这个比那个贵。",
        "还没：尚未。",
      ],
      usage: ["有时间就要说出来：今天、已经、还没。", "请 / 可以吗 让请求更客气。"],
      tip: "「了」不要每个动词都加，只在有变化时用。",
      applyPrompt: "用 了 或 要 说一句。",
    },
    th: {
      title: "A2 แกน · ไทย",
      structure: "เพิ่มเวลา: แล้ว / จะ / กำลัง / ยังไม่ และเปรียบเทียบ กว่า",
      points: [
        "แล้ว = เสร็จหรือผ่านมา",
        "จะ = อนาคตใกล้",
        "กำลัง = กำลังทำ",
        "ยังไม่ = ยังไม่เสร็จ",
        "กว่า: ถูกกว่า ใกล้กว่า",
        "ได้ไหม เพื่อขออย่างสุภาพ",
      ],
      usage: ["บอกให้ชัดว่าเสร็จหรือยัง", "ขอร้อง: ช่วย...หน่อย ได้ไหม"],
      tip: "แล้ว มักอยู่ท้าย: กินแล้ว",
      applyPrompt: "พูดประโยคที่มี แล้ว หรือ จะ",
    },
  },
  B1: {
    vi: {
      title: "Nền B1 · tiếng Việt",
      structure: "Nối hai ý: nếu… thì…, để, vì, nhưng. Bị / được cho việc xảy đến với mình. Kể việc có trước–sau.",
      points: [
        "Nếu… thì… cho điều kiện.",
        "Để + động từ: mục đích.",
        "Vì / nên: lý do.",
        "Bị / được: mình là người chịu hoặc nhận.",
        "Khi / sau khi: thứ tự thời gian.",
        "Mình nghĩ… để nêu ý nhẹ.",
      ],
      usage: ["Đưa một lý do ngắn, đừng chỉ nói có / không.", "Giữ giọng đời sống, chưa cần văn viết."],
      tip: "Một câu B1 thường có hai vế, không phải hai chủ đề.",
      applyPrompt: "Nói một câu có nếu / vì / để.",
    },
    en: {
      title: "B1 core · English",
      structure: "Link ideas: because, if, so, when. Present perfect vs past. Soft opinion with I think / I need.",
      points: [
        "Present perfect: I have arrived, I have forgotten.",
        "First conditional: If it rains, I will stay.",
        "Should / might for advice and possibility.",
        "Because / so / although for reason and contrast.",
        "I would like… for a polite want.",
      ],
      usage: ["Give a short reason.", "Choose past simple for a finished time (yesterday), present perfect for a result now."],
      tip: "If + present, will + verb.",
      applyPrompt: "Make one sentence with if / because / should.",
    },
    zh: {
      title: "B1 基础 · 中文",
      structure: "把两件事连起来：因为…所以…、如果…就…、虽然…但是…。开始用把字句和结果补语。",
      points: [
        "因为…所以…",
        "如果…就…",
        "虽然…但是…",
        "把：把窗户打开。",
        "着：门开着。",
        "我觉得…提出看法。",
      ],
      usage: ["说完看法，补一个短理由。", "把字句强调处置：谁把什么怎么样。"],
      tip: "「了」和「过」不要混：过是经历，了是变化。",
      applyPrompt: "用 因为 或 如果 说一句。",
    },
    th: {
      title: "B1 แกน · ไทย",
      structure: "เชื่อมสองความ: ถ้า...ก็..., เพื่อ, เพราะ, แต่ ถูก / ให้ เมื่อสิ่งนั้นเกิดกับเรา",
      points: [
        "ถ้า...ก็... เงื่อนไข",
        "เพื่อ + กริยา จุดประสงค์",
        "เพราะ / เลย เหตุผล",
        "ถูก = ถูกกระทำ",
        "ให้ = ให้ใครทำ",
        "ฉันคิดว่า... แสดงความเห็นเบาๆ",
      ],
      usage: ["ให้เหตุผลสั้น อย่าตอบแค่ ใช่/ไม่", "ยังเป็นภาษาพูด ไม่ต้องเป็นภาษาเขียน"],
      tip: "ประโยค B1 มีสองส่วน ไม่ใช่สองเรื่อง",
      applyPrompt: "พูดประโยคที่มี ถ้า / เพราะ / เพื่อ",
    },
  },
  B2: {
    vi: {
      title: "Nền B2 · tiếng Việt",
      structure: "Nêu lập trường, nhượng bộ, giả định: dù… vẫn…, nếu như…, mặt khác. Giữ lịch sự khi không đồng ý.",
      points: [
        "Dù / mặc dù… vẫn…",
        "Nếu như / giả sử cho giả định.",
        "Một mặt… mặt khác…",
        "Không hẳn / chưa chắc để giảm mạnh.",
        "Mình hiểu… nhưng… khi từ chối nhẹ.",
        "Nên / không nên khi khuyên, không ra lệnh.",
      ],
      usage: ["Không đồng ý thì đưa lý do và một hướng khác.", "Tránh giọng thi cử; nói như đời sống."],
      tip: "B2 là kiểm soát giọng, không phải câu dài cho có.",
      applyPrompt: "Nêu ý và thêm một nhượng bộ hoặc lý do.",
    },
    en: {
      title: "B2 core · English",
      structure: "Control stance: although, however, if I were, on the other hand. Soften disagreement.",
      points: [
        "Although / however for contrast.",
        "Second conditional: If I were you, I would…",
        "Passive when the action matters more than the person.",
        "I see your point, but…",
        "Tend to / might to avoid sounding absolute.",
      ],
      usage: ["Disagree with a reason and an alternative.", "Keep it spoken, not exam-essay tone."],
      tip: "B2 is tone control, not longer sentences for their own sake.",
      applyPrompt: "Give an opinion plus a contrast or condition.",
    },
    zh: {
      title: "B2 基础 · 中文",
      structure: "把立场说清楚：虽然…还是…、如果我是你…、另一方面。不同意时仍保持客气。",
      points: [
        "虽然…还是 / 但是…",
        "如果我是你，我会…",
        "一方面…另一方面…",
        "不见得 / 不一定 减轻语气。",
        "我理解…不过…",
        "被字句：包被寄丢了。",
      ],
      usage: ["反对时给理由和另一选择。", "像日常谈话，不像写作文。"],
      tip: "B2 练的是分寸，不是把句子拉长。",
      applyPrompt: "说一个看法，并加上让步或条件。",
    },
    th: {
      title: "B2 แกน · ไทย",
      structure: "คุมท่าที: ถึงแม้...ก็ยัง..., ถ้าเป็นคุณ..., อีกด้าน ปฏิเสธอย่างสุภาพ",
      points: [
        "ถึงแม้ / แม้ว่า...ก็ยัง...",
        "ถ้าฉันเป็นคุณ ฉันจะ...",
        "ด้านหนึ่ง...อีกด้าน...",
        "ไม่เชิง / ไม่แน่ เพื่อไม่พูดแรง",
        "ฉันเข้าใจ...แต่...",
        "ควร / ไม่ควร เมื่อแนะนำ ไม่สั่ง",
      ],
      usage: ["ไม่เห็นด้วยก็ให้เหตุผลและทางเลือก", "เป็นภาษาพูด ไม่ใช่โทนข้อสอบ"],
      tip: "B2 คือควบคุมอารมณ์ประโยค ไม่ใช่ทำให้ยาว",
      applyPrompt: "ให้ความเห็นแล้วเติมข้อแม้หรือเหตุผล",
    },
  },
};

function block(structure, patterns, usage, apply) {
  return { structure, patterns, usage, apply };
}

function pat(form, use, example, note) {
  return { form, use, example, note };
}

export const UNIT_THEORY = {
  greet: block(
    lang(
      "Chào trước, rồi xưng tên. Câu hỏi tên: Tên bạn là gì?",
      "Greet first, then give your name. Ask: What is your name?",
      "先打招呼，再报名字。问：你叫什么名字？",
      "ทักก่อน แล้วบอกชื่อ ถาม: คุณชื่ออะไร",
    ),
    [
      pat(
        lang("Xin chào, tôi là + tên.", "Hello, I am + name.", "你好，我是 + 名字。", "สวัสดี ฉันคือ + ชื่อ"),
        lang("Gặp lần đầu, lịch sự.", "First meeting, polite.", "初次见面，客气。", "พบครั้งแรก สุภาพ"),
        lang("Xin chào, tôi là Lan.", "Hello, I am Lan.", "你好，我是兰。", "สวัสดี ฉันคือลาน"),
        lang("Không cần thêm động từ khác.", "Do not drop am.", "「是」不能省。", "อย่าลืม คือ / เป็น"),
      ),
      pat(
        lang("Tên bạn là gì?", "What is your name?", "你叫什么名字？", "คุณชื่ออะไร"),
        lang("Hỏi tên.", "Ask for a name.", "问名字。", "ถามชื่อ"),
        lang("Tên bạn là gì?", "What is your name?", "你叫什么名字？", "คุณชื่ออะไร"),
        lang("Trả lời bằng Tôi là… không cần lặp lại câu hỏi.", "Answer with I am…", "用「我是…」回答。", "ตอบว่า ฉันคือ…"),
      ),
    ],
    [
      lang("Xin chào dùng rộng hơn chào.", "Hello works in more places than hi.", "你好比嗨更稳妥。", "สวัสดี ใช้ได้กว้างกว่า หวัดดี"),
      lang("Cảm ơn / xin lỗi đứng một mình cũng đủ.", "Thank you / sorry can stand alone.", "谢谢 / 对不起 可以单独说。", "ขอบคุณ / ขอโทษ พูดคำเดียวก็ได้"),
    ],
    [
      {
        prompt: lang("Xưng tên mình.", "Say your name.", "报自己的名字。", "บอกชื่อตัวเอง"),
        frame: lang("Xin chào, tôi là ____.", "Hello, I am ____.", "你好，我是____。", "สวัสดี ฉันคือ ____"),
        sample: lang("Xin chào, tôi là Lan.", "Hello, I am Lan.", "你好，我是兰。", "สวัสดี ฉันคือลาน"),
      },
    ],
  ),
  numbers: block(
    lang(
      "Số đứng trước loại từ: hai cái, ba người. Hỏi giá: Bao nhiêu?",
      "Number + noun. Ask price with How much?",
      "数字在量词前：两个、三个人。问价：多少钱？",
      "ตัวเลขมาก่อนลักษณนาม ถามราคา: เท่าไหร่",
    ),
    [
      pat(
        lang("Cho mình + số + cái.", "+ number, please.", "请给我 + 数量。", "ขอ + จำนวน"),
        lang("Gọi món hoặc lấy đồ.", "Ordering or taking things.", "点单或拿东西。", "สั่งหรือรับของ"),
        lang("Cho mình hai cái.", "Two, please.", "请给我两个。", "ขอสองอัน"),
        lang("Cái / người / ly phải khớp đồ.", "Match the measure word later in Chinese; in English the noun is enough.", "量词要配对。", "ลักษณนามต้องเข้าของ"),
      ),
    ],
    [
      lang("Bao nhiêu hỏi số lượng hoặc giá, nhìn ngữ cảnh.", "How many vs how much.", "多少可问数量或价钱。", "เท่าไหร่ ใช้ได้ทั้งจำนวนและราคา"),
    ],
    [
      {
        prompt: lang("Xin hai món.", "Ask for two.", "要两份。", "ขอสองอย่าง"),
        frame: lang("Cho mình ____ cái.", "____, please.", "请给我____个。", "ขอ ____ อัน"),
        sample: lang("Cho mình hai cái.", "Two, please.", "请给我两个。", "ขอสองอัน"),
      },
    ],
  ),
  time: block(
    lang(
      "Giờ + buổi: bảy giờ sáng. Hẹn: Hẹn + giờ được không?",
      "Time + part of day: seven in the morning. Arrange: Is seven okay?",
      "时间 + 时段：早上七点。约时间：七点可以吗？",
      "เวลา + ช่วงวัน: เจ็ดโมงเช้า นัด: เจ็ดโมงได้ไหม",
    ),
    [
      pat(
        lang("Bây giờ mấy giờ?", "What time is it now?", "现在几点？", "ตอนนี้กี่โมง"),
        lang("Hỏi giờ.", "Ask the time.", "问时间。", "ถามเวลา"),
        lang("Bây giờ mấy giờ?", "What time is it now?", "现在几点？", "ตอนนี้กี่โมง"),
        lang("Trả lời: bảy giờ sáng — có buổi thì rõ hơn.", "Add morning / evening if needed.", "最好加上早上 / 晚上。", "เติม เช้า / เย็น จะชัด"),
      ),
    ],
    [
      lang("Hôm nay / ngày mai / hôm qua neo thời điểm.", "Today / tomorrow / yesterday anchor the time.", "今天 / 明天 / 昨天 把时间钉住。", "วันนี้ / พรุ่งนี้ / เมื่อวาน ยึดเวลา"),
    ],
    [
      {
        prompt: lang("Hẹn một giờ.", "Propose a time.", "约一个时间。", "เสนอดเวลา"),
        frame: lang("Hẹn ____ được không?", "Is ____ okay?", "____可以吗？", "นัด ____ ได้ไหม"),
        sample: lang("Hẹn bảy giờ được không?", "Is seven okay?", "七点可以吗？", "นัดเจ็ดโมงได้ไหม"),
      },
    ],
  ),
  cafe: block(
    lang(
      "Gọi đồ: Cho mình + món. Thêm / bớt: ít đường, thêm sữa.",
      "Order: A + drink, please. Adjust: little sugar, with milk.",
      "点单：请给我 + 饮料。加减：少糖、加奶。",
      "สั่ง: ขอ + เครื่องดื่ม ปรับ: น้ำตาลน้อย เพิ่มนม",
    ),
    [
      pat(
        lang("Cho mình một ly + đồ uống.", "A + drink, please.", "请给我一杯 + 饮料。", "ขอ + เครื่องดื่ม หนึ่งแก้ว"),
        lang("Gọi món ở quán.", "Ordering at a café.", "在店里点单。", "สั่งที่ร้าน"),
        lang("Cho mình một ly trà.", "A tea, please.", "请给我一杯茶。", "ขอชาหนึ่งแก้ว"),
        lang("Ly / cup đi với đồ uống.", "Use a / an with the drink.", "杯是饮料量词。", "แก้ว คู่กับเครื่องดื่ม"),
      ),
    ],
    [
      lang("Mang đi / ngồi lại nói lúc gọi.", "Say takeaway or for here when you order.", "外带还是在店里，点的时候说。", "ใส่ถุงหรือนั่งกิน พูดตอนสั่ง"),
      lang("Thanh toán giúp mình = xin hóa đơn.", "The bill, please.", "买单 = 要账单。", "คิดเงินด้วย = ขอบิล"),
    ],
    [
      {
        prompt: lang("Gọi một đồ uống.", "Order one drink.", "点一杯饮料。", "สั่งเครื่องดื่มหนึ่งอย่าง"),
        frame: lang("Cho mình một ly ____.", "A ____, please.", "请给我一杯____。", "ขอ ____ หนึ่งแก้ว"),
        sample: lang("Cho mình một ly trà.", "A tea, please.", "请给我一杯茶。", "ขอชาหนึ่งแก้ว"),
      },
    ],
  ),
  food: block(
    lang(
      "Khẩu vị đi sau món: không cay, hơi ngọt. Dị ứng phải nói rõ.",
      "Taste comes after the dish: not spicy, a bit sweet. State allergies clearly.",
      "口味放在菜后面：不要辣、有点甜。过敏要说清楚。",
      "รสตามหลังอาหาร: ไม่เผ็ด หวานนิด แพ้ต้องพูดชัด",
    ),
    [
      pat(
        lang("Mình + khẩu vị / dị ứng.", "I am + taste / allergy.", "我 + 口味 / 过敏。", "ฉัน + รส / แพ้"),
        lang("Bảo bếp hoặc người phục vụ.", "Tell the kitchen or waiter.", "告诉厨房或服务员。", "บอกครัวหรือพนักงาน"),
        lang("Mình ăn chay. Không cay.", "I am vegetarian. Not spicy.", "我吃素。不要辣。", "ฉันกินมังสวิรัติ ไม่เผ็ด"),
        lang("Hai ý có thể hai câu ngắn.", "Two short sentences are clearer than one long one.", "两句短的比一句长的清楚。", "สองประโยคสั้นชัดกว่าประโยคยาว"),
      ),
    ],
    [lang("Thêm một phần / thêm cơm là xin thêm, không phải gọi món mới.", "One more is extra, not a new order.", "再来一份是加，不是新点。", "ขอเพิ่ม คือเพิ่ม ไม่ใช่สั่งใหม่")],
    [
      {
        prompt: lang("Nói không cay.", "Say you do not want spice.", "说不要辣。", "บอกว่าไม่เผ็ด"),
        frame: lang("____.", "____.", "____。", "____"),
        sample: lang("Không cay.", "Not spicy.", "不要辣。", "ไม่เผ็ด"),
      },
    ],
  ),
  family: block(
    lang(
      "Đây là + người nhà. Có + số + anh chị em.",
      "This is + family member. I have + number + siblings.",
      "这是 + 家人。我有 + 数量 + 兄弟姐妹。",
      "นี่คือ + คนในบ้าน มี + จำนวน + พี่น้อง",
    ),
    [
      pat(
        lang("Đây là + người.", "This is my + person.", "这是我的 + 人。", "นี่คือ + คน"),
        lang("Giới thiệu người bên cạnh.", "Introduce someone next to you.", "介绍身边的人。", "แนะนำคนข้างๆ"),
        lang("Đây là bố mình.", "This is my father.", "这是我爸爸。", "นี่คือพ่อของฉัน"),
        lang("Tiếng Việt thường thêm mình sau danh xưng.", "English needs my.", "中文常用我家 / 我爸爸。", "ไทยมักมี ของฉัน"),
      ),
    ],
    [lang("Nhà mình có bốn người — đếm cả mình.", "There are four people in my home includes you.", "我家有四口人，包括自己。", "บ้านมีสี่คน นับตัวเองด้วย")],
    [
      {
        prompt: lang("Giới thiệu một người nhà.", "Introduce one family member.", "介绍一位家人。", "แนะนำคนในบ้านหนึ่งคน"),
        frame: lang("Đây là ____ mình.", "This is my ____.", "这是我____。", "นี่คือ ____ ของฉัน"),
        sample: lang("Đây là mẹ mình.", "This is my mother.", "这是我妈妈。", "นี่คือแม่ของฉัน"),
      },
    ],
  ),
  travel: block(
    lang(
      "Hỏi đường: … ở đâu? Chỉ đường: đi thẳng, rẽ trái / phải.",
      "Ask: Where is …? Direct: go straight, turn left / right.",
      "问路：…在哪里？指路：直走、左转 / 右转。",
      "ถามทาง: ...อยู่ไหน ชี้ทาง: ตรงไป เลี้ยวซ้าย / ขวา",
    ),
    [
      pat(
        lang("… ở đâu?", "Where is …?", "…在哪里？", "...อยู่ไหน"),
        lang("Hỏi chỗ.", "Ask for a place.", "问地点。", "ถามที่"),
        lang("Nhà ga ở đâu?", "Where is the station?", "车站在哪里？", "สถานีอยู่ไหน"),
        lang("Trả lời thường có hướng + mốc.", "Answers often have a direction plus a landmark.", "回答常带方向和参照。", "คำตอบมักมีทิศและจุดอ้าง"),
      ),
    ],
    [lang("Một vé đi + nơi — đủ khi mua vé.", "One ticket to + place is enough at the counter.", "一张去 + 地点 的票。", "ตั๋วไป + ที่ ใช้ตอนซื้อ")],
    [
      {
        prompt: lang("Hỏi một nơi.", "Ask for a place.", "问一个地方。", "ถามที่หนึ่งแห่ง"),
        frame: lang("____ ở đâu?", "Where is ____?", "____在哪里？", "____ อยู่ไหน"),
        sample: lang("Nhà ga ở đâu?", "Where is the station?", "车站在哪里？", "สถานีอยู่ไหน"),
      },
    ],
  ),
  body: block(
    lang(
      "Đau + bộ phận. Cần gặp bác sĩ / xin thuốc.",
      "Hurt + body part. I need a doctor / medicine.",
      "哪里疼 + 部位。需要看医生 / 要药。",
      "เจ็บ + อวัยวะ ต้องพบหมอ / ขอยา",
    ),
    [
      pat(
        lang("Mình đau + chỗ.", "My + part hurts / I have a + symptom.", "我 + 部位 + 疼。", "ฉันเจ็บ / ปวด + ที่"),
        lang("Nói triệu chứng.", "State a symptom.", "说症状。", "บอกอาการ"),
        lang("Mình đau đầu.", "I have a headache.", "我头疼。", "ฉันปวดหัว"),
        lang("Không cần câu phức khi đang đau.", "Keep it short when you are unwell.", "不舒服时句子越短越好。", "ตอนไม่สบาย พูดสั้น"),
      ),
    ],
    [lang("Dị ứng thuốc phải nói trước khi nhận thuốc.", "Say allergies before taking medicine.", "吃药前先说过敏。", "บอกว่าแพ้ยาก่อนรับยา")],
    [
      {
        prompt: lang("Nói một chỗ đau.", "Name one pain.", "说一个疼的地方。", "บอกจุดที่เจ็บ"),
        frame: lang("Mình đau ____.", "My ____ hurts.", "我____疼。", "ฉันปวด ____"),
        sample: lang("Mình đau đầu.", "I have a headache.", "我头疼。", "ฉันปวดหัว"),
      },
    ],
  ),
  shopping: block(
    lang(
      "Thử → hỏi cỡ → lấy / đổi / trả. Xin hóa đơn khi trả tiền.",
      "Try on → ask size → take / exchange / return. Ask for a receipt when you pay.",
      "试穿 → 问尺码 → 要 / 换 / 退。付钱时要发票。",
      "ลอง → ถามไซซ์ → เอา / เปลี่ยน / คืน ตอนจ่ายขอใบเสร็จ",
    ),
    [
      pat(
        lang("Còn cỡ này không?", "Do you have this size?", "有这个尺码吗？", "มีไซซ์นี้ไหม"),
        lang("Hỏi tồn kho.", "Check stock.", "问有没有货。", "ถามว่ามีของไหม"),
        lang("Còn cỡ này không?", "Do you have this size?", "有这个尺码吗？", "มีไซซ์นี้ไหม"),
        lang("Không thì hỏi đổi cỡ.", "If not, ask to change size.", "没有就换号。", "ถ้าไม่มี ขอเปลี่ยนไซซ์"),
      ),
    ],
    [lang("Đổi là đổi món; trả lại là hoàn.", "Exchange vs return are different.", "换和退不是同一件事。", "เปลี่ยนของ กับ คืนของ คนละเรื่อง")],
    [
      {
        prompt: lang("Xin thử đồ.", "Ask to try it on.", "要求试穿。", "ขอลองใส่"),
        frame: lang("Mình muốn thử ____.", "I want to try ____ on.", "我想试____。", "ฉันอยากลอง ____"),
        sample: lang("Mình muốn thử cái này.", "I want to try this on.", "我想试这个。", "ฉันอยากลองอันนี้"),
      },
    ],
  ),
  hotel: block(
    lang(
      "Đặt / nhận / trả phòng. Xin thêm đồ và báo hỏng ở lễ tân.",
      "Book / check in / check out. Ask for extras and report problems at the desk.",
      "订 / 入住 / 退房。加物品和报修找前台。",
      "จอง / เช็กอิน / เช็กเอาต์ ขอของเพิ่มและแจ้งพังที่เคาน์เตอร์",
    ),
    [
      pat(
        lang("Mình đã đặt phòng.", "I have a reservation.", "我订了房间。", "ฉันจองห้องแล้ว"),
        lang("Bắt đầu nhận phòng.", "Start check-in.", "开始办理入住。", "เริ่มเช็กอิน"),
        lang("Mình đã đặt phòng.", "I have a reservation.", "我订了房间。", "ฉันจองห้องแล้ว"),
        lang("Nói tên trên đơn nếu được hỏi.", "Give the name on the booking if asked.", "被问就报订单姓名。", "ถ้าถูกถาม บอกชื่อในใบจอง"),
      ),
    ],
    [lang("Wifi mật khẩu là gì? — câu hỏi đủ.", "What is the wifi password? is enough.", "无线网密码是什么？一句即可。", "รหัสไวไฟคืออะไร พอแล้ว")],
    [
      {
        prompt: lang("Xin thêm khăn.", "Ask for towels.", "再要毛巾。", "ขอผ้าขนหนูเพิ่ม"),
        frame: lang("Cho mình thêm ____.", "More ____, please.", "请再给我____。", "ขอ ____ เพิ่ม"),
        sample: lang("Cho mình thêm khăn.", "More towels, please.", "请再给我毛巾。", "ขอผ้าขนหนูเพิ่ม"),
      },
    ],
  ),
  feelings: block(
    lang(
      "Mình + cảm xúc. Hỏi người khác: Bạn ổn không?",
      "I am / I feel + emotion. Ask: Are you okay?",
      "我 + 心情。问别人：你还好吗？",
      "ฉัน + ความรู้สึก ถามคนอื่น: คุณโอเคไหม",
    ),
    [
      pat(
        lang("Hôm nay mình + cảm xúc.", "I am + feeling today.", "今天我很 + 心情。", "วันนี้ฉัน + รู้สึก"),
        lang("Nói trạng thái hiện tại.", "State how you feel now.", "说当下的心情。", "บอกอารมณ์ตอนนี้"),
        lang("Hôm nay mình vui.", "I am happy today.", "今天我很开心。", "วันนี้ฉันดีใจ"),
        lang("Thêm vì nếu muốn có lý do.", "Add because if you want a reason.", "想加理由就用因为。", "ถ้าจะให้เหตุ เติม เพราะ"),
      ),
    ],
    [lang("Đừng sợ / bình tĩnh nào — dùng để trấn an, không phải ra lệnh gắt.", "Don't be afraid is comfort, not a bark.", "别害怕 是安抚。", "อย่ากลัว คือปลอบ ไม่ใช่ดุ")],
    [
      {
        prompt: lang("Nói cảm xúc hôm nay.", "Say today's feeling.", "说今天的心情。", "บอกรู้สึกวันนี้"),
        frame: lang("Hôm nay mình ____.", "I am ____ today.", "今天我很____。", "วันนี้ฉัน ____"),
        sample: lang("Hôm nay mình mệt.", "I am tired today.", "今天我很累。", "วันนี้ฉันเหนื่อย"),
      },
    ],
  ),
  invitations: block(
    lang(
      "Mời: đến… nhé? Nhận lời hoặc từ chối nhẹ: tiếc quá, mình bận. Hẹn lần sau.",
      "Invite: Come to…? Accept, or decline gently: what a pity, I am busy. Offer next time.",
      "邀请：来…好吗？接受，或温和拒绝：可惜，我有事。约下次。",
      "ชวน: มา...ไหม รับคำ หรือปฏิเสธเบา: น่าเสียดาย ฉันไม่ว่าง นัดครั้งหน้า",
    ),
    [
      pat(
        lang("Tối nay đến + chỗ nhé?", "Come to + place tonight?", "今晚来 + 地点 好吗？", "คืนนี้มา + ที่ ไหม"),
        lang("Mời người khác.", "Invite someone.", "发出邀请。", "ชวนคน"),
        lang("Tối nay đến nhà mình nhé?", "Come to my place tonight?", "今晚来我家好吗？", "คืนนี้มาบ้านฉันไหม"),
        lang("Từ chối thì cám ơn vì đã mời.", "If you decline, thank them for inviting you.", "拒绝也要谢谢邀请。", "ถ้าปฏิเสธ ขอบคุณที่ชวน"),
      ),
    ],
    [lang("Rất muốn nhưng không được — giữ quan hệ.", "I would love to but I cannot keeps the relationship.", "很想去但去不了，关系还在。", "อยากไปมากแต่ไปไม่ได้ ยังรักษาสัมพันธ์")],
    [
      {
        prompt: lang("Từ chối nhẹ.", "Decline gently.", "温和拒绝。", "ปฏิเสธอย่างสุภาพ"),
        frame: lang("Tiếc quá, mình ____.", "What a pity, I am ____.", "可惜，我____。", "น่าเสียดาย ฉัน ____"),
        sample: lang("Tiếc quá, mình bận.", "What a pity, I am busy.", "可惜，我有事。", "น่าเสียดาย ฉันไม่ว่าง"),
      },
    ],
  ),
  complaints: block(
    lang(
      "Xin lỗi + sự cố + yêu cầu đổi / hoàn. Giữ lịch sự.",
      "Sorry + the problem + ask to replace / refund. Stay polite.",
      "不好意思 + 问题 + 请求换 / 退。保持礼貌。",
      "ขอโทษ + ปัญหา + ขอเปลี่ยน / คืน รักษาน้ำเสียงสุภาพ",
    ),
    [
      pat(
        lang("Xin lỗi, … không đúng.", "Sorry, this is not right.", "不好意思，这个不对。", "ขอโทษ อันนี้ไม่ถูก"),
        lang("Báo lỗi mà không chửi.", "Report the fault without attacking.", "说明问题，不骂人。", "บอกปัญหา โดยไม่ด่า"),
        lang("Xin lỗi, món này không đúng.", "Sorry, this dish is not right.", "不好意思，这道菜不对。", "ขอโทษ อาหารจานนี้ไม่ถูก"),
        lang("Mình hiểu các bạn đang bận — giảm căng.", "I understand you are busy lowers heat.", "我理解你们很忙，能降温。", "ฉันเข้าใจว่าพวกคุณยุ่ง ช่วยลดแรง"),
      ),
    ],
    [lang("Muốn gặp quản lý chỉ khi chưa giải quyết được.", "Ask for the manager only if it is not resolved.", "解决不了再找经理。", "ยังแก้ไม่ได้ค่อยขอพบผู้จัดการ")],
    [
      {
        prompt: lang("Xin đổi món.", "Ask for a replacement.", "请求更换。", "ขอเปลี่ยน"),
        frame: lang("Có thể đổi giúp mình không?", "Could you replace this for me?", "可以帮我换一下吗？", "ช่วยเปลี่ยนให้ได้ไหม"),
        sample: lang("Có thể đổi giúp mình không?", "Could you replace this for me?", "可以帮我换一下吗？", "ช่วยเปลี่ยนให้ได้ไหม"),
      },
    ],
  ),
  plans: block(
    lang(
      "Dự định / sẽ / nếu… thì đổi lịch. Nói chưa chắc khi chưa chốt.",
      "Intend / will / if… then reschedule. Say it is not certain when it is not fixed.",
      "打算 / 会 / 如果…就改期。没定就说还不确定。",
      "ตั้งใจจะ / จะ / ถ้า...ก็เลื่อน ถ้ายังไม่ล็อก บอกว่ายังไม่แน่",
    ),
    [
      pat(
        lang("Nếu + điều kiện thì mình + hành động.", "If + condition, I will + action.", "如果 + 条件，我就 + 动作。", "ถ้า + เงื่อนไข ฉันจะ + การกระทำ"),
        lang("Kế hoạch có điều kiện.", "A plan with a condition.", "带条件的计划。", "แผนที่มีเงื่อนไข"),
        lang("Nếu mưa thì mình đổi lịch.", "If it rains, I will reschedule.", "如果下雨，我就改期。", "ถ้าฝนตก ฉันจะเลื่อน"),
        lang("Trừ khi… cho ngoại lệ.", "Unless marks the exception.", "除非 表示例外。", "เว้นแต่ คือข้อยกเว้น"),
      ),
    ],
    [lang("Phương án B nói ra để người kia đỡ kẹt.", "Name a plan B so the other person is not stuck.", "备选说出来，对方不被动。", "บอกแผนสำรอง จะได้ไม่ติด")],
    [
      {
        prompt: lang("Nói một kế hoạch có điều kiện.", "State a conditional plan.", "说一个带条件的计划。", "พูดแผนที่มีเงื่อนไข"),
        frame: lang("Nếu ____ thì mình ____.", "If ____, I will ____.", "如果____，我就____。", "ถ้า ____ ฉันจะ ____"),
        sample: lang("Nếu mưa thì mình đổi lịch.", "If it rains, I will reschedule.", "如果下雨，我就改期。", "ถ้าฝนตก ฉันจะเลื่อน"),
      },
    ],
  ),
  home: block(
    lang(
      "Phòng + ở + hướng. Nhờ: … giúp mình. Mời vào / ngồi đi.",
      "Room + is + direction. Ask: please + verb. Invite: come in / have a seat.",
      "房间 + 在 + 方向。拜托：请 + 动词。邀请：请进 / 请坐。",
      "ห้อง + อยู่ + ทิศ ขอ: ช่วย...หน่อย เชิญ: เข้ามา / นั่งสิ",
    ),
    [
      pat(
        lang("… ở bên trái / phải.", "The … is on the left / right.", "…在左边 / 右边。", "...อยู่ทางซ้าย / ขวา"),
        lang("Chỉ chỗ trong nhà.", "Point to a place at home.", "指家里的位置。", "ชี้ที่ในบ้าน"),
        lang("Nhà tắm ở bên phải.", "The bathroom is on the right.", "卫生间在右边。", "ห้องน้ำอยู่ทางขวา"),
        lang("Mời vào nhà trước khi chỉ phòng.", "Invite them in before giving directions.", "先进门再指路。", "เชิญเข้ามาก่อน แล้วค่อยชี้ห้อง"),
      ),
    ],
    [lang("Đóng / mở + cửa / đèn / cửa sổ là động từ + đồ.", "Open / close + door / light / window.", "开 / 关 + 门 / 灯 / 窗。", "เปิด / ปิด + ประตู / ไฟ / หน้าต่าง")],
    [
      {
        prompt: lang("Chỉ nhà tắm.", "Point to the bathroom.", "指卫生间。", "ชี้ห้องน้ำ"),
        frame: lang("Nhà tắm ở ____.", "The bathroom is ____.", "卫生间在____。", "ห้องน้ำอยู่ ____"),
        sample: lang("Nhà tắm ở bên phải.", "The bathroom is on the right.", "卫生间在右边。", "ห้องน้ำอยู่ทางขวา"),
      },
    ],
  ),
  messages: block(
    lang(
      "Tin nhắn ngắn: xin lỗi vì trễ, hẹn giờ, gửi vị trí, hỏi ở đâu.",
      "Short messages: sorry I am late, set a time, send a pin, ask where.",
      "短信要短：抱歉迟到、约时间、发定位、问在哪。",
      "ข้อความสั้น: ขอโทษที่สาย นัดเวลา ส่งพิกัด ถามอยู่ไหน",
    ),
    [
      pat(
        lang("Xin lỗi mình trễ.", "Sorry I am late.", "抱歉我迟到了。", "ขอโทษที่สาย"),
        lang("Tin xin lỗi.", "An apology text.", "道歉短信。", "ข้อความขอโทษ"),
        lang("Xin lỗi mình trễ.", "Sorry I am late.", "抱歉我迟到了。", "ขอโทษที่สาย"),
        lang("Có thể thêm: năm phút nữa đến.", "You can add: I will be there in five minutes.", "可补：还有五分钟到。", "เติมได้: อีกห้านาทีถึง"),
      ),
    ],
    [lang("Một tin một việc. Đừng nhồi ba câu hỏi.", "One message, one job.", "一条短信一件事。", "หนึ่งข้อความ หนึ่งเรื่อง")],
    [
      {
        prompt: lang("Hẹn giờ trên tin nhắn.", "Set a time by message.", "用短信约时间。", "นัดเวลาในแชท"),
        frame: lang("Hẹn ____ được không?", "Is ____ okay?", "____可以吗？", "นัด ____ ได้ไหม"),
        sample: lang("Hẹn bảy giờ được không?", "Is seven okay?", "七点可以吗？", "นัดเจ็ดโมงได้ไหม"),
      },
    ],
  ),
};

function projectUnit(raw, track) {
  if (!raw) return { structure: "", patterns: [], usage: [], apply: [] };
  return {
    structure: raw.structure[track],
    patterns: (raw.patterns || []).map((item) => ({
      form: item.form[track],
      use: item.use[track],
      example: item.example[track],
      note: item.note[track],
    })),
    usage: (raw.usage || []).map((item) => item[track]),
    apply: (raw.apply || []).map((item) => ({
      prompt: item.prompt[track],
      frame: item.frame[track],
      sample: item.sample[track],
    })),
  };
}

export function theoryFor(unitId, level, track) {
  if (unitId === "sounds") {
    const more = projectUnit(UNIT_THEORY_MORE.sounds, track);
    const titles = {
      vi: "Âm và cách đọc",
      en: "Sounds and reading",
      zh: "读音",
      th: "เสียงและการอ่าน",
    };
    return {
      levelTitle: titles[track],
      levelNote: more.structure,
      points: more.usage,
      contrasts: [],
      mistakes: [],
      examples: more.patterns.map((item) => item.example).filter(Boolean),
      applyPrompt: more.apply[0]?.prompt || "",
      tip: more.patterns[0]?.note || "",
      structure: more.structure,
      patterns: more.patterns,
      usage: more.usage,
      apply: more.apply,
    };
  }

  const core = CORE[level]?.[track] || CORE.A1[track];
  const extra = CORE_EXTRA[level]?.[track] || CORE_EXTRA.A1[track];
  const frames = CORE_FRAMES[level]?.[track] || CORE_FRAMES.A1[track];
  const unit = projectUnit(UNIT_THEORY[unitId], track);
  const more = projectUnit(UNIT_THEORY_MORE[unitId], track);
  const structure = unit.structure || more.structure || core.structure;
  const patternMap = new Map();
  for (const item of [...unit.patterns, ...more.patterns, ...(frames.patterns || [])]) {
    if (item?.form && !patternMap.has(item.form)) patternMap.set(item.form, item);
  }
  const applyMap = new Map();
  for (const item of [...unit.apply, ...more.apply, ...(frames.apply || [])]) {
    if (item?.sample && !applyMap.has(item.sample)) applyMap.set(item.sample, item);
  }
  const topicPoints = [...unit.usage, ...more.usage].filter(Boolean);
  const points = [...new Set([...topicPoints, ...core.points.slice(0, topicPoints.length ? 2 : 6), ...(frames.morePoints || [])])];
  return {
    levelTitle: structure.split(/[。.!]/)[0].trim() || core.title,
    levelNote: structure,
    points: points.slice(0, 8),
    contrasts: extra.contrasts,
    mistakes: extra.mistakes,
    examples: extra.examples,
    applyPrompt: core.applyPrompt,
    tip: unit.patterns[0]?.note || more.patterns[0]?.note || core.tip,
    structure,
    patterns: [...patternMap.values()].slice(0, 8),
    usage: [...core.usage, ...(frames.moreUsage || []), ...unit.usage, ...more.usage],
    apply: [...applyMap.values()],
  };
}
