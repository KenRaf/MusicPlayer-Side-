type Props = {
  view: "library" | "upload";
  setView: (v: "library" | "upload") => void;
  volume: number;
  setVolume: (v: number) => void;
};

export default function Sidebar({ view, setView, volume, setVolume }: Props) {
  return (
    <aside className="sidebar">
      <div className="logo">🎵 NightWave</div>
      <nav>
        {(["library", "upload"] as const).map((v) => (
          <a
            key={v}
            href="#"
            className={`nav-item ${view === v ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setView(v);
            }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </a>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="vol-row">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
          <span>{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </aside>
  );
}
