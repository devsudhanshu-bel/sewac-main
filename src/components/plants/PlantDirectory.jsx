import { useLanguage } from "../../i18n";

export default function PlantDirectory({
  plants = [],
  pagination = {},
  onCreatePlant,
  onEditPlant,
  onDeletePlant,
}) {
  const { t } = useLanguage();

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex items-center justify-between px-8 pt-7 pb-6">

        <h2 className="text-[24px] font-bold uppercase text-[#16295A]">
          {t(
            "plants.directory.title",
            "Plant Directory"
          )}
        </h2>

        <button
          onClick={onCreatePlant}
          className="
            rounded-xl
            bg-violet-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-violet-700
          "
        >
          + {t(
            "plants.directory.addPlant",
            "Add Plant"
          )}
        </button>

      </div>

      {/* =========================================================
          TABLE
      ========================================================= */}

      <div className="px-6">

        <table className="w-full border-separate border-spacing-0">

          <thead>

            <tr className="bg-[#F8F6FF]">

              <th className="rounded-l-xl px-5 py-4 text-left text-[14px] font-semibold text-[#4F46E5]">
                #
              </th>

              <th className="px-5 py-4 text-left text-[14px] font-semibold text-[#4F46E5]">
                {t(
                  "plants.directory.plantName",
                  "Plant Name"
                )}
              </th>

              <th className="px-5 py-4 text-left text-[14px] font-semibold text-[#4F46E5]">
                {t(
                  "plants.directory.zone",
                  "Zone"
                )}
              </th>

              <th className="px-5 py-3.5 text-center text-[14px] font-semibold text-[#4F46E5]">
                {t(
                  "plants.directory.capacity",
                  "Capacity (Ton/Day)"
                )}
              </th>

              <th className="px-5 py-4 text-left text-[14px] font-semibold text-[#4F46E5]">
                {t(
                  "plants.directory.plantManager",
                  "Plant Manager"
                )}
              </th>

              <th className="w-[180px] px-5 py-4 text-center text-[14px] font-semibold text-[#4F46E5]">
                {t(
                  "plants.directory.vehiclesEnrolled",
                  "Vehicles Enrolled"
                )}
              </th>

              <th className="w-[170px] rounded-r-xl px-5 py-4 text-center text-[14px] font-semibold text-[#4F46E5]">
                {t(
                  "plants.directory.actions",
                  "Actions"
                )}
              </th>

            </tr>

          </thead>

          <tbody>

            {plants.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-[14px] text-gray-500"
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
                  className="hover:bg-gray-50 transition-colors"
                >

                  <td className="border-b border-gray-100 px-5 py-4 text-[15px] font-medium text-gray-700">
                    {plant.id}
                  </td>

                  <td className="border-b border-gray-100 px-5 py-4 text-[15px] font-semibold text-[#1F2937]">
                    {plant.plant_name}
                  </td>

                  <td className="border-b border-gray-100 px-5 py-4 text-[15px] text-gray-700">
                    {plant.zone}
                  </td>

                  <td className="border-b border-gray-100 px-5 py-4">
                    <div className="flex justify-center">
                      {plant.capacity_ton_per_day}
                    </div>
                  </td>

                  <td className="border-b border-gray-100 px-5 py-4 text-[15px] text-gray-700">
                    {plant.plant_manager}
                  </td>

                  <td className="border-b border-gray-100 px-5 py-4">
                    <div className="flex justify-center">
                      {plant.vehicles_enrolled}
                    </div>
                  </td>

                  <td className="border-b border-gray-100 px-5 py-4 text-center">

                    <select
                      className="
                        rounded-lg
                        border
                        border-gray-200
                        px-2
                        py-1.5
                        text-sm
                        outline-none
                      "
                      defaultValue=""
                      onChange={(e) => {

                        if (e.target.value === "edit") {
                          onEditPlant(plant);
                        }

                        if (e.target.value === "delete") {
                          onDeletePlant(plant);
                        }

                        e.target.value = "";

                      }}
                    >

                      <option value="" disabled>
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

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <div className="flex items-center justify-between px-8 py-6 border-t border-gray-100">

        {/* Showing Entries */}

        <p className="text-[14px] text-gray-500">

          {t(
            "plants.directory.showing",
            "Showing"
          )}

          {" "}

          <span className="font-semibold text-gray-700">

            {plants.length === 0
              ? 0
              : 1}
            –
            {plants.length}

          </span>

          {" "}

          {t(
            "plants.directory.of",
            "of"
          )}

          {" "}

          <span className="font-semibold text-gray-700">
            {pagination.total ?? plants.length}
          </span>

          {" "}

          {t(
            "plants.directory.plants",
            "plants"
          )}

        </p>

        {/* Pagination */}

        <div className="flex items-center gap-2">

          <button
            className="
              w-10
              h-10
              rounded-xl
              border
              border-violet-600
              bg-violet-600
              text-white
              font-semibold
              transition
            "
          >
            1
          </button>

          <button
            className="
              w-10
              h-10
              rounded-xl
              border
              border-gray-200
              text-gray-600
              hover:bg-gray-50
              transition
            "
          >
            2
          </button>

          <button
            className="
              w-10
              h-10
              rounded-xl
              border
              border-gray-200
              text-gray-600
              hover:bg-gray-50
              transition
            "
          >
            3
          </button>

          <button
            className="
              w-10
              h-10
              rounded-xl
              border
              border-gray-200
              text-gray-600
              hover:bg-gray-50
              transition
            "
          >
            →
          </button>

        </div>

        {/* Rows Per Page */}

        <div className="flex items-center gap-3">

          <span className="text-[14px] text-gray-500">
            {t(
              "plants.directory.rowsPerPage",
              "Rows per page"
            )}
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
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>

        </div>

      </div>

    </div>
  );
}