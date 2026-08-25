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
  useCallback,
  useEffect,
  useLayoutEffect,
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
   Header now follows the SAME API FLOW as CityMapOverview.

   DO NOT use:
      /api/filters/cities

   City Overview uses:
      /api/master-citizen/map/city/:cityId
      /api/master-citizen/map/zone/:zoneTableName/divisions
      /api/master-citizen/map/division/:divisionTableName/wards
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5002";

const DEFAULT_CITY_ID = 1;


/* =========================================================
   EXACT CITY OVERVIEW ENDPOINTS
========================================================= */

const CITY_MAP_ENDPOINT = (cityId) =>
  `${API_BASE_URL}/api/master-citizen/map/city/${encodeURIComponent(
    cityId
  )}`;

const ZONE_DIVISIONS_ENDPOINT = (
  zoneTableName
) =>
  `${API_BASE_URL}/api/master-citizen/map/zone/${encodeURIComponent(
    zoneTableName
  )}/divisions`;

const DIVISION_WARDS_ENDPOINT = (
  divisionTableName
) =>
  `${API_BASE_URL}/api/master-citizen/map/division/${encodeURIComponent(
    divisionTableName
  )}/wards`;


/* =========================================================
   LANGUAGE OPTIONS

   Language names intentionally remain native.
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
   ROLE HELPERS
========================================================= */

const ROLE_LABELS = {
  ADMIN_LAYER_1: "Admin Layer 1",
  ADMIN_LAYER_2: "Admin Layer 2",
  WORKER: "Worker",
};


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


function getRoleLabel(role) {
  return (
    ROLE_LABELS[role] ||
    role ||
    "Admin Layer 1"
  );
}


/* =========================================================
   CITY / ZONE / DIVISION / WARD HELPERS

   These are intentionally the SAME compatibility helpers
   used by CityMapOverview.
========================================================= */


/* =========================================================
   CITY
========================================================= */

function getCityId(city) {
  return (
    city?.id ??
    city?.cityId ??
    city?.city_id ??
    null
  );
}


function getCityName(city) {
  return (
    city?.cityName ||
    city?.city_name ||
    city?.name ||
    "Unnamed City"
  );
}


/* =========================================================
   ZONE
========================================================= */

function getZoneName(zone) {
  return (
    zone?.zoneName ||
    zone?.zone_name ||
    zone?.name ||
    "Unnamed Zone"
  );
}


function getZoneId(zone) {
  return (
    zone?.id ??
    zone?.zoneId ??
    zone?.zone_id ??
    null
  );
}


function getZoneTableName(zone) {
  return (
    zone?.zoneTableName ||
    zone?.zone_table_name ||
    null
  );
}


/* =========================================================
   DIVISION
========================================================= */

function getDivisionName(
  division
) {
  return (
    division?.divisionName ||
    division?.division_name ||
    division?.name ||
    "Unnamed Division"
  );
}


function getDivisionId(
  division
) {
  return (
    division?.id ??
    division?.divisionId ??
    division?.division_id ??
    null
  );
}


function getDivisionTableName(
  division
) {
  return (
    division?.divisionTableName ||
    division?.division_table_name ||
    null
  );
}


/* =========================================================
   WARD
========================================================= */

function getWardName(ward) {
  return (
    ward?.wardName ||
    ward?.ward_name ||
    ward?.name ||
    (
      ward?.wardNo !== undefined
        ? `Ward ${ward.wardNo}`
        : "Unnamed Ward"
    )
  );
}


function getWardId(ward) {
  return (
    ward?.id ??
    ward?.wardId ??
    ward?.ward_id ??
    ward?.wardNo ??
    null
  );
}


/* =========================================================
   ENTITY COMPARISON
========================================================= */

