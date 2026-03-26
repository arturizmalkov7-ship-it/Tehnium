/* global React, ReactDOM */

/**
 * V2: Calories calculator (product catalog + list).
 * - Pick a product from a small built-in catalog (kcal per 100g is predefined).
 * - Enter weight in grams.
 * - See preview (weight + calories) and add to a list.
 * - See the total calories of the whole list.
 */

const e = React.createElement;
const { useEffect, useMemo, useState } = React;

// kcalPer100g — популярные усреднённые значения (учебный проект).
// В реальной жизни у разных брендов/способов приготовления калорийность может отличаться.
const PRODUCT_CATALOG_ALL = [
  // Fruits (approx)
  { id: 'apple', name: 'Яблоко', kcalPer100g: 52 },
  { id: 'banana', name: 'Банан', kcalPer100g: 89 },
  { id: 'orange', name: 'Апельсин', kcalPer100g: 47 },
  { id: 'lemon', name: 'Лимон', kcalPer100g: 29 },
  { id: 'lime', name: 'Лайм', kcalPer100g: 30 },
  { id: 'pear', name: 'Груша', kcalPer100g: 57 },
  { id: 'peach', name: 'Персик', kcalPer100g: 39 },
  { id: 'plum', name: 'Слива', kcalPer100g: 46 },
  { id: 'cherry', name: 'Вишня', kcalPer100g: 50 },
  { id: 'strawberry', name: 'Клубника', kcalPer100g: 32 },
  { id: 'raspberry', name: 'Малина', kcalPer100g: 52 },
  { id: 'blueberry', name: 'Черника', kcalPer100g: 57 },
  { id: 'cranberry', name: 'Клюква', kcalPer100g: 46 },
  { id: 'grapes', name: 'Виноград', kcalPer100g: 69 },
  { id: 'watermelon', name: 'Арбуз', kcalPer100g: 30 },
  { id: 'melon', name: 'Дыня', kcalPer100g: 34 },
  { id: 'kiwi', name: 'Киви', kcalPer100g: 61 },
  { id: 'mango', name: 'Манго', kcalPer100g: 60 },
  { id: 'pineapple', name: 'Ананас', kcalPer100g: 50 },
  { id: 'papaya', name: 'Папайя', kcalPer100g: 43 },
  { id: 'apricot', name: 'Абрикос', kcalPer100g: 48 },
  { id: 'nectarine', name: 'Нектарин', kcalPer100g: 44 },
  { id: 'blackberry', name: 'Ежевика', kcalPer100g: 43 },
  { id: 'avocado', name: 'Авокадо', kcalPer100g: 160 },
  { id: 'tangerine', name: 'Мандарин', kcalPer100g: 53 },

  // Vegetables (approx)
  { id: 'potato', name: 'Картофель (сырой)', kcalPer100g: 77 },
  { id: 'sweet_potato', name: 'Картофель сладкий (батат, печёный)', kcalPer100g: 90 },
  { id: 'carrot', name: 'Морковь', kcalPer100g: 41 },
  { id: 'beet', name: 'Свёкла', kcalPer100g: 43 },
  { id: 'cucumber', name: 'Огурец', kcalPer100g: 15 },
  { id: 'tomato', name: 'Томат', kcalPer100g: 18 },
  { id: 'cabbage', name: 'Капуста белокочанная', kcalPer100g: 25 },
  { id: 'cauliflower', name: 'Цветная капуста', kcalPer100g: 25 },
  { id: 'broccoli', name: 'Брокколи', kcalPer100g: 34 },
  { id: 'eggplant', name: 'Баклажан', kcalPer100g: 25 },
  { id: 'zucchini', name: 'Кабачок', kcalPer100g: 17 },
  { id: 'pumpkin', name: 'Тыква', kcalPer100g: 26 },
  { id: 'spinach', name: 'Шпинат', kcalPer100g: 23 },
  { id: 'lettuce', name: 'Салат (листья)', kcalPer100g: 15 },
  { id: 'pepper', name: 'Перец сладкий', kcalPer100g: 31 },
  { id: 'mushrooms', name: 'Грибы (шампиньоны)', kcalPer100g: 22 },
  { id: 'onion', name: 'Лук репчатый', kcalPer100g: 40 },
  { id: 'garlic', name: 'Чеснок', kcalPer100g: 149 },
  { id: 'celery', name: 'Сельдерей', kcalPer100g: 16 },
  { id: 'leek', name: 'Порей', kcalPer100g: 61 },
  { id: 'asparagus', name: 'Спаржа', kcalPer100g: 20 },
  { id: 'green_beans', name: 'Стручковая фасоль', kcalPer100g: 31 },
  { id: 'okra', name: 'Бамия', kcalPer100g: 33 },
  { id: 'brussels_sprouts', name: 'Капуста брюссельская', kcalPer100g: 43 },
  { id: 'radish', name: 'Редис', kcalPer100g: 16 },

  // Legumes (approx, cooked)
  { id: 'lentils', name: 'Чечевица (варёная)', kcalPer100g: 116 },
  { id: 'chickpeas', name: 'Нут (варёный)', kcalPer100g: 164 },
  { id: 'kidney_beans', name: 'Фасоль красная (варёная)', kcalPer100g: 127 },
  { id: 'black_beans', name: 'Фасоль чёрная (варёная)', kcalPer100g: 132 },
  { id: 'peas', name: 'Горох (варёный)', kcalPer100g: 81 },
  { id: 'soybeans', name: 'Соевые бобы (варёные)', kcalPer100g: 173 },
  { id: 'hummus', name: 'Хумус', kcalPer100g: 166 },
  { id: 'tofu', name: 'Тофу', kcalPer100g: 144 },
  { id: 'tempeh', name: 'Темпе', kcalPer100g: 195 },
  { id: 'edamame', name: 'Эдамаме (зелёная соя)', kcalPer100g: 121 },

  // Grains / bread / pasta (approx)
  { id: 'rice', name: 'Рис (варёный)', kcalPer100g: 130 },
  { id: 'buckwheat', name: 'Гречка (варёная)', kcalPer100g: 110 },
  { id: 'oats', name: 'Овсянка (сухая)', kcalPer100g: 389 },
  { id: 'barley', name: 'Перловка (варёная)', kcalPer100g: 123 },
  { id: 'couscous', name: 'Кускус (варёный)', kcalPer100g: 112 },
  { id: 'quinoa', name: 'Киноа (варёная)', kcalPer100g: 120 },
  { id: 'pasta', name: 'Макароны (варёные)', kcalPer100g: 158 },
  { id: 'bread_white', name: 'Хлеб белый', kcalPer100g: 266 },
  { id: 'bread_rye', name: 'Хлеб ржаной', kcalPer100g: 259 },
  { id: 'pita', name: 'Пита', kcalPer100g: 290 },

  // Dairy (approx)
  { id: 'milk', name: 'Молоко 2.5%', kcalPer100g: 52 },
  { id: 'yogurt', name: 'Йогурт натуральный', kcalPer100g: 61 },
  { id: 'kefir', name: 'Кефир 2.5%', kcalPer100g: 41 },
  { id: 'sour_cream', name: 'Сметана 20%', kcalPer100g: 206 },
  { id: 'cheese', name: 'Сыр твёрдый', kcalPer100g: 392 },
  { id: 'cottage_cheese', name: 'Творог (нежирный/средний)', kcalPer100g: 98 },
  { id: 'butter', name: 'Масло сливочное', kcalPer100g: 717 },
  { id: 'icecream', name: 'Мороженое', kcalPer100g: 207 },
  { id: 'cream', name: 'Сливки 20%', kcalPer100g: 205 },
  { id: 'protein_yogurt', name: 'Йогурт греческий', kcalPer100g: 73 },

  // Meat / fish / eggs (approx, cooked)
  { id: 'chicken', name: 'Куриная грудка (готовая)', kcalPer100g: 165 },
  { id: 'turkey', name: 'Турция (готовая)', kcalPer100g: 135 },
  { id: 'beef', name: 'Говядина (готовая)', kcalPer100g: 250 },
  { id: 'pork', name: 'Свинина (готовая)', kcalPer100g: 242 },
  { id: 'lamb', name: 'Баранина (готовая)', kcalPer100g: 294 },
  { id: 'sausage', name: 'Колбаса (варёная)', kcalPer100g: 300 },
  { id: 'egg', name: 'Яйцо', kcalPer100g: 143 },
  { id: 'salmon', name: 'Лосось (готовый)', kcalPer100g: 208 },
  { id: 'tuna', name: 'Тунец (консервы в собственном соку)', kcalPer100g: 132 },
  { id: 'cod', name: 'Треска (готовая)', kcalPer100g: 82 },

  // Nuts / seeds / fats (approx)
  { id: 'almonds', name: 'Миндаль', kcalPer100g: 579 },
  { id: 'walnuts', name: 'Грецкие орехи', kcalPer100g: 654 },
  { id: 'peanuts', name: 'Арахис', kcalPer100g: 567 },
  { id: 'cashews', name: 'Кешью', kcalPer100g: 553 },
  { id: 'pistachios', name: 'Фисташки', kcalPer100g: 562 },
  { id: 'hazelnuts', name: 'Фундук', kcalPer100g: 628 },
  { id: 'pumpkin_seeds', name: 'Тыквенные семечки', kcalPer100g: 559 },
  { id: 'sunflower_seeds', name: 'Семечки подсолнечника', kcalPer100g: 584 },
  { id: 'chia_seeds', name: 'Чиа', kcalPer100g: 486 },
  { id: 'flax_seeds', name: 'Льняное семя', kcalPer100g: 534 },
  { id: 'olive_oil', name: 'Оливковое масло', kcalPer100g: 884 },
  { id: 'sunflower_oil', name: 'Подсолнечное масло', kcalPer100g: 884 },
  { id: 'mayonnaise', name: 'Майонез', kcalPer100g: 680 },

  // Sweets / snacks / others (approx)
  { id: 'honey', name: 'Мёд', kcalPer100g: 304 },
  { id: 'sugar', name: 'Сахар', kcalPer100g: 387 },
  { id: 'dark_chocolate', name: 'Шоколад тёмный', kcalPer100g: 546 },
  { id: 'milk_chocolate', name: 'Шоколад молочный', kcalPer100g: 535 },
  { id: 'cookies', name: 'Печенье', kcalPer100g: 417 },
  { id: 'waffles', name: 'Вафли', kcalPer100g: 452 },
  { id: 'croissant', name: 'Круассан', kcalPer100g: 407 },
  { id: 'cake', name: 'Торт (средний)', kcalPer100g: 330 },
  { id: 'marshmallow', name: 'Зефир/маршмеллоу', kcalPer100g: 300 },
  { id: 'ice_cream', name: 'Мороженое', kcalPer100g: 207 },
  { id: 'ketchup', name: 'Кетчуп', kcalPer100g: 112 },
  { id: 'soy_sauce', name: 'Соевый соус', kcalPer100g: 53 },
  { id: 'cola', name: 'Кола', kcalPer100g: 42 },
  { id: 'juice_orange', name: 'Апельсиновый сок', kcalPer100g: 45 },
  { id: 'cola_zero', name: 'Кола без сахара', kcalPer100g: 1 },
  { id: 'tea_sweet', name: 'Чай сладкий', kcalPer100g: 30 },

  // Extra items to reach ~100 (approx)
  { id: 'cocoa_powder', name: 'Какао-порошок', kcalPer100g: 228 },
  { id: 'coffee', name: 'Кофе (без сахара)', kcalPer100g: 2 },
  { id: 'energy_bar', name: 'Энергетический батончик', kcalPer100g: 400 },
  { id: 'granola', name: 'Гранола', kcalPer100g: 450 },
  { id: 'corn_flakes', name: 'Кукурузные хлопья', kcalPer100g: 350 },
  { id: 'popcorn', name: 'Попкорн (сладкий)', kcalPer100g: 400 },
  { id: 'chips', name: 'Чипсы', kcalPer100g: 536 },
  { id: 'pizza', name: 'Пицца (средняя)', kcalPer100g: 266 },
  { id: 'burger', name: 'Бургер (средний)', kcalPer100g: 250 },
  { id: 'hot_dog', name: 'Хот-дог', kcalPer100g: 290 },
  { id: 'taco', name: 'Тако (среднее)', kcalPer100g: 220 },
  { id: 'eggplant_caviar', name: 'Икра из баклажанов', kcalPer100g: 120 },
  { id: 'guacamole', name: 'Гуакамоле', kcalPer100g: 160 },
  { id: 'sushi', name: 'Суши (в среднем)', kcalPer100g: 200 },
  { id: 'dumplings', name: 'Пельмени (варёные)', kcalPer100g: 220 },
  { id: 'pancakes', name: 'Блины (средние)', kcalPer100g: 220 },
  { id: 'schnitzel', name: 'Шницель (средний)', kcalPer100g: 260 },
  { id: 'tuna_sandwich', name: 'Сэндвич (тунец, средний)', kcalPer100g: 240 },
  { id: 'fried_rice', name: 'Рис жареный', kcalPer100g: 200 },
  { id: 'ramen', name: 'Рамен (средний)', kcalPer100g: 320 },
  { id: 'soup_chicken', name: 'Суп куриный (средний)', kcalPer100g: 40 },
  { id: 'soup_beef', name: 'Суп мясной (средний)', kcalPer100g: 60 },

  // One more batch (approx) - keep simple and safe
  { id: 'seaweed', name: 'Морская капуста', kcalPer100g: 45 },
  { id: 'coconut', name: 'Кокос (мякоть)', kcalPer100g: 354 },
  { id: 'banana_flakes', name: 'Банановые чипсы', kcalPer100g: 520 },
  { id: 'raisins', name: 'Изюм', kcalPer100g: 299 },
  { id: 'dried_apricots', name: 'Курага', kcalPer100g: 241 },
  { id: 'dates', name: 'Финики', kcalPer100g: 277 },
  { id: 'prunes', name: 'Чернослив', kcalPer100g: 240 },
  { id: 'dried_fruits_mix', name: 'Сухофрукты (смесь)', kcalPer100g: 260 },
  { id: 'sesame', name: 'Кунжут', kcalPer100g: 573 },
  { id: 'tahini', name: 'Тахини', kcalPer100g: 595 },
  { id: 'peanut_butter', name: 'Арахисовая паста', kcalPer100g: 588 },
  { id: 'halva', name: 'Халва', kcalPer100g: 510 },
  { id: 'molasses', name: 'Патока', kcalPer100g: 317 },
  { id: 'maple_syrup', name: 'Кленовый сироп', kcalPer100g: 260 },
  { id: 'breadcrumbs', name: 'Сухари панировочные', kcalPer100g: 347 },
  { id: 'oat_bread', name: 'Хлеб овсяный', kcalPer100g: 260 },
  { id: 'rice_crackers', name: 'Рисовые хлебцы', kcalPer100g: 350 },
  { id: 'pretzels', name: 'Претцели', kcalPer100g: 380 },
  { id: 'tortilla', name: 'Тортилья (кукурузная)', kcalPer100g: 218 },
  { id: 'pudding', name: 'Пудинг (средний)', kcalPer100g: 140 },
  { id: 'jelly', name: 'Желе (с сахаром)', kcalPer100g: 80 },
  { id: 'marinade', name: 'Маринад (средний)', kcalPer100g: 50 },
];

