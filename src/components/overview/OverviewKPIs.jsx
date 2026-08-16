import { useEffect, useMemo, useRef } from "react";
import { Trash2, MapPinned, Users, User } from "lucide-react";
import { gsap } from "gsap";

export default function OverviewKPIs({ data }) {
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      {
        opacity: 0,
        y: 28,
        scale: 0.94,
        filter: "blur(8px)",
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "filter",
      },
    );
  }, []);

  /*
   * =========================================================
   * WASTE FORMATTER
   * =========================================================
   *
   * Backend always returns waste in KG.
   *
   * < 1000 KG
   *     → display KG
   *
   * >= 1000 KG
   *     → convert to TON
   *
   * Examples:
   *
   * 850       → 850.00 KG
   * 1000      → 1.00 TON
   * 8106.79   → 8.11 TONS
   */

  const formatWaste = (value) => {
    const kg = Number(value) || 0;

    if (kg >= 1000) {
      const tons = kg / 1000;

      return {
        value: tons.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        unit: tons === 1 ? "TON" : "TONS",
      };
    }

    return {
      value: kg.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      unit: "KG",
    };
  };

  const kpis = useMemo(() => {
    if (!data) return [];

    const waste = formatWaste(data.totalWasteCollected);

    return [
      {
        title: "Total Waste Collected",

        value: waste.value,

        unit: waste.unit,

        icon: Trash2,

        iconColor: "text-pink-500",

        bg: "bg-pink-50",
      },

      {
        title: "Collection Points",

        value: Number(data.collectionPoints).toLocaleString(),

        unit: "",

        icon: MapPinned,

        iconColor: "text-violet-600",

        bg: "bg-violet-50",
      },

      {
        title: "Total Citizens",

        value: Number(data.totalCitizens).toLocaleString(),

        unit: "",

        icon: Users,

        iconColor: "text-violet-600",

        bg: "bg-violet-50",
      },
    ];
  }, [data]);

  if (!data) return null;

  const trashGivenPercentage =
    data.totalCitizens > 0
      ? ((data.trashGiven / data.totalCitizens) * 100).toFixed(1)
      : "0.0";

  const notGivenPercentage =
    data.totalCitizens > 0
      ? ((data.notGiven / data.totalCitizens) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="grid grid-cols-4 gap-6">
      {kpis.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            ref={(el) => (cardsRef.current[index] = el)}
            className="bg-white h-[110px] rounded-[22px] border border-[#EEF1F6] px-7 flex items-center shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
          >
            <div
              className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon size={21} strokeWidth={2.3} className={item.iconColor} />
            </div>

            <div className="ml-5">
              <p className="text-[14px] font-medium text-[#1F2937]">
                {item.title}
              </p>

              <div className="flex items-end gap-2 mt-2">
                <span className="text-[20px] font-bold text-[#111827] leading-none">
                  {item.value}
                </span>

                {item.unit && (
                  <span className="text-[12px] font-semibold text-indigo-600">
                    {item.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div
        ref={(el) => (cardsRef.current[3] = el)}
        className="bg-white h-[110px] rounded-[22px] border border-[#EEF1F6] px-7 flex flex-col justify-center shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
      >
        <h3 className="text-[15px] font-semibold text-[#111827] mb-4">
          Citizens Trend
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User
                size={16}
                strokeWidth={2.3}
                className="text-green-500 fill-green-500"
              />

              <span className="text-[13px] text-gray-700">Trash Given</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[15px] font-bold text-green-500">
                {Number(data.trashGiven).toLocaleString()}
              </span>

              <span className="text-[12px] font-semibold text-gray-500">
                ({trashGivenPercentage}%)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User
                size={16}
                strokeWidth={2.3}
                className="text-orange-500 fill-orange-500"
              />

              <span className="text-[13px] text-gray-700">Not Given</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[15px] font-bold text-orange-500">
                {Number(data.notGiven).toLocaleString()}
              </span>

              <span className="text-[12px] font-semibold text-gray-500">
                ({notGivenPercentage}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
