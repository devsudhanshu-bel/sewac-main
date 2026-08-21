import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../api/axios";

const EditUserModal = ({
  open,
  onClose,
  user,
  title = "Edit User",
  onSuccess,
}) => {
  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && user) {
      setForm({
        full_name: user.full_name || user.name || "",
        phone_number: user.phone_number || user.phone || "",
        status: user.status || "ACTIVE",
      });

      setError("");
      setLoading(false);
    }
  }, [open, user]);

  if (!open || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const resetAndClose = () => {
    setError("");
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const fullName = form.full_name.trim();
    const phone = form.phone_number.trim();

    if (!fullName) {
      setError("Full name is required.");
      return;
    }

    if (!phone) {
      setError("Phone number is required.");
      return;
    }

    if (!user.id) {
      setError("User ID is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.put(`/api/users/${user.id}`, {
        full_name: fullName,
        phone_number: phone,
        status: form.status,
      });

      const updatedUser = response?.data?.user;

      if (!updatedUser) {
        throw new Error(
          "User was updated, but no user data was returned."
        );
      }

      if (onSuccess) {
        onSuccess(updatedUser);
      }

      resetAndClose();
    } catch (err) {
      console.error("Update user error:", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update user.";

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="w-[560px] rounded-[24px] bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6">
          <h2 className="text-[28px] font-semibold text-[#1F3768]">
            {title}
          </h2>

          <button
            type="button"
            onClick={resetAndClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-800 transition disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Body */}
          <div className="space-y-5 px-7 pb-6">

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-[#1F3768]">
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
                disabled={loading}
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
                  disabled:bg-gray-50
                  disabled:cursor-not-allowed
                "
              />
            </div>

            {/* Email - Read Only */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-[#1F3768]">
                Email
              </label>

              <input
                type="email"
                value={user.email || ""}
                disabled
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  text-[14px]
                  text-gray-500
                  outline-none
                  cursor-not-allowed
                "
              />

              <p className="mt-1.5 text-[11px] text-gray-400">
                Email cannot be changed.
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-[#1F3768]">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
                disabled={loading}
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
                  disabled:bg-gray-50
                  disabled:cursor-not-allowed
                "
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-[#1F3768]">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={loading}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  text-[14px]
                  text-gray-700
                  outline-none
                  focus:border-violet-500
                  disabled:bg-gray-50
                  disabled:cursor-not-allowed
                "
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-7 pb-7">

            <button
              type="button"
              onClick={resetAndClose}
              disabled={loading}
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
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                h-11
                min-w-[110px]
                rounded-xl
                bg-violet-600
                px-7
                text-[14px]
                font-medium
                text-white
                hover:bg-violet-700
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Updating..." : "Update"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditUserModal;