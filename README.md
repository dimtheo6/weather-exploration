# Weather Explorer

Explore live weather conditions anywhere in the world on an interactive map.

**Live demo:** https://weather-exploration.netlify.app/

When the app opens you see a world map with live weather "pills" on major cities, coloured by temperature, like a TV weather forecast. From there you can:

- **Explore the map.** Each pill shows a city's current conditions. More cities appear as you zoom in.
- **Dive into any place.** Click a city, click any point on the map, or search for a place to see its current weather.
- **See your own weather.** The ◎ button uses your browser's location.
- **Build your own picture.** Star (☆) places to save them as favorites. They appear under the search bar and get their own weather pill on the map, and they are still there after a page refresh.

All weather and place data comes from [Open-Meteo](https://open-meteo.com/).

---

## 1. Installation and setup

### Prerequisites
- **Node.js 20.9 or newer** (required by Next.js 16)
- npm (comes with Node.js)

### Install and run locally
```bash
git clone https://github.com/dimtheo6/weather-exploration.git
cd weather-exploration
npm install
npm run dev
```
Then open http://localhost:3000.

### Other scripts
```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint
```

### Environment variables
**None.** Open-Meteo and the OpenStreetMap map tiles don't require an API key.

> "My location" needs a secure context. It works on `localhost` and on the HTTPS live demo.

---

## 2. Implementation choices

### Framework and libraries
| Dependency | Why |
|---|---|
| **Next.js 16** (App Router) + **React 19** | Modern React framework with simple setup, routing and easy deployment. |
| **Leaflet** + **react-leaflet** | Free, lightweight interactive maps with no API key; react-leaflet lets the map be written as React components. |
| **Tailwind CSS** | Fast, consistent styling directly in the components. |
| **OpenStreetMap tiles** | Free basemap, no key needed. |
| **Open-Meteo** Forecast + Geocoding APIs | Weather data and place search, as required by the assignment. |

There are no other runtime dependencies: no state-management, data-fetching or UI-component libraries.

### Project structure
```
src/
  app/          Next.js page, layout and global styles
  components/   UI: map, search bar, location card, favorites, locate button
  hooks/        Connect data to React (loading / error / success states)
  lib/          Plain JavaScript: API calls + cache, preset cities, weather codes
```
`lib/` has no React in it, so all API logic lives in one place (`lib/openMeteo.js`) and the UI never sees the raw API response format.

### Key decisions
- **One shared selection.** `WeatherExplorer` holds a single `selectedLocation` state. Every way of picking a place (city pill, map click, search, my location, favorite) calls the same setter. The map and the weather card react to it.
- **Being mindful of API limits:**
  - **Batched requests.** Open-Meteo accepts many coordinates in one call, so weather for all preset cities loads in **1 request**, and all favorites in another.
  - **No duplicate requests.** Clicking a place that already has a pill reuses its data.
  - **Cache.** Results are cached in memory for 15 minutes, which is about how often Open-Meteo updates. Coordinates are rounded to ~1 km for more cache hits. Identical requests that run at the same time share one network call.
  - **Search.** The search is debounced (300 ms) and only runs from 2 characters, so typing "London" sends 1 request, not 6.
- **Stale responses are ignored.** If a slow, older request finishes after a newer one, its result is discarded. This means you never see weather or search results for the wrong place.
- **Browser-only rendering.** Leaflet, geolocation and `localStorage` only exist in the browser, so the app is loaded with `next/dynamic` and `ssr: false` (see `ExplorerLoader.jsx`). A full-screen interactive map doesn't benefit from server rendering.
- **Favorites in `localStorage`.** Only the place is stored (name and coordinates). The weather is always fetched fresh, so it is never out of date.
- **Location on demand.** The location permission is only requested when the user clicks ◎, not on page load.

---

## 3. Incomplete requirements and known limitations

All the main requirements are implemented. Known limitations:

- **Map clicks show coordinates, not a place name.** Open-Meteo has no reverse geocoding (coordinates → name), and I chose not to add a second data provider. Saved map clicks are named "Dropped pin".
- **Current weather only.** There is no hourly or multi-day forecast.
- **Favorite chips don't show temperatures.** The favorite's pill on the map does.
- **Selecting a saved map point** from the map or the favorites row draws a pin on top of its own weather pill.
- **Briefly wrong pill values.** After removing a favorite, the other favorites' pills can show the wrong value until the new request finishes, which takes a fraction of a second.
- **Search keyboard support is basic.** Enter selects the first result and Escape clears the input. There is no arrow-key navigation through the results.

---

## 4. Next steps

With more time I would:

1. **Add a forecast to the location card** (hourly for the next 24h and 7 days), using the same API in a single request.
2. **Show place names for map clicks** using a reverse-geocoding service such as Nominatim.
3. **Polish the favorites.** Show temperatures on the favorite chips.
4. **Add a temperature legend** that explains the pill colours, plus layer toggles for wind and precipitation.
5. **Add a "recently viewed" list,** and possibly comparing places side by side.
6. **Consider a data-fetching library** like React Query if the app grew. It would give caching, retries and background refresh out of the box.

---

## 5. Additional notes

- **Deployment.** The app is deployed on Netlify, and pushes to `main` redeploy automatically.
- **Map labels.** OpenStreetMap shows place names in the local language (e.g. Greek in Greece). An English-only basemap would need a provider with an API key.
- **API usage.** On page load the app makes 1 request for the preset cities, plus 1 for favorites if there are any. After that, requests are only made when the user selects a new place or searches.
