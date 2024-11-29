// tooltips
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

// --------------------Модальное окно--------------------
const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('enabled');
  }
};

const closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('enabled');
  }
};

// Обработчик клика по кнопкам
document.querySelectorAll('.modal-btn').forEach((button) => {
  button.addEventListener('click', function () {
    const modalId = this.getAttribute('data-modal-target');
    openModal(modalId);
  });
});

document.addEventListener('click', function (event) {
  const target = event.target;
  const modalId = target.getAttribute('data-modal-target');
  if (modalId) {
    openModal(modalId);
  }
});

// Обработчик клика по кнопкам закрытия
document.querySelectorAll('.mnemo__modal-close').forEach((closeButton) => {
  closeButton.addEventListener('click', function () {
    const modal = this.closest('.mnemo__modal-background');
    if (modal) {
      closeModal(modal.id);
    }
  });
});

const accordionTitles = document.querySelectorAll('.modal__accordion-title');
const accordionContents = document.querySelectorAll('.modal__accordion-content');

const closeAllAccordions = () => {
  accordionContents.forEach((content) => {
    content.style.maxHeight = null;
  });
  accordionTitles.forEach((title) => {
    title.classList.remove('enabled');
  });
};

accordionTitles.forEach((title) => {
  title.addEventListener('click', (e) => {
    e.preventDefault();
    const content = title.nextElementSibling;

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      title.classList.remove('enabled');
    } else {
      closeAllAccordions();
      content.style.maxHeight = content.scrollHeight + 'px';
      title.classList.add('enabled');
    }
  });
});
