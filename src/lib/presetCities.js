// Cities shown on the map as a "TV forecast" overview.
// `minZoom` hides cities in crowded regions until the user zooms in,
// so markers don't overlap at the world view.
export const PRESET_CITIES = [
  // Europe
  { id: "london", name: "London", country: "United Kingdom", lat: 51.51, lon: -0.13 },
  { id: "reykjavik", name: "Reykjavik", country: "Iceland", lat: 64.15, lon: -21.94 },
  { id: "madrid", name: "Madrid", country: "Spain", lat: 40.42, lon: -3.7, minZoom: 3 },
  { id: "rome", name: "Rome", country: "Italy", lat: 41.9, lon: 12.5, minZoom: 3 },
  { id: "paris", name: "Paris", country: "France", lat: 48.86, lon: 2.35, minZoom: 4 },
  { id: "berlin", name: "Berlin", country: "Germany", lat: 52.52, lon: 13.41, minZoom: 4 },
  { id: "athens", name: "Athens", country: "Greece", lat: 37.98, lon: 23.73, minZoom: 4 },
  { id: "istanbul", name: "Istanbul", country: "Türkiye", lat: 41.01, lon: 28.98, minZoom: 4 },
  { id: "moscow", name: "Moscow", country: "Russia", lat: 55.76, lon: 37.62 },

  // Africa & Middle East
  { id: "cairo", name: "Cairo", country: "Egypt", lat: 30.04, lon: 31.24 },
  { id: "lagos", name: "Lagos", country: "Nigeria", lat: 6.52, lon: 3.38 },
  { id: "nairobi", name: "Nairobi", country: "Kenya", lat: -1.29, lon: 36.82 },
  { id: "cape-town", name: "Cape Town", country: "South Africa", lat: -33.92, lon: 18.42 },
  { id: "dubai", name: "Dubai", country: "United Arab Emirates", lat: 25.2, lon: 55.27 },

  // Asia & Oceania
  { id: "mumbai", name: "Mumbai", country: "India", lat: 19.08, lon: 72.88 },
  { id: "bangkok", name: "Bangkok", country: "Thailand", lat: 13.76, lon: 100.5 },
  { id: "singapore", name: "Singapore", country: "Singapore", lat: 1.35, lon: 103.82, minZoom: 3 },
  { id: "beijing", name: "Beijing", country: "China", lat: 39.9, lon: 116.41 },
  { id: "tokyo", name: "Tokyo", country: "Japan", lat: 35.68, lon: 139.69 },
  { id: "sydney", name: "Sydney", country: "Australia", lat: -33.87, lon: 151.21 },
  { id: "auckland", name: "Auckland", country: "New Zealand", lat: -36.85, lon: 174.76 },

  // Americas
  { id: "honolulu", name: "Honolulu", country: "United States", lat: 21.31, lon: -157.86 },
  { id: "anchorage", name: "Anchorage", country: "United States", lat: 61.22, lon: -149.9 },
  { id: "vancouver", name: "Vancouver", country: "Canada", lat: 49.28, lon: -123.12 },
  { id: "los-angeles", name: "Los Angeles", country: "United States", lat: 34.05, lon: -118.24 },
  { id: "mexico-city", name: "Mexico City", country: "Mexico", lat: 19.43, lon: -99.13 },
  { id: "chicago", name: "Chicago", country: "United States", lat: 41.88, lon: -87.63, minZoom: 3 },
  { id: "new-york", name: "New York", country: "United States", lat: 40.71, lon: -74.01 },
  { id: "bogota", name: "Bogotá", country: "Colombia", lat: 4.71, lon: -74.07 },
  { id: "lima", name: "Lima", country: "Peru", lat: -12.05, lon: -77.04 },
  { id: "sao-paulo", name: "São Paulo", country: "Brazil", lat: -23.55, lon: -46.63 },
  { id: "buenos-aires", name: "Buenos Aires", country: "Argentina", lat: -34.6, lon: -58.38 },
];
