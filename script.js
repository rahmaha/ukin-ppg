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
   MATERI DIGITAL SLIDE DECK DATA (EXTRACTED FROM CT_Rusli.pptx)
   ========================================================================= */
const materiDeckData = [
    {
        topic: "BAB 1 • KONSEP BERPIKIR KOMPUTASIONAL",
        badge: "SLIDE 1 DARI 6",
        title: "Pengertian Berpikir Komputasional",
        subtitle: "Computational Thinking (CT) dalam Kehidupan & Teknologi",
        content: `
            <div class="space-y-4 max-w-3xl mx-auto text-center animate-fade-in">
                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong>Berpikir Komputasional (Computational Thinking)</strong> adalah konsep menemukan masalah di sekitar kita, memahaminya, kemudian mengembangkan solusi yang inovatif dengan bantuan perangkat teknologi komputer.
                </p>
                <div class="p-4 bg-slate-950 rounded-2xl border border-amber-400/30 text-amber-300 text-xs font-mono">
                    💡 Berpikir komputasional memungkinkan kita menyelesaikan masalah yang sangat kompleks secara sistematis.
                </div>
                <div class="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div class="p-3 bg-slate-900 rounded-xl border border-emerald-400/40 text-emerald-300">1. Dekomposisi</div>
                    <div class="p-3 bg-slate-900 rounded-xl border border-cyan-400/40 text-cyan-300">2. Pengenalan Pola</div>
                    <div class="p-3 bg-slate-900 rounded-xl border border-amber-400/40 text-amber-300">3. Abstraksi</div>
                    <div class="p-3 bg-slate-900 rounded-xl border border-pink-400/40 text-pink-300">4. Algoritma</div>
                </div>
            </div>
        `
    },
    {
        topic: "PILAR 1 • DEKOMPOSISI",
        badge: "SLIDE 2 DARI 6",
        title: "Dekomposisi (Divide and Conquer)",
        subtitle: "Memecah Masalah Kompleks Menjadi Bagian-Bagian Kecil",
        content: `
            <div class="space-y-4 max-w-3xl mx-auto text-left animate-fade-in text-xs">
                <p class="text-slate-300">
                    <strong>Dekomposisi</strong> adalah pendekatan dengan memecah masalah besar dan kompleks menjadi masalah-masalah yang lebih kecil dan lebih sederhana sehingga lebih mudah dikelola, dipahami, dan dicari solusinya (disebut juga <em>"Divide and Conquer"</em>).
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div class="p-4 bg-slate-950 rounded-2xl border border-emerald-400/40 space-y-2">
                        <div class="font-bold text-emerald-400 font-mono">🚲 Contoh Troubleshoot Sepeda:</div>
                        <ul class="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                            <li>Apa penyebab bunyi "tak tak tak"?</li>
                            <li>Bagian mana yang bergerak & jadi sumber bunyi?</li>
                            <li>Bagaimana cara memeriksa & memperbaiki?</li>
                        </ul>
                    </div>
                    <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                        <div class="font-bold text-amber-400 font-mono">🧪 Contoh Sintesis Kimia Industri:</div>
                        <ul class="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                            <li>Persiapan Bahan Baku</li>
                            <li>Kondisi Reaksi Kimia (suhu & tekanan)</li>
                            <li>Pemurnian Produk & Pengendalian Kualitas</li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    },
    {
        topic: "PILAR 2 • PENGENALAN POLA",
        badge: "SLIDE 3 DARI 6",
        title: "Pengenalan Pola (Pattern Recognition)",
        subtitle: "Melihat Kesamaan Pola & Karakteristik Permasalahan",
        content: `
            <div class="space-y-4 max-w-3xl mx-auto text-left animate-fade-in text-xs">
                <p class="text-slate-300">
                    Melihat kesamaan pola atau karakteristik tertentu dari suatu permasalahan. Masalah dengan karakteristik sama memberikan peluang untuk menggunakan solusi yang sama.
                </p>
                <div class="p-4 bg-slate-950 rounded-2xl border border-cyan-400/40 space-y-3">
                    <div class="font-bold text-cyan-400 font-mono">🥼 Kasus Titrasi Kimia Rina (HCl + NaOH):</div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                            <span class="text-rose-400 font-bold block">Percobaan 1:</span>
                            Tetesan cepat ➔ Merah muda pekat (Gagal/lewat ekuivalen).
                        </div>
                        <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                            <span class="text-amber-400 font-bold block">Percobaan 2:</span>
                            Tetes lambat tanpa adukan ➔ Reaksi tidak merata (Gagal).
                        </div>
                        <div class="p-2.5 bg-slate-900 rounded-xl border border-emerald-400/40 text-emerald-300 font-semibold">
                            <span class="text-emerald-400 font-bold block">Percobaan 3 (Berhasil):</span>
                            Tetes pelan + goyangan konstan ➔ Merah muda pucat stabil 24.8 mL.
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    {
        topic: "PILAR 3 • ABSTRAKSI",
        badge: "SLIDE 4 DARI 6",
        title: "Abstraksi (Abstraction)",
        subtitle: "Memilih Informasi Penting & Mengabaikan Detail Tidak Relevan",
        content: `
            <div class="space-y-4 max-w-3xl mx-auto text-left animate-fade-in text-xs">
                <p class="text-slate-300">
                    <strong>Abstraksi</strong> adalah teknik memfokuskan perhatian pada informasi yang berguna dan relevan serta menyaring atau mengabaikan detail-detail yang tidak penting.
                </p>
                <div class="p-4 bg-slate-950 rounded-2xl border border-amber-400/40 space-y-3">
                    <div class="font-bold text-amber-400 font-mono">🛠️ Kasus Inventaris Bengkel Arif:</div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                        <div class="p-3 bg-slate-900 rounded-xl border border-emerald-500/30">
                            <span class="text-emerald-400 font-bold block mb-1">✔ Disimpan (Inti Relevan):</span>
                            Oli A (15 pcs, Rp60rb), Busi B (10 pcs, Rp22rb), Ban C (5 pcs, Rp160rb).
                        </div>
                        <div class="p-3 bg-slate-900 rounded-xl border border-rose-500/30">
                            <span class="text-rose-400 font-bold block mb-1">✖ Diabaikan (Detail Tidak Penting):</span>
                            Warna botol oli, cap tanggal busi, pembungkus plastik ban, poster kusut.
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    {
        topic: "PILAR 4 • ALGORITMA",
        badge: "SLIDE 5 DARI 6",
        title: "Algoritma (Flowchart & Pseudocode)",
        subtitle: "Mengembangkan Langkah Instruksi Logis & Terstruktur",
        content: `
            <div class="space-y-4 max-w-3xl mx-auto text-left animate-fade-in text-xs">
                <p class="text-slate-300">
                    <strong>Algoritma</strong> adalah langkah-langkah atau aturan baku yang harus dipenuhi untuk memecah masalah secara terstruktur. Algoritma disajikan melalui 2 cara utama:
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="p-4 bg-slate-950 rounded-2xl border border-purple-400/40 space-y-2">
                        <div class="font-bold text-purple-400 font-mono">📊 Flowchart (Diagram Alir):</div>
                        <p class="text-slate-400 text-[11px]">Diagram mewakili simbol standar: Oval (Start/Stop), Persegi Panjang (Proses), Belah Ketupat (Keputusan), Jajaran Genjang (Input/Output).</p>
                    </div>
                    <div class="p-4 bg-slate-950 rounded-2xl border border-pink-400/40 space-y-2">
                        <div class="font-bold text-pink-400 font-mono">📝 Pseudocode:</div>
                        <p class="text-slate-400 text-[11px]">Rangkaian instruksi berbentuk kode baku. Perintah ditulis huruf KAPITAL (INPUT, OUTPUT, STORE, IF-THEN), dan variabel huruf kecil.</p>
                    </div>
                </div>
            </div>
        `
    },
    {
        topic: "TAHAP AKHIR • EVALUASI SOLUSI",
        badge: "SLIDE 6 DARI 6",
        title: "Mengevaluasi Solusi & Dry Run",
        subtitle: "Memastikan Solusi Bekerja Efisien, Lengkap, dan Tepat",
        content: `
            <div class="space-y-4 max-w-3xl mx-auto text-left animate-fade-in text-xs">
                <p class="text-slate-300">
                    Evaluasi dilakukan untuk memastikan solusi dapat bekerja dengan baik serta melihat kemungkinan peningkatan efisiensi.
                </p>
                <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <div class="font-bold text-emerald-400 font-mono">🔍 Kriteria Uji Solusi (Teknik Dry Run):</div>
                    <p class="text-slate-400 text-[11px]">
                        <em>Dry run</em> dilakukan dengan menelusuri langkah demi langkah menggunakan 3 kriteria input berbeda:
                    </p>
                    <div class="grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
                        <div class="p-2 bg-slate-900 rounded-lg border border-slate-700 text-slate-300">1. Input Normal</div>
                        <div class="p-2 bg-slate-900 rounded-lg border border-slate-700 text-amber-300">2. Input Batas</div>
                        <div class="p-2 bg-slate-900 rounded-lg border border-slate-700 text-rose-300">3. Input Ekstrem</div>
                    </div>
                </div>
            </div>
        `
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

    if (badgeEl) badgeEl.innerText = slide.badge;
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
        if (idx === currentMateriSlideIndex) {
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
