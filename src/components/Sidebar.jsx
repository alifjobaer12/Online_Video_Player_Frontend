import { useEffect, useState } from "react";

export default function Sidebar({ onSelect }) {
  const [search, setSearch] = useState("");
  const [series, setSeries] = useState([]);

  useEffect(() => {
    fetch(
      search
        ? `${import.meta.env.VITE_API_URL}/api/series/search?q=${search}`
        : `${import.meta.env.VITE_API_URL}/api/series`
    )
      .then(res => res.json())
      .then(setSeries);
  }, [search]);

  return (
    <div className="p-4 space-y-4">
      <input
        className="w-full p-3 rounded bg-[#0b1437]"
        placeholder="Search series..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="space-y-3 overflow-y-auto h-[calc(100vh-90px)]">
        {series.map(s => (
          <div
            key={s.id}
            onClick={() => onSelect(s)}
            className="bg-[#0b1437] p-3 rounded cursor-pointer hover:bg-blue-600"
          >
            <h3>{s.series}</h3>
            <p className="text-xs text-gray-400">
              Episodes: {Object.keys(s.info).length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
