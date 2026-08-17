import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { gsap } from "gsap";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  LabelList,
} from "recharts";

function Dot(props) {
  const { cx, cy, payload } = props;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={payload?.color || "#16A34A"}
        stroke="#ffffff"
        strokeWidth={2}
      />
    </g>
  );
}

function ValueLabel({ x, y, value }) {
  const color = Number(value) >= 6500 ? "#DC2626" : "#16A34A";

  return (
    <text
      x={x}
      y={y - 12}
      textAnchor="middle"
      fontSize="11"
      fontWeight="700"
      fill={color}
    >
      {Number(value).toFixed(1)} Kg
    </text>
  );
}

export default function GVPGen({
  selectedDate,
  selectedCity,
  selectedZone,
  selectedDivision,
  selectedWard,
}) {
  const [data, setData] = useState([]);

  const sectionRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | GSAP ANIMATION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const ctx = gsap.context(() => {
      requestAnimationFrame(() => {
        if (sectionRef.current) {
          gsap.from(sectionRef.current, {
            opacity: 0,
            y: 10,
            duration: 0.35,
            ease: "power2.out",
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOAD GVP / WARD TREND
  |--------------------------------------------------------------------------
  |
  | The graph follows the Header filters + selected date.
  |
  | The backend is responsible for resolving:
  |
  | City
  |   ↓
  | Zone
  |   ↓
  | Division
  |   ↓
  | Wards
  |   ↓
  | day_DDMMYYYY
  |   ↓
  | Vehicle telemetry tables
  |   ↓
  | GVP / generation per ward
  |
  */

  useEffect(() => {
    const loadTrend = async () => {
      try {
        /*
        |--------------------------------------------------------------------------
        | City is required
        |--------------------------------------------------------------------------
        */

        if (!selectedCity?.city_id) {
          setData([]);
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | Build query
        |--------------------------------------------------------------------------
        */

        const params = new URLSearchParams();

        if (selectedDate) {
          params.set("date", selectedDate);
        }

        params.set("cityId", selectedCity.city_id);

        if (selectedZone?.zone_id) {
          params.set("zoneId", selectedZone.zone_id);
        }

        if (selectedDivision?.division_id) {
          params.set("divisionId", selectedDivision.division_id);
        }

        /*
        |--------------------------------------------------------------------------
        | Ward is passed because it is part of the Header filter flow.
        |
        | The backend should use the division's ward scope for the graph,
        | so the graph can display ward-wise statistics.
        |--------------------------------------------------------------------------
        */

        if (selectedWard?.ward_id) {
          params.set("wardId", selectedWard.ward_id);
        }

        /*
        |--------------------------------------------------------------------------
        | API
        |--------------------------------------------------------------------------
        */

        const res = await api.get(
          `/api/waste-generators/gvp-trend?${params.toString()}`,
        );

        /*
        |--------------------------------------------------------------------------
        | Normalize API response
        |--------------------------------------------------------------------------
        */

        const rows = Array.isArray(res.data?.data) ? res.data.data : [];

        const normalized = rows.map((row) => {
          const value = Number(
            row.gvp ?? row.value ?? row.wasteGenerated ?? row.totalWaste ?? 0,
          );

          return {
            ...row,

            /*
                | Prefer wardName from backend.
                | Fall back to ward number if necessary.
                */

            wardName:
              row.wardName ??
              row.ward_name ??
              `Ward ${row.wardNo ?? row.ward_no ?? ""}`,

            wardNo: row.wardNo ?? row.ward_no ?? null,

            value,

            color: value >= 6500 ? "#DC2626" : "#16A34A",
          };
        });

        /*
        |--------------------------------------------------------------------------
        | Sort wards numerically
        |--------------------------------------------------------------------------
        */

        normalized.sort(
          (a, b) => Number(a.wardNo ?? 0) - Number(b.wardNo ?? 0),
        );

        setData(normalized);
      } catch (err) {
        console.error("GVP Generation Trend Error:", err);

        /*
        |--------------------------------------------------------------------------
        | No data / missing day table
        |--------------------------------------------------------------------------
        */

        setData([]);
      }
    };

    loadTrend();
  }, [
    selectedDate,
    selectedCity?.city_id,
    selectedZone?.zone_id,
    selectedDivision?.division_id,
    selectedWard?.ward_id,
  ]);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div
      ref={sectionRef}
      className="
        bg-white
        rounded-3xl
        border
        border-slate-200
        shadow-[0_2px_12px_rgba(0,0,0,0.04)]
        h-full
        flex
        flex-col
      "
    >
      {/* ================= Header ================= */}

      <div
        className="
          px-6
          pt-5
          pb-2
          flex
          items-center
          justify-between
        "
      >
        <h2
          className="
            text-[15px]
            font-semibold
            text-[#16295A]
          "
        >
          GVP Generation Trend
        </h2>

        {/* ================================================================ */}
        {/* NO VIEW-BY FILTER HERE                                          */}
        {/* ================================================================ */}

        <span
          className="
            text-[11px]
            text-slate-500
          "
        >
          {selectedDate || ""}
        </span>
      </div>

      {/* ================= Chart ================= */}

      <div
        className="
          flex-1
          min-h-[250px]
          pr-5
          pb-4
        "
      >
        {data.length === 0 ? (
          <div
            className="
              h-full
              flex
              items-center
              justify-center
              text-sm
              text-slate-400
            "
          >
            No GVP data found
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 30,
                right: 20,
                left: 5,
                bottom: 25,
              }}
            >
              <CartesianGrid vertical={false} stroke="#F2F4F7" />

              {/* ================= Ward Axis ================= */}

              <XAxis
                dataKey="wardName"
                tick={{
                  fontSize: 11,
                  fill: "#475569",
                  fontWeight: 600,
                }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={55}
              />

              {/* ================= GVP Axis ================= */}

              <YAxis
                ticks={[0, 3000, 6000, 9000, 12000, 15000]}
                tick={{
                  fontSize: 11,
                  fill: "#475569",
                }}
                axisLine={false}
                tickLine={false}
                width={45}
                tickFormatter={(value) =>
                  value === 0 ? "0" : `${value / 1000}K`
                }
              />

              {/* ================= Threshold ================= */}

              <ReferenceLine
                y={6500}
                stroke="#EF4444"
                strokeDasharray="6 4"
                strokeWidth={1.5}
                label={{
                  value: "Threshold = 6,500 Kg",
                  position: "insideTopLeft",
                  fill: "#DC2626",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />

              {/* ================= Tooltip ================= */}

              <Tooltip
                cursor={false}
                formatter={(value) => [
                  `${Number(value).toLocaleString()} Kg`,
                  "GVP Generated",
                ]}
                labelFormatter={(label) => `Ward: ${label}`}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 6px 18px rgba(0,0,0,.08)",
                  fontSize: 12,
                }}
              />

              {/* ================= GVP Line ================= */}

              <Line
                type="monotone"
                dataKey="value"
                stroke="#6D28D9"
                strokeWidth={3}
                dot={<Dot />}
                activeDot={{
                  r: 6,
                  fill: "#6D28D9",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                animationBegin={250}
                animationDuration={900}
                animationEasing="ease-out"
              >
                <LabelList dataKey="value" content={<ValueLabel />} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
