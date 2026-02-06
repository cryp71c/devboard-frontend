import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://${API_URL}/blog/${slug}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Blog post not found");
          }
          throw new Error(`API error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load blog post:", err);
        setError(err.message || "Failed to load blog post");
        setLoading(false);
      });
  }, [slug]);

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
            <h2 className="text-lg font-semibold">Loading Article...</h2>
            <p className="text-sm text-gray-400 mt-2">Fetching content</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
          <div className="bg-red-900/50 border border-red-500 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-lg font-semibold text-red-400">Error Loading Article</h2>
            <p className="text-sm text-gray-300 mt-2">{error}</p>
            <Link to="/blog" className="mt-4 inline-block text-indigo-400 hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && post && (
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          <Link to="/blog" className="text-indigo-500 hover:underline block mb-6">
            ← Back to Blog
          </Link>

          <article className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-gray-700">
            {/* Header */}
            <header className="mb-8 pb-8 border-b border-gray-700">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
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

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
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

              {/* Featured Badge */}
              {post.featured && (
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-yellow-900/50 text-yellow-300 border border-yellow-700 rounded-full text-xs font-semibold">
                    ⭐ Featured Article
                  </span>
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="prose prose-invert prose-indigo max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4 text-indigo-400" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-2xl font-bold mt-6 mb-3 text-pink-400" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-xl font-bold mt-4 mb-2 text-blue-400" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-4 text-gray-300 leading-relaxed" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-indigo-400 hover:text-indigo-300 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code className="px-2 py-1 bg-gray-900 text-pink-400 rounded text-sm font-mono" {...props} />
                    ) : (
                      <code className="block p-4 bg-gray-900 rounded-lg text-sm font-mono overflow-x-auto" {...props} />
                    ),
                  pre: ({ node, ...props }) => (
                    <pre className="mb-4 bg-gray-900 rounded-lg overflow-x-auto" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="mb-4 ml-6 list-disc text-gray-300 space-y-2" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="mb-4 ml-6 list-decimal text-gray-300 space-y-2" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="leading-relaxed" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="pl-4 border-l-4 border-indigo-500 italic text-gray-400 my-4"
                      {...props}
                    />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          {/* Back to Blog */}
          <div className="mt-8 text-center">
            <Link
              to="/blog"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition"
            >
              ← Back to All Posts
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogDetail;
