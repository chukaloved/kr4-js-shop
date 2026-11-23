// Избранное: отдельное состояние интерфейса, хранится в localStorage как массив id.

const FAVORITES_STORAGE_KEY = 'devicehub-favorites';

function loadFavorites() {
  const savedFavorites = loadFromStorage(FAVORITES_STORAGE_KEY, []);

  if (!Array.isArray(savedFavorites)) {
    return [];
  }

  return savedFavorites.filter((id) => findProductById(products, id) !== undefined);
}

let favorites = loadFavorites();

function isFavorite(productId) {
  return favorites.includes(productId);
}

function toggleFavorite(productId) {
  if (isFavorite(productId)) {
    favorites = favorites.filter((id) => id !== productId);
  } else {
    favorites.push(productId);
  }

  saveToStorage(FAVORITES_STORAGE_KEY, favorites);
  return isFavorite(productId);
}

function createFavoriteButton(product) {
  const button = createElement('button', 'favorite-button');
  button.type = 'button';
  button.dataset.action = 'toggle-favorite';
  button.dataset.productId = String(product.id);

  const icon = createElement('span', 'favorite-button__icon', '♥');
  icon.setAttribute('aria-hidden', 'true');
  button.append(icon);

  updateFavoriteButton(button, product);
  return button;
}

function updateFavoriteButton(button, product) {
  const active = isFavorite(product.id);

  button.setAttribute('aria-pressed', String(active));
  button.setAttribute('aria-label', active
    ? `Убрать из избранного: ${product.title}`
    : `Добавить в избранное: ${product.title}`);
  button.classList.toggle('favorite-button--active', active);
}


// ===============================
// Раздел «Избранное» на странице корзины
// ===============================
const favoritesContainer = document.querySelector('[data-favorites-container]');
const favoritesEmpty = document.querySelector('.favorites-empty');
const favoritesCount = document.querySelector('[data-favorites-count]');

function renderFavorites() {
  if (!favoritesContainer) {
    return;
  }

  const favoriteProducts = products.filter((product) => isFavorite(product.id));

  renderProducts(favoritesContainer, favoriteProducts, { idPrefix: 'favorite' });
  favoritesEmpty.hidden = favoriteProducts.length > 0;
  favoritesCount.textContent = String(favoriteProducts.length);
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="toggle-favorite"]');

  if (!button) {
    return;
  }

  const productId = Number(button.dataset.productId);
  const product = findProductById(products, productId);

  if (!product) {
    return;
  }

  const active = toggleFavorite(productId);
  document.querySelectorAll(`[data-action="toggle-favorite"][data-product-id="${productId}"]`).forEach((item) => {
    updateFavoriteButton(item, product);
  });

  showToast(active ? `Товар «${product.title}» добавлен в избранное` : `Товар «${product.title}» убран из избранного`);
  renderFavorites();
});

document.addEventListener('DOMContentLoaded', renderFavorites);
