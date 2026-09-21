export interface Track {
  id: string;
  audioUrl?: string;
  title: string;
  artist: string;
  album: string;
  thumb: string | null;
  liked: boolean;
}

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

export const fmt = (s: number) =>
  !s || isNaN(s)
    ? "0:00"
    : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export const saveMeta = (ts: Track[]) =>
  localStorage.setItem(
    "nw_tracks",
    JSON.stringify(ts.map(({ audioUrl: _a, ...m }) => m)),
  );
