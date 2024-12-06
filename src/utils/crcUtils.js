function CRCbit7Comm(crc7, byte) {
  for (let i = 0; i < 8; i++) {
    crc7 = (crc7 << 1) & 0xFF;
    if (byte & 1) {
      crc7 |= 1;
    }
    byte >>= 1;
    if (crc7 & 0x80) {
      crc7 ^= 0x89;
    }
  }
  return crc7 & 0x7F;
}

export function calcCrc(data) {
  let crc = 0;
  data.forEach(byte => {
    crc = CRCbit7Comm(crc, byte);
  });
  return crc;
}

export function createGetDataRequest(index, address) {
  const header = [0x88, address, 0, 0, 0];
  header.push(calcCrc(header));

  const data = [0xC0, 0x1F, 0, 0, index, 0, 0, 0, 0, 0, 0];
  data.push(calcCrc(data));

  return [...header, ...data];
}
