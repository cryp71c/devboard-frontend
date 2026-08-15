import { useEffect, useState, lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { common } from "lowlight";
import x86asm from "highlight.js/lib/languages/x86asm";

// highlight.js's "common" bundle doesn't include assembly, but two of the
// three posts on this site are largely x86-64 assembly — register it
// explicitly under the `asm` alias used in the posts' ```asm fences.
const highlightOptions = {
  languages: { ...common, x86asm },
  aliases: { x86asm: ["asm"] },
};

// Lazy-loaded: pulls in a small WASM module, and only the CRC32C post needs
// it — no reason for every other blog post to fetch it.
const Crc32cDemo = lazy(() => import("./Crc32cDemo.jsx"));

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
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Helmet>
        <title>{post ? `${post.title} | cryp71c.dev` : "Blog | cryp71c.dev"}</title>
      </Helmet>
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
            <h2 className="text-lg font-semibold">Loading Article...</h2>
            <p className="text-sm text-zinc-400 mt-2">Fetching content</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-red-950/50 border border-red-600 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-lg font-semibold text-red-400">Error Loading Article</h2>
            <p className="text-sm text-zinc-300 mt-2">{error}</p>
            <Link to="/blog" className="mt-4 inline-block text-red-400 hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && post && (
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          <Link to="/blog" className="text-red-500 hover:underline block mb-6">
            ← Back to Blog
          </Link>

          <article className="bg-zinc-900/60 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-zinc-700">
            {/* Header */}
            <header className="mb-8 pb-8 border-b border-zinc-700">
              <h1 className="text-4xl md:text-5xl font-bold leading-[1.2] py-1 mb-4 bg-gradient-to-r from-red-600 via-red-400 to-red-700 bg-clip-text text-transparent">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mb-4">
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
                      className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs font-medium border border-zinc-600"
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
            <div className="prose prose-invert prose-red max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
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
                  li: ({ node, ...props }) => (
                    <li className="leading-relaxed" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="pl-4 border-l-4 border-red-600 italic text-zinc-400 my-4"
                      {...props}
                    />
                  ),
                  img: ({ node, ...props }) => (
                    <img
                      className="mx-auto my-6 rounded-lg border border-zinc-700 bg-white p-2"
                      loading="lazy"
                      {...props}
                    />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="mb-4 overflow-x-auto rounded-lg border border-zinc-700">
                      <table className="w-full text-sm text-left border-collapse" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-zinc-950/70 text-red-300" {...props} />
                  ),
                  tbody: ({ node, ...props }) => (
                    <tbody className="divide-y divide-zinc-700" {...props} />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="hover:bg-zinc-950/40" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="px-4 py-2 font-semibold whitespace-nowrap" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="px-4 py-2 text-zinc-300 whitespace-nowrap" {...props} />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          {post.slug === "crc32c-from-scratch-rust-inline-assembly" && (
            <Suspense
              fallback={
                <div className="mt-8 flex items-center justify-center h-24 bg-zinc-900/60 rounded-xl border border-zinc-700">
                  <div className="h-6 w-6 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                </div>
              }
            >
              <Crc32cDemo />
            </Suspense>
          )}

          {/* Back to Blog */}
          <div className="mt-8 text-center">
            <Link
              to="/blog"
              className="inline-block px-6 py-3 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 rounded-lg font-medium transition"
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
