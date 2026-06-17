import {
  Users,
  UserCheck,
  MapPin,
  Trash2,
  Activity,
  Route,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const stats = [
  {
    title: "Total Workers",
    value: "1,248",
    change: "+12%",
    positive: true,
    icon: Users,
    delay: "delay-0",
    iconColor: "text-pink-500",
    staticBg: "bg-pink-50/70",
    hoverBg: "group-hover:bg-pink-100",
    shadowHover: "hover:shadow-[0_22px_45px_rgba(236,72,153,0.14)]",
    gradient: "group-hover:from-pink-50/30",
  },
  {
    title: "Active Workers Today",
    value: "1,187",
    change: "+4%",
    positive: true,
    icon: UserCheck,
    delay: "delay-75",
    iconColor: "text-purple-500",
    staticBg: "bg-purple-50/70",
    hoverBg: "group-hover:bg-purple-100",
    shadowHover: "hover:shadow-[0_22px_45px_rgba(168,85,247,0.14)]",
    gradient: "group-hover:from-purple-50/30",
  },
  {
    title: "Collection Points",
    value: "8,942",
    change: "+8%",
    positive: true,
    icon: MapPin,
    delay: "delay-100",
    iconColor: "text-amber-500",
    staticBg: "bg-amber-50/70",
    hoverBg: "group-hover:bg-amber-100",
    shadowHover: "hover:shadow-[0_22px_45px_rgba(245,158,11,0.14)]",
    gradient: "group-hover:from-purple-50/30",
  },
  {
    title: "Waste Collected (in kg)",
    value: "12.4",
    change: "+6%",
    positive: true,
    icon: Trash2,
    delay: "delay-150",
    iconColor: "text-blue-500",
    staticBg: "bg-blue-50/70",
    hoverBg: "group-hover:bg-blue-100",
    shadowHover: "hover:shadow-[0_22px_45px_rgba(59,130,246,0.14)]",
    gradient: "group-hover:from-purple-50/30",
  },
  {
    title: "Avg Efficiency",
    value: "92%",
    change: "+2%",
    positive: true,
    icon: Activity,
    delay: "delay-200",
    iconColor: "text-emerald-500",
    staticBg: "bg-emerald-50/70",
    hoverBg: "group-hover:bg-emerald-100",
    shadowHover: "hover:shadow-[0_22px_45px_rgba(16,185,129,0.14)]",
    gradient: "group-hover:from-purple-50/30",
  },
  {
    title: "Avg Distance",
    value: "14.2 km",
    change: "-1%",
    positive: false,
    icon: Route,
    delay: "delay-300",
    iconColor: "text-rose-500",
    staticBg: "bg-rose-50/70",
    hoverBg: "group-hover:bg-rose-100",
    shadowHover: "hover:shadow-[0_22px_45px_rgba(244,63,94,0.14)]",
    gradient: "group-hover:from-purple-50/30",
  },
];

export default function WorkerStatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 select-none">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={`
              bg-white
              bg-gradient-to-br
              from-transparent
              to-transparent
              border
              border-gray-100
              rounded-[24px]
              h-[145px]
              p-6
              flex
              flex-col
              cursor-pointer
              group
              relative
              overflow-hidden

              /* Soft Ambient Shadow Base */
              shadow-[0_8px_30px_rgba(0,0,0,0.015)]

              /* Page Entrance Stagger Cascade */
              animate-in
              fade-in-0
              slide-in-from-bottom-4
              duration-700
              fill-mode-both
              ${item.delay}

              /* Premium Interactivity Transitions */
              transition-all
              duration-500
              ease-[cubic-bezier(0.34,1.56,0.64,1)]
              hover:-translate-y-2
              hover:border-gray-200/50
              ${item.shadowHover}
              ${item.gradient}
              
              /* Click Down compression bounce */
              active:scale-[0.96]
              active:duration-75
            `}
          >
            {/* Dynamic Color-matched Ambient Background Glow Dot */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-tr from-transparent to-gray-50/10 rounded-full blur-xl pointer-events-none transition-all duration-500 group-hover:scale-150" />

            {/* Title Row - Font Matched to KPI Code */}
            <div className="h-[24px] flex items-center z-10">
              <p
                className="
                  text-[12px]
                  font-medium
                  text-gray-400
                  whitespace-nowrap
                  flex
                  items-center
                  transition-all
                  duration-300
                  group-hover:text-gray-600
                  group-hover:translate-x-0.5
                "
              >
                {item.title}
              </p>
            </div>

            {/* Middle Row - Font Matched to KPI Code */}
            <div className="h-[76px] flex items-center gap-3 z-10">
              {/* Dynamic Icon Container Badge with 360-degree elastic spin */}
              <div
                className={`
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shrink-0
                  transition-all
                  duration-500
                  ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  group-hover:scale-115
                  group-hover:rotate-[360deg]
                  ${item.staticBg}
                  ${item.hoverBg}
                `}
              >
                <Icon
                  size={16}
                  className={`${item.iconColor} transition-transform duration-300`}
                />
              </div>

              {/* Primary Metric Number Display */}
              <h2
                className="
                  text-[22px]
                  font-bold
                  text-gray-900
                  leading-none
                  tracking-tight
                  transition-all
                  duration-300
                  ease-out
                  group-hover:scale-[1.03]
                  group-hover:text-black
                "
              >
                {item.value}
              </h2>
            </div>

            {/* Trend Row - Font Matched to KPI Code */}
            <div className="h-[32px] flex items-start text-[11px] z-10">
              <span
                className={`
                  font-medium 
                  flex 
                  items-center 
                  gap-0.5
                  transition-all 
                  duration-300 
                  ease-out
                  group-hover:translate-y-[-2px]
                  group-hover:font-semibold
                  ${item.positive 
                    ? "text-green-500 group-hover:text-green-600" 
                    : "text-red-500 group-hover:text-red-600"
                  }
                `}
              >
                {item.positive ? (
                  <span className="transition-transform duration-300 inline-block group-hover:translate-y-[-1px] group-hover:scale-110">↑</span>
                ) : (
                  <span className="transition-transform duration-300 inline-block group-hover:translate-y-[1px] group-hover:scale-110">↓</span>
                )}
                {item.change}
              </span>

              <span className="text-gray-400 ml-1 transition-colors duration-300 group-hover:text-gray-500">
                vs previous period
              </span>
            </div>

          </div>
        );
      })}
    </div>
  );
}