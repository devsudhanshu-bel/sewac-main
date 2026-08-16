import {
  MapContainer,
  TileLayer,
  ZoomControl,
  GeoJSON,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { useEffect, useMemo, useState } from "react";

import L from "leaflet";

import { ChevronDown } from "lucide-react";

import VehicleMarker from "./VehicleMarker";
import VehicleInfoCard from "./VehicleInfoCard";

import { vehicles as initialVehicles } from "../../data/mockVehicles";

import api from "../../api/axios";

import { useFilters } from "../../contexts/FilterContext";

/* =========================================================
   FIX DB [LAT, LNG] → GEOJSON [LNG, LAT]
========================================================= */

function invertGeoJSONCoordinates(coordinates) {
  if (!Array.isArray(coordinates)) {
    return coordinates;
  }

  // A coordinate pair:
  // [latitude, longitude]
  if (
    coordinates.length >= 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number"
  ) {
    return [coordinates[1], coordinates[0], ...coordinates.slice(2)];
  }

  // Polygon / MultiPolygon / LineString etc.
  return coordinates.map((coordinate) => invertGeoJSONCoordinates(coordinate));
}

/* =========================================================
   NORMALIZE COMPLETE GEOJSON OBJECT
========================================================= */

function normalizeGeoJSON(geojson) {
  if (!geojson) {
    return null;
  }

  const normalized = {
    ...geojson,
  };

  /*
   * GeometryCollection
   */
  if (
    normalized.type === "GeometryCollection" &&
    Array.isArray(normalized.geometries)
  ) {
    normalized.geometries = normalized.geometries.map((geometry) =>
      normalizeGeoJSON(geometry),
    );

    return normalized;
  }

  /*
   * FeatureCollection
   */
  if (
    normalized.type === "FeatureCollection" &&
    Array.isArray(normalized.features)
  ) {
    normalized.features = normalized.features.map((feature) =>
      normalizeGeoJSON(feature),
    );

    return normalized;
  }

  /*
   * Feature
   */
  if (normalized.type === "Feature" && normalized.geometry) {
    normalized.geometry = normalizeGeoJSON(normalized.geometry);

    return normalized;
  }

  /*
   * Geometry
   */
  if (normalized.coordinates) {
    normalized.coordinates = invertGeoJSONCoordinates(normalized.coordinates);
  }

  return normalized;
}

/* =========================================================
   FIT SELECTED BOUNDARY
========================================================= */

function FitBoundary({ data }) {
  const map = useMap();

  useEffect(() => {
    if (!data) {
      return;
    }

    try {
      /*
       * DB gives [LAT, LNG]
       * GeoJSON requires [LNG, LAT]
       */
      const normalizedData = normalizeGeoJSON(data);

      const layer = L.geoJSON(normalizedData);

      const bounds = layer.getBounds();

      if (!bounds.isValid()) {
        console.warn("Boundary bounds are invalid");
        return;
      }

      map.fitBounds(bounds, {
        padding: [30, 30],
        maxZoom: 15,
      });
    } catch (error) {
      console.error("Unable to fit boundary:", error);
    }
  }, [map, data]);

  return null;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function MapSection({ mapView }) {
  /*
   * =======================================================
   * HEADER FILTER CONTEXT
   * =======================================================
   */

  const { selectedCity, selectedZone } = useFilters();

  /*
   * =======================================================
   * MAP GEOGRAPHIC FILTERS
   * =======================================================
   */

  const [selectedDivisionId, setSelectedDivisionId] = useState("");

  const [selectedWardId, setSelectedWardId] = useState("");

  /*
   * =======================================================
   * MAP DATA FROM BACKEND
   * =======================================================
   */

  const [mapData, setMapData] = useState(null);

  const [mapLoading, setMapLoading] = useState(false);

  const [mapError, setMapError] = useState("");

  /*
   * =======================================================
   * VEHICLES
   * =======================================================
   */

  const [vehicles, setVehicles] = useState(initialVehicles);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  /*
   * =======================================================
   * FETCH MAP DATA
   * =======================================================
   *
   * Header city + zone determine the available
   * divisions and wards.
   */

  useEffect(() => {
    const cityId = selectedCity?.city_id;
    const zoneId = selectedZone?.zone_id;

    console.log("================ MAP FILTER =================");
    console.log("Selected City:", selectedCity);
    console.log("Selected Zone:", selectedZone);
    console.log("City ID:", cityId);
    console.log("Zone ID:", zoneId);
    console.log("==============================================");

    if (!cityId || !zoneId) {
      console.warn("Map API skipped: cityId or zoneId not available yet");

      setMapData(null);
      return;
    }

    let mounted = true;

    const fetchMapData = async () => {
      try {
        setMapLoading(true);
        setMapError("");

        /*
         * Reset ONLY the map-level filters
         */

        setSelectedDivisionId("");
        setSelectedWardId("");

        /*
         * Let Axios construct the query parameters.
         *
         * This guarantees:
         *
         * ?cityId=1&zoneId=4
         */

        console.log("MAP API PARAMS:", {
          cityId,
          zoneId,
        });

        const response = await api.get("/api/admin/overview/map", {
          params: {
            cityId,
            zoneId,
          },
        });

        console.log("MAP API RESPONSE:", response.data);

        if (!mounted) {
          return;
        }

        setMapData(response.data?.data || null);
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error("Map API Error:", error);

        setMapData(null);

        setMapError(
          error?.response?.data?.message || "Unable to load map data.",
        );
      } finally {
        if (mounted) {
          setMapLoading(false);
        }
      }
    };

    fetchMapData();

    return () => {
      mounted = false;
    };
  }, [selectedCity?.city_id, selectedZone?.zone_id]);

  /*
   * =======================================================
   * AVAILABLE DIVISIONS
   * =======================================================
   */

  const divisions = mapData?.divisions || [];

  /*
   * =======================================================
   * AVAILABLE WARDS
   * =======================================================
   *
   * If a division is selected:
   *     show wards from that division.
   *
   * If "All Divisions":
   *     show all wards in the zone.
   */

  const wards = useMemo(() => {
    if (!mapData) {
      return [];
    }

    if (!selectedDivisionId) {
      return mapData.wards || [];
    }

    const selectedDivision = divisions.find(
      (division) => String(division.divisionId) === String(selectedDivisionId),
    );

    return selectedDivision?.wards || [];
  }, [mapData, divisions, selectedDivisionId]);

  /*
   * =======================================================
   * CURRENT SELECTED BOUNDARY
   * =======================================================
   *
   * Priority:
   *
   * Ward
   *   ↓
   * Division
   *   ↓
   * Zone
   */

  const selectedBoundary = useMemo(() => {
    if (!mapData) {
      return null;
    }

    /*
     * Ward selected
     */

    if (selectedWardId) {
      const ward = wards.find(
        (item) => String(item.wardId) === String(selectedWardId),
      );

      if (ward?.geoBoundary) {
        return {
          type: "ward",
          name: ward.wardName,
          boundary: ward.geoBoundary,
        };
      }
    }

    /*
     * Division selected
     */

    if (selectedDivisionId) {
      const division = divisions.find(
        (item) => String(item.divisionId) === String(selectedDivisionId),
      );

      if (division?.geoBoundary) {
        return {
          type: "division",
          name: division.divisionName,
          boundary: division.geoBoundary,
        };
      }
    }

    /*
     * Default:
     * selected zone boundary
     */

    if (mapData.zone?.geoBoundary) {
      return {
        type: "zone",
        name: mapData.zone.zoneName,
        boundary: mapData.zone.geoBoundary,
      };
    }

    return null;
  }, [mapData, divisions, wards, selectedDivisionId, selectedWardId]);

  /*
   * =======================================================
   * DIVISION CHANGE
   * =======================================================
   */

  const handleDivisionChange = (event) => {
    const value = event.target.value;

    setSelectedDivisionId(value);

    /*
     * A ward from the previous division
     * must never remain selected.
     */

    setSelectedWardId("");
  };

  /*
   * =======================================================
   * WARD CHANGE
   * =======================================================
   */

  const handleWardChange = (event) => {
    setSelectedWardId(event.target.value);
  };

  /*
   * =======================================================
   * VEHICLE MOVEMENT
   * =======================================================
   */

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((vehicle) => {
          const [lat, lng] = vehicle.position;

          return {
            ...vehicle,

            position: [
              lat + (Math.random() - 0.5) * 0.00015,

              lng + (Math.random() - 0.5) * 0.00015,
            ],
          };
        }),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <div
      className="
        bg-white
        rounded-[28px]
        border
        border-gray-100
        overflow-hidden
        h-[450px]
        relative
        shadow-sm
      "
    >
      <MapContainer
        center={[12.9258, 77.659]}
        zoom={15}
        zoomControl={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ZoomControl position="topleft" />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* =================================================
            DB BOUNDARY
        ================================================= */}

        {selectedBoundary?.boundary && (
          <>
            <FitBoundary data={selectedBoundary.boundary} />

            <GeoJSON
              key={`${selectedBoundary.type}-${selectedBoundary.name}`}
              data={normalizeGeoJSON(selectedBoundary.boundary)}
              style={{
                color:
                  selectedBoundary.type === "zone"
                    ? "#7C3AED"
                    : selectedBoundary.type === "division"
                      ? "#2563EB"
                      : "#10B981",

                weight: 4,

                opacity: 0.9,

                fillColor:
                  selectedBoundary.type === "zone"
                    ? "#C4B5FD"
                    : selectedBoundary.type === "division"
                      ? "#93C5FD"
                      : "#6EE7B7",

                fillOpacity: 0.15,
              }}
              onEachFeature={(feature, layer) => {
                layer.bindPopup(`
                  <div style="padding:4px">
                    <strong>
                      ${feature?.properties?.name || selectedBoundary.name}
                    </strong>
                  </div>
                `);
              }}
            />
          </>
        )}

        {/* =================================================
            VEHICLES
        ================================================= */}

        {vehicles.map((vehicle) => (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            onClick={setSelectedVehicle}
          />
        ))}
      </MapContainer>

      {/* ===================================================
          MAP FILTERS — TOP RIGHT
      =================================================== */}

      <div
        className="
          absolute
          top-5
          right-5
          z-[1000]
          flex
          gap-3
        "
      >
        {/* ================= DIVISION ================= */}

        <div className="relative">
          <select
            value={selectedDivisionId}
            onChange={handleDivisionChange}
            disabled={mapLoading || divisions.length === 0}
            className="
              appearance-none
              min-w-[170px]
              h-[44px]
              pl-4
              pr-10
              bg-white/95
              backdrop-blur-xl
              rounded-xl
              border
              border-[#E7EAF1]
              shadow-[0_12px_35px_rgba(15,23,42,0.12)]
              text-[13px]
              font-semibold
              text-gray-700
              outline-none
              cursor-pointer
              hover:border-violet-300
              focus:border-violet-400
              transition-all
            "
          >
            <option value="">All Divisions</option>

            {divisions.map((division) => (
              <option key={division.divisionId} value={division.divisionId}>
                {division.divisionName}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              pointer-events-none
              text-gray-500
            "
          />
        </div>

        {/* ================= WARD ================= */}

        <div className="relative">
          <select
            value={selectedWardId}
            onChange={handleWardChange}
            disabled={mapLoading || wards.length === 0}
            className="
              appearance-none
              min-w-[170px]
              h-[44px]
              pl-4
              pr-10
              bg-white/95
              backdrop-blur-xl
              rounded-xl
              border
              border-[#E7EAF1]
              shadow-[0_12px_35px_rgba(15,23,42,0.12)]
              text-[13px]
              font-semibold
              text-gray-700
              outline-none
              cursor-pointer
              hover:border-violet-300
              focus:border-violet-400
              transition-all
            "
          >
            <option value="">All Wards</option>

            {wards.map((ward) => (
              <option key={ward.wardId} value={ward.wardId}>
                {ward.wardName}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              pointer-events-none
              text-gray-500
            "
          />
        </div>
      </div>

      {/* ===================================================
          MAP LOADING
      =================================================== */}

      {mapLoading && (
        <div
          className="
            absolute
            top-5
            right-5
            z-[1100]
            bg-white/90
            backdrop-blur-xl
            rounded-xl
            px-4
            py-2
            shadow-lg
            text-xs
            font-medium
            text-gray-600
          "
        >
          Loading boundaries...
        </div>
      )}

      {/* ===================================================
          MAP ERROR
      =================================================== */}

      {mapError && (
        <div
          className="
            absolute
            bottom-5
            left-1/2
            -translate-x-1/2
            z-[1100]
            bg-white/95
            backdrop-blur-xl
            rounded-xl
            px-4
            py-2
            shadow-lg
            text-xs
            font-medium
            text-red-500
          "
        >
          {mapError}
        </div>
      )}

      {/* ===================================================
          VEHICLE INFO
      =================================================== */}

      <VehicleInfoCard
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
    </div>
  );
}
