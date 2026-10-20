/**
 * Компонент: ссылки-заглушки (href="#") не должны прыгать в начало страницы.
 * Когда появятся реальные страницы, замените href — скрипт перестанет на них действовать.
 */
(() => {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href="#"]');

    if (link) {
      event.preventDefault();
    }
  });
})();
