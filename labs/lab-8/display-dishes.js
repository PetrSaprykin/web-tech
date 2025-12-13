// Глобальная переменная для хранения всех блюд
let dishes = [];
let dishesByCategory = {};

// Функция для загрузки блюд из API
async function loadDishes() {
  try {
    const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    dishes = await response.json();

    // Инициализируем страницу после загрузки данных
    initializePage();
  } catch (error) {
    console.error("Ошибка при загрузке блюд:", error);

    // Показываем сообщение об ошибке пользователю
    const errorMessage = document.createElement("div");
    errorMessage.style.cssText = `
      background-color: #ffe6e6;
      border: 2px solid #ff4444;
      border-radius: 10px;
      padding: 20px;
      margin: 20px;
      text-align: center;
      color: #cc0000;
    `;
    errorMessage.textContent =
      "Не удалось загрузить меню. Пожалуйста, обновите страницу или попробуйте позже.";

    const main = document.querySelector("main");
    if (main) {
      main.prepend(errorMessage);
    }

    // Загружаем заказ из localStorage даже при ошибке загрузки блюд
    if (window.loadOrderFromStorage) {
      window.loadOrderFromStorage();
    }
  }
}

// Функция для инициализации страницы после загрузки данных
function initializePage() {
  // Сортируем блюда по алфавиту
  const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));

  // Группируем блюда по категориям
  dishesByCategory = {
    soup: sortedDishes.filter((dish) => dish.category === "soup"),
    main: sortedDishes.filter((dish) => dish.category === "main"),
    salad: sortedDishes.filter((dish) => dish.category === "salad"),
    drink: sortedDishes.filter((dish) => dish.category === "drink"),
    dessert: sortedDishes.filter((dish) => dish.category === "dessert"),
  };

  // Отображаем блюда по категориям
  displayDishesByCategory("soup", dishesByCategory.soup);
  displayDishesByCategory("main", dishesByCategory.main);
  displayDishesByCategory("salad", dishesByCategory.salad);
  displayDishesByCategory("drink", dishesByCategory.drink);
  displayDishesByCategory("dessert", dishesByCategory.dessert);

  // Добавляем обработчики событий
  addDishSelectionHandlers();
  addFilterHandlers();

  // Загружаем и выделяем выбранные блюда
  loadAndHighlightSelectedDishes();

  // Обновляем панель заказа
  if (window.updateStickyPanel) {
    window.updateStickyPanel();
  }
}

// Функция для загрузки и выделения выбранных блюд
function loadAndHighlightSelectedDishes() {
  // Загружаем заказ из localStorage
  if (window.loadOrderFromStorage) {
    window.loadOrderFromStorage();
  }

  // Выделяем выбранные блюда
  highlightSelectedDishes();
}

// Функция для выделения выбранных блюд на странице
function highlightSelectedDishes() {
  const order = window.getOrderFromStorage ? window.getOrderFromStorage() : {};

  document.querySelectorAll(".dish-card").forEach((card) => {
    const dishKeyword = card.getAttribute("data-dish");
    const dish = dishes.find((d) => d.keyword === dishKeyword);

    if (dish && order[dish.category]?.keyword === dishKeyword) {
      // Выделяем карточку
      card.style.border = "2px solid tomato";
      card.style.backgroundColor = "#fff5f5";
      card.style.boxShadow = "0 4px 12px rgba(255, 99, 71, 0.2)";

      // Обновляем кнопку
      const button = card.querySelector("button");
      if (button) {
        button.textContent = "Выбрано";
        button.style.backgroundColor = "tomato";
        button.style.color = "white";
        button.style.cursor = "default";

        // Добавляем обработчик для удаления
        button.onclick = function (e) {
          e.stopPropagation();
          if (
            window.removeDishFromOrder &&
            confirm(`Удалить "${dish.name}" из заказа?`)
          ) {
            window.removeDishFromOrder(dish.category);
            // Возвращаем кнопку в исходное состояние
            button.textContent = "Добавить";
            button.style.backgroundColor = "#f1eee9";
            button.style.color = "#333";
            button.style.cursor = "pointer";
            // Убираем выделение карточки
            card.style.border = "2px solid transparent";
            card.style.backgroundColor = "white";
            card.style.boxShadow = "none";
          }
        };
      }
    } else {
      // Сбрасываем стили для невыбранных блюд
      card.style.border = "2px solid transparent";
      card.style.backgroundColor = "white";
      card.style.boxShadow = "none";

      const button = card.querySelector("button");
      if (button && button.textContent === "Выбрано") {
        button.textContent = "Добавить";
        button.style.backgroundColor = "#f1eee9";
        button.style.color = "#333";
        button.style.cursor = "pointer";
        button.onclick = null;
      }
    }
  });
}

// Экспортируем функцию для использования в других файлах
window.highlightSelectedDishes = highlightSelectedDishes;

