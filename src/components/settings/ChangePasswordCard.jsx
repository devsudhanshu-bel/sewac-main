import { Lock, Eye } from "lucide-react";

export default function ChangePasswordCard() {
  return (
    <div className="bg-white rounded-[18px] border border-[#f1f1f1] shadow-sm p-5">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>
          <h3 className="text-[16px] font-semibold text-[#1f2937]">
            Change Password
          </h3>

          <p className="text-[12px] text-[#9ca3af] mt-1">
            Update your password regularly
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
          <Lock
            size={16}
            className="text-[#ff4fa3]"
          />
        </div>

      </div>

      {/* Inputs */}
      <div className="mt-5 space-y-4">

        {/* Current Password */}
        <div>
          <label className="block text-[11px] text-[#6b7280] mb-2">
            Current Password
          </label>

          <div className="relative">
            <input
              type="password"
              placeholder="Enter current password"
              className="
                w-full
                h-[38px]
                px-4
                pr-10
                border
                border-[#e5e7eb]
                rounded-[6px]
                text-[12px]
                outline-none
                focus:border-pink-400
              "
            />

            <Eye
              size={14}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-[#9ca3af]
              "
            />
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-[11px] text-[#6b7280] mb-2">
            New Password
          </label>

          <div className="relative">
            <input
              type="password"
              placeholder="Enter new password"
              className="
                w-full
                h-[38px]
                px-4
                pr-10
                border
                border-[#e5e7eb]
                rounded-[6px]
                text-[12px]
                outline-none
                focus:border-pink-400
              "
            />

            <Eye
              size={14}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-[#9ca3af]
              "
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[11px] text-[#6b7280] mb-2">
            Confirm New Password
          </label>

          <div className="relative">
            <input
              type="password"
              placeholder="Confirm new password"
              className="
                w-full
                h-[38px]
                px-4
                pr-10
                border
                border-[#e5e7eb]
                rounded-[6px]
                text-[12px]
                outline-none
                focus:border-pink-400
              "
            />

            <Eye
              size={14}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-[#9ca3af]
              "
            />
          </div>
        </div>

      </div>

      {/* Button */}
      <button
        className="
          mt-5
          w-full
          h-[38px]
          rounded-[6px]
          text-white
          text-[12px]
          font-medium
          bg-gradient-to-r
          from-[#ff4fa3]
          to-[#7c3aed]
        "
      >
        Update Password
      </button>

    </div>
  );
}