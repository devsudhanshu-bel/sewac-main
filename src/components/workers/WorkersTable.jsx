import {
  Eye,
  MoreVertical,
  Search,
  Download,
} from "lucide-react";

import { workersTableData } from "./workersData";

export default function WorkersTable() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Worker Performance
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Monitor collection activities and efficiency
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search worker..."
              className="
                pl-10
                pr-4
                py-2
                w-56
                rounded-xl
                border
                border-gray-200
                text-sm
                outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            />
          </div>

          <button
            className="
              w-10
              h-10
              rounded-xl
              border
              border-gray-200
              flex
              items-center
              justify-center
              hover:bg-gray-50
            "
          >
            <Download size={16} />
          </button>

        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b border-gray-100">

              <th className="text-left py-4 text-sm text-gray-500 font-medium">
                Worker ID
              </th>

              <th className="text-left py-4 text-sm text-gray-500 font-medium">
                Name
              </th>

              <th className="text-left py-4 text-sm text-gray-500 font-medium">
                Vehicle
              </th>

              <th className="text-left py-4 text-sm text-gray-500 font-medium">
                Collection Points
              </th>

              <th className="text-left py-4 text-sm text-gray-500 font-medium">
                Waste
              </th>

              <th className="text-left py-4 text-sm text-gray-500 font-medium">
                Distance
              </th>

              <th className="text-left py-4 text-sm text-gray-500 font-medium">
                Efficiency
              </th>

              <th className="text-left py-4 text-sm text-gray-500 font-medium">
                Status
              </th>

              <th className="text-right py-4 text-sm text-gray-500 font-medium">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {workersTableData.map((worker) => (
              <tr
                key={worker.id}
                className="
                  border-b
                  border-gray-50
                  hover:bg-gray-50
                  transition
                "
              >
                <td className="py-4 text-sm font-medium text-gray-800">
                  {worker.id}
                </td>

                <td className="py-4">
                  <p className="font-medium text-gray-800">
                    {worker.name}
                  </p>
                </td>

                <td className="py-4 text-sm text-gray-600">
                  {worker.vehicle}
                </td>

                <td className="py-4 text-sm text-gray-600">
                  {worker.collectionPoints}
                </td>

                <td className="py-4 text-sm text-gray-600">
                  {worker.waste}
                </td>

                <td className="py-4 text-sm text-gray-600">
                  {worker.distance}
                </td>

                <td className="py-4">

                  <div className="flex items-center gap-3">

                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{
                          width: worker.efficiency,
                        }}
                      />

                    </div>

                    <span className="text-sm font-medium text-gray-700">
                      {worker.efficiency}
                    </span>

                  </div>

                </td>

                <td className="py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      worker.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {worker.status}
                  </span>

                </td>

                <td className="py-4">

                  <div className="flex justify-end gap-2">

                    <button
                      className="
                        w-9
                        h-9
                        rounded-xl
                        bg-purple-50
                        flex
                        items-center
                        justify-center
                        hover:bg-purple-100
                      "
                    >
                      <Eye
                        size={16}
                        className="text-purple-600"
                      />
                    </button>

                    <button
                      className="
                        w-9
                        h-9
                        rounded-xl
                        bg-gray-50
                        flex
                        items-center
                        justify-center
                        hover:bg-gray-100
                      "
                    >
                      <MoreVertical
                        size={16}
                        className="text-gray-600"
                      />
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}