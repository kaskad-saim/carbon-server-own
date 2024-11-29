// Функции управления анимацией параметров
const animationRun = (param) => {
  // Сброс анимации для её перезапуска
  param.style.animation = 'none';
  // Используем setTimeout, чтобы подождать, прежде чем применить анимацию снова
  setTimeout(() => {
    param.style.animation = ''; // Вернуть исходное значение, чтобы анимация снова запустилась
    param.style.animationPlayState = 'running';
  }, 0);
};

const animationPaused = (param) => {
  // Просто удаляем анимацию, чтобы сбросить её
  param.style.animation = 'none';
};

// Функция для обновления строки в таблице
const updateRow = (isError, description, value, modalId) => {
  const tableTbody = document.querySelector('.table__tbody-params');

  if (!description) {
    console.warn(`Описание параметра отсутствует для значения: "${value}"`);
    return;
  }

  const existingRow = tableTbody.querySelector(`[data-modal-target="${modalId}"]`);

  if (isError) {
    if (!existingRow) { // Добавить строку, если её нет
      const row = document.createElement('tr');
      row.classList.add('table__tr');
      if (modalId) {
        row.dataset.modalTarget = modalId; // Установка уникального атрибута для идентификации
      }

      row.innerHTML = `
        <td class="table__td table__left">${description}</td>
        <td class="table__td table__right">${value}</td>
        <td class="table__td table__tr--incorrect-param">
          ${modalId ? `<button class="table__td-btn btn-reset" data-modal-target="${modalId}">Подробнее</button>` : ''}
        </td>
      `;
      tableTbody.appendChild(row);

      // Удаляем строку "нет данных", если добавляем ошибку
      const noDataRow = tableTbody.querySelector('.no-data-row');
      if (noDataRow) {
        noDataRow.remove();
      }
    } else {
      // Обновить значение в существующей строке, если нужно
      const valueCell = existingRow.querySelector('.table__td.table__right');
      if (valueCell) {
        valueCell.innerText = value;
      }
    }
  } else {
    if (existingRow) { // Удалить строку, если ошибка ушла
      existingRow.remove();
    }

    // Если после удаления строки нет ошибок, добавить "нет данных" строку
    const errorRows = tableTbody.querySelectorAll('tr[data-modal-target]');
    if (errorRows.length === 0) {
      let noDataRow = tableTbody.querySelector('.no-data-row');
      if (!noDataRow) {
        noDataRow = document.createElement('tr');
        noDataRow.classList.add('table__tr', 'no-data-row');
        noDataRow.innerHTML = `
          <td class="table__td table__left table__td--descr" colspan="3">
            Тут будут отображаться параметры, которые превышают допустимые значения
          </td>
        `;
        tableTbody.appendChild(noDataRow);
      }
    }
  }

};

// Функция управления сиреной
const toggleSiren = (hasErrors) => {
  const sirenAnimation = document.querySelector('.light-alarm__content');

  if (!sirenAnimation) {
    console.warn('Элемент сирены не найден.');
    return;
  }

  if (hasErrors) {
    // Убираем класс `siren-off` и добавляем `siren-active` для включения анимации
    sirenAnimation.classList.remove('siren-off');

    // Перезапуск анимации: временно удаляем и добавляем `siren-active` для сброса `::after`
    sirenAnimation.classList.remove('siren-active');
    void sirenAnimation.offsetWidth; // Принудительная перерисовка DOM
    sirenAnimation.classList.add('siren-active');
  } else {
    // Останавливаем анимацию, добавив класс `siren-off`
    sirenAnimation.classList.add('siren-off');
    sirenAnimation.classList.remove('siren-active'); // Убираем активную анимацию
  }
};