function sameEntity(
  first,
  second,
  getId,
  getName
) {
  if (!first || !second) {
    return false;
  }

  const firstId =
    getId(first);

  const secondId =
    getId(second);

  if (
    firstId !== null &&
    firstId !== undefined &&
    secondId !== null &&
    secondId !== undefined
  ) {
    return (
      String(firstId) ===
      String(secondId)
    );
  }

  return (
    getName(first) ===
    getName(second)
  );
}


/* =========================================================
   RESPONSE HELPER

   Same response handling as CityMapOverview.
========================================================= */

function extractArray(
  result,
  key
) {
  if (
    Array.isArray(
      result?.[key]
    )
  ) {
    return result[key];
  }

  if (
    Array.isArray(
      result?.data?.[key]
    )
  ) {
    return result.data[key];
  }

  if (
    Array.isArray(
      result?.data
    )
  ) {
    return result.data;
  }

  if (
    Array.isArray(result)
  ) {
    return result;
  }

  return [];
}


/* =========================================================
   NORMALIZE CITY

   We keep both camelCase and snake_case aliases so the
   existing FilterContext / other pages continue receiving
   familiar object shapes.
========================================================= */

function normalizeCity(city) {
  if (!city) {
    return null;
  }

  const id =
    getCityId(city);

  const name =
    getCityName(city);

  return {
    ...city,

    id,
    cityId:
      city?.cityId ??
      id,

    city_id:
      city?.city_id ??
      id,

    cityName:
      city?.cityName ??
      name,

    city_name:
      city?.city_name ??
      name,
  };
}


/* =========================================================
   NORMALIZE ZONE
========================================================= */

function normalizeZone(zone) {
  if (!zone) {
    return null;
  }

  const id =
    getZoneId(zone);

  const name =
    getZoneName(zone);

  const tableName =
    getZoneTableName(zone);

  return {
    ...zone,

    id,

    zoneId:
      zone?.zoneId ??
      id,

    zone_id:
      zone?.zone_id ??
      id,

    zoneName:
      zone?.zoneName ??
      name,

    zone_name:
      zone?.zone_name ??
      name,

    zoneTableName:
      zone?.zoneTableName ??
      tableName,

    zone_table_name:
      zone?.zone_table_name ??
      tableName,
  };
}


/* =========================================================
   NORMALIZE DIVISION
========================================================= */

function normalizeDivision(
  division
) {
  if (!division) {
    return null;
  }

  const id =
    getDivisionId(
      division
    );

  const name =
    getDivisionName(
      division
    );

  const tableName =
    getDivisionTableName(
      division
    );

  return {
    ...division,

    id,

    divisionId:
      division?.divisionId ??
      id,

    division_id:
      division?.division_id ??
      id,

    divisionName:
      division?.divisionName ??
      name,

    division_name:
      division?.division_name ??
      name,

    divisionTableName:
      division?.divisionTableName ??
      tableName,

    division_table_name:
      division?.division_table_name ??
      tableName,
  };
}


/* =========================================================
   NORMALIZE WARD
========================================================= */

