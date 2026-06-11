import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import { wasteTypeData } from "./workersData";

const COLORS = [
  "#7C3AED",
  "#EC4899",
  "#10B981",
  "#F59E0B",
];

export default function WasteCollectedByType() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 h-[420px]">

      {/* Header */}
      <div className="mb-6">

        <h3 className="text-lg font-semibold text-gray-900">
          Waste Collected by Type
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Distribution of collected waste
        </p>

      </div>

      {/* Donut */}
      <div className="h-[220px]">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={wasteTypeData}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
            >
              {wasteTypeData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* Legend */}
      <div className="space-y-3 mt-2">

        {wasteTypeData.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">

              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    COLORS[index % COLORS.length],
                }}
              />

              <span className="text-sm text-gray-600">
                {item.name}
              </span>

            </div>

            <span className="font-semibold text-gray-900">
              {item.value}%
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}