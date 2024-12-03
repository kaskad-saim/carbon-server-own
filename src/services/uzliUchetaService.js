import {
  imDD923Model,
  imDD924Model,
  imDD569Model,
  imDD576Model,
  imDD973Model,
  imDE093Model,
  imDD972Model,
} from '../models/uzliUchetaModel.js';

// Энергоресурсы МПА2
export const readDataDE093 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    const addresses = {
      'Гкал/ч DE093': 0x0004,
      'Температура DE093': 0x0006,
      'Давление DE093': 0x0008,
      'Куб/ч DE093': 0x000a,
      'Тонн/ч DE093': 0x000c,
      'Накопленно тонн DE093': 0x000e,
    };

    const roundingRules = {
      'Гкал/ч DE093': 1,
      'Температура DE093': 0,
      'Давление DE093': 2,
      'Куб/ч DE093': 0,
      'Тонн/ч DE093': 1,
      'Накопленно тонн DE093': 0,
    };

    const data = {};
    for (const [label, address] of Object.entries(addresses)) {
      try {
        const value = await modbusClient.readFloatBE(deviceID, address, deviceLabel); // Чтение значения с использованием readFloat
        const decimalPlaces = roundingRules[label]; // Получаем количество знаков для округления
        const roundedValue = parseFloat(value.toFixed(decimalPlaces)); // Округление в зависимости от правила
        data[label] = roundedValue;
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка чтения с адреса ${address} (${label}):`, error);
      }
    }

    const formattedData = {
      data,
      lastUpdated: new Date(),
    };

    await new imDE093Model(formattedData).save();
    // console.log(formattedData);
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};

// Энергоресурсы МПА3
export const readDataDD972 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    const addresses = {
      'Гкал/ч DD972': 0x0004,
      'Температура DD972': 0x0006,
      'Давление DD972': 0x0008,
      'Куб/ч DD972': 0x000a,
      'Тонн/ч DD972': 0x000c,
      'Накопленно тонн DD972': 0x000e,
    };

    const roundingRules = {
      'Гкал/ч DD972': 1,
      'Температура DD972': 0,
      'Давление DD972': 2,
      'Куб/ч DD972': 0,
      'Тонн/ч DD972': 1,
      'Накопленно тонн DD972': 0,
    };

    const data = {};
    for (const [label, address] of Object.entries(addresses)) {
      try {
        const value = await modbusClient.readFloatLE(deviceID, address, deviceLabel); // Чтение значения с использованием readFloat
        const decimalPlaces = roundingRules[label]; // Получаем количество знаков для округления
        const roundedValue = parseFloat(value.toFixed(decimalPlaces)); // Округление в зависимости от правила
        data[label] = roundedValue;
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка чтения с адреса ${address} (${label}):`, error);
      }
    }

    const formattedData = {
      data,
      lastUpdated: new Date(),
    };

    await new imDD972Model(formattedData).save();
    // console.log(formattedData);
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};

// Энергоресурсы МПА4
export const readDataDD973 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    const addresses = {
      'Гкал/ч DD973': 0x0004,
      'Температура DD973': 0x0006,
      'Давление DD973': 0x0008,
      'Куб/ч DD973': 0x000a,
      'Тонн/ч DD973': 0x000c,
      'Накопленно тонн DD973': 0x000e,
    };

    const roundingRules = {
      'Гкал/ч DD973': 1,
      'Температура DD973': 0,
      'Давление DD973': 2,
      'Куб/ч DD973': 0,
      'Тонн/ч DD973': 1,
      'Накопленно тонн DD973': 0,
    };

    const data = {};
    for (const [label, address] of Object.entries(addresses)) {
      try {
        const value = await modbusClient.readFloatLE(deviceID, address, deviceLabel); // Чтение значения с использованием readFloat
        const decimalPlaces = roundingRules[label]; // Получаем количество знаков для округления
        const roundedValue = parseFloat(value.toFixed(decimalPlaces)); // Округление в зависимости от правила
        data[label] = roundedValue;
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка чтения с адреса ${address} (${label}):`, error);
      }
    }

    const formattedData = {
      data,
      lastUpdated: new Date(),
    };

    await new imDD973Model(formattedData).save();
    // console.log(formattedData);
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};

// Энергоресурсы генерация CARBON к10в1
export const readDataDD576 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    const addresses = {
      'Гкал/ч DD576': 0x0004,
      'Температура DD576': 0x0006,
      'Давление DD576': 0x0008,
      'Куб/ч DD576': 0x000a,
      'Тонн/ч DD576': 0x000c,
      'Накопленно тонн DD576': 0x000e,
    };

    const roundingRules = {
      'Гкал/ч DD576': 1,
      'Температура DD576': 0,
      'Давление DD576': 2,
      'Куб/ч DD576': 0,
      'Тонн/ч DD576': 1,
      'Накопленно тонн DD576': 0,
    };

    const data = {};
    for (const [label, address] of Object.entries(addresses)) {
      try {
        const value = await modbusClient.readFloatLE(deviceID, address, deviceLabel); // Чтение значения с использованием readFloat
        const decimalPlaces = roundingRules[label]; // Получаем количество знаков для округления
        const roundedValue = parseFloat(value.toFixed(decimalPlaces)); // Округление в зависимости от правила
        data[label] = roundedValue;
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка чтения с адреса ${address} (${label}):`, error);
      }
    }

    const formattedData = {
      data,
      lastUpdated: new Date(),
    };

    await new imDD576Model(formattedData).save();
    // console.log(formattedData);
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};

