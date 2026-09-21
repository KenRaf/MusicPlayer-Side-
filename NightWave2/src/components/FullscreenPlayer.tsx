import { fmt, type Track } from "../types";
import Marquee from "./Marquee";

type Props = {
  track: Track;
  playing: boolean;
  shuffle: boolean;
  repeat: boolean;
  progress: { cur: number; dur: number };
  volume: number;
  onPlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (pct: number) => void;
  onShuffle: () => void;
  onRepeat: () => void;
  onLike: () => void;
  onClose: () => void;
  onVolume: (v: number) => void;
};

export default function FullscreenPlayer({
  track,
  playing,
  shuffle,
  repeat,
  progress,
  volume,
  onPlay,
  onNext,
  onPrev,
  onSeek,
  onShuffle,
  onRepeat,
  onLike,
  onClose,
  onVolume,
}: Props) {
  const pct = progress.dur ? (progress.cur / progress.dur) * 100 : 0;
  const bgStyle = track.thumb
    ? { background: `url('${track.thumb}') center/cover no-repeat` }
    : { background: "linear-gradient(135deg,#1d4ed8,#7c3aed)" };

  return (
    <div className="fs-player">
      <div className="fs-bg" style={bgStyle} />
      <div className="fs-overlay" />
      <div className="fs-content">
        <button className="fs-close" onClick={onClose} title="Close (Esc)">
          ⌄
        </button>

        <div className="fs-art">
          {track.thumb ? (
            <img
              src={track.thumb}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 20,
              }}
            />
          ) : (
            <span style={{ fontSize: 80 }}>♪</span>
          )}
        </div>

        <div className="fs-info">
          <Marquee className="fs-title" text={track.title} />
          <div className="fs-artist">{track.artist || "—"}</div>
          <div className="fs-album">{track.album}</div>
        </div>

        <div className="fs-seek-row">
          <span className="fs-time">{fmt(progress.cur)}</span>
          <div
            className="fs-seek"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              onSeek((e.clientX - r.left) / r.width);
            }}
          >
            <div
              className="fs-fill"
              style={{
                width: pct.toFixed(1) + "%",
                transition: "width 0.3s linear",
              }}
            />
          </div>
          <span className="fs-time">{fmt(progress.dur)}</span>
        </div>

        <div className="fs-transport">
          <button
            className={`fs-icon-btn ${shuffle ? "active" : ""}`}
            onClick={onShuffle}
            title="Shuffle"
          >
            ⇄
          </button>
          <button className="fs-icon-btn" onClick={onPrev} title="Previous">
            ⏮
          </button>
          <button className="fs-play-btn" onClick={onPlay}>
            {playing ? "⏸" : "▶"}
          </button>
          <button className="fs-icon-btn" onClick={onNext} title="Next">
            ⏭
          </button>
          <button
            className={`fs-icon-btn ${repeat ? "active" : ""}`}
            onClick={onRepeat}
            title="Repeat"
          >
            ↻
          </button>
        </div>

        <div className="fs-bottom">
          <button
            className={`fs-icon-btn ${track.liked ? "liked" : ""}`}
            onClick={onLike}
            title="Like"
          >
            {track.liked ? "♥" : "♡"}
          </button>
          <div className="fs-vol-row">
            <span className="fs-time">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
