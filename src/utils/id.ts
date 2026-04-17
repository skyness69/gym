/**
 * Generates a universally unique identifier.
 * Uses the native crypto.randomUUID() where available (modern browsers),
 * and falls back to a Math.random-based approach for compatibility.
 */
export const uuid = (): string =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 11);
