// script.js

// Функция для установки текущего месяца в календарь
function setCurrentMonth() {
  const today = new Date();
  const monthString = today.toISOString().slice(0, 7); // Формат YYYY-MM
  document.getElementById('singleMonth').value = monthString;
}

// Функция для обновления заголовка с датой отчета
function updateReportDateHeader(date) {
  const formattedDate = new Date(date);
  const options = { year: 'numeric', month: 'long' }; // Убираем "day" из формата
  const reportDate = formattedDate.toLocaleDateString('ru-RU', options);
  document.getElementById('reportMonth').innerText = reportDate;
}

// Функция для загрузки данных и отображения их в таблице
async function loadDataForSelectedMonth() {
  const selectedMonth = document.getElementById('singleMonth').value;

  if (!selectedMonth) {
    alert('Пожалуйста, выберите месяц.');
    return;
  }

  document.getElementById('loadingWrapper').style.display = 'flex'; // Предполагается, что у вас есть элемент загрузки

  try {
    const response = await fetch(`/api/reportRoutes/getReportDataMonth?month=${selectedMonth}`);
    const reportData = await response.json();

    const tableBody = document.querySelector('#reportTable tbody');
    tableBody.innerHTML = '';

    if (reportData && reportData.length > 0) {
      reportData.forEach((dayData) => {
        const row = document.createElement('tr');
        row.classList.add('dynamic-report__report-tr'); // Добавляем класс
        row.innerHTML = `
          <td class="dynamic-report__report-cell">${dayData.day}</td>
          <td class="dynamic-report__report-cell">
            <input class="dynamic-report__report-input" type="number"  value="${
              dayData.DE093 !== '-' ? dayData.DE093 : ''
            }" data-model="DE093" data-day="${dayData.day}" data-original-value="${
          dayData.DE093 !== '-' ? dayData.DE093 : ''
        }">
          </td>
          <td class="dynamic-report__report-cell">
            <input class="dynamic-report__report-input" type="number"  value="${
              dayData.DD972 !== '-' ? dayData.DD972 : ''
            }" data-model="DD972" data-day="${dayData.day}" data-original-value="${
          dayData.DD972 !== '-' ? dayData.DD972 : ''
        }">
          </td>
          <td class="dynamic-report__report-cell">
            <input class="dynamic-report__report-input" type="number"  value="${
              dayData.DD973 !== '-' ? dayData.DD973 : ''
            }" data-model="DD973" data-day="${dayData.day}" data-original-value="${
          dayData.DD973 !== '-' ? dayData.DD973 : ''
        }">
          </td>
          <td class="dynamic-report__report-cell">
            <input class="dynamic-report__report-input" type="number"  value="${
              dayData.DD576 !== '-' ? dayData.DD576 : ''
            }" data-model="DD576" data-day="${dayData.day}" data-original-value="${
          dayData.DD576 !== '-' ? dayData.DD576 : ''
        }">
          </td>
          <td class="dynamic-report__report-cell">
            <input class="dynamic-report__report-input" type="number"  value="${
              dayData.DD569 !== '-' ? dayData.DD569 : ''
            }" data-model="DD569" data-day="${dayData.day}" data-original-value="${
          dayData.DD569 !== '-' ? dayData.DD569 : ''
        }">
          </td>
          <td class="dynamic-report__report-cell">
            <input class="dynamic-report__report-input" type="number"  value="${
              dayData.DD923 !== '-' ? dayData.DD923 : ''
            }" data-model="DD923" data-day="${dayData.day}" data-original-value="${
          dayData.DD923 !== '-' ? dayData.DD923 : ''
        }">
          </td>
          <td class="dynamic-report__report-cell">
            <input class="dynamic-report__report-input" type="number"  value="${
              dayData.DD924 !== '-' ? dayData.DD924 : ''
            }" data-model="DD924" data-day="${dayData.day}" data-original-value="${
          dayData.DD924 !== '-' ? dayData.DD924 : ''
        }">
          </td>
        `;
        tableBody.appendChild(row);
      });

      // Добавляем строку с итогами
      const totals = calculateTotals(reportData);
      const totalRow = document.createElement('tr');
      totalRow.classList.add('dynamic-report__report-tr'); // Добавляем класс к строке с итогами

      // Первая ячейка "Итого"
      const totalLabelCell = document.createElement('td');
      totalLabelCell.classList.add('dynamic-report__report-cell');
      totalLabelCell.style.fontWeight = 'bold';
      totalLabelCell.style.backgroundColor = 'green'; // Зеленый цвет для ячейки "Итого"
      totalLabelCell.style.color = 'white'; // Белый текст
      totalLabelCell.textContent = 'Итого';
      totalRow.appendChild(totalLabelCell);

      // Остальные ячейки итогов
      const colorClasses = [
        'yellow', // Для DE093
        'yellow', // Для DD972
        'yellow', // Для DD973
        'yellow', // Для DD576
        'yellow', // Для DD569
        'yellow', // Для DD923
        'yellow', // Для DD924
      ];

      const totalsValues = [
        totals.DE093.toFixed(2),
        totals.DD972.toFixed(2),
        totals.DD973.toFixed(2),
        totals.DD576.toFixed(2),
        totals.DD569.toFixed(2),
        totals.DD923.toFixed(2),
        totals.DD924.toFixed(2),
      ];

      totalsValues.forEach((value, index) => {
        const cell = document.createElement('td');
        cell.classList.add('dynamic-report__report-cell');
        cell.style.backgroundColor = colorClasses[index]; // Применяем цвета для итогов
        cell.textContent = value;
        totalRow.appendChild(cell);
      });

      tableBody.appendChild(totalRow);
    } else {
      const row = document.createElement('tr');
      row.classList.add('dynamic-report__report-tr'); // Добавляем класс к строке
      row.innerHTML = `<td colspan="8" style="text-align:center;">Нет данных за выбранный месяц.</td>`;
      tableBody.appendChild(row);
    }
    // Обновляем заголовок с датой
    updateReportDateHeader(selectedMonth);
  } catch (error) {
    console.error('Ошибка при загрузке данных за месяц:', error);
    alert('Произошла ошибка при загрузке данных. Попробуйте позже.');
  } finally {
    document.getElementById('loadingWrapper').style.display = 'none'; // Скрываем элемент загрузки
  }
}

