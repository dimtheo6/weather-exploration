# Weather Exploration – Plan

## Concept
A **map-first weather explorer**: open a world map with live weather markers, click anywhere or search a city to see details, save places to a personal collection, and compare them.

| Brief says | Feature |
|---|---|
| Visual overview like a TV forecast | World map with temp + condition markers on ~20–30 major cities |
| Notice how weather changes place to place | Colour-coded markers (temp scale), optional layer toggle (temp / wind / rain) |
| Dive into places | Click marker / map / search result → detail panel (now, next 24h, 7 days) |
| Build up their own picture | "Save place" → personal list in `localStorage`, compare view |
| Weather where they are | "My location" button (`navigator.geolocation`) |
| Mindful of usage limits | Batched requests, caching, debounced search |

## Scope

### MVP (must ship)
- [ ] Map with preset city markers (current temp + icon)
- [ ] Search box (Geocoding API) → fly to result
- [ ] Detail panel: current, hourly (24h), daily (7d)
- [ ] My location
- [ ] Save / remove places (localStorage)
- [ ] Loading / error / empty states, mobile-friendly layout

### Stretch
- [ ] Compare view (2–4 saved places side by side)
- [ ] Metric layer toggle (temp / wind / rain)
- [ ] °C / °F switch
- [ ] Small hourly chart (library or simple CSS bars)
- [ ] Shareable URL (`?lat=..&lon=..`)

## API strategy
- **Batch**: Forecast API accepts comma-separated coords → all preset markers in **1 request**.
- **Fetch only what's needed**: markers use `current` only; `hourly` + `daily` fetched when a place is opened.
- **Cache**: in-memory `Map` keyed by coords rounded to 2 decimals, ~10–15 min TTL (optionally mirrored to `sessionStorage`).
- **Search**: debounce ~300ms, min 2 chars, cancel stale requests with `AbortController`.
- **No reverse geocoding** in Open-Meteo → map clicks either show coordinates or snap to nearest known city (decide below). Mention in README.
- **Weather codes**: one `weatherCode → { label, icon }` mapping (WMO codes).

Suggested params:
```
current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m,is_day
hourly=temperature_2m,precipitation_probability,weather_code&forecast_hours=24
daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum
timezone=auto
```

## Structure
```
src/
  app/            page.js, layout.js, globals.css
  components/
    MapLoader.jsx       (dynamic import, ssr:false)
    WeatherMap.jsx      (map + markers)
    SearchBar.jsx
    LocationPanel.jsx   (detail view)
    SavedPlaces.jsx
    WeatherIcon.jsx
  lib/
    openMeteo.js        (fetchCurrentBatch, fetchForecast, searchPlaces + cache)
    weatherCodes.js
    presetCities.js
  hooks/
    useSavedPlaces.js   (localStorage)
    useGeolocation.js
```
State: plain React state + custom hooks — no Redux/Zustand needed (be ready to explain why).

## Milestones (commit after each)
1. [ ] Data layer: `openMeteo.js`, `weatherCodes.js`
2. [ ] Preset city markers from one batched call (`divIcon` with temps)
3. [ ] Detail panel (sidebar on desktop, bottom sheet on mobile)
4. [ ] Search with debounce, results dropdown, `flyTo`
5. [ ] My location + map click
6. [ ] Saved places (localStorage)
7. [ ] Polish: skeletons, errors, geolocation-denied, mobile, keyboard a11y
8. [ ] Stretch features
9. [ ] README + deploy to Vercel

## Watch out for
- **Next 16** has breaking changes — check `node_modules/next/dist/docs/` before using `next/dynamic`, route handlers, metadata.
- **Leaflet is client-only** — keep it behind the `ssr:false` dynamic import. Marker icon fix (`public/images`) is worth mentioning in the README.
- **Geolocation** needs a secure context (localhost / HTTPS).
- **Commit often** with clear messages — reviewers read history.

## Open decisions
- [ ] Map click on a random spot: show coordinates, or snap to nearest city?
- [ ] Compare view: MVP or stretch? (leaning stretch)
- [ ] Charts: library vs hand-made CSS strip? (leaning fewer deps)

## README notes (fill in as you go)
- Decisions made:
- Limits handled:
- Skipped / incomplete:
- Next steps:
