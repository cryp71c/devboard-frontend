import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CurrentProjects() {
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url = statusFilter === "all"
      ? `https://${API_URL}/current-projects/all`
      : `https://${API_URL}/current-projects/all?status=${statusFilter}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load projects:", err);
        setError(err.message || "Failed to load projects");
        setLoading(false);
      });
  }, [statusFilter]);

  const getStatusColor = (status) => {
    const colors = {
      "in progress": "bg-blue-500 text-white",
      "planning": "bg-purple-500 text-white",
      "testing": "bg-yellow-500 text-black",
      "paused": "bg-gray-500 text-white",
    };
    return colors[status.toLowerCase()] || "bg-gray-500 text-white";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-400",
      medium: "text-yellow-400",
      low: "text-green-400",
    };
    return colors[priority.toLowerCase()] || "text-gray-400";
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Orb Backdrop */}
      <div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full z-0 -translate-x-1/2 -translate-y-1/2 animate-idle-rotate-pulse"
        style={{
          background: "conic-gradient(from 90deg at center, #4f46e5, #ec4899, #0ea5e9, #4f46e5)",
          filter: "blur(180px) brightness(110%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            <h2 className="text-lg font-semibold">Loading Projects...</h2>
            <p className="text-sm text-gray-400 mt-2">Fetching current work</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
          <div className="bg-red-900/50 border border-red-500 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-lg font-semibold text-red-400">Error Loading Projects</h2>
            <p className="text-sm text-gray-300 mt-2">{error}</p>
            <Link to="/" className="mt-4 inline-block text-indigo-400 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          <Link to="/" className="text-indigo-500 hover:underline block mb-6">
            ← Back
          </Link>

          <h1 className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            What I'm Building
          </h1>
          <p className="text-center text-gray-400 mb-12">Current Projects & Active Development</p>

          {/* Status Filters */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("In Progress")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === "In Progress"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter("Planning")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === "Planning"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Planning
            </button>
            <button
              onClick={() => setStatusFilter("Testing")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === "Testing"
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Testing
            </button>
          </div>

          {/* Projects Grid */}
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{project.name}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority} Priority
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{project.description}</p>

                    {/* Progress Bar */}
                    {project.progress_percentage !== null && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-indigo-400 font-medium">{project.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${project.progress_percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-xs font-medium border border-indigo-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Dates & Last Update */}
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>
                        <span className="font-medium">Started:</span>{" "}
                        {new Date(project.started_date).toLocaleDateString()}
                      </div>
                      {project.target_completion && (
                        <div>
                          <span className="font-medium">Target:</span>{" "}
                          {new Date(project.target_completion).toLocaleDateString()}
                        </div>
                      )}
                      {project.last_update && (
                        <div className="mt-2 p-3 bg-gray-900/50 rounded border-l-4 border-indigo-500">
                          <span className="font-medium text-indigo-400">Latest:</span>{" "}
                          <span className="text-gray-300">{project.last_update}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition"
                    >
                      GitHub →
                    </a>
                  )}
                  {project.live_demo_url && (
                    <a
                      href={project.live_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition"
                    >
                      Live Demo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No projects found for this status.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CurrentProjects;