function calculateTotals(data) {
  const totals = {
    DE093: 0,
    DD972: 0,
    DD973: 0,
    DD576: 0,
    DD569: 0,
    DD923: 0,
    DD924: 0,
  };

  // Проходим по всем строкам и суммируем значения
  data.forEach((item) => {
    totals.DE093 += item.DE093 === '-' ? 0 : parseFloat(item.DE093);
    totals.DD972 += item.DD972 === '-' ? 0 : parseFloat(item.DD972);
    totals.DD973 += item.DD973 === '-' ? 0 : parseFloat(item.DD973);
    totals.DD576 += item.DD576 === '-' ? 0 : parseFloat(item.DD576);
    totals.DD569 += item.DD569 === '-' ? 0 : parseFloat(item.DD569);
    totals.DD923 += item.DD923 === '-' ? 0 : parseFloat(item.DD923);
    totals.DD924 += item.DD924 === '-' ? 0 : parseFloat(item.DD924);
  });

  return totals;
}

// Загрузка данных за текущий месяц при загрузке страницы
window.addEventListener('load', () => {
  setCurrentMonth(); // Устанавливаем текущую дату в календарь
  loadDataForSelectedMonth(); // Загружаем данные за текущий месяц
});

// Обработчик кнопки "Принять"
document.getElementById('confirmMonthBtn').addEventListener('click', loadDataForSelectedMonth);

