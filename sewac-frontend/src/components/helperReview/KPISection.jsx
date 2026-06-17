import {
  UserRound,
  Users,
  ClipboardList,
  AlertTriangle,
  Activity,
} from "lucide-react";

const stats = [
  {
    title: "Registered Workers",
    value: "1,259",
    change: "+12.4%",
    icon: Users,
    bg: "bg-pink-50/70 group-hover:bg-pink-100",
    color: "text-pink-500",
    delay: "delay-0",
    shadowHover: "hover:shadow-[0_22px_45px_rgba(236,72,153,0.15)]",
    gradient: "group-hover:from-pink-50/30",
  },
  {
    title: "Active Workers Today",
    value: "842",
    change: "+8.7%",
    icon: UserRound,
    bg: "bg-purple-50/70 group-hover:bg-purple-100",
    color: "text-purple-500",
    delay: "delay-75",
    shadowHover: "hover:shadow-[0_22px_45px_rgba(168,85,247,0.15)]",
    gradient: "group-hover:from-purple-50/30",
  },
  {
    title: "Collections Logged",
    value: "2,451",
    change: "+15.2%",
    icon: ClipboardList,
    bg: "bg-pink-50/70 group-hover:bg-pink-100",
    color: "text-pink-500",
    delay: "delay-100",
    shadowHover: "hover:shadow-[0_22px_45px_rgba(236,72,153,0.15)]",
    gradient: "group-hover:from-pink-50/30",
  },
  {
    title: "Issues Reported",
    value: "128",
    change: "+4.1%",
    icon: AlertTriangle,
    bg: "bg-orange-50/70 group-hover:bg-orange-100",
    color: "text-orange-500",
    delay: "delay-150",
    shadowHover: "hover:shadow-[0_22px_45px_rgba(249,115,22,0.15)]",
    gradient: "group-hover:from-orange-50/30",
  },
  {
    title: "Average Worker Activity",
    value: "12.6",
    change: "+6.3%",
    icon: Activity,
    bg: "bg-purple-50/70 group-hover:bg-purple-100",
    color: "text-purple-500",
    delay: "delay-200",
    shadowHover: "hover:shadow-[0_22px_45px_rgba(168,85,247,0.15)]",
    gradient: "group-hover:from-purple-50/30",
  },
];

export default function KPISection() {
  return (
    <div className="mt-6 select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
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

                /* Entrance Stagger Animations */
                animate-in
                fade-in-0
                slide-in-from-bottom-4
                duration-700
                fill-mode-both
                ${item.delay}

                /* Premium Hover Transitions */
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
              {/* Decorative Subtle Background Glow Dot */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-tr from-transparent to-gray-50/10 rounded-full blur-xl pointer-events-none transition-all duration-500 group-hover:scale-150" />

              {/* Title Row */}
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

              {/* Middle Row */}
              <div className="h-[76px] flex items-center gap-3 z-10">
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
                    ${item.bg}
                  `}
                >
                  <Icon
                    size={16}
                    className={`
                      ${item.color} 
                      transition-transform 
                      duration-300
                    `}
                  />
                </div>

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

              {/* Trend Row */}
              <div className="h-[32px] flex items-start text-[11px] z-10">
                <span 
                  className="
                    font-medium 
                    text-green-500 
                    flex 
                    items-center 
                    gap-0.5
                    transition-all 
                    duration-300 
                    ease-out
                    group-hover:translate-y-[-2px]
                    group-hover:text-green-600
                    group-hover:font-semibold
                  "
                >
                  <span className="transition-transform duration-300 inline-block group-hover:translate-y-[-1px] group-hover:scale-110">↑</span> 
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
    </div>
  );
}