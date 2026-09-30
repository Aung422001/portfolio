"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/Button";

interface Fields {
  name: string;
  email: string;
  message: string;
}

type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", email: "", message: "" };

function validate(fields: Fields): Errors {
  const errors: Errors = {};

  if (!fields.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!fields.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim())) {
    errors.email = "That doesn't look like a valid email address.";
  }

  if (!fields.message.trim()) {
    errors.message = "Please write a message.";
  } else if (fields.message.trim().length < 10) {
    errors.message = "A little more detail would help — at least 10 characters.";
  }

  return errors;
}

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof Fields) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setSubmitted(false);
      return;
    }

    // ── INTEGRATION POINT ────────────────────────────────────────────────
    // No email service is wired up, and this deliberately does not pretend
    // otherwise. To make it send for real, POST to your provider here:
    //
    //   await fetch("/api/contact", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(fields),
    //   });
    //
    // Then add app/api/contact/route.ts calling Resend, SendGrid or Formspree
    // with the key in an env var. Until then the form hands the visitor a
    // prefilled mailto so the message still reaches the inbox.
    // ─────────────────────────────────────────────────────────────────────
    setSubmitted(true);
  };

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
    `Portfolio enquiry from ${fields.name}`,
  )}&body=${encodeURIComponent(`${fields.message}\n\n— ${fields.name} (${fields.email})`)}`;

  const fieldClass =
    "w-full rounded-xl border bg-white/70 px-4 py-3 text-[0.92rem] text-[var(--ink)] " +
    "placeholder:text-[var(--ink-faint)] focus:outline-none focus-visible:outline-2 " +
    "focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]";

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-[0.8rem] text-[var(--ink-soft)]">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={fields.name}
          onChange={update("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`${fieldClass} ${errors.name ? "border-red-400" : "border-[var(--line)]"}`}
          placeholder="Your name"
        />
        {errors.name && (
          <p id="name-error" className="mt-1.5 text-[0.78rem] text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-[0.8rem] text-[var(--ink-soft)]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={update("email")}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`${fieldClass} ${errors.email ? "border-red-400" : "border-[var(--line)]"}`}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id="email-error" className="mt-1.5 text-[0.78rem] text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-[0.8rem] text-[var(--ink-soft)]">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={fields.message}
          onChange={update("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y ${errors.message ? "border-red-400" : "border-[var(--line)]"}`}
          placeholder="What are you building?"
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-[0.78rem] text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      <Button type="submit" variant="dark" className="w-full sm:w-auto">
        <Send size={15} aria-hidden />
        Send Message
      </Button>

      <div role="status" aria-live="polite">
        {submitted && (
          <div className="rounded-xl border border-[var(--line)] bg-[#eef8f7] p-4 text-[0.85rem] text-[var(--ink-soft)]">
            <p className="font-medium text-[var(--ink)]">Your message is ready.</p>
            <p className="mt-1.5">
              This form has no email service connected yet, so nothing was sent
              automatically.{" "}
              <a href={mailto} className="font-medium text-[var(--ink)] underline underline-offset-4">
                Open it in your email app
              </a>{" "}
              to send it to {profile.email}.
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
