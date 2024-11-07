// Функция для обновления параметров горелки
export const updateSushilka1GorelkaParams = (data) => {
  const moshnostGorelka = data.gorelka && data.gorelka['Мощность горелки №1'];
  const signalRegulyator = data.gorelka && data.gorelka['Сигнал от регулятора №1'];
  const zadanieTemper = data.gorelka && data.gorelka['Задание температуры №1'];

  if (moshnostGorelka !== undefined) document.querySelector('.mosh-gorelki-sushilka1').innerText = moshnostGorelka;
  if (zadanieTemper !== undefined) document.querySelector('.zadanie-temper-sushilka1').innerText = zadanieTemper;
  if (signalRegulyator !== undefined) document.querySelector('.signal-regulyator-sushilka1').innerText = signalRegulyator;
};

export const updateSushilka2GorelkaParams = (data) => {
  const moshnostGorelka = data.gorelka && data.gorelka['Мощность горелки №2'];
  const signalRegulyator = data.gorelka && data.gorelka['Сигнал от регулятора №2'];
  const zadanieTemper = data.gorelka && data.gorelka['Задание температуры №2'];

  if (moshnostGorelka !== undefined) document.querySelector('.mosh-gorelki-sushilka2').innerText = moshnostGorelka;
  if (zadanieTemper !== undefined) document.querySelector('.zadanie-temper-sushilka2').innerText = zadanieTemper;
  if (signalRegulyator !== undefined) document.querySelector('.signal-regulyator-sushilka2').innerText = signalRegulyator;
};

export const updateVr1GorelkaParams = (data) => {
  const zadanieTemperNaGorelky = data.gorelka?.['Задание температуры на горелку №1'];

  const moshGorelkyVr1 = data.gorelka?.['Мощность горелки №1'];


  if (zadanieTemperNaGorelky !== undefined) document.querySelector('.zadanie-temper-vr1').innerText = zadanieTemperNaGorelky;

  if (moshGorelkyVr1 !== undefined) document.querySelector('.mosh-gorelki-vr1').innerText = moshGorelkyVr1;


};

export const updateVr2GorelkaParams = (data) => {
  const zadanieTemperNaGorelkyVr2 = data.gorelka?.['Задание температуры на горелку №2'];
  const moshGorelkyVr2 = data.gorelka?.['Мощность горелки №2'];

  if (zadanieTemperNaGorelkyVr2 !== undefined) document.querySelector('.zadanie-temper-vr2').innerText = zadanieTemperNaGorelkyVr2;
  if (moshGorelkyVr2 !== undefined) document.querySelector('.mosh-gorelki-vr2').innerText = moshGorelkyVr2;
}