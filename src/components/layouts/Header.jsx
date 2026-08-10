import {
  Search,
  Globe,
  ChevronDown,
  CalendarDays,
  Settings,
  LogOut,
  Check,
  Plus,
  X,
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

const languages = ["English", "Kannada", "Hindi"];

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
      role: decoded.role || "ADMIN_LAYER_1",
    };
  } catch (error) {
    console.error("Failed to decode authentication token:", error);

    return {
      name: "Admin",
      role: "ADMIN_LAYER_1",
    };
  }
}

function getRoleLabel(role) {
  return ROLE_LABELS[role] || role || "Admin Layer 1";
}

/* =========================================================
   DROPDOWN
========================================================= */

function Dropdown({
  width,
  value,
  options,
  addLabel,
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function close(e) {
      if (!wrapperRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", close);

    return () => {
      window.removeEventListener("mousedown", close);
    };
  }, []);

  useEffect(() => {
    if (open && menuRef.current) {
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
      className={`relative ${width}`}
    >
      <button
        onClick={() => setOpen(!open)}
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
        <span>{value}</span>

        <ChevronDown
          size={14}
          className={`
            transition-transform
            duration-300
            ${open ? "rotate-180" : ""}
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
            rounded-2xl
            bg-white
            border
            border-gray-100
            shadow-[0_15px_40px_rgba(0,0,0,0.08)]
            overflow-hidden
            z-[9999]
          "
        >
          {options.map((item) => {
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
                "
              >
                {label}

                {label === value && (
                  <Check
                    size={14}
                    className="text-violet-600"
                  />
                )}
              </button>
            );
          })}

          <button
            className="
              w-full
              border-t
              border-gray-100
              px-4
              py-2.5
              flex
              items-center
              gap-2
              text-[12px]
              font-semibold
              text-violet-600
              hover:bg-violet-50
              transition
            "
          >
            <Plus size={14} />

            {addLabel}
          </button>
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
  selectedDate = new Date()
    .toISOString()
    .split("T")[0],
  setSelectedDate = () => {},
}) {
  const navigate = useNavigate();

  const headerRef = useRef(null);
  const controlsRef = useRef(null);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const languageRef = useRef(null);
  const languageMenuRef = useRef(null);

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

  const [user, setUser] = useState(() =>
    getUserFromToken()
  );

  const roleLabel = getRoleLabel(user.role);

  const userInitial =
    user.name?.trim()?.charAt(0)?.toUpperCase() || "A";

  /* =======================================================
     STATE
  ======================================================= */

  const [selectedLanguage, setSelectedLanguage] =
    useState("English");

  const [dayType, setDayType] = useState("wet");

  const [search, setSearch] = useState("");

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [languageOpen, setLanguageOpen] =
    useState(false);

  const isDashboard = variant === "dashboard";

  /* =======================================================
     DATE
  ======================================================= */

  const selectedDateObj = selectedDate
    ? new Date(`${selectedDate}T12:00:00`)
    : new Date();

  const selectedDay = selectedDateObj.getDay();

  // Wednesday = 3
  // Saturday = 6
  const isDryDay =
    selectedDay === 3 || selectedDay === 6;

  /* =======================================================
     REFRESH USER FROM SESSION
  ======================================================= */

  useEffect(() => {
    setUser(getUserFromToken());
  }, []);

  /* =======================================================
     HEADER ANIMATION
  ======================================================= */

  useLayoutEffect(() => {
    const tl = gsap.timeline();

    if (headerRef.current) {
      tl.from(headerRef.current, {
        y: -24,
        opacity: 0,
        duration: 0.45,
        ease: "power4.out",
      });
    }

    if (controlsRef.current) {
      tl.from(
        controlsRef.current.children,
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
        !profileRef.current?.contains(e.target)
      ) {
        setProfileOpen(false);
      }

      if (
        !languageRef.current?.contains(e.target)
      ) {
        setLanguageOpen(false);
      }
    }

    window.addEventListener("mousedown", close);

    return () => {
      window.removeEventListener("mousedown", close);
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

    window.addEventListener("keydown", shortcut);

    return () => {
      window.removeEventListener("keydown", shortcut);
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

  const formatLocalDate = (date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

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
        h-16
        bg-white
        border-b
        border-gray-100
        px-4
        flex
        items-center
        justify-between
      "
    >
      {/* ===================================================
          LEFT
      =================================================== */}

      <div
        ref={controlsRef}
        className="flex items-center gap-3"
      >
        {isDashboard ? (
          <div className="flex items-center gap-2">
            {/* City */}

            <Dropdown
              width="w-[118px]"
              value={
                selectedCity?.city_name ||
                "Select City"
              }
              options={cities}
              addLabel="Add City"
              onChange={setSelectedCity}
            />

            {/* Zone */}

            <Dropdown
              width="w-[200px]"
              value={
                selectedZone?.zone_name ||
                "Select Zone"
              }
              options={zones}
              addLabel="Add Zone"
              onChange={setSelectedZone}
            />

            {/* Division */}

            <Dropdown
              width="w-[138px]"
              value={
                selectedDivision?.division_name ||
                "Select Division"
              }
              options={divisions}
              addLabel="Add Division"
              onChange={setSelectedDivision}
            />

            {/* Ward */}

            <Dropdown
              width="w-[122px]"
              value={
                selectedWard
                  ? `${selectedWard.ward_name} (${selectedWard.ward_no})`
                  : "Select Ward"
              }
              options={wards}
              addLabel="Add Ward"
              onChange={setSelectedWard}
            />
          </div>
        ) : (
          /* Search */

          <div className="relative">
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
                setSearch(e.target.value)
              }
              placeholder="Search..."
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

            {search.length > 0 && (
              <button
                onClick={() => setSearch("")}
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
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ===================================================
          RIGHT
      =================================================== */}

      <div className="flex items-center gap-2.5">
        {/* =================================================
            CALENDAR
        ================================================= */}

        <div className="flex items-center justify-center">
          <Calendar
            value={selectedDateObj}
            onChange={(date) => {
              setSelectedDate(
                formatLocalDate(date)
              );
            }}
          />
        </div>

        {/* =================================================
            WET / DRY DAY
        ================================================= */}

        <div
          className="
            flex
            rounded-xl
            border
            border-gray-200
            overflow-hidden
          "
        >
          {isDryDay && (
            <button
              onClick={() =>
                setDayType("dry")
              }
              className={`
                h-9
                px-4
                text-[12px]
                font-semibold
                transition-all
                duration-300

                ${
                  dayType === "dry"
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                    : "bg-white text-[#16295A] hover:bg-gray-50"
                }
              `}
            >
              Dry Day
            </button>
          )}

          <button
            onClick={() =>
              setDayType("wet")
            }
            className={`
              h-9
              px-4
              text-[12px]
              font-semibold
              transition-all
              duration-300

              ${
                dayType === "wet"
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                  : "bg-white text-[#16295A] hover:bg-gray-50"
              }
            `}
          >
            Wet Day
          </button>
        </div>

        {/* =================================================
            LANGUAGE
        ================================================= */}

        <div
          ref={languageRef}
          className="relative"
        >
          <button
            onClick={() =>
              setLanguageOpen(!languageOpen)
            }
            className="
              h-9
              px-3
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
            <Globe
              size={15}
              className="text-violet-600"
            />

            <span className="text-[12px] font-semibold text-[#16295A]">
              {selectedLanguage === "English"
                ? "EN"
                : selectedLanguage === "Kannada"
                  ? "KN"
                  : "HI"}
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
              ref={languageMenuRef}
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
                z-[9999]
              "
            >
              {languages.map((language) => (
                <button
                  key={language}
                  onClick={() => {
                    setSelectedLanguage(
                      language
                    );

                    setLanguageOpen(false);
                  }}
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
                  "
                >
                  {language}

                  {selectedLanguage ===
                    language && (
                    <Check
                      size={14}
                      className="text-violet-600"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =================================================
            PROFILE
        ================================================= */}

        <div
          ref={profileRef}
          className="relative"
        >
          <button
            onClick={() =>
              setProfileOpen(!profileOpen)
            }
            className="
              h-9
              pl-2
              pr-3
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
            {/* Avatar */}

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
              "
            >
              {userInitial}
            </div>

            {/* User info */}

            <div className="text-left leading-tight">
              <h4 className="text-[12px] font-semibold text-[#16295A]">
                {user.name}
              </h4>

              <p className="text-[10px] text-gray-500">
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
          ================================================= */}

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
                z-[9999]
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
              {/* User information */}

              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
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
                    "
                  >
                    {userInitial}
                  </div>

                  <div>
                    <h3 className="font-semibold text-[13px] text-[#16295A]">
                      {user.name}
                    </h3>

                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {roleLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Settings */}

              <button
                onClick={() => {
                  setProfileOpen(false);

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
                <Settings size={16} />

                Settings
              </button>

              {/* Logout */}

              <button
                onClick={() => {
                  setProfileOpen(false);

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
                <LogOut size={16} />

                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}