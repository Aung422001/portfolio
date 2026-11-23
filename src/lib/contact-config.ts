/** Keep delivery disabled until the operator has configured the external rate limit. */
export function contactDeliveryEnabled(env: NodeJS.ProcessEnv = process.env) {
  return env.CONTACT_SEND_ENABLED === "true" && env.CONTACT_RATE_LIMIT_READY === "true" && !!env.RESEND_API_KEY && !!env.CONTACT_FROM;
}
