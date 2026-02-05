import { AppData } from "@models/appData";
import { IAppData } from "../types";

export interface AppDataController {
  fetchData: (ssource: "localStorage" | "db", db?: any) => void;
  saveDataInLS: () => void;
  getData: () => AppData;
}

export function makeDataController(): AppDataController {
  let data: AppData;

  function fetchData(source: "localStorage" | "db", db?: any) {
    if (source === "localStorage" && localStorage) {
      let dataJSON = localStorage.getItem("taskBoy");
      if (!dataJSON) {
        const newAppData = new AppData();
        dataJSON = JSON.stringify(newAppData);
        localStorage.setItem("taskBoy", dataJSON);
      }
      try {
        data = JSON.parse(dataJSON) as IAppData;
      } catch (error) {
        console.error("failed to fetch data:", error);
      }
    }
  }
  function saveDataInLS() {
    localStorage.setItem("taskBoy", JSON.stringify(data));
  }

  function getData() {
    return data;
  }
  return { fetchData, saveDataInLS, getData };
}
