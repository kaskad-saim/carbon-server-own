import {
  updateTemperatures,
  updatePressures,
  updateVacuums,
  updateLevels,
  updateGorelkaParams,
  updateImpulseSignals,
  updateNotis2,
  updateNotisStatus
} from './components/updateParams.js';

// Определите функцию updateAnimations
const updateAnimations = () => {
  // Выберите необходимые DOM-элементы
  const modeTitle = document.querySelector('.current-param__subtitle-span');
  const temper3Skolz = document.querySelector('.temper-3-skolz');
  const temper1Skolz = document.querySelector('.temper-1-skolz');
  const sirenVR1param = document.querySelector('.siren__media-vr1-param');
  const sirenVR2param = document.querySelector('.siren__media-vr2-param');

  // Определите вспомогательные функции для анимаций
  const animationRun = (param) => {
    param.style.animationPlayState = 'running';
    if (sirenVR1param) {
      if (modeTitle.innerHTML.trim() === 'Установившийся режим') {
        sirenVR1param.play();
      } else {
        sirenVR1param.pause();
      }
    }
    if (sirenVR2param) {
      if (modeTitle.innerHTML.trim() === 'Установившийся режим') {
        sirenVR2param.play();
      } else {
        sirenVR2param.pause();
      }
    }
  };

  const animationPaused = (param) => {
    param.style.animationPlayState = 'paused';
  };

  // Обновите режим на основе значения temper1Skolz
  const temper1Value = Number(temper1Skolz.innerHTML);
  if (temper1Value < 550 && temper1Value > 50) {
    modeTitle.innerHTML = 'Выход на режим';
    if (Number(temper3Skolz.innerHTML) > 750) {
      temper3Skolz.style.animationPlayState = 'running';
    } else {
      temper3Skolz.style.animationPlayState = 'paused';
    }
  } else if (temper1Value > 550) {
    modeTitle.innerHTML = 'Установившийся режим';
    if (Number(temper3Skolz.innerHTML) > 400) {
      animationRun(temper3Skolz);
    } else {
      animationPaused(temper3Skolz);
    }
  } else {
    modeTitle.innerHTML = 'Печь не работает';
  }

  //------------------------------------------------------------------

  if (temper1Value > 50) {
    if (temper1Value > 800 || temper1Value < 550) {
      animationRun(temper1Skolz);
    } else {
      animationPaused(temper1Skolz);
    }

    // Температуры
    const temperTopka = document.querySelector('.temper-topka');
    Number(temperTopka.innerHTML) > 1000 ? animationRun(temperTopka) : animationPaused(temperTopka);

    const temper2Skolz = document.querySelector('.temper-2-skolz');
    Number(temper2Skolz.innerHTML) > 700 ? animationRun(temper2Skolz) : animationPaused(temper2Skolz);

    const temperVnizKamerZagruz = document.querySelector('.temper-vniz-kamer-zagruz');
    const temperVnizValue = Number(temperVnizKamerZagruz.innerHTML);
    if (temperVnizValue > 1100 || temperVnizValue < 1000) {
      animationRun(temperVnizKamerZagruz);
    } else {
      animationPaused(temperVnizKamerZagruz);
    }

    const temperVerhKamerZagruz = document.querySelector('.temper-verh-kamer-zagruz');
    Number(temperVerhKamerZagruz.innerHTML) > 1000
      ? animationRun(temperVerhKamerZagruz)
      : animationPaused(temperVerhKamerZagruz);

    const temperGranulHolod = document.querySelector('.temper-granul-holod');
    Number(temperGranulHolod.innerHTML) > 70 ? animationRun(temperGranulHolod) : animationPaused(temperGranulHolod);

    const temperVhodPechDozhig = document.querySelector('.temper-vhod-pech-dozhig');
    Number(temperVhodPechDozhig.innerHTML) > 1200
      ? animationRun(temperVhodPechDozhig)
      : animationPaused(temperVhodPechDozhig);

    const temperVihodPechDozhig = document.querySelector('.temper-vihod-pech-dozhig');
    Number(temperVihodPechDozhig.innerHTML) > 1200
      ? animationRun(temperVihodPechDozhig)
      : animationPaused(temperVihodPechDozhig);

    // Давление и другие параметры
    const davlTopka = document.querySelector('.davl-topka');
    const davlTopkaResult = Number(davlTopka.innerHTML.replace(',', '.'));
    if (davlTopkaResult > -1 || davlTopkaResult < -4) {
      davlTopka.style.animationPlayState = 'running';
    } else {
      davlTopka.style.animationPlayState = 'paused';
    }

    const nizZagrKam = document.querySelector('.razr-niz-zagr-kam');
    const nizZagrKamResult = Number(nizZagrKam.innerHTML.replace(',', '.'));
    if (nizZagrKamResult > -1 || nizZagrKamResult < -5) {
      nizZagrKam.style.animationPlayState = 'running';
    } else {
      nizZagrKam.style.animationPlayState = 'paused';
    }

    const temperDoSkruber = document.querySelector('.temper-do-skruber');
    Number(temperDoSkruber.innerHTML) > 400 ? animationRun(temperDoSkruber) : animationPaused(temperDoSkruber);

    const temperPosleSkruber = document.querySelector('.temper-posle-skruber');
    Number(temperPosleSkruber.innerHTML) > 100 ? animationRun(temperPosleSkruber) : animationPaused(temperPosleSkruber);

    const temperVodyVannaSkruber = document.querySelector('.temper-vody-vanna-skruber');
    Number(temperVodyVannaSkruber.innerHTML) > 90
      ? animationRun(temperVodyVannaSkruber)
      : animationPaused(temperVodyVannaSkruber);

    const davlGazPosleSkruber = document.querySelector('.davl-gaz-posle-skruber');
    const davlGazPosleResult = Number(davlGazPosleSkruber.innerHTML.replace(',', '.'));
    davlGazPosleResult > 20
      ? (davlGazPosleSkruber.style.animationPlayState = 'running')
      : (davlGazPosleSkruber.style.animationPlayState = 'paused');

    const temperGazovKotelUtiliz = document.querySelector('.temper-gazov-kotel-utiliz');
    Number(temperGazovKotelUtiliz.innerHTML) > 1100
      ? animationRun(temperGazovKotelUtiliz)
      : animationPaused(temperGazovKotelUtiliz);

    const razrKotelUtiliz = document.querySelector('.razr-kotel-utiliz');
    const razrKotelUtilizResult = Number(razrKotelUtiliz.innerHTML.replace(',', '.'));
    if (razrKotelUtilizResult > -3 || razrKotelUtilizResult < -12) {
      razrKotelUtiliz.style.animationPlayState = 'running';
    } else {
      razrKotelUtiliz.style.animationPlayState = 'paused';
    }

    const temperKamerVygruz = document.querySelector('.temper-kamer-vygruz');
    Number(temperKamerVygruz.innerHTML) > 750 ? animationRun(temperKamerVygruz) : animationPaused(temperKamerVygruz);

    // Уровни
    const urovenVodyHvo = document.querySelector('.uroven-vody-hvo-value');
    Number(urovenVodyHvo.innerHTML) <= 1500 ? animationRun(urovenVodyHvo) : animationPaused(urovenVodyHvo);

    const urovenVannaSkrubber = document.querySelector('.uroven-vanne-skrubber-value');
    Number(urovenVannaSkrubber.innerHTML) <= 250
      ? animationRun(urovenVannaSkrubber)
      : animationPaused(urovenVannaSkrubber);

    const urovenBarabanKotla = document.querySelector('.uroven-v-barabane-kotla-mnemo-val');
    Number(urovenBarabanKotla.innerHTML) <= -100
      ? animationRun(urovenBarabanKotla)
      : animationPaused(urovenBarabanKotla);
  }
};

