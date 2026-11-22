// Каталог: подготовка данных (поиск, фильтр, сортировка, расчёты)
// и вывод карточек товаров на страницу.

// ===============================
// 1. Подготовка данных
// ===============================
function getProductTitles(products) {
  return products.map((product) => product.title);
}

function getAvailableProducts(products) {
  return products.filter((product) => product.isAvailable);
}

function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === '') {
    return products;
  }

  return products.filter((product) => {
    return product.title.toLowerCase().includes(normalizedQuery);
  });
}

function filterProductsByCategory(products, category) {
  if (category === 'all') {
    return products;
  }

  return products.filter((product) => product.category === category);
}

// sort() меняет массив, поэтому сортируем копию, а исходный порядок сохраняется
function sortProducts(products, sortType) {
  const productsCopy = [...products];

  if (sortType === 'price-asc') {
    return productsCopy.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
  }

  if (sortType === 'price-desc') {
    return productsCopy.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
  }

  if (sortType === 'title-asc') {
    return productsCopy.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
  }

  if (sortType === 'rating-desc') {
    return productsCopy.sort((a, b) => b.rating - a.rating);
  }

  return productsCopy;
}

function getPreparedProducts(products, state) {
  let result = searchProducts(products, state.query);
  result = filterProductsByCategory(result, state.category);
  result = sortProducts(result, state.sort);
  return result;
}

function calculateTotalPrice(products) {
  return products.reduce((total, product) => total + getFinalPrice(product), 0);
}

function countAvailableProducts(products) {
  let count = 0;

  for (const product of products) {
    if (product.isAvailable) {
      count++;
    }
  }

  return count;
}

function calculateAveragePrice(products) {
  if (products.length === 0) {
    return 0;
  }

  return Math.round(calculateTotalPrice(products) / products.length);
}


// ===============================
// 2. Карточка товара
// ===============================
const CATALOG_IMAGE_SIZES = '(min-width: 1280px) 260px, (min-width: 1024px) 34vw, (min-width: 768px) 45vw, 100vw';
const POPULAR_IMAGE_SIZES = '(min-width: 1100px) 340px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw';

function createProductCard(product, options = {}) {
  const titleId = `card-${options.idPrefix || 'catalog'}-${product.id}`;

  const card = createElement('article', 'product-card');
  card.setAttribute('aria-labelledby', titleId);

  const image = createProductImage(product, 'product-card__image', options.sizes || CATALOG_IMAGE_SIZES);

  const title = createElement('h3', 'product-card__title');
  title.id = titleId;
  const titleLink = createElement('a', 'product-card__link', product.title);
  titleLink.href = `product.html?id=${product.id}`;
  title.append(titleLink);

  const meta = createElement('p', 'product-card__meta', `${getCategoryName(product.category)} · ★ ${product.rating}`);
  const description = createElement('p', 'product-card__description', product.description);

  const status = createElement('p', 'product-card__status', getProductStatus(product));
  if (!product.isAvailable) {
    status.classList.add('product-card__status--out');
  }

  const footer = createElement('div', 'product-card__footer');
  const price = createElement('p', 'product-card__price', formatPrice(getFinalPrice(product)));

  const button = createElement('button', 'button button--primary product-card__button', 'В корзину');
  button.type = 'button';
  button.dataset.action = 'add-to-cart';
  button.dataset.productId = String(product.id);
  button.setAttribute('aria-label', `В корзину: ${product.title}`);

  if (!product.isAvailable) {
    button.disabled = true;
    button.textContent = 'Нет в наличии';
  }

  footer.append(price, button);
  card.append(image, title, meta, description, status, footer);

  // На главной у карточки есть быстрый заказ через модальное окно
  if (options.quickOrder && product.isAvailable) {
    const quickOrderButton = createElement('button', 'button button--secondary product-card__quick', 'Купить в 1 клик');
    quickOrderButton.type = 'button';
    quickOrderButton.dataset.action = 'order';
    quickOrderButton.dataset.product = product.title;
    quickOrderButton.setAttribute('aria-label', `Купить в 1 клик: ${product.title}`);
    card.append(quickOrderButton);
  }

  return card;
}


// ===============================
// 3. Вывод карточек на страницу
// ===============================
function renderProducts(container, productsToRender, options) {
  container.textContent = '';

  productsToRender.forEach((product) => {
    const item = createElement('li', 'products-grid__item');
    item.append(createProductCard(product, options));
    container.append(item);
  });
}

const productsContainer = document.querySelector('[data-products-container]');
const popularContainer = document.querySelector('[data-popular-container]');

// На главной выводятся только популярные товары
if (popularContainer) {
  const popularProducts = products.filter((product) => product.isPopular);
  renderProducts(popularContainer, popularProducts, {
    quickOrder: true,
    idPrefix: 'popular',
    sizes: POPULAR_IMAGE_SIZES
  });
}


// ===============================
// 4. Состояние каталога: поиск, фильтр, сортировка
// ===============================
const catalogState = {
  query: '',
  category: 'all',
  sort: 'default'
};

const catalogControls = document.querySelector('#catalog-controls');
const searchInput = document.querySelector('#catalog-search');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-select');
const catalogCount = document.querySelector('.catalog-count');
const catalogEmpty = document.querySelector('.catalog-empty');

function updateCatalog() {
  const preparedProducts = getPreparedProducts(products, catalogState);

  renderProducts(productsContainer, preparedProducts);

  if (catalogCount) {
    catalogCount.textContent = `Найдено товаров: ${preparedProducts.length} из ${products.length}`;
  }

  if (catalogEmpty) {
    catalogEmpty.hidden = preparedProducts.length > 0;
  }
}

if (productsContainer) {
  if (catalogControls) {
    // Enter в поле поиска не должен перезагружать страницу
    catalogControls.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      catalogState.query = event.target.value;
      updateCatalog();
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', (event) => {
      catalogState.category = event.target.value;
      updateCatalog();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (event) => {
      catalogState.sort = event.target.value;
      updateCatalog();
    });
  }

  updateCatalog();
}


// ===============================
// 5. Краткая статистика каталога
// ===============================
const catalogSummary = document.querySelector('.catalog-summary');

if (catalogSummary) {
  catalogSummary.textContent =
    `В каталоге ${products.length} товаров, в наличии ${countAvailableProducts(products)}. ` +
    `Средняя цена — ${formatPrice(calculateAveragePrice(products))}.`;
}

