import {
  LayoutDashboard,
  Users,
  UserCog,
  ClipboardCheck,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import SewacLogo from "../../assets/sewac_logo.svg";
import CardImage from "../../assets/card_main.png";

const menuItems = [
  {
    name: "Overview",
    path: "/",
    icon: LayoutDashboard,
  },

  {
    name: "Citizens",
    path: "/citizens",
    icon: Users,
  },

  {
    name: "Workers",
    path: "/workers",
    icon: UserCog,
  },

  {
    name: "Helper App Review",
    path: "/helper-review",
    icon: ClipboardCheck,
  },

  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside
      className="
        w-[250px]
        min-h-screen
        flex
        flex-col
        justify-between

        bg-gradient-to-b
        from-[#7b1fa2]
        via-[#5e35b1]
        to-[#311b92]

        shadow-2xl
      "
    >
      {/* TOP SECTION */}

      <div>
        {/* LOGO */}

        <div className="flex justify-center -mt-2 -mb-2">
          <img
            src={SewacLogo}
            alt="SEWAC"
            className="
              w-40
              h-auto
              object-contain
              block
            "
          />
        </div>

        {/* SEPARATOR */}

        <hr className="border-white/10 mx-4 mb-4" />

        {/* NAVIGATION */}

        <div className="px-4 flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `
                  group
                  relative

                  flex
                  items-center
                  gap-3

                  px-4
                  py-3

                  rounded-3xl

                  overflow-hidden

                  transition-all
                  duration-300

                  ${
                    isActive
                      ? `
                        bg-gradient-to-r
                        from-pink-500
                        to-fuchsia-500

                        text-white

                        shadow-[0_12px_35px_rgba(255,79,163,0.35)]
                      `
                      : `
                        text-white/75
                        hover:text-white
                        hover:bg-white/10
                      `
                  }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {!isActive && (
                      <div
                        className="
                          absolute
                          inset-0

                          opacity-0
                          group-hover:opacity-100

                          bg-white/5

                          transition-all
                          duration-300
                        "
                      />
                    )}

                    <div className="relative z-10">
                      <Icon
                        size={18}
                        strokeWidth={2}
                      />
                    </div>

                    <span
                      className="
                        relative
                        z-10

                        text-[13px]
                        font-medium
                      "
                    >
                      {item.name}
                    </span>

                    {isActive && (
                      <div
                        className="
                          absolute
                          right-4

                          w-2
                          h-2

                          rounded-full

                          bg-white

                          shadow-[0_0_12px_rgba(255,255,255,0.9)]
                        "
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* BOTTOM SECTION */}

      <div className="p-3">
        {/* TEMPLATE CARD */}

        <div
          className="
            overflow-hidden

            rounded-[28px]

            bg-[#F7F2FC]

            border
            border-[#EEE6FA]

            shadow-lg
          "
        >
          {/* IMAGE */}

          <img
            src={CardImage}
            alt="Clean City"
            className="
              w-full
              block
              object-cover
            "
          />

          {/* CONTENT */}

          <div className="px-4 pb-4">
            <div className="border-t border-[#ECE6F5] pt-4">
              {/* GOAL */}

              <div className="flex justify-between items-center">
                <span className="text-[14px] font-medium text-gray-800">
                  Today's Goal
                </span>

                <span className="text-[14px] font-semibold text-gray-800">
                  78%
                </span>
              </div>

              {/* PROGRESS */}

              <div className="mt-3 h-[5px] rounded-full bg-[#EAE3F5]">
                <div
                  className="
                    h-full
                    rounded-full

                    bg-gradient-to-r
                    from-pink-500
                    to-pink-400
                  "
                  style={{
                    width: "78%",
                  }}
                />
              </div>

              {/* WASTE */}

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-400">
                    Waste Collected
                  </span>

                  <span className="text-gray-400 text-xs">
                    ▼
                  </span>
                </div>

                <h3 className="mt-2 text-[18px] font-bold text-gray-900">
                  12.4

                  <span className="font-medium text-gray-500">
                    {" "}
                    / 16 Ton
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* LOGOUT */}

        <button
          className="
            mt-4
            w-full

            flex
            items-center
            gap-3

            px-4
            py-3

            rounded-2xl

            border
            border-white/20

            bg-white/10

            text-white

            hover:bg-white/15

            transition-all
            duration-300
          "
        >
          <LogOut size={18} />

          <span className="text-[13px] font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}