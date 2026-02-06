import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Certifications() {
  const [certifications, setCertifications] = useState([]);
  const [activeOnly, setActiveOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url = `https://${API_URL}/certifications/all${activeOnly ? "?active_only=true" : ""}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCertifications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load certifications:", err);
        setError(err.message || "Failed to load certifications");
        setLoading(false);
      });
  }, [activeOnly]);

  const isExpired = (cert) => {
    if (!cert.expiry_date) return false;
    return new Date(cert.expiry_date) < new Date();
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
            <h2 className="text-lg font-semibold">Loading Certifications...</h2>
            <p className="text-sm text-gray-400 mt-2">Fetching credentials</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
          <div className="bg-red-900/50 border border-red-500 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-lg font-semibold text-red-400">Error Loading Certifications</h2>
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
            Certifications
          </h1>
          <p className="text-center text-gray-400 mb-8">Professional Credentials & Training</p>

          {/* Active Only Toggle */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setActiveOnly(!activeOnly)}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeOnly
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {activeOnly ? "✓ Showing Active Only" : "Show Active Only"}
            </button>
          </div>

          {/* Certifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert) => {
              const expired = isExpired(cert);
              return (
                <div
                  key={cert.id}
                  className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border ${
                    expired
                      ? "border-gray-700 opacity-75"
                      : "border-gray-700 hover:border-indigo-500"
                  } transition`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-1">{cert.name}</h2>
                      <p className="text-indigo-400 font-medium">{cert.issuing_organization}</p>
                    </div>
                    {expired ? (
                      <span className="px-3 py-1 bg-red-900/50 text-red-300 border border-red-700 rounded-full text-xs font-semibold">
                        Expired
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-900/50 text-green-300 border border-green-700 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    )}
                  </div>

                  {cert.description && (
                    <p className="text-gray-400 text-sm mb-4">{cert.description}</p>
                  )}

                  {/* Dates */}
                  <div className="text-sm text-gray-400 space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>Issued:</span>
                      <span className="text-gray-300">{new Date(cert.issue_date).toLocaleDateString()}</span>
                    </div>
                    {cert.expiry_date && (
                      <div className="flex justify-between">
                        <span>Expires:</span>
                        <span className={expired ? "text-red-400" : "text-gray-300"}>
                          {new Date(cert.expiry_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {!cert.expiry_date && (
                      <div className="flex justify-between">
                        <span>Expires:</span>
                        <span className="text-green-400">Never (Lifetime)</span>
                      </div>
                    )}
                    {cert.credential_id && (
                      <div className="flex justify-between">
                        <span>Credential ID:</span>
                        <span className="text-gray-300 font-mono text-xs">{cert.credential_id}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cert.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-xs font-medium border border-indigo-700"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Verification Link */}
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition"
                    >
                      Verify Credential →
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {certifications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {activeOnly ? "No active certifications found." : "No certifications found."}
              </p>
            </div>
          )}

          {/* Summary */}
          <div className="mt-12 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-indigo-400">{certifications.length}</div>
                <div className="text-sm text-gray-400">Total Certs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {certifications.filter((c) => !isExpired(c)).length}
                </div>
                <div className="text-sm text-gray-400">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {certifications.filter((c) => isExpired(c)).length}
                </div>
                <div className="text-sm text-gray-400">Expired</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {certifications.filter((c) => !c.expiry_date).length}
                </div>
                <div className="text-sm text-gray-400">Lifetime</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Certifications;
