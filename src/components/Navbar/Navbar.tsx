"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems, profile } from "@/data/profile";
import { useActiveSection, useScrolled } from "@/lib/useActiveSection";
import { Button } from "@/components/ui/Button";

const SECTION_IDS = navItems.map((item) => item.id);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const scrolled = useScrolled();

  // Close on Escape, and stop the page scrolling behind the open sheet
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-[var(--line)] bg-[var(--shell)]/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-5 sm:px-8 lg:px-12"
      >
        <a
          href="#home"
          className="mr-auto flex items-center gap-2.5 rounded-full"
          aria-label={`${profile.name} — home`}
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--ink)] text-[0.7rem] font-semibold tracking-tight text-[var(--shell)]">
            {profile.initials}
          </span>
          <span className="hidden text-[0.9rem] font-medium sm:block">
            {profile.name}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                aria-current={active === item.id ? "true" : undefined}
                className={`relative rounded-full px-3.5 py-2 text-[0.85rem] transition-colors ${
                  active === item.id
                    ? "text-[var(--ink)]"
                    : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {item.label}
                {active === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-[var(--ink)]"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <Button href="#contact" size="sm" className="hidden md:inline-flex">
          Let&rsquo;s Talk
        </Button>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] md:hidden"
        >
          {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-[var(--line)] bg-[var(--shell)] md:hidden"
          >
            <ul className="px-5 py-3 sm:px-8">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active === item.id ? "true" : undefined}
                    className={`block rounded-xl px-3 py-3 text-[0.95rem] ${
                      active === item.id
                        ? "bg-[#eef8f7] text-[var(--ink)]"
                        : "text-[var(--ink-soft)]"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="px-3 pb-2 pt-3">
                <Button
                  href="#contact"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Let&rsquo;s Talk
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
