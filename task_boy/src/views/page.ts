import { Project } from "@models/project";
import { projectListView } from "./project";
import { Task } from "@models/task";
import { taskListView } from "./task";
import { TCurrentProject } from "src/types";

export function pageView(
  projects: Project[],
  tasks: Task[],
  currentProject: TCurrentProject,
  showCompleted: boolean,
) {
  let title: string;
  switch (currentProject) {
    case "all":
      title = "All quests";
      break;
    case "misc":
      title = "Miscellaneous";
      break;
    case undefined:
      title = "Today's task";
      break;
    default:
      title = projects.find((p) => p.id === currentProject)!.name;
      break;
  }

  const main = document.createElement("main");
  main.innerHTML = `
    <div id="main-header">
      <h2>${title}</h2>
      <button id="toggle-complete-btn">${showCompleted ? "Hide" : "Show"} done</button>
    </div>
    <div class="main-content">${currentProject ? mainView(tasks) : todayView(tasks)}</div>`;
  const header = document.createElement("header");
  header.innerHTML = headerView(projects);

  return [header, main];
}

function headerView(projects: Project[]) {
  const template = `
  <div id="logo" aria-hidden="true">
    <div class="brush">
      <span class="big">T</span>ask<span class="medium">B</span>oy
    </div>
    <div class="sans">2000</div>
  </div>
  <nav>
    <ul>
      <div class="nav-top">
        <li id="new-task">
          <button id="new-task-btn">New Task</button>
        </li>
        <li id="today">
          <button id="today-btn">Today</button>
        </li>
        ${projectListView(projects)}
      </div>
      <div class="nav-bottom">
        <li id="settings">
          <button id="settings-btn">Settings</button>
        </li>
        <li id="credits">
          <button id="credits-btn">Credits</button>
        </li>
      </div>
    </ul>
  </nav>`;
  return template;
}

function mainView(tasks: Task[]) {
  const sortedTasks = tasks.toSorted((a, b) =>
    a.completed > b.completed ? -1 : 1,
  );
  console.log(sortedTasks.map((t) => t.name));
  const template = `<section class="single">${tasks.length ? taskListView(sortedTasks) : "<div class='msg'>Only the wasteland meets you here...</div>"}</section>`;
  return template;
}

function todayView(tasks: Task[]) {
  if (!tasks.length)
    return `<section>
        <div class='msg'>
          <br>
          <p>Welcome! Start by adding a Task or a Quest</p>
          <br><br>
          <p><------------------</p>
        </div>
      </section>`;
  const today = new Date().toDateString();

  const todayTasks = tasks
    .filter((t) => t.deadline.toDateString() === today)
    .toSorted((a, b) => (a.completed > b.completed ? -1 : 1));
  const upcomingTasks = tasks.filter(
    (t) => t.deadline.toDateString() !== today && !t.completed,
  );

  const isAllCompleted = todayTasks.every((t) => t.completed);
  if (todayTasks.length && !isAllCompleted)
    return `<section>${taskListView(todayTasks)}</section>`;

  const allDone = `<section>
        <div class="msg">${
          todayTasks.length
            ? "All done for today!"
            : "No tasks today, have yourself a cold Nuka-Cola!"
        }</div>
      </section>`;
  if (!upcomingTasks.length)
    return (
      allDone +
      "<section><div class='msg'>There's nothing else that needs doing, have yourself a cold Nuka-Cola!</div></section>"
    );

  return `${allDone}<section id="upcoming"><div class="h-container"><h2>To do next</h2></div>${taskListView(upcomingTasks)}</section>`;
}
