import { useState, useRef } from "react";
import type { Track } from "../types";

type SaveData = Pick<Track, "title" | "artist" | "album" | "thumb">;
type Props = {
  track: Track;
  onClose: () => void;
  onSave: (d: SaveData) => void;
};

export default function EditModal({ track, onClose, onSave }: Props) {
  const [title, setTitle] = useState(track.title);
  const [artist, setArtist] = useState(track.artist);
  const [album, setAlbum] = useState(track.album);
  const [thumb, setThumb] = useState(track.thumb);
  const thumbRef = useRef<HTMLInputElement>(null);

  const fields = [
    { label: "Title", value: title, set: setTitle },
    { label: "Artist", value: artist, set: setArtist },
    { label: "Album", value: album, set: setAlbum },
  ];

  const onThumb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => setThumb(ev.target?.result as string);
    r.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Track Info</h2>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="thumb-upload-wrap">
            <div className="thumb-preview">
              {thumb ? <img src={thumb} alt="" /> : "♪"}
            </div>
            <button
              className="btn-secondary"
              onClick={() => thumbRef.current?.click()}
            >
              Change Thumbnail
            </button>
            <input
              ref={thumbRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onThumb}
            />
          </div>
          {fields.map(({ label, value, set }) => (
            <div key={label} className="form-group">
              <label>{label}</label>
              <input
                type="text"
                value={value}
                placeholder={`${label} name`}
                onChange={(e) => set(e.target.value)}
              />
            </div>
          ))}
          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={() =>
                onSave({ title: title || track.title, artist, album, thumb })
              }
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
