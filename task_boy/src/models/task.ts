import { PRIORITY } from "../constants";
import { IStoredTaskData, ITaskData, Tid } from "../types";
import { Item } from "./item";

export class TaskData implements ITaskData {
  name: string;
  description: string;
  deadline: Date;
  priority: PRIORITY;
  notes: string;
  project: Tid | null;
  completed: boolean;

  constructor(
    name: string,
    description: string,
    deadline: Date,
    priority: PRIORITY,
    notes: string,
    project: Tid | null,
  ) {
    this.name = name;
    this.description = description;
    this.deadline = deadline;
    this.priority = priority;
    this.notes = notes;
    this.project = project;
    this.completed = false;
  }
}

export class Task extends Item {
  // declare data: ITaskData;
  project: Tid | null;
  constructor(
    name?: string,
    description?: string,
    deadline?: Date,
    priority?: PRIORITY,
    notes?: string,
    project?: Tid,
  ) {
    super(name, description, deadline, priority, notes);
    this.project = project || null;
  }

  static sort(tasks: Task[]) {
    const sorted = tasks.toSorted(Task.taskSortingFun);
    return sorted;
  }
  static fromFormData(data: FormData) {
    return new Task(
      data.get("name")! as string,
      data.get("description")! as string,
      new Date(data.get("deadline")! as string),
      Number(data.get("priority")!),
      data.get("notes")! as string,
      (data.get("project") as Tid) || null,
    );
  }
  static toJSON(tasks: Task[]) {
    return JSON.stringify(
      tasks.map((t) => ({
        id: t.id,
        createdAt: t.createdAt,
        name: t.name,
        description: t.description,
        deadline: t.deadline,
        priority: t.priority,
        notes: t.notes,
        project: t.project,
        completed: t.completed,
      })),
    );
  }

  static fromJSON(json: string) {
    const data = JSON.parse(json) as IStoredTaskData[];
    return data.map((d) => {
      const { name, description, deadline, priority, notes, project } = d;
      const t = new Task(
        name,
        description,
        new Date(deadline),
        priority,
        notes,
        project,
      );
      t.id = d.id;
      t.createdAt = new Date(d.createdAt);
      t.completed = d.completed;

      return t;
    });
  }

  static taskSortingFun(a: Task, b: Task) {
    if (a.deadline < b.deadline) return -1;
    if (a.deadline > b.deadline) return 1;
    if (a.priority > b.priority) return -1;
    return a.name.localeCompare(b.name);
  }
}
