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
  | DIRECTORY PAGINATION
  |--------------------------------------------------------------------------
  */

  const [directoryPage, setDirectoryPage] = useState(1);

  const [directoryPageSize, setDirectoryPageSize] = useState(10);

  const [directoryTotal, setDirectoryTotal] = useState(0);

  const [directoryTotalPages, setDirectoryTotalPages] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | DIRECTORY SEARCH
  |--------------------------------------------------------------------------
  */

  const [directorySearch, setDirectorySearch] = useState("");

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
        | SUMMARY REQUEST
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
  | NO selectedDate is sent here.
  |
  | Directory is based on current Helper DB citizen data.
  |
  | Backend handles:
  |
  | - City
  | - Zone
  | - Division
  | - Ward
  | - Search
  | - Pagination
  |--------------------------------------------------------------------------
  */

  const loadDirectory = useCallback(async () => {
    try {
      if (!selectedCity?.city_id) {
        setCitizens([]);

        setDirectoryTotal(0);

        setDirectoryTotalPages(0);

        return;
      }

      setDirectoryLoading(true);

      const params = new URLSearchParams();

      /*
        |--------------------------------------------------------------------------
        | PAGINATION
        |--------------------------------------------------------------------------
        */

      params.set("page", String(directoryPage));

      params.set("limit", String(directoryPageSize));

      /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */

      if (directorySearch.trim()) {
        params.set("search", directorySearch.trim());
      }

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
        | DIRECTORY REQUEST
        |--------------------------------------------------------------------------
        */

      const response = await api.get(
        `/api/waste-generators/directory?${params.toString()}`,
      );

      const responseData = response?.data?.data;

      /*
        |--------------------------------------------------------------------------
        | RECORDS
        |--------------------------------------------------------------------------
        */

      const rows = Array.isArray(responseData?.wasteGenerators)
        ? responseData.wasteGenerators
        : [];

      /*
        |--------------------------------------------------------------------------
        | PAGINATION RESPONSE
        |--------------------------------------------------------------------------
        */

      const pagination = responseData?.pagination || {};

      const total = Number(pagination.total || 0);

      const totalPages = Number(pagination.totalPages || 0);

      /*
        |--------------------------------------------------------------------------
        | UPDATE STATE
        |--------------------------------------------------------------------------
        */

      setCitizens(rows);

      setDirectoryTotal(total);

      setDirectoryTotalPages(totalPages);
    } catch (error) {
      console.error("Waste Generator Directory Error:", error);

      setCitizens([]);

      setDirectoryTotal(0);

      setDirectoryTotalPages(0);
    } finally {
      setDirectoryLoading(false);
    }
  }, [
    directoryPage,
    directoryPageSize,
    directorySearch,
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
  | Small debounce prevents an API request for every individual
  | keystroke while searching.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDirectory();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [loadDirectory]);

  /*
  |--------------------------------------------------------------------------
  | RESET DIRECTORY PAGE WHEN FILTERS CHANGE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setDirectoryPage(1);
  }, [
    selectedCity?.city_id,
    selectedZone?.zone_id,
    selectedDivision?.division_id,
    selectedWard?.ward_id,
  ]);

  /*
  |--------------------------------------------------------------------------
  | RESET DIRECTORY PAGE WHEN SEARCH CHANGES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setDirectoryPage(1);
  }, [directorySearch]);

  /*
  |--------------------------------------------------------------------------
  | GET ACTUAL WARD NUMBER
  |--------------------------------------------------------------------------
  |
  | Sync endpoint requires:
  |
  | POST /api/master-citizen/sync/ward/:wardNo
  |
  | NOT ward_id.
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
  */

  const handleSync = useCallback(async () => {
    const wardNo = getSelectedWardNumber();

    /*
      |--------------------------------------------------------------------------
      | WARD REQUIRED
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
        | ACTUAL MASTER CITIZEN SYNC
        |--------------------------------------------------------------------------
        */

      await api.post(`/api/master-citizen/sync/ward/${wardNo}`);

      /*
        |--------------------------------------------------------------------------
        | REFRESH CURRENT DIRECTORY PAGE
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
            search={directorySearch}
            onSearch={setDirectorySearch}
            onUpdate={handleUpdate}
            onSync={handleSync}
            syncing={syncing || directoryLoading}
            loading={directoryLoading}
            page={directoryPage}
            pageSize={directoryPageSize}
            total={directoryTotal}
            totalPages={directoryTotalPages}
            onPageChange={setDirectoryPage}
            onPageSizeChange={(size) => {
              setDirectoryPageSize(size);

              setDirectoryPage(1);
            }}
          />
        </section>
      </div>
    </div>
  );
}
