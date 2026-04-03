const rawBase = import.meta.env.BASE_URL;
const base = rawBase.endsWith('/') ? rawBase : rawBase + '/';

/**
 * Returns a fully-prefixed asset path for use in src/href attributes.
 * Strips any leading slash from `path` before prepending the base URL.
 */
export function asset(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return base + clean;
}
