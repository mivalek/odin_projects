import { PRIORITY } from "../constants";
import { Tid } from "../types";

export class Item {
  id: Tid = crypto.randomUUID();
  createdAt = new Date();
  name: string;
  description: string;
  deadline: Date;
  priority: PRIORITY;
  notes: string;
  completed: boolean;

  constructor(
    name?: string,
    description?: string,
    deadline?: Date,
    priority?: PRIORITY,
    notes?: string,
  ) {
    this.name = name || "";
    this.description = description || "";
    this.deadline = deadline || new Date();
    this.priority = priority === undefined ? PRIORITY.NORMAL : priority;
    this.notes = notes || "";
    this.completed = false;
  }
}
