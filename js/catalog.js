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
