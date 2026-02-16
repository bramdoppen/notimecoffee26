"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StoreCoordinates = {
  lat: number;
  lng: number;
};

type StoreHours = {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
};

export type MapStore = {
  _id: string;
  name: string;
  slug: { current: string };
  city: string;
  address: string;
  zipCode?: string;
  coordinates: StoreCoordinates;
  phone?: string;
  hours?: StoreHours[];
  // StoreCard requires these — pass through from STORES_QUERY
  image?: any;
  specialHours?: any[];
  features?: string[];
  email?: string;
  [key: string]: any; // Allow additional fields from query
};

type StoreMapProps = {
  stores: MapStore[];
  selectedStoreId: string | null;
  onMarkerClick: (storeId: string) => void;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Netherlands center — fits Amsterdam, Arnhem, Den Haag with zoom 8 */
const NL_CENTER: L.LatLngExpression = [52.1, 5.1];
const NL_ZOOM = 8;
const FLY_TO_ZOOM = 14;

/** City display names — store.city values are lowercase */
const CITY_LABELS: Record<string, string> = {
  amsterdam: "A",
  arnhem: "R",
  "den-haag": "D",
};

// ---------------------------------------------------------------------------
// Custom DivIcon markers — forest-600 circles with city initials
// ---------------------------------------------------------------------------

function createMarkerIcon(city: string, isActive: boolean): L.DivIcon {
  const initial = CITY_LABELS[city] ?? city.charAt(0).toUpperCase();
  const bg = isActive ? "#C4652A" : "#2D5016"; // terracotta-500 : forest-600
  const size = isActive ? 38 : 32;
  const zIndex = isActive ? 1000 : 1;

  return L.divIcon({
    className: "", // Clear default leaflet-div-icon styles
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${bg};
        border: 2px solid #FEFCF9;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FAF0E6;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
        font-size: ${isActive ? 16 : 14}px;
        box-shadow: 0 2px 8px rgba(44, 80, 22, 0.3);
        transition: transform 150ms ease, background-color 150ms ease;
        z-index: ${zIndex};
        cursor: pointer;
      ">${initial}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

// ---------------------------------------------------------------------------
// Map controller — handles flyTo when selectedStoreId changes
// ---------------------------------------------------------------------------

function MapController({
  stores,
  selectedStoreId,
}: {
  stores: MapStore[];
  selectedStoreId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedStoreId) {
      const store = stores.find((s) => s._id === selectedStoreId);
      if (store?.coordinates) {
        map.flyTo(
          [store.coordinates.lat, store.coordinates.lng],
          FLY_TO_ZOOM,
          { duration: 0.8 }
        );
      }
    } else {
      // No selection — fit all markers
      const bounds = stores
        .filter((s) => s.coordinates)
        .map((s) => [s.coordinates.lat, s.coordinates.lng] as L.LatLngTuple);
      if (bounds.length > 0) {
        map.flyToBounds(bounds, { padding: [50, 50], duration: 0.8 });
      }
    }
  }, [map, stores, selectedStoreId]);

  return null;
}

// ---------------------------------------------------------------------------
// Open/closed status for popup
// ---------------------------------------------------------------------------

function getStoreStatus(hours?: StoreHours[]): {
  label: string;
  color: string;
  dot: string;
} {
  if (!hours || hours.length === 0) {
    return { label: "Hours unavailable", color: "#78716c", dot: "⚪" };
  }

  const now = new Date();
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = days[now.getDay()];
  const todayHours = hours.find(
    (h) => h.day.toLowerCase() === today
  );

  if (!todayHours || todayHours.closed) {
    return { label: "Closed today", color: "#dc2626", dot: "🔴" };
  }

  const [openH, openM] = todayHours.open.split(":").map(Number);
  const [closeH, closeM] = todayHours.close.split(":").map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (nowMinutes < openMinutes) {
    return {
      label: `Opens at ${todayHours.open}`,
      color: "#dc2626",
      dot: "🔴",
    };
  }

  if (nowMinutes >= closeMinutes) {
    return { label: "Closed", color: "#dc2626", dot: "🔴" };
  }

  if (closeMinutes - nowMinutes <= 30) {
    return {
      label: `Closing soon · ${todayHours.close}`,
      color: "#d97706",
      dot: "🟡",
    };
  }

  return {
    label: `Open · Closes ${todayHours.close}`,
    color: "#16a34a",
    dot: "🟢",
  };
}

// ---------------------------------------------------------------------------
// StoreMap component
// ---------------------------------------------------------------------------

export function StoreMap({
  stores,
  selectedStoreId,
  onMarkerClick,
}: StoreMapProps) {
  const markersRef = useRef<Record<string, L.Marker>>(new Map() as any);

  const setMarkerRef = useCallback(
    (storeId: string) => (marker: L.Marker | null) => {
      if (marker) {
        (markersRef.current as any)[storeId] = marker;
      }
    },
    []
  );

  return (
    <MapContainer
      center={NL_CENTER}
      zoom={NL_ZOOM}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={true}
      className="h-full w-full"
      style={{ minHeight: "300px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Zoom control — bottom-right per @bloom */}
      <ZoomControl position="bottomright" />

      {/* Controller for flyTo on selection changes */}
      <MapController stores={stores} selectedStoreId={selectedStoreId} />

      {/* Store markers */}
      {stores.map((store) => {
        if (!store.coordinates) return null;
        const isActive = store._id === selectedStoreId;
        const status = getStoreStatus(store.hours);
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;

        return (
          <Marker
            key={store._id}
            position={[store.coordinates.lat, store.coordinates.lng]}
            icon={createMarkerIcon(store.city, isActive)}
            ref={setMarkerRef(store._id)}
            eventHandlers={{
              click: () => onMarkerClick(store._id),
            }}
          >
            <Popup>
              <div style={{ fontFamily: "'DM Sans', sans-serif", minWidth: 180 }}>
                <strong style={{ fontSize: 14 }}>{store.name}</strong>
                <br />
                <span style={{ fontSize: 12, color: "#78716c" }}>
                  {store.address}
                </span>
                <br />
                <span style={{ fontSize: 12 }}>
                  {status.dot}{" "}
                  <span style={{ color: status.color }}>{status.label}</span>
                </span>
                <br />
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: 6,
                    fontSize: 12,
                    color: "#2D5016",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Get Directions →
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default StoreMap;
