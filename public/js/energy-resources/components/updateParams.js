export const updateResourcesParams = (data) => {
  const elements = {
    // Данные для DD569
    'heat-dd569': data['Гкал/ч DD569'] ?? '-',
    'volume-dd569': data['Куб/ч DD569'] ?? '-',
    'mass-dd569': data['Тонн/ч DD569'] ?? '-',
    'pressure-dd569': data['Давление DD569'] ?? '-',
    'temperature-dd569': data['Температура DD569'] ?? '-',

    // Данные для DD576
    'heat-dd576': data['Гкал/ч DD576'] ?? '-',
    'volume-dd576': data['Куб/ч DD576'] ?? '-',
    'mass-dd576': data['Тонн/ч DD576'] ?? '-',
    'pressure-dd576': data['Давление DD576'] ?? '-',
    'temperature-dd576': data['Температура DD576'] ?? '-',

    // Данные для DD923
    'heat-dd923': data['Гкал/ч DD923'] ?? '-',
    'volume-dd923': data['Куб/ч DD923'] ?? '-',
    'mass-dd923': data['Тонн/ч DD923'] ?? '-',
    'pressure-dd923': data['Давление DD923'] ?? '-',
    'temperature-dd923': data['Температура DD923'] ?? '-',

    // Данные для DD924
    'heat-dd924': data['Гкал/ч DD924'] ?? '-',
    'volume-dd924': data['Куб/ч DD924'] ?? '-',
    'mass-dd924': data['Тонн/ч DD924'] ?? '-',
    'pressure-dd924': data['Давление DD924'] ?? '-',
    'temperature-dd924': data['Температура DD924'] ?? '-',

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
