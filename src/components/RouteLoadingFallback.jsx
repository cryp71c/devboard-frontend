// Suspense fallback shown while a lazy-loaded route chunk (e.g. Projects,
// which pulls in three.js) downloads. Pulled out of main.jsx into its own
// file so main.jsx stays export-free — that's what Vite Fast Refresh wants
// (see react-refresh/only-export-components).
function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
    </div>
  );
}

export default RouteLoadingFallback;
