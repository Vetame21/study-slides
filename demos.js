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
      const str = (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace("-", "−");   // real minus sign
      return (lang === "id" ? str.replace(".", ",") : str).replace(/^−(0[.,]?0*)$/, "$1");   // no "−0.00"
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

  // =====================================================================================
  // Physics (College Physics 2, Ch 21–23)
  // =====================================================================================
  const K = 8.99e9, EPS0 = 8.85e-12;
  const SUP = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };

  // 1.08e-8 → "1.08 × 10⁻⁸" (decimal comma in Indonesian)
  function sci(x, lang, d = 2) {
    if (!isFinite(x)) return "∞";
    if (x === 0) return "0";
    let e = Math.floor(Math.log10(Math.abs(x)));
    let m = x / 10 ** e;
    if (Math.abs(+m.toFixed(d)) >= 10) { m /= 10; e += 1; }
    let str = e === 0 ? m.toFixed(d) : `${m.toFixed(d)} × 10${String(e).split("").map(c => SUP[c]).join("")}`;
    return lang === "id" ? str.replace(".", ",") : str;
  }

  // Line plus a filled triangular head, in SVG units.
  function arrow(x1, y1, x2, y2, cls, head = 8) {
    const a = Math.atan2(y2 - y1, x2 - x1), len = Math.hypot(x2 - x1, y2 - y1);
    if (len < 1) return [];
    const h = Math.min(head, len * 0.6);
    const p = (r, t) => `${x2 - h * Math.cos(a - t)},${y2 - h * Math.sin(a - t)}`;
    return [s("line", { x1, y1, x2: x2 - h * 0.5 * Math.cos(a), y2: y2 - h * 0.5 * Math.sin(a), class: "vec " + cls }),
            s("polygon", { points: `${x2},${y2} ${p(0, 0.45)} ${p(0, -0.45)}`, class: "vechead " + cls })];
  }

  // World coordinates (metres) ↔ SVG pixels.
  function worldMap(W, H, xmin, xmax, ymin, ymax) {
    const sx = W / (xmax - xmin), sy = H / (ymax - ymin);
    return { X: x => (x - xmin) * sx, Y: y => H - (y - ymin) * sy, xmin, xmax, ymin, ymax, scale: sx };
  }

  // Pointer position in SVG units, for dragging.
  function svgPoint(svg, e) {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  // Field of point charges in the plane; q in nC, positions in m → E in N/C.
  function fieldAt(charges, x, y) {
    let ex = 0, ey = 0;
    for (const c of charges) {
      const dx = x - c.x, dy = y - c.y, r2 = dx * dx + dy * dy;
      if (r2 < 1e-9) continue;
      const f = K * c.q * 1e-9 / (r2 * Math.sqrt(r2));
      ex += f * dx; ey += f * dy;
    }
    return [ex, ey];
  }

  // Field lines: start around each positive charge (or each negative one, traced backwards,
  // when there are no positives) and follow E until leaving the view or hitting a charge.
  function traceLines(charges, m) {
    const pos = charges.filter(c => c.q > 0);
    const sources = pos.length ? pos : charges.filter(c => c.q < 0);
    const dir = pos.length ? 1 : -1, lines = [], ds = 0.05;
    const unit = (x, y) => { const [ex, ey] = fieldAt(charges, x, y); const n = Math.hypot(ex, ey) || 1; return [dir * ex / n, dir * ey / n]; };
    for (const c of sources) {
      const n = Math.min(24, Math.max(6, Math.round(6 * Math.abs(c.q))));
      for (let i = 0; i < n; i++) {
        const a = (2 * Math.PI * (i + 0.5)) / n;
        let x = c.x + 0.1 * Math.cos(a), y = c.y + 0.1 * Math.sin(a);
        const pts = [[x, y]];
        for (let step = 0; step < 600; step++) {
          const [ux, uy] = unit(x, y);
          const [vx, vy] = unit(x + ux * ds / 2, y + uy * ds / 2);   // midpoint (RK2) step
          x += vx * ds; y += vy * ds;
          pts.push([x, y]);
          if (x < m.xmin - 1 || x > m.xmax + 1 || y < m.ymin - 1 || y > m.ymax + 1) break;
          if (charges.some(o => o !== c && Math.hypot(x - o.x, y - o.y) < 0.09)) break;
        }
        lines.push(pts);
      }
    }
    return lines;
  }

  // Shared drawing of charges + field lines; returns the <g> nodes to append.
  function drawCharges(m, charges, lines, selected = -1) {
    const out = [];
    for (const pts of lines) {
      out.push(s("polyline", { points: pts.map(([x, y]) => `${m.X(x).toFixed(1)},${m.Y(y).toFixed(1)}`).join(" "), class: "fline" }));
      // one small direction chevron near the middle of each line
      const k = Math.floor(pts.length / 2);
      if (pts.length > 6) out.push(...arrow(m.X(pts[k - 2][0]), m.Y(pts[k - 2][1]), m.X(pts[k][0]), m.Y(pts[k][1]), "fdir", 6));
    }
    charges.forEach((c, i) => {
      out.push(s("circle", { cx: m.X(c.x), cy: m.Y(c.y), r: 11 + Math.min(6, Math.abs(c.q)), class: "charge " + (c.q > 0 ? "pos" : "neg") + (i === selected ? " sel" : "") }));
      out.push(s("text", { x: m.X(c.x), y: m.Y(c.y) + 4, class: "chg-t", "font-size": 11, "text-anchor": "middle" }, (c.q > 0 ? "+" : "−") + Math.abs(c.q)));
    });
    return out;
  }

  // Drag handling on an SVG: hit(pt) returns a key or null; move(key, worldX, worldY).
  function enableDrag(svg, m, hit, move) {
    let key = null;
    svg.style.touchAction = "none";
    svg.addEventListener("pointerdown", e => {
      const p = svgPoint(svg, e);
      key = hit((p.x / m.scale) + m.xmin, m.ymin + (svg.viewBox.baseVal.height - p.y) / m.scale);
      if (key !== null) { svg.setPointerCapture(e.pointerId); e.preventDefault(); }
    });
    svg.addEventListener("pointermove", e => {
      if (key === null) return;
      const p = svgPoint(svg, e);
      const x = Math.max(m.xmin, Math.min(m.xmax, p.x / m.scale + m.xmin));
      const y = Math.max(m.ymin, Math.min(m.ymax, m.ymin + (svg.viewBox.baseVal.height - p.y) / m.scale));
      move(key, x, y);
    });
    const end = () => { key = null; };
    svg.addEventListener("pointerup", end);
    svg.addEventListener("pointercancel", end);
  }

  // Redraw at most once per animation frame while dragging.
  function frameThrottle(fn) {
    let queued = false;
    return () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; fn(); }); } };
  }

  // ---- Ch 21: Coulomb force lab ------------------------------------------------------------
  DEMOS["coulomb"] = function (root, lang) {
    const { t, num } = makeT(lang);
    let q1 = 3, q2 = -2, r = 2;   // μC, μC, m
    const W = 600, H = 300;
    const svg = svgBox(W, H);
    const readout = h("div", { class: "demo-readout" });
    const s1 = slider("q₁ (μC)", -5, 5, 1, q1, v => { q1 = v; draw(); });
    const s2 = slider("q₂ (μC)", -5, 5, 1, q2, v => { q2 = v; draw(); });
    const sr = slider("r (m)", 0.5, 5, 0.1, r, v => { r = v; draw(); });
    const F = (a, b, d) => K * Math.abs(a * b) * 1e-12 / (d * d);

    function draw() {
      svg.replaceChildren();
      // top: the two charges and their force arrows
      const X = d => 70 + (d / 5) * 440, cy = 70;
      const x1 = X(0), x2 = X(r);
      svg.append(s("line", { x1: x1, y1: cy, x2: x2, y2: cy, class: "grid" }));
      svg.append(s("text", { x: (x1 + x2) / 2, y: cy - 22, class: "m", "font-size": 12, "text-anchor": "middle" }, `r = ${num(r, 1)} m`));
      const f = F(q1, q2, r), repel = q1 * q2 > 0;
      const len = q1 && q2 ? Math.max(14, Math.min(110, 30 * Math.log10(1 + f * 1e3) + 14)) : 0;
      if (len) {
        const d1 = repel ? -1 : 1;   // direction of the force on q1 along +x
        svg.append(...arrow(x1, cy, x1 + d1 * len, cy, "c4", 10), ...arrow(x2, cy, x2 - d1 * len, cy, "c4", 10));
      }
      for (const [x, q, name] of [[x1, q1, "q₁"], [x2, q2, "q₂"]]) {
        svg.append(s("circle", { cx: x, cy, r: 13, class: "charge " + (q > 0 ? "pos" : q < 0 ? "neg" : "zero") }));
        svg.append(s("text", { x, y: cy + 4, class: "chg-t", "font-size": 12, "text-anchor": "middle" }, q > 0 ? "+" : q < 0 ? "−" : "0"));
        svg.append(s("text", { x, y: cy + 34, class: "t", "font-size": 12, "text-anchor": "middle" }, `${name} = ${q} μC`));
      }
      // bottom: F(r) curve for these charges, showing the inverse square
      const P = { x: 70, y: 140, w: 440, h: 130 }, Fmax = F(q1, q2, 0.5) || 1;
      svg.append(s("line", { x1: P.x, y1: P.y + P.h, x2: P.x + P.w, y2: P.y + P.h, class: "ax" }));
      svg.append(s("line", { x1: P.x, y1: P.y, x2: P.x, y2: P.y + P.h, class: "ax" }));
      svg.append(s("text", { x: P.x - 6, y: P.y + 10, class: "m", "font-size": 11, "text-anchor": "end" }, "F"));
      svg.append(s("text", { x: P.x + P.w, y: P.y + P.h + 16, class: "m", "font-size": 11, "text-anchor": "end" }, "r (m)"));
      for (const d of [1, 2, 3, 4, 5]) svg.append(s("text", { x: X(d), y: P.y + P.h + 16, class: "m", "font-size": 11, "text-anchor": "middle" }, String(d)));
      if (q1 && q2) {
        const pts = [];
        for (let d = 0.5; d <= 5.001; d += 0.05) pts.push(`${X(d).toFixed(1)},${(P.y + P.h - (F(q1, q2, d) / Fmax) * P.h).toFixed(1)}`);
        svg.append(s("polyline", { points: pts.join(" "), class: "curve c1" }));
        const py = P.y + P.h - (f / Fmax) * P.h;
        svg.append(s("line", { x1: X(r), y1: py, x2: X(r), y2: P.y + P.h, class: "curve c4", "stroke-dasharray": "4 4" }));
        svg.append(s("circle", { cx: X(r), cy: py, r: 5, class: "stepdot" }));
      }
      fill(readout,
        h("div", { class: "mono" }, `F = k|q₁||q₂|/r² = 8.99×10⁹ · ${Math.abs(q1)}×10⁻⁶ · ${Math.abs(q2)}×10⁻⁶ / ${num(r, 1)}² = ${sci(f, lang)} N`),
        h("div", {}, !q1 || !q2 ? t("One charge is zero: no force.", "Satu muatan nol: tidak ada gaya.")
          : repel ? t("Same signs → they REPEL (arrows point apart).", "Tanda sama → TOLAK-MENOLAK (panah saling menjauh).")
                  : t("Opposite signs → they ATTRACT (arrows point together).", "Tanda berlawanan → TARIK-MENARIK (panah saling mendekat).")),
        h("div", { class: "muted" }, t("Try r = 1 m then r = 2 m: the force drops to a quarter. Each charge feels the same size force (Newton's third law).",
          "Coba r = 1 m lalu r = 2 m: gaya turun menjadi seperempat. Kedua muatan merasakan gaya sama besar (hukum III Newton).")));
    }
    root.append(h("div", { class: "demo-controls" }, s1.wrap, s2.wrap, sr.wrap), h("div", { class: "fig" }, svg), readout);
    draw();
  };

  // ---- Ch 21–22: field explorer ----------------------------------------------------------------
  DEMOS["field-explorer"] = function (root, lang) {
    const { t, num } = makeT(lang);
    const W = 600, H = 420, m = worldMap(W, H, -5, 5, -3.5, 3.5);
    const svg = svgBox(W, H, 300);
    const readout = h("div", { class: "demo-readout" });
    let charges = [], probe = { x: 2, y: 1.5 }, q0 = 1, note = null;
    const sq = slider(t("test charge q₀ (nC)", "muatan uji q₀ (nC)"), -5, 5, 1, q0, v => { q0 = v || 1; redraw(); });
    const PRESETS = {
      single: () => ({ c: [{ x: 0, y: 0, q: 2 }], p: { x: 2, y: 1 }, q0: 1, note: null }),
      dipole: () => ({ c: [{ x: -1, y: 0, q: 2 }, { x: 1, y: 0, q: -2 }], p: { x: 0, y: 1.5 }, q0: 1, note: null }),
      like: () => ({ c: [{ x: -1.3, y: 0, q: 2 }, { x: 1.3, y: 0, q: 2 }], p: { x: 0, y: 0.01 }, q0: 1, note: null }),
      triangle: () => ({ c: [{ x: -2, y: -1.5, q: 6 }, { x: -2, y: 1.5, q: -2 }], p: { x: 2, y: 1.5 }, q0: 5,
        note: t("Ch 21 Example 1: q₁ = +6 nC, q₂ = −2 nC, q₃ = 5 nC at the probe (3-4-5 m triangle). Slide answer: 7.16 × 10⁻⁹ N at 65.2° (it rounds the angle to 37.0°).",
                "Contoh 1 Bab 21: q₁ = +6 nC, q₂ = −2 nC, q₃ = 5 nC di probe (segitiga 3-4-5 m). Jawaban slide: 7,16 × 10⁻⁹ N pada 65,2° (sudutnya dibulatkan 37,0°).") }),
    };
    const load = key => { const p = PRESETS[key](); charges = p.c; probe = p.p; q0 = p.q0; note = p.note; sq.input.value = q0; sq.show(); redraw(); };
    let lines = [];
    const redraw = frameThrottle(() => { lines = traceLines(charges, m); draw(); });

    function draw() {
      svg.replaceChildren(...drawCharges(m, charges, lines));
      const parts = charges.map(c => fieldAt([c], probe.x, probe.y));
      const [ex, ey] = fieldAt(charges, probe.x, probe.y);
      const En = Math.hypot(ex, ey), maxE = Math.max(En, ...parts.map(([a, b]) => Math.hypot(a, b))) || 1;
      const px = m.X(probe.x), py = m.Y(probe.y), L = 95;
      parts.forEach(([a, b]) => svg.append(...arrow(px, py, px + L * a / maxE, py - L * b / maxE, "part", 7)));
      if (En > 0) svg.append(...arrow(px, py, px + L * ex / maxE, py - L * ey / maxE, "net", 11));
      svg.append(s("circle", { cx: px, cy: py, r: 7, class: "probe" }));
      const ang = Math.atan2(ey, ex) * 180 / Math.PI;
      fill(readout,
        h("div", { class: "mono" }, `E = (${sci(ex, lang)}, ${sci(ey, lang)}) N/C   |E| = ${sci(En, lang)} N/C at ${num(ang, 1)}°`),
        h("div", { class: "mono" }, `F = q₀E = ${q0} nC × E → |F| = ${sci(Math.abs(q0) * 1e-9 * En, lang)} N` + (q0 < 0 ? t("  (opposite to E)", "  (berlawanan E)") : "")),
        note ? h("div", {}, note) : null,
        h("div", { class: "muted" }, t("Drag the charges or the probe (●). Thin arrows: each charge's field; thick arrow: the vector sum. Field lines leave + and end on −.",
          "Geser muatan atau probe (●). Panah tipis: medan tiap muatan; panah tebal: jumlah vektornya. Garis medan keluar dari + dan berakhir di −.")));
    }
    enableDrag(svg, m,
      (x, y) => {
        if (Math.hypot(x - probe.x, y - probe.y) < 0.35) return "probe";
        const i = charges.findIndex(c => Math.hypot(x - c.x, y - c.y) < 0.4);
        return i >= 0 ? i : null;
      },
      (key, x, y) => {
        if (key === "probe") { probe = { x, y }; draw(); }
        else { charges[key] = { ...charges[key], x, y }; note = null; redraw(); }
      });
    root.append(
      h("div", { class: "demo-controls" },
        button(t("Single charge", "Satu muatan"), () => load("single")),
        button(t("Dipole", "Dipol"), () => load("dipole")),
        button(t("Two like charges", "Dua muatan sejenis"), () => load("like")),
        button(t("Ch 21 Ex. 1 triangle", "Segitiga Contoh 1 Bab 21"), () => load("triangle"))),
      h("div", { class: "demo-controls" },
        button(t("+ add positive", "+ tambah positif"), () => { if (charges.length < 4) { charges.push({ x: Math.random() * 4 - 2, y: Math.random() * 3 - 1.5, q: 2 }); redraw(); } }),
        button(t("− add negative", "− tambah negatif"), () => { if (charges.length < 4) { charges.push({ x: Math.random() * 4 - 2, y: Math.random() * 3 - 1.5, q: -2 }); redraw(); } }),
        button(t("Remove last", "Hapus terakhir"), () => { charges.pop(); redraw(); }),
        sq.wrap),
      h("div", { class: "fig" }, svg), readout);
    load("dipole");
  };

  // ---- Ch 22: dipole field on its axis, exact vs 2kp/z³ ----------------------------------------
  DEMOS["dipole-axis"] = function (root, lang) {
    const { t, num } = makeT(lang);
    let z = 3;   // in units of d; k = q = d = 1
    const W = 600, H = 260, L = 56, R = 16, T = 14, B = 34;
    const svg = svgBox(W, H);
    const readout = h("div", { class: "demo-readout" });
    const sz = slider("z / d", 0.6, 10, 0.1, z, v => { z = v; draw(); });
    const exact = z => 1 / (z - 0.5) ** 2 - 1 / (z + 0.5) ** 2, approx = z => 2 / z ** 3;
    const ZMIN = 0.6, ZMAX = 10, YMIN = -3, YMAX = 1.5;   // log10(E)
    const X = v => L + ((v - ZMIN) / (ZMAX - ZMIN)) * (W - L - R), Y = lg => T + ((YMAX - lg) / (YMAX - YMIN)) * (H - T - B);
    function draw() {
      svg.replaceChildren();
      for (let lg = YMIN; lg <= YMAX; lg++) {
        svg.append(s("line", { x1: L, y1: Y(lg), x2: W - R, y2: Y(lg), class: "grid" }));
        svg.append(s("text", { x: L - 6, y: Y(lg) + 4, class: "m", "font-size": 11, "text-anchor": "end" }, "10" + String(lg).split("").map(c => SUP[c]).join("")));
      }
      for (const v of [1, 2, 4, 6, 8, 10]) svg.append(s("text", { x: X(v), y: H - 14, class: "m", "font-size": 11, "text-anchor": "middle" }, String(v)));
      svg.append(s("text", { x: W - R, y: H - 2, class: "m", "font-size": 11, "text-anchor": "end" }, "z / d"));
      for (const [fn, cls, label, ly] of [[exact, "c1", t("exact", "eksak"), 0], [approx, "c4", "2kp/z³", 1]]) {
        const pts = [];
        for (let v = ZMIN; v <= ZMAX + 1e-9; v += 0.05) pts.push(`${X(v).toFixed(1)},${Y(Math.max(YMIN - 1, Math.log10(fn(v)))).toFixed(1)}`);
        svg.append(s("polyline", { points: pts.join(" "), class: "curve " + cls, "clip-path": "none", ...(cls === "c4" ? { "stroke-dasharray": "6 5" } : {}) }));
        svg.append(s("text", { x: W - R - 4, y: T + 14 + ly * 16, class: "lbl " + cls, "font-size": 12, "text-anchor": "end" }, label));
      }
      svg.append(s("line", { x1: X(z), y1: T, x2: X(z), y2: H - B, class: "curve c6", "stroke-dasharray": "4 4" }));
      const ex = exact(z), ap = approx(z), err = (ap - ex) / ex * 100;
      fill(readout,
        h("div", { class: "mono" }, `${t("exact", "eksak")}: kq[1/(z − d/2)² − 1/(z + d/2)²] = ${num(ex, 4)}   ·   2kp/z³ = ${num(ap, 4)}   (kq/d² ${t("units", "satuan")})`),
        h("div", {}, t(`The approximation is off by ${num(Math.abs(err), 1)}%.`, `Pendekatannya meleset ${num(Math.abs(err), 1)}%.`)),
        h("div", { class: "muted" }, t("Close to the dipole (z ≈ d) the approximation is poor; by z = 10d it's within about 0.5%. On this log scale, the 1/z³ fall-off is a straight line.",
          "Dekat dipol (z ≈ d) pendekatannya buruk; pada z = 10d selisihnya sekitar 0,5%. Pada skala log ini, penurunan 1/z³ berupa garis lurus.")));
    }
    root.append(h("div", { class: "demo-controls" }, sz.wrap), h("div", { class: "fig" }, svg), readout);
    draw();
  };

  // ---- Ch 22: ink-jet printer ----------------------------------------------------------------
  DEMOS["ink-jet"] = function (root, lang) {
    const { t, num } = makeT(lang);
    const m_ = 1.3e-10, L = 0.016;
    let Q = -1.5, E = 1.4, vx = 18;   // ×10⁻¹³ C, ×10⁶ N/C (downward), m/s
    const W = 600, H = 240;
    const svg = svgBox(W, H);
    const readout = h("div", { class: "demo-readout" });
    const sQ = slider("Q (×10⁻¹³ C)", -3, 3, 0.1, Q, v => { Q = v; draw(); });
    const sE = slider(t("E down (×10⁶ N/C)", "E ke bawah (×10⁶ N/C)"), 0, 3, 0.1, E, v => { E = v; draw(); });
    const sv = slider("vₓ (m/s)", 6, 40, 1, vx, v => { vx = v; draw(); });
    const X0 = 70, PX = 330, MM = 45;   // plate length 16 mm = 330 px (~21 px/mm); vertical 45 px/mm (~2× stretch)
    let anim = null;
    function physics() {
      const ay = (Q * 1e-13) * (-E * 1e6) / m_;   // E points down (−y)
      const tt = L / vx, y = 0.5 * ay * tt * tt, vy = ay * tt;
      return { ay, tt, y, vy };
    }
    function draw(progress = 1) {
      const { ay, tt, y, vy } = physics();
      const cy = H / 2;
      const Y = ym => cy - Math.max(-1.6, Math.min(1.6, ym * 1000)) * MM;
      svg.replaceChildren(
        s("rect", { x: X0, y: cy - 1.75 * MM - 8, width: PX, height: 8, class: "plate" }),
        s("rect", { x: X0, y: cy + 1.75 * MM, width: PX, height: 8, class: "plate" }),
        s("line", { x1: X0 + PX + 140, y1: 10, x2: X0 + PX + 140, y2: H - 10, class: "ax" }),
        s("text", { x: X0 + PX + 146, y: 22, class: "m", "font-size": 12 }, t("paper", "kertas")),
        s("text", { x: X0 + PX / 2, y: cy - 1.75 * MM - 14, class: "m", "font-size": 12, "text-anchor": "middle" }, "L = 1.6 cm"));
      for (let i = 0; i < 5 && E > 0; i++) svg.append(...arrow(X0 + 40 + i * 65, cy - 60, X0 + 40 + i * 65, cy - 20, "efield", 7));
      if (E > 0) svg.append(s("text", { x: X0 + 30, y: cy - 66, class: "m", "font-size": 12 }, "E ↓"));
      // path inside the plates, then straight on (dashed) to the paper; positions in px
      const pts = [];
      for (let i = 0; i <= 40 * progress; i++) {
        const ti = (i / 40) * tt;
        pts.push(`${X0 + (i / 40) * PX},${Y(0.5 * ay * ti * ti)}`);
      }
      svg.append(s("line", { x1: 20, y1: cy, x2: X0, y2: cy, class: "curve c1" }));
      svg.append(s("polyline", { points: pts.join(" "), class: "curve c1" }));
      if (progress >= 1) {
        const extra = 140 / PX * L;   // same horizontal scale beyond the plates
        const yPaper = y + vy * (extra / vx);
        svg.append(s("line", { x1: X0 + PX, y1: Y(y), x2: X0 + PX + 140, y2: Y(yPaper), class: "curve c1", "stroke-dasharray": "5 4" }));
        svg.append(s("circle", { cx: X0 + PX, cy: Y(y), r: 5, class: "stepdot" }));
      }
      const last = pts[pts.length - 1].split(",");
      svg.append(s("circle", { cx: +last[0], cy: +last[1], r: 6, class: "drop" }));
      const dir = y > 0 ? t("UP", "ATAS") : y < 0 ? t("DOWN", "BAWAH") : "—";
      fill(readout,
        h("div", { class: "mono" }, `t = L/vₓ = ${sci(tt, lang)} s   a_y = QE/m = ${sci(ay, lang)} m/s²`),
        h("div", { class: "mono" }, `y = QEL²/(2mvₓ²) = ${sci(Math.abs(y), lang)} m = ${num(Math.abs(y) * 1000, 2)} mm ${dir}`),
        h("div", { class: "muted" }, t("Starts at the slide's example (0.64 mm, deflected up because the drop is negative and E points down). The vertical scale is stretched about 2× so the bend is visible. Gravity is ignored, as on the slide.",
          "Dimulai dari contoh slide (0,64 mm, dibelokkan ke atas karena tetes negatif dan E ke bawah). Skala vertikal diregangkan sekitar 2× agar belokannya terlihat. Gravitasi diabaikan, seperti di slide.")));
    }
    function fire() {
      cancelAnimationFrame(anim);
      const start = performance.now();
      const stepFn = now => { const p = Math.min(1, (now - start) / 900); draw(p); if (p < 1) anim = requestAnimationFrame(stepFn); };
      anim = requestAnimationFrame(stepFn);
    }
    root.append(h("div", { class: "demo-controls" }, sQ.wrap, sE.wrap, sv.wrap, button(t("▶ Fire a drop", "▶ Tembakkan tetes"), fire)),
      h("div", { class: "fig" }, svg), readout);
    draw();
  };

  // ---- Ch 22: dipole in a uniform field --------------------------------------------------------
  DEMOS["dipole-field"] = function (root, lang) {
    const { t, num } = makeT(lang);
    let theta = 60, omega = 0, running = false, anim = null;   // degrees, deg/frame
    const W = 600, H = 250;
    const svg = svgBox(W, H);
    const readout = h("div", { class: "demo-readout" });
    const sTh = slider("θ (°)", 0, 180, 1, theta, v => { stop(); theta = v; draw(); });
    function stop() { running = false; cancelAnimationFrame(anim); }
    function draw() {
      const th = theta * Math.PI / 180, cx = 150, cy = 125, half = 70;
      svg.replaceChildren();
      for (let i = 0; i < 4; i++) svg.append(...arrow(20, 40 + i * 60, 285, 40 + i * 60, "efield", 8));
      svg.append(s("text", { x: 270, y: 30, class: "m", "font-size": 12 }, "E →"));
      const px = Math.cos(th) * half, py = -Math.sin(th) * half;
      svg.append(s("line", { x1: cx - px, y1: cy - py, x2: cx + px, y2: cy + py, class: "rod" }));
      svg.append(...arrow(cx - px * 0.4, cy - py * 0.4, cx + px * 0.4, cy + py * 0.4, "net", 9));
      svg.append(s("circle", { cx: cx + px, cy: cy + py, r: 12, class: "charge pos" }), s("text", { x: cx + px, y: cy + py + 4, class: "chg-t", "font-size": 12, "text-anchor": "middle" }, "+"));
      svg.append(s("circle", { cx: cx - px, cy: cy - py, r: 12, class: "charge neg" }), s("text", { x: cx - px, y: cy - py + 4, class: "chg-t", "font-size": 12, "text-anchor": "middle" }, "−"));
      // force arrows on each end: +qE right, −qE left
      svg.append(...arrow(cx + px, cy + py, cx + px + 40, cy + py, "c4", 7), ...arrow(cx - px, cy - py, cx - px - 40, cy - py, "c4", 7));
      // U(θ) = −pE cosθ graph
      const G = { x: 330, y: 30, w: 250, h: 180 };
      const GX = d => G.x + (d / 180) * G.w, GY = u => G.y + G.h / 2 - u * (G.h / 2.3);
      svg.append(s("line", { x1: G.x, y1: GY(0), x2: G.x + G.w, y2: GY(0), class: "ax" }));
      svg.append(s("line", { x1: G.x, y1: G.y, x2: G.x, y2: G.y + G.h, class: "ax" }));
      for (const d of [0, 90, 180]) svg.append(s("text", { x: GX(d), y: G.y + G.h + 14, class: "m", "font-size": 11, "text-anchor": "middle" }, d + "°"));
      svg.append(s("text", { x: G.x - 6, y: GY(1) + 4, class: "m", "font-size": 11, "text-anchor": "end" }, "+pE"));
      svg.append(s("text", { x: G.x - 6, y: GY(-1) + 4, class: "m", "font-size": 11, "text-anchor": "end" }, "−pE"));
      const ptsU = [], ptsT = [];
      for (let d = 0; d <= 180; d += 3) { ptsU.push(`${GX(d)},${GY(-Math.cos(d * Math.PI / 180))}`); ptsT.push(`${GX(d)},${GY(Math.sin(d * Math.PI / 180))}`); }
      svg.append(s("polyline", { points: ptsU.join(" "), class: "curve c1" }), s("polyline", { points: ptsT.join(" "), class: "curve c4", "stroke-dasharray": "5 4" }));
      svg.append(s("text", { x: GX(178), y: GY(-Math.cos(Math.PI)) + 16, class: "lbl c1", "font-size": 12, "text-anchor": "end" }, "U = −pE cosθ"));
      svg.append(s("text", { x: GX(90), y: GY(1) - 6, class: "lbl c4", "font-size": 12, "text-anchor": "middle" }, "|τ| = pE sinθ"));
      const dth = ((theta % 360) + 360) % 360, shown = dth > 180 ? 360 - dth : dth;
      svg.append(s("circle", { cx: GX(shown), cy: GY(-Math.cos(th)), r: 6, class: "stepdot" }));
      const tau = Math.sin(th), U = -Math.cos(th);
      fill(readout,
        h("div", { class: "mono" }, `θ = ${num(shown, 0)}°   τ = pE sinθ = ${num(Math.abs(tau), 2)} pE   U = −pE cosθ = ${num(U, 2)} pE`),
        h("div", {}, shown < 2 ? t("θ ≈ 0°: U is minimum and τ = 0 → stable equilibrium.", "θ ≈ 0°: U minimum dan τ = 0 → kesetimbangan stabil.")
          : shown > 178 ? t("θ ≈ 180°: τ = 0 but U is maximum → unstable; a tiny nudge and it swings away.", "θ ≈ 180°: τ = 0 tetapi U maksimum → labil; sedikit dorongan dan ia berayun menjauh.")
          : t("The torque turns p toward E. Press Release to let it swing.", "Torsi memutar p ke arah E. Tekan Lepas agar berayun.")),
        h("div", { class: "muted" }, t("Net force is zero (the two qE arrows cancel), but they twist the dipole. The swing is like a pendulum; a little damping makes it settle at 0°.",
          "Gaya total nol (dua panah qE saling meniadakan), tetapi keduanya memuntir dipol. Ayunannya seperti bandul; sedikit redaman membuatnya diam di 0°.")));
    }
    function release() {
      stop(); running = true; omega = 0;
      const tick = () => {
        if (!running) return;
        // θ'' = −(pE/I) sinθ − c θ'  (arbitrary units, small damping)
        for (let i = 0; i < 4; i++) { omega += -0.25 * Math.sin(theta * Math.PI / 180) - 0.012 * omega; theta += omega * 0.25; }
        sTh.input.value = Math.round(Math.abs(((theta + 180) % 360 + 360) % 360 - 180)); sTh.show();
        draw();
        if (Math.abs(omega) < 0.01 && Math.abs(Math.sin(theta * Math.PI / 180)) < 0.005) { running = false; return; }
        anim = requestAnimationFrame(tick);
      };
      anim = requestAnimationFrame(tick);
    }
    root.append(h("div", { class: "demo-controls" }, sTh.wrap, button(t("▶ Release", "▶ Lepas"), release),
      button("179°", () => { stop(); theta = 179; sTh.input.value = 179; sTh.show(); draw(); })),
      h("div", { class: "fig" }, svg), readout);
    draw();
  };

  // ---- Ch 23: flux through a tilted loop -------------------------------------------------------
  DEMOS["flux-loop"] = function (root, lang) {
    const { t, num } = makeT(lang);
    let theta = 30;
    const W = 600, H = 260;
    const svg = svgBox(W, H);
    const readout = h("div", { class: "demo-readout" });
    const sTh = slider(t("θ between E and the normal (°)", "θ antara E dan normal (°)"), 0, 180, 1, theta, v => { theta = v; draw(); });
    function draw() {
      const th = theta * Math.PI / 180, cx = 300, cy = 130, half = 90;
      // edge-on view of the loop: a segment perpendicular to its normal n
      const nx = Math.cos(th), ny = -Math.sin(th);
      const ax = cx - ny * half, ay = cy + nx * half, bx = cx + ny * half, by = cy - nx * half;
      svg.replaceChildren();
      const yTop = Math.min(ay, by), yBot = Math.max(ay, by);
      for (let y = 20; y <= H - 20; y += 20) {
        const crosses = y >= yTop && y <= yBot && Math.abs(Math.cos(th)) > 1e-3;
        svg.append(...arrow(20, y, W - 20, y, crosses ? "fhit" : "efield", 7));
      }
      svg.append(s("line", { x1: ax, y1: ay, x2: bx, y2: by, class: "loop" }));
      svg.append(...arrow(cx, cy, cx + nx * 70, cy + ny * 70, "net", 10));
      svg.append(s("text", { x: cx + nx * 82, y: cy + ny * 82 + 4, class: "lbl c4", "font-size": 13, "text-anchor": "middle" }, "A (n̂)"));
      const phi = Math.cos(th);
      const nLines = Array.from({ length: Math.floor((H - 40) / 20) + 1 }, (_, i) => 20 + i * 20).filter(y => y >= yTop && y <= yBot).length;
      fill(readout,
        h("div", { class: "mono" }, `Φ = EA cosθ = EA · cos${num(theta, 0)}° = ${num(phi, 2)} EA`),
        h("div", {}, Math.abs(phi) < 0.02 ? t("Edge-on: no field lines pass through, so Φ = 0.", "Menyamping: tidak ada garis medan yang menembus, jadi Φ = 0.")
          : phi > 0 ? t(`${nLines} field lines pass through in the direction of A: Φ > 0.`, `${nLines} garis medan menembus searah A: Φ > 0.`)
                    : t(`${nLines} field lines pass through against A: Φ < 0.`, `${nLines} garis medan menembus berlawanan A: Φ < 0.`)),
        h("div", { class: "muted" }, t("The loop is seen edge-on; the arrow is its area vector A, normal to the loop. Highlighted lines cross it. More tilt → fewer lines → less flux.",
          "Loop dilihat dari samping; panahnya adalah vektor luas A, tegak lurus loop. Garis yang disorot menembusnya. Makin miring → makin sedikit garis → fluks makin kecil.")));
    }
    root.append(h("div", { class: "demo-controls" }, sTh.wrap), h("div", { class: "fig" }, svg), readout);
    draw();
  };

  // ---- Ch 23: Gauss' law playground ------------------------------------------------------------
  DEMOS["gauss"] = function (root, lang) {
    const { t, num } = makeT(lang);
    const W = 600, H = 420, m = worldMap(W, H, -5, 5, -3.5, 3.5);
    const svg = svgBox(W, H, 300);
    const readout = h("div", { class: "demo-readout" });
    let charges = [{ x: -1.2, y: 0.3, q: 3 }, { x: 1.6, y: -0.6, q: -2 }, { x: 3.4, y: 1.8, q: 2 }];
    let G = { x: -1, y: 0, r: 1.6 }, lines = [];
    const sr = slider(t("Gaussian sphere radius (m)", "jari-jari bola Gauss (m)"), 0.3, 3.4, 0.1, G.r, v => { G.r = v; draw(); });
    const redraw = frameThrottle(() => { lines = traceLines(charges, m); draw(); });

    // ∮E·dA over the 3D sphere (charges lie in the plane z = 0), midpoint rule.
    function fluxNumeric() {
      const NT = 60, NP = 120, R = G.r;
      let sum = 0;
      for (let i = 0; i < NT; i++) {
        const th = (i + 0.5) * Math.PI / NT, st = Math.sin(th), ct = Math.cos(th);
        for (let j = 0; j < NP; j++) {
          const ph = (j + 0.5) * 2 * Math.PI / NP;
          const nx = st * Math.cos(ph), ny = st * Math.sin(ph), nz = ct;
          const x = G.x + R * nx, y = G.y + R * ny, z = R * nz;
          let En = 0;
          for (const c of charges) {
            const dx = x - c.x, dy = y - c.y, dz = z, r2 = dx * dx + dy * dy + dz * dz;
            En += K * c.q * 1e-9 * (dx * nx + dy * ny + dz * nz) / (r2 * Math.sqrt(r2));
          }
          sum += En * R * R * st;
        }
      }
      return sum * (Math.PI / NT) * (2 * Math.PI / NP);
    }
    function draw() {
      svg.replaceChildren(...drawCharges(m, charges, lines));
      // circle coloured by the sign of E·n: red where flux leaves, blue where it enters
      const N = 120;
      for (let i = 0; i < N; i++) {
        const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N, am = (a1 + a2) / 2;
        const [ex, ey] = fieldAt(charges, G.x + G.r * Math.cos(am), G.y + G.r * Math.sin(am));
        const out = ex * Math.cos(am) + ey * Math.sin(am) > 0;
        svg.append(s("line", { x1: m.X(G.x + G.r * Math.cos(a1)), y1: m.Y(G.y + G.r * Math.sin(a1)), x2: m.X(G.x + G.r * Math.cos(a2)), y2: m.Y(G.y + G.r * Math.sin(a2)), class: "gsurf " + (out ? "out" : "in") }));
      }
      svg.append(s("circle", { cx: m.X(G.x), cy: m.Y(G.y), r: 6, class: "probe" }));
      const inside = charges.filter(c => Math.hypot(c.x - G.x, c.y - G.y) < G.r);
      const qenc = inside.reduce((a, c) => a + c.q, 0);
      const exact = qenc * 1e-9 / EPS0, numeric = fluxNumeric();
      const nearEdge = charges.some(c => Math.abs(Math.hypot(c.x - G.x, c.y - G.y) - G.r) < 0.15);
      fill(readout,
        h("div", {}, t("Inside: ", "Di dalam: ") + (inside.length ? inside.map(c => (c.q > 0 ? "+" : "−") + Math.abs(c.q) + " nC").join(", ") : t("no charge", "tidak ada muatan")) + `   →   q_enc = ${qenc} nC`),
        h("div", { class: "mono" }, `${t("integrated", "diintegralkan")} ∮E·dA ≈ ${num(numeric, 1)} N·m²/C   ·   q_enc/ε₀ = ${num(exact, 1)} N·m²/C`),
        nearEdge ? h("div", { class: "warn" }, t("A charge is almost on the surface; the numerical integral gets inaccurate there.", "Ada muatan hampir di permukaan; integral numerik menjadi kurang akurat di sana.")) : null,
        h("div", { class: "muted" }, t("Drag the centre (●) or any charge, and change the radius. Red arcs: field leaving; blue: entering. The flux only changes when a charge crosses the surface; outside charges send in as much as they send out.",
          "Geser pusat (●) atau muatan mana pun, dan ubah jari-jarinya. Busur merah: medan keluar; biru: masuk. Fluks hanya berubah saat muatan melewati permukaan; muatan di luar memasukkan sebanyak yang dikeluarkannya.")));
    }
    enableDrag(svg, m,
      (x, y) => {
        const i = charges.findIndex(c => Math.hypot(x - c.x, y - c.y) < 0.4);
        if (i >= 0) return i;
        return Math.hypot(x - G.x, y - G.y) < 0.5 ? "centre" : null;
      },
      (key, x, y) => {
        if (key === "centre") { G = { ...G, x, y }; draw(); }
        else { charges[key] = { ...charges[key], x, y }; redraw(); }
      });
    root.append(h("div", { class: "demo-controls" }, sr.wrap), h("div", { class: "fig" }, svg), readout);
    redraw();
  };

  // ---- Ch 23: shells, solid spheres, and the sphere-in-conducting-shell quiz ----------------------
  DEMOS["spheres"] = function (root, lang) {
    const { t, num } = makeT(lang);
    let mode = "shell", r = 4;   // cm; kq = 1
    const W = 600, H = 280;
    const svg = svgBox(W, H);
    const readout = h("div", { class: "demo-readout" });
    const sr = slider("r (cm)", 0.2, 20, 0.1, r, v => { r = v; draw(); });
    const MODES = {
      shell: { label: t("Uniform shell (R = 5)", "Kulit seragam (R = 5)"),
        E: r => (r < 5 ? 0 : 1 / (r * r)), qenc: r => (r < 5 ? 0 : 1),
        why: r => r < 5 ? t("Inside the shell the Gaussian sphere encloses no charge → E = 0.", "Di dalam kulit, bola Gauss tidak melingkupi muatan → E = 0.")
                        : t("Outside, all of q is enclosed → E = kq/r², like a point charge.", "Di luar, seluruh q terlingkupi → E = kq/r², seperti muatan titik.") },
      solid: { label: t("Uniform solid sphere (R = 5)", "Bola pejal seragam (R = 5)"),
        E: r => (r < 5 ? r / 125 : 1 / (r * r)), qenc: r => Math.min(1, (r / 5) ** 3),
        why: r => r < 5 ? t("Inside, only q(r/R)³ is enclosed → E = kqr/R³, growing linearly.", "Di dalam, hanya q(r/R)³ yang terlingkupi → E = kqr/R³, naik linear.")
                        : t("Outside, all of q is enclosed → E = kq/r².", "Di luar, seluruh q terlingkupi → E = kq/r².") },
      combo: { label: t("Sphere + neutral conducting shell (quiz)", "Bola + kulit konduktor netral (kuis)"),
        E: r => (r < 5 ? r / 125 : r < 10 ? 1 / (r * r) : r < 15 ? 0 : 1 / (r * r)),
        qenc: r => (r < 5 ? (r / 5) ** 3 : r < 10 ? 1 : r < 15 ? 0 : 1),
        why: r => r < 5 ? t("Inside the insulating sphere: E = kqr/R³.", "Di dalam bola isolator: E = kqr/R³.")
          : r < 10 ? t("In the gap: all of q is enclosed → E = kq/r².", "Di celah: seluruh q terlingkupi → E = kq/r².")
          : r < 15 ? t("Inside the metal: E = 0. The inner wall holds −q, so q_enc = 0.", "Di dalam logam: E = 0. Dinding dalam memegang −q, jadi q_enc = 0.")
          : t("Outside: q − q + q = q enclosed → E = kq/r² again.", "Di luar: q − q + q = q terlingkupi → E = kq/r² lagi.") },
    };
    const modeBtns = Object.entries(MODES).map(([key, md]) => { const b = button(md.label, () => { mode = key; draw(); }); b.dataset.key = key; return b; });
    function draw() {
      const md = MODES[mode];
      modeBtns.forEach(b => b.classList.toggle("active", b.dataset.key === mode));
      svg.replaceChildren();
      // left: cross-section with the Gaussian circle at r
      const cx = 125, cy = 140, S = 6.2;   // px per cm
      if (mode === "shell") svg.append(s("circle", { cx, cy, r: 5 * S, class: "shellline" }));
      else svg.append(s("circle", { cx, cy, r: 5 * S, class: "solid" }));
      if (mode === "combo") {
        svg.append(s("circle", { cx, cy, r: 12.5 * S, class: "metal", "stroke-width": 5 * S }));
        for (const [name, rr] of [["A", 4], ["B", 8], ["C", 12], ["D", 16]]) {
          svg.append(s("circle", { cx: cx + rr * S * 0.707, cy: cy - rr * S * 0.707, r: 3, class: "stepdot" }));
          svg.append(s("text", { x: cx + rr * S * 0.707 + 5, y: cy - rr * S * 0.707 - 4, class: "t", "font-size": 11 }, name));
        }
      }
      svg.append(s("circle", { cx, cy, r: Math.min(r, 19) * S, class: "gsurf out", "stroke-dasharray": "5 4", fill: "none" }));
      // right: E(r) graph
      const P = { x: 280, y: 20, w: 300, h: 220 }, RMAX = 20, EMAX = 0.045;
      const GX = v => P.x + (v / RMAX) * P.w, GY = e => P.y + P.h - Math.min(e, EMAX) / EMAX * P.h;
      svg.append(s("line", { x1: P.x, y1: P.y + P.h, x2: P.x + P.w, y2: P.y + P.h, class: "ax" }), s("line", { x1: P.x, y1: P.y, x2: P.x, y2: P.y + P.h, class: "ax" }));
      for (const v of [0, 5, 10, 15, 20]) svg.append(s("text", { x: GX(v), y: P.y + P.h + 15, class: "m", "font-size": 11, "text-anchor": "middle" }, String(v)));
      svg.append(s("text", { x: P.x + P.w, y: P.y + P.h + 28, class: "m", "font-size": 11, "text-anchor": "end" }, "r (cm)"));
      svg.append(s("text", { x: P.x + 4, y: P.y + 10, class: "m", "font-size": 11 }, "E (kq/cm²)"));
      const pts = [];
      for (let v = 0.05; v <= RMAX; v += 0.05) pts.push(`${GX(v).toFixed(1)},${GY(md.E(v)).toFixed(1)}`);
      svg.append(s("polyline", { points: pts.join(" "), class: "curve c1" }));
      if (mode === "combo") for (const [name, rr] of [["A", 4], ["B", 8], ["C", 12], ["D", 16]]) {
        svg.append(s("circle", { cx: GX(rr), cy: GY(md.E(rr)), r: 4, class: "stepdot" }));
        svg.append(s("text", { x: GX(rr) + 5, y: GY(md.E(rr)) - 6, class: "t", "font-size": 11 }, name));
      }
      svg.append(s("line", { x1: GX(r), y1: P.y, x2: GX(r), y2: P.y + P.h, class: "curve c4", "stroke-dasharray": "4 4" }));
      const E = md.E(r);
      fill(readout,
        h("div", { class: "mono" }, `r = ${num(r, 1)} cm   q_enc = ${num(md.qenc(r), 3)} q   E = ${num(E, 4)} kq/cm²`),
        h("div", {}, md.why(r)),
        mode === "combo" ? h("div", { class: "mono" }, `A ${num(md.E(4), 4)} > B ${num(md.E(8), 4)} > D ${num(md.E(16), 4)} > C ${num(md.E(12), 0)}`) : null,
        h("div", { class: "muted" }, t("Move r: the dashed circle is the Gaussian sphere. E only depends on the charge it encloses.",
          "Geser r: lingkaran putus-putus adalah bola Gauss. E hanya bergantung pada muatan yang dilingkupinya.")));
    }
    root.append(h("div", { class: "demo-controls" }, ...modeBtns), h("div", { class: "demo-controls" }, sr.wrap), h("div", { class: "fig" }, svg), readout);
    draw();
  };

  // ---- Ch 24: electric potential ----------------------------------------------------------------

  // Potential of point charges in the plane; q in nC, positions in m → V in volts.
  function potentialAt(charges, x, y) {
    let v = 0;
    for (const c of charges) v += K * c.q * 1e-9 / Math.max(0.03, Math.hypot(x - c.x, y - c.y));
    return v;
  }

  // Contour lines of V on a grid (marching squares). Returns one SVG path string per level.
  function contours(charges, m, levels, nx = 110, ny = 77) {
    const dx = (m.xmax - m.xmin) / nx, dy = (m.ymax - m.ymin) / ny;
    const V = [];
    for (let j = 0; j <= ny; j++) { V.push([]); for (let i = 0; i <= nx; i++) V[j].push(potentialAt(charges, m.xmin + i * dx, m.ymin + j * dy)); }
    const P = (i, j) => [m.X(m.xmin + i * dx), m.Y(m.ymin + j * dy)];
    return levels.map(L => {
      let d = "";
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const v = [V[j][i], V[j][i + 1], V[j + 1][i + 1], V[j + 1][i]];
        const corners = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]];
        const pts = [];
        for (let e = 0; e < 4; e++) {   // edge e joins corner e and corner e+1
          const a = v[e], b = v[(e + 1) % 4];
          if ((a < L) !== (b < L)) {
            const t = (L - a) / (b - a), [i1, j1] = corners[e], [i2, j2] = corners[(e + 1) % 4];
            const [x1, y1] = P(i1, j1), [x2, y2] = P(i2, j2);
            pts.push([x1 + t * (x2 - x1), y1 + t * (y2 - y1)]);
          }
        }
        for (let k = 0; k + 1 < pts.length; k += 2) d += `M${pts[k][0].toFixed(1)},${pts[k][1].toFixed(1)}L${pts[k + 1][0].toFixed(1)},${pts[k + 1][1].toFixed(1)}`;
      }
      return { level: L, d };
    });
  }

  DEMOS["equipotential"] = function (root, lang) {
    const { t, num } = makeT(lang);
    const W = 600, H = 420, m = worldMap(W, H, -5, 5, -3.5, 3.5);
    const svg = svgBox(W, H, 300);
    const readout = h("div", { class: "demo-readout" });
    const LEVELS = [-160, -80, -40, -20, -10, -5, 0, 5, 10, 20, 40, 80, 160];
    let charges = [], probe = { x: 0, y: 1.5 }, lines = [], iso = [], note = null;
    const ring = arc => Array.from({ length: 12 }, (_, i) => {
      const a = arc ? (-60 + i * (120 / 11)) * Math.PI / 180 : i * Math.PI / 6;
      return { x: 2 * Math.cos(a), y: 2 * Math.sin(a), q: -1 };
    });
    const PRESETS = {
      point: () => ({ c: [{ x: 0, y: 0, q: 2 }], p: { x: 1.5, y: 1 }, n: null }),
      dipole: () => ({ c: [{ x: -1.2, y: 0, q: 2 }, { x: 1.2, y: 0, q: -2 }], p: { x: 0, y: 1.5 }, n: null }),
      ringEven: () => ({ c: ring(false), p: { x: 0, y: 0 }, n: t("12 charges of −1 nC evenly spaced on a 2 m circle: at the centre E = 0 but V ≠ 0.", "12 muatan −1 nC berjarak sama pada lingkaran 2 m: di pusat E = 0 tetapi V ≠ 0.") }),
      ringArc: () => ({ c: ring(true), p: { x: 0, y: 0 }, n: t("Same 12 charges bunched into a 120° arc: V at the centre is unchanged, but E is no longer zero.", "12 muatan yang sama dikumpulkan dalam busur 120°: V di pusat tidak berubah, tetapi E tidak lagi nol.") }),
    };
    const recompute = frameThrottle(() => { lines = traceLines(charges, m); iso = contours(charges, m, LEVELS); draw(); });
    const load = key => { const p = PRESETS[key](); charges = p.c; probe = p.p; note = p.n; recompute(); };

    function draw() {
      svg.replaceChildren();
      for (const { level, d } of iso) if (d) svg.append(s("path", { d, class: "iso " + (level > 0 ? "pos" : level < 0 ? "neg" : "zero") }));
      svg.append(...drawCharges(m, charges, lines));
      const [ex, ey] = fieldAt(charges, probe.x, probe.y), En = Math.hypot(ex, ey);
      const px = m.X(probe.x), py = m.Y(probe.y);
      if (En > 1e-6) { const L = 60; svg.append(...arrow(px, py, px + L * ex / En, py - L * ey / En, "net", 10)); }
      svg.append(s("circle", { cx: px, cy: py, r: 7, class: "probe" }));
      const V = potentialAt(charges, probe.x, probe.y);
      fill(readout,
        h("div", { class: "mono" }, `V = ${num(V, 1)} V   |E| = ${En < 0.05 ? "0" : sci(En, lang)} N/C`),
        note ? h("div", {}, note) : null,
        h("div", { class: "muted" }, t("Coloured lines are equipotentials (red: V > 0, blue: V < 0, dashed: V = 0) at ±5, 10, 20, 40, 80, 160 V. Grey lines are field lines. Drag the charges or the probe: equipotentials always cross field lines at 90°.",
          "Garis berwarna adalah ekuipotensial (merah: V > 0, biru: V < 0, putus-putus: V = 0) pada ±5, 10, 20, 40, 80, 160 V. Garis abu-abu adalah garis medan. Geser muatan atau probe: ekuipotensial selalu memotong garis medan 90°.")));
    }
    enableDrag(svg, m,
      (x, y) => {
        if (Math.hypot(x - probe.x, y - probe.y) < 0.35) return "probe";
        const i = charges.findIndex(c => Math.hypot(x - c.x, y - c.y) < 0.35);
        return i >= 0 ? i : null;
      },
      (key, x, y) => {
        if (key === "probe") { probe = { x, y }; draw(); }
        else { charges[key] = { ...charges[key], x, y }; note = null; recompute(); }
      });
    root.append(h("div", { class: "demo-controls" },
      button(t("Point charge", "Muatan titik"), () => load("point")),
      button(t("Dipole", "Dipol"), () => load("dipole")),
      button(t("12 electrons: even", "12 elektron: merata"), () => load("ringEven")),
      button(t("12 electrons: 120° arc", "12 elektron: busur 120°"), () => load("ringArc"))),
      h("div", { class: "fig" }, svg), readout);
    load("dipole");
  };

  DEMOS["accelerate"] = function (root, lang) {
    const { t, num } = makeT(lang);
    const e = 1.6e-19, me = 9.11e-31, mp = 1.67e-27, GAP = 0.01;   // 1 cm gap
    let dV = 100, anim = null, progress = 0;
    const W = 600, H = 200;
    const svg = svgBox(W, H);
    const readout = h("div", { class: "demo-readout" });
    const sv = slider("ΔV (V)", 10, 1000, 10, dV, v => { dV = v; progress = 0; draw(); });
    const X0 = 70, X1 = 530;
    function draw() {
      const ve = Math.sqrt(2 * e * dV / me), vp = Math.sqrt(2 * e * dV / mp);
      // uniform acceleration from rest: x = gap * (t/T)², with T = 2·gap/v
      const te = 2 * GAP / ve, tp = 2 * GAP / vp, tNow = progress * te;
      const fe = Math.min(1, (tNow / te) ** 2), fp = Math.min(1, (tNow / tp) ** 2);
      svg.replaceChildren(
        s("rect", { x: X0 - 10, y: 20, width: 8, height: 160, class: "plate" }),
        s("rect", { x: X1 + 2, y: 20, width: 8, height: 160, class: "plate" }),
        s("text", { x: X0 - 6, y: 14, class: "m", "font-size": 12, "text-anchor": "middle" }, "0 V"),
        s("text", { x: X1 + 6, y: 14, class: "m", "font-size": 12, "text-anchor": "middle" }, `${dV} V`),
        s("text", { x: (X0 + X1) / 2, y: 196, class: "m", "font-size": 12, "text-anchor": "middle" }, t("1 cm gap", "celah 1 cm")));
      for (const [name, f, y, cls] of [[t("electron", "elektron"), fe, 70, "neg"], [t("proton (reversed field)", "proton (medan dibalik)"), fp, 140, "pos"]]) {
        svg.append(s("line", { x1: X0, y1: y, x2: X1, y2: y, class: "grid" }));
        svg.append(s("circle", { cx: X0 + f * (X1 - X0), cy: y, r: cls === "pos" ? 11 : 6, class: "charge " + cls }));
        svg.append(s("text", { x: X0 + 4, y: y - 16, class: "t", "font-size": 12 }, name));
      }
      fill(readout,
        h("div", { class: "mono" }, `K = |q|ΔV = ${dV} eV = ${sci(e * dV, lang)} J  (${t("both", "keduanya")})`),
        h("div", { class: "mono" }, `v_e = √(2eΔV/m_e) = ${sci(ve, lang)} m/s    v_p = ${sci(vp, lang)} m/s    v_e/v_p = ${num(ve / vp, 1)}`),
        progress >= 1 ? h("div", {}, t(`When the electron arrives, the proton has covered only ${num(fp * 100, 2)}% of the gap.`, `Saat elektron tiba, proton baru menempuh ${num(fp * 100, 2)}% celah.`)) : null,
        h("div", { class: "muted" }, t("Same charge size → same energy gained. The proton is about 1836× heavier, so it's √1836 ≈ 43× slower. (Slow motion: the real crossing takes nanoseconds.)",
          "Besar muatan sama → energi yang didapat sama. Proton sekitar 1836× lebih berat, jadi √1836 ≈ 43× lebih lambat. (Gerak lambat: penyeberangan sebenarnya hanya nanodetik.)")));
    }
    function race() {
      cancelAnimationFrame(anim);
      const start = performance.now();
      const step = now => { progress = Math.min(1, (now - start) / 1500); draw(); if (progress < 1) anim = requestAnimationFrame(step); };
      anim = requestAnimationFrame(step);
    }
    root.append(h("div", { class: "demo-controls" }, sv.wrap, button(t("▶ Race", "▶ Adu"), race)), h("div", { class: "fig" }, svg), readout);
    draw();
  };

  DEMOS["potential-sphere"] = function (root, lang) {
    const { t, num } = makeT(lang);
    let mode = "conductor", r = 3;   // cm, R = 5 cm, kq = 1
    const R = 5, W = 600, H = 320;
    const svg = svgBox(W, H);
    const readout = h("div", { class: "demo-readout" });
    const sr = slider("r (cm)", 0, 20, 0.1, r, v => { r = v; draw(); });
    const MODES = {
      conductor: { label: t("Conducting sphere / shell", "Bola konduktor / kulit"),
        E: x => (x < R ? 0 : 1 / (x * x)), V: x => (x < R ? 1 / R : 1 / x) },
      solid: { label: t("Uniform solid sphere [ADDED]", "Bola pejal seragam [ADDED]"),
        E: x => (x < R ? x / R ** 3 : 1 / (x * x)), V: x => (x < R ? (3 * R * R - x * x) / (2 * R ** 3) : 1 / x) },
    };
    const btns = Object.entries(MODES).map(([k, md]) => { const b = button(md.label, () => { mode = k; draw(); }); b.dataset.key = k; return b; });
    function graph(y0, hgt, fn, ymax, label, cls) {
      const L = 70, Wd = 500, X = v => L + (v / 20) * Wd, Y = v => y0 + hgt - (v / ymax) * hgt;
      svg.append(s("line", { x1: L, y1: y0 + hgt, x2: L + Wd, y2: y0 + hgt, class: "ax" }), s("line", { x1: L, y1: y0, x2: L, y2: y0 + hgt, class: "ax" }));
      svg.append(s("line", { x1: X(R), y1: y0, x2: X(R), y2: y0 + hgt, class: "grid" }));
      svg.append(s("text", { x: X(R), y: y0 + hgt + 14, class: "m", "font-size": 11, "text-anchor": "middle" }, "R"));
      svg.append(s("text", { x: L - 8, y: y0 + 12, class: "lbl " + cls, "font-size": 12, "text-anchor": "end" }, label));
      const pts = [];
      for (let v = 0.02; v <= 20; v += 0.05) pts.push(`${X(v).toFixed(1)},${Y(Math.min(fn(v), ymax * 1.05)).toFixed(1)}`);
      svg.append(s("polyline", { points: pts.join(" "), class: "curve " + cls }));
      svg.append(s("line", { x1: X(r), y1: y0, x2: X(r), y2: y0 + hgt, class: "curve c4", "stroke-dasharray": "4 4" }));
      svg.append(s("circle", { cx: X(r), cy: Y(Math.min(fn(Math.max(r, 0.02)), ymax * 1.05)), r: 5, class: "stepdot" }));
    }
    function draw() {
      const md = MODES[mode];
      btns.forEach(b => b.classList.toggle("active", b.dataset.key === mode));
      svg.replaceChildren();
      graph(14, 120, md.E, 0.045, "E", "c1");
      graph(170, 120, md.V, 0.32, "V", "c2");
      svg.append(s("text", { x: 570, y: 315, class: "m", "font-size": 11, "text-anchor": "end" }, "r (cm)"));
      const rr = Math.max(r, 0.001);
      fill(readout,
        h("div", { class: "mono" }, `r = ${num(r, 1)} cm   E = ${num(md.E(rr), 4)} kq/cm²   V = ${num(md.V(rr), 4)} kq/cm`),
        h("div", {}, r < R
          ? (mode === "conductor" ? t("Inside: E = 0, so V stays flat at kq/R, the surface value.", "Di dalam: E = 0, jadi V tetap datar pada kq/R, nilai permukaan.")
                                  : t("Inside a solid sphere E ≠ 0, so V keeps rising toward the centre: V = kq(3R² − r²)/(2R³), 1.5× the surface value at r = 0.", "Di dalam bola pejal E ≠ 0, jadi V terus naik ke arah pusat: V = kq(3R² − r²)/(2R³), 1,5× nilai permukaan di r = 0."))
          : t("Outside: E = kq/r² and V = kq/r, exactly like a point charge.", "Di luar: E = kq/r² dan V = kq/r, persis seperti muatan titik.")),
        h("div", { class: "muted" }, t("V(r) = ∫ E dr from r out to infinity: V is the area under the E curve to the right of r. Where E = 0, V is flat.",
          "V(r) = ∫ E dr dari r sampai tak hingga: V adalah luas di bawah kurva E di sebelah kanan r. Di tempat E = 0, V datar.")));
    }
    root.append(h("div", { class: "demo-controls" }, ...btns), h("div", { class: "demo-controls" }, sr.wrap), h("div", { class: "fig" }, svg), readout);
    draw();
  };

  DEMOS["e-from-v"] = function (root, lang) {
    const { t, num } = makeT(lang);
    let mode = "disk", x = 0.5;
    const W = 600, H = 300;
    const svg = svgBox(W, H);
    const readout = h("div", { class: "demo-readout" });
    const MODES = {
      disk: { label: t("Charged disk V(z)", "Piringan bermuatan V(z)"), x0: 0, x1: 3, V: z => Math.sqrt(z * z + 1) - z,
        exact: z => 1 - z / Math.sqrt(z * z + 1), units: "σ/2ε₀, R = 1" },
      uniform: { label: t("Uniform field", "Medan seragam"), x0: 0, x1: 3, V: z => 3 - z, exact: () => 1, units: "E = 1" },
      point: { label: t("Point charge V = kq/x", "Muatan titik V = kq/x"), x0: 0.3, x1: 3, V: z => 1 / z, exact: z => 1 / (z * z), units: "kq = 1" },
      hill: { label: t("A bump [ADDED]", "Gundukan [ADDED]"), x0: -3, x1: 3, V: z => Math.exp(-z * z), exact: z => 2 * z * Math.exp(-z * z), units: "" },
    };
    const sx = slider("x", 0, 1, 0.005, 0.2, v => { x = MODES[mode].x0 + v * (MODES[mode].x1 - MODES[mode].x0); draw(); });
    const btns = Object.entries(MODES).map(([k, md]) => {
      const b = button(md.label, () => { mode = k; sx.input.value = 0.2; x = md.x0 + 0.2 * (md.x1 - md.x0); draw(); });
      b.dataset.key = k; return b;
    });
    x = MODES.disk.x0 + 0.2 * 3;
    function draw() {
      const md = MODES[mode];
      btns.forEach(b => b.classList.toggle("active", b.dataset.key === mode));
      const L = 60, R = 20, T = 20, Hp = 190;
      const xs = []; for (let i = 0; i <= 300; i++) xs.push(md.x0 + (i / 300) * (md.x1 - md.x0));
      const vs = xs.map(md.V), vmin = Math.min(0, ...vs), vmax = Math.max(...vs);
      const X = v => L + ((v - md.x0) / (md.x1 - md.x0)) * (W - L - R), Y = v => T + Hp - ((v - vmin) / (vmax - vmin || 1)) * Hp;
      svg.replaceChildren(
        s("line", { x1: L, y1: Y(0), x2: W - R, y2: Y(0), class: "ax" }),
        s("line", { x1: L, y1: T, x2: L, y2: T + Hp, class: "ax" }),
        s("text", { x: L - 8, y: T + 10, class: "lbl c2", "font-size": 12, "text-anchor": "end" }, "V"),
        s("polyline", { points: xs.map((v, i) => `${X(v).toFixed(1)},${Y(vs[i]).toFixed(1)}`).join(" "), class: "curve c2" }));
      // tangent line from a numerical derivative
      const hh = (md.x1 - md.x0) / 2000, slope = (md.V(x + hh) - md.V(x - hh)) / (2 * hh), Ex = -slope;
      const span = (md.x1 - md.x0) * 0.18;
      svg.append(s("line", { x1: X(x - span), y1: Y(md.V(x) - slope * span), x2: X(x + span), y2: Y(md.V(x) + slope * span), class: "curve c4", "stroke-dasharray": "6 4" }));
      svg.append(s("circle", { cx: X(x), cy: Y(md.V(x)), r: 6, class: "stepdot" }));
      // E arrow under the axis: length ∝ Ex
      const ay = T + Hp + 50, len = Math.max(-200, Math.min(200, Ex * 90));
      svg.append(s("text", { x: L - 8, y: ay + 4, class: "lbl c4", "font-size": 12, "text-anchor": "end" }, "Eₓ"));
      if (Math.abs(len) > 2) svg.append(...arrow(X(x), ay, X(x) + len, ay, "net", 10));
      else svg.append(s("circle", { cx: X(x), cy: ay, r: 4, class: "stepdot" }));
      fill(readout,
        h("div", { class: "mono" }, `x = ${num(x, 2)}   dV/dx = ${num(slope, 3)}   Eₓ = −dV/dx = ${num(Ex, 3)}` + (md.units ? `   (${md.units})` : "")),
        mode === "disk" ? h("div", { class: "mono" }, `${t("formula", "rumus")}: σ/2ε₀ · (1 − z/√(z² + R²)) = ${num(md.exact(x), 3)}`) : null,
        h("div", { class: "muted" }, t("The dashed line is the tangent. Where V slopes down, E points forward (+x); where V slopes up, E points back; where V is flat, E = 0.",
          "Garis putus-putus adalah garis singgung. Di tempat V menurun, E mengarah maju (+x); di tempat V menanjak, E mengarah mundur; di tempat V datar, E = 0.")));
    }
    root.append(h("div", { class: "demo-controls" }, ...btns), h("div", { class: "demo-controls" }, sx.wrap), h("div", { class: "fig" }, svg), readout);
    draw();
  };

  DEMOS["assemble"] = function (root, lang) {
    const { t, num } = makeT(lang);
    const q = 150e-9, d = 0.12;
    const CH = [{ name: "q₁", mult: 1, x: 300, y: 50 }, { name: "q₂", mult: -4, x: 200, y: 223 }, { name: "q₃", mult: 2, x: 400, y: 223 }];
    let placed = 0;
    const W = 600, H = 270;
    const svg = svgBox(W, H);
    const readout = h("div", { class: "demo-readout" });
    function workFor(i) {   // work to bring charge i in, given charges 0..i-1 already placed
      let sum = 0;
      for (let j = 0; j < i; j++) sum += K * CH[i].mult * CH[j].mult * q * q / d;
      return sum;
    }
    function draw() {
      svg.replaceChildren();
      for (let i = 0; i < placed; i++) for (let j = i + 1; j < placed; j++)
        svg.append(s("line", { x1: CH[i].x, y1: CH[i].y, x2: CH[j].x, y2: CH[j].y, class: "edge" }));
      if (placed >= 2) svg.append(s("text", { x: 300, y: 262, class: "m", "font-size": 12, "text-anchor": "middle" }, "d = 12 cm"));
      CH.forEach((c, i) => {
        const here = i < placed;
        svg.append(s("circle", { cx: here ? c.x : 560, cy: here ? c.y : 40 + i * 70, r: 16, class: "charge " + (c.mult > 0 ? "pos" : "neg") + (here ? "" : " waiting") }));
        svg.append(s("text", { x: here ? c.x : 560, y: (here ? c.y : 40 + i * 70) + 4, class: "chg-t", "font-size": 11, "text-anchor": "middle" }, (c.mult > 0 ? "+" : "") + c.mult + "q"));
      });
      svg.append(s("text", { x: 560, y: 20, class: "m", "font-size": 11, "text-anchor": "middle" }, t("at ∞", "di ∞")));
      const rows = [];
      let total = 0;
      for (let i = 0; i < placed; i++) {
        const w = workFor(i); total += w;
        const terms = i === 0 ? t("no other charges yet", "belum ada muatan lain")
          : CH.slice(0, i).map(o => `k(${CH[i].mult}q)(${o.mult}q)/d`).join(" + ");
        rows.push(h("div", { class: "mono" }, `${t("bring", "bawa")} ${CH[i].name}: W = ${terms} = ${num(w * 1000, 2)} mJ`));
      }
      fill(readout, ...rows,
        h("div", {}, h("b", {}, `U = ${t("total work", "total usaha")} = ${num(total * 1000, 2)} mJ`)),
        placed === 3 ? h("div", {}, t("= −10kq²/d ≈ −17 mJ. Negative: the charges 'want' to come together, so you'd have to do +17 mJ to pull them apart.",
          "= −10kq²/d ≈ −17 mJ. Negatif: muatan-muatan 'ingin' berkumpul, jadi Anda harus melakukan +17 mJ untuk memisahkannya.")) : null,
        h("div", { class: "muted" }, t("q = 150 nC. Each new charge costs (its charge) × (potential made by the charges already there).",
          "q = 150 nC. Setiap muatan baru butuh (muatannya) × (potensial dari muatan yang sudah ada).")));
    }
    root.append(h("div", { class: "demo-controls" },
      button(t("▶ Bring the next charge", "▶ Bawa muatan berikutnya"), () => { if (placed < 3) { placed++; draw(); } }),
      button(t("Reset", "Ulang"), () => { placed = 0; draw(); })),
      h("div", { class: "fig" }, svg), readout);
    draw();
  };

  // ---- Digital Logic ---------------------------------------------------------------------

  // Small toggle button that shows 0/1 and flips on click.
  function bitButton(get, set, label = "") {
    const b = button("", () => { set(get() ? 0 : 1); });
    const show = () => { b.textContent = label + get(); b.classList.toggle("active", !!get()); };
    show();
    return { b, show };
  }

  function table(head, rows) {
    return h("table", { class: "demo-table" },
      h("tr", {}, ...head.map(c => h("th", {}, c))),
      ...rows.map(r => h("tr", { class: r.cls || "" }, ...r.cells.map(c => h("td", {}, c)))));
  }

  // ---- Ch 2: base converter (exact, with fractions) ----
  DEMOS["base-convert"] = function (root, lang) {
    const { t } = makeT(lang);
    const DIG = "0123456789ABCDEF";
    const input = h("input", { type: "text", value: "10100.1101", class: "num", style: "width: 11em" });
    const base = h("select", {}, ...[2, 3, 8, 10, 13, 16].map(b => h("option", { value: b }, t("base ", "basis ") + b)));
    const readout = h("div", { class: "demo-readout" });
    // Value as an exact fraction num / den (BigInt).
    function parse(str, r) {
      const m = str.trim().toUpperCase().match(/^([0-9A-F]*)(?:\.([0-9A-F]*))?$/);
      if (!m || (!m[1] && !m[2])) return null;
      const digits = (m[1] || "") + (m[2] || "");
      let num = 0n;
      for (const ch of digits) {
        const d = DIG.indexOf(ch);
        if (d < 0 || d >= r) return null;
        num = num * BigInt(r) + BigInt(d);
      }
      return { num, den: BigInt(r) ** BigInt((m[2] || "").length), whole: m[1] || "0", frac: m[2] || "" };
    }
    function toBase(num, den, b, maxFrac = 10) {
      const B = BigInt(b);
      let w = num / den, rem = num % den, ws = "";
      do { ws = DIG[Number(w % B)] + ws; w /= B; } while (w > 0n);
      let fs = "";
      while (rem > 0n && fs.length < maxFrac) { rem *= B; fs += DIG[Number(rem / den)]; rem %= den; }
      return ws + (fs ? "." + fs : "") + (rem > 0n ? " …" : "");
    }
    function draw() {
      const r = +base.value, v = parse(input.value, r);
      if (!v) {
        fill(readout, h("div", { class: "warn" }, t(`Not a valid base-${r} number.`, `Bukan bilangan basis ${r} yang sah.`)));
        return;
      }
      const terms = [];
      [...v.whole].forEach((ch, i) => terms.push(`${ch}·${r}^${v.whole.length - 1 - i}`));
      [...v.frac].forEach((ch, i) => terms.push(`${ch}·${r}^−${i + 1}`));
      const dec = Number(v.num) / Number(v.den);
      // Whole part → binary by repeated division, the slide method.
      let q = Number(v.num / v.den), steps = [];
      if (q > 0 && q < 2 ** 20) while (q > 0) { steps.push(`${q} ÷ 2 = ${Math.floor(q / 2)} r ${q % 2}`); q = Math.floor(q / 2); }
      fill(readout,
        table([t("Base", "Basis"), t("Value", "Nilai")], [2, 8, 10, 16].map(b => ({ cells: [String(b), toBase(v.num, v.den, b)], cls: b === r ? "hl" : "" }))),
        h("div", { class: "mono" }, `= ${terms.join(" + ")} = ${dec}`),
        steps.length ? h("div", { class: "mono" }, t("Whole part to binary (read remainders bottom-up): ", "Bagian bulat ke biner (baca sisa dari bawah): ") + steps.join(" · ")) : null,
        h("div", { class: "muted" }, t("“…” means the fraction doesn't end in that base: it was cut after 10 digits.",
          "“…” berarti pecahannya tidak berakhir di basis itu: dipotong setelah 10 digit.")));
    }
    input.addEventListener("input", draw);
    base.addEventListener("change", draw);
    const preset = (txt, b) => button(`${txt}₍${b}₎`, () => { input.value = txt; base.value = b; draw(); });
    root.append(h("div", { class: "demo-controls" }, input, base),
      h("div", { class: "demo-controls" }, preset("329", 13), preset("923", 16), preset("0.7875", 10), preset("174003", 8), preset("15C.38", 16)),
      readout);
    draw();
  };

  // ---- Ch 4: Boolean expressions ----
  // Grammar: sum of products; juxtaposition, · or * = AND; + = OR; ⊕ or ^ = XOR; postfix ' = NOT.
  function parseBool(src) {
    const s = src.replace(/[’′]/g, "'").replace(/\s+/g, "");
    let i = 0;
    const vars = new Set();
    const peek = () => s[i];
    function primary() {
      let node;
      if (peek() === "(") { i++; node = expr(); if (s[i++] !== ")") throw "paren"; }
      else if (/[A-Za-z]/.test(peek() || "")) { const v = s[i++].toUpperCase(); vars.add(v); node = env => env[v]; }
      else if (peek() === "0" || peek() === "1") { const c = s[i++] === "1"; node = () => c; }
      else throw "token";
      while (peek() === "'") { i++; const inner = node; node = env => !inner(env); }
      return node;
    }
    function product() {
      let node = primary();
      while (i < s.length && (/[A-Za-z01(]/.test(peek()) || peek() === "·" || peek() === "*")) {
        if (peek() === "·" || peek() === "*") i++;
        const a = node, b = primary(); node = env => a(env) && b(env);
      }
      return node;
    }
    function xor() {
      let node = product();
      while (peek() === "⊕" || peek() === "^") { i++; const a = node, b = product(); node = env => a(env) !== b(env); }
      return node;
    }
    function expr() {
      let node = xor();
      while (peek() === "+") { i++; const a = node, b = xor(); node = env => a(env) || b(env); }
      return node;
    }
    const f = expr();
    if (i !== s.length) throw "trailing";
    return { f, vars };
  }

  DEMOS["truth-table"] = function (root, lang) {
    const { t } = makeT(lang);
    const e1 = h("input", { type: "text", value: "XY + X'Z + YZ", class: "num", style: "width: 15em" });
    const e2 = h("input", { type: "text", value: "XY + X'Z", class: "num", style: "width: 15em" });
    const readout = h("div", { class: "demo-readout" });
    function draw() {
      let p1, p2;
      try { p1 = parseBool(e1.value); p2 = parseBool(e2.value); }
      catch (e) { fill(readout, h("div", { class: "warn" }, t("Can't read that expression. Use letters, ', +, ·, ⊕ and ( ).", "Ekspresi tidak terbaca. Pakai huruf, ', +, ·, ⊕, dan ( ).")) ); return; }
      const vars = [...new Set([...p1.vars, ...p2.vars])].sort();
      if (vars.length > 5) { fill(readout, h("div", { class: "warn" }, t("At most 5 variables.", "Maksimal 5 variabel."))); return; }
      const n = vars.length, rows = [], on1 = [], on2 = [], diff = [];
      for (let m = 0; m < 2 ** n; m++) {
        const env = {};
        vars.forEach((v, k) => { env[v] = !!((m >> (n - 1 - k)) & 1); });
        const a = +p1.f(env), b = +p2.f(env);
        if (a) on1.push(m); if (b) on2.push(m); if (a !== b) diff.push(m);
        rows.push({ cells: [String(m), ...vars.map(v => +env[v] + ""), a + "", b + ""], cls: a !== b ? "bad" : "" });
      }
      const sig = on => `Σ(${on.join(", ")})`;
      fill(readout,
        h("div", {}, h("b", { class: diff.length ? "no" : "ok" }, diff.length
          ? t(`Not equivalent: they differ in row(s) ${diff.join(", ")}.`, `Tidak ekuivalen: berbeda di baris ${diff.join(", ")}.`)
          : t("Equivalent: same output in every row (perfect induction).", "Ekuivalen: output sama di setiap baris (induksi sempurna)."))),
        h("div", { class: "mono" }, `F₁ = ${sig(on1)}`), h("div", { class: "mono" }, `F₂ = ${sig(on2)}`),
        table(["#", ...vars, "F₁", "F₂"], rows));
    }
    e1.addEventListener("input", draw); e2.addEventListener("input", draw);
    const preset = (label, a, b) => button(label, () => { e1.value = a; e2.value = b; draw(); });
    root.append(
      h("div", { class: "demo-controls" }, h("label", {}, "F₁ = ", e1), h("label", {}, "F₂ = ", e2)),
      h("div", { class: "demo-controls" },
        preset(t("Consensus", "Konsensus"), "XY + X'Z + YZ", "XY + X'Z"),
        preset("DeMorgan", "(XY)'", "X' + Y'"),
        preset(t("Common mistake", "Kesalahan umum"), "(X+Y)(X+Z)", "X+Y+Z"),
        preset("PS2 (a)", "BC+D+D'(B'+C')(AD+B)", "B+D"),
        preset(t("Blood types", "Golongan darah"), "XY + MN' + X'Y'N' + YM'N", "X'Y'M'N' + X'Y'MN' + X'YM'N + X'YMN' + XY'MN' + XYM'N' + XYM'N + XYMN' + XYMN")),
      readout);
    draw();
  };

  // ---- Ch 4: Karnaugh map with an exact minimizer ----
  function primeImplicants(on, dc) {
    let terms = [...new Set([...on, ...dc])].map(m => [m, 0]);
    const primes = [];
    while (terms.length) {
      const used = new Set(), next = new Map();
      for (let a = 0; a < terms.length; a++) for (let b = a + 1; b < terms.length; b++) {
        const [va, ma] = terms[a], [vb, mb] = terms[b], d = va ^ vb;
        if (ma === mb && d && !(d & (d - 1))) { next.set(`${va & ~d},${ma | d}`, [va & ~d, ma | d]); used.add(a); used.add(b); }
      }
      terms.forEach((tm, k) => { if (!used.has(k)) primes.push(tm); });
      terms = [...next.values()];
    }
    return primes;
  }
  const covers = ([v, mask], m) => (m & ~mask) === v;
  function minimalCover(n, on, dc) {
    if (!on.length) return [];
    const all = primeImplicants(on, dc), lits = ([, mask]) => n - mask.toString(2).split("1").length + 1;
    // Essential primes (the only cover of some 1) belong to every minimal sum: take them first.
    const ess = [];
    for (const m of on) {
      const cov = all.filter(p => covers(p, m));
      if (cov.length === 1 && !ess.includes(cov[0])) ess.push(cov[0]);
    }
    const left = on.filter(m => !ess.some(p => covers(p, m)));
    const P = all.filter(p => !ess.includes(p) && left.some(m => covers(p, m)));
    let best = left.length ? null : { terms: [] };
    const pick = (start, chosen, k) => {
      if (chosen.length === k) {
        if (left.every(m => chosen.some(p => covers(p, m)))) {
          const cost = chosen.reduce((c, p) => c + lits(p), 0);
          if (!best || cost < best.cost) best = { cost, terms: [...chosen] };
        }
        return;
      }
      for (let j = start; j < P.length; j++) { chosen.push(P[j]); pick(j + 1, chosen, k); chosen.pop(); }
    };
    for (let k = 1; k <= P.length && !best; k++) pick(0, [], k);
    return [...ess, ...best.terms];
  }
  function termText([v, mask], names) {
    const n = names.length;
    const out = names.map((x, k) => { const bit = 1 << (n - 1 - k); return mask & bit ? "" : x + (v & bit ? "" : "′"); }).join("");
    return out || "1";
  }

  DEMOS["kmap"] = function (root, lang) {
    const { t } = makeT(lang);
    const GRAY = [0, 1, 3, 2];
    const NAMES = { 2: ["X", "Y"], 3: ["X", "Y", "Z"], 4: ["W", "X", "Y", "Z"] };
    let n = 4, cell = {};      // minterm → 0 | 1 | "d"
    const svg = svgBox(360, 300, 300);
    const readout = h("div", { class: "demo-readout" });
    const sizeBtns = [2, 3, 4].map(k => button(t(`${k} variables`, `${k} variabel`), () => { n = k; cell = {}; draw(); }));
    function layout() {
      const rb = n === 4 ? 2 : 1, cb = n - rb;
      const rows = rb === 2 ? GRAY : [0, 1], cols = cb === 2 ? GRAY : [0, 1];
      return { rb, cb, rows, cols, at: (r, c) => (rows[r] << cb) | cols[c] };
    }
    function draw() {
      sizeBtns.forEach((b, k) => b.classList.toggle("active", k + 2 === n));
      const names = NAMES[n], L = layout(), on = [], dc = [];
      for (const [m, v] of Object.entries(cell)) { if (v === 1) on.push(+m); if (v === "d") dc.push(+m); }
      const sol = minimalCover(n, on, dc);
      const X0 = 90, Y0 = 70, S = 56;
      svg.replaceChildren();
      const bits = (v, k) => v.toString(2).padStart(k, "0");
      svg.append(s("text", { x: X0 - 12, y: Y0 - 12, class: "m", "font-size": 13, "text-anchor": "end" },
        names.slice(0, L.rb).join("") + " \\ " + names.slice(L.rb).join("")));
      L.cols.forEach((c, j) => svg.append(s("text", { x: X0 + j * S + S / 2, y: Y0 - 10, class: "t", "font-size": 14, "text-anchor": "middle" }, bits(c, L.cb))));
      L.rows.forEach((r, i) => svg.append(s("text", { x: X0 - 12, y: Y0 + i * S + S / 2 + 5, class: "t", "font-size": 14, "text-anchor": "end" }, bits(r, L.rb))));
      L.rows.forEach((_, i) => L.cols.forEach((_, j) => {
        const m = L.at(i, j), v = cell[m] || 0, x = X0 + j * S, y = Y0 + i * S;
        const g = s("g", { style: "cursor: pointer" },
          s("rect", { x, y, width: S, height: S, class: "cell" + (v === 1 ? " on" : "") }),
          s("text", { x: x + S / 2, y: y + S / 2 + 6, class: "t", "font-size": 18, "text-anchor": "middle", "font-weight": 700 }, v === 0 ? "" : v === 1 ? "1" : "d"),
          s("text", { x: x + 4, y: y + 12, class: "m", "font-size": 10 }, String(m)));
        sol.forEach((p, k) => { if (covers(p, m)) g.append(s("circle", { cx: x + 10 + k * 9, cy: y + S - 9, r: 3.5, style: `fill: var(--c${(k % 6) + 1})` })); });
        g.addEventListener("click", () => { cell[m] = v === 0 ? 1 : v === 1 ? "d" : 0; draw(); });
        svg.append(g);
      }));
      fill(readout,
        h("div", { class: "mono" }, `F = Σ(${on.sort((a, b) => a - b).join(", ")})` + (dc.length ? ` + d(${dc.sort((a, b) => a - b).join(", ")})` : "")),
        h("div", {}, h("b", {}, t("Minimal sum: ", "Jumlah minimal: ")),
          on.length === 0 ? "F = 0" : sol.length === 1 && sol[0][1] === 2 ** n - 1 ? "F = 1" :
          h("span", {}, "F = ", ...sol.flatMap((p, k) => [k ? " + " : "", h("b", { style: `color: var(--c${(k % 6) + 1})` }, termText(p, names))]))),
        h("div", { class: "muted" }, t("Click a cell: blank → 1 → d → blank. Coloured dots show which group covers each cell. Remember the map wraps around at the edges.",
          "Klik sel: kosong → 1 → d → kosong. Titik berwarna menunjukkan kelompok yang menutup setiap sel. Ingat peta menyambung di tepinya.")));
    }
    const preset = (label, k, on, dc = []) => button(label, () => { n = k; cell = {}; on.forEach(m => cell[m] = 1); dc.forEach(m => cell[m] = "d"); draw(); });
    root.append(h("div", { class: "demo-controls" }, ...sizeBtns, button(t("Clear", "Hapus"), () => { cell = {}; draw(); })),
      h("div", { class: "demo-controls" },
        preset(t("Slide: primes", "Slide: prima"), 4, [1, 2, 3, 5, 7, 11, 13]),
        preset(t("Slide: Σ(1,2,5,7)", "Slide: Σ(1,2,5,7)"), 3, [1, 2, 5, 7]),
        preset(t("Don't-care demo", "Contoh don't-care"), 3, [0, 1, 2, 4], [5, 6])),
      h("div", { class: "fig" }, svg), readout);
    draw();
  };

  // ---- Ch 6: decoder and multiplexer lab ----
  DEMOS["decoder-mux"] = function (root, lang) {
    const { t } = makeT(lang);
    let mode = "dec", A = [0, 1, 1], G1 = 1, G2A = 0, G2B = 0, D = [0, 0, 0, 1, 0, 1, 1, 1], pick = new Set();
    const readout = h("div", { class: "demo-readout" }), controls = h("div", {});
    const modeBtns = [["dec", t("74x138 decoder", "Decoder 74x138")], ["mux", t("8:1 multiplexer", "Multiplexer 8:1")]]
      .map(([m, label]) => button(label, () => { mode = m; draw(); }));
    const led = on => h("span", { style: `display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:4px;vertical-align:-1px;background:${on ? "var(--accent)" : "var(--line)"}` });
    function draw() {
      modeBtns.forEach((b, k) => b.classList.toggle("active", ["dec", "mux"][k] === mode));
      const sel = A[0] * 4 + A[1] * 2 + A[2];
      const selBits = ["A2", "A1", "A0"].map((nm, k) => bitButton(() => A[k], v => { A[k] = v; draw(); }, nm + " = ").b);
      if (mode === "dec") {
        const en = G1 === 1 && G2A === 0 && G2B === 0;
        fill(controls, h("div", { class: "demo-controls" }, ...selBits),
          h("div", { class: "demo-controls" },
            bitButton(() => G1, v => { G1 = v; draw(); }, "G1 = ").b,
            bitButton(() => G2A, v => { G2A = v; draw(); }, "G2A_L = ").b,
            bitButton(() => G2B, v => { G2B = v; draw(); }, "G2B_L = ").b));
        const yl = [...Array(8)].map((_, i) => (en && i === sel ? 0 : 1));
        const F = [...pick].some(i => yl[i] === 0) ? 1 : 0;
        fill(readout,
          h("div", {}, h("b", {}, en ? t(`Enabled: output Y${sel}_L goes LOW.`, `Aktif: output Y${sel}_L menjadi LOW.`)
            : t("Disabled (needs G1 = 1, G2A_L = 0, G2B_L = 0): every output stays HIGH.", "Nonaktif (perlu G1 = 1, G2A_L = 0, G2B_L = 0): semua output tetap HIGH."))),
          h("div", { class: "mono" }, "Y_L(0 to 7) = \"" + yl.join("") + "\""),
          h("div", { class: "demo-controls" }, ...yl.map((v, i) => {
            const b = button("", () => { pick.has(i) ? pick.delete(i) : pick.add(i); draw(); });
            b.append(led(v === 0), `Y${i}_L`); b.classList.toggle("active", pick.has(i)); return b;
          })),
          h("div", {}, t("Build a function: click outputs to feed them into a NAND. ", "Bangun fungsi: klik output untuk memasukkannya ke NAND. "),
            pick.size ? h("b", {}, `F = Σ(${[...pick].sort().join(", ")}) = NAND(${[...pick].sort().map(i => `Y${i}_L`).join(", ")}) = ${F}`) : null),
          h("div", { class: "muted" }, t("A NAND outputs 1 when ANY of its inputs is 0, so it ORs the active-low minterm lines.",
            "NAND mengeluarkan 1 jika SALAH SATU inputnya 0, jadi ia meng-OR-kan garis minterm aktif-rendah.")));
      } else {
        fill(controls, h("div", { class: "demo-controls" }, ...selBits.map((b, k) => { b.textContent = ["C", "B", "A"][k] + " = " + A[k]; return b; })),
          h("div", { class: "demo-controls" }, ...D.map((_, i) => bitButton(() => D[i], v => { D[i] = v; draw(); }, `D${i} = `).b)));
        const on = D.map((v, i) => (v ? i : -1)).filter(i => i >= 0);
        fill(readout,
          h("div", {}, h("b", {}, t(`Select CBA = ${A.join("")} = ${sel} → Y = D${sel} = ${D[sel]}`, `Pilih CBA = ${A.join("")} = ${sel} → Y = D${sel} = ${D[sel]}`))),
          h("div", { class: "mono" }, `Y = Σ mᵢ·Dᵢ  →  F(C,B,A) = Σ(${on.join(", ")})`),
          h("div", { class: "muted" }, t("Setting each Dᵢ to the function's value in row i turns the MUX into that function (the slide example 0,0,0,1,0,1,1,1 is the majority function).",
            "Mengisi setiap Dᵢ dengan nilai fungsi di baris i mengubah MUX menjadi fungsi itu (contoh slide 0,0,0,1,0,1,1,1 adalah fungsi mayoritas).")));
      }
    }
    root.append(h("div", { class: "demo-controls" }, ...modeBtns), controls, readout);
    draw();
  };

  // ---- Ch 5–6: step through VHDL loops ----
  DEMOS["vhdl-loop"] = function (root, lang) {
    const { t } = makeT(lang);
    const PROGS = {
      conv_int: { label: "CONV_INTEGER", input: "10011", head: ["i", "X(i)", "RESULT*2", "RESULT"],
        run(x) {
          if (!/^[01]{1,16}$/.test(x)) return null;
          let R = 0; const rows = [];
          [...x].forEach((b, i) => { const d = R * 2; R = d + +b; rows.push([i, `'${b}'`, d, R]); });
          return { rows, result: `RESULT = ${R}` };
        } },
      conv_vec: { label: "CONV_STD_LOGIC_VECTOR", input: "19, 5", head: ["i", "temp", "temp mod 2", "result(i)", "temp/2"],
        run(x) {
          const m = x.match(/^\s*(\d{1,6})\s*,\s*(\d{1,2})\s*$/); if (!m) return null;
          let temp = +m[1]; const size = +m[2], res = Array(size).fill("0"), rows = [];
          if (size < 1 || size > 20) return null;
          for (let i = 0; i < size; i++) { const r = temp % 2; res[size - 1 - i] = String(r); rows.push([i, temp, r, `'${r}'`, Math.floor(temp / 2)]); temp = Math.floor(temp / 2); }
          return { rows, result: `result = "${res.join("")}"` + (temp ? t("  (too few bits: the high part was lost)", "  (bit kurang: bagian atas hilang)") : "") };
        } },
      parity: { label: "parity9", input: "100110101", head: ["j", "I(j)", "p := not p?", "p"],
        run(x) {
          if (!/^[01]{9}$/.test(x)) return null;
          let p = +x[0]; const rows = [["—", `'${x[0]}'`, "p := I(1)", `'${p}'`]];
          for (let j = 2; j <= 9; j++) { const flip = x[j - 1] === "1"; if (flip) p ^= 1; rows.push([j, `'${x[j - 1]}'`, flip ? t("yes", "ya") : "—", `'${p}'`]); }
          return { rows, result: `ODD <= '${p}', EVEN <= '${1 - p}'` };
        } },
      prime: { label: "prime9", input: "9", head: ["i", "NI mod i", "NI /= i", "prime"],
        run(x) {
          if (!/^\d{1,3}$/.test(x) || +x > 255) return null;
          const NI = +x, rows = []; let prime = true;
          if (NI === 1 || NI === 2) rows.push(["—", "—", "—", t("true (boundary case)", "true (kasus batas)")]);
          else for (let i = 2; i <= 253; i++) {
            const r = NI % i, hit = r === 0 && NI !== i;
            if (hit) prime = false;
            if (i <= 8 || hit) rows.push([i, r, NI !== i ? t("yes", "ya") : t("no", "tidak"), hit ? "false → exit" : "true"]);
            if (hit) break;
            if (i === 9) rows.push(["…", "…", "…", t("true (keeps going to 253)", "true (terus sampai 253)")]);
          }
          return { rows, result: `F <= '${prime ? 1 : 0}'` };
        } },
    };
    let key = "conv_int", shown = 0;
    const input = h("input", { type: "text", class: "num", style: "width: 9em" });
    const readout = h("div", { class: "demo-readout" });
    const progBtns = Object.entries(PROGS).map(([k, p]) => button(p.label, () => { key = k; input.value = p.input; shown = 0; draw(); }));
    function draw() {
      progBtns.forEach((b, k) => b.classList.toggle("active", Object.keys(PROGS)[k] === key));
      const P = PROGS[key], out = P.run(input.value);
      if (!out) { fill(readout, h("div", { class: "warn" }, t(`Input format: ${P.input}`, `Format input: ${P.input}`))); return; }
      const rows = out.rows.slice(0, shown);
      fill(readout,
        table(P.head, rows.map((r, k) => ({ cells: r.map(String), cls: k === shown - 1 ? "hl" : "" }))),
        shown >= out.rows.length ? h("div", {}, h("b", { class: "ok" }, out.result))
          : h("div", { class: "muted" }, t(`Step ${shown} of ${out.rows.length}`, `Langkah ${shown} dari ${out.rows.length}`)));
    }
    input.addEventListener("input", () => { shown = 0; draw(); });
    root.append(h("div", { class: "demo-controls" }, ...progBtns),
      h("div", { class: "demo-controls" }, h("label", {}, t("Input ", "Input "), input),
        button(t("▶ Step", "▶ Langkah"), () => { shown++; draw(); }),
        button(t("Run all", "Jalankan semua"), () => { shown = 1e9; draw(); }),
        button(t("Reset", "Ulang"), () => { shown = 0; draw(); })),
      readout);
    input.value = PROGS[key].input;
    draw();
  };

  window.DEMOS = DEMOS;
})();