export const checkConditions = () => {
  const modeTitle = document.querySelector('.current-param__subtitle-span');
  const temper1Skolz = document.querySelector('.temper-1-skolz');
  const temper3Skolz = document.querySelector('.temper-3-skolz');
  const temper3SkolzSpan = document.querySelector('.temper-3-skolz-span');

  // Массив для сбора ошибок
  const errors = [];
  let isFurnaceWorking = false; // Флаг для состояния печи

  // Обработка специальных параметров temper1Skolz и temper3Skolz
  if (temper1Skolz && temper3Skolz && temper3SkolzSpan) {
    const temp1Value = Number(temper1Skolz.innerText);
    const temp3Value = Number(temper3Skolz.innerText);

    if (temp1Value <= 550 && temp1Value > 50) {
      isFurnaceWorking = true; // Печь работает
      modeTitle.innerText = 'Выход на режим';
      const isError = temp3Value > 750; // Ошибка, если temp3Value >750
      if (isError) {
        animationRun(temper3Skolz);
        animationRun(temper3SkolzSpan);
        errors.push({
          description: 'На 3-ей скользящей, °C',
          value: temp3Value,
          modalId: 'temper-3-skolz-modal',
        });
      } else {
        animationPaused(temper3Skolz);
        animationPaused(temper3SkolzSpan);
      }
      if (isFurnaceWorking) {
        updateRow(isError, 'На 3-ей скользящей, °C', temp3Value, 'temper-3-skolz-modal');
      }
    } else if (temp1Value > 550) {
      isFurnaceWorking = true; // Печь работает
      modeTitle.innerText = 'Установившийся режим';
      const isError = temp3Value > 400; // Ошибка, если temp3Value >400
      if (isError) {
        animationRun(temper3Skolz);
        animationRun(temper3SkolzSpan);
        errors.push({
          description: 'На 3-ей скользящей, °C',
          value: temp3Value,
          modalId: 'temper-3-skolz-modal',
        });
      } else {
        animationPaused(temper3Skolz);
        animationPaused(temper3SkolzSpan);
      }
      if (isFurnaceWorking) {
        updateRow(isError, 'На 3-ей скользящей, °C', temp3Value, 'temper-3-skolz-modal');
      }
    } else {
      modeTitle.innerText = 'Печь не работает';
      animationPaused(temper3Skolz);
      animationPaused(temper3SkolzSpan);
      updateRow(false, 'На 3-ей скользящей, °C', temp3Value, 'temper-3-skolz-modal');
    }
  } else {
    modeTitle.innerText = 'Печь не работает';
    console.warn('Необходимые элементы для обработки 3-й скользящей отсутствуют.');
  }
  // Обработка остальных параметров
  const params = [
    // Селекторы параметров температур
    {
      selector: '.temper-1-skolz',
      spanSelector: '.temper-1-skolz-span',
      min: 50,
      max: 800,
      description: 'На 1-ой скользящей, °C',
      modalId: 'temper-1-skolz-modal',
    },
    {
      selector: '.temper-2-skolz',
      spanSelector: '.temper-2-skolz-span',
      max: 700,
      description: 'На 2-ой скользящей, °C',
      modalId: 'temper-2-skolz-modal',
    },
    {
      selector: '.temper-topka',
      spanSelector: '.temper-topka-span',
      max: 1000,
      description: 'В топке, °C',
      modalId: 'temper-v-topke-modal',
    },
    {
      selector: '.temper-verh-kamer-zagruz',
      spanSelector: '.temper-verh-kamer-zagruz-span',
      max: 1000,
      description: 'Вверху камеры загрузки, °C',
      modalId: 'temper-verh-kamer-zagruz-modal',
    },
    {
      selector: '.temper-vniz-kamer-zagruz',
      spanSelector: '.temper-vniz-kamer-zagruz-span',
      min: 1000,
      max: 1100,
      description: 'Внизу камеры загрузки, °C',
      modalId: 'temper-vniz-kamer-zagruz-high-modal',
    },
    {
      selector: '.temper-vhod-pech-dozhig',
      spanSelector: '.temper-vhod-pech-dozhig-span',
      max: 1200,
      description: 'На входе печи дожига, °C',
      modalId: 'temper-vhod-pech-dozhig-modal',
    },
    {
      selector: '.temper-vyhod-pech-dozhig',
      spanSelector: '.temper-vyhod-pech-dozhig-span',
      max: 1200,
      description: 'На выходе печи дожига, °C',
      modalId: 'temper-vyhod-pech-dozhig-modal',
    },
    {
      selector: '.temper-kamer-vygruz',
      spanSelector: '.temper-kamer-vygruz-span',
      max: 750,
      description: 'Камера выгрузки, °C',
      modalId: 'temper-kamer-vygruz-modal',
    },
    {
      selector: '.temper-gazov-kotel-utiliz-span',
      spanSelector: '.temper-gazov-kotel-utiliz-span',
      max: 1100,
      description: 'Дымовых газов котла, °C',
      modalId: 'temper-gazov-kotel-utiliz-modal',
    },
    {
      selector: '.temper-do-skruber',
      spanSelector: '.temper-do-skruber-span',
      max: 400,
      description: 'Температура газов до скруббера, °C',
      modalId: 'temper-gazov-do-skrubber-modal',
    },
    {
      selector: '.temper-posle-skruber',
      spanSelector: '.temper-posle-skruber-span',
      max: 100,
      description: 'Температура газов после скруббера, °C',
      modalId: 'temper-gazov-posle-skrubber-modal',
    },
    {
      selector: '.temper-vody-v-vanne-skrubber',
      spanSelector: '.temper-vody-vanna-skrubber-span',
      max: 90,
      description: 'Воды в ванне скруббера, °C',
      modalId: 'temper-vody-v-vanne-skrubber-modal',
    },
    {
      selector: '.temper-granul-holod',
      spanSelector: '.temper-granul-holod-span',
      max: 70,
      description: 'Гранул после холод-ка, °C',
      modalId: 'temper-posle-holod-modal',
    },
    // Селекторы параметров уровня
    {
      selector: '.uroven-vanne-skrubber-value',
      spanSelector: '.uroven-vanne-skrubber-value-span',
      min: 250,
      description: 'Уровень в ванне скруббера, мм',
      modalId: 'uroven-vanne-skrubber-modal',
    },
    {
      selector: '.uroven-vody-hvo-value',
      spanSelector: '.uroven-vody-hvo-value-span',
      min: 1500,
      description: 'Уровень воды в емкости ХВО, мм',
      modalId: 'uroven-vody-vho-modal',
    },
    {
      selector: '.uroven-v-barabane-kotla-mnemo-val',
      spanSelector: '.uroven-v-barabane-kotla-mnemo-val-span',
      min: -70,
      max: 70,
      description: 'Уровень в барабане котла, мм',
      modalId: 'uroven-v-kotle-modal',
    },
    // Селекторы параметров давления/разрежения
    {
      selector: '.davl-gaz-posle-skruber',
      spanSelector: '.davl-gaz-posle-skruber-span',
      max: 20,
      description: 'Газов после скруббера, кгс/м2',
      modalId: 'davl-gazov-posle-skrubber-modal',
    },
    {
      selector: '.davl-topka',
      spanSelector: '.davl-topka-span',
      min: -4,
      max: -1,
      description: 'В топке печи, кгс/м2',
      modalId: 'razrezh-v-topke-modal',
    },
    {
      selector: '.razr-kotel-utiliz',
      spanSelector: '.razr-kotel-utiliz-span',
      min: -12,
      max: -3,
      description: 'В котле утилизаторе, кгс/м2',
      modalId: 'razr-kotel-utiliz-modal',
    },
    {
      selector: '.razr-niz-zagr-kam',
      spanSelector: '.razr-niz-zagr-kam-span',
      min: -5,
      max: -1,
      description: 'Низ загрузочной камеры, кгс/м2',
      modalId: 'razr-niz-zagr-kam-modal',
    },
  ];

  // Обработка параметров
  // Обработка остальных параметров
  if (isFurnaceWorking) {
    params.forEach(({ selector, spanSelector, min = -Infinity, max = Infinity, description, modalId }) => {
      const param = document.querySelector(selector);
      const paramSpan = document.querySelector(spanSelector);

      if (param && paramSpan) {
        const rawValue = param.innerText.trim();
        const value = Number(rawValue.replace(',', '.'));

        if (isNaN(value)) {
          return;
        }

        const isError = (value > max || value < min);
        if (isError) {
          animationRun(param);
          animationRun(paramSpan);
          errors.push({
            description,
            value,
            modalId,
          });
        } else {
          animationPaused(param);
          animationPaused(paramSpan);
        }

        updateRow(isError, description, value, modalId);
      }
    });
  }

  // Очистка существующих строк ошибок и добавление новых
  const tableTbody = document.querySelector('.table__tbody-params');
  tableTbody.innerHTML = ''; // Очищаем все строки

  if (errors.length > 0) {
    errors.forEach(({ description, value, modalId }) => {
      const row = document.createElement('tr');
      row.classList.add('table__tr');
      if (modalId) {
        row.dataset.modalTarget = modalId;
      }

      row.innerHTML = `
        <td class="table__td table__left">${description}</td>
        <td class="table__td table__right">${value}</td>
        <td class="table__td table__tr--incorrect-param">
          ${modalId ? `<button class="table__td-btn btn-reset" data-modal-target="${modalId}">Подробнее</button>` : ''}
        </td>
      `;
      tableTbody.appendChild(row);
    });
  } else {
    const noDataRow = document.createElement('tr');
    noDataRow.classList.add('table__tr', 'no-data-row');
    noDataRow.innerHTML = `
      <td class="table__td table__left table__td--descr" colspan="3">
        Тут будут отображаться параметры, которые превышают допустимые значения
      </td>
    `;
    tableTbody.appendChild(noDataRow);
  }

  // Определяем наличие ошибок только если печь работает
  const hasErrors = isFurnaceWorking && errors.length > 0;

  // Управление сиреной
  toggleSiren(hasErrors);
};