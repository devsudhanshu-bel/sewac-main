import { useState } from "react";
import { X } from "lucide-react";
import api from "../../api/axios";

const initialForm = {
  full_name: "",
  email: "",
  password: "",
  phone_number: "",
};

const AddUserModal = ({
  open,
  onClose,
  title,
  role,
  onSuccess,
}) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

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
    setForm(initialForm);
    setError("");
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const fullName = form.full_name.trim();
    const email = form.email.trim();
    const phone = form.phone_number.trim();
    const password = form.password;

    if (!fullName || !email || !phone || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!role) {
      setError("User role is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/users", {
        full_name: fullName,
        email,
        password,
        phone_number: phone,
        role,
      });

      const createdUser = response?.data?.user;

      if (!createdUser) {
        throw new Error("User was created, but no user data was returned.");
      }

      if (onSuccess) {
        onSuccess(createdUser);
      }

      resetAndClose();
    } catch (err) {
      console.error("Create user error:", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create user.";

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

            {/* Email */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-[#1F3768]">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
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

            {/* Password */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-[#1F3768]">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
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
              {loading ? "Saving..." : "Save"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddUserModal;