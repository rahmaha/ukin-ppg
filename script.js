let currentStage = 1;
let currentSubSlideIndex = 0;
let currentMateriSlideIndex = 0; // State slide deck halaman materi
let unlockedStages = new Set([1]);
let currentCarDistance = 0;
let animReqId = null;
let timerInterval = null;
let timerSecondsLeft = 600;

const nodeCoordinates = [
    { x: 450, y: 40 },
    { x: 240, y: 240 },
    { x: 680, y: 560 },
    { x: 220, y: 920 },
    { x: 680, y: 1280 },
    { x: 450, y: 1640 }
];

let nodeDistances = [0, 280, 850, 1420, 1980, 2450];

// SHAFT SVG HIASAN KETEKNIKAN
const ST = [22, 34, 50, 50, 34, 22];
const shaftSVG = n => `
    <svg class="w-full max-w-md mx-auto my-4" viewBox="0 0 360 70">
        ${ST.map((h, i) => `<rect fill="${i < n ? '#10b981' : 'rgba(255,255,255,0.1)'}" x="${i * 60}" y="${(70 - h) / 2}" width="58" height="${h}" rx="3"/>`).join("")}
    </svg>
`;

/* =========================================================================
   MATERI DIGITAL SLIDE DECK DATA
   Disusun mengikuti urutan bab materi acuan, dengan konteks Teknik Permesinan.
   Tiap slide punya "chapter" (0-5) supaya tab bab di materi.html bisa melompat.
   ========================================================================= */
