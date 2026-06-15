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
    bg: "bg-pink-50",
    color: "text-pink-500",
  },
  {
    title: "Active Workers Today",
    value: "842",
    change: "+8.7%",
    icon: UserRound,
    bg: "bg-purple-50",
    color: "text-purple-500",
  },
  {
    title: "Collections Logged",
    value: "2,451",
    change: "+15.2%",
    icon: ClipboardList,
    bg: "bg-pink-50",
    color: "text-pink-500",
  },
  {
    title: "Issues Reported",
    value: "128",
    change: "+4.1%",
    icon: AlertTriangle,
    bg: "bg-orange-50",
    color: "text-orange-500",
  },
  {
    title: "Average Worker Activity",
    value: "12.6",
    change: "+6.3%",
    icon: Activity,
    bg: "bg-purple-50",
    color: "text-purple-500",
  },
];

export default function KPISection() {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-5 gap-4">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                border
                border-gray-100
                rounded-[24px]
                h-[145px]
                p-6
                shadow-[0_2px_10px_rgba(0,0,0,0.03)]
                flex
                flex-col
              "
            >
              {/* Title Row */}

              <div className="h-[24px] flex items-center">
<p
  className="
    text-[12px]
    font-medium
    text-gray-500
    whitespace-nowrap
    flex
    items-center
  "
>
  {item.title}
</p>
              </div>

              {/* Middle Row */}

              <div className="h-[76px] flex items-center gap-3">
                <div
                  className={`
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    shrink-0
                    ${item.bg}
                  `}
                >
                  <Icon
                    size={16}
                    className={item.color}
                  />
                </div>

                <h2
                  className="
                    text-[22px]
                    font-bold
                    text-gray-900
                    leading-none
                  "
                >
                  {item.value}
                </h2>
              </div>

              {/* Trend Row */}

              <div className="h-[32px] flex items-start text-[11px]">
                <span className="font-medium text-green-500">
                  ↑ {item.change}
                </span>

                <span className="text-gray-500 ml-1">
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