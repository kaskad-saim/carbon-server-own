// Функция для установки текущей даты в календарь
function setCurrentMonth() {
  const today = new Date();
  const monthString = today.toISOString().slice(0, 7); // Формат YYYY-MM
  document.getElementById('singleMonth').value = monthString;
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
  reportData.sort((a, b) => {
    const timeA = a.time === '24:00' ? [24, 0] : a.time.split(':').map(Number);
    const timeB = b.time === '24:00' ? [24, 0] : b.time.split(':').map(Number);
    return timeA[0] - timeB[0] || timeA[1] - timeB[1];
  });
  return reportData;
}

// Функция для загрузки данных и отображения их в таблице
async function loadDataForSelectedMonth() {
  const selectedMonth = document.getElementById('singleMonth').value;

  if (!selectedMonth) {
    alert('Пожалуйста, выберите месяц.');
    return;
  }

  document.getElementById('loadingWrapper').style.display = 'flex';

  try {
    const response = await fetch(`/api/reports/getReportDataMonth?month=${selectedMonth}`);
    const reportData = await response.json();

    const tableBody = document.querySelector('#reportTable tbody');
    tableBody.innerHTML = '';

    if (reportData && reportData.length > 0) {
      reportData.forEach((dayData) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="dynamic-report__report-cell">${dayData.day}</td>
          <td class="dynamic-report__report-cell">${dayData.DE093 === '-' ? '-' : dayData.DE093}</td>
          <td class="dynamic-report__report-cell">${dayData.DD972 === '-' ? '-' : dayData.DD972}</td>
          <td class="dynamic-report__report-cell">${dayData.DD973 === '-' ? '-' : dayData.DD973}</td>
          <td class="dynamic-report__report-cell">${dayData.DD576 === '-' ? '-' : dayData.DD576}</td>
          <td class="dynamic-report__report-cell">${dayData.DD569 === '-' ? '-' : dayData.DD569}</td>
          <td class="dynamic-report__report-cell">${dayData.DD923 === '-' ? '-' : dayData.DD923}</td>
          <td class="dynamic-report__report-cell">${dayData.DD924 === '-' ? '-' : dayData.DD924}</td>
        `;
        tableBody.appendChild(row);
      });

      // Добавляем строку с итогами
      const totals = calculateTotals(reportData);
      const totalRow = document.createElement('tr');

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
      row.innerHTML = `<td colspan="8" style="text-align:center;">Нет данных за выбранный месяц.</td>`;
      tableBody.appendChild(row);
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных за месяц:', error);
    alert('Произошла ошибка при загрузке данных. Попробуйте позже.');
  } finally {
    document.getElementById('loadingWrapper').style.display = 'none';
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
  setCurrentMonth(); // Устанавливаем текущую дату в календарь
  loadDataForSelectedMonth(); // Загружаем данные за текущий день
});

// Обработчик кнопки "Принять"
document.getElementById('confirmMonthBtn').addEventListener('click', loadDataForSelectedMonth);
