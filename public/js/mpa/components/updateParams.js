export const updateMpa2Params = (data) => {
  const elements = {
    // Температуры
    'vrl-t-val': data?.temperatures?.['Температура верх регенератора левый МПА2'] ?? '-',
    'vrp-t-val': data?.temperatures?.['Температура верх регенератора правый МПА2'] ?? '-',
    'vbl-t-val': data?.temperatures?.['Температура верх ближний левый МПА2'] ?? '-',
    'vdl-t-val': data?.temperatures?.['Температура верх дальний левый МПА2'] ?? '-',
    'sbl-t-val': data?.temperatures?.['Температура середина ближняя левый МПА2'] ?? '-',
    'sdl-t-val': data?.temperatures?.['Температура середина дальняя левый МПА2'] ?? '-',
    'nbl-t-val': data?.temperatures?.['Температура низ ближний левый МПА2'] ?? '-',
    'ndl-t-val': data?.temperatures?.['Температура низ дальний левый МПА2'] ?? '-',
    'vbp-t-val': data?.temperatures?.['Температура верх ближний правый МПА2'] ?? '-',
    'vdp-t-val': data?.temperatures?.['Температура верх дальний правый МПА2'] ?? '-',
    'sbp-t-val': data?.temperatures?.['Температура середина ближняя правый МПА2'] ?? '-',
    'sdp-t-val': data?.temperatures?.['Температура середина дальняя правый МПА2'] ?? '-',
    'nbp-t-val': data?.temperatures?.['Температура низ ближний правый МПА2'] ?? '-',
    'ndp-t-val': data?.temperatures?.['Температура низ дальний правый МПА2'] ?? '-',
    'ks-t-val': data?.temperatures?.['Температура камера сгорания МПА2'] ?? '-',
    'db-t-val': data?.temperatures?.['Температура дымовой боров МПА2'] ?? '-',

    // Давления
    'db-p-val': data?.pressures?.['Разрежение дымовой боров МПА2'] ?? '-',
    'vozduh-left-val': data?.pressures?.['Давление воздух левый МПА2'] ?? '-',
    'vozduh-right-val': data?.pressures?.['Давление воздух правый МПА2'] ?? '-',
    'nbl-p-val': data?.pressures?.['Давление низ ближний левый МПА2'] ?? '-',
    'nbp-p-val': data?.pressures?.['Давление низ ближний правый МПА2'] ?? '-',
    'sbl-p-val': data?.pressures?.['Давление середина ближняя левый МПА2'] ?? '-',
    'sbp-p-val': data?.pressures?.['Давление середина ближняя правый МПА2'] ?? '-',
    'sdl-p-val': data?.pressures?.['Давление середина дальняя левый МПА2'] ?? '-',
    'sdp-p-val': data?.pressures?.['Давление середина дальняя правый МПА2'] ?? '-',
    'vdl-p-val': data?.pressures?.['Давление верх дальний левый МПА2'] ?? '-',
    'vdp-p-val': data?.pressures?.['Давление верх дальний правый МПА2'] ?? '-',
  };

  // Обновляем значения в DOM
  for (const [selector, value] of Object.entries(elements)) {
    const element = document.querySelector(`.${selector}`);
    if (element) {
      element.textContent = value;
    }
  }
};

export const updateMpa3Params = (data) => {
  const elements = {
    // Температуры
    'vrl-t-val': data?.temperatures?.['Температура верх регенератора левый МПА3'] ?? '-',
    'vrp-t-val': data?.temperatures?.['Температура верх регенератора правый МПА3'] ?? '-',
    'vbl-t-val': data?.temperatures?.['Температура верх ближний левый МПА3'] ?? '-',
    'vdl-t-val': data?.temperatures?.['Температура верх дальний левый МПА3'] ?? '-',
    'sbl-t-val': data?.temperatures?.['Температура середина ближняя левый МПА3'] ?? '-',
    'sdl-t-val': data?.temperatures?.['Температура середина дальняя левый МПА3'] ?? '-',
    'nbl-t-val': data?.temperatures?.['Температура низ ближний левый МПА3'] ?? '-',
    'ndl-t-val': data?.temperatures?.['Температура низ дальний левый МПА3'] ?? '-',
    'vbp-t-val': data?.temperatures?.['Температура верх ближний правый МПА3'] ?? '-',
    'vdp-t-val': data?.temperatures?.['Температура верх дальний правый МПА3'] ?? '-',
    'sbp-t-val': data?.temperatures?.['Температура середина ближняя правый МПА3'] ?? '-',
    'sdp-t-val': data?.temperatures?.['Температура середина дальняя правый МПА3'] ?? '-',
    'nbp-t-val': data?.temperatures?.['Температура низ ближний правый МПА3'] ?? '-',
    'ndp-t-val': data?.temperatures?.['Температура низ дальний правый МПА3'] ?? '-',
    'ks-t-val': data?.temperatures?.['Температура камера сгорания МПА3'] ?? '-',
    'db-t-val': data?.temperatures?.['Температура дымовой боров МПА3'] ?? '-',

    // Давления
    'db-p-val': data?.pressures?.['Разрежение дымовой боров МПА3'] ?? '-',
    'vozduh-left-val': data?.pressures?.['Давление воздух левый МПА3'] ?? '-',
    'vozduh-right-val': data?.pressures?.['Давление воздух правый МПА3'] ?? '-',
    'nbl-p-val': data?.pressures?.['Давление низ ближний левый МПА3'] ?? '-',
    'nbp-p-val': data?.pressures?.['Давление низ ближний правый МПА3'] ?? '-',
    'sbl-p-val': data?.pressures?.['Давление середина ближняя левый МПА3'] ?? '-',
    'sbp-p-val': data?.pressures?.['Давление середина ближняя правый МПА3'] ?? '-',
    'sdl-p-val': data?.pressures?.['Давление середина дальняя левый МПА3'] ?? '-',
    'sdp-p-val': data?.pressures?.['Давление середина дальняя правый МПА3'] ?? '-',
    'vdl-p-val': data?.pressures?.['Давление верх дальний левый МПА3'] ?? '-',
    'vdp-p-val': data?.pressures?.['Давление верх дальний правый МПА3'] ?? '-',
  };

  // Обновляем значения в DOM
  for (const [selector, value] of Object.entries(elements)) {
    const element = document.querySelector(`.${selector}`);
    if (element) {
      element.textContent = value;
    }
  }
};