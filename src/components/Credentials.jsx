import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const TYPES = ["Degree", "Certification"];

// Same status color language as the Projects page (Completed = green,
// In Progress = red) so "in progress" means the same thing everywhere on
// the site, whether it's a project or a degree.
const statusBadgeClass = (label) => {
  const styles = {
    Completed: "bg-green-900/50 text-green-300 border-green-700",
    "In Progress": "bg-red-900/50 text-red-300 border-red-700",
    Active: "bg-green-900/50 text-green-300 border-green-700",
    Expired: "bg-red-900/50 text-red-300 border-red-700",
  };
  return `px-3 py-1 rounded-sm text-xs font-semibold border whitespace-nowrap ${styles[label]}`;
};

const typeBadgeClass = "px-3 py-1 rounded-sm text-xs font-semibold border bg-zinc-800 text-zinc-300 border-zinc-500 whitespace-nowrap";

function Credentials() {
  const [credentials, setCredentials] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://${API_URL}/credentials/all`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCredentials(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load credentials:", err);
        setError(err.message || "Failed to load credentials");
        setLoading(false);
      });
  }, []);

  const isExpired = (c) => {
    if (!c.expiry_date) return false;
    return new Date(c.expiry_date) < new Date();
  };

  const isInProgress = (c) => c.credential_type === "Degree" && !c.issue_date;

  const statusLabel = (c) => {
    if (c.credential_type === "Degree") return isInProgress(c) ? "In Progress" : "Completed";
    return isExpired(c) ? "Expired" : "Active";
  };

  const filteredCredentials =
    typeFilter === "all" ? credentials : credentials.filter((c) => c.credential_type === typeFilter);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Helmet>
        <title>Credentials | cryp71c.dev</title>
      </Helmet>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
            <h2 className="text-lg font-semibold">Loading Credentials...</h2>
            <p className="text-sm text-zinc-400 mt-2">Fetching degrees & certifications</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-red-950/50 border border-red-600 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-lg font-semibold text-red-400">Error Loading Credentials</h2>
            <p className="text-sm text-zinc-300 mt-2">{error}</p>
            <Link to="/" className="mt-4 inline-block text-red-400 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          <Link to="/" className="text-red-500 hover:underline block mb-6">
            ← Back
          </Link>

          <h1 className="text-5xl font-bold leading-[1.2] py-1 text-center mb-2 text-red-400">
            Credentials
          </h1>
          <p className="text-center text-zinc-400 mb-8">Degrees & Professional Certifications</p>

          {/* Type Filters */}
          {credentials.length > 0 && (
            <div className="flex justify-center gap-3 mb-8 flex-wrap">
              <button
                onClick={() => setTypeFilter("all")}
                className={`px-4 py-2 text-sm ${
                  typeFilter === "all"
                    ? "tab-active"
                    : "tab-inactive"
                }`}
              >
                All ({credentials.length})
              </button>
              {TYPES.map((type) => {
                const count = credentials.filter((c) => c.credential_type === type).length;
                if (count === 0) return null;
                return (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-4 py-2 text-sm ${
                      typeFilter === type
                        ? "tab-active"
                        : "tab-inactive"
                    }`}
                  >
                    {type}s ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCredentials.map((c) => {
              const status = statusLabel(c);
              const expired = status === "Expired";
              return (
                <div
                  key={c.id}
                  className={`bg-zinc-900/60 backdrop-blur-sm rounded-xl p-6 border ${
                    expired ? "border-zinc-700 opacity-75" : "border-zinc-700 hover:border-red-600"
                  } transition`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-1">{c.name}</h2>
                      <p className="text-red-400 font-medium">{c.issuing_organization}</p>
                      {c.field_of_study && (
                        <p className="text-zinc-400 text-sm mt-1">{c.field_of_study}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={typeBadgeClass}>{c.credential_type}</span>
                      <span className={statusBadgeClass(status)}>{status}</span>
                    </div>
                  </div>

                  {c.honors && (
                    <p className="text-amber-400 text-sm font-medium mb-3">🏅 {c.honors}</p>
                  )}

                  {c.description && (
                    <p className="text-zinc-400 text-sm mb-4">{c.description}</p>
                  )}

                  {/* Dates */}
                  <div className="text-sm text-zinc-400 space-y-1 mb-4">
                    {c.issue_date && (
                      <div className="flex justify-between">
                        <span>{c.credential_type === "Degree" ? "Graduated:" : "Issued:"}</span>
                        <span className="text-zinc-300">{new Date(c.issue_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {!c.issue_date && c.expected_completion && (
                      <div className="flex justify-between">
                        <span>Expected:</span>
                        <span className="text-red-300">{c.expected_completion}</span>
                      </div>
                    )}
                    {c.credential_type === "Certification" && c.expiry_date && (
                      <div className="flex justify-between">
                        <span>Expires:</span>
                        <span className={expired ? "text-red-400" : "text-zinc-300"}>
                          {new Date(c.expiry_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {c.credential_type === "Certification" && !c.expiry_date && (
                      <div className="flex justify-between">
                        <span>Expires:</span>
                        <span className="text-green-400">Never (Lifetime)</span>
                      </div>
                    )}
                    {c.credential_id && (
                      <div className="flex justify-between">
                        <span>Credential ID:</span>
                        <span className="text-zinc-300 font-mono text-xs">{c.credential_id}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {c.skills && c.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {c.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-sm text-xs font-medium border border-zinc-600"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Verification Link */}
                  {c.credential_url && (
                    <a
                      href={c.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-block px-4 py-2 text-sm font-medium"
                    >
                      Verify Credential →
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {credentials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg">No credentials found.</p>
            </div>
          )}
          {credentials.length > 0 && filteredCredentials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg">No {typeFilter.toLowerCase()}s found.</p>
            </div>
          )}

          {/* Summary */}
          {credentials.length > 0 && (
            <div className="mt-12 p-6 bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-700 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold text-zinc-200">{credentials.length}</div>
                  <div className="text-sm text-zinc-400">Total Credentials</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {credentials.filter((c) => c.credential_type === "Degree").length}
                  </div>
                  <div className="text-sm text-zinc-400">Degrees</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {credentials.filter((c) => c.credential_type === "Certification").length}
                  </div>
                  <div className="text-sm text-zinc-400">Certifications</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-400">
                    {credentials.filter((c) => isInProgress(c)).length}
                  </div>
                  <div className="text-sm text-zinc-400">In Progress</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Credentials;
