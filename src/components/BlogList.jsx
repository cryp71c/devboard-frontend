import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES, categoryBadgeClass } from "../utils/categories";

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://${API_URL}/blog/all`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load blog posts:", err);
        setError(err.message || "Failed to load blog posts");
        setLoading(false);
      });
  }, []);

  const filteredPosts =
    categoryFilter === "all" ? posts : posts.filter((post) => post.category === categoryFilter);

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
            <h2 className="text-lg font-semibold">Loading Blog Posts...</h2>
            <p className="text-sm text-gray-400 mt-2">Fetching articles</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
          <div className="bg-red-900/50 border border-red-500 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-lg font-semibold text-red-400">Error Loading Blog</h2>
            <p className="text-sm text-gray-300 mt-2">{error}</p>
            <Link to="/" className="mt-4 inline-block text-indigo-400 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
          <Link to="/" className="text-indigo-500 hover:underline block mb-6">
            ← Back
          </Link>

          <h1 className="text-5xl font-bold leading-[1.2] py-1 text-center mb-2 bg-gradient-to-r from-indigo-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-center text-gray-400 mb-8">Technical writings, tutorials, and thoughts</p>

          {/* Category Filters */}
          {posts.length > 0 && (
            <div className="flex justify-center gap-3 mb-8 flex-wrap">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  categoryFilter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                All ({posts.length})
              </button>
              {CATEGORIES.map((category) => {
                const count = posts.filter((p) => p.category === category).length;
                if (count === 0) return null;
                return (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      categoryFilter === category
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty State (no posts at all) */}
          {posts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold mb-2">Blog Posts Coming Soon!</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                I'm working on some great technical content. Check back soon for articles on cybersecurity,
                development, and more.
              </p>
            </div>
          )}

          {/* Empty State (filter matched nothing) */}
          {posts.length > 0 && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No posts in this category yet.</p>
            </div>
          )}

          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 && (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2 hover:text-indigo-400 transition">
                        {post.title}
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.category && (
                          <span className={categoryBadgeClass(post.category)}>{post.category}</span>
                        )}
                        {post.featured && (
                          <span className="inline-block px-3 py-1 bg-yellow-900/50 text-yellow-300 border border-yellow-700 rounded-full text-xs font-semibold">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{post.summary}</p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-xs font-medium border border-indigo-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{new Date(post.published_date).toLocaleDateString()}</span>
                    {post.read_time_minutes && (
                      <>
                        <span>•</span>
                        <span>{post.read_time_minutes} min read</span>
                      </>
                    )}
                    {post.last_updated && (
                      <>
                        <span>•</span>
                        <span>Updated {new Date(post.last_updated).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BlogList;
