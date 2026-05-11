import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar({ onSelect }) {
	const [search, setSearch] = useState("");
	const [series, setSeries] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const query = search.trim();

	useEffect(() => {
		const controller = new AbortController();

		async function loadSeries() {
			setLoading(true);
			setError("");

			try {
				const params = new URLSearchParams({ page: String(page) });

				if (query) {
					params.set("q", query);
				}

				const endpoint = query
					? `${import.meta.env.VITE_API_URL}/api/series/search?${params.toString()}`
					: `${import.meta.env.VITE_API_URL}/api/series?${params.toString()}`;

				const res = await fetch(endpoint, {
					signal: controller.signal,
				});
				const data = await res.json();

				const items = Array.isArray(data) ? data : data.series || [];

				setSeries(items);
				setTotalPages(Math.max(1, data.totalPages || 1));
			} catch (err) {
				if (err.name !== "AbortError") {
					setError("Failed to load series.");
					setSeries([]);
					setTotalPages(1);
				}
			} finally {
				setLoading(false);
			}
		}

		loadSeries();

		return () => controller.abort();
	}, [query, page]);

	const handleSearchChange = (event) => {
		setSearch(event.target.value);
		setPage(1);
	};

	return (
		<div className="relative flex h-full flex-col gap-2 p-2 pt-4 sm:p-3">
			{/* SEARCH */}
			<input
				className="w-57 sm:w-full p-2 sm:p-3 rounded bg-[#0b1437] text-sm sm:text-base"
				placeholder="Search series..."
				value={search}
				onChange={handleSearchChange}
			/>

			{/* SERIES LIST */}
			<div
				className="
        relative flex-1 min-h-0 space-y-2 
        overflow-y-auto 
        pb-1
      "
			>
				{loading && (
					<div className="absolute inset-0 z-10 flex items-center justify-center rounded bg-[#060d25]/80 backdrop-blur-sm">
						<div className="flex flex-col items-center gap-3 rounded border border-white/10 bg-[#0b1437] px-4 py-5 shadow-lg">
							<div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-blue-500" />
							<p className="text-sm text-gray-200">
								Loading series...
							</p>
						</div>
					</div>
				)}

				{error && <p className="text-sm text-red-400 px-1">{error}</p>}

				{!loading && !error && series.length === 0 && (
					<p className="text-sm text-gray-400 px-1">
						No series found.
					</p>
				)}

				{series.map((s) => (
					<div
						key={s._id || s.id || s.series}
						onClick={() => onSelect(s)}
						className="
              bg-[#0b1437] 
              p-3 rounded 
              cursor-pointer 
              hover:bg-blue-600 
              transition
            "
					>
						<h3 className="text-sm sm:text-base font-semibold">
							{s.series}
						</h3>
						<p className="text-xs text-gray-400">
							Episodes: {Object.keys(s.info || {}).length}
						</p>
					</div>
				))}
			</div>

			<div className="flex items-center justify-between gap-2 text-xs sm:text-sm mb-30 sm:mb-0 px-2 py-1">
				<button
					type="button"
					disabled={loading || page <= 1}
					onClick={() =>
						setPage((current) => Math.max(current - 1, 1))
					}
					className="rounded bg-[#0b1437] px-3 py-2 text-base leading-none transition cursor-pointer active:bg-blue-700 active:scale-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:active:bg-[#0b1437]"
				>
					<ChevronLeft />
				</button>

				<span className="text-gray-400">
					Page {page} of {totalPages}
				</span>

				<button
					type="button"
					disabled={loading || page >= totalPages}
					onClick={() =>
						setPage((current) => Math.min(current + 1, totalPages))
					}
					className="rounded bg-[#0b1437] px-3 py-2 text-base leading-none transition cursor-pointer active:bg-blue-700 active:scale-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:active:bg-[#0b1437]"
				>
					<ChevronRight />
				</button>
			</div>
		</div>
	);
}
