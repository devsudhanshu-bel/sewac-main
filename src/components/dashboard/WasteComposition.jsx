import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Wet Waste",
    value: 6.2,
    percentage: "50%",
    color: "#ff5c93",
  },
  {
    name: "Dry Waste",
    value: 4.3,
    percentage: "35%",
    color: "#8b5cf6",
  },
  {
    name: "Recyclable",
    value: 1.4,
    percentage: "11%",
    color: "#f8b73c",
  },
  {
    name: "Others",
    value: 0.5,
    percentage: "4%",
    color: "#8bbcff",
  },
];

export default function WasteComposition() {
  return (
    <div
      className="
        bg-white
        rounded-[28px]
        border
        border-gray-100
        shadow-sm
        h-[340px]
        w-full
        p-4
        flex
        flex-col
      "
    >
      {/* Header */}

      <h3 className="text-[14px] font-semibold text-gray-900 mb-2">
        Waste Composition
      </h3>

      <div className="flex flex-1 items-center">

        {/* Smaller Donut */}

        <div className="w-[38%] h-full relative">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={34}
                outerRadius={50}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Value */}

          <div
            className="
              absolute
              inset-0
              flex
              flex-col
              items-center
              justify-center
              pointer-events-none
            "
          >
            <h2 className="text-[15px] font-bold text-gray-900">
              12.4
            </h2>

            <p className="text-[10px] text-gray-500">
              KG
            </p>
          </div>

        </div>

        {/* Legend */}

        <div
          className="
            w-[62%]
            pl-4
            space-y-3
          "
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2"
            >
              <div
                className="
                  w-2.5
                  h-2.5
                  rounded-full
                  mt-1
                  shrink-0
                "
                style={{
                  backgroundColor: item.color,
                }}
              />

              <div>

                <p className="text-[11px] text-gray-600 leading-none">
                  {item.name}
                </p>

                <p className="text-[11px] font-semibold text-gray-900 mt-1">
                  {item.value} KG
                </p>

                <p className="text-[10px] text-gray-400">
                  {item.percentage}
                </p>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}