export const updateVentilator = (data) => {
  const picGif2 = document.querySelector('.mnemo__gif-2 img');
  const ventilatorGif3 = document.querySelector('.mnemo__gif-3 img');
  const ventilatorGif4 = document.querySelector('.mnemo__gif-4 img');

  const ventilator = data.temperatures && data.temperatures['Температура уходящих газов'];

  if (ventilator !== undefined) {
    const animationState = ventilator > 30 ? 'running' : 'paused';

    if (ventilatorGif3) {
      ventilatorGif3.style.animationPlayState = animationState;
    }
    if (ventilatorGif4) {
      ventilatorGif4.style.animationPlayState = animationState;
    }
    if (picGif2) {
      picGif2.style.display = ventilator > 30 ? 'block' : 'none';
    }
  }
};

export const updatePics = (data) => {
  const picGif1 = document.querySelector('.mnemo__gif-1 img');
  const picGif5 = document.querySelector('.mnemo__gif-5 img');
  const picGif6 = document.querySelector('.mnemo__gif-6 img');
  const picGif7 = document.querySelector('.mnemo__gif-7 img');
  const picGif8 = document.querySelector('.mnemo__gif-8 img');

  const picAnimate = data.gorelka?.['Мощность горелки №1'] ?? data.gorelka?.['Мощность горелки №2'];

  if (picAnimate !== undefined) {
    const displayState = picAnimate > 5 ? 'block' : 'none';
    picGif1.style.display = displayState;

    picGif5.style.display = displayState;
    picGif6.style.display = displayState;
    picGif7.style.display = displayState;
    picGif8.style.display = displayState;
  }
};