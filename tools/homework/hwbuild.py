"""Build homework practice JSON, figures and solution PDFs for the site.

python3 tools/homework/hwbuild.py . [subject-id]      (run from the repo root; needs Google Chrome; default: every subject)
  → <site>/<subject>/homework.json
  → <site>/<subject>/homework/img/*.png      (figures, renamed per question)
  → <site>/<subject>/homework/<id>-solutions.pdf   (KaTeX-typeset, printed by headless Chrome)

To change a solution: edit the matching phys_hw0N.py / stats_hw.py, then re-run this script.
"""
import html, json, os, re, shutil, subprocess, sys

sys.path.insert(0, os.path.dirname(__file__))
from phys_hw01 import HW01
from phys_hw02 import HW02
from phys_hw04 import HW04
from phys_hw05 import HW05
from stats_hw import H01, H02
from dl_hw import PS1, PS2, PS3, PS4, PS5

SITE = os.path.abspath(sys.argv[1])
HERE = os.path.dirname(os.path.abspath(__file__))
FIG_SRC = os.path.join(HERE, "..", "hwfig")   # raw figures cut from the homework PDFs (only needed for new figures)
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

FIGS = {  # site name → extracted file (checked by eye on a contact sheet)
    "hw04-q2": "HW04-mcq2-p1-2", "hw04-q3": "HW04-mcq3-p1-1", "hw04-q4": "HW04-mcq4-p1-0", "hw04-q5": "HW04-mcq5-p1-3",
    "hw04-q8": "HW04-mcq8-p2-0", "hw04-q9": "HW04-mcq9-p2-2", "hw04-q10": "HW04-mcq10-p2-3", "hw04-q11": "HW04-mcq11-p3-2",
    "hw04-q12": "HW04-mcq12-p3-3", "hw04-q17": "HW04-mcq17-p4-0", "hw04-q18": "HW04-mcq18-p4-2", "hw04-q19": "HW04-mcq19-p4-1",
    "hw04-p1": "HW04-prob1-p5-1", "hw04-p2": "HW04-prob2-p5-2", "hw04-p3": "HW04-prob3-p6-0",
    "hw05-q7": "HW05-mcq7-p2-1", "hw05-q8": "HW05-mcq8-p2-0", "hw05-q16": "HW05-mcq16-p3-0",
    "hw05-p2": "HW05-prob2-p5-1", "hw05-p3": "HW05-prob3-p6-1", "hw05-p4": "HW05-prob4-p6-2",
}

SUBJECTS = {
    "college-physics-2": [HW01, HW02, HW04, HW05],
    "statistics-probability": [H01, H02],
    "digital-logic": [PS1, PS2, PS3, PS4, PS5],
}

def md(text):
    """Escape HTML but keep $math$ intact for KaTeX auto-render; **bold** → <b>; ```code``` → <pre>."""
    out = html.escape(text, quote=False)
    out = re.sub(r"```\n(.*?)\n```\n?", r"<pre>\1</pre>", out, flags=re.S)
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", out)

def all_figures(s):
    for it in s["items"]:
        if it.get("figure"): yield it["figure"]

PDF_CSS = """
@page { size: A4; margin: 16mm 15mm; }
body { font: 10.5pt/1.5 -apple-system, "Helvetica Neue", Arial, sans-serif; color: #1d1d1f; }
h1 { font-size: 18pt; margin: 0 0 2px; } .src { color: #666; font-size: 9pt; margin-bottom: 10px; }
.intro { background: #fff8e6; border-left: 3px solid #d0a03c; padding: 6px 10px; font-size: 9.5pt; margin: 8px 0 14px; }
.item { border-top: 1px solid #ddd; padding: 10px 0 8px; break-inside: avoid; }
.q { font-weight: 600; } .num { color: #2f5bd3; margin-right: 6px; }
ol.opts { list-style: none; padding-left: 14px; margin: 6px 0; } ol.opts li { margin: 2px 0; }
ol.opts li.ok { font-weight: 700; color: #1f6b47; } ol.opts li.ok::after { content: "  ✓ (answer)"; font-weight: 600; }
.lbl { font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #2f5bd3; margin-top: 6px; }
.ans { background: #eef6f0; border-left: 3px solid #1f8a5b; padding: 4px 10px; margin: 4px 0; }
.sol { margin: 4px 0; } .why { color: #444; font-style: italic; }
.note { background: #fff1f0; border-left: 3px solid #c0392b; padding: 4px 10px; font-size: 9.5pt; margin: 4px 0; }
.fig { max-width: 62%; max-height: 170px; display: block; margin: 6px 0; }
.part { margin: 6px 0 4px 10px; }
.fig.big { max-width: 85%; max-height: 330px; }
pre { font: 8.5pt/1.35 Menlo, monospace; background: #f5f5f7; padding: 6px 10px; border-radius: 4px; white-space: pre-wrap; }
.katex-display { margin: 6px 0; }
"""

