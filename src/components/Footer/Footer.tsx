import { profile } from "@/data/profile";

const LINKS = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
];

export function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-[var(--shell)]">
      <div className="mx-auto w-full max-w-6xl border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[1rem] font-medium">{profile.name}</p>
            <p className="mt-1 text-[0.85rem] text-[var(--shell)]/60">
              {profile.role}
            </p>
          </div>

          <ul className="flex flex-wrap gap-6">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-[0.85rem] text-[var(--shell)]/60 underline-offset-4 transition-colors hover:text-[var(--lagoon)] hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-[0.78rem] text-[var(--shell)]/40">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
