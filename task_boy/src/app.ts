import { makeProjectController } from "@controllers/project";
import { makeTaskController } from "@controllers/task";
import { makeRenderer } from "@views/renderer";
import { ISettings } from "./types";
import { THEME } from "./constants";

// const projects = [new Project(0), new Project(1)];

// projects[0].data = new ProjectData(
//   "Water Chip for Vault 13",
//   "Find a replacement functional water chip",
//   new Date("2026-07-04"),
//   PRIORITY.CRITICAL,
//   "Bring it back home before we all die of thirst!",
//   0,
// );
// projects[1].data = new ProjectData(
//   "Birthday Party",
//   "It's my birthday!",
//   new Date("2026-05-28"),
//   PRIORITY.HIGH,
//   "",
//   0,
// );
// const tasks: Task[] = [new Task(), new Task(), new Task()];

// tasks[0].data = new TaskData(
//   "Pack for the road",
//   "",
//   new Date(),
//   PRIORITY.NORMAL,
//   "A few stimpaks would be nice",
//   projects[0].id,
// );
// tasks[1].data = new TaskData(
//   "Find Vault 21",
//   "A good place to start",
//   new Date("2026-02-15"),
//   PRIORITY.NORMAL,
//   "",
//   projects[0].id,
// );
// tasks[2].data = new TaskData(
//   "Send invites",
//   "",
//   new Date("2026-05-14"),
//   PRIORITY.HIGH,
//   "",
//   projects[1].id,
// );

export function init(doc: Document) {
  try {
    const projectController = makeProjectController();
    projectController.fetchProjects("localStorage");
    const taskController = makeTaskController();
    taskController.fetchTasks("localStorage");
    const settings: ISettings = localStorage.getItem("tbSettings")
      ? JSON.parse(localStorage.getItem("tbSettings")!)
      : { theme: THEME.GREEN };
    const renderer = makeRenderer(
      doc.getElementById("app")!,
      taskController,
      projectController,
      settings,
    );
    renderer.renderPage(doc.getElementById("app")!);
  } catch (error) {
    console.error(error);
  }
}