// Определите функцию для обновления даты и времени
const updateDateTime = () => {
  const dateElement = document.querySelector('.current-param__date');
  const timeElement = document.querySelector('.current-param__time');
  const now = new Date();

  const optionsDate = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

  const formattedDate = now.toLocaleDateString('ru-RU', optionsDate);
  const formattedTime = now.toLocaleTimeString('ru-RU', optionsTime);

  if (dateElement) {
    dateElement.textContent = formattedDate;
  }

  if (timeElement) {
    timeElement.textContent = formattedTime;
  }
};

export const fetchVr2Data = async () => {
  try {
    const response = await fetch('/api/vr2-data');
    const data = await response.json();

    // Вызываем функции обновления с данными
    updateTemperatures(data); // параметры температур
    updatePressures(data); // параметры давления
    updateVacuums(data); // параметры разрежения
    updateLevels(data); // параметры уровня
    updateGorelkaParams(data); // параметры горелки
    updateImpulseSignals(data);
    updateAnimations();


    // Получаем данные для Notis2
    const notis2Response = await fetch('/api/notis2-data');
    const notis2Data = await notis2Response.json();

    // Передаем полученные данные в updateNotis2
    updateNotis2(notis2Data);
    if (notis2Data && notis2Data.status) {
      updateNotisStatus(notis2Data.status);
    } else {
      console.warn('Статус Notis2 не найден в полученных данных.');
    }

  } catch (error) {
    console.error('Ошибка при получении данных VR2:', error);
  }
};

// Вызовите функцию обновления даты и времени при загрузке страницы
updateDateTime();
// Установите интервал для обновления времени каждую секунду
setInterval(updateDateTime, 1000);

// Сразу запускаем функции один раз при загрузке страницы
fetchVr2Data();
// Затем запускаем их каждые 10 секунд
setInterval(fetchVr2Data, 10000);
