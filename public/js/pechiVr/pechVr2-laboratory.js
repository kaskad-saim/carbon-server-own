// client.js
import { closeModal } from './components/modal.js';

// Определяем базовый URL для API в зависимости от окружения
const apiUrl =
  window.NODE_ENV === 'development'
    ? 'http://localhost:3002/api/lab'
    : 'http://169.254.0.156:3002/api/lab';

// Элементы формы и таблицы
const form = document.querySelector('.laboratory__form');
const volatileInput = document.getElementById('volatile-substances');
const timeInput = document.getElementById('input-time');
const passwordInput = document.getElementById('volatile-substances-password');
const valuePHInput = document.getElementById('value-ph');
const valueSUMInput = document.getElementById('value-sum');


const dateCell = document.querySelector('.laboratory__table-td--mnemo-date');
const timeCell = document.querySelector('.laboratory__table-td--mnemo-time');
const valueCell = document.querySelector('.laboratory__table-td--mnemo-val');
const valuePHCell = document.querySelector('.laboratory__table-td--mnemo-val-ph');
const valueSUMCell = document.querySelector('.laboratory__table-td--mnemo-val-sum');

const errorSpan = document.querySelector('.laboratory__form-error');

const errorSpans = {
  value: document.getElementById('error-volatile-substances'),
  time: document.getElementById('error-input-time'),
  password: document.getElementById('error-volatile-substances-password'),
};

// Функция для блокировки и разблокировки инпутов
const toggleInputs = (isDisabled) => {
  [volatileInput, timeInput, passwordInput].forEach((input) => {
    input.readOnly = isDisabled;
  });
};

// Функция для очистки ошибок
const clearErrors = () => {
  Object.values(errorSpans).forEach((span) => {
    span.textContent = '';
    span.classList.remove('active');
  });
  [volatileInput, timeInput, passwordInput].forEach((input) => {
    input.classList.remove('error');
  });
};

// Функция для отображения ошибки
const showError = (inputElement, errorSpan, message) => {
  errorSpan.textContent = message;
  errorSpan.classList.add('active');
  inputElement.classList.add('error');
};

// Функция для выполнения запроса и обработки данных
const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Ошибка при получении данных');
    return await response.json();
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};

const setCellData = (data) => {
  // Летучие вещества
  valueCell.textContent = data.value ?? '-';
  timeCell.textContent = data.valueTime ?? '-';
  dateCell.textContent = data.valueDate ?? '-';

  // pH
  valuePHCell.textContent = data.valuePH ?? '-';
  document.querySelector('.laboratory__table-td--mnemo-time-ph').textContent = data.valuePHTime ?? '-';
  document.querySelector('.laboratory__table-td--mnemo-date-ph').textContent = data.valuePHDate ?? '-';

  // Суммарка
  valueSUMCell.textContent = data.valueSUM ?? '-';
  document.querySelector('.laboratory__table-td--mnemo-time-sum').textContent = data.valueSUMTime ?? '-';
  document.querySelector('.laboratory__table-td--mnemo-date-sum').textContent = data.valueSUMDate ?? '-';
};



// Функция для показа прелоудера "Данные загружаются"
const showLoadingMessage = () => {
  const row = document.createElement('tr');
  row.classList.add('table__tr');

  const createLoadingCell = () => {
    const cell = document.createElement('td');
    cell.textContent = 'Загрузка...';
    cell.classList.add('table__td', 'laboratory__table-td');
    return cell;
  };

  // Добавляем пять ячеек для пяти столбцов
  for (let i = 0; i < 5; i++) {
    row.appendChild(createLoadingCell());
  }

  return row;
};

// Функция для показа прелоудера для последнего загруженного значения
const showLastValueLoading = () => {
  // Летучие вещества
  valueCell.textContent = 'Загрузка...';
  timeCell.textContent = 'Загрузка...';
  dateCell.textContent = 'Загрузка...';

  // pH
  valuePHCell.textContent = 'Загрузка...';
  document.querySelector('.laboratory__table-td--mnemo-time-ph').textContent = 'Загрузка...';
  document.querySelector('.laboratory__table-td--mnemo-date-ph').textContent = 'Загрузка...';

  // Суммарка
  valueSUMCell.textContent = 'Загрузка...';
  document.querySelector('.laboratory__table-td--mnemo-time-sum').textContent = 'Загрузка...';
  document.querySelector('.laboratory__table-td--mnemo-date-sum').textContent = 'Загрузка...';
};


