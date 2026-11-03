"""Build slides.json and quiz.json for Comprehensive Chinese A.

python3 tools/chinese/build.py     (from anywhere)
  → comprehensive-chinese-a/slides.json
  → comprehensive-chinese-a/quiz.json

To change a slide: edit lessonN.py, then re-run this script.
"""
import json, os, sys

sys.path.insert(0, os.path.dirname(__file__))
import lesson1, lesson2, lesson3, lesson4, lesson5, lesson6

LESSONS = [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "comprehensive-chinese-a")


def write(name, data):
    with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


slides = []
for lesson in LESSONS:
    for s in lesson.SLIDES:
        chapter = lesson.CHAPTER
        slides.append({"chapter": chapter["en"], **s, "id": {"chapter": chapter["id"], **s["id"]}})
write("slides.json", slides)
write("quiz.json", [{"chapter": l.CHAPTER, "note": l.QUIZ_NOTE, "questions": l.QUIZ} for l in LESSONS])
print(len(slides), "slides,", sum(len(l.QUIZ) for l in LESSONS), "quiz questions")
