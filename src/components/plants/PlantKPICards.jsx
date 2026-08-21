import {
  Factory,
  Truck,
  Recycle,
} from "lucide-react";

import { useLanguage } from "../../i18n";

/* ===========================================================
   PLANT KPI CARDS
=========================================================== */

export default function PlantKPICards({ data }) {
  const { t } = useLanguage();

  /* ===========================================================
     KPI DATA
  =========================================================== */

  const kpis = [
    {
      title: t(
        "plants.kpis.totalPlants",
        "Total Plants"
      ),

      value: (
        data?.totalPlants ?? 0
      ).toLocaleString(),

      subtitle: t(
        "plants.kpis.allRegisteredPlants",
        "All registered plants"
      ),

      icon: Factory,

      bg: "bg-violet-100",

      color: "text-violet-600",
    },

    {
      title: t(
        "plants.kpis.totalVehiclesEnrolled",
        "Total Vehicles Enrolled"
      ),

      value: (
        data?.totalVehiclesEnrolled ?? 0
      ).toLocaleString(),

      subtitle: t(
        "plants.kpis.acrossAllPlants",
        "Across all plants"
      ),

      icon: Truck,

      bg: "bg-emerald-100",

      color: "text-emerald-600",
    },

    {
      title: t(
        "plants.kpis.totalWasteCollected",
        "Total Waste Collected"
      ),

      value: `${(
        data?.totalWasteCollected ?? 0
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ${t(
        "units.ton",
        "Ton"
      )}`,

      subtitle: t(
        "plants.kpis.allTimeCollection",
        "All time collection"
      ),

      icon: Recycle,

      bg: "bg-orange-100",

      color: "text-orange-500",
    },
  ];

  /* ===========================================================
     RENDER
  =========================================================== */

  return (
    <div className="grid grid-cols-3 gap-5">

      {kpis.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              bg-white
              border
              border-[#E5E7EB]
              rounded-xl
              px-4
              py-3.5
              flex
              items-center
              gap-3.5
              shadow-sm
              min-h-[100px]
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
                flex
                items-center
                justify-center
                shrink-0
                ${card.bg}
              `}
            >
              <Icon
                size={22}
                className={card.color}
                strokeWidth={2}
              />
            </div>

            {/* =================================================
                TEXT
            ================================================= */}

            <div className="min-w-0 flex flex-col">

              {/* TITLE */}

              <p
                className="
                  text-[12px]
                  font-medium
                  text-[#667085]
                  leading-4
                "
              >
                {card.title}
              </p>

              {/* VALUE */}

              <h2
                className="
                  mt-0.5
                  text-[21px]
                  font-bold
                  text-[#111827]
                  leading-6
                  truncate
                "
              >
                {card.value}
              </h2>

              {/* SUBTITLE */}

              <p
                className="
                  mt-1
                  text-[11px]
                  font-medium
                  text-indigo-600
                  leading-4
                  truncate
                "
              >
                {card.subtitle}
              </p>

            </div>

          </div>
        );
      })}

    </div>
  );
}