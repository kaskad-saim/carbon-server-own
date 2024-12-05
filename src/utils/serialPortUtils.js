import { SerialPort } from 'serialport';
import { ReadlineParser } from 'serialport';

// Функция расчета CRC по одному байту
function CRCbit7Comm(crc7, byte) {
  for (let i = 0; i < 8; i++) {
    crc7 = (crc7 << 1) & 0xFF;
    if (byte & 1) {
      crc7 |= 1;
    }
    byte >>= 1;
    if (crc7 & 0x80) {
      crc7 ^= 0x89; // 0x89 = 0x80 + 0x09
    }
  }
  return crc7 & 0x7F;
}

// Функция расчета CRC для массива байтов
export function calcCrc(data) {
  let crc = 0;
  data.forEach(byte => {
    crc = CRCbit7Comm(crc, byte);
  });
  return crc;
}

// Генерация запроса для функции GetData
export function createGetDataRequest(index, address) {
  const header = [0x88, address, 0, 0, 0];
  header.push(calcCrc(header));

  const data = [0xC0, 0x1F, 0, 0, index, 0, 0, 0, 0, 0, 0];
  data.push(calcCrc(data));

  return [...header, ...data];
}

// Настройка COM-порта и парсера
export const comPort = new SerialPort({
  path: 'COM9', // Замените на нужный порт
  baudRate: 115200,
});

export const parser = comPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Функция отправки данных и обработки ответа
export function getData(index, address) {
  return new Promise((resolve, reject) => {
    const request = createGetDataRequest(index, address);
    const responseBuffer = [];

    const handleData = (data) => {
      responseBuffer.push(...Buffer.from(data));
      if (responseBuffer.length >= 12) {
        comPort.off('data', handleData);

        const crcReceived = responseBuffer.pop();
        const crcCalculated = calcCrc(responseBuffer);

        if (crcReceived !== crcCalculated) {
          reject(new Error('CRC mismatch'));
        } else {
          const buffer = Buffer.from(responseBuffer.slice(6, 10)); // Байты 6–9
          const value = buffer.readUInt32LE(); // Используем 32 бита (LE)
          resolve(value);
        }
      }
    };

    comPort.on('data', handleData);

    comPort.write(Buffer.from(request), (err) => {
      if (err) reject(err);
    });
  });
}