// Shared helpers for the site-wide retro-mode toggle. The preference lives
// in localStorage and is reflected as a `data-retro` attribute on <html>,
// which retro.css hooks into to reskin every page — no per-component
// styling changes needed.
const STORAGE_KEY = "retro-mode";

/** Reads the persisted retro-mode preference. Defaults to false. */
export function getRetroPref() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false; // localStorage unavailable (privacy mode, etc.)
  }
}

/** Persists the retro-mode preference and reflects it on <html> immediately. */
export function setRetroPref(enabled) {
  document.documentElement.setAttribute("data-retro", enabled ? "true" : "false");
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {
    // ignore — worst case the choice just doesn't survive a reload
  }
}
