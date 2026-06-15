import {
  LayoutDashboard,
  Users,
  UserCog,
  ClipboardCheck,
  Settings,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useLocation,
} from "react-router-dom";

import SewacLogo from "../../assets/sewac_logo.svg";

import CardImage from "../../assets/card_main.png";
import CitizensCard from "../../assets/citizens_card.png";
import WorkersCard from "../../assets/worker_card.png";
import SettingsCard from "../../assets/settings_card.jpeg";

const menuItems = [
  {
    name: "Overview",
    path: "/admin-overview",
    icon: LayoutDashboard,
  },
  {
    name: "Citizens",
    path: "/admin-citizens",
    icon: Users,
  },
  {
    name: "Workers",
    path: "/admin-workers",
    icon: UserCog,
  },
  {
    name: "Helper App Review",
    path: "/admin-helper-review",
    icon: ClipboardCheck,
  },
  {
    name: "Settings",
    path: "/admin-settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const location = useLocation();

  const sidebarImage =
    location.pathname === "/admin-citizens"
      ? CitizensCard
      : location.pathname === "/admin-workers"
      ? WorkersCard
      : location.pathname === "/admin-settings"
      ? SettingsCard
      : CardImage;

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
      {/* TOP */}
      <div>
        <div className="flex justify-center -mt-2 -mb-2">
          <img
            src={SewacLogo}
            alt="SEWAC"
            className="w-40 object-contain"
          />
        </div>

        <hr className="border-white/10 mx-4 mb-4" />

        <div className="px-4 flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-3xl transition ${
                    isActive
                      ? "bg-pink-500 text-white"
                      : "text-white/70 hover:bg-white/10"
                  }`
                }
              >
                <Icon size={18} />

                <span className="text-sm">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* BOTTOM CARD */}
      <div className="p-3">
        <div className="bg-white rounded-xl overflow-hidden shadow">
          <img
            src={sidebarImage}
            alt="Sidebar Card"
            className="
              w-full
              h-[220px]
              object-cover
            "
          />

          <div className="p-4 text-sm">
            <p className="font-semibold">
              Today's Goal
            </p>

            <p>78%</p>
          </div>
        </div>

        <button
          className="
            mt-4
            w-full
            flex
            items-center
            gap-2
            px-4
            py-3
            bg-white/10
            text-white
            rounded-xl
            hover:bg-white/15
            transition
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}