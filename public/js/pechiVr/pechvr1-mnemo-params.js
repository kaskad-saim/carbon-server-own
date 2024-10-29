export const fetchVr1Data = async () => {
  try {
    const response = await fetch('/api/vr1-data');
    const data = await response.json();
    console.log('Данные VR1:', data);

    // Извлекаем температуры для скользящих 1, 2 и 3
    const temperature1Sk = data.temperatures && data.temperatures['1-СК'];
    const temperature2Sk = data.temperatures && data.temperatures['2-СК'];
    const temperature3Sk = data.temperatures && data.temperatures['3-СК'];

    // Обновляем span элементы, если данные существуют
    if (temperature1Sk !== undefined) {
      document.querySelector('.temper-1-skolz').innerText = temperature1Sk;
    } else {
      console.warn('Температура для 1-СК отсутствует в данных');
    }

    if (temperature2Sk !== undefined) {
      document.querySelector('.temper-2-skolz').innerText = temperature2Sk;
    } else {
      console.warn('Температура для 2-СК отсутствует в данных');
    }

    if (temperature3Sk !== undefined) {
      document.querySelector('.temper-3-skolz').innerText = temperature3Sk;
    } else {
      console.warn('Температура для 3-СК отсутствует в данных');
    }
  } catch (error) {
    console.error('Ошибка при получении данных VR1:', error);
  }
};
