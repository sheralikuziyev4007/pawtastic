/**
 * Компонент: бургер-меню (планшет и мобильный, ≤1023px).
 * Разметка: кнопка .burger[aria-controls] + навигация #main-nav.
 */
(() => {
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('main-nav');

  if (!burger || !nav) {
    return;
  }

  const OPEN_CLASS = 'main-nav--open';
  const mobileQuery = window.matchMedia('(max-width: 1023px)');

  const setOpen = (isOpen) => {
    nav.classList.toggle(OPEN_CLASS, isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  };

  const isOpen = () => nav.classList.contains(OPEN_CLASS);

  burger.addEventListener('click', () => setOpen(!isOpen()));

  // Переход по пункту меню закрывает меню
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setOpen(false);
    }
  });

  // Клик вне меню
  document.addEventListener('click', (event) => {
    if (isOpen() && !nav.contains(event.target) && !burger.contains(event.target)) {
      setOpen(false);
    }
  });

  // Escape закрывает меню и возвращает фокус на кнопку
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      burger.focus();
    }
  });

  // При переходе на десктоп сбрасываем состояние
  mobileQuery.addEventListener('change', (event) => {
    if (!event.matches) {
      setOpen(false);
    }
  });
})();
