export const colors = [
  'rgba(54, 162, 235, 1)',
  'rgba(255, 99, 132, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(255, 205, 86, 1)',
  'rgba(201, 203, 207, 1)',
  'rgba(255, 159, 64, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 99, 71, 1)',
  'rgba(0, 255, 0, 1)',
  'rgba(0, 255, 255, 1)',
  'rgba(255, 20, 147, 1)',
  'rgba(139, 69, 19, 1)',
  'rgba(128, 0, 128, 1)',
  'rgba(0, 0, 255, 1)',
];

export function createCrosshairPlugin() {
  return {
    id: 'crosshair',
    afterInit(chart) {
      // Инициализируем координаты прицела
      chart.crosshair = {
        x: null,
        y: null,
      };

      // Обновляем координаты прицела при движении мыши
      chart.canvas.addEventListener('mousemove', (event) => {
        const rect = chart.canvas.getBoundingClientRect();
        chart.crosshair.x = event.clientX - rect.left;
        chart.crosshair.y = event.clientY - rect.top;
        chart.draw(); // Перерисовываем график для обновления прицела
      });

      // Скрываем прицел, когда мышь покидает область графика
      chart.canvas.addEventListener('mouseout', () => {
        chart.crosshair.x = null;
        chart.crosshair.y = null;
        chart.draw(); // Перерисовываем график для удаления прицела
      });
    },
    afterDraw(chart) {
      const {
        ctx,
        chartArea: { left, right, top, bottom },
      } = chart;
      const x = chart.crosshair.x;
      const y = chart.crosshair.y;

      if (x !== null && y !== null) {
        // Убедимся, что прицел рисуется только внутри области графика
        if (x >= left && x <= right && y >= top && y <= bottom) {
          ctx.save();
          ctx.beginPath();
          // Рисуем вертикальную линию
          ctx.moveTo(x, top);
          ctx.lineTo(x, bottom);
          // Рисуем горизонтальную линию
          ctx.moveTo(left, y);
          ctx.lineTo(right, y);
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'; // Настройте цвет и прозрачность по необходимости
          ctx.stroke();
          ctx.restore();
        }
      }
    },
  };
}

export function chartAreaBorderPlugin() {
  return {
    id: 'chartAreaBorder',
    beforeDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart;
      ctx.save();
      ctx.strokeStyle = options.borderColor;
      ctx.lineWidth = options.borderWidth;
      ctx.setLineDash(options.borderDash || []);
      ctx.lineDashOffset = options.borderDashOffset;
      ctx.strokeRect(left, top, width, height);
      ctx.restore();
    },
  };
}
