import React, { useMemo, useState } from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../i18n";

const ROWS_PER_PAGE = 10;

const UserTable = ({ users = [] }) => {
  const { t } = useLanguage();

  const [currentPage, setCurrentPage] = useState(1);

  /* ============================================================
     SAFE USERS ARRAY
  ============================================================ */

  const safeUsers = Array.isArray(users) ? users : [];

  /* ============================================================
     PAGINATION
  ============================================================ */

  const totalUsers = safeUsers.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalUsers / ROWS_PER_PAGE)
  );

  /*
   * Make sure current page never goes outside the
   * available page range.
   */
  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * ROWS_PER_PAGE;

  const endIndex =
    startIndex + ROWS_PER_PAGE;

  const paginatedUsers = useMemo(() => {
    return safeUsers.slice(
      startIndex,
      endIndex
    );
  }, [
    safeUsers,
    startIndex,
    endIndex,
  ]);

  /* ============================================================
     PAGINATION HANDLERS
  ============================================================ */

  const goToPreviousPage = () => {
    setCurrentPage((page) =>
      Math.max(1, page - 1)
    );
  };

  const goToNextPage = () => {
    setCurrentPage((page) =>
      Math.min(totalPages, page + 1)
    );
  };

  /* ============================================================
     SHOWING RANGE
  ============================================================ */

  const showingStart =
    totalUsers === 0
      ? 0
      : startIndex + 1;

  const showingEnd =
    Math.min(
      endIndex,
      totalUsers
    );

  /* ============================================================
     STATUS LABEL
  ============================================================ */

  const getStatusLabel = (status) => {
    const normalized = String(
      status || ""
    )
      .trim()
      .toUpperCase();

    if (normalized === "ACTIVE") {
      return t(
        "users.table.active",
        "Active"
      );
    }

    if (normalized === "INACTIVE") {
      return t(
        "users.table.inactive",
        "Inactive"
      );
    }

    return status || "—";
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="w-full">

      {/* ========================================================
          TABLE
      ======================================================== */}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[850px]">

          {/* ====================================================
              HEADER
          ==================================================== */}

          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
                {t(
                  "users.table.name",
                  "Name"
                )}
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
                {t(
                  "users.table.email",
                  "Email"
                )}
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
                {t(
                  "users.table.role",
                  "Role"
                )}
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
                {t(
                  "users.table.lastLogin",
                  "Last Login"
                )}
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
                {t(
                  "users.table.status",
                  "Status"
                )}
              </th>

              <th className="px-5 py-3 text-center text-[12px] font-semibold text-gray-600">
                {t(
                  "users.table.actions",
                  "Actions"
                )}
              </th>

            </tr>
          </thead>

          {/* ====================================================
              BODY
          ==================================================== */}

          <tbody>

            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => {

                const isActive =
                  String(
                    user?.status || ""
                  )
                    .trim()
                    .toUpperCase() ===
                  "ACTIVE";

                return (
                  <tr
                    key={user.id}
                    className="
                      border-b
                      border-gray-100
                      transition
                      hover:bg-gray-50
                    "
                  >

                    {/* NAME */}

                    <td className="px-5 py-4">
                      <div className="font-medium text-[13px] text-gray-900">
                        {user.name || "—"}
                      </div>
                    </td>

                    {/* EMAIL */}

                    <td className="px-5 py-4 text-[13px] text-gray-600">
                      {user.email || "—"}
                    </td>

                    {/* ROLE */}

                    <td className="px-5 py-4 text-[13px] text-gray-600">
                      {user.role || "—"}
                    </td>

                    {/* LAST LOGIN */}

                    <td className="px-5 py-4 text-[13px] text-gray-600">
                      {user.lastLogin || "—"}
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <span
                        className={`
                          inline-flex
                          items-center
                          rounded-full
                          px-2.5
                          py-1
                          text-[11px]
                          font-medium
                          ${
                            isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {getStatusLabel(
                          user.status
                        )}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">

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
                            text-gray-500
                            transition
                            hover:text-violet-600
                          "
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

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
                            text-gray-500
                            transition
                            hover:text-red-600
                          "
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (

              /* =================================================
                 EMPTY STATE
              ================================================= */

              <tr>
                <td
                  colSpan={6}
                  className="
                    px-5
                    py-10
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

      {/* ========================================================
          FOOTER / PAGINATION
      ======================================================== */}

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
          text-gray-500

          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-5
        "
      >

        {/* SHOWING */}

        <span>
          {t(
            "users.table.showing",
            "Showing"
          )}{" "}

          {showingStart}–{showingEnd}{" "}

          {t(
            "users.table.of",
            "of"
          )}{" "}

          {totalUsers}{" "}

          {t(
            "users.table.users",
            "users"
          )}
        </span>

        {/* PAGINATION CONTROLS */}

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

          <span className="whitespace-nowrap">
            {t(
              "users.table.rowsPerPage",
              "Rows per page"
            )}:{" "}
            {ROWS_PER_PAGE}
          </span>

          {/* PAGE CONTROLS */}

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={
                safeCurrentPage === 1
              }
              aria-label={t(
                "users.table.previousPage",
                "Previous page"
              )}
              title={t(
                "users.table.previousPage",
                "Previous page"
              )}
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded
                border
                border-gray-200
                bg-white
                transition
                hover:bg-gray-100
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <ChevronLeft
                className="h-4 w-4"
              />
            </button>

            <span className="min-w-[60px] text-center text-[12px]">
              {safeCurrentPage}{" "}
              {t(
                "users.table.ofPage",
                "of"
              )}{" "}
              {totalPages}
            </span>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={
                safeCurrentPage ===
                totalPages
              }
              aria-label={t(
                "users.table.nextPage",
                "Next page"
              )}
              title={t(
                "users.table.nextPage",
                "Next page"
              )}
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded
                border
                border-gray-200
                bg-white
                transition
                hover:bg-gray-100
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <ChevronRight
                className="h-4 w-4"
              />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UserTable;