// Функция для получения последних данных
const fetchLastData = async () => {
  try {
    showLastValueLoading(); // Показываем прелоудер
    const data = await fetchData(`${apiUrl}/pechVr2/last`);
    if (data) {
      setCellData(data);
    }
    errorSpan.textContent = '';
    errorSpan.classList.remove('active');
    toggleInputs(false);
  } catch (error) {
    errorSpan.textContent = 'Нет связи';
    errorSpan.classList.add('active');
    toggleInputs(true);
  }
};



// Функция для создания строки таблицы
const createTableRow = (recordDate, recordTime, value, valuePH, valueSUM) => {
  const row = document.createElement('tr');
  row.classList.add('table__tr');

  const createCell = (text, classes = []) => {
    const cell = document.createElement('td');
    cell.textContent = text !== undefined ? text : '-';
    cell.classList.add('table__td', ...classes);
    return cell;
  };

  row.appendChild(createCell(recordDate, ['table__left', 'laboratory__table-td']));
  row.appendChild(createCell(recordTime, ['table__left', 'laboratory__table-td']));
  row.appendChild(createCell(value, ['table__right', 'laboratory__table-td']));
  row.appendChild(createCell(valuePH, ['table__right', 'laboratory__table-td']));
  row.appendChild(createCell(valueSUM, ['table__right', 'laboratory__table-td']));

  return row;
};




// Функция для получения данных за последние 24 часа и обновления таблицы
const fetchLastDayData = async () => {
  try {
    tableBody.innerHTML = '';
    tableBody.appendChild(showLoadingMessage()); // Показываем прелоудер
    const data = await fetchData(`${apiUrl}/pechVr2/last-day`);
    tableBody.innerHTML = '';

    if (data && data.length > 0) {
      data.forEach((item) => {
        const row = createTableRow(
          item.recordDate || '-',
          item.recordTime || '-',
          item.value || '-',
          item.valuePH || '-',
          item.valueSUM || '-'
        );
        tableBody.appendChild(row);
      });
    } else {
      const row = createTableRow('-', '-', '-', '-', '-');
      tableBody.appendChild(row);
    }
    toggleInputs(false);
    errorSpan.textContent = '';
    errorSpan.classList.remove('active');
  } catch (error) {
    tableBody.innerHTML = '';
    const row = createTableRow('Нет связи', 'Нет связи', 'Нет связи', 'Нет связи', 'Нет связи');
    tableBody.appendChild(row);
    errorSpan.textContent = 'Нет связи';
    errorSpan.classList.add('active');
    toggleInputs(true);
  }
};

const submitButton = document.querySelector('.laboratory__form-btn');

// Обработчик отправки формы
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Отключаем кнопку и показываем индикатор загрузки
  submitButton.disabled = true;
  submitButton.classList.add('loading');

  let value = volatileInput.value.trim();
  let valuePH = valuePHInput.value.trim();
  let valueSUM = valueSUMInput.value.trim();
  let time = timeInput.value.trim();
  const password = passwordInput.value.trim();

  clearErrors();

  if (!time) {
    showError(timeInput, errorSpans.time, 'Введите время');
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
    return;
  }

  if (!value && !valuePH && !valueSUM) {
    showError(volatileInput, errorSpans.value, 'Введите хотя бы одно значение');
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
    return;
  }

  if (password !== '123') {
    showError(passwordInput, errorSpans.password, 'Неверный пароль');
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
    return;
  }

  try {
    const data = await fetchData(`${apiUrl}/pechVr2/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        value: value ? value.replace(',', '.') : null,
        valuePH: valuePH ? valuePH.replace(',', '.') : null,
        valueSUM: valueSUM ? valueSUM.replace(',', '.') : null,
        time,
      }),
    });

    // Очистка полей ввода
    volatileInput.value = '';
    valuePHInput.value = '';
    valueSUMInput.value = '';
    timeInput.value = '';
    passwordInput.value = '';
    clearErrors();

    // Обновление таблиц
    setCellData(data.value, data.time, data.date, data.valuePH, data.valueSUM);
    fetchLastDayData();  // Обновление таблицы за последние 24 часа
    fetchLastData();     // Обновление последнего значения
    closeModal('lab-modal-2');
  } catch (error) {
    showError(volatileInput, errorSpans.value, 'Ошибка при отправке данных');
  } finally {
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
  }
});


// Инициализация данных при загрузке страницы
const tableBody = document.querySelector('.laboratory__table-tbody');
fetchLastData();
fetchLastDayData();

// Установка интервала для обновления данных каждые 30 секунд
setInterval(() => {
  fetchLastData();
}, 30000);
