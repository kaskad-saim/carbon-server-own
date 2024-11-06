document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-container__button');
  const subTabs = document.querySelectorAll('.sub-tab-button');

  const adjustIframeHeight = () => {
    const iframes = document.querySelectorAll('.iframe-container iframe');
    const height = window.innerHeight - 150;
    iframes.forEach((iframe) => {
      iframe.style.height = `${height}px`;
    });
  }

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
      let defaultUrl = '/mnemo-pech-vr-1';
      if (tabId === 'carbonization-2') {
        defaultUrl = '/mnemo-pech-vr-2';
      } else if (tabId === 'sushilka-1') {
        defaultUrl = '/mnemo-sushilka1';
      }
      iframe.src = `http://169.254.0.156:3002${defaultUrl}`;

      // Обновляем состояние активной под-вкладки
      const activeTab = document.getElementById(tabId);
      activeTab.querySelectorAll('.sub-tab-button').forEach((btn) => btn.classList.remove('sub-tab-button--active'));
      activeTab.querySelector(`.sub-tab-button[data-url="${defaultUrl}"]`).classList.add('sub-tab-button--active');
    });
  });

  // Под-вкладки
  subTabs.forEach((button) => {
    button.addEventListener('click', () => {
      const activeTab = document.querySelector('.tab-content.tab-content--active');
      const iframe = activeTab.querySelector('iframe');
      const url = button.getAttribute('data-url');

      iframe.src = `http://169.254.0.156:3002${url}`;

      activeTab.querySelectorAll('.sub-tab-button').forEach((btn) => btn.classList.remove('sub-tab-button--active'));
      button.classList.add('sub-tab-button--active');
    });
  });
});
