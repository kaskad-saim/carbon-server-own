import { updateMpa3Params } from "./components/updateParams.js";
import { updateDateTime } from "./components/time-date.js";


const fetchMpa3Data = async () => {
  try {
    const response = await fetch('/api/mpa3-data');
    const data = await response.json();

    // Обновляем элементы на странице
    updateMpa3Params(data);
  } catch (error) {
    console.error('Ошибка при получении данных MPA3:', error);
  }
};

// Изначальная загрузка данных и обновление каждые 10 секунд
fetchMpa3Data();
setInterval(fetchMpa3Data, 10000);

// Вызовите функцию обновления даты и времени при загрузке страницы
updateDateTime();
// Установите интервал для обновления времени каждую секунду
setInterval(updateDateTime, 1000);
