import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Wet Waste",
    value: 45,
    color: "#ff4f93",
  },
  {
    name: "Dry Waste",
    value: 30,
    color: "#8b5cf6",
  },
  {
    name: "Plastic",
    value: 15,
    color: "#f59e0b",
  },
  {
    name: "Others",
    value: 10,
    color: "#60a5fa",
  },
];

export default function WasteContribution() {
  return (
    <div
      className="
        bg-white
        rounded-[28px]
        border
        border-gray-100
        shadow-sm
        h-[340px]
        p-5
      "
    >
      {/* Header */}

      <div className="flex justify-between items-center mb-4">

        <h3 className="font-semibold text-gray-900">
          Waste Contribution
        </h3>

        <button className="text-xs text-gray-400">
          This Month
        </button>

      </div>

      {/* Donut */}

      <div className="h-[180px] relative">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={50}
              outerRadius={75}
              stroke="none"
            >
              {data.map((item, index) => (
                <Cell
                  key={index}
                  fill={item.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center */}

        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            pointer-events-none
          "
        >
          <h2 className="text-2xl font-bold">
            12.4
          </h2>

          <p className="text-xs text-gray-400">
            Ton
          </p>
        </div>

      </div>

      {/* Legend */}

      <div className="space-y-3 mt-2">

        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">

              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span className="text-sm text-gray-600">
                {item.name}
              </span>

            </div>

            <span className="text-sm font-semibold">
              {item.value}%
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}