import {
  Search,
  Globe,
  ChevronDown,
  LogOut,
  Check,
  Menu,
} from "lucide-react";

import { useFilters } from "../../contexts/FilterContext";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { gsap } from "gsap";

import Calendar from "../Calendar/Calendar";

import { useLanguage } from "../../i18n";

import SewacLogo from "../../assets/sewac_logo.svg";

/* =========================================================
   API CONFIGURATION

   IMPORTANT:
   Header now uses the SAME City Overview Map endpoint
   as CityMapOverview.jsx.

   This makes the Header geographic hierarchy come from
   the actual master-citizen DB map data.
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sewac-main.onrender.com";

/* =========================================================
   SAME ENDPOINT USED BY CITY OVERVIEW MAP
========================================================= */

const CITY_MAP_ENDPOINT = (cityId) =>
  `${API_BASE_URL}/api/master-citizen/map/city/${encodeURIComponent(
    cityId
  )}`;

/* =========================================================
   FALLBACK CITY ENDPOINT

   Used only if FilterContext has not populated cities.
========================================================= */

const CITIES_ENDPOINT =
  `${API_BASE_URL}/api/filters/cities`;

/* =========================================================
   ZONE COLORS

   EXACT SAME SOFT COLORS USED BY CITY OVERVIEW MAP.
========================================================= */

const ZONE_COLORS = [
  "#93C5FD",
  "#C4B5FD",
  "#86EFAC",
  "#FDE68A",
  "#F9A8D4",
];

/* =========================================================
   LANGUAGE OPTIONS

   IMPORTANT:
   These labels are plain strings.

   NEVER write:

      label: Telugu

   Always write:

      label: "తెలుగు"
========================================================= */

const languages = [
  {
    code: "en",
    label: "English",
  },
  {
    code: "kn",
    label: "ಕನ್ನಡ",
  },
  {
    code: "hi",
    label: "हिंदी",
  },
  {
    code: "te",
    label: "తెలుగు",
  },
  {
    code: "ta",
    label: "தமிழ்",
  },
  {
    code: "ma",
    label: "മലയാളം",
  },
];

/* =========================================================
   ROLE LABELS
========================================================= */

const ROLE_LABELS = {
  ADMIN_LAYER_1: "Admin Layer 1",
  ADMIN_LAYER_2: "Admin Layer 2",
  WORKER: "Worker",
};

/* =========================================================
   GET USER FROM TOKEN
========================================================= */

function getUserFromToken() {
  try {
    const token =
      sessionStorage.getItem("token");

    if (!token) {
      return {
        name: "Admin",
        role: "ADMIN_LAYER_1",
      };
    }

    const payload =
      token.split(".")[1];

    if (!payload) {
      return {
        name: "Admin",
        role: "ADMIN_LAYER_1",
      };
    }

    const decoded =
      JSON.parse(
        atob(
          payload
            .replace(/-/g, "+")
            .replace(/_/g, "/")
        )
      );

    return {
      name:
        decoded.full_name ||
        "Admin",

      role:
        decoded.role ||
        "ADMIN_LAYER_1",
    };
  } catch (error) {
    console.error(
      "Failed to decode authentication token:",
      error
    );

    return {
      name: "Admin",
      role: "ADMIN_LAYER_1",
    };
  }
}

/* =========================================================
   ROLE LABEL
========================================================= */

function getRoleLabel(role) {
  return (
    ROLE_LABELS[role] ||
    role ||
    "Admin Layer 1"
  );
}

/* =========================================================
   ENTITY HELPERS

   These intentionally support both:
   - snake_case DB response
   - camelCase map response
========================================================= */

function getCityId(city) {
  if (!city) {
    return null;
  }

  return (
    city.city_id ??
    city.cityId ??
    city.id ??
    null
  );
}

function getCityName(city) {
  if (!city) {
    return "";
  }

  return (
    city.city_name ??
    city.cityName ??
    city.name ??
    ""
  );
}

function getZoneId(zone) {
  if (!zone) {
    return null;
  }

  return (
    zone.zone_id ??
    zone.zoneId ??
    zone.id ??
    null
  );
}

function getZoneName(zone) {
  if (!zone) {
    return "";
  }

  return (
    zone.zone_name ??
    zone.zoneName ??
    zone.name ??
    ""
  );
}

function getDivisionId(division) {
  if (!division) {
    return null;
  }

  return (
    division.division_id ??
    division.divisionId ??
    division.id ??
    null
  );
}

function getDivisionName(division) {
  if (!division) {
    return "";
  }

  return (
    division.division_name ??
    division.divisionName ??
    division.name ??
    ""
  );
}

function getWardId(ward) {
  if (!ward) {
    return null;
  }

  return (
    ward.ward_id ??
    ward.wardId ??
    ward.id ??
    null
  );
}

function getWardName(ward) {
  if (!ward) {
    return "";
  }

  return (
    ward.ward_name ??
    ward.wardName ??
    ward.name ??
    ""
  );
}

function getWardNumber(ward) {
  if (!ward) {
    return null;
  }

  return (
    ward.ward_no ??
    ward.wardNo ??
    ward.ward_number ??
    ward.wardNumber ??
    null
  );
}

/* =========================================================
   CHILD COLLECTION HELPERS

   City Overview Map's actual response contains:

   zones
      ↓
   divisions
      ↓
   wards

   We support both nested and alternate property names.
========================================================= */

function getZoneDivisions(zone) {
  if (!zone) {
    return [];
  }

  if (Array.isArray(zone.divisions)) {
    return zone.divisions;
  }

  if (Array.isArray(zone.zone_divisions)) {
    return zone.zone_divisions;
  }

  return [];
}

