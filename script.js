let currentStage = 1;
let currentSubSlideIndex = 0;
let unlockedStages = new Set([1]); // Stage 1 Terbuka Awal
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

// PRESENTATION SLIDES DATA STRUCTURE (PERFECT MATCH SCREENSHOT & CONTENT)
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
                subtitle: "LEVEL 3 • MATERI UTAMA",
                heading: "Empat Pilar Berpikir Komputasional",
                body: `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl text-left">
                        <div class="p-5 bg-slate-950 rounded-2xl border-t-4 border-emerald-400">
                            <b class="text-emerald-400 font-display text-base">Dekomposisi</b>
                            <p class="text-xs text-slate-400 mt-1">Memecah job sheet menjadi potongan tahap potong, cekam, bubut, ukur.</p>
                        </div>
                        <div class="p-5 bg-slate-950 rounded-2xl border-t-4 border-cyan-400">
                            <b class="text-cyan-400 font-display text-base">Pengenalan Pola</b>
                            <p class="text-xs text-slate-400 mt-1">Poros & baut punya alur dasar sama, beda di pembuat ulir.</p>
                        </div>
                        <div class="p-5 bg-slate-950 rounded-2xl border-t-4 border-amber-400">
                            <b class="text-amber-400 font-display text-base">Abstraksi</b>
                            <p class="text-xs text-slate-400 mt-1">Fokus pada diameter & toleransi, abaikan warna cet mesin.</p>
                        </div>
                        <div class="p-5 bg-slate-950 rounded-2xl border-t-4 border-pink-400">
                            <b class="text-pink-400 font-display text-base">Algoritma SOP</b>
                            <p class="text-xs text-slate-400 mt-1">Menyusun urutan langkah pengerjaan yang logis & K3LH.</p>
                        </div>
                    </div>
                `
            }
        ]
    },
    4: {
        title: "Level 4: LKM",
        minutes: 30,
        hasTimer: true,
        slides: [
            {
                subtitle: "LEVEL 4 • TANTANGAN KELOMPOK",
                heading: "SOP Algoritma Poros Bertingkat",
                lead: "Susun tahap pembuatan poros bertingkat dengan urutan yang benar.",
                body: `
                    <div class="gg-card p-6 rounded-3xl max-w-2xl mx-auto space-y-4 text-left">
                        <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-amber-300">
                            1. Potong Bahan ➔ 2. Pasang di Chuck ➔ 3. Bubut Muka ➔ 4. Bubut Bertingkat ➔ 5. Ukur Jangka Sorong
                        </div>
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
    lucide.createIcons();
    initSVGDistances();
    updateLockVisuals();
};

function switchView(viewName) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(`view-${viewName}`).classList.remove('hidden');

    ['roadmap', 'materi', 'lkm'].forEach(name => {
        const btn = document.getElementById(`nav-btn-${name}`);
        if (name === viewName) {
            btn.className = "px-3.5 py-1.5 rounded-xl font-bold bg-amber-400 text-slate-950 transition flex items-center space-x-1.5";
        } else {
            btn.className = "px-3.5 py-1.5 rounded-xl font-bold text-slate-400 hover:text-white transition flex items-center space-x-1.5";
        }
    });
}

function handleStageClick(stageNum) {
    if (!unlockedStages.has(stageNum)) {
        showToast(`🔒 Stage 0${stageNum} Terkunci! Selesaikan Stage 0${stageNum - 1} terlebih dahulu.`);
        return;
    }
    currentStage = stageNum;
    currentSubSlideIndex = 0;
    animateCarToDistance(nodeDistances[stageNum], 1100);
    document.getElementById('current-car-stage-label').innerText = `Stage 0${stageNum}`;

    setTimeout(() => {
        openFullscreenSlide(stageNum);
    }, 1000);
}

/* FULLSCREEN PRESENTATION SLIDE ENGINE */
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

    // Segmented Progress Bar rendering (Match screenshot top green bars)
    const segBox = document.getElementById('slide-segmented-progress');
    segBox.innerHTML = slides.map((_, i) => `
        <div class="h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= currentSubSlideIndex ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-slate-800'}"></div>
    `).join("");

    // Slide Content rendering
    const viewport = document.getElementById('slide-viewport');
    viewport.innerHTML = `
        <div class="slide-content text-center max-w-4xl mx-auto space-y-4 animate-fade-in">
            ${currentSlide.subtitle ? `<p class="text-xs font-mono font-extrabold text-emerald-400 tracking-widest uppercase">${currentSlide.subtitle}</p>` : ''}
            ${currentSlide.heading ? `<h2 class="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">${currentSlide.heading}</h2>` : ''}
            ${currentSlide.lead ? `<p class="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">${currentSlide.lead}</p>` : ''}
            ${currentSlide.body ? currentSlide.body : ''}
        </div>
    `;

    // Update Bottom Nav Buttons
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

    lucide.createIcons();
}

function nextSubSlide() {
    const slides = stageSlides[currentStage].slides;
    if (currentSubSlideIndex < slides.length - 1) {
        currentSubSlideIndex++;
        renderSubSlide();
    } else {
        // Unlock next stage
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
    document.getElementById('slide-timer-val').innerText = `${m}:${s}`;
}

function updateLockVisuals() {
    for (let i = 2; i <= 5; i++) {
        const btn = document.getElementById(`node-btn-${i}`);
        const card = document.getElementById(`card-stage-${i}`);
        const badge = document.getElementById(`badge-lock-${i}`);

        if (unlockedStages.has(i)) {
            btn.className = "w-16 h-16 rounded-full bg-slate-950 border-4 border-amber-400 text-amber-400 font-display font-black text-xl flex items-center justify-center shadow-2xl glow-yellow transform hover:scale-110 transition cursor-pointer opacity-100";
            btn.innerText = `0${i}`;
            card.classList.remove('opacity-60', 'border-slate-800');
            card.classList.add('border-amber-400/40');
            badge.innerText = "TERBUKA";
            badge.className = "text-xs font-mono text-amber-400 font-bold";
        } else {
            btn.className = "w-16 h-16 rounded-full bg-slate-950 border-4 border-slate-700 text-slate-500 font-display font-black text-xl flex items-center justify-center shadow-2xl transition opacity-60";
            btn.innerText = "🔒";
            card.classList.add('opacity-60', 'border-slate-800');
            badge.innerText = "TERKUNCI 🔒";
            badge.className = "text-xs font-mono text-slate-500";
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

function openRPPModal() { document.getElementById('rpp-modal').classList.remove('hidden'); }
function closeRPPModal() { document.getElementById('rpp-modal').classList.add('hidden'); }

function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-2xl flex items-center space-x-2';
    t.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4"></i><span>${msg}</span>`;
    document.body.appendChild(t);
    lucide.createIcons();
    setTimeout(() => t.remove(), 2500);
}