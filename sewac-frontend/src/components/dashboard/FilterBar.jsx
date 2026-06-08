import {
  MapPinned,
  MapPin,
  Calendar,
  ChevronDown,
  Navigation,
} from "lucide-react";

export default function FilterBar() {
  return (
    <div className="flex items-center justify-between px-8 py-5">

      {/* Filters */}
      <div className="flex items-center gap-4">

        {/* City */}
        <button className="flex items-center gap-3 px-4 h-12 bg-white border border-gray-200 rounded-2xl min-w-[180px] hover:border-purple-300 transition">

          <MapPinned
            size={18}
            className="text-purple-500"
          />

          <span className="flex-1 text-sm text-gray-700 text-left">
            Bengaluru City
          </span>

          <ChevronDown
            size={16}
            className="text-gray-400"
          />
        </button>

        {/* Area */}
        <button className="flex items-center gap-3 px-4 h-12 bg-white border border-gray-200 rounded-2xl min-w-[180px] hover:border-purple-300 transition">

          <MapPin
            size={18}
            className="text-purple-500"
          />

          <span className="flex-1 text-sm text-gray-700 text-left">
            Jayanagar
          </span>

          <ChevronDown
            size={16}
            className="text-gray-400"
          />
        </button>

        {/* Date */}
        <button className="flex items-center gap-3 px-4 h-12 bg-white border border-gray-200 rounded-2xl min-w-[220px] hover:border-purple-300 transition">

          <Calendar
            size={18}
            className="text-purple-500"
          />

          <span className="flex-1 text-sm text-gray-700 text-left">
            Today, 20 May 2025
          </span>

          <ChevronDown
            size={16}
            className="text-gray-400"
          />
        </button>

      </div>

      {/* Live Tracking */}
      <button
        className="
        flex
        items-center
        gap-2
        px-6
        h-12
        rounded-2xl
        text-white
        font-medium
        shadow-md
        bg-gradient-to-r
        from-pink-500
        to-purple-500
        hover:scale-105
        transition cursor-pointer
      "
      >
        <Navigation size={16} />

        Live Tracking
      </button>

    </div>
  );
}