import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { UNITS } from "./learn-bank-a.mjs";
import { UNITS_B, UNITS_EN_B2 } from "./learn-bank-b.mjs";
import { UNITS_C } from "./learn-bank-c.mjs";
import { UNITS_C2 } from "./learn-bank-c2.mjs";
import { UNITS_D } from "./learn-bank-d.mjs";
import { UNITS_E } from "./learn-bank-e.mjs";
import { theoryFor } from "./learn-theory.mjs";
import { sayViOf } from "./learn-say-vi.mjs";
import { SOUNDS_UNIT } from "./learn-sounds.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../src/content/learn");

const TRACKS = ["vi", "en", "zh", "th"];
const LANG_LABEL = { vi: "vi-VN", en: "en-GB", zh: "zh-CN", th: "th-TH" };

function loadEnvLocal() {
  const file = join(__dirname, "../.env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function hashSeed(value) {
  let h = 2166136261;
  for (const ch of value) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

function seededShuffle(items, seed) {
  const copy = [...items];
  let s = hashSeed(String(seed));
  for (let i = copy.length - 1; i > 0; i -= 1) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const THAI_BASE = [
  "ฉัน", "คุณ", "เขา", "เธอ", "เรา", "ของ", "นี้", "นั่น", "โน่น", "ไม่", "ไหม", "ได้", "แล้ว", "จะ", "กำลัง",
  "อยู่", "ไป", "มา", "กิน", "ขอ", "คือ", "เป็น", "และ", "กับ", "ใน", "ที่", "วัน", "ยัง", "มี", "ครับ", "ค่ะ",
  "หน่อย", "หนึ่ง", "สอง", "สาม", "คน", "แก้ว", "ตัว", "ไหน", "อะไร", "เมื่อไหร่", "เท่าไหร่", "ทำไม", "อย่างไร",
  "วันนี้", "พรุ่งนี้", "เมื่อวาน", "บ้าน", "แม่", "พ่อ", "ไหม", "ด้วย", "แล้ว", "ก็", "ให้", "ว่า", "หรือ",
  "สวัสดี", "ขอบคุณ", "ขอโทษ", "ได้ไหม", "อีก", "มาก", "น้อย", "แล้ว", "ก่อน", "หลัง", "ตอน", "โมง",
];

function thaiSegment(text, dict) {
  const words = [...new Set(dict.filter(Boolean))].sort((a, b) => b.length - a.length);
  const out = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === " ") {
      i += 1;
      continue;
    }
    let hit = "";
    for (const word of words) {
      if (word.length > 1 && text.startsWith(word, i)) {
        hit = word;
        break;
      }
    }
    if (hit) {
      out.push(hit);
      i += hit.length;
    } else {
      let j = i + 1;
      while (j < text.length && text[j] !== " " && !words.some((word) => word.length > 1 && text.startsWith(word, j))) {
        j += 1;
      }
      out.push(text.slice(i, j));
      i = j;
    }
  }
  return out.filter(Boolean);
}

function tokenize(track, text, dict = []) {
  const cleaned = text.replace(/[.,!?¿¡。？！，、]/g, "").trim();
  if (track === "zh") return Array.from(cleaned).filter((ch) => ch.trim());
  const spaced = cleaned.split(/\s+/).filter(Boolean);
  if (track !== "th") return spaced;
  if (spaced.length >= 3) return spaced;
  const segs = thaiSegment(cleaned, [...THAI_BASE, ...dict]);
  return segs.length >= 2 ? segs : spaced;
}

function wordOf(row, track) {
  return row[track];
}

function readingOf(row, track) {
  if (track === "zh") return row.py || "";
  if (track === "th") return row.rt || "";
  return "";
}

function meaningOf(row) {
  return { vi: row.vi, en: row.en, zh: row.zh, th: row.th };
}

function sentenceText(row, track) {
  return row[track];
}

function sentenceReading(row, track) {
  if (track === "zh") return row.py || "";
  if (track === "th") return row.rt || "";
  return "";
}

function pick(arr, n, except, seed) {
  const pool = arr.filter((item) => item && item !== except);
  return seededShuffle(pool, seed).slice(0, n);
}

function makeMcq(id, prompt, answer, distractors, promptKey, promptI18n) {
  const options = seededShuffle([answer, ...distractors].filter(Boolean).slice(0, 4), id);
  const exercise = { id, type: "mcq", prompt, options, answer };
  if (promptKey) exercise.promptKey = promptKey;
  if (promptI18n) exercise.promptI18n = promptI18n;
  return exercise;
}

function joinLine(track, tokens) {
  return tokens.join(track === "zh" ? "" : " ");
}

function vocabDict(unit, track) {
  if (track !== "th") return [];
  const words = [];
  for (const row of unit.vocab || []) {
    if (row.th) words.push(row.th);
  }
  return words;
}

function blankFrame(track, text, dict) {
  const tokens = tokenize(track, text, dict);
  if (tokens.length < 2) return text;
  const blankIndex = tokens.length === 2 ? 1 : Math.min(1, tokens.length - 1);
  return joinLine(
    track,
    tokens.map((tok, index) => (index === blankIndex ? "____" : tok)),
  );
}

function buildTheory(unit, track, sentences, vocab, kind) {
  const dict = vocabDict(unit, track);
  const base = theoryFor(unit.id, unit.level, track);
  const seen = new Set(base.patterns.map((item) => item.example));
  const fromSentences = sentences
    .filter(Boolean)
    .map((row) => {
      const example = sentenceText(row, track);
      return {
        form: blankFrame(track, example, dict).replace("____", "+"),
        use: unit.goal[track],
        example,
        note: base.tip,
      };
    })
    .filter((item) => item.example && !seen.has(item.example));
  const isTeach = kind === "teach";
  const patterns = isTeach ? [...base.patterns.slice(0, 6), ...fromSentences.slice(0, 3)] : base.patterns.slice(0, 3);
  const applyFromSentences = sentences.filter(Boolean).map((row) => ({
    prompt: base.applyPrompt,
    frame: blankFrame(track, sentenceText(row, track), dict),
    sample: sentenceText(row, track),
  }));
  const applyMap = new Map();
  for (const item of [...base.apply, ...applyFromSentences]) {
    if (item.sample && !applyMap.has(item.sample)) applyMap.set(item.sample, item);
  }
  const tableTitle = {
    vi: "Bảng thay từ — giữ khung, đổi một chỗ",
    en: "Swap table — keep the frame, change one slot",
    zh: "替换表 — 保留句型，只换一处",
    th: "ตารางสลับคำ — คงโครง เปลี่ยนที่เดียว",
  };
  return {
    ...base,
    points: isTeach ? base.points.slice(0, 8) : base.points.slice(0, 3),
    patterns,
    contrasts: isTeach ? base.contrasts : [],
    mistakes: isTeach ? base.mistakes : [],
    apply: [...applyMap.values()].slice(0, isTeach ? 6 : 2),
    examples: [...new Set([...(isTeach ? base.examples || [] : []), ...sentences.map((row) => sentenceText(row, track))])].filter(Boolean).slice(0, isTeach ? 8 : 4),
    table: {
      title: tableTitle[track],
      rows: (vocab || unit.vocab).slice(0, isTeach ? 10 : 6).map((row) => {
        const word = wordOf(row, track);
        const sample = usageOf(row, track, unit.sentences) || word;
        return `${word} → ${sample}`;
      }),
    },
  };
}

function usageOf(row, track, sentences) {
  const word = wordOf(row, track);
  if (!word) return "";
  const hit = sentences.find((item) => {
    const text = sentenceText(item, track);
    return text.includes(word) || text.toLocaleLowerCase().includes(word.toLocaleLowerCase());
  });
  return hit ? sentenceText(hit, track) : "";
}

function makeGaps(idPrefix, track, sentences, limit, dict) {
  const exercises = [];
  sentences.forEach((row, index) => {
    const text = sentenceText(row, track);
    const tokens = tokenize(track, text, dict);
    if (tokens.length < 2) return;
    const positions = [Math.min(1, tokens.length - 1)];
    if (tokens.length >= 4) positions.push(tokens.length - 1);
    if (tokens.length >= 5) positions.push(0);
    [...new Set(positions)].forEach((blankIndex, slot) => {
      if (exercises.length >= limit) return;
      const blank = tokens[blankIndex];
      const shown = tokens.map((tok, i) => (i === blankIndex ? "____" : tok));
      exercises.push({
        id: `${idPrefix}-gap-${index}-${slot}`,
        type: "gap",
        prompt: joinLine(track, shown),
        answer: blank,
      });
    });
  });
  return exercises;
}

function makeOrders(idPrefix, track, sentences, limit, dict) {
  const exercises = [];
  sentences.forEach((row, index) => {
    if (exercises.length >= limit) return;
    const text = sentenceText(row, track);
    const tokens = tokenize(track, text, dict);
    if (tokens.length < 2) return;
    exercises.push({
      id: `${idPrefix}-order-${index}`,
      type: "order",
      prompt: meaningOf(row),
      tokens: seededShuffle(tokens, `${idPrefix}-ord-${index}`),
      answer: tokens,
    });
  });
  return exercises;
}

function makeListenChoice(id, track, sentences) {
  const lines = sentences.map((row) => sentenceText(row, track)).filter(Boolean);
  if (lines.length < 2) return [];
  const indexes = [...new Set([0, 1, Math.floor(lines.length / 2), lines.length - 1])].filter((i) => i < lines.length);
  const exercises = [];
  indexes.forEach((index, slot) => {
    const answer = lines[index];
    const distractors = pick(lines, 3, answer, `${id}-${slot}`);
    if (distractors.length >= 2) exercises.push(makeMcq(`${id}-${slot}`, "", answer, distractors, "whichLine"));
  });
  return exercises;
}

function makeWordFit(idPrefix, track, vocab, sentences) {
  const exercises = [];
  sentences.forEach((row, index) => {
    const text = sentenceText(row, track);
    const word = vocab.find((item) => text.includes(wordOf(item, track)));
    if (!word) return;
    const answer = wordOf(word, track);
    const shown = text.replace(answer, "____");
    if (shown === text) return;
    const distractors = vocab
      .map((item) => wordOf(item, track))
      .filter((item) => item !== answer)
      .slice(0, 3);
    if (distractors.length < 2) return;
    exercises.push(makeMcq(`${idPrefix}-fit-${index}`, shown, answer, distractors, "whichFits"));
  });
  return exercises;
}

function makeSentencePick(idPrefix, track, sentences, limit) {
  const exercises = [];
  const lines = sentences.map((row) => sentenceText(row, track)).filter(Boolean);
  sentences.forEach((row, index) => {
    if (exercises.length >= limit) return;
    const answer = sentenceText(row, track);
    const distractors = pick(lines, 3, answer, `${idPrefix}-sent-${index}`);
    if (distractors.length < 2) return;
    exercises.push(
      makeMcq(`${idPrefix}-sent-${index}`, "", answer, distractors, "whichSentence", meaningOf(row)),
    );
  });
  return exercises;
}

function buildLesson({ track, unit, part, vocab, sentences, kind, order }) {
  const id = `${track}-${unit.id}-${kind}-${part}`;
  const dict = vocabDict(unit, track);
  const sourceSentences = sentences.length ? sentences : unit.sentences;
  const vocabItems = vocab.map((row) => ({
    word: wordOf(row, track),
    reading: readingOf(row, track),
    sayVi: sayViOf(row, track),
    meaning: meaningOf(row),
    usage: usageOf(row, track, sourceSentences),
  }));
  const sentenceItems = sentences.map((row) => ({
    text: sentenceText(row, track),
    reading: sentenceReading(row, track),
    sayVi: sayViOf(row, track),
    meaning: meaningOf(row),
    tokens: tokenize(track, sentenceText(row, track), dict),
  }));
  const quotes = sourceSentences.slice(0, 6).map((row) => ({
    text: sentenceText(row, track),
    reading: sentenceReading(row, track),
    sayVi: sayViOf(row, track),
    meaning: meaningOf(row),
  }));

  const caps = {
    teach: { gap: 2, order: 1, sent: 1, fit: false, listen: false, structure: 1 },
    words: { gap: 2, order: 1, sent: 1, fit: true, listen: false, structure: 0 },
    listen: { gap: 0, order: 0, sent: 0, fit: false, listen: true, structure: 0 },
    practice: { gap: 3, order: 2, sent: 2, fit: true, listen: false, structure: 1 },
    play: { gap: 0, order: 0, sent: 2, fit: false, listen: false, structure: 0 },
  };
  const cap = caps[kind] || caps.practice;
  const exercises = [];
  if (cap.gap) exercises.push(...makeGaps(id, track, sentences, cap.gap, dict));
  if (cap.order) exercises.push(...makeOrders(id, track, sentences, cap.order, dict));
  if (cap.fit) exercises.push(...makeWordFit(id, track, vocab, kind === "words" ? sentences : unit.sentences));
  if (cap.sent) exercises.push(...makeSentencePick(id, track, kind === "play" ? sourceSentences.slice(0, 6) : sentences, cap.sent));
  if (cap.listen) exercises.push(...makeListenChoice(`${id}-listen`, track, sentences));

  const theory = buildTheory(unit, track, sourceSentences, vocab, kind);
  theory.patterns.slice(0, cap.structure).forEach((pattern, index) => {
    const answer = pattern.form;
    const distractors = [...sentences.map((row) => sentenceText(row, track)), ...theory.patterns.map((item) => item.form)]
      .filter((item) => item && item !== answer)
      .slice(0, 3);
    if (distractors.length >= 2) {
      exercises.unshift(makeMcq(`${id}-structure-${index}`, "", answer, distractors, "whichPattern"));
    }
  });

  const titles = {
    teach: {
      vi: `${unit.title.vi} · lý thuyết`,
      en: `${unit.title.en} · theory`,
      zh: `${unit.title.zh} · 讲解`,
      th: `${unit.title.th} · ทฤษฎี`,
    },
    words: {
      vi: `${unit.title.vi} · từ`,
      en: `${unit.title.en} · words`,
      zh: `${unit.title.zh} · 词`,
      th: `${unit.title.th} · คำ`,
    },
    listen: {
      vi: `${unit.title.vi} · nghe`,
      en: `${unit.title.en} · listen`,
      zh: `${unit.title.zh} · 听`,
      th: `${unit.title.th} · ฟัง`,
    },
    practice: {
      vi: `${unit.title.vi} · luyện`,
      en: `${unit.title.en} · practice`,
      zh: `${unit.title.zh} · 练习`,
      th: `${unit.title.th} · ฝึก`,
    },
    play: {
      vi: `${unit.title.vi} · chơi nhớ`,
      en: `${unit.title.en} · play & remember`,
      zh: `${unit.title.zh} · 记一记`,
      th: `${unit.title.th} · เล่นทบทวน`,
    },
  };

  const minutes = { teach: 8, words: 6, listen: 5, practice: 7, play: 5 };

  return {
    id,
    track,
    unitId: unit.id,
    level: unit.level,
    kind,
    order,
    minutes: minutes[kind] ?? 12,
    title: titles[kind] ?? titles.words,
    goal: { vi: unit.goal.vi, en: unit.goal.en, zh: unit.goal.zh, th: unit.goal.th },
    speechLang: LANG_LABEL[track],
    theory,
    vocab: vocabItems,
    sentences: sentenceItems,
    quotes,
    listening: {
      text: sentenceItems.map((item) => item.text).join(track === "zh" ? "。" : " "),
      lines: sentenceItems.map((item) => item.text),
    },
    exercises,
  };
}

function lessonsForTrack(track, units) {
  const lessons = [];
  let order = 1;
  for (const unit of units) {
    if (unit.tracks && !unit.tracks.includes(track)) continue;
    const steps = [
      { kind: "teach", vocab: unit.vocab, sentences: unit.sentences },
      { kind: "words", vocab: unit.vocab, sentences: unit.sentences },
      { kind: "listen", vocab: unit.vocab.slice(0, 10), sentences: unit.sentences },
      { kind: "practice", vocab: unit.vocab, sentences: unit.sentences },
      { kind: "play", vocab: unit.vocab.slice(0, 8), sentences: unit.sentences.slice(0, 6) },
    ];
    for (const step of steps) {
      lessons.push(
        buildLesson({
          track,
          unit,
          part: 1,
          vocab: step.vocab,
          sentences: step.sentences,
          kind: step.kind,
          order: order++,
        }),
      );
    }
  }
  return lessons;
}

function catalogEntry(track, lessons, sourceUnits) {
  const units = [];
  for (const lesson of lessons) {
    let unit = units.find((item) => item.id === lesson.unitId);
    if (!unit) {
      const source = sourceUnits.find((item) => item.id === lesson.unitId);
      unit = {
        id: lesson.unitId,
        level: lesson.level,
        title: source
          ? { vi: source.title.vi, en: source.title.en, zh: source.title.zh, th: source.title.th }
          : { vi: lesson.unitId, en: lesson.unitId, zh: lesson.unitId, th: lesson.unitId },
        goal: source?.goal
          ? { vi: source.goal.vi, en: source.goal.en, zh: source.goal.zh, th: source.goal.th }
          : { vi: "", en: "", zh: "", th: "" },
        lessonIds: [],
      };
      units.push(unit);
    }
    unit.lessonIds.push(lesson.id);
  }
  return {
    id: track,
    lessonCount: lessons.length,
    exerciseCount: lessons.reduce((sum, lesson) => sum + lesson.exercises.length, 0),
    units,
  };
}

export function generateCurriculum() {
  const allUnits = [SOUNDS_UNIT, ...UNITS, ...UNITS_C, ...UNITS_C2, ...UNITS_E, ...UNITS_B, ...UNITS_D, ...UNITS_EN_B2];
  const byTrack = {};
  for (const track of TRACKS) {
    byTrack[track] = lessonsForTrack(track, allUnits);
  }
  const catalog = {
    generatedAt: new Date().toISOString(),
    note: "Linlin practice path. Short Duolingo-style steps: learn, answer, retry, keep going.",
    tracks: TRACKS.map((track) => catalogEntry(track, byTrack[track], allUnits)),
  };
  return { catalog, byTrack };
}

export function writeCurriculumFiles() {
  mkdirSync(outDir, { recursive: true });
  const { catalog, byTrack } = generateCurriculum();
  writeFileSync(join(outDir, "catalog.json"), JSON.stringify(catalog, null, 2));
  for (const track of TRACKS) {
    writeFileSync(join(outDir, `${track}.json`), JSON.stringify(byTrack[track]));
  }
  const total = catalog.tracks.reduce((sum, track) => sum + track.lessonCount, 0);
  const exercises = catalog.tracks.reduce((sum, track) => sum + track.exerciseCount, 0);
  return { total, exercises, catalog };
}

async function seedMongo(catalog, byTrack) {
  if (process.env.LEARN_SKIP_MONGO === "1") {
    console.log("LEARN_SKIP_MONGO=1 — skipped Mongo. JSON is ready in src/content/learn/");
    return;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("No MONGODB_URI — skipped Mongo. JSON is ready in src/content/learn/");
    return;
  }
  const { MongoClient } = await import("mongodb");
  const dbName = process.env.MONGODB_DB || "linlin";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  await db.collection("learn_catalog").replaceOne({ id: "main" }, { id: "main", ...catalog }, { upsert: true });
  const docs = TRACKS.flatMap((track) => byTrack[track]);
  for (let i = 0; i < docs.length; i += 400) {
    await db.collection("learn_lessons").bulkWrite(
      docs.slice(i, i + 400).map((doc) => ({
        replaceOne: {
          filter: { id: doc.id },
          replacement: doc,
          upsert: true,
        },
      })),
    );
  }
  await db.collection("learn_lessons").createIndex({ track: 1, order: 1 });
  await db.collection("learn_lessons").createIndex({ id: 1 }, { unique: true });
  await client.close();
  console.log(`Mongo synced safely: ${docs.length} lessons → ${dbName}.learn_lessons`);
}

const isMain = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  loadEnvLocal();
  const { catalog, byTrack } = generateCurriculum();
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "catalog.json"), JSON.stringify(catalog, null, 2));
  for (const track of TRACKS) {
    writeFileSync(join(outDir, `${track}.json`), JSON.stringify(byTrack[track]));
  }
  const total = catalog.tracks.reduce((sum, track) => sum + track.lessonCount, 0);
  const exercises = catalog.tracks.reduce((sum, track) => sum + track.exerciseCount, 0);
  console.log(`Wrote ${total} lessons / ${exercises} stored drills to src/content/learn/`);
  for (const track of catalog.tracks) {
    console.log(`  ${track.id}: ${track.lessonCount} lessons · ${track.exerciseCount} drills · ${track.units.length} units`);
  }
  await seedMongo(catalog, byTrack);
}
