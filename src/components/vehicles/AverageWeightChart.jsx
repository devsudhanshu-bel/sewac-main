import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

import {
  BarChart3,
  ChevronDown,
} from "lucide-react";

import { useLanguage } from "../../i18n";

/* ===========================================================
   DATA
=========================================================== */

const chartData = [
  {
    zone: "City Corporation\n(West)",
    waste: 28,
    vehicles: 82,
  },
  {
    zone: "West\nCorporation",
    waste: 56,
    vehicles: 104,
  },
  {
    zone: "North\nCorporation",
    waste: 78.4,
    vehicles: 156,
  },
  {
    zone: "Central/City\nCorporation",
    waste: 32,
    vehicles: 95,
  },
  {
    zone: "East\nCorporation",
    waste: 56,
    vehicles: 118,
  },
  {
    zone: "South\nCorporation",
    waste: 48,
    vehicles: 102,
  },
];

const THRESHOLD = 70;

/* ===========================================================
   CUSTOM X-AXIS TICK
   Prevents zone labels from overlapping
=========================================================== */

function CustomXAxisTick({
  x,
  y,
  payload,
}) {
  const value = payload?.value || "";

  if (!value) {
    return null;
  }

  /*
    Convert the existing zone names into controlled
    line breaks so every label fits neatly below
    its corresponding point.
  */

  const labelMap = {
    "City Corporation\n(West)": [
      "City",
      "Corporation",
      "(West)",
    ],

    "West\nCorporation": [
      "West",
      "Corporation",
    ],

    "North\nCorporation": [
      "North",
      "Corporation",
    ],

    "Central/City\nCorporation": [
      "Central/City",
      "Corporation",
    ],

    "East\nCorporation": [
      "East",
      "Corporation",
    ],

    "South\nCorporation": [
      "South",
      "Corporation",
    ],
  };

  const lines =
    labelMap[value] ||
    String(value).split("\n");

  return (
    <g
      transform={`translate(${x},${y})`}
    >
      <text
        textAnchor="middle"
        fill="#233876"
        fontSize={10}
        fontWeight={500}
      >
        {lines.map((line, index) => (
          <tspan
            key={`${line}-${index}`}
            x="0"
            dy={
              index === 0
                ? 0
                : 13
            }
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

/* ===========================================================
   CUSTOM TOOLTIP
=========================================================== */

function CustomTooltip({
  active,
  payload,
  t,
}) {
  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  const data =
    payload[0].payload;

  const difference = (
    data.waste - THRESHOLD
  ).toFixed(2);

  const isOver =
    data.waste >= THRESHOLD;

  return (
    <div className="bg-white rounded-xl border border-[#ECECF3] shadow-xl px-4 py-3 min-w-[240px]">
      <div className="space-y-2 text-[12px]">

        {/* =====================================================
            ZONE NAME
        ===================================================== */}

        <div className="flex justify-between gap-5">
          <span className="font-semibold text-[#374151]">
            {t(
              "vehicles.averageWeightChart.zoneName",
              "Zone Name"
            )}
          </span>

          <span className="font-semibold text-right">
            {data.zone.replace(
              "\n",
              " "
            )}
          </span>
        </div>

        {/* =====================================================
            WASTE GENERATED
        ===================================================== */}

        <div className="flex justify-between gap-5">
          <span className="font-semibold text-[#374151]">
            {t(
              "vehicles.averageWeightChart.wasteGenerated",
              "Waste Generated"
            )}
          </span>

          <span className="font-semibold">
            {data.waste.toFixed(2)}{" "}
            {t(
              "units.ton",
              "Ton"
            )}
          </span>
        </div>

        {/* =====================================================
            VEHICLES RUNNING
        ===================================================== */}

        <div className="flex justify-between gap-5">
          <span className="font-semibold text-[#374151]">
            {t(
              "vehicles.averageWeightChart.vehiclesRunning",
              "Vehicles Running"
            )}
          </span>

          <span className="font-semibold">
            {data.vehicles}
          </span>
        </div>

        {/* =====================================================
            DIFFERENCE
        ===================================================== */}

        <div className="flex justify-between gap-5">
          <span className="font-semibold text-[#374151]">
            {t(
              "vehicles.averageWeightChart.difference",
              "Difference"
            )}
          </span>

          <span
            className={`font-semibold ${
              isOver
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {isOver ? "+" : ""}
            {difference}{" "}
            {t(
              "units.ton",
              "Ton"
            )}
          </span>
        </div>

        {/* =====================================================
            THRESHOLD STATUS
        ===================================================== */}

        <div className="text-center pt-0.5">
          <span
            className={`font-semibold ${
              isOver
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {isOver
              ? `(${t(
                  "vehicles.averageWeightChart.overThreshold",
                  "Over Threshold"
                )})`
              : `(${t(
                  "vehicles.averageWeightChart.belowThreshold",
                  "Below Threshold"
                )})`}
          </span>
        </div>

        {/* =====================================================
            AVERAGE WASTE
        ===================================================== */}

        <div className="border-t border-[#EEF0F4] pt-2 flex justify-between gap-5">
          <span className="font-semibold text-[#374151]">
            {t(
              "vehicles.averageWeightChart.averageWaste",
              "Average Waste"
            )}
          </span>

          <span className="font-semibold">
            {THRESHOLD.toFixed(2)}{" "}
            {t(
              "units.ton",
              "Ton"
            )}
          </span>
        </div>

      </div>
    </div>
  );
}

/* ===========================================================
   COMPONENT
=========================================================== */

export default function AverageWeightChart() {
  const { t } = useLanguage();

  return (
    <section className="bg-white rounded-[24px] border border-[#ECECF3] shadow-sm overflow-hidden">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between px-7 py-5 border-b border-[#F5F6FA]">

        {/* ================= LEFT ================= */}

        <div className="min-w-0">

          {/* TITLE */}

          <div className="flex items-start gap-2.5">

            <BarChart3
              size={17}
              strokeWidth={2}
              className="text-[#6C2BFF] mt-1 shrink-0"
            />

            <h2 className="text-[16px] font-semibold text-[#111827] uppercase tracking-[-0.01em] leading-6">
              {t(
                "vehicles.averageWeightChart.title",
                "Average Weight Generated (Line Graph)"
              )}
            </h2>

          </div>

          {/* AVERAGE */}

          <p className="mt-2.5 text-[14px] font-semibold text-[#1E3A8A]">

            {t(
              "vehicles.averageWeightChart.averageWasteGenerated",
              "Average waste generated:"
            )}

            <span className="ml-1.5 text-[#233876]">
              {THRESHOLD.toFixed(2)}{" "}
              {t(
                "units.ton",
                "Ton"
              )}
            </span>

          </p>

        </div>

        {/* ================= VIEW BY ================= */}

        <div className="flex items-center gap-3 shrink-0">

          <span className="text-[13px] font-semibold text-[#233876]">
            {t(
              "vehicles.averageWeightChart.viewBy",
              "View By:"
            )}
          </span>

          <button
            type="button"
            className="
              h-[42px]
              w-[150px]
              rounded-xl
              border
              border-[#E6E8F0]
              bg-white
              flex
              items-center
              justify-between
              px-4
              hover:border-[#6C2BFF]
              transition
            "
          >
            <span className="text-[13px] font-medium text-[#111827]">
              {t(
                "vehicles.averageWeightChart.city",
                "City"
              )}
            </span>

            <ChevronDown
              size={16}
              className="text-[#6B7280]"
            />
          </button>

        </div>

      </div>

      {/* =====================================================
          CHART AREA
      ===================================================== */}

      <div className="px-7 py-6">

        {/* Y AXIS LABEL */}

        <p className="text-[13px] font-semibold text-[#233876] mb-5">
          {t(
            "vehicles.averageWeightChart.weightOfWaste",
            "Weight of Waste (Ton)"
          )}
        </p>

        {/* =================================================
            CHART
        ================================================= */}

        <div className="h-[325px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={chartData}
              margin={{
                top: 12,
                right: 15,
                left: -8,
                bottom: 10,
              }}
            >

              {/* =================================================
                  GRID
              ================================================= */}

              <CartesianGrid
                stroke="#F2F4F7"
                vertical={false}
              />

              {/* =================================================
                  X AXIS
              ================================================= */}

              <XAxis
                dataKey="zone"
                interval={0}
                tickLine={false}
                axisLine={false}
                height={78}
                tickMargin={8}
                tick={
                  <CustomXAxisTick />
                }
              />

              {/* =================================================
                  Y AXIS
              ================================================= */}

              <YAxis
                domain={[
                  0,
                  100,
                ]}
                ticks={[
                  0,
                  20,
                  40,
                  60,
                  80,
                  100,
                ]}
                tick={{
                  fontSize: 11,
                  fill: "#233876",
                  fontWeight: 500,
                }}
                tickLine={false}
                axisLine={false}
              />

              {/* =================================================
                  TOOLTIP
              ================================================= */}

              <Tooltip
                cursor={{
                  stroke: "#6C2BFF",
                  strokeWidth: 1.5,
                  strokeDasharray:
                    "4 4",
                }}
                content={
                  <CustomTooltip
                    t={t}
                  />
                }
              />

              {/* =================================================
                  THRESHOLD
              ================================================= */}

              <ReferenceLine
                y={THRESHOLD}
                stroke="#FF5A5F"
                strokeWidth={1.8}
                strokeDasharray="6 6"
                label=""
              />

              {/* =================================================
                  WASTE LINE
              ================================================= */}

              <Line
                type="monotone"
                dataKey="waste"
                stroke="#6C2BFF"
                strokeWidth={2.8}
                dot={{
                  r: 5,
                  strokeWidth: 3,
                  fill: "#FFFFFF",
                  stroke:
                    "#6C2BFF",
                }}
                activeDot={{
                  r: 7,
                  fill: "#6C2BFF",
                  stroke:
                    "#FFFFFF",
                  strokeWidth: 3,
                }}
                animationDuration={
                  1200
                }
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* =====================================================
            LEGEND
        ===================================================== */}

        <div className="flex justify-center items-center gap-10 mt-2">

          {/* ================= WASTE ================= */}

          <div className="flex items-center gap-2.5">

            <div className="w-5 h-[3px] bg-[#6C2BFF] rounded-full shrink-0" />

            <span className="text-[12px] font-medium text-[#233876]">
              {t(
                "vehicles.averageWeightChart.wasteGeneratedLegend",
                "Waste Generated (Ton)"
              )}
            </span>

          </div>

          {/* ================= THRESHOLD ================= */}

          <div className="flex items-center gap-2.5">

            <div className="w-5 border-t-2 border-dashed border-[#FF5A5F] shrink-0" />

            <span className="text-[12px] font-medium text-[#233876]">
              {t(
                "vehicles.averageWeightChart.thresholdLegend",
                "Average Waste Generated (Threshold)"
              )}
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}