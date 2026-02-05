import { THEME } from "../constants";
import { IAppData, ISettings } from "../types";
import { Task } from "./task";
import { Project } from "./project";

export class AppData implements IAppData {
  settings: ISettings;
  tasks: Task[];
  projects: Project[];
  constructor() {
    this.settings = { showCompleted: false, theme: THEME.GREEN };
    this.tasks = [];
    this.projects = [];
  }
}
