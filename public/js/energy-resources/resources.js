import { updateResourcesParams } from "./components/updateParams.js";
import { updateDateTime } from "./components/time-date.js";

const fetchResourcesData = async () => {
  try {
    const response = await fetch('/api/uzliUchetaCarbon');
    const data = await response.json();

    // Извлекаем данные
    const dd569Data = data?.dd569?.data || {};
    const dd576Data = data?.dd576?.data || {};
    const dd923Data = data?.dd923?.data || {};
    const dd924Data = data?.dd924?.data || {};
    const de093Data = data?.de093?.data || {};
    const dd972Data = data?.dd972?.data || {};
    const dd973Data = data?.dd973?.data || {};

    // Объединяем данные
    const combinedData = { ...dd569Data, ...dd576Data, ...dd923Data, ...dd924Data, ...de093Data, ...dd972Data, ...dd973Data };

    // Обновляем элементы на странице
    updateResourcesParams(combinedData);
  } catch (error) {
    console.error('Ошибка при получении данных Узлов учета Карбон:', error);
  }
};

// Изначальная загрузка данных и обновление каждые 10 секунд
fetchResourcesData();
setInterval(fetchResourcesData, 10000);

// Вызовите функцию обновления даты и времени при загрузке страницы
updateDateTime();
// Установите интервал для обновления времени каждую секунду
setInterval(updateDateTime, 1000);
