export function playUiSound(type = 'success') {
  if (localStorage.getItem('taxo-sound') === 'off') return;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = type === 'error' ? 180 : 520;
  gain.gain.value = 0.035;
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
}
