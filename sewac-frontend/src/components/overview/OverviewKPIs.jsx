import { useEffect, useRef } from "react";
import { Trash2, MapPinned, Users, User } from "lucide-react";
import { gsap } from "gsap";

const kpis = [
  {
    title: "Total Waste Collected",
    value: "10.4",
    unit: "Ton",
    icon: Trash2,
    iconColor: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    title: "Collection Points",
    value: "842",
    unit: "",
    icon: MapPinned,
    iconColor: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    title: "Total Citizens",
    value: "12,846",
    unit: "",
    icon: Users,
    iconColor: "text-violet-600",
    bg: "bg-violet-50",
  },
];

export default function OverviewKPIs() {
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
      }
    );
  }, []);

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
              <Icon
                size={21}
                strokeWidth={2.3}
                className={item.iconColor}
              />
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

              <span className="text-[13px] text-gray-700">
                Trash Given
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[15px] font-bold text-green-500">
                9,245
              </span>

              <span className="text-[12px] font-semibold text-gray-500">
                (71.9%)
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

              <span className="text-[13px] text-gray-700">
                Not Given
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[15px] font-bold text-orange-500">
                3,601
              </span>

              <span className="text-[12px] font-semibold text-gray-500">
                (28.1%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}