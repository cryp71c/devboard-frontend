// src/api.js
export async function fetchExperiences() {
  const response = await fetch("http://192.168.37.132:8000/experience/all");
  if (!response.ok) throw new Error("Failed to fetch");
  return await response.json();
}

