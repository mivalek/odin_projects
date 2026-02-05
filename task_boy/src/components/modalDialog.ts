import { strToKebabCase } from "../utils";

export function modalDialog(title: string, id?: string) {
  const backdrop = document.createElement("div");
  backdrop.id = "dialog-backdrop";

  const dialog = document.createElement("dialog");
  backdrop.appendChild(dialog);
  dialog.id = (id ? id : strToKebabCase(title)) + "-dialog";
  dialog.setAttribute("closedby", "any");
  dialog.addEventListener("close", function () {
    this.closest("#dialog-backdrop")?.remove();
    this.close();
  });
  const header = document.createElement("div");
  header.classList.add("header");
  header.setAttribute("draggable", "true");
  dialog.appendChild(header);
  const heading = document.createElement("h3");
  heading.textContent = title;
  header.appendChild(heading);
  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-btn");
  closeBtn.textContent = "Close";
  closeBtn.addEventListener("click", function () {
    this.closest("dialog")!.close();
  });
  header.appendChild(closeBtn);
  return backdrop;
}
