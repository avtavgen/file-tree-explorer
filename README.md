# FileTree Explorer

## Requirements

* React 18
* React Router v6
* TypeScript
* Tailwind CSS 3
* Vite

```bash
npm install && npm run dev        # http://localhost:5173
```

## Routes

| Route | What it shows |
| --- | --- |
| `/` | Load JSON: open a file, drag & drop, or paste. Invalid JSON or a wrong structure shows an error. |
| `/tree` | Tree with expand/collapse (per folder, plus Expand all / Collapse all) and a name search. |
| `/tree?q=button` | Search results: every node whose name contains the query, with its full path. The query lives in the URL, so it survives reloads and works with back/forward. |
| `/tree/:nodePath` | Details for one node. `nodePath` is URL-encoded, e.g. `/tree/src%2Fcomponents%2FButton.tsx`. Files: name, size (B/KB/MB), full path. Folders: name, full path, direct children, total size of the subtree, linked children. |

## Expected JSON

```json
{ "name": "root", "type": "folder", "children": [
  { "name": "src", "type": "folder", "children": [
    { "name": "index.ts", "type": "file", "size": 1024 } ] },
  { "name": "package.json", "type": "file", "size": 300 } ] }
```

The root must be a folder. Paths are relative to the root (the root name isn't part of them). The JSON text is kept in `sessionStorage`, so refreshing a `/tree/...` page keeps working.

Layout: `src/lib/parseTree.ts` (validation + tree building), `src/lib/search.ts` (name search), `src/context/TreeContext.tsx` (state), `src/pages`, `src/components`.

## Implementation
```
JSON validated once when it is loaded and saved in sessionStorage; the tree is rebuilt from it on startup.
Expanded folders are held in React context.
The search query lives in the URL.
The tree uses plain buttons and links.

JSON being lost when the tab closes.
Expanded folders not restored after a reload.
```

## TODO
```
- Tests: unit, component and Playwright.
- Keyboard navigation for the tree.
- Virtualized lists and a parser for large files.
- Better error validation.
- Better search.
- Database implementation.
- Tooling and CI.
```
