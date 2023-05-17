let hamburger = document.querySelector(".hamburger");
hamburger.onclick = function () {
  let navBar = document.querySelector(".nav-bar");
  navBar.classList.toggle("active");
};

let searchText = document.getElementById("txtSearch");

searchText.onkeydown = async function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    let searchTerm = searchText.value;
    console.log("Kommer söka efter", searchTerm);

    let results = await search(searchTerm);

    renderResults(results);
  }
};

async function search(searchString) {
  let apiKey = "f031cac33f4e4de5b7f94d3d0a2d64f4";
  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchString}`;

  console.log("Den URL vi kommer anropa: ", url);

  let response = await fetch(url);

  let json = await response.json();

  // Retrieve the individual recipes by making additional requests
  let recipes = json.results;
  let detailedRecipes = await Promise.all(
    recipes.map((recipe) => fetchRecipeDetails(recipe.id))
  );

  // Add the detailed recipe information to each recipe object
  detailedRecipes.forEach((detailedRecipe, index) => {
    recipes[index].instructions = detailedRecipe.instructions;
    recipes[index].ingredients = getIngredientsList(detailedRecipe);
  });

  return json;
}

async function fetchRecipeDetails(recipeId) {
  let apiKey = "13156a9135b3448c80c2c2cb8cac572e  ";
  let url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

  let response = await fetch(url);
  let json = await response.json();
  return json;
}

function getIngredientsList(recipe) {
  let ingredients = recipe.extendedIngredients.map(
    (ingredient) => `${ingredient.original}`
  );
  return ingredients;
}

function renderResults(results) {
  let resultdiv = document.getElementById("searchresults");
  resultdiv.innerHTML = ""; // Clear existing content

  console.log("resultatet: ", results);

  let allObjects = results.results;

  for (let index = 0; index < allObjects.length; index++) {
    const object = allObjects[index];

    let recipeCardHTML = `
      <div class="recipe-samling">
        <div class="recipe-info">
          <img class="recipe-img" src="${object.image}" alt="${object.title}">
          <div class="recipe-title">
            <h2>${object.title}</h2>
          </div>
          
          <button class="recipe-btn">Instructions</button>

          <div class="box" style="display: none;">
            <h3>${object.title}:</h3>
            <h4>Ingredients:</h4>
            <ul>
              ${object.ingredients
                .map((ingredient) => `<li>${ingredient}</li>`)
                .join("")}
            </ul>
            <h4>Instructions:</h4>
            <p>${object.instructions}</p>
            <a href="${object.sourceUrl}" target="_blank">View Recipe</a>
          </div>
        </div>
      </div>
    `;

    resultdiv.insertAdjacentHTML("beforeend", recipeCardHTML);
  }

  let recipeButtons = document.querySelectorAll(".recipe-btn");
  recipeButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      let box = this.parentNode.querySelector(".box");
      box.style.display = box.style.display === "none" ? "block" : "none";
      if (box.style.display === "block") {
        box.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
        window.scrollBy(0, -50); // Adjust the scroll position by subtracting 50 pixels from the current position
      }
      this.textContent =
        box.style.display === "none" ? "Instructions" : "Close";
    });
  });
}
