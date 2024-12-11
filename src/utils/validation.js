// utils/validation.js
export const isValueWithinRange = (value, min, max) => {
  return typeof value === 'number' && value >= min && value <= max;
};
