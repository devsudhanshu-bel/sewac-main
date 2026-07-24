const citizens = [
  {
    id: "CIT-001",
    name: "Ravi Kumar",
    phone: "+91 9876543210",
    waste: "28.6 kg",
    participation: 92,
    status: "Active",
  },
  {
    id: "CIT-002",
    name: "Sunitha R",
    phone: "+91 9876543211",
    waste: "18.4 kg",
    participation: 65,
    status: "Inactive",
  },
  {
    id: "CIT-003",
    name: "Arjun S",
    phone: "+91 9876543212",
    waste: "31.8 kg",
    participation: 88,
    status: "Active",
  },
  {
    id: "CIT-004",
    name: "Priya M",
    phone: "+91 9876543213",
    waste: "15.1 kg",
    participation: 52,
    status: "Inactive",
  },
  {
    id: "CIT-005",
    name: "Kiran P",
    phone: "+91 9876543214",
    waste: "22.5 kg",
    participation: 79,
    status: "Active",
  },
];

export default function CitizensTable() {
  return (
    <div
      className="
        bg-white
        rounded-[28px]
        border
        border-gray-100
        shadow-sm
        p-5
      "
    >
      <div className="flex justify-between items-center mb-5">

        <h3 className="font-semibold text-gray-900">
          All Citizens
        </h3>

        <button
          className="
            px-4
            h-10
            rounded-xl
            border
            border-pink-200
            text-pink-500
            hover:bg-pink-50
          "
        >
          Export
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-gray-100 text-gray-500">

              <th className="py-3 text-left">ID</th>
              <th className="text-left">Name</th>
              <th className="text-left">Phone</th>
              <th className="text-left">Waste</th>
              <th className="text-left">Participation</th>
              <th className="text-left">Status</th>

            </tr>
          </thead>

          <tbody>

            {citizens.map((citizen) => (
              <tr
                key={citizen.id}
                className="border-b border-gray-50 hover:bg-gray-50"
              >
                <td className="py-4">{citizen.id}</td>

                <td>{citizen.name}</td>

                <td>{citizen.phone}</td>

                <td>{citizen.waste}</td>

                <td>
                  <div className="flex items-center gap-3">

                    <div className="w-28 bg-gray-200 rounded-full h-2">

                      <div
                        className="
                          bg-gradient-to-r
                          from-pink-500
                          to-purple-500
                          h-2
                          rounded-full
                        "
                        style={{
                          width: `${citizen.participation}%`,
                        }}
                      />

                    </div>

                    <span className="text-xs">
                      {citizen.participation}%
                    </span>

                  </div>
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      citizen.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {citizen.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <div className="flex justify-end mt-5 gap-2">

        <button className="w-9 h-9 rounded-lg border">
          1
        </button>

        <button className="w-9 h-9 rounded-lg border">
          2
        </button>

        <button className="w-9 h-9 rounded-lg border">
          3
        </button>

      </div>
    </div>
  );
}