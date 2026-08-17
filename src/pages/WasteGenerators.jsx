import { useEffect, useState } from "react";
import Header from "../components/layouts/Header";
import api from "../api/axios";

import WasteGenKPIs from "../components/waste-generators/WasteGenKPIs";
import WasteGenMap from "../components/waste-generators/WasteGenMap";
import GVPGen from "../components/waste-generators/GVPGen";
import WasteGenDir from "../components/waste-generators/WasteGenDir";

import { useFilters } from "../contexts/FilterContext";

export default function WasteGenerators() {
  const [summary, setSummary] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | SELECTED DATE
  |--------------------------------------------------------------------------
  |
  | Header already accepts selectedDate + setSelectedDate as props.
  | We keep the date state here so this page controls its own
  | analytical date.
  |
  */

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  /*
  |--------------------------------------------------------------------------
  | HEADER FILTERS
  |--------------------------------------------------------------------------
  */

  const { selectedCity, selectedZone, selectedDivision, selectedWard } =
    useFilters();

  /*
  |--------------------------------------------------------------------------
  | LOAD WASTE GENERATOR KPI SUMMARY
  |--------------------------------------------------------------------------
  |
  | KPI DATA DEPENDS ON:
  |
  | City
  | Zone
  | Division
  | Ward
  | Date
  |
  */

  const loadSummary = async () => {
    try {
      /*
       * Wait until city is available.
       */

      if (!selectedCity?.city_id) {
        setSummary(null);
        return;
      }

      /*
       * Build query parameters.
       */

      const params = new URLSearchParams();

      /*
       * DATE
       */

      params.set("date", selectedDate);

      /*
       * CITY
       */

      params.set("cityId", selectedCity.city_id);

      /*
       * ZONE
       */

      if (selectedZone?.zone_id) {
        params.set("zoneId", selectedZone.zone_id);
      }

      /*
       * DIVISION
       */

      if (selectedDivision?.division_id) {
        params.set("divisionId", selectedDivision.division_id);
      }

      /*
       * WARD
       */

      if (selectedWard?.ward_id) {
        params.set("wardId", selectedWard.ward_id);
      }

      /*
       * FINAL REQUEST
       *
       * Example:
       *
       * /api/waste-generators/summary
       * ?date=2026-08-16
       * &cityId=1
       * &zoneId=4
       * &divisionId=5
       * &wardId=216
       */

      const res = await api.get(
        `/api/waste-generators/summary?${params.toString()}`,
      );

      setSummary(res.data?.data || null);
    } catch (err) {
      console.error("Waste Generator Summary Error:", err);

      setSummary(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RELOAD KPI WHEN ANY HEADER FILTER CHANGES
  |--------------------------------------------------------------------------
  |
  | Date is intentionally included here.
  |
  */

  useEffect(() => {
    loadSummary();
  }, [
    selectedDate,
    selectedCity?.city_id,
    selectedZone?.zone_id,
    selectedDivision?.division_id,
    selectedWard?.ward_id,
  ]);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFC]">
      {/* ================= Header ================= */}

      <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      {/* ================= Page ================= */}

      <div className="w-full px-8 py-7 overflow-x-hidden">
        {/* ================= Title ================= */}

        <div>
          <h1 className="text-[34px] font-bold tracking-tight text-[#16295A]">
            Waste Generators
          </h1>

          <p className="mt-1 text-[14px] text-slate-500">
            Overview of waste generators participation, waste contribution,
            activity, monitoring and collection performance.
          </p>
        </div>

        {/* ================= KPI Cards ================= */}

        <section className="mt-6">
          <WasteGenKPIs summary={summary} />
        </section>

        {/* ================= Maps ================= */}

        <section className="mt-5">
          <WasteGenMap />
        </section>

        {/* ================= GVP Trend ================= */}

        <section className="mt-5">
          <GVPGen />
        </section>

        {/* ================= Directory ================= */}

        <section className="mt-5 mb-8">
          <WasteGenDir />
        </section>
      </div>
    </div>
  );
}
