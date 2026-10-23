import type { TreeNode } from "../types";

/** Case-insensitive substring match on node names across the whole tree. Exact matches first, then prefix matches, then the rest. */
export function searchNodes(index: ReadonlyMap<string, TreeNode>, query: string): TreeNode[] {
  const q = query.trim().toLowerCase();
  if (q === "") return [];

  const ranked: { node: TreeNode; rank: number }[] = [];
  for (const node of index.values()) {
    const name = node.name.toLowerCase();
    const at = name.indexOf(q);
    if (at === -1) continue;
    ranked.push({ node, rank: name === q ? 0 : at === 0 ? 1 : 2 });
  }

  ranked.sort(
    (a, b) => a.rank - b.rank || a.node.path.localeCompare(b.node.path, undefined, { numeric: true }),
  );
  return ranked.map((r) => r.node);
}
