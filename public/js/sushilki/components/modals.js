// modals.js

// Открытие и закрытие модального окна
const btnModal = document.querySelector('.btn-modal');
const modalBackground = document.querySelector('.modal-js');
const modalClose = document.querySelector('.mnemo__modal-close');
const modalActive = document.querySelector('.mnemo__modal-active');

btnModal.addEventListener('click', () => {
  modalBackground.classList.add('enabled');
  modalActive.classList.add('enabled');
});

modalClose.addEventListener('click', () => {
  modalBackground.classList.remove('enabled');
  modalActive.classList.remove('enabled');
});

modalBackground.addEventListener('click', (event) => {
  if (event.target === modalBackground) {
    modalBackground.classList.remove('enabled');
    modalActive.classList.remove('enabled');
  }
});

// Логика аккордеонов в модальном окне
const accordionTitle = document.querySelectorAll('.modal__accordion-title');
const accordionContent = document.querySelectorAll('.modal__accordion-content');

const dropDownDescrNull = (array) => {
  array.forEach((el) => {
    el.style.maxHeight = null;
  });
};

accordionTitle.forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const contentNext = el.nextElementSibling;

    if (contentNext.style.maxHeight) {
      dropDownDescrNull(accordionContent);
    } else {
      dropDownDescrNull(accordionContent);
      contentNext.style.maxHeight = contentNext.scrollHeight + 'px';
    }

    el.classList.toggle('enabled', !el.classList.contains('enabled'));
    accordionTitle.forEach((item) => {
      if (item !== el) item.classList.remove('enabled');
    });
  });
});

// // Логика для проверки пароля
// const downloadForm = (downloadPassword, passwordWindow, form) => {
//   downloadPassword.addEventListener('click', (e) => {
//     e.preventDefault();
//     downloadPassword.classList.add('active');
//     passwordWindow.classList.add('active');
//     form.classList.add('active');
//   });
// };

// const formValue = (content, form, passwordWindow, passwordValue, nameInput, labelbox, inputbox) => {
//   form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const password = form.querySelector(`[name="password-${nameInput}"]`);
//     const value = { password: password.value };

//     if (value.password === passwordValue) {
//       passwordWindow.classList.remove('active');
//       content.classList.add('active');
//     } else {
//       labelbox.classList.add('active');
//       inputbox.classList.add('error');
//     }
//   });
// };

// // Инициализация проверки пароля для первого блока
// const downloadPassword1 = document.querySelector('.download-password-1');
// const windowPassword1 = document.querySelector('.password-window-1');
// const formPassword1 = document.querySelector('.password-form-1');
// const passwordMK500 = 'sushilka';
// const downloadContent1 = document.querySelector('.download-content-1');
// const passwordLabel1 = document.querySelector('.password-label-1');
// const passwordInput1 = document.querySelector('.password-input-1');

// downloadForm(downloadPassword1, windowPassword1, formPassword1);
// formValue(downloadContent1, formPassword1, windowPassword1, passwordMK500, 1, passwordLabel1, passwordInput1);

// // Инициализация проверки пароля для второго блока
// const downloadPassword2 = document.querySelector('.download-password-2');
// const windowPassword2 = document.querySelector('.password-window-2');
// const formPassword2 = document.querySelector('.password-form-2');
// const passwordDelta = 'sushilka';
// const downloadContent2 = document.querySelector('.download-content-2');
// const passwordLabel2 = document.querySelector('.password-label-2');
// const passwordInput2 = document.querySelector('.password-input-2');

// downloadForm(downloadPassword2, windowPassword2, formPassword2);
// formValue(downloadContent2, formPassword2, windowPassword2, passwordDelta, 2, passwordLabel2, passwordInput2);