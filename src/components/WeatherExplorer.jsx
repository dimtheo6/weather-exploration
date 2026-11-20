"use client";

import { useMemo, useState } from "react";
import { usePresetWeather } from "@/hooks/usePresetWeather";
import { PRESET_CITIES } from "@/lib/presetCities";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";
import SearchBar from "./SearchBar";
import LocateButton from "@/components/LocateButton";
import { useFavorites } from "@/hooks/useFavorites";
import Favorites from "./Favorites";
import WeatherMap from "./WeatherMap";
import SelectedLocationCard from "./SelectedLocationCard";

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
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  // Favorites that aren't preset cities (presets already have a pill on the map)
  const extraFavorites = useMemo(
    () =>
      favorites
        .filter((fav) => !PRESET_CITIES.some((city) => city.id === fav.cityId))
        .map((fav) => ({ ...fav, id: `fav-${fav.lat},${fav.lon}` })),
    [favorites],
  );
  const favoriteWeather = usePresetWeather(extraFavorites); // ONE request for all of them
  const mapCities = [...cities, ...favoriteWeather.cities];

  const selectedCity = selectedLocation?.cityId
    ? mapCities.find((city) => city.id === selectedLocation.cityId)
    : null;

  // Pass null for preset cities → the hook does nothing
  const fetched = useCurrentWeather(selectedCity ? null : selectedLocation);

  const weather = selectedCity?.weather ?? fetched.data;

  return (
    <main className="relative h-dvh w-full">
      <WeatherMap
        cities={mapCities}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-1000 sm:right-auto sm:w-90 space-y-2">
        <SearchBar onSelect={setSelectedLocation} />
        <Favorites favorites={favorites} onSelect={setSelectedLocation} />
      </div>

      {/* Current Location */}
      <div className="absolute right-2 bottom-24 z-1000">
        <LocateButton onLocate={setSelectedLocation} />
      </div>

      {status !== "success" && (
        <div className="pointer-events-auto absolute top-4 left-1/2 z-1000 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm text-neutral-700 shadow-md">
          {status === "loading" && "Loading weather…"}
          {status === "error" && (
            <>
              Couldn&apos;t load weather data.{" "}
              <button
                onClick={retry}
                className="font-semibold text-blue-600 underline"
              >
                Try again
              </button>
            </>
          )}
        </div>
      )}

      {selectedLocation && (
        <SelectedLocationCard
          location={selectedLocation}
          weather={weather}
          status={selectedCity ? "success" : fetched.status}
          onClose={() => setSelectedLocation(null)}
          isFavorite={isFavorite(selectedLocation)}
          onToggleFavorite={() => toggleFavorite(selectedLocation)}
        />
      )}
    </main>
  );
}

