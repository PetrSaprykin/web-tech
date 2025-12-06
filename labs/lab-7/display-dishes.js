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
  }
}

// Функция для инициализации страницы после загрузки данных
function initializePage() {
  const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));

  const dishesByCategory = {
    soup: sortedDishes.filter((dish) => dish.category === "soup"),
    main: sortedDishes.filter((dish) => dish.category === "main"),
    salad: sortedDishes.filter((dish) => dish.category === "salad"),
    drink: sortedDishes.filter((dish) => dish.category === "drink"),
    dessert: sortedDishes.filter((dish) => dish.category === "dessert"),
  };

  // отображаем блюда по категориям
  displayDishesByCategory("soup", dishesByCategory.soup);
  displayDishesByCategory("main", dishesByCategory.main);
  displayDishesByCategory("salad", dishesByCategory.salad);
  displayDishesByCategory("drink", dishesByCategory.drink);
  displayDishesByCategory("dessert", dishesByCategory.dessert);

  addDishSelectionHandlers();
  addFilterHandlers();
}

document.addEventListener("DOMContentLoaded", function () {
  // Загружаем блюда из API
  loadDishes();
});

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

function createDishCard(dish) {
  const card = document.createElement("div");
  card.className = "dish-card";
  card.setAttribute("data-dish", dish.keyword);
  card.setAttribute("data-kind", dish.kind);

  card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" />
        <p class="price">${dish.price} ₽</p>
        <p class="dish-name">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button>Добавить</button>
    `;

  return card;
}

function addDishSelectionHandlers() {
  document.addEventListener("click", function (e) {
    const dishCard = e.target.closest(".dish-card");
    if (dishCard) {
      const dishKeyword = dishCard.getAttribute("data-dish");
      const selectedDish = dishes.find((dish) => dish.keyword === dishKeyword);

      if (selectedDish) {
        addDishToOrder(selectedDish);
      }
    }
  });
}

function addFilterHandlers() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const categorySection = this.closest("section");
      const category = getCategoryFromSection(categorySection);
      const kind = this.getAttribute("data-kind");

      // управление активным классом
      if (this.classList.contains("active")) {
        this.classList.remove("active");
        showAllDishes(category);
      } else {
        // снимаем активный класс
        categorySection.querySelectorAll(".filter-btn").forEach((b) => {
          b.classList.remove("active");
        });
        this.classList.add("active");
        filterDishesByKind(category, kind);
      }
    });
  });
}

function getCategoryFromSection(section) {
  if (section.classList.contains("soups")) return "soup";
  if (section.classList.contains("main-dishes")) return "main";
  if (section.classList.contains("salads")) return "salad";
  if (section.classList.contains("drinks")) return "drink";
  if (section.classList.contains("desserts")) return "dessert";
  return "";
}

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

function showAllDishes(category) {
  const section = document.querySelector(`.${getCategoryClassName(category)}`);
  const dishesContainer = section.querySelector(".dishes");
  const dishCards = dishesContainer.querySelectorAll(".dish-card");

  dishCards.forEach((card) => {
    card.style.display = "flex";
  });
}
