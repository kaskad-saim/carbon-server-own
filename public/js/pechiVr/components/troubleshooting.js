document.addEventListener('DOMContentLoaded', () => {
  const causes = document.querySelectorAll('.troubleshooting__item--cause');

  const hideAllActions = () => {
    document.querySelectorAll('.troubleshooting__item--action').forEach((action) => {
      action.style.display = 'none';
    });
  };

  const removeActiveClasses = () => {
    causes.forEach((cause) => {
      cause.classList.remove('troubleshooting__item--active', 'troubleshooting__item--cause--active');
    });
  };

  causes.forEach((cause) => {
    cause.addEventListener('click', () => {
      removeActiveClasses();
      hideAllActions();

      const action = cause.nextElementSibling;
      if (action?.classList.contains('troubleshooting__item--action')) {
        cause.classList.add('troubleshooting__item--active', 'troubleshooting__item--cause--active');
        action.style.display = 'block';
      }
    });
  });
});
