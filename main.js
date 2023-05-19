
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
  let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchString}`;

  console.log("URL to be requested: ", url);

  let response = await fetch(url);

  let json = await response.json();

  return json;
}

function renderResults(results) {
  let resultdiv = document.getElementById("searchresults");
  resultdiv.innerHTML = "";

  console.log("resultatet: ", results);

  let allObjects = results.meals;

  if (allObjects === null) {
    resultdiv.innerHTML = `<p class="no-recipes-found">No recipes found : /</p>`;
    return;
  }

  allObjects.forEach((object) => {
    let recipeCardHTML = `
    <div class="recipe-samling">
      <div class="recipe-info">
        <div class="recipe-title">
          <h2>${object.strMeal}</h2>
        </div>
        <img class="recipe-img" src="${object.strMealThumb}" alt="${
      object.strMeal
    }">
  
        <button class="recipe-btn">Instructions</button>
  
        <div class="box" style="display: none;">
          <h3>${object.strMeal}:</h3>
          <h4>Ingredients:</h4>
          <ul>
            ${getIngredientsList(object)}
          </ul>
          <h4>Instructions:</h4>
          <p>${object.strInstructions}</p>

        <a class="recipe-link" href="${
          object.strSource
        }" target="_blank">Go to Recipe</a>
        </div>
      </div>
    </div>
  `;

    resultdiv.insertAdjacentHTML("beforeend", recipeCardHTML);
  });

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

function getIngredientsList(recipe) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      ingredients.push(
        `${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`
      );
    }
  }
  return ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("");
}