function getDivisionWards(division) {
  if (!division) {
    return [];
  }

  if (Array.isArray(division.wards)) {
    return division.wards;
  }

  if (Array.isArray(division.division_wards)) {
    return division.division_wards;
  }

  return [];
}

/* =========================================================
   SAME ENTITY

   Handles number/string ID differences safely.
========================================================= */

function sameId(a, b) {
  if (
    a === null ||
    a === undefined ||
    b === null ||
    b === undefined
  ) {
    return false;
  }

  return String(a) === String(b);
}

function sameEntity(
  first,
  second,
  idGetter,
  nameGetter
) {
  if (!first || !second) {
    return false;
  }

  const firstId =
    idGetter(first);

  const secondId =
    idGetter(second);

  if (
    firstId !== null &&
    firstId !== undefined &&
    secondId !== null &&
    secondId !== undefined
  ) {
    return sameId(
      firstId,
      secondId
    );
  }

  const firstName =
    nameGetter(first);

  const secondName =
    nameGetter(second);

  if (
    firstName &&
    secondName
  ) {
    return (
      String(firstName)
        .trim()
        .toLowerCase() ===
      String(secondName)
        .trim()
        .toLowerCase()
    );
  }

  return false;
}

/* =========================================================
   DROPDOWN
========================================================= */

