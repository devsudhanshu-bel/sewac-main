import { useEffect, useRef } from "react";
import {
  Users,
  Trash2,
  Scale,
  UserRound,
} from "lucide-react";
import { gsap } from "gsap";

export default function WasteGenKPIs() {
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
    <section
      ref={sectionRef}
      className="grid grid-cols-5 gap-4 mt-6"
    >
      {/* ========================= Total Waste Generators ========================= */}

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
          min-h-[145px]
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-violet-100
              flex
              items-center
              justify-center
            "
          >
            <Users
              size={18}
              className="text-violet-600"
            />
          </div>

          <div>
            <p className="text-[12px] font-semibold text-slate-800">
              Total Waste Generators
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center h-[95px]">
          <h2
            className="
              text-[28px]
              font-bold
              tracking-tight
              text-[#18214D]
            "
          >
            12,846
          </h2>
        </div>
      </div>

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
          min-h-[145px]
        "
      >
        <h3 className="text-[12px] font-semibold text-slate-800 mb-5">
          Waste Generator Status
        </h3>

        <div className="flex items-center gap-3">
          <UserRound
            size={20}
            className="text-green-600"
            fill="currentColor"
          />

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
                9,245
              </span>

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-500
                  pb-1
                "
              >
                (71.9%)
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
                3,601
              </span>

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-500
                  pb-1
                "
              >
                (28.1%)
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
          min-h-[175px]
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
            <Trash2
              size={18}
              className="text-pink-600"
            />
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
              124.8
            </h2>

            <span
              className="
                text-sm
                font-semibold
                text-slate-600
                mb-2
              "
            >
              Ton
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
          min-h-[145px]
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
            <Scale
              size={20}
              className="text-emerald-600"
            />
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
              9.72
            </h2>

            <span
              className="
                text-lg
                font-semibold
                text-slate-600
                mb-2
              "
            >
              Kg
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
          min-h-[145px]
        "
      >
        <h3 className="text-[11px] font-semibold text-slate-800 mb-5">
          Waste Generator Classification
        </h3>

        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>

          <div className="flex-1">
            <p className="text-[12px] text-slate-600">
              Above Average
            </p>

            <div className="flex items-end gap-2 mt-1">
              <span
                className="
                  text-[22px]
                  font-bold
                  text-green-600
                  leading-none
                "
              >
                6,732
              </span>

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-500
                  pb-1
                "
              >
                (52.4%)
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-300 my-5"></div>

        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>

          <div className="flex-1">
            <p className="text-[12px] text-slate-600">
              Below Average
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
                6,114
              </span>

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-500
                  pb-1
                "
              >
                (47.6%)
              </span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}