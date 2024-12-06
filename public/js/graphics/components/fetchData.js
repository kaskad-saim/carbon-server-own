export async function fetchData(parameterType, start = null, end = null) {
  try {
    const params = new URLSearchParams();
    if (start) params.append('start', start.toISOString());
    if (end) params.append('end', end.toISOString());

    // Определяем базовый URL в зависимости от окружения
    const baseUrl = window.NODE_ENV === 'development'
      ? 'http://localhost:3002/api'
      : 'http://169.254.0.156:3002/api';

    // Определяем URL на основе типа параметра
    let url = '';
    if (parameterType === 'vr1') {
      url = `${baseUrl}/vr1/data`;
    } else if (parameterType === 'vr2') {
      url = `${baseUrl}/vr2/data`;
    } else if (parameterType === 'mpa2') {
      url = `${baseUrl}/mpa2/data`;
    } else if (parameterType === 'mpa3') {
      url = `${baseUrl}/mpa3/data`;
    } else if (parameterType === 'sushilka1') {
      url = `${baseUrl}/sushilka1/data`;
    } else if (parameterType === 'sushilka2') {
      url = `${baseUrl}/sushilka2/data`;
    } else if (parameterType === 'notis1') {
      url = `${baseUrl}/notis1/data`;
    } else if (parameterType === 'notis2') {
      url = `${baseUrl}/notis2/data`;
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
