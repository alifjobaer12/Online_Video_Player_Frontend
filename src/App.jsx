import { useEffect, useState } from "react";

export default function App() {
  const [episodes, setEpisodes] = useState([]);
  const [current, setCurrent] = useState(null);
  const [server, setServer] = useState("streamwish");
  const [series, setSeries] = useState("");

  /* FETCH EPISODES */
  useEffect(() => {
    fetch("http://online-video-player-frontend-171j.vercel.app/api/episodes")
      .then((res) => res.json())
      .then((data) => {
        const eps = data.episodes || [];
        setSeries(data.series);
        setEpisodes(eps);
        setCurrent(eps[0] || null);
      })
      .catch((err) => console.error("API error:", err));
  }, []);

  /* BUILD STREAM URL */
  const streamUrl = () => {
    if (!current) return "";

    // support BOTH backend formats (safe)
    const streamwish = current.streamwish || current.servers?.streamwish;
    const streamtape = current.streamtape || current.servers?.streamtape;

    if (server === "streamwish" && streamwish) {
      return `https://streamwish.to/e/${streamwish}`;
    }
    if (server === "streamtape" && streamtape) {
      return `https://streamtape.com/e/${streamtape}`;
    }
    return "";
  };

  /* EXTRACT "Episode 01" */
  const getShortEpisodeTitle = (title) => {
    if (!title) return "";
    const match = title.match(/Episode\s*\d+/i);
    return match ? match[0] : title;
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen p-4">
      {/* TITLE */}
      <h1 className="text-xl font-bold mb-3">
        {current
          ? `${series} — ${getShortEpisodeTitle(current.title)}`
          : series || "Select an Episode"}
      </h1>

      {/* PLAYER */}
      <div className="mb-4 flex justify-center">
        <iframe
          key={`${current?.title}-${server}`} // force reload
          src={streamUrl()}
          className="w-full max-w-4xl aspect-video rounded bg-black"
          allowFullScreen
        />
      </div>

      {/* SERVER BUTTONS */}
      <div className="flex gap-3 mb-4 justify-center">
        <button
          onClick={() => setServer("streamwish")}
          className={`px-4 py-2 rounded cursor-pointer
            ${
              server === "streamwish"
                ? "bg-blue-600"
                : "bg-slate-800 hover:bg-slate-700"
            }
          `}
        >
          StreamWish
        </button>

        <button
          onClick={() => setServer("streamtape")}
          className={`px-4 py-2 rounded cursor-pointer
            ${
              server === "streamtape"
                ? "bg-indigo-600"
                : "bg-slate-800 hover:bg-slate-700"
            }
          `}
        >
          StreamTape
        </button>
      </div>

      {/* EPISODE LIST */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-w-4xl mx-auto">
        {episodes.map((ep, i) => {
          const active = current === ep;
          return (
            <button
              key={i}
              onClick={() => setCurrent(ep)}
              className={`p-2 rounded text-sm cursor-pointer transition
                ${active ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"}
              `}
            >
              {getShortEpisodeTitle(ep.title)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
