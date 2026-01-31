import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PlayerArea from "../components/PlayerArea";

export default function Home() {
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#050b1e] text-white overflow-hidden">
      {/* 🔹 MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="
          sm:hidden
          fixed top-7 right-3 z-50
          bg-[#050b1e] px-2 py-1 rounded
        "
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* 🔹 MAIN LAYOUT (ONE PLAYER AREA) */}
      <div className="min-h-screen sm:flex">
        {/* PLAYER AREA */}
        <div
          className={`
            flex-1 p-4 sm:p-6 overflow-y-auto transition
            ${sidebarOpen ? "pointer-events-none sm:pointer-events-auto" : ""}
          `}
        >
          <PlayerArea
            key={selectedSeries?.id || selectedSeries?.series}
            series={selectedSeries}
          />
        </div>

        {/* DESKTOP SIDEBAR */}
        <div className="hidden sm:block w-87.5 bg-[#060d25] border-l border-gray-800">
          <Sidebar onSelect={setSelectedSeries} />
        </div>
      </div>

      {/* 🔹 MOBILE SIDEBAR OVERLAY */}
      <div
        className={`
          fixed inset-0 z-40 sm:hidden
          transition-opacity duration-300
          ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* BACKDROP */}
        <div
          className="fixed inset-0 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />

        {/* SIDEBAR PANEL */}
        <div
          className={`
            fixed top-0 right-0 h-screen w-72
            bg-[#060d25]
            z-50
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <Sidebar
            onSelect={(series) => {
              setSelectedSeries(series);
              setSidebarOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
