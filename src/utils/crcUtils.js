// Рассчет CRC для 7-битной контрольной суммы
function CRCbit7Comm(crc7, byte) {
  for (let i = 0; i < 8; i++) {
    crc7 = (crc7 << 1) & 0xFF; // Сдвиг CRC влево
    if (byte & 1) {           // Проверяем младший бит байта
      crc7 |= 1;              // Устанавливаем младший бит CRC
    }
    byte >>= 1;               // Сдвиг байта вправо
    if (crc7 & 0x80) {        // Если старший бит установлен
      crc7 ^= 0x89;           // XOR с полиномом
    }
  }
  return crc7 & 0x7F; // Возвращаем только 7 младших бит
}

// Основная функция расчета CRC для массива данных
export function calcCrc(data) {
  return data.reduce((crc, byte) => CRCbit7Comm(crc, byte), 0);
}

// Создание запроса данных для конкретного индекса и адреса
export function createGetDataRequest(index, address) {
  // Заголовок запроса (5 байт)
  const header = [0x88, address, 0, 0, 0];
  const headerCrc = calcCrc(header); // CRC для заголовка
  header.push(headerCrc);

  // Данные запроса (11 байт)
  const data = [0xC0, 0x1F, 0, 0, index, 0, 0, 0, 0, 0, 0];
  const dataCrc = calcCrc(data); // CRC для данных
  data.push(dataCrc);

  // Возвращаем полный запрос
  return [...header, ...data];
}
