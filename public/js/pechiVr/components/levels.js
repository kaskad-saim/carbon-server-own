// levelUtils.js
export const levelObj = (minScale, maxScale, current, maxSize, level, levelPercent, minSet, maxSet) => {
  // Преобразуем значения к числам для точного сравнения
  let totalScale = maxScale - minScale;
  let valueFromMin = Number(current) - minScale;
  let percentage = (valueFromMin / totalScale) * 100;
  let px = (maxSize * percentage) / 100;

  levelPercent.innerText = parseFloat(percentage.toFixed(0));
  level.style.height = px + 'px';

  // Проверяем числовое значение в пределах допустимого диапазона
  const levelPercentValue = Number(levelPercent.innerText);
  if (levelPercentValue <= minSet || levelPercentValue >= maxSet) {
    level.style.backgroundColor = 'red';
    level.style.animationPlayState = 'running';
  } else {
    level.style.backgroundColor = ''; // Сброс цвета, если уровень в норме
    level.style.animationPlayState = 'paused';
  }
};


export const initLevelObjects = () => {
  const levelHvo = document.querySelector('.column-hvo__percent');
  const valueHvoCurrent = document.querySelector('.uroven-vody-hvo-value').innerText;
  const levelHvoPercent = document.querySelector('.column-hvo__span-1');

  const levelSkrubber = document.querySelector('.column-skrubber__percent');
  const valueSkrubberCurrent = document.querySelector('.uroven-vanne-skrubber-value').innerText;
  const levelSkrubberPercent = document.querySelector('.column-skrubber__span-1');

  const levelKotel = document.querySelector('.column-kotel__percent');
  const valueKotelCurrent = document.querySelector('.uroven-v-barabane-kotla-mnemo-val').innerText;
  const levelKotelPercent = document.querySelector('.column-kotel__span-1');

  let screenWidth = window.innerWidth;

  if ((levelHvo, valueHvoCurrent, levelHvoPercent)) {
    levelObj(0, 6000, valueHvoCurrent, 41, levelHvo, levelHvoPercent, 25, 90);
    if (screenWidth < 1568) {
      levelObj(0, 6000, valueHvoCurrent, 32, levelHvo, levelHvoPercent, 25, 90);
    }
  }

  if ((levelSkrubber, valueSkrubberCurrent, levelSkrubberPercent)) {
    levelObj(0, 1000, valueSkrubberCurrent, 139, levelSkrubber, levelSkrubberPercent, 25, 90);
    if (screenWidth < 1568) {
      levelObj(0, 1000, valueSkrubberCurrent, 105, levelSkrubber, levelSkrubberPercent, 25, 90);
    }
  }

  if ((levelKotel, valueKotelCurrent, levelKotelPercent)) {
    levelObj(-200, 200, valueKotelCurrent, 85, levelKotel, levelKotelPercent, 33, 68);
    if (screenWidth < 1568) {
      levelObj(-200, 200, valueKotelCurrent, 64, levelKotel, levelKotelPercent, 33, 68);
    }
  }
};
