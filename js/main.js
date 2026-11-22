const desktopQuery = window.matchMedia('(min-width: 1024px)');


// ===============================
// 1. Адаптивное меню (бургер)
// ===============================
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');

function setNavOpen(isOpen) {
  if (!navToggle || !siteNav) return;

  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.querySelector('.nav-toggle__text').textContent = isOpen ? 'Закрыть' : 'Меню';
  siteNav.classList.toggle('site-nav--open', isOpen);
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setNavOpen(!isOpen);
  });

  // Закрываем меню по Esc и возвращаем фокус на кнопку
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setNavOpen(false);
      navToggle.focus();
    }
  });

  // Переход по якорной ссылке внутри страницы — закрываем меню
  siteNav.addEventListener('click', (event) => {
    if (event.target.closest('a') && !desktopQuery.matches) {
      setNavOpen(false);
    }
  });

  // При переходе на desktop-ширину сбрасываем состояние
  desktopQuery.addEventListener('change', () => setNavOpen(false));
}


// ===============================
// 2. Фильтр каталога: свёрнут на мобильном, раскрыт на desktop
// ===============================
const catalogFilters = document.getElementById('catalog-filters');

if (catalogFilters) {
  const syncFilters = () => {
    catalogFilters.open = desktopQuery.matches;
  };

  syncFilters();
  desktopQuery.addEventListener('change', syncFilters);

  // На desktop не даём свернуть фильтр (в т. ч. с клавиатуры)
  catalogFilters.querySelector('summary').addEventListener('click', (event) => {
    if (desktopQuery.matches) event.preventDefault();
  });
}


// ===============================
// 3. Предвыбор товара на странице заказа (order.html?product=...)
// ===============================
const productSelect = document.getElementById('order-product');

if (productSelect) {
  const productId = new URLSearchParams(window.location.search).get('product');

  if (productId && productSelect.querySelector(`option[value="${CSS.escape(productId)}"]`)) {
    productSelect.value = productId;
  }
}
