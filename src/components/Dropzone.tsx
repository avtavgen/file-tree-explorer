import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

interface DropzoneProps {
  onFile: (file: File) => void;
}

export default function Dropzone({ onFile }: DropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = ""; // allow picking the same file again
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
        dragging ? "border-accent bg-accent-soft" : "border-slate-300 bg-white"
      }`}
    >
      <p className="font-medium">{dragging ? "Drop to load" : "Drag a .json file here"}</p>
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="mt-4 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Open JSON file
      </button>
      <input ref={input} type="file" accept=".json,application/json" hidden onChange={handleInput} />
    </div>
  );
}
