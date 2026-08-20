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
  {
    zone: "",
    waste: 30,
    vehicles: 76,
  },
];

const THRESHOLD = 70;

/* ===========================================================
   CUSTOM TOOLTIP
=========================================================== */

function CustomTooltip({
  active,
  payload,
  t,
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  const difference = (
    data.waste - THRESHOLD
  ).toFixed(2);

  const isOver = data.waste >= THRESHOLD;

  return (
    <div className="bg-white rounded-2xl border border-[#ECECF3] shadow-xl px-6 py-5 min-w-[280px]">
      <div className="space-y-3 text-[14px]">

        {/* Zone Name */}

        <div className="flex justify-between">
          <span className="font-semibold text-[#374151]">
            {t(
              "vehicles.averageWeightChart.zoneName",
              "Zone Name"
            )}
          </span>

          <span className="font-semibold">
            {data.zone.replace("\n", " ")}
          </span>
        </div>

        {/* Waste Generated */}

        <div className="flex justify-between">
          <span className="font-semibold text-[#374151]">
            {t(
              "vehicles.averageWeightChart.wasteGenerated",
              "Waste Generated"
            )}
          </span>

          <span className="font-semibold">
            {data.waste.toFixed(2)}{" "}
            {t("units.ton", "Ton")}
          </span>
        </div>

        {/* Vehicles Running */}

        <div className="flex justify-between">
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

        {/* Difference */}

        <div className="flex justify-between">
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
            {t("units.ton", "Ton")}
          </span>
        </div>

        {/* Threshold Status */}

        <div className="text-center">
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

        {/* Average Waste */}

        <div className="border-t pt-3 flex justify-between">
          <span className="font-semibold text-[#374151]">
            {t(
              "vehicles.averageWeightChart.averageWaste",
              "Average Waste"
            )}
          </span>

          <span className="font-semibold">
            {THRESHOLD.toFixed(2)}{" "}
            {t("units.ton", "Ton")}
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
    <section className="bg-white rounded-[30px] border border-[#ECECF3] shadow-sm overflow-hidden">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between px-8 py-6 border-b border-[#F5F6FA]">

        <div>

          <div className="flex items-center gap-3">

            <BarChart3
              size={18}
              className="text-[#6C2BFF]"
            />

            <h2 className="text-[18px] font-semibold text-[#111827] uppercase">
              {t(
                "vehicles.averageWeightChart.title",
                "Average Weight Generated (Line Graph)"
              )}
            </h2>

          </div>

          <p className="mt-4 text-[17px] font-semibold text-[#1E3A8A]">

            {t(
              "vehicles.averageWeightChart.averageWasteGenerated",
              "Average waste generated:"
            )}

            <span className="ml-2 text-[#233876]">
              {THRESHOLD.toFixed(2)}{" "}
              {t("units.ton", "Ton")}
            </span>

          </p>

        </div>

        {/* =================================================
            VIEW BY
        ================================================= */}

        <div className="flex items-center gap-4">

          <span className="font-semibold text-[#233876]">
            {t(
              "vehicles.averageWeightChart.viewBy",
              "View By:"
            )}
          </span>

          <button
            type="button"
            className="
              h-[48px]
              w-[170px]
              rounded-xl
              border
              border-[#E6E8F0]
              bg-white
              flex
              items-center
              justify-between
              px-5
              hover:border-[#6C2BFF]
              transition
            "
          >
            <span className="font-medium text-[#111827]">
              {t(
                "vehicles.averageWeightChart.city",
                "City"
              )}
            </span>

            <ChevronDown
              size={18}
              className="text-[#6B7280]"
            />
          </button>

        </div>

      </div>

      {/* =====================================================
          CHART
      ===================================================== */}

      <div className="px-8 py-8">

        <p className="font-semibold text-[#233876] mb-8">
          {t(
            "vehicles.averageWeightChart.weightOfWaste",
            "Weight of Waste (Ton)"
          )}
        </p>

        <div className="h-[300px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: -15,
                bottom: 0,
              }}
            >

              <CartesianGrid
                stroke="#F2F4F7"
                vertical={false}
              />

              <XAxis
                dataKey="zone"
                interval={0}
                tickLine={false}
                axisLine={false}
                height={70}
                tick={{
                  fill: "#233876",
                  fontSize: 13,
                  fontWeight: 500,
                }}
                tickFormatter={(value) =>
                  value.split("\n")
                }
              />

              <YAxis
                domain={[0, 100]}
                ticks={[
                  0,
                  20,
                  40,
                  60,
                  80,
                  100,
                ]}
                tick={{
                  fontSize: 13,
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
                  strokeDasharray: "4 4",
                }}
                content={
                  <CustomTooltip t={t} />
                }
              />

              {/* =================================================
                  THRESHOLD
              ================================================= */}

              <ReferenceLine
                y={THRESHOLD}
                stroke="#FF5A5F"
                strokeWidth={2}
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
                strokeWidth={3}
                dot={{
                  r: 6,
                  strokeWidth: 4,
                  fill: "#FFFFFF",
                  stroke: "#6C2BFF",
                }}
                activeDot={{
                  r: 8,
                  fill: "#6C2BFF",
                  stroke: "#FFFFFF",
                  strokeWidth: 3,
                }}
                animationDuration={1200}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* =====================================================
            LEGEND
        ===================================================== */}

        <div className="flex justify-center items-center gap-12 mt-1">

          {/* Waste Generated */}

          <div className="flex items-center gap-3">

            <div className="w-5 h-[3px] bg-[#6C2BFF] rounded-full" />

            <span className="text-[14px] font-medium text-[#233876]">
              {t(
                "vehicles.averageWeightChart.wasteGeneratedLegend",
                "Waste Generated (Ton)"
              )}
            </span>

          </div>

          {/* Threshold */}

          <div className="flex items-center gap-3">

            <div className="w-5 border-t-2 border-dashed border-[#FF5A5F]" />

            <span className="text-[14px] font-medium text-[#233876]">
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