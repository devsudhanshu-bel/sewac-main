import { X } from "lucide-react";

const AddUserModal = ({
  open,
  onClose,
  title,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="w-[460px] rounded-xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-5 py-4">

          <h2 className="text-[16px] font-semibold">
            {title}
          </h2>

          <button onClick={onClose}>
            <X className="w-4 h-4 text-gray-500" />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-4 p-5">

          <div>
            <label className="mb-1 block text-[12px] font-medium text-gray-700">
              Full Name
            </label>

            <input
              className="h-10 w-full rounded-lg border px-3 text-[13px] outline-none focus:border-violet-500"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-medium text-gray-700">
              Email
            </label>

            <input
              className="h-10 w-full rounded-lg border px-3 text-[13px] outline-none focus:border-violet-500"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-medium text-gray-700">
              Role
            </label>

            <select className="h-10 w-full rounded-lg border px-3 text-[13px] outline-none">
              <option>Select role</option>
              <option>Admin</option>
              <option>Super Admin</option>
            </select>
          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-2 border-t px-5 py-4">

          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-[13px]"
          >
            Cancel
          </button>

          <button
            className="rounded-lg bg-violet-600 px-4 py-2 text-[13px] text-white hover:bg-violet-700"
          >
            Save User
          </button>

        </div>

      </div>

    </div>
  );
};

export default AddUserModal;