import { useEffect, useRef } from "react";
import { Trash2, Scale, UserRound } from "lucide-react";
import { gsap } from "gsap";

export default function WasteGenKPIs({ summary }) {
  const sectionRef = useRef(null);

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

  if (!summary) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6"
    >
      {/* ========================= Waste Generator Status ========================= */}

      <div
        className="
          bg-white
          rounded-3xl
          border
          border-gray-200
          px-5
          py-5
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          hover:shadow-lg
          hover:-translate-y-0.5
          transition-all
          duration-300
          min-h-[185px]
        "
      >
        <h3 className="text-[12px] font-semibold text-slate-800 mb-5">
          Waste Generator Status
        </h3>

        <div className="flex items-center gap-3">
          <UserRound size={20} className="text-green-600" fill="currentColor" />

          <div className="flex-1">
            <p className="text-[12px] text-slate-600">
              Active Waste Generators
            </p>

            <div className="flex items-end gap-2 mt-1">
              <span
                className="
                  text-[18px]
                  font-bold
                  text-green-600
                  leading-none
                "
              >
                {summary?.activeWasteGenerators?.toLocaleString() ?? 0}
              </span>

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-500
                  pb-1
                "
              >
                (
                {summary.totalWasteGenerators
                  ? (
                      (summary.activeWasteGenerators /
                        summary.totalWasteGenerators) *
                      100
                    ).toFixed(1)
                  : 0}
                %)
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-300 my-5"></div>

        <div className="flex items-center gap-3">
          <UserRound
            size={20}
            className="text-orange-500"
            fill="currentColor"
          />

          <div className="flex-1">
            <p className="text-[12px] text-slate-600">
              Inactive Waste Generators
            </p>

            <div className="flex items-end gap-2 mt-1">
              <span
                className="
                  text-[22px]
                  font-bold
                  text-orange-500
                  leading-none
                "
              >
                {summary?.inactiveWasteGenerators?.toLocaleString() ?? 0}
              </span>

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-500
                  pb-1
                "
              >
                (
                {summary.totalWasteGenerators
                  ? (
                      (summary.inactiveWasteGenerators /
                        summary.totalWasteGenerators) *
                      100
                    ).toFixed(1)
                  : 0}
                %)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= Total Waste Generated ========================= */}

      <div
        className="
          bg-white
          rounded-3xl
          border
          border-gray-200
          px-5
          py-5
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          hover:shadow-lg
          hover:-translate-y-0.5
          transition-all
          duration-300
          min-h-[185px]
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-pink-100
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <Trash2 size={18} className="text-pink-600" />
          </div>

          <p className="text-[12px] font-semibold leading-5 text-slate-800">
            Total Waste
            <br />
            Generated
          </p>
        </div>

        <div className="flex justify-center items-center h-[95px]">
          <div className="flex items-end gap-2">
            <h2
              className="
                text-[32px]
                font-bold
                tracking-tight
                text-[#18214D]
              "
            >
              {(Number(summary?.totalWasteGenerated ?? 0) / 1000).toFixed(2)}
            </h2>

            <span
              className="
                text-sm
                font-semibold
                text-slate-600
                mb-2
              "
            >
              TONS
            </span>
          </div>
        </div>
      </div>

      {/* ========================= Average Waste ========================= */}

      <div
        className="
          bg-white
          rounded-3xl
          border
          border-gray-200
          px-5
          py-5
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          hover:shadow-lg
          hover:-translate-y-0.5
          transition-all
          duration-300
          min-h-[185px]
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-emerald-100
              flex
              items-center
              justify-center
            "
          >
            <Scale size={20} className="text-emerald-600" />
          </div>

          <div>
            <p className="text-[13px] font-semibold text-slate-800">
              Average Waste
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center h-[95px]">
          <div className="flex items-end gap-2">
            <h2
              className="
                text-[32px]
                font-bold
                tracking-tight
                text-[#18214D]
              "
            >
              {(Number(summary?.averageWaste ?? 0) / 1000).toFixed(2)}
            </h2>

            <span
              className="
                text-lg
                font-semibold
                text-slate-600
                mb-2
              "
            >
              TONS
            </span>
          </div>

          <p className="mt-2 text-[13px] font-semibold text-slate-600">
            Per House / Day
          </p>
        </div>
      </div>

      {/* ========================= Waste Generator Classification ========================= */}

      <div
        className="
          bg-white
          rounded-3xl
          border
          border-gray-200
          px-5
          py-5
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          hover:shadow-lg
          hover:-translate-y-0.5
          transition-all
          duration-300
          min-h-[185px]
        "
      >
        <h3 className="text-[11px] font-semibold text-slate-800 mb-5">
          Waste Generator Classification
        </h3>

        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>

          <div className="flex-1">
            <p className="text-[12px] text-slate-600">Above Average</p>

            <div className="flex items-end gap-2 mt-1">
              <span
                className="
                  text-[22px]
                  font-bold
                  text-green-600
                  leading-none
                "
              >
                {summary?.aboveAverage?.toLocaleString() ?? 0}
              </span>

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-500
                  pb-1
                "
              >
                (
                {summary.aboveAverage + summary.belowAverage
                  ? (
                      (summary.aboveAverage /
                        (summary.aboveAverage + summary.belowAverage)) *
                      100
                    ).toFixed(1)
                  : 0}
                %)
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-300 my-5"></div>

        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>

          <div className="flex-1">
            <p className="text-[12px] text-slate-600">Below Average</p>

            <div className="flex items-end gap-2 mt-1">
              <span
                className="
                  text-[22px]
                  font-bold
                  text-orange-500
                  leading-none
                "
              >
                {summary?.belowAverage?.toLocaleString() ?? 0}
              </span>

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-500
                  pb-1
                "
              >
                (
                {summary.aboveAverage + summary.belowAverage
                  ? (
                      (summary.belowAverage /
                        (summary.aboveAverage + summary.belowAverage)) *
                      100
                    ).toFixed(1)
                  : 0}
                %)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
