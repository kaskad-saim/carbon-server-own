import { updateTemperatures, updatePressures, updateVacuums, updateLevels, updateImpulseSignals, updateGorelkaParams, updateNotis2, updateNotisStatus } from './components/updateParams.js';
import { initLevelObjects } from './components/levels.js';
import { updateIms } from './components/im.js';
import { updateVentilator, updateFire } from './components/ventilator.js';
import { checkConditions } from './components/checkConditions.js';

export const fetchVr2Data = async () => {
  try {
    const response = await fetch('/api/vr2-data');
    const data = await response.json();
    // console.log('Данные VR1:', data);

    // Вызываем функции обновления с данными
    updateTemperatures(data); // параметры температур
    updatePressures(data); // параметры давления
    updateVacuums(data); // параметры разрежения
    updateLevels(data); // параметры уровня
    updateImpulseSignals(data); // параметры ИМ5 на котле-утилизаторе
    updateGorelkaParams(data); // параметры горелки
    updateIms(data); //обновление параметров ИМ
    updateVentilator(data); //обновление анимации вентилятора и дымососа
    updateFire(data); // обновление анимации горелки
    initLevelObjects(); // функция закрашивания уровня в шкалах
    checkConditions(); // функция сигнализаций, таблицы, режима

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

// Сразу запускаем функции один раз при загрузке страницы
fetchVr2Data();

// Затем запускаем их каждые 10 секунд
setInterval(fetchVr2Data, 15000);