// client.js
import { closeModal, openModal } from './components/modal.js';

// Определяем базовый URL для API в зависимости от окружения
const apiUrl =
  window.NODE_ENV === 'development' ? 'http://localhost:3002/api/lab' : 'http://169.254.0.156:3002/api/lab';

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
  [volatileInput, timeInput, passwordInput, valuePHInput, valueSUMInput].forEach((input) => {
    input.readOnly = isDisabled;
  });
};

// Функция для очистки ошибок
const clearErrors = () => {
  Object.values(errorSpans).forEach((span) => {
    span.textContent = '';
    span.classList.remove('active');
  });
  [volatileInput, timeInput, passwordInput, valuePHInput, valueSUMInput].forEach((input) => {
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
  for (let i = 0; i < 5; i++) {
    const cell = document.createElement('td');
    cell.textContent = 'Загрузка...';
    cell.classList.add('table__td', 'laboratory__table-td');
    row.appendChild(cell);
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
    showLastValueLoading();
    const data = await fetchData(`${apiUrl}/pechVr1/last`);
    if (data) setCellData(data);
    errorSpan.textContent = '';
    errorSpan.classList.remove('active');
    toggleInputs(false);
  } catch (error) {
    errorSpan.textContent = 'Нет связи';
    errorSpan.classList.add('active');
    toggleInputs(true);
  }
};

// Переменные для модальных окон
const tableModalId = 'lab-modal-1'; // ID модалки с таблицей
const passwordModalId = 'lab-modal-2'; // ID модалки с подтверждением пароля
let recordIdToDelete = null; // Переменная для хранения ID записи, которую нужно удалить

// Функция для создания строки таблицы с кнопкой удаления
const createTableRow = (recordDate, recordTime, value, valuePH, valueSUM, recordId) => {
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

  // Добавляем кнопку удаления
  const deleteButtonCell = createDeleteButton(recordId);
  row.appendChild(deleteButtonCell);

  return row;
};

// Функция для создания кнопки удаления
const createDeleteButton = (recordId) => {
  const cell = document.createElement('td');
  cell.classList.add('table__td', 'laboratory__table-td', 'laboratory__table-td-btn');

  const button = document.createElement('button');
  button.classList.add('delete-button', 'laboratory__table-td-btn-delete', 'btn-reset');
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 32 40" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6 6V8H0V12H3L5.01193 34.5336C5.28823 37.6282
       7.88123 40 10.9882 40H21.0118C24.1188 40 26.7118 37.6282 26.9881 34.5336L29 12H32V8H26V6C26 2.68629 23.3137
        0 20 0H12C8.68629 0 6 2.68629 6 6ZM12 4C10.8954 4 10 4.89543 10 6V8H22V6C22 4.89543 21.1046
        4 20 4H12Z" fill="#827F73"/>
    </svg>
  `;

  if (recordId) {
    button.addEventListener('click', () => confirmDelete(recordId));
  } else {
    button.disabled = true;
    button.title = 'ID записи отсутствует';
  }

  cell.appendChild(button);
  return cell;
};

// Обработчик кнопки удаления
const confirmDelete = (recordId) => {
  recordIdToDelete = recordId; // Сохраняем ID записи
  closeModal(tableModalId); // Закрываем модалку с таблицей
  openModal(passwordModalId); // Открываем модалку с паролем
};

// Элементы формы подтверждения удаления
const deleteForm = document.getElementById('delete-confirm-form');
const deletePasswordInput = document.getElementById('delete-password');
const deletePasswordErrorSpan = document.getElementById('error-delete-password');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

// Функция для отображения ошибки в форме удаления
const showDeleteFormError = (inputElement, errorSpan, message) => {
  errorSpan.textContent = message;
  errorSpan.classList.add('active');
  inputElement.classList.add('error');
};

// Обработчик формы подтверждения удаления
deleteForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  confirmDeleteBtn.disabled = true;

  // Очищаем предыдущие ошибки
  deletePasswordErrorSpan.textContent = '';
  deletePasswordErrorSpan.classList.remove('active');
  deletePasswordInput.classList.remove('error');

  const password = deletePasswordInput.value.trim();

  if (password === '123') {
    try {
      await fetch(`${apiUrl}/delete/pechVr1/${recordIdToDelete}`, { method: 'DELETE' });
      fetchLastDayData(); // Обновляем данные за последние сутки
      fetchLastData(); // Обновляем последние значения
      deletePasswordInput.value = ''; // Очищаем поле пароля
      closeModal(passwordModalId); // Закрываем модалку с паролем
      openModal(tableModalId); // Открываем модалку с таблицей
    } catch (error) {
      console.error('Ошибка при удалении записи:', error);
      showDeleteFormError(deletePasswordInput, deletePasswordErrorSpan, 'Ошибка при удалении записи');
    }
  } else {
    showDeleteFormError(deletePasswordInput, deletePasswordErrorSpan, 'Неверный пароль');
  }

  confirmDeleteBtn.disabled = false;
});

// Закрытие модалки с паролем по кнопке "Закрыть"
document.querySelector(`#${passwordModalId} .mnemo__modal-close`).addEventListener('click', () => {
  closeModal(passwordModalId);
  openModal(tableModalId);
});

// Закрытие модалки с таблицей по кнопке "Закрыть"
document.querySelector(`#${tableModalId} .mnemo__modal-close`).addEventListener('click', () => {
  closeModal(tableModalId);
});

// Функция для получения данных за последние 24 часа и обновления таблицы
const fetchLastDayData = async () => {
  try {
    tableBody.innerHTML = '';
    tableBody.appendChild(showLoadingMessage());
    const data = await fetchData(`${apiUrl}/pechVr1/last-day`);
    tableBody.innerHTML = '';

    if (data && data.length > 0) {
      data.forEach((item) => {
        const row = createTableRow(
          item.recordDate || '-',
          item.recordTime || '-',
          item.value || '-',
          item.valuePH || '-',
          item.valueSUM || '-',
          item._id // Убедитесь, что сервер возвращает _id
        );
        tableBody.appendChild(row);
      });
    } else {
      const row = createTableRow('-', '-', '-', '-', '-', null); // Передаем null, если ID нет
      tableBody.appendChild(row);
    }
    toggleInputs(false);
    errorSpan.textContent = '';
    errorSpan.classList.remove('active');
  } catch (error) {
    tableBody.innerHTML = '';
    const row = createTableRow('Нет связи', 'Нет связи', 'Нет связи', 'Нет связи', 'Нет связи', null);
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
    const data = await fetchData(`${apiUrl}/pechVr1/submit`, {
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
    setCellData(data);
    fetchLastDayData(); // Обновление таблицы за последние 24 часа
    fetchLastData(); // Обновление последнего значения
    closeModal('lab-modal-1');
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