// Ограничиваем до первых 100 позиций (учебный проект).
const PRODUCT_CATALOG = PRODUCT_CATALOG_ALL.slice(0, 100);

function computeCalories(kcalPer100g, weightInGrams) {
  return (kcalPer100g * weightInGrams) / 100;
}

function formatCalories(value) {
  // Show "integer-looking" values without trailing decimals.
  if (Math.abs(value - Math.round(value)) < 1e-9) return String(Math.round(value));
  return value.toFixed(1);
}

function App() {
  const [selectedProductId, setSelectedProductId] = useState(PRODUCT_CATALOG[0].id);
  const [weightGramsInput, setWeightGramsInput] = useState('');
  const [items, setItems] = useState([]);
  const [formError, setFormError] = useState('');

  const selectedProduct = useMemo(() => {
    return PRODUCT_CATALOG.find((p) => p.id === selectedProductId) || PRODUCT_CATALOG[0];
  }, [selectedProductId]);

  const preview = useMemo(() => {
    const weightStr = weightGramsInput.trim();
    if (weightStr === '') return { kind: 'empty', calories: null, weightGrams: null };

    const weightGrams = Number(weightStr);
    if (!Number.isFinite(weightGrams) || weightGrams <= 0) {
      return {
        kind: 'error',
        calories: null,
        weightGrams: null,
        error: 'Вес должен быть больше 0.',
      };
    }

    const calories = computeCalories(selectedProduct.kcalPer100g, weightGrams);
    return { kind: 'ok', calories, weightGrams };
  }, [selectedProduct.kcalPer100g, weightGramsInput]);

  const totalCalories = useMemo(() => {
    let sum = 0;
    for (const it of items) sum += it.calories;
    return sum;
  }, [items]);

  // Screen reader announcement channel.
  const [ariaAnnouncement, setAriaAnnouncement] = useState('');
  useEffect(() => {
    if (formError) {
      setAriaAnnouncement(formError);
      return;
    }

    if (preview.kind === 'ok') {
      setAriaAnnouncement(
        `Preview: ${formatCalories(preview.calories)} kcal. Total: ${formatCalories(totalCalories)} kcal.`
      );
    } else if (preview.kind === 'error') {
      setAriaAnnouncement(preview.error);
    } else {
      setAriaAnnouncement('');
    }
  }, [formError, preview, totalCalories]);

  return e(
    'div',
    { className: 'container' },
    e('h1', null, 'Calories Calculator'),
    e(
      'form',
      {
        className: 'card',
        onSubmit: (ev) => {
          // Prevent page reload; the action happens via the button.
          ev.preventDefault();
        },
      },
      e('label', { className: 'field' },
        'Product',
        e(
          'select',
          {
            className: 'select',
            value: selectedProductId,
            onChange: (ev) => {
              setFormError('');
              setSelectedProductId(ev.target.value);
            },
            'aria-label': 'Select product',
          },
          PRODUCT_CATALOG.map((p) => e('option', { key: p.id, value: p.id }, p.name))
        )
      ),
      e('label', { className: 'field' },
        'Weight (grams)',
        e('input', {
          type: 'number',
          inputMode: 'decimal',
          min: '0',
          step: '0.1',
          value: weightGramsInput,
          onChange: (ev) => {
            setFormError('');
            setWeightGramsInput(ev.target.value);
          },
          placeholder: 'e.g. 150',
        }),
      ),
      e(
        'button',
        {
          type: 'button',
          className: 'primaryButton',
          onClick: () => {
            setFormError('');

            if (preview.kind === 'empty') {
              setFormError('Введите вес больше 0.');
              return;
            }
            if (preview.kind === 'error') {
              setFormError(preview.error);
              return;
            }

            const id = String(Date.now()) + String(Math.random()).slice(2);
            setItems((prevItems) => [
              ...prevItems,
              {
                id,
                productName: selectedProduct.name,
                weightGrams: preview.weightGrams,
                calories: preview.calories,
              },
            ]);

            // Clear input after successful add.
            setWeightGramsInput('');
          },
        },
        'Add to list'
      ),
      e(
        'div',
        { className: 'result', role: 'status', 'aria-live': 'polite' },
        formError
          ? e('p', { className: 'error' }, formError)
          : null,
        preview.kind === 'ok'
          ? e(
              'div',
              { className: 'previewRow' },
              e('p', { className: 'mutedP' }, 'Preview'),
              e('p', { className: 'success' },
                'Weight: ',
                e('strong', null, `${formatCalories(preview.weightGrams)} g`)
              ),
              e('p', { className: 'success' },
                'Calories: ',
                e('strong', null, `${formatCalories(preview.calories)} kcal`)
              )
            )
          : null,
        preview.kind === 'error'
          ? e('p', { className: 'error' }, preview.error)
          : null,
        preview.kind === 'empty'
          ? e('p', { className: 'hint' }, 'Pick a product and enter weight to see the preview.')
          : null
      ),
      e('div', { className: 'srOnly', 'aria-live': 'assertive' }, ariaAnnouncement)
    ),
    e(
      'div',
      { className: 'card listCard' },
      e('h2', { className: 'sectionTitle' }, 'List'),
      items.length === 0
        ? e('p', { className: 'hint' }, 'Add products to calculate the total.')
        : e(
            'div',
            { className: 'itemsList', role: 'list' },
            items.map((it) =>
              e(
                'div',
                { key: it.id, className: 'itemRow', role: 'listitem' },
                e(
                  'div',
                  { className: 'itemMain' },
                  e('p', { className: 'itemName' }, it.productName),
                  e('p', { className: 'itemMeta' }, `Weight: ${formatCalories(it.weightGrams)} g`),
                  e('p', { className: 'itemMeta' }, `Calories: ${formatCalories(it.calories)} kcal`)
                ),
                e(
                  'button',
                  {
                    type: 'button',
                    className: 'dangerButton',
                    onClick: () =>
                      setItems((prevItems) => prevItems.filter((x) => x.id !== it.id)),
                    'aria-label': `Remove ${it.productName}`,
                  },
                  'Remove'
                )
              )
            )
          ),
      items.length > 0
        ? e(
            'div',
            { className: 'totalRow' },
            e('p', { className: 'mutedP' }, 'Total'),
            e('p', { className: 'success' },
              e('strong', null, `${formatCalories(totalCalories)} kcal`)
            )
          )
        : null
    )
  );
}

const rootEl = document.getElementById('root');
const root = ReactDOM.createRoot(rootEl);
root.render(e(App));

