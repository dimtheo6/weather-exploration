import { useEffect, useState } from "react";
import { fetchCurrentWeather, roundCoord } from "@/lib/openMeteo";

export function useCurrentWeather(location) {
  const key = location
    ? `${roundCoord(location.lat)},${roundCoord(location.lon)}`
    : null;
  const [result, setResult] = useState({ key: null, data: null, error: null });

  useEffect(() => {
    if (!location) return;
    let ignore = false;

    fetchCurrentWeather(location.lat, location.lon)
      .then((data) => {
        if (!ignore) setResult({ key, data, error: null });
      })
      .catch((err) => {
        if (!ignore) setResult({ key, data: null, error: err.message });
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only when the place (key) changes
  }, [key]);

  if (!key) return { status: "idle", data: null };
  if (result.key !== key) return { status: "loading", data: null };
  if (result.error) return { status: "error", data: null };
  return { status: "success", data: result.data };
}
