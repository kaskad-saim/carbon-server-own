export async function fetchData(parameterType, start = null, end = null) {
  try {
    const params = new URLSearchParams();
    if (start) params.append('start', start.toISOString());
    if (end) params.append('end', end.toISOString());

    const response = await fetch(`http://169.254.0.155:3000/api/parameters/${parameterType}?${params.toString()}`);
    const data = await response.json();

    // Поскольку сервер возвращает { vr1: data } или { vr2: data }, мы можем получить данные так:
    return data[parameterType];
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    throw error;
  }
}
