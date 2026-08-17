import {
  Search,
  RefreshCw,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useMemo } from "react";

export default function WasteGeneratorDirectory({
  citizens = [],

  search = "",

  onSearch,

  onUpdate,

  onSync,

  syncing = false,

  loading = false,

  page = 1,

  pageSize = 10,

  total = 0,

  totalPages = 0,

  onPageChange,

  onPageSizeChange,
}) {
  /*
  |--------------------------------------------------------------------------
  | PAGE NUMBERS
  |--------------------------------------------------------------------------
  |
  | We don't render hundreds of page buttons.
  |
  | Example:
  |
  | 1 2 3 ... 73 74 75
  |--------------------------------------------------------------------------
  */

  const pageNumbers = useMemo(() => {
    if (totalPages <= 0) {
      return [];
    }

    /*
      |--------------------------------------------------------------------------
      | Small number of pages
      |--------------------------------------------------------------------------
      */

    if (totalPages <= 7) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1,
      );
    }

    /*
      |--------------------------------------------------------------------------
      | Large number of pages
      |--------------------------------------------------------------------------
      */

    const pages = [];

    pages.push(1);

    if (page > 4) {
      pages.push("...");
    }

    const start = Math.max(2, page - 1);

    const end = Math.min(totalPages - 1, page + 1);

    for (let number = start; number <= end; number++) {
      pages.push(number);
    }

    if (page < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }, [page, totalPages]);

  /*
  |--------------------------------------------------------------------------
  | DISPLAY RANGE
  |--------------------------------------------------------------------------
  */

  const startRecord = total === 0 ? 0 : (page - 1) * pageSize + 1;

  const endRecord = total === 0 ? 0 : Math.min(page * pageSize, total);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="
        mt-8
        bg-white
        rounded-2xl
        border
        border-gray-200
        shadow-sm
        overflow-hidden
      "
    >
      {/* ================================================================ */}
      {/* HEADER                                                           */}
      {/* ================================================================ */}

      <div
        className="
          px-8
          py-6
          border-b
          border-gray-200
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-6
          "
        >
          {/* ========================================================== */}
          {/* TITLE                                                       */}
          {/* ========================================================== */}

          <div>
            <h2
              className="
                text-[24px]
                font-bold
                text-[#0B2A66]
              "
            >
              Waste Generators Directory
            </h2>

            <p
              className="
                mt-1
                text-[14px]
                text-[#667085]
              "
            >
              View and manage waste generators based on registered citizen
              information.
            </p>
          </div>

          {/* ========================================================== */}
          {/* SEARCH + SYNC                                               */}
          {/* ========================================================== */}

          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            {/* ======================================================== */}
            {/* SEARCH                                                     */}
            {/* ======================================================== */}

            <div
              className="
                relative
                w-[375px]
              "
            >
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
                onChange={(event) => onSearch?.(event.target.value)}
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
                "
              />
            </div>

            {/* ======================================================== */}
            {/* SYNC                                                       */}
            {/* ======================================================== */}

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
              <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />

              {syncing ? "Syncing..." : "Sync"}
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* TABLE                                                            */}
      {/* ================================================================ */}

      <div
        className="
          overflow-x-auto
        "
      >
        <table
          className="
            w-full
            border-collapse
          "
        >
          {/* ========================================================== */}
          {/* TABLE HEADER                                                 */}
          {/* ========================================================== */}

          <thead>
            <tr
              className="
                bg-[#F8F8FC]
                border-b
                border-gray-200
              "
            >
              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-[13px]
                  font-semibold
                  text-[#263A63]
                "
              >
                #
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-[13px]
                  font-semibold
                  text-[#263A63]
                "
              >
                Name
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-[13px]
                  font-semibold
                  text-[#263A63]
                "
              >
                Phone Number
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-[13px]
                  font-semibold
                  text-[#263A63]
                "
              >
                Wet RFID
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-[13px]
                  font-semibold
                  text-[#263A63]
                "
              >
                Dry RFID
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-[13px]
                  font-semibold
                  text-[#263A63]
                "
              >
                Ward / Area
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-[13px]
                  font-semibold
                  text-[#263A63]
                "
              >
                Zone
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-[13px]
                  font-semibold
                  text-[#263A63]
                "
              >
                Total Waste
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-left
                  text-[13px]
                  font-semibold
                  text-[#263A63]
                "
              >
                Average Waste
              </th>

              <th
                className="
                  px-5
                  py-4
                  text-center
                  text-[13px]
                  font-semibold
                  text-[#263A63]
                "
              >
                Action
              </th>
            </tr>
          </thead>

          {/* ========================================================== */}
          {/* TABLE BODY                                                   */}
          {/* ========================================================== */}

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={10}
                  className="
                    px-6
                    py-14
                    text-center
                    text-[14px]
                    text-gray-500
                  "
                >
                  Loading waste generators...
                </td>
              </tr>
            ) : citizens.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="
                    px-6
                    py-14
                    text-center
                    text-[14px]
                    text-gray-500
                  "
                >
                  {search.trim()
                    ? "No waste generators found for this search."
                    : "No waste generators found."}
                </td>
              </tr>
            ) : (
              citizens.map((citizen, index) => (
                <tr
                  key={
                    citizen.id ??
                    citizen.phoneNumber ??
                    `${citizen.wardNo}-${index}`
                  }
                  className="
                      border-b
                      border-gray-100
                      hover:bg-[#FAFAFF]
                      transition
                    "
                >
                  {/* ==================================================
                        #
                    ================================================== */}

                  <td
                    className="
                        px-5
                        py-5
                        text-[13px]
                        text-gray-600
                      "
                  >
                    {(page - 1) * pageSize + index + 1}
                  </td>

                  {/* ==================================================
                        NAME
                    ================================================== */}

                  <td
                    className="
                        px-5
                        py-5
                      "
                  >
                    <span
                      className="
                          text-[14px]
                          font-semibold
                          text-gray-800
                        "
                    >
                      {citizen.personName || "N/A"}
                    </span>
                  </td>

                  {/* ==================================================
                        PHONE
                    ================================================== */}

                  <td
                    className="
                        px-5
                        py-5
                        text-[13px]
                        text-gray-600
                      "
                  >
                    {citizen.phoneNumber || citizen.contactNumber || "N/A"}
                  </td>

                  {/* ==================================================
                        WET RFID
                    ================================================== */}

                  <td
                    className="
                        px-5
                        py-5
                      "
                  >
                    <span
                      className="
                          inline-flex
                          px-3
                          py-1
                          rounded-lg
                          bg-blue-50
                          text-blue-600
                          text-[12px]
                          font-medium
                        "
                    >
                      {citizen.wetRFID || "Not Assigned"}
                    </span>
                  </td>

                  {/* ==================================================
                        DRY RFID
                    ================================================== */}

                  <td
                    className="
                        px-5
                        py-5
                      "
                  >
                    <span
                      className="
                          inline-flex
                          px-3
                          py-1
                          rounded-lg
                          bg-orange-50
                          text-orange-600
                          text-[12px]
                          font-medium
                        "
                    >
                      {citizen.dryRFID || "Not Assigned"}
                    </span>
                  </td>

                  {/* ==================================================
                        WARD / AREA
                    ================================================== */}

                  <td
                    className="
                        px-5
                        py-5
                      "
                  >
                    <div
                      className="
                          flex
                          flex-col
                        "
                    >
                      <span
                        className="
                            text-[13px]
                            font-medium
                            text-gray-700
                          "
                      >
                        {citizen.wardName ||
                          (citizen.wardNo !== null &&
                          citizen.wardNo !== undefined
                            ? `Ward ${citizen.wardNo}`
                            : "N/A")}
                      </span>

                      <span
                        className="
                            text-[12px]
                            text-gray-400
                          "
                      >
                        {citizen.area || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* ==================================================
                        ZONE
                    ================================================== */}

                  <td
                    className="
                        px-5
                        py-5
                        text-[13px]
                        text-gray-600
                      "
                  >
                    {citizen.zoneName || "N/A"}
                  </td>

                  {/* ==================================================
                        TOTAL WASTE
                    ================================================== */}

                  <td
                    className="
                        px-5
                        py-5
                      "
                  >
                    <span
                      className="
                          text-[14px]
                          font-semibold
                          text-gray-800
                        "
                    >
                      {citizen.totalWaste ??
                        citizen.totalWasteCollected ??
                        "N/A"}
                    </span>

                    {(citizen.totalWaste !== undefined ||
                      citizen.totalWasteCollected !== undefined) && (
                      <span
                        className="
                            ml-1
                            text-[11px]
                            text-gray-400
                          "
                      >
                        kg
                      </span>
                    )}
                  </td>

                  {/* ==================================================
                        AVERAGE WASTE
                    ================================================== */}

                  <td
                    className="
                        px-5
                        py-5
                      "
                  >
                    <span
                      className="
                          text-[14px]
                          font-semibold
                          text-gray-800
                        "
                    >
                      {citizen.averageWaste ?? citizen.avgWaste ?? "N/A"}
                    </span>

                    {(citizen.averageWaste !== undefined ||
                      citizen.avgWaste !== undefined) && (
                      <span
                        className="
                            ml-1
                            text-[11px]
                            text-gray-400
                          "
                      >
                        kg
                      </span>
                    )}
                  </td>

                  {/* ==================================================
                        UPDATE
                    ================================================== */}

                  <td
                    className="
                        px-5
                        py-5
                        text-center
                      "
                  >
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

      {/* ================================================================ */}
      {/* PAGINATION FOOTER                                               */}
      {/* ================================================================ */}

      <div
        className="
          px-6
          py-4
          border-t
          border-gray-100
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        "
      >
        {/* ============================================================ */}
        {/* RESULT COUNT                                                  */}
        {/* ============================================================ */}

        <p
          className="
            text-[13px]
            text-gray-500
          "
        >
          Showing{" "}
          <span
            className="
              font-semibold
              text-gray-700
            "
          >
            {startRecord}
          </span>
          {" – "}
          <span
            className="
              font-semibold
              text-gray-700
            "
          >
            {endRecord}
          </span>
          {" of "}
          <span
            className="
              font-semibold
              text-gray-700
            "
          >
            {total}
          </span>{" "}
          waste generators
        </p>

        {/* ============================================================ */}
        {/* PAGINATION CONTROLS                                           */}
        {/* ============================================================ */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          {/* ========================================================== */}
          {/* ROWS PER PAGE                                               */}
          {/* ========================================================== */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                text-[13px]
                text-gray-500
                whitespace-nowrap
              "
            >
              Rows:
            </span>

            <select
              value={pageSize}
              onChange={(event) =>
                onPageSizeChange?.(Number(event.target.value))
              }
              className="
                h-9
                px-3
                rounded-lg
                border
                border-gray-200
                bg-white
                text-[13px]
                text-gray-700
                outline-none
                focus:border-violet-400
              "
            >
              <option value={10}>10</option>

              <option value={20}>20</option>

              <option value={50}>50</option>
            </select>
          </div>

          {/* ========================================================== */}
          {/* PREVIOUS                                                    */}
          {/* ========================================================== */}

          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange?.(page - 1)}
            className="
              w-9
              h-9
              rounded-lg
              border
              border-gray-200
              flex
              items-center
              justify-center
              text-gray-600
              hover:bg-gray-50
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
            title="Previous page"
          >
            <ChevronLeft size={17} />
          </button>

          {/* ========================================================== */}
          {/* PAGE NUMBERS                                                 */}
          {/* ========================================================== */}

          <div
            className="
              flex
              items-center
              gap-1
            "
          >
            {pageNumbers.map((pageNumber, index) =>
              pageNumber === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="
                      w-8
                      text-center
                      text-[13px]
                      text-gray-400
                    "
                >
                  ...
                </span>
              ) : (
                <button
                  key={pageNumber}
                  type="button"
                  disabled={loading}
                  onClick={() => onPageChange?.(pageNumber)}
                  className={`
                      w-9
                      h-9
                      rounded-lg
                      text-[13px]
                      font-medium
                      transition
                      ${
                        pageNumber === page
                          ? "bg-[#6D28D9] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }
                    `}
                >
                  {pageNumber}
                </button>
              ),
            )}
          </div>

          {/* ========================================================== */}
          {/* NEXT                                                         */}
          {/* ========================================================== */}

          <button
            type="button"
            disabled={page >= totalPages || loading || totalPages === 0}
            onClick={() => onPageChange?.(page + 1)}
            className="
              w-9
              h-9
              rounded-lg
              border
              border-gray-200
              flex
              items-center
              justify-center
              text-gray-600
              hover:bg-gray-50
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
            title="Next page"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
