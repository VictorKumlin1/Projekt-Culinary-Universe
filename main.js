let searchText = document.getElementById("txtSearch");

window.addEventListener("scroll", function () {
  var footer = document.getElementById("footer");
  var footerPosition = footer.getBoundingClientRect().top;

  var windowHeight = window.innerHeight;
  if (footerPosition - windowHeight <= 0) {
    footer.classList.add("slide-left");
  }
});

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
  let apiKey = "9a53df867d10449aafbda4db391217b1";
  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchString}`;

  console.log("Den URL vi kommer anropa: ", url);

  let response = await fetch(url);

  let json = await response.json();

  let recipes = json.results;
  let detailedRecipes = await Promise.all(
    recipes.map((recipe) => fetchRecipeDetails(recipe.id))
  );

  detailedRecipes.forEach((detailedRecipe, index) => {
    recipes[index].instructions = detailedRecipe.instructions;
    recipes[index].ingredients = getIngredientsList(detailedRecipe);
  });

  return json;
}

async function fetchRecipeDetails(recipeId) {
  let apiKey = "9a53df867d10449aafbda4db391217b1";
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
  resultdiv.innerHTML = "";

  console.log("resultatet: ", results);

  let allObjects = results.results;

  if (allObjects.length === 0) {
    resultdiv.innerHTML = `<p class="no-recipes-found">No recipes found : /</p>`;
    return;
  }

  for (let index = 0; index < allObjects.length; index++) {
    const object = allObjects[index];

    let recipeImage = object.image
      ? `<img class="recipe-img" src="${object.image}" alt="${object.title}">`
      : `<h2>${object.title}</h2>`;

    let recipeCardHTML = `
      <div class="recipe-samling">
        <div class="recipe-info">
          ${recipeImage}
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
      if (box.style.display === "none") {
        box.style.display = "block";
        box.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
        this.textContent = "Close";
      } else {
        box.style.display = "none";
        this.textContent = "Instructions";
      }
    });
  });
}
