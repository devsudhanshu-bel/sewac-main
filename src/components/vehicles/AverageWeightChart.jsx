import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { BarChart3, ChevronDown } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import api from "../../api/axios";

import { useLanguage } from "../../i18n";

/* ===========================================================
   DEFAULT DATA
=========================================================== */

const EMPTY_DATA = [];

/* ===========================================================
   CUSTOM X-AXIS TICK
   Prevents zone labels from overlapping
=========================================================== */

function CustomXAxisTick({ x, y, payload }) {
  const value = payload?.value || "";

  if (!value) {
    return null;
  }

  const lines = String(value).split("\n");

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="#233876" fontSize={10} fontWeight={500}>
        {lines.map((line, index) => (
          <tspan key={`${line}-${index}`} x="0" dy={index === 0 ? 0 : 13}>
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

function CustomTooltip({ active, payload, t, overallAverage }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0]?.payload;

  if (!data) {
    return null;
  }

  const waste = Number(data.waste) || 0;

  const average = Number(overallAverage) || 0;

  const difference = (waste - average).toFixed(2);

  const isAboveAverage = waste >= average;

  return (
    <div className="bg-white rounded-xl border border-[#ECECF3] shadow-xl px-4 py-3 min-w-[240px]">
      <div className="space-y-2 text-[12px]">
        {/* =====================================================
            ZONE NAME
        ===================================================== */}

        <div className="flex justify-between gap-5">
          <span className="font-semibold text-[#374151]">
            {t("vehicles.averageWeightChart.zoneName", "Zone Name")}
          </span>

          <span className="font-semibold text-right">
            {String(data.zone || "-").replace("\n", " ")}
          </span>
        </div>

        {/* =====================================================
            WASTE GENERATED
        ===================================================== */}

        <div className="flex justify-between gap-5">
          <span className="font-semibold text-[#374151]">
            {t("vehicles.averageWeightChart.wasteGenerated", "Waste Generated")}
          </span>

          <span className="font-semibold">
            {waste.toFixed(2)} {t("units.ton", "Ton")}
          </span>
        </div>

        {/* =====================================================
            VEHICLES
        ===================================================== */}

        <div className="flex justify-between gap-5">
          <span className="font-semibold text-[#374151]">
            {t(
              "vehicles.averageWeightChart.vehiclesRunning",
              "Vehicles Running",
            )}
          </span>

          <span className="font-semibold">{Number(data.vehicles || 0)}</span>
        </div>

        {/* =====================================================
            DIFFERENCE FROM OVERALL AVERAGE
        ===================================================== */}

        <div className="flex justify-between gap-5">
          <span className="font-semibold text-[#374151]">
            {t("vehicles.averageWeightChart.difference", "Difference")}
          </span>

          <span
            className={`font-semibold ${
              isAboveAverage ? "text-green-600" : "text-red-500"
            }`}
          >
            {isAboveAverage ? "+" : ""}
            {difference} {t("units.ton", "Ton")}
          </span>
        </div>

        {/* =====================================================
            ABOVE / BELOW AVERAGE
        ===================================================== */}

        <div className="text-center pt-0.5">
          <span
            className={`font-semibold ${
              isAboveAverage ? "text-green-600" : "text-red-500"
            }`}
          >
            {isAboveAverage ? "(Above Average)" : "(Below Average)"}
          </span>
        </div>

        {/* =====================================================
            OVERALL AVERAGE
        ===================================================== */}

        <div className="border-t border-[#EEF0F4] pt-2 flex justify-between gap-5">
          <span className="font-semibold text-[#374151]">
            {t("vehicles.averageWeightChart.averageWaste", "Average Waste")}
          </span>

          <span className="font-semibold">
            {average.toFixed(2)} {t("units.ton", "Ton")}
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

  /* =========================================================
     STATE
  ========================================================= */

  const [chartData, setChartData] = useState(EMPTY_DATA);

  const [overallAverage, setOverallAverage] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     LOAD REAL ZONE DATA
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadAverageWeight = async () => {
      try {
        setLoading(true);

        setError("");

        const today = new Date().toISOString().split("T")[0];

        const response = await api.get("/api/vehicles/average-weight-by-zone", {
          params: {
            date: today,
          },
        });

        if (cancelled) {
          return;
        }

        const data = response?.data?.data;

        const zones = Array.isArray(data?.zones) ? data.zones : [];

        const formattedZones = zones.map((zone) => {
          const zoneName = String(
            zone?.zone || zone?.zoneName || "Unknown Zone",
          );

          return {
            zone: zoneName.replace(" City Corporation", "\nCity Corporation"),

            waste: Number(zone?.waste) || 0,

            vehicles: Number(zone?.vehicles) || 0,

            vehiclesWithTelemetry: Number(zone?.vehiclesWithTelemetry) || 0,
          };
        });

        setChartData(formattedZones);

        setOverallAverage(Number(data?.averageWasteGenerated) || 0);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error("Average Weight Chart Error:", err);

        setChartData(EMPTY_DATA);

        setOverallAverage(0);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load waste generation data.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAverageWeight();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     DYNAMIC Y AXIS
  ========================================================= */

  const yAxisConfig = useMemo(() => {
    const values = chartData.map((item) => Number(item.waste) || 0);

    const maximum = Math.max(...values, 0);

    if (maximum <= 0) {
      return {
        domain: [0, 100],
        ticks: [0, 20, 40, 60, 80, 100],
      };
    }

    const rawStep = maximum / 5;

    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));

    const normalized = rawStep / magnitude;

    let step;

    if (normalized <= 1) {
      step = 1 * magnitude;
    } else if (normalized <= 2) {
      step = 2 * magnitude;
    } else if (normalized <= 5) {
      step = 5 * magnitude;
    } else {
      step = 10 * magnitude;
    }

    const upper = Math.ceil(maximum / step) * step;

    const ticks = [];

    for (let value = 0; value <= upper; value += step) {
      ticks.push(Number(value.toFixed(6)));
    }

    return {
      domain: [0, upper],

      ticks,
    };
  }, [chartData]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="bg-white rounded-[24px] border border-[#ECECF3] shadow-sm overflow-hidden">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between px-7 py-5 border-b border-[#F5F6FA]">
        {/* ================= LEFT ================= */}

        <div className="min-w-0">
          <div className="flex items-start gap-2.5">
            <BarChart3
              size={17}
              strokeWidth={2}
              className="text-[#6C2BFF] mt-1 shrink-0"
            />

            <h2 className="text-[16px] font-semibold text-[#111827] uppercase tracking-[-0.01em] leading-6">
              {t(
                "vehicles.averageWeightChart.title",
                "Average Weight Generated (Line Graph)",
              )}
            </h2>
          </div>

          {/* ================= AVERAGE ================= */}

          <p className="mt-2.5 text-[14px] font-semibold text-[#1E3A8A]">
            {t(
              "vehicles.averageWeightChart.averageWasteGenerated",
              "Average waste generated:",
            )}

            <span className="ml-1.5 text-[#233876]">
              {overallAverage.toFixed(2)} {t("units.ton", "Ton")}
            </span>
          </p>
        </div>

        {/* ================= VIEW BY ================= */}

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[13px] font-semibold text-[#233876]">
            {t("vehicles.averageWeightChart.viewBy", "View By:")}
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
              {t("vehicles.averageWeightChart.city", "City")}
            </span>

            <ChevronDown size={16} className="text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* =====================================================
          CHART AREA
      ===================================================== */}

      <div className="px-7 py-6">
        <p className="text-[13px] font-semibold text-[#233876] mb-5">
          {t(
            "vehicles.averageWeightChart.weightOfWaste",
            "Weight of Waste (Ton)",
          )}
        </p>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="h-[325px] flex items-center justify-center">
            <span className="text-[13px] font-medium text-slate-400">
              Loading waste generation data...
            </span>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="h-[325px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-[13px] font-semibold text-red-500">
                Unable to load waste generation data
              </p>

              <p className="mt-1 text-[11px] text-slate-400">{error}</p>
            </div>
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading && !error && chartData.length === 0 && (
          <div className="h-[325px] flex items-center justify-center">
            <span className="text-[13px] font-medium text-slate-400">
              No waste generation data available.
            </span>
          </div>
        )}

        {/* =================================================
            CHART
        ================================================= */}

        {!loading && !error && chartData.length > 0 && (
          <div className="h-[325px]">
            <ResponsiveContainer width="100%" height="100%">
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

                <CartesianGrid stroke="#F2F4F7" vertical={false} />

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
                  tick={<CustomXAxisTick />}
                />

                {/* =================================================
                      Y AXIS
                  ================================================= */}

                <YAxis
                  domain={yAxisConfig.domain}
                  ticks={yAxisConfig.ticks}
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
                    strokeDasharray: "4 4",
                  }}
                  content={
                    <CustomTooltip t={t} overallAverage={overallAverage} />
                  }
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
                    stroke: "#6C2BFF",
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#6C2BFF",
                    stroke: "#FFFFFF",
                    strokeWidth: 3,
                  }}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* =====================================================
            LEGEND
        ===================================================== */}

        <div className="flex justify-center items-center gap-10 mt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-[3px] bg-[#6C2BFF] rounded-full shrink-0" />

            <span className="text-[12px] font-medium text-[#233876]">
              {t(
                "vehicles.averageWeightChart.wasteGeneratedLegend",
                "Waste Generated (Ton)",
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
