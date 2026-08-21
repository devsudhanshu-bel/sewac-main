import React, { useCallback, useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

import AddUserModal from "./AddUserModal";
import api from "../../api/axios";

const ContractorUsers = () => {
  const [showAddContractorModal, setShowAddContractorModal] =
    useState(false);

  const [contractorUsers, setContractorUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const fetchContractors = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/users", {
        params: {
          type: "ADMIN_LAYER_2",
          search: search.trim(),
          page,
          limit,
        },
      });

      const data = response?.data;

      setContractorUsers(data?.users || []);

      setTotal(Number(data?.total || 0));

      setTotalPages(Number(data?.totalPages || 0));
    } catch (err) {
      console.error("Failed to fetch Contractor users:", err);

      setContractorUsers([]);

      setTotal(0);

      setTotalPages(0);

      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to load Contractor users."
      );
    } finally {
      setLoading(false);
    }
  }, [search, page, limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContractors();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchContractors]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const handleContractorCreated = async () => {
    setShowAddContractorModal(false);

    setPage(1);

    await fetchContractors();
  };

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
              onChange={handleSearchChange}
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
                Name
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
                Email
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
                Role
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
                Last Login
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
                Status
              </th>

              <th className="px-5 py-3 text-center text-[12px] font-semibold text-gray-600">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="6"
                  className="px-5 py-12 text-center text-[13px] text-gray-500"
                >
                  Loading Contractor users...
                </td>
              </tr>

            ) : contractorUsers.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="px-5 py-12 text-center text-[13px] text-gray-500"
                >
                  {search.trim()
                    ? "No Contractor users match your search."
                    : "No Contractor users found."}
                </td>
              </tr>

            ) : (

              contractorUsers.map((user) => (

                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >

                  <td className="px-5 py-4">

                    <div className="font-medium text-[13px] text-gray-900">
                      {user.full_name || "-"}
                    </div>

                  </td>

                  <td className="px-5 py-4 text-[13px] text-gray-600">
                    {user.email || "-"}
                  </td>

                  <td className="px-5 py-4 text-[13px] text-gray-600">
                    Contractor
                  </td>

                  <td className="px-5 py-4 text-[13px] text-gray-600">
                    Never
                  </td>

                  <td className="px-5 py-4">

                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-medium text-green-700">
                      {user.status || "-"}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center justify-center gap-3">

                      <button
                        type="button"
                        className="text-gray-500 hover:text-violet-600 transition"
                        disabled
                        title="Edit will be wired next"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        className="text-gray-500 hover:text-red-600 transition"
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

      <div className="flex items-center justify-between px-5 py-3 text-[12px] text-gray-500 border-t border-gray-100">

        <span>

          {total === 0
            ? "Showing 0 users"
            : `Showing ${
                (page - 1) * limit + 1
              }–${Math.min(page * limit, total)} of ${total} users`}

        </span>

        <div className="flex items-center gap-4">

          <div className="flex items-center gap-2">

            <span>
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
              className="w-7 h-7 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ←
            </button>

            <span className="min-w-[55px] text-center">
              {totalPages === 0
                ? "0 / 0"
                : `${page} / ${totalPages}`}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((prev) => prev + 1)}
              className="w-7 h-7 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
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

    </div>
  );
};

export default ContractorUsers;