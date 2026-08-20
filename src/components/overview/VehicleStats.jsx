import { useEffect, useMemo, useRef } from "react";

import { Truck } from "lucide-react";

import { gsap } from "gsap";

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

import { useLanguage } from "../../i18n";

export default function VehicleStats({ vehicleData, trendData }) {
  const sectionRef = useRef(null);

  const leftCardRef = useRef(null);

  const rightCardRef = useRef(null);

  const statCardsRef = useRef([]);

  const { t } = useLanguage();

  /* =========================================================
     SAFE VEHICLE DATA
  ========================================================= */

  const safeVehicleData = useMemo(
    () => ({
      totalVehicles: 0,

      runningVehicles: 0,

      inactiveVehicles: 0,

      vehicleStatus: [],

      inactivityThresholdMinutes: 30,

      ...(vehicleData || {}),
    }),
    [vehicleData],
  );

  /* =========================================================
     VEHICLE FLEET DATA
  ========================================================= */

  const vehicleStats = useMemo(() => {
    const totalVehicles = Number(safeVehicleData.totalVehicles) || 0;

    const runningVehicles = Number(safeVehicleData.runningVehicles) || 0;

    const inactiveVehicles = Number(safeVehicleData.inactiveVehicles) || 0;

    return [
      {
        title: t(
          "overview.vehicleFleet.totalRegistered",
          "Total Registered Vehicles",
        ),

        value: totalVehicles.toLocaleString(),

        color: "text-violet-600",

        bg: "bg-violet-50",
      },

      {
        title: t("overview.vehicleFleet.running", "Running Vehicles"),

        value: runningVehicles.toLocaleString(),

        percentage:
          totalVehicles > 0
            ? `(${((runningVehicles / totalVehicles) * 100).toFixed(1)}%)`
            : "(0%)",

        color: "text-green-600",

        bg: "bg-green-50",
      },

      {
        title: t("overview.vehicleFleet.notRunning", "Not Running Vehicles"),

        value: inactiveVehicles.toLocaleString(),

        percentage:
          totalVehicles > 0
            ? `(${((inactiveVehicles / totalVehicles) * 100).toFixed(1)}%)`
            : "(0%)",

        color: "text-red-500",

        bg: "bg-red-50",
      },
    ];
  }, [safeVehicleData, t]);

  /* =========================================================
     WARD-WISE GENERATION DATA
  =========================================================
   *
   * Backend sends:
   *
   * wasteGenerated = KG
   *
   * Graph displays:
   *
   * wasteTons = KG / 1000
   */

  const chartData = useMemo(() => {
    if (!Array.isArray(trendData)) {
      return [];
    }

    return trendData.map((item) => {
      const wasteKg = Number(item?.wasteGenerated) || 0;

      return {
        ward:
          item?.wardName ||
          `${t("overview.generationTrend.ward", "Ward")} ${item?.wardNo ?? ""}`,

        wardNo: item?.wardNo,

        fullName:
          item?.wardName ||
          `${t("overview.generationTrend.ward", "Ward")} ${item?.wardNo ?? ""}`,

        wasteKg,

        wasteTons: wasteKg / 1000,
      };
    });
  }, [trendData, t]);

  /* =========================================================
     GSAP ANIMATION
  ========================================================= */

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    tl.from(sectionRef.current, {
      opacity: 0,

      y: 25,

      duration: 0.4,
    })
      .from(
        leftCardRef.current,
        {
          opacity: 0,

          y: 30,

          scale: 0.97,

          filter: "blur(8px)",

          duration: 0.7,

          clearProps: "filter",
        },
        "-=0.2",
      )
      .from(
        rightCardRef.current,
        {
          opacity: 0,

          y: 30,

          scale: 0.97,

          filter: "blur(8px)",

          duration: 0.7,

          clearProps: "filter",
        },
        "-=0.55",
      )
      .from(
        statCardsRef.current,
        {
          opacity: 0,

          y: 18,

          scale: 0.95,

          stagger: 0.08,

          duration: 0.45,

          ease: "back.out(1.4)",
        },
        "-=0.45",
      );

    return () => {
      tl.kill();
    };
  }, []);

  /* =========================================================
     CUSTOM TOOLTIP
  ========================================================= */

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const point = payload[0]?.payload;

    if (!point) {
      return null;
    }

    const tons = Number(point.wasteTons) || 0;

    return (
      <div
        className="
          rounded-xl
          border
          border-gray-200
          bg-white
          px-4
          py-3
          shadow-[0_10px_25px_rgba(0,0,0,0.08)]
        "
      >
        <p className="text-[15px] font-semibold text-gray-900">
          {point.fullName}
        </p>

        <p className="mt-2 text-[14px] font-medium text-violet-600">
          {t("overview.generationTrend.wasteGeneratedLabel", "Waste Generated")}
          {": "}
          {tons.toLocaleString(undefined, {
            minimumFractionDigits: 2,

            maximumFractionDigits: 2,
          })}{" "}
          {tons === 1
            ? t("overview.kpis.ton", "ton")
            : t("overview.kpis.tons", "tons")}
        </p>
      </div>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section ref={sectionRef} className="mt-6">
      <div className="grid grid-cols-[0.7fr_1.3fr] gap-6 items-start">
        {/* =================================================
            VEHICLE DETAILS
        ================================================= */}

        <div
          ref={leftCardRef}
          className="
            bg-white
            border
            border-[#EEF1F6]
            rounded-[24px]
            p-6
            shadow-sm
            h-[520px]
            flex
            flex-col
          "
        >
          {/* ================= HEADER ================= */}

          <div className="flex items-center gap-3 mb-6">
            <Truck size={18} className="text-violet-600" />

            <h2 className="text-[18px] font-semibold">
              {t("overview.vehicleFleet.title", "VEHICLE FLEET STATUS")}
            </h2>

            <span className="text-[13px] text-indigo-600 font-medium">
              ({t("overview.vehicleFleet.allVehicles", "All Vehicles")}{" "}
              {t("overview.vehicleFleet.included", "Included")})
            </span>
          </div>

          {/* ================= VEHICLE STATS ================= */}

          <div className="grid grid-cols-1 gap-4">
            {vehicleStats.map((item, index) => (
              <div
                key={item.title}
                ref={(element) => {
                  statCardsRef.current[index] = element;
                }}
                className="
                    border
                    border-[#EEF1F6]
                    rounded-2xl
                    h-[72px]
                    px-4
                    flex
                    items-center
                  "
              >
                <div
                  className={`
                      w-9
                      h-9
                      rounded-xl
                      ${item.bg}
                      flex
                      items-center
                      justify-center
                    `}
                >
                  <Truck size={21} className={item.color} />
                </div>

                <div className="ml-4">
                  <p className="text-[13px] text-gray-600 font-medium">
                    {item.title}
                  </p>

                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-[16px] font-bold">{item.value}</span>

                    {item.percentage && (
                      <span
                        className={`
                            text-[13px]
                            font-semibold
                            ${item.color}
                          `}
                      >
                        {item.percentage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =================================================
            WARD-WISE GENERATION TREND
        ================================================= */}

        <div
          ref={rightCardRef}
          className="
            bg-white
            border
            border-[#EEF1F6]
            rounded-[24px]
            p-6
            shadow-sm
            h-[520px]
            flex
            flex-col
          "
        >
          {/* ================= HEADER ================= */}

          <h2 className="text-[18px] font-semibold mb-5">
            {t("overview.generationTrend.title", "GENERATION TREND")}
          </h2>

          {/* ================= CHART ================= */}

          <div className="flex-1 min-h-0 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,

                  right: 25,

                  left: 10,

                  bottom: 75,
                }}
              >
                <CartesianGrid stroke="#F1F5F9" vertical={false} />

                {/* ================= X AXIS ================= */}

                <XAxis
                  dataKey="ward"
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  height={75}
                  angle={-25}
                  textAnchor="end"
                  tick={{
                    fontSize: 11,

                    fontWeight: 600,

                    fill: "#475569",
                  }}
                  label={{
                    value: t("overview.generationTrend.wards", "Wards"),

                    position: "insideBottom",

                    offset: -8,

                    style: {
                      fontSize: 13,

                      fill: "#64748B",

                      fontWeight: 600,
                    },
                  }}
                />

                {/* ================= Y AXIS ================= */}

                <YAxis
                  allowDecimals
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 12,

                    fill: "#64748B",
                  }}
                  label={{
                    value: t(
                      "overview.generationTrend.wasteGenerated",
                      "Waste Generated (tons)",
                    ),

                    angle: -90,

                    position: "insideLeft",

                    style: {
                      textAnchor: "middle",

                      fontSize: 13,

                      fill: "#64748B",

                      fontWeight: 600,
                    },
                  }}
                />

                {/* ================= TOOLTIP ================= */}

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#CBD5E1",

                    strokeWidth: 1,

                    strokeDasharray: "4 4",
                  }}
                />

                {/* =================================================
                    VERTICAL STEMS
                ================================================= */}

                {chartData.map((item) => (
                  <ReferenceLine
                    key={`stem-${item.wardNo}`}
                    segment={[
                      {
                        x: item.ward,

                        y: 0,
                      },

                      {
                        x: item.ward,

                        y: item.wasteTons,
                      },
                    ]}
                    stroke="#C4B5FD"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                ))}

                {/* ================= LINE ================= */}

                <Line
                  type="monotone"
                  dataKey="wasteTons"
                  stroke="#7C3AED"
                  strokeWidth={3}
                  dot={{
                    r: 5,

                    strokeWidth: 2,

                    fill: "#FFFFFF",

                    stroke: "#7C3AED",
                  }}
                  activeDot={{
                    r: 7,

                    strokeWidth: 3,

                    fill: "#FFFFFF",

                    stroke: "#7C3AED",
                  }}
                  connectNulls
                  isAnimationActive
                  animationDuration={900}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
