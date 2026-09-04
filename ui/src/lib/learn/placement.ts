import type { I18nText } from "@/lib/learn/types";
import type { LearnTrack } from "@/lib/learn/types";

export type PlacementLevel = "new" | "a1" | "a2" | "b1";

export type PlacementChoice = {
  id: string;
  label: I18nText;
};

export type PlacementQuestion = {
  id: string;
  band: PlacementLevel;
  stem: string;
  choices: PlacementChoice[];
  answer: string;
};

function q(
  id: string,
  band: PlacementLevel,
  stem: string,
  answer: string,
  choices: [string, string, string, string, string][],
): PlacementQuestion {
  return {
    id,
    band,
    stem,
    answer,
    choices: choices.map(([cid, vi, en, zh, th]) => ({
      id: cid,
      label: { vi, en, zh, th },
    })),
  };
}

const ZH: PlacementQuestion[] = [
  q("zh1", "new", "你好", "a", [
    ["a", "Xin chào", "Hello", "你好", "สวัสดี"],
    ["b", "Tạm biệt", "Goodbye", "再见", "ลาก่อน"],
    ["c", "Cảm ơn", "Thank you", "谢谢", "ขอบคุณ"],
    ["d", "Xin lỗi", "Sorry", "对不起", "ขอโทษ"],
  ]),
  q("zh2", "new", "谢谢", "b", [
    ["a", "Xin chào", "Hello", "你好", "สวัสดี"],
    ["b", "Cảm ơn", "Thank you", "谢谢", "ขอบคุณ"],
    ["c", "Không sao", "It's okay", "没关系", "ไม่เป็นไร"],
    ["d", "Đúng rồi", "That's right", "对了", "ใช่แล้ว"],
  ]),
  q("zh3", "a1", "我是兰。", "c", [
    ["a", "Tôi đói.", "I am hungry.", "我饿了。", "ฉันหิว"],
    ["b", "Tôi ở nhà.", "I am at home.", "我在家。", "ฉันอยู่บ้าน"],
    ["c", "Tôi là Lan.", "I am Lan.", "我是兰。", "ฉันคือหลาน"],
    ["d", "Tôi muốn trà.", "I want tea.", "我想喝茶。", "ฉันอยากดื่มชา"],
  ]),
  q("zh4", "a1", "多少钱？", "a", [
    ["a", "Bao nhiêu tiền?", "How much is it?", "多少钱？", "เท่าไหร่"],
    ["b", "Mấy giờ?", "What time is it?", "几点？", "กี่โมง"],
    ["c", "Ở đâu?", "Where is it?", "在哪里？", "อยู่ที่ไหน"],
    ["d", "Tên gì?", "What's the name?", "叫什么？", "ชื่ออะไร"],
  ]),
  q("zh5", "a1", "请给我一杯茶。", "d", [
    ["a", "Cho mình hai cái.", "Please give me two.", "请给我两个。", "ขอสองอัน"],
    ["b", "Tôi không uống cà phê.", "I don't drink coffee.", "我不喝咖啡。", "ฉันไม่ดื่มกาแฟ"],
    ["c", "Có bàn không?", "Is there a table?", "有桌子吗？", "มีโต๊ะไหม"],
    ["d", "Cho mình một ly trà.", "Please give me a cup of tea.", "请给我一杯茶。", "ขอชาหนึ่งแก้ว"],
  ]),
  q("zh6", "a1", "现在几点？", "b", [
    ["a", "Hôm nay thứ mấy?", "What day is it today?", "今天星期几？", "วันนี้วันอะไร"],
    ["b", "Bây giờ mấy giờ?", "What time is it now?", "现在几点？", "ตอนนี้กี่โมง"],
    ["c", "Bạn bao nhiêu tuổi?", "How old are you?", "你多大？", "คุณอายุเท่าไหร่"],
    ["d", "Bao lâu nữa?", "How much longer?", "还要多久？", "อีกนานไหม"],
  ]),
  q("zh7", "a2", "我在吃饭。", "c", [
    ["a", "Tôi đã ăn rồi.", "I already ate.", "我吃了。", "ฉันกินแล้ว"],
    ["b", "Tôi muốn đi chợ.", "I want to go to the market.", "我想去市场。", "ฉันอยากไปตลาด"],
    ["c", "Tôi đang ăn cơm.", "I am eating.", "我在吃饭。", "ฉันกำลังกินข้าว"],
    ["d", "Tôi không ăn cay.", "I don't eat spicy food.", "我不吃辣。", "ฉันไม่กินเผ็ด"],
  ]),
  q("zh8", "a2", "明天我要去市场。", "a", [
    ["a", "Ngày mai tôi sẽ đi chợ.", "Tomorrow I will go to the market.", "明天我要去市场。", "พรุ่งนี้ฉันจะไปตลาด"],
    ["b", "Hôm qua tôi đã đi chợ.", "Yesterday I went to the market.", "昨天我去了市场。", "เมื่อวานฉันไปตลาด"],
    ["c", "Tôi đang ở chợ.", "I am at the market.", "我在市场。", "ฉันอยู่ที่ตลาด"],
    ["d", "Chợ đóng cửa rồi.", "The market is closed.", "市场关门了。", "ตลาดปิดแล้ว"],
  ]),
  q("zh9", "a2", "能便宜一点吗？", "d", [
    ["a", "Còn hàng không?", "Do you still have it?", "还有吗？", "ยังมีไหม"],
    ["b", "Bán theo cân.", "Sold by the kilo.", "按公斤卖。", "ขายเป็นกิโล"],
    ["c", "Hết hàng rồi.", "It's sold out.", "卖完了。", "หมดแล้ว"],
    ["d", "Bớt được một chút không?", "Can it be a bit cheaper?", "能便宜一点吗？", "ลดได้อีกหน่อยไหม"],
  ]),
  q("zh10", "b1", "我觉得这个方案比较合适。", "b", [
    ["a", "Tôi không hiểu câu này.", "I don't understand this sentence.", "我不懂这句话。", "ฉันไม่เข้าใจประโยคนี้"],
    ["b", "Tôi thấy phương án này hợp hơn.", "I think this plan is more suitable.", "我觉得这个方案比较合适。", "ฉันว่าแผนนี้เหมาะกว่า"],
    ["c", "Hãy gửi báo cáo cho tôi.", "Please send me the report.", "请把报告发给我。", "กรุณาส่งรายงานให้ฉัน"],
    ["d", "Chúng ta hẹn tuần sau.", "Let's meet next week.", "我们下周见。", "เราเจอกันสัปดาห์หน้า"],
  ]),
  q("zh11", "b1", "虽然有点贵，但是质量很好。", "c", [
    ["a", "Rẻ quá nên tôi mua hai cái.", "It's so cheap that I bought two.", "太便宜了，所以我买了两个。", "ถูกมากเลยซื้อสองชิ้น"],
    ["b", "Đắt quá, tôi không mua.", "Too expensive, I won't buy it.", "太贵了，我不买。", "แพงไป ฉันไม่ซื้อ"],
    ["c", "Tuy hơi đắt nhưng chất lượng rất tốt.", "Although a bit expensive, the quality is very good.", "虽然有点贵，但是质量很好。", "แม้จะแพงไปนิด แต่คุณภาพดีมาก"],
    ["d", "Giá này là giá cuối.", "This is the final price.", "这是最低价。", "นี่คือราคาต่ำสุด"],
  ]),
  q("zh12", "b1", "你方便的时候把文件发我，好吗？", "a", [
    ["a", "Khi nào tiện thì gửi file cho mình, được không?", "Could you send me the file when it's convenient?", "你方便的时候把文件发我，好吗？", "สะดวกเมื่อไหร่ส่งไฟล์ให้ฉันได้ไหม"],
    ["b", "Bạn đang làm gì vậy?", "What are you doing?", "你在做什么？", "คุณกำลังทำอะไร"],
    ["c", "Mai mình nghỉ làm.", "I am off work tomorrow.", "明天我休息。", "พรุ่งนี้ฉันหยุดงาน"],
    ["d", "Cuộc họp đã hủy.", "The meeting was cancelled.", "会议取消了。", "การประชุมถูกยกเลิก"],
  ]),
];

