import {
  Search,
  Globe,
  ChevronDown,
  Settings,
  LogOut,
  Check,
  X,
  Menu,
} from "lucide-react";

import { useFilters } from "../../contexts/FilterContext";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

import Calendar from "../Calendar/Calendar";

import { useLanguage } from "../../i18n";

import SewacLogo from "../../assets/sewac_logo.svg";

/* =========================================================
   LANGUAGE OPTIONS
========================================================= */

const languages = [
  {
    code: "en",
    translationKey: "language.english",
  },
  {
    code: "kn",
    translationKey: "language.kannada",
  },
  {
    code: "hi",
    translationKey: "language.hindi",
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

    const decoded = JSON.parse(
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
   DROPDOWN
========================================================= */

function Dropdown({
  width,
  value,
  options,
  onChange,
  placeholder = "Select",
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
    function close(e) {
      if (
        !wrapperRef.current?.contains(
          e.target
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

  return (
    <div
      ref={wrapperRef}
      className={`
        relative
        shrink-0
        ${width}
      `}
    >
      {/* =================================================
          BUTTON
      ================================================= */}

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
          {value ||
            placeholder}
        </span>

        <ChevronDown
          size={14}
          className={`
            shrink-0
            ml-2

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

      {/* =================================================
          MENU
      ================================================= */}

      {open && (
        <div
          ref={menuRef}
          className="
            absolute

            top-11
            left-0

            w-full

            max-h-[315px]

            overflow-y-auto

            rounded-2xl

            bg-white

            border
            border-gray-100

            shadow-[0_15px_40px_rgba(0,0,0,0.08)]

            z-[99999]

            scrollbar-thin
            scrollbar-thumb-violet-300
            scrollbar-track-transparent
          "
        >
          {options.map(
            (item) => {
              const label =
                item.city_name ||
                item.zone_name ||
                item.division_name ||
                item.ward_name ||
                item;

              const key =
                item.city_id ||
                item.zone_id ||
                item.division_id ||
                item.ward_id ||
                label;

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

                    px-4
                    py-2.5

                    flex
                    items-center
                    justify-between

                    text-[12px]

                    hover:bg-violet-50

                    transition

                    text-left
                  "
                >
                  <span className="truncate">
                    {label}
                  </span>

                  {label ===
                    value && (
                    <Check
                      size={14}
                      className="
                        text-violet-600

                        shrink-0

                        ml-2
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
  );
}

/* =========================================================
   SIDEBAR TOGGLE
========================================================= */

const toggleSidebar = () => {
  window.dispatchEvent(
    new Event(
      "sewac-toggle-sidebar"
    )
  );
};

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
  const navigate =
    useNavigate();

  /* =======================================================
     LANGUAGE
  ======================================================= */

  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

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

  /* =======================================================
     FILTER CONTEXT
  ======================================================= */

  const {
    selectedCity,
    setSelectedCity,

    selectedZone,
    setSelectedZone,

    selectedDivision,
    setSelectedDivision,

    selectedWard,
    setSelectedWard,

    cities,
    zones,
    divisions,
    wards,
  } = useFilters();

  /* =======================================================
     USER
  ======================================================= */

  const [user, setUser] =
    useState(() =>
      getUserFromToken()
    );

  const roleLabel =
    getRoleLabel(user.role);

  const userInitial =
    user.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||
    "A";

  /* =======================================================
     STATE
  ======================================================= */

  const [dayType, setDayType] =
    useState("wet");

  const [search, setSearch] =
    useState("");

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const [
    languageOpen,
    setLanguageOpen,
  ] = useState(false);

  const isDashboard =
    variant === "dashboard";

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

  /*
   * Wednesday = 3
   * Saturday  = 6
   */

  const isDryDay =
    selectedDay === 3 ||
    selectedDay === 6;

  /* =======================================================
     REFRESH USER
  ======================================================= */

  useEffect(() => {
    setUser(
      getUserFromToken()
    );
  }, []);

  /* =======================================================
     HEADER ANIMATION
  ======================================================= */

  useLayoutEffect(() => {
    const tl =
      gsap.timeline();

    if (headerRef.current) {
      tl.from(
        headerRef.current,
        {
          y: -24,
          opacity: 0,
          duration: 0.45,
          ease: "power4.out",
        }
      );
    }

    if (controlsRef.current) {
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
    function close(e) {
      if (
        !profileRef.current?.contains(
          e.target
        )
      ) {
        setProfileOpen(false);
      }

      if (
        !languageRef.current?.contains(
          e.target
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

  /* =======================================================
     SEARCH SHORTCUT
  ======================================================= */

  useEffect(() => {
    function shortcut(e) {
      if (
        e.key === "/" &&
        variant !== "dashboard"
      ) {
        e.preventDefault();

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

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    sessionStorage.clear();

    window.location.replace(
      "https://app-authentication-frontend.onrender.com"
    );
  };

  /* =======================================================
     DATE FORMAT
  ======================================================= */

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

  /* =======================================================
     LANGUAGE CHANGE
  ======================================================= */

  const handleLanguageChange = (
    languageCode
  ) => {
    setLanguage(languageCode);

    setLanguageOpen(false);
  };

  /* =======================================================
     CURRENT LANGUAGE
  ======================================================= */

  const currentLanguageCode =
    language === "en"
      ? "EN"
      : language === "kn"
        ? "KN"
        : "HI";

  /* =======================================================
     LOCATION FILTERS

     IMPORTANT BREAKPOINT:

     < 1536px
       Filters get their own row.

     >= 1536px
       Filters stay in the main header row.
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
          selectedCity?.city_name ||
          t("filters.city")
        }
        options={cities}
        onChange={
          setSelectedCity
        }
        placeholder={
          t("filters.city")
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
          t("filters.zone")
        }
        options={zones}
        onChange={
          setSelectedZone
        }
        placeholder={
          t("filters.zone")
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
          selectedDivision?.division_name ||
          "Select Division"
        }
        options={divisions}
        onChange={
          setSelectedDivision
        }
        placeholder="Select Division"
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
            ? `${selectedWard.ward_name} (${selectedWard.ward_no})`
            : "Select Ward"
        }
        options={wards}
        onChange={
          setSelectedWard
        }
        placeholder="Select Ward"
      />
    </>
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

        pt-2
        pb-2

        overflow-visible
      "
    >
      {/* ===================================================
          MAIN HEADER ROW

          >= 1536px:
            Everything in one row.

          < 1536px:
            Right controls occupy this row.
      =================================================== */}

      <div
        className="
          w-full

          min-h-[44px]

          flex
          items-center
          justify-between

          gap-2
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
              MOBILE MENU + LOGO

              Visible below 1536 only on
              mobile/tablet where sidebar
              may need to be opened.
          =============================================== */}

          <div
            className="
              flex
              items-center

              gap-2

              shrink-0

              md:hidden

              2xl:hidden
            "
          >
            <button
              type="button"
              onClick={
                toggleSidebar
              }
              aria-label="Open navigation menu"
              className="
                w-9
                h-9

                rounded-xl

                border
                border-gray-200

                bg-white

                flex
                items-center
                justify-center

                text-[#16295A]

                hover:border-violet-400
                hover:text-violet-600

                transition-all
                duration-200
              "
            >
              <Menu
                size={19}
              />
            </button>

            <img
              src={SewacLogo}
              alt="SEWAC"
              draggable={false}
              className="
                w-[64px]
                sm:w-[72px]

                h-auto

                object-contain

                select-none
              "
            />
          </div>

          {/* ===============================================
              DESKTOP FILTERS

              ONLY 1536px+
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
            /* =============================================
               DESKTOP SEARCH
            ============================================= */

            <div
              className="
                relative

                hidden
                2xl:block
              "
            >
              <Search
                size={16}
                className="
                  absolute

                  left-3
                  top-1/2

                  -translate-y-1/2

                  text-gray-400
                "
              />

              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder={t(
                  "header.search"
                )}
                className="
                  w-[330px]

                  h-9

                  rounded-xl

                  border
                  border-gray-200

                  bg-white

                  pl-10
                  pr-9

                  text-[12px]

                  outline-none

                  transition-all
                  duration-300

                  focus:border-violet-500

                  focus:ring-2
                  focus:ring-violet-100
                "
              />

              {search.length >
                0 && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="
                    absolute

                    right-3
                    top-1/2

                    -translate-y-1/2

                    text-gray-400

                    hover:text-violet-600

                    transition
                  "
                >
                  <X
                    size={14}
                  />
                </button>
              )}
            </div>
          )}

          {/* ===============================================
              NON-DASHBOARD SEARCH
          =============================================== */}

          {!isDashboard && (
            <div
              className="
                relative

                flex-1
                min-w-0

                2xl:hidden
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
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder={t(
                  "header.search"
                )}
                className="
                  w-full

                  max-w-[360px]

                  h-9

                  rounded-xl

                  border
                  border-gray-200

                  bg-white

                  pl-9
                  pr-8

                  text-[12px]

                  outline-none

                  focus:border-violet-500

                  focus:ring-2
                  focus:ring-violet-100
                "
              />

              {search.length >
                0 && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="
                    absolute

                    right-3
                    top-1/2

                    -translate-y-1/2

                    text-gray-400
                  "
                >
                  <X
                    size={14}
                  />
                </button>
              )}
            </div>
          )}
        </div>

        {/* =================================================
            RIGHT CONTROLS

            At 1285px this group is
            completely independent from
            the location filters.

            This prevents overlap.
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-end

            gap-1
            sm:gap-2

            shrink-0
          "
        >
          {/* ===============================================
              CALENDAR
          =============================================== */}

          <div
            className="
              shrink-0

              flex
              items-center
              justify-center
            "
          >
            <Calendar
              value={
                selectedDateObj
              }
              onChange={(date) => {
                setSelectedDate(
                  formatLocalDate(
                    date
                  )
                );
              }}
            />
          </div>

          {/* ===============================================
              WET / DRY
          =============================================== */}

          <div
            className="
              hidden
              sm:flex

              rounded-xl

              border
              border-gray-200

              overflow-hidden

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

                  px-3
                  2xl:px-4

                  text-[11px]
                  2xl:text-[12px]

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
                  "header.dryDay"
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

                px-3
                2xl:px-4

                text-[11px]
                2xl:text-[12px]

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
                "header.wetDay"
              )}
            </button>
          </div>

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
                  !languageOpen
                )
              }
              aria-expanded={
                languageOpen
              }
              className="
                h-9

                px-2
                sm:px-3

                rounded-xl

                border
                border-gray-200

                bg-white

                flex
                items-center

                gap-1
                sm:gap-1.5

                hover:border-violet-400

                transition-all
                duration-300
              "
            >
              <Globe
                size={14}
                className="
                  text-violet-600
                  shrink-0
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
                size={12}
                className={`
                  shrink-0

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

            {/* =============================================
                LANGUAGE MENU
            ============================================= */}

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

                  z-[99999]
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

                        hover:bg-violet-50

                        transition

                        text-left
                      "
                    >
                      <span>
                        {t(
                          item.translationKey
                        )}
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

                2xl:pr-3

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
              {/* =========================================
                  AVATAR
              ========================================= */}

              <div
                className="
                  w-8
                  h-8

                  rounded-full

                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-600

                  text-white

                  text-[13px]

                  font-semibold

                  flex
                  items-center
                  justify-center

                  shrink-0
                "
              >
                {userInitial}
              </div>

              {/* =========================================
                  USER INFORMATION
              ========================================= */}

              <div
                className="
                  hidden
                  sm:block

                  text-left

                  leading-tight

                  max-w-[100px]
                  2xl:max-w-none
                "
              >
                <h4
                  className="
                    text-[11px]
                    2xl:text-[12px]

                    font-semibold

                    text-[#16295A]

                    truncate
                  "
                >
                  {user.name}
                </h4>

                <p
                  className="
                    text-[9px]
                    2xl:text-[10px]

                    text-gray-500

                    truncate
                  "
                >
                  {roleLabel}
                </p>
              </div>

              <ChevronDown
                size={12}
                className={`
                  hidden
                  sm:block

                  shrink-0

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

            {/* =============================================
                PROFILE DROPDOWN
            ============================================= */}

            {profileOpen && (
              <div
                className="
                  absolute

                  right-0

                  top-11

                  w-56

                  rounded-2xl

                  bg-white

                  border
                  border-gray-100

                  shadow-[0_15px_40px_rgba(0,0,0,0.08)]

                  overflow-hidden

                  z-[99999]
                "
                ref={(el) => {
                  if (el) {
                    gsap.fromTo(
                      el,
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
                {/* =========================================
                    USER INFO
                ========================================= */}

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

                {/* =========================================
                    SETTINGS
                ========================================= */}

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(
                      false
                    );

                    navigate(
                      "/dashboard/admin/settings"
                    );
                  }}
                  className="
                    w-full

                    px-5
                    py-3

                    flex
                    items-center

                    gap-3

                    text-[12px]

                    text-[#16295A]

                    hover:bg-violet-50

                    transition
                  "
                >
                  <Settings
                    size={16}
                  />

                  {t(
                    "sidebar.settings"
                  )}
                </button>

                {/* =========================================
                    LOGOUT
                ========================================= */}

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
                  "
                >
                  <LogOut
                    size={16}
                  />

                  {t(
                    "sidebar.logout"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================
          RESPONSIVE FILTER ROW

          < 1536px ONLY

          This is the important change.

          At your:

            1285 × 872

          you will get:

          ROW 1:
          Calendar | Wet Day | EN | Admin

          ROW 2:
          Bangalore | Zone | Division | Ward
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
          "
        >
          <div
            className="
              flex
              items-center

              gap-2

              min-w-max
            "
          >
            {locationFilters}
          </div>
        </div>
      )}
    </header>
  );
}