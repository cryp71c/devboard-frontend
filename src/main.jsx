import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import HTBDashboard from "./components/HTBDashboard.jsx";
import HTBWriteupDetail from "./components/HTBWriteupDetail.jsx";
import BlogList from "./components/BlogList.jsx";
import BlogDetail from "./components/BlogDetail.jsx";
import Contact from "./components/Contact.jsx";
import Credentials from "./components/Credentials.jsx";
import RetroToggle from "./components/RetroToggle.jsx";
import "./index.css";
import "./retro.css";

// Lazy-loaded: Projects pulls in the SpherePackingViewer, which drags in
// three.js + @react-three/fiber/drei — together the single biggest chunk
// of the whole bundle. Splitting it out means every other page (blog,
// contact, credentials, etc.) no longer downloads a 3D engine it never uses.
const Projects = lazy(() => import("./components/Projects.jsx"));

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
    </div>
  );
}

console.log("React loaded"); // 🔍 does this appear in DevTools?
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        {/* Rendered once, outside Routes, so it survives navigation instead
            of remounting (and re-reading localStorage) on every page. */}
        <RetroToggle />
        <Suspense fallback={<RouteLoadingFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
