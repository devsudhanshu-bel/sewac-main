import {
  Trash2,
  Truck,
  MapPin,
  UserRound,
  Users,
  Target,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const chartData = [
  { value: 10 },
  { value: 12 },
  { value: 11 },
  { value: 15 },
  { value: 13 },
  { value: 18 },
  { value: 16 },
  { value: 19 },
  { value: 24 },
  { value: 21 },
];

const stats = [
  {
    title: "Total Waste Collected",
    value: "12.4",
    suffix: "Ton",
    change: "+18.6%",
    subtitle: "from yesterday",
    icon: Trash2,
    color: "#ff4f93",
    bg: "#fff1f6",
  },
  {
    title: "Active Vehicles",
    value: "18",
    suffix: "/ 24",
    change: "+75%",
    subtitle: "on the move",
    icon: Truck,
    color: "#8b5cf6",
    bg: "#f3e8ff",
  },
  {
    title: "Collection Points",
    value: "842",
    suffix: "",
    change: "+12.5%",
    subtitle: "from yesterday",
    icon: MapPin,
    color: "#ff4f93",
    bg: "#fff1f6",
  },
  {
    title: "Active Workers",
    value: "64",
    suffix: "",
    change: "+8.3%",
    subtitle: "from yesterday",
    icon: UserRound,
    color: "#8b5cf6",
    bg: "#f3e8ff",
  },
  {
    title: "Citizen Participation",
    value: "71.2%",
    suffix: "",
    change: "+9.1%",
    subtitle: "from yesterday",
    icon: Users,
    color: "#ff4f93",
    bg: "#fff1f6",
  },
  {
    title: "Efficiency Score",
    value: "89.4%",
    suffix: "",
    change: "+7.6%",
    subtitle: "from yesterday",
    icon: Target,
    color: "#8b5cf6",
    bg: "#f3e8ff",
  },
];

export default function StatsCards() {
  return (
    <div className="px-8 mt-1">
      <div className="grid grid-cols-6 gap-4">
        {stats.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="
              bg-white
              border
              border-gray-100
              rounded-[24px]
              p-4
              h-[165px]
              relative
              overflow-hidden
              shadow-[0_2px_10px_rgba(0,0,0,0.03)]
            "
            >
              {/* decorative curve */}
              <div
                className="
                absolute
                top-0
                right-0
                w-20
                h-20
                border-t
                border-r
                border-gray-100
                rounded-bl-[80px]
              "
              />

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[13px] text-gray-500 mb-2">
                    {card.title}
                  </p>

                  <div className="flex items-end gap-1">
                    <h2 className="text-[18px] font-bold text-gray-900">
                      {card.value}
                    </h2>

                    <span className="text-xs text-gray-400 mb-1">
                      {card.suffix}
                    </span>
                  </div>
                </div>

                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: card.bg,
                  }}
                >
                  <Icon
                    size={18}
                    color={card.color}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 mt-2">
                <span className="text-[11px] text-green-500 font-medium">
                  ↑ {card.change}
                </span>

                <span className="text-[11px] text-gray-400">
                  {card.subtitle}
                </span>
              </div>

              <div className="h-[45px] mt-3">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart data={chartData}>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={card.color}
                      fillOpacity={0}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}