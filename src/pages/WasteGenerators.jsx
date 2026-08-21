import { useEffect, useState } from "react";

import Header from "../components/layouts/Header";
import api from "../api/axios";

import WasteGenKPIs from "../components/waste-generators/WasteGenKPIs";
import WasteGenMap from "../components/waste-generators/WasteGenMap";
import GVPGen from "../components/waste-generators/GVPGen";
import WasteGenDir from "../components/waste-generators/WasteGenDir";

import { useFilters } from "../contexts/FilterContext";
import { useLanguage } from "../i18n";

export default function WasteGenerators() {
  const [summary, setSummary] = useState(null);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const {
    selectedCity,
    selectedZone,
    selectedDivision,
    selectedWard,
  } = useFilters();

  const { t } = useLanguage();

  /* =========================================================
     LOAD WASTE GENERATOR SUMMARY
  ========================================================= */

  const loadSummary = async () => {
    try {
      if (!selectedCity?.city_id) {
        setSummary(null);
        return;
      }

      const params = new URLSearchParams();

      params.set("date", selectedDate);
      params.set("cityId", selectedCity.city_id);

      if (selectedZone?.zone_id) {
        params.set("zoneId", selectedZone.zone_id);
      }

      if (selectedDivision?.division_id) {
        params.set(
          "divisionId",
          selectedDivision.division_id,
        );
      }

      if (selectedWard?.ward_id) {
        params.set("wardId", selectedWard.ward_id);
      }

      const response = await api.get(
        `/api/waste-generators/summary?${params.toString()}`,
      );

      setSummary(response?.data?.data || null);
    } catch (error) {
      console.error(
        "Waste Generator Summary Error:",
        error,
      );

      setSummary(null);
    }
  };

  /* =========================================================
     RELOAD SUMMARY WHEN FILTERS / DATE CHANGE
  ========================================================= */

  useEffect(() => {
    loadSummary();
  }, [
    selectedDate,
    selectedCity?.city_id,
    selectedZone?.zone_id,
    selectedDivision?.division_id,
    selectedWard?.ward_id,
  ]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="
        flex-1
        min-h-screen
        min-w-0
        overflow-y-auto
        overflow-x-hidden
        bg-[#FAFAFC]
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <main
        className="
          w-full
          min-w-0
          overflow-x-hidden

          px-4
          py-5

          sm:px-5
          sm:py-6

          md:px-6
          md:py-7

          lg:px-8
          lg:py-7

          xl:px-8
        "
      >
        {/* ===================================================
            PAGE TITLE
        =================================================== */}

        <div className="min-w-0">
          <h1
            className="
              text-[28px]
              leading-tight
              font-bold
              tracking-tight
              text-[#16295A]

              sm:text-[30px]
              md:text-[32px]
              lg:text-[34px]
            "
          >
            {t(
              "wasteGenerators.title",
              "Waste Generators",
            )}
          </h1>

          <p
            className="
              mt-1
              max-w-[1100px]
              text-[13px]
              leading-5
              text-slate-500

              sm:text-[14px]
              sm:leading-6
            "
          >
            {t(
              "wasteGenerators.description",
              "Overview of waste generators participation, waste contribution, activity, monitoring and collection performance.",
            )}
          </p>
        </div>

        {/* ===================================================
            WASTE GENERATOR KPIs
        =================================================== */}

        <section
          className="
            mt-5
            w-full
            min-w-0

            sm:mt-6
          "
        >
          <div className="w-full min-w-0">
            <WasteGenKPIs summary={summary} />
          </div>
        </section>

        {/* ===================================================
            MAP + GVP TREND
        =================================================== */}

        <section
          className="
            mt-5
            grid
            w-full
            min-w-0
            grid-cols-1
            gap-5
            items-stretch

            lg:grid-cols-2
            lg:gap-5
          "
        >
          {/* =================================================
              COLLECTION MAP
          ================================================= */}

          <div
            className="
              min-w-0
              w-full
              max-w-full
              overflow-hidden
            "
          >
            <WasteGenMap
              selectedDate={selectedDate}
            />
          </div>

          {/* =================================================
              GVP GENERATION TREND
          ================================================= */}

          <div
            className="
              min-w-0
              w-full
              max-w-full
              overflow-hidden
            "
          >
            <GVPGen
              selectedDate={selectedDate}
              selectedCity={selectedCity}
              selectedZone={selectedZone}
              selectedDivision={selectedDivision}
              selectedWard={selectedWard}
            />
          </div>
        </section>

        {/* ===================================================
            WASTE GENERATOR DIRECTORY
        =================================================== */}

        <section
          className="
            mt-5
            mb-6
            w-full
            min-w-0

            sm:mb-7
            md:mb-8
          "
        >
          <div className="w-full min-w-0 max-w-full">
            <WasteGenDir />
          </div>
        </section>
      </main>
    </div>
  );
}