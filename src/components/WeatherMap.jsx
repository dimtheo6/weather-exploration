"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap, useMapEvents, zoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getWeatherInfo, temperatureColor } from "@/lib/weatherCodes";

const INITIAL_CENTER = [20, 0];
const INITIAL_ZOOM = 2;

// Leaflet's default marker images break under bundlers, so we point to copies in /public.
const pinIcon = new L.Icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// HTML "pill" marker: weather icon + temperature, coloured by temperature.
// iconSize: null lets the pill size itself; CSS centres it on the point.
function createCityIcon(city, isSelected) {
  const classes = ["city-marker", isSelected && "city-marker--selected"].filter(Boolean).join(" ");

  if (!city.weather) {
    return L.divIcon({
      className: "",
      iconSize: null,
      html: `<div class="${classes} city-marker--loading">…</div>`,
    });
  }

  const { temperature, weatherCode, isDay } = city.weather;
  const { icon } = getWeatherInfo(weatherCode, isDay);

  return L.divIcon({
    className: "",
    iconSize: null,
    html: `
      <div class="${classes}" style="--marker-color: ${temperatureColor(temperature)}">
        <span aria-hidden="true">${icon}</span>
        <span>${Math.round(temperature)}°</span>
      </div>`,
  });
}

function MapEvents({ onMapClick, onZoomChange }) {
  const map = useMapEvents({
    click(event) {
      // wrap() keeps longitude within -180..180 even when the user clicks
      // on a repeated copy of the world (Open-Meteo rejects anything else).
      const { lat, lng } = event.latlng.wrap();
      onMapClick({ lat, lon: lng });
    },
    zoomend() {
      onZoomChange(map.getZoom());
    },
  });
  return null;
}

// Moves the map to the selected location when asked to (e.g. search, "my location").
// Clicks on the map itself don't set `flyTo`, so the view doesn't jump around.
function FlyToSelection({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location?.flyTo) {
      map.flyTo([location.lat, location.lon], Math.max(map.getZoom(), 8), { duration: 1.2 });
    }
  }, [location, map]);

  return null;
}

export default function WeatherMap({ cities, selectedLocation, onSelectLocation }) {
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  const selectedCityId = selectedLocation?.cityId ?? null;

  // Recreate marker icons only when weather data or the selection changes.
  const cityIcons = useMemo(
    () => new Map(cities.map((city) => [city.id, createCityIcon(city, city.id === selectedCityId)])),
    [cities, selectedCityId]
  );

  const visibleCities = cities.filter((city) => zoom >= (city.minZoom ?? INITIAL_ZOOM));

  return (
    <MapContainer
      center={INITIAL_CENTER}
      zoom={INITIAL_ZOOM}
      zoomControl={false}
      minZoom={2}
      maxZoom={12}
      worldCopyJump
      maxBounds={[
        [-85, -540],
        [85, 540],
      ]}
      maxBoundsViscosity={1}
      scrollWheelZoom
      className="h-full w-full"
    >
        
      {/* OpenStreetMap tiles (no API key). Muted via CSS in globals.css so markers stand out. */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapEvents
        onMapClick={(coords) => onSelectLocation({ ...coords, name: null })}
        onZoomChange={setZoom}
      />
      <FlyToSelection location={selectedLocation} />

      {visibleCities.map((city) => {
        const label = city.weather
          ? `${city.name} · ${getWeatherInfo(city.weather.weatherCode, city.weather.isDay).label}`
          : city.name;

        return (
          <Marker
            key={city.id}
            position={[city.lat, city.lon]}
            icon={cityIcons.get(city.id)}
            title={label}
            zIndexOffset={city.id === selectedCityId ? 1000 : 0}
            eventHandlers={{
              click: () =>
                onSelectLocation({
                  cityId: city.id,
                  name: city.name,
                  country: city.country,
                  lat: city.lat,
                  lon: city.lon,
                }),
            }}
          >
            <Tooltip direction="top" offset={[0, -14]}>
              {label}
            </Tooltip>
          </Marker>
        );
      })}

      {/* Plain pin for places that aren't one of the preset cities */}
      {selectedLocation && !selectedCityId && (
        <Marker
          position={[selectedLocation.lat, selectedLocation.lon]}
          icon={pinIcon}
          zIndexOffset={1000}
        />
      )}
    </MapContainer>
  );
}
