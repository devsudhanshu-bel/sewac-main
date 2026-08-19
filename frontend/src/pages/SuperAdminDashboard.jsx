import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Users, UserPlus, LogOut, Trash2 } from "lucide-react";

import CreateAdminModal from "../components/CreateAdminModal";
import API_BASE_URL from "../services/api";

import "@fontsource/oswald";
import "@fontsource-variable/finlandica";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | SESSION
  |--------------------------------------------------------------------------
  */

  const token = sessionStorage.getItem("superAdminToken");

  const adminString = sessionStorage.getItem("superAdmin");

  const admin = adminString ? JSON.parse(adminString) : null;

  /*
  |--------------------------------------------------------------------------
  | FETCH ADMINISTRATORS
  |--------------------------------------------------------------------------
  */

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
        setAdmins(Array.isArray(data.admins) ? data.admins : []);
      }
    } catch (err) {
      console.log("Fetch Administrators Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | INITIAL AUTH CHECK
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!token || !admin) {
      navigate("/super-admin");
      return;
    }

    fetchAdmins();
  }, [navigate]);

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const logout = () => {
    sessionStorage.clear();

    navigate("/super-admin");
  };

  /*
  |--------------------------------------------------------------------------
  | ROLE COUNTS
  |--------------------------------------------------------------------------
  */

  const layer1Count = admins.filter(
    (admin) => admin.role === "ADMIN_LAYER_1",
  ).length;

  const layer2Count = admins.filter(
    (admin) => admin.role === "ADMIN_LAYER_2",
  ).length;

  /*
  |--------------------------------------------------------------------------
  | DELETE ADMINISTRATOR
  |--------------------------------------------------------------------------
  */

  const deleteAdministrator = async (id) => {
    if (!window.confirm("Delete administrator?")) {
      return;
    }

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
        await fetchAdmins();
      } else {
        alert(data.message || "Failed to delete administrator.");
      }
    } catch (err) {
      console.log("Delete Administrator Error:", err);

      alert("Server Error. Please try again.");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ================================================================= */}
      {/* HEADER                                                            */}
      {/* ================================================================= */}

      <div
        className="
          border-b
          border-white/10
          bg-slate-900
          px-10
          py-6
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h1
            style={{
              fontFamily: "Oswald",
            }}
            className="
              text-4xl
              uppercase
            "
          >
            SUPER ADMIN
          </h1>

          <p
            style={{
              fontFamily: "Finlandica",
            }}
            className="
              text-white/60
              mt-1
            "
          >
            Administrator Management Console
          </p>
        </div>

        {/* LOGOUT */}

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

      {/* ================================================================= */}
      {/* BODY                                                              */}
      {/* ================================================================= */}

      <div
        className="
          max-w-7xl
          mx-auto
          p-10
        "
      >
        {/* =============================================================== */}
        {/* WELCOME                                                         */}
        {/* =============================================================== */}

        <div
          className="
            bg-slate-900
            rounded-2xl
            p-8
            border
            border-white/10
          "
        >
          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <ShieldCheck size={42} className="text-cyan-400" />

            <div>
              <h2
                style={{
                  fontFamily: "Oswald",
                }}
                className="text-4xl"
              >
                Welcome Back,
              </h2>

              <h3
                className="
                  text-2xl
                  mt-1
                  font-semibold
                  text-cyan-400
                "
              >
                {admin?.full_name}
              </h3>

              <p className="text-white/60 mt-3">Super Administrator</p>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* CARDS                                                           */}
        {/* =============================================================== */}

        <div
          className="
            grid
            md:grid-cols-3
            gap-6
            mt-8
          "
        >
          {/* TOTAL ADMINISTRATORS */}

          <div
            className="
              bg-slate-900
              rounded-2xl
              border
              border-white/10
              p-8
            "
          >
            <Users size={42} className="text-green-400" />

            <h2
              className="
                text-5xl
                mt-5
              "
              style={{
                fontFamily: "Oswald",
              }}
            >
              {admins.length}
            </h2>

            <p className="text-white/60 mt-2">Total Administrators</p>
          </div>

          {/* ADMIN LAYER 1 */}

          <div
            className="
              bg-slate-900
              rounded-2xl
              border
              border-white/10
              p-8
            "
          >
            <Users size={42} className="text-cyan-400" />

            <h2
              className="
                text-5xl
                mt-5
              "
              style={{
                fontFamily: "Oswald",
              }}
            >
              {layer1Count}
            </h2>

            <p className="text-white/60 mt-2">Admin Layer 1</p>
          </div>

          {/* ADMIN LAYER 2 */}

          <div
            className="
              bg-slate-900
              rounded-2xl
              border
              border-white/10
              p-8
            "
          >
            <Users size={42} className="text-violet-400" />

            <h2
              className="
                text-5xl
                mt-5
              "
              style={{
                fontFamily: "Oswald",
              }}
            >
              {layer2Count}
            </h2>

            <p className="text-white/60 mt-2">Admin Layer 2</p>
          </div>
        </div>

        {/* =============================================================== */}
        {/* ADMIN TABLE                                                     */}
        {/* =============================================================== */}

        <div
          className="
            mt-10
            bg-slate-900
            rounded-2xl
            border
            border-white/10
            overflow-hidden
          "
        >
          {/* TABLE HEADER */}

          <div
            className="
              flex
              justify-between
              items-center
              px-6
              py-5
              border-b
              border-white/10
            "
          >
            <h2
              style={{
                fontFamily: "Oswald",
              }}
              className="
                text-2xl
                uppercase
              "
            >
              Administrators
            </h2>

            <button
              onClick={() => setOpenCreateModal(true)}
              className="
                flex
                items-center
                gap-2
                bg-cyan-500
                hover:bg-cyan-600
                px-5
                py-3
                rounded-xl
                font-medium
                transition-all
              "
            >
              <UserPlus size={20} />
              Create Administrator
            </button>
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left px-6 py-4">#</th>

                  <th className="text-left px-6 py-4">Name</th>

                  <th className="text-left px-6 py-4">Email</th>

                  <th className="text-left px-6 py-4">Phone</th>

                  <th className="text-left px-6 py-4">Role</th>

                  <th className="text-left px-6 py-4">Created</th>

                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {/* LOADING */}

                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="
                        text-center
                        py-10
                        text-white/60
                      "
                    >
                      Loading Administrators...
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  /* EMPTY */

                  <tr>
                    <td
                      colSpan="7"
                      className="
                        text-center
                        py-10
                        text-white/60
                      "
                    >
                      <div className="py-8">
                        <p className="text-lg text-white">
                          No Administrators Found
                        </p>

                        <p className="text-white/50 mt-2">
                          Click{" "}
                          <span className="text-cyan-400">
                            Create Administrator
                          </span>{" "}
                          to create your first administrator.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* ADMINISTRATORS */

                  admins.map((admin, index) => (
                    <tr
                      key={admin.id}
                      className="
                          border-t
                          border-white/10
                          hover:bg-white/5
                          transition
                        "
                    >
                      {/* NUMBER */}

                      <td
                        className="
                            px-6
                            py-4
                            font-semibold
                            text-cyan-400
                          "
                      >
                        {index + 1}
                      </td>

                      {/* NAME */}

                      <td className="px-6 py-4">{admin.full_name}</td>

                      {/* EMAIL */}

                      <td className="px-6 py-4">{admin.email}</td>

                      {/* PHONE */}

                      <td className="px-6 py-4">
                        {admin.phone_number || "N/A"}
                      </td>

                      {/* ROLE */}

                      <td className="px-6 py-4">
                        <span
                          className={`
                              px-3
                              py-1
                              rounded-full
                              text-sm
                              font-medium
                              ${
                                admin.role === "ADMIN_LAYER_1"
                                  ? "bg-cyan-500/20 text-cyan-300"
                                  : "bg-violet-500/20 text-violet-300"
                              }
                            `}
                        >
                          {admin.role.replaceAll("_", " ")}
                        </span>
                      </td>

                      {/* CREATED */}

                      <td className="px-6 py-4">
                        {admin.created_at
                          ? new Date(admin.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteAdministrator(admin.id)}
                          className="
                              text-red-500
                              hover:text-red-400
                              transition
                            "
                          title="Delete Administrator"
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
        </div>

        {/* =============================================================== */}
        {/* CREATE ADMIN MODAL                                              */}
        {/* =============================================================== */}

        {openCreateModal && (
          <CreateAdminModal
            onClose={() => setOpenCreateModal(false)}
            onSuccess={fetchAdmins}
          />
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
