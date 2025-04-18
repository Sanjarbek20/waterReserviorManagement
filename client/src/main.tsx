import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// i18n is imported directly in App.tsx for better provider initialization

createRoot(document.getElementById("root")!).render(<App />);
