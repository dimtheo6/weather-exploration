const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Open-Meteo data updates roughly every 15 minutes, so there is no point
// asking for the same thing more often than that.
const CACHE_TTL_MS = 15 * 60 * 1000;

// key -> { expires, promise }. Storing the promise (not just the result)
// also de-duplicates requests that are still in flight.
const cache = new Map();

function cached(key, fetcher) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.promise;

  const promise = fetcher().catch((error) => {
    cache.delete(key); // don't cache failures, so a retry hits the network
    throw error;
  });
  cache.set(key, { expires: Date.now() + CACHE_TTL_MS, promise });
  return promise;
}

// ~1 km precision is plenty for weather and makes cache hits more likely.
export function roundCoord(value) {
  return Math.round(value * 100) / 100;
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo request failed (${response.status})`);
  }
  return response.json();
}

function toCurrentWeather(current) {
  return {
    temperature: current.temperature_2m,
    weatherCode: current.weather_code,
    isDay: current.is_day === 1,
    windSpeed: current.wind_speed_10m,
    time: current.time,
  };
}

/**
 * Current weather for many locations in a single request.
 * Open-Meteo accepts comma-separated coordinates and returns an array
 * (or a single object when only one location is requested).
 * Results are returned in the same order as `locations`.
 */
export function fetchCurrentWeatherBatch(locations) {
  const params = new URLSearchParams({
    latitude: locations.map((l) => roundCoord(l.lat)).join(","),
    longitude: locations.map((l) => roundCoord(l.lon)).join(","),
    current: "temperature_2m,weather_code,is_day,wind_speed_10m",
  });

  return cached(`current:${params}`, async () => {
    const data = await getJson(`${FORECAST_URL}?${params}`);
    const results = Array.isArray(data) ? data : [data];
    return results.map((result) => toCurrentWeather(result.current));
  });
}

// Current weather for one place: a batch of one.
export function fetchCurrentWeather(lat, lon) {
  return fetchCurrentWeatherBatch([{ lat, lon }]).then((results) => results[0]);
}

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

export function searchPlaces(query) {
  const name = query.trim();
  const params = new URLSearchParams({ name, count: 5, language: "en", format: "json" });

  return cached(`search:${name.toLowerCase()}`, async () => {
    const data = await getJson(`${GEOCODING_URL}?${params}`);
    // When nothing matches, the API leaves out `results` entirely
    return (data.results ?? []).map((place) => ({
      id: place.id,
      name: place.name,
      region: place.admin1 ?? null,
      country: place.country ?? null,
      countryCode: place.country_code ?? null,
      lat: place.latitude,
      lon: place.longitude,
    }));
  });
}