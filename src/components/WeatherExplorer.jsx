"use client";

import { useState } from "react";

import MapLoader from "@/components/MapLoader";
import { usePresetWeather } from "@/hooks/usePresetWeather";
import { PRESET_CITIES } from "@/lib/presetCities";
import { getWeatherInfo } from "@/lib/weatherCodes";

/**
 * Owns the app state (what's selected, preset weather) so that the map,
 * and later the search bar / detail panel / saved places, can share it.
 *
 * A selected location looks like:
 *   { name: string | null, lat, lon, country?, cityId?, flyTo? }
 * `name` is null for arbitrary map clicks (Open-Meteo has no reverse geocoding).
 */
export default function WeatherExplorer() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { status, cities, retry } = usePresetWeather(PRESET_CITIES);

  const selectedCity = selectedLocation?.cityId
    ? cities.find((city) => city.id === selectedLocation.cityId)
    : null;

  return (
    <main className="relative h-dvh w-full">
      <MapLoader
        cities={cities}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      {status !== "success" && (
        <div className="pointer-events-auto absolute top-4 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm text-neutral-700 shadow-md">
          {status === "loading" && "Loading weather…"}
          {status === "error" && (
            <>
              Couldn&apos;t load weather data.{" "}
              <button onClick={retry} className="font-semibold text-blue-600 underline">
                Try again
              </button>
            </>
          )}
        </div>
      )}

      {selectedLocation && (
        <SelectedLocationCard
          location={selectedLocation}
          weather={selectedCity?.weather ?? null}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </main>
  );
}

function SelectedLocationCard({ location, weather, onClose }) {
  const coords = `${location.lat.toFixed(2)}°, ${location.lon.toFixed(2)}°`;
  const info = weather ? getWeatherInfo(weather.weatherCode, weather.isDay) : null;

  return (
    <section
      aria-label="Selected location"
      className="absolute right-4 bottom-6 left-4 z-1000 rounded-xl bg-white p-4 text-neutral-900 shadow-lg sm:right-auto sm:w-80"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{location.name ?? "Selected point"}</h2>
          <p className="text-sm text-neutral-500">
            {location.country ? `${location.country} · ${coords}` : coords}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-md px-2 text-xl leading-none text-neutral-500 hover:bg-neutral-100"
        >
          ×
        </button>
      </div>

      {weather && (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-4xl" aria-hidden="true">
            {info.icon}
          </span>
          <div>
            <p className="text-2xl font-semibold">{Math.round(weather.temperature)}°C</p>
            <p className="text-sm text-neutral-600">
              {info.label} · Wind {Math.round(weather.windSpeed)} km/h
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
