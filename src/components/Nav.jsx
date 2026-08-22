import { Link, useLocation } from "react-router-dom";

const LINKS = [
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/htb", label: "HTB Profile" },
  { to: "/credentials", label: "Credentials" },
  { to: "/contact", label: "Contact" },
];

// Rendered once at the top level (see main.jsx) so it's present on every
// route and doesn't remount on navigation. `sticky` (not `fixed`) so it
// takes up real space in normal flow — no page needs manual top padding
// to avoid sitting under it.
function Nav() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <Link to="/" className="text-lg font-bold text-red-400 tracking-tight shrink-0">
          cryp71c
        </Link>
        <div className="flex items-center gap-1 flex-wrap">
          {LINKS.map((link) => {
            const active =
              location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 text-sm ${active ? "tab-active" : "text-zinc-300 border border-transparent hover:text-white hover:border-zinc-800"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
