import { useMemo, useState, useEffect } from "react";

export default function PlayerArea({ series }) {
  const [server, setServer] = useState("streamwish");

  /* DERIVE EPISODES */
  const episodes = useMemo(() => {
    if (!series?.info) return [];
    return Object.values(series.info);
  }, [series]);

  /* FIXED: AUTO SELECT FIRST EP AFTER LOAD */
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (episodes.length > 0) {
      setCurrent(episodes[0]);
    }
  }, [episodes]);

  if (!series) {
    return (
      <div className="text-gray-400 flex items-center justify-center h-full text-sm sm:text-base">
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

  /* FORMAT EPISODE TITLE */
  const getShortEpisodeTitle = (title) => {
    if (!title) return "";

    // S01E01 → Ep 1
    const match = title.match(/S\d+E(\d+)/i);
    if (match) {
      return `Ep ${parseInt(match[1], 10)}`;
    }

    // fallback
    const epMatch = title.match(/Ep\s*\d+/i);
    if (epMatch) return epMatch[0];

    return title.replace(/\.[^/.]+$/, "");
  };

  return (
    <div className="text-white px-2 pt-4 sm:px-4">
      {/* TITLE */}
      <h1 className="text-base sm:text-lg md:text-xl font-bold mb-3 text-left">
        {current
          ? `${series.series} — ${getShortEpisodeTitle(current.name)}`
          : series.series}
      </h1>

      {/* PLAYER */}
      <div className="mb-4 flex justify-center">
        <iframe
          key={`${current?.name}-${server}`}
          src={streamUrl()}
          className="w-full max-w-full sm:max-w-3xl md:max-w-4xl aspect-video rounded bg-black"
          allowFullScreen
        />
      </div>

      {/* SERVER SWITCH */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button
          onClick={() => setServer("streamwish")}
          className={`px-3 py-2 text-sm sm:text-base rounded ${
            server === "streamwish"
              ? "bg-blue-600"
              : "bg-[#0b1437] hover:bg-blue-500"
          }`}
        >
          StreamWish
        </button>

        <button
          onClick={() => setServer("streamtape")}
          className={`px-3 py-2 text-sm sm:text-base rounded ${
            server === "streamtape"
              ? "bg-indigo-600"
              : "bg-[#0b1437] hover:bg-indigo-500"
          }`}
        >
          StreamTape
        </button>
      </div>

      {/* EPISODES */}
      <div
        className="
        grid grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-6 
        gap-2 max-w-4xl mx-auto
      "
      >
        {episodes.map((ep, i) => (
          <button
            key={i}
            onClick={() => setCurrent(ep)}
            className={`p-2 rounded text-xs sm:text-sm transition ${
              current === ep
                ? "bg-blue-600"
                : "bg-[#0b1437] hover:bg-blue-500"
            }`}
          >
            {getShortEpisodeTitle(ep.name)}
          </button>
        ))}
      </div>
    </div>
  );
}