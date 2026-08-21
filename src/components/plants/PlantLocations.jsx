import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";

import {
  Maximize2,
  Factory,
  Truck,
  User,
  MapPinned,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect } from "react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* ===========================================================
   LEAFLET DEFAULT MARKER
=========================================================== */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* ===========================================================
   FIT MAP BOUNDS
=========================================================== */

function FitBounds({ plants }) {
  const map = useMap();

  useEffect(() => {
    if (!plants.length) return;

    /* -------------------------------------------------------
       SINGLE MARKER
    ------------------------------------------------------- */

    if (plants.length === 1) {
      map.setView(plants[0].position, 15);
      return;
    }

    /* -------------------------------------------------------
       MULTIPLE MARKERS
    ------------------------------------------------------- */

    const bounds = L.latLngBounds(
      plants.map((plant) => plant.position)
    );

    map.fitBounds(bounds, {
      padding: [60, 60],
    });
  }, [plants, map]);

  return null;
}

/* ===========================================================
   COMPONENT
=========================================================== */

export default function PlantLocations({
  plants = [],
}) {
  /* ===========================================================
     FORMAT PLANT DATA
  =========================================================== */

  const formattedPlants = plants
    .filter(
      (plant) =>
        plant.latitude &&
        plant.longitude &&
        !isNaN(Number(plant.latitude)) &&
        !isNaN(Number(plant.longitude))
    )
    .map((plant) => ({
      id: plant.id,
      name: plant.plant_name,
      zone: plant.zone,
      manager:
        plant.plant_manager || "Not Assigned",
      capacity:
        plant.capacity_ton_per_day || "N/A",
      vehicles:
        plant.vehicles_enrolled ?? 0,
      status: plant.status,

      position: [
        Number(plant.latitude),
        Number(plant.longitude),
      ],

      latitude: plant.latitude,
      longitude: plant.longitude,
    }));

  /* ===========================================================
     RENDER
  =========================================================== */

  return (
    <section
      className="
        mt-6
        sm:mt-8
        bg-white
        rounded-xl
        sm:rounded-2xl
        border
        border-gray-200
        p-3
        sm:p-4
        lg:p-5
        shadow-sm
        w-full
        min-w-0
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          mb-3
          sm:mb-4
          lg:mb-5
        "
      >
        {/* TITLE */}

        <h2
          className="
            text-sm
            sm:text-base
            lg:text-lg
            font-bold
            uppercase
            text-gray-900
            truncate
          "
        >
          Plant Locations
        </h2>

        {/* MAXIMIZE */}

        <button
          type="button"
          aria-label="Maximize map"
          className="
            w-9
            h-9
            sm:w-10
            sm:h-10
            rounded-lg
            sm:rounded-xl
            border
            border-gray-200
            flex
            items-center
            justify-center
            hover:bg-gray-50
            active:bg-gray-100
            transition
            shrink-0
          "
        >
          <Maximize2
            size={16}
            className="sm:w-[18px] sm:h-[18px]"
          />
        </button>
      </div>

      {/* =====================================================
          MAP
      ===================================================== */}

      <div
        className="
          overflow-hidden
          rounded-xl
          sm:rounded-2xl
          w-full
        "
      >
        <MapContainer
          center={[13.0358, 77.597]}
          zoom={13}
          zoomControl={false}
          className="
            h-[320px]
            xs:h-[350px]
            sm:h-[400px]
            md:h-[450px]
            lg:h-[500px]
            xl:h-[560px]
            w-full
          "
        >
          {/* =================================================
              TILE LAYER
          ================================================= */}

          <TileLayer
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* =================================================
              ZOOM CONTROL
          ================================================= */}

          <ZoomControl position="bottomright" />

          {/* =================================================
              FIT BOUNDS
          ================================================= */}

          <FitBounds
            plants={formattedPlants}
          />

          {/* =================================================
              PLANT MARKERS
          ================================================= */}

          {formattedPlants.map((plant) => (
            <Marker
              key={plant.id}
              position={plant.position}
            >
              {/* =================================================
                  POPUP
              ================================================= */}

              <Popup
                maxWidth={300}
                minWidth={250}
              >
                <div className="p-1 sm:p-2 w-full">

                  {/* ===========================================
                      PLANT HEADER
                  =========================================== */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      sm:gap-3
                      mb-3
                      sm:mb-4
                    "
                  >
                    {/* ICON */}

                    <div
                      className="
                        w-10
                        h-10
                        sm:w-12
                        sm:h-12
                        rounded-lg
                        sm:rounded-xl
                        bg-violet-100
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <Factory
                        size={20}
                        className="text-violet-600 sm:w-6 sm:h-6"
                      />
                    </div>

                    {/* NAME + STATUS */}

                    <div className="min-w-0">
                      <h3
                        className="
                          font-bold
                          text-[14px]
                          sm:text-[16px]
                          text-gray-900
                          truncate
                        "
                      >
                        {plant.name}
                      </h3>

                      <span
                        className={`
                          text-[11px]
                          sm:text-xs
                          font-semibold
                          ${
                            plant.status ===
                            "ACTIVE"
                              ? "text-green-600"
                              : "text-red-500"
                          }
                        `}
                      >
                        ● {plant.status}
                      </span>
                    </div>
                  </div>

                  {/* ===========================================
                      PLANT DETAILS
                  =========================================== */}

                  <div
                    className="
                      space-y-2.5
                      sm:space-y-3
                      text-[12px]
                      sm:text-[13px]
                    "
                  >
                    {/* ZONE */}

                    <div
                      className="
                        flex
                        items-start
                        gap-2
                        min-w-0
                      "
                    >
                      <MapPinned
                        size={15}
                        className="
                          text-violet-600
                          shrink-0
                          mt-0.5
                        "
                      />

                      <span className="break-words">
                        {plant.zone}
                      </span>
                    </div>

                    {/* MANAGER */}

                    <div
                      className="
                        flex
                        items-start
                        gap-2
                        min-w-0
                      "
                    >
                      <User
                        size={15}
                        className="
                          text-violet-600
                          shrink-0
                          mt-0.5
                        "
                      />

                      <span className="break-words">
                        {plant.manager}
                      </span>
                    </div>

                    {/* VEHICLES */}

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        min-w-0
                      "
                    >
                      <Truck
                        size={15}
                        className="
                          text-violet-600
                          shrink-0
                        "
                      />

                      <span>
                        {plant.vehicles} Vehicles
                      </span>
                    </div>

                    {/* CAPACITY */}

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        min-w-0
                      "
                    >
                      <Factory
                        size={15}
                        className="
                          text-violet-600
                          shrink-0
                        "
                      />

                      <span>
                        {plant.capacity} Ton/Day
                      </span>
                    </div>

                    {/* COORDINATES */}

                    <div
                      className="
                        flex
                        items-start
                        gap-2
                        min-w-0
                      "
                    >
                      <MapPinned
                        size={15}
                        className="
                          text-violet-600
                          shrink-0
                          mt-0.5
                        "
                      />

                      <span className="break-all">
                        {plant.latitude},{" "}
                        {plant.longitude}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}