// Функция для установки текущей даты в календарь
function setCurrentDate() {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // Формат YYYY-MM-DD
  document.getElementById('singleDate').value = dateString;
}

// Функция для обновления заголовка с датой отчета
function updateReportDateHeader(date) {
  const formattedDate = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const reportDate = formattedDate.toLocaleDateString('ru-RU', options);
  document.getElementById('reportDate').innerText = reportDate;
}

// Функция для получения метки временного слота
function getSlotLabel(time, now) {
  const [hour, minute] = time.split(':').map(Number);
  const entryDate = new Date(now);
  entryDate.setHours(hour, minute, 0, 0);

  // Если время меньше текущего часа, увеличиваем час на 1 и устанавливаем минуты на 00
  if (hour < now.getHours()) {
    const slotDate = new Date(entryDate);
    slotDate.setHours(slotDate.getHours() + 1);
    slotDate.setMinutes(0, 0, 0);
    return slotDate.toTimeString().split(' ')[0].substring(0, 5);
  }

  // Если время в текущем часе, используем текущее время
  if (hour === now.getHours()) {
    return now.toTimeString().split(' ')[0].substring(0, 5);
  }

  // Для остальных случаев (например, если данные из будущего) возвращаем оригинальное время
  return time;
}

// Модифицированная функция для перераспределения данных по временным слотам
function formatDataByTimeSlot(reportData) {
  const formattedData = [];
  const now = new Date();

  reportData.forEach((timeData) => {
    const originalTime = timeData.time; // Формат "HH:MM"
    const slotLabel = getSlotLabel(originalTime, now);

    // Находим или создаем запись для соответствующего временного слота
    let existingData = formattedData.find((item) => item.time === slotLabel);

    // Если записи нет — создаем ее
    if (!existingData) {
      existingData = {
        time: slotLabel,
        DE093: timeData.DE093,
        DD972: timeData.DD972,
        DD973: timeData.DD973,
        DD576: timeData.DD576,
        DD569: timeData.DD569,
        DD923: timeData.DD923,
        DD924: timeData.DD924,
      };
      formattedData.push(existingData);
    } else {
      // Если запись уже есть, обновляем ее
      existingData.DE093 = timeData.DE093 === '-' ? existingData.DE093 : timeData.DE093;
      existingData.DD972 = timeData.DD972 === '-' ? existingData.DD972 : timeData.DD972;
      existingData.DD973 = timeData.DD973 === '-' ? existingData.DD973 : timeData.DD973;
      existingData.DD576 = timeData.DD576 === '-' ? existingData.DD576 : timeData.DD576;
      existingData.DD569 = timeData.DD569 === '-' ? existingData.DD569 : timeData.DD569;
      existingData.DD923 = timeData.DD923 === '-' ? existingData.DD923 : timeData.DD923;
      existingData.DD924 = timeData.DD924 === '-' ? existingData.DD924 : timeData.DD924;
    }
  });

  // Сортируем данные по времени
  formattedData.sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    return timeA[0] - timeB[0] || timeA[1] - timeB[1];
  });

  return formattedData;
}

// Функция для загрузки данных и отображения их в таблице
async function loadDataForSelectedDate() {
  const selectedDate = document.getElementById('singleDate').value;

  if (!selectedDate) {
    alert('Пожалуйста, выберите дату.');
    return;
  }

  try {
    const response = await fetch(`/api/reports/getReportData?date=${selectedDate}`);
    let reportData = await response.json();

    // Получаем текущую дату и время
    const now = new Date();
    const currentDateString = now.toISOString().split('T')[0];
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    // Если выбранная дата — сегодня, фильтруем данные до текущего времени
    if (selectedDate === currentDateString) {
      reportData = reportData.filter((entry) => {
        const [hour, minute] = entry.time.split(':').map(Number);
        const entryTimeInMinutes = hour * 60 + minute;
        return entryTimeInMinutes <= currentTimeInMinutes;
      });
    } else {
      // Для всех остальных дней, оставляем все данные
      if (!reportData.some((item) => item.time === '23:59')) {
        reportData.push({
          time: '23:59',
          DE093: '-',
          DD972: '-',
          DD973: '-',
          DD576: '-',
          DD569: '-',
          DD923: '-',
          DD924: '-',
        });
      }
    }

    // Форматируем данные по временным слотам
    const formattedData = formatDataByTimeSlot(reportData);

    const tableBody = document.querySelector('#reportTable tbody');
    tableBody.innerHTML = ''; // Очистить таблицу

    if (formattedData && formattedData.length > 0) {
      formattedData.forEach((timeData) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="dynamic-report__report-cell">${timeData.time}</td>
          <td class="dynamic-report__report-cell">${timeData.DE093 === '-' ? '-' : timeData.DE093}</td>
          <td class="dynamic-report__report-cell">${timeData.DD972 === '-' ? '-' : timeData.DD972}</td>
          <td class="dynamic-report__report-cell">${timeData.DD973 === '-' ? '-' : timeData.DD973}</td>
          <td class="dynamic-report__report-cell">${timeData.DD576 === '-' ? '-' : timeData.DD576}</td>
          <td class="dynamic-report__report-cell">${timeData.DD569 === '-' ? '-' : timeData.DD569}</td>
          <td class="dynamic-report__report-cell">${timeData.DD923 === '-' ? '-' : timeData.DD923}</td>
          <td class="dynamic-report__report-cell">${timeData.DD924 === '-' ? '-' : timeData.DD924}</td>
        `;
        tableBody.appendChild(row);
      });

      // Добавление строки с итогами
      const totals = calculateTotals(formattedData);
      const totalRow = document.createElement('tr');

      // Добавляем стиль для ячейки с текстом "Итого"
      const totalLabelCell = document.createElement('td');
      totalLabelCell.classList.add('dynamic-report__report-cell');
      totalLabelCell.style.fontWeight = 'bold';
      totalLabelCell.style.backgroundColor = 'green'; // Зеленый цвет для ячейки "Итого"
      totalLabelCell.style.color = 'white'; // Белый текст
      totalLabelCell.textContent = 'Итого';
      totalRow.appendChild(totalLabelCell);

      // Для остальных ячеек устанавливаем разные цвета
      const colorClasses = [
        'yellow',
        'yellow',
        'yellow',
        'yellow',
        'yellow',
        'yellow',
        'yellow',
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

      // Создаем ячейки с итоговыми значениями и окрашиваем их
      totalsValues.forEach((value, index) => {
        const cell = document.createElement('td');
        cell.classList.add('dynamic-report__report-cell');
        cell.style.backgroundColor = colorClasses[index]; // Применяем разные цвета
        cell.textContent = value;
        totalRow.appendChild(cell);
      });

      tableBody.appendChild(totalRow);
    } else {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="8" style="text-align:center;">Нет данных за выбранную дату.</td>`;
      tableBody.appendChild(row);
    }

    // Обновляем заголовок с датой
    updateReportDateHeader(selectedDate);
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    alert('Произошла ошибка при загрузке данных. Попробуйте позже.');
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

// Загрузка данных за текущую дату при загрузке страницы
window.addEventListener('load', () => {
  setCurrentDate(); // Устанавливаем текущую дату в календарь
  loadDataForSelectedDate(); // Загружаем данные за текущий день
});

// Обработчик нажатия кнопки "Принять"
document.getElementById('confirmDateBtn').addEventListener('click', loadDataForSelectedDate);
