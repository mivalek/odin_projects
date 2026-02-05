import { IProjectData, Tid } from "../types";
import { Project } from "@models/project";

export interface ProjectController {
  fetchProjects: (source: "localStorage" | "db", db?: any) => void;
  addProject: (project: Project) => void;
  updateProject: (id: Tid, data: IProjectData) => void;
  deleteProject: (id: Tid) => void;
  getProjects: () => Project[];
  getProjectByID: (id: Tid) => Project | undefined;
  getProjectByDeadline: (deadline: Date) => void;
  position: {
    recompute: () => void;
    sort: () => void;
    change: (from: number, to: number) => void;
  };
}

export function makeProjectController(): ProjectController {
  let projects: Project[] = [];

  function fetchProjects(source: "localStorage" | "db", db?: any) {
    if (source === "localStorage" && localStorage) {
      let dataJSON = localStorage.getItem("tbProjects");
      if (!dataJSON) {
        dataJSON = "[]";
        localStorage.setItem("tbProjects", dataJSON);
      }
      try {
        projects = Project.fromJSON(dataJSON);
      } catch (error) {
        console.error("failed to fetch projects:", error);
      }
    }
  }

  function addProject(project: Project) {
    project.position = projects.length;
    projects.push(project);
    saveProjectsInLS();
  }

  function updateProject(id: Tid, data: IProjectData) {
    const project = getProjectByID(id);
    if (project) {
      project.name = data.name;
      project.description = data.description;
      project.deadline = data.deadline;
      project.priority = data.priority;
      project.notes = data.notes;

      saveProjectsInLS();
    } else {
      console.error("Project not found");
    }
  }

  function deleteProject(id: Tid) {
    const idx = projects.findIndex((t) => t.id === id);
    if (idx >= 0) {
      projects.splice(idx, 1);
      position.recompute();
      saveProjectsInLS();
    } else {
      console.error("Project not found");
    }
  }

  function getProjects() {
    return projects;
  }

  function getProjectByDeadline(deadline: Date) {
    return projects.filter((t) => t.deadline === deadline);
  }

  function getProjectByID(id: Tid) {
    return projects.find((t) => t.id === id);
  }

  const position = {
    recompute: function () {
      projects.forEach((p, i) => (p.position = i));
    },
    sort: function () {
      projects.sort((a, b) => a.position - b.position);
    },
    change: function (from: number, to: number) {
      const p = projects.splice(from, 1)[0];
      projects.splice(to, 0, p);
      saveProjectsInLS();
    },
  };

  function saveProjectsInLS() {
    try {
      localStorage.setItem("tbProjects", JSON.stringify(projects));
    } catch (error) {
      console.error("failed to save projects:", error);
    }
  }
  return {
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
    getProjects,
    getProjectByID,
    getProjectByDeadline,
    position,
  };
}
