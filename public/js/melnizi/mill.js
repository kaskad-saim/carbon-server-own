import { updateDateTime } from "./components/time-date.js";
import { updateMill10bParams, updateMill1Params, updateMill2Params } from "./components/updateParams.js";

// Функция для получения данных мельницы 10Б
export const fetchMill10bData = async () => {
  try {
    const response = await fetch('/api/mill10b-data');
    const mill10bData = await response.json();

    // Вызываем функцию обновления с соответствующими данными
    updateMill10bParams(mill10bData);
  } catch (error) {
    console.error('Ошибка при получении данных mill10b:', error);
  }
};


// Функция для получения данных обеих мельниц
export const fetchMillData = async () => {
  try {
    // Параллельные запросы к API
    const [mill1Response, mill2Response] = await Promise.all([
      fetch('/api/mill1-data'),
      fetch('/api/mill2-data'),
    ]);

    // Парсим ответы в формате JSON
    const mill1Data = await mill1Response.json();
    const mill2Data = await mill2Response.json();

    // Вызываем функции обновления с соответствующими данными
    updateMill1Params(mill1Data);
    updateMill2Params(mill2Data);
  } catch (error) {
    console.error('Ошибка при получении данных мельниц:', error);
  }
};

// Изначальный вызов и периодический опрос данных
fetchMillData();
setInterval(fetchMillData, 10000);

// Изначальный вызов и периодический опрос данных
fetchMill10bData();
setInterval(fetchMill10bData, 10000);

// Вызовите функцию обновления даты и времени при загрузке страницы
updateDateTime();
// Установите интервал для обновления времени каждую секунду
setInterval(updateDateTime, 1000);
