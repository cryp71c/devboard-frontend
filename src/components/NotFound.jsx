import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Catch-all for any path that doesn't match a real route. Without this,
// React Router renders nothing for an unmatched path — a blank white page,
// not even the site's black background, since nothing mounts to set it.
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Helmet>
        <title>404 | cryp71c.dev</title>
      </Helmet>
      <div className="text-center space-y-4 px-4">
        <p className="text-red-400 text-sm tracking-wide">404</p>
        <h1 className="text-3xl font-bold text-zinc-200">Page not found</h1>
        <p className="text-zinc-400">Nothing's mapped to this path.</p>
        <div className="pt-2">
          <Link to="/" className="btn-primary inline-block px-5 py-2 text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
