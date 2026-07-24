import {
  RadioTower,
  Search,
  ChevronDown,
  MoreHorizontal,
  FileSpreadsheet,
  Download,
} from "lucide-react";

/* ===========================================================
   DUMMY DATA
=========================================================== */

const telemetry = [
  {
    id: 1,
    vehicleId: "VHC1001",
    vehicleNo: "KA01AB1234",
    driver: "Ramesh Yadav",
    route: "North Corporation",
    updated: "19 May 2025, 10:30 AM",
    speed: 45,
    fuel: "68%",
    battery: "92%",
    status: "Active",
  },
  {
    id: 2,
    vehicleId: "VHC1002",
    vehicleNo: "KA02CD5678",
    driver: "Suresh B.",
    route: "West Corporation",
    updated: "19 May 2025, 10:30 AM",
    speed: 32,
    fuel: "74%",
    battery: "90%",
    status: "Active",
  },
  {
    id: 3,
    vehicleId: "VHC1003",
    vehicleNo: "KA03EF9012",
    driver: "Mahesh K.",
    route: "East Corporation",
    updated: "19 May 2025, 10:30 AM",
    speed: 28,
    fuel: "62%",
    battery: "88%",
    status: "Active",
  },
  {
    id: 4,
    vehicleId: "VHC1004",
    vehicleNo: "KA04GH3456",
    driver: "Shiva Kumar",
    route: "Central/City Corp.",
    updated: "19 May 2025, 10:30 AM",
    speed: 0,
    fuel: "15%",
    battery: "55%",
    status: "Inactive",
  },
  {
    id: 5,
    vehicleId: "VHC1005",
    vehicleNo: "KA04IJ7890",
    driver: "Nagaraj P.",
    route: "South Corporation",
    updated: "19 May 2025, 10:30 AM",
    speed: 0,
    fuel: "12%",
    battery: "50%",
    status: "Inactive",
  },
];

/* ===========================================================
   STATUS BADGE
=========================================================== */

