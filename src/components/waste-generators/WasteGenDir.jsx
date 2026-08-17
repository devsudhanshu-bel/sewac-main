import {
  Search,
  RefreshCw,
  Pencil,
} from "lucide-react";
import { useState } from "react";

export default function WasteGeneratorDirectory({
  citizens = [],
  onUpdate,
  onSync,
  syncing = false,
}) {
  const [search, setSearch] = useState("");

  const filteredCitizens = citizens.filter((citizen) => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) return true;

    return (
      citizen.personName?.toLowerCase().includes(searchValue) ||
      citizen.phoneNumber?.toLowerCase().includes(searchValue) ||
      citizen.wetRFID?.toLowerCase().includes(searchValue) ||
      citizen.dryRFID?.toLowerCase().includes(searchValue) ||
      citizen.area?.toLowerCase().includes(searchValue) ||
      citizen.ward?.toString().toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="px-8 py-6 border-b border-gray-200">

        <div className="flex items-center justify-between gap-6">

          {/* Title */}

          <div>
            <h2 className="text-[24px] font-bold text-[#0B2A66]">
              Waste Generators Directory
            </h2>

            <p className="mt-1 text-[14px] text-[#667085]">
              View and manage waste generators based on their waste
              contribution and activity.
            </p>
          </div>

          {/* =================================================
              SEARCH + SYNC
          ================================================= */}

          <div className="flex items-center gap-4">

            {/* Search */}

            <div className="relative w-[375px]">

              <Search
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#8FA1C1]
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone number, Wet RFID"
                className="
                  w-full
                  h-[52px]
                  pl-12
                  pr-4
                  rounded-xl
                  border
                  border-[#E2E7F0]
                  bg-white
                  text-[14px]
                  text-gray-800
                  outline-none
                  placeholder:text-[#8FA1C1]
                  focus:border-violet-400
                  focus:ring-2
                  focus:ring-violet-100
                  transition
                "
              />

            </div>

            {/* =================================================
                SYNC BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={onSync}
              disabled={syncing}
              className="
                h-[52px]
                min-w-[125px]
                px-6
                rounded-xl
                bg-[#6D28D9]
                text-white
                text-[14px]
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
                hover:bg-[#5B21B6]
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >

              <RefreshCw
                size={18}
                className={syncing ? "animate-spin" : ""}
              />

              {syncing ? "Syncing..." : "Sync"}

            </button>

          </div>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-x-auto">

        <table className="w-full border-collapse">

          {/* =================================================
              TABLE HEADER
          ================================================= */}

          <thead>

            <tr className="bg-[#F8F8FC] border-b border-gray-200">

              <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#263A63]">
                #
              </th>

              <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#263A63]">
                Name
              </th>

              <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#263A63]">
                Phone Number
              </th>

              <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#263A63]">
                Wet RFID
              </th>

              <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#263A63]">
                Dry RFID
              </th>

              <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#263A63]">
                Ward / Area
              </th>

              <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#263A63]">
                Zone
              </th>

              <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#263A63]">
                Total Waste
              </th>

              <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#263A63]">
                Average Waste
              </th>

              <th className="px-5 py-4 text-center text-[13px] font-semibold text-[#263A63]">
                Action
              </th>

            </tr>

          </thead>

          {/* =================================================
              TABLE BODY
          ================================================= */}

          <tbody>

            {filteredCitizens.length === 0 ? (

              <tr>

                <td
                  colSpan={10}
                  className="
                    px-6
                    py-12
                    text-center
                    text-[14px]
                    text-gray-500
                  "
                >
                  No waste generators found.
                </td>

              </tr>

            ) : (

              filteredCitizens.map((citizen, index) => (

                <tr
                  key={
                    citizen.id ??
                    citizen.phoneNumber ??
                    index
                  }
                  className="
                    border-b
                    border-gray-100
                    hover:bg-[#FAFAFF]
                    transition
                  "
                >

                  {/* # */}

                  <td className="px-5 py-5 text-[13px] text-gray-600">
                    {index + 1}
                  </td>

                  {/* Name */}

                  <td className="px-5 py-5">

                    <div className="flex flex-col">

                      <span className="text-[14px] font-semibold text-gray-800">
                        {citizen.personName || "N/A"}
                      </span>

                    </div>

                  </td>

                  {/* Phone */}

                  <td className="px-5 py-5 text-[13px] text-gray-600">
                    {citizen.phoneNumber || "N/A"}
                  </td>

                  {/* Wet RFID */}

                  <td className="px-5 py-5">

                    <span className="
                      inline-flex
                      px-3
                      py-1
                      rounded-lg
                      bg-blue-50
                      text-blue-600
                      text-[12px]
                      font-medium
                    ">
                      {citizen.wetRFID || "Not Assigned"}
                    </span>

                  </td>

                  {/* Dry RFID */}

                  <td className="px-5 py-5">

                    <span className="
                      inline-flex
                      px-3
                      py-1
                      rounded-lg
                      bg-orange-50
                      text-orange-600
                      text-[12px]
                      font-medium
                    ">
                      {citizen.dryRFID || "Not Assigned"}
                    </span>

                  </td>

                  {/* Ward / Area */}

                  <td className="px-5 py-5">

                    <div className="flex flex-col">

                      <span className="text-[13px] font-medium text-gray-700">
                        {citizen.ward || "N/A"}
                      </span>

                      <span className="text-[12px] text-gray-400">
                        {citizen.area || "N/A"}
                      </span>

                    </div>

                  </td>

                  {/* Zone */}

                  <td className="px-5 py-5 text-[13px] text-gray-600">
                    {citizen.zone || "N/A"}
                  </td>

                  {/* Total Waste */}

                  <td className="px-5 py-5">

                    <span className="text-[14px] font-semibold text-gray-800">
                      {citizen.totalWasteCollected ??
                        citizen.totalWaste ??
                        0}
                    </span>

                    <span className="ml-1 text-[11px] text-gray-400">
                      kg
                    </span>

                  </td>

                  {/* Average Waste */}

                  <td className="px-5 py-5">

                    <span className="text-[14px] font-semibold text-gray-800">
                      {citizen.averageWaste ??
                        citizen.avgWaste ??
                        0}
                    </span>

                    <span className="ml-1 text-[11px] text-gray-400">
                      kg
                    </span>

                  </td>

                  {/* UPDATE ONLY */}

                  <td className="px-5 py-5 text-center">

                    <button
                      type="button"
                      onClick={() => onUpdate?.(citizen)}
                      className="
                        w-9
                        h-9
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        mx-auto
                        text-violet-600
                        hover:bg-violet-50
                        transition
                      "
                      title="Update Waste Generator"
                    >
                      <Pencil size={17} />
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="
        px-6
        py-4
        border-t
        border-gray-100
        flex
        items-center
        justify-between
      ">

        <p className="text-[13px] text-gray-500">

          Showing{" "}

          <span className="font-semibold text-gray-700">
            {filteredCitizens.length}
          </span>{" "}

          waste generators

        </p>

      </div>

    </div>
  );
}