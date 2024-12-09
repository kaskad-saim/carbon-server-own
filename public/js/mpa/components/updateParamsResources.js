export const updateResourcesParams = (data) => {
  const elements = {
    // Данные для DE093 (МПА2)
    'heat-de093': data['Гкал/ч DE093'] ?? '-',
    'volume-de093': data['Куб/ч DE093'] ?? '-',
    'mass-de093': data['Тонн/ч DE093'] ?? '-',
    'pressure-de093': data['Давление DE093'] ?? '-',
    'temperature-de093': data['Температура DE093'] ?? '-',

    // Данные для DD972 (МПА3)
    'heat-dd972': data['Гкал/ч DD972'] ?? '-',
    'volume-dd972': data['Куб/ч DD972'] ?? '-',
    'mass-dd972': data['Тонн/ч DD972'] ?? '-',
    'pressure-dd972': data['Давление DD972'] ?? '-',
    'temperature-dd972': data['Температура DD972'] ?? '-',

    // Данные для DD973 (МПА4)
    'heat-dd973': data['Гкал/ч DD973'] ?? '-',
    'volume-dd973': data['Куб/ч DD973'] ?? '-',
    'mass-dd973': data['Тонн/ч DD973'] ?? '-',
    'pressure-dd973': data['Давление DD973'] ?? '-',
    'temperature-dd973': data['Температура DD973'] ?? '-',
  };

  // Обновляем значения в DOM
  for (const [selector, value] of Object.entries(elements)) {
    const element = document.querySelector(`.${selector}`);
    if (element) {
      element.textContent = value;
    }
  }
};