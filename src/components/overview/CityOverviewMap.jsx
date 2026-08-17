import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  Check,
  Map,
  Route,
  MapPinned,
  Factory,
  Megaphone,
} from "lucide-react";

import { gsap } from "gsap";

import { useFilters } from "../../contexts/FilterContext";

import MapSection from "../dashboard/MapSection";

/*
============================================================
CITY OVERVIEW MAP
============================================================

IMPORTANT:

The Header is the SINGLE SOURCE OF TRUTH for:

    City
    Zone
    Division
    Ward

We DO NOT create another Division/Ward state here.

The flow is:

Header
   ↓
FilterContext
   ↓
CityOverviewMap
   ↓
MapSection
   ↓
/api/route-map?date=...&wardNo=...

============================================================
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
============================================================
HELPER
============================================================
*/

function getWardNumber(selectedWard) {
  if (!selectedWard) {
    return "";
  }

  /*
  Header / FilterContext ward structure:

  {
    wardId,
    wardNo,
    wardName,
    divisionId,
    divisionName,
    ...
  }

  We ONLY need wardNo for the route API.
  */

  if (
    selectedWard.wardNo !== undefined &&
    selectedWard.wardNo !== null &&
    selectedWard.wardNo !== ""
  ) {
    return String(selectedWard.wardNo);
  }

  /*
  Defensive fallbacks in case an older object
  is still being returned somewhere.
  */

  if (
    selectedWard.ward_no !== undefined &&
    selectedWard.ward_no !== null &&
    selectedWard.ward_no !== ""
  ) {
    return String(selectedWard.ward_no);
  }

  if (
    selectedWard.wardId !== undefined &&
    selectedWard.wardId !== null &&
    selectedWard.wardId !== ""
  ) {
    return String(selectedWard.wardId);
  }

  if (
    typeof selectedWard === "number" ||
    typeof selectedWard === "string"
  ) {
    const value = String(selectedWard);

    if (value !== "All Wards") {
      return value;
    }
  }

  return "";
}

/*
============================================================
MAIN COMPONENT
============================================================
*/

