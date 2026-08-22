import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { common } from "lowlight";
import x86asm from "highlight.js/lib/languages/x86asm";

// highlight.js's "common" bundle doesn't include assembly; registered here
// too in case a future writeup includes ```asm fences.
const highlightOptions = {
  languages: { ...common, x86asm },
  aliases: { x86asm: ["asm"] },
};

const STORAGE_KEY = "htb_writeup_key";

function HTBWriteupDetail() {
  const { id } = useParams();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsKey, setNeedsKey] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [unlockError, setUnlockError] = useState(null);
  const [unlocking, setUnlocking] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchWriteup = (accessKey) => {
    setLoading(true);
    setError(null);

    fetch(`https://${API_URL}/htb/writeups/${id}`, {
      headers: accessKey ? { "X-Writeup-Key": accessKey } : {},
    })
      .then(async (res) => {
        if (res.status === 401) {
          setNeedsKey(true);
          setLoading(false);
          return null;
        }
        if (res.status === 404) throw new Error("Writeup not found");
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setMachine(data);
        setNeedsKey(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load writeup:", err);
        setError(err.message || "Failed to load writeup");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWriteup(localStorage.getItem(STORAGE_KEY));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUnlock = (e) => {
    e.preventDefault();
    setUnlocking(true);
    setUnlockError(null);

    fetch(`https://${API_URL}/htb/writeups/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: keyInput.trim() }),
    })
      .then(async (res) => {
        if (res.status === 401) throw new Error("Invalid or expired key");
        if (res.status === 429) throw new Error("Too many attempts. Try again later.");
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then(() => {
        localStorage.setItem(STORAGE_KEY, keyInput.trim());
        setUnlocking(false);
        fetchWriteup(keyInput.trim());
      })
      .catch((err) => {
        setUnlockError(err.message || "Failed to unlock");
        setUnlocking(false);
      });
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Helmet>
        <title>{machine ? `${machine.name} Writeup | cryp71c.dev` : "HTB Profile | cryp71c.dev"}</title>
      </Helmet>
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
            <h2 className="text-lg font-semibold">Loading Writeup...</h2>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-red-950/50 border border-red-600 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-lg font-semibold text-red-400">Error Loading Writeup</h2>
            <p className="text-sm text-zinc-300 mt-2">{error}</p>
            <Link to="/htb" className="mt-4 inline-block text-red-400 hover:underline">
              ← Back to HTB Profile
            </Link>
          </div>
        </div>
      )}

      {/* Locked State */}
      {!loading && !error && needsKey && (
        <div className="relative z-10 max-w-md mx-auto px-4 py-24">
          <Link to="/htb" className="text-red-500 hover:underline block mb-6">
            ← Back to HTB Profile
          </Link>

          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-xl p-8 border border-zinc-700 text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold mb-2">This Writeup is Locked</h1>
            <p className="text-zinc-400 mb-6 text-sm">
              This machine hasn't retired yet, so the full writeup is access-key protected.
              If you were given an access key, enter it below.
            </p>

            <form onSubmit={handleUnlock} className="space-y-3">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Access key"
                className="w-full px-4 py-2 rounded-lg bg-black border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
                autoFocus
              />
              {unlockError && <p className="text-red-400 text-sm">{unlockError}</p>}
              <button
                type="submit"
                disabled={unlocking || !keyInput.trim()}
                className="w-full bg-red-600 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition"
              >
                {unlocking ? "Checking..." : "Unlock"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && !needsKey && machine && (
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          <Link to="/htb" className="text-red-500 hover:underline block mb-6">
            ← Back to HTB Profile
          </Link>

          <article className="bg-zinc-900/60 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-zinc-700">
            <header className="mb-8 pb-8 border-b border-zinc-700">
              <h1 className="text-4xl md:text-5xl font-bold leading-[1.2] py-1 mb-4 text-red-400">
                {machine.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mb-2">
                <span>{machine.os}</span>
                <span>•</span>
                <span>{machine.difficulty}</span>
                <span>•</span>
                <span>{new Date(machine.completed_date).toLocaleDateString()}</span>
                {!machine.retired && (
                  <>
                    <span>•</span>
                    <span className="text-green-400">🔓 Unlocked</span>
                  </>
                )}
              </div>

              {machine.badge && (
                <a
                  href={machine.badge}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:underline text-sm"
                >
                  View HTB Achievement ↗
                </a>
              )}
            </header>

            <div className="prose prose-invert prose-red max-w-none">
              {machine.walkthrough ? (
                <ReactMarkdown
                  rehypePlugins={[[rehypeHighlight, highlightOptions]]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-3xl font-bold mt-8 mb-4 text-red-400" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-2xl font-bold mt-6 mb-3 text-zinc-200" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-xl font-bold mt-4 mb-2 text-amber-400" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-4 text-zinc-300 leading-relaxed" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-red-400 hover:text-red-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    code: ({ node, className, ...props }) => {
                      // react-markdown v9+ no longer passes an `inline` flag, so block code
                      // (from ``` fences) is detected by the `language-xxx` class remark
                      // attaches to it — anything without that class is inline code.
                      const isBlock = /language-/.test(className || "");
                      return isBlock ? (
                        <code className="block p-4 bg-zinc-950 rounded-lg text-sm font-mono overflow-x-auto" {...props} />
                      ) : (
                        <code className="px-2 py-1 bg-zinc-950 text-red-300 rounded text-sm font-mono" {...props} />
                      );
                    },
                    pre: ({ node, ...props }) => (
                      <pre className="mb-4 bg-zinc-950 rounded-lg overflow-x-auto" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="mb-4 ml-6 list-disc text-zinc-300 space-y-2" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="mb-4 ml-6 list-decimal text-zinc-300 space-y-2" {...props} />
                    ),
                    li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="pl-4 border-l-4 border-red-600 italic text-zinc-400 my-4"
                        {...props}
                      />
                    ),
                  }}
                >
                  {machine.walkthrough}
                </ReactMarkdown>
              ) : (
                <p className="text-zinc-400">No writeup content yet — check back soon.</p>
              )}
            </div>
          </article>

          <div className="mt-8 text-center">
            <Link
              to="/htb"
              className="inline-block px-6 py-3 bg-red-600 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 rounded-lg font-medium transition"
            >
              ← Back to HTB Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default HTBWriteupDetail;
