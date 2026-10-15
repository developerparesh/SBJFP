import Link from "next/link";

const footerLinks = {
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
  "For Job Seekers": [
    { label: "Find Jobs", href: "#for-job-seekers" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Skill Matching", href: "#how-matching-works" },
  ],
  "For Employers": [
    { label: "Post a Job", href: "#for-employers" },
    { label: "Find Candidates", href: "#for-employers" },
    { label: "How It Works", href: "#how-it-works" },
  ],
};

export default function Footer() {
  return (
    <footer
      className="text-white pt-16 pb-8"
      style={{ backgroundColor: "var(--navy)" }}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="text-2xl font-bold mb-2">SBJFP</p>
            <p className="text-sm font-medium mb-3" style={{ color: "var(--mint)" }}>
              Skills meet opportunity.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              A skills-based job finding platform designed to connect the right people with the right roles — transparently.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4">
                {group}
              </h3>
              <ul className="space-y-2.5 list-none m-0 p-0">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} SBJFP — Skill-Based Job Finding Platform. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs text-center">
            🚧 Platform in development — features described reflect planned functionality.
          </p>
        </div>
      </div>
    </footer>
  );
}
