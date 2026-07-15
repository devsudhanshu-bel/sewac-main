import { MoreHorizontal } from "lucide-react";

const plants = [
  {
    id: 1,
    name: "Shobha Organic Plant",
    zone: "North Zone",
    capacity: 120,
    manager: "Ramesh Kumar",
    vehicles: 24,
  },
  {
    id: 2,
    name: "Green Earth Recyclers",
    zone: "Central Zone",
    capacity: 150,
    manager: "Anjali Singh",
    vehicles: 28,
  },
  {
    id: 3,
    name: "Eco Processors Unit",
    zone: "East Zone",
    capacity: 100,
    manager: "Suresh Patel",
    vehicles: 18,
  },
  {
    id: 4,
    name: "Clean City Solutions",
    zone: "South Zone",
    capacity: 200,
    manager: "Priya Sharma",
    vehicles: 32,
  },
  {
    id: 5,
    name: "Waste to Energy Plant",
    zone: "North East Zone",
    capacity: 250,
    manager: "Mahesh Yadav",
    vehicles: 36,
  },
  {
    id: 6,
    name: "BioGreen Facility",
    zone: "North Zone",
    capacity: 80,
    manager: "Deepak Nair",
    vehicles: 14,
  },
  {
    id: 7,
    name: "Sustainable Waste Hub",
    zone: "South East Zone",
    capacity: 130,
    manager: "Kavita Rao",
    vehicles: 22,
  },
  {
    id: 8,
    name: "Eco Warrior Plant",
    zone: "West Zone",
    capacity: 110,
    manager: "Vikram Shetty",
    vehicles: 20,
  },
  {
    id: 9,
    name: "Greenovit Processing",
    zone: "Central Zone",
    capacity: 90,
    manager: "Neha Iyer",
    vehicles: 16,
  },
  {
    id: 10,
    name: "Future Waste Solutions",
    zone: "East Zone",
    capacity: 140,
    manager: "Arun Kumar",
    vehicles: 26,
  },
];

export default function PlantDirectory() {
  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      {/* Header */}

      <div className="px-8 pt-7 pb-6">

        <h2 className="text-[24px] font-bold uppercase text-[#16295A]">
          Plant Directory
        </h2>

      </div>

      {/* Table */}

      <div className="px-6">

        <table className="w-full border-separate border-spacing-0">

          <thead>

            <tr className="bg-[#F8F6FF]">

              <th className="rounded-l-xl px-5 py-4 text-left text-[14px] font-semibold text-[#4F46E5]">
                #
              </th>

              <th className="px-5 py-4 text-left text-[14px] font-semibold text-[#4F46E5]">
                Plant Name
              </th>

              <th className="px-5 py-4 text-left text-[14px] font-semibold text-[#4F46E5]">
                Zone
              </th>

              <th className="px-5 py-3.5 text-center text-[14px] font-semibold text-[#4F46E5]">
                Capacity (Ton/Day)
              </th>

              <th className="px-5 py-4 text-left text-[14px] font-semibold text-[#4F46E5]">
                Plant Manager
              </th>

              <th className="w-[180px] px-5 py-4 text-center text-[14px] font-semibold text-[#4F46E5]">
                Vehicles Enrolled
              </th>

              <th className="rounded-r-xl px-5 py-4"></th>

            </tr>

          </thead>

          <tbody>

            {plants.map((plant) => (

              <tr
                key={plant.id}
                className="hover:bg-gray-50 transition-colors"
              >

                <td className="border-b border-gray-100 px-5 py-4 text-[15px] font-medium text-gray-700">
                  {plant.id}
                </td>

                <td className="border-b border-gray-100 px-5 py-4 text-[15px] font-semibold text-[#1F2937]">
                  {plant.name}
                </td>

                <td className="border-b border-gray-100 px-5 py-4 text-[15px] text-gray-700">
                  {plant.zone}
                </td>

                <td className="border-b border-gray-100 px-5 py-4">
                <div className="flex justify-center">
                    {plant.capacity}
                </div>
                </td>

                <td className="border-b border-gray-100 px-5 py-4 text-[15px] text-gray-700">
                  {plant.manager}
                </td>

                <td className="border-b border-gray-100 px-5 py-4">
                <div className="flex justify-center">
                    {plant.vehicles}
                </div>
                </td>

                <td className="border-b border-gray-100 px-5 py-4 text-center">

                  <button
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      text-[#4F46E5]
                      transition
                      hover:bg-violet-50
                    "
                  >
                    <MoreHorizontal size={18} />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
            {/* Footer */}

      <div className="flex items-center justify-between px-8 py-6 border-t border-gray-100">

        {/* Showing Entries */}

        <p className="text-[14px] text-gray-500">
          Showing <span className="font-semibold text-gray-700">1–10</span> of{" "}
          <span className="font-semibold text-gray-700">18</span> plants
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
            Rows per page
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