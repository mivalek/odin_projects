import { fieldSet, form, radioInput } from "@components/form";
import { modalDialog } from "@components/modalDialog";
import { THEME, THEME_LABELS } from "../constants";
import { ISettings } from "../types";
import { strToKebabCase } from "../utils";

export function settingsView(settings: ISettings) {
  const radioButtons: HTMLElement[] = [];
  for (let t in THEME) {
    if (!isNaN(Number(t))) continue;
    const theme = t.toLowerCase();
    const themeLabel = THEME_LABELS[theme];
    radioButtons.push(
      radioInput(
        strToKebabCase("theme " + theme),
        "theme",
        themeLabel,
        theme,
        theme === settings.theme,
      ),
    );
  }

  radioButtons.push(
    radioInput(
      "theme-random",
      "theme",
      "Surprise me! (random each time)",
      "random",
      "random" === settings.theme,
    ),
  );

  const themeSet = fieldSet("Screen phosphor", radioButtons);
  themeSet.classList.add("radio");

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "OK";

  const settingsForm = form("settings-form", [themeSet, submitBtn]);
  const dialog = modalDialog("Settings");
  dialog.querySelector("dialog")!.appendChild(settingsForm);

  return dialog;
}
