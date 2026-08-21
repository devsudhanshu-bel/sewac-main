import React, { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import api from "../../api/axios";

const ContractorUsers = () => {
  const [showAddContractorModal, setShowAddContractorModal] =
    useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [contractorUsers, setContractorUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH CONTRACTORS
  // =========================================================

  const fetchContractors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/users", {
        params: {
          type: "ADMIN_LAYER_2",
        },
      });

      const users = response?.data?.users || [];

      setContractorUsers(users);
    } catch (err) {
      console.error("Fetch Contractor users error:", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch Contractor users.";

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  // =========================================================
  // CREATE
  // =========================================================

  const handleContractorCreated = () => {
    setShowAddContractorModal(false);

    // Refresh actual DB data
    fetchContractors();
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
    fetchContractors();
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

    // Refresh actual DB data
    fetchContractors();
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredContractors = contractorUsers.filter((user) => {
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

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-2">

            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">

              <Building2 className="w-4 h-4 text-emerald-600" />

            </div>

            <div>

              <h2 className="text-[16px] font-semibold text-gray-900">
                Contractor Users
              </h2>

              <p className="mt-0.5 text-[12px] text-gray-500">
                Manage contractor accounts and permissions.
              </p>

            </div>

          </div>

        </div>

        {/* Search + Button */}

        <div className="mt-4 flex items-center justify-between">

          <div className="relative w-72">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contractors..."
              className="
                w-full
                h-10
                rounded-lg
                border
                border-gray-200
                pl-10
                pr-3
                text-[13px]
                outline-none
                focus:ring-2
                focus:ring-emerald-500
              "
            />

          </div>

          <button
            onClick={() => setShowAddContractorModal(true)}
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

            Add Contractor

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

          <thead>
  <tr className="border-b border-gray-200 bg-gray-50">

    <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
      SL.No
    </th>

    <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
      Name
    </th>

    <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
      Email
    </th>

    <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
      Phone Number
    </th>

    <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
      Status
    </th>

    <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
      Created At
    </th>

    <th className="px-5 py-3 text-center text-[12px] font-semibold text-gray-600">
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
                  Loading Contractor users...
                </td>
              </tr>
            )}

            {!loading &&
  filteredContractors.map((user, index) => (

    <tr
      key={user.id}
      className="border-b border-gray-100 hover:bg-gray-50 transition"
    >

      {/* SL.No */}
      <td className="px-5 py-4 text-[13px]">
        {index + 1}
      </td>

      {/* Name */}
      <td className="px-5 py-4">
        <div className="font-medium text-[13px] text-gray-900">
          {user.full_name}
        </div>
      </td>

      {/* Email */}
      <td className="px-5 py-4 text-[13px] text-gray-600">
        {user.email}
      </td>

      {/* Phone Number */}
      <td className="px-5 py-4 text-[13px] text-gray-600">
        {user.phone_number || "-"}
      </td>

      {/* Status */}
      <td className="px-5 py-4">

        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-medium text-green-700">
          {user.status}
        </span>

      </td>

      {/* Created At */}
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

      {/* Actions */}
      <td className="px-5 py-4">

        <div className="flex items-center justify-center gap-3">

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

            {!loading && filteredContractors.length === 0 && (

              <tr>

                <td
                  colSpan="7"
                  className="px-5 py-10 text-center text-[13px] text-gray-500"
                >
                  No contractor users found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="flex items-center justify-between px-5 py-3 text-[12px] text-gray-500 border-t border-gray-100">

        <span>
          Showing {filteredContractors.length} of{" "}
          {contractorUsers.length} users
        </span>

        <div className="flex items-center gap-4">

          <span>
            Rows per page: 10
          </span>

          <div className="flex items-center gap-2">

            <button
              type="button"
              className="w-7 h-7 rounded border border-gray-200 hover:bg-gray-100"
            >
              ←
            </button>

            <button
              type="button"
              className="w-7 h-7 rounded border border-gray-200 hover:bg-gray-100"
            >
              →
            </button>

          </div>

        </div>

      </div>

      {/* Add Contractor */}

      <AddUserModal
        open={showAddContractorModal}
        onClose={() => setShowAddContractorModal(false)}
        title="Add Contractor"
        role="ADMIN_LAYER_2"
        onSuccess={handleContractorCreated}
      />

      {/* Edit Contractor */}

      <EditUserModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        title="Edit Contractor"
        onSuccess={handleUserUpdated}
      />

      {/* Delete Contractor */}

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

export default ContractorUsers;