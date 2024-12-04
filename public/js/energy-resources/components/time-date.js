// Функция для обновления даты и времени
export const updateDateTime = () => {
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
    timeDateTogether.textContent = `${formattedDate} ${formattedTime}`;
  }
};





