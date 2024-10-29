const modeTitle = document.querySelector('.current-param__subtitle-span');
const temper3Skolz = document.querySelector('.temper-3-skolz');
const temper1Skolz = document.querySelector('.temper-1-skolz');
const sirenVR1param = document.querySelector('.siren__media-vr1-param');
const sirenVR2param = document.querySelector('.siren__media-vr2-param');

// условия по параметрам

const animationRun = (param) => {
  param.style.animationPlayState = 'running';
  if (sirenVR1param) {
    if (modeTitle.innerHTML == 'Установившийся режим') {
      sirenVR1param.play();
    } else {
      sirenVR1param.pause();
    }
  }
  if (sirenVR2param) {
    if (modeTitle.innerHTML == 'Установившийся режим') {
      sirenVR2param.play();
    } else {
      sirenVR2param.pause();
    }
  }
};

const animationPaused = (param) => {
  param.style.animationPlayState = 'paused';
};

//mode
if (temper1Skolz.innerHTML < 550 && temper1Skolz.innerHTML > 50) {
  modeTitle.innerHTML = 'Выход на режим';
  if (temper3Skolz.innerHTML > 750) {
    temper3Skolz.style.animationPlayState = 'running';
  } else {
    temper3Skolz.style.animationPlayState = 'paused';
  }
} else if (temper1Skolz.innerHTML > 550) {
  modeTitle.innerHTML = 'Установившийся режим';
  if (temper3Skolz.innerHTML > 400) {
    animationRun(temper3Skolz);
  } else {
    animationPaused(temper3Skolz);
  }
} else {
  modeTitle.innerHTML = 'Печь не работает';
}
//------------------------------------------------------------------

