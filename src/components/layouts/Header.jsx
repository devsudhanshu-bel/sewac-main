import {
  Menu,
  Search,
  Bell,
  Globe,
  ChevronDown,
  CalendarDays,
  Settings,
  LogOut,
  Check,
  Plus,
  X,
} from "lucide-react";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Calendar from "../Calendar/Calendar";

const cities = [
  "Bangalore",
  "Mysore",
  "Mangalore",
  "Hubli",
  "Belgaum",
];

const zones = [
  "All Zones",
  "East Zone",
  "West Zone",
  "South Zone",
  "North Zone",
  "Mahadevapura",
  "Bommanahalli",
  "RR Nagar",
  "Yelahanka",
  "Dasarahalli",
];

const divisions = [
  "All Divisions",
  "Division 1",
  "Division 2",
  "Division 3",
];

const wards = [
  "All Wards",
  "Ward 1",
  "Ward 2",
  "Ward 3",
];

const languages = [
  "English",
  "Kannada",
  "Hindi",
];

const notifications = [
  {
    title: "Vehicle KA-01 AB 1234 reached destination",
    time: "2 min ago",
  },
  {
    title: "Plant capacity exceeded 90%",
    time: "8 min ago",
  },
  {
    title: "AI generated today's report",
    time: "25 min ago",
  },
  {
    title: "New administrator added",
    time: "1 hr ago",
  },
];

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
      if (!wrapperRef.current?.contains(e.target))
        setOpen(false);
    }

    window.addEventListener("mousedown", close);

    return () =>
      window.removeEventListener("mousedown", close);
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
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
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
            z-50
          "
        >
          {options.map((item) => (
            <button
              key={item}
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
              {item}

              {item === value && (
                <Check
                  size={14}
                  className="text-violet-600"
                />
              )}
            </button>
          ))}

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

