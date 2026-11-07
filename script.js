/* PERMESINAN.gg: logika halaman */

/* ===== Pengaturan ===== */
const CFG = {
  pre: "",   // tempel tautan sematan Google Form pre-test
  post: "",  // tempel tautan sematan Google Form post-test
  codes: ["", "BUBUT", "POROS", "CEKAM", "UKUR", "SELESAI"] // kode cadangan dari guru
};
const LV = [
  { t: "Misi",      d: "Kenali pesanan bengkel dan tujuan belajarmu.",        m: 10, c: "#10b981", s: "Orientasi peserta didik pada masalah" },
  { t: "Pre-test",  d: "Cek pemahaman awalmu, tanpa tekanan.",                m: 10, c: "#06b6d4", s: "Asesmen diagnostik awal" },
  { t: "Materi",    d: "Empat pilar berpikir komputasional lewat kasus poros.", m: 15, c: "#facc15", s: "Mengorganisasi peserta didik belajar" },
  { t: "LKM",       d: "Tiga tantangan bersama kelompokmu.",                  m: 30, c: "#ff498b", s: "Penyelidikan dan pengembangan hasil" },
  { t: "Post-test", d: "Buktikan apa yang sudah kamu kuasai.",                m: 15, c: "#a855f7", s: "Analisis dan evaluasi (formatif akhir)" },
  { t: "Refleksi",  d: "Ceritakan apa yang kamu pelajari.",                   m: 10, c: "#f97316", s: "Refleksi proses belajar" }
];
// koordinat tiap level pada jalur (sistem koordinat SVG 900 x 2160)
const NODE = [[220, 240], [680, 570], [220, 900], [680, 1230], [220, 1560], [680, 1890]];
const VBW = 900, VBH = 2160;

const $ = s => document.querySelector(s);
const dlg = $("#dlg");
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const un = new Set([0]);
try { JSON.parse(localStorage.getItem("pgU") || "[]").forEach(i => un.add(i)); } catch (e) {}
const sv = () => { try { localStorage.setItem("pgU", JSON.stringify([...un])); } catch (e) {} };
const shuffle = a => {
  const b = [...a];
  do { for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } }
  while (b.every((x, i) => x === a[i]));
  return b;
};

/* ===== Peta dan mobil ===== */
let carAt = -1, carD = 0, raf = 0, busy = false, dist = [0];

function initDist() {
  const p = $("#road"), T = p.getTotalLength();
  dist = [0];
  NODE.forEach(([x, y]) => {
    let best = 0, min = Infinity;
    for (let l = 0; l <= T; l += 2) {
      const q = p.getPointAtLength(l), d = Math.hypot(q.x - x, q.y - y);
      if (d < min) { min = d; best = l; }
    }
    dist.push(best);
  });
}
function setCar(l) {
  const p = $("#road"), T = p.getTotalLength();
  const a = p.getPointAtLength(l), b = p.getPointAtLength(Math.min(l + 3, T));
  const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI + 90;
  const k = Math.min(2.2, Math.max(1, 0.9 * VBW / $("#roadmap").clientWidth));
  $("#car").setAttribute("transform", `translate(${a.x},${a.y}) rotate(${ang}) scale(${k})`);
}
function drive(to, ms, cb) {
  cancelAnimationFrame(raf);
  const f = carD, t0 = performance.now();
  const step = now => {
    const k = Math.min((now - t0) / ms, 1);
    const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    carD = f + (to - f) * e;
    setCar(carD);
    if (k < 1) raf = requestAnimationFrame(step); else if (cb) cb();
  };
  raf = requestAnimationFrame(step);
}
function label() {
  $("#carlab").textContent = carAt < 0 ? "Start" : `Level ${carAt + 1} (${LV[carAt].t})`;
}
const pct = (x, y) => `left:${x / VBW * 100}%;top:${y / VBH * 100}%`;

