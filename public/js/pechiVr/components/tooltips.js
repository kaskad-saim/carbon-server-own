//tooltips
const hoverNoneBtn = document.querySelector('.hover-none-btn');
const hoverElemParam = document.querySelectorAll('.mnemo__tooltip');

const toggleBtnText = () => {
  hoverNoneBtn.innerHTML =
    hoverNoneBtn.innerHTML == 'Выключить всплывающие подсказки'
      ? 'Включить всплывающие подсказки'
      : 'Выключить всплывающие подсказки';
};

hoverNoneBtn.addEventListener('click', () => {
  for (let i = 0; i < hoverElemParam.length; i++) {
    const item = hoverElemParam[i];
    item.classList.toggle('enabled-hover');
  }
  toggleBtnText();
});
