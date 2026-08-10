import {
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const complaints = [
  {
    ticket: "CMP-20260731-001",
    category: "Solid Waste",
    categoryColor: "purple",
    title: "Garbage Overflow near Bus Stop",
    phone: "9876543210",
    location: "Ward 23",
    status: "Pending",
    statusColor: "yellow",
    assignedTo: "-",
    date: "31 Jul 2026",
    time: "10:45 AM",
  },
  {
    ticket: "CMP-20260731-002",
    category: "Drainage",
    categoryColor: "blue",
    title: "Water Logging at Main Road",
    phone: "9988776655",
    location: "Ward 45",
    status: "In Progress",
    statusColor: "blue",
    assignedTo: "Ramesh K.",
    date: "31 Jul 2026",
    time: "09:30 AM",
  },
  {
    ticket: "CMP-20260731-003",
    category: "Road",
    categoryColor: "orange",
    title: "Pothole on Ibbalur Road",
    phone: "9123456780",
    location: "Ward 23",
    status: "Resolved",
    statusColor: "green",
    assignedTo: "Suresh M.",
    date: "30 Jul 2026",
    time: "04:20 PM",
  },
  {
    ticket: "CMP-20260730-015",
    category: "Street Light",
    categoryColor: "yellow",
    title: "Street Light Not Working",
    phone: "9900112233",
    location: "Ward 67",
    status: "Pending",
    statusColor: "yellow",
    assignedTo: "-",
    date: "30 Jul 2026",
    time: "11:15 AM",
  },
  {
    ticket: "CMP-20260730-014",
    category: "Solid Waste",
    categoryColor: "purple",
    title: "Irregular Waste Collection",
    phone: "9881122334",
    location: "Ward 12",
    status: "In Progress",
    statusColor: "blue",
    assignedTo: "Mahesh T.",
    date: "30 Jul 2026",
    time: "10:02 AM",
  },
];

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

export default function ComplaintTable() {
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
                Assigned To
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
            {complaints.map((complaint) => (
              <tr
                key={complaint.ticket}
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
                    {complaint.ticket}
                  </span>
                </td>

                {/* Category */}

                <td className="px-3">
                  <span
                    className={`
                      inline-flex
                      items-center
                      px-2
                      py-1
                      rounded-md
                      text-[9px]
                      font-semibold
                      whitespace-nowrap
                      ${categoryStyles[complaint.categoryColor]}
                    `}
                  >
                    {complaint.category}
                  </span>
                </td>

                {/* Title */}

                <td className="px-3 max-w-[150px]">
                  <span className="block text-[10px] font-medium leading-4 text-[#16295A]">
                    {complaint.title}
                  </span>
                </td>

                {/* Phone */}

                <td className="px-3">
                  <span className="text-[10px] text-[#16295A] whitespace-nowrap">
                    {complaint.phone}
                  </span>
                </td>

                {/* Location */}

                <td className="px-3">
                  <span className="text-[10px] text-[#16295A] whitespace-nowrap">
                    {complaint.location}
                  </span>
                </td>

                {/* Status */}

                <td className="px-3">
                  <span
                    className={`
                      inline-flex
                      items-center
                      px-2
                      py-1
                      rounded-md
                      text-[9px]
                      font-semibold
                      whitespace-nowrap
                      ${statusStyles[complaint.statusColor]}
                    `}
                  >
                    {complaint.status}
                  </span>
                </td>

                {/* Assigned */}

                <td className="px-3">
                  <span className="text-[10px] text-[#16295A] whitespace-nowrap">
                    {complaint.assignedTo}
                  </span>
                </td>

                {/* Created */}

                <td className="px-3">
                  <div className="text-[10px] text-[#16295A] leading-4 whitespace-nowrap">
                    <div>{complaint.date}</div>
                    <div className="text-gray-500">
                      {complaint.time}
                    </div>
                  </div>
                </td>

                {/* Action */}

                <td className="px-3 text-center">
                  <button
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
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}

      <div className="h-[58px] px-4 flex items-center justify-between">
        {/* Result Count */}

        <p className="text-[10px] text-gray-500">
          Showing 1 to 5 of{" "}
          <span className="font-medium text-[#16295A]">
            143
          </span>{" "}
          complaints
        </p>

        {/* Pagination */}

        <div className="flex items-center gap-1.5">
          {/* Rows per page */}

          <div className="flex items-center gap-2 mr-3">
            <span className="text-[10px] text-gray-500 whitespace-nowrap">
              Rows per page:
            </span>

            <button
              className="
                h-8
                min-w-[48px]
                px-2
                rounded-lg
                border
                border-gray-200
                bg-white
                flex
                items-center
                justify-between
                gap-2
                text-[10px]
                text-[#16295A]
              "
            >
              5

              <ChevronDown size={12} />
            </button>
          </div>

          {/* Previous */}

          <button
            disabled
            className="
              w-7
              h-7
              rounded-lg
              flex
              items-center
              justify-center
              text-gray-300
            "
          >
            <ChevronLeft size={14} />
          </button>

          {/* Page 1 */}

          <button
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
            1
          </button>

          {/* Page 2 */}

          <button
            className="
              w-7
              h-7
              rounded-lg
              text-[10px]
              text-[#16295A]
              hover:bg-violet-50
              transition
            "
          >
            2
          </button>

          {/* Page 3 */}

          <button
            className="
              w-7
              h-7
              rounded-lg
              text-[10px]
              text-[#16295A]
              hover:bg-violet-50
              transition
            "
          >
            3
          </button>

          {/* Dots */}

          <span className="px-1 text-[10px] text-gray-400">
            ...
          </span>

          {/* Page 29 */}

          <button
            className="
              w-7
              h-7
              rounded-lg
              text-[10px]
              text-[#16295A]
              hover:bg-violet-50
              transition
            "
          >
            29
          </button>

          {/* Next */}

          <button
            className="
              w-7
              h-7
              rounded-lg
              flex
              items-center
              justify-center
              text-[#16295A]
              hover:bg-violet-50
              transition
            "
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}