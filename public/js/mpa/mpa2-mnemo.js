import { updateMpa2Params } from "./components/updateParams.js";
import { updateVentilator } from "./components/ventilator.js";

const fetchMpa2Data = async () => {
  try {
    const response = await fetch('/api/mpa2-data');
    const data = await response.json();

    // Обновляем элементы на странице
    updateMpa2Params(data);
    updateVentilator(data);
  } catch (error) {
    console.error('Ошибка при получении данных MPA2:', error);
  }
};

// Изначальная загрузка данных и обновление каждые 10 секунд
fetchMpa2Data();
setInterval(fetchMpa2Data, 10000);
