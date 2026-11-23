"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/Button";
import { validateContact } from "@/lib/contact";

interface Fields {
  name: string;
  email: string;
  message: string;
}

type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", email: "", message: "" };

export function ContactForm({ sendEnabled }: { sendEnabled: boolean }) {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const [website, setWebsite] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const invalidField = useRef<string | null>(null);
  useEffect(() => {
    if (invalidField.current) {
      formRef.current?.querySelector<HTMLElement>(`#${invalidField.current}`)?.focus();
      invalidField.current = null;
    }
  }, [errors]);

  const update = (key: keyof Fields) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
    setSubmitted(false);
    setSent(false);
    setDeliveryError("");
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validateContact(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      invalidField.current = Object.keys(found)[0];
      setSubmitted(false);
      return;
    }

    if (sendEnabled) {
      setSending(true);
      setDeliveryError("");
      try {
        const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fields, website }) });
        const result = await response.json();
        if (response.ok && result.sent === true) { setSent(true); setSubmitted(false); setFields(EMPTY); return; }
        setDeliveryError(result.error || "Delivery could not be confirmed.");
      } catch { setDeliveryError("Delivery could not be confirmed."); }
      finally { setSending(false); }
    }
    setSubmitted(true);
  };

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
    `Portfolio enquiry from ${fields.name}`,
  )}&body=${encodeURIComponent(`${fields.message}\n\n— ${fields.name} (${fields.email})`)}`;

  const fieldClass =
    "w-full rounded-lg border bg-[var(--shell)] px-4 py-3 text-[0.92rem] text-[var(--ink)] " +
    "placeholder:text-[var(--ink-faint)] focus:outline-none focus-visible:outline-2 " +
    "focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={sending} className="mt-8 space-y-4">
      <div className="hidden" aria-hidden="true"><label htmlFor="website">Leave empty</label><input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></div>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-[0.8rem] text-[var(--ink-soft)]">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          maxLength={100}
          value={fields.name}
          onChange={update("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`${fieldClass} ${errors.name ? "border-red-400" : "border-[var(--line)]"}`}
          placeholder="Your name"
        />
        {errors.name && (
          <p id="name-error" className="mt-1.5 text-[0.78rem] text-[var(--error)]">
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
          required
          autoComplete="email"
          maxLength={254}
          value={fields.email}
          onChange={update("email")}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`${fieldClass} ${errors.email ? "border-red-400" : "border-[var(--line)]"}`}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id="email-error" className="mt-1.5 text-[0.78rem] text-[var(--error)]">
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
          required
          maxLength={3000}
          value={fields.message}
          onChange={update("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y ${errors.message ? "border-red-400" : "border-[var(--line)]"}`}
          placeholder="What are you building?"
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-[0.78rem] text-[var(--error)]">
            {errors.message}
          </p>
        )}
      </div>

      <Button type="submit" variant="dark" disabled={sending} className="w-full sm:w-auto">
        <Send size={15} aria-hidden />
        {sending ? "Sending…" : sendEnabled ? "Send Message" : "Prepare Email"}
      </Button>

      <div role="status" aria-live="polite">
        {sent && <p className="rounded-lg border border-[var(--line)] p-4 text-sm text-[var(--ink)]">Message accepted for delivery. Thank you.</p>}
        {submitted && (
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 text-[0.85rem] text-[var(--ink-soft)]">
            <p className="font-medium text-[var(--ink)]">Your message is ready.</p>
            {deliveryError && <p className="mt-2 text-[var(--error)]">{deliveryError}</p>}
            <p className="mt-1.5">
              Nothing has been sent.{" "}
              <a href={mailto} className="font-medium text-[var(--ink)] underline underline-offset-4">
                Open it in your email app
              </a>{" "}
              to review and send it to {profile.email}.
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
