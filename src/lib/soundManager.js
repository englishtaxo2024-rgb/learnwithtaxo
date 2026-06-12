const SOUND_KEY = 'taxo-sound-enabled';
const VOLUME_KEY = 'taxo-sound-volume';

const soundFiles = {
  click: '/assets/sounds/click.mp3',
  hover: '/assets/sounds/hover.mp3',
  success: '/assets/sounds/success.mp3',
  error: '/assets/sounds/error.mp3',
  whoosh: '/assets/sounds/whoosh.mp3',
  recordStart: '/assets/sounds/record-start.mp3',
  recordStop: '/assets/sounds/record-stop.mp3',
  notification: '/assets/sounds/notification.mp3'
};

let unlocked = false;
let audioContext;
const audioCache = new Map();

function storageAvailable() {
  try {
    localStorage.setItem('__taxo_test', '1');
    localStorage.removeItem('__taxo_test');
    return true;
  } catch {
    return false;
  }
}

export function isSoundEnabled() {
  if (!storageAvailable()) return false;
  return localStorage.getItem(SOUND_KEY) === 'on';
}

export function setSoundEnabled(enabled) {
  if (!storageAvailable()) return;
  localStorage.setItem(SOUND_KEY, enabled ? 'on' : 'off');
  if (enabled) unlockSound();
}

export function getSoundVolume() {
  if (!storageAvailable()) return 0.18;
  const saved = Number(localStorage.getItem(VOLUME_KEY));
  return Number.isFinite(saved) ? Math.min(Math.max(saved, 0), 0.35) : 0.18;
}

export function setSoundVolume(volume) {
  if (!storageAvailable()) return;
  localStorage.setItem(VOLUME_KEY, String(Math.min(Math.max(Number(volume) || 0.18, 0), 0.35)));
}

export function unlockSound() {
  if (unlocked) return;
  unlocked = true;
  Object.entries(soundFiles).forEach(([name, src]) => {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.volume = getSoundVolume();
    audioCache.set(name, audio);
  });
}

function playTone(name) {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const tones = {
      click: [660, 0.045],
      hover: [880, 0.035],
      success: [740, 0.11],
      error: [220, 0.09],
      whoosh: [420, 0.08],
      recordStart: [560, 0.06],
      recordStop: [330, 0.06],
      notification: [620, 0.09]
    };
    const [frequency, duration] = tones[name] || tones.click;
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gain.gain.value = getSoundVolume() * 0.35;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch {
    // Audio is an enhancement only.
  }
}

export async function playSound(name) {
  if (!isSoundEnabled()) return;
  unlockSound();
  const audio = audioCache.get(name);
  if (!audio) {
    playTone(name);
    return;
  }
  try {
    audio.currentTime = 0;
    audio.volume = getSoundVolume();
    await audio.play();
  } catch {
    playTone(name);
  }
}

export const soundNames = Object.keys(soundFiles);
