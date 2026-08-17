import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  Check,
  Route,
  MapPinned,
  Factory,
  Megaphone,
  Map,
} from "lucide-react";

import { gsap } from "gsap";

import MapSection from "../dashboard/MapSection";

/*
=============================================================
MAP VIEWS
=============================================================
*/

const mapViews = [
  {
    id: "overview",
    label: "City Overview Map",
    icon: Map,
    color: "text-blue-600",
  },

  {
    id: "route",
    label: "Route Map",
    icon: Route,
    color: "text-violet-600",
  },

  {
    id: "gvp",
    label: "Garbage Vulnerable Points (GVP)",
    icon: MapPinned,
    color: "text-green-600",
  },

  {
    id: "plants",
    label: "Plants Active",
    icon: Factory,
    color: "text-emerald-600",
  },

  {
    id: "grievances",
    label: "Customer Grievances",
    icon: Megaphone,
    color: "text-pink-500",
  },
];

/*
=============================================================
DIVISION OPTIONS
=============================================================
*/

const divisionOptions = [
  "All Divisions",
  "Division 1",
  "Division 2",
  "Division 3",
];

/*
=============================================================
WARD OPTIONS

IMPORTANT:

These are the ward numbers currently available in the
system/test data.

You can expand this later from the master citizen API.
=============================================================
*/

const wardOptions = [
  "All Wards",
  "Ward 1",
  "Ward 2",
  "Ward 3",
  "Ward 20",
  "Ward 216",
];

/*
=============================================================
HELPERS
=============================================================
*/

function getWardNumber(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  if (
    value === "All Wards" ||
    value === ""
  ) {
    return null;
  }

  const match =
    String(value).match(/\d+/);

  if (!match) {
    return null;
  }

  return Number(match[0]);
}

/*
=============================================================
COMPONENT
=============================================================
*/

