import { fetchVr1Data } from "./pechvr1-mnemo-params.js";


// Запускаем функцию при загрузке страницы и затем каждые 10 секунд
fetchVr1Data();
setInterval(fetchVr1Data, 10000);

const modeTitle = document.querySelector('.current-param__subtitle-span');
const temper3Skolz = document.querySelector('.temper-3-skolz');
const temper3SkolzSpan = document.querySelector('.temper-3-skolz-span');
const temper1Skolz = document.querySelector('.temper-1-skolz');
const sirenVR1mnemo = document.querySelector('.siren__media-vr1-mnemo');
const sirenVR2mnemo = document.querySelector('.siren__media-vr2-mnemo');
const sirenAnimation = document.querySelector('.light-alarm__content');

// условия по параметрам
const animationRun = (param) => {
  param.style.animationPlayState = 'running';
  // if (sirenVR1mnemo) {
  //   if (modeTitle.innerHTML == 'Установившийся режим') {
  //     sirenVR1mnemo.play();
  //   } else {
  //     sirenVR1mnemo.pause();
  //   }
  // }
  // if (sirenVR2mnemo) {
  //   if (modeTitle.innerHTML == 'Установившийся режим') {
  //     sirenVR2mnemo.play();
  //   } else {
  //     sirenVR2mnemo.pause();
  //   }
  // }
};

const animationPaused = (param) => {
  param.style.animationPlayState = 'paused';
};

//табличка с параметрами которые не соответствуют тoifребованиям
const tableTbody = document.querySelector('.table__tbody-params');

const addRowIfRunning = (param, description, modalId) => {
  if (param.style.animationPlayState === 'running') {
    const row = document.createElement('tr');
    row.classList.add('table__tr');
    row.innerHTML = `
      <td class="table__td table__left ">${description}</td>
      <td class="table__td table__right">${param.innerHTML}</td>
      <td class="table__td table__tr--incorrect-param">
        <button class="table__td-btn btn-reset" data-modal-target="${modalId}">Подробнее</button>
      </td>
    `;
    // Добавляем строку в таблицу
    tableTbody.appendChild(row);

    sirenAnimation.classList.remove('siren-off');
  }
};

//mode
if (temper1Skolz.innerHTML < 550 && temper1Skolz.innerHTML > 50) {
  modeTitle.innerHTML = 'Выход на режим';

  if (temper3Skolz.innerHTML > 750) {
    temper3Skolz.style.animationPlayState = 'running';
    temper3SkolzSpan.style.animationPlayState = 'running';
  } else {
    temper3Skolz.style.animationPlayState = 'paused';
    temper3SkolzSpan.style.animationPlayState = 'paused';
  }

  addRowIfRunning(temper3Skolz, 'На 3-ей скользящей, °C', 'temper-3-skolz-modal');
} else if (temper1Skolz.innerHTML > 550) {
  modeTitle.innerHTML = 'Установившийся режим';
  if (temper3Skolz.innerHTML > 400) {
    animationRun(temper3Skolz);
    animationRun(temper3SkolzSpan);
  } else {
    animationPaused(temper3Skolz);
    animationPaused(temper3SkolzSpan);
  }
  addRowIfRunning(temper3Skolz, 'На 3-ей скользящей, °C', 'temper-3-skolz-modal');
} else {
  modeTitle.innerHTML = 'Печь не работает';
}
//------------------------------------------------------------------

