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
        <p className="rounded-lg bg-white px-3 py-2 text-sm text-red-600 shadow-md">{error}</p>
      )}
      <button
        onClick={handleClick}
        aria-label="Show weather at my location"
        className="h-10 w-10 rounded-lg bg-white text-xl text-neutral-800 shadow-md hover:bg-neutral-100"
      >
        ◎
      </button>
    </div>
  );
}
