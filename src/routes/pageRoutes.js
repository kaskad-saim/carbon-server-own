import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Определяем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Обновленные маршруты для страниц
router.get('/mnemo-pech-vr-1', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/pechiVr', 'mnemo-pech-vr-1.html'));
});

router.get('/current-pech-vr-1', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/pechiVr', 'current-pech-vr-1.html'));
});

router.get('/mnemo-pech-vr-2', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/pechiVr', 'mnemo-pech-vr-2.html'));
});

router.get('/current-pech-vr-2', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/pechiVr', 'current-pech-vr-2.html'));
});

router.get('/web-vizual', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/', 'web-vizual.html'));
});

router.get('/graph-vr-general-tempers', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/pechiVr/graphics', 'vrGeneralTemper.html'));
});

router.get('/graph-vr-general-pressure', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/pechiVr/graphics', 'vrGeneralPressure.html'));
});

router.get('/graph-vr-general-level', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/pechiVr/graphics', 'vrGeneralLevel.html'));
});

router.get('/mnemo-sushilka1', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/sushilki/', 'mnemo-sushilka1.html'));
});

router.get('/mnemo-sushilka2', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/sushilki/', 'mnemo-sushilka2.html'));
});

router.get('/currentParam-sushilka1', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/sushilki/', 'currentParam-sushilka1.html'));
});

router.get('/currentParam-sushilka2', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/sushilki/', 'currentParam-sushilka2.html'));
});


router.get('/currentParam-gorelki', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/gorelki/', 'currentParam-gorelki.html'));
});

export default router;
