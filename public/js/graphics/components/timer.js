const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 минут

export function setupInactivityTimer(callback) {
  let inactivityTimer;

  const resetTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(callback, INACTIVITY_LIMIT);
  };

  // Сброс таймера при любых действиях пользователя
  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keydown', resetTimer);
  window.addEventListener('click', resetTimer);

  resetTimer(); // Инициализация таймера
}
