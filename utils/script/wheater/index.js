import { dataDisplay, mapper, topFunction } from "./weather.js";

/* Main program */
function main() {
  mapper();

  const button = document.querySelector("#bouton");
  const input = document.querySelector("#city");
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      button.click();
    }
  });

  button.addEventListener("click", () => {
    dataDisplay(true, null);
  });

  /* Management of the up button */
  let top = document.getElementById("top");

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
      top.style.display = "block";
    else top.style.display = "none";
  };

  top.addEventListener("click", () => {
    topFunction();
  });
}

main(); /* Launch */