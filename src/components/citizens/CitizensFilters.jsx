import {
  Search,
  MapPinned,
  MapPin,
  Calendar,
  ChevronDown,
  Plus,
  Filter,
} from "lucide-react";

export default function CitizensFilters() {
  return (
    <div className="space-y-4">

      {/* Top Row */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-[34px] font-bold text-gray-900">
            Citizens
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Dashboard &gt; Citizens
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* City */}
          <button className="flex items-center gap-3 px-4 h-12 bg-white border border-gray-200 rounded-2xl min-w-[190px] hover:border-purple-300 transition">

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

          {/* Ward */}
          <button className="flex items-center gap-3 px-4 h-12 bg-white border border-gray-200 rounded-2xl min-w-[190px] hover:border-purple-300 transition">

            <MapPin
              size={18}
              className="text-pink-500"
            />

            <span className="flex-1 text-sm text-gray-700 text-left">
              Jayanagar Ward
            </span>

            <ChevronDown
              size={16}
              className="text-gray-400"
            />
          </button>

          {/* Date */}
          <button className="flex items-center gap-3 px-4 h-12 bg-white border border-gray-200 rounded-2xl min-w-[240px] hover:border-purple-300 transition">

            <Calendar
              size={18}
              className="text-pink-500"
            />

            <span className="flex-1 text-sm text-gray-700 text-left">
              20 May 2025 - 20 May 2025
            </span>

            <ChevronDown
              size={16}
              className="text-gray-400"
            />
          </button>

        </div>
      </div>

      {/* Bottom Filters */}
      <div
        className="
          bg-white
          border
          border-gray-100
          rounded-[26px]
          p-4
          shadow-sm
        "
      >
        <div className="grid grid-cols-12 gap-4">

          {/* Search */}
          <div className="col-span-3">
            <label className="text-xs text-gray-400 mb-2 block">
              Search Citizen
            </label>

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
                type="text"
                placeholder="Name, Phone, Code..."
                className="
                  w-full
                  h-11
                  rounded-xl
                  border
                  border-gray-200
                  pl-10
                  pr-4
                  outline-none
                  focus:border-pink-400
                "
              />
            </div>
          </div>

          {/* Main Road */}
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-2 block">
              Main Road
            </label>

            <select className="w-full h-11 border border-gray-200 rounded-xl px-3">
              <option>All</option>
            </select>
          </div>

          {/* Cross Road */}
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-2 block">
              Cross Road
            </label>

            <select className="w-full h-11 border border-gray-200 rounded-xl px-3">
              <option>All</option>
            </select>
          </div>

          {/* Street */}
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-2 block">
              Street
            </label>

            <select className="w-full h-11 border border-gray-200 rounded-xl px-3">
              <option>All</option>
            </select>
          </div>

          {/* Participation */}
          <div className="col-span-1">
            <label className="text-xs text-gray-400 mb-2 block">
              Participation
            </label>

            <select className="w-full h-11 border border-gray-200 rounded-xl px-3">
              <option>All</option>
            </select>
          </div>

          {/* Waste Category */}
          <div className="col-span-2">
            <label className="text-xs text-gray-400 mb-2 block">
              Waste Category
            </label>

            <select className="w-full h-11 border border-gray-200 rounded-xl px-3">
              <option>All</option>
            </select>
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-4">

          <button
            className="
              flex
              items-center
              gap-2
              px-4
              h-11
              border
              border-pink-200
              rounded-xl
              text-pink-500
              hover:bg-pink-50
            "
          >
            <Filter size={16} />
            More Filters
          </button>

          <button
            className="
              flex
              items-center
              gap-2
              px-5
              h-11
              rounded-xl
              text-white
              bg-gradient-to-r
              from-pink-500
              to-purple-500
              hover:scale-105
              transition
            "
          >
            <Plus size={16} />
            Add New Citizen
          </button>

        </div>
      </div>
    </div>
  );
}