function drawMap() {
  $("#nodes").innerHTML =
    `<span class="flag" style="${pct(450, 0)}">START</span><span class="flag" style="${pct(450, 2150)}">FINISH</span>` +
    LV.map((l, i) => {
      const o = un.has(i), [x, y] = NODE[i];
      return `<button class="nd${o ? " on" : ""}${i === carAt ? " cur" : ""}" style="--c:${l.c};${pct(x, y)}" data-i="${i}" aria-label="Level ${i + 1}: ${l.t}${o ? "" : ", terkunci"}">0${i + 1}<em class="nl">${l.t}</em></button>` +
        `<div class="card ${x < 450 ? "cr" : "cl"}" style="--c:${l.c};top:${y / VBH * 100}%"><span class="chip">LEVEL ${i + 1}, ${l.m} MENIT</span><h3>${l.t}</h3><p>${l.d}</p><button class="btn go" data-i="${i}">${o ? "LUNCURKAN MOBIL →" : "TERKUNCI"}</button></div>`;
    }).join("");
  document.querySelectorAll(".nd,.go").forEach(b => b.onclick = () => go(+b.dataset.i));
}
function go(i) {
  if (busy) return;
  if (!un.has(i)) { lock(i); return; }
  busy = true;
  carAt = i; label(); drawMap();
  const n = document.querySelector(`.nd[data-i="${i}"]`);
  if (n) n.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "center" });
  drive(dist[i + 1], RM ? 1 : 1400, () => { busy = false; openLv(i); });
}

/* ===== Bahan slide ===== */
const ST = [22, 34, 50, 50, 34, 22];
const shaft = n => `<svg class="sh" viewBox="0 0 360 70" aria-hidden="true">${ST.map((h, i) => `<rect class="${i < n ? "on" : ""}" x="${i * 60}" y="${(70 - h) / 2}" width="58" height="${h}" rx="2"/>`).join("")}</svg>`;
const form = (u, n) => u ? `<iframe src="${u}" title="${n}" loading="lazy"></iframe>` : `<div class="ph"><strong>Tempat ${n}</strong><p>Tempelkan tautan sematan Google Form di bagian CFG pada script.js.</p></div>`;
const chips = (a, c) => a.map(x => `<i class="c2 ${c}">${x}</i>`).join("");
const PIL = [
  ["Dekomposisi", "#10b981", "Memecah masalah besar menjadi bagian kecil yang lebih mudah dikerjakan.", "Membuat satu poros dipecah menjadi tahap yang masing-masing jelas.",
    `<div class="vz"><b class="blk">Buat poros</b>→${chips(["Potong", "Cekam", "Bubut", "Ukur", "Finishing"], "hi")}</div>`],
  ["Pengenalan pola", "#06b6d4", "Mencari kesamaan atau pengulangan antara beberapa masalah.", "Poros dan baut punya tahap yang sama, hanya beberapa tahap yang berbeda.",
    `<div class="vz"><span class="lb">Poros</span>${chips(["Potong", "Cekam", "Bubut muka"], "hi")}${chips(["Bubut bertingkat"], "")}${chips(["Ukur"], "hi")}</div><div class="vz"><span class="lb">Baut</span>${chips(["Potong", "Cekam", "Bubut muka"], "hi")}${chips(["Buat ulir"], "")}${chips(["Ukur"], "hi")}</div>`],
  ["Abstraksi", "#facc15", "Mengambil informasi yang penting dan mengabaikan detail yang tidak memengaruhi hasil.", "Saat membubut, yang menentukan hasil hanyalah ukuran dan toleransi.",
    `<div class="vz"><span class="lb">Dipakai</span>${chips(["Diameter", "Panjang", "Toleransi"], "hi")}</div><div class="vz"><span class="lb">Diabaikan</span>${chips(["Warna cat mesin", "Merek sepatu operator"], "no")}</div>`],
  ["Algoritma", "#ff498b", "Menyusun langkah penyelesaian yang berurutan dan jelas.", "Bubut muka dikerjakan sebelum mengukur panjang, dan mengukur setelah pembubutan selesai.",
    `<ol class="al"><li>Bubut muka</li><li>Bubut rata</li><li>Bubut bertingkat</li><li>Ukur dengan jangka sorong</li></ol>`]
];
const ORDER = ["Potong bahan", "Pasang benda kerja di chuck", "Bubut muka", "Bubut rata", "Bubut bertingkat", "Chamfer ujung", "Ukur dengan jangka sorong", "Lepas dan bersihkan"];
const POLA = [["Potong bahan", 1], ["Pasang benda kerja di chuck", 1], ["Bubut muka", 1], ["Bubut rata", 1], ["Chamfer ujung", 1], ["Ukur dengan jangka sorong", 1], ["Lepas dan bersihkan", 1], ["Bubut bertingkat", 0], ["Buat ulir", 0]];
const ABS = [["Diameter tiap tingkat", 1], ["Panjang tiap tingkat", 1], ["Toleransi ukuran", 1], ["Jenis bahan", 1], ["Warna cat mesin bubut", 0], ["Merek sepatu operator", 0], ["Cuaca hari ini", 0], ["Nama pabrik jangka sorong", 0]];

