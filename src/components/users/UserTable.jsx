import React, { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useLanguage } from "../../i18n";

/* ============================================================
   CONSTANTS
============================================================ */

const ROWS_PER_PAGE = 10;

/* ============================================================
   USER TABLE
============================================================ */

const UserTable = ({ users = [] }) => {
  const { t } = useLanguage();

  /* ==========================================================
     STATE
  ========================================================== */

  const [currentPage, setCurrentPage] = useState(1);

  /* ==========================================================
     SAFE USERS
  ========================================================== */

  const safeUsers = Array.isArray(users)
    ? users
    : [];

  /* ==========================================================
     PAGINATION CALCULATIONS
  ========================================================== */

  const totalUsers = safeUsers.length;

  const totalPages =
    totalUsers === 0
      ? 1
      : Math.ceil(
          totalUsers / ROWS_PER_PAGE
        );

  /*
   * If the user list changes because of search/filtering,
   * make sure we never stay on a page that no longer exists.
   */

  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(
        Math.max(page, 1),
        totalPages
      )
    );
  }, [totalPages]);

  /* ==========================================================
     CURRENT PAGE RANGE
  ========================================================== */

  const startIndex =
    (currentPage - 1) *
    ROWS_PER_PAGE;

  const endIndex =
    startIndex + ROWS_PER_PAGE;

  const paginatedUsers =
    safeUsers.slice(
      startIndex,
      endIndex
    );

  /* ==========================================================
     DISPLAY RANGE
  ========================================================== */

  const showingStart =
    totalUsers === 0
      ? 0
      : startIndex + 1;

  const showingEnd =
    totalUsers === 0
      ? 0
      : Math.min(
          endIndex,
          totalUsers
        );

  /* ==========================================================
     PAGINATION HANDLERS
  ========================================================== */

  const handlePreviousPage = () => {
    setCurrentPage((page) =>
      Math.max(1, page - 1)
    );
  };

  const handleNextPage = () => {
    setCurrentPage((page) =>
      Math.min(
        totalPages,
        page + 1
      )
    );
  };

  /* ==========================================================
     STATUS LABEL
  ========================================================== */

  const getStatusLabel = (status) => {
    const normalizedStatus =
      String(status || "")
        .trim()
        .toUpperCase();

    if (
      normalizedStatus ===
      "ACTIVE"
    ) {
      return t(
        "users.table.active",
        "Active"
      );
    }

    if (
      normalizedStatus ===
      "INACTIVE"
    ) {
      return t(
        "users.table.inactive",
        "Inactive"
      );
    }

    return (
      status ||
      "—"
    );
  };

  /* ==========================================================
     STATUS STYLE
  ========================================================== */

  const getStatusClass = (status) => {
    const normalizedStatus =
      String(status || "")
        .trim()
        .toUpperCase();

    if (
      normalizedStatus ===
      "ACTIVE"
    ) {
      return `
        bg-green-100
        text-green-700
      `;
    }

    if (
      normalizedStatus ===
      "INACTIVE"
    ) {
      return `
        bg-red-100
        text-red-700
      `;
    }

    return `
      bg-gray-100
      text-gray-600
    `;
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="w-full min-w-0">

      {/* ======================================================
          TABLE WRAPPER

          Important:
          On smaller screens the table scrolls horizontally
          instead of breaking the entire Users page.
      ====================================================== */}

      <div
        className="
          w-full
          min-w-0
          overflow-x-auto
          overscroll-x-contain
        "
      >
        <table
          className="
            w-full
            min-w-[820px]
            border-collapse
          "
        >

          {/* ==================================================
              TABLE HEADER
          ================================================== */}

          <thead>
            <tr
              className="
                border-b
                border-gray-200
                bg-gray-50
              "
            >

              {/* NAME */}

              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-3
                  text-left
                  text-[12px]
                  font-semibold
                  text-gray-600
                "
              >
                {t(
                  "users.table.name",
                  "Name"
                )}
              </th>

              {/* EMAIL */}

              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-3
                  text-left
                  text-[12px]
                  font-semibold
                  text-gray-600
                "
              >
                {t(
                  "users.table.email",
                  "Email"
                )}
              </th>

              {/* ROLE */}

              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-3
                  text-left
                  text-[12px]
                  font-semibold
                  text-gray-600
                "
              >
                {t(
                  "users.table.role",
                  "Role"
                )}
              </th>

              {/* LAST LOGIN */}

              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-3
                  text-left
                  text-[12px]
                  font-semibold
                  text-gray-600
                "
              >
                {t(
                  "users.table.lastLogin",
                  "Last Login"
                )}
              </th>

              {/* STATUS */}

              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-3
                  text-left
                  text-[12px]
                  font-semibold
                  text-gray-600
                "
              >
                {t(
                  "users.table.status",
                  "Status"
                )}
              </th>

              {/* ACTIONS */}

              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-3
                  text-center
                  text-[12px]
                  font-semibold
                  text-gray-600
                "
              >
                {t(
                  "users.table.actions",
                  "Actions"
                )}
              </th>

            </tr>
          </thead>

          {/* ==================================================
              TABLE BODY
          ================================================== */}

          <tbody>

            {paginatedUsers.length > 0 ? (
              paginatedUsers.map(
                (user, index) => (
                  <tr
                    key={
                      user?.id ??
                      `user-${startIndex + index}`
                    }
                    className="
                      border-b
                      border-gray-100
                      transition
                      hover:bg-gray-50
                    "
                  >

                    {/* NAME */}

                    <td
                      className="
                        whitespace-nowrap
                        px-5
                        py-4
                        text-[13px]
                      "
                    >
                      <div
                        className="
                          font-medium
                          text-gray-900
                        "
                      >
                        {user?.name || "—"}
                      </div>
                    </td>

                    {/* EMAIL */}

                    <td
                      className="
                        whitespace-nowrap
                        px-5
                        py-4
                        text-[13px]
                        text-gray-600
                      "
                    >
                      {user?.email || "—"}
                    </td>

                    {/* ROLE */}

                    <td
                      className="
                        whitespace-nowrap
                        px-5
                        py-4
                        text-[13px]
                        text-gray-600
                      "
                    >
                      {user?.role || "—"}
                    </td>

                    {/* LAST LOGIN */}

                    <td
                      className="
                        whitespace-nowrap
                        px-5
                        py-4
                        text-[13px]
                        text-gray-600
                      "
                    >
                      {user?.lastLogin || "—"}
                    </td>

                    {/* STATUS */}

                    <td
                      className="
                        whitespace-nowrap
                        px-5
                        py-4
                      "
                    >
                      <span
                        className={`
                          inline-flex
                          items-center
                          rounded-full
                          px-2.5
                          py-1
                          text-[11px]
                          font-medium
                          ${getStatusClass(
                            user?.status
                          )}
                        `}
                      >
                        {getStatusLabel(
                          user?.status
                        )}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td
                      className="
                        whitespace-nowrap
                        px-5
                        py-4
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
                          title={t(
                            "users.table.edit",
                            "Edit"
                          )}
                          aria-label={t(
                            "users.table.edit",
                            "Edit"
                          )}
                          className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-md
                            text-gray-500
                            transition
                            hover:bg-violet-50
                            hover:text-violet-600
                          "
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
                          title={t(
                            "users.table.delete",
                            "Delete"
                          )}
                          aria-label={t(
                            "users.table.delete",
                            "Delete"
                          )}
                          className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-md
                            text-gray-500
                            transition
                            hover:bg-red-50
                            hover:text-red-600
                          "
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
                )
              )
            ) : (

              /* =================================================
                 EMPTY STATE
              ================================================= */

              <tr>
                <td
                  colSpan={6}
                  className="
                    px-5
                    py-12
                    text-center
                    text-[13px]
                    text-gray-500
                  "
                >
                  {t(
                    "users.table.noUsers",
                    "No users found"
                  )}
                </td>
              </tr>

            )}

          </tbody>

        </table>
      </div>

      {/* ======================================================
          PAGINATION FOOTER
      ====================================================== */}

      <div
        className="
          flex
          w-full
          flex-col
          gap-3
          border-t
          border-gray-100
          px-4
          py-3
          text-[12px]
          text-gray-500

          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-5
        "
      >

        {/* ====================================================
            SHOWING COUNT
        ==================================================== */}

        <div
          className="
            whitespace-nowrap
          "
        >
          {t(
            "users.table.showing",
            "Showing"
          )}{" "}

          {showingStart}
          {"–"}
          {showingEnd}{" "}

          {t(
            "users.table.of",
            "of"
          )}{" "}

          {totalUsers}{" "}

          {t(
            "users.table.users",
            "users"
          )}
        </div>

        {/* ====================================================
            RIGHT SIDE PAGINATION
        ==================================================== */}

        <div
          className="
            flex
            w-full
            flex-col
            gap-3

            sm:w-auto
            sm:flex-row
            sm:items-center
            sm:gap-4
          "
        >

          {/* ROWS PER PAGE */}

          <div
            className="
              whitespace-nowrap
            "
          >
            {t(
              "users.table.rowsPerPage",
              "Rows per page"
            )}
            :{" "}
            {ROWS_PER_PAGE}
          </div>

          {/* PAGE NAVIGATION */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            {/* PREVIOUS */}

            <button
              type="button"
              onClick={
                handlePreviousPage
              }
              disabled={
                currentPage === 1
              }
              title={t(
                "users.table.previousPage",
                "Previous page"
              )}
              aria-label={t(
                "users.table.previousPage",
                "Previous page"
              )}
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
                hover:bg-gray-100
                hover:text-gray-900
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <ChevronLeft
                className="
                  h-4
                  w-4
                "
              />
            </button>

            {/* PAGE NUMBER */}

            <span
              className="
                min-w-[58px]
                text-center
                text-[12px]
                font-medium
                text-gray-600
              "
            >
              {currentPage}{" "}
              {t(
                "users.table.ofPage",
                "of"
              )}{" "}
              {totalPages}
            </span>

            {/* NEXT */}

            <button
              type="button"
              onClick={
                handleNextPage
              }
              disabled={
                currentPage >=
                totalPages
              }
              title={t(
                "users.table.nextPage",
                "Next page"
              )}
              aria-label={t(
                "users.table.nextPage",
                "Next page"
              )}
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
                hover:bg-gray-100
                hover:text-gray-900
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
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

    </div>
  );
};

export default UserTable;