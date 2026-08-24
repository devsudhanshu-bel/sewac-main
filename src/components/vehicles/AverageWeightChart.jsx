import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

import { BarChart3 } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import api from "../../api/axios";

import { useLanguage } from "../../i18n";

/* ===========================================================
   EMPTY DATA
=========================================================== */

const EMPTY_DATA = [];

/* ===========================================================
   ZONE BAR COLORS
=========================================================== */

const BAR_COLORS = [
  "#6C2BFF",
  "#8B5CF6",
  "#A855F7",
  "#7C3AED",
  "#9333EA",
  "#5B21B6",
  "#4F46E5",
  "#6366F1",
];

/* ===========================================================
   FORMAT WASTE
=========================================================== */

/*
|--------------------------------------------------------------------------
| IMPORTANT
|--------------------------------------------------------------------------
|
| Backend waste value is treated as KG.
|
| < 1000 KG
|       ↓
| 850.25 kg
|
| >= 1000 KG
|       ↓
| 3.24 Ton
|
|--------------------------------------------------------------------------
*/

function formatWaste(value) {
  const kg = Number(value) || 0;

  if (kg >= 1000) {
    return {
      value: Number((kg / 1000).toFixed(2)),

      unit: "Ton",
    };
  }

  return {
    value: Number(kg.toFixed(2)),

    unit: "kg",
  };
}

/* ===========================================================
   FORMAT WASTE TEXT
=========================================================== */

function formatWasteText(value) {
  const formatted = formatWaste(value);

  return `${formatted.value.toFixed(2)} ${formatted.unit}`;
}

/* ===========================================================
   CUSTOM X AXIS
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

function CustomTooltip({ active, payload, t }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0]?.payload;

  if (!data) {
    return null;
  }

  const zoneName = String(data.zone || "Unknown Zone").replace("\n", " ");

  const waste = Number(data.waste) || 0;

  const vehicles = Number(data.vehicles) || 0;

  return (
    <div className="bg-white rounded-xl border border-[#ECECF3] shadow-xl px-4 py-3 min-w-[240px]">
      <div className="space-y-3 text-[12px]">
        {/* =================================================
            ZONE NAME
        ================================================= */}

        <div className="flex justify-between gap-5">
          <span className="font-semibold text-[#374151]">
            {t("vehicles.averageWeightChart.zoneName", "Zone Name")}
          </span>

          <span className="font-semibold text-right text-[#111827]">
            {zoneName}
          </span>
        </div>

        {/* =================================================
            WASTE GENERATED
        ================================================= */}

        <div className="flex justify-between gap-5">
          <span className="font-semibold text-[#374151]">
            {t("vehicles.averageWeightChart.wasteGenerated", "Waste Generated")}
          </span>

          <span className="font-semibold text-[#111827]">
            {formatWasteText(waste)}
          </span>
        </div>

        {/* =================================================
            VEHICLES
        ================================================= */}

        <div className="flex justify-between gap-5">
          <span className="font-semibold text-[#374151]">
            {t(
              "vehicles.averageWeightChart.vehiclesRunning",
              "Vehicles Running",
            )}
          </span>

          <span className="font-semibold text-[#111827]">{vehicles}</span>
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
     FETCH REAL ZONE DATA
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadAverageWeight = async () => {
      try {
        setLoading(true);

        setError("");

        /*
         * Current date
         */

        const today = new Date().toISOString().split("T")[0];

        /*
         * Existing backend endpoint
         */

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

        /*
         * =================================================
         * FORMAT EVERY ZONE
         * =================================================
         */

        const formattedZones = zones.map((zone) => {
          const zoneName = String(
            zone?.zone || zone?.zoneName || "Unknown Zone",
          );

          return {
            zone: zoneName.replace(" City Corporation", "\nCity Corporation"),

            /*
             * KEEP RAW KG VALUE
             */

            waste: Number(zone?.waste) || 0,

            vehicles: Number(zone?.vehicles) || 0,

            vehiclesWithTelemetry: Number(zone?.vehiclesWithTelemetry) || 0,
          };
        });

        setChartData(formattedZones);

        /*
         * Backend average is also
         * treated as KG.
         */

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

    /*
     * Empty / zero case
     */

    if (maximum <= 0) {
      return {
        domain: [0, 1000],

        ticks: [0, 200, 400, 600, 800, 1000],
      };
    }

    /*
     * Keep approximately
     * five intervals.
     */

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
     HEADER AVERAGE DISPLAY
  ========================================================= */

  const formattedAverage = formatWaste(overallAverage);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="bg-white rounded-[24px] border border-[#ECECF3] shadow-sm overflow-hidden">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="px-7 py-5 border-b border-[#F5F6FA]">
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
                "Average Weight Generated (Bar Graph)",
              )}
            </h2>
          </div>

          {/* =================================================
              AVERAGE
          ================================================= */}

          <p className="mt-2.5 text-[14px] font-semibold text-[#1E3A8A]">
            {t(
              "vehicles.averageWeightChart.averageWasteGenerated",
              "Average waste generated:",
            )}

            <span className="ml-1.5 text-[#233876]">
              {formattedAverage.value.toFixed(2)} {formattedAverage.unit}
            </span>
          </p>
        </div>
      </div>

      {/* =====================================================
          CHART AREA
      ===================================================== */}

      <div className="px-7 py-6">
        <p className="text-[13px] font-semibold text-[#233876] mb-5">
          {t(
            "vehicles.averageWeightChart.weightOfWaste",
            "Weight of Waste (kg)",
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
            BAR GRAPH
        ================================================= */}

        {!loading && !error && chartData.length > 0 && (
          <div className="h-[325px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 12,
                  right: 15,
                  left: -8,
                  bottom: 10,
                }}
                barCategoryGap="25%"
              >
                {/* =======================================
                      GRID
                  ======================================= */}

                <CartesianGrid stroke="#F2F4F7" vertical={false} />

                {/* =======================================
                      X AXIS
                  ======================================= */}

                <XAxis
                  dataKey="zone"
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  height={78}
                  tickMargin={8}
                  tick={<CustomXAxisTick />}
                />

                {/* =======================================
                      Y AXIS
                  ======================================= */}

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

                {/* =======================================
                      TOOLTIP
                  ======================================= */}

                <Tooltip
                  cursor={{
                    fill: "rgba(108,43,255,0.05)",
                  }}
                  content={<CustomTooltip t={t} />}
                />

                {/* =======================================
                      BARS
                  ======================================= */}

                <Bar
                  dataKey="waste"
                  name="Waste Generated"
                  radius={[7, 7, 0, 0]}
                  maxBarSize={65}
                  animationDuration={900}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`zone-bar-${index}`}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* =====================================================
            LEGEND
        ===================================================== */}

        <div className="flex justify-center items-center gap-10 mt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-3 bg-[#6C2BFF] rounded-[3px] shrink-0" />

            <span className="text-[12px] font-medium text-[#233876]">
              {t(
                "vehicles.averageWeightChart.wasteGeneratedLegend",
                "Waste Generated",
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
