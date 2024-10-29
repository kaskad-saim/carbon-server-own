const modeTitleVr1 = document.querySelector('.current-param__subtitle-span-vr1');
const modeTitleVr2 = document.querySelector('.current-param__subtitle-span-vr2');
const temper1SkolzVr1 = document.querySelector('.temper-1-skolz-vr1');
const temper1SkolzVr2 = document.querySelector('.temper-1-skolz-vr2');

if (temper1SkolzVr1.innerHTML < 550 && temper1SkolzVr1.innerHTML > 50) {
  modeTitleVr1.innerHTML = 'Выход на режим';
} else if (temper1SkolzVr1.innerHTML > 550) {
  modeTitleVr1.innerHTML = 'Установившийся режим';
} else {
  modeTitleVr1.innerHTML = 'Печь не работает';
}

if (temper1SkolzVr2.innerHTML < 550 && temper1SkolzVr2.innerHTML > 50) {
  modeTitleVr2.innerHTML = 'Выход на режим';
} else if (temper1SkolzVr2.innerHTML > 550) {
  modeTitleVr2.innerHTML = 'Установившийся режим';
} else {
  modeTitleVr2.innerHTML = 'Печь не работает';
}
