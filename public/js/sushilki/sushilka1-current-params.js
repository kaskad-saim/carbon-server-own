import { updateSushilka1GorelkaParams, updateSushilka1ImpulseSignals, updateSushilka1Temperatures, updateSushilka1Vacuums } from "./components/updateParams.js";

// Определяем функцию для обновления даты и времени
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

export const fetchSushilka1Data = async () => {
  try {
    const response = await fetch('/api/sushilka1-data');
    const data = await response.json();
    // console.log('Данные Sushilka1:', data);

    // Вызываем функции обновления с данными
    updateSushilka1Temperatures(data); // параметры температур
    updateSushilka1Vacuums(data); // параметры разрежения
    updateSushilka1GorelkaParams(data); // параметры горелки
    updateSushilka1ImpulseSignals(data); // импульсные сигналы
  } catch (error) {
    console.error('Ошибка при получении данных Sushilka1:', error);
  }
};

// Вызовите функцию обновления даты и времени при загрузке страницы
updateDateTime();
// Установите интервал для обновления времени каждую секунду
setInterval(updateDateTime, 1000);

// Сразу запускаем функции один раз при загрузке страницы
fetchSushilka1Data();
// Затем запускаем их каждые 15 секунд
setInterval(fetchSushilka1Data, 15000);