if (temper1Skolz.innerHTML > 50) {
  const temper1SkolzSpan = document.querySelector('.temper-1-skolz-span');

  if (temper1Skolz.innerHTML > 800 || temper1Skolz.innerHTML < 550) {
    animationRun(temper1Skolz);
    animationRun(temper1SkolzSpan);
  } else {
    animationPaused(temper1Skolz);
    animationPaused(temper1SkolzSpan);
  }

  addRowIfRunning(temper1Skolz, 'На 1-ой скользящей, °C', 'temper-1-skolz-modal');

  const nizZagrKam = document.querySelector('.razr-niz-zagr-kam');
  const nizZagrKamSpan = document.querySelector('.razr-niz-zagr-kam-span');
  let nizZagrKamChanged = nizZagrKam.innerHTML.replace(',', '.');
  let nizZagrKamResult = Number(nizZagrKamChanged);

  if (nizZagrKamResult > -1 || nizZagrKamResult < -5) {
    nizZagrKam.style.animationPlayState = 'running';
    nizZagrKamSpan.style.animationPlayState = 'running';
  } else {
    nizZagrKam.style.animationPlayState = 'paused';
    nizZagrKamSpan.style.animationPlayState = 'paused';
  }

  addRowIfRunning(nizZagrKam, 'Низ загрузочной камеры, кгс/м2', 'razr-niz-zagr-kam-modal');

  const temperVnizKamerZagruz = document.querySelector('.temper-vniz-kamer-zagruz');
  const temperVnizKamerZagruzSpan = document.querySelector('.temper-vniz-kamer-zagruz-span');

  if (temperVnizKamerZagruz.innerHTML > 1100 || temperVnizKamerZagruz.innerHTML < 1000) {
    animationRun(temperVnizKamerZagruz);
    animationRun(temperVnizKamerZagruzSpan);
  } else {
    animationPaused(temperVnizKamerZagruz);
    animationPaused(temperVnizKamerZagruzSpan);
  }

  if (temperVnizKamerZagruz.innerHTML > 1100) {
    addRowIfRunning(temperVnizKamerZagruz, 'Внизу камеры загрузки, °C', 'temper-vniz-kamer-zagruz-high-modal');
  } else {
    addRowIfRunning(temperVnizKamerZagruz, 'Внизу камеры загрузки, °C', 'temper-vniz-kamer-zagruz-low-modal');
  }

  const temperVerhKamerZagruz = document.querySelector('.temper-verh-kamer-zagruz');
  const temperVerhKamerZagruzSpan = document.querySelector('.temper-verh-kamer-zagruz-span');

  if (temperVerhKamerZagruz.innerHTML > 1000) {
    animationRun(temperVerhKamerZagruz);
    animationRun(temperVerhKamerZagruzSpan);
  } else {
    animationPaused(temperVerhKamerZagruz);
    animationPaused(temperVerhKamerZagruzSpan);
  }

  addRowIfRunning(temperVerhKamerZagruz, 'Вверху камеры загрузки, °C', 'temper-verh-kamer-zagruz-modal');

  const temperVhodPechDozhig = document.querySelector('.temper-vhod-pech-dozhig');
  const temperVhodPechDozhigSpan = document.querySelector('.temper-vhod-pech-dozhig-span');

  if (temperVhodPechDozhig.innerHTML > 1200) {
    animationRun(temperVhodPechDozhig);
    animationRun(temperVhodPechDozhigSpan);
  } else {
    animationPaused(temperVhodPechDozhig);
    animationPaused(temperVhodPechDozhigSpan);
  }

  addRowIfRunning(temperVhodPechDozhig, 'На входе печи дожига, °C', 'temper-vhod-pech-dozhig-modal');

  const temper2Skolz = document.querySelector('.temper-2-skolz');
  const temper2SkolzSpan = document.querySelector('.temper-2-skolz-span');

  if (temper2Skolz.innerHTML > 700) {
    animationRun(temper2Skolz);
    animationRun(temper2SkolzSpan);
  } else {
    animationPaused(temper2Skolz);
    animationPaused(temper2SkolzSpan);
  }

  addRowIfRunning(temper2Skolz, 'На 2-ой скользящей, °C', 'temper-2-skolz-modal');

  const temperGranulHolod = document.querySelector('.temper-granul-holod');
  const temperGranulHolodSpan = document.querySelector('.temper-granul-holod-span');

  if (temperGranulHolod.innerHTML > 70) {
    animationRun(temperGranulHolod);
    animationRun(temperGranulHolodSpan);
  } else {
    animationPaused(temperGranulHolod);
    animationPaused(temperGranulHolodSpan);
  }

  addRowIfRunning(temperGranulHolod, 'Гранул после холод-ка, °C', 'temper-posle-holod-modal');

  const davlGazPosleSkruber = document.querySelector('.davl-gaz-posle-skruber');
  const davlGazPosleSkruberSpan = document.querySelector('.davl-gaz-posle-skruber-span');
  let davlGazPosleSkruberChanged = davlGazPosleSkruber.innerHTML.replace(',', '.');
  let davlGazPosleSkruberResult = Number(davlGazPosleSkruberChanged);

  if (davlGazPosleSkruberResult > 20) {
    davlGazPosleSkruber.style.animationPlayState = 'running';
    davlGazPosleSkruberSpan.style.animationPlayState = 'running';
  } else {
    davlGazPosleSkruber.style.animationPlayState = 'paused';
    davlGazPosleSkruberSpan.style.animationPlayState = 'paused';
  }

  addRowIfRunning(davlGazPosleSkruber, 'Давление газов после скруббера, кгс/м2', 'davl-gazov-posle-skrubber-modal');

  const temperTopka = document.querySelector('.temper-topka');
  const temperTopkaSpan = document.querySelector('.temper-topka-span');

  if (temperTopka.innerHTML > 1000) {
    animationRun(temperTopka);
    animationRun(temperTopkaSpan);
  } else {
    animationPaused(temperTopka);
    animationPaused(temperTopkaSpan);
  }

  addRowIfRunning(temperTopka, 'В топке, °C', 'temper-v-topke-modal');

  const davlTopka = document.querySelector('.davl-topka');
  const davlTopkaSpan = document.querySelector('.davl-topka-span');
  let davlTopkaChanged = davlTopka.innerHTML.replace(',', '.');
  let davlTopkaResult = Number(davlTopkaChanged);

  if (davlTopkaResult > -1 || davlTopkaResult < -4) {
    davlTopka.style.animationPlayState = 'running';
    davlTopkaSpan.style.animationPlayState = 'running';
  } else {
    davlTopka.style.animationPlayState = 'paused';
    davlTopkaSpan.style.animationPlayState = 'paused';
  }

  addRowIfRunning(davlTopka, 'В топке печи, кгс/м2', 'razrezh-v-topke-modal');

  const temperDoSkruber = document.querySelector('.temper-do-skruber');
  const temperDoSkruberSpan = document.querySelector('.temper-do-skruber-span');

  if (temperDoSkruber.innerHTML > 400) {
    animationRun(temperDoSkruber);
    animationRun(temperDoSkruberSpan);
  } else {
    animationPaused(temperDoSkruber);
    animationPaused(temperDoSkruberSpan);
  }

  addRowIfRunning(temperDoSkruber, 'Температура газов до скруббера, °C', 'temper-gazov-do-skrubber-modal');

  const temperPosleSkruber = document.querySelector('.temper-posle-skruber');
  const temperPosleSkruberSpan = document.querySelector('.temper-posle-skruber-span');

  if (temperPosleSkruber.innerHTML > 100) {
    animationRun(temperPosleSkruber);
    animationRun(temperPosleSkruberSpan);
  } else {
    animationPaused(temperPosleSkruber);
    animationPaused(temperPosleSkruberSpan);
  }

  addRowIfRunning(temperPosleSkruber, 'Температура газов после скруббера, °C', 'temper-gazov-posle-skrubber-modal');

  const temperVihodPechDozhig = document.querySelector('.temper-vihod-pech-dozhig');
  const temperVihodPechDozhigSpan = document.querySelector('.temper-vihod-pech-dozhig-span');

  if (temperVihodPechDozhig.innerHTML > 1200) {
    animationRun(temperVihodPechDozhig);
    animationRun(temperVihodPechDozhigSpan);
  } else {
    animationPaused(temperVihodPechDozhig);
    animationPaused(temperVihodPechDozhigSpan);
  }

  addRowIfRunning(temperVihodPechDozhig, 'На выходе печи дожига, °C', 'temper-vyhod-pech-dozhig-modal');

  const temperGazovKotelUtiliz = document.querySelector('.temper-gazov-kotel-utiliz');
  const temperGazovKotelUtilizSpan = document.querySelector('.temper-gazov-kotel-utiliz-span');

  if (temperGazovKotelUtiliz.innerHTML > 1100) {
    animationRun(temperGazovKotelUtiliz);
    animationRun(temperGazovKotelUtilizSpan);
  } else {
    animationPaused(temperGazovKotelUtiliz);
    animationPaused(temperGazovKotelUtilizSpan);
  }

  addRowIfRunning(
    temperGazovKotelUtiliz,
    'Температура дымовых газов котла-утилизат., °C',
    'temper-gazov-kotel-utiliz-modal'
  );

  const razrKotelUtiliz = document.querySelector('.razr-kotel-utiliz');
  const razrKotelUtilizSpan = document.querySelector('.razr-kotel-utiliz-span');
  let razrKotelUtilizChanged = razrKotelUtiliz.innerHTML.replace(',', '.');
  let razrKotelUtilizResult = Number(razrKotelUtilizChanged);

  if (razrKotelUtilizResult > -3 || razrKotelUtilizResult < -12) {
    razrKotelUtiliz.style.animationPlayState = 'running';
    razrKotelUtilizSpan.style.animationPlayState = 'running';
  } else {
    razrKotelUtiliz.style.animationPlayState = 'paused';
    razrKotelUtilizSpan.style.animationPlayState = 'paused';
  }

  addRowIfRunning(razrKotelUtiliz, 'Разрежение в пространстве котла, кгс/м2');

  const temperVodyVannaSkruber = document.querySelector('.temper-vody-vanna-skruber');
  const temperVodyVannaSkruberSpan = document.querySelector('.temper-vody-vanna-skruber-span');

  if (temperVodyVannaSkruber.innerHTML > 90) {
    animationRun(temperVodyVannaSkruber);
    animationRun(temperVodyVannaSkruberSpan);
  } else {
    animationPaused(temperVodyVannaSkruber);
    animationPaused(temperVodyVannaSkruberSpan);
  }

  addRowIfRunning(
    temperVodyVannaSkruber,
    'Температура воды в ванне скруббера, °C',
    'temper-vody-v-vanne-skrubber-modal'
  );

  const temperKamerVygruz = document.querySelector('.temper-kamer-vygruz');
  const temperKamerVygruzSpan = document.querySelector('.temper-kamer-vygruz-span');

  if (temperKamerVygruz.innerHTML > 750) {
    animationRun(temperKamerVygruz);
    animationRun(temperKamerVygruzSpan);
  } else {
    animationPaused(temperKamerVygruz);
    animationPaused(temperKamerVygruzSpan);
  }

  addRowIfRunning(temperKamerVygruz, 'Температура камеры выгрузки, °C', 'temper-kamer-vygruz-modal');

  const urovenBarabanKotla = document.querySelector('.uroven-v-barabane-kotla-mnemo-val');
  const urovenBarabanKotlaSpan = document.querySelector('.uroven-v-barabane-kotla-mnemo-val-span');

  if (urovenBarabanKotla.innerHTML <= -70 || urovenBarabanKotla.innerHTML >= 70) {
    animationRun(urovenBarabanKotla);
    animationRun(urovenBarabanKotlaSpan);
  } else {
    animationPaused(urovenBarabanKotla);
    animationPaused(urovenBarabanKotlaSpan);
  }

  addRowIfRunning(urovenBarabanKotla, 'Уровень в барабане котла, мм', 'uroven-v-kotle-modal');

  const urovenVannaSkrubber = document.querySelector('.uroven-vanne-skrubber-value');
  const urovenVannaSkrubberSpan = document.querySelector('.uroven-vanne-skrubber-value-span');

  if (urovenVannaSkrubber.innerHTML <= 250) {
    animationRun(urovenVannaSkrubber);
    animationRun(urovenVannaSkrubberSpan);
  } else {
    animationPaused(urovenVannaSkrubber);
    animationPaused(urovenVannaSkrubberSpan);
  }

  addRowIfRunning(urovenVannaSkrubber, 'Уровень в ванне скруббера, мм', 'uroven-vanne-skrubber-modal');

  const urovenVodyHvo = document.querySelector('.uroven-vody-hvo-value');
  const urovenVodyHvoSpan = document.querySelector('.uroven-vody-hvo-value-span');

  if (urovenVodyHvo.innerHTML <= 1500) {
    animationRun(urovenVodyHvo);
    animationRun(urovenVodyHvoSpan);
  } else {
    animationPaused(urovenVodyHvo);
    animationPaused(urovenVodyHvoSpan);
  }

  addRowIfRunning(urovenVodyHvo, 'Уровень воды в емкости ХВО, мм', 'uroven-vody-vho-modal');
}

const trs = tableTbody.querySelectorAll('tr');
if (trs.length == 0) {
  const noDataRow = `
  <tr class="table__tr">
    <td class="table__td table__left table__td--descr" colspan="3">Тут будут отображаться параметры
        которые превышают допустимые значения</td>
  </tr>
  `;
  tableTbody.innerHTML = noDataRow;
  sirenAnimation.classList.add('siren-off');
}
