/** Vietnamese-oriented reading for Linlin lessons. Original helper, not a textbook chart. */

const EN_SAY = {
  I: "ai",
  "i'm": "aim",
  am: "em",
  is: "iz",
  are: "a",
  you: "iu",
  your: "io",
  my: "mai",
  me: "mi",
  we: "oui",
  they: "đây",
  he: "hi",
  she: "si",
  it: "ít",
  this: "đít",
  that: "đét",
  what: "uốt",
  where: "ueo",
  who: "hu",
  how: "hao",
  when: "uen",
  why: "uai",
  hello: "hê-lô",
  hi: "hai",
  goodbye: "gút-bai",
  please: "pliz",
  thanks: "thenks",
  thank: "thenk",
  sorry: "so-ri",
  yes: "ies",
  no: "nô",
  not: "nót",
  "don't": "đôn",
  do: "đu",
  does: "đảoz",
  can: "ken",
  have: "hev",
  has: "hez",
  a: "ơ",
  an: "ân",
  the: "đơ",
  to: "tu",
  for: "pho",
  of: "óv",
  in: "in",
  on: "on",
  at: "ét",
  and: "en",
  or: "o",
  one: "uan",
  two: "tu",
  three: "thri",
  four: "pho",
  five: "phaiv",
  six: "siks",
  seven: "se-vân",
  eight: "êit",
  nine: "nain",
  ten: "ten",
  tea: "ti",
  coffee: "cóp-phi",
  water: "uo-tơ",
  name: "nêm",
  home: "hôm",
  go: "gô",
  come: "cơm",
  eat: "ít",
  drink: "đrinh",
  want: "uon",
  like: "lai",
  need: "nít",
  help: "hep",
  slow: "xlô",
  slowly: "xlô-li",
  speak: "xpic",
  okay: "ô-kê",
  ok: "ô-kê",
  good: "gút",
  morning: "mo-ninh",
  fine: "phain",
  late: "lêt",
  today: "tu-đêi",
  tomorrow: "tô-mo-rô",
  yesterday: "iet-tơ-đêi",
  please: "pliz",
};

function pinyinToViet(input) {
  if (!input) return "";
  return input
    .replaceAll("zh", "tr")
    .replaceAll("Zh", "Tr")
    .replaceAll("ch", "sờ")
    .replaceAll("sh", "s")
    .replaceAll("x", "s")
    .replaceAll("q", "ch")
    .replaceAll("j", "gi")
    .replaceAll("zi", "tư")
    .replaceAll("ci", "tư")
    .replaceAll("c", "k")
    .replaceAll("ü", "u")
    .replaceAll("ǖ", "u")
    .replaceAll("ǘ", "ú")
    .replaceAll("ǚ", "ủ")
    .replaceAll("ǜ", "ù");
}

function englishToViet(text) {
  if (!text) return "";
  return text
    .split(/(\s+|[.,!?])/g)
    .map((part) => {
      const key = part.toLowerCase().replace(/[^a-z']/g, "");
      if (!key) return part;
      const mapped = EN_SAY[key] || EN_SAY[part];
      if (!mapped) return part;
      if (part[0] && part[0] === part[0].toUpperCase() && /[A-Z]/.test(part[0])) {
        return mapped.charAt(0).toUpperCase() + mapped.slice(1);
      }
      return mapped;
    })
    .join("");
}

export function sayViOf(row, track) {
  if (track === "vi") return "";
  if (track === "zh") return pinyinToViet(row.py || "");
  if (track === "th") return row.rt || "";
  if (track === "en") return englishToViet(row.en || "");
  return "";
}
