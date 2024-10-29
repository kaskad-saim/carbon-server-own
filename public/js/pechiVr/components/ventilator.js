export const updateVentilator = (data) => {
  const ventilatorGif = document.querySelector('.mnemo__gif-2 img');

  const ventilator = data.vacuums && data.vacuums['В котле утилизаторе'];
  if (ventilatorGif && ventilator !== undefined) {
    // Задаём изображение в зависимости от состояния
    if (ventilator < 0) {
      ventilatorGif.style.animationPlayState = 'running';
    } else {
      ventilatorGif.style.animationPlayState = 'paused';
    }
  }
};
