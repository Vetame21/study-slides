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


slides = []
for lesson in LESSONS:
    for s in lesson.SLIDES:
        chapter = lesson.CHAPTER
        slides.append({"chapter": chapter["en"], **s, "id": {"chapter": chapter["id"], **s["id"]}})
write("slides.json", slides)

chapters = []
for l in LESSONS + EXTRA_QUIZZES:
    qs = [dict(q) for q in l.QUIZ]
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