if (temper1Skolz.innerHTML > 50) {
  if (temper1Skolz.innerHTML > 800 || temper1Skolz.innerHTML < 550) {
    animationRun(temper1Skolz);
  } else {
    animationPaused(temper1Skolz);
  }

  const temperTopka = document.querySelector('.temper-topka');
  if (temperTopka.innerHTML > 1000) {
    animationRun(temperTopka);
  } else {
    animationPaused(temperTopka);
  }

  const temper2Skolz = document.querySelector('.temper-2-skolz');

  if (temper2Skolz.innerHTML > 700) {
    animationRun(temper2Skolz);
  } else {
    animationPaused(temper2Skolz);
  }

  const temperVnizKamerZagruz = document.querySelector('.temper-vniz-kamer-zagruz');

  if (temperVnizKamerZagruz.innerHTML > 1100 || temperVnizKamerZagruz.innerHTML < 1000) {
    animationRun(temperVnizKamerZagruz);
  } else {
    animationPaused(temperVnizKamerZagruz);
  }

  const temperVerhKamerZagruz = document.querySelector('.temper-verh-kamer-zagruz');

  if (temperVerhKamerZagruz.innerHTML > 1000) {
    animationRun(temperVerhKamerZagruz);
  } else {
    animationPaused(temperVerhKamerZagruz);
  }

  const temperGranulHolod = document.querySelector('.temper-granul-holod');

  if (temperGranulHolod.innerHTML > 70) {
    animationRun(temperGranulHolod);
  } else {
    animationPaused(temperGranulHolod);
  }

  const temperVhodPechDozhig = document.querySelector('.temper-vhod-pech-dozhig');

  if (temperVhodPechDozhig.innerHTML > 1200) {
    animationRun(temperVhodPechDozhig);
  } else {
    animationPaused(temperVhodPechDozhig);
  }

  const temperVihodPechDozhig = document.querySelector('.temper-vihod-pech-dozhig');

  if (temperVihodPechDozhig.innerHTML > 1200) {
    animationRun(temperVihodPechDozhig);
  } else {
    animationPaused(temperVihodPechDozhig);
  }

  const davlTopka = document.querySelector('.davl-topka');
  let davlTopkaChanged = davlTopka.innerHTML.replace(',', '.');
  let davlTopkaResult = Number(davlTopkaChanged);

  if (davlTopkaResult > -1 || davlTopkaResult < -4) {
    davlTopka.style.animationPlayState = 'running';
  } else {
    davlTopka.style.animationPlayState = 'paused';
  }

  const nizZagrKam = document.querySelector('.razr-niz-zagr-kam');
  let nizZagrKamChanged = nizZagrKam.innerHTML.replace(',', '.');
  let nizZagrKamResult = Number(nizZagrKamChanged);

  if (nizZagrKamResult > -1 || nizZagrKamResult < -5) {
    nizZagrKam.style.animationPlayState = 'running';
  } else {
    nizZagrKam.style.animationPlayState = 'paused';
  }

  const temperDoSkruber = document.querySelector('.temper-do-skruber');

  if (temperDoSkruber.innerHTML > 400) {
    animationRun(temperDoSkruber);
  } else {
    animationPaused(temperDoSkruber);
  }

  const temperPosleSkruber = document.querySelector('.temper-posle-skruber');

  if (temperPosleSkruber.innerHTML > 100) {
    animationRun(temperPosleSkruber);
  } else {
    animationPaused(temperPosleSkruber);
  }

  const temperVodyVannaSkruber = document.querySelector('.temper-vody-vanna-skruber');

  if (temperVodyVannaSkruber.innerHTML > 90) {
    animationRun(temperVodyVannaSkruber);
  } else {
    animationPaused(temperVodyVannaSkruber);
  }

  const davlGazPosleSkruber = document.querySelector('.davl-gaz-posle-skruber');
  let davlGazPosleSkruberChanged = davlGazPosleSkruber.innerHTML.replace(',', '.');
  let davlGazPosleSkruberResult = Number(davlGazPosleSkruberChanged);

  if (davlGazPosleSkruberResult > 20) {
    davlGazPosleSkruber.style.animationPlayState = 'running';
  } else {
    davlGazPosleSkruber.style.animationPlayState = 'paused';
  }

  const temperGazovKotelUtiliz = document.querySelector('.temper-gazov-kotel-utiliz');

  if (temperGazovKotelUtiliz.innerHTML > 1100) {
    animationRun(temperGazovKotelUtiliz);
  } else {
    animationPaused(temperGazovKotelUtiliz);
  }

  const razrKotelUtiliz = document.querySelector('.razr-kotel-utiliz');
  let razrKotelUtilizChanged = razrKotelUtiliz.innerHTML.replace(',', '.');
  let razrKotelUtilizResult = Number(razrKotelUtilizChanged);

  if (razrKotelUtilizResult > -3 || razrKotelUtilizResult < -12) {
    razrKotelUtiliz.style.animationPlayState = 'running';
  } else {
    razrKotelUtiliz.style.animationPlayState = 'paused';
  }

  const temperKamerVygruz = document.querySelector('.temper-kamer-vygruz');

  if (temperKamerVygruz.innerHTML > 750) {
    animationRun(temperKamerVygruz);
  } else {
    animationPaused(temperKamerVygruz);
  }

  const urovenVodyHvo = document.querySelector('.uroven-vody-hvo-value');

  if (urovenVodyHvo.innerHTML <= 1500) {
    animationRun(urovenVodyHvo);
  } else {
    animationPaused(urovenVodyHvo);
  }

  const urovenVannaSkrubber = document.querySelector('.uroven-vanne-skrubber-value');

  if (urovenVannaSkrubber.innerHTML <= 250) {
    animationRun(urovenVannaSkrubber);
  } else {
    animationPaused(urovenVannaSkrubber);
  }

  const urovenBarabanKotla = document.querySelector('.uroven-v-barabane-kotla-mnemo-val');

  if (urovenBarabanKotla.innerHTML <= -100) {
    animationRun(urovenBarabanKotla);
  } else {
    animationPaused(urovenBarabanKotla);
  }
}
