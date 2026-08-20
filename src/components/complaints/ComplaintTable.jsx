import { Eye, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const categoryStyles = {
  purple: "bg-[#F3E8FF] text-[#7C3AED]",
  blue: "bg-[#E8F2FF] text-[#2878D8]",
  orange: "bg-[#FFF0E5] text-[#E98B32]",
  yellow: "bg-[#FFF7DD] text-[#D99A16]",
};

const statusStyles = {
  yellow: "bg-[#FFF4D6] text-[#D99A16]",
  blue: "bg-[#E7F1FF] text-[#2878D8]",
  green: "bg-[#E4F8EE] text-[#20A66A]",
};

export default function ComplaintTable({
  complaints = [],
  loading = false,
  error = "",
  pagination = {},
  onPageChange,
  onSelectComplaint,
}) {
  return (
    <div
      className="
        w-full
        bg-white
        rounded-2xl
        border
        border-gray-100
        shadow-[0_6px_20px_rgba(15,23,42,0.04)]
        overflow-hidden
      "
    >
      {/* ================= TABLE ================= */}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* ================= HEADER ================= */}

          <thead>
            <tr className="h-[42px] bg-[#FAFBFD] border-b border-gray-100">
              <th className="px-3 text-left text-[10px] font-semibold text-gray-500 whitespace-nowrap">
                Ticket Number
              </th>

              <th className="px-3 text-left text-[10px] font-semibold text-gray-500 whitespace-nowrap">
                Category
              </th>

              <th className="px-3 text-left text-[10px] font-semibold text-gray-500">
                Title
              </th>

              <th className="px-3 text-left text-[10px] font-semibold text-gray-500 whitespace-nowrap">
                <span className="block">Citizen</span>
                <span className="block">(Phone)</span>
              </th>

              <th className="px-3 text-left text-[10px] font-semibold text-gray-500 whitespace-nowrap">
                Location
              </th>

              <th className="px-3 text-left text-[10px] font-semibold text-gray-500 whitespace-nowrap">
                Status
              </th>

              <th className="px-3 text-left text-[10px] font-semibold text-gray-500 whitespace-nowrap">
                Created At
              </th>

              <th className="px-3 text-center text-[10px] font-semibold text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          {/* ================= BODY ================= */}

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-10 text-center text-[11px] text-gray-500"
                >
                  Loading complaints...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-10 text-center text-[11px] text-red-500"
                >
                  {error}
                </td>
              </tr>
            ) : complaints.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-10 text-center text-[11px] text-gray-500"
                >
                  No complaints found.
                </td>
              </tr>
            ) : (
              complaints.map((complaint) => (
                <tr
                  key={complaint.ticket_number}
                  className="
          h-[58px]
          border-b
          border-gray-100
          hover:bg-[#FAF8FF]
          transition-colors
        "
                >
                  {/* Ticket */}
                  <td className="px-3">
                    <span className="text-[10px] font-semibold text-[#16295A] whitespace-nowrap">
                      {complaint.ticket_number}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-3">
                    <span
                      className="
              inline-flex
              items-center
              px-2
              py-1
              rounded-md
              text-[9px]
              font-semibold
              whitespace-nowrap
              bg-gray-100
              text-gray-700
            "
                    >
                      {complaint.category || "—"}
                    </span>
                  </td>

                  {/* Title */}
                  <td className="px-3 max-w-[150px]">
                    <span className="block text-[10px] font-medium leading-4 text-[#16295A]">
                      {complaint.title || "—"}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-3">
                    <span className="text-[10px] text-[#16295A] whitespace-nowrap">
                      {complaint.phone_number || "—"}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-3">
                    <span
                      className="text-[10px] text-[#16295A]"
                      title={complaint.address || ""}
                    >
                      {complaint.address || "—"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3">
                    <span
                      className="
              inline-flex
              items-center
              px-2
              py-1
              rounded-md
              text-[9px]
              font-semibold
              whitespace-nowrap
              bg-gray-100
              text-gray-700
            "
                    >
                      {complaint.status || "—"}
                    </span>
                  </td>

                  {/* Created */}
                  <td className="px-3">
                    <div className="text-[10px] text-[#16295A] leading-4 whitespace-nowrap">
                      {complaint.created_at
                        ? new Date(complaint.created_at).toLocaleDateString()
                        : "—"}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectComplaint?.(complaint)}
                      className="
              w-7
              h-7
              rounded-lg
              border
              border-violet-200
              bg-white
              text-violet-600
              flex
              items-center
              justify-center
              mx-auto
              hover:bg-violet-50
              hover:border-violet-300
              transition
            "
                    >
                      <Eye size={14} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* ================= PAGINATION ================= */}

      <div className="h-[58px] px-4 flex items-center justify-between">
        {/* Result Count */}

        <p className="text-[10px] text-gray-500">
          Showing{" "}
          <span className="font-medium text-[#16295A]">
            {pagination.total === 0
              ? 0
              : (pagination.page - 1) * pagination.limit + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-[#16295A]">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-[#16295A]">{pagination.total}</span>{" "}
          complaints
        </p>

        {/* Pagination */}

        <div className="flex items-center gap-1.5">
          {/* Previous */}

          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange?.(pagination.page - 1)}
            className={`
        w-7
        h-7
        rounded-lg
        flex
        items-center
        justify-center
        transition
        ${
          pagination.page <= 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-[#16295A] hover:bg-violet-50"
        }
      `}
          >
            <ChevronLeft size={14} />
          </button>

          {/* Current Page */}

          <button
            type="button"
            className="
        w-7
        h-7
        rounded-lg
        bg-gradient-to-r
        from-violet-600
        to-fuchsia-600
        text-white
        text-[10px]
        font-semibold
      "
          >
            {pagination.page || 1}
          </button>

          {/* Next */}

          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange?.(pagination.page + 1)}
            className={`
        w-7
        h-7
        rounded-lg
        flex
        items-center
        justify-center
        transition
        ${
          pagination.page >= pagination.totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-[#16295A] hover:bg-violet-50"
        }
      `}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
