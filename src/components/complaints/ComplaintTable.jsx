import {
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";

/* =========================================================
   STATUS CONFIG
========================================================= */

const statusConfig = {
  PENDING: {
    translationKey: "pending",
    className: "bg-[#FFF4D6] text-[#D99A16]",
  },

  READY_FOR_VERIFICATION: {
    translationKey: "readyForVerification",
    className: "bg-[#E7F1FF] text-[#2878D8]",
  },

  OTP_SENT: {
    translationKey: "otpSent",
    className: "bg-[#F3E8FF] text-[#7C3AED]",
  },

  IN_PROGRESS: {
    translationKey: "inProgress",
    className: "bg-[#EAF2FF] text-[#2563EB]",
  },

  ASSIGNED: {
    translationKey: "assigned",
    className: "bg-[#EEF2FF] text-[#4F46E5]",
  },

  CLOSED: {
    translationKey: "closed",
    className: "bg-[#E4F8EE] text-[#20A66A]",
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function ComplaintTable({
  complaints = [],
  loading = false,
  error = "",
  pagination = {},
  onPageChange,
  onSelectComplaint,
}) {
  const { t } = useLanguage();

  const currentPage = Number(pagination.page) || 1;
  const limit = Number(pagination.limit) || 10;
  const total = Number(pagination.total) || 0;
  const totalPages = Number(pagination.totalPages) || 0;

  const startItem =
    total === 0
      ? 0
      : (currentPage - 1) * limit + 1;

  const endItem =
    total === 0
      ? 0
      : Math.min(currentPage * limit, total);

  return (
    <div
      className="
        w-full
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-gray-100
        bg-white
        shadow-[0_6px_20px_rgba(15,23,42,0.04)]
      "
    >
      {/* =====================================================
          TABLE HEADER
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          border-b
          border-gray-100
          px-4
          py-3
          sm:px-5
        "
      >
        <div className="min-w-0">
          <h2
            className="
              truncate
              text-[13px]
              font-bold
              text-[#16295A]
              sm:text-[14px]
            "
          >
            {t(
              "complaints.table.title",
              "Complaints"
            )}
          </h2>

          <p
            className="
              mt-0.5
              text-[9px]
              text-gray-400
              sm:text-[10px]
            "
          >
            {total}{" "}
            {t(
              "complaints.table.complaint",
              "complaint"
            )}
            {total === 1 ? "" : "s"}{" "}
            {t(
              "complaints.table.found",
              "found"
            )}
          </p>
        </div>

        {loading && (
          <span
            className="
              shrink-0
              text-[9px]
              font-medium
              text-violet-500
            "
          >
            {t(
              "complaints.table.updating",
              "Updating..."
            )}
          </span>
        )}
      </div>

      {/* =====================================================
          TABLE SCROLL AREA
      ===================================================== */}

      <div
        className="
          w-full
          overflow-x-auto
          overscroll-x-contain
        "
      >
        <table
          className="
            w-full
            min-w-[900px]
            border-collapse
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <thead>
            <tr
              className="
                h-[42px]
                border-b
                border-gray-100
                bg-[#FAFBFD]
              "
            >
              {/* Ticket Number */}

              <th
                className="
                  w-[115px]
                  whitespace-nowrap
                  px-3
                  text-left
                  text-[10px]
                  font-semibold
                  text-gray-500
                "
              >
                {t(
                  "complaints.details.ticketNumber",
                  "Ticket Number"
                )}
              </th>

              {/* Category */}

              <th
                className="
                  w-[135px]
                  whitespace-nowrap
                  px-3
                  text-left
                  text-[10px]
                  font-semibold
                  text-gray-500
                "
              >
                {t(
                  "complaints.details.category",
                  "Category"
                )}
              </th>

              {/* Title */}

              <th
                className="
                  w-[160px]
                  px-3
                  text-left
                  text-[10px]
                  font-semibold
                  text-gray-500
                "
              >
                {t(
                  "complaints.details.title",
                  "Title"
                )}
              </th>

              {/* Citizen */}

              <th
                className="
                  w-[120px]
                  whitespace-nowrap
                  px-3
                  text-left
                  text-[10px]
                  font-semibold
                  text-gray-500
                "
              >
                <span className="block">
                  {t(
                    "complaints.details.citizenPhone",
                    "Citizen"
                  )}
                </span>

                <span className="block">
                  (Phone)
                </span>
              </th>

              {/* Location */}

              <th
                className="
                  w-[190px]
                  px-3
                  text-left
                  text-[10px]
                  font-semibold
                  text-gray-500
                "
              >
                {t(
                  "complaints.table.location",
                  "Location"
                )}
              </th>

              {/* Status */}

              <th
                className="
                  w-[150px]
                  whitespace-nowrap
                  px-3
                  text-left
                  text-[10px]
                  font-semibold
                  text-gray-500
                "
              >
                {t(
                  "complaints.details.status",
                  "Status"
                )}
              </th>

              {/* Created At */}

              <th
                className="
                  w-[110px]
                  whitespace-nowrap
                  px-3
                  text-left
                  text-[10px]
                  font-semibold
                  text-gray-500
                "
              >
                {t(
                  "complaints.table.createdAt",
                  "Created At"
                )}
              </th>

              {/* Action */}

              <th
                className="
                  w-[70px]
                  px-3
                  text-center
                  text-[10px]
                  font-semibold
                  text-gray-500
                "
              >
                {t(
                  "common.actions",
                  "Actions"
                )}
              </th>
            </tr>
          </thead>

          {/* =================================================
              BODY
          ================================================= */}

          <tbody>
            {/* ================= LOADING ================= */}

            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="
                    h-[180px]
                    px-4
                    text-center
                    text-[11px]
                    text-gray-500
                  "
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div
                      className="
                        h-5
                        w-5
                        animate-spin
                        rounded-full
                        border-2
                        border-violet-200
                        border-t-violet-600
                      "
                    />

                    <span>
                      {t(
                        "complaints.table.loading",
                        "Loading complaints..."
                      )}
                    </span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              /* ================= ERROR ================= */

              <tr>
                <td
                  colSpan={8}
                  className="
                    h-[180px]
                    px-4
                    text-center
                    text-[11px]
                    text-red-500
                  "
                >
                  {error}
                </td>
              </tr>
            ) : complaints.length === 0 ? (
              /* ================= EMPTY ================= */

              <tr>
                <td
                  colSpan={8}
                  className="
                    h-[180px]
                    px-4
                    text-center
                    text-[11px]
                    text-gray-500
                  "
                >
                  {t(
                    "complaints.table.empty",
                    "No complaints found."
                  )}
                </td>
              </tr>
            ) : (
              /* ================= DATA ================= */

              complaints.map((complaint) => {
                const status =
                  statusConfig[complaint.status];

                const statusLabel = status
                  ? t(
                      `complaints.details.statusOptions.${status.translationKey}`,
                      complaint.status
                    )
                  : complaint.status || "—";

                return (
                  <tr
                    key={complaint.ticket_number}
                    className="
                      min-h-[58px]
                      border-b
                      border-gray-100
                      transition-colors
                      hover:bg-[#FAF8FF]
                    "
                  >
                    {/* =====================================
                        TICKET
                    ===================================== */}

                    <td className="px-3 py-3">
                      <span
                        className="
                          whitespace-nowrap
                          text-[10px]
                          font-semibold
                          text-[#16295A]
                        "
                      >
                        {complaint.ticket_number ||
                          "—"}
                      </span>
                    </td>

                    {/* =====================================
                        CATEGORY
                    ===================================== */}

                    <td className="px-3 py-3">
                      <span
                        className="
                          inline-flex
                          max-w-[120px]
                          items-center
                          overflow-hidden
                          text-ellipsis
                          whitespace-nowrap
                          rounded-md
                          bg-gray-100
                          px-2
                          py-1
                          text-[9px]
                          font-semibold
                          text-gray-700
                        "
                        title={
                          complaint.category || ""
                        }
                      >
                        {complaint.category ||
                          "—"}
                      </span>
                    </td>

                    {/* =====================================
                        TITLE
                    ===================================== */}

                    <td className="px-3 py-3">
                      <span
                        className="
                          block
                          max-w-[145px]
                          truncate
                          text-[10px]
                          font-medium
                          leading-4
                          text-[#16295A]
                        "
                        title={
                          complaint.title || ""
                        }
                      >
                        {complaint.title || "—"}
                      </span>
                    </td>

                    {/* =====================================
                        PHONE
                    ===================================== */}

                    <td className="px-3 py-3">
                      <span
                        className="
                          whitespace-nowrap
                          text-[10px]
                          text-[#16295A]
                        "
                      >
                        {complaint.phone_number ||
                          "—"}
                      </span>
                    </td>

                    {/* =====================================
                        LOCATION
                    ===================================== */}

                    <td className="px-3 py-3">
                      <span
                        className="
                          block
                          max-w-[175px]
                          truncate
                          text-[10px]
                          text-[#16295A]
                        "
                        title={
                          complaint.address || ""
                        }
                      >
                        {complaint.address || "—"}
                      </span>
                    </td>

                    {/* =====================================
                        STATUS
                    ===================================== */}

                    <td className="px-3 py-3">
                      <span
                        className={`
                          inline-flex
                          max-w-[140px]
                          items-center
                          overflow-hidden
                          text-ellipsis
                          whitespace-nowrap
                          rounded-md
                          px-2
                          py-1
                          text-[9px]
                          font-semibold
                          ${
                            status?.className ||
                            "bg-gray-100 text-gray-700"
                          }
                        `}
                        title={statusLabel}
                      >
                        {statusLabel}
                      </span>
                    </td>

                    {/* =====================================
                        CREATED AT
                    ===================================== */}

                    <td className="px-3 py-3">
                      <div
                        className="
                          whitespace-nowrap
                          text-[10px]
                          leading-4
                          text-[#16295A]
                        "
                      >
                        {complaint.created_at
                          ? new Date(
                              complaint.created_at
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </div>
                    </td>

                    {/* =====================================
                        ACTION
                    ===================================== */}

                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectComplaint?.(
                            complaint
                          )
                        }
                        title={t(
                          "complaints.details.actions.viewComplaint",
                          "View complaint"
                        )}
                        aria-label={t(
                          "complaints.details.actions.viewComplaint",
                          "View complaint"
                        )}
                        className="
                          mx-auto
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-violet-200
                          bg-white
                          text-violet-600
                          transition
                          hover:border-violet-300
                          hover:bg-violet-50
                        "
                      >
                        <Eye
                          size={14}
                          strokeWidth={2}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <div
        className="
          flex
          min-h-[58px]
          flex-col
          items-center
          justify-between
          gap-3
          px-4
          py-3
          sm:flex-row
        "
      >
        {/* ================= RESULT COUNT ================= */}

        <p
          className="
            text-center
            text-[10px]
            text-gray-500
            sm:text-left
          "
        >
          {t(
            "complaints.table.showing",
            "Showing"
          )}{" "}
          <span className="font-medium text-[#16295A]">
            {startItem}
          </span>{" "}
          {t(
            "complaints.table.to",
            "to"
          )}{" "}
          <span className="font-medium text-[#16295A]">
            {endItem}
          </span>{" "}
          {t(
            "complaints.table.of",
            "of"
          )}{" "}
          <span className="font-medium text-[#16295A]">
            {total}
          </span>{" "}
          {t(
            "complaints.table.complaints",
            "complaints"
          )}
        </p>

        {/* ================= PAGINATION CONTROLS ================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1.5
          "
        >
          {/* Previous */}

          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() =>
              onPageChange?.(
                currentPage - 1
              )
            }
            aria-label={t(
              "complaints.table.previousPage",
              "Previous page"
            )}
            className={`...`}
          >
            <ChevronLeft size={14} />
          </button>

          {/* Current Page */}

          <div
            className="
              flex
              h-7
              min-w-7
              items-center
              justify-center
              rounded-lg
              bg-gradient-to-r
              from-violet-600
              to-fuchsia-600
              px-2
              text-[10px]
              font-semibold
              text-white
            "
          >
            {currentPage}
          </div>

          {/* Next */}

          <button
            type="button"
            disabled={
              totalPages === 0 ||
              currentPage >= totalPages
            }
            onClick={() =>
              onPageChange?.(
                currentPage + 1
              )
            }
            aria-label={t(
              "complaints.table.nextPage",
              "Next page"
            )}
            className={`...`}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}