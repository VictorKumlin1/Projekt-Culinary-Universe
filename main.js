// search = document.getElementById("sök-knapp")
hamburger = document.querySelector(".hamburger");
hamburger.onclick = function () {
  navBar = document.querySelector(".nav-bar");
  navBar.classList.toggle("active");
};

let searchText = document.getElementById("txtSearch");

searchText.onkeydown = async function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    let searchTerm = searchText.value; // Hämtar det som står i sökrutan
    console.log("Kommer söka efter", searchTerm);

    // Det här anropas funktionen för att hämta info från ett API.
    // Vi väntar på svaret med await
    let results = await search(searchTerm);

    // Här anropas funktionen som ansvarar för att "rendera" (alltså rita ut) resultatet
    renderResults(results);

    // TODO: Skriv kod för att tömma sökfältet igen
  }
};

// Detta är en asynkron funktion som anropar ett API och returnerar svaret som ett JSON-objekt.
async function search(searchString) {
  // Använd funktionen fetch för att anropa ett API med rätt parametrar.
  /* 
    Om ni vill använder ni The Movie Database API.
    Det finns dokumentation här https://developers.themoviedb.org/3/getting-started/introduction
    Ni kan i så fall låna min API-nyckel. Den kommer postas i Classroom.
    */

  //Här bygger vi upp den URL som vi ska använda i vårat anrop till APIet.
  let apiKey = "f031cac33f4e4de5b7f94d3d0a2d64f4"; //TODO: Lägg in API-nyckeln från Classroom här.
  var url = `https://api.spoonacular.com/recipes/complexSearch?query=${searchString}&apiKey=${apiKey}`;
  console.log("Den URL vi kommer anropa: ", url);
  // let apiKey = "78e6098494msh5377515b442380fp105906jsn6dc4264ee58c";
  // let url = `https://api.yummly.com/v1/api/recipes?_app_id=${appId}&_app_key=${apiKey}&q=${searchString}`;
  // console.log("The URL we will call: ", url);

  //Här används URLen för att göra anrop med den inbyggda funktionen fetch()
  let response = await fetch(url);

  // Detta gör om resultatet från APIet till ett JSON-objekt.
  let json = await response.json();
  return json;
}

/*
  Den här funktionen går igenom sökresultatet som är parametern "results"
  och skriver ut det i en lista i DOMen.
*/
function renderResults(results) {
  let resultdiv = document.getElementById("searchresults");
  console.log("resultatet: ", results);

  // if (resultdiv.children.length > 0) {
  //   resultdiv.innerHTML = "";
  // }

  let allObjects = results.results;

  for (let index = 0; index < allObjects.length; index++) {
    // const object = allObjects[index];
    // console.log("loopar igenom objekten ", object);
    // let objectDiv = document.createElement("div");
    // objectDiv.setAttribute("class", "object-div");
    // objectDiv.innerHTML = `
    // <img src = "${object.image} ""
    // <h2> ${object.title} </h2>
    // `;
    // output.appendChild(objectDiv);
    const object = allObjects[index];

    let recipeCardHTML = `
    <div class ="recipe-samling" >

    <div class = "recipe-info"

    <h2 class= "object-title" > ${object.title} </h2>
    <img class="object-img" src  = "${object.image}" >

    </div>
    </div>

    
    `;

    resultdiv.insertAdjacentHTML("beforeend", recipeCardHTML);
  }
}
