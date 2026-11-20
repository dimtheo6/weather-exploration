"use client";

import dynamic from "next/dynamic";

// The app uses browser-only APIs (Leaflet, geolocation, localStorage),
// so it is rendered in the browser only, never on the server.
const WeatherExplorer = dynamic(() => import("./WeatherExplorer"), {
  ssr: false,
  loading: () => <div className="h-dvh bg-neutral-100" />,
});

export default function ExplorerLoader() {
  return <WeatherExplorer />;
}