function StatusBadge({ status }) {
  const active = status === "Active";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-[12px] font-semibold ${
        active
          ? "bg-[#E8FBF2] text-[#16A34A]"
          : "bg-[#FFF0E8] text-[#F97316]"
      }`}
    >
      {status}
    </span>
  );
}

/* ===========================================================
   COMPONENT
=========================================================== */

export default function TelemetryDirectory() {
  return (
    <section className="bg-white rounded-[30px] border border-[#ECECF3] shadow-sm overflow-hidden">

      {/* ===========================================================
          HEADER
      =========================================================== */}

      <div className="flex items-center justify-between px-8 py-5 border-b border-[#F3F4F6]">

        <div className="flex items-center gap-4">

          <RadioTower
            size={22}
            className="text-[#6C2BFF]"
          />

          <h2 className="text-[18px] font-semibold uppercase tracking-wide text-[#111827]">
            Telemetry Directory
          </h2>

        </div>

        <div className="flex items-center gap-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />

            <input
              type="text"
              placeholder="Search by Vehicle ID, Vehicle No., or Driver Name..."
              className="w-[560px] h-[48px] rounded-xl border border-[#E5E7EB] pl-14 pr-5 outline-none text-[14px] placeholder:text-[#94A3B8] focus:border-[#6C2BFF]"
            />

          </div>

          <button className="h-[48px] w-[190px] rounded-xl border border-[#E5E7EB] px-5 flex items-center justify-between hover:border-[#6C2BFF] transition">

            <span className="font-medium">
              All Status
            </span>

            <ChevronDown size={18} />

          </button>

          <button className="w-[48px] h-[48px] rounded-xl border border-[#E5E7EB] flex items-center justify-center hover:border-[#16A34A]">

            <FileSpreadsheet
              size={20}
              className="text-[#16A34A]"
            />

          </button>

          <button className="w-[48px] h-[48px] rounded-xl border border-[#E5E7EB] flex items-center justify-center hover:border-[#2563EB]">

            <Download
              size={20}
              className="text-[#2563EB]"
            />

          </button>

        </div>

      </div>

      {/* ===========================================================
          TABLE
      =========================================================== */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1450px]">

          {/* Continue Part 2 */}
                    <thead>

            <tr className="bg-[#F8F7FF] border-b border-[#ECECF3]">

              <th className="px-5 py-3 text-left text-[13px] font-semibold text-[#233876]">
                #
              </th>

              <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#233876]">
                Vehicle ID
              </th>

              <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#233876]">
                Vehicle No.
              </th>

              <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#233876]">
                Driver Name
              </th>

              <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#233876]">
                Route / Zone
              </th>

              <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#233876] whitespace-nowrap">
                Last Update
              </th>

              <th className="px-4 py-3 text-center text-[13px] font-semibold text-[#233876] whitespace-nowrap">
                Speed (km/h)
              </th>

              <th className="px-4 py-3 text-center text-[13px] font-semibold text-[#233876]">
                Fuel Level
              </th>

              <th className="px-4 py-3 text-center text-[13px] font-semibold text-[#233876] whitespace-nowrap">
                Battery Health
              </th>

              <th className="px-4 py-3 text-center text-[13px] font-semibold text-[#233876]">
                Status
              </th>

              <th className="px-5 py-3 text-center text-[13px] font-semibold text-[#233876]">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {telemetry.map((vehicle) => (

              <tr
                key={vehicle.id}
                className="border-b border-[#F3F4F6] hover:bg-[#FAFAFF] transition"
              >

                <td className="px-5 py-3 text-[13px] whitespace-nowrap">
                  {vehicle.id}
                </td>

                <td className="px-4 py-3 text-[13px] font-semibold text-[#233876] whitespace-nowrap">
                  {vehicle.vehicleId}
                </td>

                <td className="px-4 py-3 text-[13px] whitespace-nowrap">
                  {vehicle.vehicleNo}
                </td>

                <td className="px-4 py-3 text-[13px] whitespace-nowrap">
                  {vehicle.driver}
                </td>

                <td className="px-4 py-3 text-[13px] whitespace-nowrap">
                  {vehicle.route}
                </td>

                <td className="px-4 py-3 text-[13px] whitespace-nowrap text-[#4B5563]">
                  {vehicle.updated}
                </td>

                <td className="px-4 py-3 text-center text-[13px] font-semibold whitespace-nowrap">
                  {vehicle.speed}
                </td>

                <td className="px-4 py-3 text-center text-[13px] font-semibold whitespace-nowrap">
                  {vehicle.fuel}
                </td>

                <td className="px-4 py-3 text-center text-[13px] font-semibold whitespace-nowrap">
                  {vehicle.battery}
                </td>

                <td className="px-4 py-3 text-center">
                  <StatusBadge status={vehicle.status} />
                </td>

                <td className="px-5 py-3 text-center">

                  <button className="w-8 h-8 rounded-lg hover:bg-[#F5F6FA] flex items-center justify-center transition">

                    <MoreHorizontal
                      size={18}
                      className="text-[#233876]"
                    />

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ===========================================================
          FOOTER
      =========================================================== */}

      {/* Continue Part 3 */}
            <div className="flex items-center justify-between px-8 py-4">

        {/* Left */}

        <p className="text-[14px] text-[#6B7280]">

          Showing

          <span className="mx-1 font-semibold text-[#111827]">
            1
          </span>

          to

          <span className="mx-1 font-semibold text-[#111827]">
            5
          </span>

          of

          <span className="mx-1 font-semibold text-[#111827]">
            1,248
          </span>

          vehicles

        </p>

        {/* Pagination */}

        <div className="flex items-center gap-3">

          <button className="w-10 h-10 rounded-xl border-2 border-[#B57CFF] bg-[#FAF5FF] font-semibold text-[#6C2BFF]">
            1
          </button>

          <button className="w-10 h-10 rounded-xl hover:bg-[#F8F7FF] font-semibold text-[#233876] transition">
            2
          </button>

          <button className="w-10 h-10 rounded-xl hover:bg-[#F8F7FF] font-semibold text-[#233876] transition">
            3
          </button>

          <span className="px-1 text-[#6B7280]">
            ...
          </span>

          <button className="w-10 h-10 rounded-xl hover:bg-[#F8F7FF] font-semibold text-[#233876] transition">
            250
          </button>

          <button className="w-10 h-10 rounded-xl hover:bg-[#F8F7FF] flex items-center justify-center transition">

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="#233876"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

          </button>

        </div>

        {/* Rows Per Page */}

        <div className="flex items-center gap-4">

          <span className="text-[14px] text-[#6B7280]">
            Rows per page:
          </span>

          <button className="h-[40px] w-[72px] rounded-xl border border-[#E5E7EB] flex items-center justify-between px-4 hover:border-[#6C2BFF] transition">

            <span className="font-medium text-[#111827]">
              5
            </span>

            <ChevronDown
              size={16}
              className="text-[#6B7280]"
            />

          </button>

        </div>

      </div>

    </section>
  );
}