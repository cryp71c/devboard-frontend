import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import Projects from "./components/Projects.jsx";
import HTBDashboard from "./components/HTBDashboard.jsx";
import HTBWriteupDetail from "./components/HTBWriteupDetail.jsx";
import BlogList from "./components/BlogList.jsx";
import BlogDetail from "./components/BlogDetail.jsx";
import Contact from "./components/Contact.jsx";
import Credentials from "./components/Credentials.jsx";
import "./index.css";

console.log("React loaded"); // 🔍 does this appear in DevTools?
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/htb" element={<HTBDashboard />} />
          <Route path="/htb/writeups/:id" element={<HTBWriteupDetail />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/credentials" element={<Credentials />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
