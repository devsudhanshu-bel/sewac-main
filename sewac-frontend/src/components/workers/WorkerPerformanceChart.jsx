import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { performanceData } from "./workersData";

export default function WorkerPerformanceChart() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 h-[420px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Worker Performance Overview
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Collection points and waste collected
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2">

          <button className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-medium">
            Week
          </button>

          <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm">
            Month
          </button>

          <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm">
            Year
          </button>

        </div>

      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4">

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-600"></div>
          <span className="text-sm text-gray-600">
            Collection Points
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          <span className="text-sm text-gray-600">
            Waste Collected
          </span>
        </div>

      </div>

      {/* Chart */}
      <div className="h-[290px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={performanceData}>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="collectionPoints"
              stroke="#7C3AED"
              strokeWidth={4}
              dot={{
                r: 5,
              }}
            />

            <Line
              type="monotone"
              dataKey="wasteCollected"
              stroke="#EC4899"
              strokeWidth={4}
              dot={{
                r: 5,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}