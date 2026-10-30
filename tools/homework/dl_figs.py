"""Draw the PS5 PLA solution in the compact (dot) notation used on the Chapter 6 slides.

python3 tools/homework/dl_figs.py .   → digital-logic/homework/img/ps5-pla.svg
"""
import os, sys

TERMS = [  # (product term, literals as (variable, true?), outputs that use it)
    ("A'CD",  [("A", 0), ("C", 1), ("D", 1)], ["F1"]),
    ("B'CD",  [("B", 0), ("C", 1), ("D", 1)], ["F1"]),
    ("AC'D'", [("A", 1), ("C", 0), ("D", 0)], ["F1"]),
    ("A'B",   [("A", 0), ("B", 1)], ["F2"]),
    ("AB'",   [("A", 1), ("B", 0)], ["F2"]),
    ("C'D",   [("C", 0), ("D", 1)], ["F2"]),
    ("CD'",   [("C", 1), ("D", 0)], ["F2"]),
    ("B",     [("B", 1)], ["F3"]),
    ("C'",    [("C", 0)], ["F3"]),
    ("D",     [("D", 1)], ["F3"]),
]
VARS, OUTS = "ABCD", ["F1", "F2", "F3"]

def svg():
    x0, dx, y0, dy = 70, 30, 60, 26          # input columns: A, A', B, B', …
    cols = {(v, t): x0 + (2 * i + (0 if t else 1)) * dx for i, v in enumerate(VARS) for t in (1, 0)}
    and_r = x0 + 8 * dx                       # right edge of the AND array
    ox = {o: and_r + 50 + i * 50 for i, o in enumerate(OUTS)}
    rows = [y0 + 20 + i * dy for i in range(len(TERMS))]
    bottom = rows[-1] + 24
    W, H = ox["F3"] + 60, bottom + 50
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
         'font-family="Helvetica, Arial, sans-serif" font-size="13">',
         f'<rect width="{W}" height="{H}" fill="#fff"/>']
    for (v, t), x in cols.items():
        s.append(f'<line x1="{x}" y1="{y0 - 10}" x2="{x}" y2="{bottom}" stroke="#555"/>')
        s.append(f'<text x="{x}" y="{y0 - 18}" text-anchor="middle">{v}{"" if t else "′"}</text>')
    for o, x in ox.items():
        s.append(f'<line x1="{x}" y1="{y0}" x2="{x}" y2="{bottom}" stroke="#555"/>')
        s.append(f'<line x1="{x}" y1="{bottom}" x2="{x}" y2="{bottom + 18}" stroke="#555" marker-end="url(#a)"/>')
        s.append(f'<text x="{x}" y="{bottom + 36}" text-anchor="middle" font-weight="bold">{o}</text>')
    s.insert(2, '<defs><marker id="a" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="7" markerHeight="7" orient="auto">'
                '<path d="M0,0 L8,4 L0,8 z" fill="#555"/></marker></defs>')
    for (name, lits, outs), y in zip(TERMS, rows):
        s.append(f'<text x="{x0 - 14}" y="{y + 4}" text-anchor="end" fill="#2f5bd3">{name}</text>')
        s.append(f'<line x1="{x0 - 8}" y1="{y}" x2="{ox["F3"] + 10}" y2="{y}" stroke="#999"/>')
        for v, t in lits:   # programmed connection in the AND array
            s.append(f'<circle cx="{cols[(v, t)]}" cy="{y}" r="4.5" fill="#1d1d1f"/>')
        for o in outs:      # programmed connection in the OR array
            s.append(f'<circle cx="{ox[o]}" cy="{y}" r="4.5" fill="#1f8a5b"/>')
    s.append(f'<text x="{(x0 + and_r) / 2}" y="{H - 8}" text-anchor="middle" fill="#666">AND array (programmable)</text>')
    s.append(f'<text x="{ox["F2"]}" y="{y0 - 18}" text-anchor="middle" fill="#666">OR array</text>')
    s.append("</svg>")
    return "\n".join(s)

if __name__ == "__main__":
    out = os.path.join(os.path.abspath(sys.argv[1]), "digital-logic", "homework", "img")
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, "ps5-pla.svg"), "w").write(svg())
    print("wrote", os.path.join(out, "ps5-pla.svg"))
