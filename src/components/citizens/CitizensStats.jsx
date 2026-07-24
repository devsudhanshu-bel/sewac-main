import {
  Users,
  UserCheck,
  UserX,
  BarChart3,
  Trash2,
  Award,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const chartData = [
  { value: 10 },
  { value: 14 },
  { value: 12 },
  { value: 18 },
  { value: 15 },
  { value: 22 },
  { value: 19 },
  { value: 25 },
  { value: 21 },
  { value: 28 },
];

const stats = [
  {
    title: "Total Citizens",
    value: "12,845",
    change: "+5.6%",
    subtitle: "from last month",
    icon: Users,
    color: "#ff4f93",
    bg: "#fff1f6",
  },
  {
    title: "Active Citizens",
    value: "9,842",
    change: "+6.3%",
    subtitle: "from last month",
    icon: UserCheck,
    color: "#ff4f93",
    bg: "#fff1f6",
  },
  {
    title: "Inactive Citizens",
    value: "3,003",
    change: "+3.2%",
    subtitle: "from last month",
    icon: UserX,
    color: "#8b5cf6",
    bg: "#f3e8ff",
  },
  {
    title: "Participation Today",
    value: "71.2%",
    change: "+8.7%",
    subtitle: "from yesterday",
    icon: BarChart3,
    color: "#8b5cf6",
    bg: "#f3e8ff",
  },
  {
    title: "Total Waste (Today)",
    value: "12.4 Ton",
    change: "+18.6%",
    subtitle: "from yesterday",
    icon: Trash2,
    color: "#ff4f93",
    bg: "#fff1f6",
  },
  {
    title: "Reward Eligible",
    value: "156",
    change: "This Week",
    subtitle: "",
    icon: Award,
    color: "#f59e0b",
    bg: "#fff7e6",
  },
];

export default function CitizensStats() {
  return (
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
              shadow-sm
            "
          >
            {/* Decorative Corner */}
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

                <h2 className="text-[22px] font-bold text-gray-900">
                  {card.value}
                </h2>

              </div>

              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                "
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

            <div className="mt-2 flex items-center gap-1">

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
  );
}