import {
  Download,
  Clock3,
  Monitor,
  Trash2,
  ChevronRight,
} from "lucide-react";

const actions = [
  {
    title: "Download My Data",
    subtitle: "Download your account data",
    icon: Download,
    iconBg: "bg-[#f5f3ff]",
    iconColor: "text-[#8b5cf6]",
  },
  {
    title: "Login History",
    subtitle: "View recent login activity",
    icon: Clock3,
    iconBg: "bg-[#f5f3ff]",
    iconColor: "text-[#8b5cf6]",
  },
  {
    title: "Manage Devices",
    subtitle: "Manage connected devices",
    icon: Monitor,
    iconBg: "bg-[#f5f3ff]",
    iconColor: "text-[#8b5cf6]",
  },
  {
    title: "Delete Account",
    subtitle: "Permanently delete account",
    icon: Trash2,
    iconBg: "bg-[#ffe9ef]",
    iconColor: "text-[#ff4d79]",
    danger: true,
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-[18px] border border-[#f1f1f1] shadow-sm p-5">

      {/* Header */}
      <div className="mb-5">
        <h3 className="text-[15px] font-semibold text-[#1f2937]">
          Quick Actions
        </h3>
      </div>

      {/* Actions */}
      <div className="space-y-3">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="
                w-full
                border
                border-[#eceff4]
                rounded-[10px]
                px-3
                py-3
                flex
                items-center
                justify-between
                bg-white
                hover:bg-[#fafafa]
                transition
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className={`
                    w-9
                    h-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    ${action.iconBg}
                  `}
                >
                  <Icon
                    size={15}
                    className={action.iconColor}
                  />
                </div>

                <div className="text-left">

                  <h4
                    className={`text-[12px] font-medium ${
                      action.danger
                        ? "text-[#ff4d79]"
                        : "text-[#374151]"
                    }`}
                  >
                    {action.title}
                  </h4>

                  <p className="text-[11px] text-[#9ca3af] mt-0.5">
                    {action.subtitle}
                  </p>

                </div>

              </div>

              <ChevronRight
                size={15}
                className="text-[#9ca3af]"
              />

            </button>
          );
        })}

      </div>

    </div>
  );
}