import { updateMpa2Params } from "./components/updateParams.js";
import { updateResourcesParams } from "./components/updateParamsResources.js";
import { updateVentilator } from "./components/ventilator.js";

const fetchMpa2Data = async () => {
  let mpa2Data = {};
  let combinedData = {};

  try {
    // Запрос данных из первого API
    const mpa2Response = await fetch('/api/mpa2-data');
    if (!mpa2Response.ok) {
      throw new Error('Ошибка при запросе MPA2 данных');
    }
    mpa2Data = await mpa2Response.json();
  } catch (error) {
    console.error('Ошибка при получении данных MPA2:', error);
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
  if (Object.keys(mpa2Data).length > 0) {
    updateMpa2Params(mpa2Data);
    updateVentilator(mpa2Data);
  }
  if (Object.keys(combinedData).length > 0) {
    updateResourcesParams(combinedData);
  }
};

// Изначальная загрузка данных и обновление каждые 10 секунд
fetchMpa2Data();
setInterval(fetchMpa2Data, 10000);
