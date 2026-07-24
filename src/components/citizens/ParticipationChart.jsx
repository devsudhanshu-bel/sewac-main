import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const data = [
  { time: "12 AM", value: 12 },
  { time: "02 AM", value: 28 },
  { time: "04 AM", value: 42 },
  { time: "06 AM", value: 38 },
  { time: "08 AM", value: 55 },
  { time: "10 AM", value: 60 },
  { time: "12 PM", value: 82 },
  { time: "02 PM", value: 45 },
  { time: "04 PM", value: 40 },
  { time: "06 PM", value: 66 },
  { time: "08 PM", value: 74 },
  { time: "12 AM", value: 62 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2">
      <p className="text-xs font-semibold text-gray-900">
        {label}
      </p>

      <p className="text-xs text-pink-500 mt-1">
        Participation {payload[0].value}%
      </p>
    </div>
  );
};

export default function ParticipationChart() {
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
          Participation Overview
        </h3>

        <div className="flex gap-4 text-xs">

          <button className="text-pink-500 font-semibold">
            Day
          </button>

          <button className="text-gray-400">
            Week
          </button>

          <button className="text-gray-400">
            Month
          </button>

          <button className="text-gray-400">
            Year
          </button>

        </div>

      </div>

      <div className="h-[260px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>

              <linearGradient
                id="pinkArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#ff4f93"
                  stopOpacity={0.20}
                />

                <stop
                  offset="100%"
                  stopColor="#ffffff"
                  stopOpacity={0}
                />
              </linearGradient>

            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fill: "#94a3b8",
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fill: "#94a3b8",
              }}
              domain={[0, 100]}
            />

            <ReferenceLine
              x="12 PM"
              stroke="#d1d5db"
              strokeDasharray="4 4"
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#ff4f93"
              strokeWidth={3}
              fill="url(#pinkArea)"
              dot={{
                r: 4,
                fill: "#ff4f93",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}