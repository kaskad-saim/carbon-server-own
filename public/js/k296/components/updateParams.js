// Функция для обновления параметров реактора K296
export const updateReactor296Params = (data) => {
  const reactors = [
    { hSelector: '.reaktor-1-h-val', tSelector: '.reaktor-1-t-val', tKey: 'Температура реактора 45/1', hKey: 'Уровень реактора 45/1' },
    { hSelector: '.reaktor-2-h-val', tSelector: '.reaktor-2-t-val', tKey: 'Температура реактора 45/2', hKey: 'Уровень реактора 45/2' },
    { hSelector: '.reaktor-3-h-val', tSelector: '.reaktor-3-t-val', tKey: 'Температура реактора 45/3', hKey: 'Уровень реактора 45/3' },
    { hSelector: '.reaktor-4-h-val', tSelector: '.reaktor-4-t-val', tKey: 'Температура реактора 45/4', hKey: 'Уровень реактора 45/4' },
  ];

  reactors.forEach((reactor) => {
    const tValue = data.temperatures?.[reactor.tKey] ?? '-'; // Данные о температуре
    const hValue = data.levels?.[reactor.hKey] ?? '-'; // Данные об уровне

    document.querySelector(reactor.tSelector).textContent = tValue;
    document.querySelector(reactor.hSelector).textContent = hValue;
  });
};