const mdWrap = inner => `<div class="space-y-4 max-w-4xl mx-auto text-left animate-fade-in text-sm sm:text-base">${inner}</div>`;
const mdBox = (c, head, inner) => `<div class="p-4 bg-slate-950 rounded-2xl border border-${c}-400/40 space-y-2 text-left"><div class="font-bold text-${c}-400 font-mono">${head}</div>${inner}</div>`;
const mdList = items => `<ul class="list-disc list-inside text-slate-300 space-y-1">${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
const mdNote = txt => `<div class="p-4 bg-slate-950 rounded-2xl border border-amber-400/30 text-amber-300 text-sm font-mono">${txt}</div>`;

const materiDeckData = [
    /* ---------- BAB 1: KONSEP ---------- */
    {
        chapter: 0,
        topic: "BAB 1 • KONSEP BERPIKIR KOMPUTASIONAL",
        title: "Apa itu Berpikir Komputasional?",
        subtitle: "Cara berpikir sistematis untuk memecahkan masalah",
        content: mdWrap(`
            <p class="text-slate-300 leading-relaxed">
                <strong>Berpikir komputasional</strong> (<em>computational thinking</em>) adalah cara menyelesaikan masalah secara runtut: memahami masalahnya, memecahnya menjadi bagian kecil, mencari kesamaan, memilih informasi yang penting, lalu menyusun langkah penyelesaian yang bisa dijalankan oleh manusia maupun komputer.
            </p>
            ${mdNote("💡 Di bengkel, cara berpikir ini sudah kamu pakai: membaca gambar kerja, menyusun urutan pengerjaan, dan memeriksa hasil sebelum benda kerja dinyatakan lolos.")}
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center font-mono text-xs">
                <div class="p-3 bg-slate-900 rounded-xl border border-slate-700 text-slate-300">Bukan hanya untuk programmer</div>
                <div class="p-3 bg-slate-900 rounded-xl border border-slate-700 text-slate-300">Bisa dipakai pada masalah apa pun</div>
                <div class="p-3 bg-slate-900 rounded-xl border border-slate-700 text-slate-300">Dikerjakan langkah demi langkah</div>
            </div>
        `)
    },
    {
        chapter: 0,
        topic: "BAB 1 • KONSEP BERPIKIR KOMPUTASIONAL",
        title: "Empat Pilar dan Alurnya",
        subtitle: "Saling melengkapi, lalu diuji lewat evaluasi",
        content: mdWrap(`
            <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                <div class="p-3 bg-slate-900 rounded-2xl border border-emerald-400/40 space-y-1"><div class="font-bold text-emerald-400 font-mono">1. Dekomposisi</div><p class="text-slate-400">Pecah pesanan menjadi tahapan kecil.</p></div>
                <div class="p-3 bg-slate-900 rounded-2xl border border-cyan-400/40 space-y-1"><div class="font-bold text-cyan-400 font-mono">2. Pola</div><p class="text-slate-400">Cari kesamaan antar benda kerja.</p></div>
                <div class="p-3 bg-slate-900 rounded-2xl border border-amber-400/40 space-y-1"><div class="font-bold text-amber-400 font-mono">3. Abstraksi</div><p class="text-slate-400">Ambil ukuran penting, buang detail tak perlu.</p></div>
                <div class="p-3 bg-slate-900 rounded-2xl border border-pink-400/40 space-y-1"><div class="font-bold text-pink-400 font-mono">4. Algoritma</div><p class="text-slate-400">Susun langkah kerja (SOP) berurutan.</p></div>
                <div class="p-3 bg-slate-900 rounded-2xl border border-purple-400/40 space-y-1"><div class="font-bold text-purple-400 font-mono">5. Evaluasi</div><p class="text-slate-400">Uji: sudah benar, lengkap, dan efisien?</p></div>
            </div>
            <p class="text-slate-400 text-center text-xs font-mono">Contoh yang kita pakai sepanjang pelajaran: membuat poros bertingkat dari baja.</p>
        `)
    },

    /* ---------- BAB 2: DEKOMPOSISI ---------- */
    {
        chapter: 1,
        topic: "PILAR 1 • DEKOMPOSISI",
        title: "Dekomposisi",
        subtitle: "Memecah masalah besar menjadi bagian-bagian kecil",
        content: mdWrap(`
            <p class="text-slate-300 leading-relaxed">
                <strong>Dekomposisi</strong> adalah memecah masalah yang besar dan rumit menjadi masalah-masalah kecil yang lebih sederhana, lalu menyelesaikannya satu per satu. Ide ini sering disebut <em>“divide and conquer”</em>.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-center">
                <div class="p-3 bg-slate-900 rounded-xl border border-emerald-400/40 text-emerald-300">Lebih mudah dipahami</div>
                <div class="p-3 bg-slate-900 rounded-xl border border-emerald-400/40 text-emerald-300">Bisa dibagi ke anggota tim</div>
                <div class="p-3 bg-slate-900 rounded-xl border border-emerald-400/40 text-emerald-300">Kesalahan lebih cepat ditemukan</div>
            </div>
        `)
    },
    {
        chapter: 1,
        topic: "PILAR 1 • DEKOMPOSISI",
        title: "Dekomposisi di Bengkel",
        subtitle: "Dua contoh dari pekerjaan pembubutan",
        content: mdWrap(`
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${mdBox("emerald", "🔧 Poros hasil bubut ukurannya melenceng", mdList([
                    "Apa penyebab ukuran melenceng?",
                    "Bagian mana yang bergeser: pahat, cekam, atau alat ukur?",
                    "Bagaimana cara memeriksanya?",
                    "Bagaimana cara memperbaikinya?",
                    "Bagaimana memastikan perbaikan sudah benar?"
                ]))}
                ${mdBox("cyan", "📦 Pesanan 50 poros bertingkat", mdList([
                    "A. Persiapan bahan dan alat",
                    "B. Pencekaman dan pembubutan muka",
                    "C. Pembubutan bertingkat",
                    "D. Pengukuran dan quality control"
                ]))}
            </div>
            <p class="text-slate-400 text-xs font-mono">Masalah besar → pertanyaan atau tahapan kecil → dikerjakan satu per satu.</p>
        `)
    },

    /* ---------- BAB 3: PENGENALAN POLA ---------- */
    {
        chapter: 2,
        topic: "PILAR 2 • PENGENALAN POLA",
        title: "Pengenalan Pola",
        subtitle: "Mencari kesamaan dan keteraturan pada beberapa masalah",
        content: mdWrap(`
            <p class="text-slate-300 leading-relaxed">
                <strong>Pengenalan pola</strong> adalah melihat kesamaan atau keteraturan dari beberapa masalah. Masalah yang punya karakteristik sama biasanya bisa diselesaikan dengan cara yang sama, sehingga kita tidak perlu mulai dari nol setiap kali.
            </p>
            <div class="overflow-x-auto">
                <table class="w-full text-xs sm:text-sm border border-slate-700 rounded-xl overflow-hidden">
                    <thead class="bg-slate-900 text-cyan-300 font-mono">
                        <tr><th class="p-2 text-left"></th><th class="p-2 text-left">Poros</th><th class="p-2 text-left">Baut</th><th class="p-2 text-left">Bushing</th></tr>
                    </thead>
                    <tbody class="text-slate-300">
                        <tr class="border-t border-slate-800"><td class="p-2 font-bold text-emerald-400">Sama</td><td class="p-2" colspan="3">Bahan dipotong, dicekam, dibubut muka, lalu diukur</td></tr>
                        <tr class="border-t border-slate-800"><td class="p-2 font-bold text-amber-400">Beda</td><td class="p-2">Dibubut bertingkat</td><td class="p-2">Dibuat ulir</td><td class="p-2">Dibuat lubang di tengah</td></tr>
                    </tbody>
                </table>
            </div>
            <p class="text-slate-400 text-xs font-mono">Pola apa yang kamu lihat dari ketiga komponen ini?</p>
        `)
    },
    {
        chapter: 2,
        topic: "PILAR 2 • PENGENALAN POLA",
        title: "Studi Kasus: Tiga Benda Kerja",
        subtitle: "Mencari pola dari tiga kali percobaan (data contoh)",
        content: mdWrap(`
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div class="p-3 bg-slate-900 rounded-xl border border-slate-800"><span class="text-rose-400 font-bold block font-mono">Benda kerja A</span>Pemakanan sangat dalam sekaligus ➔ permukaan kasar, ukuran meleset.</div>
                <div class="p-3 bg-slate-900 rounded-xl border border-slate-800"><span class="text-amber-400 font-bold block font-mono">Benda kerja B</span>Pemakanan tipis tetapi tanpa pendingin ➔ pahat cepat panas, permukaan kurang halus.</div>
                <div class="p-3 bg-slate-900 rounded-xl border border-emerald-400/40"><span class="text-emerald-400 font-bold block font-mono">Benda kerja C</span>Pemakanan bertahap + pendingin ➔ permukaan halus, ukuran masuk toleransi.</div>
            </div>
            ${mdBox("cyan", "🔍 Pola yang bisa disimpulkan", mdList([
                "Pemakanan bertahap dan terkendali menghasilkan ukuran yang lebih presisi.",
                "Pola ini bisa dipakai lagi pada poros, baut, maupun bushing."
            ]))}
        `)
    },

    /* ---------- BAB 4: ABSTRAKSI ---------- */
    {
        chapter: 3,
        topic: "PILAR 3 • ABSTRAKSI",
        title: "Abstraksi",
        subtitle: "Memilih informasi penting, mengabaikan yang tidak relevan",
        content: mdWrap(`
            <p class="text-slate-300 leading-relaxed">
                <strong>Abstraksi</strong> adalah memusatkan perhatian pada informasi yang penting untuk tujuan kita dan mengabaikan detail yang tidak berpengaruh. Informasi yang penting bisa berbeda tergantung tujuannya.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${mdBox("amber", "Tujuan: menentukan putaran mesin", `<p class="text-slate-300">Penting: <strong>diameter benda kerja</strong> dan <strong>jenis bahan</strong>.</p><p class="text-slate-500 line-through">Warna cat mesin, merek sepatu operator.</p>`)}
                ${mdBox("amber", "Tujuan: mencatat hasil QC", `<p class="text-slate-300">Penting: <strong>ukuran hasil ukur</strong> dan <strong>toleransi</strong>.</p><p class="text-slate-500 line-through">Warna kemasan, cuaca hari itu.</p>`)}
            </div>
        `)
    },
    {
        chapter: 3,
        topic: "PILAR 3 • ABSTRAKSI",
        title: "Bahan Diskusi: Kartu Benda Kerja",
        subtitle: "Diskusikan dalam kelompok, lalu cocokkan dengan kunci",
        content: mdWrap(`
            <p class="text-slate-300">Data berikut akan dimasukkan ke database QC bengkel. Mana yang <strong class="text-emerald-400">dicatat</strong> dan mana yang <strong class="text-rose-400">diabaikan</strong>?</p>
            <div class="flex flex-wrap gap-2 text-sm font-mono">
                <span class="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full">Nomor job</span>
                <span class="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full">Jenis bahan</span>
                <span class="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full">Diameter hasil ukur</span>
                <span class="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full">Toleransi ukuran</span>
                <span class="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full">Warna cat mesin bubut</span>
                <span class="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full">Merek sepatu operator</span>
                <span class="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full">Cuaca hari itu</span>
                <span class="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full">Warna kotak kemasan</span>
            </div>
            <button onclick="document.getElementById('kunci-abs').classList.toggle('hidden')" class="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-extrabold text-xs transition">TAMPILKAN / SEMBUNYIKAN KUNCI</button>
            <div id="kunci-abs" class="hidden grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div class="p-3 bg-slate-900 rounded-xl border border-emerald-500/40"><span class="text-emerald-400 font-bold block mb-1">✔ Dicatat</span>Nomor job, jenis bahan, diameter hasil ukur, toleransi ukuran.</div>
                <div class="p-3 bg-slate-900 rounded-xl border border-rose-500/40"><span class="text-rose-400 font-bold block mb-1">✖ Diabaikan</span>Warna cat mesin, merek sepatu operator, cuaca, warna kotak kemasan.</div>
            </div>
        `)
    },

    /* ---------- BAB 5: ALGORITMA ---------- */
    {
        chapter: 4,
        topic: "PILAR 4 • ALGORITMA",
        title: "Algoritma",
        subtitle: "Langkah-langkah berurutan untuk menyelesaikan masalah",
        content: mdWrap(`
            <p class="text-slate-300 leading-relaxed">
                <strong>Algoritma</strong> adalah urutan langkah atau aturan yang harus dijalankan untuk menyelesaikan masalah. Di bengkel, algoritma itu mirip SOP: langkahnya jelas, berurutan, dan bisa diikuti siapa saja.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${mdBox("purple", "📊 Flowchart", `<p class="text-slate-400">Algoritma digambar dengan simbol standar dan panah.</p>`)}
                ${mdBox("pink", "📝 Pseudocode", `<p class="text-slate-400">Algoritma ditulis seperti kode, tetapi tidak terikat bahasa pemrograman tertentu.</p>`)}
            </div>
        `)
    },
    {
        chapter: 4,
        topic: "PILAR 4 • ALGORITMA",
        title: "Flowchart",
        subtitle: "Simbol dan contoh alur pemeriksaan ukuran",
        content: mdWrap(`
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                <div class="p-2 bg-slate-900 rounded-lg border border-slate-700"><span class="text-purple-300 font-mono text-lg">⬭</span> Mulai / Selesai</div>
                <div class="p-2 bg-slate-900 rounded-lg border border-slate-700"><span class="text-purple-300 font-mono text-lg">▭</span> Proses</div>
                <div class="p-2 bg-slate-900 rounded-lg border border-slate-700"><span class="text-purple-300 font-mono text-lg">◇</span> Keputusan</div>
                <div class="p-2 bg-slate-900 rounded-lg border border-slate-700"><span class="text-purple-300 font-mono text-lg">▱</span> Input / Output</div>
                <div class="p-2 bg-slate-900 rounded-lg border border-slate-700"><span class="text-purple-300 font-mono text-lg">○</span> Penghubung</div>
                <div class="p-2 bg-slate-900 rounded-lg border border-slate-700"><span class="text-purple-300 font-mono text-lg">➔</span> Arah aliran</div>
            </div>
            <div class="p-4 bg-slate-950 rounded-2xl border border-purple-400/40 flex flex-wrap items-center gap-2 text-xs font-mono">
                <span class="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-600">Mulai</span> ➔
                <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-600">Ukur diameter</span> ➔
                <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-400/60 text-amber-300">◇ Dalam toleransi?</span> ➔
                <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-400/60 text-emerald-300">Ya: Lolos QC</span>
                <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-rose-400/60 text-rose-300">Tidak: Bubut ulang / Reject</span>
            </div>
        `)
    },
    {
        chapter: 4,
        topic: "PILAR 4 • ALGORITMA",
        title: "Pseudocode",
        subtitle: "Contoh algoritma pemeriksaan toleransi diameter poros",
        content: mdWrap(`
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <pre class="p-4 bg-slate-950 rounded-2xl border border-pink-400/40 text-pink-200 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto">MULAI
  INPUT diameter
  WHILE diameter &gt; 25.05 DO
    OUTPUT "Bubut tipis lagi"
    INPUT diameter
  ENDWHILE
  IF diameter &gt;= 24.95 THEN
    OUTPUT "Lolos QC"
  ELSE
    OUTPUT "Reject"
  ENDIF
