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