import { useState, useRef, useEffect, useCallback } from "react";
import { type Track, uid, saveMeta } from "./types";
import { saveAudio, loadAudioUrl, deleteAudio } from "./db";
import Sidebar from "./components/Sidebar";
import Library from "./components/Library";
import Upload from "./components/Upload";
import PlayerBar from "./components/PlayerBar";
import EditModal from "./components/EditModal";
import FullscreenPlayer from "./components/FullscreenPlayer";

export default function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [ready, setReady] = useState(false); // true once IDB urls are loaded
  const [cur, setCur] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [fsOpen, setFsOpen] = useState(false);
  const [view, setView] = useState<"library" | "upload">("library");
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState({ cur: 0, dur: 0 });
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  // On mount: load metadata from localStorage, then hydrate audioUrl from IndexedDB
  useEffect(() => {
    const meta: Track[] = JSON.parse(localStorage.getItem("nw_tracks") || "[]");
    if (!meta.length) {
      setReady(true);
      return;
    }
    Promise.all(
      meta.map(async (t) => ({
        ...t,
        audioUrl: (await loadAudioUrl(t.id)) ?? undefined,
      })),
    ).then((hydrated) => {
      setTracks(hydrated);
      setReady(true);
    });
  }, []);

  const audio = useRef(new Audio());
  const S = useRef({ tracks, cur, shuffle, repeat });
  useEffect(() => {
    S.current = { tracks, cur, shuffle, repeat };
  });

  const playTrack = useCallback((i: number) => {
    const t = S.current.tracks[i];
    if (!t) return;
    if (!t.audioUrl) {
      console.warn("No audio for track", t.title);
      return;
    }
    audio.current.src = t.audioUrl;
    audio.current.play();
    setCur(i);
    setPlaying(true);
  }, []);

  const next = useCallback(() => {
    const { tracks: ts, cur: c, shuffle: sh } = S.current;
    if (!ts.length) return;
    playTrack(sh ? Math.floor(Math.random() * ts.length) : (c + 1) % ts.length);
  }, [playTrack]);

  const prev = useCallback(() => {
    const { tracks: ts, cur: c } = S.current;
    if (!ts.length) return;
    if (audio.current.currentTime > 3) {
      audio.current.currentTime = 0;
      return;
    }
    playTrack(c <= 0 ? ts.length - 1 : c - 1);
  }, [playTrack]);

  const togglePlay = useCallback(() => {
    const { tracks: ts, cur: c } = S.current;
    if (c < 0 && ts.length) {
      playTrack(0);
      return;
    }
    if (audio.current.paused) {
      audio.current.play();
      setPlaying(true);
    } else {
      audio.current.pause();
      setPlaying(false);
    }
  }, [playTrack]);

  useEffect(() => {
    const a = audio.current;
    const onTime = () =>
      setProgress({ cur: a.currentTime, dur: a.duration || 0 });
    const onEnded = () =>
      S.current.repeat ? ((a.currentTime = 0), a.play()) : next();
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
    };
  }, [next]);

  useEffect(() => {
    audio.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "Escape") setFsOpen(false);
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [togglePlay, next, prev]);

  const update = (ts: Track[]) => {
    setTracks(ts);
    saveMeta(ts);
  };
  const seek = (pct: number) => {
    if (audio.current.duration)
      audio.current.currentTime = pct * audio.current.duration;
  };
  const toggleLike = (i: number) =>
    update(tracks.map((t, idx) => (idx === i ? { ...t, liked: !t.liked } : t)));

  // Save file to IndexedDB, create blob URL for immediate playback
  const addTracks = async (files: FileList) => {
    const audioFiles = Array.from(files).filter((f) =>
      f.type.startsWith("audio/"),
    );
    const newTracks = await Promise.all(
      audioFiles.map(async (f) => {
        const id = uid();
        await saveAudio(id, f); // persist binary to IndexedDB
        const audioUrl = URL.createObjectURL(f); // blob URL for this session
        return {
          id,
          audioUrl,
          title: f.name.replace(/\.[^.]+$/, ""),
          artist: "",
          album: "",
          thumb: null,
          liked: false,
        } as Track;
      }),
    );
    update([...tracks, ...newTracks]);
  };

  const deleteTrack = (i: number) => {
    const t = tracks[i];
    deleteAudio(t.id); // remove binary from IndexedDB
    if (t.audioUrl) URL.revokeObjectURL(t.audioUrl); // free blob memory
    if (i === cur) {
      audio.current.pause();
      setPlaying(false);
      setCur(-1);
    } else if (i < cur) setCur((c) => c - 1);
    update(tracks.filter((_, idx) => idx !== i));
  };

  const track = tracks[cur] ?? null;

  if (!ready)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "var(--text-muted)",
        }}
      >
        Loading library…
      </div>
    );

  return (
    <div className="app">
      <Sidebar
        view={view}
        setView={setView}
        volume={volume}
        setVolume={setVolume}
      />

      <main className="main">
        {view === "library" ? (
          <Library
            tracks={tracks}
            cur={cur}
            playing={playing}
            onPlay={(i) =>
              i === cur && playing
                ? (audio.current.pause(), setPlaying(false))
                : playTrack(i)
            }
            onLike={toggleLike}
            onEdit={setEditingIdx}
            onDelete={deleteTrack}
            goUpload={() => setView("upload")}
          />
        ) : (
          <Upload onFiles={addTracks} />
        )}
      </main>

      <PlayerBar
        track={track}
        playing={playing}
        shuffle={shuffle}
        repeat={repeat}
        progress={progress}
        trackCount={tracks.length}
        onPlay={togglePlay}
        onNext={next}
        onPrev={prev}
        onSeek={seek}
        onShuffle={() => setShuffle((s) => !s)}
        onRepeat={() => setRepeat((r) => !r)}
        onLike={() => cur >= 0 && toggleLike(cur)}
        onExpand={() => setFsOpen(true)}
      />

      {editingIdx !== null && (
        <EditModal
          track={tracks[editingIdx]}
          onClose={() => setEditingIdx(null)}
          onSave={(data) => {
            update(
              tracks.map((t, i) => (i === editingIdx ? { ...t, ...data } : t)),
            );
            setEditingIdx(null);
          }}
        />
      )}

      {fsOpen && track && (
        <FullscreenPlayer
          track={track}
          playing={playing}
          shuffle={shuffle}
          repeat={repeat}
          progress={progress}
          volume={volume}
          onPlay={togglePlay}
          onNext={next}
          onPrev={prev}
          onSeek={seek}
          onShuffle={() => setShuffle((s) => !s)}
          onRepeat={() => setRepeat((r) => !r)}
          onLike={() => toggleLike(cur)}
          onClose={() => setFsOpen(false)}
          onVolume={setVolume}
        />
      )}
    </div>
  );
}