const EN: PlacementQuestion[] = [
  q("en1", "new", "Hello", "a", [
    ["a", "Xin chào", "Hello", "你好", "สวัสดี"],
    ["b", "Tạm biệt", "Goodbye", "再见", "ลาก่อน"],
    ["c", "Cảm ơn", "Thank you", "谢谢", "ขอบคุณ"],
    ["d", "Xin lỗi", "Sorry", "对不起", "ขอโทษ"],
  ]),
  q("en2", "new", "Thank you", "c", [
    ["a", "Làm ơn", "Please", "请", "ได้โปรด"],
    ["b", "Không sao", "No problem", "没关系", "ไม่เป็นไร"],
    ["c", "Cảm ơn", "Thank you", "谢谢", "ขอบคุณ"],
    ["d", "Được thôi", "All right", "好吧", "ได้เลย"],
  ]),
  q("en3", "a1", "My name is Lan.", "b", [
    ["a", "Tôi sống ở đây.", "I live here.", "我住在这里。", "ฉันอาศัยที่นี่"],
    ["b", "Tên tôi là Lan.", "My name is Lan.", "我叫兰。", "ฉันชื่อหลาน"],
    ["c", "Tôi khỏe.", "I am fine.", "我很好。", "ฉันสบายดี"],
    ["d", "Tôi muốn nước.", "I want water.", "我想喝水。", "ฉันอยากได้น้ำ"],
  ]),
  q("en4", "a1", "How much is this?", "d", [
    ["a", "Cái này màu gì?", "What color is this?", "这是什么颜色？", "นี่สีอะไร"],
    ["b", "Cái này của ai?", "Whose is this?", "这是谁的？", "นี่ของใคร"],
    ["c", "Cái này dùng sao?", "How do I use this?", "这个怎么用？", "อันนี้ใช้ยังไง"],
    ["d", "Cái này bao nhiêu tiền?", "How much is this?", "这个多少钱？", "อันนี้เท่าไหร่"],
  ]),
  q("en5", "a1", "Can I have a cup of tea?", "a", [
    ["a", "Cho mình một ly trà được không?", "Can I have a cup of tea?", "可以给我一杯茶吗？", "ขอชาหนึ่งแก้วได้ไหม"],
    ["b", "Bàn này còn trống không?", "Is this table free?", "这张桌子空着吗？", "โต๊ะนี้ว่างไหม"],
    ["c", "Bill giúp mình.", "The bill, please.", "请结账。", "เก็บเงินด้วย"],
    ["d", "Không đường.", "No sugar.", "不要糖。", "ไม่ใส่น้ำตาล"],
  ]),
  q("en6", "a1", "What time is it now?", "c", [
    ["a", "Hôm nay ngày mấy?", "What's the date today?", "今天几号？", "วันนี้วันที่เท่าไหร่"],
    ["b", "Bạn rảnh không?", "Are you free?", "你有空吗？", "คุณว่างไหม"],
    ["c", "Bây giờ là mấy giờ?", "What time is it now?", "现在几点？", "ตอนนี้กี่โมง"],
    ["d", "Mấy giờ mở cửa?", "What time does it open?", "几点开门？", "กี่โมงเปิด"],
  ]),
  q("en7", "a2", "I am eating lunch.", "b", [
    ["a", "Tôi đã ăn trưa rồi.", "I already had lunch.", "我吃过午饭了。", "ฉันกินข้าวกลางวันแล้ว"],
    ["b", "Tôi đang ăn trưa.", "I am eating lunch.", "我在吃午饭。", "ฉันกำลังกินข้าวกลางวัน"],
    ["c", "Tôi muốn đặt bàn.", "I want to book a table.", "我想订位。", "ฉันอยากจองโต๊ะ"],
    ["d", "Tôi không ăn thịt.", "I don't eat meat.", "我不吃肉。", "ฉันไม่กินเนื้อ"],
  ]),
  q("en8", "a2", "I will go to the market tomorrow.", "a", [
    ["a", "Ngày mai tôi sẽ đi chợ.", "I will go to the market tomorrow.", "明天我要去市场。", "พรุ่งนี้ฉันจะไปตลาด"],
    ["b", "Tôi vừa ở chợ về.", "I just came back from the market.", "我刚从市场回来。", "ฉันเพิ่งกลับจากตลาด"],
    ["c", "Chợ ở gần đây.", "The market is nearby.", "市场就在附近。", "ตลาดอยู่ใกล้ๆ"],
    ["d", "Hôm nay chợ đông.", "The market is crowded today.", "今天市场很挤。", "วันนี้ตลาดคนเยอะ"],
  ]),
  q("en9", "a2", "Could you make it a little cheaper?", "d", [
    ["a", "Còn size khác không?", "Do you have another size?", "还有别的尺码吗？", "มีไซส์อื่นไหม"],
    ["b", "Tôi chỉ xem thôi.", "I'm just looking.", "我只是看看。", "ฉันดูเฉยๆ"],
    ["c", "Gói giúp mình.", "Please wrap it for me.", "请帮我包一下。", "ห่อให้หน่อย"],
    ["d", "Bớt được một chút không?", "Could you make it a little cheaper?", "能便宜一点吗？", "ลดได้อีกหน่อยไหม"],
  ]),
  q("en10", "b1", "I think this option works better for us.", "c", [
    ["a", "Tôi chưa quyết định.", "I haven't decided yet.", "我还没决定。", "ฉันยังไม่ได้ตัดสินใจ"],
    ["b", "Cứ làm như cũ.", "Just do it the old way.", "还是按老办法做。", "ทำแบบเดิมก็ได้"],
    ["c", "Tôi nghĩ phương án này hợp với chúng ta hơn.", "I think this option works better for us.", "我觉得这个方案更适合我们。", "ฉันว่าทางเลือกนี้เหมาะกับเรากว่า"],
    ["d", "Bạn quyết định giúp.", "You decide for me.", "你来决定吧。", "คุณตัดสินใจให้เลย"],
  ]),
  q("en11", "b1", "It's a bit expensive, but the quality is worth it.", "b", [
    ["a", "Rẻ nhưng dễ hỏng.", "Cheap but it breaks easily.", "便宜但容易坏。", "ถูกแต่เสียง่าย"],
    ["b", "Hơi đắt nhưng chất lượng đáng tiền.", "It's a bit expensive, but the quality is worth it.", "有点贵，但质量值这个价。", "แพงไปนิด แต่คุณภาพคุ้ม"],
    ["c", "Tôi chờ giảm giá.", "I'll wait for a discount.", "我等打折。", "ฉันรอส่วนลด"],
    ["d", "Không cần chất lượng.", "Quality doesn't matter.", "质量无所谓。", "คุณภาพไม่สำคัญ"],
  ]),
  q("en12", "b1", "Please send the file when you have a moment.", "a", [
    ["a", "Khi nào rảnh thì gửi file giúp mình.", "Please send the file when you have a moment.", "你有空时请把文件发给我。", "ว่างเมื่อไหร่ช่วยส่งไฟล์ให้ฉัน"],
    ["b", "In giúp mình hai bản.", "Please print two copies.", "请打印两份。", "พิมพ์ให้สองชุด"],
    ["c", "Cuộc họp bắt đầu rồi.", "The meeting has started.", "会议已经开始了。", "การประชุมเริ่มแล้ว"],
    ["d", "Tôi đang bận họp.", "I am in a meeting.", "我在开会。", "ฉันกำลังประชุม"],
  ]),
];