const pickH = (id, t, ins, it) => `<div class="ch" id="${id}"><p class="kick">TANTANGAN</p><h2>${t}</h2><p>${ins}</p><div class="chips">${it.map((x, i) => `<button class="pk" data-i="${i}" aria-pressed="false">${x[0]}</button>`).join("")}</div><button class="btn" data-a="c">Periksa</button> <button class="btn g" data-a="r">Ulangi</button><p class="fb" role="status"></p></div>`;
function pickI(id, it) {
  const b = $("#" + id), cs = [...b.querySelectorAll(".pk")], fb = b.querySelector(".fb");
  cs.forEach(c => c.onclick = () => { c.classList.remove("right", "wrong"); c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true"); });
  b.querySelector('[data-a="c"]').onclick = () => {
    let g = 0;
    cs.forEach((c, i) => { const ok = (c.getAttribute("aria-pressed") === "true") === !!it[i][1]; c.classList.add(ok ? "right" : "wrong"); if (ok) g++; });
    fb.className = "fb " + (g === it.length ? "ok" : "no");
    fb.textContent = g === it.length ? "Semua tepat." : `Baru ${g} dari ${it.length} pilihan yang tepat. Perhatikan yang bertanda merah.`;
  };
  b.querySelector('[data-a="r"]').onclick = () => { cs.forEach(c => { c.classList.remove("right", "wrong"); c.setAttribute("aria-pressed", "false"); }); fb.textContent = ""; };
}
function ordI() {
  const b = $("#ord"), fb = b.querySelector(".fb");
  let pool = shuffle(ORDER), seq = [];
  const dr = () => {
    b.querySelector(".pool").innerHTML = pool.map(s => `<button class="pk" data-s="${s}">${s}</button>`).join("") || '<span class="empty">Semua tahap sudah dipakai.</span>';
    b.querySelector(".seq").innerHTML = seq.map(s => `<li><button class="pk" data-r="${s}">${s}</button></li>`).join("") || '<li class="empty">Ketuk tahap di atas untuk menyusunnya di sini.</li>';
    b.querySelectorAll("[data-s]").forEach(x => x.onclick = () => { pool = pool.filter(y => y !== x.dataset.s); seq.push(x.dataset.s); fb.textContent = ""; dr(); });
    b.querySelectorAll("[data-r]").forEach(x => x.onclick = () => { seq = seq.filter(y => y !== x.dataset.r); pool.push(x.dataset.r); fb.textContent = ""; dr(); });
  };
  b.querySelector('[data-a="c"]').onclick = () => {
    const g = seq.filter((s, i) => s === ORDER[i]).length, ok = g === ORDER.length && seq.length === ORDER.length;
    fb.className = "fb " + (ok ? "ok" : "no");
    fb.textContent = ok ? "Urutan tepat. Algoritmamu sudah runtut." : `${g} dari ${ORDER.length} posisi sudah tepat.`;
  };
  b.querySelector('[data-a="r"]').onclick = () => { pool = shuffle(ORDER); seq = []; fb.textContent = ""; dr(); };
  dr();
}
const GO = ["#10b981", "#06b6d4", "#facc15", "#ff498b"];
const SL = [
  () => [
    `<p class="kick">LEVEL 1, MISI</p><h2 class="big">Pecahkan Poros Bertingkat</h2><p class="lead">Berpikir komputasional untuk Informatika kelas X Teknik Permesinan.</p>${shaft(6)}`,
    `<p class="kick">PESANAN MASUK</p><h2>Satu poros bertingkat dari baja</h2><div class="case"><p>Sebelum mesin bubut dinyalakan, tim kamu harus merancang cara mengerjakannya: runtut, tidak ada langkah terlewat, dan sesuai toleransi.</p></div>${shaft(3)}`,
    `<p class="kick">TUJUAN PEMBELAJARAN</p><h2>Di akhir misi, kamu mampu</h2><div class="gl">${["Menguraikan proses pembuatan poros menjadi tahapan kecil", "Mengenali pola pada tahapan komponen sejenis", "Memilih informasi penting dan mengabaikan yang tidak relevan", "Menyusun urutan langkah yang runtut"].map((x, i) => `<div class="gc" style="--g:${GO[i]}"><b>${PIL[i][0]}</b><span>${x}</span></div>`).join("")}</div>`
  ],
  () => [`<p class="kick">LEVEL 2</p><h2>Pre-test</h2><p class="lead">Kerjakan sendiri. Ini untuk melihat titik awalmu.</p>${form(CFG.pre, "pre-test")}`],
  () => [`<p class="kick">LEVEL 3, MATERI</p><h2>Empat pilar berpikir komputasional</h2><div class="gl">${PIL.map(p => `<div class="gc" style="--g:${p[1]}"><b>${p[0]}</b><span>${p[2]}</span></div>`).join("")}</div>`]
    .concat(PIL.map(p => `<p class="kick" style="--c:${p[1]}">PILAR</p><h2>${p[0]}</h2><p>${p[2]}</p><div class="case" style="--c:${p[1]}"><strong>Pada poros bertingkat:</strong> ${p[3]}</div><div style="--c:${p[1]}">${p[4]}</div>`)),
  () => [
    `<div class="ch" id="ord"><p class="kick">TANTANGAN 1</p><h2>Dekomposisi dan algoritma</h2><p>Susun tahap pembuatan poros bertingkat dengan urutan yang benar.</p><div class="chips pool"></div><ol class="seq"></ol><button class="btn" data-a="c">Periksa</button> <button class="btn g" data-a="r">Acak ulang</button><p class="fb" role="status"></p></div>`,
    pickH("pola", "Pengenalan pola", "Pilih tahap yang muncul pada pembuatan poros bertingkat dan pembuatan baut.", POLA),
    pickH("abs", "Abstraksi", "Pilih hanya informasi yang penting untuk membubut poros.", ABS)
  ],
  () => [`<p class="kick">LEVEL 5</p><h2>Post-test</h2><p class="lead">Kerjakan sendiri dengan jujur.</p>${form(CFG.post, "post-test")}`],
  () => [
    `<p class="kick">LEVEL 6, REFLEKSI</p><h2>Diskusikan singkat</h2><ol><li>Tahap mana yang paling sulit dipecah, dan mengapa?</li><li>Di mana lagi kamu bisa memakai dekomposisi dan algoritma di bengkel?</li><li>Apa yang akan kamu lakukan berbeda pada tantangan berikutnya?</li></ol>`,
    `<p class="kick">MISI SELESAI</p><h2 class="big">Poros sudah utuh</h2><p class="lead">Terima kasih sudah bekerja sama sampai garis finis.</p>${shaft(6)}`
  ]
];
const INIT = [0, 0, 0, [ordI, () => pickI("pola", POLA), () => pickI("abs", ABS)], 0, 0];

/* ===== Layar level ===== */
let cur = 0, si = 0, tmr = null, left = 0;
const fmt = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
function openLv(i) {
  cur = i; si = 0; clearInterval(tmr);
  $("#stage").hidden = false; document.body.style.overflow = "hidden";
  $("#stage").style.setProperty("--c", LV[i].c);
  $("#tm").textContent = fmt(LV[i].m * 60); $("#tm").classList.remove("w"); $("#ts").textContent = "Mulai timer";
  draw();
}
function draw() {
  const S = SL[cur]();
  $("#st").textContent = `Level ${cur + 1}: ${LV[cur].t}`;
  $("#stb").innerHTML = `<div class="slide" style="--c:${LV[cur].c}">${S[si]}</div>`;
  $("#dots").innerHTML = S.map((_, k) => `<i class="${k <= si ? "on" : ""}"></i>`).join("");
  $("#prev").disabled = si === 0;
  $("#next").textContent = si === S.length - 1 ? (cur < LV.length - 1 ? `Lanjut ke level ${cur + 2} →` : "Kembali ke peta") : "Lanjut →";
  if (INIT[cur] && INIT[cur][si]) INIT[cur][si]();
  $("#stb").scrollTop = 0;
}
function closeLv() { clearInterval(tmr); $("#stage").hidden = true; document.body.style.overflow = ""; }
$("#x").onclick = closeLv;
$("#prev").onclick = () => { if (si > 0) { si--; draw(); } };
$("#next").onclick = () => {
  if (si < SL[cur]().length - 1) { si++; draw(); }
  else if (cur < LV.length - 1) { const n = cur + 1; un.add(n); sv(); closeLv(); go(n); }
  else closeLv();
};
$("#ts").onclick = () => {
  clearInterval(tmr); left = LV[cur].m * 60; $("#ts").textContent = "Ulangi timer";
  const t = $("#tm"); t.classList.remove("w");
  tmr = setInterval(() => {
    left--; t.textContent = left > 0 ? fmt(left) : "Waktu habis"; t.classList.toggle("w", left <= 60);
    if (left <= 0) clearInterval(tmr);
  }, 1000);
};
document.addEventListener("keydown", e => {
  if ($("#stage").hidden || dlg.open) return;
  if (e.key === "ArrowRight") $("#next").click();
  else if (e.key === "ArrowLeft") $("#prev").click();
  else if (e.key === "Escape") closeLv();
});

/* ===== Dialog: level terkunci dan Mode Penguji ===== */
$("#dx").onclick = () => dlg.close();
function lock(i) {
  $("#dc").innerHTML = `<h3>Level ${i + 1}: ${LV[i].t}</h3><p>Selesaikan level sebelumnya dulu, atau masukkan kode dari guru.</p><input id="lc" placeholder="Kode level" autocomplete="off"><button class="btn" id="lb">Buka</button><p class="fb no" id="le" role="status"></p>`;
  dlg.showModal();
  const t = () => {
    if ($("#lc").value.trim().toUpperCase() === CFG.codes[i]) { un.add(i); sv(); dlg.close(); drawMap(); go(i); }
    else $("#le").textContent = "Kode belum tepat.";
  };
  $("#lb").onclick = t; $("#lc").onkeydown = e => { if (e.key === "Enter") t(); };
}
$("#guru").onclick = () => {
  $("#dc").innerHTML = `<h3>Mode Penguji UKIN</h3><p>Ringkasan alur dan akses ke semua level tanpa kode.</p><table><tr><th>Level</th><th>Menit</th><th>Sintaks PBL (draf)</th><th>Kode</th></tr>${LV.map((l, i) => `<tr><td>${i + 1}. ${l.t}</td><td>${l.m}</td><td>${l.s}</td><td>${CFG.codes[i] || "Terbuka"}</td></tr>`).join("")}<tr><th>Total</th><th>90</th><th colspan="2"></th></tr></table><button class="btn" id="all">Buka semua level</button> <button class="btn g" id="rs">Kunci ulang</button>`;
  dlg.showModal();
  $("#all").onclick = () => { LV.forEach((_, i) => un.add(i)); sv(); drawMap(); dlg.close(); };
  $("#rs").onclick = () => { un.clear(); un.add(0); sv(); carAt = -1; carD = 0; label(); setCar(0); drawMap(); dlg.close(); };
};

/* ===== Mulai ===== */
function start() {
  initDist();
  const mx = Math.max(...un);
  carAt = mx > 0 ? mx : -1;
  carD = dist[carAt < 0 ? 0 : carAt + 1];
  setCar(carD); label(); drawMap();
}
start();
addEventListener("resize", () => setCar(carD));
addEventListener("load", () => { initDist(); setCar(carD); });
