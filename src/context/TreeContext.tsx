import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { defaultExpanded, folderPaths, parseTree } from "../lib/parseTree";
import type { ParsedTree, ParseResult } from "../types";

interface TreeContextValue {
  data: ParsedTree | null;
  /** Parses and, if valid, stores the JSON. Returns the result so callers can show errors. */
  load: (text: string) => ParseResult;
  expanded: ReadonlySet<string>;
  toggle: (path: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

const STORAGE_KEY = "folder-viewer:json";

// The raw JSON is kept in sessionStorage so a page refresh on /tree/... still works.
function readStored(): ParsedTree | null {
  try {
    const text = sessionStorage.getItem(STORAGE_KEY);
    if (!text) return null;
    const result = parseTree(text);
    return result.ok ? result.data : null;
  } catch {
    return null;
  }
}

const TreeContext = createContext<TreeContextValue | null>(null);

export function TreeProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ParsedTree | null>(readStored);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() =>
    data ? defaultExpanded(data.root) : new Set<string>(),
  );

  const value = useMemo<TreeContextValue>(
    () => ({
      data,
      expanded,
      load: (text) => {
        const result = parseTree(text);
        if (result.ok) {
          setData(result.data);
          setExpanded(defaultExpanded(result.data.root));
          try {
            sessionStorage.setItem(STORAGE_KEY, text);
          } catch {
            /* storage full or unavailable — the tree still works for this session */
          }
        }
        return result;
      },
      toggle: (path) =>
        setExpanded((prev) => {
          const next = new Set(prev);
          if (!next.delete(path)) next.add(path);
          return next;
        }),
      expandAll: () => {
        if (data) setExpanded(folderPaths(data.index));
      },
      collapseAll: () => setExpanded(new Set<string>()),
    }),
    [data, expanded],
  );

  return <TreeContext.Provider value={value}>{children}</TreeContext.Provider>;
}

export function useTree(): TreeContextValue {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error("useTree must be used inside <TreeProvider>");
  return ctx;
}