const VI: PlacementQuestion[] = [
  q("vi1", "new", "Xin chào", "a", [
    ["a", "Hello", "Hello", "你好", "สวัสดี"],
    ["b", "Goodbye", "Goodbye", "再见", "ลาก่อน"],
    ["c", "Thanks", "Thanks", "谢谢", "ขอบคุณ"],
    ["d", "Sorry", "Sorry", "对不起", "ขอโทษ"],
  ]),
  q("vi2", "new", "Cảm ơn", "c", [
    ["a", "Please", "Please", "请", "ได้โปรด"],
    ["b", "Yes", "Yes", "是", "ใช่"],
    ["c", "Thank you", "Thank you", "谢谢", "ขอบคุณ"],
    ["d", "No", "No", "不", "ไม่"],
  ]),
  q("vi3", "a1", "Tôi là Lan.", "b", [
    ["a", "I am hungry.", "I am hungry.", "我饿了。", "ฉันหิว"],
    ["b", "I am Lan.", "I am Lan.", "我是兰。", "ฉันคือหลาน"],
    ["c", "I live here.", "I live here.", "我住这里。", "ฉันอยู่ที่นี่"],
    ["d", "I want tea.", "I want tea.", "我想喝茶。", "ฉันอยากดื่มชา"],
  ]),
  q("vi4", "a1", "Cái này bao nhiêu tiền?", "d", [
    ["a", "Where is this?", "Where is this?", "这在哪里？", "นี่อยู่ที่ไหน"],
    ["b", "What time is it?", "What time is it?", "几点了？", "กี่โมงแล้ว"],
    ["c", "Who is this?", "Who is this?", "这是谁？", "นี่ใคร"],
    ["d", "How much is this?", "How much is this?", "这个多少钱？", "อันนี้เท่าไหร่"],
  ]),
  q("vi5", "a1", "Cho mình một ly trà.", "a", [
    ["a", "Please give me a cup of tea.", "Please give me a cup of tea.", "请给我一杯茶。", "ขอชาหนึ่งแก้ว"],
    ["b", "I don't drink coffee.", "I don't drink coffee.", "我不喝咖啡。", "ฉันไม่ดื่มกาแฟ"],
    ["c", "A table for two.", "A table for two.", "两个人的桌子。", "โต๊ะสำหรับสองคน"],
    ["d", "No ice, please.", "No ice, please.", "不要冰。", "ไม่ใส่น้ำแข็ง"],
  ]),
  q("vi6", "a1", "Bây giờ là mấy giờ?", "c", [
    ["a", "What day is it?", "What day is it?", "今天星期几？", "วันนี้วันอะไร"],
    ["b", "How old are you?", "How old are you?", "你多大？", "คุณอายุเท่าไหร่"],
    ["c", "What time is it now?", "What time is it now?", "现在几点？", "ตอนนี้กี่โมง"],
    ["d", "When does it close?", "When does it close?", "几点关门？", "กี่โมงปิด"],
  ]),
  q("vi7", "a2", "Tôi đang ăn cơm.", "b", [
    ["a", "I already ate.", "I already ate.", "我吃过了。", "ฉันกินแล้ว"],
    ["b", "I am eating.", "I am eating.", "我在吃饭。", "ฉันกำลังกินข้าว"],
    ["c", "I am cooking.", "I am cooking.", "我在做饭。", "ฉันกำลังทำอาหาร"],
    ["d", "I am not hungry.", "I am not hungry.", "我不饿。", "ฉันไม่หิว"],
  ]),
  q("vi8", "a2", "Ngày mai tôi sẽ đi chợ.", "a", [
    ["a", "I will go to the market tomorrow.", "I will go to the market tomorrow.", "明天我要去市场。", "พรุ่งนี้ฉันจะไปตลาด"],
    ["b", "I went yesterday.", "I went yesterday.", "我昨天去了。", "เมื่อวานฉันไปแล้ว"],
    ["c", "The market is far.", "The market is far.", "市场很远。", "ตลาดไกล"],
    ["d", "I am at the market.", "I am at the market.", "我在市场。", "ฉันอยู่ที่ตลาด"],
  ]),
  q("vi9", "a2", "Bớt được một chút không?", "d", [
    ["a", "Is there a discount later?", "Is there a discount later?", "待会会打折吗？", "เดี๋ยวจะลดไหม"],
    ["b", "I'll take two.", "I'll take two.", "我要两个。", "ฉันเอาสองอัน"],
    ["c", "That's too small.", "That's too small.", "太小了。", "เล็กไป"],
    ["d", "Can it be a bit cheaper?", "Can it be a bit cheaper?", "能便宜一点吗？", "ลดได้อีกหน่อยไหม"],
  ]),
  q("vi10", "b1", "Tôi thấy phương án này hợp hơn.", "c", [
    ["a", "I disagree completely.", "I disagree completely.", "我完全不同意。", "ฉันไม่เห็นด้วยเลย"],
    ["b", "Let's postpone it.", "Let's postpone it.", "我们延期吧。", "เลื่อนออกไปก่อน"],
    ["c", "I think this option is more suitable.", "I think this option is more suitable.", "我觉得这个方案更合适。", "ฉันว่าทางเลือกนี้เหมาะกว่า"],
    ["d", "I need more time.", "I need more time.", "我需要更多时间。", "ฉันต้องการเวลาเพิ่ม"],
  ]),
  q("vi11", "b1", "Tuy hơi đắt nhưng chất lượng tốt.", "b", [
    ["a", "It's cheap and low quality.", "It's cheap and low quality.", "又便宜质量又差。", "ถูกแต่คุณภาพแย่"],
    ["b", "It's a bit expensive but the quality is good.", "It's a bit expensive but the quality is good.", "虽然有点贵但质量很好。", "แม้จะแพงไปนิดแต่คุณภาพดี"],
    ["c", "I want a refund.", "I want a refund.", "我想退款。", "ฉันอยากได้เงินคืน"],
    ["d", "The price is final.", "The price is final.", "价格不能再谈。", "ราคาต่อไม่ได้แล้ว"],
  ]),
  q("vi12", "b1", "Khi nào tiện thì gửi file cho mình.", "a", [
    ["a", "Please send me the file when you can.", "Please send me the file when you can.", "你方便时把文件发给我。", "สะดวกเมื่อไหร่ส่งไฟล์ให้ฉัน"],
    ["b", "Call me after the meeting.", "Call me after the meeting.", "开完会给我打电话。", "ประชุมเสร็จแล้วโทรหาฉัน"],
    ["c", "I already sent it.", "I already sent it.", "我已经发了。", "ฉันส่งไปแล้ว"],
    ["d", "Don't send anything.", "Don't send anything.", "什么都别发。", "ไม่ต้องส่งอะไร"],
  ]),
];

