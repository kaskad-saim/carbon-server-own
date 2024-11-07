import { updateVr1GorelkaParams, updateVr2GorelkaParams, updateSushilka1GorelkaParams, updateSushilka2GorelkaParams } from "./components/updateParams.js";

const updateDateTime = () => {
  const dateElement = document.querySelector('.current-param__date');
  const timeElement = document.querySelector('.current-param__time');
  const timeDateTogether = document.querySelector('#server-time');
  const now = new Date();

  const optionsDate = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

  const formattedDate = now.toLocaleDateString('ru-RU', optionsDate);
  const formattedTime = now.toLocaleTimeString('ru-RU', optionsTime);

  if (dateElement) {
    dateElement.textContent = formattedDate;
  }

  if (timeElement) {
    timeElement.textContent = formattedTime;
  }

  if (timeDateTogether) {
    timeDateTogether.textContent = formattedDate + ' ' + formattedTime;
  }
};

export const fetchGorelkiData = async () => {
  try {
    // Параллельные запросы к нескольким API
    const [sushilka1Response, sushilka2Response, vr1Response, vr2Response] = await Promise.all([
      fetch('/api/sushilka1-data'),
      fetch('/api/sushilka2-data'),
      fetch('/api/vr1-data'),
      fetch('/api/vr2-data'),
    ]);

    // Парсим ответы в формате JSON
    const sushilka1Data = await sushilka1Response.json();
    const sushilka2Data = await sushilka2Response.json();
    const vr1Data = await vr1Response.json();
    const vr2Data = await vr2Response.json();

    // Вызываем функции обновления с соответствующими данными
    updateSushilka1GorelkaParams(sushilka1Data); // параметры горелки сушилки №1
    updateSushilka2GorelkaParams(sushilka2Data); // параметры горелки сушилки №2
    updateVr1GorelkaParams(vr1Data); // параметры горелки ПК1
    updateVr2GorelkaParams(vr2Data); // параметры горелки ПК1
  } catch (error) {
    console.error('Ошибка при получении данных горелок:', error);
  }
};

fetchGorelkiData ();
setInterval(fetchGorelkiData, 15000)

// Вызовите функцию обновления даты и времени при загрузке страницы
updateDateTime();
// Установите интервал для обновления времени каждую секунду
setInterval(updateDateTime, 1000);