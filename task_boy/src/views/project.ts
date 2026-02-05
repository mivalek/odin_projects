import { Project } from "@models/project";
import {
  fieldSet,
  form,
  labelledInput,
  radioInput,
  textArea,
} from "@components/form";
import { makeDatesForInput, strToKebabCase } from "../utils";
import { PRIORITY, PRIORITY_DETAILS } from "../constants";
import { modalDialog } from "@components/modalDialog";

export function projectListView(projects: Project[]) {
  const template = `
  <li id="projects" class="nav-section">
  <div class="h-container">
    <h2>Quests</h2>
  </div>
  <ul>
    <li id='all-projects'>
      <button id='all-projects-btn'>All quests</button>
    </li>
    ${projects.map((p) => projectItemView(p)).join("")}
    <li id='misc-projects'>
      <button id='misc-projects-btn'>Miscellaneous</button>
    </li>
  </ul>
  <div id="new-project"><button id="new-project-btn" aria-label="New project">+</button></div>
  </li>
  `;
  return template;
}

function projectItemView(project: Project) {
  const template = `
  <li data-id="${project.id}" data-order="${project.position}">
    <div>
      <button class="project-btn" draggable="true">${project.name}</button>
      <button class="delete-project-dialog">X</button>
    </div>
  </li>`;

  return template;
}

export function projectFormView(project?: Project) {
  const inputs: Record<string, HTMLElement> = {
    name: labelledInput(
      "name",
      "name",
      "text",
      "Name",
      true,
      project ? project.name : undefined,
      undefined,
      undefined,
      3,
      20,
    ),
    description: labelledInput(
      "description",
      "description",
      "text",
      "Description",
      false,
      project ? project.description : undefined,
      undefined,
      undefined,
      undefined,
      40,
    ),
  };

  const [defaultDeadline, min, max] = makeDatesForInput(project);
  const timezoneOffset = min.getTimezoneOffset() / 60;
  defaultDeadline.setHours(defaultDeadline.getHours() - timezoneOffset);
  defaultDeadline.setSeconds(0, 0);
  const deadline = labelledInput(
    "deadline",
    "deadline",
    "datetime-local",
    "Deadline",
    true,
    defaultDeadline.toISOString().replace(/\..*/, ""),
    min.toISOString().replace(/\..*/, ""),
    max.toISOString().replace(/\..*/, ""),
  );
  const radioButtons: HTMLElement[] = [];
  for (let p in PRIORITY) {
    if (isNaN(Number(p))) continue;
    const priorityLabel = PRIORITY_DETAILS[p].label;
    radioButtons.push(
      radioInput(
        strToKebabCase("priotity " + priorityLabel),
        "priority",
        priorityLabel,
        p,
        project ? project.priority === Number(p) : priorityLabel === "Normal",
      ),
    );
  }

  const prioritySet = fieldSet("Priority", radioButtons);
  prioritySet.classList.add("radio");

  const notes = textArea("notes", "notes", "Notes", undefined, project?.notes);

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "OK";

  const projectForm = form("project-form", [
    inputs.name,
    inputs.description,
    deadline,
    prioritySet,
    notes,
    submitBtn,
  ]);

  const dialog = modalDialog(project ? "Edit Quest" : "New Quest");
  dialog.querySelector("dialog")!.appendChild(projectForm);
  return dialog;
}

export function projectDeleteDialogView() {
  const dialog = modalDialog("Delete quest");
  const container = document.createElement("div");
  const template = `
  <div class="content">
  <p>Deleting a quest will also remove all tasks attached to it.</p>
  <p>Delete anyway?</p>
  <div class="btn-container">
  <button class="cancel">No</button>
  <button class="delete-project-btn">Yes</button>
  </div>
  `;

  container.innerHTML = template;
  dialog.querySelector("dialog")!.appendChild(container);
  container
    .querySelector<HTMLButtonElement>(".cancel")!
    .addEventListener("click", function () {
      this.closest("dialog")!.close();
    });
  return dialog;
}
