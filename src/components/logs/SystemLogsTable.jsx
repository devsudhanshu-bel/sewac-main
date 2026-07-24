import {
  Search,
  CalendarDays,
  ChevronDown,
  ShieldCheck,
  Pencil,
  ArrowUpDown,
} from "lucide-react";

const logs = [
  {
    id: 1,
    timestamp: "19 May 2025, 10:45:32 AM",
    level: "INFO",
    source: "Web Portal",
    user: "Admin",
    message: "Waste collection data updated successfully for Ward 23",
  },
  {
    id: 2,
    timestamp: "19 May 2025, 10:42:18 AM",
    level: "WARN",
    source: "Mobile App",
    user: "Driver_1024",
    message: "Vehicle VHC1024 exceeded speed limit at Tumkur Road",
  },
  {
    id: 3,
    timestamp: "19 May 2025, 10:41:05 AM",
    level: "ERROR",
    source: "IoT Device",
    user: "System",
    message: "Failed to fetch telemetry data from vehicle VHC1045",
  },
  {
    id: 4,
    timestamp: "19 May 2025, 10:40:22 AM",
    level: "INFO",
    source: "Web Portal",
    user: "Admin",
    message: "New user Driver_1056 added successfully",
  },
  {
    id: 5,
    timestamp: "19 May 2025, 10:38:47 AM",
    level: "INFO",
    source: "Web Portal",
    user: "Operator_3",
    message: "Plant status updated to Active - Shobha Organic Plant",
  },
  {
    id: 6,
    timestamp: "19 May 2025, 10:35:19 AM",
    level: "WARN",
    source: "AI Engine",
    user: "System",
    message: "High waste generation detected in North Zone",
  },
  {
    id: 7,
    timestamp: "19 May 2025, 10:32:51 AM",
    level: "ERROR",
    source: "Web Portal",
    user: "Unknown",
    message: "Failed login attempt for user admin from unknown IP",
  },
  {
    id: 8,
    timestamp: "19 May 2025, 10:30:11 AM",
    level: "INFO",
    source: "Mobile App",
    user: "Driver_1027",
    message: "Collection point marked as completed in Ward 24",
  },
  {
    id: 9,
    timestamp: "19 May 2025, 10:28:33 AM",
    level: "INFO",
    source: "Web Portal",
    user: "System",
    message: "Scheduled backup completed successfully",
  },
  {
    id: 10,
    timestamp: "19 May 2025, 10:25:47 AM",
    level: "WARN",
    source: "GPS Device",
    user: "System",
    message: "GPS signal weak for vehicle VHC1089",
  },
];

