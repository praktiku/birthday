// ── STARS
function makeStars(id, n) {
    const el = document.getElementById(id);
    for (let i = 0; i < n; i++) {
        const s = document.createElement('div'); s.className = 's';
        const sz = Math.random() * 2.4 + .4;
        s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random() * 100}%;left:${Math.random() * 100}%;--d:${Math.random() * 3 + .8}s;--dl:-${Math.random() * 3}s`;
        el.appendChild(s);
    }
}
makeStars('oStars', 70);
makeStars('stars', 160);

const opening = document.getElementById('opening');
const main = document.getElementById('main');
const openBtn = document.getElementById('openBtn');
const sndBtn = document.getElementById('sndBtn');
const ambientAudio = document.getElementById('ambientAudio');
const abductScene = document.getElementById('abductScene');
const ringWrap = document.getElementById('ringWrap');
const photoImage = document.getElementById('phImg');
let celebrationLoopId = null;
let invitationOpened = false;
let abductResetId = null;

function syncDropTarget() {
    if (!ringWrap || !main) {
        return;
    }
    const targetEl = photoImage || ringWrap;
    const ringRect = targetEl.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();
    const x = ringRect.left - mainRect.left + (ringRect.width / 2);
    const y = ringRect.top - mainRect.top + (ringRect.height / 2);
    main.style.setProperty('--drop-x', `${x}px`);
    main.style.setProperty('--drop-y', `${y}px`);
}

function playAbductionSequence() {
    if (!abductScene) {
        return;
    }
    syncDropTarget();
    main.classList.remove('abduct-on');
    void main.offsetWidth;
    main.classList.add('abduct-on');
    if (abductResetId) {
        clearTimeout(abductResetId);
    }
    abductResetId = setTimeout(() => {
        main.classList.remove('abduct-on');
    }, 4500);
}

function startCelebrationLoop() {
    if (celebrationLoopId) {
        return;
    }

    celebrationLoopId = setInterval(() => {
        if (!main.classList.contains('vis')) {
            return;
        }
        const x = window.innerWidth * (0.15 + Math.random() * 0.7);
        const y = window.innerHeight * (0.16 + Math.random() * 0.42);
        burst(x, y, 8);
    }, 8000);
}

// ── OPEN
openBtn.addEventListener('click', () => {
    ensureAmbientSound();
    opening.classList.add('out');
    setTimeout(() => { main.classList.add('vis'); }, 200);
    if (!invitationOpened) {
        invitationOpened = true;
        setTimeout(playAbductionSequence, 120);
        startConfettiRain();
        burst(window.innerWidth / 2, window.innerHeight * .4, 80);
        setTimeout(() => burst(window.innerWidth * .25, window.innerHeight * .22, 42), 220);
        setTimeout(() => burst(window.innerWidth * .75, window.innerHeight * .28, 42), 520);
        setTimeout(() => burst(window.innerWidth * .5, window.innerHeight * .65, 36), 860);
    } else {
        burst(window.innerWidth / 2, window.innerHeight * .4, 40);
    }
    startCelebrationLoop();
});

const confettiParticles = new Set();
const MAX_CONFETTI = 80;

// ── CONFETTI
function burst(x, y, n = 28) {
    const cols = ['#ffd93d', '#00d4ff', '#ff8fab', '#6ee7b7', '#a78bfa', '#fff', '#38bdf8', '#fb923c'];
    for (let i = 0; i < n && confettiParticles.size < MAX_CONFETTI; i++) {
        const c = document.createElement('div'); c.className = 'cf';
        const a = Math.random() * 360, d = 60 + Math.random() * 150, r = `${Math.random() * 720 - 360}deg`;
        const w = Math.random() > 0.5 ? 8 : 5, h = Math.random() > 0.5 ? 8 : 12;
        c.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${cols[~~(Math.random() * cols.length)]};--cfx:${Math.cos(a * Math.PI / 180) * d}px;--cfy:${Math.sin(a * Math.PI / 180) * d + 100}px;--cfr:${r};--cft:${.9 + Math.random() * .9}s`;
        confettiParticles.add(c);
        document.body.appendChild(c);
        setTimeout(() => {
            c.remove();
            confettiParticles.delete(c);
        }, 2200);
    }
}

