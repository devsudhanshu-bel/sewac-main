import { useEffect, useMemo, useRef } from "react";
import { Trash2, MapPinned, Users, User } from "lucide-react";
import { gsap } from "gsap";

import { useLanguage } from "../../i18n";

export default function OverviewKPIs({ data }) {
  const cardsRef = useRef([]);

  const { t } = useLanguage();

  /* =========================================================
     GSAP ANIMATION
  ========================================================= */

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

  /* =========================================================
     WASTE FORMATTER
  =========================================================

     Backend always returns waste in KG.

     < 1000 KG
         → display KG

     >= 1000 KG
         → convert to TON

     Examples:

     850       → 850.00 KG
     1000      → 1.00 TON
     8106.79   → 8.11 TONS
  ========================================================= */

  const formatWaste = (value) => {
    const kg = Number(value) || 0;

    if (kg >= 1000) {
      const tons = kg / 1000;

      return {
        value: tons.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),

        unit:
          tons === 1
            ? t("overview.kpis.ton", "TON")
            : t("overview.kpis.tons", "TONS"),
      };
    }

    return {
      value: kg.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),

      unit: t("overview.kpis.kg", "KG"),
    };
  };

  /* =========================================================
     KPI DATA
  ========================================================= */

  const kpis = useMemo(() => {
    if (!data) return [];

    const waste = formatWaste(data.totalWasteCollected);

    return [
      {
        title: t(
          "overview.kpis.totalWasteCollected",
          "Total Waste Collected"
        ),

        value: waste.value,

        unit: waste.unit,

        icon: Trash2,

        iconColor: "text-pink-500",

        bg: "bg-pink-50",
      },

      {
        title: t(
          "overview.kpis.collectionPoints",
          "Collection Points"
        ),

        value: Number(data.collectionPoints).toLocaleString(),

        unit: "",

        icon: MapPinned,

        iconColor: "text-violet-600",

        bg: "bg-violet-50",
      },

      {
        title: t(
          "overview.kpis.totalCitizens",
          "Total Citizens"
        ),

        value: Number(data.totalCitizens).toLocaleString(),

        unit: "",

        icon: Users,

        iconColor: "text-violet-600",

        bg: "bg-violet-50",
      },
    ];
  }, [data, t]);

  /* =========================================================
     NO DATA
  ========================================================= */

  if (!data) return null;

  /* =========================================================
     CITIZEN PERCENTAGES
  ========================================================= */

  const trashGivenPercentage =
    data.totalCitizens > 0
      ? (
          (data.trashGiven / data.totalCitizens) *
          100
        ).toFixed(1)
      : "0.0";

  const notGivenPercentage =
    data.totalCitizens > 0
      ? (
          (data.notGiven / data.totalCitizens) *
          100
        ).toFixed(1)
      : "0.0";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        min-[1301px]:grid-cols-4

        gap-3
        sm:gap-3
        min-[1301px]:gap-2

        w-full
      "
    >
      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      {kpis.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            ref={(el) => (cardsRef.current[index] = el)}
            className="
              bg-white

              h-[110px]

              rounded-[22px]

              border
              border-[#EEF1F6]

              px-4
              sm:px-5
              min-[1301px]:px-7

              flex
              items-center

              shadow-[0_4px_12px_rgba(15,23,42,0.04)]

              min-w-0
            "
          >
            {/* =================================================
                ICON
            ================================================= */}

            <div
              className={`
                w-11
                h-11

                rounded-xl

                ${item.bg}

                flex
                items-center
                justify-center

                flex-shrink-0
              `}
            >
              <Icon
                size={21}
                strokeWidth={2.3}
                className={item.iconColor}
              />
            </div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div
              className="
                ml-3
                sm:ml-4
                min-[1301px]:ml-5

                min-w-0
              "
            >
              <p
                className="
                  text-[13px]
                  sm:text-[14px]

                  font-medium

                  text-[#1F2937]

                  leading-snug

                  truncate
                "
              >
                {item.title}
              </p>

              <div
                className="
                  flex
                  items-end

                  gap-1.5
                  sm:gap-2

                  mt-2

                  whitespace-nowrap
                "
              >
                <span
                  className="
                    text-[19px]
                    sm:text-[20px]

                    font-bold

                    text-[#111827]

                    leading-none
                  "
                >
                  {item.value}
                </span>

                {item.unit && (
                  <span
                    className="
                      text-[11px]
                      sm:text-[12px]

                      font-semibold

                      text-indigo-600

                      leading-none
                    "
                  >
                    {item.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* =====================================================
          CITIZENS TREND
      ===================================================== */}

      <div
        ref={(el) => (cardsRef.current[3] = el)}
        className="
          bg-white

          h-[110px]

          rounded-[22px]

          border
          border-[#EEF1F6]

          px-4
          sm:px-5
          min-[1301px]:px-7

          flex
          flex-col
          justify-center

          shadow-[0_4px_12px_rgba(15,23,42,0.04)]

          min-w-0
        "
      >
        {/* ===================================================
            TITLE
        =================================================== */}

        <h3
          className="
            text-[14px]
            sm:text-[15px]

            text-[#111827]

            mb-3
            sm:mb-4
          "
        >
          {t(
            "overview.kpis.citizensTrend",
            "Citizens Trend"
          )}
        </h3>

        {/* ===================================================
            TREND ROWS
        =================================================== */}

        <div className="space-y-3">
          {/* =================================================
              TRASH GIVEN
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between

              gap-3

              min-w-0
            "
          >
            {/* ===============================================
                LABEL
            =============================================== */}

            <div
              className="
                flex
                items-center

                gap-2
                sm:gap-3

                min-w-0
              "
            >
              <User
                size={16}
                strokeWidth={2.3}
                className="
                  text-green-500
                  fill-green-500

                  flex-shrink-0
                "
              />

              <span
                className="
                  text-[12px]
                  sm:text-[13px]

                  text-gray-700

                  truncate
                "
              >
                {t(
                  "overview.kpis.trashGiven",
                  "Trash Given"
                )}
              </span>
            </div>

            {/* ===============================================
                VALUE
            =============================================== */}

            <div
              className="
                flex
                items-center

                gap-2
                sm:gap-3

                shrink-0
              "
            >
              <span
                className="
                  text-[14px]
                  sm:text-[15px]

                  font-bold

                  text-green-500
                "
              >
                {Number(
                  data.trashGiven
                ).toLocaleString()}
              </span>

              <span
                className="
                  text-[11px]
                  sm:text-[12px]

                  font-semibold

                  text-gray-500
                "
              >
                ({trashGivenPercentage}%)
              </span>
            </div>
          </div>

          {/* =================================================
              NOT GIVEN
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between

              gap-3

              min-w-0
            "
          >
            {/* ===============================================
                LABEL
            =============================================== */}

            <div
              className="
                flex
                items-center

                gap-2
                sm:gap-3

                min-w-0
              "
            >
              <User
                size={16}
                strokeWidth={2.3}
                className="
                  text-orange-500
                  fill-orange-500

                  flex-shrink-0
                "
              />

              <span
                className="
                  text-[12px]
                  sm:text-[13px]

                  text-gray-700

                  truncate
                "
              >
                {t(
                  "overview.kpis.notGiven",
                  "Not Given"
                )}
              </span>
            </div>

            {/* ===============================================
                VALUE
            =============================================== */}

            <div
              className="
                flex
                items-center

                gap-2
                sm:gap-3

                shrink-0
              "
            >
              <span
                className="
                  text-[14px]
                  sm:text-[15px]

                  font-bold

                  text-orange-500
                "
              >
                {Number(
                  data.notGiven
                ).toLocaleString()}
              </span>

              <span
                className="
                  text-[11px]
                  sm:text-[12px]

                  font-semibold

                  text-gray-500
                "
              >
                ({notGivenPercentage}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}