import { Task } from "@models/task";
import { PRIORITY, PRIORITY_DETAILS } from "../constants";
import {
  fieldSet,
  form,
  labelledInput,
  radioInput,
  select,
  textArea,
} from "@components/form";
import { dateToDue, makeDatesForInput, strToKebabCase } from "../utils";
import { Tid } from "../types";
import { modalDialog } from "@components/modalDialog";
import { Project } from "@models/project";
import { tooltip } from "@components/tooltip";

export function taskDetailsView(task: Task, projectName: string | null) {
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task-details");
  taskContainer.dataset.id = task.id;

  const priorityDisplay = PRIORITY_DETAILS[task.priority].label;
  const deadlineDisplay = `${task.deadline.toDateString()}, at ${task.deadline.toLocaleTimeString()}`;

  const template = `
  <div class="description">${task.description}</div>
  <div class="priority">
    <span>Priority:</span>
    <span>${priorityDisplay}</span>
  </div>
  <div class="deadline">
    <span>Due:</span>
    <span>${deadlineDisplay}</span>
  </div>
  <div class="project">
    <span>Project:</span>
    <span>${projectName ? projectName : "-"}</span>
  </div>
  <div class="notes">
    <span>Notes:</span>
    ${
      task.notes
        ? "<div class='notes-content'>" + task.notes + "</div>"
        : "<span>-</span>"
    }
    </div>
  `;
  taskContainer.innerHTML = template;

  const dialog = modalDialog(task.name, "task-details");
  dialog.querySelector("dialog")!.appendChild(taskContainer);

  return dialog;
}

export function taskListView(tasks: Task[]) {
  const template = `
  <div class="task-list-container">
    <ul>
      ${tasks.map((t) => taskItemView(t)).join("")}
    </ul>
  </div>
  `;
  return template;
}

function taskItemView(task: Task) {
  const due = task.completed ? "completed" : dateToDue(new Date(task.deadline));
  const isOverdue = due.includes("ago");
  const priorityLabel = PRIORITY_DETAILS[task.priority].label;
  const priorityDisplay = isOverdue
    ? "Overdue"
    : PRIORITY_DETAILS[task.priority].display;

  const template = `
    <li>
      <div class="task ${task.completed ? "completed" : ""}" id="${task.id}">
        <div class="tooltip-container">
          <label for="toggle-completed" style="position:absolute; left:-2000px">Toggle task completed status</label>
          <input aria-describedby="completedLabel" id="toggle-completed" type="checkbox" class="toggle-complete" ${task.completed ? " checked" : ""}>
          ${tooltip(`Mark as ${task.completed ? "not " : ""}done`)}
        </div>
        <button class="task-body task-details-btn" aria-label="Show task details">
          <h3 class="title">${task.name}</h3>
          <div class="details">
            <div ${isOverdue ? "" : "aria-describedby='priority-tooltip'"} class="priority ${isOverdue ? "overdue" : priorityLabel.toLowerCase()}">${priorityDisplay}</div>
            ${isOverdue ? "" : tooltip("Priority: " + priorityLabel)}
            <div class="due">${due}</div>
            </div>
          </button>
          <div class="btn-container">
            <button class="edit-task">Edit</button>
            <button class="delete-task-btn">X</button>
          </div>
        </div>
      </li>`;
  return template;
}

export function taskFormView(
  projects: Project[],
  currentProject?: Tid,
  task?: Task,
) {
  const inputs: Record<string, HTMLElement> = {
    name: labelledInput(
      "name",
      "name",
      "text",
      "Name",
      true,
      task ? task.name : undefined,
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
      task ? task.description : undefined,
      undefined,
      undefined,
      0,
      40,
    ),
  };

  const [defaultDeadline, min, max] = makeDatesForInput(task);
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
        task ? task.priority === Number(p) : priorityLabel === "Normal",
      ),
    );
  }

  const prioritySet = fieldSet("Priority", radioButtons);
  prioritySet.classList.add("radio");

  const notes = textArea("notes", "notes", "Notes", undefined, task?.notes);

  let options: { value: Tid | null; label: string }[] = [
    { value: null, label: "Miscellaneous" },
  ];
  projects.forEach((p) => options.push({ value: p.id, label: p.name }));
  const defaultProject =
    projects.find((p) => p.id === currentProject)?.id || null;
  const project = select(
    "project",
    "project",
    "Quest",
    options,
    task ? task.project : defaultProject,
  );

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "OK";

  const taskForm = form("task-form", [
    inputs.name,
    inputs.description,
    deadline,
    project,
    prioritySet,
    notes,
    submitBtn,
  ]);

  const dialog = modalDialog(task ? "Edit Task" : "New Task");
  dialog.querySelector("dialog")!.appendChild(taskForm);
  return dialog;
}
