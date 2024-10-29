const animationRun = (param) => {
  param.style.animationPlayState = 'running';
};

const animationPaused = (param) => {
  param.style.animationPlayState = 'paused';
};

// Функция для добавления строки в таблицу, если параметр вышел за пределы нормы и отсутствует
const addRowIfRunning = (param, description, modalId) => {
  const tableTbody = document.querySelector('.table__tbody-params');
  const existingRow = tableTbody.querySelector(`[data-modal-target="${modalId}"]`);

  if (param.style.animationPlayState === 'running') {
    if (!existingRow) { // Проверка на отсутствие строки
      const row = document.createElement('tr');
      row.classList.add('table__tr');
      row.dataset.modalTarget = modalId; // Установка уникального атрибута для идентификации

      row.innerHTML = `
        <td class="table__td table__left">${description}</td>
        <td class="table__td table__right">${param.innerText}</td>
        <td class="table__td table__tr--incorrect-param">
          <button class="table__td-btn btn-reset" data-modal-target="${modalId}">Подробнее</button>
        </td>
      `;
      tableTbody.appendChild(row);

      // Удаляем строку "нет данных", если добавляем ошибку
      const noDataRow = tableTbody.querySelector('.no-data-row');
      if (noDataRow) {
        noDataRow.remove();
      }
    }
  } else if (existingRow) { // Удаление строки, если параметр нормализовался
    existingRow.closest('tr').remove();
  }
};

// Управление сиреной в зависимости от наличия строк с некорректными параметрами
const toggleSiren = (hasErrors) => {
  const sirenAnimation = document.querySelector('.light-alarm__content');

  if (hasErrors) {
    if (sirenAnimation.classList.contains('siren-off')) {
      sirenAnimation.classList.remove('siren-off');
      console.log('Сирена включена');
    }
  } else {
    if (!sirenAnimation.classList.contains('siren-off')) {
      sirenAnimation.classList.add('siren-off');
      console.log('Сирена выключена');
    }
  }
};