const TH: PlacementQuestion[] = [
  q("th1", "new", "สวัสดี", "a", [
    ["a", "Xin chào", "Hello", "你好", "สวัสดี"],
    ["b", "Tạm biệt", "Goodbye", "再见", "ลาก่อน"],
    ["c", "Cảm ơn", "Thank you", "谢谢", "ขอบคุณ"],
    ["d", "Xin lỗi", "Sorry", "对不起", "ขอโทษ"],
  ]),
  q("th2", "new", "ขอบคุณ", "c", [
    ["a", "Làm ơn", "Please", "请", "ได้โปรด"],
    ["b", "Không sao", "It's okay", "没关系", "ไม่เป็นไร"],
    ["c", "Cảm ơn", "Thank you", "谢谢", "ขอบคุณ"],
    ["d", "Vâng", "Yes", "是", "ค่ะ/ครับ"],
  ]),
  q("th3", "a1", "ฉันชื่อหลาน", "b", [
    ["a", "Tôi đói.", "I am hungry.", "我饿了。", "ฉันหิว"],
    ["b", "Tôi tên là Lan.", "My name is Lan.", "我叫兰。", "ฉันชื่อหลาน"],
    ["c", "Tôi ở nhà.", "I am at home.", "我在家。", "ฉันอยู่บ้าน"],
    ["d", "Tôi muốn nước.", "I want water.", "我想喝水。", "ฉันอยากได้น้ำ"],
  ]),
  q("th4", "a1", "เท่าไหร่", "d", [
    ["a", "Ở đâu?", "Where?", "在哪里？", "ที่ไหน"],
    ["b", "Mấy giờ?", "What time?", "几点？", "กี่โมง"],
    ["c", "Cái gì?", "What?", "什么？", "อะไร"],
    ["d", "Bao nhiêu tiền?", "How much?", "多少钱？", "เท่าไหร่"],
  ]),
  q("th5", "a1", "ขอชาหนึ่งแก้ว", "a", [
    ["a", "Cho mình một ly trà.", "A cup of tea, please.", "请给我一杯茶。", "ขอชาหนึ่งแก้ว"],
    ["b", "Không đường.", "No sugar.", "不要糖。", "ไม่ใส่น้ำตาล"],
    ["c", "Thêm đá.", "More ice.", "多加冰。", "เพิ่มน้ำแข็ง"],
    ["d", "Tính tiền.", "The bill.", "结账。", "เก็บเงิน"],
  ]),
  q("th6", "a1", "ตอนนี้กี่โมง", "c", [
    ["a", "Hôm nay ngày mấy?", "What's the date?", "今天几号？", "วันนี้วันที่เท่าไหร่"],
    ["b", "Bạn rảnh không?", "Are you free?", "你有空吗？", "คุณว่างไหม"],
    ["c", "Bây giờ mấy giờ?", "What time is it now?", "现在几点？", "ตอนนี้กี่โมง"],
    ["d", "Mở cửa lúc mấy giờ?", "What time does it open?", "几点开门？", "กี่โมงเปิด"],
  ]),
  q("th7", "a2", "ฉันกำลังกินข้าว", "b", [
    ["a", "Tôi đã ăn rồi.", "I already ate.", "我吃过了。", "ฉันกินแล้ว"],
    ["b", "Tôi đang ăn cơm.", "I am eating.", "我在吃饭。", "ฉันกำลังกินข้าว"],
    ["c", "Tôi muốn đặt món.", "I want to order.", "我想点菜。", "ฉันอยากสั่งอาหาร"],
    ["d", "Không cay.", "Not spicy.", "不要辣。", "ไม่เผ็ด"],
  ]),
  q("th8", "a2", "พรุ่งนี้ฉันจะไปตลาด", "a", [
    ["a", "Ngày mai tôi sẽ đi chợ.", "Tomorrow I will go to the market.", "明天我要去市场。", "พรุ่งนี้ฉันจะไปตลาด"],
    ["b", "Hôm qua tôi đi chợ.", "Yesterday I went to the market.", "昨天我去了市场。", "เมื่อวานฉันไปตลาด"],
    ["c", "Chợ đóng rồi.", "The market is closed.", "市场关门了。", "ตลาดปิดแล้ว"],
    ["d", "Tôi đang ở chợ.", "I am at the market.", "我在市场。", "ฉันอยู่ที่ตลาด"],
  ]),
  q("th9", "a2", "ลดได้อีกหน่อยไหม", "d", [
    ["a", "Còn hàng không?", "Do you still have it?", "还有吗？", "ยังมีไหม"],
    ["b", "Tôi chỉ xem.", "I'm just looking.", "我只是看看。", "ฉันดูเฉยๆ"],
    ["c", "Gói giúp.", "Please wrap it.", "请帮我包。", "ห่อให้หน่อย"],
    ["d", "Bớt được chút không?", "Can you make it cheaper?", "能便宜一点吗？", "ลดได้อีกหน่อยไหม"],
  ]),
  q("th10", "b1", "ฉันว่าแผนนี้เหมาะกว่า", "c", [
    ["a", "Tôi chưa hiểu.", "I don't understand yet.", "我还不懂。", "ฉันยังไม่เข้าใจ"],
    ["b", "Làm như cũ đi.", "Do it the old way.", "按老办法做。", "ทำแบบเดิม"],
    ["c", "Tôi thấy kế hoạch này hợp hơn.", "I think this plan is more suitable.", "我觉得这个计划更合适。", "ฉันว่าแผนนี้เหมาะกว่า"],
    ["d", "Để mai tính.", "Let's think tomorrow.", "明天再说。", "ไว้พรุ่งนี้ค่อยคิด"],
  ]),
  q("th11", "b1", "แม้จะแพงไปนิด แต่คุณภาพดีมาก", "b", [
    ["a", "Rẻ nhưng kém.", "Cheap but poor quality.", "便宜但质量差。", "ถูกแต่คุณภาพแย่"],
    ["b", "Hơi đắt nhưng chất lượng rất tốt.", "A bit expensive but the quality is very good.", "虽然有点贵但质量很好。", "แม้จะแพงไปนิด แต่คุณภาพดีมาก"],
    ["c", "Tôi không mua.", "I won't buy it.", "我不买。", "ฉันไม่ซื้อ"],
    ["d", "Giá cuối rồi.", "That's the last price.", "这是最低价。", "ราคาเท่านี้แล้ว"],
  ]),
  q("th12", "b1", "สะดวกเมื่อไหร่ส่งไฟล์ให้ฉันได้ไหม", "a", [
    ["a", "Khi nào tiện thì gửi file cho mình được không?", "Could you send me the file when convenient?", "方便时把文件发给我好吗？", "สะดวกเมื่อไหร่ส่งไฟล์ให้ฉันได้ไหม"],
    ["b", "Gọi cho tôi sau.", "Call me later.", "待会给我打电话。", "โทรหาฉันทีหลัง"],
    ["c", "Tôi đã nhận rồi.", "I already got it.", "我已经收到了。", "ฉันได้รับแล้ว"],
    ["d", "In ra giúp.", "Please print it.", "请打印出来。", "พิมพ์ออกมาให้หน่อย"],
  ]),
];

