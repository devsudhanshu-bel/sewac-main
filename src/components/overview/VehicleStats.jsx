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
  Legend,
} from "recharts";

export default function VehicleStats({ vehicleData, trendData }) {
  const sectionRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const statCardsRef = useRef([]);

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

  const chartData =
    trendData?.map((item) => ({
      zone: item.label,
      waste: item.wasteGenerated,
    })) || [];

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

  return (
    <section ref={sectionRef} className="mt-6">
      <div className="grid grid-cols-[0.9fr_1.1fr] gap-6 items-start">
        {/* ================= VEHICLE DETAILS ================= */}

        <div
          ref={leftCardRef}
          className="bg-white border border-[#EEF1F6] rounded-[24px] p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Truck size={18} className="text-violet-600" />

            <h2 className="text-[18px] font-semibold">VEHICLE DETAILS</h2>

            <span className="text-[13px] text-indigo-600 font-medium">
              (All Vehicles Included)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {vehicleStats.map((item, index) => (
              <div
                key={item.title}
                ref={(el) => (statCardsRef.current[index] = el)}
                className="border border-[#EEF1F6] rounded-2xl h-[72px] px-4 flex items-center"
              >
                <div
                  className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center`}
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
                        className={`text-[13px] font-semibold ${item.color}`}
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

        {/* ================= GENERATION TREND ================= */}

        <div
          ref={rightCardRef}
          className="bg-white border border-[#EEF1F6] rounded-[24px] p-6 shadow-sm"
        >
          <h2 className="text-[18px] font-semibold mb-5">GENERATION TREND</h2>

          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 50,
                }}
              >
                <CartesianGrid stroke="#F1F5F9" vertical={false} />

                <XAxis
                  dataKey="zone"
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  height={70}
                  tick={{
                    fontSize: 11,
                    fill: "#64748B",
                  }}
                />

                <YAxis
                  domain={[0, 10000]}
                  ticks={[0, 2000, 4000, 6000, 8000, 10000]}
                  tick={{
                    fontSize: 11,
                    fill: "#6B7280",
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  }}
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "12px",
                    paddingBottom: "12px",
                  }}
                />

                <ReferenceLine
                  y={6500}
                  stroke="#EF4444"
                  strokeDasharray="6 6"
                  label={{
                    value: "Threshold",
                    position: "right",
                    fill: "#EF4444",
                    fontSize: 12,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="waste"
                  stroke="#7C3AED"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    strokeWidth: 3,
                    fill: "#fff",
                  }}
                  activeDot={{
                    r: 7,
                  }}
                  name="Waste Generated"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
