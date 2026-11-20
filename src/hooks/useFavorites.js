import { useState } from "react";

const STORAGE_KEY = "favorites";

function isSamePlace(a, b) {
  return a.lat === b.lat && a.lon === b.lon;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [],
  );

  function isFavorite(place) {
    return favorites.some((fav) => isSamePlace(fav, place));
  }

  function toggleFavorite(place) {
    const updated = isFavorite(place)
      ? favorites.filter((fav) => !isSamePlace(fav, place))
      : [
          ...favorites,
          {
            cityId: place.cityId,
            name: place.name ?? "Dropped pin",
            country: place.country,
            lat: place.lat,
            lon: place.lon,
          },
        ];
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return { favorites, isFavorite, toggleFavorite };
}