const BANK: Record<LearnTrack, PlacementQuestion[]> = { zh: ZH, en: EN, vi: VI, th: TH };

export function placementQuestions(track: LearnTrack) {
  return BANK[track] || BANK.zh;
}

export function scorePlacement(track: LearnTrack, answers: Record<string, string>) {
  const questions = placementQuestions(track);
  let score = 0;
  for (const item of questions) {
    if (answers[item.id] === item.answer) score += 1;
  }
  const total = questions.length;
  const level: PlacementLevel = score >= 10 ? "b1" : score >= 7 ? "a2" : score >= 4 ? "a1" : "new";
  return { score, total, level };
}

export function startUnitForLevel(units: { id: string; level: string }[], level: PlacementLevel) {
  if (level === "new") return units[0]?.id;
  if (level === "a1") return units.find((item) => item.level === "A1" && item.id !== "sounds")?.id || units[0]?.id;
  if (level === "a2") return units.find((item) => item.level === "A2")?.id || units[0]?.id;
  return units.find((item) => item.level === "B1")?.id || units.find((item) => item.level === "A2")?.id || units[0]?.id;
}

export function catalogLevelFor(level: PlacementLevel) {
  if (level === "b1") return "B1";
  if (level === "a2") return "A2";
  if (level === "a1") return "A1";
  return "A1";
}
