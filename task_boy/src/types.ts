import { Task } from "@models/task";
import { COLORS, PRIORITY, THEME } from "./constants";
import { Project } from "@models/project";

export type Tid = `${string}-${string}-${string}-${string}-${string}`;
export type RGB = `#${string}`;

export interface IAppData {
  tasks: Task[];
  projects: Project[];
  settings: ISettings;
}
export interface IItemData {
  name: string;
  description: string;
  deadline: Date;
  priority: PRIORITY;
  notes: string;
  completed: boolean;
}

export interface ITaskData extends IItemData {
  project: Tid | null;
}

interface IStoredItemData {
  id: Tid;
  createdAt: string;
  name: string;
  description: string;
  deadline: string;
  priority: PRIORITY;
  notes: string;
  completed: boolean;
}
export interface IStoredTaskData extends IStoredItemData {
  project: Tid;
}

export interface IStoredProjectData extends IStoredItemData {
  position: number;
}

export interface IProjectData extends IItemData {
  // color: COLORS;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface ISettings {
  showCompleted: boolean;
  jank: boolean;
  theme: THEME | "random";
}

export type TCurrentProject = Tid | "all" | "misc" | undefined;
