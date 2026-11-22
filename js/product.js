// Страница товара: product.html?id=3 — один товар, product.html — все товары.
// Вся информация берётся из массива products.

const DETAILS_IMAGE_SIZES = '(min-width: 1024px) 340px, (min-width: 768px) 250px, calc(100vw - 64px)';

const productIntro = document.querySelector('[data-product-intro]');
const productDetailsContainer = document.querySelector('[data-product-details]');
const breadcrumbCurrent = document.querySelector('[data-breadcrumb-current]');
const similarSection = document.querySelector('[data-similar-section]');
const similarContainer = document.querySelector('[data-similar-container]');
const compareBody = document.querySelector('[data-compare-body]');

// ===============================
// 1. Карточка с подробным описанием
// ===============================
function createSpecsTable(product) {
  const wrapper = createElement('div', 'table-wrapper');
  const captionId = `product-${product.id}-caption`;
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-labelledby', captionId);
  wrapper.tabIndex = 0;

  const table = createElement('table', 'product-specs');
  const caption = createElement('caption', '', `Характеристики: ${product.title}`);
  caption.id = captionId;
  const tbody = document.createElement('tbody');

  product.specs.forEach((spec) => {
    const row = document.createElement('tr');
    const name = createElement('th', '', spec.name);
    name.scope = 'row';
    row.append(name, createElement('td', '', spec.value));
    tbody.append(row);
  });

  table.append(caption, tbody);
  wrapper.append(table);
  return wrapper;
}

function createProductDetails(product, isSinglePage) {
  const section = createElement('section', 'product-details');
  const titleId = `product-${product.id}-title`;
  section.id = `product-${product.id}`;
  section.setAttribute('aria-labelledby', titleId);

  const card = createElement('article', 'product-details__card');

  const media = createElement('div', 'product-details__media');
  const image = createProductImage(product, 'product-details__image', DETAILS_IMAGE_SIZES);
  if (isSinglePage) {
    image.loading = 'eager';
  }
  media.append(image, createFavoriteButton(product));

  const content = createElement('div', 'product-details__content');

  // На странице одного товара название — главный заголовок страницы
  const title = createElement(isSinglePage ? 'h1' : 'h2', 'product-details__title', product.title);
  title.id = titleId;

  const meta = createElement('p', 'product-details__meta',
    `${getCategoryName(product.category)} · ★ ${product.rating} · ${getProductStatus(product)}`);
  const description = createElement('p', 'product-details__description', product.description);
  const price = createProductPrice(product, 'product-details__price');

  const actions = createElement('div', 'product-details__actions');

  const cartButton = createElement('button', 'button button--primary', 'В корзину');
  cartButton.type = 'button';
  cartButton.dataset.action = 'add-to-cart';
  cartButton.dataset.productId = String(product.id);

  const orderLink = createElement('a', 'button button--secondary', 'Оформить заказ');
  orderLink.href = `order.html?product=${product.id}`;

  if (!product.isAvailable) {
    cartButton.disabled = true;
    cartButton.textContent = 'Нет в наличии';
    orderLink.hidden = true;
  }

  actions.append(cartButton, orderLink);

  if (!isSinglePage) {
    const moreLink = createElement('a', 'product-details__more', 'Открыть страницу товара');
    moreLink.href = `product.html?id=${product.id}`;
    actions.append(moreLink);
  }

  content.append(title, meta, description, price, createSpecsTable(product), actions);
  card.append(media, content);
  section.append(card);
  return section;
}


// ===============================
// 2. Таблица сравнения
// ===============================
function renderCompareTable(currentProductId) {
  compareBody.textContent = '';

  products.forEach((product) => {
    const row = document.createElement('tr');

    if (product.id === currentProductId) {
      row.classList.add('compare-table__row--current');
    }

    const name = createElement('th');
    name.scope = 'row';
    const link = createElement('a', '', product.title);
    link.href = `product.html?id=${product.id}`;
    name.append(link);

    const cells = [
      ['Категория', getCategoryName(product.category)],
      ['Подключение', product.connection],
      ['Особенность', product.feature],
      ['Рейтинг', `★ ${product.rating}`],
      ['Цена', formatPrice(getFinalPrice(product))]
    ];

    row.append(name);
    cells.forEach(([label, value]) => {
      const cell = createElement('td', '', value);
      cell.dataset.label = label;
      row.append(cell);
    });

    compareBody.append(row);
  });
}


// ===============================
// 3. Вывод страницы
// ===============================
function renderNotFound() {
  const box = createElement('div', 'product-not-found');
  box.append(
    createElement('h1', '', 'Товар не найден'),
    createElement('p', '', 'Возможно, ссылка устарела. Посмотрите другие товары в каталоге.')
  );

  const link = createElement('a', 'button button--primary', 'Перейти в каталог');
  link.href = 'catalog.html';
  box.append(link);

  productDetailsContainer.append(box);
  document.title = 'Товар не найден — DeviceHub';
}

function renderProductPage() {
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id');

  productDetailsContainer.textContent = '';

  // Без параметра id показываем подробное описание всех товаров
  if (idParam === null) {
    products.forEach((product) => {
      productDetailsContainer.append(createProductDetails(product, false));
    });
    renderCompareTable(null);
    return;
  }

  const product = findProductById(products, Number(idParam));
  productIntro.hidden = true;

  if (!product) {
    breadcrumbCurrent.textContent = 'Товар не найден';
    renderNotFound();
    renderCompareTable(null);
    return;
  }

  document.title = `${product.title} — DeviceHub`;
  breadcrumbCurrent.textContent = product.title;
  productDetailsContainer.append(createProductDetails(product, true));

  const similarProducts = products.filter((item) => {
    return item.category === product.category && item.id !== product.id;
  });

  if (similarProducts.length > 0) {
    similarSection.hidden = false;
    renderProducts(similarContainer, similarProducts, { idPrefix: 'similar' });
  }

  renderCompareTable(product.id);
}

if (productDetailsContainer) {
  renderProductPage();
}
