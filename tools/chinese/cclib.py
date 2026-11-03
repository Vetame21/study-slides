"""Helpers for the Comprehensive Chinese A lessons.

The 汉字 and pinyin of a slide are the same in both languages, so they are written once here.
S() stores them in a "zh" list (and new words in a "word" list) that index.html draws; only the
translations change with the language switch.
"""
import re


def L(hz, py, en, id):
    """One Chinese line with its pinyin and its English and Indonesian meaning."""
    return (hz, py, en, id)


def W(hz, py, pos, meaning):
    """A new word for the word box. pos, meaning = (en, id), e.g. ("动 verb", "动 kata kerja")."""
    return {"hz": hz, "py": py, "pos": {"en": pos[0], "id": pos[1]}, "mean": {"en": meaning[0], "id": meaning[1]}}


SPEAKER = re.compile(r"^([^：]{1,4})：(.+)$")
LABEL = re.compile(r"^[^:]{1,20}: (.+)$")


def line(hz, py, en, id):
    """A dialogue line ("张东：…" with "Zhāng Dōng: …" etc.) gets its speaker split off into "sp"."""
    m = SPEAKER.match(hz)
    rest = [LABEL.match(x) for x in (py, en, id)]
    if m and all(rest) and not m.group(1).endswith("说"):  # "玛丽说：…" is narration, not a speaker
        return {"sp": m.group(1), "hz": m.group(2), "py": rest[0].group(1), "tr": {"en": rest[1].group(1), "id": rest[2].group(1)}}
    return {"hz": hz, "py": py, "tr": {"en": en, "id": id}}


def S(tag, title, lines, check, intro=None, explain=None, wr=None, word=None):
    """One slide. title, intro, explain = (en, id); check = ((q, a), (q, a)); wr = (wrong, right, (en, id))."""
    slide = {"tag": tag, "title": title[0], "body": intro[0] if intro else ""}
    translated = {"title": title[1], "body": intro[1] if intro else ""}
    if word:
        slide["word"] = word
    if lines:
        slide["zh"] = [line(*l) for l in lines]
    if explain:
        slide["explain"], translated["explain"] = explain
    if wr:
        slide["wrong_right"] = {"wrong": wr[0], "right": wr[1], "reason": wr[2][0]}
        translated["wrong_right_reason"] = wr[2][1]
    slide["quick_check"] = dict(zip(("q", "a"), check[0]))
    translated["quick_check"] = dict(zip(("q", "a"), check[1]))
    slide["id"] = translated
    return slide


def F(source, q, accept, why):
    """A fill-in question: the student types the answer. accept = the accepted answers, best one first;
    punctuation and spaces are ignored when checking."""
    return {"source": source, "q": {"en": q[0], "id": q[1]}, "accept": accept, "why": {"en": why[0], "id": why[1]}}


def O(source, q, model):
    """An open question: many answers are right, so the site shows a sample answer and does not score it.
    q, model = (en, id)."""
    return {"source": source, "q": {"en": q[0], "id": q[1]}, "model": {"en": model[0], "id": model[1]}}


def Q(source, q, options, answer, why):
    """One quiz question. q, why = (en, id); an option is 汉字 (both languages) or (en, id)."""
    opts = [{"en": o, "id": o} if isinstance(o, str) else {"en": o[0], "id": o[1]} for o in options]
    return {"source": source, "q": {"en": q[0], "id": q[1]}, "options": opts, "answer": answer,
            "why": {"en": why[0], "id": why[1]}}
