export const updateIms = (data) => {
  const imLeft = document.querySelector('.mnemo__kran-left');
  const imRight = document.querySelector('.mnemo__kran-right');

  const green = 'green';
  const red = 'red';

  const im = data.im && data.im['Индикация паротушения'];
  if (im !== undefined) {
    if (im === true) {
      imLeft.style.borderLeft = `20px solid ${green}`;
      imRight.style.borderRight = `20px solid ${green}`;
    } else {
      imLeft.style.borderLeft = `20px solid ${red}`;
      imRight.style.borderRight = `20px solid ${red}`;
    }
  }
}