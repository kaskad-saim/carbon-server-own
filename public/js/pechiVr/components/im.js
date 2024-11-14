export const updateIms = (data) => {
  const imLeft1 = document.querySelector('.mnemo__kran1-left');
  const imRight1 = document.querySelector('.mnemo__kran1-right');
  const imLeft2 = document.querySelector('.mnemo__kran2-left');
  const imRight2 = document.querySelector('.mnemo__kran2-right');
  const imLeft3 = document.querySelector('.mnemo__kran3-left');
  const imRight3 = document.querySelector('.mnemo__kran3-right');
  const imLeft4 = document.querySelector('.mnemo__kran4-left');
  const imRight4 = document.querySelector('.mnemo__kran4-right');
  const imLeft5 = document.querySelector('.mnemo__kran5-left');
  const imRight5 = document.querySelector('.mnemo__kran5-right');

  const green = 'green';
  const red = 'red';

  const im1 = data.im && data.im['ИМ 1 скруббер'];
  if (im1 !== undefined) {
    if (im1 === true) {
      imLeft1.style.borderLeft = `13px solid ${green}`;
      imRight1.style.borderRight = `13px solid ${green}`;
    } else {
      imLeft1.style.borderLeft = `13px solid ${red}`;
      imRight1.style.borderRight = `13px solid ${red}`;
    }
  }

  const im2 = data.im && data.im['ИМ2 ХВО'];
  if (im2 !== undefined) {
    if (im2 === true) {
      imLeft2.style.borderLeft = `13px solid ${green}`;
      imRight2.style.borderRight = `13px solid ${green}`;
    } else {
      imLeft2.style.borderLeft = `13px solid ${red}`;
      imRight2.style.borderRight = `13px solid ${red}`;
    }
  }

  const im3 = data.im && data.im['ИМ3 аварийный сброс'];
  if (im3 !== undefined) {
    if (im3 === true) {
      imLeft3.style.borderLeft = `13px solid ${green}`;
      imRight3.style.borderRight = `13px solid ${green}`;
    } else {
      imLeft3.style.borderLeft = `13px solid ${red}`;
      imRight3.style.borderRight = `13px solid ${red}`;
    }
  }

  const im4 = data.im && data.im['ИМ4 пар в отделение активации'];
  if (im4 !== undefined) {
    if (im4 === true) {
      imLeft4.style.borderLeft = `13px solid ${green}`;
      imRight4.style.borderRight = `13px solid ${green}`;
    } else {
      imLeft4.style.borderLeft = `13px solid ${red}`;
      imRight4.style.borderRight = `13px solid ${red}`;
    }
  }

  const im5Pech1 = data.im && data.im['ИМ5 котел-утилизатор'];
  if (im5Pech1 !== undefined) {
    if (Number(im5Pech1) >= 5) {
      imLeft5.style.borderLeft = `13px solid ${green}`;
      imRight5.style.borderRight = `13px solid ${green}`;
    } else {
      imLeft5.style.borderLeft = `13px solid ${red}`;
      imRight5.style.borderRight = `13px solid ${red}`;
    }
  }
};
