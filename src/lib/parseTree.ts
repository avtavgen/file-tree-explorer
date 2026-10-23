import type { FileNode, FolderNode, ParseResult, TreeNode } from "../types";

class ValidationError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Validates one node (recursively) and returns it with computed paths and totals. `at` is the JSON location used in error messages. */
function build(
  raw: unknown,
  at: string,
  parentPath: string,
  isRoot: boolean,
  index: Map<string, TreeNode>,
): TreeNode {
  if (!isRecord(raw)) {
    throw new ValidationError(`${at}: expected an object with "name" and "type"`);
  }
  const { name, type } = raw;
  if (typeof name !== "string" || name.trim() === "") {
    throw new ValidationError(`${at}.name: expected a non-empty string`);
  }
  if (name.includes("/")) {
    throw new ValidationError(`${at}.name: "${name}" must not contain "/"`);
  }
  if (type !== "file" && type !== "folder") {
    throw new ValidationError(`${at}.type: expected "file" or "folder"`);
  }

  const path = isRoot ? "" : parentPath === "" ? name : `${parentPath}/${name}`;

  if (type === "file") {
    const size = raw.size;
    if (typeof size !== "number" || !Number.isFinite(size) || size < 0) {
      throw new ValidationError(`${at}.size: expected a non-negative number`);
    }
    const file: FileNode = { type: "file", name, path, size };
    index.set(path, file);
    return file;
  }

  const children = raw.children;
  if (!Array.isArray(children)) {
    throw new ValidationError(`${at}.children: expected an array`);
  }

  const seen = new Set<string>();
  const nodes: TreeNode[] = [];
  let size = 0;
  let fileCount = 0;
  let folderCount = 0;

  children.forEach((child: unknown, i: number) => {
    const childAt = `${at}.children[${i}]`;
    const node = build(child, childAt, path, false, index);
    if (seen.has(node.name)) {
      throw new ValidationError(`${childAt}.name: duplicate name "${node.name}" in the same folder`);
    }
    seen.add(node.name);
    nodes.push(node);
    size += node.size;
    if (node.type === "file") {
      fileCount += 1;
    } else {
      fileCount += node.fileCount;
      folderCount += 1 + node.folderCount;
    }
  });

  const folder: FolderNode = { type: "folder", name, path, size, fileCount, folderCount, children: nodes };
  if (!isRoot) index.set(path, folder);
  return folder;
}

export function parseTree(text: string): ParseResult {
  if (text.trim() === "") {
    return { ok: false, error: "Nothing to load. Paste some JSON or open a file." };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (e) {
    return { ok: false, error: `Not valid JSON — ${e instanceof Error ? e.message : "parse error"}` };
  }

  const index = new Map<string, TreeNode>();
  try {
    const root = build(raw, "$", "", true, index);
    if (root.type !== "folder") {
      throw new ValidationError('$.type: the root must be a "folder"');
    }
    return { ok: true, data: { root, index } };
  } catch (e) {
    if (e instanceof ValidationError) {
      return { ok: false, error: `Unexpected structure — ${e.message}` };
    }
    throw e;
  }
}

export function folderPaths(index: ReadonlyMap<string, TreeNode>): Set<string> {
  const out = new Set<string>();
  for (const node of index.values()) if (node.type === "folder") out.add(node.path);
  return out;
}

/** Top-level folders start expanded. */
export function defaultExpanded(root: FolderNode): Set<string> {
  return new Set(root.children.filter((c) => c.type === "folder").map((c) => c.path));
}
