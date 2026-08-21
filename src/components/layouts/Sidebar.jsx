import {
  LayoutDashboard,
  Users,
  Truck,
  Factory,
  MessageCircle,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { gsap } from "gsap";

import SewacLogo from "../../assets/sewac_logo.svg";
import { useLanguage } from "../../i18n";

/* =========================================================
   ROLE ACCESS
========================================================= */

const ROLE_ACCESS = {
  ADMIN_LAYER_1: {
    overview: true,
    waste_generators: true,
    vehicles: true,
    plants: true,
    complaints: true,
    users: true,
  },

  ADMIN_LAYER_2: {
    overview: true,
    waste_generators: true,
    vehicles: true,
    plants: true,
    complaints: true,
    users: true,
  },

  WORKER: {
    overview: true,
    waste_generators: false,
    vehicles: true,
    plants: true,
    complaints: false,
    users: false,
  },
};

/* =========================================================
   AUTHENTICATED USER ROLE
========================================================= */

function getAuthenticatedRole() {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) {
      return null;
    }

    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );

    return decoded.role ? String(decoded.role).trim().toUpperCase() : null;
  } catch (error) {
    console.error("Failed to read authenticated user role:", error);

    return null;
  }
}

/* =========================================================
   SIDEBAR
========================================================= */

