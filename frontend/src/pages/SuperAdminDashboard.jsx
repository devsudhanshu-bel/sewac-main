import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Users, UserPlus, LogOut } from "lucide-react";
import CreateAdminModal from "../components/CreateAdminModal";
import API_BASE_URL from "../services/api";
import { Trash2 } from "lucide-react";

import "@fontsource/oswald";
import "@fontsource-variable/finlandica";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);

  const [loading, setLoading] = useState(true);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const token = sessionStorage.getItem("superAdminToken");

  const adminString = sessionStorage.getItem("superAdmin");

  const admin = adminString ? JSON.parse(adminString) : null;
  const fetchAdmins = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/super-admin/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setAdmins(data.admins);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !admin) {
      navigate("/super-admin");
      return;
    }

    fetchAdmins();
  }, [navigate]);

  const logout = () => {
    sessionStorage.clear();

    navigate("/super-admin");
  };

  const layer1Count = admins.filter(
    (admin) => admin.role === "ADMIN_LAYER_1",
  ).length;

  const layer2Count = admins.filter(
    (admin) => admin.role === "ADMIN_LAYER_2",
  ).length;

  const deleteAdministrator = async (id) => {
    if (!window.confirm("Delete administrator?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/super-admin/admins/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        fetchAdmins();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}

      <div className="border-b border-white/10 bg-slate-900 px-10 py-6 flex items-center justify-between">
        <div>
          <h1
            style={{
              fontFamily: "Oswald",
            }}
            className="text-4xl uppercase"
          >
            SUPER ADMIN
          </h1>

          <p
            style={{
              fontFamily: "Finlandica",
            }}
            className="text-white/60 mt-1"
          >
            Administrator Management Console
          </p>
        </div>

        <button
          onClick={logout}
          className="
flex
items-center
gap-2
bg-red-600
hover:bg-red-700
transition-all
duration-300
shadow-lg
shadow-red-900/40
hover:scale-105
px-6
py-3
rounded-xl
font-semibold
"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* BODY */}

      <div className="max-w-7xl mx-auto p-10">
        {/* WELCOME */}

        <div className="bg-slate-900 rounded-2xl p-8 border border-white/10">
          <div className="flex items-center gap-4">
            <ShieldCheck size={42} className="text-cyan-400" />

            <div>
              <h2 style={{ fontFamily: "Oswald" }} className="text-4xl">
                Welcome Back,
              </h2>

              <h3 className="text-2xl mt-1 font-semibold text-cyan-400">
                {admin?.full_name}
              </h3>

              <p className="text-white/60 mt-3">Super Administrator</p>
            </div>
          </div>
        </div>

        {/* CARDS */}

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8">
            <Users size={42} className="text-green-400" />

            <h2 className="text-5xl mt-5" style={{ fontFamily: "Oswald" }}>
              {admins.length}
            </h2>

            <p className="text-white/60 mt-2">Total Administrators</p>
          </div>
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8">
            <Users size={42} className="text-cyan-400" />

            <h2
              className="text-5xl mt-5"
              style={{
                fontFamily: "Oswald",
              }}
            >
              {layer1Count}
            </h2>

            <p className="text-white/60 mt-2">Admin Layer 1</p>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8">
            <Users size={42} className="text-violet-400" />

            <h2
              className="text-5xl mt-5"
              style={{
                fontFamily: "Oswald",
              }}
            >
              {layer2Count}
            </h2>

            <p className="text-white/60 mt-2">Admin Layer 2</p>
          </div>
        </div>
        {/* ADMIN TABLE */}

        <div className="mt-10 bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
            <h2
              style={{
                fontFamily: "Oswald",
              }}
              className="text-2xl uppercase"
            >
              Administrators
            </h2>

            <button
              onClick={() => setOpenCreateModal(true)}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl font-medium transition-all"
            >
              <UserPlus size={20} />
              Create Administrator
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="text-left px-6 py-4">#</th>

                <th className="text-left px-6 py-4">Name</th>

                <th className="text-left px-6 py-4">Email</th>

                <th className="text-left px-6 py-4">Role</th>

                <th className="text-left px-6 py-4">Created</th>

                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-white/60">
                    Loading Administrators...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-white/60">
                    <div className="py-8">
                      <p className="text-lg text-white">
                        No Administrators Found
                      </p>

                      <p className="text-white/50 mt-2">
                        Click{" "}
                        <span className="text-cyan-400">New Administrator</span>{" "}
                        to create your first administrator.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                admins.map((admin, index) => (
                  <tr
                    key={admin.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4 font-semibold text-cyan-400">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4">{admin.full_name}</td>

                    <td className="px-6 py-4">{admin.email}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          admin.role === "ADMIN_LAYER_1"
                            ? "bg-cyan-500/20 text-cyan-300"
                            : "bg-violet-500/20 text-violet-300"
                        }`}
                      >
                        {admin.role.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteAdministrator(admin.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CREATE ADMIN MODAL */}

        {openCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-white/10 p-8">
              <div className="flex justify-between items-center">
                <h2
                  style={{
                    fontFamily: "Oswald",
                  }}
                  className="text-3xl"
                >
                  Create Administrator
                </h2>

                <button
                  onClick={() => setOpenCreateModal(false)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="mt-8 text-center text-white/60">
                <CreateAdminModal
                  onClose={() => setOpenCreateModal(false)}
                  onSuccess={fetchAdmins}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
