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
// 3. Проверка формы и вывод ошибок
// ===============================
function validateForm(form) {
  const fields = Array.from(form.elements).filter((element) => element.willValidate);
  let firstInvalid = null;

  fields.forEach((field) => {
    field.removeAttribute('aria-invalid');

    if (!field.checkValidity()) {
      field.setAttribute('aria-invalid', 'true');
      firstInvalid = firstInvalid || field;
    }
  });

  if (firstInvalid) {
    form.reportValidity();
    firstInvalid.focus();
    return false;
  }

  return true;
}

// Снимаем красную рамку, как только поле исправлено
document.addEventListener('input', (event) => {
  const field = event.target;
  if (field.hasAttribute && field.hasAttribute('aria-invalid') && field.checkValidity()) {
    field.removeAttribute('aria-invalid');
  }
});


// ===============================
// 4. Отдельные формы: заказ и обратная связь
// ===============================
function setupPageForm(formId, successId) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);

  if (!form || !success) return;

  form.addEventListener('submit', (event) => {
    // Отменяем отправку: на GitHub Pages нет сервера для POST
    event.preventDefault();

    if (!validateForm(form)) return;

    form.reset();
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });
}

setupPageForm('order-page-form', 'order-success');
setupPageForm('feedback-form', 'feedback-success');


// ===============================
// 5. Предвыбор товара на странице заказа (order.html?product=...)
// ===============================
const productSelect = document.getElementById('order-product');

if (productSelect) {
  const productId = new URLSearchParams(window.location.search).get('product');

  if (productId && productSelect.querySelector(`option[value="${CSS.escape(productId)}"]`)) {
    productSelect.value = productId;
  }
}
