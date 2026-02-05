import { Item } from "@models/item";
import { Task } from "@models/task";

export const strToKebabCase = (x: string) =>
  x.toLowerCase().replaceAll(" ", "-");
export const strToCamelCase = (x: string) =>
  x
    .toLowerCase()
    .replace(/[-_ ][a-z]/g, (group: string) => group.slice(-1).toUpperCase());
export const camelCaseToKebabCase = (x: string) =>
  x.replaceAll(/([A-Z])/g, "-$1").toLowerCase();
export const strToTitle = (x: string) =>
  x.replace(/(.)/, (x) => x.toUpperCase());

export function dateToDue(date: Date) {
  const ref = new Date();
  const todayDate = ref.getDate();
  const daysToNextWeek = ((8 - todayDate) % 7) + 1;

  const dayDiff = diffInDays(date, ref);

  if (date < ref)
    return `Due ${Math.abs(dayDiff)} day${dayDiff < -1 ? "s" : ""} ago`;
  if (dayDiff === 0) return "Due today";
  if (dayDiff === 1) return "Due tomorrow";
  if (dayDiff === 2) return "Due in 2 days";
  if (dayDiff < daysToNextWeek) return "Due this week";
  if (dayDiff - daysToNextWeek < 7) return "Due next week";
  const monthDiff = date.getMonth() - ref.getMonth();
  if (monthDiff === 0) return "Due this month";
  if (monthDiff === 1) return "Due next month";

  return date.toLocaleDateString();
}

function diffInDays(date: Date, ref: Date) {
  const d = date;
  d.setHours(0, 0, 0, 0);
  const r = ref;
  r.setHours(0, 0, 0, 0);
  return Math.floor((d.getTime() - r.getTime()) / (1000 * 60 * 60 * 24));
}

export function makeDatesForInput(item: Item | undefined) {
  let min = new Date();
  min.setSeconds(0, 0);
  min.setHours(min.getHours() + 1, 0, 0, 0);
  let tomorrow = new Date();
  tomorrow.setHours(23, 59, 0, 0);
  let max = new Date(tomorrow);
  max.setFullYear(max.getFullYear() + 1);
  const defaultDeadline = item ? new Date(item.deadline) : tomorrow;

  return [defaultDeadline, min, max];
}

export function handleInvalidName(form: HTMLFormElement) {
  const nameInput = form.querySelector<HTMLInputElement>("input#name")!;
  const nameValidity = nameInput.validity;
  const nameError = nameInput.parentElement!.querySelector(".error-msg")!;
  if (!nameValidity.valid) {
    if (nameValidity.valueMissing) {
      nameError.textContent = "Provide name!";
    } else if (nameValidity.tooShort) {
      nameError.textContent = "Too short!";
    } else if (nameValidity.tooLong) {
      nameError.textContent = "Too long!";
    }
  }
}

export function handleInvalidDate(form: HTMLFormElement) {
  const deadlineInput = form.querySelector<HTMLInputElement>("input#deadline")!;
  const deadlineValidity = deadlineInput.validity;
  const deadlineError =
    deadlineInput.parentElement!.querySelector(".error-msg")!;
  if (!deadlineValidity.valid) {
    if (deadlineValidity.valueMissing) {
      deadlineError.textContent = "Pick a deadline!";
    } else if (deadlineValidity.rangeUnderflow) {
      deadlineError.textContent = "In the past!";
    } else if (deadlineValidity.rangeOverflow) {
      deadlineError.textContent = "Too far ahead!";
    }
  }
}
