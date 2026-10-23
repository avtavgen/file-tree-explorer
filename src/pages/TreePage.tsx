import { useMemo, type ChangeEvent } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import SearchResults from "../components/SearchResults";
import TreeView from "../components/TreeView";
import { useTree } from "../context/TreeContext";
import { formatBytes, plural } from "../lib/format";
import { searchNodes } from "../lib/search";

const buttonClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50";

export default function TreePage() {
  const { data, expandAll, collapseAll } = useTree();
  const [params, setParams] = useSearchParams();
  const { search } = useLocation();

  // The query lives in the URL (?q=…), so it survives refreshes and works with back/forward.
  const query = params.get("q") ?? "";
  const searching = query.trim() !== "";
  const results = useMemo(() => (data ? searchNodes(data.index, query) : []), [data, query]);

  if (!data) return <Navigate to="/" replace />;
  const { root } = data;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setParams(value === "" ? {} : { q: value }, { replace: true });
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-semibold tracking-tight">{root.name}/</h1>
          <p className="mt-1 text-sm text-slate-600">
            {plural(root.fileCount, "file")} · {plural(root.folderCount, "folder")} · {formatBytes(root.size)}
          </p>
        </div>
        <Link to="/" className={buttonClass}>
          Load different JSON
        </Link>
      </header>

      <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-6 flex gap-2">
        <label htmlFor="search" className="sr-only">
          Search files and folders by name
        </label>
        <input
          id="search"
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Search by name"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        />
        {query !== "" && (
          <button type="button" onClick={() => setParams({}, { replace: true })} className={buttonClass}>
            Clear
          </button>
        )}
      </form>

      {searching ? (
        <SearchResults results={results} query={query} search={search} />
      ) : (
        <>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={expandAll} className={buttonClass}>
              Expand all
            </button>
            <button type="button" onClick={collapseAll} className={buttonClass}>
              Collapse all
            </button>
          </div>

          <section className="mt-3 rounded-xl border border-slate-200 bg-white p-2">
            {root.children.length > 0 ? (
              <TreeView nodes={root.children} />
            ) : (
              <p className="p-3 text-sm italic text-slate-500">This folder is empty.</p>
            )}
          </section>
        </>
      )}
    </main>
  );
}
