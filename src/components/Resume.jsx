import { Link } from "react-router-dom";

function Resume() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-bold">Resume</h1>
      <p className="max-w-xl text-center text-gray-300">
        For the latest version of my resume, please visit my linkedin{" "}
        <a
          href="https://www.linkedin.com/in/alexander-rapino-129320231/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:underline"
        >
          profile
        </a>
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default Resume;
