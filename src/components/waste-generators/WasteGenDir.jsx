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
  */

  const pageNumbers = useMemo(() => {
    if (totalPages <= 0) {
      return [];
    }

    if (totalPages <= 7) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1,
      );
    }

    const pages = [];

    pages.push(1);

    if (page > 4) {
      pages.push("...");
    }

    const start = Math.max(2, page - 1);

    const end = Math.min(
      totalPages - 1,
      page + 1,
    );

    for (
      let number = start;
      number <= end;
      number++
    ) {
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

  const startRecord =
    total === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const endRecord =
    total === 0
      ? 0
      : Math.min(
          page * pageSize,
          total,
        );

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="
        mt-5
        sm:mt-6
        lg:mt-8

        bg-white

        rounded-2xl

        border
        border-gray-200

        shadow-sm

        overflow-hidden

        w-full
        min-w-0
      "
    >
      {/* ================================================================ */}
      {/* HEADER                                                           */}
      {/* ================================================================ */}

      <div
        className="
          px-4
          sm:px-5
          lg:px-8

          py-4
          sm:py-5
          lg:py-6

          border-b
          border-gray-200

          w-full
          min-w-0
        "
      >
        <div
          className="
            flex
            flex-col
            xl:flex-row

            xl:items-center
            xl:justify-between

            gap-4
            lg:gap-5
            xl:gap-6

            w-full
            min-w-0
          "
        >
          {/* ========================================================== */}
          {/* TITLE                                                       */}
          {/* ========================================================== */}

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <h2
              className="
                text-[19px]
                sm:text-[21px]
                lg:text-[24px]

                font-bold

                text-[#0B2A66]

                leading-tight
              "
            >
              Waste Generators Directory
            </h2>

            <p
              className="
                mt-1

                text-[11px]
                sm:text-[12px]
                lg:text-[14px]

                leading-5

                text-[#667085]

                max-w-[720px]
              "
            >
              View and manage waste generators based on
              registered citizen information.
            </p>
          </div>

          {/* ========================================================== */}
          {/* SEARCH + SYNC                                               */}
          {/* ========================================================== */}

          <div
            className="
              flex
              flex-col
              sm:flex-row

              items-stretch
              sm:items-center

              gap-3
              sm:gap-3
              lg:gap-4

              w-full
              xl:w-auto

              shrink-0
            "
          >
            {/* ======================================================== */}
            {/* SEARCH                                                     */}
            {/* ======================================================== */}

            <div
              className="
                relative

                w-full
                sm:flex-1
                xl:w-[320px]
                2xl:w-[375px]

                min-w-0
              "
            >
              <Search
                size={18}
                className="
                  absolute
                  left-3.5
                  sm:left-4

                  top-1/2
                  -translate-y-1/2

                  text-[#8FA1C1]

                  pointer-events-none
                "
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  onSearch?.(
                    event.target.value,
                  )
                }
                placeholder="Search by name, phone number, Wet RFID"
                className="
                  w-full

                  h-[44px]
                  sm:h-[48px]
                  lg:h-[52px]

                  pl-10
                  sm:pl-12

                  pr-3
                  sm:pr-4

                  rounded-xl

                  border
                  border-[#E2E7F0]

                  bg-white

                  text-[12px]
                  sm:text-[13px]
                  lg:text-[14px]

                  text-gray-800

                  outline-none

                  placeholder:text-[#8FA1C1]

                  focus:border-violet-400

                  transition
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
                h-[44px]
                sm:h-[48px]
                lg:h-[52px]

                w-full
                sm:w-auto

                min-w-0
                sm:min-w-[105px]
                lg:min-w-[125px]

                px-5
                lg:px-6

                rounded-xl

                bg-[#6D28D9]

                text-white

                text-[12px]
                sm:text-[13px]
                lg:text-[14px]

                font-semibold

                flex
                items-center
                justify-center

                gap-2

                transition

                hover:bg-[#5B21B6]

                disabled:opacity-60
                disabled:cursor-not-allowed

                shrink-0
              "
            >
              <RefreshCw
                size={17}
                className={
                  syncing
                    ? "animate-spin"
                    : ""
                }
              />

              {syncing
                ? "Syncing..."
                : "Sync"}
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* TABLE                                                            */}
      {/* ================================================================ */}

      <div
        className="
          w-full

          overflow-x-auto
          overflow-y-hidden

          scrollbar-thin
        "
      >
        <table
          className="
            w-full
            min-w-[1180px]

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
                  px-4
                  sm:px-5

                  py-3
                  sm:py-4

                  text-left

                  text-[11px]
                  sm:text-[12px]
                  lg:text-[13px]

                  font-semibold

                  text-[#263A63]

                  whitespace-nowrap
                "
              >
                #
              </th>

              <th
                className="
                  px-4
                  sm:px-5
                  py-3
                  sm:py-4

                  text-left

                  text-[11px]
                  sm:text-[12px]
                  lg:text-[13px]

                  font-semibold

                  text-[#263A63]

                  whitespace-nowrap
                "
              >
                Name
              </th>

              <th
                className="
                  px-4
                  sm:px-5
                  py-3
                  sm:py-4

                  text-left

                  text-[11px]
                  sm:text-[12px]
                  lg:text-[13px]

                  font-semibold

                  text-[#263A63]

                  whitespace-nowrap
                "
              >
                Phone Number
              </th>

              <th
                className="
                  px-4
                  sm:px-5
                  py-3
                  sm:py-4

                  text-left

                  text-[11px]
                  sm:text-[12px]
                  lg:text-[13px]

                  font-semibold

                  text-[#263A63]

                  whitespace-nowrap
                "
              >
                Wet RFID
              </th>

              <th
                className="
                  px-4
                  sm:px-5
                  py-3
                  sm:py-4

                  text-left

                  text-[11px]
                  sm:text-[12px]
                  lg:text-[13px]

                  font-semibold

                  text-[#263A63]

                  whitespace-nowrap
                "
              >
                Dry RFID
              </th>

              <th
                className="
                  px-4
                  sm:px-5
                  py-3
                  sm:py-4

                  text-left

                  text-[11px]
                  sm:text-[12px]
                  lg:text-[13px]

                  font-semibold

                  text-[#263A63]

                  whitespace-nowrap
                "
              >
                Ward / Area
              </th>

              <th
                className="
                  px-4
                  sm:px-5
                  py-3
                  sm:py-4

                  text-left

                  text-[11px]
                  sm:text-[12px]
                  lg:text-[13px]

                  font-semibold

                  text-[#263A63]

                  whitespace-nowrap
                "
              >
                Zone
              </th>

              <th
                className="
                  px-4
                  sm:px-5
                  py-3
                  sm:py-4

                  text-left

                  text-[11px]
                  sm:text-[12px]
                  lg:text-[13px]

                  font-semibold

                  text-[#263A63]

                  whitespace-nowrap
                "
              >
                Total Waste
              </th>

              <th
                className="
                  px-4
                  sm:px-5
                  py-3
                  sm:py-4

                  text-left

                  text-[11px]
                  sm:text-[12px]
                  lg:text-[13px]

                  font-semibold

                  text-[#263A63]

                  whitespace-nowrap
                "
              >
                Average Waste
              </th>

              <th
                className="
                  px-4
                  sm:px-5
                  py-3
                  sm:py-4

                  text-center

                  text-[11px]
                  sm:text-[12px]
                  lg:text-[13px]

                  font-semibold

                  text-[#263A63]

                  whitespace-nowrap
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
                    py-12
                    sm:py-14

                    text-center

                    text-[12px]
                    sm:text-[14px]

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
                    py-12
                    sm:py-14

                    text-center

                    text-[12px]
                    sm:text-[14px]

                    text-gray-500
                  "
                >
                  {search.trim()
                    ? "No waste generators found for this search."
                    : "No waste generators found."}
                </td>
              </tr>
            ) : (
              citizens.map(
                (citizen, index) => (
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
                        px-4
                        sm:px-5

                        py-4
                        sm:py-5

                        text-[12px]
                        sm:text-[13px]

                        text-gray-600

                        whitespace-nowrap
                      "
                    >
                      {(page - 1) *
                        pageSize +
                        index +
                        1}
                    </td>

                    {/* ==================================================
                        NAME
                    ================================================== */}

                    <td
                      className="
                        px-4
                        sm:px-5

                        py-4
                        sm:py-5
                      "
                    >
                      <span
                        className="
                          text-[12px]
                          sm:text-[14px]

                          font-semibold

                          text-gray-800

                          whitespace-nowrap
                        "
                      >
                        {citizen.personName ||
                          "N/A"}
                      </span>
                    </td>

                    {/* ==================================================
                        PHONE
                    ================================================== */}

                    <td
                      className="
                        px-4
                        sm:px-5

                        py-4
                        sm:py-5

                        text-[12px]
                        sm:text-[13px]

                        text-gray-600

                        whitespace-nowrap
                      "
                    >
                      {citizen.phoneNumber ||
                        citizen.contactNumber ||
                        "N/A"}
                    </td>

                    {/* ==================================================
                        WET RFID
                    ================================================== */}

                    <td
                      className="
                        px-4
                        sm:px-5

                        py-4
                        sm:py-5
                      "
                    >
                      <span
                        className="
                          inline-flex

                          px-2.5
                          sm:px-3

                          py-1

                          rounded-lg

                          bg-blue-50

                          text-blue-600

                          text-[10px]
                          sm:text-[12px]

                          font-medium

                          whitespace-nowrap
                        "
                      >
                        {citizen.wetRFID ||
                          "Not Assigned"}
                      </span>
                    </td>

                    {/* ==================================================
                        DRY RFID
                    ================================================== */}

                    <td
                      className="
                        px-4
                        sm:px-5

                        py-4
                        sm:py-5
                      "
                    >
                      <span
                        className="
                          inline-flex

                          px-2.5
                          sm:px-3

                          py-1

                          rounded-lg

                          bg-orange-50

                          text-orange-600

                          text-[10px]
                          sm:text-[12px]

                          font-medium

                          whitespace-nowrap
                        "
                      >
                        {citizen.dryRFID ||
                          "Not Assigned"}
                      </span>
                    </td>

                    {/* ==================================================
                        WARD / AREA
                    ================================================== */}

                    <td
                      className="
                        px-4
                        sm:px-5

                        py-4
                        sm:py-5
                      "
                    >
                      <div
                        className="
                          flex
                          flex-col

                          min-w-[120px]
                        "
                      >
                        <span
                          className="
                            text-[12px]
                            sm:text-[13px]

                            font-medium

                            text-gray-700

                            whitespace-nowrap
                          "
                        >
                          {citizen.wardName ||
                            (citizen.wardNo !==
                              null &&
                            citizen.wardNo !==
                              undefined
                              ? `Ward ${citizen.wardNo}`
                              : "N/A")}
                        </span>

                        <span
                          className="
                            text-[10px]
                            sm:text-[12px]

                            text-gray-400

                            whitespace-nowrap
                          "
                        >
                          {citizen.area ||
                            "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* ==================================================
                        ZONE
                    ================================================== */}

                    <td
                      className="
                        px-4
                        sm:px-5

                        py-4
                        sm:py-5

                        text-[12px]
                        sm:text-[13px]

                        text-gray-600

                        whitespace-nowrap
                      "
                    >
                      {citizen.zoneName ||
                        "N/A"}
                    </td>

                    {/* ==================================================
                        TOTAL WASTE
                    ================================================== */}

                    <td
                      className="
                        px-4
                        sm:px-5

                        py-4
                        sm:py-5
                      "
                    >
                      <span
                        className="
                          text-[12px]
                          sm:text-[14px]

                          font-semibold

                          text-gray-800

                          whitespace-nowrap
                        "
                      >
                        {citizen.totalWaste ??
                          citizen.totalWasteCollected ??
                          "N/A"}
                      </span>

                      {(
                        citizen.totalWaste !==
                          undefined ||
                        citizen.totalWasteCollected !==
                          undefined
                      ) && (
                        <span
                          className="
                            ml-1

                            text-[9px]
                            sm:text-[11px]

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
                        px-4
                        sm:px-5

                        py-4
                        sm:py-5
                      "
                    >
                      <span
                        className="
                          text-[12px]
                          sm:text-[14px]

                          font-semibold

                          text-gray-800

                          whitespace-nowrap
                        "
                      >
                        {citizen.averageWaste ??
                          citizen.avgWaste ??
                          "N/A"}
                      </span>

                      {(
                        citizen.averageWaste !==
                          undefined ||
                        citizen.avgWaste !==
                          undefined
                      ) && (
                        <span
                          className="
                            ml-1

                            text-[9px]
                            sm:text-[11px]

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
                        px-4
                        sm:px-5

                        py-4
                        sm:py-5

                        text-center
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          onUpdate?.(
                            citizen,
                          )
                        }
                        className="
                          w-8
                          h-8
                          sm:w-9
                          sm:h-9

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
                        <Pencil
                          size={16}
                        />
                      </button>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>

      {/* ================================================================ */}
      {/* PAGINATION FOOTER                                               */}
      {/* ================================================================ */}

      <div
        className="
          px-4
          sm:px-5
          lg:px-6

          py-4

          border-t
          border-gray-100

          flex
          flex-col

          lg:flex-row

          lg:items-center
          lg:justify-between

          gap-4

          min-w-0
        "
      >
        {/* ============================================================ */}
        {/* RESULT COUNT                                                  */}
        {/* ============================================================ */}

        <p
          className="
            text-[11px]
            sm:text-[12px]
            lg:text-[13px]

            text-gray-500

            whitespace-nowrap
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
            flex-wrap

            items-center

            gap-2
            sm:gap-3

            min-w-0
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
                text-[11px]
                sm:text-[13px]

                text-gray-500

                whitespace-nowrap
              "
            >
              Rows:
            </span>

            <select
              value={pageSize}
              onChange={(event) =>
                onPageSizeChange?.(
                  Number(
                    event.target.value,
                  ),
                )
              }
              className="
                h-8
                sm:h-9

                px-2
                sm:px-3

                rounded-lg

                border
                border-gray-200

                bg-white

                text-[11px]
                sm:text-[13px]

                text-gray-700

                outline-none

                focus:border-violet-400
              "
            >
              <option value={10}>
                10
              </option>

              <option value={20}>
                20
              </option>

              <option value={50}>
                50
              </option>
            </select>
          </div>

          {/* ========================================================== */}
          {/* PREVIOUS                                                    */}
          {/* ========================================================== */}

          <button
            type="button"
            disabled={
              page <= 1 ||
              loading
            }
            onClick={() =>
              onPageChange?.(
                page - 1,
              )
            }
            className="
              w-8
              h-8
              sm:w-9
              sm:h-9

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

              shrink-0
            "
            title="Previous page"
          >
            <ChevronLeft
              size={16}
            />
          </button>

          {/* ========================================================== */}
          {/* PAGE NUMBERS                                                 */}
          {/* ========================================================== */}

          <div
            className="
              flex
              items-center
              gap-1

              overflow-x-auto
              max-w-[220px]
              sm:max-w-none

              scrollbar-none
            "
          >
            {pageNumbers.map(
              (
                pageNumber,
                index,
              ) =>
                pageNumber ===
                "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="
                      w-7
                      sm:w-8

                      text-center

                      text-[11px]
                      sm:text-[13px]

                      text-gray-400

                      shrink-0
                    "
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={
                      pageNumber
                    }
                    type="button"
                    disabled={
                      loading
                    }
                    onClick={() =>
                      onPageChange?.(
                        pageNumber,
                      )
                    }
                    className={`
                      w-8
                      h-8
                      sm:w-9
                      sm:h-9

                      rounded-lg

                      text-[11px]
                      sm:text-[13px]

                      font-medium

                      transition

                      shrink-0

                      ${
                        pageNumber ===
                        page
                          ? "bg-[#6D28D9] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    {
                      pageNumber
                    }
                  </button>
                ),
            )}
          </div>

          {/* ========================================================== */}
          {/* NEXT                                                         */}
          {/* ========================================================== */}

          <button
            type="button"
            disabled={
              page >=
                totalPages ||
              loading ||
              totalPages ===
                0
            }
            onClick={() =>
              onPageChange?.(
                page + 1,
              )
            }
            className="
              w-8
              h-8
              sm:w-9
              sm:h-9

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

              shrink-0
            "
            title="Next page"
          >
            <ChevronRight
              size={16}
            />
          </button>
        </div>
      </div>
    </div>
  );
}