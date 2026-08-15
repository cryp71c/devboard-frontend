import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "", // Anti-spam honeypot field
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      // Prepare data without honeypot for body, honeypot goes in query param
      const { honeypot, ...bodyData } = formData;

      const response = await fetch(
        `https://${API_URL}/contact/submit?honeypot=${encodeURIComponent(honeypot)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 429) {
          throw new Error("Too many submissions. Please try again later.");
        } else if (response.status === 400) {
          throw new Error(errorData.detail || "Invalid submission. Please check your input.");
        }

        throw new Error(`Failed to submit: ${response.status}`);
      }

      // Success
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "", honeypot: "" });
    } catch (err) {
      console.error("Failed to submit contact form:", err);
      setError(err.message || "Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Helmet>
        <title>Contact | cryp71c.dev</title>
      </Helmet>
      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        <Link to="/" className="text-red-500 hover:underline block mb-6">
          ← Back
        </Link>

        <h1 className="text-5xl font-bold leading-[1.2] py-1 text-center mb-2 bg-gradient-to-r from-red-600 via-red-400 to-red-700 bg-clip-text text-transparent">
          Get In Touch
        </h1>
        <p className="text-center text-zinc-400 mb-12">
          Have a project in mind or want to connect? Drop me a message!
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-6 bg-green-900/50 border border-green-500 rounded-xl text-center">
            <div className="text-4xl mb-2">✓</div>
            <h2 className="text-xl font-bold text-green-400 mb-2">Message Sent!</h2>
            <p className="text-zinc-300">Thanks for reaching out. I'll get back to you soon.</p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition"
            >
              Send Another Message
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-xl">
            <p className="text-red-400 font-medium">Error: {error}</p>
          </div>
        )}

        {/* Contact Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="bg-zinc-900/60 backdrop-blur-sm rounded-xl p-8 border border-zinc-700">
            {/* Name Field */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition"
                placeholder="Your name"
              />
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Subject Field */}
            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-2">
                Subject <span className="text-zinc-500">(optional)</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition"
                placeholder="What's this about?"
              />
            </div>

            {/* Honeypot Field - Hidden from humans, visible to bots */}
            <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
              <label htmlFor="honeypot">Leave this field empty</label>
              <input
                type="text"
                id="honeypot"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Message Field */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition resize-none"
                placeholder="Your message..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Message</span>
              )}
            </button>

            <p className="mt-4 text-center text-sm text-zinc-400">
              Your information will never be shared with third parties.
            </p>
          </form>
        )}

        {/* Additional Contact Info */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">Other Ways to Connect</h3>
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="https://github.com/cryp71c"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:border-red-600 rounded-lg font-medium transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
