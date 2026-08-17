import { useCallback, useEffect, useState } from "react";

import Header from "../components/layouts/Header";

import api from "../api/axios";

import WasteGenKPIs from "../components/waste-generators/WasteGenKPIs";

import WasteGenMap from "../components/waste-generators/WasteGenMap";

import GVPGen from "../components/waste-generators/GVPGen";

import WasteGenDir from "../components/waste-generators/WasteGenDir";

import { useFilters } from "../contexts/FilterContext";

export default function WasteGenerators() {
  /*
  |--------------------------------------------------------------------------
  | KPI SUMMARY
  |--------------------------------------------------------------------------
  */

  const [summary, setSummary] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | DIRECTORY
  |--------------------------------------------------------------------------
  */

  const [citizens, setCitizens] = useState([]);

  const [directoryLoading, setDirectoryLoading] = useState(false);

  const [syncing, setSyncing] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | SELECTED DATE
  |--------------------------------------------------------------------------
  |
  | Date is used ONLY by:
  |
  | 1. KPI cards
  | 2. GVP graph
  |
  | Directory does NOT depend on date.
  |--------------------------------------------------------------------------
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
  | LOAD KPI SUMMARY
  |--------------------------------------------------------------------------
  */

  const loadSummary = useCallback(async () => {
    try {
      if (!selectedCity?.city_id) {
        setSummary(null);

        return;
      }

      const params = new URLSearchParams();

      /*
        |--------------------------------------------------------------------------
        | DATE
        |--------------------------------------------------------------------------
        */

      params.set("date", selectedDate);

      /*
        |--------------------------------------------------------------------------
        | CITY
        |--------------------------------------------------------------------------
        */

      params.set("cityId", selectedCity.city_id);

      /*
        |--------------------------------------------------------------------------
        | ZONE
        |--------------------------------------------------------------------------
        */

      if (selectedZone?.zone_id) {
        params.set("zoneId", selectedZone.zone_id);
      }

      /*
        |--------------------------------------------------------------------------
        | DIVISION
        |--------------------------------------------------------------------------
        */

      if (selectedDivision?.division_id) {
        params.set("divisionId", selectedDivision.division_id);
      }

      /*
        |--------------------------------------------------------------------------
        | WARD
        |--------------------------------------------------------------------------
        */

      if (selectedWard?.ward_id) {
        params.set("wardId", selectedWard.ward_id);
      }

      /*
        |--------------------------------------------------------------------------
        | API
        |--------------------------------------------------------------------------
        */

      const response = await api.get(
        `/api/waste-generators/summary?${params.toString()}`,
      );

      setSummary(response?.data?.data || null);
    } catch (error) {
      console.error("Waste Generator Summary Error:", error);

      setSummary(null);
    }
  }, [
    selectedDate,
    selectedCity?.city_id,
    selectedZone?.zone_id,
    selectedDivision?.division_id,
    selectedWard?.ward_id,
  ]);

  /*
  |--------------------------------------------------------------------------
  | LOAD DIRECTORY
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | There is NO date parameter here.
  |
  | Directory reads the current citizen/master data.
  |--------------------------------------------------------------------------
  */

  const loadDirectory = useCallback(async () => {
    try {
      if (!selectedCity?.city_id) {
        setCitizens([]);

        return;
      }

      setDirectoryLoading(true);

      const params = new URLSearchParams();

      /*
        |--------------------------------------------------------------------------
        | PAGINATION
        |--------------------------------------------------------------------------
        */

      params.set("page", "1");

      params.set("limit", "100");

      /*
        |--------------------------------------------------------------------------
        | CITY
        |--------------------------------------------------------------------------
        */

      params.set("cityId", selectedCity.city_id);

      /*
        |--------------------------------------------------------------------------
        | ZONE
        |--------------------------------------------------------------------------
        */

      if (selectedZone?.zone_id) {
        params.set("zoneId", selectedZone.zone_id);
      }

      /*
        |--------------------------------------------------------------------------
        | DIVISION
        |--------------------------------------------------------------------------
        */

      if (selectedDivision?.division_id) {
        params.set("divisionId", selectedDivision.division_id);
      }

      /*
        |--------------------------------------------------------------------------
        | WARD
        |--------------------------------------------------------------------------
        */

      if (selectedWard?.ward_id) {
        params.set("wardId", selectedWard.ward_id);
      }

      /*
        |--------------------------------------------------------------------------
        | DIRECTORY API
        |--------------------------------------------------------------------------
        */

      const response = await api.get(
        `/api/waste-generators/directory?${params.toString()}`,
      );

      /*
        |--------------------------------------------------------------------------
        | RESPONSE NORMALIZATION
        |--------------------------------------------------------------------------
        */

      const responseData = response?.data?.data;

      let rows = [];

      if (Array.isArray(responseData)) {
        rows = responseData;
      } else if (Array.isArray(responseData?.wasteGenerators)) {
        rows = responseData.wasteGenerators;
      } else if (Array.isArray(response?.data?.wasteGenerators)) {
        rows = response.data.wasteGenerators;
      }

      setCitizens(rows);
    } catch (error) {
      console.error("Waste Generator Directory Error:", error);

      setCitizens([]);
    } finally {
      setDirectoryLoading(false);
    }
  }, [
    selectedCity?.city_id,
    selectedZone?.zone_id,
    selectedDivision?.division_id,
    selectedWard?.ward_id,
  ]);

  /*
  |--------------------------------------------------------------------------
  | KPI EFFECT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  /*
  |--------------------------------------------------------------------------
  | DIRECTORY EFFECT
  |--------------------------------------------------------------------------
  |
  | Notice:
  |
  | selectedDate is intentionally NOT included.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadDirectory();
  }, [loadDirectory]);

  /*
  |--------------------------------------------------------------------------
  | GET ACTUAL WARD NUMBER
  |--------------------------------------------------------------------------
  |
  | The sync endpoint requires:
  |
  | /sync/ward/:wardNo
  |
  | NOT:
  |
  | /sync/ward/:wardId
  |
  | We support both possible frontend property names so the
  | Header implementation does not need to be changed.
  |--------------------------------------------------------------------------
  */

  const getSelectedWardNumber = useCallback(() => {
    if (!selectedWard) {
      return null;
    }

    const possibleWardNumbers = [
      selectedWard.ward_no,

      selectedWard.wardNo,

      selectedWard.ward_number,

      selectedWard.wardNumber,
    ];

    for (const value of possibleWardNumbers) {
      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
      ) {
        const wardNo = Number(value);

        if (Number.isInteger(wardNo) && wardNo > 0) {
          return wardNo;
        }
      }
    }

    return null;
  }, [selectedWard]);

  /*
  |--------------------------------------------------------------------------
  | SYNC SELECTED WARD
  |--------------------------------------------------------------------------
  |
  | POST
  | /api/master-citizen/sync/ward/:wardNo
  |
  | The backend service then:
  |
  | wardNo
  |   ↓
  | Master Citizen ward registry
  |   ↓
  | Helper DB citizens
  |   ↓
  | matching ward
  |   ↓
  | bulk upsert into physical ward table
  |--------------------------------------------------------------------------
  */

  const handleSync = useCallback(async () => {
    const wardNo = getSelectedWardNumber();

    /*
      |--------------------------------------------------------------------------
      | NO WARD SELECTED
      |--------------------------------------------------------------------------
      |
      | The endpoint is explicitly ward-wise.
      |
      | We do not randomly sync a ward when only a division/zone is selected.
      |--------------------------------------------------------------------------
      */

    if (!wardNo) {
      window.alert("Please select a ward before syncing.");

      return;
    }

    try {
      setSyncing(true);

      /*
        |--------------------------------------------------------------------------
        | ACTUAL SYNC ENDPOINT
        |--------------------------------------------------------------------------
        */

      await api.post(`/api/master-citizen/sync/ward/${wardNo}`);

      /*
        |--------------------------------------------------------------------------
        | REFRESH DIRECTORY AFTER SYNC
        |--------------------------------------------------------------------------
        */

      await loadDirectory();

      /*
        |--------------------------------------------------------------------------
        | SUCCESS
        |--------------------------------------------------------------------------
        */

      window.alert(`Ward ${wardNo} synchronization completed successfully.`);
    } catch (error) {
      console.error("Ward synchronization failed:", error);

      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Ward synchronization failed.";

      window.alert(message);
    } finally {
      setSyncing(false);
    }
  }, [getSelectedWardNumber, loadDirectory]);

  /*
  |--------------------------------------------------------------------------
  | UPDATE
  |--------------------------------------------------------------------------
  |
  | Keep the existing Update action.
  |
  | WasteGenDir calls:
  |
  | onUpdate(citizen)
  |
  | The parent can therefore connect this to the existing update
  | modal/workflow without changing the Directory's data source.
  |--------------------------------------------------------------------------
  */

  const handleUpdate = useCallback((citizen) => {
    window.dispatchEvent(
      new CustomEvent("sewac:waste-generator-update", {
        detail: citizen,
      }),
    );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFC]">
      {/* ================================================================ */}
      {/* HEADER                                                           */}
      {/* ================================================================ */}

      <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      {/* ================================================================ */}
      {/* PAGE                                                             */}
      {/* ================================================================ */}

      <div className="w-full px-8 py-7 overflow-x-hidden">
        {/* ============================================================ */}
        {/* TITLE                                                          */}
        {/* ============================================================ */}

        <div>
          <h1 className="text-[34px] font-bold tracking-tight text-[#16295A]">
            Waste Generators
          </h1>

          <p className="mt-1 text-[14px] text-slate-500">
            Overview of waste generators participation, waste contribution,
            activity, monitoring and collection performance.
          </p>
        </div>

        {/* ============================================================ */}
        {/* KPI CARDS                                                      */}
        {/* ============================================================ */}

        <section className="mt-6">
          <WasteGenKPIs summary={summary} />
        </section>

        {/* ============================================================ */}
        {/* MAP + GVP                                                     */}
        {/* ============================================================ */}

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
          {/* ========================================================== */}
          {/* COLLECTION POINT                                           */}
          {/* ========================================================== */}

          <div className="min-w-0 h-full">
            <WasteGenMap />
          </div>

          {/* ========================================================== */}
          {/* GVP TREND                                                   */}
          {/* ========================================================== */}

          <div className="min-w-0 h-full">
            <GVPGen
              selectedDate={selectedDate}
              selectedCity={selectedCity}
              selectedZone={selectedZone}
              selectedDivision={selectedDivision}
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/* DIRECTORY                                                      */}
        {/* ============================================================ */}

        <section className="mt-5 mb-8">
          <WasteGenDir
            citizens={citizens}
            onUpdate={handleUpdate}
            onSync={handleSync}
            syncing={syncing || directoryLoading}
          />
        </section>
      </div>
    </div>
  );
}