// Функция для открытия модального окна подтверждения пароля
function openPasswordModal(callback) {
  const modalBackground = document.getElementById('password-confirm');
  const modal = modalBackground.querySelector('.mnemo__modal-active');
  const closeBtn = modal.querySelector('.mnemo__modal-close');
  const submitBtn = document.getElementById('submitPasswordBtn');
  const passwordInput = document.getElementById('correctionPassword');
  const errorSpan = document.getElementById('error-delete-password');

  // Очистка предыдущих ошибок
  errorSpan.classList.remove('active');
  errorSpan.textContent = '';
  passwordInput.classList.remove('error');

  // Добавляем класс enabled для отображения
  modalBackground.classList.add('enabled');
  modal.classList.add('enabled');

  // Функция для закрытия модала
  const closeModal = () => {
    modalBackground.classList.remove('enabled');
    modal.classList.remove('enabled');
    // Очистка ошибок при закрытии
    errorSpan.classList.remove('active');
    errorSpan.textContent = '';
    passwordInput.classList.remove('error');
    // Удаляем обработчик клика вне модала
    window.removeEventListener('click', outsideClickListener);
  };

  // Обработчик закрытия модала по кнопке закрытия
  closeBtn.onclick = closeModal;

  // Обработчик закрытия модала при клике вне его
  const outsideClickListener = (event) => {
    if (event.target === modalBackground) {
      closeModal();
    }
  };

  window.addEventListener('click', outsideClickListener);

  // Обработчик кнопки подтверждения
  submitBtn.onclick = async (e) => {
    e.preventDefault(); // Предотвращаем отправку формы по умолчанию
    const password = passwordInput.value.trim();

    // Сброс предыдущих ошибок
    errorSpan.classList.remove('active');
    errorSpan.textContent = '';
    passwordInput.classList.remove('error');

    // Вызов callback с паролем
    const isValid = await callback(password);

    if (isValid) {
      // Закрываем модальное окно, если пароль верный
      closeModal();
    } else {
      // Отображаем ошибку
      errorSpan.textContent = 'Пароль не верный';
      errorSpan.classList.add('active');
      passwordInput.classList.add('error');
    }
  };
}

// Новая функция для открытия модального окна "изменений не было"
function openNotChangeModal() {
  const modalBackground = document.getElementById('password-not-change');
  const modal = modalBackground.querySelector('.mnemo__modal-active');
  const closeBtn = modal.querySelector('.mnemo__modal-close');

  // Добавляем класс 'enabled' для отображения модала
  modalBackground.classList.add('enabled');
  modal.classList.add('enabled');

  // Функция для закрытия модала
  const closeModal = () => {
    modalBackground.classList.remove('enabled');
    modal.classList.remove('enabled');
    // Удаляем обработчик клика вне модала
    window.removeEventListener('click', outsideClickListener);
  };

  // Обработчик закрытия модала по кнопке закрытия
  closeBtn.onclick = closeModal;

  // Обработчик закрытия модала при клике вне его
  const outsideClickListener = (event) => {
    if (event.target === modalBackground) {
      closeModal();
    }
  };

  window.addEventListener('click', outsideClickListener);
}

// Функция для сбора изменений из таблицы
function collectModifiedData() {
  const inputs = document.querySelectorAll('#reportTable tbody input');
  const modifications = [];

  inputs.forEach((input) => {
    const value = input.value;
    const day = input.dataset.day;
    const model = input.dataset.model;
    const originalValue = input.dataset.originalValue;

    // Проверка, было ли изменение
    if (value !== originalValue) {
      // Проверяем, не пустое ли значение и является ли оно числом
      if (value !== '' && !isNaN(parseFloat(value))) {
        modifications.push({ day, model, value: parseFloat(value) });
      } else if (value === '' && originalValue !== '') {
        // Если значение пустое, а изначальное было, то считаем, что оно изменено на 0
        modifications.push({ day, model, value: 0 });
      }
    }
  });

  return modifications;
}

// Обработчик события для кнопки "Сохранить изменения"
document.getElementById('saveChangesBtn').addEventListener('click', () => {
  console.log('Кнопка "Сохранить изменения" нажата');
  const modifications = collectModifiedData();

  if (modifications.length === 0) {
    // Если нет изменений, открываем модальное окно "изменений не было"
    openNotChangeModal();
    return;
  }

  // Если есть изменения, открываем модальное окно для ввода пароля
  openPasswordModal(async (password) => {
    try {
      const response = await fetch('/api/reportRoutes/correctReportData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modifications, password }),
      });

      if (response.ok) {
        loadDataForSelectedMonth(); // Перезагружаем данные для отображения обновленных значений
        return true; // Пароль верный
      } else {
        const result = await response.json();
        // console.error('Ошибка:', result.error); // Закомментировано
        return false; // Пароль неверный или другая ошибка
      }
    } catch (error) {
      // console.error('Ошибка при сохранении изменений:', error); // Закомментировано
      return false; // Произошла ошибка при сохранении
    }
  });
});
