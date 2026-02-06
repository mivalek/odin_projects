import { TaskController } from "@controllers/task";
import { Task } from "@models/task";
import { taskDetailsView, taskFormView } from "./task";
import { IPosition, ISettings, TCurrentProject, Tid } from "../types";
import { pageView } from "./page";
import { ProjectController } from "@controllers/project";
import { THEME, THEME_LABELS } from "../constants";
import { settingsView } from "./settings";
import { handleInvalidDate, handleInvalidName } from "../utils";
import { projectDeleteDialogView, projectFormView } from "./project";
import { Project } from "@models/project";

export function makeRenderer(
  root: HTMLElement,
  taskController: TaskController,
  projectController: ProjectController,
  settings: ISettings,
) {
  // undefined means today's tasks
  let currentProject: TCurrentProject = undefined;
  let activeNavButton = "#today";
  let currentTasks: Task[] = [];
  let dialog: HTMLDialogElement | null = null;
  let dialogPosition: { [key: string]: IPosition | undefined } = {};
  let pointerPosition: IPosition;
  let draggedProject: HTMLElement | null;
  let dragStartIdx: number;

  applySettings();
  attachDocumentEventListeners(document);

  function renderPage(parent: HTMLElement) {
    parent.innerHTML = "";
    updateCurrentTasks();

    const [header, main] = pageView(
      projectController.getProjects(),
      currentTasks,
      currentProject,
      settings.showCompleted,
    );

    attachHeaderEventListeners(header);
    parent.appendChild(header);

    attachMainEventListeners(main);
    parent.appendChild(main);
  }

  function attachDocumentEventListeners(doc: Document) {
    doc.addEventListener("dragover", (e) => {
      if (draggedProject) return; // currently dragging projects, not dialogs
      e.preventDefault();
      if (!(dialog && dialogPosition[dialog.id])) return;
      const pointerDiff = {
        x: (pointerPosition.x - e.clientX) * 2, // * 2 bc parent flex centering
        y: pointerPosition.y - e.clientY,
      };
      setDialogPosition({
        x: dialogPosition[dialog.id]!.x - pointerDiff.x,
        y: dialogPosition[dialog.id]!.y - pointerDiff.y,
      });
    });
    doc.addEventListener("dragend", (e) => {
      if (!dialog) return;
      dialogPosition[dialog.id] = {
        x: Number(dialog.style.left.replace("px", "")),
        y: Number(dialog.style.top.replace("px", "")),
      };
    });
  }

  function attachHeaderEventListeners(header: HTMLElement) {
    header
      .querySelector("#new-task-btn")!
      .addEventListener("click", () => renderTaskForm(root));
    header
      .querySelector("#new-project-btn")!
      .addEventListener("click", () => renderProjectForm(root));
    header.querySelector("#today-btn")!.addEventListener("click", () => {
      currentProject = undefined;
      activeNavButton = "#today";
      renderPage(root);
    });
    header
      .querySelector<HTMLButtonElement>("#settings-btn")!
      .addEventListener("click", function () {
        this.blur();
        renderSettingsForm(root, settings);
      });
    header
      .querySelector<HTMLButtonElement>("#credits-btn")!
      .addEventListener("click", function () {
        this.blur();
        document
          .querySelector<HTMLDialogElement>("#credits-dialog")!
          .showModal();
      });
    header
      .querySelectorAll<HTMLLIElement>("#projects li[data-id]")
      .forEach((li) => {
        const projBtn = li.querySelector<HTMLButtonElement>(".project-btn")!;
        projBtn.addEventListener("click", function () {
          currentProject = li.dataset.id as Tid;
          activeNavButton = `[data-id="${currentProject}"]`;
          renderPage(root);
        });
        if (projBtn.draggable) makeProjectDraggable(projBtn);
        li.querySelector<HTMLButtonElement>(
          ".delete-project-dialog",
        )!.addEventListener("click", function () {
          renderDeleteProjectDialog(root, li.dataset.id as Tid);
        });
      });

    header.querySelector("#all-projects-btn")?.addEventListener("click", () => {
      currentProject = "all";
      activeNavButton = "#all-projects";
      renderPage(root);
    });
    header
      .querySelector("#misc-projects-btn")
      ?.addEventListener("click", () => {
        currentProject = "misc";
        activeNavButton = "#misc-projects";
        renderPage(root);
      });

    header.querySelector(activeNavButton)!.classList.add("active");
  }

  function attachMainEventListeners(main: HTMLElement) {
    main
      .querySelector("#toggle-complete-btn")
      ?.addEventListener("click", () => {
        settings.showCompleted = !settings.showCompleted;
        setShowCompleted(settings.showCompleted);
        saveSettingsToLS(settings);
        renderPage(root);
      });

    attachTaskListEventListeners(main.querySelectorAll(".task")!);
  }
  function attachTaskListEventListeners(nodeList: NodeListOf<HTMLElement>) {
    nodeList.forEach((t) => {
      const taskId = t.id as Tid;
      t.querySelector(".task-details-btn")!.addEventListener(
        "click",
        function () {
          const task = taskController.getTaskByID(taskId)!;
          console.log(taskId, task);
          renderTaskDetails(root, task);
        },
      );
      // edit task
      t.querySelector(".edit-task")!.addEventListener("click", function (e) {
        e.stopPropagation();
        const task = taskController.getTaskByID(taskId)!;
        renderTaskForm(root, task);
      });
      // toggle complete
      t.querySelector(".toggle-complete")!.addEventListener(
        "change",
        function (e) {
          e.stopPropagation();
          taskController.toggleCompleted(taskId);
          renderPage(root);
        },
      );
    });
  }

  function renderTaskDetails(parent: HTMLElement, task: Task) {
    const projectName = task.project
      ? projectController.getProjectByID(task.project)!.name
      : null;
    const taskDetails = taskDetailsView(task, projectName);
    dialog = taskDetails.querySelector("dialog")!;
    makeDialogDraggable(dialog);
    parent.append(taskDetails);
    dialog.show();
    positionDialog();
  }

  function renderTaskForm(parent: HTMLElement, task?: Task) {
    const taskForm = taskFormView(
      projectController.getProjects(),
      currentProject === "all" || currentProject === "misc"
        ? undefined
        : currentProject,
      task,
    );
    dialog = taskForm.querySelector("dialog")!;
    makeDialogDraggable(dialog);

    const submitBtn = taskForm.querySelector(
      "button[type='submit']",
    )! as HTMLButtonElement;
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const form = this.closest("form")!;
      let isFormValid = form.checkValidity();

      const deadlineInput =
        form.querySelector<HTMLInputElement>("input#deadline")!;
      if (!isFormValid) {
        // invalid form
        // name
        handleInvalidName(form);
        //deadline
        handleInvalidDate(form);
      } else {
        // check deadline against porject deadline
        const projectID =
          form.querySelector<HTMLSelectElement>("select#project")!.value;
        if (projectID) {
          const projectDeadline = projectController.getProjectByID(
            projectID as Tid,
          )?.deadline;
          if (
            projectDeadline &&
            new Date(projectDeadline) < new Date(deadlineInput.value)
          ) {
            deadlineInput.parentElement!.querySelector(
              ".error-msg",
            )!.textContent = "Past project deadline!";
            isFormValid = false;
          }
        }
      }
      if (!isFormValid) {
        form.setAttribute("invalid", "");
        return;
      }
      form.removeAttribute("invalid");

      // valid form
      const formData = new FormData(form);
      const newTask = Task.fromFormData(formData);
      if (task) {
        taskController.updateTask(task.id, newTask);
      } else {
        taskController.addTask(newTask);
      }
      this.closest("dialog")!.close();
      renderPage(root);
    });
    parent.appendChild(taskForm);
    dialog.show();
    positionDialog();
  }

  function renderProjectForm(parent: HTMLElement, project?: Project) {
    const projectForm = projectFormView(project);
    dialog = projectForm.querySelector("dialog")!;
    makeDialogDraggable(dialog);

    const submitBtn = projectForm.querySelector(
      "button[type='submit']",
    )! as HTMLButtonElement;
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const form = this.closest("form")!;
      let isFormValid = form.checkValidity();

      if (!isFormValid) {
        // invalid form
        // name
        handleInvalidName(form);
        //deadline
        handleInvalidDate(form);

        form.setAttribute("invalid", "");
        return;
      }
      form.removeAttribute("invalid");

      // valid form
      const formData = new FormData(form);
      const newProject = Project.fromFormData(formData);
      if (project) {
        projectController.updateProject(project.id, newProject);
      } else {
        projectController.addProject(newProject);
        currentProject = newProject.id;
        activeNavButton = `[data-id="${currentProject}"]`;
      }
      this.closest("dialog")!.close();
      renderPage(root);
    });
    parent.appendChild(projectForm);
    dialog.show();
    positionDialog();
  }

  function renderDeleteProjectDialog(parent: HTMLElement, projectId: Tid) {
    const deleteDialog = projectDeleteDialogView();
    dialog = deleteDialog.querySelector("dialog")!;
    makeDialogDraggable(dialog);
    deleteDialog
      .querySelector<HTMLButtonElement>(".delete-project-btn")!
      .addEventListener("click", function () {
        projectController.deleteProject(projectId);
        const projTasks = taskController.getTasksByProject(projectId);
        projTasks.forEach((t) => taskController.deleteTask(t.id));
        this.closest("dialog")!.close();
        if (currentProject === projectId) {
          currentProject = "all";
          activeNavButton = "#all-projects";
        }
        renderPage(root);
      });
    parent.appendChild(deleteDialog);
    dialog.show();
    positionDialog();
  }

  function renderSettingsForm(parent: HTMLElement, settings: ISettings) {
    const settingsDialog = settingsView(settings);

    dialog = settingsDialog.querySelector("dialog")!;
    makeDialogDraggable(dialog);

    dialog.onclose = () => applySettings();
    const btn = settingsDialog.querySelector(
      "button[type='submit']",
    )! as HTMLButtonElement;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const formData = new FormData(this.closest("form")!);

      settings.theme = formData.get("theme")! as THEME;

      saveSettingsToLS(settings);
      this.closest("dialog")?.close();
    });

    settingsDialog
      .querySelectorAll<HTMLInputElement>(
        "input[name='theme']:not(#theme-random)",
      )
      .forEach((i) =>
        i.addEventListener("click", function () {
          setTheme(this.value as THEME);
        }),
      );
    parent.append(settingsDialog);
    dialog.show();
    positionDialog();
  }

  function saveSettingsToLS(settings: ISettings) {
    try {
      localStorage.setItem("tbSettings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings in LS:", error);
    }
  }

  function makeDialogDraggable(dialogElement: HTMLDialogElement) {
    const dialogHeader = dialogElement.querySelector(".header")! as HTMLElement;
    dialogHeader.addEventListener("dragstart", function (e) {
      // remove ghost image
      e.dataTransfer!.setDragImage(document.createElement("div"), 0, 0);
      pointerPosition = { x: e.clientX, y: e.clientY };
    });
  }

  function makeProjectDraggable(projectListBtn: HTMLButtonElement) {
    projectListBtn.addEventListener("dragstart", function (e) {
      // remove ghost image
      e.dataTransfer!.setDragImage(document.createElement("div"), 0, 0);
      draggedProject = projectListBtn.closest("li")!;
      dragStartIdx = Number(draggedProject.dataset.order);
      // pointerPosition = { x: e.clientX, y: e.clientY };
    });
    projectListBtn.closest("li")!.addEventListener("dragover", function (e) {
      if (!draggedProject) return;
      const thisIdx = Number(this.dataset.order);
      const draggedIdx = Number(draggedProject.dataset.order);
      if (thisIdx == draggedIdx) return;
      const isAbove = e.clientY < this.clientHeight / 2 + this.offsetTop;
      const isOrderHigher = draggedIdx > thisIdx;
      if (isAbove && isOrderHigher) {
        this.closest("ul")?.insertBefore(draggedProject, this);
        this.dataset.order = draggedIdx.toString();
        draggedProject.dataset.order = thisIdx.toString();
        return;
      }
      if (!isAbove && !isOrderHigher) {
        this.closest("ul")?.insertBefore(this, draggedProject);
        this.dataset.order = draggedIdx.toString();
        draggedProject.dataset.order = thisIdx.toString();
        return;
      }
    });
    projectListBtn.closest("li")!.addEventListener("dragend", function (e) {
      if (!draggedProject) return;
      projectController.position.change(
        dragStartIdx,
        Number(draggedProject.dataset.order),
      );
      dragStartIdx = -1;
      draggedProject = null;
      renderPage(root);
    });
  }

  function positionDialog() {
    if (!dialog) return;
    if (!dialogPosition[dialog.id]) {
      dialogPosition[dialog.id] = centreDialog();
    } else setDialogPosition(dialogPosition[dialog.id]!);
  }

  function setDialogPosition(position: IPosition) {
    if (!dialog) return undefined;
    dialog.style.top = position.y + "px";
    dialog.style.left = position.x + "px";
  }

  function centreDialog(): IPosition | undefined {
    if (!dialog) return undefined;
    const dialogPosition = {
      x: 0,
      y: (document.body.clientHeight - dialog.clientHeight) / 2,
    };
    setDialogPosition(dialogPosition);
    return dialogPosition;
  }

  function applySettings() {
    setTheme(settings.theme);
    setShowCompleted(settings.showCompleted);
  }

  function setTheme(themeSetting: THEME | "random") {
    const themes = Object.values(THEME);
    const theme =
      themeSetting === "random"
        ? themes[Math.floor(Math.random() * themes.length)]
        : themeSetting;
    document.body.setAttribute("theme", theme);
  }

  function setShowCompleted(showCompleted: boolean) {
    if (showCompleted) {
      document.body.setAttribute("show-completed", "true");
    } else {
      document.body.removeAttribute("show-completed");
    }
  }

  function updateCurrentTasks() {
    let ct: Task[];
    switch (currentProject) {
      case undefined: // today
        ct = taskController.getTasks();
        break;
      case "all":
        ct = taskController.getTasks();
        break;
      case "misc":
        ct = taskController.getTasks().filter((t) => !t.project);
        break;
      default:
        ct = taskController.getTasksByProject(currentProject);
        break;
    }
    currentTasks = Task.sort(ct);
  }

  return { renderPage };
}
