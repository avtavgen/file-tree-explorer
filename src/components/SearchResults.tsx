import { Link } from "react-router-dom";
import { formatBytes, plural } from "../lib/format";
import { nodeHref } from "../lib/paths";
import type { TreeNode } from "../types";

const MAX_RESULTS = 200;

interface SearchResultsProps {
  results: readonly TreeNode[];
  query: string;
  /** Current query string (e.g. "?q=button"), appended to links so the search survives navigating back. */
  search: string;
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  const lower = text.toLowerCase();
  const at = q !== "" && lower.length === text.length ? lower.indexOf(q) : -1;
  if (at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded bg-accent-soft px-0.5 text-ink">{text.slice(at, at + q.length)}</mark>
      {text.slice(at + q.length)}
    </>
  );
}

export default function SearchResults({ results, query, search }: SearchResultsProps) {
  const shown = results.slice(0, MAX_RESULTS);

  return (
    <section>
      <p aria-live="polite" className="mt-3 text-sm text-slate-600">
        {results.length === 0
          ? `No names match “${query.trim()}”.`
          : `${plural(results.length, "match")}${results.length > shown.length ? `, showing the first ${shown.length}` : ""}`}
      </p>

      {shown.length > 0 && (
        <ul className="mt-2 rounded-xl border border-slate-200 bg-white p-2">
          {shown.map((node) => (
            <li key={node.path}>
              <Link to={nodeHref(node.path, search)} className="block rounded px-2 py-2 hover:bg-slate-100">
                <span className="flex items-baseline justify-between gap-4">
                  <span className="truncate font-mono text-sm font-semibold">
                    <Highlight text={node.name} query={query} />
                    {node.type === "folder" ? "/" : ""}
                  </span>
                  <span className="shrink-0 text-xs text-slate-500">
                    {node.type === "file" ? formatBytes(node.size) : plural(node.children.length, "item")}
                  </span>
                </span>
                <span className="block truncate font-mono text-xs text-slate-500">{node.path}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
