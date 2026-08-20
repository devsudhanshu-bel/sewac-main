import { useEffect, useRef } from "react";
import { Trash2, Scale, UserRound } from "lucide-react";
import { gsap } from "gsap";

import { useLanguage } from "../../i18n";

/*
|--------------------------------------------------------------------------
| WASTE DISPLAY FORMATTER
|--------------------------------------------------------------------------
|
| Backend values are ALWAYS in KG.
|
| Display rule:
|
| <= 1000 KG  → KG
| > 1000 KG   → TONS
|
| IMPORTANT:
| Exactly 1000 KG remains KG.
|--------------------------------------------------------------------------
*/

const formatWaste = (value) => {
  const kg = Number(value ?? 0);

  if (!Number.isFinite(kg)) {
    return {
      value: "0.00",
      unit: "KG",
    };
  }

  /*
  |--------------------------------------------------------------------------
  | KEEP KG UNTIL 1000 KG
  |--------------------------------------------------------------------------
  */

  if (kg <= 1000) {
    return {
      value: kg.toFixed(2),
      unit: "KG",
    };
  }

  /*
  |--------------------------------------------------------------------------
  | ABOVE 1000 KG → TONS
  |--------------------------------------------------------------------------
  */

  return {
    value: (kg / 1000).toFixed(2),
    unit: "TONS",
  };
};

export default function WasteGenKPIs({ summary }) {
  const sectionRef = useRef(null);

  const { t } = useLanguage();

  /*
  |--------------------------------------------------------------------------
  | ANIMATION
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
  | NO DATA
  |--------------------------------------------------------------------------
  */

  if (!summary) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | FORMAT TOTAL WASTE
  |--------------------------------------------------------------------------
  */

  const totalWaste = formatWaste(
    summary?.totalWasteGenerated ?? 0
  );

  /*
  |--------------------------------------------------------------------------
  | FORMAT AVERAGE WASTE
  |--------------------------------------------------------------------------
  */

  const averageWaste = formatWaste(
    summary?.averageWaste ?? 0
  );

  /*
  |--------------------------------------------------------------------------
  | CALCULATE GENERATOR PERCENTAGES
  |--------------------------------------------------------------------------
  */

  const totalGenerators =
    Number(summary?.totalWasteGenerators) || 0;

  const activeGenerators =
    Number(summary?.activeWasteGenerators) || 0;

  const inactiveGenerators =
    Number(summary?.inactiveWasteGenerators) || 0;

  const activePercentage = totalGenerators
    ? ((activeGenerators / totalGenerators) * 100).toFixed(1)
    : "0.0";

  const inactivePercentage = totalGenerators
    ? ((inactiveGenerators / totalGenerators) * 100).toFixed(1)
    : "0.0";

  /*
  |--------------------------------------------------------------------------
  | CLASSIFICATION TOTAL
  |--------------------------------------------------------------------------
  */

  const aboveAverage =
    Number(summary?.aboveAverage) || 0;

  const belowAverage =
    Number(summary?.belowAverage) || 0;

  const classificationTotal =
    aboveAverage + belowAverage;

  const aboveAveragePercentage = classificationTotal
    ? ((aboveAverage / classificationTotal) * 100).toFixed(1)
    : "0.0";

  const belowAveragePercentage = classificationTotal
    ? ((belowAverage / classificationTotal) * 100).toFixed(1)
    : "0.0";

  /*
  |--------------------------------------------------------------------------
  | TRANSLATED WASTE UNITS
  |--------------------------------------------------------------------------
  */

  const translatedTotalWasteUnit =
    totalWaste.unit === "KG"
      ? t("units.kg", "KG")
      : t("units.tons", "TONS");

  const translatedAverageWasteUnit =
    averageWaste.unit === "KG"
      ? t("units.kg", "KG")
      : t("units.tons", "TONS");

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section
      ref={sectionRef}
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        mt-6
      "
    >
      {/* ================================================================
          WASTE GENERATOR STATUS
      ================================================================ */}

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
          {t(
            "wasteGenerators.kpis.generatorStatus",
            "Waste Generator Status"
          )}
        </h3>

        {/* ============================================================
            ACTIVE
        ============================================================ */}

        <div className="flex items-center gap-3">
          <UserRound
            size={20}
            className="text-green-600"
            fill="currentColor"
          />

          <div className="flex-1">
            <p className="text-[12px] text-slate-600">
              {t(
                "wasteGenerators.kpis.activeGenerators",
                "Active Waste Generators"
              )}
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
                {activeGenerators.toLocaleString()}
              </span>

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-500
                  pb-1
                "
              >
                ({activePercentage}%)
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-300 my-5"></div>

        {/* ============================================================
            INACTIVE
        ============================================================ */}

        <div className="flex items-center gap-3">
          <UserRound
            size={20}
            className="text-orange-500"
            fill="currentColor"
          />

          <div className="flex-1">
            <p className="text-[12px] text-slate-600">
              {t(
                "wasteGenerators.kpis.inactiveGenerators",
                "Inactive Waste Generators"
              )}
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
                {inactiveGenerators.toLocaleString()}
              </span>

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-500
                  pb-1
                "
              >
                ({inactivePercentage}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          TOTAL WASTE GENERATED
      ================================================================ */}

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
        {/* ================= HEADER ================= */}

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
            {t(
              "wasteGenerators.kpis.totalWasteGenerated",
              "Total Waste Generated"
            )}
          </p>
        </div>

        {/* ================= VALUE ================= */}

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
              {totalWaste.value}
            </h2>

            <span
              className="
                text-sm
                font-semibold
                text-slate-600
                mb-2
              "
            >
              {translatedTotalWasteUnit}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================
          AVERAGE WASTE
      ================================================================ */}

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
        {/* ================= HEADER ================= */}

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
              {t(
                "wasteGenerators.kpis.averageWaste",
                "Average Waste"
              )}
            </p>
          </div>
        </div>

        {/* ================= VALUE ================= */}

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
              {averageWaste.value}
            </h2>

            <span
              className="
                text-lg
                font-semibold
                text-slate-600
                mb-2
              "
            >
              {translatedAverageWasteUnit}
            </span>
          </div>

          <p className="mt-2 text-[13px] font-semibold text-slate-600">
            {t(
              "wasteGenerators.kpis.perHouseDay",
              "Per House / Day"
            )}
          </p>
        </div>
      </div>

      {/* ================================================================
          WASTE GENERATOR CLASSIFICATION
      ================================================================ */}

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
          {t(
            "wasteGenerators.kpis.classification",
            "Waste Generator Classification"
          )}
        </h3>

        {/* ============================================================
            ABOVE AVERAGE
        ============================================================ */}

        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>

          <div className="flex-1">
            <p className="text-[12px] text-slate-600">
              {t(
                "wasteGenerators.kpis.aboveAverage",
                "Above Average"
              )}
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
                {aboveAverage.toLocaleString()}
              </span>

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-500
                  pb-1
                "
              >
                ({aboveAveragePercentage}%)
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-300 my-5"></div>

        {/* ============================================================
            BELOW AVERAGE
        ============================================================ */}

        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>

          <div className="flex-1">
            <p className="text-[12px] text-slate-600">
              {t(
                "wasteGenerators.kpis.belowAverage",
                "Below Average"
              )}
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
                {belowAverage.toLocaleString()}
              </span>

              <span
                className="
                  text-[13px]
                  font-semibold
                  text-slate-500
                  pb-1
                "
              >
                ({belowAveragePercentage}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}