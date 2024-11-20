import { updateDateTime } from "./components/time-date.js";
import { updateReactor296Params } from "./components/updateParams.js";



// Функция для получения данных реактора K296
export const fetchReactor296Data = async () => {
  try {
    const response = await fetch('/api/reactorK296-data'); // Запрос к API
    const text = await response.text();

    // Пробуем преобразовать в JSON
    const data = JSON.parse(text);

    // Вызываем функцию обновления с полученными данными
    updateReactor296Params(data);
  } catch (error) {
    console.error('Ошибка при получении данных реактора K296:', error);
  }
};

// Изначальный вызов и периодический опрос данных
fetchReactor296Data();
setInterval(fetchReactor296Data, 10000);

// Вызовите функцию обновления даты и времени при загрузке страницы
updateDateTime();
// Установите интервал для обновления времени каждую секунду
setInterval(updateDateTime, 1000);
