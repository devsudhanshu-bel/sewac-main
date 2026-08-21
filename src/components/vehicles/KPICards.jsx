import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import {
  Truck,
  TruckIcon,
  PackageOpen,
} from "lucide-react";

import { useLanguage } from "../../i18n";

export default function KPICards({ summary }) {
  const sectionRef = useRef(null);

  const { t } = useLanguage();

  /* =========================================================
     SAFE SUMMARY VALUES
  ========================================================= */

  const totalVehicles =
    Number(summary?.totalVehicles) || 0;

  const activeVehicles =
    Number(summary?.activeVehicles) || 0;

  const inactiveVehicles =
    Number(summary?.inactiveVehicles) || 0;

  const averageWeightPerVehicle =
    Number(summary?.averageWeightPerVehicle) || 0;

  /* =========================================================
     PERCENTAGES
  ========================================================= */

  const activePercent =
    totalVehicles > 0
      ? ((activeVehicles / totalVehicles) * 100).toFixed(1)
      : "0.0";

  const inactivePercent =
    totalVehicles > 0
      ? ((inactiveVehicles / totalVehicles) * 100).toFixed(1)
      : "0.0";

  /* =========================================================
     GSAP ANIMATION
  ========================================================= */

  useEffect(() => {
    const ctx = gsap.context(() => {
      requestAnimationFrame(() => {
        gsap.from(sectionRef.current, {
          opacity: 0,
          y: 12,
          duration: 0.4,
          ease: "power2.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      ref={sectionRef}
      className="
        w-full
        min-w-0
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-3
        lg:gap-4
      "
    >
      {/* =====================================================
          TOTAL VEHICLES
      ===================================================== */}

      <div
        className="
          relative
          w-full
          min-w-0
          bg-white
          h-[125px]
          rounded-[22px]
          border
          border-[#EEF1F6]
          px-5
          sm:px-6
          flex
          items-center
          shadow-[0_4px_12px_rgba(15,23,42,0.04)]
          hover:shadow-[0_8px_20px_rgba(15,23,42,0.07)]
          hover:-translate-y-0.5
          transition-all
          duration-300
        "
      >
        {/* ================= ICON ================= */}

        <div
          className="
            w-11
            h-11
            sm:w-12
            sm:h-12
            rounded-xl
            bg-[#F4EEFF]
            flex
            items-center
            justify-center
            flex-shrink-0
          "
        >
          <Truck
            size={22}
            strokeWidth={2.2}
            className="text-[#6C2BFF]"
          />
        </div>

        {/* ================= CONTENT ================= */}

        <div className="ml-4 min-w-0">
          <p
            className="
              text-[13px]
              sm:text-[14px]
              font-medium
              text-[#1F2937]
              leading-tight
            "
          >
            {t(
              "vehicles.kpis.totalVehicles",
              "Total Vehicles"
            )}
          </p>

          <div className="flex items-end gap-2 mt-2">
            <span
              className="
                text-[24px]
                sm:text-[26px]
                font-bold
                leading-none
                tracking-[-0.025em]
                text-[#111827]
              "
            >
              {totalVehicles.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          ACTIVE / INACTIVE
      ===================================================== */}

      <div
        className="
          w-full
          min-w-0
          bg-white
          h-[125px]
          rounded-[22px]
          border
          border-[#EEF1F6]
          px-5
          sm:px-6
          flex
          items-center
          shadow-[0_4px_12px_rgba(15,23,42,0.04)]
          hover:shadow-[0_8px_20px_rgba(15,23,42,0.07)]
          hover:-translate-y-0.5
          transition-all
          duration-300
        "
      >
        <div
          className="
            w-full
            flex
            flex-col
            gap-3
            sm:gap-4
          "
        >
          {/* ================= ACTIVE ================= */}

          <div className="flex items-center min-w-0">
            <div
              className="
                w-9
                h-9
                sm:w-10
                sm:h-10
                rounded-xl
                bg-[#DDF8EA]
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <TruckIcon
                size={20}
                strokeWidth={2.2}
                className="text-[#14B86A]"
              />
            </div>

            <div className="ml-3 min-w-0">
              <p
                className="
                  text-[12px]
                  sm:text-[13px]
                  font-medium
                  text-[#1F2937]
                  leading-tight
                "
              >
                {t(
                  "vehicles.kpis.activeVehicles",
                  "Active Vehicles"
                )}
              </p>

              <div className="flex items-end gap-2 mt-1">
                <span
                  className="
                    text-[17px]
                    sm:text-[18px]
                    font-bold
                    leading-none
                    text-[#111827]
                  "
                >
                  {activeVehicles.toLocaleString()}
                </span>

                <span
                  className="
                    text-[11px]
                    sm:text-[12px]
                    font-semibold
                    leading-none
                    text-[#16A34A]
                  "
                >
                  ({activePercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* ================= INACTIVE ================= */}

          <div className="flex items-center min-w-0">
            <div
              className="
                w-9
                h-9
                sm:w-10
                sm:h-10
                rounded-xl
                bg-[#FFE8E8]
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <TruckIcon
                size={20}
                strokeWidth={2.2}
                className="text-[#FF3B30]"
              />
            </div>

            <div className="ml-3 min-w-0">
              <p
                className="
                  text-[12px]
                  sm:text-[13px]
                  font-medium
                  text-[#1F2937]
                  leading-tight
                "
              >
                {t(
                  "vehicles.kpis.inactiveVehicles",
                  "Inactive Vehicles"
                )}
              </p>

              <div className="flex items-end gap-2 mt-1">
                <span
                  className="
                    text-[17px]
                    sm:text-[18px]
                    font-bold
                    leading-none
                    text-[#111827]
                  "
                >
                  {inactiveVehicles.toLocaleString()}
                </span>

                <span
                  className="
                    text-[11px]
                    sm:text-[12px]
                    font-semibold
                    leading-none
                    text-[#EF4444]
                  "
                >
                  ({inactivePercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          AVERAGE WEIGHT
      ===================================================== */}

      <div
        className="
          relative
          w-full
          min-w-0
          bg-white
          h-[125px]
          rounded-[22px]
          border
          border-[#EEF1F6]
          px-5
          sm:px-6
          flex
          items-center
          shadow-[0_4px_12px_rgba(15,23,42,0.04)]
          hover:shadow-[0_8px_20px_rgba(15,23,42,0.07)]
          hover:-translate-y-0.5
          transition-all
          duration-300
        "
      >
        {/* ================= ICON ================= */}

        <div
          className="
            w-11
            h-11
            sm:w-12
            sm:h-12
            rounded-xl
            bg-[#F4EEFF]
            flex
            items-center
            justify-center
            flex-shrink-0
          "
        >
          <PackageOpen
            size={22}
            strokeWidth={2.2}
            className="text-[#6C2BFF]"
          />
        </div>

        {/* ================= CONTENT ================= */}

        <div className="ml-4 min-w-0 flex-1">
          <p
            className="
              text-[13px]
              sm:text-[14px]
              font-medium
              text-[#1F2937]
              leading-5
            "
          >
            {t(
              "vehicles.kpis.averageWeight",
              "Per Vehicles Avg"
            )}
            <br />
            {t(
              "vehicles.kpis.weightCollection",
              "Weight Collection"
            )}
          </p>

          <div className="flex items-end gap-2 mt-2">
            <span
              className="
                text-[24px]
                sm:text-[26px]
                font-bold
                leading-none
                tracking-[-0.025em]
                text-[#111827]
              "
            >
              {averageWeightPerVehicle.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }
              )}
            </span>

            <span
              className="
                text-[12px]
                sm:text-[13px]
                font-semibold
                text-[#3452C5]
                mb-[2px]
              "
            >
              {t("units.ton", "Ton")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}