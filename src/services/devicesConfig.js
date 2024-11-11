// services/devicesConfig.js
export const devicesConfig = [
  {
    name: 'VR1',
    deviceID: 3,
    port: 'COM8',
    readDataFunction: 'readDataVr1',
    serviceModule: './services/pechVr1ModbusService.js',
  },
  {
    name: 'VR2',
    deviceID: 4,
    port: 'COM8',
    readDataFunction: 'readDataVr2',
    serviceModule: './services/pechVr2ModbusService.js',
  },
  {
    name: 'Sushilka1',
    deviceID: 1,
    port: 'COM3',
    readDataFunction: 'readDataSushilka1',
    serviceModule: './services/sushilka1ModbusService.js',
  },
  {
    name: 'Sushilka2',
    deviceID: 2,
    port: 'COM3',
    readDataFunction: 'readDataSushilka2',
    serviceModule: './services/sushilka2ModbusService.js',
  },
];
