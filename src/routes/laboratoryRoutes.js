// laboratoryRoutes.js
import express from 'express';

import PechVr1LabModel from '../models/pechVr1LabData.js';
import PechVr2LabModel from '../models/pechVr2LabData.js';
import { PechMpa2LabModel, PechMpa3LabModel } from '../models/pechMpaLabData.js';

import {
  saveData,
  getLastData,
  getLastDayData,
  deleteRecord
} from '../utils/laboratory.js';

const router = express.Router();

// 1) Роуты для PechVr1
router.post('/pechVr1/submit', saveData(PechVr1LabModel));
router.get('/pechVr1/last', getLastData(PechVr1LabModel));
router.get('/pechVr1/last-day', getLastDayData(PechVr1LabModel));

// 2) Роуты для PechVr2
router.post('/pechVr2/submit', saveData(PechVr2LabModel));
router.get('/pechVr2/last', getLastData(PechVr2LabModel));
router.get('/pechVr2/last-day', getLastDayData(PechVr2LabModel));

// 3) Роуты для PechMpa2
router.post('/pechMpa2/submit', saveData(PechMpa2LabModel));
router.get('/pechMpa2/last', getLastData(PechMpa2LabModel));
router.get('/pechMpa2/last-day', getLastDayData(PechMpa2LabModel));

// 4) Роуты для PechMpa3
router.post('/pechMpa3/submit', saveData(PechMpa3LabModel));
router.get('/pechMpa3/last', getLastData(PechMpa3LabModel));
router.get('/pechMpa3/last-day', getLastDayData(PechMpa3LabModel));

// Универсальный роут для удаления записи из любой «печи»
router.delete('/delete/:pech/:id', deleteRecord);

export default router;
