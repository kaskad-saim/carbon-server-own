// utils/validation.js
export const isValueWithinRange = (value, min, max) => {
  return typeof value === 'number' && value >= min && value <= max;
};

const previousValues = {};
const changeCounters = {};

export const isValueStable = (label, newValue, threshold = 100, maxConsecutiveChanges = 3) => {
  const previousValue = previousValues[label];

  if (previousValue === undefined) {
    previousValues[label] = newValue;
    changeCounters[label] = 0;
    return true;
  }

  const difference = Math.abs(newValue - previousValue);

  if (difference > threshold) {
    changeCounters[label] = (changeCounters[label] || 0) + 1;

    if (changeCounters[label] >= maxConsecutiveChanges) {
      console.warn(`[${label}] Значение продолжает значительно изменяться. Принимаем новое значение.`);
      previousValues[label] = newValue;
      changeCounters[label] = 0;
      return true;
    } else {
      console.warn(`[${label}] Значительное изменение значения: предыдущее=${previousValue}, новое=${newValue}. Последовательных изменений: ${changeCounters[label]}`);
      return false;
    }
  } else {
    changeCounters[label] = 0;
    previousValues[label] = newValue;
    return true;
  }
};