export default function SystemLogsTable() {
  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      {/* Header */}

      <div className="px-8 pt-7 pb-6">

        <h2 className="text-[24px] font-bold uppercase text-[#16295A]">
          System Logs
        </h2>

      </div>

      {/* Filters */}

      <div className="px-8 pb-6 flex items-center justify-between gap-5">

        {/* Left */}

        <div className="flex items-center gap-4">

          {/* Search */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4F46E5]"
            />

            <input
              type="text"
              placeholder="Search logs by message, user..."
              className="
                w-[330px]
                h-11
                rounded-xl
                border
                border-gray-200
                bg-white
                pl-11
                pr-4
                text-[14px]
                outline-none
                focus:border-violet-500
              "
            />

          </div>

          {/* Date */}

          <button
            className="
              h-11
              w-[205px]
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              flex
              items-center
              justify-between
              text-[14px]
              font-medium
              text-[#16295A]
            "
          >
            <div className="flex items-center gap-3">

              <CalendarDays size={17} />

              <span>19 May 2025</span>

            </div>

            <ChevronDown size={16} />

          </button>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <button
            className="
              h-11
              px-6
              rounded-xl
              border
              border-violet-500
              bg-white
              flex
              items-center
              gap-2
              text-[14px]
              font-semibold
              text-violet-700
              hover:bg-violet-50
              transition
            "
          >
            <ShieldCheck size={17} />

            Audit Logs

          </button>

          <button
            className="
              h-11
              px-6
              rounded-xl
              border
              border-violet-500
              bg-white
              flex
              items-center
              gap-2
              text-[14px]
              font-semibold
              text-violet-700
              hover:bg-violet-50
              transition
            "
          >
            <Pencil size={17} />

            Edit Logs

          </button>

        </div>

      </div>
            {/* Table */}

      <div className="px-6 pb-2">

        <table className="w-full border-separate border-spacing-0">

          <thead>

            <tr className="bg-[#F8F6FF]">

              <th className="rounded-l-xl px-4 py-4 text-left text-[13px] font-semibold text-[#4F46E5] w-[60px]">
                #
              </th>

              <th className="px-4 py-4 text-left text-[13px] font-semibold text-[#4F46E5]">

                <div className="flex items-center gap-2">

                  Timestamp

                  <ArrowUpDown size={14} />

                </div>

              </th>

              <th className="px-4 py-4 text-left text-[13px] font-semibold text-[#4F46E5]">
                Level
              </th>

              <th className="px-4 py-4 text-left text-[13px] font-semibold text-[#4F46E5]">
                Source
              </th>

              <th className="px-4 py-4 text-left text-[13px] font-semibold text-[#4F46E5]">
                User
              </th>

              <th className="rounded-r-xl px-4 py-4 text-left text-[13px] font-semibold text-[#4F46E5]">
                Message
              </th>

            </tr>

          </thead>

          <tbody>

            {logs.map((log) => (

              <tr
                key={log.id}
                className="hover:bg-gray-50 transition-colors"
              >

                <td className="border-b border-gray-100 px-4 py-5 text-[14px] font-medium text-[#1F2937]">
                  {log.id}
                </td>

                <td className="border-b border-gray-100 px-4 py-5 text-[14px] text-[#1F2937]">
                  {log.timestamp}
                </td>

                <td className="border-b border-gray-100 px-4 py-5">

                  <span
                    className={`
                      inline-flex
                      items-center
                      justify-center
                      rounded-md
                      px-3
                      py-1
                      text-[12px]
                      font-semibold

                      ${
                        log.level === "INFO"
                          ? "bg-green-100 text-green-700"
                          : log.level === "WARN"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-red-100 text-red-600"
                      }
                    `}
                  >
                    {log.level}
                  </span>

                </td>

                <td className="border-b border-gray-100 px-4 py-5 text-[14px] text-[#1F2937]">
                  {log.source}
                </td>

                <td className="border-b border-gray-100 px-4 py-5 text-[14px] text-[#1F2937]">
                  {log.user}
                </td>

                <td className="border-b border-gray-100 px-4 py-5 text-[14px] text-[#1F2937] leading-7">
                  {log.message}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
            {/* Footer */}

      <div className="flex items-center justify-between border-t border-gray-100 px-8 py-6">

        {/* Showing Entries */}

        <p className="text-[14px] text-[#667085]">
          Showing{" "}
          <span className="font-semibold text-[#16295A]">
            1
          </span>{" "}
          to{" "}
          <span className="font-semibold text-[#16295A]">
            10
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#16295A]">
            25,642
          </span>{" "}
          logs
        </p>

        {/* Pagination */}

        <div className="flex items-center gap-2">

          <button
            className="
              h-10
              w-10
              rounded-xl
              border
              border-violet-600
              bg-white
              text-violet-700
              font-semibold
              shadow-sm
            "
          >
            1
          </button>

          <button
            className="
              h-10
              w-10
              rounded-xl
              text-[#16295A]
              hover:bg-gray-50
              transition
            "
          >
            2
          </button>

          <button
            className="
              h-10
              w-10
              rounded-xl
              text-[#16295A]
              hover:bg-gray-50
              transition
            "
          >
            3
          </button>

          <button
            className="
              h-10
              w-10
              rounded-xl
              text-[#16295A]
            "
          >
            ...
          </button>

          <button
            className="
              h-10
              px-2
              rounded-xl
              text-[#16295A]
              font-semibold
              hover:bg-gray-50
              transition
            "
          >
            2565
          </button>

          <button
            className="
              h-10
              w-10
              rounded-xl
              flex
              items-center
              justify-center
              text-[#16295A]
              hover:bg-gray-50
              transition
            "
          >
            →
          </button>

        </div>

        {/* Rows Per Page */}

        <div className="flex items-center gap-3">

          <span className="text-[14px] text-[#667085]">
            Rows per page:
          </span>

          <select
            defaultValue="10"
            className="
              h-10
              w-20
              rounded-xl
              border
              border-gray-200
              bg-white
              px-3
              text-[14px]
              outline-none
              focus:border-violet-500
            "
          >
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>

        </div>

      </div>

    </div>
  );
}