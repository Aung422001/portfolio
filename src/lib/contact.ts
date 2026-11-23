export interface ContactFields { name: string; email: string; message: string }
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export function validateContact(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  if (!fields.name.trim() || fields.name.length > 100 || /[\r\n]/.test(fields.name)) errors.name = "Enter a name of 1–100 characters.";
  if (fields.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim())) errors.email = "Enter a valid email address.";
  if (fields.message.trim().length < 10 || fields.message.length > 3000) errors.message = "Write a message of 10–3000 characters.";
  return errors;
}

export function parseContact(value: unknown): ContactFields | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (typeof input.name !== "string" || typeof input.email !== "string" || typeof input.message !== "string" || input.website !== "") return null;
  const fields = { name: input.name.trim(), email: input.email.trim(), message: input.message.trim() };
  return Object.keys(validateContact(fields)).length ? null : fields;
}
