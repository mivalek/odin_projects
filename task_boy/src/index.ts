import "./css/reset.css";
import "./css/styles.css";
import "./css/fallout.css";
import { init } from "./app";

try {
  init(document);
} catch (error) {
  throw error;
}