export default function CityOverviewMap({
  selectedDate,
}) {
  /*
  ==========================================================
  HEADER FILTER CONTEXT
  ==========================================================

  THESE ARE THE SAME VALUES USED BY HEADER.JSX.

  DO NOT create separate local states for them.

  ==========================================================
  */

  const {
    selectedCity,
    selectedZone,
    selectedDivision,
    selectedWard,
  } = useFilters();

  /*
  ==========================================================
  MAP VIEW STATE
  ==========================================================
  */

  const [selectedView, setSelectedView] =
    useState(mapViews[0]);

  const [open, setOpen] =
    useState(false);

  /*
  ==========================================================
  REFS
  ==========================================================
  */

  const sectionRef =
    useRef(null);

  const headerRef =
    useRef(null);

  const mapRef =
    useRef(null);

  const controlsRef =
    useRef(null);

  const dropdownRef =
    useRef(null);

  /*
  ==========================================================
  RESOLVE WARD
  ==========================================================

  Example:

  Header:

      Ward 216

  becomes:

      "216"

  and MapSection receives:

      wardNo="216"

  ==========================================================
  */

  const wardNo =
    getWardNumber(selectedWard);

  /*
  ==========================================================
  RESOLVE DATE
  ==========================================================

  If the parent already supplies selectedDate,
  we use it.

  Otherwise use today's date.

  ==========================================================
  */

  const resolvedDate =
    selectedDate ||
    new Date()
      .toISOString()
      .slice(0, 10);

  /*
  ==========================================================
  DEBUG

  Keep these logs temporarily while testing.

  They will show exactly what the Header is giving us.
  ==========================================================
  */

  useEffect(() => {
    console.log(
      "==============================================",
    );

    console.log(
      "CITY OVERVIEW MAP — HEADER FILTER STATE",
    );

    console.log(
      "City:",
      selectedCity,
    );

    console.log(
      "Zone:",
      selectedZone,
    );

    console.log(
      "Division:",
      selectedDivision,
    );

    console.log(
      "Ward:",
      selectedWard,
    );

    console.log(
      "Resolved Ward Number:",
      wardNo,
    );

    console.log(
      "Selected Date:",
      resolvedDate,
    );

    console.log(
      "Map View:",
      selectedView.id,
    );

    console.log(
      "==============================================",
    );
  }, [
    selectedCity,
    selectedZone,
    selectedDivision,
    selectedWard,
    wardNo,
    resolvedDate,
    selectedView.id,
  ]);

  /*
  ==========================================================
  PAGE LOAD ANIMATION
  ==========================================================
  */

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    if (sectionRef.current) {
      tl.from(sectionRef.current, {
        opacity: 0,
        y: 28,
        duration: 0.45,
      });
    }

    if (headerRef.current) {
      tl.from(
        headerRef.current,
        {
          opacity: 0,
          y: 18,
          duration: 0.45,
        },
        "-=0.25",
      );
    }

    if (mapRef.current) {
      tl.from(
        mapRef.current,
        {
          opacity: 0,
          scale: 0.985,
          duration: 0.8,
        },
        "-=0.2",
      );
    }

    if (controlsRef.current) {
      tl.from(
        controlsRef.current,
        {
          opacity: 0,
          x: -18,
          duration: 0.55,
        },
        "-=0.55",
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  /*
  ==========================================================
  DROPDOWN ANIMATION
  ==========================================================
  */

  useEffect(() => {
    if (!dropdownRef.current) {
      return;
    }

    if (open) {
      gsap.fromTo(
        dropdownRef.current,
        {
          opacity: 0,
          y: -10,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.28,
          ease: "power2.out",
        },
      );
    }
  }, [open]);

  /*
  ==========================================================
  MAP VIEW SELECTION
  ==========================================================
  */

  const handleSelect = (item) => {
    if (
      item.id ===
      selectedView.id
    ) {
      setOpen(false);

      return;
    }

    /*
    Animate map out first.
    */

    if (mapRef.current) {
      gsap.to(
        mapRef.current,
        {
          opacity: 0,
          scale: 0.992,
          duration: 0.18,
          ease: "power2.out",

          onComplete: () => {
            setSelectedView(item);

            requestAnimationFrame(() => {
              if (mapRef.current) {
                gsap.to(
                  mapRef.current,
                  {
                    opacity: 1,
                    scale: 1,
                    duration: 0.35,
                    ease: "power3.out",
                  },
                );
              }
            });
          },
        },
      );
    } else {
      setSelectedView(item);
    }

    setOpen(false);
  };

  /*
  ==========================================================
  CURRENT FILTER LABELS
  ==========================================================
  */

  const cityLabel =
    selectedCity?.cityName ||
    selectedCity?.city_name ||
    selectedCity?.name ||
    "All Cities";

  const zoneLabel =
    selectedZone?.zoneName ||
    selectedZone?.zone_name ||
    selectedZone?.name ||
    "All Zones";

  const divisionLabel =
    selectedDivision?.divisionName ||
    selectedDivision?.division_name ||
    selectedDivision?.name ||
    "All Divisions";

  const wardLabel =
    selectedWard?.wardName ||
    selectedWard?.ward_name ||
    selectedWard?.name ||
    (wardNo
      ? `Ward ${wardNo}`
      : "All Wards");

  /*
  ==========================================================
  RENDER
  ==========================================================
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

        {/* ==================================================
            HEADER
        ================================================== */}

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

        {/* ==================================================
            MAP
        ================================================== */}

        <div
          className="
            relative
            mx-2
            mb-2
            rounded-[22px]
            overflow-hidden
          "
        >

          <div
            ref={mapRef}
            className="
              relative
              h-[560px]
              z-0
            "
          >

            {/* ==================================================
                MAP SECTION

                IMPORTANT:

                wardNo comes directly from Header.

                selectedDivision is also passed for future
                division-level filtering, but the current
                backend route API filters by wardNo.

                The MapSection currently accepts wardNo.
            ================================================== */}

            <MapSection
              key={`${selectedView.id}-${wardNo}-${resolvedDate}`}
              mapView={selectedView.id}
              selectedDate={resolvedDate}
              wardNo={wardNo}
            />

          </div>

          {/* ==================================================
              MAP VIEW CONTROL
          ================================================== */}

          <div
            ref={controlsRef}
            className="
              absolute
              top-6
              left-6
              z-[1000]
              w-[375px]
            "
          >

            <p
              className="
                text-[13px]
                font-medium
                text-gray-700
                mb-3
              "
            >
              Select Map View
            </p>

            {/* ==================================================
                SELECTED VIEW BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                setOpen(
                  (prev) => !prev,
                )
              }
              className="
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
                hover:shadow-[0_18px_40px_rgba(15,23,42,0.15)]
                transition-all
                duration-300
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
                  {selectedView.label}
                </span>

              </div>

              <ChevronDown
                size={20}
                className={`
                  text-gray-700
                  transition-all
                  duration-300
                  ${
                    open
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>

            {/* ==================================================
                MAP VIEW OPTIONS
            ================================================== */}

            {open && (
              <div
                ref={dropdownRef}
                className="
                  mt-2
                  bg-white/95
                  backdrop-blur-2xl
                  rounded-2xl
                  border
                  border-[#EEF1F6]
                  shadow-[0_20px_45px_rgba(15,23,42,0.18)]
                  overflow-hidden
                  origin-top
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
                        type="button"
                        key={item.id}
                        onClick={() =>
                          handleSelect(
                            item,
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
                            {item.label}
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
                  },
                )}

              </div>
            )}

          </div>

          {/* ==================================================
              HEADER FILTER STATUS

              IMPORTANT:

              These are NOT independent filters.

              They simply DISPLAY the values selected
              in the Header.

              Clicking/changing them here is intentionally
              impossible.

          ================================================== */}

          {selectedView.id ===
            "route" && (
            <div
              className="
                absolute
                top-6
                right-6
                z-[1000]
                flex
                items-center
                gap-3
              "
            >

              {/* ==================================================
                  DIVISION STATUS
              ================================================== */}

              <div
                className="
                  h-[56px]
                  min-w-[240px]
                  px-5
                  bg-white/95
                  backdrop-blur-xl
                  rounded-2xl
                  border
                  border-[#E7EAF1]
                  shadow-[0_12px_35px_rgba(15,23,42,0.12)]
                  flex
                  flex-col
                  justify-center
                "
              >

                <span
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Division
                </span>

                <span
                  className="
                    text-[14px]
                    font-semibold
                    text-[#334155]
                    truncate
                  "
                >
                  {divisionLabel}
                </span>

              </div>

              {/* ==================================================
                  WARD STATUS
              ================================================== */}

              <div
                className="
                  h-[56px]
                  min-w-[240px]
                  px-5
                  bg-white/95
                  backdrop-blur-xl
                  rounded-2xl
                  border
                  border-[#E7EAF1]
                  shadow-[0_12px_35px_rgba(15,23,42,0.12)]
                  flex
                  flex-col
                  justify-center
                "
              >

                <span
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-wide
                    text-slate-400
                  "
                >
                  Ward
                </span>

                <span
                  className="
                    text-[14px]
                    font-semibold
                    text-[#334155]
                    truncate
                  "
                >
                  {wardNo
                    ? `${wardLabel} (${wardNo})`
                    : wardLabel}
                </span>

              </div>

            </div>
          )}

          {/* ==================================================
              NO WARD SELECTED OVERLAY

              Only shown for Route Map.

          ================================================== */}

          {selectedView.id ===
            "route" &&
            !wardNo && (
              <div
                className="
                  absolute
                  left-1/2
                  bottom-10
                  -translate-x-1/2
                  z-[900]
                  bg-white/95
                  backdrop-blur-xl
                  rounded-2xl
                  border
                  border-violet-100
                  shadow-[0_15px_40px_rgba(15,23,42,0.12)]
                  px-6
                  py-4
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    w-9
                    h-9
                    rounded-xl
                    bg-violet-50
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Route
                    size={18}
                    className="
                      text-violet-600
                    "
                  />

                </div>

                <div>

                  <p
                    className="
                      text-[13px]
                      font-semibold
                      text-slate-700
                    "
                  >
                    Please select a ward
                  </p>

                  <p
                    className="
                      text-[11px]
                      text-slate-400
                      mt-0.5
                    "
                  >
                    Choose a ward from the Header
                    to view vehicle routes.
                  </p>

                </div>

              </div>
            )}

        </div>

      </div>
    </section>
  );
}