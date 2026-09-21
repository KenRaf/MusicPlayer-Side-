# NightWave

NightWave is a private, browser-based music player built with React, TypeScript, and Vite. Uploaded audio stays on the device: audio data is stored in IndexedDB and track metadata in localStorage.

## Requirements

- Node.js 18 or later
- npm (installed with Node.js)

## Run the app

From the project folder, run:

```powershell
npm install
npm run dev
```

Open the local address printed by Vite—normally [http://localhost:5173](http://localhost:5173)—in your browser. Keep the terminal open while using NightWave. Press `Ctrl+C` to stop the server.

## Available commands

| Command                | Purpose                                                         |
| ---------------------- | --------------------------------------------------------------- |
| `npm run dev`          | Starts the development server.                                  |
| `npm run build`        | Type-checks and creates a production build in `dist/`.          |
| `npm run preview`      | Serves the production build locally. Run `npm run build` first. |
| `npm run format`       | Applies the project's code formatting.                          |
| `npm run format:check` | Checks that formatting is consistent.                           |

## Project structure

```text
src/
  components/  Reusable interface components
  App.tsx      Application state and playback coordination
  db.ts        IndexedDB audio storage helpers
  style.css    Application styles
  types.ts     Shared types and metadata helpers
```

## Features

- Drag-and-drop audio uploads
- Persistent, browser-local music library
- Search by title, artist, or album
- Playback controls, seeking, shuffle, repeat, and volume
- Editable metadata and cover artwork
- Likes and fullscreen playback

## Data note

The music library is saved only in the browser where it is added. Clearing that browser's site data or using a different browser removes access to its library.
