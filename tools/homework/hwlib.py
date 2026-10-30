"""Tiny helpers for writing homework sources compactly.

M(...)  multiple-choice item: official answer letter, a short `why` (shown on the practice page)
        and an optional longer `sol` (worked solution for the PDF; defaults to `why`).
P(...)  open problem made of parts: each part has a final answer and a worked solution.
Text may contain LaTeX between $...$ (inline) or $$...$$ (display).
"""

def M(n, q, opts, ans, why, sol=None, fig=None, nofig=False, note=None):
    item = {"n": n, "kind": "mcq", "q": q, "options": opts, "answer": "ABCDE".index(ans),
            "why": why, "solution": sol or why}
    if fig: item["figure"] = fig
    if nofig: item["missing_figure"] = True
    if note: item["note"] = note
    return item

def part(label, q, answer, sol, method=None, fig=None):
    return {"label": label, "q": q, "answer": answer, "solution": sol, **({"method": method} if method else {}),
            **({"figure": fig} if fig else {})}

def P(n, q, parts, fig=None, nofig=False, note=None):
    item = {"n": n, "kind": "problem", "q": q, "parts": parts}
    if fig: item["figure"] = fig
    if nofig: item["missing_figure"] = True
    if note: item["note"] = note
    return item

def SET(id_, title, source, items, intro=None):
    return {"id": id_, "title": title, "source": source, "intro": intro, "items": items}
