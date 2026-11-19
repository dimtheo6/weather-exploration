"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window`, so the map must only render in the browser.
// `ssr: false` is only allowed inside a Client Component in Next 16.
const WeatherMap = dynamic(() => import("./WeatherMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-500">
      Loading map…
    </div>
  ),
});

export default function MapLoader(props) {
  return <WeatherMap {...props} />;
}
