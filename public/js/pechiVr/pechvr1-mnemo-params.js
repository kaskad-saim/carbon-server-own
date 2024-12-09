import { updateTemperatures, updatePressures, updateVacuums, updateLevels, updateImpulseSignals, updateGorelkaParams, updateNotis1, updateNotisStatus } from './components/updateParams.js';
import { initLevelObjects } from './components/levels.js';
import { updateIms } from './components/im.js';
import { updateVentilator, updateFire} from './components/ventilator.js';
import { checkConditions } from './components/checkConditions.js';

export const fetchVr1Data = async () => {
  try {
    const response = await fetch('/api/vr1-data');
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

    // Получаем данные для Notis1
    const notis1Response = await fetch('/api/notis1-data');
    const notis1Data = await notis1Response.json();
    // Передаем полученные данные в updateNotis1
    updateNotis1(notis1Data);

    if (notis1Data && notis1Data.status) {
      updateNotisStatus(notis1Data.status);
    } else {
      console.warn('Статус Notis1 не найден в полученных данных.');
    }

  } catch (error) {
    console.error('Ошибка при получении данных VR1:', error);
  }
};

// Сразу запускаем функции один раз при загрузке страницы
fetchVr1Data();

// Затем запускаем их каждые 15 секунд
setInterval(fetchVr1Data, 15000);