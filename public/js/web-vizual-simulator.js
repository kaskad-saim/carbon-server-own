document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-container__button');
  const subTabs = document.querySelectorAll('.sub-tab-button');

  const adjustIframeHeight = () => {
    const iframes = document.querySelectorAll('.iframe-container iframe');
    const height = window.innerHeight - 150;
    iframes.forEach((iframe) => {
      iframe.style.height = `${height}px`;
    });
  };

  adjustIframeHeight();
  window.addEventListener('resize', adjustIframeHeight);

  // Основные вкладки
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-content').forEach((content) => content.classList.remove('tab-content--active'));
      tabs.forEach((button) => button.classList.remove('tab-container__button--active'));

      const tabId = tab.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('tab-content--active');
      tab.classList.add('tab-container__button--active');

      // Устанавливаем начальный URL во фрейм при переключении основной вкладки
      const iframe = document.querySelector(`#${tabId} iframe`);
      let defaultUrl;

      if (tabId === 'carbonization-1') {
        defaultUrl = '../production/carbon/pechiVr/mnemo-pech-vr-1.html';
      } else if (tabId === 'carbonization-2') {
        defaultUrl = '../production/carbon/pechiVr/mnemo-pech-vr-2.html';
      } else if (tabId === 'sushilka-1') {
        defaultUrl = '../production/carbon/sushilki/mnemo-sushilka1.html';
      } else if (tabId === 'sushilka-2') {
        defaultUrl = '../production/carbon/sushilki/mnemo-sushilka2.html';
      } else if (tabId === 'mpa-2') {
        defaultUrl = '../production/carbon/mpa/mnemo-mpa-2.html';
      } else if (tabId === 'mpa-3') {
        defaultUrl = '../production/carbon/mpa/mnemo-mpa-3.html';
      } else if (tabId === 'mills') {
        defaultUrl = '../production/carbon/melnizi/current-melnizi.html';
      } else if (tabId === 'reactor-296') {
        defaultUrl = '../production/carbon/k296/mnemo-k296.html';
      } else if (tabId === 'energy-resources') {
        defaultUrl = '../production/carbon/energy-resources/currentParam-resources.html'
      }
      iframe.src = defaultUrl;

      // Обновляем состояние активной под-вкладки
      const activeTab = document.getElementById(tabId);
      activeTab.querySelectorAll('.sub-tab-button').forEach((btn) => btn.classList.remove('sub-tab-button--active'));

      const activeSubTabButton = activeTab.querySelector(`.sub-tab-button[data-url="${defaultUrl}"]`);
      if (activeSubTabButton) {
        activeSubTabButton.classList.add('sub-tab-button--active');
      }
    });
  });

  // Под-вкладки
  subTabs.forEach((button) => {
    button.addEventListener('click', () => {
      const activeTab = document.querySelector('.tab-content.tab-content--active');
      const iframe = activeTab.querySelector('iframe');
      const url = button.getAttribute('data-url');
      const tabId = activeTab.id;

      // Проверяем пути для графиков печей карбонизации
      if (tabId.startsWith('carbonization')) {
        iframe.src = url; // Для vr путь оставляем как есть
      } else if (tabId.startsWith('sushilka')) {
        iframe.src = url; // Для сушилок путь оставляем как есть
      } else if (tabId.startsWith('mpa')) {
        iframe.src = url; // Для mpa путь оставляем как есть
      } else if (tabId.startsWith('mills')) {
        iframe.src = url; // Для mills путь оставляем как есть
      } else if (tabId.startsWith('reactor-296')) {
        iframe.src = url; // Для reactor296 путь оставляем как есть
      } else if (tabId.startsWith('energy-resources')) {
        iframe.src = url;
      }

      activeTab.querySelectorAll('.sub-tab-button').forEach((btn) => btn.classList.remove('sub-tab-button--active'));
      button.classList.add('sub-tab-button--active');
    });
  });
});
