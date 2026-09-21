import { useMemo, useState } from "react";
import type { Track } from "../types";

type Props = {
  tracks: Track[];
  cur: number;
  playing: boolean;
  onPlay: (i: number) => void;
  onLike: (i: number) => void;
  onEdit: (i: number) => void;
  onDelete: (i: number) => void;
  goUpload: () => void;
};

export default function Library({
  tracks,
  cur,
  playing,
  onPlay,
  onLike,
  onEdit,
  onDelete,
  goUpload,
}: Props) {
  const [query, setQuery] = useState("");
  const visibleTracks = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return tracks
      .map((track, index) => ({ track, index }))
      .filter(
        ({ track }) =>
          !normalized ||
          [track.title, track.artist, track.album].some((value) =>
            value.toLocaleLowerCase().includes(normalized),
          ),
      );
  }, [tracks, query]);

  return (
    <section className="view active">
      <div className="view-header">
        <h1>My Library</h1>
        <button className="btn-primary" onClick={goUpload}>
          + Upload Music
        </button>
      </div>
      {tracks.length > 0 && (
        <div className="library-tools">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, artist, or album"
              aria-label="Search your music library"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </label>
          <span className="library-count">
            {visibleTracks.length} of {tracks.length} track
            {tracks.length === 1 ? "" : "s"}
          </span>
        </div>
      )}
      <div className="track-grid">
        {!tracks.length ? (
          <div className="empty-state">
            No tracks yet. Upload some music to get started.
          </div>
        ) : !visibleTracks.length ? (
          <div className="empty-state">No tracks match “{query.trim()}”.</div>
        ) : (
          visibleTracks.map(({ track: t, index: i }) => (
            <div
              key={t.id}
              className={`track-card ${i === cur ? "playing" : ""}`}
            >
              <div className="card-thumb">
                {t.thumb ? <img src={t.thumb} alt="" /> : "♪"}
                <div className="card-play-overlay" onClick={() => onPlay(i)}>
                  {i === cur && playing ? "⏸" : "▶"}
                </div>
              </div>
              <div className="card-body">
                <div className="card-title" title={t.title}>
                  {t.title}
                </div>
                <div className="card-artist">{t.artist || "—"}</div>
              </div>
              <div className="card-actions">
                <button
                  className={`card-btn ${t.liked ? "liked" : ""}`}
                  onClick={() => onLike(i)}
                  title="Like"
                >
                  ♡
                </button>
                <button
                  className="card-btn"
                  onClick={() => onEdit(i)}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  className="card-btn delete"
                  onClick={() => onDelete(i)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
