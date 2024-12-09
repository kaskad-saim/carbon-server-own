export const updateTemperatures = (data) => {
  const temperature1Sk = data.temperatures && data.temperatures['1-СК'];
  const temperature2Sk = data.temperatures && data.temperatures['2-СК'];
  const temperature3Sk = data.temperatures && data.temperatures['3-СК'];
  const temperVhodPechDozhig = data.temperatures && data.temperatures['На входе печи дожига'];
  const temperVnizKamerZagruz = data.temperatures && data.temperatures['Внизу камеры загрузки'];
  const temperVerhKamerZagruz = data.temperatures && data.temperatures['Вверху камеры загрузки'];
  const temperVihodPechDozhig = data.temperatures && data.temperatures['На выходе печи дожига'];
  const temperGazovKotelUtiliz = data.temperatures && data.temperatures['Дымовых газов котла'];
  const temperGranulHolod = data.temperatures && data.temperatures['Гранул после холод-ка'];
  const temperPosleSkruber = data.temperatures && data.temperatures['Газов после скруббера'];
  const temperVodyVannaSkruber = data.temperatures && data.temperatures['Воды в ванне скруббера'];
  const temperKamerVygruz = data.temperatures && data.temperatures['Камеры выгрузки'];
  const temperTopka = data.temperatures && data.temperatures['В топке'];
  const temperDoSkruber = data.temperatures && data.temperatures['Газов до скруббера'];

  if (temperature1Sk !== undefined) document.querySelector('.temper-1-skolz').innerText = temperature1Sk;
  if (temperature2Sk !== undefined) document.querySelector('.temper-2-skolz').innerText = temperature2Sk;
  if (temperature3Sk !== undefined) document.querySelector('.temper-3-skolz').innerText = temperature3Sk;
  if (temperVhodPechDozhig !== undefined)
    document.querySelector('.temper-vhod-pech-dozhig').innerText = temperVhodPechDozhig;
  if (temperVnizKamerZagruz !== undefined)
    document.querySelector('.temper-vniz-kamer-zagruz').innerText = temperVnizKamerZagruz;
  if (temperVerhKamerZagruz !== undefined)
    document.querySelector('.temper-verh-kamer-zagruz').innerText = temperVerhKamerZagruz;
  if (temperVihodPechDozhig !== undefined)
    document.querySelector('.temper-vihod-pech-dozhig').innerText = temperVihodPechDozhig;
  if (temperGazovKotelUtiliz !== undefined)
    document.querySelector('.temper-gazov-kotel-utiliz').innerText = temperGazovKotelUtiliz;
  if (temperGranulHolod !== undefined) document.querySelector('.temper-granul-holod').innerText = temperGranulHolod;
  if (temperPosleSkruber !== undefined) document.querySelector('.temper-posle-skruber').innerText = temperPosleSkruber;
  if (temperVodyVannaSkruber !== undefined)
    document.querySelector('.temper-vody-vanna-skruber').innerText = temperVodyVannaSkruber;
  if (temperKamerVygruz !== undefined) document.querySelector('.temper-kamer-vygruz').innerText = temperKamerVygruz;
  if (temperTopka !== undefined) document.querySelector('.temper-topka').innerText = temperTopka;
  if (temperDoSkruber !== undefined) document.querySelector('.temper-do-skruber').innerText = temperDoSkruber;
};

// Функция для обновления давления
export const updatePressures = (data) => {
  const davlGazPosleSkruber = data.pressures && data.pressures['Давление газов после скруббера'];
  const davlKotla = data.pressures && data.pressures['Пара в барабане котла'];

  if (davlGazPosleSkruber !== undefined)
    document.querySelector('.davl-gaz-posle-skruber').innerText = davlGazPosleSkruber;
  if (davlKotla !== undefined) document.querySelector('.davl-kotla').innerText = davlKotla;
};

// Функция для обновления разрежения
export const updateVacuums = (data) => {
  const razrNizZagrKam = data.vacuums && data.vacuums['Низ загрузочной камеры'];
  const razrKotelUtiliz = data.vacuums && data.vacuums['В котле утилизаторе'];
  const davlTopka = data.vacuums && data.vacuums['В топке печи'];

  if (razrNizZagrKam !== undefined) document.querySelector('.razr-niz-zagr-kam').innerText = razrNizZagrKam;
  if (razrKotelUtiliz !== undefined) document.querySelector('.razr-kotel-utiliz').innerText = razrKotelUtiliz;
  if (davlTopka !== undefined) document.querySelector('.davl-topka').innerText = davlTopka;
};

