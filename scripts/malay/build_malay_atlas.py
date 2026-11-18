"""Build the Malay atlas (public/atlas + data/) from the JomBelajar 5000-word list.

Usage:
    python3 scripts/malay/build_malay_atlas.py [path/to/words.json]

Source: cuc-bahasa-malay/content/vocab5000/words.json (built from 启航's reviewed sheet).
Only words with status "approved" are included; senses flagged `check` (AI-written,
not yet reviewed) are left out. Word audio lives on Tencent COS (Singapore); the index
carries `audioBase` and each word id is the audio file stem (e.g. 0002_dan).
"""

import csv
import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / "cuc-bahasa-malay/content/vocab5000/words.json"
OUT = ROOT / "public/atlas"
DATA = ROOT / "data"
AUDIO_BASE = "https://jombelajar-audio-my-1314893093.cos.ap-singapore.myqcloud.com/vocab5000/audio/"
CHUNK = 100
BAND = 500  # words per level band, in frequency order

# Level bands by frequency rank. Keys double as CSS classes (.lv-T1 …).
LEVELS = ["T1", "T2", "T3", "T4", "T5", "T6"]

# Groups by part of speech (the source has no topic tags).
TOPICS = [
    ("noun", "名词"),
    ("verb", "动词"),
    ("adjective", "形容词"),
    ("adverb", "副词"),
    ("function", "功能词"),
    ("proper", "专有名词"),
    ("other", "其他"),
]
TOPIC_OF = {
    "名词": "noun", "名词（时间单位）": "noun", "名词/形容词": "noun", "名词/动词": "noun",
    "动词": "verb", "被动动词": "verb", "及物动词": "verb", "助动词": "verb", "系词": "verb", "动词/形容词": "verb",
    "形容词": "adjective", "形容词/副词": "adjective", "形容词/名词": "adjective",
    "副词": "adverb",
    "介词": "function", "连词": "function", "代词": "function", "数词": "function", "量词": "function",
    "感叹词": "function", "否定词": "function", "疑问词": "function", "语气助词": "function", "强调词": "function",
    "助词": "function", "介词／方位词": "function",
    "专有名词": "proper", "地名": "proper",
}
# Short Latin tags for the compact index ("n. 和"), so the quiz can strip them.
ABBR = {
    "noun": "n.", "verb": "v.", "adjective": "adj.", "adverb": "adv.", "proper": "n.",
}
FN_ABBR = {"介词": "prep.", "连词": "conj.", "代词": "pron.", "数词": "num.", "量词": "cl.", "感叹词": "interj."}

MEDIA_UK, MEDIA_US = 2, 4


def main():
    words = [w for w in json.load(open(SRC, encoding="utf-8")) if w.get("status") == "approved"]
    words.sort(key=lambda w: w["rank"])
    topic_idx = {k: i for i, (k, _) in enumerate(TOPICS)}

    entries, rows = [], []
    for order, w in enumerate(words):
        senses = [s for s in w["senses"] if not s.get("check") and s.get("zh")]
        if not senses:
            continue
        wid = Path(w["audio"]).stem if w.get("audio") else f"{w['rank']:04d}_{w['ms'].lower()}"
        first = senses[0]["pos"]
        topic = TOPIC_OF.get(first, "other")
        abbr = FN_ABBR.get(first) or ABBR.get(topic, "")
        level = LEVELS[min(order // BAND, len(LEVELS) - 1)]
        m = (MEDIA_UK | MEDIA_US) if w.get("audio") else 0
        ex = [{"en": s["exMs"], "zh": s.get("exZh", "")} for s in senses if s.get("exMs")]
        entries.append({
            "w": w["ms"],
            "uk": "",
            "us": "",
            "senses": [{"pos": s["pos"], "zh": s["zh"], "en": ""} for s in senses],
            "ex": ex,
            "col": [],
            "fam": [f"{w['root']} (词根)"] if w.get("root") else [],
            "syn": [],
            "ant": [],
            "tip": "",
            "cefr": level,
            "topic": topic,
            "note": "",
            "id": wid,
            "m": m,
            "rank": w["rank"],
        })
        zh = "；".join(s["zh"] for s in senses)
        rows.append([wid, w["ms"], f"{abbr} {zh}".strip(), "", LEVELS.index(level), topic_idx[topic], m])

    # Replace the English atlas wholesale.
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "entries").mkdir(parents=True)
    for n in range(0, len(entries), CHUNK):
        with open(OUT / "entries" / f"{n // CHUNK}.json", "w", encoding="utf-8") as f:
            json.dump(entries[n:n + CHUNK], f, ensure_ascii=False, separators=(",", ":"))
    index = {
        "id": "jombelajar-malay-5000",
        "version": 1,
        "name": "JomBelajar 马来语高频词",
        "license": "© JomBelajar",
        "count": len(entries),
        "examples": sum(len(e["ex"]) for e in entries),
        "illustrated": 0,
        "voiced": sum(1 for e in entries if e["m"]),
        "chunk": CHUNK,
        "audioBase": AUDIO_BASE,
        "topics": TOPICS,
        "cefr": LEVELS,
        "fields": ["id", "word", "zh", "ipa", "cefr", "topic", "media"],
        "words": rows,
    }
    with open(OUT / "index.json", "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, separators=(",", ":"))

    # Downloadable dataset.
    DATA.mkdir(exist_ok=True)
    for old in DATA.glob("word-atlas.*"):
        old.unlink()
    with open(DATA / "malay-5000.json", "w", encoding="utf-8") as f:
        json.dump([{k: v for k, v in e.items() if k not in ("uk", "us", "m")} | {"audio": AUDIO_BASE + e["id"] + ".mp3"} for e in entries],
                  f, ensure_ascii=False, indent=1)
    with open(DATA / "malay-5000.csv", "w", encoding="utf-8-sig", newline="") as f:
        out = csv.writer(f)
        out.writerow(["rank", "word", "pos", "zh", "example_ms", "example_zh", "level", "group", "audio"])
        for e in entries:
            ex = e["ex"][0] if e["ex"] else {"en": "", "zh": ""}
            out.writerow([e["rank"], e["w"], e["senses"][0]["pos"], "；".join(s["zh"] for s in e["senses"]),
                          ex["en"], ex["zh"], e["cefr"], e["topic"], AUDIO_BASE + e["id"] + ".mp3"])
    print(f"{len(entries)} words, {index['examples']} examples, {len(entries) // CHUNK + 1} chunks")


if __name__ == "__main__":
    main()
