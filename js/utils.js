// Общие функции, которые используются на разных страницах:
// форматирование цены, расчёт скидки, статус товара, поиск товара по id.

function formatPrice(price) {
  return `${price.toLocaleString('ru-RU')} ₽`;
}

function calculateDiscount(price, discountPercent) {
  return Math.round(price * discountPercent / 100);
}

function calculateFinalPrice(price, discountPercent) {
  const discountValue = calculateDiscount(price, discountPercent);
  return price - discountValue;
}

// Цена, по которой товар продаётся сейчас (с учётом скидки)
function getFinalPrice(product) {
  return calculateFinalPrice(product.price, product.discountPercent);
}

function getProductStatus(product) {
  if (product.isAvailable) {
    return 'В наличии';
  }

  return 'Нет в наличии';
}

function getCategoryName(category) {
  return categoryNames[category] || category;
}

function findProductById(products, id) {
  return products.find((product) => product.id === id);
}

// Короткий помощник: создаёт элемент с классом и текстом.
// Текст всегда выводится через textContent, а не через innerHTML.
function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}
