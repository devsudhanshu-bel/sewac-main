import {
  LayoutDashboard,
  Users,
  Truck,
  Factory,
  FileText,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

import SewacLogo from "../../assets/sewac_logo.svg";

const menuItems = [
  {
    name: "Overview",
    path: "/dashboard/admin/overview",
    icon: LayoutDashboard,
  },
  {
    name: "Waste Generators",
    path: "/dashboard/admin/waste-generators",
    icon: Users,
  },
  {
    name: "Vehicles",
    path: "/dashboard/admin/vehicles",
    icon: Truck,
  },
  {
    name: "Plant",
    path: "/dashboard/admin/plants",
    icon: Factory,
  },
  {
    name: "Logs",
    path: "/dashboard/admin/logs",
    icon: FileText,
  },
  {
    name: "AI Agent",
    path: "/dashboard/admin/ai",
    icon: Bot,
  },
  {
    name: "Users",
    path: "/dashboard/admin/users2",
    icon: Users,
  },
  {
    name: "Settings",
    path: "/dashboard/admin/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const sidebarRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const logoutRef = useRef(null);

  const handleLogout = () => {
    sessionStorage.clear();

    window.location.replace("http://localhost:5174");
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const navItems = Array.from(navRef.current.children);

      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      tl.fromTo(
        sidebarRef.current,
        {
          opacity: 0,
          x: -16,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.28,
        }
      )

        .fromTo(
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
          "-=0.12"
        )

        .fromTo(
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
          "-=0.18"
        )

        .fromTo(
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
          "-=0.18"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className="
        relative
        w-[240px]
        min-h-screen
        overflow-hidden
        border-r
        border-fuchsia-400/20
        bg-gradient-to-b
        from-[#4C1D95]
        via-[#6D28D9]
        to-[#DB2777]
        flex
        flex-col
        opacity-0
      "
    >
      {/* Decorative Background */}

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

      <div className="relative z-10 flex flex-col h-full">

        {/* Logo */}

        <div
          ref={logoRef}
          className="flex justify-center pt-2 pb-3 opacity-0"
        >
          <img
            src={SewacLogo}
            alt="SEWAC"
            draggable={false}
            className="
              w-[150px]
              object-contain
              select-none
              drop-shadow-[0_8px_20px_rgba(255,255,255,0.15)]
            "
          />
        </div>

        {/* Navigation */}

        <nav
          ref={navRef}
          className="flex-1 px-4 flex flex-col gap-2"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            const handleLogout = () => {
              sessionStorage.clear();

              window.location.replace("http://localhost:5174");
            };

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `
                  opacity-0
                  group
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  transition-all
                  duration-300

                  ${isActive
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
                <Icon
                  size={18}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:scale-110"
                />

                <span className="text-[14px] font-medium tracking-wide">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}

        <div
          ref={logoutRef}
          className="px-4 pb-6 opacity-0"
        >
          <button
            onClick={handleLogout}
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
    justify-center
    gap-2
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
              size={17}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Logout
          </button>
        </div>

      </div>

    </aside>
  );
}