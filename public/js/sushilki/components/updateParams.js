// Функция для обновления температур
export const updateSushilka1Temperatures = (data) => {
  const temperTopka = data.temperatures && data.temperatures['Температура в топке'];
  const temperKameraSmesheniya = data.temperatures && data.temperatures['Температура в камере смешения'];
  const temperUhodGazy = data.temperatures && data.temperatures['Температура уходящих газов'];

  if (temperTopka !== undefined) document.querySelector('.topka-temper-param').innerText = temperTopka;
  if (temperKameraSmesheniya !== undefined)
    document.querySelector('.temper-kamera-smeshenia-param').innerText = temperKameraSmesheniya;
  if (temperUhodGazy !== undefined) document.querySelector('.temper-uhodyashih-gazov-param').innerText = temperUhodGazy;
};

export const updateSushilka2Temperatures = (data) => {
  const temperTopka = data.temperatures && data.temperatures['Температура в топке'];
  const temperKameraSmesheniya = data.temperatures && data.temperatures['Температура в камере смешения'];
  const temperUhodGazy = data.temperatures && data.temperatures['Температура уходящих газов'];

  if (temperTopka !== undefined) document.querySelector('.topka-temper-param').innerText = temperTopka;
  if (temperKameraSmesheniya !== undefined)
    document.querySelector('.temper-kamera-smeshenia-param').innerText = temperKameraSmesheniya;
  if (temperUhodGazy !== undefined) document.querySelector('.temper-uhodyashih-gazov-param').innerText = temperUhodGazy;
};

// Функция для обновления разрежения
export const updateSushilka1Vacuums = (data) => {
  const razrTopka = data.vacuums && data.vacuums['Разрежение в топке'];
  const razrKameraVygruzki = data.vacuums && data.vacuums['Разрежение в камере выгрузки'];
  const razrVozduhRazbavlenie = data.vacuums && data.vacuums['Разрежение воздуха на разбавление'];

  if (razrTopka !== undefined) document.querySelector('.topka-razr-param').innerText = razrTopka;
  if (razrKameraVygruzki !== undefined)
    document.querySelector('.razr-kamera-vigruzki-param').innerText = razrKameraVygruzki;
  if (razrVozduhRazbavlenie !== undefined)
    document.querySelector('.razr-vosduh-na-razbavl-param').innerText = razrVozduhRazbavlenie;
};

export const updateSushilka2Vacuums = (data) => {
  const razrTopka = data.vacuums && data.vacuums['Разрежение в топке'];
  const razrKameraVygruzki = data.vacuums && data.vacuums['Разрежение в камере выгрузки'];
  const razrVozduhRazbavlenie = data.vacuums && data.vacuums['Разрежение воздуха на разбавление'];

  if (razrTopka !== undefined) document.querySelector('.topka-razr-param').innerText = razrTopka;
  if (razrKameraVygruzki !== undefined)
    document.querySelector('.razr-kamera-vigruzki-param').innerText = razrKameraVygruzki;
  if (razrVozduhRazbavlenie !== undefined)
    document.querySelector('.razr-vosduh-na-razbavl-param').innerText = razrVozduhRazbavlenie;
};

// Функция для обновления параметров горелки
export const updateSushilka1GorelkaParams = (data) => {
  const moshnostGorelka = data.gorelka && data.gorelka['Мощность горелки №1'];
  const signalRegulyator = data.gorelka && data.gorelka['Сигнал от регулятора №1'];
  const zadanieTemper = data.gorelka && data.gorelka['Задание температуры №1'];

  if (moshnostGorelka !== undefined) document.querySelector('.mosh-gorelki-param').innerText = moshnostGorelka;
  if (zadanieTemper !== undefined) document.querySelector('.zadanie-temper-param').innerText = zadanieTemper;
  if (signalRegulyator !== undefined) document.querySelector('.signal-regulyator').innerText = signalRegulyator;
};

export const updateSushilka2GorelkaParams = (data) => {
  const moshnostGorelka = data.gorelka && data.gorelka['Мощность горелки №2'];
  const signalRegulyator = data.gorelka && data.gorelka['Сигнал от регулятора №2'];
  const zadanieTemper = data.gorelka && data.gorelka['Задание температуры №2'];

  if (moshnostGorelka !== undefined) document.querySelector('.mosh-gorelki-param').innerText = moshnostGorelka;
  if (zadanieTemper !== undefined) document.querySelector('.zadanie-temper-param').innerText = zadanieTemper;
  if (signalRegulyator !== undefined) document.querySelector('.signal-regulyator').innerText = signalRegulyator;
};
