import type { ReactNode } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { useTree } from "../context/TreeContext";
import { formatBytes, formatSizeLong, plural } from "../lib/format";
import { nodeHref, parentOf, safeDecode } from "../lib/paths";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 border-b border-slate-100 py-2 last:border-b-0">
      <dt className="w-36 shrink-0 text-sm text-slate-500">{label}</dt>
      <dd className="min-w-0 break-words text-sm">{children}</dd>
    </div>
  );
}

const backClass =
  "mt-8 inline-block rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50";

export default function NodePage() {
  const { nodePath = "" } = useParams<{ nodePath: string }>();
  const { search } = useLocation(); // e.g. "?q=button" — kept on every link so "Back to tree" restores the search
  const { data } = useTree();
  if (!data) return <Navigate to="/" replace />;

  const { root, index } = data;
  const treeHref = `/tree${search}`;
  // React Router normally hands us the decoded value; the fallback covers a still-encoded one.
  const path = index.has(nodePath) ? nodePath : safeDecode(nodePath);
  const node = index.get(path);

  if (!node) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
        <p className="mt-2 text-slate-600">
          There's nothing at <code className="font-mono">{path}</code> in this tree.
        </p>
        <Link to={treeHref} className="mt-4 inline-block text-accent hover:underline">
          Back to tree
        </Link>
      </main>
    );
  }

  const segments = path.split("/");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 font-mono text-sm text-slate-500">
        <Link to={treeHref} className="hover:text-accent hover:underline">
          {root.name}
        </Link>
        {segments.map((segment, i) => {
          const prefix = segments.slice(0, i + 1).join("/");
          const last = i === segments.length - 1;
          return (
            <span key={prefix} className="flex items-center gap-1">
              <span aria-hidden>/</span>
              {last ? (
                <span aria-current="page" className="text-ink">
                  {segment}
                </span>
              ) : (
                <Link to={nodeHref(prefix, search)} className="hover:text-accent hover:underline">
                  {segment}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <h1 className="mt-4 break-words font-mono text-2xl font-semibold tracking-tight">
        {node.name}
        {node.type === "folder" ? "/" : ""}
      </h1>

      {node.type === "file" ? (
        <dl className="mt-6 rounded-xl border border-slate-200 bg-white px-4">
          <Row label="Name">{node.name}</Row>
          <Row label="Size">{formatSizeLong(node.size)}</Row>
          <Row label="Full path">
            <span className="font-mono">{node.path}</span>
          </Row>
        </dl>
      ) : (
        <>
          <dl className="mt-6 rounded-xl border border-slate-200 bg-white px-4">
            <Row label="Name">{node.name}</Row>
            <Row label="Full path">
              <span className="font-mono">{node.path}</span>
            </Row>
            <Row label="Direct children">{node.children.length}</Row>
            <Row label="Total size">{formatSizeLong(node.size)}</Row>
          </dl>

          <section className="mt-6">
            <h2 className="text-sm font-medium text-slate-500">Children</h2>
            <ul className="mt-2 rounded-xl border border-slate-200 bg-white p-2">
              {node.children.length === 0 && <li className="p-1 text-sm italic text-slate-400">Empty folder</li>}
              {node.children.map((child) => (
                <li key={child.path}>
                  <Link
                    to={nodeHref(child.path, search)}
                    className="flex items-center justify-between gap-4 rounded px-2 py-1 hover:bg-slate-100"
                  >
                    <span className="truncate font-mono text-sm hover:text-accent">
                      {child.name}
                      {child.type === "folder" ? "/" : ""}
                    </span>
                    <span className="shrink-0 text-xs text-slate-500">
                      {child.type === "file" ? formatBytes(child.size) : plural(child.children.length, "item")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <Link to={parentOf(path) === "" ? treeHref : nodeHref(parentOf(path), search)} className={backClass}>
        Up to {parentOf(path) === "" ? `${root.name}/` : `${parentOf(path)}/`}
      </Link>{" "}
      <Link to={treeHref} className={backClass}>
        Back to tree
      </Link>
    </main>
  );
}