SELESAI</pre>
                <div class="space-y-2 text-slate-300">
                    <p class="font-bold text-pink-400 font-mono">Aturan penulisan</p>
                    ${mdList([
                        "Perintah ditulis dengan huruf KAPITAL.",
                        "Nama variabel ditulis dengan huruf kecil.",
                        "Pesan ditulis di dalam tanda kutip.",
                        "Satu perintah untuk satu baris."
                    ])}
                    <p class="text-slate-400 text-xs font-mono pt-2">Target Ø25 mm dengan toleransi ±0,05 mm.</p>
                </div>
            </div>
        `)
    },

    /* ---------- BAB 6: EVALUASI ---------- */
    {
        chapter: 5,
        topic: "TAHAP AKHIR • EVALUASI SOLUSI",
        title: "Mengevaluasi Solusi",
        subtitle: "Memastikan solusi bekerja dengan baik dan bisa ditingkatkan",
        content: mdWrap(`
            <p class="text-slate-300">Setelah algoritma selesai disusun, periksa dengan empat pertanyaan berikut:</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div class="p-4 bg-slate-900 rounded-2xl border border-emerald-400/40"><div class="font-bold text-emerald-400 font-mono">Mudah dimengerti?</div><p class="text-slate-400">Orang lain bisa membaca tanpa salah paham.</p></div>
                <div class="p-4 bg-slate-900 rounded-2xl border border-cyan-400/40"><div class="font-bold text-cyan-400 font-mono">Lengkap?</div><p class="text-slate-400">Semua bagian masalah sudah tertangani.</p></div>
                <div class="p-4 bg-slate-900 rounded-2xl border border-amber-400/40"><div class="font-bold text-amber-400 font-mono">Efisien?</div><p class="text-slate-400">Waktu, bahan, dan tenaga dipakai seminimal mungkin.</p></div>
                <div class="p-4 bg-slate-900 rounded-2xl border border-pink-400/40"><div class="font-bold text-pink-400 font-mono">Sesuai kriteria?</div><p class="text-slate-400">Cocok dengan job sheet dan toleransi yang ditetapkan.</p></div>
            </div>
        `)
    },
    {
        chapter: 5,
        topic: "TAHAP AKHIR • EVALUASI SOLUSI",
        title: "Dry Run",
        subtitle: "Menelusuri algoritma langkah demi langkah dengan input berbeda",
        content: mdWrap(`
            <p class="text-slate-300 text-sm">Uji pseudocode tadi dengan input normal, input batas, dan input ekstrem.</p>
            <div class="overflow-x-auto">
                <table class="w-full text-xs sm:text-sm border border-slate-700 rounded-xl overflow-hidden">
                    <thead class="bg-slate-900 text-emerald-300 font-mono">
                        <tr><th class="p-2 text-left">Jenis input</th><th class="p-2 text-left">Diameter</th><th class="p-2 text-left">Jalur algoritma</th><th class="p-2 text-left">Hasil</th></tr>
                    </thead>
                    <tbody class="text-slate-300">
                        <tr class="border-t border-slate-800"><td class="p-2 font-mono">Normal</td><td class="p-2">25,00</td><td class="p-2">WHILE tidak jalan, IF benar</td><td class="p-2 text-emerald-400">Lolos QC</td></tr>
                        <tr class="border-t border-slate-800"><td class="p-2 font-mono text-amber-300">Batas atas</td><td class="p-2">25,05</td><td class="p-2">25,05 &gt; 25,05 salah, IF benar</td><td class="p-2 text-emerald-400">Lolos QC</td></tr>
                        <tr class="border-t border-slate-800"><td class="p-2 font-mono text-amber-300">Batas bawah</td><td class="p-2">24,95</td><td class="p-2">WHILE tidak jalan, IF benar</td><td class="p-2 text-emerald-400">Lolos QC</td></tr>
                        <tr class="border-t border-slate-800"><td class="p-2 font-mono text-rose-300">Ekstrem</td><td class="p-2">30,00</td><td class="p-2">WHILE jalan, minta bubut lagi</td><td class="p-2 text-amber-300">Bubut tipis lagi</td></tr>
                        <tr class="border-t border-slate-800"><td class="p-2 font-mono text-rose-300">Ekstrem</td><td class="p-2">24,90</td><td class="p-2">WHILE tidak jalan, IF salah</td><td class="p-2 text-rose-400">Reject</td></tr>
                    </tbody>
                </table>
            </div>
        `)
    }
];

/* PRESENTATION STAGE SLIDES DATA STRUCTURE FOR INDEX.HTML */
const stageSlides = {
    1: {
        title: "Level 1: Misi",
        minutes: 10,
        hasTimer: false,
        slides: [
            {
                subtitle: "STAGE 1 • MISI PEMBELAJARAN",
                heading: "Pecahkan Poros Bertingkat",
                lead: "Terapkan Berpikir Komputasional untuk menyelesaikan pesanan permesinan presisi.",
                body: shaftSVG(6)
            },
            {
                subtitle: "PESANAN BENGKEL MASUK",
                heading: "50 Unit Poros Bertingkat Baja",
                lead: "Sebelum mesin bubut dinyalakan, tim harus merancang alur kerja yang runtut tanpa ada langkah terlewat.",
                body: `
                    <div class="p-5 bg-slate-900 border-l-4 border-emerald-400 rounded-2xl max-w-2xl mx-auto text-left text-xs text-slate-300 space-y-2">
                        <p><strong>Studi Kasus:</strong> Tanpa perencanaan runtut, risiko pahat patah dan toleransi ukuran terlewati sangat tinggi.</p>
                    </div>
                    ${shaftSVG(3)}
                `
            },
            {
                subtitle: "TUJUAN PEMBELAJARAN",
                heading: "Di akhir misi, kamu mampu",
                body: `
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mt-6">
                        <div class="gg-card p-5 rounded-3xl border-t-4 border-emerald-400 text-left space-y-2">
                            <h4 class="font-display font-bold text-white text-base">Dekomposisi</h4>
                            <p class="text-xs text-slate-400">Menguraikan proses pembuatan poros menjadi tahapan kecil.</p>
                        </div>
                        <div class="gg-card p-5 rounded-3xl border-t-4 border-cyan-400 text-left space-y-2">
                            <h4 class="font-display font-bold text-white text-base">Pengenalan pola</h4>
                            <p class="text-xs text-slate-400">Mengenali pola pada tahapan komponen sejenis.</p>
                        </div>
                        <div class="gg-card p-5 rounded-3xl border-t-4 border-amber-400 text-left space-y-2">
                            <h4 class="font-display font-bold text-white text-base">Abstraksi</h4>
                            <p class="text-xs text-slate-400">Memilih informasi penting dan mengabaikan yang tidak relevan.</p>
                        </div>
                        <div class="gg-card p-5 rounded-3xl border-t-4 border-pink-400 text-left space-y-2">
                            <h4 class="font-display font-bold text-white text-base">Algoritma</h4>
                            <p class="text-xs text-slate-400">Menyusun urutan langkah yang runtut.</p>
                        </div>
                    </div>
                `
            }
        ]
    },
    2: {
        title: "Level 2: Pre-test",
        minutes: 10,
        hasTimer: true,
        slides: [
            {
                subtitle: "LEVEL 2 • ASESMEN DIAGNOSTIK",
                heading: "Pre-test Diagnostik BK",
                lead: "Kerjakan sendiri. Ini untuk mengukur titik awal pemahamanmu.",
                body: `
                    <div class="gg-card p-6 rounded-3xl max-w-xl mx-auto text-left space-y-4">
                        <p class="text-xs text-white font-semibold">1. Menguraikan masalah pekerjaan permesinan yang kompleks menjadi bagian kecil disebut...</p>
                        <div class="flex flex-wrap gap-2 text-xs">
                            <button onclick="this.style.background='#10b981'; this.style.color='#000'" class="px-4 py-2 rounded-full border border-slate-700 bg-slate-900 hover:border-emerald-400">A. Dekomposisi</button>
                            <button class="px-4 py-2 rounded-full border border-slate-700 bg-slate-900">B. Algoritma</button>
                            <button class="px-4 py-2 rounded-full border border-slate-700 bg-slate-900">C. Abstraksi</button>
                        </div>
                    </div>
                `
            }
        ]
    },
    3: {
        title: "Level 3: Materi",
        minutes: 15,
        hasTimer: false,
        slides: [
            {
                subtitle: "LEVEL 3 • EKSPLORASI MATERI",
                heading: "Empat Pilar Berpikir Komputasional",
                body: `
                    <div class="space-y-4 text-center max-w-xl mx-auto">
                        <p class="text-xs text-slate-300">Klik tombol di bawah ini untuk membuka Slide Presentasi Materi Digital terpisah.</p>
                        <a href="materi.html" class="inline-block px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-extrabold text-xs glow-yellow">
                            BUKA MATERI DIGITAL SLIDE DECK →
                        </a>
                    </div>
                `
            }
        ]
    },
    4: {
        title: "Level 4: LKM Kelompok",
        minutes: 30,
        hasTimer: true,
        slides: [
            {
                subtitle: "LEVEL 4 • TANTANGAN KELOMPOK",
                heading: "SOP Algoritma Poros Bertingkat",
                lead: "Buka Lembar Kerja Peserta Didik (LKPD) terpisah untuk mengisi tantangan kelompok.",
                body: `
                    <div class="space-y-4 text-center max-w-xl mx-auto">
                        <a href="lkm.html" class="inline-block px-6 py-3 rounded-xl bg-pink-400 hover:bg-pink-300 text-slate-950 font-display font-extrabold text-xs glow-pink">
                            BUKA LEMBAR KERJA PESERTA DIDIK (LKM) →
                        </a>
                    </div>
                `
            }
        ]
    },
    5: {
        title: "Level 5: Post-test & Refleksi",
        minutes: 15,
        hasTimer: true,
        slides: [
            {
                subtitle: "LEVEL 5 • EVALUASI MISI",
                heading: "Post-Test & Refleksi Misi",
                lead: "Buktikan penguasaan materimu setelah seluruh rangkaian pembelajaran.",
                body: `
                    <div class="space-y-4 max-w-xl mx-auto">
                        ${shaftSVG(6)}
                        <div class="p-4 bg-emerald-950/40 border border-emerald-400/40 rounded-2xl text-emerald-300 text-xs font-bold">
                            🎉 Selamat! Misi Pembelajaran Berpikir Komputasional Selesai.
                        </div>
                    </div>
                `
            }
        ]
    }
};

window.onload = function() {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (document.getElementById('winding-path')) {
        initSVGDistances();
        updateLockVisuals();
    }
};

/* =========================================================================
   MATERI DIGITAL SLIDE CONTROLLER LOGIC (FOR MATERI.HTML)
   ========================================================================= */
function renderMateriDeckSlide() {
    const slide = materiDeckData[currentMateriSlideIndex];
    if (!slide) return;

    const badgeEl = document.getElementById('materi-slide-badge');
    const topicEl = document.getElementById('materi-slide-topic');
    const viewport = document.getElementById('materi-viewport');

    if (!viewport) return;

    if (badgeEl) badgeEl.innerText = `SLIDE ${currentMateriSlideIndex + 1} DARI ${materiDeckData.length}`;
    if (topicEl) topicEl.innerText = slide.topic;

    viewport.innerHTML = `
        <div class="space-y-4 text-center animate-fade-in">
            <h3 class="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">${slide.title}</h3>
            <p class="text-amber-400 font-mono text-xs sm:text-sm font-semibold">${slide.subtitle}</p>
            ${slide.content}
        </div>
    `;

    const dotsBox = document.getElementById('materi-dots-indicator');
    if (dotsBox) {
        dotsBox.innerHTML = materiDeckData.map((_, i) => `
            <button onclick="goToMateriDeckSlide(${i})" class="w-2.5 h-2.5 rounded-full transition-all ${i === currentMateriSlideIndex ? 'bg-amber-400 w-6' : 'bg-slate-700 hover:bg-slate-500'}"></button>
        `).join("");
    }

    const btnPrev = document.getElementById('btn-materi-prev');
    const btnNext = document.getElementById('btn-materi-next');

    if (btnPrev) {
        btnPrev.disabled = (currentMateriSlideIndex === 0);
        btnPrev.style.opacity = (currentMateriSlideIndex === 0) ? "0.4" : "1";
    }

    if (btnNext) {
        btnNext.disabled = (currentMateriSlideIndex === materiDeckData.length - 1);
        btnNext.style.opacity = (currentMateriSlideIndex === materiDeckData.length - 1) ? "0.4" : "1";
    }

    const tabs = document.querySelectorAll('.materi-tab-btn');
    tabs.forEach((tab, idx) => {
        if (idx === slide.chapter) {
            tab.className = "materi-tab-btn px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold transition";
        } else {
            tab.className = "materi-tab-btn px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition";
        }
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function nextMateriDeckSlide() {
    if (currentMateriSlideIndex < materiDeckData.length - 1) {
        currentMateriSlideIndex++;
        renderMateriDeckSlide();
    }
}

function prevMateriDeckSlide() {
    if (currentMateriSlideIndex > 0) {
        currentMateriSlideIndex--;
        renderMateriDeckSlide();
    }
}

function goToMateriChapter(ch) {
    const i = materiDeckData.findIndex(sl => sl.chapter === ch);
    if (i >= 0) goToMateriDeckSlide(i);
}

function goToMateriDeckSlide(index) {
    currentMateriSlideIndex = index;
    renderMateriDeckSlide();
}

/* =========================================================================
   ROADMAP INTERACTION LOGIC (FOR INDEX.HTML)
   ========================================================================= */
function handleStageClick(stageNum) {
    if (!unlockedStages.has(stageNum)) {
        showToast(`🔒 Stage 0${stageNum} Terkunci! Selesaikan Stage 0${stageNum - 1} terlebih dahulu.`);
        return;
    }
    currentStage = stageNum;
    currentSubSlideIndex = 0;
    animateCarToDistance(nodeDistances[stageNum], 1100);
    const label = document.getElementById('current-car-stage-label');
    if (label) label.innerText = `Stage 0${stageNum}`;

    setTimeout(() => {
        openFullscreenSlide(stageNum);
    }, 1000);
}

function openFullscreenSlide(stageNum) {
    const stageData = stageSlides[stageNum];
    if (!stageData) return;

    document.getElementById('slide-stage-title').innerText = stageData.title;
    document.getElementById('stage-fullscreen').classList.remove('hidden');

    const timerBox = document.getElementById('slide-timer-box');
    if (stageData.hasTimer) {
        timerBox.style.display = "flex";
        timerSecondsLeft = stageData.minutes * 60;
        updateTimerDisplay();
    } else {
        timerBox.style.display = "none";
    }

    renderSubSlide();
}

function renderSubSlide() {
    const stageData = stageSlides[currentStage];
    const slides = stageData.slides;
    const currentSlide = slides[currentSubSlideIndex];

    const segBox = document.getElementById('slide-segmented-progress');
    segBox.innerHTML = slides.map((_, i) => `
        <div class="h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= currentSubSlideIndex ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-slate-800'}"></div>
    `).join("");

    const viewport = document.getElementById('slide-viewport');
    viewport.innerHTML = `
        <div class="slide-content text-center max-w-4xl mx-auto space-y-4 animate-fade-in">
            ${currentSlide.subtitle ? `<p class="text-xs font-mono font-extrabold text-emerald-400 tracking-widest uppercase">${currentSlide.subtitle}</p>` : ''}
            ${currentSlide.heading ? `<h2 class="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">${currentSlide.heading}</h2>` : ''}
            ${currentSlide.lead ? `<p class="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">${currentSlide.lead}</p>` : ''}
            ${currentSlide.body ? currentSlide.body : ''}
        </div>
    `;

    const btnPrev = document.getElementById('btn-slide-prev');
    const btnNext = document.getElementById('btn-slide-next');

    btnPrev.disabled = (currentSubSlideIndex === 0);
    btnPrev.style.opacity = (currentSubSlideIndex === 0) ? "0.4" : "1";

    if (currentSubSlideIndex < slides.length - 1) {
        btnNext.innerHTML = `<span>Lanjut →</span>`;
    } else {
        if (currentStage < 5) {
            btnNext.innerHTML = `<span>Lanjut ke level ${currentStage + 1} →</span>`;
        } else {
            btnNext.innerHTML = `<span>Selesai Misi ✓</span>`;
        }
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function nextSubSlide() {
    const slides = stageSlides[currentStage].slides;
    if (currentSubSlideIndex < slides.length - 1) {
        currentSubSlideIndex++;
        renderSubSlide();
    } else {
        const nextStage = currentStage + 1;
        if (nextStage <= 5) {
            unlockedStages.add(nextStage);
            updateLockVisuals();
            closeFullscreenSlide();
            handleStageClick(nextStage);
        } else {
            closeFullscreenSlide();
            showToast("Selamat! Seluruh Misi Pembelajaran Selesai 🎉");
        }
    }
}

function prevSubSlide() {
    if (currentSubSlideIndex > 0) {
        currentSubSlideIndex--;
        renderSubSlide();
    }
}

function closeFullscreenSlide() {
    clearInterval(timerInterval);
    document.getElementById('stage-fullscreen').classList.add('hidden');
}

function toggleSlideTimer() {
    const btn = document.getElementById('slide-timer-btn');
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        btn.innerText = "Mulai timer";
    } else {
        btn.innerText = "Hentikan timer";
        timerInterval = setInterval(() => {
            timerSecondsLeft--;
            updateTimerDisplay();
            if (timerSecondsLeft <= 0) {
                clearInterval(timerInterval);
                showToast("Waktu Pengerjaan Habis!");
            }
        }, 1000);
    }
}

function updateTimerDisplay() {
    const m = String(Math.floor(timerSecondsLeft / 60)).padStart(2, '0');
    const s = String(timerSecondsLeft % 60).padStart(2, '0');
    const el = document.getElementById('slide-timer-val');
    if (el) el.innerText = `${m}:${s}`;
}

function updateLockVisuals() {
    for (let i = 2; i <= 5; i++) {
        const btn = document.getElementById(`node-btn-${i}`);
        const card = document.getElementById(`card-stage-${i}`);
        const badge = document.getElementById(`badge-lock-${i}`);

        if (unlockedStages.has(i)) {
            if (btn) {
                btn.className = "w-16 h-16 rounded-full bg-slate-950 border-4 border-amber-400 text-amber-400 font-display font-black text-xl flex items-center justify-center shadow-2xl glow-yellow transform hover:scale-110 transition cursor-pointer opacity-100";
                btn.innerText = `0${i}`;
            }
            if (card) {
                card.classList.remove('opacity-60', 'border-slate-800');
                card.classList.add('border-amber-400/40');
            }
            if (badge) {
                badge.innerText = "TERBUKA";
                badge.className = "text-xs font-mono text-amber-400 font-bold";
            }
        } else {
            if (btn) {
                btn.className = "w-16 h-16 rounded-full bg-slate-950 border-4 border-slate-700 text-slate-500 font-display font-black text-xl flex items-center justify-center shadow-2xl transition opacity-60";
                btn.innerText = "🔒";
            }
            if (card) card.classList.add('opacity-60', 'border-slate-800');
            if (badge) {
                badge.innerText = "TERKUNCI 🔒";
                badge.className = "text-xs font-mono text-slate-500";
            }
        }
    }
}

function initSVGDistances() {
    const path = document.getElementById('winding-path');
    if (!path) return;
    const total = path.getTotalLength();
    nodeDistances = [0];
    for (let n = 1; n < nodeCoordinates.length; n++) {
        const target = nodeCoordinates[n];
        let minDist = Infinity, bestL = 0;
        for (let l = 0; l <= total; l += 4) {
            const p = path.getPointAtLength(l);
            const dist = Math.hypot(p.x - target.x, p.y - target.y);
            if (dist < minDist) { minDist = dist; bestL = l; }
        }
        nodeDistances.push(bestL);
    }
}

function nextStageWithCar() {
    let next = currentStage + 1;
    if (next > 5) next = 1;
    handleStageClick(next);
}

function animateCarToDistance(targetDist, duration = 1100) {
    cancelAnimationFrame(animReqId);
    const startDist = currentCarDistance;
    const startTime = performance.now();

    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        currentCarDistance = startDist + (targetDist - startDist) * ease;
        renderCarPosition(currentCarDistance);
        if (progress < 1) animReqId = requestAnimationFrame(step);
    }
    animReqId = requestAnimationFrame(step);
}

function renderCarPosition(dist) {
    const path = document.getElementById('winding-path');
    if (!path) return;
    const p = path.getPointAtLength(dist);
    const pNext = path.getPointAtLength(Math.min(dist + 3, path.getTotalLength()));
    const angle = Math.atan2(pNext.y - p.y, pNext.x - p.x) * (180 / Math.PI) + 90;
    const car = document.getElementById('car-avatar');
    if (car) car.setAttribute('transform', `translate(${p.x}, ${p.y}) rotate(${angle})`);
}

function openRPPModal() { 
    const modal = document.getElementById('rpp-modal');
    if (modal) modal.classList.remove('hidden'); 
}
function closeRPPModal() { 
    const modal = document.getElementById('rpp-modal');
    if (modal) modal.classList.add('hidden'); 
}

function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2';
    t.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i><span>${msg}</span>`;
    document.body.appendChild(t);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    setTimeout(() => t.remove(), 2500);
}
