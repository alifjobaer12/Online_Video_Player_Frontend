import { useEffect, useState } from "react";

export default function Sidebar({ onSelect }) {
  const [search, setSearch] = useState("");
  const [series, setSeries] = useState([]);

  useEffect(() => {
    fetch(
      search
        ? `${import.meta.env.VITE_API_URL}/api/series/search?q=${search}`
        : `${import.meta.env.VITE_API_URL}/api/series`,
    )
      .then((res) => res.json())
      .then(setSeries);
  }, [search]);

  return (
    <div className="p-3 pt-7 sm:p-4 h-full">
      {/* SEARCH */}
      <input
        className="w-57 sm:w-full p-2 sm:p-3 rounded bg-[#0b1437] text-sm sm:text-base"
        placeholder="Search series..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* SERIES LIST */}
      <div
        className="
        mt-3 space-y-2 
        overflow-y-auto 
        h-[calc(100vh-140px)]
        sm:h-[calc(100vh-90px)]
      "
      >
        {series.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelect(s)}
            className="
              bg-[#0b1437] 
              p-3 rounded 
              cursor-pointer 
              hover:bg-blue-600 
              transition
            "
          >
            <h3 className="text-sm sm:text-base font-semibold">{s.series}</h3>
            <p className="text-xs text-gray-400">
              Episodes: {Object.keys(s.info).length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
