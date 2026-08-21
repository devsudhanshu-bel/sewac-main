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

  /*
  |--------------------------------------------------------------------------
  | DIRECTORY STATE
  |--------------------------------------------------------------------------
  */

  const [citizens, setCitizens] = useState([]);

  const [directoryLoading, setDirectoryLoading] = useState(false);

  const [directorySearch, setDirectorySearch] = useState("");

  const [directoryPage, setDirectoryPage] = useState(1);

  const [directoryPageSize, setDirectoryPageSize] = useState(10);

  const [directoryPagination, setDirectoryPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [syncing, setSyncing] = useState(false);

  const { selectedCity, selectedZone, selectedDivision, selectedWard } =
    useFilters();

  const { t } = useLanguage();

  /*
  |--------------------------------------------------------------------------
  | HEADER IDS
  |--------------------------------------------------------------------------
  */

  const cityId = selectedCity?.city_id ?? null;

  const zoneId = selectedZone?.zone_id ?? null;

  const divisionId = selectedDivision?.division_id ?? null;

  const wardId = selectedWard?.ward_id ?? null;

  /*
  |--------------------------------------------------------------------------
  | LOAD SUMMARY
  |--------------------------------------------------------------------------
  */

  const loadSummary = async () => {
    try {
      if (!cityId) {
        setSummary(null);
        return;
      }

      const params = new URLSearchParams();

      params.set("date", selectedDate);

      params.set("cityId", cityId);

      if (zoneId) {
        params.set("zoneId", zoneId);
      }

      if (divisionId) {
        params.set("divisionId", divisionId);
      }

      if (wardId) {
        params.set("wardId", wardId);
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

  /*
  |--------------------------------------------------------------------------
  | LOAD DIRECTORY
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | This reads:
  |
  | master_citizen_data
  |
  | It does NOT modify it.
  |--------------------------------------------------------------------------
  */

  const loadDirectory = async () => {
    /*
    |----------------------------------------------------------------------
    | Don't query until the COMPLETE Header hierarchy is selected.
    |----------------------------------------------------------------------
    */

    if (!cityId || !zoneId || !divisionId || !wardId) {
      setCitizens([]);

      setDirectoryPagination({
        page: 1,
        limit: directoryPageSize,
        total: 0,
        totalPages: 0,
      });

      setDirectoryLoading(false);

      return;
    }

    setDirectoryLoading(true);

    try {
      const response = await api.get("/api/waste-generators/directory", {
        params: {
          page: directoryPage,

          limit: directoryPageSize,

          search: directorySearch,

          cityId,

          zoneId,

          divisionId,

          wardId,
        },
      });

      const data = response?.data?.data;

      setCitizens(
        Array.isArray(data?.wasteGenerators) ? data.wasteGenerators : [],
      );

      setDirectoryPagination(
        data?.pagination || {
          page: directoryPage,

          limit: directoryPageSize,

          total: 0,

          totalPages: 0,
        },
      );
    } catch (error) {
      console.error("Waste Generator Directory Error:", error);

      setCitizens([]);

      setDirectoryPagination({
        page: directoryPage,

        limit: directoryPageSize,

        total: 0,

        totalPages: 0,
      });
    } finally {
      setDirectoryLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SUMMARY EFFECT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadSummary();
  }, [selectedDate, cityId, zoneId, divisionId, wardId]);

  /*
  |--------------------------------------------------------------------------
  | RESET DIRECTORY PAGE WHEN HEADER FILTER CHANGES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setDirectoryPage(1);
  }, [cityId, zoneId, divisionId, wardId]);

  /*
  |--------------------------------------------------------------------------
  | DIRECTORY EFFECT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDirectory();
    }, 250);

    return () => clearTimeout(timer);
  }, [
    cityId,
    zoneId,
    divisionId,
    wardId,
    directoryPage,
    directoryPageSize,
    directorySearch,
  ]);

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const handleDirectorySearch = (value) => {
    setDirectorySearch(value);

    setDirectoryPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | PAGE SIZE
  |--------------------------------------------------------------------------
  */

  const handleDirectoryPageSize = (size) => {
    setDirectoryPageSize(size);

    setDirectoryPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  const handleDirectoryPage = (page) => {
    setDirectoryPage(page);
  };

  /*
  |--------------------------------------------------------------------------
  | SYNC SELECTED WARD
  |--------------------------------------------------------------------------
  |
  | Existing endpoint:
  |
  | POST /api/master-citizen/sync/ward/:wardNo
  |
  | IMPORTANT:
  |
  | This does NOT modify master_citizen_data.
  |
  | It reads the master table and synchronizes the
  | physical ward representation.
  |--------------------------------------------------------------------------
  */

  const handleSync = async () => {
    if (!selectedWard) {
      return;
    }

    const wardNo = selectedWard.ward_no ?? selectedWard.wardNo;

    if (!wardNo) {
      console.error("Selected ward has no ward number.");

      return;
    }

    setSyncing(true);

    try {
      await api.post(`/api/master-citizen/sync/ward/${wardNo}`);

      /*
      |------------------------------------------------------------------
      | IMPORTANT:
      |
      | Directory source is still master_citizen_data.
      |
      | Reload only so the UI reflects the latest source state.
      |------------------------------------------------------------------
      */

      await loadDirectory();
    } catch (error) {
      console.error("Ward Sync Error:", error);
    } finally {
      setSyncing(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

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
      <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

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
            {t("wasteGenerators.title", "Waste Generators")}
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
          <div
            className="
              min-w-0
              w-full
              max-w-full
              overflow-hidden
            "
          >
            <WasteGenMap selectedDate={selectedDate} />
          </div>

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
            <WasteGenDir
              citizens={citizens}
              search={directorySearch}
              onSearch={handleDirectorySearch}
              onSync={handleSync}
              syncing={syncing}
              loading={directoryLoading}
              page={directoryPagination.page || directoryPage}
              pageSize={directoryPagination.limit || directoryPageSize}
              total={directoryPagination.total || 0}
              totalPages={directoryPagination.totalPages || 0}
              onPageChange={handleDirectoryPage}
              onPageSizeChange={handleDirectoryPageSize}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
