// Interactive demos. A slide with "demo": "<name>" gets DEMOS[name](root, lang) drawn under it.
// Each demo builds its own controls and SVG inside `root` and re-draws itself on input.
// Colours come from the page's CSS classes (see the .demo / .fig styles in index.html).
(function () {
  const NS = "http://www.w3.org/2000/svg";

  // SVG element: s("circle", {cx: 1}, child, "text")
  function s(tag, attrs = {}, ...kids) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    for (const k of kids) if (k != null) n.append(k);
    return n;
  }

  // HTML element; attributes starting with "on" become event listeners.
  function h(tag, attrs = {}, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    for (const k of kids) if (k != null) n.append(k);
    return n;
  }

  // replaceChildren() would print "null" for an empty slot, so skip those.
  function fill(node, ...kids) {
    node.replaceChildren(...kids.filter(k => k != null));
  }

  // minW: narrowest the drawing may shrink to before it scrolls sideways (charts with small
  // text need ~520px; pictures with big labels can fit a phone).
  function svgBox(w, hgt, minW = Math.min(w * 0.85, 520)) {
    const svg = s("svg", { viewBox: `0 0 ${w} ${hgt}` });
    svg.style.minWidth = minW + "px";
    return svg;
  }

  function slider(label, min, max, step, value, onInput) {
    const out = h("output", {});
    const input = h("input", { type: "range", min, max, step, value });
    const show = () => { out.textContent = input.value; };
    input.addEventListener("input", () => { onInput(+input.value); show(); });
    show();
    return { wrap: h("label", { class: "demo-slider" }, h("span", {}, label), input, out), input, out, show };
  }

  function button(label, onClick, cls = "") {
    return h("button", { type: "button", class: cls, onclick: onClick }, label);
  }

  function makeT(lang) {
    const t = (en, id) => (lang === "id" ? id : en);
    // Decimal comma in Indonesian.
    const num = (x, d = 2) => {
      const str = (Math.round(x * 10 ** d) / 10 ** d).toFixed(d);
      return lang === "id" ? str.replace(".", ",") : str;
    };
    return { t, num };
  }

  const DEMOS = {};

  // ---- S01: mean vs median --------------------------------------------------------------
  DEMOS["mean-median"] = function (root, lang) {
    const { t, num } = makeT(lang);
    const base = [1, 2, 2, 2];
    let last = 3;
    const W = 600, H = 150, X = v => 30 + (v / 30) * 540, AXIS = 100;
    const svg = svgBox(W, H);
    const readout = h("div", { class: "demo-readout" });
    const sl = slider(t("Last server time (s)", "Waktu server terakhir (dtk)"), 3, 30, 1, last, v => { last = v; draw(); });

    function draw() {
      const data = [...base, last];
      const mean = data.reduce((a, b) => a + b, 0) / data.length;
      const sorted = [...data].sort((a, b) => a - b);
      const median = sorted[2];
      svg.replaceChildren();
      svg.append(s("line", { x1: X(0), y1: AXIS, x2: X(30), y2: AXIS, class: "ax" }));
      for (let v = 0; v <= 30; v += 5) {
        svg.append(s("line", { x1: X(v), y1: AXIS, x2: X(v), y2: AXIS + 5, class: "ax" }));
        svg.append(s("text", { x: X(v), y: AXIS + 20, class: "m", "font-size": 12, "text-anchor": "middle" }, String(v)));
      }
      const seen = {};
      data.forEach((v, i) => {
        const k = (seen[v] = (seen[v] || 0) + 1) - 1;
        svg.append(s("circle", { cx: X(v), cy: AXIS - 10 - k * 18, r: 8, class: i === 4 ? "dot hot" : "dot" }));
      });
      // median: dashed line; mean: fulcrum triangle under the axis
      svg.append(s("line", { x1: X(median), y1: 16, x2: X(median), y2: AXIS, class: "c1 curve", "stroke-dasharray": "5 4" }));
      svg.append(s("text", { x: X(median) + 6, y: 20, class: "lbl c1", "font-size": 13 }, t("median", "median") + " = " + num(median, 0)));
      svg.append(s("path", { d: `M${X(mean)},${AXIS + 2} l-9,16 h18 z`, class: "fulcrum" }));
      svg.append(s("text", { x: X(mean), y: AXIS + 44, class: "lbl c4", "font-size": 13, "text-anchor": "middle" },
        t("mean", "rata-rata") + " = " + num(mean)));
      readout.innerHTML = "";
      readout.append(
        h("div", {}, t("Data: ", "Data: ") + data.join(", ") + t(" s", " dtk")),
        h("div", {}, `x̄ = (${data.join(" + ")}) / 5 = ${num(mean)}  ·  x̃ = ${num(median, 0)}`),
        h("div", { class: "muted" }, last >= 10
          ? t("One slow value drags the mean (the balance point) toward it. The median, the middle position, doesn't move.",
              "Satu nilai lambat menarik rata-rata (titik keseimbangan) ke arahnya. Median, posisi tengah, tidak bergeser.")
          : t("Drag the slider to make the last server slow. Watch which center moves.",
              "Geser slider agar server terakhir lambat. Perhatikan ukuran pusat mana yang bergeser.")));
    }
    root.append(h("div", { class: "demo-controls" }, sl.wrap,
      button(t("Slide example: 13 s", "Contoh slide: 13 dtk"), () => { sl.input.value = 13; last = 13; sl.show(); draw(); })),
      h("div", { class: "fig" }, svg), readout);
    draw();
  };

  // ---- S01: spread builder ------------------------------------------------------------------
  DEMOS["spread"] = function (root, lang) {
    const { t, num } = makeT(lang);
    let data = [2, 4, 6];
    const W = 600, X = v => 40 + (v / 10) * 520;
    const svg = svgBox(W, 200);
    const sliders = h("div", { class: "demo-controls" });
    const table = h("div", { class: "demo-readout" });

    function rebuildSliders() {
      sliders.replaceChildren(...data.map((v, i) => slider(`x${"₁₂₃₄₅₆"[i]}`, 0, 10, 1, v, nv => { data[i] = nv; draw(); }).wrap));
    }
    function draw() {
      const n = data.length;
      const mean = data.reduce((a, b) => a + b, 0) / n;
      const devs = data.map(v => v - mean);
      const Sxx = devs.reduce((a, d) => a + d * d, 0);
      const s2 = Sxx / (n - 1), sd = Math.sqrt(s2);
      const H = 50 + n * 24;
      svg.setAttribute("viewBox", `0 0 ${W} ${H + 30}`);
      svg.replaceChildren();
      // x̄ ± s band
      svg.append(s("rect", { x: X(Math.max(0, mean - sd)), y: 10, width: X(Math.min(10, mean + sd)) - X(Math.max(0, mean - sd)), height: H - 10, class: "band" }));
      svg.append(s("line", { x1: X(mean), y1: 6, x2: X(mean), y2: H, class: "curve c4" }));
      svg.append(s("text", { x: X(mean), y: H + 26, class: "lbl c4", "font-size": 13, "text-anchor": "middle" }, "x̄ = " + num(mean)));
      data.forEach((v, i) => {
        const y = 30 + i * 24;
        svg.append(s("line", { x1: X(mean), y1: y, x2: X(v), y2: y, class: "curve " + (v >= mean ? "c2" : "c6") }));
        svg.append(s("circle", { cx: X(v), cy: y, r: 7, class: "dot" }));
        svg.append(s("text", { x: X(v) + (v >= mean ? 12 : -12), y: y + 4, class: "t", "font-size": 12, "text-anchor": v >= mean ? "start" : "end" },
          (devs[i] >= 0 ? "+" : "") + num(devs[i])));
      });
      svg.append(s("line", { x1: X(0), y1: H, x2: X(10), y2: H, class: "ax" }));
      for (let v = 0; v <= 10; v++) svg.append(s("text", { x: X(v), y: H + 14, class: "m", "font-size": 11, "text-anchor": "middle" }, String(v)));
      svg.append(s("text", { x: X(Math.min(10, mean + sd)) - 4, y: 22, class: "m", "font-size": 12, "text-anchor": "end" }, "x̄ ± s"));

      const rows = data.map((v, i) => h("tr", {}, h("td", {}, String(v)), h("td", {}, num(devs[i])), h("td", {}, num(devs[i] ** 2))));
      table.replaceChildren(
        h("table", { class: "demo-table" },
          h("tr", {}, h("th", {}, "xᵢ"), h("th", {}, "xᵢ − x̄"), h("th", {}, "(xᵢ − x̄)²")),
          ...rows,
          h("tr", { class: "sum" }, h("td", {}, "Σ"), h("td", {}, num(Math.abs(devs.reduce((a, b) => a + b, 0)) < 1e-9 ? 0 : devs.reduce((a, b) => a + b, 0))), h("td", {}, "Sxx = " + num(Sxx)))),
        h("div", {}, `s² = Sxx / (n − 1) = ${num(Sxx)} / ${n - 1} = ${num(s2)}   ·   s = √s² = ${num(sd)}`),
        h("div", { class: "muted" }, t("The deviations always add to 0, so we square them. Spread the dots out and s grows; stack them on one value and s = 0.",
          "Deviasi selalu berjumlah 0, jadi kita kuadratkan. Sebarkan titik-titiknya dan s membesar; tumpuk di satu nilai dan s = 0.")));
    }
    const set = arr => { data = arr; rebuildSliders(); draw(); };
    root.append(
      h("div", { class: "demo-controls" },
        button("2, 4, 6", () => set([2, 4, 6])),
        button("4, 4, 4", () => set([4, 4, 4])),
        button("3, 4, 5", () => set([3, 4, 5])),
        button("1, 4, 7", () => set([1, 4, 7])),
        button(t("+ value", "+ nilai"), () => { if (data.length < 6) set([...data, 5]); }),
        button(t("− value", "− nilai"), () => { if (data.length > 2) set(data.slice(0, -1)); })),
      sliders, h("div", { class: "fig" }, svg), table);
    rebuildSliders();
    draw();
  };

  // ---- S02: long-run relative frequency ---------------------------------------------------
  DEMOS["long-run"] = function (root, lang) {
    const { t, num } = makeT(lang);
    let p = 0.5, n = 0, k = 0, hist = [], last = [];
    const W = 600, H = 220, L = 46, R = 16, T = 12, B = 34;
    const svg = svgBox(W, H);
    const readout = h("div", { class: "demo-readout" });
    const sl = slider("P(A)", 0.1, 0.9, 0.1, p, v => { p = v; reset(); });

    function flip(times) {
      for (let i = 0; i < times && n < 20000; i++) {
        const hit = Math.random() < p;
        n++; if (hit) k++;
        hist.push(k / n);
        last.push(hit ? "A" : "–");
      }
      last = last.slice(-20);
      draw();
    }
    function reset() { n = 0; k = 0; hist = []; last = []; draw(); }
    function draw() {
      svg.replaceChildren();
      const pw = W - L - R, ph = H - T - B;
      const X = i => L + (n <= 1 ? 0 : (i / (n - 1)) * pw), Y = v => T + ph - v * ph;
      for (const v of [0, 0.25, 0.5, 0.75, 1]) {
        svg.append(s("line", { x1: L, y1: Y(v), x2: L + pw, y2: Y(v), class: "grid" }));
        svg.append(s("text", { x: L - 8, y: Y(v) + 4, class: "m", "font-size": 11, "text-anchor": "end" }, num(v)));
      }
      svg.append(s("line", { x1: L, y1: Y(p), x2: L + pw, y2: Y(p), class: "curve c6", "stroke-dasharray": "6 5" }));
      svg.append(s("text", { x: L + pw, y: Y(p) - 6, class: "lbl c6", "font-size": 12, "text-anchor": "end" }, "P(A) = " + num(p, 1)));
      if (hist.length) {
        const step = Math.max(1, Math.floor(hist.length / 600));
        const pts = [];
        for (let i = 0; i < hist.length; i += step) pts.push(`${X(i).toFixed(1)},${Y(hist[i]).toFixed(1)}`);
        pts.push(`${X(hist.length - 1).toFixed(1)},${Y(hist[hist.length - 1]).toFixed(1)}`);
        svg.append(s("polyline", { points: pts.join(" "), class: "curve c1" }));
      }
      svg.append(s("text", { x: L + pw / 2, y: H - 6, class: "m", "font-size": 12, "text-anchor": "middle" },
        t("number of repetitions n", "banyak pengulangan n") + (n ? ` (1 … ${n})` : "")));
      fill(readout, 
        h("div", {}, n ? `n(A)/n = ${k}/${n} = ${num(k / n, 3)}` : t("Press a button to start repeating the experiment.", "Tekan tombol untuk mulai mengulang eksperimen.")),
        n ? h("div", { class: "mono" }, t("Last results: ", "Hasil terakhir: ") + last.join(" ")) : null,
        h("div", { class: "muted" }, t("Short runs jump around; over many repetitions the share settles near P(A). Every press uses real random draws.",
          "Rangkaian pendek naik-turun; setelah banyak pengulangan, proporsinya mendekati P(A). Setiap tekanan memakai undian acak sungguhan.")));
    }
    root.append(h("div", { class: "demo-controls" }, sl.wrap,
      button("+1", () => flip(1)), button("+10", () => flip(10)), button("+100", () => flip(100)),
      button("+1000", () => flip(1000)), button(t("Reset", "Ulang"), reset)),
      h("div", { class: "fig" }, svg), readout);
    draw();
  };

  // ---- S02: Venn calculator ---------------------------------------------------------------
  DEMOS["venn"] = function (root, lang) {
    const { t, num } = makeT(lang);
    let a = 0.6, b = 0.8, ab = 0.5, query = "union";
    const id = "v" + Math.random().toString(36).slice(2, 8);
    const W = 600, H = 300;
    const svg = svgBox(W, H, 280);
    const readout = h("div", { class: "demo-readout" });
    const sa = slider("P(A)", 0, 1, 0.01, a, v => { a = v; draw(); });
    const sb = slider("P(B)", 0, 1, 0.01, b, v => { b = v; draw(); });
    const sab = slider("P(A ∩ B)", 0, 1, 0.01, ab, v => { ab = v; draw(); });
    const QUERIES = {
      union: [t("At least one (A ∪ B)", "Paling sedikit satu (A ∪ B)"), ["aonly", "both", "bonly"]],
      exactly: [t("Exactly one", "Tepat satu"), ["aonly", "bonly"]],
      both: [t("Both (A ∩ B)", "Keduanya (A ∩ B)"), ["both"]],
      aonly: [t("A only", "Hanya A"), ["aonly"]],
      neither: [t("Neither", "Tidak keduanya"), ["neither"]],
    };
    const qButtons = Object.entries(QUERIES).map(([key, [label]]) => {
      const btn = button(label, () => { query = key; draw(); });
      btn.dataset.key = key;
      return btn;
    });

    const cA = { cx: 245, cy: 150, r: 105 }, cB = { cx: 355, cy: 150, r: 105 };
    const S = { x: 20, y: 18, width: 560, height: 264 };
    function draw() {
      const r2 = x => Math.round(x * 100) / 100;
      const err = ab > Math.min(a, b) + 1e-9 ? t("Impossible: P(A ∩ B) can't be bigger than P(A) or P(B).", "Mustahil: P(A ∩ B) tidak boleh lebih besar dari P(A) atau P(B).")
        : a + b - ab > 1 + 1e-9 ? t("Impossible: P(A ∪ B) = P(A) + P(B) − P(A ∩ B) would be more than 1.", "Mustahil: P(A ∪ B) = P(A) + P(B) − P(A ∩ B) akan lebih dari 1.")
        : null;
      const region = { aonly: r2(a - ab), both: r2(ab), bonly: r2(b - ab), neither: r2(1 - (a + b - ab)) };
      const on = QUERIES[query][1];
      svg.replaceChildren(
        s("defs", {},
          s("clipPath", { id: id + "cB" }, s("circle", cB)),
          s("mask", { id: id + "nA" }, s("rect", { ...S, fill: "white" }), s("circle", { ...cA, fill: "black" })),
          s("mask", { id: id + "nB" }, s("rect", { ...S, fill: "white" }), s("circle", { ...cB, fill: "black" })),
          s("mask", { id: id + "nAB" }, s("rect", { ...S, fill: "white" }), s("circle", { ...cA, fill: "black" }), s("circle", { ...cB, fill: "black" }))),
        s("rect", { ...S, rx: 8, class: "box" }),
        s("rect", { ...S, rx: 8, mask: `url(#${id}nAB)`, class: "region" + (!err && on.includes("neither") ? " on" : "") }),
        s("circle", { ...cA, mask: `url(#${id}nB)`, class: "region" + (!err && on.includes("aonly") ? " on" : "") }),
        s("circle", { ...cB, mask: `url(#${id}nA)`, class: "region" + (!err && on.includes("bonly") ? " on" : "") }),
        s("circle", { ...cA, "clip-path": `url(#${id}cB)`, class: "region" + (!err && on.includes("both") ? " on" : "") }),
        s("circle", { ...cA, class: "outline" }), s("circle", { ...cB, class: "outline" }),
        s("text", { x: 36, y: 42, class: "m", "font-size": 14 }, "𝒮"),
        s("text", { x: 170, y: 64, class: "t", "font-size": 24, "font-weight": 700 }, "A"),
        s("text", { x: 420, y: 64, class: "t", "font-size": 24, "font-weight": 700 }, "B"),
        ...(err ? [] : [
          s("text", { x: 190, y: 156, class: "t", "font-size": 22, "text-anchor": "middle" }, num(region.aonly)),
          s("text", { x: 300, y: 156, class: "t", "font-size": 22, "text-anchor": "middle" }, num(region.both)),
          s("text", { x: 410, y: 156, class: "t", "font-size": 22, "text-anchor": "middle" }, num(region.bonly)),
          s("text", { x: 548, y: 268, class: "t", "font-size": 22, "text-anchor": "end" }, num(region.neither))]));
      qButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.key === query));
      const f = {
        union: `P(A ∪ B) = P(A) + P(B) − P(A ∩ B) = ${num(a)} + ${num(b)} − ${num(ab)} = ${num(a + b - ab)}`,
        exactly: `P(A only) + P(B only) = (${num(a)} − ${num(ab)}) + (${num(b)} − ${num(ab)}) = ${num(a + b - 2 * ab)}`,
        both: `P(A ∩ B) = ${num(ab)}`,
        aonly: `P(A ∩ B′) = P(A) − P(A ∩ B) = ${num(a)} − ${num(ab)} = ${num(a - ab)}`,
        neither: `P((A ∪ B)′) = 1 − P(A ∪ B) = 1 − ${num(a + b - ab)} = ${num(1 - (a + b - ab))}`,
      }[query];
      fill(readout, 
        err ? h("div", { class: "warn" }, err) : h("div", { class: "mono" }, f),
        h("div", { class: "muted" }, t("Start: the slide's household example (Internet 0.6, TV 0.8, both 0.5). Note how 'at least one' includes the overlap and 'exactly one' leaves it out.",
          "Awal: contoh rumah tangga di slide (Internet 0,6, TV 0,8, keduanya 0,5). Perhatikan 'paling sedikit satu' mencakup irisan, 'tepat satu' tidak.")));
    }
    root.append(h("div", { class: "demo-controls" }, sa.wrap, sb.wrap, sab.wrap),
      h("div", { class: "demo-controls" }, ...qButtons),
      h("div", { class: "fig" }, svg), readout);
    draw();
  };

  // ---- S03: permutations collapse into combinations ---------------------------------------
  DEMOS["order-or-not"] = function (root, lang) {
    const { t } = makeT(lang);
    const people = ["A", "B", "C", "D", "E"];
    const groups = [];
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) for (let k = j + 1; k < 5; k++) groups.push([people[i], people[j], people[k]]);
    const perms = g => [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(o => o.map(i => g[i]));
    let mode = "officers";
    const grid = h("div", { class: "perm-grid" });
    const readout = h("div", { class: "demo-readout" });
    const bOff = button(t("Officers: order by role matters", "Pengurus: urutan peran berpengaruh"), () => { mode = "officers"; draw(); });
    const bDel = button(t("Delegates: only the group matters", "Delegasi: hanya kelompoknya"), () => { mode = "delegates"; draw(); });

    groups.forEach(g => {
      const row = h("div", { class: "perm-row" });
      perms(g).forEach((p, i) => row.append(h("span", { class: "chip" + (i ? " dup-able" : " first"), "data-set": "{" + g.join(", ") + "}" }, p.join(" "))));
      row.append(h("span", { class: "perm-count" }));
      grid.append(row);
    });
    function draw() {
      const del = mode === "delegates";
      bOff.classList.toggle("active", !del);
      bDel.classList.toggle("active", del);
      grid.classList.toggle("collapsed", del);
      grid.querySelectorAll(".chip.first").forEach(c => { c.textContent = del ? c.dataset.set : c.dataset.set.slice(1, -1).split(", ").join(" "); });
      grid.querySelectorAll(".perm-count").forEach(c => { c.textContent = del ? "× 3! = 6 → 1" : ""; });
      fill(readout, 
        h("div", { class: "mono" }, del
          ? "C(5,3) = P(3,5) / 3! = 60 / 6 = 10"
          : "P(3,5) = 5 · 4 · 3 = 60"),
        h("div", { class: "muted" }, del
          ? t("Each row holds the same 3 people in 3! = 6 orders. As delegates they are ONE group, so the 6 lists collapse into 1.",
              "Setiap baris berisi 3 orang yang sama dalam 3! = 6 urutan. Sebagai delegasi mereka SATU kelompok, jadi 6 daftar melebur menjadi 1.")
          : t("Read 'A B C' as chair A, vice-chair B, secretary C. Swapping two people changes the assignment, so all 60 lists are different outcomes.",
              "Baca 'A B C' sebagai ketua A, wakil B, sekretaris C. Menukar dua orang mengubah susunan, jadi ke-60 daftar adalah hasil berbeda.")));
    }
    root.append(h("div", { class: "demo-controls" }, bOff, bDel), grid, readout);
    draw();
  };

  // ---- S04: Bayes base rate on 1000 people --------------------------------------------------
  DEMOS["bayes"] = function (root, lang) {
    const { t, num } = makeT(lang);
    let prior = 0.1, sens = 0.8, fpr = 0.2;
    const COLS = 40, ROWS = 25, C = 14;
    const svg = svgBox(COLS * C + 4, ROWS * C + 4, 260);
    const readout = h("div", { class: "demo-readout" });
    const sP = slider(t("P(D) prior", "P(D) prior"), 0.01, 0.5, 0.01, prior, v => { prior = v; draw(); });
    const sS = slider("P(+ | D)", 0.5, 1, 0.01, sens, v => { sens = v; draw(); });
    const sF = slider("P(+ | D′)", 0, 0.5, 0.01, fpr, v => { fpr = v; draw(); });
    const cells = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      const r = s("rect", { x: 2 + (i % COLS) * C, y: 2 + Math.floor(i / COLS) * C, width: C - 2, height: C - 2, rx: 2 });
      cells.push(r); svg.append(r);
    }
    const legend = h("div", { class: "demo-legend" });
    function draw() {
      const D = Math.round(1000 * prior), TP = Math.round(D * sens), FN = D - TP;
      const FP = Math.round((1000 - D) * fpr), TN = 1000 - D - FP;
      const kinds = [...Array(TP).fill("tp"), ...Array(FN).fill("fn"), ...Array(FP).fill("fp"), ...Array(TN).fill("tn")];
      cells.forEach((c, i) => c.setAttribute("class", "person " + kinds[i]));
      const post = (prior * sens) / (prior * sens + (1 - prior) * fpr);
      legend.replaceChildren(
        h("span", {}, h("i", { class: "sw tp" }), `${TP} ` + t("sick, test +", "sakit, tes +")),
        h("span", {}, h("i", { class: "sw fn" }), `${FN} ` + t("sick, test −", "sakit, tes −")),
        h("span", {}, h("i", { class: "sw fp" }), `${FP} ` + t("healthy, test + (false positive)", "sehat, tes + (positif palsu)")),
        h("span", {}, h("i", { class: "sw tn" }), `${TN} ` + t("healthy, test −", "sehat, tes −")));
      fill(readout, 
        h("div", {}, t(`Out of ${TP + FP} people who test positive, only ${TP} are sick.`, `Dari ${TP + FP} orang yang tesnya positif, hanya ${TP} yang sakit.`)),
        h("div", { class: "mono" }, `P(D | +) = P(D)P(+|D) / [P(D)P(+|D) + P(D′)P(+|D′)] = ${num(prior * sens, 3)} / ${num(prior * sens + (1 - prior) * fpr, 3)} = ${num(post, 3)}`),
        h("div", { class: "bayes-compare" },
          h("span", {}, t("likelihood ", "likelihood ") + "P(+ | D) = ", h("b", {}, num(sens))),
          h("span", {}, t("posterior ", "posterior ") + "P(D | +) = ", h("b", {}, num(post)))),
        h("div", { class: "muted" }, t("Lower the prior and watch the false positives (orange) swamp the true positives. Each square is one of 1000 people (counts rounded).",
          "Turunkan prior dan lihat positif palsu (oranye) mengalahkan positif benar. Setiap kotak adalah satu dari 1000 orang (jumlah dibulatkan).")));
    }
    const preset = (p, se, f) => () => {
      prior = p; sens = se; fpr = f;
      [[sP, p], [sS, se], [sF, f]].forEach(([sl, v]) => { sl.input.value = v; sl.show(); });
      draw();
    };
    root.append(
      h("div", { class: "demo-controls" }, sP.wrap, sS.wrap, sF.wrap),
      h("div", { class: "demo-controls" },
        button(t("Core 4: 1/10, 4/5, 1/5", "Core 4: 1/10, 4/5, 1/5"), preset(0.1, 0.8, 0.2)),
        button(t("Optional B: 1/20, 9/10, 1/10", "Opsional B: 1/20, 9/10, 1/10"), preset(0.05, 0.9, 0.1))),
      h("div", { class: "fig" }, svg), legend, readout);
    draw();
  };

  // ---- S05: PMF ↔ CDF ------------------------------------------------------------------------
  DEMOS["pmf-cdf"] = function (root, lang) {
    const { t, num } = makeT(lang);
    const xs = [1, 2, 4, 8, 16];
    let mass = [5, 10, 35, 40, 10];          // in hundredths, so sums stay exact
    let a = 2, b = 8;
    const W = 600, L = 46, R = 16, XMAX = 18, X = v => L + (v / XMAX) * (W - L - R);
    const svg = svgBox(W, 350);
    const readout = h("div", { class: "demo-readout" });
    const sliders = xs.map((x, i) => {
      const sl = slider(`p(${x})`, 0, 1, 0.01, mass[i] / 100, v => { mass[i] = Math.round(v * 100); draw(); });
      return sl.wrap;
    });
    const inA = h("input", { type: "number", min: 0, max: 17, value: a, class: "num" });
    const inB = h("input", { type: "number", min: 0, max: 17, value: b, class: "num" });
    inA.addEventListener("input", () => { a = Math.max(0, Math.min(17, Math.round(+inA.value || 0))); draw(); });
    inB.addEventListener("input", () => { b = Math.max(0, Math.min(17, Math.round(+inB.value || 0))); draw(); });
    const F = x => xs.reduce((acc, v, i) => acc + (v <= x ? mass[i] : 0), 0);  // hundredths

    function draw() {
      const total = mass.reduce((p, q) => p + q, 0);
      svg.replaceChildren();
      // PMF panel (top) and CDF panel (bottom)
      const P = { top: 30, h: 110 }, Q = { top: 200, h: 110 };
      for (const [panel, title] of [[P, "p(y)"], [Q, "F(y)"]]) {
        const Y = v => panel.top + panel.h - v * panel.h;
        for (const v of [0, 0.5, 1]) {
          svg.append(s("line", { x1: L, y1: Y(v), x2: W - R, y2: Y(v), class: "grid" }));
          svg.append(s("text", { x: L - 8, y: Y(v) + 4, class: "m", "font-size": 11, "text-anchor": "end" }, num(v, 1)));
        }
        svg.append(s("text", { x: L, y: panel.top - 12, class: "t", "font-size": 13, "font-weight": 700 }, title));
        for (const x of xs) svg.append(s("text", { x: X(x), y: panel.top + panel.h + 15, class: "m", "font-size": 11, "text-anchor": "middle" }, String(x)));
      }
      const YP = v => P.top + P.h - v * P.h, YQ = v => Q.top + Q.h - Math.min(v, 1.2) * Q.h;
      xs.forEach((x, i) => {
        const inRange = x >= a && x <= b;
        svg.append(s("rect", { x: X(x) - 9, y: YP(mass[i] / 100), width: 18, height: P.h * mass[i] / 100, class: "bar " + (inRange ? "c4" : "c1"), rx: 2 }));
        svg.append(s("text", { x: X(x), y: YP(mass[i] / 100) - 4, class: "t", "font-size": 11, "text-anchor": "middle" }, num(mass[i] / 100)));
      });
      // CDF steps: flat between values, filled dot at each jump
      const edges = [0, ...xs, XMAX];
      for (let i = 0; i < edges.length - 1; i++) {
        const level = F(edges[i]) / 100;
        svg.append(s("line", { x1: X(edges[i]), y1: YQ(level), x2: X(edges[i + 1]), y2: YQ(level), class: "curve c2" }));
        if (i > 0) svg.append(s("circle", { cx: X(edges[i]), cy: YQ(level), r: 4, class: "stepdot" }));
      }
      // query markers on the CDF
      for (const [x, cls] of [[b, "c4"], [a - 1, "c6"]]) {
        if (x < 0) continue;
        svg.append(s("line", { x1: X(x), y1: Q.top, x2: X(x), y2: Q.top + Q.h, class: "curve " + cls, "stroke-dasharray": "4 4" }));
      }
      const Fb = F(b) / 100, Fa1 = a - 1 >= 0 ? F(a - 1) / 100 : 0;
      fill(readout, 
        total !== 100 ? h("div", { class: "warn" }, t(`Not a valid pmf: the masses add to ${num(total / 100)}, not 1.`, `Bukan PMF yang sah: total massanya ${num(total / 100)}, bukan 1.`)) : null,
        h("div", { class: "mono" }, b < a ? t("Empty interval: b < a.", "Interval kosong: b < a.")
          : `P(${a} ≤ Y ≤ ${b}) = F(${b}) − F(${a - 1}) = ${num(Fb)} − ${num(Fa1)} = ${num(Fb - Fa1)}`),
        h("div", { class: "muted" }, t("Orange bars are inside the interval. On the cdf, the orange line is F(b) and the red line is F(a − 1): subtracting F(a − 1), not F(a), keeps the mass at a.",
          "Batang oranye berada di dalam interval. Pada cdf, garis oranye adalah F(b) dan garis merah F(a − 1): mengurangkan F(a − 1), bukan F(a), menjaga massa di a.")));
    }
    // The a/b inputs live outside the readout so redrawing never steals focus while typing.
    root.append(h("div", { class: "demo-controls" }, ...sliders),
      h("div", { class: "fig" }, svg),
      h("div", { class: "demo-controls" }, h("span", {}, "P("), inA, h("span", {}, " ≤ Y ≤ "), inB, h("span", {}, ")")),
      readout);
    draw();
  };

  window.DEMOS = DEMOS;
})();