export default function Header({
  variant = "dashboard",
}) {
  const navigate = useNavigate();

  const headerRef = useRef(null);

  const controlsRef = useRef(null);

  const searchRef = useRef(null);

  const profileRef = useRef(null);

  const bellRef = useRef(null);

  const languageMenuRef = useRef(null);

  const languageRef = useRef(null);

  const [selectedCity, setSelectedCity] =
    useState("Bangalore");

  const [selectedZone, setSelectedZone] =
    useState("All Zones");

  const [selectedDivision, setSelectedDivision] =
    useState("All Divisions");

  const [selectedWard, setSelectedWard] =
    useState("All Wards");

  const [selectedLanguage, setSelectedLanguage] =
    useState("English");

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [dayType, setDayType] =
    useState("dry");

  const [search, setSearch] =
    useState("");

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [languageOpen, setLanguageOpen] =
    useState(false);

  const isDashboard =
    variant === "dashboard";

  useLayoutEffect(() => {
    const tl = gsap.timeline();

    tl.from(headerRef.current, {
      y: -24,
      opacity: 0,
      duration: 0.45,
      ease: "power4.out",
    }).from(
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
  }, []);

  useEffect(() => {
    function close(e) {
      if (!profileRef.current?.contains(e.target))
        setProfileOpen(false);

      if (!bellRef.current?.contains(e.target))
        setNotificationOpen(false);

      if (!languageRef.current?.contains(e.target))
        setLanguageOpen(false);
    }

    window.addEventListener("mousedown", close);

    return () =>
      window.removeEventListener("mousedown", close);
  }, []);

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

    return () =>
      window.removeEventListener(
        "keydown",
        shortcut
      );
  }, [variant]);

  return (
    <header
      ref={headerRef}
      className="
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
      {/* ================= LEFT ================= */}

      <div
        ref={controlsRef}
        className="flex items-center gap-3"
      >
        <button
          className="
            w-9
            h-9
            rounded-xl
            bg-violet-50
            text-violet-600
            flex
            items-center
            justify-center
            hover:bg-violet-100
            transition-all
            duration-300
          "
        >
          <Menu size={17} />
        </button>

        {isDashboard ? (
          <div className="flex items-center gap-2">
                        <Dropdown
              width="w-[118px]"
              value={selectedCity}
              options={cities}
              addLabel="+ Add City"
              onChange={setSelectedCity}
            />

            <Dropdown
              width="w-[118px]"
              value={selectedZone}
              options={zones}
              addLabel="+ Add Zone"
              onChange={setSelectedZone}
            />

            <Dropdown
              width="w-[138px]"
              value={selectedDivision}
              options={divisions}
              addLabel="+ Add Division"
              onChange={setSelectedDivision}
            />

            <Dropdown
              width="w-[122px]"
              value={selectedWard}
              options={wards}
              addLabel="+ Add Ward"
              onChange={setSelectedWard}
            />

          </div>
        ) : (
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

      {/* ================= RIGHT ================= */}

      <div className="flex items-center gap-2.5">


 {/* ================= Calendar ================= */}

<div
  className="
    flex
    items-center
    justify-center
  "
>
  <Calendar
    value={selectedDate}
    onChange={setSelectedDate}
  />
</div>

        {/* Dry / Wet */}

        <div
          className="
            flex
            rounded-xl
            border
            border-gray-200
            overflow-hidden
          "
        >

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

        {/* Language */}

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
              className={`transition-transform duration-300 ${
                languageOpen
                  ? "rotate-180"
                  : ""
              }`}
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
                z-50
              "
            >
              {languages.map((language) => (

                <button
                  key={language}
                  onClick={() => {
                    setSelectedLanguage(language);
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

                  {selectedLanguage === language && (
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
                {/* Notifications */}

        <div
          ref={bellRef}
          className="relative"
        >
          <button
            onClick={() =>
              setNotificationOpen(!notificationOpen)
            }
            className="
              relative
              w-9
              h-9
              rounded-xl
              border
              border-gray-200
              bg-white
              flex
              items-center
              justify-center
              hover:border-violet-400
              transition-all
              duration-300
            "
          >
            <Bell
              size={17}
              className="text-[#16295A]"
            />

            <span
              className="
                absolute
                -top-1
                -right-1
                w-4.5
                h-4.5
                rounded-full
                bg-red-500
                text-white
                text-[9px]
                font-semibold
                flex
                items-center
                justify-center
              "
            >
              {notifications.length}
            </span>
          </button>

          {notificationOpen && (
            <div
              className="
                absolute
                right-0
                top-11
                w-[320px]
                rounded-2xl
                bg-white
                border
                border-gray-100
                shadow-[0_15px_40px_rgba(0,0,0,0.08)]
                overflow-hidden
                z-50
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
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-[14px] text-[#16295A]">
                  Notifications
                </h3>
              </div>

              {notifications.map((item, index) => (
                <button
                  key={index}
                  className="
                    w-full
                    text-left
                    px-5
                    py-3
                    border-b
                    border-gray-100
                    hover:bg-violet-50
                    transition
                  "
                >
                  <h4 className="text-[12px] font-medium text-[#16295A]">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-gray-500 mt-1">
                    {item.time}
                  </p>
                </button>
              ))}

              <button
                className="
                  w-full
                  py-3
                  text-[12px]
                  font-semibold
                  text-violet-600
                  hover:bg-violet-50
                  transition
                "
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>

        {/* Profile */}

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
              A
            </div>

            <div className="text-left leading-tight">
              <h4 className="text-[12px] font-semibold text-[#16295A]">
                Admin
              </h4>

              <p className="text-[10px] text-gray-500">
                Super Admin
              </p>
            </div>

            <ChevronDown
              size={13}
              className={`transition-transform duration-300 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

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
                z-50
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
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-[14px] text-[#16295A]">
                  Admin
                </h3>

                <p className="text-[11px] text-gray-500 mt-1">
                  Super Administrator
                </p>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/admin/settings");
                }}
                className="
                  w-full
                  px-5
                  py-3
                  flex
                  items-center
                  gap-3
                  text-[12px]
                  hover:bg-violet-50
                  transition
                "
              >
                <Settings size={16} />

                Settings
              </button>

              <button
                onClick={() => {
                  setProfileOpen(false);

                  console.log("Logout");
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