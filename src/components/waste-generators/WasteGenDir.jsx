import {
  Search,
  RefreshCw,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useMemo } from "react";

import { useLanguage } from "../../i18n";

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
  | LANGUAGE
  |--------------------------------------------------------------------------
  */

  const { t } = useLanguage();

  /*
  |--------------------------------------------------------------------------
  | SAFE VALUES
  |--------------------------------------------------------------------------
  */

  const safePage =
    Number.isInteger(Number(page)) && Number(page) > 0
      ? Number(page)
      : 1;

  const safePageSize = [10, 20, 50].includes(Number(pageSize))
    ? Number(pageSize)
    : 10;

  const safeTotal = Number(total) >= 0 ? Number(total) : 0;

  const safeTotalPages =
    Number(totalPages) >= 0 ? Number(totalPages) : 0;

  /*
  |--------------------------------------------------------------------------
  | PAGE NUMBERS
  |--------------------------------------------------------------------------
  */

  const pageNumbers = useMemo(() => {
    if (safeTotalPages <= 0) {
      return [];
    }

    if (safeTotalPages <= 7) {
      return Array.from(
        {
          length: safeTotalPages,
        },
        (_, index) => index + 1,
      );
    }

    const pages = [];

    pages.push(1);

    if (safePage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, safePage - 1);

    const end = Math.min(
      safeTotalPages - 1,
      safePage + 1,
    );

    for (
      let number = start;
      number <= end;
      number++
    ) {
      pages.push(number);
    }

    if (safePage < safeTotalPages - 3) {
      pages.push("...");
    }

    pages.push(safeTotalPages);

    return pages;
  }, [
    safePage,
    safeTotalPages,
  ]);

  /*
  |--------------------------------------------------------------------------
  | DISPLAY RANGE
  |--------------------------------------------------------------------------
  */

  const startRecord =
    safeTotal === 0
      ? 0
      : (safePage - 1) * safePageSize + 1;

  const endRecord =
    safeTotal === 0
      ? 0
      : Math.min(
          safePage * safePageSize,
          safeTotal,
        );

  /*
  |--------------------------------------------------------------------------
  | MASTER CITIZEN FIELD HELPERS
  |--------------------------------------------------------------------------
  */

  const getName = (citizen) =>
    citizen?.personName ||
    t(
      "wasteGenerators.directory.notAvailable",
      "N/A",
    );

  const getPhone = (citizen) =>
    citizen?.phoneNumber ||
    citizen?.contactNumber ||
    t(
      "wasteGenerators.directory.notAvailable",
      "N/A",
    );

  const getWetRFID = (citizen) =>
    citizen?.wetRFID ||
    t(
      "wasteGenerators.directory.notAssigned",
      "Not Assigned",
    );

  const getDryRFID = (citizen) =>
    citizen?.dryRFID ||
    t(
      "wasteGenerators.directory.notAssigned",
      "Not Assigned",
    );

  const getWard = (citizen) => {
    if (citizen?.wardName) {
      return citizen.wardName;
    }

    if (
      citizen?.wardNo !== null &&
      citizen?.wardNo !== undefined &&
      String(citizen.wardNo).trim() !== ""
    ) {
      return `${t(
        "wasteGenerators.directory.ward",
        "Ward",
      )} ${citizen.wardNo}`;
    }

    if (
      citizen?.ward !== null &&
      citizen?.ward !== undefined &&
      String(citizen.ward).trim() !== ""
    ) {
      return `${t(
        "wasteGenerators.directory.ward",
        "Ward",
      )} ${citizen.ward}`;
    }

    return t(
      "wasteGenerators.directory.notAvailable",
      "N/A",
    );
  };

  const getArea = (citizen) =>
    citizen?.area ||
    t(
      "wasteGenerators.directory.notAvailable",
      "N/A",
    );

  const getZone = (citizen) =>
    citizen?.zoneName ||
    t(
      "wasteGenerators.directory.notAvailable",
      "N/A",
    );

  const getStatus = (citizen) => {
    return citizen?.status === "ACTIVE"
      ? "ACTIVE"
      : "INACTIVE";
  };

  /*
  |--------------------------------------------------------------------------
  | WASTE VALUE HELPERS
  |--------------------------------------------------------------------------
  */

  const getTotalWaste = (citizen) => {
    if (
      citizen?.totalWaste !== null &&
      citizen?.totalWaste !== undefined
    ) {
      return citizen.totalWaste;
    }

    if (
      citizen?.totalWasteCollected !== null &&
      citizen?.totalWasteCollected !== undefined
    ) {
      return citizen.totalWasteCollected;
    }

    return null;
  };

  const getAverageWaste = (citizen) => {
    if (
      citizen?.averageWaste !== null &&
      citizen?.averageWaste !== undefined
    ) {
      return citizen.averageWaste;
    }

    if (
      citizen?.avgWaste !== null &&
      citizen?.avgWaste !== undefined
    ) {
      return citizen.avgWaste;
    }

    return null;
  };

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
              {t(
                "wasteGenerators.directory.title",
                "Waste Generators Directory",
              )}
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
              {t(
                "wasteGenerators.directory.description",
                "View and manage waste generators based on registered citizen information.",
              )}
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
                  onSearch?.(event.target.value)
                }
                placeholder={t(
                  "wasteGenerators.directory.searchPlaceholder",
                  "Search by name, phone number, Wet RFID",
                )}
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
              disabled={syncing || loading}
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
                ? t(
                    "wasteGenerators.directory.syncing",
                    "Syncing...",
                  )
                : t(
                    "wasteGenerators.directory.sync",
                    "Sync",
                  )}
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
            min-w-[1280px]

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
                {t(
                  "wasteGenerators.directory.name",
                  "Name",
                )}
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
                {t(
                  "wasteGenerators.directory.phoneNumber",
                  "Phone Number",
                )}
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
                {t(
                  "wasteGenerators.directory.wetRFID",
                  "Wet RFID",
                )}
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
                {t(
                  "wasteGenerators.directory.dryRFID",
                  "Dry RFID",
                )}
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
                {t(
                  "wasteGenerators.directory.wardArea",
                  "Ward / Area",
                )}
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
                {t(
                  "wasteGenerators.directory.zone",
                  "Zone",
                )}
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
                {t(
                  "wasteGenerators.directory.status",
                  "Status",
                )}
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
                {t(
                  "wasteGenerators.directory.totalWaste",
                  "Total Waste",
                )}
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
                {t(
                  "wasteGenerators.directory.averageWaste",
                  "Average Waste",
                )}
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
                {t(
                  "wasteGenerators.directory.action",
                  "Action",
                )}
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
                  colSpan={11}
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
                  {t(
                    "wasteGenerators.directory.loading",
                    "Loading waste generators...",
                  )}
                </td>
              </tr>
            ) : citizens.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
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
                    ? t(
                        "wasteGenerators.directory.noSearchResults",
                        "No waste generators found for this search.",
                      )
                    : t(
                        "wasteGenerators.directory.noGenerators",
                        "No waste generators found.",
                      )}
                </td>
              </tr>
            ) : (
              citizens.map(
                (citizen, index) => {
                  const totalWaste =
                    getTotalWaste(
                      citizen,
                    );

                  const averageWaste =
                    getAverageWaste(
                      citizen,
                    );

                  return (
                    <tr
                      key={
                        citizen.id ??
                        citizen.phoneNumber ??
                        `${citizen.ward}-${index}`
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
                        {(safePage - 1) *
                          safePageSize +
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
                          {getName(
                            citizen,
                          )}
                        </span>
                      </td>

                      {/* ==================================================
                          PHONE NUMBER
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
                        {getPhone(
                          citizen,
                        )}
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
                          {getWetRFID(
                            citizen,
                          )}
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
                          {getDryRFID(
                            citizen,
                          )}
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
                            {getWard(
                              citizen,
                            )}
                          </span>

                          <span
                            className="
                              text-[10px]
                              sm:text-[12px]

                              text-gray-400

                              whitespace-nowrap
                            "
                          >
                            {getArea(
                              citizen,
                            )}
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
                        {getZone(
                          citizen,
                        )}
                      </td>

                      {/* ==================================================
                          STATUS
                      ================================================== */}

                      <td
                        className="
                          px-4
                          sm:px-5

                          py-4
                          sm:py-5
                        "
                      >
                        {getStatus(
                          citizen,
                        ) ===
                        "ACTIVE" ? (
                          <span
                            className="
                              inline-flex
                              items-center

                              px-3
                              py-1

                              rounded-full

                              bg-green-50
                              text-green-600

                              text-[10px]
                              sm:text-[12px]

                              font-semibold

                              whitespace-nowrap
                            "
                          >
                            {t(
                              "wasteGenerators.directory.active",
                              "Active",
                            )}
                          </span>
                        ) : (
                          <span
                            className="
                              inline-flex
                              items-center

                              px-3
                              py-1

                              rounded-full

                              bg-red-50
                              text-red-600

                              text-[10px]
                              sm:text-[12px]

                              font-semibold

                              whitespace-nowrap
                            "
                          >
                            {t(
                              "wasteGenerators.directory.inactive",
                              "Inactive",
                            )}
                          </span>
                        )}
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
                          {totalWaste !==
                          null
                            ? Number(
                                totalWaste,
                              ).toFixed(
                                2,
                              )
                            : t(
                                "wasteGenerators.directory.notAvailable",
                                "N/A",
                              )}
                        </span>

                        {totalWaste !==
                          null && (
                          <span
                            className="
                              ml-1

                              text-[9px]
                              sm:text-[11px]

                              text-gray-400
                            "
                          >
                            {t(
                              "wasteGenerators.directory.kg",
                              "kg",
                            )}
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
                          {averageWaste !==
                          null
                            ? Number(
                                averageWaste,
                              ).toFixed(
                                2,
                              )
                            : t(
                                "wasteGenerators.directory.notAvailable",
                                "N/A",
                              )}
                        </span>

                        {averageWaste !==
                          null && (
                          <span
                            className="
                              ml-1

                              text-[9px]
                              sm:text-[11px]

                              text-gray-400
                            "
                          >
                            {t(
                              "wasteGenerators.directory.kg",
                              "kg",
                            )}
                          </span>
                        )}
                      </td>

                      {/* ==================================================
                          ACTION
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
                          title={t(
                            "wasteGenerators.directory.update",
                            "Update Waste Generator",
                          )}
                        >
                          <Pencil
                            size={16}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                },
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
          {t(
            "wasteGenerators.directory.showing",
            "Showing",
          )}{" "}
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
          {" "}
          {t(
            "wasteGenerators.directory.of",
            "of",
          )}{" "}
          <span
            className="
              font-semibold
              text-gray-700
            "
          >
            {safeTotal}
          </span>{" "}
          {t(
            "wasteGenerators.directory.wasteGenerators",
            "waste generators",
          )}
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
              {t(
                "wasteGenerators.directory.rows",
                "Rows:",
              )}
            </span>

            <select
              value={safePageSize}
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
              safePage <= 1 ||
              loading
            }
            onClick={() =>
              onPageChange?.(
                safePage - 1,
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
            title={t(
              "wasteGenerators.directory.previous",
              "Previous page",
            )}
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
                    disabled={loading}
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
                        safePage
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
              safePage >=
                safeTotalPages ||
              loading ||
              safeTotalPages === 0
            }
            onClick={() =>
              onPageChange?.(
                safePage + 1,
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
            title={t(
              "wasteGenerators.directory.next",
              "Next page",
            )}
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