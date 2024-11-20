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

// Функция для обновления параметров Mill10B
export const updateMill10bParams = (data) => {
  const sbm3Axial = data.data?.['Осевое ШБМ3'];
  const sbm3Vertical = data.data?.['Вертикальное ШБМ3'];
  const sbm3Transverse = data.data?.['Поперечное ШБМ3'];
  const ygm9517Front = data.data?.['Фронтальное YGM9517'];
  const ygm9517Axial = data.data?.['Осевое YGM9517'];
  const ygm9517Transverse = data.data?.['Поперечное YGM9517'];
  const ycvok130Front = data.data?.['Фронтальное YCVOK130'];
  const ycvok130Transverse = data.data?.['Поперечное YCVOK130'];
  const ycvok130Axial = data.data?.['Осевое YCVOK130'];

  if (sbm3Axial !== undefined) document.querySelector('.sbm3-axial').textContent = sbm3Axial;
  if (sbm3Vertical !== undefined) document.querySelector('.sbm3-vertical').textContent = sbm3Vertical;
  if (sbm3Transverse !== undefined) document.querySelector('.sbm3-transverse').textContent = sbm3Transverse;
  if (ygm9517Front !== undefined) document.querySelector('.ygm9517-front').textContent = ygm9517Front;
  if (ygm9517Axial !== undefined) document.querySelector('.ygm9517-axial').textContent = ygm9517Axial;
  if (ygm9517Transverse !== undefined) document.querySelector('.ygm9517-transverse').textContent = ygm9517Transverse;
  if (ycvok130Front !== undefined) document.querySelector('.ycvok130-front').textContent = ycvok130Front;
  if (ycvok130Transverse !== undefined) document.querySelector('.ycvok130-transverse').textContent = ycvok130Transverse;
  if (ycvok130Axial !== undefined) document.querySelector('.ycvok130-axial').textContent = ycvok130Axial;
};