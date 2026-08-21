import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import api from "../../api/axios";

const AdminUsers = () => {
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [adminUsers, setAdminUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH ADMIN LAYER 1 USERS
  // =========================================================

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/users", {
        params: {
          type: "ADMIN_LAYER_1",
        },
      });

      const users = response?.data?.users || [];

      setAdminUsers(users);
    } catch (err) {
      console.error("Fetch Admin Layer 1 users error:", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch Admin Layer 1 users.";

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // =========================================================
  // CREATE
  // =========================================================

  const handleAdminCreated = () => {
    setShowAddAdminModal(false);

    // Get actual DB state again
    fetchAdmins();
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUserUpdated = () => {
    setShowEditModal(false);
    setSelectedUser(null);

    // Refresh actual DB data
    fetchAdmins();
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUserDeleted = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);

    // Since backend performs soft delete,
    // refetch active users from DB.
    fetchAdmins();
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredAdmins = adminUsers.filter((user) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      (user.full_name || "").toLowerCase().includes(value) ||
      (user.email || "").toLowerCase().includes(value) ||
      (user.phone_number || "").includes(value)
    );
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-violet-600" />
            </div>

            <div>

              <h2 className="text-[16px] font-semibold text-gray-900">
                Admin Level 1 Users
              </h2>

              <p className="mt-0.5 text-[12px] text-gray-500">
                Manage other Admin Level 1 users who have full access to the
                system.
              </p>

            </div>

          </div>

        </div>

        {/* Search + Button */}
        <div className="mt-4 flex items-center justify-between">

          <div className="relative w-[340px]">

            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-600" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="
                w-full
                h-10
                rounded-lg
                border
                border-gray-200
                pl-4
                pr-10
                text-[13px]
                outline-none
                focus:border-violet-500
              "
            />

          </div>

          <button
            onClick={() => setShowAddAdminModal(true)}
            className="
              h-10
              px-5
              rounded-lg
              border
              border-violet-600
              text-violet-700
              hover:bg-violet-600
              hover:text-white
              transition
              text-[13px]
              font-medium
              flex
              items-center
              gap-2
            "
          >
            <Plus className="w-4 h-4" />
            Add Admin
          </button>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="mx-5 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-[#F7F5FF]">

            <tr>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-violet-700">
                SL.No
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-violet-700">
                Admin Name
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-violet-700">
                Email
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-violet-700">
                Phone Number
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-violet-700">
                Status
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-violet-700">
                Created At
              </th>

              <th className="px-5 py-3 text-center text-[12px] font-semibold text-violet-700">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading && (
              <tr>
                <td
                  colSpan="7"
                  className="px-5 py-10 text-center text-[13px] text-gray-500"
                >
                  Loading Admin Layer 1 users...
                </td>
              </tr>
            )}

            {!loading &&
              filteredAdmins.map((user, index) => (

                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >

                  <td className="px-5 py-4 text-[13px]">
                    {index + 1}
                  </td>

                  <td className="px-5 py-4 text-[13px] font-medium">
                    {user.full_name}
                  </td>

                  <td className="px-5 py-4 text-[13px] text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-5 py-4 text-[13px] text-gray-600">
                    {user.phone_number || "-"}
                  </td>

                  <td className="px-5 py-4">

                    <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-[11px] font-medium">
                      {user.status}
                    </span>

                  </td>

                  <td className="px-5 py-4 text-[13px] text-gray-600">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-center items-center gap-4">

                      <button
                        type="button"
                        onClick={() => handleEditClick(user)}
                        className="text-violet-600 hover:text-violet-800 transition"
                        title="Edit user"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            {!loading && filteredAdmins.length === 0 && (

              <tr>

                <td
                  colSpan="7"
                  className="px-5 py-10 text-center text-[13px] text-gray-500"
                >
                  No Admin Layer 1 users found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 text-[12px]">

        <p className="text-violet-700 font-medium">
          Showing {filteredAdmins.length} of {adminUsers.length} entries
        </p>

        <div className="flex items-center gap-2">

          <span className="text-gray-600">
            Rows per page:
          </span>

          <select className="h-8 rounded-md border border-gray-200 px-2 text-[12px] outline-none">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>

        </div>

      </div>

      {/* Add Admin */}
      <AddUserModal
        open={showAddAdminModal}
        onClose={() => setShowAddAdminModal(false)}
        title="Add Admin"
        role="ADMIN_LAYER_1"
        onSuccess={handleAdminCreated}
      />

      {/* Edit Admin */}
      <EditUserModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        title="Edit Admin"
        onSuccess={handleUserUpdated}
      />

      {/* Delete Admin */}
      <DeleteUserModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={handleUserDeleted}
      />

    </div>
  );
};

export default AdminUsers;