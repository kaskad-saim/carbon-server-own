try {
  const hoverNoneBtn = document.querySelector('.hover-none-btn');
  const hoverElemParam = document.querySelectorAll('.mnemo__tooltip');

  const toggleBtnText = () => {
    hoverNoneBtn.innerHTML =
      hoverNoneBtn.innerHTML == 'Выключить всплывающие подсказки'
        ? 'Включить всплывающие подсказки'
        : 'Выключить всплывающие подсказки';
  };

  hoverNoneBtn.addEventListener('click', () => {
    hoverElemParam.forEach((item) => {
      item.classList.toggle('enabled-hover');
    });
    toggleBtnText();
  });
} catch (error) {
  console.log('Нет показаний');
}
