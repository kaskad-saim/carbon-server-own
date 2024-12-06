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

router.get('/web-vizual-simulator', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/', 'web-vizual-simulator.html'));
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

router.get('/graph-vr-general-notis', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/pechiVr/graphics/', 'vrGeneralNotis.html'));
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

router.get('/graph-sushilki-general-temper', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/sushilki/graphics/', 'sushilkiGeneralTemper.html'));
});

router.get('/graph-sushilki-general-pressure', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/sushilki/graphics/', 'sushilkaGeneralPressure.html'));
});

router.get('/currentParam-gorelki', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/gorelki/', 'currentParam-gorelki.html'));
});

router.get('/current-melnizi', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/melnizi/', 'current-melnizi.html'));
});

router.get('/current-k296', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/k296/', 'current-k296.html'));
});

router.get('/mnemo-k296', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/k296/', 'mnemo-k296.html'));
});

router.get('/mnemo-mpa2', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/mpa/', 'mnemo-mpa-2.html'));
});

router.get('/current-mpa2', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/mpa/', 'current-mpa-2.html'));
});

router.get('/mnemo-mpa3', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/mpa/', 'mnemo-mpa-3.html'));
});

router.get('/current-mpa3', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/mpa/', 'current-mpa-3.html'));
});

router.get('/current-resources', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/energy-resources/', 'currentParam-resources.html'));
});

router.get('/graph-mpa-general', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/mpa/graphics', 'mpaGeneralGraphics.html'));
});

router.get('/report-resources-day', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/energy-resources/', 'report-resources-day.html'));
});

router.get('/report-resources-month', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/production/carbon/energy-resources/', 'report-resources-month.html'));
});



export default router;
