import { useRef, useState } from "react";

type Props = { onFiles: (files: FileList) => Promise<void> };

export default function Upload({ onFiles }: Props) {
  const [items, setItems] = useState<{ name: string; status: string }[]>([]);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = async (files: FileList) => {
    const audioFiles = Array.from(files).filter((f) =>
      f.type.startsWith("audio/"),
    );
    const pending = audioFiles.map((f) => ({
      name: f.name,
      status: "Saving…",
    }));
    setItems((prev) => [...prev, ...pending]);
    try {
      await onFiles(files);
      setItems((prev) =>
        prev.map((it) =>
          pending.find((p) => p.name === it.name && it.status === "Saving…")
            ? { ...it, status: "✓ Saved" }
            : it,
        ),
      );
    } catch {
      setItems((prev) =>
        prev.map((it) =>
          pending.find((p) => p.name === it.name && it.status === "Saving…")
            ? { ...it, status: "✗ Error" }
            : it,
        ),
      );
    }
  };

  return (
    <section className="view active">
      <div className="view-header">
        <h1>Upload Music</h1>
      </div>
      <div
        className={`upload-zone ${drag ? "drag-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handle(e.dataTransfer.files);
        }}
      >
        <div className="upload-icon">📂</div>
        <p>Drag &amp; drop audio files here</p>
        <p className="muted">or</p>
        <button
          className="btn-primary"
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) handle(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="muted small">
          Supports MP3, WAV, OGG, FLAC, AAC · Files saved locally in your
          browser
        </p>
      </div>
      <div className="upload-list">
        {items.map((item, i) => (
          <div key={i} className="upload-item">
            <span className="name">{item.name}</span>
            <span className="status">{item.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
