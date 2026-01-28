import homePage from "./home.js";
import menuPage from "./menu.js";
import aboutPage from "./about.js";

export function router(page) {
  const content = document.getElementById("content");
  content.innerHTML = "";
  let makePage;
  switch (page) {
    case "home":
      makePage = homePage;
      break;

    case "menu":
      makePage = menuPage;
      break;

    case "about":
      makePage = aboutPage;
      break;

    default:
      break;
  }
  content.appendChild(makePage(document));
}
