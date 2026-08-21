import React, { useCallback, useEffect, useState } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

import AddUserModal from "./AddUserModal";
import api from "../../api/axios";

const AdminUsers = () => {
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  const [adminUsers, setAdminUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/users", {
        params: {
          type: "ADMIN_LAYER_1",
          search: search.trim(),
          page,
          limit,
        },
      });

      const data = response?.data;

      setAdminUsers(data?.users || []);

      setTotal(Number(data?.total || 0));

      setTotalPages(Number(data?.totalPages || 0));
    } catch (err) {
      console.error("Failed to fetch Admin Layer 1 users:", err);

      setAdminUsers([]);

      setTotal(0);

      setTotalPages(0);

      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to load Admin Layer 1 users."
      );
    } finally {
      setLoading(false);
    }
  }, [search, page, limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdmins();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchAdmins]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const formatCreatedAt = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAdminCreated = async () => {
    setShowAddAdminModal(false);

    setPage(1);

    await fetchAdmins();
  };

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
              onChange={handleSearchChange}
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

            {loading ? (

              <tr>
                <td
                  colSpan="7"
                  className="px-5 py-12 text-center text-[13px] text-gray-500"
                >
                  Loading Admin Layer 1 users...
                </td>
              </tr>

            ) : adminUsers.length === 0 ? (

              <tr>
                <td
                  colSpan="7"
                  className="px-5 py-12 text-center text-[13px] text-gray-500"
                >
                  {search.trim()
                    ? "No Admin Layer 1 users match your search."
                    : "No Admin Layer 1 users found."}
                </td>
              </tr>

            ) : (

              adminUsers.map((user, index) => (

                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >

                  <td className="px-5 py-4 text-[13px]">
                    {(page - 1) * limit + index + 1}
                  </td>

                  <td className="px-5 py-4 text-[13px] font-medium">
                    {user.full_name || "-"}
                  </td>

                  <td className="px-5 py-4 text-[13px] text-gray-600">
                    {user.email || "-"}
                  </td>

                  <td className="px-5 py-4 text-[13px] text-gray-600">
                    {user.phone_number || "-"}
                  </td>

                  <td className="px-5 py-4">

                    <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-[11px] font-medium">
                      {user.status || "-"}
                    </span>

                  </td>

                  <td className="px-5 py-4 text-[13px] text-gray-600">
                    {formatCreatedAt(user.created_at)}
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-center items-center gap-4">

                      <button
                        type="button"
                        className="text-violet-600 hover:text-violet-800"
                        disabled
                        title="Edit will be wired next"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        disabled
                        title="Delete will be wired next"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 text-[12px]">

        <p className="text-violet-700 font-medium">

          {total === 0
            ? "Showing 0 entries"
            : `Showing ${
                (page - 1) * limit + 1
              } to ${Math.min(page * limit, total)} of ${total} entries`}

        </p>

        <div className="flex items-center gap-4">

          <div className="flex items-center gap-2">

            <span className="text-gray-600">
              Rows per page:
            </span>

            <select
              value={limit}
              onChange={handleLimitChange}
              className="h-8 rounded-md border border-gray-200 px-2 text-[12px] outline-none"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>

          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => prev - 1)}
              className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ←
            </button>

            <span className="text-gray-600 min-w-[60px] text-center">
              {totalPages === 0
                ? "0 / 0"
                : `${page} / ${totalPages}`}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((prev) => prev + 1)}
              className="w-8 h-8 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              →
            </button>

          </div>

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

    </div>
  );
};

export default AdminUsers;