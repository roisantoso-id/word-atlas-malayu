/**
 * Find the headword inside a Malay example sentence, allowing for affixes:
 * prefixes (me-/ber-/ter-/di-/ke-/pe-/se-, with nasal assimilation that drops
 * an initial p/t/k/s: tulis → menulis), suffixes (-kan/-an/-i/-nya/-lah/-kah/-pun)
 * and reduplication (anak → anak-anak).
 */
export function headwordPattern(word: string) {
  const w = word.trim().toLowerCase();
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const L = "A-Za-z";
  if (/\s/.test(w)) return new RegExp(`(?<![${L}])(${w.split(/\s+/).map(esc).join("\\s+")})(?![${L}])`, "i");
  const prefix = "(?:mem|men|meng|meny|me|ber|be|ter|di|ke|pem|pen|peng|peny|pe|per|se)?";
  const suffix = "(?:kan|an|i|nya|lah|kah|pun){0,2}";
  const cores = [`${prefix}${esc(w)}`];
  // memukul, menulis, mengira, menyapu: the nasal prefix swallows the first letter.
  if (w.length > 3 && /^[ptks]/.test(w)) cores.push(`(?:mem|men|meng|meny|pem|pen|peng|peny)${esc(w.slice(1))}`);
  const one = `(?:${cores.join("|")})${suffix}`;
  return new RegExp(`(?<![${L}-])(${one}(?:-${one})?)(?![${L}])`, "i");
}

export function splitHighlight(sentence: string, word: string): [string, string, string] | null {
  const m = headwordPattern(word).exec(sentence);
  if (!m) return null;
  return [sentence.slice(0, m.index), m[0], sentence.slice(m.index + m[0].length)];
}

export function gap(sentence: string, word: string) {
  const parts = splitHighlight(sentence, word);
  return parts ? { before: parts[0], hidden: parts[1], after: parts[2] } : null;
}

export const normalize = (s: string) =>
  s
    .normalize("NFKC")
    .replace(/[’‘]/g, "'")
    .replace(/[‐‑–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

export function shuffle<T>(xs: T[], seed = Math.random() * 2 ** 31): T[] {
  const out = [...xs];
  let x = Math.floor(seed) || 1;
  for (let i = out.length - 1; i > 0; i--) {
    x = (Math.imul(1664525, x) + 1013904223) >>> 0;
    const j = x % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Collocations are stored as "english｜中文". */
export const splitPair = (s: string) => {
  const [en, zh] = s.split(/[｜|]/);
  return { en: (en || "").trim(), zh: (zh || "").trim() };
};

export const plural = (n: number) => n.toLocaleString("en-US");
