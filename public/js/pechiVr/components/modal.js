// --------------------Модальное окно--------------------
export const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('enabled');
  }
};

export const closeModal = (modalId) => {
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