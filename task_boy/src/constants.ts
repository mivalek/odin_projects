import { RGB } from "./types";

export enum COLORS {
  "#FFC09F",
  "#FFEE93",
  "#FCF5C7",
  "#A0CED9",
  "#ADF7B6",
}

export enum PRIORITY {
  "LOW",
  "NORMAL",
  "HIGH",
  "CRITICAL",
}

export enum THEME {
  "GREEN" = "green",
  "BLUEGREEN" = "bluegreen",
  "AMBER" = "amber",
  "WHITE" = "white",
}

export const THEME_LABELS: { [key: string]: string } = {
  green: "P1 (green)",
  bluegreen: "P2 (blue-green)",
  amber: "P3 (amber)",
  white: "P4 (white)",
};

export const PRIORITY_DETAILS: {
  label: string;
  color: RGB;
  display: string;
}[] = [
  {
    label: "Low",
    color: "#0086c1",
    display: "Zz<span>z</span>",
  },
  { label: "Normal", color: "#40B36A", display: "" },
  { label: "High", color: "#F5B725", display: "!" },
  { label: "Critical", color: "#FF6361", display: "!!!" },
];