def build_html(s, subject):
    parts = [f"<h1>{md(s['title'])} — Worked Solutions</h1>",
             f"<div class='src'>Source: {md(s['source'])} · study-slides (vetame21.github.io/study-slides)</div>"]
    if s.get("intro"): parts.append(f"<div class='intro'>{md(s['intro'])}</div>")
    for it in s["items"]:
        num = "" if it["q"].startswith("Problem") else it["n"]   # physics problems carry their own "Problem n."
        h = [f"<div class='item'><div class='q'><span class='num'>{num}</span>{md(it['q'])}</div>"]
        if it.get("figure"):
            h.append(f"<img class='fig' src='file://{os.path.join(SITE, subject, it['figure'])}'>")
        if it.get("missing_figure"):
            h.append("<div class='note'>Figure not available: the original homework file was missing when these solutions were made.</div>")
        if it.get("note"): h.append(f"<div class='note'>{md(it['note'])}</div>")
        if it["kind"] == "mcq":
            if not all(o == "(see figure)" for o in it["options"]):
                h.append("<ol class='opts'>" + "".join(
                    f"<li class='{'ok' if i == it['answer'] else ''}'>{'ABCDE'[i]})&nbsp; {md(o)}</li>" for i, o in enumerate(it["options"])) + "</ol>")
            h.append(f"<div class='ans'><b>Answer: {'ABCDE'[it['answer']]}</b></div>")
            h.append(f"<div class='lbl'>Solution</div><div class='sol'>{md(it['solution'])}</div>")
        else:
            for p in it["parts"]:
                h.append(f"<div class='part'><b>{md(p['label'])}</b> {md(p['q'])}"
                         f"<div class='ans'><b>Answer:</b> {md(p['answer'])}</div>"
                         + (f"<div class='sol'>{md(p['solution'])}</div>" if p["solution"] else "")
                         + (f"<img class='fig big' src='file://{os.path.join(SITE, subject, p['figure'])}'>" if p.get("figure") else "")
                         + (f"<div class='why'>Why this method: {md(p['method'])}</div>" if p.get("method") else "")
                         + "</div>")
        h.append("</div>")
        parts.append("".join(h))
    return f"""<!doctype html><html><head><meta charset="utf-8"><title>{md(s['title'])}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"></script>
<style>{PDF_CSS}</style></head><body>{''.join(parts)}
<script>renderMathInElement(document.body, {{delimiters: [{{left: "$$", right: "$$", display: true}}, {{left: "$", right: "$", display: false}}], throwOnError: false}});
document.title = "ready";</script></body></html>"""

ONLY = sys.argv[2:]   # optional subject ids, so other subjects' PDFs aren't rebuilt needlessly
for subject, sets in SUBJECTS.items():
    if ONLY and subject not in ONLY: continue
    root = os.path.join(SITE, subject, "homework")
    os.makedirs(os.path.join(root, "img"), exist_ok=True)
    for s in sets:
        for fig in all_figures(s):
            name = os.path.splitext(os.path.basename(fig))[0]
            src, dest = os.path.join(FIG_SRC, FIGS.get(name, name) + ".png"), os.path.join(SITE, subject, fig)
            if os.path.exists(src): shutil.copy(src, dest)
            elif not os.path.exists(dest): sys.exit(f"missing figure {dest} (and no raw source {src})")
        s["pdf"] = f"homework/{s['id']}-solutions.pdf"
        page = os.path.join("/tmp", "study-slides-hw", f"{subject}-{s['id']}.html")   # throwaway print source
        os.makedirs(os.path.dirname(page), exist_ok=True)
        open(page, "w", encoding="utf8").write(build_html(s, subject))
        pdf = os.path.join(SITE, subject, s["pdf"])
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=15000",
                        "--allow-file-access-from-files", f"--print-to-pdf={pdf}", "file://" + page],
                       check=True, capture_output=True, timeout=120)
        print(f"{subject}/{s['pdf']}  ({os.path.getsize(pdf) // 1024} KB, {len(s['items'])} items)")
    json.dump(sets, open(os.path.join(SITE, subject, "homework.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)
    print(f"{subject}/homework.json: {len(sets)} sets")
