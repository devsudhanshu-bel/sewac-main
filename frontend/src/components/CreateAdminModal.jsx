import { useState } from "react";
import { X } from "lucide-react";
import API_BASE_URL from "../services/api";

export default function CreateAdminModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "ADMIN_LAYER_2",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = sessionStorage.getItem("superAdminToken");

      const response = await fetch(`${API_BASE_URL}/api/super-admin/admins`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);

        return;
      }

      alert("Administrator Created Successfully");

      onSuccess();

      onClose();
    } catch (err) {
      console.error(err);

      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-xl p-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl text-white font-semibold">
            Create Administrator
          </h2>

          <button onClick={onClose}>
            <X className="text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-white"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-white"
          >
            <option value="ADMIN_LAYER_1">Admin Layer 1</option>

            <option value="ADMIN_LAYER_2">Admin Layer 2</option>
          </select>

          <button
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl text-white font-semibold"
          >
            {loading ? "Creating..." : "Create Administrator"}
          </button>
        </form>
      </div>
    </div>
  );
}