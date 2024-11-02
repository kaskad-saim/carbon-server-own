export async function fetchData(parameterType, start = null, end = null) {
  try {
    const params = new URLSearchParams();
    if (start) params.append('start', start.toISOString());
    if (end) params.append('end', end.toISOString());

    // Определяем URL на основе типа параметра
    const port = 3002; // Укажите ваш порт
    let url = '';
    if (parameterType === 'vr1') {
      url = `http://169.254.0.156:${port}/api/vr1/data`;
    } else if (parameterType === 'vr2') {
      url = `http://169.254.0.156:${port}/api/vr2/data`;
    } else {
      throw new Error('Неверный тип параметра');
    }

    const response = await fetch(`${url}?${params.toString()}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    throw error;
  }
}
