import { updateSushilka1GorelkaParams, updateSushilka1ImpulseSignals, updateSushilka1Temperatures, updateSushilka1Vacuums } from "./components/updateParams.js";

try {
  const kran = document.querySelector('.mnemo__kran-img img');
  const kranLeft = document.querySelector('.mnemo__kran-left');
  const kranRight = document.querySelector('.mnemo__kran-right');

  const kranBorderLeft = (param, color) => {
    if (window.innerWidth > 1280) {
      param.style = `border-left: 20px solid ${color}`;
    } else {
      param.style = `border-left: 15px solid ${color}`;
    }
  };

  const kranBorderRight = (param, color) => {
    if (window.innerWidth > 1280) {
      param.style = `border-right: 20px solid ${color}`;
    } else {
      param.style = `border-right: 15px solid ${color}`;
    }
  };

  const green = 'green';
  const red = 'red';

  if (kran.src == 'http://techsite4/KASKAD/pic/images/true.gif') {
    kranBorderLeft(kranLeft, green);
    kranBorderRight(kranRight, green);
  } else {
    kranBorderLeft(kranLeft, red);
    kranBorderRight(kranRight, red);
  }

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

  // ventilators

  const ventilatorGif3 = document.querySelector('.mnemo__gif-3 img');
  const ventilatorGif4 = document.querySelector('.mnemo__gif-4 img');

  if (ventilatorGif3.src == 'http://techsite4/KASKAD/pic/images/ventilator.png') {
    ventilatorGif3.style.animationPlayState = 'running';
  } else {
    ventilatorGif3.style.animationPlayState = 'pause';
  }

  if (ventilatorGif4.src == 'http://techsite4/KASKAD/pic/images/ventilator.png') {
    ventilatorGif4.style.animationPlayState = 'running';
  } else {
    ventilatorGif4.style.animationPlayState = 'pause';
  }

  // const left = (param, color) => {
  //   param.style = `border-left: 20px solid ${color}`;
  // };

  // const right = (param, color) => {
  //   param.style = `border-right: 20px solid ${color}`;
  // };

  // if (kran.src == 'http://Techsite4/kaskad/pic/images/true.gif') {
  //   left(kranLeft, green);
  //   right(kranRight, green);
  //   console.log('green');
  // } else {
  //   left(kranLeft, red);
  //   right(kranRight, red);
  //   console.log('red');
  // }
} catch (error) {
  console.log('Нет показаний');
}

// --------------------Модальное окно--------------------

const btnModal = document.querySelector('.btn-modal');
const modalBackground = document.querySelector('.modal-js');
const modalClose = document.querySelector('.mnemo__modal-close');
const modalActive = document.querySelector('.mnemo__modal-active');

const accordionBtn = document.querySelectorAll('.modal__accordion');
const accordionTitle = document.querySelectorAll('.modal__accordion-title');
const accordionContent = document.querySelectorAll('.modal__accordion-content');

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

const dropDownDescrNull = (array) => {
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    el.style.maxHeight = null;
  }
};

for (let i = 0; i < accordionTitle.length; i++) {
  const el = accordionTitle[i];

  el.addEventListener('click', (e) => {
    e.preventDefault();
    let contentNext = el.nextElementSibling;

    if (contentNext.style.maxHeight) {
      dropDownDescrNull(accordionContent);
    } else {
      dropDownDescrNull(accordionContent);
      contentNext.style.maxHeight = contentNext.scrollHeight + 'px';
    }

    if (!el.classList.contains('enabled')) {
      for (let i = 0; i < accordionTitle.length; i++) {
        let item = accordionTitle[i];
        item.classList.remove('enabled');
      }
      el.classList.add('enabled');
    } else {
      el.classList.remove('enabled');
    }
  });
}

// Password

const downloadPassword1 = document.querySelector('.download-password-1');
const windowPassword1 = document.querySelector('.password-window-1');
const formPassword1 = document.querySelector('.password-form-1');
const passwordMK500 = 'sushilka';
const downloadContent1 = document.querySelector('.download-content-1');
const passwordLabel1 = document.querySelector('.password-label-1');
const passwordInput1 = document.querySelector('.password-input-1');

const downloadForm = (downloadPassword, passwordWindow, form) => {
  downloadPassword.addEventListener('click', (e) => {
    e.preventDefault();
    downloadPassword.classList.add('active');
    passwordWindow.classList.add('active');
    form.classList.add('active');
  });
};

const formValue = (content, form, passwordWindow, passwordValue, nameInput, labelbox, inputbox) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = form.querySelector(`[name="password-${nameInput}"]`);
    const value = {
      password: password.value,
    };
    if (value.password === passwordValue) {
      passwordWindow.classList.remove('active');
      content.classList.add('active');
    } else {
      labelbox.classList.add('active');
      inputbox.classList.add('error');
    }
  });
};

downloadForm(downloadPassword1, windowPassword1, formPassword1);
formValue(downloadContent1, formPassword1, windowPassword1, passwordMK500, 1, passwordLabel1, passwordInput1);

const downloadPassword2 = document.querySelector('.download-password-2');
const windowPassword2 = document.querySelector('.password-window-2');
const formPassword2 = document.querySelector('.password-form-2');
const passwordDelta = 'sushilka';
const downloadContent2 = document.querySelector('.download-content-2');
const passwordLabel2 = document.querySelector('.password-label-2');
const passwordInput2 = document.querySelector('.password-input-2');

downloadForm(downloadPassword2, windowPassword2, formPassword2);
formValue(downloadContent2, formPassword2, windowPassword2, passwordDelta, 2, passwordLabel2, passwordInput2);




// new server
// Определяем функцию для обновления даты и времени
const updateDateTime = () => {
  const dateElement = document.querySelector('.current-param__date');
  const timeElement = document.querySelector('.current-param__time');
  const timeDateTogether = document.querySelector('#server-time');
  const now = new Date();

  const optionsDate = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

  const formattedDate = now.toLocaleDateString('ru-RU', optionsDate);
  const formattedTime = now.toLocaleTimeString('ru-RU', optionsTime);

  if (dateElement) {
    dateElement.textContent = formattedDate;
  }

  if (timeElement) {
    timeElement.textContent = formattedTime;
  }

  if (timeDateTogether) {
    timeDateTogether.textContent = formattedDate + ' ' + formattedTime;
  }
};

export const fetchSushilka1Data = async () => {
  try {
    const response = await fetch('/api/sushilka1-data');
    const data = await response.json();
    // console.log('Данные Sushilka1:', data);

    // Вызываем функции обновления с данными
    updateSushilka1Temperatures(data); // параметры температур
    updateSushilka1Vacuums(data); // параметры разрежения
    updateSushilka1GorelkaParams(data); // параметры горелки
    updateSushilka1ImpulseSignals(data); // импульсные сигналы
  } catch (error) {
    console.error('Ошибка при получении данных Sushilka1:', error);
  }
};

// Вызовите функцию обновления даты и времени при загрузке страницы
updateDateTime();
// Установите интервал для обновления времени каждую секунду
setInterval(updateDateTime, 1000);

// Сразу запускаем функции один раз при загрузке страницы
fetchSushilka1Data();
// Затем запускаем их каждые 15 секунд
setInterval(fetchSushilka1Data, 15000);