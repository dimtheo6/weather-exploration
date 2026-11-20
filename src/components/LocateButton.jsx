"use client";

import { useState } from "react";

export default function LocateButton({ onLocate }) {
  const [error, setError] = useState(null);

  function handleClick() {
    // Built into the browser: asks the user for permission, then returns their coordinates
    navigator.geolocation.getCurrentPosition(
      // Success → select this place (map flies there, card loads the weather)
      (position) => {
        setError(null);
        onLocate({
          name: "Your location",
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          flyTo: true,
        });
      },
      // Failure → e.g. the user blocked location access
      () => setError("Couldn't get your location."),
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <p className="rounded-lg bg-white px-3 py-2 text-sm text-red-600 shadow-md">
          {error}
        </p>
      )}
      <div className="group relative">
        <p className="pointer-events-none absolute top-1/2 right-12 -translate-y-1/2  rounded-md bg-neutral-900 px-2 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">Show Your Location</p>
        <button
          onClick={handleClick}
          aria-label="Show weather at my location"
          className="cursor-pointer h-10 w-10 rounded-lg bg-white text-xl text-neutral-800 shadow-md hover:bg-neutral-100"
        >
          ◎
        </button>
      </div>
    </div>
  );
}
