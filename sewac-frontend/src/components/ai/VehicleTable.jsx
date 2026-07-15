const vehicles = [
  {
    id: "VHC-1024",
    driver: "Ramesh",
    status: "Active",
    ward: "23",
  },
  {
    id: "VHC-1048",
    driver: "Suresh",
    status: "Collecting",
    ward: "23",
  },
  {
    id: "VHC-1082",
    driver: "Mahesh",
    status: "Idle",
    ward: "23",
  },
];

export default function VehicleTable() {
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-[#E8ECF5]">

      <table className="w-full">

        <thead className="bg-[#F8FAFC]">

          <tr>

            <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#475467]">
              Vehicle
            </th>

            <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#475467]">
              Driver
            </th>

            <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#475467]">
              Status
            </th>

            <th className="px-4 py-3 text-left text-[13px] font-semibold text-[#475467]">
              Ward
            </th>

          </tr>

        </thead>

        <tbody>

          {vehicles.map((vehicle) => (
            <tr
              key={vehicle.id}
              className="border-t border-[#EEF2F6]"
            >
              <td className="px-4 py-3 text-[14px] text-[#16295A]">
                {vehicle.id}
              </td>

              <td className="px-4 py-3 text-[14px]">
                {vehicle.driver}
              </td>

              <td className="px-4 py-3">

                <span
                  className={`
                    rounded-full
                    px-2.5
                    py-1
                    text-[12px]
                    font-medium

                    ${
                      vehicle.status === "Idle"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }
                  `}
                >
                  {vehicle.status}
                </span>

              </td>

              <td className="px-4 py-3 text-[14px]">
                {vehicle.ward}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}