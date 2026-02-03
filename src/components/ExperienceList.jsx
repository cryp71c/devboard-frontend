import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function ExperienceList() {
  const [experiences, setExperiences] = useState([]);
  const [sortMode, setSortMode] = useState("desc");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL =  import.meta.env.VITE_API_URL;

  // --- Tenure helpers (month-accurate, date-driven) ---
  const parseISODate = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const getTenureMonths = (exp) => {
    const start = parseISODate(exp?.start_date);
    const end = exp?.end_date ? parseISODate(exp.end_date) : new Date();
    if (!start || !end) return 0;

    let months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    // Prevent over-counting partial months (e.g., Jan 20 -> Feb 10 should be 0 months)
    if (end.getDate() < start.getDate()) months -= 1;

    return Math.max(0, months);
  };

  const formatTenure = (months) => {
    const m = Math.max(0, Number(months) || 0);
    const y = Math.floor(m / 12);
    const r = m % 12;

    if (y <= 0) return `${r} mo`;
    if (r === 0) return `${y} yr`;
    return `${y} yr ${r} mo`;
  };

  useEffect(() => {
    const sort = searchParams.get("sort") || "desc";
    setSortMode(sort);

    setLoading(true);
    setError(null);

    fetch(`${API_URL}/experience/all?sort=${sort}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setExperiences(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load experiences:", err);
        setError(err.message || "Failed to load experiences");
        setLoading(false);
      });
  }, [searchParams]);

  const toggleSortMode = () => {
    setSelectedCompany(null);
    const newSort = sortMode === "asc" ? "desc" : "asc";
    setSearchParams({ sort: newSort });
  };

  const tenureByCompany = experiences.reduce((acc, exp) => {
    if (!acc[exp.company]) acc[exp.company] = [];
    acc[exp.company].push(exp);
    return acc;
  }, {});

  const colorPalette = [
    "bg-indigo-600",
    "bg-pink-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-red-500",
  ];

  const sortedCompanyExperiences = selectedCompany
    ? [...tenureByCompany[selectedCompany]].sort(
        (a, b) => new Date(a.start_date) - new Date(b.start_date)
      )
    : [];

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            <h2 className="text-lg font-semibold">Warming up the API…</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              API might still be booting. This usually takes a few seconds.
            </p>
          </div>
        </div>
      )}
      
      
      {/* Orb Backdrop */}
      <div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full z-0
        -translate-x-1/2 -translate-y-1/2 animate-idle-rotate-pulse"
        style={{
          background:
            "conic-gradient(from 90deg at center, #4f46e5, #ec4899, #0ea5e9, #4f46e5)",
          filter: "blur(180px) brightness(110%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <Link to="/" className="text-indigo-500 hover:underline block mb-6">
          &larr; Back
        </Link>
        <h1 className="text-4xl font-bold text-center mb-6">
          Experience Timeline
        </h1>

        <div className="flex justify-center space-x-4 mb-12">
          <button
            onClick={toggleSortMode}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              ["asc", "desc"].includes(sortMode)
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            Date {sortMode === "asc" ? "↑" : "↓"}
          </button>
          <button
            onClick={() => setSearchParams({ sort: "tenure" })}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              sortMode === "tenure"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            Longest Tenure
          </button>
        </div>

        {sortMode === "tenure" ? (
          <div className="flex flex-col items-center gap-16">
            <div className="flex justify-center gap-16 flex-wrap">
              {Object.entries(tenureByCompany).map(([company, roles]) => {
                const earliestStart = roles.reduce(
                  (min, r) =>
                    !min || new Date(r.start_date) < min
                      ? new Date(r.start_date)
                      : min,
                  null
                );

                const latestEnd = roles.reduce(
                  (max, r) => {
                    const end = r.end_date ? new Date(r.end_date) : new Date();
                    return !max || end > max ? end : max;
                  },
                  null
                );

                const totalMonths =
                  earliestStart && latestEnd
                    ? getTenureMonths({
                        start_date: earliestStart.toISOString(),
                        end_date: latestEnd.toISOString(),
                      })
                    : 0;

                return (
                  <div
                    key={company}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => setSelectedCompany(company)}
                  >
                    <div className="font-semibold text-lg mb-2">{company}</div>

                    <div className="flex items-end h-64 w-20 relative bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                      <div className="flex flex-col-reverse justify-end w-full h-full">
                        {roles.map((r, j) => (
                          <div
                            key={j}
                            className={`relative text-[10px] text-white text-center flex items-center justify-center ${
                              colorPalette[j % colorPalette.length]
                            }`}
                            style={{
                              height: `${
                                totalMonths
                                  ? (getTenureMonths(r) / totalMonths) * 100
                                  : 0
                              }%`,
                            }}
                          >
                            <span className="text-[11px] font-bold">
                              {formatTenure(getTenureMonths(r))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {formatTenure(totalMonths)} total
                    </div>

                    <div className="mt-2 space-y-1">
                      {roles.map((r, j) => (
                        <div
                          key={j}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div
                            className={`w-3 h-3 ${
                              colorPalette[j % colorPalette.length]
                            } rounded-sm`}
                          />
                          <span>{r.position}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedCompany && (
              <div className="mt-12 w-full">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {selectedCompany} Roles
                </h2>
                <div className="space-y-6">
                  {sortedCompanyExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                    >
                      <h3 className="text-lg font-semibold">{exp.position}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {exp.start_date} – {exp.end_date || "Present"} (
                        {formatTenure(getTenureMonths(exp))})
                      </p>
                      <p className="mt-2">{exp.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {exp.skills?.map((skill) => (
                          <span
                            key={skill.id}
                            className="px-2 py-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-100 rounded-full text-xs"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Center Timeline Line */}
            <div className="absolute top-0 left-1/2 w-1 h-full bg-indigo-400 opacity-30 transform -translate-x-1/2 -z-10" />

            <div className="space-y-16">
              {experiences.map((exp, index) => (
                <div
                  key={exp.id}
                  className={`relative flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  } animate-fade-in-up`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-indigo-500 rounded-full border-4 border-white dark:border-gray-900 z-10" />

                  {/* Experience Card */}
                  <div className="md:w-1/2 md:px-10">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-10 md:mt-0">
                      <h2 className="text-xl font-semibold">
                        {exp.position} @ {exp.company}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {exp.start_date} – {exp.end_date || "Present"} (
                        {formatTenure(getTenureMonths(exp))})
                      </p>
                      <p className="mt-2">{exp.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {exp.skills?.map((skill) => (
                          <span
                            key={skill.id}
                            className="px-2 py-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-100 rounded-full text-xs"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ExperienceList;
