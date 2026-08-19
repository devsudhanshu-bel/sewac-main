import React, { useEffect, useMemo, useRef } from "react";

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

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


/* ============================================================
   LEAFLET DEFAULT MARKER ICON
============================================================ */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


/* ============================================================
   FIT MAP TO PLANTS
============================================================ */

function FitBounds({ plants }) {
  const map = useMap();

  useEffect(() => {
    if (!plants.length) {
      return;
    }

    /* --------------------------------------------------------
       SINGLE PLANT
    -------------------------------------------------------- */

    if (plants.length === 1) {
      map.setView(
        plants[0].position,
        15
      );

      return;
    }


    /* --------------------------------------------------------
       MULTIPLE PLANTS
    -------------------------------------------------------- */

    const bounds = L.latLngBounds(
      plants.map(
        (plant) => plant.position
      )
    );

    if (!bounds.isValid()) {
      return;
    }

    map.fitBounds(
      bounds,
      {
        padding: [
          60,
          60,
        ],
      }
    );

  }, [
    plants,
    map,
  ]);

  return null;
}


/* ============================================================
   MAP SIZE CONTROLLER
============================================================ */

function MapSizeController() {
  const map = useMap();

  useEffect(() => {

    const timers = [
      setTimeout(
        () => map.invalidateSize(),
        100
      ),

      setTimeout(
        () => map.invalidateSize(),
        500
      ),

      setTimeout(
        () => map.invalidateSize(),
        1000
      ),
    ];


    const handleResize = () => {
      map.invalidateSize();
    };


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {

      timers.forEach(
        clearTimeout
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, [
    map,
  ]);

  return null;
}


/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function Plants({
  plants = [],
}) {

  /* ==========================================================
     FORMAT PLANT DATA
  ========================================================== */

  const formattedPlants = useMemo(() => {

    return plants

      .filter(
        (plant) =>
          plant?.latitude !==
            null &&
          plant?.latitude !==
            undefined &&
          plant?.longitude !==
            null &&
          plant?.longitude !==
            undefined &&
          !isNaN(
            Number(
              plant.latitude
            )
          ) &&
          !isNaN(
            Number(
              plant.longitude
            )
          )
      )

      .map(
        (plant) => ({

          id:
            plant.id,

          name:
            plant.plant_name ||
            plant.plantName ||
            plant.name ||
            "Unnamed Plant",

          zone:
            plant.zone ||
            plant.zone_name ||
            plant.zoneName ||
            "N/A",

          manager:
            plant.plant_manager ||
            plant.plantManager ||
            plant.manager ||
            "Not Assigned",

          capacity:
            plant.capacity_ton_per_day ??
            plant.capacityTonPerDay ??
            plant.capacity ??
            "N/A",

          vehicles:
            plant.vehicles_enrolled ??
            plant.vehiclesEnrolled ??
            plant.vehicles ??
            0,

          status:
            plant.status ||
            "UNKNOWN",

          position: [
            Number(
              plant.latitude
            ),
            Number(
              plant.longitude
            ),
          ],

          latitude:
            plant.latitude,

          longitude:
            plant.longitude,

        })
      );

  }, [
    plants,
  ]);


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section className="plants-wrapper">

      <style>{`

        /* ====================================================
           OUTER CARD
        ==================================================== */

        .plants-wrapper {
          width: 100%;
          background: #ffffff;
          border: 1px solid #dce4ec;
          border-radius: 18px;
          padding: 14px;
          box-sizing: border-box;
          box-shadow:
            0 4px 18px
            rgba(31,45,61,.05);
        }


        /* ====================================================
           PAGE HEADING
        ==================================================== */

        .plants-heading {
          margin:
            0 0 10px 2px;

          font-size:
            21px;

          line-height:
            1.15;

          font-weight:
            700;

          letter-spacing:
            -.3px;

          color:
            #07111f;
        }


        /* ====================================================
           MAP SHELL
        ==================================================== */

        .plants-map-shell {
          position:
            relative;

          width:
            100%;

          height:
            600px;

          min-height:
            600px;

          overflow:
            hidden;

          border:
            1px solid
            #dce4ec;

          border-radius:
            18px;

          background:
            #eef1f3;
        }


        /* ====================================================
           LEAFLET MAP
        ==================================================== */

        .plants-map,
        .plants-map
        .leaflet-container {
          width:
            100%;

          height:
            100%;
        }


        /* ====================================================
           CARTO MAP APPEARANCE
        ==================================================== */

        .plants-map
        .leaflet-tile-pane {
          filter:
            saturate(.42)
            brightness(1.05);
        }


        /* ====================================================
           ZOOM CONTROL
        ==================================================== */

        .plants-map
        .leaflet-control-zoom {
          margin-top:
            12px;

          margin-left:
            12px;

          border:
            1px solid
            #d8e1ea;

          border-radius:
            8px;

          overflow:
            hidden;

          box-shadow:
            0 3px 12px
            rgba(36,53,72,.08);
        }


        .plants-map
        .leaflet-control-zoom a {
          width:
            30px;

          height:
            30px;

          line-height:
            30px;

          font-size:
            17px;

          color:
            #34475b;

          background:
            #ffffff;
        }


        /* ====================================================
           ATTRIBUTION
        ==================================================== */

        .plants-map
        .leaflet-control-attribution {
          font-size:
            9px;

          background:
            rgba(
              255,
              255,
              255,
              .82
            );
        }


        /* ====================================================
           HEADER
        ==================================================== */

        .plants-header {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          margin-bottom:
            14px;
        }


        .plants-header-left {
          display:
            flex;

          align-items:
            center;

          gap:
            10px;
        }


        .plants-header-icon {
          width:
            27px;

          height:
            27px;

          color:
            #617b98;
        }


        .plants-header-title {
          font-size:
            19px;

          font-weight:
            700;

          line-height:
            1.1;

          color:
            #34475b;
        }


        .plants-header-subtitle {
          margin-top:
            3px;

          font-size:
            11px;

          font-weight:
            600;

          color:
            #8aa1bb;
        }


        /* ====================================================
           MAXIMIZE BUTTON
        ==================================================== */

        .plants-maximize-button {
          width:
            38px;

          height:
            38px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border:
            1px solid
            #dce4ec;

          border-radius:
            10px;

          background:
            #ffffff;

          color:
            #52677c;

          cursor:
            pointer;

          transition:
            .2s ease;
        }


        .plants-maximize-button:hover {
          background:
            #f6f9fb;

          border-color:
            #b8c9d9;
        }


        /* ====================================================
           EMPTY STATE
        ==================================================== */

        .plants-empty {
          position:
            absolute;

          z-index:
            2000;

          top:
            50%;

          left:
            50%;

          transform:
            translate(
              -50%,
              -50%
            );

          padding:
            14px 20px;

          background:
            rgba(
              255,
              255,
              255,
              .96
            );

          border:
            1px solid
            #dce4ec;

          border-radius:
            12px;

          box-shadow:
            0 10px 30px
            rgba(
              30,
              45,
              60,
              .10
            );

          color:
            #667b91;

          font-size:
            12px;

          font-weight:
            600;

          white-space:
            nowrap;
        }


        /* ====================================================
           RESPONSIVE
        ==================================================== */

        @media (
          max-width: 800px
        ) {

          .plants-wrapper {
            padding:
              10px;
          }


          .plants-heading {
            font-size:
              19px;
          }


          .plants-map-shell {
            height:
              500px;

            min-height:
              500px;
          }


          .plants-header-title {
            font-size:
              17px;
          }


          .plants-header-subtitle {
            font-size:
              10px;
          }

        }

      `}</style>


      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="plants-header">

        <div className="plants-header-left">

          <Factory
            className="plants-header-icon"
            strokeWidth={1.8}
          />

          <div>

            <div className="plants-header-title">
              Plant Locations
            </div>

            <div className="plants-header-subtitle">
              Waste processing plants
            </div>

          </div>

        </div>


        <button
          type="button"
          className="plants-maximize-button"
          onClick={() => {
            /*
             * Fullscreen behaviour can be added here later.
             */
          }}
          title="Maximize map"
        >

          <Maximize2
            size={17}
          />

        </button>

      </div>


      {/* ====================================================
          MAP
      ==================================================== */}

      <div className="plants-map-shell">

        <MapContainer
          center={[
            13.0358,
            77.597,
          ]}
          zoom={13}
          zoomControl={false}
          className="plants-map"
        >

          {/* ==================================================
              CARTO BASE MAP
          ================================================== */}

          <TileLayer
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains={[
              "a",
              "b",
              "c",
              "d",
            ]}
            maxZoom={20}
          />


          {/* ==================================================
              MAP CONTROLLERS
          ================================================== */}

          <MapSizeController />

          <ZoomControl
            position="bottomright"
          />

          <FitBounds
            plants={
              formattedPlants
            }
          />


          {/* ==================================================
              PLANT MARKERS
          ================================================== */}

          {formattedPlants.map(
            (plant) => (

              <Marker
                key={
                  plant.id
                }
                position={
                  plant.position
                }
              >

                <Popup
                  maxWidth={300}
                  minWidth={270}
                >

                  <div className="p-2">

                    {/* ========================================
                        PLANT HEADER
                    ======================================== */}

                    <div className="flex items-center gap-3 mb-4">

                      <div className="
                        w-12
                        h-12
                        rounded-xl
                        bg-violet-100
                        flex
                        items-center
                        justify-center
                      ">

                        <Factory
                          size={24}
                          className="text-violet-600"
                        />

                      </div>


                      <div>

                        <h3 className="
                          font-bold
                          text-[16px]
                        ">
                          {
                            plant.name
                          }
                        </h3>


                        <span
                          className={`
                            text-xs
                            font-semibold
                            ${
                              String(
                                plant.status
                              ).toUpperCase() ===
                              "ACTIVE"
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          `}
                        >

                          ●{" "}
                          {
                            plant.status
                          }

                        </span>

                      </div>

                    </div>


                    {/* ========================================
                        PLANT INFORMATION
                    ======================================== */}

                    <div className="
                      space-y-3
                      text-[13px]
                    ">


                      {/* ======================================
                          ZONE
                      ====================================== */}

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <MapPinned
                          size={16}
                          className="text-violet-600"
                        />

                        <span>
                          {
                            plant.zone
                          }
                        </span>

                      </div>


                      {/* ======================================
                          MANAGER
                      ====================================== */}

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <User
                          size={16}
                          className="text-violet-600"
                        />

                        <span>
                          {
                            plant.manager
                          }
                        </span>

                      </div>


                      {/* ======================================
                          VEHICLES
                      ====================================== */}

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <Truck
                          size={16}
                          className="text-violet-600"
                        />

                        <span>
                          {
                            plant.vehicles
                          }{" "}
                          Vehicles
                        </span>

                      </div>


                      {/* ======================================
                          CAPACITY
                      ====================================== */}

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <Factory
                          size={16}
                          className="text-violet-600"
                        />

                        <span>
                          {
                            plant.capacity
                          }{" "}
                          Ton/Day
                        </span>

                      </div>


                      {/* ======================================
                          COORDINATES
                      ====================================== */}

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <MapPinned
                          size={16}
                          className="text-violet-600"
                        />

                        <span>
                          {
                            plant.latitude
                          }
                          ,{" "}
                          {
                            plant.longitude
                          }
                        </span>

                      </div>

                    </div>

                  </div>

                </Popup>

              </Marker>

            )
          )}

        </MapContainer>


        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {formattedPlants.length ===
          0 && (

          <div className="plants-empty">

            No plant locations available

          </div>

        )}

      </div>

    </section>
  );
}