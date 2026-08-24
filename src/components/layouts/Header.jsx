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
  useRef,
  useState,
} from "react";

import { gsap } from "gsap";

import Calendar from "../Calendar/Calendar";

import { useLanguage } from "../../i18n";

import SewacLogo from "../../assets/sewac_logo.svg";

/* =========================================================
   LANGUAGE OPTIONS

   IMPORTANT:
   Language names are intentionally NOT translated.

   English  -> English
   Kannada  -> ಕನ್ನಡ
   Hindi    -> हिंदी
   Telugu   -> తెలుగు

   These labels always remain in their own language,
   regardless of the currently selected application language.
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
    const token = sessionStorage.getItem("token");

    if (!token) {
      return {
        name: "Admin",
        role: "ADMIN_LAYER_1",
      };
    }

    const payload = token.split(".")[1];

    if (!payload) {
      return {
        name: "Admin",
        role: "ADMIN_LAYER_1",
      };
    }

    const decoded = JSON.parse(
      atob(
        payload
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    return {
      name: decoded.full_name || "Admin",
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
     DROPDOWN ANIMATION
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

  const getOptionLabel = (
    item
  ) => {
    if (getLabel) {
      return getLabel(item);
    }

    return (
      item?.city_name ||
      item?.zone_name ||
      item?.division_name ||
      item?.ward_name ||
      String(item ?? "")
    );
  };

  const getOptionKey = (
    item,
    index
  ) => {
    if (getKey) {
      return getKey(item);
    }

    return (
      item?.city_id ||
      item?.zone_id ||
      item?.division_id ||
      item?.ward_id ||
      `${item}-${index}`
    );
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative shrink-0 ${width}`}
    >
      <button
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        className="
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
          hover:border-violet-400
          transition-all
          duration-300
        "
      >
        <span className="truncate">
          {value || placeholder}
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
          {options.length === 0 ? (
            <div
              className="
                px-4
                py-2.5
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
                      onChange(item);
                      setOpen(false);
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
                    <span className="whitespace-nowrap min-w-max">
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

  /*
   * IMPORTANT:
   * Date is owned by the page.
   *
   * WasteGenerators.jsx:
   *
   * <Header
   *   selectedDate={selectedDate}
   *   setSelectedDate={setSelectedDate}
   * />
   *
   * Overview.jsx does the same.
   */

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
    zones,
    divisions,
    wards,
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
     USER
  ======================================================= */

  const getCurrentUser = () => {
    try {
      /* =====================================================
         1. READ AUTH HANDOFF FROM LOGIN FRONTEND
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
         2. READ STORED ADMIN
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
         3. READ JWT
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
         4. RESOLVE ACTUAL USER
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

    /* =====================================================
       5. EXISTING JWT FALLBACK
    ===================================================== */

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

  /* =========================================================
     DATE / DAY TYPE
  ========================================================= */

  const selectedDateObj =
    selectedDate
      ? new Date(
          `${selectedDate}T12:00:00`
        )
      : new Date();

  const selectedDay =
    selectedDateObj.getDay();

  /*
   * Sunday    = 0
   * Monday    = 1
   * Tuesday   = 2
   * Wednesday = 3
   * Thursday  = 4
   * Friday    = 5
   * Saturday  = 6
   */

  const isDryDay =
    selectedDay === 3 ||
    selectedDay === 6;

  /*
   * Dry Day exists ONLY on:
   *
   * Wednesday
   * Saturday
   */

  useEffect(() => {
    if (!isDryDay) {
      setDayType("wet");
    }
  }, [
    selectedDate,
    isDryDay,
  ]);

  /* =========================================================
     GSAP HEADER ANIMATION
  ========================================================= */

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

  /* =========================================================
     CLOSE DROPDOWNS
  ========================================================= */

  useEffect(() => {
    function close(event) {
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

  /* =========================================================
     SEARCH SHORTCUT
  ========================================================= */

  useEffect(() => {
    function shortcut(event) {
      if (
        event.key === "/" &&
        variant !== "dashboard"
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
  }, [variant]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    sessionStorage.clear();

    window.location.replace(
      "https://app-authentication-frontend.onrender.com"
    );
  };

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatLocalDate = (
    date
  ) => {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* =========================================================
     DATE CHANGE HANDLER
  ========================================================= */

  const handleDateChange = (
    date
  ) => {
    if (!date) {
      return;
    }

    const formattedDate =
      formatLocalDate(date);

    setSelectedDate(
      formattedDate
    );
  };

  /* =========================================================
     LANGUAGE HANDLER
  ========================================================= */

  const handleLanguageChange = (
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

    setLanguageOpen(false);
  };

  /* =========================================================
     CURRENT LANGUAGE

     EN -> English
     KN -> ಕನ್ನಡ
     HI -> हिंदी
     TE -> తెలుగు
  ========================================================= */

  const currentLanguageCode =
    language === "en"
      ? "EN"
      : language === "kn"
      ? "KN"
      : language === "hi"
      ? "HI"
      : language === "te"
      ? "TE"
      : "EN";

  /* =========================================================
     DYNAMIC LOCATION FILTERS
  ========================================================= */

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
          selectedCity?.city_name ||
          t(
            "filters.city",
            "Select City"
          )
        }
        options={cities}
        onChange={setSelectedCity}
        placeholder={t(
          "filters.city",
          "Select City"
        )}
        getLabel={(city) =>
          city?.city_name ||
          ""
        }
        getKey={(city) =>
          city?.city_id
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
          selectedZone?.zone_name ||
          t(
            "filters.zone",
            "Select Zone"
          )
        }
        options={zones}
        onChange={setSelectedZone}
        placeholder={t(
          "filters.zone",
          "Select Zone"
        )}
        getLabel={(zone) =>
          zone?.zone_name ||
          ""
        }
        getKey={(zone) =>
          zone?.zone_id
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
          selectedDivision
            ?.division_name ||
          t(
            "filters.division",
            "Select Division"
          )
        }
        options={divisions}
        onChange={
          setSelectedDivision
        }
        placeholder={t(
          "filters.division",
          "Select Division"
        )}
        getLabel={(
          division
        ) =>
          division
            ?.division_name ||
          ""
        }
        getKey={(
          division
        ) =>
          division?.division_id
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
            ? `${selectedWard.ward_name}${
                selectedWard.ward_no !==
                undefined
                  ? ` (${selectedWard.ward_no})`
                  : ""
              }`
            : t(
                "filters.ward",
                "Select Ward"
              )
        }
        options={wards}
        onChange={
          setSelectedWard
        }
        placeholder={t(
          "filters.ward",
          "Select Ward"
        )}
        getLabel={(ward) =>
          ward
            ? `${ward.ward_name}${
                ward.ward_no !==
                undefined
                  ? ` (${ward.ward_no})`
                  : ""
              }`
            : ""
        }
        getKey={(ward) =>
          ward?.ward_id
        }
      />
    </>
  );

  /* =========================================================
     SEARCH INPUT
  ========================================================= */

  const searchInput = (
    <div className="relative w-[280px]">
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
        onChange={(event) =>
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

  /* =========================================================
     RENDER
  ========================================================= */

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
          {/* =================================================
              MOBILE / TABLET BRAND
          ================================================= */}

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
              <Menu size={17} />
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

          {/* =================================================
              DESKTOP DASHBOARD FILTERS
          ================================================= */}

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
            RIGHT SIDE CONTROLS
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

          <div className="relative shrink-0">
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
              {/* =============================================
                  DRY DAY
                  ONLY WEDNESDAY / SATURDAY
              ============================================= */}

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

              {/* =============================================
                  WET DAY
                  ALWAYS AVAILABLE
              ============================================= */}

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
                  !languageOpen
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
                className="text-violet-600"
              />

              <span
                className="
                  text-[11px]
                  sm:text-[12px]
                  font-semibold
                  text-[#16295A]
                "
              >
                {currentLanguageCode}
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
                      {/* IMPORTANT:
                          Do NOT use t() here.
                          Language names always remain
                          in their native language. */}

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
                  !profileOpen
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
                {userInitial}
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
                  {user.name}
                </h4>

                <p
                  className="
                    text-[10px]
                    text-gray-500
                    truncate
                    max-w-[100px]
                  "
                >
                  {roleLabel}
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
                SETTINGS REMOVED
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
                      {userInitial}
                    </div>

                    <div className="min-w-0">
                      <h3
                        className="
                          font-semibold
                          text-[13px]
                          text-[#16295A]
                          truncate
                        "
                      >
                        {user.name}
                      </h3>

                      <p
                        className="
                          text-[10px]
                          text-gray-500
                          mt-0.5
                          truncate
                        "
                      >
                        {roleLabel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    LOGOUT ONLY
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
          NON-DASHBOARD SMALL SCREEN SEARCH ROW
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
          <div className="w-full">
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