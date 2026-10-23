import { Link } from "react-router-dom";
import { useTree } from "../context/TreeContext";
import { formatBytes, plural } from "../lib/format";
import { nodeHref } from "../lib/paths";
import type { TreeNode } from "../types";

interface TreeViewProps {
  nodes: readonly TreeNode[];
  depth?: number;
}

export default function TreeView({ nodes, depth = 0 }: TreeViewProps) {
  return (
    <ul>
      {nodes.map((node) => (
        <TreeRow key={node.path} node={node} depth={depth} />
      ))}
    </ul>
  );
}

function TreeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const { expanded, toggle } = useTree();
  const indent = { paddingLeft: `${depth * 1.25 + 0.5}rem` };
  const rowClass = "flex items-center gap-2 rounded py-1 pr-2 hover:bg-slate-100";
  const metaClass = "ml-auto shrink-0 text-xs text-slate-500";

  if (node.type === "file") {
    return (
      <li>
        <div style={indent} className={rowClass}>
          <span className="w-5 shrink-0" aria-hidden />
          <Link to={nodeHref(node.path)} className="truncate font-mono text-sm hover:text-accent hover:underline">
            {node.name}
          </Link>
          <span className={metaClass}>{formatBytes(node.size)}</span>
        </div>
      </li>
    );
  }

  const open = expanded.has(node.path);
  return (
    <li>
      <div style={indent} className={rowClass}>
        <button
          type="button"
          onClick={() => toggle(node.path)}
          aria-expanded={open}
          aria-label={`${open ? "Collapse" : "Expand"} ${node.name}`}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-500 hover:bg-slate-200"
        >
          {open ? "▾" : "▸"}
        </button>
        <Link
          to={nodeHref(node.path)}
          className="truncate font-mono text-sm font-semibold hover:text-accent hover:underline"
        >
          {node.name}/
        </Link>
        <span className={metaClass}>
          {plural(node.fileCount, "file")} · {formatBytes(node.size)}
        </span>
      </div>
      {open &&
        (node.children.length > 0 ? (
          <TreeView nodes={node.children} depth={depth + 1} />
        ) : (
          <p style={{ paddingLeft: `${(depth + 1) * 1.25 + 1.75}rem` }} className="py-1 text-xs italic text-slate-400">
            Empty folder
          </p>
        ))}
    </li>
  );
}
