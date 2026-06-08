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
  { time: "12 AM", value: 0.15 },
  { time: "02 AM", value: 0.30 },
  { time: "04 AM", value: 0.20 },
  { time: "06 AM", value: 0.55 },
  { time: "08 AM", value: 0.40 },
  { time: "10 AM", value: 0.55 },
  { time: "12 PM", value: 1.50 },
  { time: "02 PM", value: 1.00 },
  { time: "04 PM", value: 0.25 },
  { time: "06 PM", value: 0.75 },
  { time: "08 PM", value: 0.35 },
  { time: "12 AM", value: 0.50 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-xl shadow-lg">
      <p className="text-xs font-medium">
        {payload[0].value} Ton
      </p>

      <p className="text-[10px] text-slate-300">
        {label}
      </p>
    </div>
  );
};

export default function CollectionTrend() {
  return (
    <div
      className="
        bg-white
        rounded-[28px]
        border
        border-gray-100
        shadow-sm
        h-[340px]
        w-full
        p-5
        flex
        flex-col
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900">
            Collection Trend
          </h3>

          <p className="text-[12px] text-gray-400 mt-0.5">
            (Ton)
          </p>
        </div>

        <button className="text-[12px] text-gray-500 font-medium">
          Today ▼
        </button>
      </div>

      {/* Chart */}

      <div className="flex-1 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 5,
              left: -25,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor="#8B5CF6"
                />

                <stop
                  offset="100%"
                  stopColor="#FF4FA3"
                />
              </linearGradient>

              <linearGradient
                id="areaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#D946EF"
                  stopOpacity={0.12}
                />

                <stop
                  offset="100%"
                  stopColor="#FFFFFF"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#F3F4F6"
              strokeDasharray="0"
            />

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              interval={1}
              tick={{
                fill: "#9CA3AF",
                fontSize: 10,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              domain={[0, 2]}
              tick={{
                fill: "#9CA3AF",
                fontSize: 10,
              }}
            />

            <ReferenceLine
              x="12 PM"
              stroke="#D1D5DB"
              strokeDasharray="4 4"
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="url(#lineGradient)"
              strokeWidth={2.5}
              fill="url(#areaGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#D946EF",
                stroke: "#FFF",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}