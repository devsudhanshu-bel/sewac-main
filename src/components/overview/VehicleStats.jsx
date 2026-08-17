import { useEffect, useRef } from "react";
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

export default function VehicleStats({ vehicleData, trendData }) {
  const sectionRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const statCardsRef = useRef([]);

  /*
   * =========================================================
   * VEHICLE FLEET DATA
   * =========================================================
   */

  const vehicleStats = vehicleData
    ? [
        {
          title: "Total Registered Vehicles",

          value: Number(vehicleData.totalVehicles).toLocaleString(),

          color: "text-violet-600",

          bg: "bg-violet-50",
        },

        {
          title: "Running Vehicles",

          value: Number(vehicleData.runningVehicles).toLocaleString(),

          percentage:
            vehicleData.totalVehicles > 0
              ? `(${(
                  (vehicleData.runningVehicles / vehicleData.totalVehicles) *
                  100
                ).toFixed(1)}%)`
              : "(0%)",

          color: "text-green-600",

          bg: "bg-green-50",
        },

        {
          title: "Not Running Vehicles",

          value: Number(vehicleData.inactiveVehicles).toLocaleString(),

          percentage:
            vehicleData.totalVehicles > 0
              ? `(${(
                  (vehicleData.inactiveVehicles / vehicleData.totalVehicles) *
                  100
                ).toFixed(1)}%)`
              : "(0%)",

          color: "text-red-500",

          bg: "bg-red-50",
        },
      ]
    : [];

  /*
   * =========================================================
   * WARD-WISE GENERATION DATA
   * =========================================================
   *
   * Backend sends:
   *
   * wasteGenerated = KG
   *
   * Graph uses:
   *
   * wasteTons = KG / 1000
   */

  const chartData =
    trendData?.map((item) => ({
      ward: item.wardName || `Ward ${item.wardNo}`,

      wardNo: item.wardNo,

      fullName: item.wardName || `Ward ${item.wardNo}`,

      wasteKg: Number(item.wasteGenerated) || 0,

      wasteTons: (Number(item.wasteGenerated) || 0) / 1000,
    })) || [];

  /*
   * =========================================================
   * GSAP ANIMATION
   * =========================================================
   */

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
  }, []);

  /*
   * =========================================================
   * CUSTOM TOOLTIP
   * =========================================================
   */

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
          Waste Generated:{" "}
          {tons.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          {tons === 1 ? "ton" : "tons"}
        </p>
      </div>
    );
  };

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
          <div className="flex items-center gap-3 mb-6">
            <Truck size={18} className="text-violet-600" />

            <h2 className="text-[18px] font-semibold">VEHICLE FLEET STATUS</h2>

            <span className="text-[13px] text-indigo-600 font-medium">
              (All Vehicles Included)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {vehicleStats.map((item, index) => (
              <div
                key={item.title}
                ref={(el) => (statCardsRef.current[index] = el)}
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
          <h2 className="text-[18px] font-semibold mb-5">GENERATION TREND</h2>

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
                    value: "Wards",
                    position: "insideBottom",
                    offset: -8,
                    style: {
                      fontSize: 13,
                      fill: "#64748B",
                      fontWeight: 600,
                    },
                  }}
                />

                <YAxis
                  allowDecimals={true}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#64748B",
                  }}
                  label={{
                    value: "Waste Generated (tons)",
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

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#CBD5E1",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />

                {/* =====================================================
      VERTICAL STEMS
      Each stem connects the X-axis to its data point.
      ===================================================== */}

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
