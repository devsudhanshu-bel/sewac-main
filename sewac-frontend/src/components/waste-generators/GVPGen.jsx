import { useEffect, useRef } from "react";
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

const data = [
  {
    zone: "West Zone",
    value: 4200,
    color: "#16A34A",
  },
  {
    zone: "North Zone",
    value: 11200,
    color: "#DC2626",
  },
  {
    zone: "Central Zone",
    value: 5600,
    color: "#16A34A",
  },
  {
    zone: "East Zone",
    value: 13800,
    color: "#DC2626",
  },
  {
    zone: "South Zone",
    value: 5200,
    color: "#16A34A",
  },
  {
    zone: "South East Zone",
    value: 6100,
    color: "#16A34A",
  },
  {
    zone: "North East Zone",
    value: 9700,
    color: "#DC2626",
  },
];

function Dot(props) {
  const { cx, cy, payload } = props;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={payload.color}
        stroke="#ffffff"
        strokeWidth={2}
      />
    </g>
  );
}

function ValueLabel(props) {
  const { x, y, value, index } = props;

  const color =
    data[index].value >= 6500
      ? "#DC2626"
      : "#16A34A";

  return (
    <text
      x={x}
      y={y - 12}
      textAnchor="middle"
      fontSize="11"
      fontWeight="700"
      fill={color}
    >
      {value.toLocaleString()} Kg
    </text>
  );
}

export default function GVPGen() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      requestAnimationFrame(() => {
        gsap.from(sectionRef.current, {
          opacity: 0,
          y: 10,
          duration: 0.35,
          ease: "power2.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="
        mt-5
        bg-white
        rounded-3xl
        border
        border-slate-200
        shadow-[0_2px_12px_rgba(0,0,0,0.04)]
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

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <span
            className="
              text-[11px]
              text-slate-500
            "
          >
            View By:
          </span>

          <select
            className="
              h-8
              w-24
              rounded-lg
              border
              border-slate-200
              text-[11px]
              px-3
              outline-none
              transition-all
              duration-200
              hover:border-violet-300
              focus:border-violet-500
            "
          >
            <option>Zone</option>
          </select>

        </div>

      </div>

      {/* ================= Chart ================= */}

      <div className="h-[250px] pr-5 pb-4">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={data}
            margin={{
              top: 30,
              right: 20,
              left: 5,
              bottom: 10,
            }}
          >

            <CartesianGrid
              vertical={false}
              stroke="#F2F4F7"
            />

            <XAxis
              dataKey="zone"
              tick={{
                fontSize: 11,
                fill: "#475569",
                fontWeight: 600,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              ticks={[
                0,
                3000,
                6000,
                9000,
                12000,
                15000,
              ]}
              tick={{
                fontSize: 11,
                fill: "#475569",
              }}
              axisLine={false}
              tickLine={false}
              width={45}
              tickFormatter={(v) =>
                v === 0 ? "0" : `${v / 1000}K`
              }
            />
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

            <Tooltip
              cursor={false}
              formatter={(value) => [
                `${Number(value).toLocaleString()} Kg`,
                "Generated",
              ]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                boxShadow: "0 6px 18px rgba(0,0,0,.08)",
                fontSize: 12,
              }}
            />

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
              <LabelList
                dataKey="value"
                content={<ValueLabel />}
              />
            </Line>

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}