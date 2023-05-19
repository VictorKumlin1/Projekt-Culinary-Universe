//Gemensam javascript

let hamburger = document.querySelector(".hamburger");
hamburger.onclick = function () {
  let navBar = document.querySelector(".nav-bar");
  navBar.classList.toggle("active");
};
