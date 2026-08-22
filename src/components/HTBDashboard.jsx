import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function HTBDashboard() {
  const [profile, setProfile] = useState(null);
  const [machines, setMachines] = useState([]);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://${API_URL}/htb/profile`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setMachines(data.machines_completed || []);
        setFilteredMachines(data.machines_completed || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load HTB data:", err);
        setError(err.message || "Failed to load HTB data");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (difficultyFilter === "all") {
      setFilteredMachines(machines);
    } else {
      setFilteredMachines(
        machines.filter((m) => m.difficulty.toLowerCase() === difficultyFilter.toLowerCase())
      );
    }
  }, [difficultyFilter, machines]);

  const getDifficultyColor = (difficulty) => {
    // Escalating danger scale that stays inside the black/red palette:
    // green -> amber -> bright red -> near-black red (darker than "hard"
    // itself, reading as the most extreme tier).
    const colors = {
      easy: "bg-green-500 text-white",
      medium: "bg-yellow-500 text-black",
      hard: "bg-red-500 text-white",
      insane: "bg-red-950 text-red-300 border border-red-700",
    };
    return colors[difficulty.toLowerCase()] || "bg-zinc-600 text-white";
  };

  const getOSIcon = (os) => {
    if (os.toLowerCase() === "linux") return "🐧";
    if (os.toLowerCase() === "windows") return "🪟";
    return "💻";
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Helmet>
        <title>HTB Profile | cryp71c.dev</title>
      </Helmet>
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
            <h2 className="text-lg font-semibold">Loading HTB Profile...</h2>
            <p className="text-sm text-zinc-400 mt-2">Fetching your hacking achievements</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-red-950/50 border border-red-600 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-lg font-semibold text-red-400">Error Loading HTB Data</h2>
            <p className="text-sm text-zinc-300 mt-2">{error}</p>
            <Link to="/" className="mt-4 inline-block text-red-400 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && profile && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <Link to="/" className="text-red-500 hover:underline block mb-6">
            ← Back
          </Link>

          <h1 className="text-5xl font-bold leading-[1.2] py-1 text-center mb-2 text-red-400">
            HTB Profile
          </h1>
          <p className="text-center text-zinc-400 mb-1">Hack The Box account stats & selected write-ups</p>
          {profile.profile_url && (
            <p className="text-center text-xs text-zinc-500 mb-8">
              Career totals from my live{" "}
              <a
                href={profile.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:underline"
              >
                HTB profile
              </a>{" "}
              — the write-ups below are hand-picked, not every box I've completed.
            </p>
          )}

          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl p-6 border border-zinc-700">
              <div className="text-3xl font-bold text-red-400">{profile.rank}</div>
              <div className="text-sm text-zinc-400 mt-1">Current Rank</div>
            </div>
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl p-6 border border-zinc-700">
              <div className="text-3xl font-bold text-amber-400">{profile.points}</div>
              <div className="text-sm text-zinc-400 mt-1">Total Points</div>
            </div>
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl p-6 border border-zinc-700">
              <div className="text-3xl font-bold text-green-400">{profile.user_owns}</div>
              <div className="text-sm text-zinc-400 mt-1">User Owns</div>
            </div>
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl p-6 border border-zinc-700">
              <div className="text-3xl font-bold text-zinc-200">{profile.root_owns}</div>
              <div className="text-sm text-zinc-400 mt-1">Root Owns</div>
            </div>
          </div>

          {/* Skills demonstrated in the write-ups below (not HTB's own
              "top 30%" verified-skill badges — just an honest label) */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {profile.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 bg-zinc-900 text-zinc-300 border border-zinc-700 rounded-full text-xs font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}

          <h2 className="text-2xl font-bold text-center mb-6 text-zinc-200">Featured Write-ups</h2>

          {/* Difficulty Filters */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            <button
              onClick={() => setDifficultyFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                difficultyFilter === "all"
                  ? "bg-red-600 bg-gradient-to-b from-red-500 to-red-700 text-white"
                  : "bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              All ({machines.length})
            </button>
            <button
              onClick={() => setDifficultyFilter("easy")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                difficultyFilter === "easy"
                  ? "bg-green-500 text-white"
                  : "bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              Easy ({machines.filter((m) => m.difficulty === "Easy").length})
            </button>
            <button
              onClick={() => setDifficultyFilter("medium")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                difficultyFilter === "medium"
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              Medium ({machines.filter((m) => m.difficulty === "Medium").length})
            </button>
            <button
              onClick={() => setDifficultyFilter("hard")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                difficultyFilter === "hard"
                  ? "bg-red-500 text-white"
                  : "bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              Hard ({machines.filter((m) => m.difficulty === "Hard").length})
            </button>
            <button
              onClick={() => setDifficultyFilter("insane")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                difficultyFilter === "insane"
                  ? "bg-red-950 text-red-300 border border-red-700"
                  : "bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              Insane ({machines.filter((m) => m.difficulty === "Insane").length})
            </button>
          </div>

          {/* Machines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMachines.map((machine) => (
              <div
                key={machine.id}
                className="bg-zinc-900/60 backdrop-blur-sm rounded-xl p-6 border border-zinc-700 hover:border-red-600 transition cursor-pointer"
                onClick={() => navigate(`/htb/writeups/${machine.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getOSIcon(machine.os)}</span>
                    <h3 className="text-xl font-semibold">{machine.name}</h3>
                    {!machine.retired && (
                      <span title="Writeup is access-key protected until this machine retires">🔒</span>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(machine.difficulty)}`}>
                    {machine.difficulty}
                  </span>
                </div>

                <div className="text-sm text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>OS:</span>
                    <span className="text-zinc-300">{machine.os}</span>
                  </div>
                  {machine.rating && (
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="text-yellow-400">⭐ {machine.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="text-zinc-300">{new Date(machine.completed_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-4 mt-3 pt-3 border-t border-zinc-700">
                    <div className="flex items-center gap-1">
                      <span className="text-green-400">👤</span>
                      <span className="text-xs">{machine.user_owns ? "User" : ""}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-red-400">👑</span>
                      <span className="text-xs">{machine.root_owns ? "Root" : ""}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMachines.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg">No machines found for this difficulty level.</p>
            </div>
          )}

          {/* HTB Profile Link */}
          {profile.profile_url && (
            <div className="mt-12 text-center">
              <a
                href={profile.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-red-600 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                View Full HTB Profile →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HTBDashboard;
