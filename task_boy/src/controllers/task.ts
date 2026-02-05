import { Task } from "../models/task";
import { ITaskData, Tid } from "../types";

export interface TaskController {
  fetchTasks: (ssource: "localStorage" | "db", db?: any) => void;
  addTask: (task: Task) => void;
  updateTask: (id: Tid, data: ITaskData) => void;
  deleteTask: (id: Tid) => void;
  getTasks: () => Task[];
  getTaskByID: (id: Tid) => Task | undefined;
  getTaskByDeadline: (deadline: Date) => Task[];
  getTodaysTask: () => Task[];
  getTasksByProject: (projectId: Tid) => Task[];
  toggleCompleted: (id: Tid) => void;
  // sortTasks: (property: keyof ITaskData, desc?: boolean) => Task[];
  // fromFormData: (form: FormData) => TaskData;
}

export function makeTaskController(): TaskController {
  // taskData: Task[]
  let tasks: Task[] = []; // = taskData;

  function fetchTasks(source: "localStorage" | "db", db?: any) {
    if (source === "localStorage" && localStorage) {
      let dataJSON = localStorage.getItem("tbTasks");
      if (!dataJSON) {
        dataJSON = "[]";
        localStorage.setItem("tbTasks", dataJSON);
      }
      try {
        tasks = Task.fromJSON(dataJSON);
      } catch (error) {
        console.error("failed to fetch tasks:", error);
      }
    }
  }

  function addTask(task: Task) {
    tasks.push(task);
    saveTasksInLS();
  }

  function updateTask(id: Tid, data: ITaskData) {
    const task = getTaskByID(id);
    if (task) {
      task.name = data.name;
      task.description = data.description;
      task.deadline = data.deadline;
      task.priority = data.priority;
      task.notes = data.notes;
      task.project = data.project;
      task.completed = data.completed;
      saveTasksInLS();
    } else {
      console.error("Task not found");
    }
  }

  function deleteTask(id: Tid) {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx >= 0) {
      tasks.splice(idx, 1);
      saveTasksInLS();
    } else {
      console.error("Task not found");
    }
  }

  function toggleCompleted(id: Tid) {
    const task = getTaskByID(id)!;
    task.completed = !task.completed;
    saveTasksInLS();
  }

  function getTasks() {
    return tasks;
  }

  function getTasksByProject(projectId: Tid) {
    return tasks.filter((t) => t.project === projectId);
  }

  function getTaskByDeadline(deadline: Date) {
    return tasks.filter(
      (t) => t.deadline.toDateString() === deadline.toDateString(),
    );
  }

  function getTodaysTask() {
    return tasks.filter(
      (t) => t.deadline.toDateString() === new Date().toDateString(),
    );
  }
  function getTaskByID(id: Tid) {
    return tasks.find((t) => t.id === id);
  }

  function saveTasksInLS() {
    try {
      localStorage.setItem("tbTasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("failed to save tasks:", error);
    }
  }
  return {
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    getTasks,
    getTaskByID,
    getTaskByDeadline,
    getTodaysTask,
    getTasksByProject,
    toggleCompleted,
    // sortTasks,
    // fromFormData,
  };
}
