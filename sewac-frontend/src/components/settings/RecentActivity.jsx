import {
  Check,
  BarChart3,
  User,
  Lock,
  Download,
} from "lucide-react";

const activities = [
  {
    title: "Logged in successfully",
    time: "Today, 08:45 AM",
    badge: "This Device",
    icon: Check,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badgeClass: "bg-green-100 text-green-600",
  },
  {
    title: 'Generated report "Daily Collection Report"',
    time: "Today, 07:32 AM",
    badge: "Reports",
    icon: BarChart3,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    badgeClass: "bg-purple-100 text-purple-600",
  },
  {
    title: "Updated worker information",
    time: "Yesterday, 05:15 PM",
    badge: "Workers",
    icon: User,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    badgeClass: "bg-orange-100 text-orange-500",
  },
  {
    title: "Changed password",
    time: "18 May 2025, 09:10 AM",
    badge: "Security",
    icon: Lock,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
    badgeClass: "bg-pink-100 text-pink-500",
  },
  {
    title: "Exported citizen data",
    time: "18 May 2025, 08:22 AM",
    badge: "Exports",
    icon: Download,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    badgeClass: "bg-blue-100 text-blue-500",
  },
];

export default function RecentActivity() {
  return (
    <div className="flex-1 bg-white rounded-[18px] border border-[#f1f1f1] shadow-sm p-5">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">

        <div>
          <h3 className="text-[15px] font-semibold text-[#1f2937]">
            Recent Account Activity
          </h3>

          <p className="text-[11px] text-[#9ca3af] mt-1">
            Latest activities performed in your account
          </p>
        </div>

        <button
          className="
            h-[30px]
            px-4
            rounded-[8px]
            border
            border-[#ece8ff]
            text-[11px]
            font-medium
            text-[#8b5cf6]
            bg-white
          "
        >
          View All Activity
        </button>

      </div>

      {/* Timeline */}
      <div className="relative">

        <div className="absolute left-[14px] top-3 bottom-3 w-px bg-[#e5e7eb]" />

        <div className="space-y-6">

          {activities.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="relative flex items-start gap-4"
              >

                {/* Icon */}
                <div
                  className={`
                    relative z-10
                    w-7 h-7
                    rounded-full
                    flex
                    items-center
                    justify-center
                    ${item.iconBg}
                  `}
                >
                  <Icon
                    size={14}
                    className={item.iconColor}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex items-start justify-between border-b border-[#f3f4f6] pb-4">

                  <div>
                    <h4 className="text-[12px] font-medium text-[#374151]">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-[#9ca3af] mt-1">
                      {item.time}
                    </p>
                  </div>

                  <span
                    className={`
                      px-2.5
                      py-1
                      rounded-full
                      text-[10px]
                      font-medium
                      ${item.badgeClass}
                    `}
                  >
                    {item.badge}
                  </span>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}