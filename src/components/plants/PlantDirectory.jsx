import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLanguage } from "../../i18n";

export default function PlantDirectory({
  plants = [],
  pagination = {},
  onCreatePlant,
  onEditPlant,
  onDeletePlant,
}) {
  const { t } = useLanguage();

  /* =========================================================
     STATE
  ========================================================= */

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPlants =
    pagination?.total ?? plants.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalPlants / rowsPerPage)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startEntry =
    plants.length === 0
      ? 0
      : (safeCurrentPage - 1) * rowsPerPage + 1;

  const endEntry =
    plants.length === 0
      ? 0
      : Math.min(
          safeCurrentPage * rowsPerPage,
          totalPlants
        );

  /* =========================================================
     PAGE CHANGE
  ========================================================= */

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  /* =========================================================
     ROW CHANGE
  ========================================================= */

  const handleRowsChange = (e) => {
    const value = Number(e.target.value);

    setRowsPerPage(value);
    setCurrentPage(1);
  };

  /* =========================================================
     PAGE BUTTONS
  ========================================================= */

  const getPageNumbers = () => {
    if (totalPages <= 4) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (safeCurrentPage <= 2) {
      return [1, 2, 3, 4];
    }

    if (safeCurrentPage >= totalPages - 1) {
      return [
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
    ];
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      className="
        mt-6
        sm:mt-8
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
        overflow-hidden
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          px-4
          py-5
          sm:px-6
          sm:py-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* TITLE */}

        <h2
          className="
            text-[18px]
            sm:text-[21px]
            lg:text-[23px]
            font-bold
            uppercase
            tracking-[-0.01em]
            text-[#16295A]
          "
        >
          {t(
            "plants.directory.title",
            "Plant Directory"
          )}
        </h2>

        {/* ADD BUTTON */}

        <button
          type="button"
          onClick={onCreatePlant}
          className="
            w-full
            sm:w-auto
            rounded-xl
            bg-violet-600
            px-5
            py-2.5
            text-[13px]
            sm:text-sm
            font-semibold
            text-white
            transition
            hover:bg-violet-700
            active:scale-[0.98]
          "
        >
          +{" "}
          {t(
            "plants.directory.addPlant",
            "Add Plant"
          )}
        </button>
      </div>

      {/* =====================================================
          TABLE WRAPPER
      ===================================================== */}

      <div
        className="
          w-full
          overflow-x-auto
          px-3
          sm:px-5
          lg:px-6
        "
      >
        <table
          className="
            w-full
            min-w-[900px]
            border-separate
            border-spacing-0
          "
        >
          {/* =================================================
              TABLE HEADER
          ================================================= */}

          <thead>
            <tr className="bg-[#F8F6FF]">
              <th
                className="
                  w-[55px]
                  rounded-l-xl
                  px-4
                  py-3.5
                  text-left
                  text-[12px]
                  sm:text-[13px]
                  font-semibold
                  text-[#4F46E5]
                "
              >
                #
              </th>

              <th
                className="
                  min-w-[170px]
                  px-4
                  py-3.5
                  text-left
                  text-[12px]
                  sm:text-[13px]
                  font-semibold
                  text-[#4F46E5]
                "
              >
                {t(
                  "plants.directory.plantName",
                  "Plant Name"
                )}
              </th>

              <th
                className="
                  min-w-[130px]
                  px-4
                  py-3.5
                  text-left
                  text-[12px]
                  sm:text-[13px]
                  font-semibold
                  text-[#4F46E5]
                "
              >
                {t(
                  "plants.directory.zone",
                  "Zone"
                )}
              </th>

              <th
                className="
                  min-w-[145px]
                  px-4
                  py-3.5
                  text-center
                  text-[12px]
                  sm:text-[13px]
                  font-semibold
                  text-[#4F46E5]
                "
              >
                {t(
                  "plants.directory.capacity",
                  "Capacity (Ton/Day)"
                )}
              </th>

              <th
                className="
                  min-w-[170px]
                  px-4
                  py-3.5
                  text-left
                  text-[12px]
                  sm:text-[13px]
                  font-semibold
                  text-[#4F46E5]
                "
              >
                {t(
                  "plants.directory.plantManager",
                  "Plant Manager"
                )}
              </th>

              <th
                className="
                  min-w-[150px]
                  px-4
                  py-3.5
                  text-center
                  text-[12px]
                  sm:text-[13px]
                  font-semibold
                  text-[#4F46E5]
                "
              >
                {t(
                  "plants.directory.vehiclesEnrolled",
                  "Vehicles Enrolled"
                )}
              </th>

              <th
                className="
                  min-w-[150px]
                  rounded-r-xl
                  px-4
                  py-3.5
                  text-center
                  text-[12px]
                  sm:text-[13px]
                  font-semibold
                  text-[#4F46E5]
                "
              >
                {t(
                  "plants.directory.actions",
                  "Actions"
                )}
              </th>
            </tr>
          </thead>

          {/* =================================================
              TABLE BODY
          ================================================= */}

          <tbody>
            {plants.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="
                    px-5
                    py-12
                    text-center
                    text-[13px]
                    sm:text-[14px]
                    text-gray-500
                  "
                >
                  {t(
                    "plants.directory.noPlants",
                    "No plants found."
                  )}
                </td>
              </tr>
            ) : (
              plants.map((plant, index) => (
                <tr
                  key={plant.id}
                  className="
                    border-b
                    border-gray-100
                    transition-colors
                    hover:bg-[#FAFAFF]
                  "
                >
                  {/* NUMBER */}

                  <td
                    className="
                      border-b
                      border-gray-100
                      px-4
                      py-3.5
                      text-[12px]
                      sm:text-[13px]
                      font-medium
                      text-gray-700
                    "
                  >
                    {(safeCurrentPage - 1) *
                      rowsPerPage +
                      index +
                      1}
                  </td>

                  {/* PLANT NAME */}

                  <td
                    className="
                      border-b
                      border-gray-100
                      px-4
                      py-3.5
                      text-[13px]
                      sm:text-[14px]
                      font-semibold
                      text-[#1F2937]
                    "
                  >
                    <span className="block max-w-[200px] truncate">
                      {plant.plant_name || "—"}
                    </span>
                  </td>

                  {/* ZONE */}

                  <td
                    className="
                      border-b
                      border-gray-100
                      px-4
                      py-3.5
                      text-[13px]
                      sm:text-[14px]
                      text-gray-700
                    "
                  >
                    {plant.zone || "—"}
                  </td>

                  {/* CAPACITY */}

                  <td
                    className="
                      border-b
                      border-gray-100
                      px-4
                      py-3.5
                      text-center
                      text-[13px]
                      sm:text-[14px]
                      text-gray-700
                    "
                  >
                    {plant.capacity_ton_per_day ??
                      "—"}
                  </td>

                  {/* MANAGER */}

                  <td
                    className="
                      border-b
                      border-gray-100
                      px-4
                      py-3.5
                      text-[13px]
                      sm:text-[14px]
                      text-gray-700
                    "
                  >
                    <span className="block max-w-[190px] truncate">
                      {plant.plant_manager ||
                        "Not Assigned"}
                    </span>
                  </td>

                  {/* VEHICLES */}

                  <td
                    className="
                      border-b
                      border-gray-100
                      px-4
                      py-3.5
                      text-center
                      text-[13px]
                      sm:text-[14px]
                      font-medium
                      text-gray-700
                    "
                  >
                    {plant.vehicles_enrolled ??
                      0}
                  </td>

                  {/* ACTIONS */}

                  <td
                    className="
                      border-b
                      border-gray-100
                      px-4
                      py-3.5
                      text-center
                    "
                  >
                    <select
                      defaultValue=""
                      aria-label={t(
                        "plants.directory.actions",
                        "Actions"
                      )}
                      onChange={(e) => {
                        const action =
                          e.target.value;

                        if (action === "edit") {
                          onEditPlant(plant);
                        }

                        if (
                          action === "delete"
                        ) {
                          onDeletePlant(plant);
                        }

                        e.target.value = "";
                      }}
                      className="
                        h-9
                        min-w-[105px]
                        rounded-lg
                        border
                        border-gray-200
                        bg-white
                        px-2
                        text-[12px]
                        sm:text-[13px]
                        text-gray-700
                        outline-none
                        transition
                        focus:border-violet-500
                        focus:ring-2
                        focus:ring-violet-100
                      "
                    >
                      <option
                        value=""
                        disabled
                      >
                        {t(
                          "plants.directory.actions",
                          "Actions"
                        )}
                      </option>

                      <option value="edit">
                        {t(
                          "plants.directory.updatePlant",
                          "Update Plant"
                        )}
                      </option>

                      <option value="delete">
                        {t(
                          "plants.directory.deletePlant",
                          "Delete Plant"
                        )}
                      </option>
                    </select>
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

      <div
        className="
          flex
          flex-col
          gap-5
          border-t
          border-gray-100
          px-4
          py-5
          sm:px-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* ===================================================
            SHOWING
        =================================================== */}

        <p
          className="
            text-[12px]
            sm:text-[13px]
            text-gray-500
            whitespace-nowrap
          "
        >
          {t(
            "plants.directory.showing",
            "Showing"
          )}

          {" "}

          <span className="font-semibold text-gray-700">
            {startEntry}
            {startEntry !== endEntry &&
              `–${endEntry}`}
          </span>

          {" "}

          {t(
            "plants.directory.of",
            "of"
          )}

          {" "}

          <span className="font-semibold text-gray-700">
            {totalPlants}
          </span>

          {" "}

          {t(
            "plants.directory.plants",
            "plants"
          )}
        </p>

        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div
          className="
            flex
            items-center
            justify-center
            gap-1.5
            sm:gap-2
            order-3
            lg:order-none
          "
        >
          {/* PREVIOUS */}

          <button
            type="button"
            disabled={safeCurrentPage <= 1}
            onClick={() =>
              handlePageChange(
                safeCurrentPage - 1
              )
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-gray-200
              bg-white
              text-gray-600
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ChevronLeft size={16} />
          </button>

          {/* PAGE NUMBERS */}

          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() =>
                handlePageChange(pageNumber)
              }
              className={`
                flex
                h-9
                min-w-9
                items-center
                justify-center
                rounded-lg
                border
                px-2
                text-[12px]
                sm:text-[13px]
                font-semibold
                transition
                ${
                  pageNumber ===
                  safeCurrentPage
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              {pageNumber}
            </button>
          ))}

          {/* NEXT */}

          <button
            type="button"
            disabled={
              safeCurrentPage >= totalPages
            }
            onClick={() =>
              handlePageChange(
                safeCurrentPage + 1
              )
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-gray-200
              bg-white
              text-gray-600
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* ===================================================
            ROWS PER PAGE
        =================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            sm:justify-end
            gap-3
          "
        >
          <span
            className="
              text-[12px]
              sm:text-[13px]
              text-gray-500
              whitespace-nowrap
            "
          >
            {t(
              "plants.directory.rowsPerPage",
              "Rows per page"
            )}
          </span>

          <select
            value={rowsPerPage}
            onChange={handleRowsChange}
            className="
              h-9
              w-[72px]
              rounded-lg
              border
              border-gray-200
              bg-white
              px-2
              text-[12px]
              sm:text-[13px]
              text-gray-700
              outline-none
              transition
              focus:border-violet-500
              focus:ring-2
              focus:ring-violet-100
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
      </div>
    </section>
  );
}