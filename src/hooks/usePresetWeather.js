"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchCurrentWeatherBatch } from "@/lib/openMeteo";

/**
 * Loads current weather for a fixed list of cities (one batched request)
 * and returns the cities with a `weather` field attached.
 * `cities` must be a stable reference (e.g. a module-level constant).
 */
export function usePresetWeather(cities) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false; // avoid setting state after unmount / re-run

    fetchCurrentWeatherBatch(cities)
      .then((data) => {
        if (!ignore) setState({ status: "success", data, error: null });
      })
      .catch((error) => {
        if (!ignore) setState({ status: "error", data: null, error: error.message });
      });

    return () => {
      ignore = true;
    };
  }, [cities, attempt]);

  const citiesWithWeather = useMemo(
    () => cities.map((city, i) => ({ ...city, weather: state.data?.[i] ?? null })),
    [cities, state.data]
  );

  function retry() {
    setState((prev) => ({ ...prev, status: "loading", error: null }));
    setAttempt((n) => n + 1);
  }

  return { status: state.status, error: state.error, cities: citiesWithWeather, retry };
}
