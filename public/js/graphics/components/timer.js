const INACTIVITY_LIMIT = 30 * 1000; // 30 секунд

export function setupInactivityTimer(callback) {
  let inactivityTimer;

  const resetTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(callback, INACTIVITY_LIMIT);
  };

  window.addEventListener('keydown', resetTimer);
  window.addEventListener('click', resetTimer);

  resetTimer(); // Инициализация таймера
}
