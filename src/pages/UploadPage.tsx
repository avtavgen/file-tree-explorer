import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Dropzone from "../components/Dropzone";
import { useTree } from "../context/TreeContext";
import { SAMPLE_JSON } from "../lib/sample";

export default function UploadPage() {
  const navigate = useNavigate();
  const { load } = useTree();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (value: string) => {
    const result = load(value);
    if (result.ok) {
      setError(null);
      navigate("/tree");
    } else {
      setError(result.error);
    }
  };

  const handleFile = (file: File) => {
    file
      .text()
      .then((content) => {
        setText(content);
        submit(content);
      })
      .catch(() => setError("Couldn't read that file. Choose a .json file, not a folder."));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(text);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setError(null);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">FileTree Explorer</h1>
      <p className="mt-2 text-slate-600">
        Load a JSON file to browse it.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Dropzone onFile={handleFile} />

        <div>
          <label htmlFor="json" className="mb-1 block text-sm font-medium">
            Or paste JSON
          </label>
          <textarea
            id="json"
            value={text}
            onChange={handleChange}
            rows={10}
            spellCheck={false}
            placeholder='{ "name": "root", "type": "folder", "children": [] }'
            aria-invalid={error !== null}
            aria-describedby={error ? "json-error" : undefined}
            className={`w-full rounded-lg border bg-white p-3 font-mono text-sm ${
              error ? "border-red-400" : "border-slate-300"
            }`}
          />
        </div>

        {error && (
          <p id="json-error" role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={text.trim() === ""}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Show tree
          </button>
          <button
            type="button"
            onClick={() => {
              setText(SAMPLE_JSON);
              setError(null);
            }}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
          >
            Use example
          </button>
        </div>
      </form>
    </main>
  );
}
