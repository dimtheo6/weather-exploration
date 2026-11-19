import { useEffect, useState } from "react";
import { searchPlaces } from "@/lib/openMeteo";

export function usePlaceSearch(query) {
  const trimmed = query.trim();
  const key = trimmed.length >= 2 ? trimmed.toLowerCase() : null;
  const [result, setResult] = useState({ key: null, data: [], error: null });

  useEffect(() => {
    if (!key) return;
    let ignore = false;

    // Wait until the user stops typing for 300ms
    const timer = setTimeout(() => {
      searchPlaces(key)
        .then((data) => !ignore && setResult({ key, data, error: null }))
        .catch((err) => !ignore && setResult({ key, data: [], error: err.message }));
    }, 300);

    // Runs when `key` changes (user typed again) or the component unmounts
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [key]);

  if (!key) return { status: "idle", results: [] };
  if (result.key !== key) return { status: "loading", results: [] };
  if (result.error) return { status: "error", results: [] };
  return { status: "success", results: result.data };
}
