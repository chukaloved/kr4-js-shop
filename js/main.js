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
// 3. Всплывающие уведомления (вместо alert)
// ===============================
// Область для уведомлений создаётся сразу при загрузке: так экранные дикторы
// заранее знают о ней и зачитывают каждое новое сообщение
const toast = createElement('p', 'toast');
toast.setAttribute('role', 'status');
document.body.append(toast);

let toastTimer = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('toast--visible');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 2500);
}


// ===============================
// 4. Переключатель темы (выбор сохраняется в localStorage)
// ===============================
const THEME_STORAGE_KEY = 'devicehub-theme';
const themeToggle = document.querySelector('.theme-toggle');
const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function getCurrentTheme() {
  const selectedTheme = document.documentElement.dataset.theme;

  if (selectedTheme) {
    return selectedTheme;
  }

  return systemDarkQuery.matches ? 'dark' : 'light';
}

function updateThemeToggle() {
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(getCurrentTheme() === 'dark'));
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';

    document.documentElement.dataset.theme = nextTheme;
    saveToStorage(THEME_STORAGE_KEY, nextTheme);
    updateThemeToggle();
    showToast(nextTheme === 'dark' ? 'Включена тёмная тема' : 'Включена светлая тема');
  });

  // Пока пользователь не выбрал тему сам, следуем за настройкой системы
  systemDarkQuery.addEventListener('change', updateThemeToggle);
  updateThemeToggle();
}
