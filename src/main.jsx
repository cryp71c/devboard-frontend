import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import ExperienceList from "./components/ExperienceList.jsx";
import Projects from "./components/Projects.jsx";
import Resume from "./components/Resume.jsx";
import HTBDashboard from "./components/HTBDashboard.jsx";
import HTBWriteupDetail from "./components/HTBWriteupDetail.jsx";
import BlogList from "./components/BlogList.jsx";
import BlogDetail from "./components/BlogDetail.jsx";
import CurrentProjects from "./components/CurrentProjects.jsx";
import Contact from "./components/Contact.jsx";
import Certifications from "./components/Certifications.jsx";
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
        <Route path="/htb" element={<HTBDashboard />} />
        <Route path="/htb/writeups/:id" element={<HTBWriteupDetail />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/current-projects" element={<CurrentProjects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/certifications" element={<Certifications />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);