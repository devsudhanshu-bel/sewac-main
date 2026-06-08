import {
  AlertTriangle,
  Info,
  Users,
  Bell,
} from "lucide-react";

const alerts = [
  {
    title: "High Waste Alert",
    location: "Koramangala 3rd Block",
    time: "2 min ago",
    color: "pink",
    icon: AlertTriangle,
  },
  {
    title: "Vehicle Delay",
    location: "BTM Layout 2nd Stage",
    time: "15 min ago",
    color: "orange",
    icon: Info,
  },
  {
    title: "Route Deviation",
    location: "Jayanagar 9th Block",
    time: "32 min ago",
    color: "purple",
    icon: Users,
  },
  {
    title: "Collection Point Missed",
    location: "4th Cross, Jayanagar",
    time: "1 hr ago",
    color: "blue",
    icon: Bell,
  },
  {
    title: "Worker Offline",
    location: "HSR Layout Sector 2",
    time: "2 hr ago",
    color: "orange",
    icon: Info,
  },
  {
    title: "Bin Overflow",
    location: "Electronic City Phase 1",
    time: "3 hr ago",
    color: "pink",
    icon: AlertTriangle,
  },
  {
    title: "Vehicle Breakdown",
    location: "JP Nagar 5th Phase",
    time: "5 hr ago",
    color: "purple",
    icon: Users,
  },
];

const styles = {
  pink: {
    card: "bg-pink-50",
    iconBg: "bg-pink-100",
    icon: "text-pink-500",
    title: "text-pink-500",
  },

  orange: {
    card: "bg-orange-50",
    iconBg: "bg-orange-100",
    icon: "text-orange-500",
    title: "text-orange-500",
  },

  purple: {
    card: "bg-purple-50",
    iconBg: "bg-purple-100",
    icon: "text-purple-500",
    title: "text-purple-500",
  },

  blue: {
    card: "bg-blue-50",
    iconBg: "bg-blue-100",
    icon: "text-blue-500",
    title: "text-blue-500",
  },
};

export default function RecentAlerts() {
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

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold text-gray-900">
          Recent Alerts
        </h3>

        <button className="text-[12px] font-medium text-purple-500">
          View All
        </button>
      </div>

      {/* Scroll Area */}

      <div
        className="
          flex-1
          overflow-y-auto
          space-y-2
          pr-1

          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-purple-200
          [&::-webkit-scrollbar-thumb]:rounded-full
        "
      >
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          const style = styles[alert.color];

          return (
            <div
              key={index}
              className={`
                ${style.card}
                rounded-2xl
                px-3
                py-2.5
                flex
                items-center
                justify-between
              `}
            >
              {/* Left */}

              <div className="flex items-center gap-2.5 min-w-0">

                <div
                  className={`
                    ${style.iconBg}
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    shrink-0
                  `}
                >
                  <Icon
                    size={13}
                    className={style.icon}
                  />
                </div>

                <div className="min-w-0">

                  <h4
                    className={`
                      text-[12px]
                      font-semibold
                      ${style.title}
                      truncate
                    `}
                  >
                    {alert.title}
                  </h4>

                  <p className="text-[11px] text-gray-500 truncate">
                    {alert.location}
                  </p>

                </div>
              </div>

              {/* Time */}

              <span className="text-[10px] text-gray-400 ml-2 shrink-0">
                {alert.time}
              </span>

            </div>
          );
        })}
      </div>
    </div>
  );
}