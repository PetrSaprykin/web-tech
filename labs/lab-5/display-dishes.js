
document.addEventListener("DOMContentLoaded", function () {
  const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));

  const dishesByCategory = {
    soup: sortedDishes.filter((dish) => dish.category === "soup"),
    main: sortedDishes.filter((dish) => dish.category === "main"),
    salad: sortedDishes.filter((dish) => dish.category === "salad"),
    drink: sortedDishes.filter((dish) => dish.category === "drink"),
    dessert: sortedDishes.filter((dish) => dish.category === "dessert"),
  };

  displayDishesByCategory("soup", dishesByCategory.soup);
  displayDishesByCategory("main", dishesByCategory.main);
  displayDishesByCategory("salad", dishesByCategory.salad);
  displayDishesByCategory("drink", dishesByCategory.drink);
  displayDishesByCategory("dessert", dishesByCategory.dessert);

  addDishSelectionHandlers();

  addFilterHandlers();
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
    // Проверяем, был ли клик по кнопке "Добавить" или по карточке
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

      // Управление активным классом
      if (this.classList.contains("active")) {
        this.classList.remove("active");
        showAllDishes(category);
      } else {
        // Снимаем активный класс со всех кнопок в этой категории
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
