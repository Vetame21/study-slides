# Study Slides

Bilingual (English + Bahasa Indonesia) lecture slides and quizzes, made from our teachers' PPTs.

**Live site:** https://vetame21.github.io/study-slides/

Each subject has two parts:
- **Lectures**: short slides, one idea each, with explanations, common mistakes and a quick check.
- **Class quizzes**: one multiple-choice quiz per chapter, with instant feedback.

This README explains how to add content so that every subject looks and reads the same way.

---

## Folder layout

```
index.html                  the whole website (no build step)
demos.js                    interactive demos used by slides ("demo" field)
data-structure/
  slides.json               lecture slides
  quiz.json                 chapter quizzes
  img/*.svg                 figures (generated, don't edit by hand)
statistics-probability/
  slides.json, quiz.json    S01–S05, with 7 interactive demos
  homework.json, homework/  H01–H02 practice + solution PDFs (generated, see Homework)
digital-logic/
  slides.json, quiz.json    Ch 1, 2, 4, 5 (VHDL), 6, with 5 logic demos
  homework.json, homework/  PS1–PS5 practice + solution PDFs (generated)
college-physics-2/
  slides.json, quiz.json    Ch 21–24 (charge, field, Gauss' law, potential), with 13 physics demos
  homework.json, homework/  HW01, HW02, HW04, HW05 practice + solution PDFs (generated)
tools/figures.py            draws the Data Structure figures
```

A subject folder shows **"Coming soon"** until it has a `slides.json` or `quiz.json`.
The subject page only shows the parts whose file exists.

---

## Adding a new subject

1. Make a folder, using lowercase words joined by `-`, for example `college-physics-2/`.
2. Add one line to the `SUBJECTS` list near the top of the script in `index.html`:
   ```js
   { id: "college-physics-2", name: "College Physics 2", icon: "⚛️",
     book: "Title, Edition, Author" },
   ```
   Only fill in `book` if the PPT names the textbook. Never guess it.