export const checkConditions = () => {
  const modeTitle = document.querySelector('.current-param__subtitle-span');
  const temper1Skolz = document.querySelector('.temper-1-skolz');
  const temper3Skolz = document.querySelector('.temper-3-skolz');
  const temper3SkolzSpan = document.querySelector('.temper-3-skolz-span');

  if (temper1Skolz) {
    const temp1Value = Number(temper1Skolz.innerText);
    if (temp1Value < 550 && temp1Value > 50) {
      modeTitle.innerText = 'Выход на режим';
      const temp3Value = Number(temper3Skolz.innerText);
      if (temp3Value > 750) {
        animationRun(temper3Skolz);
        animationRun(temper3SkolzSpan);
      } else {
        animationPaused(temper3Skolz);
        animationPaused(temper3SkolzSpan);
      }
      addRowIfRunning(temper3Skolz, 'На 3-ей скользящей, °C', 'temper-3-skolz-modal');
    } else if (temp1Value > 550) {
      modeTitle.innerText = 'Установившийся режим';
      const temp3Value = Number(temper3Skolz.innerText);
      if (temp3Value > 400) {
        animationRun(temper3Skolz);
        animationRun(temper3SkolzSpan);
      } else {
        animationPaused(temper3Skolz);
        animationPaused(temper3SkolzSpan);
      }
      addRowIfRunning(temper3Skolz, 'На 3-ей скользящей, °C', 'temper-3-skolz-modal');
    } else {
      modeTitle.innerText = 'Печь не работает';
    }
  } else {
    modeTitle.innerText = 'Печь не работает';
  }

  // Другие условия
  const params = [
    {
      selector: '.temper-1-skolz',
      spanSelector: '.temper-1-skolz-span',
      min: 50,
      max: 800,
      description: 'На 1-ой скользящей, °C',
      modalId: 'temper-1-skolz-modal'
    },
    {
      selector: '.temper-2-skolz',
      spanSelector: '.temper-2-skolz-span',
      max: 700,
      description: 'На 2-ой скользящей, °C',
      modalId: 'temper-2-skolz-modal'
    },
    {
      selector: '.razr-niz-zagr-kam',
      spanSelector: '.razr-niz-zagr-kam-span',
      min: -5,
      max: -1,
      description: 'Низ загрузочной камеры, кгс/м2',
      modalId: 'razr-niz-zagr-kam-modal'
    },
    {
      selector: '.temper-vniz-kamer-zagruz',
      spanSelector: '.temper-vniz-kamer-zagruz-span',
      min: 1000,
      max: 1100,
      description: 'Внизу камеры загрузки, °C',
      modalId: 'temper-vniz-kamer-zagruz-modal'
    },
    {
      selector: '.temper-verh-kamer-zagruz',
      spanSelector: '.temper-verh-kamer-zagruz-span',
      max: 1000,
      description: 'Вверху камеры загрузки, °C',
      modalId: 'temper-verh-kamer-zagruz-modal'
    },
    {
      selector: '.temper-vhod-pech-dozhig',
      spanSelector: '.temper-vhod-pech-dozhig-span',
      max: 1200,
      description: 'На входе печи дожига, °C',
      modalId: 'temper-vhod-pech-dozhig-modal'
    },

    {
      selector: '.temper-granul-holod',
      spanSelector: '.temper-granul-holod-span',
      max: 70,
      description: 'Гранул после холод-ка, °C',
      modalId: 'temper-posle-holod-modal'
    },
    {
      selector: '.davl-gaz-posle-skruber',
      spanSelector: '.davl-gaz-posle-skruber-span',
      max: 20,
      description: 'Давление газов после скруббера, кгс/м2',
      modalId: 'davl-gazov-posle-skrubber-modal'
    },
    {
      selector: '.temper-topka',
      spanSelector: '.temper-topka-span',
      max: 1000,
      description: 'В топке, °C',
      modalId: 'temper-v-topke-modal'
    },
    {
      selector: '.temper-do-skruber',
      spanSelector: '.temper-do-skruber-span',
      max: 400,
      description: 'Температура газов до скруббера, °C',
      modalId: 'temper-gazov-do-skrubber-modal'
    },
    {
      selector: '.temper-posle-skruber',
      spanSelector: '.temper-posle-skruber-span',
      max: 100,
      description: 'Температура газов после скруббера, °C',
      modalId: 'temper-gazov-posle-skrubber-modal'
    },
    {
      selector: '.uroven-v-barabane-kotla-mnemo-val',
      spanSelector: '.uroven-v-barabane-kotla-mnemo-val-span',
      min: -70,
      max: 70,
      description: 'Уровень в барабане котла, мм',
      modalId: 'uroven-v-kotle-modal'
    },
    {
      selector: '.uroven-vanne-skrubber-value',
      spanSelector: '.uroven-vanne-skrubber-value-span',
      min: 250,
      description: 'Уровень в ванне скруббера, мм',
      modalId: 'uroven-vanne-skrubber-modal'
    },
    {
      selector: '.uroven-vody-hvo-value',
      spanSelector: '.uroven-vody-hvo-value-span',
      min: 1500,
      description: 'Уровень воды в емкости ХВО, мм',
      modalId: 'uroven-vody-vho-modal'
    }
  ];

  params.forEach(({ selector, spanSelector, min = -Infinity, max = Infinity, description, modalId }) => {
    const param = document.querySelector(selector);
    const paramSpan = document.querySelector(spanSelector);

    if (param) {
      const value = Number(param.innerText.replace(',', '.'));
      if (value > max || value < min) {
        animationRun(param);
        animationRun(paramSpan);
      } else {
        animationPaused(param);
        animationPaused(paramSpan);
      }
      addRowIfRunning(param, description, modalId);
    }
  });

  const tableTbody = document.querySelector('.table__tbody-params');
  const errorRows = tableTbody.querySelectorAll('tr[data-modal-target]');

  if (errorRows.length === 0) {
    // Проверяем, существует ли уже строка "нет данных", чтобы не добавлять её несколько раз
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
  } else {
    // Если есть ошибки, удаляем строку "нет данных", если она существует
    const noDataRow = tableTbody.querySelector('.no-data-row');
    if (noDataRow) {
      noDataRow.remove();
    }
  }

  // Определяем наличие ошибок на основе количества errorRows
  const hasErrors = errorRows.length > 0;

  // Вызываем toggleSiren с параметром hasErrors
  toggleSiren(hasErrors);
};
