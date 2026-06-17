import {
  ClipboardCheck,
  AlertTriangle,
  Radio,
  UserCheck,
  UserCog,
} from "lucide-react";

const activities = [
  {
    title: "Collection Logged",
    worker: "Ramesh Kumar",
    time: "2 min ago",
    icon: ClipboardCheck,
    color: "pink",
  },
  {
    title: "Issue Reported",
    worker: "Suresh Babu",
    time: "10 min ago",
    icon: AlertTriangle,
    color: "orange",
  },
  {
    title: "RFID Verified",
    worker: "Mahesh P.",
    time: "18 min ago",
    icon: Radio,
    color: "purple",
  },
  {
    title: "Citizen Verified",
    worker: "Shankar R.",
    time: "35 min ago",
    icon: UserCheck,
    color: "blue",
  },
  {
    title: "Profile Updated",
    worker: "Ravi Kumar",
    time: "1 hr ago",
    icon: UserCog,
    color: "green",
  },
];

const styles = {
  pink: {
    bg: "bg-pink-50/70 hover:bg-pink-50",
    iconBg: "bg-pink-100",
    icon: "text-pink-500",
    title: "text-pink-500",
  },
  orange: {
    bg: "bg-orange-50/70 hover:bg-orange-50",
    iconBg: "bg-orange-100",
    icon: "text-orange-500",
    title: "text-orange-500",
  },
  purple: {
    bg: "bg-purple-50/70 hover:bg-purple-50",
    iconBg: "bg-purple-100",
    icon: "text-purple-500",
    title: "text-purple-500",
  },
  blue: {
    bg: "bg-blue-50/70 hover:bg-blue-50",
    iconBg: "bg-blue-100",
    icon: "text-blue-500",
    title: "text-blue-500",
  },
  green: {
    bg: "bg-green-50/70 hover:bg-green-50",
    iconBg: "bg-green-100",
    icon: "text-green-500",
    title: "text-green-500",
  },
};

export default function ActivityFeed() {
  return (
    <div
      className="
        bg-white
        rounded-[28px]
        border
        border-gray-100
        shadow-sm
        h-[440px]
        p-5
        flex
        flex-col
        overflow-hidden
      "
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-gray-900">
          Recent Activity Feed
        </h3>
        
        <button 
          className="
            text-[12px] 
            font-medium 
            text-purple-500 
            hover:text-purple-600 
            transition-all 
            duration-100 
            transform 
            active:scale-90 
            active:opacity-80
            outline-none
          "
        >
          View All
        </button>
      </div>

      <div
        className="
          flex-1
          space-y-3
        "
      >
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const style = styles[activity.color];

          return (
            <div
              key={index}
              className={`
                ${style.bg}
                rounded-2xl
                h-[64px]
                px-4
                flex
                items-center
                justify-between
                cursor-pointer
                transition-all
                duration-300
                ease-out
                hover:-translate-y-0.5
                hover:shadow-sm
                group
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    ${style.iconBg}
                    w-9
                    h-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  `}
                >
                  <Icon
                    size={16}
                    className={style.icon}
                  />
                </div>

                <div>
                  <h4
                    className={`
                      text-[13px]
                      font-semibold
                      ${style.title}
                    `}
                  >
                    {activity.title}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {activity.worker}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-gray-400 w-[70px] text-right transition-colors duration-300 group-hover:text-gray-500">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}