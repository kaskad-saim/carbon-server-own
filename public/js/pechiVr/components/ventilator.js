export const updateVentilator = (data) => {
  const ventilatorGif = document.querySelector('.mnemo__gif-2 img');
  const picGif3 = document.querySelectorAll('.mnemo__gif-3 img')

  const ventilator = data.vacuums && data.vacuums['В котле утилизаторе'];
  if (ventilatorGif && ventilator !== undefined) {

    ventilatorGif.style.animationPlayState = ventilator < 0 ? 'running' : 'paused';

    picGif3.forEach((img) => {
      img.style.display = ventilator < 0 ? 'block' : 'none';
    });
  }
};

export const updateFire = (data) => {
  const picGif1 = document.querySelector('.mnemo__gif-1 img');
  const gorelkaPower = data.gorelka?.['Мощность горелки №1'] ?? data.gorelka?.['Мощность горелки №2'];

  // Если найдено значение мощности и оно больше 5, устанавливаем display: block
  if (gorelkaPower !== undefined && gorelkaPower > 5) {
    picGif1.style.display = 'block';
  } else {
    picGif1.style.display = 'none';
  }
};
