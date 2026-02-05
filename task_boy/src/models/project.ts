import { PRIORITY } from "../constants";
import { IProjectData, IStoredProjectData } from "../types";
import { Item } from "./item";

export class ProjectData implements IProjectData {
  name: string;
  description: string;
  deadline: Date;
  priority: PRIORITY;
  notes: string;
  // color: COLORS;
  completed: boolean;
  // owner: string;
  // manager: string;

  constructor(
    name: string,
    // owner: string,
    // manager: string,
    description: string,
    deadline: Date,
    priority: PRIORITY,
    notes: string,
    // color: COLORS,
  ) {
    this.name = name;
    this.description = description;
    this.deadline = deadline;
    this.priority = priority;
    this.notes = notes;
    // this.color = color;
    this.completed = false;
    // this.data.owner = owner;
    // this.data.manager = manager;
  }
}
export class Project extends Item {
  // declare data: IProjectData;
  position: number;
  constructor(
    name?: string,
    description?: string,
    deadline?: Date,
    priority?: PRIORITY,
    notes?: string,
    position?: number,
  ) {
    super(name, description, deadline, priority, notes);
    this.position = position || -1;
  }

  static fromFormData(data: FormData) {
    return new Project(
      data.get("name")! as string,
      data.get("description")! as string,
      new Date(data.get("deadline")! as string),
      Number(data.get("priority")!),
      data.get("notes")! as string,
      Number(data.get("position")) || undefined,
    );
  }

  static toJSON(tasks: Project[]) {
    return JSON.stringify(
      tasks.map((t) => ({
        id: t.id,
        createdAt: t.createdAt,
        name: t.name,
        description: t.description,
        deadline: t.deadline,
        priority: t.priority,
        notes: t.notes,
        position: t.position,
        completed: t.completed,
      })),
    );
  }

  static fromJSON(json: string) {
    const data = JSON.parse(json) as IStoredProjectData[];
    return data.map((d) => {
      const { name, description, deadline, priority, notes, position } = d;
      const t = new Project(
        name,
        description,
        new Date(deadline),
        priority,
        notes,
        position,
      );
      t.id = d.id;
      t.createdAt = new Date(d.createdAt);
      t.completed = d.completed;
      return t;
    });
  }
}