function Dropdown({
  width,
  value,
  options = [],
  onChange,
  placeholder = "Select",
  getLabel,
  getKey,
  renderOption,
  loading = false,
  disabled = false,
}) {
  const [open, setOpen] =
    useState(false);

  const wrapperRef =
    useRef(null);

  const menuRef =
    useRef(null);

  /* =======================================================
     CLOSE OUTSIDE
  ======================================================= */

  useEffect(() => {
    const close = (event) => {
      if (
        !wrapperRef.current?.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    };

    window.addEventListener(
      "mousedown",
      close
    );

    return () => {
      window.removeEventListener(
        "mousedown",
        close
      );
    };
  }, []);

  /* =======================================================
     GSAP DROPDOWN ANIMATION
  ======================================================= */

  useEffect(() => {
    if (
      open &&
      menuRef.current
    ) {
      gsap.fromTo(
        menuRef.current,
        {
          opacity: 0,
          scale: 0.96,
          y: -8,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.22,
          ease: "power3.out",
        }
      );
    }
  }, [open]);

  /* =======================================================
     OPTION LABEL
  ======================================================= */

  const getOptionLabel = (
    item
  ) => {
    if (getLabel) {
      return getLabel(item);
    }

    return (
      item?.city_name ||
      item?.cityName ||
      item?.zone_name ||
      item?.zoneName ||
      item?.division_name ||
      item?.divisionName ||
      item?.ward_name ||
      item?.wardName ||
      String(item ?? "")
    );
  };

  /* =======================================================
     OPTION KEY
  ======================================================= */

  const getOptionKey = (
    item,
    index
  ) => {
    if (getKey) {
      return (
        getKey(item) ??
        `${getOptionLabel(item)}-${index}`
      );
    }

    return (
      item?.city_id ??
      item?.cityId ??
      item?.zone_id ??
      item?.zoneId ??
      item?.division_id ??
      item?.divisionId ??
      item?.ward_id ??
      item?.wardId ??
      `${getOptionLabel(item)}-${index}`
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      ref={wrapperRef}
      className={`
        relative
        shrink-0
        ${width}
      `}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) {
            return;
          }

          setOpen(
            (previous) =>
              !previous
          );
        }}
        className={`
          w-full
          h-9
          rounded-xl
          border
          border-gray-200
          bg-white
          px-3
          flex
          items-center
          justify-between
          gap-2
          text-[12px]
          font-medium
          text-[#16295A]
          transition-all
          duration-300
          ${
            disabled
              ? "cursor-not-allowed bg-gray-50 text-gray-400"
              : "hover:border-violet-400"
          }
        `}
      >
        <span
          className="
            min-w-0
            truncate
            text-left
          "
        >
          {loading
            ? "Loading..."
            : value ||
              placeholder}
        </span>

        <ChevronDown
          size={14}
          className={`
            shrink-0
            transition-transform
            duration-300
            ${
              open
                ? "rotate-180"
                : ""
            }
          `}
        />
      </button>

      {open && !disabled && (
        <div
          ref={menuRef}
          className="
            absolute
            top-11
            left-0
            w-full
            max-h-[315px]
            overflow-x-auto
            overflow-y-auto
            rounded-2xl
            bg-white
            border
            border-gray-100
            shadow-[0_15px_40px_rgba(0,0,0,0.08)]
            z-[10000]
            scrollbar-thin
            scrollbar-thumb-violet-300
            scrollbar-track-transparent
          "
        >
          {loading ? (
            <div
              className="
                px-4
                py-3
                text-[12px]
                text-gray-400
              "
            >
              Loading...
            </div>
          ) : options.length === 0 ? (
            <div
              className="
                px-4
                py-3
                text-[12px]
                text-gray-400
              "
            >
              No options available
            </div>
          ) : (
            options.map(
              (
                item,
                index
              ) => {
                const label =
                  getOptionLabel(
                    item
                  );

                const key =
                  getOptionKey(
                    item,
                    index
                  );

                const isSelected =
                  label === value;

                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => {
                      onChange?.(
                        item
                      );

                      setOpen(
                        false
                      );
                    }}
                    className="
                      w-full
                      min-w-max
                      px-4
                      py-2.5
                      flex
                      items-center
                      justify-between
                      gap-5
                      text-left
                      text-[12px]
                      text-[#16295A]
                      hover:bg-violet-50
                      transition
                    "
                  >
                    <span
                      className="
                        whitespace-nowrap
                        min-w-max
                        flex
                        items-center
                        gap-2
                      "
                    >
                      {renderOption
                        ? renderOption(
                            item,
                            index
                          )
                        : label}
                    </span>

                    {isSelected && (
                      <Check
                        size={14}
                        className="
                          shrink-0
                          text-violet-600
                        "
                      />
                    )}
                  </button>
                );
              }
            )
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

export default function Header({
  variant = "dashboard",

  selectedDate =
    new Date()
      .toISOString()
      .split("T")[0],

  setSelectedDate = () => {},
}) {
  /* =======================================================
     LANGUAGE
  ======================================================= */

  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  /* =======================================================
     GLOBAL FILTER CONTEXT
  ======================================================= */

  const {
    selectedCity,
    selectedZone,
    selectedDivision,
    selectedWard,

    setSelectedCity,
    setSelectedZone,
    setSelectedDivision,
    setSelectedWard,

    cities,
  } = useFilters();

  /* =======================================================
     LOCAL MASTER-CITIZEN MAP DATA

     IMPORTANT:

     We intentionally DO NOT use the old generic
     `zones`, `divisions`, `wards` arrays from FilterContext.

     Header now uses the exact same geographic source
     as City Overview Map.

     API:

       /api/master-citizen/map/city/:cityId

     Response:

       city
       zones[]
         divisions[]
           wards[]
  ======================================================= */

  const [
    mapZones,
    setMapZones,
  ] = useState([]);

  const [
    mapLoading,
    setMapLoading,
  ] = useState(false);

  const [
    mapError,
    setMapError,
  ] = useState("");

  /* =======================================================
     FALLBACK CITIES

     Usually FilterContext already has cities.

     This fallback prevents the Header from being empty
     if the context has not finished loading.
  ======================================================= */

  const [
    fallbackCities,
    setFallbackCities,
  ] = useState([]);

  /* =======================================================
     LOCAL REFS
  ======================================================= */

  const headerRef =
    useRef(null);

  const controlsRef =
    useRef(null);

  const searchRef =
    useRef(null);

  const profileRef =
    useRef(null);

  const languageRef =
    useRef(null);

  const mapRequestRef =
    useRef(0);

  /* =======================================================
     UI STATE
  ======================================================= */

  const [dayType, setDayType] =
    useState("wet");

  const [search, setSearch] =
    useState("");

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [languageOpen, setLanguageOpen] =
    useState(false);

  const isDashboard =
    variant === "dashboard";

  /* =======================================================
     CITY OPTIONS

     Prefer FilterContext.

     Fallback to API only when necessary.
  ======================================================= */

  const cityOptions =
    useMemo(() => {
      if (
        Array.isArray(cities) &&
        cities.length > 0
      ) {
        return cities;
      }

      return fallbackCities;
    }, [
      cities,
      fallbackCities,
    ]);

  /* =======================================================
     USER
  ======================================================= */

  const getCurrentUser = () => {
    try {
      const hash =
        window.location.hash;

      if (
        hash.startsWith("#auth=")
      ) {
        const encodedAuth =
          hash.substring(
            "#auth=".length
          );

        const authData =
          JSON.parse(
            decodeURIComponent(
              encodedAuth
            )
          );

        if (authData?.token) {
          sessionStorage.setItem(
            "token",
            authData.token
          );
        }

        if (authData?.admin) {
          sessionStorage.setItem(
            "admin",
            JSON.stringify(
              authData.admin
            )
          );
        }

        window.history.replaceState(
          null,
          "",
          window.location.pathname +
            window.location.search
        );
      }

      const storedAdmin =
        sessionStorage.getItem(
          "admin"
        );

      let admin = null;

      if (storedAdmin) {
        try {
          admin =
            JSON.parse(
              storedAdmin
            );
        } catch (error) {
          console.error(
            "Failed to parse stored admin:",
            error
          );
        }
      }

      const token =
        sessionStorage.getItem(
          "token"
        );

      let decoded = null;

      if (token) {
        try {
          const payload =
            token.split(".")[1];

          if (payload) {
            decoded =
              JSON.parse(
                atob(
                  payload
                    .replace(
                      /-/g,
                      "+"
                    )
                    .replace(
                      /_/g,
                      "/"
                    )
                )
              );
          }
        } catch (error) {
          console.error(
            "Failed to decode authentication token:",
            error
          );
        }
      }

      if (
        admin ||
        decoded
      ) {
        return {
          name:
            admin?.full_name ||
            decoded?.full_name ||
            "Admin",

          role:
            admin?.role ||
            decoded?.role ||
            "ADMIN_LAYER_1",
        };
      }
    } catch (error) {
      console.error(
        "Failed to read authenticated user:",
        error
      );
    }

    return getUserFromToken();
  };

  const user =
    getCurrentUser();

  const roleLabel =
    getRoleLabel(
      user.role
    );

  const userInitial =
    user?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||
    "A";

  /* =======================================================
     DATE
  ======================================================= */

  const selectedDateObj =
    selectedDate
      ? new Date(
          `${selectedDate}T12:00:00`
        )
      : new Date();

  const selectedDay =
    selectedDateObj.getDay();

  const isDryDay =
    selectedDay === 3 ||
    selectedDay === 6;

  useEffect(() => {
    if (!isDryDay) {
      setDayType("wet");
    }
  }, [
    selectedDate,
    isDryDay,
  ]);

  /* =======================================================
     LOAD FALLBACK CITIES

     Only runs if FilterContext does not have cities.
  ======================================================= */

  useEffect(() => {
    if (
      Array.isArray(cities) &&
      cities.length > 0
    ) {
      return;
    }

    let cancelled =
      false;

    const loadCities =
      async () => {
        try {
          const response =
            await fetch(
              CITIES_ENDPOINT,
              {
                method: "GET",
                headers: {
                  Accept:
                    "application/json",
                },
              }
            );

          if (
            !response.ok
          ) {
            throw new Error(
              `City request failed with status ${response.status}`
            );
          }

          const result =
            await response.json();

          const data =
            Array.isArray(
              result
            )
              ? result
              : Array.isArray(
                  result?.data
                )
                ? result.data
                : [];

          if (!cancelled) {
            setFallbackCities(
              data
            );
          }
        } catch (error) {
          console.error(
            "Header city fallback request failed:",
            error
          );

          if (!cancelled) {
            setFallbackCities(
              []
            );
          }
        }
      };

    loadCities();

    return () => {
      cancelled = true;
    };
  }, [cities]);

  /* =======================================================
     LOAD EXACT CITY OVERVIEW MAP DATA

     THIS IS THE MAIN FIX.

     City Overview Map uses this same endpoint.
  ======================================================= */

  useEffect(() => {
    const cityId =
      getCityId(
        selectedCity
      );

    if (!cityId) {
      setMapZones([]);
      setMapError("");
      setMapLoading(false);
      return;
    }

    const requestId =
      ++mapRequestRef.current;

    const controller =
      new AbortController();

    const loadCityMap =
      async () => {
        try {
          setMapLoading(true);
          setMapError("");

          const endpoint =
            CITY_MAP_ENDPOINT(
              cityId
            );

          console.log(
            "============================================================"
          );

          console.log(
            "HEADER CITY MAP REQUEST"
          );

          console.log(
            "CITY ID:",
            cityId
          );

          console.log(
            "ENDPOINT:",
            endpoint
          );

          console.log(
            "============================================================"
          );

          const response =
            await fetch(
              endpoint,
              {
                method: "GET",
                headers: {
                  Accept:
                    "application/json",
                },
                signal:
                  controller.signal,
              }
            );

          if (
            !response.ok
          ) {
            throw new Error(
              `City map request failed with status ${response.status}`
            );
          }

          const result =
            await response.json();

          if (
            result?.success ===
            false
          ) {
            throw new Error(
              result.message ||
                "Unable to load city geographic data."
            );
          }

          const loadedZones =
            Array.isArray(
              result?.zones
            )
              ? result.zones
              : [];

          if (
            requestId !==
            mapRequestRef.current
          ) {
            return;
          }

          setMapZones(
            loadedZones
          );

          console.log(
            "HEADER CITY MAP LOADED"
          );

          console.log(
            "CITY:",
            result?.city?.cityName ||
              result?.city?.city_name
          );

          console.log(
            "ZONES:",
            loadedZones.length
          );

          console.log(
            "ZONE NAMES:",
            loadedZones.map(
              (zone) =>
                getZoneName(
                  zone
                )
            )
          );
        } catch (
          error
        ) {
          if (
            error?.name ===
            "AbortError"
          ) {
            return;
          }

          console.error(
            "HEADER CITY MAP ERROR:",
            error
          );

          if (
            requestId ===
            mapRequestRef.current
          ) {
            setMapZones(
              []
            );

            setMapError(
              error?.message ||
                "Unable to load geographic data."
            );
          }
        } finally {
          if (
            requestId ===
            mapRequestRef.current
          ) {
            setMapLoading(
              false
            );
          }
        }
      };

    loadCityMap();

    return () => {
      controller.abort();
    };
  }, [
    getCityId(selectedCity),
  ]);

  /* =======================================================
     ACTUAL ZONE OPTIONS

     Directly from City Overview Map response.
  ======================================================= */

  const zones =
    useMemo(() => {
      return Array.isArray(
        mapZones
      )
        ? mapZones
        : [];
    }, [
      mapZones,
    ]);

  /* =======================================================
     ACTUAL DIVISION OPTIONS

     Derived from the selected zone's actual DB object.
  ======================================================= */

  const divisions =
    useMemo(() => {
      if (!selectedZone) {
        return [];
      }

      const matchedZone =
        zones.find(
          (zone) =>
            sameEntity(
              zone,
              selectedZone,
              getZoneId,
              getZoneName
            )
        );

      return getZoneDivisions(
        matchedZone ||
          selectedZone
      );
    }, [
      zones,
      selectedZone,
    ]);

  /* =======================================================
     ACTUAL WARD OPTIONS

     Derived from the selected division's actual DB object.
  ======================================================= */

  const wards =
    useMemo(() => {
      if (
        !selectedDivision
      ) {
        return [];
      }

      const matchedDivision =
        divisions.find(
          (division) =>
            sameEntity(
              division,
              selectedDivision,
              getDivisionId,
              getDivisionName
            )
        );

      return getDivisionWards(
        matchedDivision ||
          selectedDivision
      );
    }, [
      divisions,
      selectedDivision,
    ]);

  /* =======================================================
     RECONCILE SELECTED ZONE

     If FilterContext already has a selected zone,
     replace it with the exact object returned by
     City Overview Map API.
  ======================================================= */

  useEffect(() => {
    if (
      !selectedZone ||
      zones.length === 0
    ) {
      return;
    }

    const exactZone =
      zones.find(
        (zone) =>
          sameEntity(
            zone,
            selectedZone,
            getZoneId,
            getZoneName
          )
      );

    if (
      exactZone &&
      exactZone !== selectedZone
    ) {
      setSelectedZone(
        exactZone
      );
    }
  }, [
    zones,
    selectedZone,
    setSelectedZone,
  ]);

  /* =======================================================
     RECONCILE SELECTED DIVISION

     Replace context object with exact DB object.
  ======================================================= */

  useEffect(() => {
    if (
      !selectedDivision ||
      divisions.length === 0
    ) {
      return;
    }

    const exactDivision =
      divisions.find(
        (division) =>
          sameEntity(
            division,
            selectedDivision,
            getDivisionId,
            getDivisionName
          )
      );

    if (
      exactDivision &&
      exactDivision !==
        selectedDivision
    ) {
      setSelectedDivision(
        exactDivision
      );
    }
  }, [
    divisions,
    selectedDivision,
    setSelectedDivision,
  ]);

  /* =======================================================
     RECONCILE SELECTED WARD

     Replace context object with exact DB object.
  ======================================================= */

  useEffect(() => {
    if (
      !selectedWard ||
      wards.length === 0
    ) {
      return;
    }

    const exactWard =
      wards.find(
        (ward) =>
          sameEntity(
            ward,
            selectedWard,
            getWardId,
            getWardName
          )
      );

    if (
      exactWard &&
      exactWard !==
        selectedWard
    ) {
      setSelectedWard(
        exactWard
      );
    }
  }, [
    wards,
    selectedWard,
    setSelectedWard,
  ]);

  /* =======================================================
     VALIDATE SELECTED ZONE AFTER CITY LOAD

     If city changes and old zone does not belong to the
     new city, clear the dependent hierarchy.
  ======================================================= */

  useEffect(() => {
    if (
      !selectedZone ||
      mapLoading
    ) {
      return;
    }

    if (
      zones.length === 0
    ) {
      setSelectedZone(null);
      setSelectedDivision(null);
      setSelectedWard(null);
      return;
    }

    const exists =
      zones.some(
        (zone) =>
          sameEntity(
            zone,
            selectedZone,
            getZoneId,
            getZoneName
          )
      );

    if (!exists) {
      setSelectedZone(null);
      setSelectedDivision(null);
      setSelectedWard(null);
    }
  }, [
    zones,
    selectedZone,
    mapLoading,
    setSelectedZone,
    setSelectedDivision,
    setSelectedWard,
  ]);

  /* =======================================================
     VALIDATE SELECTED DIVISION

     Prevents stale division when zone changes.
  ======================================================= */

  useEffect(() => {
    if (
      !selectedDivision
    ) {
      return;
    }

    if (
      divisions.length === 0
    ) {
      setSelectedDivision(null);
      setSelectedWard(null);
      return;
    }

    const exists =
      divisions.some(
        (division) =>
          sameEntity(
            division,
            selectedDivision,
            getDivisionId,
            getDivisionName
          )
      );

    if (!exists) {
      setSelectedDivision(null);
      setSelectedWard(null);
    }
  }, [
    divisions,
    selectedDivision,
    setSelectedDivision,
    setSelectedWard,
  ]);

  /* =======================================================
     VALIDATE SELECTED WARD

     Prevents stale ward when division changes.
  ======================================================= */

  useEffect(() => {
    if (
      !selectedWard
    ) {
      return;
    }

    if (
      wards.length === 0
    ) {
      setSelectedWard(null);
      return;
    }

    const exists =
      wards.some(
        (ward) =>
          sameEntity(
            ward,
            selectedWard,
            getWardId,
            getWardName
          )
      );

    if (!exists) {
      setSelectedWard(null);
    }
  }, [
    wards,
    selectedWard,
    setSelectedWard,
  ]);

  /* =======================================================
     CITY SELECTION

     City changes:
       City
         ↓
       reload zones
         ↓
       clear zone
         ↓
       clear division
         ↓
       clear ward
  ======================================================= */

  const handleCityChange =
    (city) => {
      setSelectedCity(
        city
      );

      setSelectedZone(
        null
      );

      setSelectedDivision(
        null
      );

      setSelectedWard(
        null
      );

      setMapZones([]);
      setMapError("");
    };

  /* =======================================================
     ZONE SELECTION

     Zone changes:
       Zone
         ↓
       actual DB divisions
         ↓
       clear division
         ↓
       clear ward
  ======================================================= */

  const handleZoneChange =
    (zone) => {
      if (!zone) {
        setSelectedZone(null);
        setSelectedDivision(null);
        setSelectedWard(null);
        return;
      }

      const exactZone =
        zones.find(
          (item) =>
            sameEntity(
              item,
              zone,
              getZoneId,
              getZoneName
            )
        ) ||
        zone;

      setSelectedZone(
        exactZone
      );

      setSelectedDivision(
        null
      );

      setSelectedWard(
        null
      );
    };

  /* =======================================================
     DIVISION SELECTION

     Division changes:
       Division
         ↓
       actual DB wards
         ↓
       clear ward
  ======================================================= */

  const handleDivisionChange =
    (division) => {
      if (!division) {
        setSelectedDivision(null);
        setSelectedWard(null);
        return;
      }

      const exactDivision =
        divisions.find(
          (item) =>
            sameEntity(
              item,
              division,
              getDivisionId,
              getDivisionName
            )
        ) ||
        division;

      setSelectedDivision(
        exactDivision
      );

      setSelectedWard(
        null
      );
    };

  /* =======================================================
     WARD SELECTION
  ======================================================= */

  const handleWardChange =
    (ward) => {
      if (!ward) {
        setSelectedWard(null);
        return;
      }

      const exactWard =
        wards.find(
          (item) =>
            sameEntity(
              item,
              ward,
              getWardId,
              getWardName
            )
        ) ||
        ward;

      setSelectedWard(
        exactWard
      );
    };

  /* =======================================================
     GSAP HEADER ANIMATION
  ======================================================= */

  useLayoutEffect(() => {
    if (!headerRef.current) {
      return;
    }

    const tl =
      gsap.timeline();

    tl.from(
      headerRef.current,
      {
        y: -24,
        opacity: 0,
        duration: 0.45,
        ease: "power4.out",
      }
    );

    if (
      controlsRef.current
        ?.children
    ) {
      tl.from(
        controlsRef.current
          .children,
        {
          y: -14,
          opacity: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: "power3.out",
        },
        "-=0.2"
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  /* =======================================================
     CLOSE DROPDOWNS
  ======================================================= */

  useEffect(() => {
    const close = (event) => {
      if (
        !profileRef.current?.contains(
          event.target
        )
      ) {
        setProfileOpen(false);
      }

      if (
        !languageRef.current?.contains(
          event.target
        )
      ) {
        setLanguageOpen(false);
      }
    };

    window.addEventListener(
      "mousedown",
      close
    );

    return () => {
      window.removeEventListener(
        "mousedown",
        close
      );
    };
  }, []);

  /* =======================================================
     SEARCH SHORTCUT
  ======================================================= */

  useEffect(() => {
    const shortcut = (
      event
    ) => {
      if (
        event.key === "/" &&
        variant !== "dashboard"
      ) {
        event.preventDefault();

        searchRef.current?.focus();
      }
    };

    window.addEventListener(
      "keydown",
      shortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        shortcut
      );
    };
  }, [
    variant,
  ]);

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout =
    () => {
      sessionStorage.clear();

      window.location.replace(
        "https://app-authentication-frontend.onrender.com"
      );
    };

  /* =======================================================
     DATE FORMAT
  ======================================================= */

  const formatLocalDate =
    (date) => {
      const year =
        date.getFullYear();

      const month =
        String(
          date.getMonth() + 1
        ).padStart(
          2,
          "0"
        );

      const day =
        String(
          date.getDate()
        ).padStart(
          2,
          "0"
        );

      return `${year}-${month}-${day}`;
    };

  /* =======================================================
     DATE HANDLER
  ======================================================= */

  const handleDateChange =
    (date) => {
      if (!date) {
        return;
      }

      setSelectedDate(
        formatLocalDate(
          date
        )
      );
    };

  /* =======================================================
     LANGUAGE HANDLER
  ======================================================= */

  const handleLanguageChange =
    (languageCode) => {
      const selectedLanguage =
        languages.find(
          (item) =>
            item.code ===
            languageCode
        );

      if (!selectedLanguage) {
        console.warn(
          `Unsupported language code: ${languageCode}`
        );

        return;
      }

      setLanguage(
        selectedLanguage.code
      );

      setLanguageOpen(false);
    };

  /* =======================================================
     CURRENT LANGUAGE
  ======================================================= */

  const currentLanguageCode =
    {
      en: "EN",
      kn: "KN",
      hi: "HI",
      te: "TE",
      ta: "TA",
      ma: "MA",
    }[language] ||
    "EN";

  /* =======================================================
     LOCATION FILTERS

     IMPORTANT:

     These are now backed by City Overview Map data.

     City
       ↓
     Map API
       ↓
     Zones
       ↓
     Divisions
       ↓
     Wards
  ======================================================= */

  const locationFilters = (
    <>
      {/* =================================================
          CITY
      ================================================= */}

      <Dropdown
        width="
          w-[148px]
          sm:w-[155px]
          2xl:w-[118px]
        "
        value={
          getCityName(
            selectedCity
          ) ||
          t(
            "filters.city",
            "Select City"
          )
        }
        options={
          cityOptions
        }
        onChange={
          handleCityChange
        }
        placeholder={t(
          "filters.city",
          "Select City"
        )}
        getLabel={
          getCityName
        }
        getKey={
          getCityId
        }
      />

      {/* =================================================
          ZONE
      ================================================= */}

      <Dropdown
        width="
          w-[220px]
          sm:w-[235px]
          2xl:w-[200px]
        "
        value={
          getZoneName(
            selectedZone
          ) ||
          t(
            "filters.zone",
            "Select Zone"
          )
        }
        options={
          zones
        }
        onChange={
          handleZoneChange
        }
        placeholder={
          mapLoading
            ? "Loading Zones..."
            : t(
                "filters.zone",
                "Select Zone"
              )
        }
        getLabel={
          getZoneName
        }
        getKey={
          getZoneId
        }
        loading={
          mapLoading
        }
        disabled={
          !selectedCity ||
          mapLoading
        }
        renderOption={(
          zone,
          index
        ) => {
          const color =
            ZONE_COLORS[
              index %
                ZONE_COLORS.length
            ];

          return (
            <>
              <span
                className="
                  w-2.5
                  h-2.5
                  rounded-full
                  shrink-0
                  border
                  border-white
                  shadow-sm
                "
                style={{
                  backgroundColor:
                    color,
                }}
              />

              <span
                className="
                  whitespace-nowrap
                "
              >
                {getZoneName(
                  zone
                )}
              </span>
            </>
          );
        }}
      />

      {/* =================================================
          DIVISION
      ================================================= */}

      <Dropdown
        width="
          w-[170px]
          sm:w-[180px]
          2xl:w-[138px]
        "
        value={
          getDivisionName(
            selectedDivision
          ) ||
          t(
            "filters.division",
            "Select Division"
          )
        }
        options={
          divisions
        }
        onChange={
          handleDivisionChange
        }
        placeholder={
          !selectedZone
            ? "Select Zone First"
            : divisions.length === 0
              ? "No Divisions"
              : t(
                  "filters.division",
                  "Select Division"
                )
        }
        getLabel={
          getDivisionName
        }
        getKey={
          getDivisionId
        }
        disabled={
          !selectedZone ||
          divisions.length === 0
        }
      />

      {/* =================================================
          WARD
      ================================================= */}

      <Dropdown
        width="
          w-[155px]
          sm:w-[165px]
          2xl:w-[122px]
        "
        value={
          selectedWard
            ? `${getWardName(
                selectedWard
              )}${
                getWardNumber(
                  selectedWard
                ) !== null &&
                getWardNumber(
                  selectedWard
                ) !==
                  undefined
                  ? ` (${getWardNumber(
                      selectedWard
                    )})`
                  : ""
              }`
            : t(
                "filters.ward",
                "Select Ward"
              )
        }
        options={
          wards
        }
        onChange={
          handleWardChange
        }
        placeholder={
          !selectedDivision
            ? "Select Division First"
            : wards.length === 0
              ? "No Wards"
              : t(
                  "filters.ward",
                  "Select Ward"
                )
        }
        getLabel={(ward) =>
          ward
            ? `${getWardName(
                ward
              )}${
                getWardNumber(
                  ward
                ) !== null &&
                getWardNumber(
                  ward
                ) !==
                  undefined
                  ? ` (${getWardNumber(
                      ward
                    )})`
                  : ""
              }`
            : ""
        }
        getKey={
          getWardId
        }
        disabled={
          !selectedDivision ||
          wards.length === 0
        }
      />
    </>
  );

  /* =======================================================
     SEARCH INPUT
  ======================================================= */

  const searchInput = (
    <div
      className="
        relative
        w-[280px]
      "
    >
      <Search
        size={15}
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-gray-400
          pointer-events-none
        "
      />

      <input
        ref={searchRef}
        type="text"
        value={search}
        onChange={(
          event
        ) =>
          setSearch(
            event.target.value
          )
        }
        placeholder={t(
          "header.search",
          "Search..."
        )}
        className="
          w-full
          h-9
          rounded-xl
          border
          border-gray-200
          bg-white
          pl-9
          pr-3
          text-[11px]
          text-[#16295A]
          outline-none
          placeholder:text-gray-400
          focus:border-violet-400
          focus:ring-2
          focus:ring-violet-100
          transition
        "
      />
    </div>
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <header
      ref={headerRef}
      className="
        sticky
        top-0
        z-[9999]
        w-full
        bg-white
        border-b
        border-gray-100
        px-3
        sm:px-4
        xl:px-4
        pt-2
        pb-2
        xl:h-16
        overflow-visible
      "
    >
      {/* ===================================================
          MAIN HEADER ROW
      =================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-2
          min-h-[44px]
          xl:h-full
        "
      >
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div
          ref={controlsRef}
          className="
            flex
            items-center
            gap-2
            min-w-0
            flex-1
          "
        >
          {/* ===============================================
              MOBILE LOGO
          =============================================== */}

          <div
            className="
              flex
              items-center
              gap-2
              shrink-0
              xl:hidden
            "
          >
            <button
              type="button"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-violet-50
                text-violet-600
                hover:bg-violet-100
                transition
                md:hidden
              "
            >
              <Menu
                size={17}
              />
            </button>

            <img
              src={SewacLogo}
              alt="SEWAC"
              draggable={false}
              className="
                w-[64px]
                sm:w-[76px]
                md:w-[68px]
                h-auto
                object-contain
                select-none
                shrink-0
              "
            />
          </div>

          {/* ===============================================
              DASHBOARD DESKTOP FILTERS

              2XL AND ABOVE
          =============================================== */}

          {isDashboard ? (
            <div
              className="
                hidden
                2xl:flex
                items-center
                gap-2
                min-w-0
                shrink-0
              "
            >
              {locationFilters}
            </div>
          ) : (
            <div
              className="
                relative
                hidden
                xl:block
              "
            >
              {searchInput}
            </div>
          )}
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div
          className="
            flex
            items-center
            gap-2
            shrink-0
          "
        >
          {/* ===============================================
              CALENDAR
          =============================================== */}

          <div
            className="
              relative
              shrink-0
            "
          >
            <Calendar
              value={
                selectedDateObj
              }
              onChange={
                handleDateChange
              }
            />
          </div>

          {/* ===============================================
              WET / DRY DAY
          =============================================== */}

          {isDashboard && (
            <div
              className="
                hidden
                md:flex
                items-center
                h-9
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                shrink-0
              "
            >
              {isDryDay && (
                <button
                  type="button"
                  onClick={() =>
                    setDayType(
                      "dry"
                    )
                  }
                  className={`
                    h-9
                    px-4
                    text-[11px]
                    font-semibold
                    transition-all
                    duration-300
                    ${
                      dayType ===
                      "dry"
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                        : "bg-white text-[#16295A] hover:bg-gray-50"
                    }
                  `}
                >
                  {t(
                    "header.dryDay",
                    "Dry Day"
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  setDayType(
                    "wet"
                  )
                }
                className={`
                  h-9
                  px-4
                  text-[11px]
                  font-semibold
                  transition-all
                  duration-300
                  ${
                    dayType ===
                    "wet"
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                      : "bg-white text-[#16295A] hover:bg-gray-50"
                  }
                `}
              >
                {t(
                  "header.wetDay",
                  "Wet Day"
                )}
              </button>
            </div>
          )}

          {/* ===============================================
              LANGUAGE
          =============================================== */}

          <div
            ref={languageRef}
            className="
              relative
              shrink-0
            "
          >
            <button
              type="button"
              onClick={() =>
                setLanguageOpen(
                  (previous) =>
                    !previous
                )
              }
              className="
                h-9
                px-2.5
                sm:px-3
                rounded-xl
                border
                border-gray-200
                bg-white
                flex
                items-center
                gap-1.5
                sm:gap-2
                hover:border-violet-400
                transition-all
                duration-300
              "
            >
              <Globe
                size={15}
                className="
                  text-violet-600
                "
              />

              <span
                className="
                  text-[11px]
                  sm:text-[12px]
                  font-semibold
                  text-[#16295A]
                "
              >
                {
                  currentLanguageCode
                }
              </span>

              <ChevronDown
                size={13}
                className={`
                  transition-transform
                  duration-300
                  ${
                    languageOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {languageOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-11
                  w-44
                  rounded-2xl
                  bg-white
                  border
                  border-gray-100
                  shadow-[0_15px_40px_rgba(0,0,0,0.08)]
                  overflow-hidden
                  z-[10000]
                "
              >
                {languages.map(
                  (
                    item
                  ) => (
                    <button
                      type="button"
                      key={
                        item.code
                      }
                      onClick={() =>
                        handleLanguageChange(
                          item.code
                        )
                      }
                      className="
                        w-full
                        px-4
                        py-3
                        flex
                        items-center
                        justify-between
                        text-[12px]
                        text-[#16295A]
                        hover:bg-violet-50
                        transition
                      "
                    >
                      <span>
                        {
                          item.label
                        }
                      </span>

                      {language ===
                        item.code && (
                        <Check
                          size={
                            14
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

          {/* ===============================================
              PROFILE
          =============================================== */}

          <div
            ref={profileRef}
            className="
              relative
              shrink-0
            "
          >
            <button
              type="button"
              onClick={() =>
                setProfileOpen(
                  (previous) =>
                    !previous
                )
              }
              aria-expanded={
                profileOpen
              }
              className="
                h-9
                pl-1
                pr-1
                sm:pl-2
                sm:pr-2
                xl:pr-3
                rounded-xl
                border
                border-gray-200
                bg-white
                flex
                items-center
                gap-2
                hover:border-violet-400
                transition-all
                duration-300
              "
            >
              <div
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-600
                  text-white
                  text-[14px]
                  font-semibold
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                {
                  userInitial
                }
              </div>

              <div
                className="
                  hidden
                  sm:block
                  text-left
                  leading-tight
                  min-w-0
                "
              >
                <h4
                  className="
                    text-[12px]
                    font-semibold
                    text-[#16295A]
                    truncate
                    max-w-[100px]
                  "
                >
                  {
                    user.name
                  }
                </h4>

                <p
                  className="
                    text-[10px]
                    text-gray-500
                    truncate
                    max-w-[100px]
                  "
                >
                  {
                    roleLabel
                  }
                </p>
              </div>

              <ChevronDown
                size={13}
                className={`
                  transition-transform
                  duration-300
                  ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-11
                  w-64
                  rounded-2xl
                  bg-white
                  border
                  border-gray-100
                  shadow-[0_15px_40px_rgba(0,0,0,0.08)]
                  overflow-hidden
                  z-[10000]
                "
              >
                <div
                  className="
                    px-5
                    py-4
                    border-b
                    border-gray-100
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        w-9
                        h-9
                        rounded-full
                        bg-gradient-to-r
                        from-violet-600
                        to-fuchsia-600
                        text-white
                        text-[14px]
                        font-semibold
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      {
                        userInitial
                      }
                    </div>

                    <div
                      className="
                        min-w-0
                      "
                    >
                      <h3
                        className="
                          font-semibold
                          text-[13px]
                          text-[#16295A]
                          truncate
                        "
                      >
                        {
                          user.name
                        }
                      </h3>

                      <p
                        className="
                          text-[10px]
                          text-gray-500
                          mt-0.5
                          truncate
                        "
                      >
                        {
                          roleLabel
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(
                      false
                    );

                    handleLogout();
                  }}
                  className="
                    w-full
                    px-5
                    py-3
                    flex
                    items-center
                    gap-3
                    text-[12px]
                    text-red-500
                    hover:bg-red-50
                    transition
                    text-left
                  "
                >
                  <LogOut
                    size={16}
                  />

                  {t(
                    "sidebar.logout",
                    "Logout"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================
          NON-DASHBOARD MOBILE SEARCH
      =================================================== */}

      {!isDashboard && (
        <div
          className="
            md:hidden
            w-full
            mt-2
            px-0.5
          "
        >
          <div
            className="
              w-full
            "
          >
            {searchInput}
          </div>
        </div>
      )}

      {/* ===================================================
          DASHBOARD RESPONSIVE FILTER ROW

          IMPORTANT:

          Below 2XL the filters remain on their own row.

          This is what keeps:

            logo
            calendar
            wet/dry
            language
            profile

          from getting crushed.

      =================================================== */}

      {isDashboard && (
        <div
          className="
            2xl:hidden
            w-full
            overflow-x-auto
            overflow-y-visible
            scrollbar-none
            pt-1
            pb-1
            mt-1
            -mx-0.5
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              min-w-max
              px-0.5
            "
          >
            {
              locationFilters
            }
          </div>
        </div>
      )}
    </header>
  );
}