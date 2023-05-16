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
  let url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchString}`;

  console.log("Den URL vi kommer anropa: ", url);

  let response = await fetch(url);

  let json = await response.json();
  return json;
}

function renderResults(results) {
  let resultdiv = document.getElementById("searchresults");
  console.log("resultatet: ", results);

  let allObjects = results.meals;

  for (let index = 0; index < allObjects.length; index++) {
    const object = allObjects[index];

    let recipeCardHTML = `
      <div class="recipe-samling">
        <div class="recipe-info">
          <img class="recipe-img" src="${object.strMealThumb}" alt="${object.strMeal}">
          <div class="recipe-title">
            <h2>${object.strMeal}</h2>
          </div>
          
          <button class="recipe-btn">Instructions</button>


          <div class="box" style="display: none;">
            <h3>${object.strMeal}:</h3>
            <p>${object.strIngredient1}</p>
            <p>${object.strIngredient2}</p>
            <p>${object.strIngredient3}</p>
            <h3>Instructions:</h3>
            <p>${object.strInstructions}</p>
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

      // Scroll to the box
      box.parentNode.scrollIntoView({ behavior: "smooth", block: "start" });

      this.textContent =
        box.style.display === "none" ? "Instructions" : "Close";
    });
  });
}
