import { updateMpa3Params } from "./components/updateParams.js";
import { updateResourcesParams } from "./components/updateParamsResources.js";
import { updateVentilator } from "./components/ventilator.js";

const fetchMpa3Data = async () => {
  let mpa3Data = {};
  let combinedData = {};

  try {
    // Запрос данных из первого API
    const mpa3Response = await fetch('/api/mpa3-data');
    if (!mpa3Response.ok) {
      throw new Error('Ошибка при запросе MPA3 данных');
    }
    mpa3Data = await mpa3Response.json();
  } catch (error) {
    console.error('Ошибка при получении данных MPA3:', error);
  }

  try {
    // Запрос данных из второго API
    const resourcesResponse = await fetch('/api/uzliUchetaCarbon');
    if (!resourcesResponse.ok) {
      throw new Error('Ошибка при запросе данных Узлов учета');
    }
    const resourcesData = await resourcesResponse.json();

    // Извлекаем только необходимые данные
    const de093Data = resourcesData?.de093?.data || {};
    const dd972Data = resourcesData?.dd972?.data || {};
    const dd973Data = resourcesData?.dd973?.data || {};

    // Объединяем нужные данные
    combinedData = { ...de093Data, ...dd972Data, ...dd973Data };
  } catch (error) {
    console.error('Ошибка при получении данных Узлов учета Карбон:', error);
  }

  // Обновляем элементы на странице только с доступными данными
  if (Object.keys(mpa3Data).length > 0) {
    updateMpa3Params(mpa3Data);
    updateVentilator(mpa3Data);
  }
  if (Object.keys(combinedData).length > 0) {
    updateResourcesParams(combinedData);
  }
};

// Изначальная загрузка данных и обновление каждые 10 секунд
fetchMpa3Data();
setInterval(fetchMpa3Data, 10000);
