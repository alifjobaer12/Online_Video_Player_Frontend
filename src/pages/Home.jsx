import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PlayerArea from "../components/PlayerArea";

export default function Home() {
  const [selectedSeries, setSelectedSeries] = useState(null);

  return (
    <div className="flex min-h-screen bg-[#050b1e] text-white">
      <div className="flex-1 p-6">
        <PlayerArea
  key={selectedSeries?.id || selectedSeries?.series}
  series={selectedSeries}
/>
      </div>

      <div className="w-87.5 bg-[#060d25] border-l border-gray-800">
        <Sidebar onSelect={setSelectedSeries} />
      </div>
    </div>
  );
}
