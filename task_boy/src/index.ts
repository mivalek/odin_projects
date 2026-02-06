import "./css/reset.css";
import "./css/styles.css";
import { init } from "./app";

try {
  init(document);
} catch (error) {
  throw error;
}
