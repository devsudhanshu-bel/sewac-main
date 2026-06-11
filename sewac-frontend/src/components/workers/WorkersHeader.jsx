import {
  ChevronDown,
  Download,
  Filter,
} from "lucide-react";

export default function WorkersHeader() {
  return (
    <div className="space-y-6">

      {/* Page Title */}
      <div>
        <h1 className="text-[30px] font-bold text-gray-900">
          Workers Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Monitor workforce performance and collection activities
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-4">

        <div className="flex items-center gap-4 flex-wrap">

          {/* Area */}
          <div className="bg-white border border-gray-200 rounded-2xl px-4 h-14 flex items-center justify-between min-w-[180px] shadow-sm">
            <div>
              <p className="text-[11px] text-gray-400">Area</p>
              <p className="text-sm font-medium">All Areas</p>
            </div>
            <ChevronDown size={18} />
          </div>

          {/* Worker */}
          <div className="bg-white border border-gray-200 rounded-2xl px-4 h-14 flex items-center justify-between min-w-[180px] shadow-sm">
            <div>
              <p className="text-[11px] text-gray-400">Worker</p>
              <p className="text-sm font-medium">All Workers</p>
            </div>
            <ChevronDown size={18} />
          </div>

          {/* Vehicle */}
          <div className="bg-white border border-gray-200 rounded-2xl px-4 h-14 flex items-center justify-between min-w-[180px] shadow-sm">
            <div>
              <p className="text-[11px] text-gray-400">Vehicle</p>
              <p className="text-sm font-medium">All Vehicles</p>
            </div>
            <ChevronDown size={18} />
          </div>

          {/* Date */}
          <div className="bg-white border border-gray-200 rounded-2xl px-4 h-14 flex items-center justify-between min-w-[180px] shadow-sm">
            <div>
              <p className="text-[11px] text-gray-400">Date Range</p>
              <p className="text-sm font-medium">This Week</p>
            </div>
            <ChevronDown size={18} />
          </div>

          {/* More Filters */}
          <button className="h-14 px-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition">
            <Filter size={16} />
            More Filters
          </button>

        </div>

        {/* Export */}
        <button className="h-14 px-6 rounded-2xl border border-pink-500 text-pink-500 flex items-center gap-2 hover:bg-pink-50 transition">
          <Download size={18} />
          Export Report
        </button>

      </div>

    </div>
  );
}