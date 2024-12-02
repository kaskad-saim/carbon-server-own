export const updateVentilator = (data) => {
  const picGif2 = document.querySelector('.mnemo__gif-2 img');

  // Сначала проверяем значение МПА2, если его нет, используем МПА3
  const ventilator =
    (data.pressures && data?.pressures?.['Давление воздух правый МПА2']) ||
    (data.pressures && data?.pressures?.['Давление воздух правый МПА3']);

  if (ventilator !== undefined) {
    // Устанавливаем состояние анимации в зависимости от значения
    const animationState = ventilator > 10 ? 'running' : 'paused';
    if (picGif2) {
      picGif2.style.animationPlayState = animationState;
    }
  }
};
