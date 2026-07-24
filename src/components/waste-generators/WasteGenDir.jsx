import {
  Search,
  Download,
  FileSpreadsheet,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const wasteGenerators = [
  {
    id: 1,
    name: "Ramesh Kumar",
    phone: "9876543210",
    wetRFID: "WET123456",
    dryRFID: "DRY654321",
    ward: "Ward 24, Green Park",
    zone: "North Zone",
    totalWaste: "12.6 Kg",
    averageWaste: "9.20 Kg",
    lastCollection: "19 May 2025, 10:45 AM",
    status: "Active",
  },
  {
    id: 2,
    name: "Suresh Patel",
    phone: "9876543211",
    wetRFID: "WET123457",
    dryRFID: "DRY654322",
    ward: "Ward 25, MG Road",
    zone: "Central Zone",
    totalWaste: "10.2 Kg",
    averageWaste: "8.60 Kg",
    lastCollection: "19 May 2025, 10:30 AM",
    status: "Active",
  },
  {
    id: 3,
    name: "Priya Sharma",
    phone: "9876543212",
    wetRFID: "WET123458",
    dryRFID: "DRY654323",
    ward: "Ward 23, Indiranagar",
    zone: "East Zone",
    totalWaste: "9.8 Kg",
    averageWaste: "7.80 Kg",
    lastCollection: "19 May 2025, 10:15 AM",
    status: "Active",
  },
  {
    id: 4,
    name: "Mahesh Yadav",
    phone: "9876543213",
    wetRFID: "WET123459",
    dryRFID: "DRY654324",
    ward: "Ward 24, Green Park",
    zone: "North Zone",
    totalWaste: "8.7 Kg",
    averageWaste: "7.10 Kg",
    lastCollection: "19 May 2025, 10:05 AM",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Anjali Singh",
    phone: "9876543214",
    wetRFID: "WET123460",
    dryRFID: "DRY654325",
    ward: "Ward 22, Koramangala",
    zone: "South Zone",
    totalWaste: "7.9 Kg",
    averageWaste: "6.50 Kg",
    lastCollection: "19 May 2025, 09:50 AM",
    status: "Active",
  },
  {
    id: 6,
    name: "Deepak Nair",
    phone: "9876543215",
    wetRFID: "WET123461",
    dryRFID: "DRY654326",
    ward: "Ward 21, BTM Layout",
    zone: "South East Zone",
    totalWaste: "6.1 Kg",
    averageWaste: "5.40 Kg",
    lastCollection: "19 May 2025, 09:40 AM",
    status: "Inactive",
  },
  {
    id: 7,
    name: "Kavita Rao",
    phone: "9876543216",
    wetRFID: "WET123462",
    dryRFID: "DRY654327",
    ward: "Ward 20, Jayanagar",
    zone: "North East Zone",
    totalWaste: "5.3 Kg",
    averageWaste: "4.80 Kg",
    lastCollection: "19 May 2025, 09:30 AM",
    status: "Active",
  },
];

export default function WasteGenDir() {
  return (
    <section
      className="
        mt-5
        bg-white
        rounded-[22px]
        border
        border-[#ECECF4]
        shadow-[0_2px_10px_rgba(0,0,0,0.03)]
        overflow-hidden
      "
    >

      {/* ================= Header ================= */}

      <div className="px-6 pt-5 pb-3 flex items-start justify-between">

        <div>

          <h2 className="text-[18px] font-semibold text-[#16295A]">
            Waste Generators Directory
          </h2>

          <p className="mt-1 text-[11px] text-[#7B8190]">
            View and manage waste generators based on their waste contribution
            and activity.
          </p>

        </div>

        {/* Right Side */}

        <div className="flex items-center gap-3">

          {/* Search */}

          <div className="relative">

            <Search
              size={15}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              placeholder="Search by name, phone number, RFID or zone..."
              className="
                w-[300px]
                h-10
                rounded-xl
                border
                border-[#E8E8EF]
                bg-white
                pl-10
                pr-4
                text-[12px]
                outline-none
                placeholder:text-slate-400
              "
            />

          </div>

          {/* Dropdown */}

          <button
            className="
              w-[170px]
              h-10
              rounded-xl
              border
              border-[#E8E8EF]
              bg-white
              flex
              items-center
              justify-between
              px-4
              text-[12px]
              font-medium
              text-[#6D28D9]
            "
          >

            All Waste Generators

            <ChevronDown size={15} />

          </button>

          {/* Excel */}

          <button
            className="
              w-10
              h-10
              rounded-xl
              border
              border-[#E8E8EF]
              flex
              items-center
              justify-center
              hover:bg-green-50
              transition
            "
          >

            <FileSpreadsheet
              size={18}
              className="text-green-600"
            />

          </button>

          {/* Download */}

          <button
            className="
              w-10
              h-10
              rounded-xl
              border
              border-[#E8E8EF]
              flex
              items-center
              justify-center
              hover:bg-violet-50
              transition
            "
          >

            <Download
              size={18}
              className="text-[#4F46E5]"
            />

          </button>

        </div>

      </div>

            {/* ================= Table ================= */}

      <div className="overflow-x-auto">

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-[#F8F8FD] border-y border-[#ECECF4]">

              <th className="w-[40px] py-3 pl-4 text-left text-[11px] font-semibold text-[#3B3F53]">
                #
              </th>

              <th className="min-w-[170px] px-3 py-3 text-left text-[11px] font-semibold text-[#3B3F53]">
                Name
              </th>

              <th className="min-w-[120px] px-3 py-3 text-left text-[11px] font-semibold text-[#3B3F53]">
                Phone Number
              </th>

              <th className="min-w-[120px] px-3 py-3 text-left text-[11px] font-semibold text-[#3B3F53]">
                Wet RFID
              </th>

              <th className="min-w-[120px] px-3 py-3 text-left text-[11px] font-semibold text-[#3B3F53]">
                Dry RFID
              </th>

              <th className="min-w-[170px] px-3 py-3 text-left text-[11px] font-semibold text-[#3B3F53]">
                Ward / Area
              </th>

              <th className="min-w-[110px] px-3 py-3 text-left text-[11px] font-semibold text-[#3B3F53]">
                Zone
              </th>

              <th className="min-w-[130px] px-3 py-3 text-center text-[11px] font-semibold text-[#3B3F53]">
                Total Waste Generated
              </th>

              <th className="min-w-[120px] px-3 py-3 text-center text-[11px] font-semibold text-[#3B3F53]">
                Average Waste
              </th>

              <th className="min-w-[165px] px-3 py-3 text-center text-[11px] font-semibold text-[#3B3F53]">
                Last Collection
              </th>

              <th className="min-w-[90px] px-3 py-3 text-center text-[11px] font-semibold text-[#3B3F53]">
                Status
              </th>

              <th className="w-[70px] px-3 py-3 text-center text-[11px] font-semibold text-[#3B3F53]">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {wasteGenerators.map((item) => (

              <tr
                key={item.id}
                className="
                  border-b
                  border-[#F1F2F7]
                  hover:bg-[#FAFAFD]
                  transition-all
                "
              >              {/* ================= Index ================= */}

              <td className="pl-4 py-[11px] text-[11px] font-medium text-[#374151]">
                {item.id}
              </td>

              {/* ================= Name ================= */}

              <td className="px-3 py-[11px]">

                <span className="text-[11px] font-semibold text-[#16295A]">
                  {item.name}
                </span>

              </td>

              {/* ================= Phone ================= */}

              <td className="px-3 py-[11px]">

                <span className="text-[11px] font-medium text-[#4B5563]">
                  {item.phone}
                </span>

              </td>

              {/* ================= Wet RFID ================= */}

              <td className="px-3 py-[11px]">

                <span className="text-[11px] font-medium text-[#4B5563]">
                  {item.wetRFID}
                </span>

              </td>

              {/* ================= Dry RFID ================= */}

              <td className="px-3 py-[11px]">

                <span className="text-[11px] font-medium text-[#4B5563]">
                  {item.dryRFID}
                </span>

              </td>

              {/* ================= Ward ================= */}

              <td className="px-3 py-[11px]">

                <span className="text-[11px] text-[#4B5563]">
                  {item.ward}
                </span>

              </td>

              {/* ================= Zone ================= */}

              <td className="px-3 py-[11px]">

                <span className="text-[11px] font-medium text-[#16295A]">
                  {item.zone}
                </span>

              </td>

              {/* ================= Total Waste ================= */}

              <td className="px-3 py-[11px] text-center">

                <span className="text-[11px] font-semibold text-[#16295A]">
                  {item.totalWaste}
                </span>

              </td>

              {/* ================= Average Waste ================= */}

              <td className="px-3 py-[11px] text-center">

                <span className="text-[11px] font-semibold text-[#16295A]">
                  {item.averageWaste}
                </span>

              </td>

              {/* ================= Last Collection ================= */}

              <td className="px-3 py-[11px] text-center">

                <span className="text-[11px] text-[#4B5563] whitespace-nowrap">
                  {item.lastCollection}
                </span>

              </td>

              {/* ================= Status ================= */}

              <td className="px-3 py-[11px] text-center">

                <span
                  className={`
                    inline-flex
                    items-center
                    justify-center
                    rounded-md
                    px-3
                    py-[4px]
                    text-[10px]
                    font-semibold

                    ${
                      item.status === "Active"
                        ? "bg-[#DCFCE7] text-[#16A34A]"
                        : "bg-[#FEE2E2] text-[#EA580C]"
                    }
                  `}
                >
                  {item.status}
                </span>

              </td>

              {/* ================= Actions ================= */}

              <td className="px-3 py-[11px] text-center">

                <button
                  className="
                    w-7
                    h-7
                    rounded-md
                    hover:bg-slate-100
                    transition
                    inline-flex
                    items-center
                    justify-center
                  "
                >

                  <MoreHorizontal
                    size={15}
                    className="text-slate-500"
                  />

                </button>

              </td>

            </tr>

          ))}

          </tbody>

        </table>

      </div>

            {/* ================= Footer ================= */}

      <div
        className="
          flex
          items-center
          justify-between
          px-6
          py-4
          border-t
          border-[#ECECF4]
          bg-white
        "
      >

        {/* Left */}

        <div className="flex items-center gap-4">

          <span className="text-[11px] text-slate-500">
            Rows per page
          </span>

          <button
            className="
              h-8
              px-3
              rounded-lg
              border
              border-[#E5E7EB]
              flex
              items-center
              gap-2
              text-[11px]
              font-medium
            "
          >
            10

            <ChevronDown size={14} />

          </button>

          <span className="text-[11px] text-slate-500">
            Showing 1–7 of {wasteGenerators.length} entries
          </span>

        </div>

        {/* Pagination */}

        <div className="flex items-center gap-2">

          <button
            className="
              w-8
              h-8
              rounded-lg
              border
              border-[#E5E7EB]
              flex
              items-center
              justify-center
              hover:bg-slate-50
            "
          >
            <ChevronLeft size={15} />
          </button>

          <button
            className="
              w-8
              h-8
              rounded-lg
              bg-[#6D28D9]
              text-white
              text-[11px]
              font-semibold
            "
          >
            1
          </button>

          <button
            className="
              w-8
              h-8
              rounded-lg
              border
              border-[#E5E7EB]
              text-[11px]
              hover:bg-slate-50
            "
          >
            2
          </button>

          <button
            className="
              w-8
              h-8
              rounded-lg
              border
              border-[#E5E7EB]
              text-[11px]
              hover:bg-slate-50
            "
          >
            3
          </button>

          <span className="px-1 text-slate-400">
            ...
          </span>

          <button
            className="
              px-3
              h-8
              rounded-lg
              border
              border-[#E5E7EB]
              text-[11px]
            "
          >
            1285
          </button>

          <button
            className="
              w-8
              h-8
              rounded-lg
              border
              border-[#E5E7EB]
              flex
              items-center
              justify-center
              hover:bg-slate-50
            "
          >
            <ChevronRight size={15} />
          </button>

        </div>

      </div>

    </section>
  );
}