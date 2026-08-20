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
      },
    );
  }, []);

  /* =========================================================
     SAFE DATA
  =========================================================
   *
   * Missing / null backend data must still render
   * the KPI cards.
   *
   * No telemetry:
   *
   * totalWasteCollected → 0
   * collectionPoints    → 0
   * totalCitizens       → 0
   * trashGiven          → 0
   * notGiven            → 0
   */

  const safeData = useMemo(
    () => ({
      totalWasteCollected: 0,

      collectionPoints: 0,

      totalCitizens: 0,

      trashGiven: 0,

      notGiven: 0,

      ...(data || {}),
    }),
    [data],
  );

  /* =========================================================
     WASTE FORMATTER
  =========================================================
   *
   * Backend returns waste in KG.
   *
   * < 1000 KG
   *     → KG
   *
   * >= 1000 KG
   *     → TON / TONS
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
    const waste = formatWaste(safeData.totalWasteCollected);

    return [
      {
        title: t("overview.kpis.totalWasteCollected", "Total Waste Collected"),

        value: waste.value,

        unit: waste.unit,

        icon: Trash2,

        iconColor: "text-pink-500",

        bg: "bg-pink-50",
      },

      {
        title: t("overview.kpis.collectionPoints", "Collection Points"),

        value: Number(safeData.collectionPoints || 0).toLocaleString(),

        unit: "",

        icon: MapPinned,

        iconColor: "text-violet-600",

        bg: "bg-violet-50",
      },

      {
        title: t("overview.kpis.totalCitizens", "Total Citizens"),

        value: Number(safeData.totalCitizens || 0).toLocaleString(),

        unit: "",

        icon: Users,

        iconColor: "text-violet-600",

        bg: "bg-violet-50",
      },
    ];
  }, [safeData, t]);

  /* =========================================================
     CITIZEN PERCENTAGES
  ========================================================= */

  const totalCitizens = Number(safeData.totalCitizens) || 0;

  const trashGiven = Number(safeData.trashGiven) || 0;

  const notGiven = Number(safeData.notGiven) || 0;

  const trashGivenPercentage =
    totalCitizens > 0 ? ((trashGiven / totalCitizens) * 100).toFixed(1) : "0.0";

  const notGivenPercentage =
    totalCitizens > 0 ? ((notGiven / totalCitizens) * 100).toFixed(1) : "0.0";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          RESPONSIVE GRID
      ===================================================== */}

      <style>
        {`
          .overview-kpi-grid {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }

          @media (min-width: 768px) {
            .overview-kpi-grid {
              grid-template-columns: repeat(
                2,
                minmax(0, 1fr)
              );
            }
          }

          @media (min-width: 1200px) {
            .overview-kpi-grid {
              grid-template-columns: repeat(
                4,
                minmax(0, 1fr)
              ) !important;

              gap: 8px;
            }
          }

          @media (min-width: 1440px) {
            .overview-kpi-grid {
              gap: 10px;
            }
          }
        `}
      </style>

      <div className="overview-kpi-grid">
        {/* ===================================================
            KPI CARDS
        =================================================== */}

        {kpis.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              ref={(element) => {
                cardsRef.current[index] = element;
              }}
              className="
                bg-white
                h-[110px]
                rounded-[22px]
                border
                border-[#EEF1F6]
                px-4
                sm:px-5
                xl:px-7
                flex
                items-center
                shadow-[0_4px_12px_rgba(15,23,42,0.04)]
                min-w-0
                w-full
              "
            >
              {/* =============================================
                  ICON
              ============================================= */}

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
                <Icon size={21} strokeWidth={2.3} className={item.iconColor} />
              </div>

              {/* =============================================
                  CONTENT
              ============================================= */}

              <div
                className="
                  ml-3
                  sm:ml-4
                  xl:ml-5
                  min-w-0
                  flex-1
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

        {/* ===================================================
            CITIZENS TREND
        =================================================== */}

        <div
          ref={(element) => {
            cardsRef.current[3] = element;
          }}
          className="
            bg-white
            h-[110px]
            rounded-[22px]
            border
            border-[#EEF1F6]
            px-4
            sm:px-5
            xl:px-7
            flex
            flex-col
            justify-center
            shadow-[0_4px_12px_rgba(15,23,42,0.04)]
            min-w-0
            w-full
          "
        >
          {/* ===============================================
              TITLE
          =============================================== */}

          <h3
            className="
              text-[14px]
              sm:text-[15px]
              text-[#111827]
              mb-3
              sm:mb-4
              leading-none
            "
          >
            {t("overview.kpis.citizensTrend", "Citizens Trend")}
          </h3>

          {/* ===============================================
              TREND ROWS
          =============================================== */}

          <div className="space-y-3">
            {/* =============================================
                TRASH GIVEN
            ============================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                min-w-0
              "
            >
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
                  {t("overview.kpis.trashGiven", "Trash Given")}
                </span>
              </div>

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
                  {trashGiven.toLocaleString()}
                </span>

                <span
                  className="
                    text-[11px]
                    sm:text-[12px]
                    font-semibold
                    text-gray-500
                    whitespace-nowrap
                  "
                >
                  ({trashGivenPercentage}%)
                </span>
              </div>
            </div>

            {/* =============================================
                NOT GIVEN
            ============================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
                min-w-0
              "
            >
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
                  {t("overview.kpis.notGiven", "Not Given")}
                </span>
              </div>

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
                  {notGiven.toLocaleString()}
                </span>

                <span
                  className="
                    text-[11px]
                    sm:text-[12px]
                    font-semibold
                    text-gray-500
                    whitespace-nowrap
                  "
                >
                  ({notGivenPercentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
