import React, { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

import api from "../../api/axios";
import { useLanguage } from "../../i18n";

const AdminUsers = () => {
  const { t } = useLanguage();

  // =========================================================
  // MODAL STATE
  // =========================================================

  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  // =========================================================
  // DATA STATE
  // =========================================================

  const [adminUsers, setAdminUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // PAGINATION
  // Fixed 10 users per page
  // No rows-per-page dropdown
  // =========================================================

  const ROWS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  // =========================================================
  // FETCH ADMIN LEVEL 1 USERS
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

      setAdminUsers(Array.isArray(users) ? users : []);
    } catch (err) {
      console.error("Fetch Admin Layer 1 users error:", err);

      /*
       * IMPORTANT:
       * Do NOT display the backend message directly.
       *
       * Backend may return a message in another language.
       * Always use the frontend translation here.
       */
      setError(
        t(
          "users.admin.errors.fetchFailed",
          "Failed to fetch Admin Level 1 users."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    fetchAdmins();
  }, []);

  // =========================================================
  // CREATE ADMIN
  // =========================================================

  const handleAdminCreated = () => {
    setShowAddAdminModal(false);
    setCurrentPage(1);

    fetchAdmins();
  };

  // =========================================================
  // EDIT ADMIN
  // =========================================================

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUserUpdated = () => {
    setShowEditModal(false);
    setSelectedUser(null);

    fetchAdmins();
  };

  // =========================================================
  // DELETE ADMIN
  // =========================================================

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUserDeleted = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);

    fetchAdmins();
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredAdmins = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return adminUsers;
    }

    return adminUsers.filter((user) => {
      return (
        String(user?.full_name || "")
          .toLowerCase()
          .includes(value) ||
        String(user?.email || "")
          .toLowerCase()
          .includes(value) ||
        String(user?.phone_number || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [adminUsers, search]);

  // =========================================================
  // RESET PAGINATION WHEN SEARCH CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // =========================================================
  // PAGINATION CALCULATIONS
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAdmins.length / ROWS_PER_PAGE)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;

  const paginatedAdmins = filteredAdmins.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  );

  const showingFrom =
    filteredAdmins.length === 0 ? 0 : startIndex + 1;

  const showingTo = Math.min(
    startIndex + ROWS_PER_PAGE,
    filteredAdmins.length
  );

  // =========================================================
  // STATUS TRANSLATION
  // =========================================================

  const translateStatus = (status) => {
    if (!status) {
      return "-";
    }

    const normalizedStatus = String(status)
      .trim()
      .toLowerCase();

    switch (normalizedStatus) {
      case "active":
        return t(
          "users.table.active",
          "Active"
        );

      case "inactive":
        return t(
          "users.table.inactive",
          "Inactive"
        );

      case "pending":
        return t(
          "users.table.pending",
          "Pending"
        );

      case "blocked":
        return t(
          "users.table.blocked",
          "Blocked"
        );

      default:
        return status;
    }
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatCreatedAt = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          border-b
          border-gray-100
          px-4
          py-4
          sm:px-5
          sm:py-5
        "
      >
        {/* TITLE */}

        <div className="flex min-w-0 items-start gap-3">
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-violet-100
            "
          >
            <ShieldCheck className="h-4 w-4 text-violet-600" />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              className="
                text-[15px]
                font-semibold
                leading-5
                text-gray-900
                sm:text-[16px]
              "
            >
              {t(
                "users.admin.title",
                "Admin Level 1 Users"
              )}
            </h2>

            <p
              className="
                mt-1
                max-w-2xl
                text-[11px]
                leading-4
                text-gray-500
                sm:text-[12px]
                sm:leading-5
              "
            >
              {t(
                "users.admin.description",
                "Manage other Admin Level 1 users who have full access to the system."
              )}
            </p>
          </div>
        </div>

        {/* SEARCH + ADD */}

        <div
          className="
            mt-4
            flex
            w-full
            flex-col
            gap-2.5
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:gap-3
          "
        >
          {/* SEARCH */}

          <div
            className="
              relative
              w-full
              sm:max-w-[360px]
              md:w-[340px]
              md:max-w-none
            "
          >
            <Search
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-violet-600
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t(
                "users.admin.searchPlaceholder",
                "Search by name, email or phone..."
              )}
              className="
                h-10
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                pl-4
                pr-10
                text-[12px]
                text-gray-700
                outline-none
                transition
                placeholder:text-gray-400
                hover:border-gray-300
                focus:border-violet-400
                focus:ring-2
                focus:ring-violet-100
                sm:text-[13px]
              "
            />
          </div>

          {/* ADD ADMIN */}

          <button
            type="button"
            onClick={() => setShowAddAdminModal(true)}
            className="
              flex
              h-10
              w-full
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-violet-600
              px-4
              text-[12px]
              font-medium
              text-violet-700
              transition
              hover:bg-violet-600
              hover:text-white
              active:scale-[0.98]
              sm:w-auto
              sm:min-w-[120px]
              sm:text-[13px]
            "
          >
            <Plus className="h-4 w-4 shrink-0" />

            <span>
              {t(
                "users.admin.addButton",
                "Add Admin"
              )}
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          className="
            mx-4
            mt-4
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-[12px]
            text-red-600
            sm:mx-5
            sm:text-[13px]
          "
        >
          {error}
        </div>
      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          {/* TABLE HEADER */}

          <thead className="bg-[#F7F5FF]">
            <tr>
              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:text-[12px]
                "
              >
                {t(
                  "users.table.slNo",
                  "SL.No"
                )}
              </th>

              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:text-[12px]
                "
              >
                {t(
                  "users.table.adminName",
                  "Admin Name"
                )}
              </th>

              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:text-[12px]
                "
              >
                {t(
                  "users.table.email",
                  "Email"
                )}
              </th>

              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:text-[12px]
                "
              >
                {t(
                  "users.table.phoneNumber",
                  "Phone Number"
                )}
              </th>

              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:text-[12px]
                "
              >
                {t(
                  "users.table.status",
                  "Status"
                )}
              </th>

              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:text-[12px]
                "
              >
                {t(
                  "users.table.createdAt",
                  "Created At"
                )}
              </th>

              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-3
                  text-center
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:text-[12px]
                "
              >
                {t(
                  "users.table.actions",
                  "Actions"
                )}
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}

          <tbody>
            {/* LOADING */}

            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="
                    px-5
                    py-10
                    text-center
                    text-[12px]
                    text-gray-500
                    sm:text-[13px]
                  "
                >
                  {t(
                    "users.admin.loading",
                    "Loading Admin Level 1 users..."
                  )}
                </td>
              </tr>
            )}

            {/* DATA */}

            {!loading &&
              paginatedAdmins.map((user, index) => (
                <tr
                  key={user.id}
                  className="
                    border-b
                    border-gray-100
                    transition
                    hover:bg-gray-50
                  "
                >
                  {/* SL.NO */}

                  <td
                    className="
                      whitespace-nowrap
                      px-5
                      py-4
                      text-[12px]
                      text-gray-900
                      sm:text-[13px]
                    "
                  >
                    {startIndex + index + 1}
                  </td>

                  {/* NAME */}

                  <td
                    className="
                      whitespace-nowrap
                      px-5
                      py-4
                      text-[12px]
                      font-medium
                      text-gray-900
                      sm:text-[13px]
                    "
                  >
                    {user.full_name || "-"}
                  </td>

                  {/* EMAIL */}

                  <td
                    className="
                      whitespace-nowrap
                      px-5
                      py-4
                      text-[12px]
                      text-gray-600
                      sm:text-[13px]
                    "
                  >
                    {user.email || "-"}
                  </td>

                  {/* PHONE */}

                  <td
                    className="
                      whitespace-nowrap
                      px-5
                      py-4
                      text-[12px]
                      text-gray-600
                      sm:text-[13px]
                    "
                  >
                    {user.phone_number || "-"}
                  </td>

                  {/* STATUS */}

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-md
                        bg-green-100
                        px-2.5
                        py-1
                        text-[10px]
                        font-medium
                        text-green-700
                        sm:text-[11px]
                      "
                    >
                      {translateStatus(user.status)}
                    </span>
                  </td>

                  {/* CREATED */}

                  <td
                    className="
                      whitespace-nowrap
                      px-5
                      py-4
                      text-[12px]
                      text-gray-600
                      sm:text-[13px]
                    "
                  >
                    {formatCreatedAt(user.created_at)}
                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleEditClick(user)
                        }
                        className="
                          text-violet-600
                          transition
                          hover:text-violet-800
                        "
                        title={t(
                          "users.actions.edit",
                          "Edit user"
                        )}
                        aria-label={t(
                          "users.actions.edit",
                          "Edit user"
                        )}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteClick(user)
                        }
                        className="
                          text-red-500
                          transition
                          hover:text-red-700
                        "
                        title={t(
                          "users.actions.delete",
                          "Delete user"
                        )}
                        aria-label={t(
                          "users.actions.delete",
                          "Delete user"
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {/* EMPTY */}

            {!loading &&
              filteredAdmins.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="
                      px-5
                      py-10
                      text-center
                      text-[12px]
                      text-gray-500
                      sm:text-[13px]
                    "
                  >
                    {t(
                      "users.admin.empty",
                      "No Admin Level 1 users found."
                    )}
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          FOOTER / PAGINATION
          Fixed 10 rows
          Previous / Current / Next only
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-3
          border-t
          border-gray-100
          px-4
          py-3
          text-[12px]
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-5
          sm:py-4
        "
      >
        {/* SHOWING */}

        <p className="font-medium text-violet-700">
          {t(
            "users.pagination.showing",
            "Showing"
          )}{" "}
          {showingFrom}–{showingTo}{" "}
          {t(
            "users.pagination.of",
            "of"
          )}{" "}
          {filteredAdmins.length}{" "}
          {t(
            "users.pagination.entries",
            "entries"
          )}
        </p>

        {/* PAGINATION */}

        <div className="flex items-center gap-1.5">
          {/* PREVIOUS */}

          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((page) =>
                Math.max(1, page - 1)
              );
            }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-gray-200
              bg-white
              text-gray-500
              transition
              hover:border-violet-300
              hover:text-violet-600
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            title={t(
              "users.pagination.previous",
              "Previous page"
            )}
            aria-label={t(
              "users.pagination.previous",
              "Previous page"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* CURRENT PAGE */}

          <div
            className="
              flex
              h-9
              min-w-9
              items-center
              justify-center
              rounded-lg
              bg-violet-600
              px-3
              text-[12px]
              font-medium
              text-white
            "
            aria-current="page"
          >
            {currentPage}
          </div>

          {/* NEXT */}

          <button
            type="button"
            disabled={
              currentPage >= totalPages
            }
            onClick={() => {
              setCurrentPage((page) =>
                Math.min(
                  totalPages,
                  page + 1
                )
              );
            }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-gray-200
              bg-white
              text-gray-500
              transition
              hover:border-violet-300
              hover:text-violet-600
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            title={t(
              "users.pagination.next",
              "Next page"
            )}
            aria-label={t(
              "users.pagination.next",
              "Next page"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* =====================================================
          ADD ADMIN MODAL
      ===================================================== */}

      <AddUserModal
        open={showAddAdminModal}
        onClose={() =>
          setShowAddAdminModal(false)
        }
        title={t(
          "users.admin.modals.addTitle",
          "Add Admin"
        )}
        role="ADMIN_LAYER_1"
        onSuccess={handleAdminCreated}
      />

      {/* =====================================================
          EDIT ADMIN MODAL
      ===================================================== */}

      <EditUserModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        title={t(
          "users.admin.modals.editTitle",
          "Edit Admin"
        )}
        onSuccess={handleUserUpdated}
      />

      {/* =====================================================
          DELETE ADMIN MODAL
      ===================================================== */}

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