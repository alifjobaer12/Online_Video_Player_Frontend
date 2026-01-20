import { useMemo, useState } from "react";

export default function PlayerArea({ series }) {
  const [server, setServer] = useState("streamwish");

  /* DERIVE EPISODES */
  const episodes = useMemo(() => {
    if (!series?.info) return [];
    return Object.values(series.info);
  }, [series]);

  /* FIRST EPISODE AUTO-SELECTED */
  const [current, setCurrent] = useState(() => episodes[0] || null);

  if (!series) {
    return (
      <div className="text-gray-400 flex items-center justify-center h-full">
        Select a series
      </div>
    );
  }

  /* STREAM URL */
  const streamUrl = () => {
    if (!current) return "";

    if (server === "streamwish" && current.streamwish_res) {
      return `${import.meta.env.VITE_SERVER1_URL}/${current.streamwish_res}`;
    }

    if (server === "streamtape" && current.streamtape_res) {
      return `${import.meta.env.VITE_SERVER2_URL}/${current.streamtape_res}`;
    }

    return "";
  };

  const getShortEpisodeTitle = (title) => {
  if (!title) return "";

  // Match S01E02 / s01e02
  let match = title.match(/S\d{2}E\d{2}/i);
  if (match) {
    return match[0].toUpperCase().replace("S", "Season ").replace("E", " Episode ");
  }

  // Match Episode 02
  match = title.match(/Episode\s*\d+/i);
  if (match) return match[0];

  // Fallback: remove extension
  return title.replace(/\.[^/.]+$/, "");
};


  return (
    <div className="text-white">
      {/* TITLE */}
      <h1 className="text-xl font-bold mb-3">
        {current
          ? `${series.series} — ${getShortEpisodeTitle(current.name)}`
          : series.series}
      </h1>

      {/* PLAYER */}
      <div className="mb-4 flex justify-center">
        <iframe
          key={`${current?.name}-${server}`}
          src={streamUrl()}
          className="w-full max-w-4xl aspect-video rounded bg-black"
          allowFullScreen
        />
      </div>

      {/* SERVER SWITCH */}
      <div className="flex gap-3 mb-4 justify-center">
        <button
          onClick={() => setServer("streamwish")}
          className={`px-4 py-2 rounded ${
            server === "streamwish"
              ? "bg-blue-600"
              : "bg-[#0b1437] hover:bg-blue-500"
          }`}
        >
          StreamWish
        </button>

        <button
          onClick={() => setServer("streamtape")}
          className={`px-4 py-2 rounded ${
            server === "streamtape"
              ? "bg-indigo-600"
              : "bg-[#0b1437] hover:bg-indigo-500"
          }`}
        >
          StreamTape
        </button>
      </div>

      {/* EPISODES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-w-4xl mx-auto">
        {episodes.map((ep, i) => (
          <button
            key={i}
            onClick={() => setCurrent(ep)}
            className={`p-2 rounded text-sm transition ${
              current === ep ? "bg-blue-600" : "bg-[#0b1437] hover:bg-blue-500"
            }`}
          >
            Episode {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
