import { useState } from "react";
import { X } from "lucide-react";
import API_BASE_URL from "../services/api";

export default function CreateAdminModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "ADMIN_LAYER_2",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
    |--------------------------------------------------------------------------
    | PHONE VALIDATION
    |--------------------------------------------------------------------------
    */

    const phone = form.phone_number.trim();

    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");

      return;
    }

    setLoading(true);

    try {
      const token = sessionStorage.getItem("superAdminToken");

      const response = await fetch(`${API_BASE_URL}/api/super-admin/admins`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          full_name: form.full_name.trim(),

          email: form.email.trim(),

          phone_number: phone,

          password: form.password,

          role: form.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.message || "Failed to create administrator.");

        return;
      }

      alert("Administrator Created Successfully");

      await onSuccess();

      onClose();
    } catch (err) {
      console.error("Create Administrator Error:", err);

      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-xl p-8">
        {/* ============================================================ */}
        {/* HEADER                                                        */}
        {/* ============================================================ */}

        <div className="flex justify-between items-center">
          <h2 className="text-3xl text-white font-semibold">
            Create Administrator
          </h2>

          <button type="button" onClick={onClose} disabled={loading}>
            <X className="text-white" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* FORM                                                          */}
        {/* ============================================================ */}

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          {/* ========================================================== */}
          {/* FULL NAME                                                    */}
          {/* ========================================================== */}

          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="
              w-full
              rounded-xl
              bg-slate-800
              border
              border-white/10
              px-4
              py-4
              text-white
              placeholder:text-white/50
              outline-none
              focus:border-cyan-400
            "
          />

          {/* ========================================================== */}
          {/* EMAIL                                                        */}
          {/* ========================================================== */}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="
              w-full
              rounded-xl
              bg-slate-800
              border
              border-white/10
              px-4
              py-4
              text-white
              placeholder:text-white/50
              outline-none
              focus:border-cyan-400
            "
          />

          {/* ========================================================== */}
          {/* PHONE NUMBER — NEW                                           */}
          {/* ========================================================== */}

          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={handleChange}
            required
            inputMode="numeric"
            maxLength={10}
            pattern="[0-9]{10}"
            className="
              w-full
              rounded-xl
              bg-slate-800
              border
              border-white/10
              px-4
              py-4
              text-white
              placeholder:text-white/50
              outline-none
              focus:border-cyan-400
            "
          />

          {/* ========================================================== */}
          {/* PASSWORD                                                     */}
          {/* ========================================================== */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="
              w-full
              rounded-xl
              bg-slate-800
              border
              border-white/10
              px-4
              py-4
              text-white
              placeholder:text-white/50
              outline-none
              focus:border-cyan-400
            "
          />

          {/* ========================================================== */}
          {/* ROLE                                                         */}
          {/* ========================================================== */}

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="
              w-full
              rounded-xl
              bg-slate-800
              border
              border-white/10
              px-4
              py-4
              text-white
              outline-none
              focus:border-cyan-400
            "
          >
            <option value="ADMIN_LAYER_1">Admin Layer 1</option>

            <option value="ADMIN_LAYER_2">Admin Layer 2</option>
          </select>

          {/* ========================================================== */}
          {/* CREATE                                                       */}
          {/* ========================================================== */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-cyan-500
              hover:bg-cyan-600
              disabled:opacity-50
              disabled:cursor-not-allowed
              py-4
              rounded-xl
              text-white
              font-semibold
              transition
            "
          >
            {loading ? "Creating..." : "Create Administrator"}
          </button>
        </form>
      </div>
    </div>
  );
}
