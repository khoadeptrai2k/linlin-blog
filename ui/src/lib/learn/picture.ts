import type { SentenceItem, VocabItem } from "@/lib/learn/types";

export type SceneMood = "warm" | "cool" | "mint" | "sun" | "rose" | "peach";

export type UnitArt = {
  emoji: string;
  stickers: [string, string, string];
  mood: SceneMood;
};

export const UNIT_ART: Record<string, UnitArt> = {
  sounds: { emoji: "🎧", stickers: ["📣", "🔡", "👂"], mood: "cool" },
  greet: { emoji: "👋", stickers: ["😊", "🤝", "💌"], mood: "warm" },
  numbers: { emoji: "🔢", stickers: ["1️⃣", "🛍️", "💰"], mood: "sun" },
  time: { emoji: "⏰", stickers: ["🌅", "🌙", "📅"], mood: "cool" },
  cafe: { emoji: "☕", stickers: ["🍰", "🥤", "🪑"], mood: "peach" },
  food: { emoji: "🍜", stickers: ["🥢", "🌶️", "🍚"], mood: "warm" },
  market: { emoji: "🛒", stickers: ["🍊", "🥬", "⚖️"], mood: "mint" },
  home: { emoji: "🏠", stickers: ["🔑", "🚪", "🛋️"], mood: "peach" },
  messages: { emoji: "💬", stickers: ["📱", "✉️", "👍"], mood: "cool" },
  family: { emoji: "👨‍👩‍👧", stickers: ["🍼", "🏡", "❤️"], mood: "rose" },
  clothes: { emoji: "👕", stickers: ["👗", "👟", "🧥"], mood: "peach" },
  weather: { emoji: "🌤️", stickers: ["🌧️", "☀️", "☔"], mood: "cool" },
  feelings: { emoji: "😊", stickers: ["😢", "😴", "😍"], mood: "rose" },
  colors: { emoji: "🎨", stickers: ["🔴", "🔵", "🟡"], mood: "sun" },
  daily: { emoji: "🌅", stickers: ["🪥", "🚌", "🛏️"], mood: "warm" },
  shopping: { emoji: "🛍️", stickers: ["💳", "👗", "🎁"], mood: "peach" },
  restaurant: { emoji: "🍽️", stickers: ["🥘", "🥂", "🧾"], mood: "warm" },
  hotel: { emoji: "🏨", stickers: ["🛏️", "🧳", "🔑"], mood: "cool" },
  phone: { emoji: "📱", stickers: ["📞", "🔋", "💬"], mood: "cool" },
  hobbies: { emoji: "🎸", stickers: ["📷", "📚", "🎮"], mood: "sun" },
  sports: { emoji: "⚽", stickers: ["🏃", "🏊", "🏅"], mood: "mint" },
  money: { emoji: "💵", stickers: ["💳", "🏦", "🪙"], mood: "sun" },
  cooking: { emoji: "👩‍🍳", stickers: ["🍳", "🧄", "🔥"], mood: "warm" },
  cleaning: { emoji: "🧹", stickers: ["🧼", "🧺", "✨"], mood: "mint" },
  pets: { emoji: "🐶", stickers: ["🐱", "🦴", "🐾"], mood: "peach" },
  holidays: { emoji: "🎉", stickers: ["🎁", "🍰", "🥳"], mood: "rose" },
  neighbors: { emoji: "🏡", stickers: ["🚪", "🍵", "🤝"], mood: "mint" },
  internet: { emoji: "💻", stickers: ["🌐", "📧", "🔐"], mood: "cool" },
  school: { emoji: "🎒", stickers: ["📘", "✏️", "🏫"], mood: "sun" },
  appearance: { emoji: "🪞", stickers: ["💇", "👓", "💄"], mood: "rose" },
  forms: { emoji: "📝", stickers: ["🪪", "✍️", "📎"], mood: "cool" },
  taxi: { emoji: "🚕", stickers: ["🗺️", "💵", "🚦"], mood: "sun" },
  airport: { emoji: "✈️", stickers: ["🛂", "🧳", "🎫"], mood: "cool" },
  emergency: { emoji: "🚑", stickers: ["🏥", "🆘", "💊"], mood: "rose" },
  rent: { emoji: "🔑", stickers: ["🏠", "📄", "🛋️"], mood: "peach" },
  cinema: { emoji: "🎬", stickers: ["🍿", "🎟️", "🎥"], mood: "warm" },
  seasons: { emoji: "🍂", stickers: ["🌸", "❄️", "☀️"], mood: "mint" },
  lost: { emoji: "🧭", stickers: ["🧳", "📍", "❓"], mood: "cool" },
  travel: { emoji: "🌍", stickers: ["🗺️", "📸", "🧳"], mood: "sun" },
  city: { emoji: "🏙️", stickers: ["🚇", "🗺️", "🌉"], mood: "cool" },
  body: { emoji: "🩺", stickers: ["💪", "🦷", "🧠"], mood: "mint" },
  study: { emoji: "📖", stickers: ["✏️", "🧠", "💡"], mood: "sun" },
  complaints: { emoji: "📣", stickers: ["😤", "🛠️", "📋"], mood: "warm" },
  advice: { emoji: "💡", stickers: ["🤝", "📌", "💬"], mood: "peach" },
  plans: { emoji: "📅", stickers: ["✅", "🗺️", "⏰"], mood: "sun" },
  relationships: { emoji: "💞", stickers: ["😊", "💌", "🤝"], mood: "rose" },
  news: { emoji: "📰", stickers: ["📺", "🎤", "📡"], mood: "cool" },
  invitations: { emoji: "✉️", stickers: ["🎉", "📅", "🥂"], mood: "peach" },
  opinion: { emoji: "💭", stickers: ["👍", "👎", "💬"], mood: "warm" },
  work: { emoji: "💼", stickers: ["💻", "📊", "☕"], mood: "cool" },
  environment: { emoji: "🌱", stickers: ["♻️", "🌍", "🌳"], mood: "mint" },
  education: { emoji: "🎓", stickers: ["📚", "🏫", "✏️"], mood: "sun" },
};

const WORD_PICTURES: [RegExp, string][] = [
  [/xin chào|hello|你好|สวัสดี|chào hỏi|greet/i, "👋"],
  [/cảm ơn|thank|谢谢|ขอบคุณ/i, "🙏"],
  [/xin lỗi|sorry|对不起|ขอโทษ/i, "🙇"],
  [/tên|name|名字|ชื่อ/i, "🪪"],
  [/trà|tea|茶|ชา/i, "🍵"],
  [/cà phê|coffee|咖啡|กาแฟ/i, "☕"],
  [/nước|water|水|น้ำ(?!ตา)/i, "💧"],
  [/cơm|rice|饭|ข้าว/i, "🍚"],
  [/phở|noodle|面|ก๋วยเตี๋ยว|河粉/i, "🍜"],
  [/bánh|cake|包|ขนม/i, "🍰"],
  [/trái|fruit|水果|ผลไม้|cam|orange|橙/i, "🍊"],
  [/rau|vegetable|菜|ผัก/i, "🥬"],
  [/thịt|meat|肉|เนื้อ/i, "🍖"],
  [/cá|fish|鱼|ปลา/i, "🐟"],
  [/ngọt|sugar|糖|หวาน/i, "🍬"],
  [/cay|spicy|辣|เผ็ด/i, "🌶️"],
  [/đói|hungry|饿|หิว/i, "😋"],
  [/no|full|饱/i, "😌"],
  [/uống|drink|喝|ดื่ม/i, "🥤"],
  [/ăn|eat|吃|กิน/i, "🍽️"],
  [/bàn|table|桌|โต๊ะ/i, "🪑"],
  [/ly|cup|杯|แก้ว/i, "🥤"],
  [/tiền|money|钱|เงิน|giá|price|多少钱/i, "💵"],
  [/rẻ|cheap|便宜|ถูก/i, "🪙"],
  [/đắt|expensive|贵|แพง/i, "💎"],
  [/số|number|数字|ตัวเลข|một|hai|ba|one|two/i, "🔢"],
  [/giờ|time|点|เวลา|sáng|chiều|tối/i, "⏰"],
  [/hôm nay|today|今天|วันนี้/i, "📅"],
  [/nhà|home|家|บ้าน/i, "🏠"],
  [/cửa|door|门|ประตู/i, "🚪"],
  [/chìa|key|钥匙|กุญแจ/i, "🔑"],
  [/phòng|room|房间|ห้อง/i, "🛏️"],
  [/vệ sinh|toilet|卫生间|ห้องน้ำ/i, "🚻"],
  [/mẹ|mom|妈妈|แม่/i, "👩"],
  [/bố|dad|爸爸|พ่อ/i, "👨"],
  [/con|child|孩子|ลูก/i, "🧒"],
  [/bạn|friend|朋友|เพื่อน/i, "🤝"],
  [/áo|shirt|衣|เสื้อ/i, "👕"],
  [/quần|pants|裤|กางเกง/i, "👖"],
  [/giày|shoe|鞋|รองเท้า/i, "👟"],
  [/mưa|rain|雨|ฝน/i, "🌧️"],
  [/nắng|sun|晴|แดด/i, "☀️"],
  [/lạnh|cold|冷|หนาว/i, "🧥"],
  [/nóng|hot|热|ร้อน/i, "🥵"],
  [/vui|happy|高兴|ดีใจ/i, "😄"],
  [/buồn|sad|难过|เสียใจ/i, "😢"],
  [/mệt|tired|累|เหนื่อย/i, "😴"],
  [/đỏ|red|红|แดง/i, "🔴"],
  [/xanh|blue|green|蓝|绿|น้ำเงิน|เขียว/i, "🔵"],
  [/vàng|yellow|黄|เหลือง/i, "🟡"],
  [/đen|black|黑|ดำ/i, "⚫"],
  [/trắng|white|白|ขาว/i, "⚪"],
  [/chợ|market|市场|ตลาด/i, "🛒"],
  [/mua|buy|买|ซื้อ/i, "🛍️"],
  [/bán|sell|卖|ขาย/i, "🏪"],
  [/khách sạn|hotel|酒店|โรงแรม/i, "🏨"],
  [/máy bay|airport|飞机|机场|เครื่องบิน/i, "✈️"],
  [/taxi|出租|แท็กซี่/i, "🚕"],
  [/điện thoại|phone|电话|โทร/i, "📱"],
  [/chó|dog|狗|หมา/i, "🐶"],
  [/mèo|cat|猫|แมว/i, "🐱"],
  [/học|study|学|เรียน/i, "📖"],
  [/trường|school|学校|โรงเรียน/i, "🏫"],
  [/làm|work|工作|งาน/i, "💼"],
  [/chơi|play|玩|เล่น/i, "🎮"],
  [/bóng|ball|球|บอล/i, "⚽"],
  [/nhạc|music|音乐|เพลง/i, "🎵"],
  [/phim|movie|电影|หนัง/i, "🎬"],
  [/sách|book|书|หนังสือ/i, "📚"],
  [/nói|speak|说|พูด|chậm|slow|慢/i, "🗣️"],
  [/nghe|listen|听|ฟัง/i, "👂"],
  [/đọc|read|读|อ่าน/i, "📖"],
  [/viết|write|写|เขียน/i, "✍️"],
  [/miệng|mouth|嘴|ปาก/i, "👄"],
];

const FALLBACK = ["🌟", "🎯", "🌸", "🍀", "🎈", "🧩", "🌈", "⭐", "🧸", "🧁", "🌙", "☀️"];

function hash(value: string) {
  let h = 2166136261;
  for (const ch of value) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function unitArt(unitId: string): UnitArt {
  return UNIT_ART[unitId] || { emoji: "🌟", stickers: ["✨", "💬", "📘"], mood: "warm" };
}

export function pictureFor(text: string, unitId = "", extra = "") {
  const hay = `${text} ${extra}`.trim();
  for (const [pattern, emoji] of WORD_PICTURES) {
    if (pattern.test(hay)) return emoji;
  }
  const art = unitArt(unitId);
  if (hay && /[\u3400-\u9fff]/.test(hay) && hay.length <= 2) return art.emoji;
  return FALLBACK[hash(hay || unitId) % FALLBACK.length];
}

export function pictureForVocab(item: VocabItem, unitId: string) {
  return pictureFor(item.word, unitId, Object.values(item.meaning).join(" "));
}

export function pictureForSentence(item: Pick<SentenceItem, "text" | "meaning">, unitId: string) {
  return pictureFor(item.text, unitId, Object.values(item.meaning).join(" "));
}

export function pictureForOption(option: string, vocab: VocabItem[], unitId: string, locale: string) {
  const hit =
    vocab.find((item) => item.word.trim() === option.trim()) ||
    vocab.find((item) => Object.values(item.meaning).some((value) => value.trim() === option.trim())) ||
    vocab.find((item) => item.meaning[locale as keyof VocabItem["meaning"]]?.trim() === option.trim());
  if (hit) return pictureForVocab(hit, unitId);
  return pictureFor(option, unitId);
}
