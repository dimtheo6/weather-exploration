import { getWeatherInfo } from "@/lib/weatherCodes";

export default function SelectedLocationCard({
  location,
  weather,
  status,
  onClose,
  isFavorite,
  onToggleFavorite,
}) {
  const coords = `${location.lat.toFixed(2)}°, ${location.lon.toFixed(2)}°`;
  const info = weather
    ? getWeatherInfo(weather.weatherCode, weather.isDay)
    : null;

  return (
    <section
      aria-label="Selected location"
      className="absolute right-16 bottom-6 left-4 z-1000 rounded-xl bg-white p-4 text-neutral-900 shadow-lg sm:right-auto sm:w-80"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">
            {location.name ?? "Dropped Pin"}
          </h2>
          <p className="text-sm text-neutral-500">
            {location.country ? `${location.country} · ${coords}` : coords}
          </p>
        </div>
        <button
          onClick={onToggleFavorite}
          aria-label={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          className="cursor-pointer ml-auto rounded-md px-2 text-xl leading-none text-amber-500 hover:bg-neutral-100"
        >
          {isFavorite ? "★" : "☆"}
        </button>
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
          <span className="text-5xl" aria-hidden="true">
            {info.icon}
          </span>
          <div>
            <p className="text-4xl font-semibold">
              {Math.round(weather.temperature)}°C
            </p>
            <p className="text-sm text-neutral-600">
              {info.label} · Wind {Math.round(weather.windSpeed)} km/h
            </p>
          </div>
        </div>
      )}

      {status === "loading" && (
        <p className="mt-3 text-sm text-neutral-500">Loading weather…</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-sm text-red-600">
          Couldn&apos;t load weather for this place.
        </p>
      )}
    </section>
  );
}
