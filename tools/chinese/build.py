"""Build slides.json and quiz.json for Comprehensive Chinese A.

python3 tools/chinese/build.py     (from anywhere)
  → comprehensive-chinese-a/slides.json
  → comprehensive-chinese-a/quiz.json

To change a slide: edit lessonN.py, then re-run this script.
Quiz questions about a 课文 or 阅读 get that story attached, taken from the lesson's own slides.
"""
import json, os, re, sys

sys.path.insert(0, os.path.dirname(__file__))
import lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, review, mock

LESSONS = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6]
EXTRA_QUIZZES = [review, mock]  # quiz only, no slides
MOCK_STORY = (lesson6, "阅读")  # the mock exam's reading is lesson 6's 逛公园
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "comprehensive-chinese-a")
CJK_ONLY = re.compile(r"^[^A-Za-z]*[一-鿿][^A-Za-z]*$")


def write(name, data):
    with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def stories(lesson):
    """The lesson's 课文 and 阅读 slides joined into whole texts, keyed 课文1, 课文2, 阅读."""
    out, kinds = {}, {}
    for s in lesson.SLIDES:
        m = re.match(r"(课文（[一二]）|阅读)[:：]?\s*(.+?)\s*\(\d/\d\)$", s["title"])
        if not m:
            continue
        kind, name = m.groups()
        key = "阅读" if kind == "阅读" else "课文" + ("1" if "一" in kind else "2")
        story = out.setdefault(key, {"title": f"{kind} {name}", "lines": []})
        if s["body"] and CJK_ONLY.match(s["body"]):  # a Chinese scene line such as 张东打电话找田芳……
            story["lines"].append({"hz": s["body"], "py": "", "tr": {"en": "", "id": ""}})
        story["lines"] += s.get("zh", [])
    return out


def attach(questions, found, fixed=None):
    """Give every 课文/阅读 question its story key. The first 课文 page is 课文1, a later page 课文2."""
    pages = sorted({int(re.search(r"p\. (\d+)", q["source"]).group(1)) for q in questions if "课文" in q["source"]})
    used = set()
    for q in questions:
        if fixed and "阅读" in q["source"]:
            key = fixed
        elif "阅读" in q["source"]:
            key = "阅读"
        elif "课文" in q["source"]:
            key = "课文" + str(pages.index(int(re.search(r"p\. (\d+)", q["source"]).group(1))) + 1)
        else:
            continue
        assert key in found, (q["source"], key)
        q["story"] = key
        used.add(key)
    return {k: found[k] for k in sorted(used)}


# The word banks printed on the teacher's exercise pages, in the PPT's order: (lesson, page) → words.
# Only these exercises get a "Choose: …" line; an exercise without a bank in the PPT gets nothing.
BANKS = {
    (lesson1, 45): "已经 考 接 踢 比赛 操场 又 出国",
    (lesson2, 54): "感到 难过 所以 又 疼 总 拉 检查",
    (lesson3, 52): "环境 条 附近 旁边 方便 打算 就 要是 才 还 套 虽然",
    (lesson4, 37): "懂 开 成 好 熟 错 关 道 上",
    (lesson4, 76): "上 成 到",
    (lesson5, 44): "练 差不多 好处 不一定 原来 必须 不过 从来 效果 挺",
    (lesson5, 79): "才 就",
    (lesson6, 40): "气温 预报 最 名曲 流行 迷 增加 暖和",
    (lesson6, 81): "就 才 再 又",
    (lesson6, 82): "懂 完 见 对 上 开",
}


def add_banks(lesson, questions):
    """Add the PPT's word bank to each typed question of an exercise that has one."""
    for q in questions:
        m = re.search(r"p\. (\d+)", q["source"])
        bank = m and BANKS.get((lesson, int(m.group(1))))
        if not (bank and q.get("accept") and "____" in q["q"]["en"]):
            continue
        pick = " / ".join(bank.split())
        q["q"] = {"en": q["q"]["en"] + f"\n(Choose: {pick})", "id": q["q"]["id"] + f"\n(Pilih: {pick})"}


slides = []
for lesson in LESSONS:
    for s in lesson.SLIDES:
        chapter = lesson.CHAPTER
        slides.append({"chapter": chapter["en"], **s, "id": {"chapter": chapter["id"], **s["id"]}})
write("slides.json", slides)

chapters = []
for l in LESSONS + EXTRA_QUIZZES:
    qs = [dict(q) for q in l.QUIZ]
    add_banks(l, qs)
    if l is mock:
        found = {"阅读": stories(MOCK_STORY[0])[MOCK_STORY[1]]}
        used = attach(qs, found, fixed="阅读")
    elif l in LESSONS:
        used = attach(qs, stories(l))
    else:
        used = {}
    chapters.append({"chapter": l.CHAPTER, "note": l.QUIZ_NOTE, **({"stories": used} if used else {}), "questions": qs})
write("quiz.json", chapters)
print(len(slides), "slides,", sum(len(c["questions"]) for c in chapters), "quiz questions,",
      sum(len(c.get("stories", {})) for c in chapters), "stories")