export default function CityOverviewMap() {
  /*
  ===========================================================
  MAP VIEW
  ===========================================================
  */

  const [
    selectedView,
    setSelectedView,
  ] = useState(
    mapViews[0]
  );

  /*
  ===========================================================
  MAP VIEW DROPDOWN
  ===========================================================
  */

  const [
    mapViewOpen,
    setMapViewOpen,
  ] = useState(false);

  /*
  ===========================================================
  ROUTE FILTERS
  ===========================================================
  */

  const [
    selectedDivision,
    setSelectedDivision,
  ] = useState(
    "All Divisions"
  );

  const [
    selectedWard,
    setSelectedWard,
  ] = useState(
    "All Wards"
  );

  /*
  ===========================================================
  FILTER DROPDOWN STATES
  ===========================================================
  */

  const [
    divisionOpen,
    setDivisionOpen,
  ] = useState(false);

  const [
    wardOpen,
    setWardOpen,
  ] = useState(false);

  /*
  ===========================================================
  REFS
  ===========================================================
  */

  const sectionRef =
    useRef(null);

  const headerRef =
    useRef(null);

  const mapRef =
    useRef(null);

  const mapViewRef =
    useRef(null);

  const divisionRef =
    useRef(null);

  const wardRef =
    useRef(null);

  /*
  ===========================================================
  INITIAL ANIMATION
  ===========================================================
  */

  useEffect(() => {
    const timeline =
      gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

    if (
      sectionRef.current
    ) {
      timeline.from(
        sectionRef.current,
        {
          opacity: 0,
          y: 25,
          duration: 0.45,
        }
      );
    }

    if (
      headerRef.current
    ) {
      timeline.from(
        headerRef.current,
        {
          opacity: 0,
          y: 15,
          duration: 0.35,
        },
        "-=0.2"
      );
    }

    if (
      mapRef.current
    ) {
      timeline.from(
        mapRef.current,
        {
          opacity: 0,
          scale: 0.985,
          duration: 0.65,
        },
        "-=0.15"
      );
    }

    return () => {
      timeline.kill();
    };
  }, []);

  /*
  ===========================================================
  CLOSE ALL DROPDOWNS WHEN CLICKING OUTSIDE
  ===========================================================
  */

  useEffect(() => {
    function handleOutsideClick(
      event
    ) {
      const target =
        event.target;

      if (
        mapViewRef.current &&
        !mapViewRef.current.contains(
          target
        )
      ) {
        setMapViewOpen(false);
      }

      if (
        divisionRef.current &&
        !divisionRef.current.contains(
          target
        )
      ) {
        setDivisionOpen(false);
      }

      if (
        wardRef.current &&
        !wardRef.current.contains(
          target
        )
      ) {
        setWardOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /*
  ===========================================================
  MAP VIEW SELECTION

  IMPORTANT:

  DO NOT wait for GSAP before changing state.

  The state changes immediately.
  ===========================================================
  */

  const handleSelectMapView =
    (view) => {
      setSelectedView(view);
      setMapViewOpen(false);

      /*
      Small visual animation only.
      It does NOT control React state.
      */

      requestAnimationFrame(() => {
        if (
          mapRef.current
        ) {
          gsap.fromTo(
            mapRef.current,
            {
              opacity: 0.65,
              scale: 0.995,
            },
            {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              ease: "power3.out",
            }
          );
        }
      });
    };

  /*
  ===========================================================
  DIVISION CHANGE
  ===========================================================
  */

  const handleDivisionChange =
    (division) => {
      setSelectedDivision(
        division
      );

      /*
      When division changes,
      reset ward because the ward
      belongs to that division.
      */

      setSelectedWard(
        "All Wards"
      );

      setDivisionOpen(false);
    };

  /*
  ===========================================================
  WARD CHANGE
  ===========================================================
  */

  const handleWardChange =
    (ward) => {
      setSelectedWard(
        ward
      );

      setWardOpen(false);
    };

  /*
  ===========================================================
  NORMALIZED VALUES FOR MAPSECTION
  ===========================================================
  */

  const selectedWardNumber =
    getWardNumber(
      selectedWard
    );

  /*
  ===========================================================
  RENDER
  ===========================================================
  */

  return (
    <section
      ref={sectionRef}
      className="mt-6"
    >
      <div
        className="
          bg-white
          rounded-[26px]
          border
          border-[#EEF1F6]
          shadow-sm
          overflow-hidden
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          ref={headerRef}
          className="
            px-8
            pt-6
            pb-5
          "
        >
          <h2
            className="
              text-[18px]
              font-semibold
              tracking-wide
              text-[#171717]
            "
          >
            CITY OVERVIEW MAP
          </h2>
        </div>

        {/* =================================================
            MAP WRAPPER
        ================================================= */}

        <div
          className="
            relative
            mx-2
            mb-2
            rounded-[22px]
            overflow-hidden
          "
        >
          {/* =================================================
              ACTUAL MAP

              z-0

              Controls are placed ABOVE this.
          ================================================= */}

          <div
            ref={mapRef}
            className="
              relative
              h-[560px]
              z-0
            "
          >
            <MapSection
              mapView={
                selectedView.id
              }

              selectedDivision={
                selectedDivision
              }

              selectedWard={
                selectedWard
              }

              selectedWardNumber={
                selectedWardNumber
              }
            />
          </div>

          {/* =================================================
              MAP VIEW CONTROL

              LEFT SIDE
          ================================================= */}

          <div
            ref={mapViewRef}
            className="
              absolute
              top-6
              left-6
              z-[3000]
              w-[375px]
            "
          >
            {/* -----------------------------------------------
                LABEL
            ----------------------------------------------- */}

            <p
              className="
                mb-3
                text-[13px]
                font-medium
                text-gray-700
              "
            >
              Select Map View
            </p>

            {/* -----------------------------------------------
                SELECTED VIEW BUTTON
            ----------------------------------------------- */}

            <button
              type="button"
              onClick={() =>
                setMapViewOpen(
                  (previous) =>
                    !previous
                )
              }
              className="
                relative
                z-[3001]
                w-full
                h-[60px]
                bg-white/95
                backdrop-blur-xl
                rounded-2xl
                border
                border-[#E7EAF1]
                px-5
                flex
                items-center
                justify-between
                shadow-[0_12px_35px_rgba(15,23,42,0.12)]
                hover:border-violet-300
                hover:shadow-[0_18px_45px_rgba(15,23,42,0.16)]
                transition-all
                duration-200
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >
                {(() => {
                  const Icon =
                    selectedView.icon;

                  return (
                    <Icon
                      size={21}
                      className={
                        selectedView.color
                      }
                    />
                  );
                })()}

                <span
                  className="
                    text-[16px]
                    font-semibold
                    text-[#334155]
                  "
                >
                  {
                    selectedView.label
                  }
                </span>
              </div>

              <ChevronDown
                size={20}
                className={`
                  text-gray-700
                  transition-transform
                  duration-200
                  ${
                    mapViewOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {/* =================================================
                MAP VIEW OPTIONS
            ================================================= */}

            {mapViewOpen && (
              <div
                className="
                  relative
                  z-[3002]
                  mt-2
                  bg-white
                  rounded-2xl
                  border
                  border-[#EEF1F6]
                  shadow-[0_20px_45px_rgba(15,23,42,0.18)]
                  overflow-hidden
                "
              >
                {mapViews.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    const isSelected =
                      selectedView.id ===
                      item.id;

                    return (
                      <button
                        key={
                          item.id
                        }
                        type="button"
                        onClick={() =>
                          handleSelectMapView(
                            item
                          )
                        }
                        className={`
                          w-full
                          min-h-[68px]
                          px-5
                          flex
                          items-center
                          justify-between
                          transition-all
                          duration-200

                          ${
                            isSelected
                              ? "bg-violet-50"
                              : "hover:bg-gray-50"
                          }
                        `}
                      >
                        <div
                          className="
                            flex
                            items-center
                            gap-4
                          "
                        >
                          <Icon
                            size={21}
                            className={
                              item.color
                            }
                          />

                          <span
                            className="
                              text-[15px]
                              font-medium
                              text-gray-700
                              text-left
                            "
                          >
                            {
                              item.label
                            }
                          </span>
                        </div>

                        {isSelected && (
                          <Check
                            size={20}
                            className="
                              text-violet-600
                            "
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* =================================================
              ROUTE MAP FILTERS

              RIGHT SIDE

              THESE ARE ALWAYS RENDERED FOR ROUTE MAP.

              HIGH Z-INDEX IS IMPORTANT BECAUSE LEAFLET
              OTHERWISE CAN COVER THESE CONTROLS.
          ================================================= */}

          {selectedView.id ===
            "route" && (
            <div
              className="
                absolute
                top-6
                right-6
                z-[3000]
                flex
                items-start
                gap-4
              "
            >
              {/* =================================================
                  DIVISION FILTER
              ================================================= */}

              <div
                ref={divisionRef}
                className="
                  relative
                  w-[290px]
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    setDivisionOpen(
                      (previous) =>
                        !previous
                    );

                    setWardOpen(
                      false
                    );
                  }}
                  className="
                    relative
                    z-[3001]
                    appearance-none
                    w-full
                    h-[56px]
                    bg-white/95
                    backdrop-blur-xl
                    rounded-2xl
                    border
                    border-[#E7EAF1]
                    px-5
                    pr-12
                    text-[15px]
                    font-semibold
                    text-[#334155]
                    text-left
                    shadow-[0_12px_35px_rgba(15,23,42,0.12)]
                    hover:border-violet-300
                    hover:shadow-[0_18px_45px_rgba(15,23,42,0.16)]
                    transition-all
                    duration-200
                  "
                >
                  {
                    selectedDivision
                  }

                  <ChevronDown
                    size={19}
                    className={`
                      absolute
                      right-5
                      top-1/2
                      -translate-y-1/2
                      text-gray-600
                      transition-transform
                      duration-200
                      ${
                        divisionOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {/* ---------------------------------------------
                    DIVISION MENU
                --------------------------------------------- */}

                {divisionOpen && (
                  <div
                    className="
                      absolute
                      top-[62px]
                      left-0
                      z-[3002]
                      w-full
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#EEF1F6]
                      bg-white
                      shadow-[0_20px_45px_rgba(15,23,42,0.18)]
                    "
                  >
                    {divisionOptions.map(
                      (
                        division
                      ) => (
                        <button
                          key={
                            division
                          }
                          type="button"
                          onClick={() =>
                            handleDivisionChange(
                              division
                            )
                          }
                          className={`
                            w-full
                            px-5
                            py-4
                            flex
                            items-center
                            justify-between
                            text-left
                            text-[14px]
                            font-medium
                            transition
                            ${
                              selectedDivision ===
                              division
                                ? "bg-violet-50 text-violet-700"
                                : "text-slate-700 hover:bg-gray-50"
                            }
                          `}
                        >
                          <span>
                            {
                              division
                            }
                          </span>

                          {selectedDivision ===
                            division && (
                            <Check
                              size={
                                17
                              }
                              className="
                                text-violet-600
                              "
                            />
                          )}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* =================================================
                  WARD FILTER
              ================================================= */}

              <div
                ref={wardRef}
                className="
                  relative
                  w-[290px]
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    setWardOpen(
                      (previous) =>
                        !previous
                    );

                    setDivisionOpen(
                      false
                    );
                  }}
                  className="
                    relative
                    z-[3001]
                    appearance-none
                    w-full
                    h-[56px]
                    bg-white/95
                    backdrop-blur-xl
                    rounded-2xl
                    border
                    border-[#E7EAF1]
                    px-5
                    pr-12
                    text-[15px]
                    font-semibold
                    text-[#334155]
                    text-left
                    shadow-[0_12px_35px_rgba(15,23,42,0.12)]
                    hover:border-violet-300
                    hover:shadow-[0_18px_45px_rgba(15,23,42,0.16)]
                    transition-all
                    duration-200
                  "
                >
                  {
                    selectedWard
                  }

                  <ChevronDown
                    size={19}
                    className={`
                      absolute
                      right-5
                      top-1/2
                      -translate-y-1/2
                      text-gray-600
                      transition-transform
                      duration-200
                      ${
                        wardOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {/* ---------------------------------------------
                    WARD MENU
                --------------------------------------------- */}

                {wardOpen && (
                  <div
                    className="
                      absolute
                      top-[62px]
                      left-0
                      z-[3002]
                      w-full
                      max-h-[360px]
                      overflow-y-auto
                      rounded-2xl
                      border
                      border-[#EEF1F6]
                      bg-white
                      shadow-[0_20px_45px_rgba(15,23,42,0.18)]
                    "
                  >
                    {wardOptions.map(
                      (ward) => (
                        <button
                          key={
                            ward
                          }
                          type="button"
                          onClick={() =>
                            handleWardChange(
                              ward
                            )
                          }
                          className={`
                            w-full
                            px-5
                            py-4
                            flex
                            items-center
                            justify-between
                            text-left
                            text-[14px]
                            font-medium
                            transition
                            ${
                              selectedWard ===
                              ward
                                ? "bg-violet-50 text-violet-700"
                                : "text-slate-700 hover:bg-gray-50"
                            }
                          `}
                        >
                          <span>
                            {
                              ward
                            }
                          </span>

                          {selectedWard ===
                            ward && (
                            <Check
                              size={
                                17
                              }
                              className="
                                text-violet-600
                              "
                            />
                          )}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================
              ROUTE FILTER STATUS

              SMALL STATUS BOX WHEN NOTHING IS SELECTED
          ================================================= */}

          {selectedView.id ===
            "route" &&
            selectedWard ===
              "All Wards" && (
              <div
                className="
                  absolute
                  bottom-6
                  left-1/2
                  -translate-x-1/2
                  z-[2000]
                  pointer-events-none
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    bg-white/95
                    backdrop-blur-xl
                    border
                    border-gray-100
                    px-5
                    py-3
                    shadow-[0_15px_40px_rgba(15,23,42,0.12)]
                  "
                >
                  <Route
                    size={19}
                    className="
                      text-violet-600
                    "
                  />

                  <span
                    className="
                      text-[13px]
                      font-semibold
                      text-slate-700
                    "
                  >
                    Please select a ward
                    from the filters.
                  </span>
                </div>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}