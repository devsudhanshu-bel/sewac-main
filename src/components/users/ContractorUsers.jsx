import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
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

const ContractorUsers = () => {
  const { t, language } = useLanguage();

  // =========================================================
  // MODALS
  // =========================================================

  const [showAddContractorModal, setShowAddContractorModal] =
    useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  // =========================================================
  // DATA
  // =========================================================

  const [contractorUsers, setContractorUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  // =========================================================
  // LANGUAGE
  // =========================================================

  const currentLanguage = language || "en";

  const localeMap = {
    en: "en-IN",
    kn: "kn-IN",
    hi: "hi-IN",
  };

  const dateLocale = localeMap[currentLanguage] || "en-IN";

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
        "";

      setError(
        backendMessage ||
          t(
            "users.contractor.errors.fetchFailed",
            "Failed to fetch Contractor users."
          )
      );
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
    setCurrentPage(1);

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

    fetchContractors();
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const filteredContractors = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return contractorUsers;
    }

    return contractorUsers.filter((user) => {
      return (
        (user.full_name || "").toLowerCase().includes(value) ||
        (user.email || "").toLowerCase().includes(value) ||
        (user.phone_number || "").includes(value)
      );
    });
  }, [contractorUsers, search]);

  // =========================================================
  // PAGINATION CALCULATIONS
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContractors.length / rowsPerPage)
  );

  // Prevent current page from going beyond available pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * rowsPerPage;

  const endIndex = Math.min(
    startIndex + rowsPerPage,
    filteredContractors.length
  );

  const paginatedContractors = filteredContractors.slice(
    startIndex,
    endIndex
  );

  // =========================================================
  // PAGINATION HANDLERS
  // =========================================================

  const handlePreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  // =========================================================
  // STATUS TRANSLATION
  // =========================================================

  const getTranslatedStatus = (status) => {
    const normalizedStatus = String(status || "").toUpperCase();

    if (normalizedStatus === "ACTIVE") {
      return t("users.table.active", "Active");
    }

    if (normalizedStatus === "INACTIVE") {
      return t("users.table.inactive", "Inactive");
    }

    return status || "-";
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(date).toLocaleString(dateLocale, {
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
      {/* ======================================================
          HEADER
      ====================================================== */}

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
        {/* ====================================================
            TITLE AREA
        ==================================================== */}

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
              bg-emerald-100
            "
          >
            <Building2
              className="
                h-4
                w-4
                text-emerald-600
              "
            />
          </div>

          {/* TITLE + DESCRIPTION */}

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
                "users.contractor.title",
                "Contractor Users"
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
                "users.contractor.description",
                "Manage contractor accounts and permissions."
              )}
            </p>
          </div>
        </div>

        {/* ====================================================
            SEARCH + ADD BUTTON
        ==================================================== */}

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
              md:w-72
              md:max-w-none
            "
          >
            <Search
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder={t(
                "users.contractor.searchPlaceholder",
                "Search contractors..."
              )}
              className="
                h-10
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                pl-10
                pr-3
                text-[12px]
                text-gray-700
                outline-none
                transition
                placeholder:text-gray-400
                hover:border-gray-300
                focus:border-emerald-400
                focus:ring-2
                focus:ring-emerald-100
                sm:text-[13px]
              "
            />
          </div>

          {/* ADD BUTTON */}

          <button
            type="button"
            onClick={() => setShowAddContractorModal(true)}
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
              sm:min-w-[145px]
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
                "users.contractor.addButton",
                "Add Contractor"
              )}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

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

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px]">
          {/* TABLE HEADER */}

          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th
                className="
                  px-5
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-gray-600
                  sm:text-[12px]
                "
              >
                {t("users.table.slNo", "SL.No")}
              </th>

              <th
                className="
                  px-5
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-gray-600
                  sm:text-[12px]
                "
              >
                {t("users.contractor.table.name", "Name")}
              </th>

              <th
                className="
                  px-5
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-gray-600
                  sm:text-[12px]
                "
              >
                {t("users.table.email", "Email")}
              </th>

              <th
                className="
                  px-5
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-gray-600
                  sm:text-[12px]
                "
              >
                {t("users.table.phone", "Phone Number")}
              </th>

              <th
                className="
                  px-5
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-gray-600
                  sm:text-[12px]
                "
              >
                {t("users.table.status", "Status")}
              </th>

              <th
                className="
                  px-5
                  py-3
                  text-left
                  text-[11px]
                  font-semibold
                  text-gray-600
                  sm:text-[12px]
                "
              >
                {t("users.table.createdAt", "Created At")}
              </th>

              <th
                className="
                  px-5
                  py-3
                  text-center
                  text-[11px]
                  font-semibold
                  text-gray-600
                  sm:text-[12px]
                "
              >
                {t("users.table.actions", "Actions")}
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}

          <tbody>
            {/* LOADING */}

            {loading && (
              <tr>
                <td
                  colSpan="7"
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
                    "users.contractor.loading",
                    "Loading Contractor users..."
                  )}
                </td>
              </tr>
            )}

            {/* DATA */}

            {!loading &&
              paginatedContractors.map((user, index) => (
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

                  <td className="px-5 py-4">
                    <div
                      className="
                        text-[12px]
                        font-medium
                        text-gray-900
                        sm:text-[13px]
                      "
                    >
                      {user.full_name || "-"}
                    </div>
                  </td>

                  {/* EMAIL */}

                  <td
                    className="
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

                  <td className="px-5 py-4">
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
                      {getTranslatedStatus(user.status)}
                    </span>
                  </td>

                  {/* CREATED AT */}

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
                    {formatDate(user.created_at)}
                  </td>

                  {/* ACTIONS */}

                  <td className="px-5 py-4">
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
                        onClick={() => handleEditClick(user)}
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

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() => handleDeleteClick(user)}
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
              paginatedContractors.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
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
                      "users.contractor.empty",
                      "No contractor users found."
                    )}
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* ======================================================
          FOOTER / PAGINATION
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-3
          border-t
          border-gray-100
          px-4
          py-3
          text-[11px]
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-5
          sm:py-4
          sm:text-[12px]
        "
      >
        {/* SHOWING */}

        <p className="font-medium text-violet-700">
          {filteredContractors.length === 0
            ? `${t("users.table.showing", "Showing")} 0 ${t(
                "users.table.of",
                "of"
              )} 0 ${t(
                "users.table.entries",
                "entries"
              )}`
            : `${t(
                "users.table.showing",
                "Showing"
              )} ${startIndex + 1}–${endIndex} ${t(
                "users.table.of",
                "of"
              )} ${filteredContractors.length} ${t(
                "users.table.entries",
                "entries"
              )}`}
        </p>

        {/* PAGINATION */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-1.5
          "
        >
          {/* PREVIOUS */}

          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
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
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            title={t(
              "users.table.previous",
              "Previous"
            )}
            aria-label={t(
              "users.table.previous",
              "Previous"
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
          >
            {currentPage}
          </div>

          {/* NEXT */}

          <button
            type="button"
            onClick={handleNextPage}
            disabled={
              currentPage === totalPages ||
              filteredContractors.length === 0
            }
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
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            title={t(
              "users.table.next",
              "Next"
            )}
            aria-label={t(
              "users.table.next",
              "Next"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ======================================================
          ADD CONTRACTOR MODAL
      ====================================================== */}

      <AddUserModal
        open={showAddContractorModal}
        onClose={() => setShowAddContractorModal(false)}
        title={t(
          "users.contractor.modals.addTitle",
          "Add Contractor"
        )}
        role="ADMIN_LAYER_2"
        onSuccess={handleContractorCreated}
      />

      {/* ======================================================
          EDIT CONTRACTOR MODAL
      ====================================================== */}

      <EditUserModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        title={t(
          "users.contractor.modals.editTitle",
          "Edit Contractor"
        )}
        onSuccess={handleUserUpdated}
      />

      {/* ======================================================
          DELETE CONTRACTOR MODAL
      ====================================================== */}

      <DeleteUserModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={handleUserDeleted}
      />
    </section>
  );
};

export default ContractorUsers;