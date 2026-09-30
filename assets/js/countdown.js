// ============================================
// KONFIGURASI TARGET TANGGAL
// Ganti tahun di sini kalau dipakai ulang tahun berikutnya.
// Format ISO dengan offset WIB (+07:00) supaya akurat lintas timezone device.
// ============================================
const TARGET_DATE = new Date('2026-10-01T00:00:00+07:00');

const countdownState = document.getElementById('countdownState');
const giftState = document.getElementById('giftState');
const giftStage = document.getElementById('giftStage');
const giftBox = document.getElementById('giftBox');
const giftHint = document.getElementById('giftHint');
const giftMessage = document.getElementById('giftMessage');
const continueBtn = document.getElementById('continueBtn');

const tDays = document.getElementById('tDays');
const tHours = document.getElementById('tHours');
const tMinutes = document.getElementById('tMinutes');
const tSeconds = document.getElementById('tSeconds');

function pad(n) { return String(n).padStart(2, '0'); }

function showGiftState() {
  countdownState.style.display = 'none';
  giftState.classList.add('is-active');
}

function tick() {
  const now = new Date();
  const diff = TARGET_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    clearInterval(intervalId);
    showGiftState();
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  tDays.textContent = pad(days);
  tHours.textContent = pad(hours);
  tMinutes.textContent = pad(minutes);
  tSeconds.textContent = pad(seconds);
}

// ============================================
// BYPASS RAHASIA (untuk testing/preview)
// Akses lewat: countdown.html?skip=YOURSECRET
// Ganti 'YOURSECRET' di bawah dengan kode Anda sendiri.
// CATATAN: ini bukan keamanan sungguhan — siapapun yang lihat source code
// (View Source / DevTools) bisa menemukan kode ini. Hanya untuk hindari
// orang awam iseng menemukan shortcut-nya.
// ============================================
const BYPASS_CODE = '123';
const urlParams = new URLSearchParams(window.location.search);
const bypassed = urlParams.get('skip') === BYPASS_CODE;

// Kalau saat halaman dibuka target sudah lewat (atau bypass aktif), langsung tampilkan gift
let intervalId = null;
if (bypassed || TARGET_DATE.getTime() - Date.now() <= 0) {
  showGiftState();
} else {
  tick();
  intervalId = setInterval(tick, 1000);
}

// ============================================
// GIFT INTERACTION
// ============================================
let opened = false;

function openGift() {
  if (opened) return;
  opened = true;

  giftBox.classList.add('is-opened');
  giftStage.classList.add('is-open');
  giftHint.style.display = 'none';

  if (window.SFX) SFX.gift();
  fireConfetti();
  floatHearts(26);

  setTimeout(() => {
    giftStage.classList.add('is-leaving');
  }, 900);

  setTimeout(() => {
    giftStage.style.display = 'none';
    giftMessage.classList.add('is-visible');
    floatHearts(14);
    startGentleHearts();

    setTimeout(() => {
      continueBtn.classList.add('is-visible');
    }, 2200);
  }, 1400);
}

giftBox.addEventListener('click', openGift);
giftBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openGift();
  }
});

function fireConfetti() {
  if (typeof confetti !== 'function') return;
  const colors = ['#E5C07B', '#F3E3BE', '#C99A4B', '#FFFFFF', '#FFF4D6'];
  const star = confetti.shapeFromText ? confetti.shapeFromText({ text: '✨', scalar: 2 }) : 'star';

  confetti({
    particleCount: 110,
    spread: 80,
    startVelocity: 45,
    origin: { y: 0.65 },
    colors
  });

  setTimeout(() => {
    confetti({
      particleCount: 24,
      spread: 100,
      origin: { y: 0.6 },
      shapes: [star],
      scalar: 2,
      flat: true
    });
  }, 200);

  const end = Date.now() + 1400;
  (function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function floatHearts(count) {
  const symbols = ['✨', '💛', '🤍', '⭐', '🌟'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'float-heart';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const duration = 4 + Math.random() * 4;
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = 14 + Math.random() * 20 + 'px';
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = Math.random() * 1.2 + 's';
    el.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
    el.style.setProperty('--spin', (Math.random() * 60 - 30) + 'deg');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (duration + 1.5) * 1000);
  }
}

function startGentleHearts() {
  setInterval(() => {
    if (!document.hidden) floatHearts(2);
  }, 1800);
}

continueBtn.addEventListener('click', () => {
  if (window.SFX) SFX.click();
  window.location.href = 'hub.html';
});