function upBurst(x, y, n = 28) {
    const cols = ['#ffd93d', '#00d4ff', '#ff8fab', '#6ee7b7', '#a78bfa', '#fff', '#38bdf8', '#fb923c'];
    for (let i = 0; i < n && confettiParticles.size < MAX_CONFETTI; i++) {
        const c = document.createElement('div'); c.className = 'cf';
        const a = Math.random() * 360, d = 60 + Math.random() * 150, r = `${Math.random() * 720 - 360}deg`;
        const w = Math.random() > 0.5 ? 8 : 5, h = Math.random() > 0.5 ? 8 : 12;
        c.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${cols[~~(Math.random() * cols.length)]};--cfx:${Math.cos(a * Math.PI / 180) * d}px;--cfy:${-(Math.sin(a * Math.PI / 180) * d + 100)}px;--cfr:${r};--cft:${.9 + Math.random() * .9}s`;
        confettiParticles.add(c);
        document.body.appendChild(c);
        setTimeout(() => {
            c.remove();
            confettiParticles.delete(c);
        }, 2200);
    }
}

let confettiRainId = null;
let lastRainBurst = 0;

function startConfettiRain() {
    if (confettiRainId) {
        return;
    }
    const rainLoop = () => {
        if (!playing || ambientAudio.paused) {
            stopConfettiRain();
            return;
        }
        const now = Date.now();
        if (now - lastRainBurst > 240) {
            const x = Math.random() * window.innerWidth;
            const yTop = -20 + Math.random() * 30;
            const yBottom = window.innerHeight + Math.random() * 30;
            burst(x, yTop, 4);
            upBurst(x, yBottom, 4);
            lastRainBurst = now;
        }
        confettiRainId = requestAnimationFrame(rainLoop);
    };
    confettiRainId = requestAnimationFrame(rainLoop);
}

function stopConfettiRain() {
    if (confettiRainId) {
        cancelAnimationFrame(confettiRainId);
        confettiRainId = null;
    }
}

function rainConfetti(duration = 2600) {
    const start = Date.now();
    const drop = setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = -20 + Math.random() * 30;
        burst(x, y, 10);
        if (Date.now() - start >= duration) {
            clearInterval(drop);
        }
    }, 140);
}

// ── COUNTDOWN
const target = new Date(2026, 3, 13, 23, 30, 0);
const ids = ['cd-d', 'cd-h', 'cd-m', 'cd-s'];
function tick() {
    const diff = Math.max(0, target - new Date());
    const vals = [
        Math.floor(diff / 86400000),
        Math.floor(diff % 86400000 / 3600000),
        Math.floor(diff % 3600000 / 60000),
        Math.floor(diff % 60000 / 1000)
    ];
    ids.forEach((id, i) => {
        const el = document.getElementById(id), v = String(vals[i]).padStart(2, '0');
        if (el.textContent !== v) {
            el.style.transform = 'scale(1.2)';
            el.textContent = v;
            setTimeout(() => el.style.transform = '', 120);
        }
    });
}
tick();
let countdownInterval = null;

function startCountdown() {
    if (countdownInterval) return;
    countdownInterval = setInterval(tick, 1000);
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

startCountdown();

window.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopCountdown();
    } else {
        startCountdown();
    }
});

window.addEventListener('beforeunload', () => {
    stopCountdown();
    if (celebrationLoopId) {
        clearInterval(celebrationLoopId);
    }
});

function showToast(msg) {
    const t = document.getElementById('toast'); t.textContent = msg;
    t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2500);
}

// ── SOUND (mp3 ambient)
ambientAudio.volume = 0.35;
let playing = false;

function updateSoundButton() {
    sndBtn.textContent = playing ? '🔊' : '🔇';
    sndBtn.setAttribute('aria-pressed', String(playing));
    sndBtn.setAttribute('aria-label', playing ? 'Disable ambient sound' : 'Enable ambient sound');
}

sndBtn.addEventListener('click', async () => {
    try {
        if (!playing) {
            await ensureAmbientSound(true);
            playing = true;
            startConfettiRain();
        } else {
            ambientAudio.pause();
            playing = false;
            stopConfettiRain();
        }
        updateSoundButton();
    } catch (e) {
        showToast('Unable to play audio on this browser');
    }
});

updateSoundButton();

async function ensureAmbientSound(force = false) {
    try {
        if (force) {
            ambientAudio.currentTime = 0;
        }
        await ambientAudio.play();
        playing = true;
        updateSoundButton();
        return true;
    } catch (e) {
        playing = false;
        updateSoundButton();
        return false;
    }
}

window.addEventListener('load', () => {
    ensureAmbientSound();
    syncDropTarget();
});

window.addEventListener('visibilitychange', () => {
    if (!document.hidden && !playing) {
        ensureAmbientSound();
    }
});

window.addEventListener('pointerdown', () => {
    if (!playing) {
        ensureAmbientSound();
    }
}, { passive: true });

window.addEventListener('resize', syncDropTarget);

window.addEventListener('keydown', () => {
    if (!playing) {
        ensureAmbientSound();
        startConfettiRain();
    }
});

ambientAudio.addEventListener('play', () => {
    playing = true;
    startConfettiRain();
    updateSoundButton();
});

ambientAudio.addEventListener('pause', () => {
    playing = false;
    stopConfettiRain();
    updateSoundButton();
});

ambientAudio.addEventListener('ended', () => {
    playing = false;
    stopConfettiRain();
    updateSoundButton();
});
