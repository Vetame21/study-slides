"""Generate the Data Structure slide figures as SVG.

Run: python3 tools/figures.py   (writes data-structure/img/*.svg)

The SVGs carry no colours of their own: they use CSS classes (t, m, ax, box, ...)
that index.html styles, so they follow the page's light/dark theme.
"""
import html
import math
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "data-structure", "img")


def svg(w, h, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">{body}</svg>\n'


def text(x, y, s, cls="t", anchor="middle", size=14, extra=""):
    return f'<text x="{x:.1f}" y="{y:.1f}" class="{cls}" font-size="{size}" text-anchor="{anchor}"{extra}>{html.escape(str(s))}</text>'


def rect(x, y, w, h, cls="box", rx=0):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" class="{cls}"/>'


def line(x1, y1, x2, y2, cls="ax", extra=""):
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" class="{cls}"{extra}/>'


def arrow_defs():
    return ('<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" '
            'orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ahead"/></marker></defs>')


def chart(funcs, xmax, ymax, xticks, yticks, xlabel, labels, n_min=0.0, step=0.05, w=640, h=340):
    """Line chart. funcs: list of (fn, css class, dashed). labels: list of (x, y, text, class)."""
    L, T, R, B = 56, 16, 44, 44  # right margin leaves room for end-of-line labels
    pw, ph = w - L - R, h - T - B
    X = lambda x: L + x / xmax * pw
    Y = lambda y: T + ph - y / ymax * ph
    out = [f'<clipPath id="plot"><rect x="{L}" y="{T}" width="{pw}" height="{ph}"/></clipPath>']
    for yt in yticks:
        out.append(line(L, Y(yt), L + pw, Y(yt), "grid"))
        out.append(text(L - 8, Y(yt) + 5, f"{yt:,}", "m", "end", 12))
    for xt in xticks:
        out.append(text(X(xt), T + ph + 18, str(xt), "m", "middle", 12))
    out.append(line(L, T, L, T + ph))
    out.append(line(L, T + ph, L + pw, T + ph))
    out.append(text(L + pw / 2, h - 6, xlabel, "m", "middle", 13))
    for fn, cls, dashed in funcs:
        pts, x = [], n_min
        while x <= xmax + 1e-9:
            y = fn(x)
            pts.append(f"{X(x):.1f},{Y(min(y, ymax * 1.5)):.1f}")
            if y > ymax * 1.5:
                break
            x += step
        dash = ' stroke-dasharray="6 5"' if dashed else ""
        out.append(f'<polyline points="{" ".join(pts)}" class="curve {cls}" clip-path="url(#plot)"{dash}/>')
    for x, y, s, cls in labels:
        out.append(text(X(x), Y(y), s, f"lbl {cls}", "start", 13))
    return svg(w, h, "".join(out))


# ---- Chapter 1 ----------------------------------------------------------------

def list_fig():
    # Library records from p. 12 of the deck.
    rows = [("001", "高等数学", "樊映川"), ("002", "理论力学", "罗远祥"),
            ("003", "高等数学", "华罗庚"), ("004", "线性代数", "栾汝书"), ("…", "…", "…")]
    cols, cw, rh = [0, 70, 200], [70, 130, 110], 34
    out = [text(155, 22, "List", "t", "middle", 16, ' font-weight="700"')]
    for r, row in enumerate(rows):
        for c, val in enumerate(row):
            out.append(rect(20 + cols[c], 36 + r * rh, cw[c], rh))
            out.append(text(20 + cols[c] + cw[c] / 2, 36 + r * rh + 22, val))
    return svg(330, 36 + len(rows) * rh + 10, "".join(out))


def board(x, y, size, marks):
    """Tic-tac-toe board; marks: dict cell(0-8) -> 'x' or 'o'."""
    s = size / 3
    out = [rect(x, y, size, size, "box", 3)]
    for i in (1, 2):
        out.append(line(x + i * s, y + 3, x + i * s, y + size - 3, "ax"))
        out.append(line(x + 3, y + i * s, x + size - 3, y + i * s, "ax"))
    for cell, m in marks.items():
        cx, cy = x + (cell % 3 + .5) * s, y + (cell // 3 + .5) * s
        if m == "x":
            d = s * .28
            out.append(line(cx - d, cy - d, cx + d, cy + d, "mx"))
            out.append(line(cx - d, cy + d, cx + d, cy - d, "mx"))
        else:
            out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{s * .28:.1f}" class="mo"/>')
    return "".join(out)


def tree_fig():
    # Same shape as the p. 13 picture: X opens corner / centre / edge, then O replies.
    B = 40
    root = (195, 30)
    kids = [(55, 120, {0: "x"}), (195, 120, {4: "x"}), (335, 120, {1: "x"})]
    leaves = [[(15, {0: "x", 1: "o"}), (95, {0: "x", 4: "o"})],
              [(155, {4: "x", 0: "o"}), (235, {4: "x", 1: "o"})],
              [(295, {1: "x", 0: "o"}), (375, {1: "x", 4: "o"})]]
    out = [text(215, 18, "Tree", "t", "middle", 16, ' font-weight="700"')]
    for (kx, ky, _), ls in zip(kids, leaves):
        out.append(line(root[0] + B / 2, root[1] + B, kx + B / 2, ky, "edge"))
        for lx, _ in ls:
            out.append(line(kx + B / 2, ky + B, lx + B / 2, 210, "edge"))
    out.append(board(*root, B, {}))
    for kx, ky, m in kids:
        out.append(board(kx, ky, B, m))
    for ls in leaves:
        for lx, m in ls:
            out.append(board(lx, 210, B, m))
    return svg(430, 262, "".join(out))


def graph_fig():
    nodes = {"A": (60, 70), "B": (170, 45), "C": (280, 80), "D": (95, 175),
             "E": (205, 150), "F": (300, 200), "G": (180, 235)}
    edges = ["AB", "AD", "AE", "BC", "BE", "CE", "CF", "DE", "DG", "EF", "EG", "FG"]
    out = [text(180, 18, "Graph", "t", "middle", 16, ' font-weight="700"')]
    for a, b in edges:
        out.append(line(*nodes[a], *nodes[b], "edge"))
    for name, (x, y) in nodes.items():
        out.append(f'<circle cx="{x}" cy="{y}" r="17" class="node"/>')
        out.append(text(x, y + 5, name))
    return svg(360, 262, "".join(out))


def alist_fig():
    vals, max_size, fence = [23, 11, 67, 54, 43], 8, 2
    x0, cw, y = 30, 64, 70
    out = [arrow_defs(), text(x0, 22, "listArray", "t", "start", 15, ' font-family="ui-monospace,Menlo,monospace"')]
    for i in range(max_size):
        filled = i < len(vals)
        out.append(rect(x0 + i * cw, y, cw, 46, "box" if filled else "box empty"))
        if filled:
            out.append(text(x0 + i * cw + cw / 2, y + 29, str(vals[i]), "t", "middle", 17))
        out.append(text(x0 + i * cw + cw / 2, y - 10, str(i), "m", "middle", 12))
    # brace-like bars for listSize and maxSize
    yb = y + 70
    out.append(line(x0, yb, x0 + len(vals) * cw, yb, "ok"))
    out.append(text(x0 + len(vals) * cw / 2, yb + 20, f"listSize = {len(vals)}", "t", "middle", 14))
    out.append(line(x0, yb + 40, x0 + max_size * cw, yb + 40, "ax"))
    out.append(text(x0 + max_size * cw / 2, yb + 60, f"maxSize = {max_size}", "t", "middle", 14))
    fx = x0 + fence * cw
    out.append(line(fx, y - 34, fx, y - 2, "hl", ' marker-end="url(#ah)"'))
    out.append(text(fx + 6, y - 38, f"fence = {fence}", "t", "start", 14))
    return svg(x0 * 2 + max_size * cw, 210, "".join(out))


def sorting_fig():
    inp, outp = [23, 11, 67, 54, 43, 100, 33], [11, 23, 33, 43, 54, 67, 100]
    cw = 56
    out = [arrow_defs()]
    for r, (label, vals, y) in enumerate([("Input", inp, 30), ("Output", outp, 170)]):
        out.append(text(20, y + 28, label, "m", "start", 13))
        for i, v in enumerate(vals):
            out.append(rect(90 + i * cw, y, cw, 42, "box"))
            out.append(text(90 + i * cw + cw / 2, y + 27, str(v), "t", "middle", 16))
    out.append(line(90 + 3.5 * cw, 80, 90 + 3.5 * cw, 162, "hl", ' marker-end="url(#ah)"'))
    out.append(text(90 + 3.5 * cw + 12, 126, "Sorting algorithm", "t", "start", 15, ' font-weight="600"'))
    return svg(90 + 7 * cw + 20, 225, "".join(out))


# ---- Chapter 3 ----------------------------------------------------------------

def growth_fig():
    funcs = [
        (lambda n: 10 * n, "c1", True),
        (lambda n: 20 * n, "c2", True),
        (lambda n: 5 * n * math.log2(n) if n > 1 else 0, "c3", False),
        (lambda n: 2 * n * n, "c4", False),
        (lambda n: 2 ** n, "c5", False),
        (lambda n: math.gamma(n + 1), "c6", False),
    ]
    labels = [(15.15, 145, "10n", "c1"), (15.15, 305, "20n", "c2"), (12.6, 212, "5n log₂n", "c3"),
              (12.7, 370, "2n²", "c4"), (8.0, 385, "2ⁿ", "c5"), (5.0, 385, "n!", "c6")]
    return chart(funcs, 15, 400, range(0, 16, 5), range(0, 401, 100), "Input size n", labels, w=660)


def T_wiggle(n):
    # A running time that zig-zags between n² and 2n², like the curve on p. 45/51/55.
    return n * n * (1.5 + 0.45 * math.sin(1.7 * round(n)))


def bound_fig(kind):
    # Labels go in a legend at the top-left, where all curves are still near zero.
    funcs = [(T_wiggle, "c4", False)]
    labels = [(4, 18000, "— T(n)", "c4")]
    if kind in ("oh", "theta"):
        funcs.append((lambda n: 2 * n * n, "c6", False))
        labels.append((4, 16000, "— c·f(n) = 2n²  (upper bound)", "c6"))
    if kind in ("omega", "theta"):
        funcs.append((lambda n: n * n, "c1", False))
        labels.append((4, 16000 if kind == "omega" else 14000, "— c·g(n) = n²  (lower bound)", "c1"))
    return chart(funcs, 100, 20000, range(0, 101, 20), range(0, 20001, 5000), "n", labels, n_min=1, step=1)


def triangle_fig():
    n, s = 8, 30
    x0, y0 = 70, 40
    out = [text(x0 + n * s / 2, 24, "for (j=1; j<=i; j++)  with n = 8", "m", "middle", 13)]
    for i in range(1, n + 1):
        out.append(text(x0 - 10, y0 + (i - .5) * s + 5, f"i={i}", "m", "end", 12))
        for j in range(1, n + 1):
            out.append(rect(x0 + (j - 1) * s, y0 + (i - 1) * s, s, s, "cell on" if j <= i else "cell"))
    total = n * (n + 1) // 2
    out.append(text(x0 + n * s + 20, y0 + 60, f"filled cells = 1 + 2 + … + {n}", "t", "start", 14))
    out.append(text(x0 + n * s + 20, y0 + 84, f"= {n}·{n + 1}/2 = {total}", "t", "start", 14))
    out.append(text(x0 + n * s + 20, y0 + 130, f"whole square = n² = {n * n}", "m", "start", 14))
    out.append(text(x0 + n * s + 20, y0 + 154, "about half of n² → still Θ(n²)", "m", "start", 14))
    return svg(x0 + n * s + 270, y0 + n * s + 16, "".join(out))


def doubling_fig():
    n, unit, bh, gap = 16, 13, 22, 8
    ks = [1, 2, 4, 8, 16]
    out = []
    for p, (title, inner, x0) in enumerate([("sum1: inner loop j ≤ n", lambda k: n, 60),
                                             ("sum2: inner loop j ≤ k", lambda k: k, 360)]):
        out.append(text(x0, 22, title, "t", "start", 14, ' font-weight="600" font-family="ui-monospace,Menlo,monospace"'))
        total = 0
        for r, k in enumerate(ks):
            y = 40 + r * (bh + gap)
            out.append(text(x0 - 8, y + 16, f"k={k}", "m", "end", 12))
            out.append(rect(x0, y, inner(k) * unit, bh, "bar c4" if p == 0 else "bar c1", 3))
            out.append(text(x0 + inner(k) * unit + 6, y + 16, str(inner(k)), "t", "start", 12))
            total += inner(k)
        y = 40 + len(ks) * (bh + gap) + 18
        out.append(text(x0, y, f"total = {total}", "t", "start", 14, ' font-weight="700"'))
        out.append(text(x0, y + 20, "≈ n·log n" if p == 0 else "≈ 2n → Θ(n)", "m", "start", 13))
    return svg(640, 245, "".join(out))


def binary_fig():
    keys = [11, 13, 21, 26, 29, 36, 40, 41, 45, 51, 54, 56, 65, 72, 77, 83]
    K = 45
    cw, x0, y0 = 40, 20, 40
    # Trace the deck's binary() exactly to get the probes.
    probes, l, r = [], -1, len(keys)
    while l + 1 != r:
        i = (l + r) // 2
        probes.append(i)
        if K < keys[i]:
            r = i
        if K == keys[i]:
            break
        if K > keys[i]:
            l = i
    out = [arrow_defs()]
    for i, k in enumerate(keys):
        cls = "box found" if i == probes[-1] else "box"
        out.append(rect(x0 + i * cw, y0, cw, 38, cls))
        out.append(text(x0 + i * cw + cw / 2, y0 + 25, str(k), "t", "middle", 15))
        out.append(text(x0 + i * cw + cw / 2, y0 - 10, str(i), "m", "middle", 11))
    for step, i in enumerate(probes, 1):
        x = x0 + i * cw + cw / 2
        ylen = 38 + (len(probes) - step) * 28
        out.append(line(x, y0 + 38 + ylen, x, y0 + 42, "hl", ' marker-end="url(#ah)"'))
        out.append(f'<circle cx="{x:.1f}" cy="{y0 + 52 + ylen:.1f}" r="11" class="badge"/>')
        out.append(text(x, y0 + 57 + ylen, str(step), "badge-t", "middle", 13))
    notes = [f"{s}: i={i} → {keys[i]}" + (" found!" if keys[i] == K else (" > 45, go left" if keys[i] > K else " < 45, go right"))
             for s, i in enumerate(probes, 1)]
    for j, s in enumerate(notes):  # left side is free: probes land at index 7 or later
        out.append(text(x0, y0 + 80 + j * 26, s, "t", "start", 16))
    return svg(x0 * 2 + 16 * cw, 245, "".join(out))


def halving_fig():
    sizes, cw = [16, 8, 4, 2, 1], 24
    out = []
    for r, s in enumerate(sizes):
        y = 20 + r * 40
        out.append(text(16, y + 20, f"T({s})", "m", "start", 13))
        for i in range(s):
            out.append(rect(80 + i * cw, y, cw - 3, 28, "cell on", 3))
        out.append(text(80 + 16 * cw + 10, y + 20, "+ c", "t", "start", 14))
    out.append(text(80, 20 + len(sizes) * 40 + 14, "5 levels = log₂16 + 1  →  T(16) = c(log₂16 + 1) = 5c",
                    "t", "start", 14))
    return svg(80 + 16 * cw + 60, 20 + len(sizes) * 40 + 30, "".join(out))


FIGURES = {
    "list.svg": list_fig, "tree.svg": tree_fig, "graph.svg": graph_fig,
    "alist.svg": alist_fig, "sorting.svg": sorting_fig, "growth.svg": growth_fig,
    "big-oh.svg": lambda: bound_fig("oh"), "big-omega.svg": lambda: bound_fig("omega"),
    "theta.svg": lambda: bound_fig("theta"), "triangle-loop.svg": triangle_fig,
    "doubling-loops.svg": doubling_fig, "binary-search.svg": binary_fig, "halving.svg": halving_fig,
}

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, make in FIGURES.items():
        with open(os.path.join(OUT, name), "w", encoding="utf8") as f:
            f.write(make())
    print(f"wrote {len(FIGURES)} figures to {os.path.normpath(OUT)}")