// Функция для отображения блюд определенной категории
function displayDishesByCategory(category, dishesArray) {
  const section = document.querySelector(`.${getCategoryClassName(category)}`);
  if (!section) return;

  const dishesContainer = section.querySelector(".dishes");
  if (!dishesContainer) return;

  dishesContainer.innerHTML = "";

  dishesArray.forEach((dish) => {
    const dishCard = createDishCard(dish);
    dishesContainer.appendChild(dishCard);
  });
}

// Функция для получения имени CSS-класса по категории
function getCategoryClassName(category) {
  const categoryMap = {
    soup: "soups",
    main: "main-dishes",
    salad: "salads",
    drink: "drinks",
    dessert: "desserts",
  };
  return categoryMap[category] || category;
}

// Функция для создания карточки блюда
function createDishCard(dish) {
  const card = document.createElement("div");
  card.className = "dish-card";
  card.setAttribute("data-dish", dish.keyword);
  card.setAttribute("data-kind", dish.kind);
  card.setAttribute("data-category", dish.category);

  // Проверяем, выбрано ли это блюдо
  const order = window.getOrderFromStorage ? window.getOrderFromStorage() : {};
  const isSelected = order[dish.category]?.keyword === dish.keyword;

  card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" />
        <p class="price">${dish.price} ₽</p>
        <p class="dish-name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button>${isSelected ? "Выбрано" : "Добавить"}</button>
    `;

  // Применяем стили для выбранного блюда
  if (isSelected) {
    card.style.border = "2px solid tomato";
    card.style.backgroundColor = "#fff5f5";
  }

  return card;
}

// Функция для добавления обработчиков выбора блюд
function addDishSelectionHandlers() {
  document.addEventListener("click", function (e) {
    const dishCard = e.target.closest(".dish-card");
    if (dishCard) {
      const dishKeyword = dishCard.getAttribute("data-dish");
      const selectedDish = dishes.find((dish) => dish.keyword === dishKeyword);

      if (selectedDish) {
        const order = window.getOrderFromStorage
          ? window.getOrderFromStorage()
          : {};
        const isSelected =
          order[selectedDish.category]?.keyword === dishKeyword;

        if (isSelected) {
          // Если блюдо уже выбрано, спрашиваем об удалении
          if (confirm(`Удалить "${selectedDish.name}" из заказа?`)) {
            if (window.removeDishFromOrder) {
              window.removeDishFromOrder(selectedDish.category);
            }
          }
        } else {
          // Если блюдо не выбрано, добавляем его
          if (window.addDishToOrder) {
            window.addDishToOrder(selectedDish);
          }
        }
      }
    }
  });
}

// Функция для добавления обработчиков фильтров
function addFilterHandlers() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const categorySection = this.closest("section");
      const category = getCategoryFromSection(categorySection);
      const kind = this.getAttribute("data-kind");

      // Управление активным классом
      if (this.classList.contains("active")) {
        this.classList.remove("active");
        showAllDishes(category);
      } else {
        // Снимаем активный класс с всех кнопок в секции
        categorySection.querySelectorAll(".filter-btn").forEach((b) => {
          b.classList.remove("active");
        });
        this.classList.add("active");
        filterDishesByKind(category, kind);
      }
    });
  });
}

// Функция для получения категории из секции
function getCategoryFromSection(section) {
  if (section.classList.contains("soups")) return "soup";
  if (section.classList.contains("main-dishes")) return "main";
  if (section.classList.contains("salads")) return "salad";
  if (section.classList.contains("drinks")) return "drink";
  if (section.classList.contains("desserts")) return "dessert";
  return "";
}

// Функция для фильтрации блюд по типу
function filterDishesByKind(category, kind) {
  const section = document.querySelector(`.${getCategoryClassName(category)}`);
  const dishesContainer = section.querySelector(".dishes");
  const dishCards = dishesContainer.querySelectorAll(".dish-card");

  dishCards.forEach((card) => {
    if (kind === "all" || card.getAttribute("data-kind") === kind) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// Функция для показа всех блюд категории
function showAllDishes(category) {
  const section = document.querySelector(`.${getCategoryClassName(category)}`);
  const dishesContainer = section.querySelector(".dishes");
  const dishCards = dishesContainer.querySelectorAll(".dish-card");

  dishCards.forEach((card) => {
    card.style.display = "flex";
  });
}

// Функция для получения всех блюд
function getAllDishes() {
  return dishes;
}

// Функция для получения блюд по категории
function getDishesByCategory(category) {
  return dishesByCategory[category] || [];
}

// Функция для поиска блюда по keyword
function getDishByKeyword(keyword) {
  return dishes.find((dish) => dish.keyword === keyword);
}

// Экспортируем функции для использования в других файлах
window.getAllDishes = getAllDishes;
window.getDishesByCategory = getDishesByCategory;
window.getDishByKeyword = getDishByKeyword;

// Инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", function () {
  // Загружаем блюда из API
  loadDishes();
});