3. Add `slides.json` and/or `quiz.json` to the folder (formats below).
4. Test it locally (see [Testing](#testing-before-you-push)), then push.

---

## The content rules

These rules apply to every subject. They are what make the slides trustworthy.

1. **Faithful first.** Teach only what is in the teacher's PPT. Never invent facts.
   - Anything helpful that is **not** in the PPT gets the tag **`[ADDED]`**, so readers know to check it.
   - If the PPT is unclear, incomplete, or has an error, write a **`[NOTE]`** instead of guessing.
2. **Accuracy.** Every code example must actually compile and run. Test it.
   If the teacher's code has a bug, keep their version in `wrong_right.wrong` and explain it.
   Don't silently fix it.
3. **One idea per slide.** Short title, one tag, a body of **about 40 words or fewer**.
4. **Tags** (exactly one per slide):

   | Tag | Use it for |
   |---|---|
   | `WHAT` | a definition or a concept |
   | `HOW` | a method, steps, worked example or code |
   | `WHY` | motivation: why this matters |
   | `REMEMBER` | a rule, formula or list to memorise |

5. **Teach the hard parts.** If a point is confusing, add an `explain` in plain words, as if to a beginner.
6. **Show mistakes.** For a common error, add a `wrong_right` (wrong version, right version, one-line reason).
7. **Active recall.** Every concept ends with one `quick_check` question and answer.
8. **Bilingual.** Every slide and quiz question has English and Indonesian.
   Technical terms that Indonesian classes say in English stay in English (array, loop, Big-Oh…).
   Code is never translated.
9. **Cite the page.** Quiz questions say which PPT page they come from (`"source": "p. 38"`).
10. **No copyrighted pictures.** The site is public. Don't upload textbook figures, screenshots, TV stills
    or logos. Redraw diagrams as SVG instead (see [Figures](#figures)).
11. **Homework lives only in the homework section.** Homework questions and solutions are published in
    `homework.json` and the solution PDFs (see [Homework](#homework)), not mixed into the lecture slides
    or class quizzes. Slides may point to it with `"practice": "H01 Q3"`.

---

## `slides.json` format

A list of slides, in order. Each slide's chapter name groups it in the Lectures list,
so **keep each chapter's slides together**.

```json
{
  "chapter": "3. Algorithm Analysis",
  "title": "Example 1: Find the Largest Value",
  "tag": "HOW",
  "body": "One loop over the array, constant work per pass.\nT(n) = c1·n + c2.",
  "code": "for (int i = 1; i < n; i++)\n  ...",
  "explain": "c1 = cost of one pass. c2 = one-time cost...",
  "wrong_right": {
    "wrong": "for (int i = 1; i <= n; i++)   // as on the source slide",
    "right": "for (int i = 1; i < n; i++)",
    "reason": "Off-by-one: i <= n reads array[n], past the end."
  },
  "quick_check": { "q": "Last valid index of an array of size n?", "a": "n-1." },
  "images": [
    { "src": "img/example.svg",
      "caption": { "en": "What the picture shows (redrawn from p. 40).",
                   "id": "Apa yang ditunjukkan gambar (digambar ulang dari hlm. 40)." } }
  ],
  "id": {
    "chapter": "3. Analisis Algoritma",
    "title": "Contoh 1: Mencari Nilai Terbesar",
    "body": "...",
    "explain": "...",
    "wrong_right_reason": "...",
    "quick_check": { "q": "...", "a": "..." }
  }
}
```

| Field | Required? | Notes |
|---|---|---|
| `chapter`, `title`, `tag`, `body` | yes | `body` uses `\n` for line breaks |
| `quick_check` | yes | one question per concept |
| `code` | optional | shown in a code box; must compile |
| `explain` | optional | for anything subtle |
| `wrong_right` | optional | `wrong`, `right`, `reason` |
| `images` | optional | list of figures, paths relative to the subject folder |
| `formula` | optional | list of LaTeX strings, typeset by KaTeX in a box under the body (see [Formulas](#formulas)) |
| `demo` | optional | name of an interactive demo in `demos.js`, e.g. `"bayes"` (see [Interactive demos](#interactive-demos)) |
| `practice` | optional | homework this slide prepares for, e.g. `"H01 Q3"`; shown as a small tag. Never the answer. |
| `id` | yes | Indonesian versions of the text fields. `code` and `wrong_right.wrong/right` are **not** repeated here. If `explain` or `wrong_right` exists in English, it must exist in `id` too. |

---

## `quiz.json` format

A list of chapters, each holding its questions:

```json
[
  {
    "chapter": { "en": "Chapter 1. Data Structures and Algorithms",
                 "id": "Bab 1. Struktur Data dan Algoritma" },
    "note": { "en": "[NOTE] optional message shown above the quiz",
              "id": "[NOTE] pesan opsional di atas kuis" },
    "questions": [
      {
        "source": "p. 14",
        "q": { "en": "A social network is modelled with which data structure?",
               "id": "Jejaring sosial dimodelkan dengan struktur data apa?" },
        "options": [
          { "en": "Graph", "id": "Graph" },
          { "en": "List",  "id": "List" },
          { "en": "Tree",  "id": "Tree" }
        ],
        "answer": 0,
        "why": { "en": "Page 14: Social network → Graph.",
                 "id": "Halaman 14: Jejaring sosial → Graph." }
      }
    ]
  }
]
```

- **`answer` counts from 0**: `0` = first option, `1` = second, and so on.
  ⚠️ If you reorder the options, update `answer` too.
- Mix up where the right answer sits; don't always make it the first option.
- `why` explains the right answer, and ideally why the tempting wrong one is wrong.
- `code` (optional) shows a code snippet under the question.
- Questions that are not from the PPT get `[ADDED]` in `source`.
- Aim for about 10 questions per chapter.

---

## Figures

Figures are SVG files in the subject's `img/` folder. They should not set their own colours.
Instead they use these CSS classes, which `index.html` colours for light and dark mode:

| Class | Looks like |
|---|---|
| `t` / `m` | normal text / grey text |
| `box`, `box empty`, `box found` | cell / dashed empty cell / green "found" cell |
| `ax`, `grid`, `edge` | axis lines / grid lines / tree or graph edges |
| `node` | graph node circle |
| `hl`, `ahead` | highlighted arrow line / its arrow head |
| `curve c1` … `curve c6` | chart lines in 6 colours (`text.c1` etc. for their labels) |
| `cell`, `cell on` | grid square / filled grid square |

For Data Structure, the figures are generated by a script, so edit the script, not the SVGs:

```bash
python3 tools/figures.py
```

For a new subject, add your figure functions to `tools/figures.py` the same way, or make a similar script.
Draw from the PPT's own data, and caption it "redrawn from p. X" (or `[ADDED]` if it's new).

---

## Homework

Each subject can have a **Homework practice** page and a **Homework solutions** page (PDFs).
Both are generated from one source file per subject in `tools/homework/`:

| File | Content |
|---|---|
| `phys_hw01.py` … `phys_hw05.py` | College Physics HW01, HW02, HW04, HW05 (official answer keys) |
| `stats_hw.py` | Statistics H01, H02 (solutions written for the site, marked [ADDED]) |
| `dl_hw.py` | Digital Logic PS1–PS5 (solutions written for the site, marked [ADDED]) |
| `dl_figs.py` | draws the PS5 PLA figure (`python3 tools/homework/dl_figs.py .`) |
| `hwlib.py` | helpers: `M(...)` multiple-choice item, `P(...)` problem with `part(...)`s |
| `hwbuild.py` | builds `<subject>/homework.json`, copies figures, prints the PDFs with Chrome |

Text can contain LaTeX between `$…$` (inline) or `$$…$$` (display), and `**bold**`.
Every solution should say **why** the method is used (`method=` for problem parts).

To change a solution or add a homework set: edit the source file, then from the repo root run

```bash
python3 tools/homework/hwbuild.py .
```

It regenerates `homework.json` and every PDF. Add subject ids to rebuild only those
(`python3 tools/homework/hwbuild.py . digital-logic`), so other subjects' PDFs don't change.
Code blocks in a solution go between ```` ``` ```` lines, and a part can carry its own figure with
`part(..., fig="homework/img/x.svg")`. Check the answers in code before publishing, and if the
official solution has a slip, keep the official answer but explain it in a **[NOTE]**.

---

## Formulas

Key formulas go in a slide's `formula` list as LaTeX, one line per entry. KaTeX draws them as real
fractions, roots and integrals in a box under the body:

```json
"formula": [
  "F = k\\,\\frac{|q_1|\\,|q_2|}{r^2}",
  "\\varepsilon_0 = 8.85\\times10^{-12}\\ \\mathrm{C^2/(N\\,m^2)}"
]
```

- In JSON every backslash is doubled: `\\frac`, not `\frac`.
- Keep each line short enough for a phone (split long ones into several entries).
- Use `\dfrac` / `\dbinom` when a fraction sits inside another fraction, so it stays readable.
- Keep the plain-text version in `body` too; the formula box is the tidy, typeset copy.
- Check that every formula renders: open the page and run this in the browser console
  (it prints the titles of any formula with a LaTeX mistake):

```js
for (const sub of ["data-structure", "statistics-probability", "college-physics-2"])
  for (const s of await fetch(sub + "/slides.json").then(r => r.json()))
    for (const tex of s.formula || [])
      try { katex.renderToString(tex, { throwOnError: true }); } catch (e) { console.log(sub, s.title, e.message); }
```

---

## Interactive demos

A slide with `"demo": "<name>"` gets a live widget under it ("▶ Try it"). Demos live in `demos.js`:

| Name | Slide | What it shows |
|---|---|---|
| `mean-median` | S01 Mean or Median? | drag one value: the mean moves, the median doesn't |
| `spread` | S01 Variance and SD | deviations, Sxx, s², s update as you move values |
| `long-run` | S02 Relative Frequency | real random flips; the running share settles near P(A) |
| `venn` | S02 General Addition Rule | sliders for P(A), P(B), P(A∩B); shades union / exactly one / neither |
| `order-or-not` | S03 Combinations | 60 officer lists collapse into 10 delegate groups |
| `bayes` | S04 Likelihood ≠ Posterior | 1000 people; why a good test can still give a low P(D \| +) |
| `pmf-cdf` | S05 The CDF | edit the pmf, the cdf steps follow; P(a ≤ Y ≤ b) = F(b) − F(a − 1) |
| `coulomb` | Ch 21 Coulomb's Law | change q₁, q₂, r; force arrows and the 1/r² curve |
| `field-explorer` | Ch 22 Field Lines | drag charges and a probe; field lines, each E vector and the vector sum |
| `dipole-axis` | Ch 22 Dipole Field | exact field vs 2kp/z³ on a log scale |
| `ink-jet` | Ch 22 Ink-Jet Printing | fire a drop between the plates; y = QEL²/(2mvₓ²) |
| `dipole-field` | Ch 22 Dipole in a Field | rotate or release the dipole; τ = pE sinθ, U = −pE cosθ |
| `flux-loop` | Ch 23 Flux | tilt a loop; Φ = EA cosθ goes +, 0, − |
| `gauss` | Ch 23 Gauss' Law | drag a Gaussian sphere; numerically integrated ∮E·dA vs q_enc/ε₀ |
| `spheres` | Ch 23 Spherical Symmetry | E(r) for shell, solid sphere, and sphere + conducting shell |
| `accelerate` | Ch 24 Accelerating Through 100 V | electron vs proton race; v = √(2qΔV/m) |
| `equipotential` | Ch 24 Equipotential Surfaces | equipotential contours + field lines; 12-electron ring even vs 120° arc |
| `potential-sphere` | Ch 24 Potential of a Charged Sphere | E(r) and V(r): conductor (V flat inside) vs solid sphere |
| `e-from-v` | Ch 24 Field from the Potential | tangent to V(x) gives Eₓ = −dV/dx |
| `assemble` | Ch 24 Potential Energy of a System | bring 3 charges in from ∞; work adds to −17 mJ |
| `base-convert` | DL Ch 2 Converting Between Bases | exact base 2/3/8/10/13/16 conversion, fractions too, with the division steps |
| `truth-table` | DL Ch 4 Theorems, Minterms | type two expressions; truth table, Σ lists, and whether they are equivalent |
| `kmap` | DL Ch 4 K-maps, Don't-Cares | click cells (1 / d); exact minimal sum with the groups marked |
| `decoder-mux` | DL Ch 6 Decoders, MUX | 74x138 with enables + NAND function builder; 8:1 MUX as a function generator |
| `vhdl-loop` | DL Ch 5–6 loops | step through CONV_INTEGER, CONV_STD_LOGIC_VECTOR, parity9 and prime9 |

To add one, write a function in `demos.js`:

```js
DEMOS["my-demo"] = function (root, lang) {
  const { t, num } = makeT(lang);        // t("English", "Indonesia"), num(0.5) → "0.50" / "0,50"
  // build controls with slider() / button(), draw with s("svg"...), append everything to root
};
```

Rules for demos:
- **Start from the slide's own example** (same numbers), so the demo and the slide agree.
- **Show the formula with the live numbers**, not just a picture.
- **Never fake randomness.** A simulation must use real random draws, triggered by the student.
- Use the CSS classes from [Figures](#figures) for colours, so it works in light and dark mode.
- Put text through `fill(node, ...)`, not `replaceChildren`, which prints `null` for empty slots.

---

## Testing before you push

The page loads JSON files, so double-clicking `index.html` won't work.
Run a small local server from the repo folder instead:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 and check:
- [ ] the subject shows up on the home page, with its chapters and slide count
- [ ] every slide opens, in both 🇬🇧 English and 🇮🇩 Bahasa Indonesia
- [ ] figures show up and are readable in dark and light mode, and on a phone-width window
- [ ] each quiz marks the right answer as correct
- [ ] every demo opens, its numbers match the slide's example, and nothing shows `null`
- [ ] the JSON is valid: `python3 -m json.tool your-folder/slides.json > /dev/null`
- [ ] VHDL code compiles: paste it into a file and run `ghdl -a --std=08 file.vhd` (a test bench with
      `assert`s is even better). Fix the teacher's typos in the code and explain them in a **[NOTE]**.

---

## Working together

- Work on a **branch** and open a **pull request**. Don't push straight to `main`,
  because `main` is the live site.
- The other person reviews the PR against the content rules above before merging.
- One subject per PR keeps reviews easy.

---

## Making slides with an AI assistant

You can turn a PPT into `slides.json` with an AI assistant. Give it the PPT text and this prompt,
then **check everything it writes against the PPT**: it can make mistakes.

```
Turn my teacher's source material into slides for a [SUBJECT] lesson.

Rules:
1. FAITHFUL FIRST. Teach ONLY what's in the source. Never invent facts.
   If the source is unclear or incomplete, write a [NOTE] instead of guessing.
   Tag anything helpful that is NOT in the source with [ADDED].
2. ACCURACY. Every code example must be correct and runnable. Show error-prone
   points (off-by-one, scope, missing return, precedence) explicitly.
3. ONE IDEA PER SLIDE: short title + a tag (WHAT/HOW/WHY/REMEMBER) + body of
   ~40 words max, optional code.
4. TEACH THE HARD PARTS: add an "explain" in plain language for subtle points.
5. SHOW MISTAKES: "wrong_right" with wrong, right and a one-line reason.
6. ACTIVE RECALL: end each concept with one quick_check question + answer.
7. BILINGUAL: English + Bahasa Indonesia, in the "id" field.

Output JSON matching the slides.json format in this repo's README.
```

---

## Credits

Slide content is based on our lecturers' course materials. Each subject page names its textbook
when the course slides do. Figures are redrawn for this site.
