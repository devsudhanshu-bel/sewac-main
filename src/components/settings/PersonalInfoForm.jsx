import { User } from "lucide-react";

export default function PersonalInfoForm() {
  return (
    <div className="flex-1 self-start bg-white rounded-[18px] border border-[#efefef] shadow-sm overflow-hidden w-full">
      {/* Main Content Pane */}
      <div className="p-5">

        <h3 className="text-[16px] font-semibold text-[#1f2937]">
          Personal Information
        </h3>

        <p className="text-[12px] text-[#9ca3af] mt-1">
          Update your personal details and contact information.
        </p>

        {/* Input Fields Grid: Side-by-side on desktop, single column on mobile devices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">

          {/* Full Name */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="Admin"
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="admin@sewac.in"
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">
              Phone Number
            </label>
            <input
              type="text"
              defaultValue="+91 98765 43210"
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">
              Designation
            </label>
            <input
              type="text"
              defaultValue="Super Administrator"
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">
              Department
            </label>
            <input
              type="text"
              defaultValue="Waste Management"
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
            />
          </div>

          {/* Organization */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">
              Organization
            </label>
            <input
              type="text"
              defaultValue="Bengaluru City Corporation"
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
            />
          </div>

        </div>

        {/* Full-width Address Field */}
        <div className="mt-3">
          <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">
            Address
          </label>
          <input
            type="text"
            defaultValue="4th Floor, Corporation Office, Bengaluru, Karnataka - 560002"
            className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
          />
        </div>

        {/* Lower Submit CTA Button Container */}
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
              hover:opacity-95
              active:scale-[0.99]
              transition-all
              cursor-pointer
            "
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}