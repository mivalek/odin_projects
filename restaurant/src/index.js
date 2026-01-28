import "./reset.css";
import "./styles.css";
import { router } from "./modules/router.js";

((doc) => {
  const buttons = doc.querySelectorAll("nav button");

  buttons.forEach((b) =>
    b.addEventListener("click", function (e) {
      document.querySelector(".active")?.classList.remove("active");
      this.classList.add("active");
      router(b.id);
    }),
  );

  doc.getElementById("home").click();
})(document);
