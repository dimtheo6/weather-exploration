"use client";

import { useState } from "react";
import { usePlaceSearch } from "@/hooks/usePlaceSearch";

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { status, results } = usePlaceSearch(query);

  function handleSelect(place) {
    onSelect({
      name: place.name,
      country: place.country,
      lat: place.lat,
      lon: place.lon,
      flyTo: true, // tells the map to fly there
    });
    setQuery(place.name);
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white text-neutral-900 shadow-lg">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        placeholder="Search a city…"
        className="h-12 w-full bg-transparent px-4 outline-none"
      />

      {isOpen && status !== "idle" && (
        <ul className="border-t border-neutral-100 py-1">
          {status === "loading" && (
            <li className="px-4 py-2 text-sm text-neutral-500">Searching…</li>
          )}
          {status === "error" && (
            <li className="px-4 py-2 text-sm text-red-600">Search failed. Try again.</li>
          )}
          {status === "success" && results.length === 0 && (
            <li className="px-4 py-2 text-sm text-neutral-500">No places found</li>
          )}
          {results.map((place) => (
            <li key={place.id}>
              <button
                onClick={() => handleSelect(place)}
                className="w-full px-4 py-2 text-left hover:bg-neutral-100"
              >
                <span className="font-medium">{place.name}</span>
                <span className="block text-sm text-neutral-500">
                  {[place.region, place.country].filter(Boolean).join(", ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
