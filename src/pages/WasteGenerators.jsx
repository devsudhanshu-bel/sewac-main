import { useCallback, useEffect, useState } from "react";

import Header from "../components/layouts/Header";
import api from "../api/axios";

import WasteGenKPIs from "../components/waste-generators/WasteGenKPIs";
import WasteGenMap from "../components/waste-generators/WasteGenMap";
import GVPGen from "../components/waste-generators/GVPGen";
import WasteGenDir from "../components/waste-generators/WasteGenDir";

import { useFilters } from "../contexts/FilterContext";
import { useLanguage } from "../i18n";

export default function WasteGenerators() {
  /*
  |--------------------------------------------------------------------------
  | LANGUAGE
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | This project uses the custom SEWAC language system.
  |
  | DO NOT use:
  | import { useTranslation } from "react-i18next";
  |
  | We use:
  | import { useLanguage } from "../i18n";
  |--------------------------------------------------------------------------
  */

  const { t } = useLanguage();

  /*
  |--------------------------------------------------------------------------
  | KPI
  |--------------------------------------------------------------------------
  */

  const [summary, setSummary] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | DATE
  |--------------------------------------------------------------------------
  */

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  /*
  |--------------------------------------------------------------------------
  | HEADER FILTERS
  |--------------------------------------------------------------------------
  */

  const {
    selectedCity,
    selectedZone,
    selectedDivision,
    selectedWard,
  } = useFilters();

  /*
  |--------------------------------------------------------------------------
  | DIRECTORY STATE
  |--------------------------------------------------------------------------
  */

  const [citizens, setCitizens] = useState([]);

  const [directoryLoading, setDirectoryLoading] =
    useState(false);

  const [directorySearch, setDirectorySearch] =
    useState("");

  const [directoryPage, setDirectoryPage] =
    useState(1);

  const [directoryPageSize, setDirectoryPageSize] =
    useState(10);

  const [directoryTotal, setDirectoryTotal] =
    useState(0);

  const [directoryTotalPages, setDirectoryTotalPages] =
    useState(0);

  const [syncing, setSyncing] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOAD SUMMARY
  |--------------------------------------------------------------------------
  */

  const loadSummary = useCallback(async () => {
    try {
      /*
      |--------------------------------------------------------------------------
      | CITY REQUIRED
      |--------------------------------------------------------------------------
      */

      if (!selectedCity?.city_id) {
        setSummary(null);
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | BUILD QUERY
      |--------------------------------------------------------------------------
      */

      const params = new URLSearchParams();

      params.set(
        "date",
        selectedDate
      );

      params.set(
        "cityId",
        selectedCity.city_id
      );

      if (selectedZone?.zone_id) {
        params.set(
          "zoneId",
          selectedZone.zone_id
        );
      }

      if (selectedDivision?.division_id) {
        params.set(
          "divisionId",
          selectedDivision.division_id
        );
      }

      if (selectedWard?.ward_id) {
        params.set(
          "wardId",
          selectedWard.ward_id
        );
      }

      /*
      |--------------------------------------------------------------------------
      | API
      |--------------------------------------------------------------------------
      */

      const response = await api.get(
        `/api/waste-generators/summary?${params.toString()}`
      );

      setSummary(
        response?.data?.data || null
      );
    } catch (error) {
      console.error(
        "Waste Generator Summary Error:",
        error
      );

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
  | Directory represents current master citizen data.
  |--------------------------------------------------------------------------
  */

  const loadDirectory = useCallback(async () => {
    /*
    |--------------------------------------------------------------------------
    | REQUIRE COMPLETE HEADER
    |--------------------------------------------------------------------------
    */

    if (
      !selectedCity?.city_id ||
      !selectedZone?.zone_id ||
      !selectedDivision?.division_id ||
      !selectedWard?.ward_id
    ) {
      setCitizens([]);

      setDirectoryTotal(0);

      setDirectoryTotalPages(0);

      return;
    }

    try {
      setDirectoryLoading(true);

      /*
      |--------------------------------------------------------------------------
      | BUILD QUERY
      |--------------------------------------------------------------------------
      */

      const params = new URLSearchParams();

      params.set(
        "page",
        String(directoryPage)
      );

      params.set(
        "limit",
        String(directoryPageSize)
      );

      params.set(
        "cityId",
        String(selectedCity.city_id)
      );

      params.set(
        "zoneId",
        String(selectedZone.zone_id)
      );

      params.set(
        "divisionId",
        String(selectedDivision.division_id)
      );

      params.set(
        "wardId",
        String(selectedWard.ward_id)
      );

      params.set(
        "date",
        selectedDate
      );

      if (directorySearch.trim()) {
        params.set(
          "search",
          directorySearch.trim()
        );
      }

      /*
      |--------------------------------------------------------------------------
      | API
      |--------------------------------------------------------------------------
      */

      const response = await api.get(
        `/api/waste-generators/directory?${params.toString()}`
      );

      const directory =
        response?.data?.data;

      const rows =
        Array.isArray(
          directory?.wasteGenerators
        )
          ? directory.wasteGenerators
          : [];

      const pagination =
        directory?.pagination || {};

      /*
      |--------------------------------------------------------------------------
      | SET DIRECTORY
      |--------------------------------------------------------------------------
      */

      setCitizens(rows);

      setDirectoryTotal(
        Number(
          pagination.total || 0
        )
      );

      setDirectoryTotalPages(
        Number(
          pagination.totalPages || 0
        )
      );
    } catch (error) {
      console.error(
        "Waste Generator Directory Error:",
        error
      );

      setCitizens([]);

      setDirectoryTotal(0);

      setDirectoryTotalPages(0);
    } finally {
      setDirectoryLoading(false);
    }
  }, [
    selectedDate,
    selectedCity?.city_id,
    selectedZone?.zone_id,
    selectedDivision?.division_id,
    selectedWard?.ward_id,
    directoryPage,
    directoryPageSize,
    directorySearch,
  ]);

  /*
  |--------------------------------------------------------------------------
  | HEADER FILTER CHANGE
  |--------------------------------------------------------------------------
  |
  | Whenever City / Zone / Division / Ward changes,
  | return directory to page 1.
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
  | SEARCH CHANGE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setDirectoryPage(1);
  }, [
    directorySearch
  ]);

  /*
  |--------------------------------------------------------------------------
  | SUMMARY EFFECT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadSummary();
  }, [
    loadSummary
  ]);

  /*
  |--------------------------------------------------------------------------
  | DIRECTORY EFFECT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadDirectory();
  }, [
    loadDirectory
  ]);

  /*
  |--------------------------------------------------------------------------
  | GET WARD NUMBER
  |--------------------------------------------------------------------------
  */

  const getSelectedWardNumber =
    useCallback(() => {
      if (!selectedWard) {
        return null;
      }

      const values = [
        selectedWard.ward_no,
        selectedWard.wardNo,
        selectedWard.ward_number,
        selectedWard.wardNumber,
      ];

      for (const value of values) {
        if (
          value !== null &&
          value !== undefined &&
          String(value).trim()
        ) {
          const number =
            Number(value);

          if (
            Number.isInteger(number) &&
            number > 0
          ) {
            return number;
          }
        }
      }

      return null;
    }, [
      selectedWard
    ]);

  /*
  |--------------------------------------------------------------------------
  | SYNC WARD
  |--------------------------------------------------------------------------
  */

  const handleSync =
    useCallback(async () => {
      const wardNo =
        getSelectedWardNumber();

      /*
      |--------------------------------------------------------------------------
      | NO WARD
      |--------------------------------------------------------------------------
      */

      if (!wardNo) {
        window.alert(
          t(
            "wasteGenerators.sync.selectWard",
            "Please select a ward before syncing."
          )
        );

        return;
      }

      try {
        setSyncing(true);

        /*
        |--------------------------------------------------------------------------
        | SYNC API
        |--------------------------------------------------------------------------
        */

        await api.post(
          `/api/master-citizen/sync/ward/${wardNo}`
        );

        /*
        |--------------------------------------------------------------------------
        | REFRESH DIRECTORY
        |--------------------------------------------------------------------------
        */

        setDirectoryPage(1);

        await loadDirectory();

        /*
        |--------------------------------------------------------------------------
        | SUCCESS
        |--------------------------------------------------------------------------
        */

        window.alert(
          t(
            "wasteGenerators.sync.success",
            "Ward {{ward}} synced successfully.",
            {
              ward: wardNo,
            }
          )
        );
      } catch (error) {
        console.error(
          "Waste Generator Sync Error:",
          error
        );

        /*
        |--------------------------------------------------------------------------
        | BACKEND MESSAGE
        |--------------------------------------------------------------------------
        */

        const backendMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message;

        window.alert(
          backendMessage ||
            t(
              "wasteGenerators.sync.failed",
              "Failed to sync the selected ward."
            )
        );
      } finally {
        setSyncing(false);
      }
    }, [
      getSelectedWardNumber,
      loadDirectory,
      t,
    ]);

  /*
  |--------------------------------------------------------------------------
  | UPDATE
  |--------------------------------------------------------------------------
  */

  const handleUpdate =
    useCallback((citizen) => {
      /*
       * Keep your existing update
       * modal/navigation here.
       *
       * For now we only surface
       * the selected record.
       */

      console.log(
        "Update Waste Generator:",
        citizen
      );
    }, []);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFC]">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <div
        className="
          w-full
          overflow-x-hidden
          px-4
          py-5
          sm:px-6
          sm:py-6
          lg:px-8
          lg:py-7
        "
      >

        {/* ======================================================
            PAGE TITLE
        ====================================================== */}

        <div>

          <h1
            className="
              text-[28px]
              font-bold
              tracking-tight
              text-[#16295A]
              sm:text-[32px]
              lg:text-[34px]
            "
          >
            {t(
              "wasteGenerators.title",
              "Waste Generators"
            )}
          </h1>

          <p
            className="
              mt-1
              max-w-5xl
              text-[13px]
              leading-5
              text-slate-500
              sm:text-[14px]
              sm:leading-6
            "
          >
            {t(
              "wasteGenerators.description",
              "Overview of waste generators participation, waste contribution, activity, monitoring and collection performance."
            )}
          </p>

        </div>

        {/* ======================================================
            KPI
        ====================================================== */}

        <section className="mt-5 sm:mt-6">

          <WasteGenKPIs
            summary={summary}
          />

        </section>

        {/* ======================================================
            MAPS
        ====================================================== */}

        <section
          className="
            mt-5
            grid
            grid-cols-1
            items-stretch
            gap-5
            lg:grid-cols-2
          "
        >

          {/* ====================================================
              WASTE GENERATOR MAP
          ==================================================== */}

          <div className="min-w-0 h-full">

            <WasteGenMap
              selectedDate={selectedDate}
            />

          </div>

          {/* ====================================================
              GVP
          ==================================================== */}

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

        {/* ======================================================
            DIRECTORY
        ====================================================== */}

        <section className="mt-5 mb-8">

          <WasteGenDir
            citizens={citizens}

            search={directorySearch}

            onSearch={
              setDirectorySearch
            }

            onUpdate={
              handleUpdate
            }

            onSync={
              handleSync
            }

            syncing={syncing}

            loading={
              directoryLoading
            }

            page={
              directoryPage
            }

            pageSize={
              directoryPageSize
            }

            total={
              directoryTotal
            }

            totalPages={
              directoryTotalPages
            }

            onPageChange={
              setDirectoryPage
            }

            onPageSizeChange={
              (newSize) => {
                setDirectoryPageSize(
                  newSize
                );

                setDirectoryPage(1);
              }
            }
          />

        </section>

      </div>

    </div>
  );
}