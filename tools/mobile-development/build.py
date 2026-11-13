#!/usr/bin/env python3
"""Builds mobile-development/slides.json and mobile-development/quiz.json from slides_src.py and quiz_src.py.

Run from the repo root:  python3 tools/mobile-development/build.py
"""
import json
import os
import random
import sys
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, "mobile-development")
sys.path.insert(0, HERE)

from slides_src import SLIDES  # noqa: E402
from quiz_src import QUIZ  # noqa: E402


def bi(x):
    """A plain string means the same text in both languages."""
    return x if isinstance(x, tuple) else (x, x)


def pair(x):
    en, idn = bi(x)
    return {"en": en, "id": idn}


def build_slides():
    out = []
    for s in SLIDES:
        ch_en, ch_id = s["ch"]
        t_en, t_id = s["title"]
        b_en, b_id = s["body"]
        (qe, qi), (ae, ai) = s["qc"]
        d = {"chapter": ch_en, "title": t_en, "tag": s["tag"], "body": b_en}
        idd = {"chapter": ch_id, "title": t_id, "body": b_id}
        if "code" in s:
            d["code"] = s["code"]
        if "formula" in s:
            d["formula"] = s["formula"]
        if "explain" in s:
            d["explain"], idd["explain"] = s["explain"]
        if "wr" in s:
            wrong, right, (r_en, r_id) = s["wr"]
            d["wrong_right"] = {"wrong": wrong, "right": right, "reason": r_en}
            idd["wrong_right_reason"] = r_id
        d["quick_check"] = {"q": qe, "a": ae}
        idd["quick_check"] = {"q": qi, "a": ai}
        if "demo" in s:
            d["demo"] = s["demo"]
        d["id"] = idd
        out.append(d)
    return out


def build_question(item):
    kind = item["kind"]
    q = {"source": item["src"], "q": pair(item["q"])}
    if item.get("why") is not None and kind != "open":
        q["why"] = pair(item["why"])
    if kind == "open":
        q["model"] = pair(item["model"])
        return q
    if kind == "fill":
        q["accept"] = item["accept"]
        return q
    if item.get("code"):
        q["code"] = item["code"]
    if kind == "fixed":
        opts = [pair(o) for o in item["options"]]
        q["options"] = opts
        q["answer"] = item["answer"]
        return q
    correct = pair(item["correct"])
    pool = [correct] + [pair(w) for w in item["wrongs"]]
    rng = random.Random(zlib.crc32(bi(item["q"])[0].encode("utf8")))
    rng.shuffle(pool)
    q["options"] = pool
    q["answer"] = pool.index(correct)
    return q


def build_quiz():
    out = []
    for chap, note, items in QUIZ:
        c = {"chapter": pair(chap)}
        if note:
            c["note"] = pair(note)
        c["questions"] = [build_question(i) for i in items]
        out.append(c)
    return out


def check(slides, quiz):
    for s in slides:
        assert len(s["body"].split()) <= 55, ("body too long", s["title"])
        assert s["tag"] in ("WHAT", "HOW", "WHY", "REMEMBER"), s["title"]
        assert s["id"]["title"] and s["id"]["body"], s["title"]
    for chap in quiz:
        for q in chap["questions"]:
            if "options" in q:
                assert 0 <= q["answer"] < len(q["options"]), q["q"]["en"]
                assert len({o["en"] for o in q["options"]}) == len(q["options"]), ("duplicate option", q["q"]["en"])


def splice_demos():
    """Puts demos_mobile.js into demos.js between the two marker comments (added the first time)."""
    start, end = "  // <mobile-demos>\n", "  // </mobile-demos>\n"
    path = os.path.join(ROOT, "demos.js")
    with open(os.path.join(HERE, "demos_mobile.js"), encoding="utf8") as f:
        block = f.read()
    with open(path, encoding="utf8") as f:
        text = f.read()
    if start in text:
        a, b = text.index(start), text.index(end) + len(end)
        text = text[:a] + start + block + end + text[b:]
    else:
        anchor = "  window.DEMOS = DEMOS;"
        text = text.replace(anchor, start + block + end + "\n" + anchor)
    with open(path, "w", encoding="utf8", newline="") as f:
        f.write(text)


def main():
    slides, quiz = build_slides(), build_quiz()
    check(slides, quiz)
    splice_demos()
    os.makedirs(OUT, exist_ok=True)
    for name, data in (("slides.json", slides), ("quiz.json", quiz)):
        with open(os.path.join(OUT, name), "w", encoding="utf8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
    n_q = sum(len(c["questions"]) for c in quiz)
    print(f"mobile-development: {len(slides)} slides, {len(quiz)} quiz chapters, {n_q} questions")


if __name__ == "__main__":
    main()