// Функция для обновления уровней
export const updateLevels = (data) => {
  const urovenVBarabaneKotla = data.levels && data.levels['В барабане котла']?.value;
  const urovenVanneSkrubber = data.levels && data.levels['В ванне скруббера']?.value;
  const urovenVodyHVO = data.levels && data.levels['В емкости ХВО']?.value;

  if (urovenVBarabaneKotla !== undefined)
    document.querySelector('.uroven-v-barabane-kotla-mnemo-val').innerText = urovenVBarabaneKotla;
  if (urovenVanneSkrubber !== undefined)
    document.querySelector('.uroven-vanne-skrubber-value').innerText = urovenVanneSkrubber;
  if (urovenVodyHVO !== undefined) document.querySelector('.uroven-vody-hvo-value').innerText = urovenVodyHVO;
};

// Функция для обновления импульсных сигналов
export const updateImpulseSignals = (data) => {
  const im5Pech1 = data.im && data.im['ИМ5 котел-утилизатор'];

  if (im5Pech1 !== undefined) document.querySelector('.im5-pech1-value').innerText = im5Pech1;
};

// Функция для обновления параметров горелки
export const updateGorelkaParams = (data) => {
  const zadanieTemperNaGorelky = data.gorelka?.['Задание температуры на горелку №1'];
  const zadanieTemperNaGorelkyVr2 = data.gorelka?.['Задание температуры на горелку №2'];
  const moshGorelky = data.gorelka?.['Мощность горелки №1'];
  const moshGorelkyVr2 = data.gorelka?.['Мощность горелки №2'];

  const zadanieTemperNaGorelkySpan = document.querySelector('.zadanie-temper-na-gorelky-span');
  const zadanieTemperNaGorelkyVr2Span = document.querySelector('.zadanie-temper-na-gorelky-vr2-span');

  if (zadanieTemperNaGorelkySpan && zadanieTemperNaGorelky !== undefined) {
    zadanieTemperNaGorelkySpan.innerText = zadanieTemperNaGorelky;
  } else if (zadanieTemperNaGorelkyVr2Span && zadanieTemperNaGorelkyVr2 !== undefined) {
    zadanieTemperNaGorelkyVr2Span.innerText = zadanieTemperNaGorelkyVr2;
  }

  // Обновляем значение для 'Мощность горелки' в зависимости от наличия элементов
  const moshGorelkySpan = document.querySelector('.mosh-gorelky-span');
  const moshGorelkyVrSpan = document.querySelector('.mosh-gorelky-vr2-span');

  if (moshGorelkySpan && moshGorelky !== undefined) {
    // Если .mosh-gorelky-span существует, обновляем его значением moshGorelky
    moshGorelkySpan.innerText = moshGorelky;
  } else if (moshGorelkyVrSpan && moshGorelkyVr2 !== undefined) {
    // Если .mosh-gorelky-span отсутствует, но есть .mosh-gorelky-vr-span, обновляем его значением moshGorelkyVr2
    moshGorelkyVrSpan.innerText = moshGorelkyVr2;
  }
};

// Функция для обновления нотиса1
export const updateNotis1 = (data) => {
  const elements = {
    // 'doza-grams-notis1': data?.data?.['Доза (г) НОТИС1'] || '-',
    // 'doza-count-notis1': data?.data?.['Текущее количество доз (шт) НОТИС1'] || '-',
    'doza-grams-per-minute-notis1': data?.data?.['Доза (г/мин) НОТИС1'] ?? '-',
    'doza-kgs-per-hour-notis1': data?.data?.['Доза (кг/ч) НОТИС1'] ?? '-',
  };

  // Обновляем значения в DOM
  for (const [selector, value] of Object.entries(elements)) {
    const element = document.querySelector(`.${selector}`);
    if (element) {
      element.textContent = value;
    }
  }
};

// Функция для обновления нотиса1
export const updateNotis2 = (data) => {
  const elements = {
    // 'doza-grams-notis2': data?.data?.['Доза (г) НОТИС2'] || '-',
    // 'doza-count-notis2': data?.data?.['Текущее количество доз (шт) НОТИС2'] || '-',
    'doza-grams-per-minute-notis2': data?.data?.['Доза (г/мин) НОТИС2'] ?? '-',
    'doza-kgs-per-hour-notis2': data?.data?.['Доза (кг/ч) НОТИС2'] ?? '-',
  };

  // Обновляем значения в DOM
  for (const [selector, value] of Object.entries(elements)) {
    const element = document.querySelector(`.${selector}`);
    if (element) {
      element.textContent = value;
    }
  }
};

// Определите функцию для обновления статуса Notis
export const updateNotisStatus = (status) => {
  const notisStatusElement = document.querySelector('.current-param__subtitle-notis-span');
  if (notisStatusElement) {
    if (status === 'idle') {
      notisStatusElement.textContent = 'Загрузки нет';
    } else if (status === 'working') {
      notisStatusElement.textContent = 'Идет загрузка';
    } else {
      notisStatusElement.textContent = 'Нет данных'; // Очистить или установить значение по умолчанию
    }
  }
};