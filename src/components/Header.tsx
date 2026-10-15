"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  getStoredNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/notificationsData";
import { AppNotification } from "@/types/notification";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Find Jobs", href: "/jobs" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Salaries", href: "/salaries" },
  { label: "AI Practice", href: "/practice" },
  { label: "Interview Hub", href: "/interviews" },
  { label: "Messages", href: "/messages" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { user, profile, signOut, loading } = useAuth();

  useEffect(() => {
    setNotifications(getStoredNotifications());
  }, []);

  const unreadCount = notifications.filter(
    (n) => !n.read && (profile?.role ? n.role === profile.role || n.role === "all" : true)
  ).length;

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsAsRead(profile?.role);
    setNotifications(updated);
  };

  const handleNotificationClick = (id: string) => {
    const updated = markNotificationAsRead(id);
    setNotifications(updated);
    setNotificationsOpen(false);
  };

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

  const dashboardUrl = `/dashboard/${profile?.role || "candidate"}`;

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
            className="font-bold text-xl tracking-tight flex items-center gap-2"
            style={{ color: "var(--navy)" }}
          >
            SBJFP
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium border border-slate-200">
              v1.0.1
            </span>
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
          {/* In-App Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen((prev) => !prev)}
              className="p-2 rounded-lg text-slate-600 hover:text-[#102A43] hover:bg-slate-100 transition relative"
              title="Notifications"
              aria-label="View notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n.id)}
                        className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
                          !n.read ? "bg-blue-50/40" : ""
                        }`}
                      >
                        <span className="text-xl flex-shrink-0 mt-0.5">
                          {n.type === "shortlist" ? "🎉" : n.type === "interview_booked" ? "📅" : n.type === "new_match" ? "🎯" : "ℹ️"}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                          {n.actionUrl && (
                            <Link
                              href={n.actionUrl}
                              className="inline-block mt-2 text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                            >
                              View details →
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications right now.
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-center">
                  <Link
                    href="/dashboard/candidate"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    View all in Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>

          {!loading && user ? (
            <>
              <Link
                href={dashboardUrl}
                className="px-3.5 py-2 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-2"
              >
                <span>{profile?.role === "employer" ? "🏢" : "👤"}</span>
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-red-600 rounded-md transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#102A43] rounded-md transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
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
            </>
          )}
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

            {!loading && user ? (
              <>
                <li className="border-t border-slate-100 mt-2 pt-2">
                  <Link
                    href={dashboardUrl}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-semibold text-slate-800 rounded-md hover:bg-slate-50 transition"
                  >
                    Go to Dashboard ({profile?.role})
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      signOut();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 font-medium"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="border-t border-slate-100 mt-2 pt-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-semibold text-white rounded-lg text-center transition-colors"
                    style={{ backgroundColor: "var(--blue)" }}
                  >
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
