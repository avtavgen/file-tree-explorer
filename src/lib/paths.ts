/** URL for a node's details page: /tree/<encoded path>. `search` (e.g. "?q=button") is carried along when given. */
export const nodeHref = (path: string, search = ""): string => `/tree/${encodeURIComponent(path)}${search}`;

export function parentOf(path: string): string {
  const i = path.lastIndexOf("/");
  return i === -1 ? "" : path.slice(0, i);
}

export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
