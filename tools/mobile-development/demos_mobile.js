  // ================= Mobile Development demos (spliced into demos.js; source: tools/mobile-development/) =================
  // Animations use setTimeout chains that stop by themselves when the demo is removed from the page.
  function mobTimers(root) {
    const ids = [];
    return {
      later(fn, ms) { const id = setTimeout(() => { if (root.isConnected) fn(); }, ms); ids.push(id); return id; },
      clear() { ids.splice(0).forEach(clearTimeout); },
    };
  }
  function mobPhone(...kids) {
    return h("div", { class: "mob-phone" }, h("div", { class: "mob-notch" }), ...kids);
  }

  // ---- Ch 1: the five layers, animated request ----
  DEMOS["layers"] = function (root, lang) {
    const { t } = makeT(lang);
    const tm = mobTimers(root);
    const NAMES = ["Applications", "Application Framework", "Android Runtime", "Platform Libraries", "Linux Kernel"];
    const FEATURES = {
      photo: { label: t("Take a photo", "Ambil foto"), steps: [
        [0, "down", t("The user taps the shutter button in the Camera app.", "User menekan tombol shutter di app Kamera.")],
        [1, "down", t("The app calls the Camera API; the camera system service (Framework) handles the request.", "App memanggil Camera API; camera system service (Framework) menangani permintaan.")],
        [3, "down", t("Native camera and image-processing libraries prepare the request.", "Library native kamera dan pemrosesan gambar menyiapkan permintaan.")],
        [4, "down", t("The camera driver in the Linux Kernel talks to the camera hardware, which captures light.", "Driver kamera di Linux Kernel berbicara dengan hardware kamera, yang menangkap cahaya.")],
        [3, "up", t("Image data travels back up to the native libraries.", "Data gambar naik kembali ke library native.")],
        [1, "up", t("The framework hands the result to the app.", "Framework menyerahkan hasil ke app.")],
        [0, "up", t("The app shows the photo.", "App menampilkan foto.")]] },
      location: { label: t("Get location", "Ambil lokasi"), steps: [
        [0, "down", t("The navigation app asks for the current location (the user must allow the permission).", "App navigasi meminta lokasi saat ini (user harus mengizinkan permission).")],
        [1, "down", t("The framework Location API passes the request to the system location service.", "Location API framework meneruskan permintaan ke system location service.")],
        [4, "down", t("Drivers for GPS, Wi-Fi and sensors read the hardware.", "Driver GPS, Wi-Fi, dan sensor membaca hardware.")],
        [1, "up", t("The system location service returns the position through the framework.", "System location service mengembalikan posisi lewat framework.")],
        [0, "up", t("The app draws the position on the map.", "App menggambar posisi di peta.")]] },
      video: { label: t("Play a video", "Putar video"), steps: [
        [0, "down", t("The user taps Play in the video app.", "User menekan Play di app video.")],
        [1, "down", t("The media framework opens the file or stream.", "Media framework membuka file atau stream.")],
        [3, "down", t("Media and codec libraries decode the video and audio.", "Library media dan codec mendekode video dan audio.")],
        [4, "down", t("Audio and display drivers play sound and draw frames.", "Driver audio dan layar memutar suara dan menggambar frame.")],
        [0, "up", t("Pictures and sound reach the user. One tap crossed several layers.", "Gambar dan suara sampai ke user. Satu tap melewati beberapa layer.")]] },
    };
    let key = "photo", step = -1, playing = false;
    const svg = svgBox(520, 300, 420);
    const rects = NAMES.map((n, i) => {
      const r = s("rect", { x: 10, y: 10 + i * 50, width: 400, height: 42, rx: 8, class: "mob-lay" });
      const tx = s("text", { x: 210, y: 36 + i * 50, "text-anchor": "middle", class: "mob-laytxt" }, n);
      svg.append(r, tx);
      return r;
    });
    svg.append(s("rect", { x: 10, y: 262, width: 400, height: 28, rx: 8, class: "mob-hw" }),
      s("text", { x: 210, y: 281, "text-anchor": "middle", class: "mob-laytxt" }, t("Hardware (camera, GPS, screen)", "Hardware (kamera, GPS, layar)")));
    const marker = s("g", { class: "mob-marker" }, s("circle", { cx: 465, cy: 31, r: 13 }), s("text", { x: 465, y: 36, "text-anchor": "middle", class: "mob-arrow" }, ""));
    svg.append(marker);
    const arrow = marker.querySelector("text");
    const caption = h("div", { class: "demo-readout" });
    const btnRow = h("div", { class: "demo-controls" });
    const featBtns = Object.entries(FEATURES).map(([k, f]) => button(f.label, () => { tm.clear(); playing = false; key = k; step = -1; draw(); }));
    const playBtn = button("▶ " + t("Play", "Putar"), () => { if (playing) return; playing = true; if (step >= FEATURES[key].steps.length - 1) step = -1; tick(); });
    function tick() {
      if (!playing) return;
      if (step >= FEATURES[key].steps.length - 1) { playing = false; draw(); return; }
      step++; draw();
      tm.later(tick, 1700);
    }
    function draw() {
      const F = FEATURES[key];
      featBtns.forEach((b, i) => b.classList.toggle("active", Object.keys(FEATURES)[i] === key));
      rects.forEach((r, i) => r.classList.toggle("on", step >= 0 && F.steps[step][0] === i));
      const cur = step >= 0 ? F.steps[step] : null;
      marker.style.transform = `translateY(${(cur ? cur[0] : 0) * 50}px)`;
      marker.classList.toggle("idle", !cur);
      arrow.textContent = cur ? (cur[1] === "down" ? "↓" : "↑") : "";
      fill(caption,
        cur ? h("div", {}, h("b", {}, t(`Step ${step + 1} of ${F.steps.length}`, `Langkah ${step + 1} dari ${F.steps.length}`)),
          " · ", cur[1] === "down" ? t("request goes down", "permintaan turun") : t("result comes back up", "hasil naik kembali"))
          : h("div", { class: "muted" }, t("Pick a feature and press Play or Step.", "Pilih fitur lalu tekan Putar atau Langkah.")),
        cur ? h("div", {}, NAMES[cur[0]] + ": " + cur[2]) : null);
    }
    btnRow.append(...featBtns, playBtn,
      button(t("Step ▶", "Langkah ▶"), () => { tm.clear(); playing = false; if (step < FEATURES[key].steps.length - 1) step++; draw(); }),
      button(t("Reset", "Ulang"), () => { tm.clear(); playing = false; step = -1; draw(); }));
    root.append(btnRow, svg, caption);
    draw();
  };

  // ---- Ch 3: Activity lifecycle, with a variable that is lost and a value that is saved ----
  DEMOS["lifecycle"] = function (root, lang) {
    const { t } = makeT(lang);
    const tm = mobTimers(root);
    const M = ["onCreate()", "onStart()", "onResume()", "onPause()", "onStop()", "onDestroy()"];
    let phase = "off", cur = -1, busy = false, memory = "", prefs = "", restore = false;
    let logLines = [], note = t("The app is not running. Press Open app.", "App belum berjalan. Tekan Buka app.");
    const chips = M.map(m => h("div", { class: "mob-chip" }, m));
    const chipRow = h("div", { class: "mob-chiprow" });
    chips.forEach((c, i) => { chipRow.append(c); if (i < chips.length - 1) chipRow.append(h("span", { class: "mob-arrow-s" }, "→")); });
    const logBox = h("div", { class: "mono mob-log" });
    const noteBox = h("div", { class: "muted" });
    const varInput = h("input", { type: "text", class: "num", style: "width: 10em", placeholder: t("type something", "ketik sesuatu") });
    varInput.addEventListener("input", () => { memory = varInput.value; draw(); });
    const memBox = h("div", { class: "mob-store" }), prefBox = h("div", { class: "mob-store" });
    const chk = h("input", { type: "checkbox" });
    chk.addEventListener("change", () => { restore = chk.checked; });
    const b = {};
    function run(seq, onEnd, hook) {
      busy = true; draw();
      seq.forEach((m, i) => tm.later(() => {
        cur = m; logLines.push(M[m]); if (logLines.length > 7) logLines.shift();
        if (hook) hook(m);
        draw();
        if (i === seq.length - 1) tm.later(() => { busy = false; onEnd(); draw(); }, 350);
      }, 600 * (i + 1)));
    }
    function onCb(m) {   // what our own code does inside each callback
      if (m === 5) memory = "";
      if (m === 0 && restore) memory = prefs;
      varInput.value = memory;
    }
    const actions = {
      open: () => { memory = ""; varInput.value = ""; run([0, 1, 2], () => { phase = "resumed"; note = restore && prefs ? t("onCreate() restored the saved value.", "onCreate() memulihkan nilai tersimpan.") : t("The user can interact now.", "User sudah bisa berinteraksi."); }, onCb); },
      home: () => run([3, 4], () => { phase = "stopped"; note = t("The app is in the background. The Activity (and its variable) still exists.", "App di latar belakang. Activity (dan variabelnya) masih ada."); }, onCb),
      back: () => run([3, 4, 5], () => { phase = "off"; note = t("The Activity was destroyed. The variable is lost; the saved value is not.", "Activity dihancurkan. Variabel hilang; nilai tersimpan tidak."); }, onCb),
      again: () => run([1, 2], () => { phase = "resumed"; note = t("Back in front. (Real Android also calls onRestart() first.)", "Kembali ke depan. (Android asli juga memanggil onRestart() dulu.)"); }, onCb),
      rotate: () => run([3, 4, 5, 0, 1, 2], () => { phase = "resumed"; note = restore ? t("Rotation recreated the Activity; onCreate() restored the saved value.", "Rotasi membuat ulang Activity; onCreate() memulihkan nilai tersimpan.") : t("Rotation destroyed and recreated the Activity: the variable was lost!", "Rotasi menghancurkan dan membuat ulang Activity: variabel hilang!"); }, onCb),
      save: () => { prefs = memory; note = t("Saved to SharedPreferences (it survives destroy and restart).", "Disimpan ke SharedPreferences (bertahan setelah destroy dan restart)."); draw(); },
    };
    b.open = button(t("Open app", "Buka app"), actions.open);
    b.home = button(t("Press Home", "Tekan Home"), actions.home);
    b.again = button(t("Return to app", "Kembali ke app"), actions.again);
    b.rotate = button(t("Rotate screen", "Putar layar"), actions.rotate);
    b.back = button(t("Press Back (close)", "Tekan Back (tutup)"), actions.back);
    b.save = button(t("Save in SharedPreferences", "Simpan di SharedPreferences"), actions.save);
    function draw() {
      chips.forEach((c, i) => c.classList.toggle("on", i === cur));
      b.open.disabled = busy || phase !== "off";
      b.home.disabled = busy || phase !== "resumed";
      b.rotate.disabled = busy || phase !== "resumed";
      b.back.disabled = busy || phase === "off";
      b.again.disabled = busy || phase !== "stopped";
      b.save.disabled = busy || phase !== "resumed";
      varInput.disabled = busy || phase !== "resumed";
      fill(logBox, ...logLines.map((l, i) => h("div", { class: i === logLines.length - 1 ? "mob-newest" : "" }, "▸ " + l)));
      fill(noteBox, note);
      fill(memBox, h("b", {}, t("Variable in the Activity", "Variabel di Activity")), h("div", { class: "mob-val" }, phase === "off" ? "—" : (memory || "∅")));
      fill(prefBox, h("b", {}, "SharedPreferences"), h("div", { class: "mob-val" }, prefs || "∅"));
    }
    root.append(chipRow,
      h("div", { class: "demo-controls" }, b.open, b.home, b.again, b.rotate, b.back),
      h("div", { class: "demo-controls" }, h("label", {}, t("Variable: ", "Variabel: "), varInput), b.save,
        h("label", { class: "mob-check" }, chk, " " + t("onCreate() restores the saved value", "onCreate() memulihkan nilai tersimpan"))),
      h("div", { class: "mob-stores" }, memBox, prefBox), logBox, noteBox);
    draw();
  };

  // ---- Ch 4: is it XML or Activity? ----
  DEMOS["xml-activity"] = function (root, lang) {
    const { t } = makeT(lang);
    const tm = mobTimers(root);
    const REQ = [
      { en: "Change the button text from \"Calculate\" to \"Hitung\".", id: "Ubah teks tombol dari \"Calculate\" menjadi \"Hitung\".", ans: "xml", hot: "btn", set: { btn: "Hitung" }, why_en: "Text that is seen on the screen is set in the XML (android:text).", why_id: "Teks yang terlihat di layar diatur di XML (android:text)." },
      { en: "Change the fee from Rs. 100 to Rs. 150 per hour.", id: "Ubah tarif dari Rs. 100 menjadi Rs. 150 per jam.", ans: "act", hot: "res", set: { rate: 150 }, why_en: "A formula is logic: it lives in the Activity (fee = hours * 150).", why_id: "Rumus adalah logika: ada di Activity (fee = hours * 150)." },
      { en: "Make the title text bigger (24sp).", id: "Perbesar teks judul (24sp).", ans: "xml", hot: "title", set: { big: true }, why_en: "Size and style are appearance, so XML (android:textSize).", why_id: "Ukuran dan gaya adalah tampilan, jadi XML (android:textSize)." },
      { en: "Show a red error when the box is empty.", id: "Tampilkan error merah saat kotak kosong.", ans: "act", hot: "inp", set: { err: t("Enter hours", "Enter hours") }, why_en: "Checking input is validation: Activity (setError).", why_id: "Mengecek input adalah validasi: Activity (setError)." },
      { en: "Move the button above the text box.", id: "Pindahkan tombol ke atas kotak input.", ans: "xml", hot: "btn", set: { first: true }, why_en: "Position and order are arrangement, so XML.", why_id: "Posisi dan urutan adalah susunan, jadi XML." },
      { en: "Show the total after the button is tapped.", id: "Tampilkan total setelah tombol ditekan.", ans: "act", hot: "res", set: { shown: true }, why_en: "What happens on a tap is an action: Activity (setOnClickListener + setText).", why_id: "Apa yang terjadi saat tap adalah aksi: Activity (setOnClickListener + setText)." },
      { en: "Change the hint text of the input box.", id: "Ubah teks hint kotak input.", ans: "xml", hot: "inp", set: { hint: t("Hours parked", "Jam parkir") }, why_en: "A hint is displayed text: XML (android:hint).", why_id: "Hint adalah teks yang ditampilkan: XML (android:hint)." },
      { en: "Reject negative hours.", id: "Tolak jam negatif.", ans: "act", hot: "inp", set: { err: "Must be > 0" }, why_en: "A rule about the input is validation: Activity (if hours <= 0).", why_id: "Aturan tentang input adalah validasi: Activity (if hours <= 0)." },
    ];
    let i = 0, score = 0, answered = false, answers = 0;
    let st = { btn: "Calculate", rate: 100, big: false, err: "", first: false, hint: "Enter hours", shown: false };
    const phoneBox = h("div", { class: "mob-phonewrap" });
    const reqBox = h("div", { class: "mob-req" });
    const fb = h("div", { class: "demo-readout" });
    const scoreBox = h("div", { class: "muted" });
    const bx = button("XML", () => answer("xml"), "mob-big"), ba = button("Activity", () => answer("act"), "mob-big");
    const next = button(t("Next ▶", "Berikutnya ▶"), () => { i = (i + 1) % REQ.length; if (i === 0) { score = 0; answers = 0; st = { btn: "Calculate", rate: 100, big: false, err: "", first: false, hint: "Enter hours", shown: false }; } answered = false; draw(); });
    function phone(hot, pulse) {
      const el = (id, node) => { if (id === hot) node.classList.add("mob-hot"); if (id === hot && pulse) node.classList.add("mob-pulse"); return node; };
      const title = el("title", h("div", { class: "mob-title" + (st.big ? " big" : "") }, t("Parking Fee", "Parking Fee")));
      const inp = el("inp", h("div", { class: "mob-input" }, h("span", {}, st.hint), st.err ? h("em", { class: "mob-err" }, st.err) : null));
      const btn = el("btn", h("div", { class: "mob-btn" }, st.btn));
      const res = el("res", h("div", { class: "mob-res" }, st.shown ? `Total Fee: Rs. ${3 * st.rate}` : `Rs. ${st.rate} / h`));
      return mobPhone(title, ...(st.first ? [btn, inp, res] : [inp, btn, res]));
    }
    function answer(a) {
      if (answered) return;
      answered = true; answers++;
      const r = REQ[i], ok = a === r.ans;
      if (ok) { score++; Object.assign(st, r.set); }
      draw(ok, true);
    }
    function draw(ok, pulse) {
      const r = REQ[i];
      fill(phoneBox, phone(r.hot, pulse));
      fill(reqBox, h("div", { class: "mob-qno" }, t(`Request ${i + 1} of ${REQ.length}`, `Permintaan ${i + 1} dari ${REQ.length}`)), h("div", { class: "mob-qtxt" }, t(r.en, r.id)));
      bx.disabled = ba.disabled = answered; next.disabled = !answered;
      fill(fb, answered ? h("div", {}, h("b", { class: ok ? "ok" : "no" }, ok ? t("Correct. ", "Benar. ") : t("Not quite. ", "Belum tepat. ")),
        (ok ? "" : t("It belongs in the ", "Ini ada di ") + (r.ans === "xml" ? "XML" : "Activity") + ". ") + t(r.why_en, r.why_id)) : h("div", { class: "muted" }, t("Where would you make this change?", "Di mana kamu akan membuat perubahan ini?")));
      fill(scoreBox, t(`Score: ${score} / ${answers}`, `Skor: ${score} / ${answers}`));
    }
    root.append(h("div", { class: "mob-split" }, phoneBox, h("div", {}, reqBox, h("div", { class: "demo-controls" }, bx, ba, next), fb, scoreBox)));
    draw();
  };

  // ---- Ch 5: the event pattern, animated (Parking Fee) ----
  DEMOS["parking"] = function (root, lang) {
    const { t } = makeT(lang);
    const tm = mobTimers(root);
    const STEPS = [
      ["find", t("1 find view", "1 find view"), "etHours = findViewById(R.id.etHours)"],
      ["click", t("2 listen for click", "2 listen for click"), "btnCalc.setOnClickListener(...)"],
      ["valid", t("3 validate", "3 validate"), "empty? number? hours <= 0 ?"],
      ["proc", t("4 process", "4 process"), "fee = hours * 100"],
      ["ui", t("5 update UI", "5 update UI"), "tvResult.setText(...)"],
    ];
    const input = h("input", { type: "text", class: "mob-realinput", value: "3", placeholder: t("Enter hours", "Enter hours"), inputmode: "numeric" });
    const errBox = h("em", { class: "mob-err" });
    const resBox = h("div", { class: "mob-res" }, "—");
    const goBtn = button("Calculate", () => go(), "mob-btn-real");
    const list = h("div", { class: "mob-steps" });
    const detail = h("div", { class: "demo-readout" });
    let states = ["", "", "", "", ""], busy = false;
    function evalInput(raw) {
      const text = raw.trim();
      if (text === "") return { ok: false, msg: "Enter hours", why: t("The text is empty, so setError and return.", "Teks kosong, jadi setError lalu return.") };
      if (!/^-?\d+$/.test(text)) return { ok: false, msg: "Numbers only", why: t("parseInt throws NumberFormatException, so the catch block shows the error.", "parseInt melempar NumberFormatException, jadi blok catch menampilkan error.") };
      const hours = parseInt(text, 10);
      if (hours <= 0) return { ok: false, msg: "Must be > 0", why: t("hours <= 0 is rejected (0 and negatives).", "hours <= 0 ditolak (0 dan negatif).") };
      return { ok: true, hours };
    }
    function go() {
      if (busy) return;
      busy = true; tm.clear(); states = ["", "", "", "", ""]; errBox.textContent = ""; resBox.textContent = "—";
      const r = evalInput(input.value);
      const seq = r.ok ? [0, 1, 2, 3, 4] : [0, 1, 2];
      let info = "";
      seq.forEach((k, n) => tm.later(() => {
        states = states.map((s, j) => (j < k ? "done" : j === k ? "now" : s === "skip" ? "skip" : ""));
        if (k === 2) {
          if (!r.ok) { states[2] = "fail"; states[3] = "skip"; states[4] = "skip"; errBox.textContent = r.msg; info = r.why; }
          else info = t("All three checks passed.", "Ketiga cek lolos.");
        }
        if (k === 3) info = `fee = ${r.hours} * 100 = ${r.hours * 100}`;
        if (k === 4) { states[4] = "done"; resBox.textContent = `Total Fee: Rs. ${r.hours * 100}`; info = t("Result shown on the screen.", "Hasil tampil di layar."); }
        if (k === 4 || (k === 2 && !r.ok)) busy = false;
        draw(info);
      }, 650 * (n + 1)));
      draw("");
    }
    function draw(info) {
      fill(list, ...STEPS.map((s, k) => h("div", { class: "mob-step " + (states[k] || "") },
        h("b", {}, s[1]), h("span", { class: "mono" }, s[2]))));
      fill(detail, info ? h("div", {}, info) : h("div", { class: "muted" }, t("Type hours and press Calculate. Try empty, abc, 0, -2 and 3.", "Ketik jam lalu tekan Calculate. Coba kosong, abc, 0, -2 dan 3.")));
    }
    const chips = ["3", "", "abc", "0", "-2"].map(v => button(v === "" ? t("(empty)", "(kosong)") : v, () => { input.value = v; go(); }));
    root.append(h("div", { class: "mob-split" },
      mobPhone(h("div", { class: "mob-title" }, "Parking Fee"), input, errBox, goBtn, resBox),
      h("div", {}, list, detail)),
      h("div", { class: "demo-controls" }, h("span", { class: "muted" }, t("Quick tries:", "Coba cepat:")), ...chips));
    draw("");
  };

  // ---- Ch 6: Study Planner with TimePickerDialog and SharedPreferences ----
  DEMOS["study-planner"] = function (root, lang) {
    const { t } = makeT(lang);
    const tm = mobTimers(root);
    let mem = { subject: "", time: "", plan: "" }, prefs = { subject: "", time: "" };
    let usePrefs = true, picker = false, running = true, pickH = 8, pickM = 0;
    const subj = h("input", { type: "text", class: "mob-realinput", placeholder: t("Study subject", "Subjek belajar") });
    subj.addEventListener("input", () => { mem.subject = subj.value; drawStores(); });
    const timeTxt = h("div", { class: "mob-res" });
    const planTxt = h("div", { class: "mob-res" });
    const errBox = h("em", { class: "mob-err" });
    const toast = h("div", { class: "mob-toast" });
    const pickerBox = h("div", { class: "mob-picker" });
    const memBox = h("div", { class: "mob-store" }), prefBox = h("div", { class: "mob-store" });
    const chk = h("input", { type: "checkbox", checked: "checked" });
    chk.addEventListener("change", () => { usePrefs = chk.checked; });
    function showToast(msg) { toast.textContent = msg; toast.classList.add("show"); tm.later(() => toast.classList.remove("show"), 1800); }
    const pad = n => String(n).padStart(2, "0");
    function openPicker() {
      picker = true;
      const hs = h("select", {}, ...Array.from({ length: 24 }, (_, k) => h("option", { value: k }, pad(k))));
      const ms = h("select", {}, ...[0, 15, 30, 45].map(k => h("option", { value: k }, pad(k))));
      hs.value = pickH; ms.value = pickM;
      hs.addEventListener("change", () => { pickH = +hs.value; });
      ms.addEventListener("change", () => { pickM = +ms.value; });
      fill(pickerBox, h("b", {}, "TimePickerDialog"), h("div", { class: "demo-controls" }, hs, ":", ms,
        button("OK", () => { mem.time = `${pickH}:${pad(pickM)}`; picker = false; errBox.textContent = ""; draw(); }),
        button(t("Cancel", "Batal"), () => { picker = false; draw(); })));
      draw();
    }
    function savePlan() {
      errBox.textContent = "";
      if (!mem.subject.trim()) { errBox.textContent = "Enter subject"; return; }
      if (!mem.time) { showToast("Select a time first"); return; }
      mem.plan = `Subject: ${mem.subject.trim()}, Time: ${mem.time}`;
      if (usePrefs) { prefs.subject = mem.subject.trim(); prefs.time = mem.time; showToast(t("Saved (SharedPreferences)", "Tersimpan (SharedPreferences)")); }
      else showToast(t("Shown, but NOT saved", "Tampil, tapi TIDAK tersimpan"));
      draw();
    }
    function restart() {
      if (!running) return;
      running = false; mem = { subject: "", time: "", plan: "" }; subj.value = ""; errBox.textContent = ""; draw();
      tm.later(() => {   // onCreate again
        running = true;
        if (usePrefs && prefs.subject) { mem.subject = prefs.subject; mem.time = prefs.time; mem.plan = `Subject: ${prefs.subject}, Time: ${prefs.time}`; subj.value = prefs.subject; }
        draw();
      }, 1100);
    }
    function drawStores() {
      fill(memBox, h("b", {}, t("Variables (lost on restart)", "Variabel (hilang saat restart)")), h("div", { class: "mono" }, `subject = "${mem.subject}"`), h("div", { class: "mono" }, `time = "${mem.time}"`));
      fill(prefBox, h("b", {}, t("SharedPreferences (kept)", "SharedPreferences (tetap)")), h("div", { class: "mono" }, `subject = "${prefs.subject}"`), h("div", { class: "mono" }, `time = "${prefs.time}"`));
    }
    function draw() {
      timeTxt.textContent = mem.time ? "Time: " + mem.time : "Time: —";
      planTxt.textContent = mem.plan || t("No saved plan yet", "Belum ada rencana tersimpan");
      pickerBox.style.display = picker ? "block" : "none";
      phoneEl.classList.toggle("mob-off", !running);
      drawStores();
    }
    const phoneEl = mobPhone(h("div", { class: "mob-title" }, "Study Planner"), subj, errBox, button("Select Time", openPicker, "mob-btn-real"), timeTxt,
      button("Save Plan", savePlan, "mob-btn-real"), planTxt, pickerBox, toast);
    root.append(h("div", { class: "mob-split" }, phoneEl, h("div", {}, memBox, prefBox,
      h("div", { class: "demo-controls" }, button(t("Close and reopen the app", "Tutup dan buka ulang app"), restart),
        h("label", { class: "mob-check" }, chk, " " + t("Save with SharedPreferences", "Simpan dengan SharedPreferences"))),
      h("div", { class: "muted" }, t("Try: enter a subject, pick a time, Save Plan, then close and reopen. Untick the box to see the plan disappear.", "Coba: isi subjek, pilih jam, Save Plan, lalu tutup dan buka ulang. Hilangkan centang untuk melihat rencana hilang.")))));
    draw();
  };

