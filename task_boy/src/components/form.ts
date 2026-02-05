import { strToKebabCase } from "../utils";

export function form(id: string, elements: HTMLElement[]) {
  const element = document.createElement("form");
  element.id = id;
  elements.forEach((el) => element.appendChild(el));

  return element;
}

export function fieldSet(legend: string, elements: HTMLElement[]) {
  const element = document.createElement("fieldset");
  element.id = strToKebabCase(legend);
  const legendElement = document.createElement("legend");
  legendElement.textContent = legend;
  element.appendChild(legendElement);
  elements.forEach((el) => element.appendChild(el));

  return element;
}
export function labelledInput(
  id: string,
  name: string,
  type: "text" | "datetime-local" | "radio",
  label: string,
  required: boolean,
  value?: string,
  min?: string,
  max?: string,
  minLength?: number,
  maxLength?: number,
) {
  const element = document.createElement("div");
  element.innerHTML = `
  <div class="label-container ${required ? "required" : ""}">
    <label for="${id}">${label}</label>
    <div class="error-msg"></div>
  </div>
  <input id="${id}"
    name="${name}"
    type="${type}"
    ${required ? " required " : ""}
    value="${value ? value : ""}"
    min="${min ? min : ""}"
    max="${max ? max : ""}"
    minLength="${minLength ? minLength : ""}"
    maxLength="${maxLength ? maxLength : ""}"
    >
  </input>
  `;

  // const input = document.createElement("input");
  // input.id = id;
  // input.name = name;
  // input.type = type;
  element.querySelector("input")!.addEventListener("input", function () {
    const errorMsgDiv = this.parentElement?.querySelector(".error-msg");
    if (errorMsgDiv) errorMsgDiv.textContent = "";
  });
  // if (required) input.required = true;
  // if (value) input.value = value;
  // if (min) input.min = min;
  // if (max) input.max = max;
  // if (minLength) input.minLength = minLength;
  // if (maxLength) input.maxLength = maxLength;
  // element.appendChild(input);

  return element;
}

export function radioInput(
  id: string,
  name: string,
  label: string,
  value: string,
  checked: boolean,
) {
  const element = labelledInput(id, name, "radio", label, false, value);
  element.querySelector("input")!.checked = checked;

  return element;
}

export function textArea(
  id: string,
  name: string,
  label: string,
  rows?: number,
  value?: string,
) {
  const element = document.createElement("div");
  element.innerHTML = `<label for="${id}">${label}</label>`;
  const area = document.createElement("textarea");
  area.id = id;
  area.name = name;
  if (value) area.defaultValue = value;
  area.spellcheck = true;
  area.rows = rows || 4;
  element.appendChild(area);

  return element;
}

export function select(
  id: string,
  name: string,
  label: string,
  options: { value: string | null; label: string }[],
  selected: string | null,
) {
  const element = document.createElement("div");
  element.innerHTML = `<label for="${id}">${label}</label>`;
  const selectElement = document.createElement("select");
  selectElement.name = name;
  selectElement.id = id;

  for (let opt of options) {
    const option = document.createElement("option");
    option.value = opt.value || "";
    option.textContent = opt.label;
    if (opt.value === selected) option.selected = true;
    selectElement.appendChild(option);
  }
  element.appendChild(selectElement);

  return element;
}
