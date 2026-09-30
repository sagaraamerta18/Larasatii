// ============================================
// AUDIO SYSTEM
// - SFX: disintesis langsung lewat Web Audio API (gak butuh file, gak ada isu copyright)
// - BGM: file eksternal assets/audio/bgm.mp3 (Anda yang sediakan filenya)
// - Preferensi mute tersimpan di localStorage, konsisten di semua halaman
// ============================================
const AUDIO_MUTE_KEY = 'site_audio_muted';
const BGM_PATH = 'assets/audio/bgm.mp3';
const BGM_VOLUME = 0.22;  // sengaja lebih pelan dari SFX
const SFX_VOLUME = 0.7;

let audioCtx = null;
let sfxGain = null;
let bgmEl = null;
let unlocked = false;

function getMuted() {
  return localStorage.getItem(AUDIO_MUTE_KEY) === '1';
}

function setMuted(val) {
  localStorage.setItem(AUDIO_MUTE_KEY, val ? '1' : '0');
  applyMuteState();
}

function applyMuteState() {
  const muted = getMuted();
  if (bgmEl) bgmEl.muted = muted;
  if (sfxGain) sfxGain.gain.value = muted ? 0 : SFX_VOLUME;
  updateMuteButtonIcon();
}

function ensureAudio() {
  if (unlocked) return;
  unlocked = true;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  sfxGain = audioCtx.createGain();
  sfxGain.gain.value = getMuted() ? 0 : SFX_VOLUME;
  sfxGain.connect(audioCtx.destination);

  bgmEl = new Audio(BGM_PATH);
  bgmEl.loop = true;
  bgmEl.volume = BGM_VOLUME;
  bgmEl.muted = getMuted();
  // kalau file belum ada / autoplay diblokir, biarkan diam saja (tidak error ke user)
  bgmEl.play().catch((err) => { console.warn('BGM belum bisa diputar:', err.message); });
}

function playTone(freq, duration, type = 'sine', volume = 1) {
  ensureAudio();
  if (getMuted()) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(sfxGain);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.stop(audioCtx.currentTime + duration);
}

// ============================================
// PRESET SFX
// ============================================
const SFX = {
  click: () => playTone(600, 0.08, 'sine', 0.5),
  gift: () => { ensureAudio(); [660, 880, 1100].forEach((f, i) => setTimeout(() => playTone(f, 0.2, 'sine', 0.5), i * 120)); },
};
window.SFX = SFX;

// ============================================
// TOMBOL MUTE (floating, otomatis muncul di tiap halaman yang include file ini)
// ============================================
function injectMuteButton() {
  const btn = document.createElement('button');
  btn.id = 'audioMuteBtn';
  btn.className = 'audio-mute-btn';
  btn.setAttribute('aria-label', 'Mute/unmute suara');
  btn.textContent = getMuted() ? '🔇' : '🔊';
  document.body.appendChild(btn);
  btn.addEventListener('click', () => {
    const alreadyUnlocked = unlocked;
    ensureAudio();
    if (alreadyUnlocked) {
      // audio sudah pernah nyala sebelumnya di halaman ini -> ini toggle mute beneran
      setMuted(!getMuted());
    } else {
      // ini klik pertama di halaman ini -> cukup nyalakan sesuai preferensi tersimpan, jangan toggle
      applyMuteState();
    }
  });
}

function updateMuteButtonIcon() {
  const btn = document.getElementById('audioMuteBtn');
  if (btn) btn.textContent = getMuted() ? '🔇' : '🔊';
}

document.addEventListener('DOMContentLoaded', () => {
  injectMuteButton();
  // wajib nunggu interaksi user pertama sebelum audio bisa main (kebijakan browser)
  const unlockOnce = () => {
    ensureAudio();
    document.removeEventListener('click', unlockOnce);
    document.removeEventListener('touchstart', unlockOnce);
  };
  document.addEventListener('click', unlockOnce);
  document.addEventListener('touchstart', unlockOnce);
});
