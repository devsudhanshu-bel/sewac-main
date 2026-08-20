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

  const totalVehicles = Number(summary?.totalVehicles) || 0;
  const activeVehicles = Number(summary?.activeVehicles) || 0;
  const inactiveVehicles = Number(summary?.inactiveVehicles) || 0;
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
          y: 10,
          duration: 0.35,
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
      className="grid grid-cols-1 xl:grid-cols-3 gap-6"
    >
      {/* =====================================================
          TOTAL VEHICLES
      ===================================================== */}

      <div
        className="
          relative
          bg-white
          rounded-[28px]
          border
          border-[#ECECF3]
          shadow-sm
          hover:shadow-lg
          hover:-translate-y-0.5
          transition-all
          duration-300
          h-[175px]
          px-8
          py-7
        "
      >
        {/* Top Row */}

        <div className="flex items-start justify-between">
          {/* Icon */}

          <div className="w-[56px] h-[56px] rounded-2xl bg-[#F4EEFF] flex items-center justify-center">
            <Truck
              size={26}
              strokeWidth={2.2}
              className="text-[#6C2BFF]"
            />
          </div>

          {/* Title */}

          <div className="text-right">
            <h3 className="text-[16px] font-semibold text-[#111827] leading-7">
              {t(
                "vehicles.kpis.totalVehicles",
                "Total Vehicles"
              )}
            </h3>
          </div>
        </div>

        {/* KPI Number */}

        <div className="absolute left-8 bottom-8">
          <h2 className="text-[36px] leading-none font-bold tracking-[-0.04em] text-[#111827]">
            {totalVehicles.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* =====================================================
          ACTIVE / INACTIVE
      ===================================================== */}

      <div
        className="
          h-[175px]
          bg-white
          rounded-[28px]
          border
          border-[#ECECF3]
          shadow-sm
          hover:shadow-lg
          hover:-translate-y-0.5
          transition-all
          duration-300
          px-8
          py-6
        "
      >
        <div className="flex flex-col justify-between h-full">
          {/* ================= ACTIVE ================= */}

          <div className="flex items-center gap-5">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#DDF8EA] flex items-center justify-center">
              <TruckIcon
                size={26}
                strokeWidth={2.2}
                className="text-[#14B86A]"
              />
            </div>

            <div>
              <p className="text-[16px] font-semibold text-[#111827]">
                {t(
                  "vehicles.kpis.activeVehicles",
                  "Active Vehicles"
                )}
              </p>

              <div className="flex items-end gap-3 mt-1">
                <span className="text-[20px] font-bold text-[#111827]">
                  {activeVehicles.toLocaleString()}
                </span>

                <span className="text-[15px] font-semibold text-[#16A34A]">
                  ({activePercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* ================= INACTIVE ================= */}

          <div className="flex items-center gap-5">
            <div className="w-[56px] h-[56px] rounded-2xl bg-[#FFE8E8] flex items-center justify-center">
              <TruckIcon
                size={26}
                strokeWidth={2.2}
                className="text-[#FF3B30]"
              />
            </div>

            <div>
              <p className="text-[16px] font-semibold text-[#111827]">
                {t(
                  "vehicles.kpis.inactiveVehicles",
                  "Inactive Vehicles"
                )}
              </p>

              <div className="flex items-end gap-3 mt-1">
                <span className="text-[20px] font-bold text-[#111827]">
                  {inactiveVehicles.toLocaleString()}
                </span>

                <span className="text-[15px] font-semibold text-[#EF4444]">
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
          bg-white
          rounded-[28px]
          border
          border-[#ECECF3]
          shadow-sm
          hover:shadow-lg
          hover:-translate-y-0.5
          transition-all
          duration-300
          h-[180px]
          px-8
          py-8
        "
      >
        {/* Top Row */}

        <div className="flex items-start justify-between">
          {/* Icon */}

          <div className="w-[56px] h-[56px] rounded-2xl bg-[#F4EEFF] flex items-center justify-center">
            <PackageOpen
              size={26}
              strokeWidth={2.2}
              className="text-[#6C2BFF]"
            />
          </div>

          {/* Title */}

          <div className="text-right max-w-[180px]">
            <h3 className="text-[16px] font-semibold text-[#111827] leading-7">
              {t(
                "vehicles.kpis.averageWeight",
                "Per Vehicles Avg"
              )}
              <br />
              {t(
                "vehicles.kpis.weightCollection",
                "Weight Collection"
              )}
            </h3>
          </div>
        </div>

        {/* KPI Value */}

        <div className="absolute left-8 bottom-8 flex items-end gap-3">
          <h2 className="text-[36px] leading-none font-bold tracking-[-0.04em] text-[#111827]">
            {averageWeightPerVehicle.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </h2>

          <span className="text-[18px] font-semibold text-[#3452C5] mb-[6px]">
            {t("units.ton", "Ton")}
          </span>
        </div>
      </div>
    </section>
  );
}