// Энергоресурсов генерации от к265 к к10в1
export const readDataDD569 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    const addresses = {
      'Гкал/ч DD569': 0x0004,
      'Температура DD569': 0x0006,
      'Давление DD569': 0x0008,
      'Куб/ч DD569': 0x000a,
      'Тонн/ч DD569': 0x000c,
      'Накопленно тонн DD569': 0x000e,
    };

    const roundingRules = {
      'Гкал/ч DD569': 1,
      'Температура DD569': 0,
      'Давление DD569': 2,
      'Куб/ч DD569': 0,
      'Тонн/ч DD569': 1,
      'Накопленно тонн DD569': 0,
    };

    const data = {};
    for (const [label, address] of Object.entries(addresses)) {
      try {
        const value = await modbusClient.readFloatLE(deviceID, address, deviceLabel); // Чтение значения с использованием readFloat
        const decimalPlaces = roundingRules[label]; // Получаем количество знаков для округления
        const roundedValue = parseFloat(value.toFixed(decimalPlaces)); // Округление в зависимости от правила
        data[label] = roundedValue;
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка чтения с адреса ${address} (${label}):`, error);
      }
    }

    const formattedData = {
      data,
      lastUpdated: new Date(),
    };

    await new imDD569Model(formattedData).save();
    // console.log(formattedData);
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};

// Энергоресурсов генерации от котла-утилизатора 1
export const readDataDD923 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    const addresses = {
      'Гкал/ч DD923': 0x0004,
      'Температура DD923': 0x0006,
      'Давление DD923': 0x0008,
      'Куб/ч DD923': 0x000a,
      'Тонн/ч DD923': 0x000c,
      'Накопленно тонн DD923': 0x000e,
    };

    const roundingRules = {
      'Гкал/ч DD923': 1,
      'Температура DD923': 0,
      'Давление DD923': 2,
      'Куб/ч DD923': 0,
      'Тонн/ч DD923': 1,
      'Накопленно тонн DD923': 0,
    };

    const data = {};
    for (const [label, address] of Object.entries(addresses)) {
      try {
        const value = await modbusClient.readFloatLE(deviceID, address, deviceLabel); // Чтение значения с использованием readFloat
        const decimalPlaces = roundingRules[label]; // Получаем количество знаков для округления
        const roundedValue = parseFloat(value.toFixed(decimalPlaces)); // Округление в зависимости от правила
        data[label] = roundedValue;
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка чтения с адреса ${address} (${label}):`, error);
      }
    }

    const formattedData = {
      data,
      lastUpdated: new Date(),
    };

    await new imDD923Model(formattedData).save();
    // console.log(formattedData);
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};

// Энергоресурсов генерации от котла-утилизатора 2
export const readDataDD924 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    const addresses = {
      'Гкал/ч DD924': 0x0004,
      'Температура DD924': 0x0006,
      'Давление DD924': 0x0008,
      'Куб/ч DD924': 0x000a,
      'Тонн/ч DD924': 0x000c,
      'Накопленно тонн DD924': 0x000e,
    };

    const roundingRules = {
      'Гкал/ч DD924': 1,
      'Температура DD924': 0,
      'Давление DD924': 2,
      'Куб/ч DD924': 0,
      'Тонн/ч DD924': 1,
      'Накопленно тонн DD924': 0,
    };

    const data = {};
    for (const [label, address] of Object.entries(addresses)) {
      try {
        const value = await modbusClient.readFloatLE(deviceID, address, deviceLabel); // Чтение значения с использованием readFloat
        const decimalPlaces = roundingRules[label]; // Получаем количество знаков для округления
        const roundedValue = parseFloat(value.toFixed(decimalPlaces)); // Округление в зависимости от правила
        data[label] = roundedValue;
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка чтения с адреса ${address} (${label}):`, error);
      }
    }

    const formattedData = {
      data,
      lastUpdated: new Date(),
    };

    await new imDD924Model(formattedData).save();
    // console.log(formattedData);
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};
