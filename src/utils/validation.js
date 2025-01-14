// utils/validation.js
const previousValues = {};
const changeCounters = {};

export const isValueWithinRange = (value, min, max) => {
  return typeof value === 'number' && value >= min && value <= max;
};

export const isValueStable = (label, newValue, threshold = 1500, maxConsecutiveChanges = 3) => {
  const previousValue = previousValues[label];

  if (previousValue === undefined) {
    // Нет предыдущего значения — принимаем текущее как стабильное.
    previousValues[label] = newValue;
    changeCounters[label] = 0;
    return true;
  }

  const difference = Math.abs(newValue - previousValue);

  if (difference > threshold) {
    // Значительное изменение.
    changeCounters[label] = (changeCounters[label] || 0) + 1;

    if (changeCounters[label] >= maxConsecutiveChanges) {
      console.warn(`[${label}] Значение продолжает значительно изменяться. Принимаем новое значение как стабильное.`);
      previousValues[label] = newValue;
      changeCounters[label] = 0;
      return true;
    } else {
      console.warn(`[${label}] Значительное изменение значения: предыдущее=${previousValue}, новое=${newValue}. Последовательных изменений: ${changeCounters[label]}`);
      return false;
    }
  } else {
    // Изменение в пределах нормы — обнуляем счётчик и принимаем новое как стабильное.
    changeCounters[label] = 0;
    previousValues[label] = newValue;
    return true;
  }
};
