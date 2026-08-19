import { X } from "lucide-react";

const AddUserModal = ({
  open,
  onClose,
  title,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="w-[460px] rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-[24px] font-semibold text-[#1F3768]">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 pb-6">

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#1F3768]">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter full name"
              className="
                h-12
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                text-[14px]
                text-gray-700
                outline-none
                focus:border-violet-500
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#1F3768]">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              className="
                h-12
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                text-[14px]
                text-gray-700
                outline-none
                focus:border-violet-500
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#1F3768]">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              className="
                h-12
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                text-[14px]
                text-gray-700
                outline-none
                focus:border-violet-500
              "
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-2 block text-[13px] font-medium text-[#1F3768]">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter phone number"
              className="
                h-12
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                text-[14px]
                text-gray-700
                outline-none
                focus:border-violet-500
              "
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6">

          <button
            onClick={onClose}
            className="
              h-11
              rounded-xl
              border
              border-gray-200
              px-6
              text-[14px]
              font-medium
              text-[#1F3768]
              hover:bg-gray-50
              transition
            "
          >
            Cancel
          </button>

          <button
            className="
              h-11
              rounded-xl
              bg-violet-600
              px-7
              text-[14px]
              font-medium
              text-white
              hover:bg-violet-700
              transition
            "
          >
            Save
          </button>

        </div>

      </div>
    </div>
  );
};

export default AddUserModal;