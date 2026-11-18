import assert from "node:assert/strict";
import { test } from "node:test";
import { gap, normalize, splitHighlight, splitPair } from "./text";

test("highlights the Malay headword with affixes", () => {
  assert.equal(splitHighlight("Dia sedang menulis surat.", "tulis")?.[1], "menulis");
  assert.equal(splitHighlight("Kami membeli buah di pasar.", "beli")?.[1], "membeli");
  assert.equal(splitHighlight("Saya mengira dia sudah pulang.", "kira")?.[1], "mengira");
  assert.equal(splitHighlight("Rumahnya besar.", "rumah")?.[1], "Rumahnya");
  assert.equal(splitHighlight("Anak-anak bermain di taman.", "anak")?.[1], "Anak-anak");
  assert.equal(splitHighlight("Kita jumpa lagi esok.", "ikan"), null);
});

test("does not match inside longer unrelated words", () => {
  assert.equal(splitHighlight("Dia datang semalam.", "di"), null);
});

test("gaps the sentence for cloze questions", () => {
  const g = gap("Ali dan Siti datang bersama.", "dan");
  assert.equal(g?.hidden, "dan");
  assert.equal(g?.after, " Siti datang bersama.");
});

test("normalizes typography from mobile keyboards", () => {
  assert.equal(normalize("  Don’t  "), "don't");
  assert.deepEqual(splitPair("in principle｜原则上"), { en: "in principle", zh: "原则上" });
});
