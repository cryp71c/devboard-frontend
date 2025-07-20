import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import ExperienceList from "./components/ExperienceList.jsx";
import Projects from "./components/Projects.jsx";
import Resume from "./components/Resume.jsx";
import "./index.css";

console.log("React loaded"); // 🔍 does this appear in DevTools?
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/experiences" element={<ExperienceList />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/resume" element={<Resume />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);