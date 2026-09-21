import { fmt, type Track } from "../types";
import Marquee from "./Marquee";

type Props = {
  track: Track | null;
  playing: boolean;
  shuffle: boolean;
  repeat: boolean;
  progress: { cur: number; dur: number };
  trackCount: number;
  onPlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (pct: number) => void;
  onShuffle: () => void;
  onRepeat: () => void;
  onLike: () => void;
  onExpand: () => void;
};

export default function PlayerBar({
  track,
  playing,
  shuffle,
  repeat,
  progress,
  trackCount,
  onPlay,
  onNext,
  onPrev,
  onSeek,
  onShuffle,
  onRepeat,
  onLike,
  onExpand,
}: Props) {
  const pct = progress.dur ? (progress.cur / progress.dur) * 100 : 0;

  return (
    <footer className="player-bar">
      <div className="player-left">
        <div
          className="player-thumb"
          onClick={onExpand}
          style={{ cursor: "pointer" }}
        >
          {track?.thumb ? <img src={track.thumb} alt="" /> : "♪"}
        </div>
        <div className="player-info">
          {track ? (
            <Marquee
              className="player-title"
              text={track.title}
              style={{ cursor: "pointer" }}
              onClick={onExpand}
            />
          ) : (
            <div
              className="player-title"
              style={{ cursor: "pointer" }}
              onClick={onExpand}
            >
              No track selected
            </div>
          )}
          <div className="player-artist">{track?.artist || "—"}</div>
        </div>
        <button
          className={`icon-btn heart ${track?.liked ? "liked" : ""}`}
          onClick={onLike}
        >
          {track?.liked ? "♥" : "♡"}
        </button>
        <button
          className="icon-btn"
          id="btn-expand"
          onClick={onExpand}
          title="Fullscreen player"
        >
          ⤢
        </button>
      </div>

      <div className="player-center">
        <div className="transport">
          <button
            className={`icon-btn ${shuffle ? "active" : ""}`}
            onClick={onShuffle}
            title="Shuffle"
          >
            ⇄
          </button>
          <button className="icon-btn" onClick={onPrev} title="Previous">
            ⏮
          </button>
          <button className="icon-btn play-btn" onClick={onPlay}>
            {playing ? "⏸" : "▶"}
          </button>
          <button className="icon-btn" onClick={onNext} title="Next">
            ⏭
          </button>
          <button
            className={`icon-btn ${repeat ? "active" : ""}`}
            onClick={onRepeat}
            title="Repeat"
          >
            ↻
          </button>
        </div>
        <div className="seek-row">
          <span className="time">{fmt(progress.cur)}</span>
          <div
            className="seek-bar"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              onSeek((e.clientX - r.left) / r.width);
            }}
          >
            <div
              className="seek-fill"
              style={{
                width: pct.toFixed(1) + "%",
                transition: "width 0.3s linear",
              }}
            />
          </div>
          <span className="time">{fmt(progress.dur)}</span>
        </div>
      </div>

      <div className="player-right">
        <span className="muted small">
          {trackCount
            ? `${trackCount} track${trackCount !== 1 ? "s" : ""}`
            : "0 tracks"}
        </span>
      </div>
    </footer>
  );
}
