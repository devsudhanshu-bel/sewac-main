import {
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

/* ===========================================================
   DUMMY DATA
=========================================================== */

const incidents = [
  {
    id: 1,
    vehicleId: "VHC1024",
    vehicleNo: "KA01AB1234",
    driver: "Ramesh Yadav",
    date: "19 May 2025, 08:45 AM",
    mainRoad: "Outer Ring Road",
    crossRoad: "Hebbal Flyover",
    speed: 78,
    limit: 50,
    excess: 28,
    status: "Over Limit",
  },
  {
    id: 2,
    vehicleId: "VHC1045",
    vehicleNo: "KA03CD5678",
    driver: "Suresh B.",
    date: "19 May 2025, 09:12 AM",
    mainRoad: "Tumkur Road",
    crossRoad: "Yeshwanthpur Junction",
    speed: 72,
    limit: 50,
    excess: 22,
    status: "Over Limit",
  },
  {
    id: 3,
    vehicleId: "VHC1056",
    vehicleNo: "KA05EF9012",
    driver: "Mahesh K.",
    date: "19 May 2025, 10:05 AM",
    mainRoad: "Magadi Road",
    crossRoad: "Ullal Junction",
    speed: 75,
    limit: 50,
    excess: 25,
    status: "Over Limit",
  },
  {
    id: 4,
    vehicleId: "VHC1078",
    vehicleNo: "KA02GH3456",
    driver: "Shiva Kumar",
    date: "19 May 2025, 10:32 AM",
    mainRoad: "Mysore Road",
    crossRoad: "Kengeri Signal",
    speed: 70,
    limit: 50,
    excess: 20,
    status: "Over Limit",
  },
  {
    id: 5,
    vehicleId: "VHC1089",
    vehicleNo: "KA04IJ7890",
    driver: "Nagaraj P.",
    date: "19 May 2025, 11:18 AM",
    mainRoad: "Hennur Road",
    crossRoad: "Kalyan Nagar Signal",
    speed: 68,
    limit: 50,
    excess: 18,
    status: "Over Limit",
  },
];

/* ===========================================================
   STATUS BADGE
=========================================================== */

function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-[#FFE9E8] px-3 py-1 text-[12px] font-semibold text-[#EF4444]">
      {status}
    </span>
  );
}

/* ===========================================================
   COMPONENT
=========================================================== */

export default function OverspeedingIncidents() {
  return (
    <section className="bg-white rounded-[30px] border border-[#ECECF3] shadow-sm overflow-hidden">

      {/* ===========================================================
          HEADER
      =========================================================== */}

      <div className="flex items-center justify-between px-8 py-4 border-b border-[#F3F4F6]">

        <div className="flex items-center gap-4">

          <AlertTriangle
            size={22}
            className="text-[#FF4D4F] fill-[#FF4D4F]"
          />

          <h2 className="text-[18px] font-semibold uppercase tracking-wide text-[#111827]">
            Overspeeding Incidents
          </h2>

        </div>

        <button className="h-[38px] min-w-[120px] rounded-xl border border-[#E5E7EB] bg-white px-5 flex items-center justify-between gap-4 hover:border-[#6C2BFF] transition">

          <span className="text-[15px] font-medium text-[#111827]">
            Current
          </span>

          <ChevronDown
            size={18}
            className="text-[#6B7280]"
          />

        </button>

      </div>

      {/* ===========================================================
          TABLE
      =========================================================== */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1280px]">

          {/* Continue Part 2 */}
                    <thead>

            <tr className="bg-[#F8F7FF] border-b border-[#ECECF3]">

              <th className="px-6 py-3 text-left text-[13px] font-semibold text-[#233876]">
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
                Date & Time
              </th>

              <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#233876]">
                Main Road
              </th>

              <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#233876]">
                Cross Road
              </th>

              <th className="px-4 py-3 text-center text-[13px] font-semibold text-[#233876] whitespace-nowrap">
                Speed Flagged (km/h)
              </th>

              <th className="px-4 py-3 text-center text-[13px] font-semibold text-[#233876] whitespace-nowrap">
                Speed Limit (km/h)
              </th>

              <th className="px-4 py-3 text-center text-[13px] font-semibold text-[#233876] whitespace-nowrap">
                Excess Speed (km/h)
              </th>

              <th className="px-6 py-3 text-center text-[13px] font-semibold text-[#233876]">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {incidents.map((incident) => (

              <tr
                key={incident.id}
                className="border-b border-[#F3F4F6] hover:bg-[#FAFAFF] transition-colors"
              >

                <td className="px-6 py-3 text-[12px] text-[#111827]">
                  {incident.id}
                </td>

                <td className="px-3 py-3 text-[12px] font-medium text-[#233876]">
                  {incident.vehicleId}
                </td>

                <td className="px-3 py-3 text-[12px] text-[#111827]">
                  {incident.vehicleNo}
                </td>

                <td className="px-3 py-3 text-[12px] text-[#111827]">
                  {incident.driver}
                </td>

                <td className="px-3 py-3 text-[12px] text-[#4B5563] whitespace-nowrap">
                  {incident.date}
                </td>

                <td className="px-3 py-3 text-[12px] text-[#111827]">
                  {incident.mainRoad}
                </td>

                <td className="px-3 py-3 text-[12px] text-[#111827]">
                  {incident.crossRoad}
                </td>

                <td className="px-3 py-3 text-center text-[12px] font-semibold text-[#111827]">
                  {incident.speed}
                </td>

                <td className="px-3 py-3 text-center text-[12px] font-semibold text-[#111827]">
                  {incident.limit}
                </td>

                <td className="px-3 py-3 text-center text-[12px] font-semibold text-[#111827]">
                  {incident.excess}
                </td>

                <td className="px-6 py-3 text-center">
                  <StatusBadge status={incident.status} />
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

        <p className="text-[15px] text-[#6B7280]">

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
            124
          </span>

          incidents

        </p>

        {/* Center Pagination */}

        <div className="flex items-center gap-3">

          <button className="w-11 h-11 rounded-xl border-2 border-[#B57CFF] text-[#6C2BFF] font-semibold bg-[#FAF5FF]">
            1
          </button>

          <button className="w-11 h-11 rounded-xl hover:bg-[#F8F7FF] font-semibold text-[#233876] transition">
            2
          </button>

          <button className="w-11 h-11 rounded-xl hover:bg-[#F8F7FF] font-semibold text-[#233876] transition">
            3
          </button>

          <span className="px-2 text-[#6B7280]">
            ...
          </span>

          <button className="w-11 h-11 rounded-xl hover:bg-[#F8F7FF] font-semibold text-[#233876] transition">
            25
          </button>

          <button className="w-11 h-11 rounded-xl hover:bg-[#F8F7FF] flex items-center justify-center transition">

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

        {/* Right */}

        <div className="flex items-center gap-4">

          <span className="text-[15px] text-[#6B7280]">
            Rows per page:
          </span>

          <button className="h-[38px] w-[72px] rounded-xl border border-[#E5E7EB] flex items-center justify-between px-4 hover:border-[#6C2BFF] transition">

            <span className="font-medium text-[#111827]">
              5
            </span>

            <ChevronDown
              size={18}
              className="text-[#6B7280]"
            />

          </button>

        </div>

      </div>

    </section>
  );
}