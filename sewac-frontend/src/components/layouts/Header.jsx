import {
  Menu,
  Search,
  Bell,
  Globe,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  return (
    <header className="h-[80px] bg-white border-b border-gray-100 px-8 flex items-center justify-between">

      {/* Left Side */}
      <div className="flex items-center gap-6">

        {/* Menu Button */}
        <button className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 hover:bg-purple-100 transition">
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search for vehicles, workers, locations..."
            className="
              w-[380px]
              h-12
              pl-12
              pr-16
              rounded-2xl
              border
              border-gray-200
              outline-none
              focus:border-purple-400
              text-sm
            "
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-500">
              ⌘ K
            </span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-8">

        {/* Notifications */}
        <div className="relative cursor-pointer">

          <Bell
            size={22}
            className="text-gray-600"
          />

          <div className="
            absolute
            -top-2
            -right-2
            w-5
            h-5
            bg-red-500
            rounded-full
            flex
            items-center
            justify-center
            text-white
            text-[10px]
          ">
            12
          </div>

        </div>

        {/* Language */}
        <button className="flex items-center gap-2 text-gray-600">
          <Globe size={18} />
          <span>EN</span>
          <ChevronDown size={16} />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 cursor-pointer">

          <div className="
            w-11
            h-11
            rounded-full
            bg-gray-800
            text-white
            flex
            items-center
            justify-center
            font-semibold
          ">
            A
          </div>

          <div>
            <h4 className="font-semibold text-sm">
              Admin
            </h4>

            <p className="text-xs text-gray-500">
              Super Admin
            </p>
          </div>

          <ChevronDown
            size={16}
            className="text-gray-500"
          />
        </div>

      </div>
    </header>
  );
}