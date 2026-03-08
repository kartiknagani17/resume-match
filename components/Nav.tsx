"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/analyze", label: "Analyze" },
  { href: "/jobs",    label: "Find Jobs" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-white transition-all duration-200 ${
        scrolled ? "nav-scrolled" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-heading font-extrabold text-xl text-text-primary hover:text-accent transition-colors"
        >
          Resume<span className="text-accent">Match</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden sm:flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "text-accent bg-accent-light"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                }`}
              >
                {label}
              </Link>
            );
          })}

          <Link
            href="/analyze"
            className="btn-primary !py-2 !px-4 !text-sm ml-2"
          >
            Get started
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-white text-text-secondary hover:text-text-primary hover:border-accent-mid transition-colors"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4.5 h-4.5"
          >
            {open ? (
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3.5 6H16.5M3.5 10H16.5M3.5 14H11.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-border bg-white">
          <nav className="max-w-6xl mx-auto px-4 py-2 flex flex-col gap-1">
            {links.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`block px-2 py-2 rounded-lg text-sm font-medium ${
                    active
                      ? "text-accent bg-accent-light"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/analyze"
              className="mt-1 btn-primary !w-full !justify-center !py-2 !text-sm"
            >
              Get started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
