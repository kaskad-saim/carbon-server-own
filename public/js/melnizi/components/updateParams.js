// Функция для обновления параметров Mill1
export const updateMill1Params = (data) => {
  const front = data.data?.['Фронтальное Мельница 1'];
  const transverse = data.data?.['Поперечное Мельница 1'];
  const axial = data.data?.['Осевое Мельница 1'];

  if (front !== undefined) document.querySelector('.mill-1-front').textContent = front;
  if (transverse !== undefined) document.querySelector('.mill-1-transverse').textContent = transverse;
  if (axial !== undefined) document.querySelector('.mill-1-axial').textContent = axial;
};

// Функция для обновления параметров Mill2
export const updateMill2Params = (data) => {
  const front = data.data?.['Фронтальное Мельница 2'];
  const transverse = data.data?.['Поперечное Мельница 2'];
  const axial = data.data?.['Осевое Мельница 2'];

  if (front !== undefined) document.querySelector('.mill-2-front').textContent = front;
  if (transverse !== undefined) document.querySelector('.mill-2-transverse').textContent = transverse;
  if (axial !== undefined) document.querySelector('.mill-2-axial').textContent = axial;
};