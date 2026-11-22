// Данные интернет-магазина DeviceHub.
// Каталог хранится как массив объектов: у всех товаров одинаковый набор свойств.

const categoryNames = {
  mouse: 'Мыши',
  keyboard: 'Клавиатуры',
  headphones: 'Наушники',
  microphone: 'Микрофоны'
};

const products = [
  {
    id: 1,
    title: 'Мышь Logitech G Pro X',
    category: 'mouse',
    price: 12899,
    discountPercent: 0,
    rating: 4.8,
    isAvailable: true,
    isPopular: true,
    image: 'logitech-g-pro-x',
    imageWidth: 640,
    imageHeight: 640,
    alt: 'Игровая мышь Logitech G Pro X чёрного цвета, вид сверху',
    description: 'Эргономичная игровая мышь с точным сенсором и удобным управлением.',
    connection: 'USB',
    feature: 'Точный сенсор',
    specs: [
      { name: 'Тип', value: 'Игровая мышь' },
      { name: 'Назначение', value: 'Игры и работа' },
      { name: 'Цвет', value: 'Чёрный' },
      { name: 'Особенности', value: 'Точный сенсор, эргономичная форма' }
    ]
  },
  {
    id: 2,
    title: 'Мышь Logitech G304',
    category: 'mouse',
    price: 3290,
    discountPercent: 10,
    rating: 4.7,
    isAvailable: true,
    isPopular: false,
    image: 'logitech-g304',
    imageWidth: 640,
    imageHeight: 480,
    alt: 'Беспроводная мышь Logitech G304 белого цвета, вид сверху',
    description: 'Лёгкая беспроводная мышь LIGHTSPEED: работает до 250 часов от одной батарейки AA.',
    connection: 'Радиоканал 2,4 ГГц',
    feature: 'Сенсор HERO 12 000 DPI',
    specs: [
      { name: 'Тип', value: 'Беспроводная игровая мышь' },
      { name: 'Сенсор', value: 'HERO, до 12 000 DPI' },
      { name: 'Питание', value: '1 батарейка AA' },
      { name: 'Цвет', value: 'Белый' }
    ]
  },
  {
    id: 3,
    title: 'Микрофон Fifine AM8',
    category: 'microphone',
    price: 4799,
    discountPercent: 0,
    rating: 4.6,
    isAvailable: true,
    isPopular: false,
    image: 'fifine-am8',
    imageWidth: 640,
    imageHeight: 1129,
    alt: 'Динамический микрофон Fifine AM8 на подставке',
    description: 'Универсальный USB/XLR-микрофон с чистым звучанием для общения, стримов и записи.',
    connection: 'USB / XLR',
    feature: 'Регулировка громкости',
    specs: [
      { name: 'Тип', value: 'Динамический микрофон' },
      { name: 'Подключение', value: 'USB / XLR' },
      { name: 'Назначение', value: 'Стриминг, общение и запись' },
      { name: 'Особенности', value: 'Регулировка громкости и удобное управление' }
    ]
  },
  {
    id: 4,
    title: 'Микрофон Fifine AM8T',
    category: 'microphone',
    price: 5499,
    discountPercent: 0,
    rating: 4.5,
    isAvailable: false,
    isPopular: false,
    image: 'fifine-am8t',
    imageWidth: 640,
    imageHeight: 640,
    alt: 'Микрофон Fifine AM8T на регулируемой настольной стойке',
    description: 'Настольный микрофон на стойке с удобной регулировкой положения и качественным звучанием.',
    connection: 'USB / XLR',
    feature: 'Регулируемая стойка',
    specs: [
      { name: 'Тип', value: 'Микрофон на стойке' },
      { name: 'Назначение', value: 'Стриминг, запись и общение' },
      { name: 'Стойка', value: 'Регулируемая настольная' },
      { name: 'Особенности', value: 'Регулировка положения микрофона' }
    ]
  },
  {
    id: 5,
    title: 'Микрофон Fifine AmpliGame AM9',
    category: 'microphone',
    price: 5990,
    discountPercent: 0,
    rating: 4.7,
    isAvailable: true,
    isPopular: false,
    image: 'fifine-am9',
    imageWidth: 640,
    imageHeight: 480,
    alt: 'Чёрный микрофон Fifine AmpliGame AM9 с RGB-подсветкой на настольной подставке',
    description: 'Игровой микрофон с RGB-подсветкой, регулятором баланса «игра / чат» и кнопкой отключения звука.',
    connection: 'USB-C',
    feature: 'Баланс GAME / CHAT',
    specs: [
      { name: 'Тип', value: 'Динамический микрофон' },
      { name: 'Подключение', value: 'USB-C' },
      { name: 'Подсветка', value: 'RGB' },
      { name: 'Особенности', value: 'Регулятор баланса игры и чата, кнопка mute' }
    ]
  },
  {
    id: 6,
    title: 'Клавиатура AJAZZ AK820 Pro',
    category: 'keyboard',
    price: 6490,
    discountPercent: 0,
    rating: 4.8,
    isAvailable: true,
    isPopular: false,
    image: 'ajazz-ak820-pro',
    imageWidth: 640,
    imageHeight: 480,
    alt: 'Механическая клавиатура AJAZZ AK820 Pro в бело-сиреневых цветах с дисплеем и ручкой',
    description: 'Механическая клавиатура 75% с gasket-креплением, небольшим дисплеем и ручкой-регулятором.',
    connection: 'USB / 2,4 ГГц / Bluetooth',
    feature: 'Дисплей и ручка',
    specs: [
      { name: 'Тип', value: 'Механическая клавиатура' },
      { name: 'Формат', value: '75%' },
      { name: 'Подключение', value: 'Проводное, 2,4 ГГц, Bluetooth' },
      { name: 'Особенности', value: 'Gasket-крепление, RGB-подсветка, дисплей' }
    ]
  },
  {
    id: 7,
    title: 'Клавиатура ARDOR GAMING Dreamy',
    category: 'keyboard',
    price: 3990,
    discountPercent: 0,
    rating: 4.5,
    isAvailable: false,
    isPopular: false,
    image: 'ardor-dreamy',
    imageWidth: 640,
    imageHeight: 480,
    alt: 'Чёрно-белая механическая клавиатура ARDOR GAMING Dreamy без цифрового блока с рисунком облаков',
    description: 'Компактная механическая клавиатура без цифрового блока с RGB-подсветкой и рисунком облаков на клавишах.',
    connection: 'USB',
    feature: 'Формат TKL',
    specs: [
      { name: 'Тип', value: 'Механическая клавиатура' },
      { name: 'Формат', value: 'TKL (без цифрового блока)' },
      { name: 'Подключение', value: 'Проводное, USB' },
      { name: 'Подсветка', value: 'RGB' }
    ]
  },
  {
    id: 8,
    title: 'Клавиатура AULA F75',
    category: 'keyboard',
    price: 5490,
    discountPercent: 0,
    rating: 4.9,
    isAvailable: true,
    isPopular: true,
    image: 'aula-f75',
    imageWidth: 640,
    imageHeight: 480,
    alt: 'Бело-серая механическая клавиатура AULA F75 с ручкой-регулятором',
    description: 'Популярная механическая клавиатура 75% с мягким звуком, тремя режимами подключения и ручкой громкости.',
    connection: 'USB / 2,4 ГГц / Bluetooth',
    feature: 'Gasket-крепление',
    specs: [
      { name: 'Тип', value: 'Механическая клавиатура' },
      { name: 'Формат', value: '75%' },
      { name: 'Подключение', value: 'Проводное, 2,4 ГГц, Bluetooth' },
      { name: 'Особенности', value: 'Gasket-крепление, ручка-регулятор' }
    ]
  },
  {
    id: 9,
    title: 'Наушники HyperX Cloud II',
    category: 'headphones',
    price: 8990,
    discountPercent: 15,
    rating: 4.8,
    isAvailable: true,
    isPopular: true,
    image: 'hyperx-cloud-ii',
    imageWidth: 640,
    imageHeight: 480,
    alt: 'Чёрно-красная игровая гарнитура HyperX Cloud II со съёмным микрофоном',
    description: 'Игровая гарнитура с виртуальным звуком 7.1, мягкими амбушюрами и съёмным микрофоном.',
    connection: 'USB / 3,5 мм',
    feature: 'Виртуальный звук 7.1',
    specs: [
      { name: 'Тип', value: 'Проводная гарнитура' },
      { name: 'Подключение', value: 'USB-звуковая карта, 3,5 мм' },
      { name: 'Микрофон', value: 'Съёмный, с шумоподавлением' },
      { name: 'Особенности', value: 'Виртуальный звук 7.1, алюминиевая рамка' }
    ]
  },
  {
    id: 10,
    title: 'Наушники Logitech G435',
    category: 'headphones',
    price: 6990,
    discountPercent: 0,
    rating: 4.6,
    isAvailable: true,
    isPopular: false,
    image: 'logitech-g435',
    imageWidth: 640,
    imageHeight: 480,
    alt: 'Чёрные беспроводные наушники Logitech G435 с жёлтыми элементами',
    description: 'Лёгкая беспроводная гарнитура: 165 г, встроенные микрофоны, подключение по LIGHTSPEED и Bluetooth.',
    connection: '2,4 ГГц / Bluetooth',
    feature: 'Вес 165 г',
    specs: [
      { name: 'Тип', value: 'Беспроводная гарнитура' },
      { name: 'Подключение', value: 'LIGHTSPEED 2,4 ГГц, Bluetooth' },
      { name: 'Микрофон', value: 'Встроенный' },
      { name: 'Особенности', value: 'Вес 165 г, до 18 часов работы' }
    ]
  }
];
