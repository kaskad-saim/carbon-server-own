export const updateVentilator = (data) => {
  const picGif2 = document.querySelector('.mnemo__gif-2 img');

  const ventilator = data.pressures && data?.pressures?.['Давление воздух правый МПА2'];

  // console.log(ventilator);


  if (ventilator !== undefined) {
    const animationState = ventilator > 10 ? 'running' : 'paused';
    if (picGif2) {
      picGif2.style.animationPlayState = animationState;
    }
  }
};