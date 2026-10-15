"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Find Jobs", href: "#for-job-seekers" },
  { label: "For Employers", href: "#for-employers" },
  { label: "How It Works", href: "#how-it-works" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change / escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-md" : "border-b border-slate-100"
      }`}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Primary navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0" aria-label="SBJFP — Home">
          <Image
            src="/logo.png"
            alt="SBJFP logo"
            width={36}
            height={36}
            className="rounded-lg"
            priority
          />
          <span
            className="font-bold text-xl tracking-tight"
            style={{ color: "var(--navy)" }}
          >
            SBJFP
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-[#102A43] hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="#"
            aria-label="Sign In (coming soon)"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#102A43] rounded-md transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="#hero-cta"
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors"
            style={{ backgroundColor: "var(--blue)" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#1065a8")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--blue)")
            }
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="md:hidden p-2 rounded-md text-slate-500 hover:text-[#102A43] hover:bg-slate-100 transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-slate-100 bg-white pb-4 px-4"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1 mt-2 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-sm font-medium text-slate-600 hover:text-[#102A43] hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-slate-100 mt-2 pt-2">
              <Link
                href="#"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 transition-colors"
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                href="#hero-cta"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-semibold text-white rounded-lg text-center transition-colors"
                style={{ backgroundColor: "var(--blue)" }}
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