function normalizeWard(ward) {
  if (!ward) {
    return null;
  }

  const id =
    getWardId(ward);

  const name =
    getWardName(ward);

  const wardNo =
    ward?.wardNo ??
    ward?.ward_no ??
    id;

  return {
    ...ward,

    id,

    wardId:
      ward?.wardId ??
      id,

    ward_id:
      ward?.ward_id ??
      id,

    wardName:
      ward?.wardName ??
      name,

    ward_name:
      ward?.ward_name ??
      name,

    wardNo,

    ward_no:
      ward?.ward_no ??
      wardNo,
  };
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
  disabled = false,
  loading = false,
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
    function close(event) {
      if (
        !wrapperRef.current?.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    }

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
     ANIMATION
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
     OPTION HELPERS
  ======================================================= */

  const getOptionLabel =
    (item) => {
      if (getLabel) {
        return getLabel(item);
      }

      return (
        item?.cityName ||
        item?.city_name ||
        item?.zoneName ||
        item?.zone_name ||
        item?.divisionName ||
        item?.division_name ||
        item?.wardName ||
        item?.ward_name ||
        item?.name ||
        String(item ?? "")
      );
    };


  const getOptionKey =
    (item, index) => {
      if (getKey) {
        return getKey(item);
      }

      return (
        item?.cityId ??
        item?.city_id ??
        item?.zoneId ??
        item?.zone_id ??
        item?.divisionId ??
        item?.division_id ??
        item?.wardId ??
        item?.ward_id ??
        `${item}-${index}`
      );
    };


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
        onClick={() =>
          !disabled &&
          setOpen(
            (current) =>
              !current
          )
        }
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
          text-[12px]
          font-medium
          text-[#16295A]
          transition-all
          duration-300
          ${
            disabled
              ? "cursor-not-allowed bg-gray-50 text-gray-400 opacity-80"
              : "hover:border-violet-400"
          }
        `}
      >
        <span className="truncate">
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


      {open && (
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
          {options.length ===
          0 ? (
            <div
              className="
                px-4
                py-2.5
                text-[12px]
                text-gray-400
              "
            >
              {loading
                ? "Loading..."
                : "No options available"}
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
                      onChange(
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
                      gap-6
                      text-left
                      text-[12px]
                      text-[#16295A]
                      hover:bg-violet-50
                      transition
                    "
                  >
                    <span className="
                      whitespace-nowrap
                      min-w-max
                    ">
                      {label}
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
     FILTER CONTEXT

     IMPORTANT:
     We DO NOT consume:
       cities
       zones
       divisions
       wards

     from FilterContext anymore.

     Those were tied to the broken:
       /api/filters/cities

     Instead Header owns the exact same master-citizen
     hierarchy as CityMapOverview.

     Context setters are still used so the rest of the
     application receives the selected filters.
  ======================================================= */

  const {
    selectedCity:
      contextSelectedCity,

    selectedZone:
      contextSelectedZone,

    selectedDivision:
      contextSelectedDivision,

    selectedWard:
      contextSelectedWard,

    setSelectedCity,

    setSelectedZone,

    setSelectedDivision,

    setSelectedWard,
  } = useFilters();


  /* =======================================================
     REFS
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

  const languageMenuRef =
    useRef(null);


  /* =======================================================
     LOCAL UI STATE
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
     CITY OVERVIEW DATA STATE

     EXACT SAME HIERARCHY AS CITY MAP:
     
       CITY
         ↓
       ZONES
         ↓
       DIVISIONS
         ↓
       WARDS
  ======================================================= */

  const [
    city,
    setCity,
  ] = useState(null);

  const [
    zones,
    setZones,
  ] = useState([]);

  const [
    selectedCity,
    setLocalSelectedCity,
  ] = useState(null);

  const [
    selectedZone,
    setLocalSelectedZone,
  ] = useState(null);

  const [
    divisions,
    setDivisions,
  ] = useState([]);

  const [
    selectedDivision,
    setLocalSelectedDivision,
  ] = useState(null);

  const [
    wards,
    setWards,
  ] = useState([]);

  const [
    selectedWard,
    setLocalSelectedWard,
  ] = useState(null);


  /* =======================================================
     LOADING STATE
  ======================================================= */

  const [
    cityLoading,
    setCityLoading,
  ] = useState(true);

  const [
    divisionsLoading,
    setDivisionsLoading,
  ] = useState(false);

  const [
    wardsLoading,
    setWardsLoading,
  ] = useState(false);


  /* =======================================================
     ERROR STATE
  ======================================================= */

  const [
    cityError,
    setCityError,
  ] = useState("");

  const [
    divisionError,
    setDivisionError,
  ] = useState("");

  const [
    wardError,
    setWardError,
  ] = useState("");


  /* =======================================================
     ABORT REFS

     Exactly like CityMapOverview.
  ======================================================= */

  const cityAbortRef =
    useRef(null);

  const divisionAbortRef =
    useRef(null);

  const wardAbortRef =
    useRef(null);


  /* =======================================================
     USER
  ======================================================= */

  const getCurrentUser = () => {
    try {

      /* =====================================================
         AUTH HANDOFF
      ===================================================== */

      const hash =
        window.location.hash;

      if (
        hash.startsWith(
          "#auth="
        )
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


      /* =====================================================
         STORED ADMIN
      ===================================================== */

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


      /* =====================================================
         JWT
      ===================================================== */

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


      /* =====================================================
         RESOLVE USER
      ===================================================== */

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
     CITY ID RESOLUTION

     If FilterContext already has a city, use it.

     Otherwise CityMapOverview's exact default:
       cityId = 1
  ======================================================= */

  const resolveInitialCityId =
    () => {
      const contextId =
        getCityId(
          contextSelectedCity
        );

      if (
        contextId !== null &&
        contextId !== undefined
      ) {
        return contextId;
      }

      return DEFAULT_CITY_ID;
    };


  /* =======================================================
     LOAD CITY MAP DATA

     THIS IS THE CRITICAL FIX.

     NO:
       /api/filters/cities

     YES:
       /api/master-citizen/map/city/:cityId
  ======================================================= */

  const fetchCityMapData =
    useCallback(
      async (
        cityId
      ) => {

        cityAbortRef.current?.abort();

        const controller =
          new AbortController();

        cityAbortRef.current =
          controller;

        setCityLoading(true);
        setCityError("");

        try {

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
                method:
                  "GET",

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
                "Unable to fetch city map data."
            );
          }


          const loadedCity =
            normalizeCity(
              result?.city
            );


          const loadedZones =
            Array.isArray(
              result?.zones
            )
              ? result.zones
                  .map(
                    normalizeZone
                  )
                  .filter(Boolean)
              : [];


          setCity(
            loadedCity
          );

          setZones(
            loadedZones
          );


          /* =================================================
             RESET LOWER LEVELS
          ================================================= */

          setLocalSelectedZone(
            null
          );

          setLocalSelectedDivision(
            null
          );

          setLocalSelectedWard(
            null
          );

          setDivisions([]);
          setWards([]);

          setDivisionError("");
          setWardError("");


          /* =================================================
             SELECT CITY
          ================================================= */

          if (loadedCity) {

            setLocalSelectedCity(
              loadedCity
            );

            setSelectedCity(
              loadedCity
            );

          }


          console.log(
            "============================================================"
          );

          console.log(
            "HEADER CITY LOADED"
          );

          console.log(
            "CITY:",
            loadedCity
              ? getCityName(
                  loadedCity
                )
              : "NONE"
          );

          console.log(
            "ZONES:",
            loadedZones.length
          );

          console.log(
            "ZONE NAMES:",
            loadedZones.map(
              getZoneName
            )
          );

          console.log(
            "============================================================"
          );

        } catch (
          requestError
        ) {

          if (
            requestError?.name ===
            "AbortError"
          ) {
            return;
          }

          console.error(
            "❌ HEADER CITY MAP ERROR:",
            requestError
          );

          setCityError(
            requestError?.message ||
              "Unable to load city."
          );

        } finally {

          if (
            !controller.signal.aborted
          ) {
            setCityLoading(
              false
            );
          }

        }

      },
      [
        setSelectedCity,
      ]
    );


  /* =======================================================
     INITIAL CITY LOAD
  ======================================================= */

  useEffect(() => {

    fetchCityMapData(
      resolveInitialCityId()
    );

    return () => {
      cityAbortRef.current?.abort();
      divisionAbortRef.current?.abort();
      wardAbortRef.current?.abort();
    };

    // Intentionally only on Header mount.
    // City selection has its own handler.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* =======================================================
     FETCH ZONE → DIVISIONS

     EXACT CityMapOverview logic.
  ======================================================= */

  const fetchZoneDivisions =
    useCallback(
      async (
        zone
      ) => {

        divisionAbortRef.current?.abort();
        wardAbortRef.current?.abort();


        if (!zone) {

          setDivisions([]);
          setLocalSelectedDivision(null);

          setWards([]);
          setLocalSelectedWard(null);

          setDivisionError("");
          setWardError("");

          return;
        }


        const zoneTableName =
          getZoneTableName(
            zone
          );


        if (!zoneTableName) {

          setDivisions([]);

          setLocalSelectedDivision(
            null
          );

          setDivisionError(
            "Selected zone does not contain a valid zoneTableName."
          );

          return;
        }


        const controller =
          new AbortController();

        divisionAbortRef.current =
          controller;


        setDivisionsLoading(
          true
        );

        setDivisionError("");

        setDivisions([]);

        setLocalSelectedDivision(
          null
        );

        setWards([]);

        setLocalSelectedWard(
          null
        );

        setWardError("");


        const endpoint =
          ZONE_DIVISIONS_ENDPOINT(
            zoneTableName
          );


        console.log(
          "============================================================"
        );

        console.log(
          "HEADER ZONE → DIVISIONS"
        );

        console.log(
          "ZONE:",
          getZoneName(zone)
        );

        console.log(
          "ZONE TABLE:",
          zoneTableName
        );

        console.log(
          "ENDPOINT:",
          endpoint
        );

        console.log(
          "============================================================"
        );


        try {

          const response =
            await fetch(
              endpoint,
              {
                method:
                  "GET",

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
              `Zone divisions request failed with status ${response.status}`
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
                "Unable to fetch divisions."
            );
          }


          const loadedDivisions =
            extractArray(
              result,
              "divisions"
            )
              .map(
                normalizeDivision
              )
              .filter(Boolean);


          setDivisions(
            loadedDivisions
          );


          console.log(
            "HEADER DIVISIONS LOADED:",
            loadedDivisions.length
          );

        } catch (
          requestError
        ) {

          if (
            requestError?.name ===
            "AbortError"
          ) {
            return;
          }

          console.error(
            "❌ HEADER DIVISIONS ERROR:",
            requestError
          );

          setDivisions([]);

          setDivisionError(
            requestError?.message ||
              "Unable to load divisions."
          );

        } finally {

          if (
            !controller.signal.aborted
          ) {
            setDivisionsLoading(
              false
            );
          }

        }

      },
      []
    );


  /* =======================================================
     FETCH DIVISION → WARDS

     EXACT CityMapOverview logic.
  ======================================================= */

  const fetchDivisionWards =
    useCallback(
      async (
        division
      ) => {

        wardAbortRef.current?.abort();


        if (!division) {

          setWards([]);

          setLocalSelectedWard(
            null
          );

          setWardError("");

          return;
        }


        const divisionTableName =
          getDivisionTableName(
            division
          );


        if (!divisionTableName) {

          setWards([]);

          setLocalSelectedWard(
            null
          );

          setWardError(
            "Selected division does not contain a valid divisionTableName."
          );

          return;
        }


        const controller =
          new AbortController();

        wardAbortRef.current =
          controller;


        setWardsLoading(
          true
        );

        setWardError("");

        setWards([]);

        setLocalSelectedWard(
          null
        );


        const endpoint =
          DIVISION_WARDS_ENDPOINT(
            divisionTableName
          );


        console.log(
          "============================================================"
        );

        console.log(
          "HEADER DIVISION → WARDS"
        );

        console.log(
          "DIVISION:",
          getDivisionName(
            division
          )
        );

        console.log(
          "DIVISION TABLE:",
          divisionTableName
        );

        console.log(
          "ENDPOINT:",
          endpoint
        );

        console.log(
          "============================================================"
        );


        try {

          const response =
            await fetch(
              endpoint,
              {
                method:
                  "GET",

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
              `Division wards request failed with status ${response.status}`
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
                "Unable to fetch wards."
            );
          }


          const loadedWards =
            extractArray(
              result,
              "wards"
            )
              .map(
                normalizeWard
              )
              .filter(Boolean);


          setWards(
            loadedWards
          );


          console.log(
            "HEADER WARDS LOADED:",
            loadedWards.length
          );

        } catch (
          requestError
        ) {

          if (
            requestError?.name ===
            "AbortError"
          ) {
            return;
          }

          console.error(
            "❌ HEADER WARDS ERROR:",
            requestError
          );

          setWards([]);

          setWardError(
            requestError?.message ||
              "Unable to load wards."
          );

        } finally {

          if (
            !controller.signal.aborted
          ) {
            setWardsLoading(
              false
            );
          }

        }

      },
      []
    );


  /* =======================================================
     CITY SELECT
  ======================================================= */

  const handleCitySelect =
    useCallback(
      async (
        cityValue
      ) => {

        if (!cityValue) {
          return;
        }


        const cityId =
          getCityId(
            cityValue
          );


        if (
          cityId === null ||
          cityId === undefined
        ) {
          console.error(
            "HEADER: selected city has no valid city ID",
            cityValue
          );

          return;
        }


        const normalizedCity =
          normalizeCity(
            cityValue
          );


        setLocalSelectedCity(
          normalizedCity
        );

        setSelectedCity(
          normalizedCity
        );


        setLocalSelectedZone(
          null
        );

        setLocalSelectedDivision(
          null
        );

        setLocalSelectedWard(
          null
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


        setDivisions([]);
        setWards([]);

        setDivisionError("");
        setWardError("");


        await fetchCityMapData(
          cityId
        );

      },
      [
        fetchCityMapData,
        setSelectedCity,
        setSelectedZone,
        setSelectedDivision,
        setSelectedWard,
      ]
    );


  /* =======================================================
     ZONE SELECT
  ======================================================= */

  const handleZoneSelect =
    useCallback(
      (
        zone
      ) => {

        if (!zone) {
          return;
        }


        const normalizedZone =
          normalizeZone(
            zone
          );


        setLocalSelectedZone(
          normalizedZone
        );

        setSelectedZone(
          normalizedZone
        );


        setLocalSelectedDivision(
          null
        );

        setLocalSelectedWard(
          null
        );


        setSelectedDivision(
          null
        );

        setSelectedWard(
          null
        );


        setDivisions([]);
        setWards([]);

        setDivisionError("");
        setWardError("");


        fetchZoneDivisions(
          normalizedZone
        );

      },
      [
        fetchZoneDivisions,
        setSelectedZone,
        setSelectedDivision,
        setSelectedWard,
      ]
    );


  /* =======================================================
     DIVISION SELECT
  ======================================================= */

  const handleDivisionSelect =
    useCallback(
      (
        division
      ) => {

        if (!division) {
          return;
        }


        const normalizedDivision =
          normalizeDivision(
            division
          );


        setLocalSelectedDivision(
          normalizedDivision
        );

        setSelectedDivision(
          normalizedDivision
        );


        setLocalSelectedWard(
          null
        );

        setSelectedWard(
          null
        );


        setWards([]);

        setWardError("");


        fetchDivisionWards(
          normalizedDivision
        );

      },
      [
        fetchDivisionWards,
        setSelectedDivision,
        setSelectedWard,
      ]
    );


  /* =======================================================
     WARD SELECT
  ======================================================= */

  const handleWardSelect =
    useCallback(
      (
        ward
      ) => {

        if (!ward) {
          return;
        }


        const normalizedWardValue =
          normalizeWard(
            ward
          );


        setLocalSelectedWard(
          normalizedWardValue
        );

        setSelectedWard(
          normalizedWardValue
        );

      },
      [
        setSelectedWard,
      ]
    );


  /* =======================================================
     SYNC CONTEXT → LOCAL

     If another component changes the global filter,
     Header reflects it too.
  ======================================================= */

  useEffect(() => {

    if (
      contextSelectedCity &&
      getCityId(
        contextSelectedCity
      ) !==
        getCityId(
          selectedCity
        )
    ) {
      setLocalSelectedCity(
        normalizeCity(
          contextSelectedCity
        )
      );
    }

  }, [
    contextSelectedCity,
    selectedCity,
  ]);


  useEffect(() => {

    if (
      contextSelectedZone &&
      !sameEntity(
        contextSelectedZone,
        selectedZone,
        getZoneId,
        getZoneName
      )
    ) {
      setLocalSelectedZone(
        normalizeZone(
          contextSelectedZone
        )
      );
    }

  }, [
    contextSelectedZone,
    selectedZone,
  ]);


  useEffect(() => {

    if (
      contextSelectedDivision &&
      !sameEntity(
        contextSelectedDivision,
        selectedDivision,
        getDivisionId,
        getDivisionName
      )
    ) {
      setLocalSelectedDivision(
        normalizeDivision(
          contextSelectedDivision
        )
      );
    }

  }, [
    contextSelectedDivision,
    selectedDivision,
  ]);


  useEffect(() => {

    if (
      contextSelectedWard &&
      !sameEntity(
        contextSelectedWard,
        selectedWard,
        getWardId,
        getWardName
      )
    ) {
      setLocalSelectedWard(
        normalizeWard(
          contextSelectedWard
        )
      );
    }

  }, [
    contextSelectedWard,
    selectedWard,
  ]);


  /* =======================================================
     DATE / DAY TYPE
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
      setDayType(
        "wet"
      );
    }

  }, [
    selectedDate,
    isDryDay,
  ]);


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

    function close(event) {

      if (
        !profileRef.current?.contains(
          event.target
        )
      ) {
        setProfileOpen(
          false
        );
      }


      if (
        !languageRef.current?.contains(
          event.target
        )
      ) {
        setLanguageOpen(
          false
        );
      }

    }


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

    function shortcut(event) {

      if (
        event.key === "/" &&
        variant !==
          "dashboard"
      ) {

        event.preventDefault();

        searchRef.current?.focus();

      }

    }


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
     DATE CHANGE
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
     LANGUAGE CHANGE
  ======================================================= */

  const handleLanguageChange =
    (
      languageCode
    ) => {

      if (
        !languages.some(
          (item) =>
            item.code ===
            languageCode
        )
      ) {
        return;
      }


      setLanguage(
        languageCode
      );

      setLanguageOpen(
        false
      );

    };


  /* =======================================================
     CURRENT LANGUAGE
  ======================================================= */

  const currentLanguageCode =
    language === "en"
      ? "EN"
      : language === "kn"
      ? "KN"
      : language === "hi"
      ? "HI"
      : language === "te"
      ? "TE"
      : language === "ta"
      ? "TA"
      : language === "ma"
      ? "MA"
      : "EN";


  /* =======================================================
     LOCATION VALUES
  ======================================================= */

  const selectedCityName =
    selectedCity
      ? getCityName(
          selectedCity
        )
      : city
      ? getCityName(
          city
        )
      : "";


  const selectedZoneName =
    selectedZone
      ? getZoneName(
          selectedZone
        )
      : "";


  const selectedDivisionName =
    selectedDivision
      ? getDivisionName(
          selectedDivision
        )
      : "";


  const selectedWardName =
    selectedWard
      ? getWardName(
          selectedWard
        )
      : "";


  /* =======================================================
     CITY OPTIONS

     City Overview itself currently loads a specific city
     using DEFAULT_CITY_ID = 1.

     Therefore Header does NOT call the broken city-filter
     endpoint.

     The loaded city is the actual city returned by the
     master-citizen map endpoint.
  ======================================================= */

  const cityOptions =
    city
      ? [
          city,
        ]
      : selectedCity
      ? [
          selectedCity,
        ]
      : [];


  /* =======================================================
     LOCATION FILTERS
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
          selectedCityName ||
          t(
            "filters.city",
            "Select City"
          )
        }
        options={
          cityOptions
        }
        onChange={
          handleCitySelect
        }
        placeholder={
          cityLoading
            ? "Loading City..."
            : t(
                "filters.city",
                "Select City"
              )
        }
        loading={
          cityLoading
        }
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
          selectedZoneName ||
          t(
            "filters.zone",
            "Select Zone"
          )
        }
        options={
          zones
        }
        onChange={
          handleZoneSelect
        }
        placeholder={
          cityLoading
            ? "Loading Zones..."
            : t(
                "filters.zone",
                "Select Zone"
              )
        }
        loading={
          cityLoading
        }
        getLabel={
          getZoneName
        }
        getKey={
          (zone) =>
            getZoneId(
              zone
            ) ??
            getZoneTableName(
              zone
            )
        }
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
          selectedDivisionName ||
          (
            !selectedZone
              ? "Select a Zone First"
              : divisionsLoading
              ? "Loading Divisions..."
              : divisions.length
              ? t(
                  "filters.division",
                  "Select Division"
                )
              : "No Divisions"
          )
        }
        options={
          divisions
        }
        onChange={
          handleDivisionSelect
        }
        disabled={
          !selectedZone ||
          divisionsLoading ||
          divisions.length === 0
        }
        loading={
          divisionsLoading
        }
        placeholder={
          !selectedZone
            ? "Select a Zone First"
            : divisionsLoading
            ? "Loading Divisions..."
            : "No Divisions"
        }
        getLabel={
          getDivisionName
        }
        getKey={
          (division) =>
            getDivisionId(
              division
            ) ??
            getDivisionTableName(
              division
            )
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
          selectedWardName ||
          (
            !selectedDivision
              ? "Select a Division First"
              : wardsLoading
              ? "Loading Wards..."
              : wards.length
              ? t(
                  "filters.ward",
                  "Select Ward"
                )
              : "No Wards"
          )
        }
        options={
          wards
        }
        onChange={
          handleWardSelect
        }
        disabled={
          !selectedDivision ||
          wardsLoading ||
          wards.length === 0
        }
        loading={
          wardsLoading
        }
        placeholder={
          !selectedDivision
            ? "Select a Division First"
            : wardsLoading
            ? "Loading Wards..."
            : "No Wards"
        }
        getLabel={
          (ward) =>
            getWardName(
              ward
            )
        }
        getKey={
          (ward) =>
            getWardId(
              ward
            )
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
          PRIMARY HEADER ROW
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
              MOBILE / TABLET BRAND
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
              DESKTOP DASHBOARD FILTERS
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

          {/* =================================================
              DATE
          ================================================= */}

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


          {/* =================================================
              DAY TYPE
          ================================================= */}

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


          {/* =================================================
              LANGUAGE
          ================================================= */}

          <div
            ref={
              languageRef
            }
            className="
              relative
              shrink-0
            "
          >

            <button
              type="button"
              onClick={() =>
                setLanguageOpen(
                  (current) =>
                    !current
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
                ref={
                  languageMenuRef
                }
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
                  (item) => (

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
                          size={14}
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
              PROFILE
          ================================================= */}

          <div
            ref={
              profileRef
            }
            className="
              relative
              shrink-0
            "
          >

            <button
              type="button"
              onClick={() =>
                setProfileOpen(
                  (current) =>
                    !current
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

              {/* AVATAR */}

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


              {/* USER INFO */}

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


            {/* =================================================
                PROFILE DROPDOWN
            ================================================= */}

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
                ref={(element) => {

                  if (element) {

                    gsap.fromTo(
                      element,
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

                }}
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


                {/* =================================================
                    LOGOUT
                ================================================= */}

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
          NON-DASHBOARD SMALL SCREEN SEARCH
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

          Below 1536px
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
            {locationFilters}
          </div>

        </div>

      )}

    </header>
  );
}