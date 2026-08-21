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

  const [showAddAdminModal, setShowAddAdminModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState(null);

  // =========================================================
  // DATA STATE
  // =========================================================

  const [adminUsers, setAdminUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  // =========================================================
  // FETCH ADMIN LAYER 1 USERS
  // =========================================================

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/users",
        {
          params: {
            type: "ADMIN_LAYER_1",
          },
        }
      );

      const users =
        response?.data?.users || [];

      setAdminUsers(users);
    } catch (err) {
      console.error(
        "Fetch Admin Layer 1 users error:",
        err
      );

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        t(
          "users.admin.errors.fetchFailed",
          "Failed to fetch Admin Level 1 users."
        );

      setError(backendMessage);
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
  // SEARCH
  // =========================================================

  const filteredAdmins = useMemo(() => {
    const value =
      search
        .toLowerCase()
        .trim();

    if (!value) {
      return adminUsers;
    }

    return adminUsers.filter(
      (user) =>
        (user.full_name || "")
          .toLowerCase()
          .includes(value) ||
        (user.email || "")
          .toLowerCase()
          .includes(value) ||
        String(
          user.phone_number || ""
        ).includes(value)
    );
  }, [
    adminUsers,
    search,
  ]);

  // =========================================================
  // RESET PAGE WHEN SEARCH CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // =========================================================
  // PAGINATION CALCULATIONS
  // =========================================================

  const totalEntries =
    filteredAdmins.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalEntries /
          rowsPerPage
      )
    );

  // Keep current page valid
  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const paginatedAdmins =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        rowsPerPage;

      const endIndex =
        startIndex +
        rowsPerPage;

      return filteredAdmins.slice(
        startIndex,
        endIndex
      );
    }, [
      filteredAdmins,
      currentPage,
      rowsPerPage,
    ]);

  const startEntry =
    totalEntries === 0
      ? 0
      : (currentPage - 1) *
          rowsPerPage +
        1;

  const endEntry =
    Math.min(
      currentPage *
        rowsPerPage,
      totalEntries
    );

  // =========================================================
  // CREATE
  // =========================================================

  const handleAdminCreated = () => {
    setShowAddAdminModal(
      false
    );

    setCurrentPage(1);

    fetchAdmins();
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEditClick = (
    user
  ) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUserUpdated = () => {
    setShowEditModal(false);
    setSelectedUser(null);

    fetchAdmins();
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDeleteClick = (
    user
  ) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUserDeleted = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);

    fetchAdmins();
  };

  // =========================================================
  // PAGE CONTROLS
  // =========================================================

  const goToPreviousPage = () => {
    setCurrentPage(
      (previous) =>
        Math.max(
          1,
          previous - 1
        )
    );
  };

  const goToNextPage = () => {
    setCurrentPage(
      (previous) =>
        Math.min(
          totalPages,
          previous + 1
        )
    );
  };

  const handleRowsPerPageChange = (
    event
  ) => {
    const value = Number(
      event.target.value
    );

    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // =========================================================
  // DATE FORMATTER
  // =========================================================

  const formatCreatedAt = (
    value
  ) => {
    if (!value) {
      return "-";
    }

    try {
      return new Date(
        value
      ).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "-";
    }
  };

  // =========================================================
  // STATUS LABEL
  // =========================================================

  const getStatusLabel = (
    status
  ) => {
    const normalized =
      String(
        status || ""
      )
        .trim()
        .toUpperCase();

    if (
      normalized ===
      "ACTIVE"
    ) {
      return t(
        "common.active",
        "Active"
      );
    }

    if (
      normalized ===
      "INACTIVE"
    ) {
      return t(
        "common.inactive",
        "Inactive"
      );
    }

    return (
      status ||
      t(
        "common.unknown",
        "Unknown"
      )
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section
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
        {/* ===================================================
            TITLE
        =================================================== */}

        <div
          className="
            flex
            min-w-0
            items-start
            gap-3
          "
        >
          {/* ICON */}

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
            <ShieldCheck
              className="
                h-4
                w-4
                text-violet-600
              "
            />
          </div>

          {/* TITLE + DESCRIPTION */}

          <div
            className="
              min-w-0
              flex-1
            "
          >
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
                max-w-3xl
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

        {/* ===================================================
            SEARCH + ADD BUTTON

            Mobile:
            Search
            ↓
            Add button

            Desktop:
            Search          Add Admin
        =================================================== */}

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
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
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
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-100
                sm:text-[13px]
              "
            />
          </div>

          {/* ADD BUTTON */}

          <button
            type="button"
            onClick={() =>
              setShowAddAdminModal(
                true
              )
            }
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
            <Plus
              className="
                h-4
                w-4
                shrink-0
              "
            />

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
            leading-5
            text-red-600
            sm:mx-5
          "
        >
          {error}
        </div>
      )}

      {/* =====================================================
          TABLE

          overflow-x-auto keeps the table usable on phones.
      ===================================================== */}

      <div
        className="
          w-full
          overflow-x-auto
        "
      >
        <table
          className="
            min-w-[900px]
            w-full
          "
        >
          {/* =================================================
              TABLE HEADER
          ================================================= */}

          <thead
            className="
              bg-[#F7F5FF]
            "
          >
            <tr>
              <th
                className="
                  whitespace-nowrap
                  px-4
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:px-5
                  sm:text-[12px]
                "
              >
                {t(
                  "users.admin.table.slNo",
                  "SL.No"
                )}
              </th>

              <th
                className="
                  whitespace-nowrap
                  px-4
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:px-5
                  sm:text-[12px]
                "
              >
                {t(
                  "users.admin.table.name",
                  "Admin Name"
                )}
              </th>

              <th
                className="
                  whitespace-nowrap
                  px-4
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:px-5
                  sm:text-[12px]
                "
              >
                {t(
                  "users.admin.table.email",
                  "Email"
                )}
              </th>

              <th
                className="
                  whitespace-nowrap
                  px-4
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:px-5
                  sm:text-[12px]
                "
              >
                {t(
                  "users.admin.table.phone",
                  "Phone Number"
                )}
              </th>

              <th
                className="
                  whitespace-nowrap
                  px-4
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:px-5
                  sm:text-[12px]
                "
              >
                {t(
                  "users.admin.table.status",
                  "Status"
                )}
              </th>

              <th
                className="
                  whitespace-nowrap
                  px-4
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:px-5
                  sm:text-[12px]
                "
              >
                {t(
                  "users.admin.table.createdAt",
                  "Created At"
                )}
              </th>

              <th
                className="
                  whitespace-nowrap
                  px-4
                  py-3
                  text-center
                  text-[11px]
                  font-semibold
                  text-violet-700
                  sm:px-5
                  sm:text-[12px]
                "
              >
                {t(
                  "users.admin.table.actions",
                  "Actions"
                )}
              </th>
            </tr>
          </thead>

          {/* =================================================
              TABLE BODY
          ================================================= */}

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
              paginatedAdmins.map(
                (
                  user,
                  index
                ) => {
                  const rowNumber =
                    (currentPage -
                      1) *
                      rowsPerPage +
                    index +
                    1;

                  return (
                    <tr
                      key={
                        user.id
                      }
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
                          px-4
                          py-4
                          text-[12px]
                          text-gray-700
                          sm:px-5
                          sm:text-[13px]
                        "
                      >
                        {rowNumber}
                      </td>

                      {/* NAME */}

                      <td
                        className="
                          max-w-[220px]
                          px-4
                          py-4
                          text-[12px]
                          font-medium
                          text-gray-900
                          sm:px-5
                          sm:text-[13px]
                        "
                      >
                        <span
                          className="
                            block
                            truncate
                          "
                          title={
                            user.full_name ||
                            ""
                          }
                        >
                          {user.full_name ||
                            "-"}
                        </span>
                      </td>

                      {/* EMAIL */}

                      <td
                        className="
                          max-w-[260px]
                          px-4
                          py-4
                          text-[12px]
                          text-gray-600
                          sm:px-5
                          sm:text-[13px]
                        "
                      >
                        <span
                          className="
                            block
                            truncate
                          "
                          title={
                            user.email ||
                            ""
                          }
                        >
                          {user.email ||
                            "-"}
                        </span>
                      </td>

                      {/* PHONE */}

                      <td
                        className="
                          whitespace-nowrap
                          px-4
                          py-4
                          text-[12px]
                          text-gray-600
                          sm:px-5
                          sm:text-[13px]
                        "
                      >
                        {user.phone_number ||
                          "-"}
                      </td>

                      {/* STATUS */}

                      <td
                        className="
                          whitespace-nowrap
                          px-4
                          py-4
                          sm:px-5
                        "
                      >
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
                          {getStatusLabel(
                            user.status
                          )}
                        </span>
                      </td>

                      {/* CREATED AT */}

                      <td
                        className="
                          whitespace-nowrap
                          px-4
                          py-4
                          text-[12px]
                          text-gray-600
                          sm:px-5
                          sm:text-[13px]
                        "
                      >
                        {formatCreatedAt(
                          user.created_at
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td
                        className="
                          px-4
                          py-4
                          sm:px-5
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            justify-center
                            gap-3
                          "
                        >
                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEditClick(
                                user
                              )
                            }
                            className="
                              text-violet-600
                              transition
                              hover:text-violet-800
                            "
                            title={t(
                              "users.admin.actions.edit",
                              "Edit user"
                            )}
                            aria-label={t(
                              "users.admin.actions.edit",
                              "Edit user"
                            )}
                          >
                            <Pencil
                              className="
                                h-4
                                w-4
                              "
                            />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteClick(
                                user
                              )
                            }
                            className="
                              text-red-500
                              transition
                              hover:text-red-700
                            "
                            title={t(
                              "users.admin.actions.delete",
                              "Delete user"
                            )}
                            aria-label={t(
                              "users.admin.actions.delete",
                              "Delete user"
                            )}
                          >
                            <Trash2
                              className="
                                h-4
                                w-4
                              "
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}

            {/* EMPTY */}

            {!loading &&
              paginatedAdmins.length ===
                0 && (
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
          PAGINATION FOOTER
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
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-5
          sm:py-4
        "
      >
        {/* RESULTS */}

        <p
          className="
            text-[11px]
            font-medium
            text-violet-700
            sm:text-[12px]
          "
        >
          {t(
            "users.admin.pagination.showing",
            "Showing"
          )}{" "}
          {startEntry}
          {"–"}
          {endEntry}{" "}
          {t(
            "users.admin.pagination.of",
            "of"
          )}{" "}
          {totalEntries}{" "}
          {t(
            "users.admin.pagination.entries",
            "entries"
          )}
        </p>

        {/* CONTROLS */}

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
            sm:justify-end
          "
        >
          {/* ROWS PER PAGE */}

          <div
            className="
              flex
              items-center
              gap-2
              text-[11px]
              text-gray-600
              sm:text-[12px]
            "
          >
            <span>
              {t(
                "users.admin.pagination.rowsPerPage",
                "Rows per page:"
              )}
            </span>

            <select
              value={
                rowsPerPage
              }
              onChange={
                handleRowsPerPageChange
              }
              className="
                h-8
                rounded-md
                border
                border-gray-200
                bg-white
                px-2
                text-[11px]
                outline-none
                focus:border-violet-400
                sm:text-[12px]
              "
            >
              <option value={10}>
                10
              </option>

              <option value={25}>
                25
              </option>

              <option value={50}>
                50
              </option>
            </select>
          </div>

          {/* PAGE BUTTONS */}

          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >
            <button
              type="button"
              onClick={
                goToPreviousPage
              }
              disabled={
                currentPage === 1
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-md
                border
                border-gray-200
                bg-white
                text-gray-600
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              aria-label={t(
                "users.admin.pagination.previous",
                "Previous page"
              )}
            >
              <ChevronLeft
                className="
                  h-4
                  w-4
                "
              />
            </button>

            <div
              className="
                flex
                h-8
                min-w-8
                items-center
                justify-center
                rounded-md
                bg-violet-600
                px-2
                text-[11px]
                font-medium
                text-white
              "
            >
              {currentPage}
            </div>

            <button
              type="button"
              onClick={
                goToNextPage
              }
              disabled={
                currentPage >=
                totalPages
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-md
                border
                border-gray-200
                bg-white
                text-gray-600
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              aria-label={t(
                "users.admin.pagination.next",
                "Next page"
              )}
            >
              <ChevronRight
                className="
                  h-4
                  w-4
                "
              />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          ADD ADMIN MODAL
      ===================================================== */}

      <AddUserModal
        open={
          showAddAdminModal
        }
        onClose={() =>
          setShowAddAdminModal(
            false
          )
        }
        title={t(
          "users.admin.modals.addTitle",
          "Add Admin"
        )}
        role="ADMIN_LAYER_1"
        onSuccess={
          handleAdminCreated
        }
      />

      {/* =====================================================
          EDIT ADMIN MODAL
      ===================================================== */}

      <EditUserModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(
            false
          );
          setSelectedUser(
            null
          );
        }}
        user={selectedUser}
        title={t(
          "users.admin.modals.editTitle",
          "Edit Admin"
        )}
        onSuccess={
          handleUserUpdated
        }
      />

      {/* =====================================================
          DELETE ADMIN MODAL
      ===================================================== */}

      <DeleteUserModal
        open={
          showDeleteModal
        }
        onClose={() => {
          setShowDeleteModal(
            false
          );
          setSelectedUser(
            null
          );
        }}
        user={selectedUser}
        onSuccess={
          handleUserDeleted
        }
      />
    </section>
  );
};

export default AdminUsers;