export interface FileNode {
  type: "file";
  name: string;
  /** Path relative to the root, e.g. "src/components/Button.tsx". */
  path: string;
  size: number;
}

export interface FolderNode {
  type: "folder";
  name: string;
  /** Path relative to the root; the root itself is "". */
  path: string;
  /** Total size of all files inside. */
  size: number;
  /** Number of files at any depth. */
  fileCount: number;
  /** Number of subfolders at any depth. */
  folderCount: number;
  children: TreeNode[];
}

export type TreeNode = FileNode | FolderNode;

export interface ParsedTree {
  root: FolderNode;
  /** Every node except the root, keyed by its path. */
  index: ReadonlyMap<string, TreeNode>;
}

export type ParseResult = { ok: true; data: ParsedTree } | { ok: false; error: string };
