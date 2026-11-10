import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "./ContactForm";

const CHANNELS = [
  { label: "GitHub", href: profile.github, icon: Github },
  { label: "LinkedIn", href: profile.linkedin, icon: Linkedin },
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <h2
              id="contact-heading"
              className="h-display text-[clamp(2rem,5vw,3.4rem)] text-[var(--ink)]"
            >
              Let&rsquo;s build something together.
            </h2>
            <p className="mt-5 max-w-md text-[1rem] leading-relaxed text-[var(--ink-soft)]">
              Have an idea, project, or opportunity? Let&rsquo;s talk.
            </p>

            <ul className="mt-10 space-y-px">
              {CHANNELS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group flex items-center justify-between gap-4 border-t border-white/10 py-4 text-[0.95rem] transition-colors hover:text-[var(--lagoon)]"
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={17} aria-hidden className="text-[var(--lagoon)]" />
                      {label}
                    </span>
                    <span className="min-w-0 break-all text-right text-[0.82rem] text-[var(--ink-soft)] transition-colors group-hover:text-[var(--lagoon)]">
                      {label === "Email"
                        ? profile.email
                        : href.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-lg bg-[var(--shell)] p-6 text-[var(--ink)] sm:p-8">
              <h3 className="text-[1.05rem] font-medium tracking-tight">
                Write an email
              </h3>
              <p className="mt-1.5 text-[0.85rem] text-[var(--ink-soft)]">
                Prepare a draft, then send it using your email app.
              </p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>

    </section>
  );
}
