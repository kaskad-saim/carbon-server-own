import PechVr1LabModel from '../models/pechVr1LabData.js';
import PechVr2LabModel from '../models/pechVr2LabData.js';
import { PechMpa2LabModel, PechMpa3LabModel } from '../models/pechMpaLabData.js';

export const saveData = (Model) => async (req, res) => {
  try {
    const { value, valuePH, valueSUM, time } = req.body;

    if (!time) {
      return res.status(400).json({ message: 'Необходимо указать время' });
    }
    if (!value && !valuePH && !valueSUM) {
      return res.status(400).json({ message: 'Необходимо указать хотя бы одно значение' });
    }

    const date = new Date().toLocaleDateString('ru-RU');
    const newData = new Model({
      value: value ?? '-',
      valueTime: value ? time : '-',
      valueDate: value ? date : '-',

      valuePH: valuePH ?? '-',
      valuePHTime: valuePH ? time : '-',
      valuePHDate: valuePH ? date : '-',

      valueSUM: valueSUM ?? '-',
      valueSUMTime: valueSUM ? time : '-',
      valueSUMDate: valueSUM ? date : '-',

      recordTime: time,
      recordDate: date,
    });

    await newData.save();

    // После сохранения возвращаем «последние» непустые записи
    const lastValueData = await Model.findOne({ value: { $ne: '-' } }).sort({ createdAt: -1 }).lean();
    const lastValuePHData = await Model.findOne({ valuePH: { $ne: '-' } }).sort({ createdAt: -1 }).lean();
    const lastValueSUMData = await Model.findOne({ valueSUM: { $ne: '-' } }).sort({ createdAt: -1 }).lean();

    return res.json({
      message: 'Данные успешно сохранены',
      value: lastValueData?.value || '-',
      valueTime: lastValueData?.valueTime || '-',
      valueDate: lastValueData?.valueDate || '-',

      valuePH: lastValuePHData?.valuePH || '-',
      valuePHTime: lastValuePHData?.valuePHTime || '-',
      valuePHDate: lastValuePHData?.valuePHDate || '-',

      valueSUM: lastValueSUMData?.valueSUM || '-',
      valueSUMTime: lastValueSUMData?.valueSUMTime || '-',
      valueSUMDate: lastValueSUMData?.valueSUMDate || '-',
    });
  } catch (error) {
    console.error('Ошибка при сохранении данных:', error);
    return res.status(500).json({ message: 'Произошла ошибка при сохранении данных' });
  }
};

export const getLastData = (Model) => async (req, res) => {
  try {
    const lastValueData = await Model.findOne({ value: { $ne: '-' } }).sort({ createdAt: -1 }).lean();
    const lastValuePHData = await Model.findOne({ valuePH: { $ne: '-' } }).sort({ createdAt: -1 }).lean();
    const lastValueSUMData = await Model.findOne({ valueSUM: { $ne: '-' } }).sort({ createdAt: -1 }).lean();

    return res.json({
      value: lastValueData?.value || '-',
      valueTime: lastValueData?.valueTime || '-',
      valueDate: lastValueData?.valueDate || '-',

      valuePH: lastValuePHData?.valuePH || '-',
      valuePHTime: lastValuePHData?.valuePHTime || '-',
      valuePHDate: lastValuePHData?.valuePHDate || '-',

      valueSUM: lastValueSUMData?.valueSUM || '-',
      valueSUMTime: lastValueSUMData?.valueSUMTime || '-',
      valueSUMDate: lastValueSUMData?.valueSUMDate || '-',
    });
  } catch (error) {
    console.error('Ошибка при получении последних данных:', error);
    return res.status(500).json({ message: 'Произошла ошибка при получении данных' });
  }
};

export const getLastDayData = (Model) => async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const lastDayData = await Model
    .find({ createdAt: { $gte: twentyFourHoursAgo } })
    .sort({ createdAt: -1 })
    .lean();

    return res.json(
      lastDayData.map(item => ({
        _id: item._id,
        value: item.value || '-',
        valuePH: item.valuePH || '-',
        valueSUM: item.valueSUM || '-',
        recordTime: item.recordTime || '-',
        recordDate: item.recordDate || '-',
      }))
    );
  } catch (error) {
    console.error('Ошибка при получении данных за последние сутки:', error);
    return res.status(500).json({ message: 'Произошла ошибка при получении данных' });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const { pech, id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID записи не указан' });
    }

    let Model;
    switch (pech) {
      case 'pechvr1':
        Model = PechVr1LabModel;
        break;
      case 'pechvr2':
        Model = PechVr2LabModel;
        break;
      case 'pechmpa2':
        Model = PechMpa2LabModel;
        break;
      case 'pechmpa3':
        Model = PechMpa3LabModel;
        break;
      default:
        return res.status(400).json({ message: 'Неверный тип печи' });
    }

    const record = await Model.findByIdAndDelete(id);
    if (!record) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }
    return res.status(200).json({ message: 'Запись успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении записи:', error);
    return res.status(500).json({ message: 'Ошибка при удалении записи' });
  }
};
