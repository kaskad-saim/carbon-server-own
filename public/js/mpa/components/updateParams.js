export const updateMpa2Params = (data) => {
  const elements = {
    // Температуры
    'vrl-t-val': data?.temperatures?.['Температура верх регенератора левый МПА2'] || '-',
    'vrp-t-val': data?.temperatures?.['Температура верх регенератора правый МПА2'] || '-',
    'vbl-t-val': data?.temperatures?.['Температура верх ближний левый МПА2'] || '-',
    'vdl-t-val': data?.temperatures?.['Температура верх дальний левый МПА2'] || '-',
    'sbl-t-val': data?.temperatures?.['Температура середина ближняя левая МПА2'] || '-',
    'sdl-t-val': data?.temperatures?.['Температура середина дальняя левая МПА2'] || '-',
    'nbl-t-val': data?.temperatures?.['Температура низ ближний левый МПА2'] || '-',
    'ndl-t-val': data?.temperatures?.['Температура низ дальний левый МПА2'] || '-',
    'vrp-t-val': data?.temperatures?.['Температура верх регенератора правый МПА2'] || '-',
    'vbp-t-val': data?.temperatures?.['Температура верх ближний правый МПА2'] || '-',
    'vdp-t-val': data?.temperatures?.['Температура верх дальний правый МПА2'] || '-',
    'sbp-t-val': data?.temperatures?.['Температура середина ближняя правый МПА2'] || '-',
    'sdp-t-val': data?.temperatures?.['Температура середина дальняя правый МПА2'] || '-',
    'nbp-t-val': data?.temperatures?.['Температура низ ближний правый МПА2'] || '-',
    'ndp-t-val': data?.temperatures?.['Температура низ дальний правый МПА2'] || '-',
    'ks-t-val': data?.temperatures?.['Температура камера сгорания МПА2'] || '-',
    'db-t-val': data?.temperatures?.['Температура дымовой боров МПА2'] || '-',

    // Давления
    'db-p-val': data?.pressures?.['Разрежение Дымовой боров МПА2'] || '-',
    'vozduh-left-val': data?.pressures?.['Давление Воздух левый МПА2'] || '-',
    'vozduh-right-val': data?.pressures?.['Давление Воздух правый МПА2'] || '-',
    'nbl-p-val': data?.pressures?.['Давление низ ближний левый МПА2'] || '-',
    'nbp-p-val': data?.pressures?.['Давление низ ближний правый МПА2'] || '-',
    'sbl-p-val': data?.pressures?.['Давление середина ближняя левая МПА2'] || '-',
    'sbp-p-val': data?.pressures?.['Давление середина ближняя правая МПА2'] || '-',
    'sdl-p-val': data?.pressures?.['Давление середина дальняя левая МПА2'] || '-',
    'sdp-p-val': data?.pressures?.['Давление середина дальняя правая МПА2'] || '-',
    'vdl-p-val': data?.pressures?.['Давление верх дальний левая МПА2'] || '-',
    'vdp-p-val': data?.pressures?.['Давление верх дальний правая МПА2'] || '-',
  };

  // Обновляем значения в DOM
  for (const [selector, value] of Object.entries(elements)) {
    const element = document.querySelector(`.${selector}`);
    if (element) {
      element.textContent = value;
    }
  }
};