import { closeModal } from './components/modal.js';

// Элементы формы и таблицы
const form = document.querySelector('.laboratory__form');
const volatileInput = document.getElementById('volatile-substances');
const timeInput = document.getElementById('input-time');
const passwordInput = document.getElementById('volatile-substances-password');

const dateCell = document.querySelector('.laboratory__table-td--mnemo-date');
const timeCell = document.querySelector('.laboratory__table-td--mnemo-time');
const valueCell = document.querySelector('.laboratory__table-td--mnemo-val');

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

// Установка данных в ячейки
const setCellData = (value, time, date) => {
  valueCell.textContent = value ?? 'Нет данных';
  timeCell.textContent = time ?? 'Нет данных';
  dateCell.textContent = date ?? 'Нет данных';
};

// Функция для показа прелоудера "Данные загружаются"
const showLoadingMessage = () => {
  const row = document.createElement('tr');
  row.classList.add('table__tr');

  const createLoadingCell = () => {
    const cell = document.createElement('td');
    cell.textContent = 'Загрузка...';
    cell.classList.add('table__td', 'table__left', 'laboratory__table-td');
    return cell;
  };

  // Добавляем 3 ячейки с текстом "Данные загружаются"
  row.appendChild(createLoadingCell());
  row.appendChild(createLoadingCell());
  row.appendChild(createLoadingCell());

  return row;
};

// Функция для показа прелоудера для последнего загруженного значения
const showLastValueLoading = () => {
  valueCell.textContent = 'Загрузка...';
  timeCell.textContent = 'Загрузка...';
  dateCell.textContent = 'Загрузка...';
};

// Функция для получения последних данных
const fetchLastData = async () => {
  try {
    showLastValueLoading(); // Показываем прелоудер для последнего значения
    const data = await fetchData('http://169.254.0.156:3000/pechVr1/last');
    if (data) {
      setCellData(data.value, data.time, data.date);
    } else {
      setCellData();
    }
    toggleInputs(false);
    errorSpan.textContent = '';
    errorSpan.classList.remove('active');
  } catch (error) {
    setCellData('Нет связи', 'Нет связи', 'Нет связи');
    errorSpan.textContent = 'Нет связи';
    errorSpan.classList.add('active');
    toggleInputs(true);
  }
};

// Функция для создания строки таблицы
const createTableRow = (dateText, timeText, valueText) => {
  const row = document.createElement('tr');
  row.classList.add('table__tr');

  const createCell = (text, classes = []) => {
    const cell = document.createElement('td');
    cell.textContent = text;
    cell.classList.add('table__td', ...classes);
    return cell;
  };

  row.appendChild(createCell(dateText, ['table__left', 'laboratory__table-td']));
  row.appendChild(createCell(timeText, ['table__left', 'laboratory__table-td']));
  row.appendChild(createCell(valueText, ['table__right', 'laboratory__table-td']));

  return row;
};

// Функция для получения данных за последние 24 часа и обновления таблицы
const fetchLastDayData = async () => {
  try {
    tableBody.innerHTML = '';  // Очищаем таблицу
    tableBody.appendChild(showLoadingMessage()); // Показываем прелоудер

    const data = await fetchData('http://169.254.0.156:3000/pechVr1/last-day');
    tableBody.innerHTML = ''; // Очищаем перед добавлением данных

    if (data && data.length > 0) {
      data.forEach((item) => {
        const row = createTableRow(item.date || 'Нет данных', item.time || 'Нет данных', item.value || 'Нет данных');
        tableBody.appendChild(row);
      });
    } else {
      const row = createTableRow('Нет данных', 'Нет данных', 'Нет данных');
      tableBody.appendChild(row);
    }
    toggleInputs(false);
    errorSpan.textContent = '';
    errorSpan.classList.remove('active');
  } catch (error) {
    tableBody.innerHTML = '';
    const row = createTableRow('Нет связи', 'Нет связи', 'Нет связи');
    tableBody.appendChild(row);
    errorSpan.textContent = 'Нет связи';
    errorSpan.classList.add('active');
    toggleInputs(true);
  }
};

// Обработчик отправки формы
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Получаем значения из полей ввода
  let value = volatileInput.value.trim();
  let time = timeInput.value.trim();
  const password = passwordInput.value.trim();

  // Очистка ошибок перед новой проверкой
  clearErrors();

  // Валидация данных
  if (!value) {
    showError(volatileInput, errorSpans.value, 'Введите значение');
    return;
  }
  if (!time) {
    showError(timeInput, errorSpans.time, 'Введите время');
    return;
  }
  value = value.replace(',', '.');
  const numericValue = parseFloat(value);
  if (isNaN(numericValue) || numericValue < 0 || numericValue > 16) {
    showError(volatileInput, errorSpans.value, 'Введите число от 0 до 16');
    return;
  }
  if (password !== '123') {
    showError(passwordInput, errorSpans.password, 'Неверный пароль');
    return;
  }

  // Отправка данных на сервер
  try {
    const data = await fetchData('http://169.254.0.156:3000/pechVr1/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: numericValue.toString(), time }),
    });

    // Очистка полей ввода
    volatileInput.value = '';
    timeInput.value = '';
    passwordInput.value = '';
    clearErrors();

    // Обновление таблиц
    setCellData(data.value, data.time, data.date);
    fetchLastDayData();
    closeModal('lab-modal-1');
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('Сетевая ошибка')) {
      showError(volatileInput, errorSpans.value, 'Нет связи');
      toggleInputs(true);
    } else {
      showError(volatileInput, errorSpans.value, 'Ошибка при отправке данных');
    }
  }
});

// Инициализация данных при загрузке страницы
const tableBody = document.querySelector('.laboratory__table-tbody');
fetchLastData();
fetchLastDayData();
