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
data-structure/
  slides.json               lecture slides
  quiz.json                 chapter quizzes
  img/*.svg                 figures (generated, don't edit by hand)
statistics-probability/     empty for now
digital-logic/              empty for now
college-physics-2/          empty for now
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
- [ ] the JSON is valid: `python3 -m json.tool your-folder/slides.json > /dev/null`

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
