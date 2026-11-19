// WMO weather interpretation codes used by Open-Meteo (`weather_code`).
// https://open-meteo.com/en/docs (see "WMO Weather interpretation codes")
const WEATHER_CODES = {
  0: { label: "Clear sky", day: "☀️", night: "🌙" },
  1: { label: "Mainly clear", day: "🌤️", night: "🌙" },
  2: { label: "Partly cloudy", day: "⛅", night: "☁️" },
  3: { label: "Overcast", day: "☁️", night: "☁️" },
  45: { label: "Fog", day: "🌫️", night: "🌫️" },
  48: { label: "Depositing rime fog", day: "🌫️", night: "🌫️" },
  51: { label: "Light drizzle", day: "🌦️", night: "🌧️" },
  53: { label: "Drizzle", day: "🌦️", night: "🌧️" },
  55: { label: "Dense drizzle", day: "🌧️", night: "🌧️" },
  56: { label: "Light freezing drizzle", day: "🌧️", night: "🌧️" },
  57: { label: "Freezing drizzle", day: "🌧️", night: "🌧️" },
  61: { label: "Light rain", day: "🌦️", night: "🌧️" },
  63: { label: "Rain", day: "🌧️", night: "🌧️" },
  65: { label: "Heavy rain", day: "🌧️", night: "🌧️" },
  66: { label: "Light freezing rain", day: "🌧️", night: "🌧️" },
  67: { label: "Freezing rain", day: "🌧️", night: "🌧️" },
  71: { label: "Light snow", day: "🌨️", night: "🌨️" },
  73: { label: "Snow", day: "🌨️", night: "🌨️" },
  75: { label: "Heavy snow", day: "❄️", night: "❄️" },
  77: { label: "Snow grains", day: "🌨️", night: "🌨️" },
  80: { label: "Light rain showers", day: "🌦️", night: "🌧️" },
  81: { label: "Rain showers", day: "🌧️", night: "🌧️" },
  82: { label: "Violent rain showers", day: "⛈️", night: "⛈️" },
  85: { label: "Light snow showers", day: "🌨️", night: "🌨️" },
  86: { label: "Snow showers", day: "❄️", night: "❄️" },
  95: { label: "Thunderstorm", day: "⛈️", night: "⛈️" },
  96: { label: "Thunderstorm with hail", day: "⛈️", night: "⛈️" },
  99: { label: "Thunderstorm with heavy hail", day: "⛈️", night: "⛈️" },
};

export function getWeatherInfo(code, isDay = true) {
  const entry = WEATHER_CODES[code];
  if (!entry) return { label: "Unknown", icon: "❔" };
  return { label: entry.label, icon: isDay ? entry.day : entry.night };
}

// Colour bands for temperature (°C), cold → hot.
const TEMPERATURE_BANDS = [
  { max: -20, color: "#7c3aed" },
  { max: -10, color: "#4f46e5" },
  { max: 0, color: "#3b82f6" },
  { max: 10, color: "#06b6d4" },
  { max: 18, color: "#10b981" },
  { max: 25, color: "#eab308" },
  { max: 32, color: "#f97316" },
  { max: Infinity, color: "#dc2626" },
];

export function temperatureColor(celsius) {
  return TEMPERATURE_BANDS.find((band) => celsius <= band.max).color;
}
