import { Eye, ChevronLeft, ChevronRight } from "lucide-react";

import { useEffect, useRef } from "react";

import gsap from "gsap";

import { useLanguage } from "../../i18n";

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

  const tableRef = useRef(null);
  const rowsRef = useRef(null);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const currentPage = Number(pagination.page) || 1;

  const limit = Number(pagination.limit) || 10;

  const total = Number(pagination.total) || 0;

  const totalPages = Number(pagination.totalPages) || 0;

  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;

  const endItem = total === 0 ? 0 : Math.min(currentPage * limit, total);

  /* =======================================================
     TABLE ENTRANCE
  ======================================================= */

  useEffect(() => {
    if (!tableRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        tableRef.current,
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        },
      );
    }, tableRef);

    return () => ctx.revert();
  }, []);

  /* =======================================================
     ROW ANIMATION
  ======================================================= */

  useEffect(() => {
    if (!rowsRef.current) return;

    const rows = rowsRef.current.querySelectorAll("[data-complaint-row]");

    if (!rows.length) return;

    gsap.fromTo(
      rows,
      {
        opacity: 0,
        y: 12,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.045,
        ease: "power2.out",
        clearProps: "transform",
      },
    );
  }, [complaints, currentPage]);

  /* =======================================================
     ROW HOVER
  ======================================================= */

  const handleRowEnter = (row) => {
    gsap.to(row, {
      backgroundColor: "#FAF8FF",
      duration: 0.18,
      ease: "power2.out",
    });
  };

  const handleRowLeave = (row) => {
    gsap.to(row, {
      backgroundColor: "rgba(255,255,255,0)",
      duration: 0.18,
      ease: "power2.out",
    });
  };

  /* =======================================================
     TRANSLATIONS
  ======================================================= */

  const tableTitle = t("complaints.table.title", "Complaints");

  const complaintWord = t("complaints.table.complaint", "complaint");

  const complaintsWord = t("complaints.table.complaints", "complaints");

  const foundWord = t("complaints.table.found", "found");

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      ref={tableRef}
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
            {tableTitle}
          </h2>

          <p
            className="
              mt-0.5
              text-[9px]
              text-gray-400
              sm:text-[10px]
            "
          >
            {total} {total === 1 ? complaintWord : complaintsWord} {foundWord}
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
            {t("complaints.table.updating", "Updating...")}
          </span>
        )}
      </div>

      {/* =====================================================
          TABLE SCROLL
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
          <thead>
            <tr
              className="
                h-[42px]
                border-b
                border-gray-100
                bg-[#FAFBFD]
              "
            >
              <th className="w-[115px] whitespace-nowrap px-3 text-left text-[10px] font-semibold text-gray-500">
                {t("complaints.table.ticketNumber", "Ticket Number")}
              </th>

              <th className="w-[135px] whitespace-nowrap px-3 text-left text-[10px] font-semibold text-gray-500">
                {t("complaints.table.category", "Category")}
              </th>

              <th className="w-[160px] px-3 text-left text-[10px] font-semibold text-gray-500">
                {t("complaints.table.titleColumn", "Title")}
              </th>

              <th className="w-[120px] whitespace-nowrap px-3 text-left text-[10px] font-semibold text-gray-500">
                <span className="block">
                  {t("complaints.table.citizen", "Citizen")}
                </span>

                <span className="block">
                  {t("complaints.table.phone", "(Phone)")}
                </span>
              </th>

              <th className="w-[190px] px-3 text-left text-[10px] font-semibold text-gray-500">
                {t("complaints.table.location", "Location")}
              </th>

              <th className="w-[150px] whitespace-nowrap px-3 text-left text-[10px] font-semibold text-gray-500">
                {t("complaints.table.status", "Status")}
              </th>

              <th className="w-[110px] whitespace-nowrap px-3 text-left text-[10px] font-semibold text-gray-500">
                {t("complaints.table.createdAt", "Created At")}
              </th>

              <th className="w-[70px] px-3 text-center text-[10px] font-semibold text-gray-500">
                {t("complaints.table.action", "Action")}
              </th>
            </tr>
          </thead>

          <tbody ref={rowsRef}>
            {/* LOADING */}

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
                      {t("complaints.table.loading", "Loading complaints...")}
                    </span>
                  </div>
                </td>
              </tr>
            ) : error ? (
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
                  {t("complaints.table.empty", "No complaints found.")}
                </td>
              </tr>
            ) : (
              complaints.map((complaint) => {
                const status = statusConfig[complaint.status];

                const statusLabel = status
                  ? t(
                      `complaints.details.statusOptions.${status.translationKey}`,
                      complaint.status,
                    )
                  : complaint.status || "—";

                return (
                  <tr
                    key={complaint.ticket_number}
                    data-complaint-row
                    onMouseEnter={(e) => handleRowEnter(e.currentTarget)}
                    onMouseLeave={(e) => handleRowLeave(e.currentTarget)}
                    className="
                        min-h-[58px]
                        border-b
                        border-gray-100
                      "
                  >
                    <td className="px-3 py-3">
                      <span className="whitespace-nowrap text-[10px] font-semibold text-[#16295A]">
                        {complaint.ticket_number || "—"}
                      </span>
                    </td>

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
                        title={complaint.category || ""}
                      >
                        {complaint.category || "—"}
                      </span>
                    </td>

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
                        title={complaint.title || ""}
                      >
                        {complaint.title || "—"}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span className="whitespace-nowrap text-[10px] text-[#16295A]">
                        {complaint.phone_number || "—"}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className="
                            block
                            max-w-[175px]
                            truncate
                            text-[10px]
                            text-[#16295A]
                          "
                        title={complaint.address || ""}
                      >
                        {complaint.address || "—"}
                      </span>
                    </td>

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
                            ${status?.className || "bg-gray-100 text-gray-700"}
                          `}
                        title={statusLabel}
                      >
                        {statusLabel}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="whitespace-nowrap text-[10px] leading-4 text-[#16295A]">
                        {complaint.created_at
                          ? new Date(complaint.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </div>
                    </td>

                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          gsap.fromTo(
                            e.currentTarget,
                            {
                              scale: 0.88,
                            },
                            {
                              scale: 1,
                              duration: 0.25,
                              ease: "back.out(2)",
                            },
                          );

                          onSelectComplaint?.(complaint);
                        }}
                        title={t("complaints.table.view", "View complaint")}
                        aria-label={t(
                          "complaints.table.view",
                          "View complaint",
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
                        <Eye size={14} strokeWidth={2} />
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
        <p
          className="
            text-center
            text-[10px]
            text-gray-500
            sm:text-left
          "
        >
          {t("complaints.table.showing", "Showing")}{" "}
          <span className="font-medium text-[#16295A]">{startItem}</span>{" "}
          {t("complaints.table.to", "to")}{" "}
          <span className="font-medium text-[#16295A]">{endItem}</span>{" "}
          {t("complaints.table.of", "of")}{" "}
          <span className="font-medium text-[#16295A]">{total}</span>{" "}
          {complaintsWord}
        </p>

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1.5
          "
        >
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            aria-label={t("complaints.table.previousPage", "Previous page")}
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              text-[#16295A]
              transition
              hover:bg-violet-50
              disabled:cursor-not-allowed
              disabled:text-gray-300
            "
          >
            <ChevronLeft size={14} />
          </button>

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

          <button
            type="button"
            disabled={totalPages === 0 || currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
            aria-label={t("complaints.table.nextPage", "Next page")}
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              text-[#16295A]
              transition
              hover:bg-violet-50
              disabled:cursor-not-allowed
              disabled:text-gray-300
            "
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
