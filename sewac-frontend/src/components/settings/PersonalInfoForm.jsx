import {
  User,
  Shield,
  Settings,
  Bell,
  RefreshCcw,
} from "lucide-react";

const tabs = [
  {
    label: "Personal Information",
    icon: User,
    active: true,
  },
  {
    label: "Security",
    icon: Shield,
  },
  {
    label: "Preferences",
    icon: Settings,
  },
  {
    label: "Notifications",
    icon: Bell,
  },
  {
    label: "Integrations",
    icon: RefreshCcw,
  },
];

export default function PersonalInfoForm() {
  return (
    <div className="flex-1 self-start bg-white rounded-[18px] border border-[#efefef] shadow-sm overflow-hidden">

      {/* Tabs */}
      <div className="flex items-center gap-6 px-5 pt-4 border-b border-[#f3f4f6]">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.label}
              className={`relative flex items-center gap-2 pb-4 text-[11px] font-medium ${
                tab.active
                  ? "text-[#ff4fa3]"
                  : "text-[#6b7280]"
              }`}
            >
              <Icon size={13} />

              {tab.label}

              {tab.active && (
                <span className="absolute left-0 bottom-0 h-[2px] w-full bg-[#ff4fa3]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-5">

        <h3 className="text-[16px] font-semibold text-[#1f2937]">
          Personal Information
        </h3>

        <p className="text-[12px] text-[#9ca3af] mt-1">
          Update your personal details and contact information.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-5">

          {/* Full Name */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2">
              Full Name
            </label>

            <input
              defaultValue="Admin"
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] outline-none focus:border-pink-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2">
              Email Address
            </label>

            <input
              defaultValue="admin@sewac.in"
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] outline-none focus:border-pink-400"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2">
              Phone Number
            </label>

            <input
              defaultValue="+91 98765 43210"
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] outline-none focus:border-pink-400"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2">
              Designation
            </label>

            <input
              defaultValue="Super Administrator"
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] outline-none focus:border-pink-400"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2">
              Department
            </label>

            <input
              defaultValue="Waste Management"
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] outline-none focus:border-pink-400"
            />
          </div>

          {/* Organization */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2">
              Organization
            </label>

            <input
              defaultValue="Bengaluru City Corporation"
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] outline-none focus:border-pink-400"
            />
          </div>

        </div>

        {/* Address */}
        <div className="mt-3">
          <label className="block text-[11px] text-[#6b7280] mb-2">
            Address
          </label>

          <input
            defaultValue="4th Floor, Corporation Office, Bengaluru, Karnataka - 560002"
            className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] outline-none focus:border-pink-400"
          />
        </div>

        {/* Button */}
        <div className="flex justify-end mt-4">
          <button
            className="
              h-[36px]
              px-7
              rounded-[6px]
              text-white
              text-[12px]
              font-medium
              bg-gradient-to-r
              from-[#ff4fa3]
              to-[#7c3aed]
              shadow-md
            "
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}