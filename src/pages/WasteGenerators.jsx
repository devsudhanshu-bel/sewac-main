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

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const { selectedCity, selectedZone, selectedDivision, selectedWard } =
    useFilters();

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
        params.set("divisionId", selectedDivision.division_id);
      }

      if (selectedWard?.ward_id) {
        params.set("wardId", selectedWard.ward_id);
      }

      const response = await api.get(
        `/api/waste-generators/summary?${params.toString()}`,
      );

      setSummary(response?.data?.data || null);
    } catch (error) {
      console.error("Waste Generator Summary Error:", error);

      setSummary(null);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [
    selectedDate,
    selectedCity?.city_id,
    selectedZone?.zone_id,
    selectedDivision?.division_id,
    selectedWard?.ward_id,
  ]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFC]">
      <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      <div className="w-full px-8 py-7 overflow-x-hidden">
        <div>
          <h1 className="text-[34px] font-bold tracking-tight text-[#16295A]">
            Waste Generators
          </h1>

          <p className="mt-1 text-[14px] text-slate-500">
            Overview of waste generators participation, waste contribution,
            activity, monitoring and collection performance.
          </p>
        </div>

        <section className="mt-6">
          <WasteGenKPIs summary={summary} />
        </section>

        <section
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-5
            mt-5
            items-stretch
          "
        >
          <div className="min-w-0 h-full">
            <WasteGenMap selectedDate={selectedDate} />
          </div>

          <div className="min-w-0 h-full">
            <GVPGen
              selectedDate={selectedDate}
              selectedCity={selectedCity}
              selectedZone={selectedZone}
              selectedDivision={selectedDivision}
              selectedWard={selectedWard}
            />
          </div>
        </section>

        <section className="mt-5 mb-8">
          <WasteGenDir />
        </section>
      </div>
    </div>
  );
}