export default function Sidebar() {
  const sidebarRef = useRef(null);

  const logoRef = useRef(null);

  const navRef = useRef(null);

  const logoutRef = useRef(null);

  /* =======================================================
     LANGUAGE
  ======================================================= */

  const { t } = useLanguage();

  /* =======================================================
     MOBILE DRAWER
  ======================================================= */

  const [mobileOpen, setMobileOpen] = useState(false);

  /* =======================================================
     AUTHENTICATED ROLE
  ======================================================= */

  const role = getAuthenticatedRole();

  const permissions = ROLE_ACCESS[role] || {};

  /* =======================================================
     USERS ROUTE

     Admin Layer 1 → Users.jsx
     Admin Layer 2 → Users2.jsx
  ======================================================= */

  const usersPath =
    role === "ADMIN_LAYER_1"
      ? "/dashboard/admin/users"
      : "/dashboard/admin/users2";

  /* =======================================================
     MENU ITEMS
  ======================================================= */

  const allMenuItems = [
    {
      key: "overview",
      permission: "overview",
      path: "/dashboard/admin/overview",
      icon: LayoutDashboard,
      label: t("sidebar.overview"),
    },

    {
      key: "wasteGenerators",
      permission: "waste_generators",
      path: "/dashboard/admin/waste-generators",
      icon: Users,
      label: t("sidebar.wasteGenerators"),
    },

    {
      key: "vehicles",
      permission: "vehicles",
      path: "/dashboard/admin/vehicles",
      icon: Truck,
      label: t("sidebar.vehicles"),
    },

    {
      key: "plant",
      permission: "plants",
      path: "/dashboard/admin/plants",
      icon: Factory,
      label: t("sidebar.plant"),
    },

    {
      key: "complaints",
      permission: "complaints",
      path: "/dashboard/admin/complaints",
      icon: MessageCircle,
      label: t("sidebar.complaints"),
    },

    {
      key: "users",
      permission: "users",
      path: usersPath,
      icon: Users,
      label: t("sidebar.users"),
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | ONLY SHOW PERMITTED ITEMS
  |--------------------------------------------------------------------------
  */

  const menuItems = allMenuItems.filter(
    (item) => permissions[item.permission] === true,
  );

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    sessionStorage.clear();

    window.location.replace("https://app-authentication-frontend.onrender.com");
  };

  /* =======================================================
     SIDEBAR TOGGLE EVENTS
  ======================================================= */

  useEffect(() => {
    const handleToggle = () => {
      setMobileOpen((previous) => !previous);
    };

    const handleClose = () => {
      setMobileOpen(false);
    };

    window.addEventListener("sewac-toggle-sidebar", handleToggle);

    window.addEventListener("sewac-close-sidebar", handleClose);

    return () => {
      window.removeEventListener("sewac-toggle-sidebar", handleToggle);

      window.removeEventListener("sewac-close-sidebar", handleClose);
    };
  }, []);

  /* =======================================================
     CLOSE SIDEBAR WITH ESC
  ======================================================= */

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* =======================================================
     BODY SCROLL LOCK
  ======================================================= */

  useEffect(() => {
    if (mobileOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* =======================================================
     RESET MOBILE DRAWER ON RESIZE
  ======================================================= */

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =======================================================
     SIDEBAR ANIMATION
  ======================================================= */

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!navRef.current) {
        return;
      }

      const navItems = Array.from(navRef.current.children);

      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      /* =================================================
           SIDEBAR
        ================================================= */

      if (sidebarRef.current) {
        tl.fromTo(
          sidebarRef.current,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.28,
          },
        );
      }

      /* =================================================
           LOGO
        ================================================= */

      if (logoRef.current) {
        tl.fromTo(
          logoRef.current,
          {
            opacity: 0,
            y: 22,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.45,
          },
          "-=0.12",
        );
      }

      /* =================================================
           NAVIGATION
        ================================================= */

      if (navItems.length > 0) {
        tl.fromTo(
          navItems,
          {
            opacity: 0,
            y: 22,
            filter: "blur(6px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.42,
            stagger: 0.045,
          },
          "-=0.18",
        );
      }

      /* =================================================
           LOGOUT
        ================================================= */

      if (logoutRef.current) {
        tl.fromTo(
          logoutRef.current,
          {
            opacity: 0,
            y: 18,
            filter: "blur(6px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.4,
          },
          "-=0.18",
        );
      }
    });

    return () => ctx.revert();
  }, []);

  /* =======================================================
     CLOSE MOBILE SIDEBAR
  ======================================================= */

  const closeMobileSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen(false);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* ===================================================
          MOBILE BACKDROP
      =================================================== */}

      <div
        onClick={() => setMobileOpen(false)}
        className={`
          fixed
          inset-0
          z-[9998]

          bg-black/30
          backdrop-blur-[2px]

          transition-all
          duration-300

          md:hidden

          ${
            mobileOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
      />

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside
        ref={sidebarRef}
        className={`
          fixed
          md:relative

          inset-y-0
          left-0

          z-[10000]

          w-[240px]
          md:w-[76px]
          lg:w-[240px]

          h-screen

          shrink-0
          overflow-hidden

          bg-gradient-to-b
          from-violet-700
          via-purple-600
          to-pink-500

          transition-transform
          duration-300
          ease-out

          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}

          md:translate-x-0
        `}
      >
        {/* =================================================
            DECORATIVE BACKGROUND
        ================================================= */}

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="
              absolute
              -top-24
              -left-24

              w-64
              h-64

              rounded-full

              bg-violet-500/30

              blur-[120px]
            "
          />

          <div
            className="
              absolute
              bottom-0
              -right-20

              w-72
              h-72

              rounded-full

              bg-pink-500/30

              blur-[140px]
            "
          />
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="relative z-10 flex flex-col h-full">
          {/* =================================================
              LOGO
          ================================================= */}

          <div
            ref={logoRef}
            className="
              flex
              justify-center
              items-center

              pt-2
              pb-3

              px-2

              opacity-0
            "
          >
            <img
              src={SewacLogo}
              alt="SEWAC"
              draggable={false}
              className="
                w-[150px]

                md:w-[48px]
                lg:w-[150px]

                object-contain

                select-none

                drop-shadow-[0_8px_20px_rgba(255,255,255,0.15)]
              "
            />
          </div>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav
            ref={navRef}
            className="
              flex-1

              px-4
              md:px-2
              lg:px-4

              flex
              flex-col

              gap-2
            "
          >
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  title={item.label}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `
                      opacity-0

                      group

                      flex
                      items-center

                      justify-start

                      md:justify-center
                      lg:justify-start

                      gap-3

                      px-4
                      md:px-2
                      lg:px-4

                      py-3

                      rounded-2xl

                      transition-all
                      duration-300

                      ${
                        isActive
                          ? `
                            bg-gradient-to-r
                            from-fuchsia-500
                            via-purple-500
                            to-violet-600

                            text-white

                            shadow-xl
                            shadow-fuchsia-900/40

                            scale-[1.02]
                          `
                          : `
                            text-violet-100/85

                            hover:bg-white/10
                            hover:text-white

                            hover:translate-x-1

                            hover:shadow-lg
                          `
                      }
                    `
                  }
                >
                  {/* ICON */}

                  <Icon
                    size={19}
                    strokeWidth={2}
                    className="
                        shrink-0

                        transition-transform
                        duration-300

                        group-hover:scale-110
                      "
                  />

                  {/* LABEL */}

                  <span
                    className="
                        inline
                        md:hidden
                        lg:inline

                        text-[14px]

                        font-medium

                        tracking-wide

                        truncate

                        whitespace-nowrap
                      "
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* =================================================
              LOGOUT
          ================================================= */}

          <div
            ref={logoutRef}
            className="
              px-4
              md:px-2
              lg:px-4

              pb-6

              opacity-0
            "
          >
            <button
              type="button"
              onClick={handleLogout}
              title={t("sidebar.logout")}
              className="
                group

                w-full
                h-12

                rounded-2xl

                bg-white/10

                border
                border-white/10

                backdrop-blur-md

                flex
                items-center

                justify-start

                md:justify-center
                lg:justify-center

                gap-2

                px-4
                md:px-2
                lg:px-4

                text-violet-100

                font-medium

                transition-all
                duration-300

                hover:bg-white/20
                hover:text-white

                hover:scale-[1.02]

                hover:shadow-xl
                hover:shadow-fuchsia-900/20
              "
            >
              <LogOut
                size={18}
                className="
                  shrink-0

                  transition-transform
                  duration-300

                  group-hover:scale-110
                "
              />

              <span
                className="
                  inline
                  md:hidden
                  lg:inline

                  text-[14px]

                  whitespace-nowrap
                "
              >
                {t("sidebar.logout")}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
