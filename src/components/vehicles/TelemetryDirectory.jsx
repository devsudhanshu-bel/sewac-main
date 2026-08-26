import { RadioTower, Search, Download } from "lucide-react";

import { useEffect, useState } from "react";

import api from "../../api/axios";

import CreateVehicleModal from "./CreateVehicleModal";
import EditVehicleModal from "./EditVehicleModal";
import DeleteVehicleModal from "./DeleteVehicleModal";

import { useLanguage } from "../../i18n";

/* ===========================================================
   STATUS BADGE
=========================================================== */

function StatusBadge({ status, t }) {
  const active = status === "ACTIVE";

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-lg
        px-3
        py-1
        text-[11px]
        font-semibold
        whitespace-nowrap
        ${
          active ? "bg-[#E8FBF2] text-[#16A34A]" : "bg-[#FFF0E8] text-[#F97316]"
        }
      `}
    >
      {active
        ? t("vehicles.telemetryDirectory.active", "Active")
        : t("vehicles.telemetryDirectory.inactive", "Inactive")}
    </span>
  );
}

/* ===========================================================
   TODAY'S WORK BADGE
=========================================================== */

function WorkedTodayBadge({ workedToday, t }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-lg
        px-3
        py-1
        text-[11px]
        font-semibold
        whitespace-nowrap
        ${
          workedToday
            ? "bg-[#E8FBF2] text-[#16A34A]"
            : "bg-[#FFF0E8] text-[#F97316]"
        }
      `}
    >
      {workedToday
        ? t("vehicles.telemetryDirectory.workedToday", "Worked Today")
        : t("vehicles.telemetryDirectory.notWorkedToday", "Not Worked")}
    </span>
  );
}

/* ===========================================================
   COMPONENT
=========================================================== */

export default function TelemetryDirectory() {
  const { t } = useLanguage();

  const [telemetry, setTelemetry] = useState([]);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(5);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [pagination, setPagination] = useState({});

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  /* ===========================================================
     PAGINATION
  =========================================================== */

  const start = telemetry.length ? (page - 1) * limit + 1 : 0;

  const end = (page - 1) * limit + telemetry.length;

  /* ===========================================================
     FETCH VEHICLES
  =========================================================== */

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/api/vehicles", {
        params: {
          page,
          limit,
          search,
          status,
        },
      });

      setTelemetry(res?.data?.data?.vehicles || []);

      setPagination(res?.data?.data?.pagination || {});
    } catch (err) {
      console.error("Vehicle Directory Error:", err);

      setTelemetry([]);
      setPagination({});
    }
  };

  /* ===========================================================
     FETCH ON FILTER CHANGE
  =========================================================== */

  useEffect(() => {
    fetchVehicles();
  }, [page, limit, search, status]);

  /* ===========================================================
     DOWNLOAD CSV
  =========================================================== */

  const downloadCSV = () => {
    const headers = [
      t("vehicles.telemetryDirectory.csv.vehicleId", "Vehicle ID"),
      t("vehicles.telemetryDirectory.csv.vehicleNumber", "Vehicle Number"),
      t("vehicles.telemetryDirectory.csv.vehicleType", "Vehicle Type"),
      t("vehicles.telemetryDirectory.csv.city", "City"),
      t("vehicles.telemetryDirectory.csv.zone", "Zone"),
      t("vehicles.telemetryDirectory.csv.division", "Division"),
      t("vehicles.telemetryDirectory.csv.ward", "Ward"),
      t("vehicles.telemetryDirectory.todayWork", "Today's Work"),
      t("vehicles.telemetryDirectory.csv.status", "Status"),
    ];

    const rows = telemetry.map((v) => [
      v.vehicle_id ?? "",
      v.vehicle_number ?? "",
      v.vehicle_type ?? "",
      v.city ?? "",
      v.zone ?? "",
      v.division ?? "",
      v.ward ?? "",
      v.status ?? "",
    ]);

    const escapeCSV = (value) => {
      const stringValue = String(value);

      if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    };

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "vehicles.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* ===========================================================
     RENDER
  =========================================================== */

  return (
    <section
      className="
        w-full
        bg-white
        rounded-[26px]
        border
        border-[#ECECF3]
        shadow-sm
        overflow-hidden
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-4
          px-6
          lg:px-7
          py-5
          border-b
          border-[#F3F4F6]
        "
      >
        {/* ================= LEFT ================= */}

        <div className="flex items-center gap-3 shrink-0">
          <div
            className="
              w-9
              h-9
              rounded-xl
              bg-[#F4EEFF]
              flex
              items-center
              justify-center
            "
          >
            <RadioTower size={19} className="text-[#6C2BFF]" />
          </div>

          <h2
            className="
              text-[15px]
              font-semibold
              uppercase
              tracking-wide
              text-[#111827]
            "
          >
            {t("vehicles.telemetryDirectory.title", "Vehicle Directory")}
          </h2>
        </div>

        {/* ================= RIGHT CONTROLS ================= */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
            xl:justify-end
          "
        >
          {/* SEARCH */}

          <div
            className="
              relative
              w-full
              sm:w-[260px]
              lg:w-[300px]
              xl:w-[330px]
            "
          >
            <Search
              size={16}
              className="
                absolute
                left-3.5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t(
                "vehicles.telemetryDirectory.searchPlaceholder",
                "Search by Vehicle ID",
              )}
              className="
                w-full
                h-10
                pl-10
                pr-3
                border
                border-gray-300
                rounded-xl
                bg-white
                text-[12px]
                focus:outline-none
                focus:ring-2
                focus:ring-[#6C2BFF]
                focus:border-[#6C2BFF]
                transition
              "
            />
          </div>

          {/* STATUS */}

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="
              h-10
              w-[140px]
              rounded-xl
              border
              border-gray-300
              bg-white
              px-3
              text-[12px]
              focus:outline-none
              focus:ring-2
              focus:ring-[#6C2BFF]
            "
          >
            <option value="ALL">
              {t("vehicles.telemetryDirectory.allStatus", "All Status")}
            </option>

            <option value="ACTIVE">
              {t("vehicles.telemetryDirectory.active", "Active")}
            </option>

            <option value="INACTIVE">
              {t("vehicles.telemetryDirectory.inactive", "Inactive")}
            </option>
          </select>

          {/* DOWNLOAD */}

          <button
            type="button"
            onClick={downloadCSV}
            title={t("vehicles.telemetryDirectory.download", "Download")}
            className="
              w-10
              h-10
              rounded-xl
              border
              border-gray-300
              bg-white
              flex
              items-center
              justify-center
              hover:bg-gray-50
              hover:border-gray-400
              transition
              shrink-0
            "
          >
            <Download size={17} />
          </button>

          {/* CREATE */}

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="
              h-10
              px-5
              rounded-xl
              bg-[#6C2BFF]
              text-white
              text-[12px]
              font-semibold
              hover:bg-[#5B21E8]
              transition
              whitespace-nowrap
            "
          >
            {t("vehicles.telemetryDirectory.createVehicle", "Create Vehicle")}
          </button>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-x-auto">
        <table
          className="
            w-full
            min-w-[760px]
            table-fixed
          "
        >
          {/* ================= HEADER ================= */}

          <thead className="bg-[#F8F8FC]">
            <tr>
              <th
                className="
                  w-[45px]
                  px-4
                  py-3.5
                  text-left
                  text-[12px]
                  font-semibold
                  text-[#111827]
                "
              >
                #
              </th>

              <th
                className="
                  w-[130px]
                  px-4
                  py-3.5
                  text-left
                  text-[12px]
                  font-semibold
                  text-[#111827]
                "
              >
                {t("vehicles.telemetryDirectory.vehicleId", "Vehicle ID")}
              </th>

              <th
                className="
                  w-[150px]
                  px-4
                  py-3.5
                  text-left
                  text-[12px]
                  font-semibold
                  text-[#111827]
                "
              >
                {t("vehicles.telemetryDirectory.routeZone", "Route / Zone")}
              </th>

              <th
                className="
                  w-[180px]
                  px-4
                  py-3.5
                  text-left
                  text-[12px]
                  font-semibold
                  text-[#111827]
                "
              >
                {t("vehicles.telemetryDirectory.lastUpdate", "Last Update")}
              </th>

              <th
                className="
    w-[130px]
    px-4
    py-3.5
    text-center
    text-[12px]
    font-semibold
    text-[#111827]
  "
              >
                {t("vehicles.telemetryDirectory.todayWork", "Today's Work")}
              </th>

              <th
                className="
                  w-[120px]
                  px-4
                  py-3.5
                  text-center
                  text-[12px]
                  font-semibold
                  text-[#111827]
                "
              >
                {t("vehicles.telemetryDirectory.status", "Status")}
              </th>

              <th
                className="
                  w-[120px]
                  px-4
                  py-3.5
                  text-center
                  text-[12px]
                  font-semibold
                  text-[#111827]
                "
              >
                {t("vehicles.telemetryDirectory.actions", "Actions")}
              </th>
            </tr>
          </thead>

          {/* ================= BODY ================= */}

          <tbody>
            {telemetry.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="
                    px-4
                    py-12
                    text-center
                    text-[12px]
                    text-gray-500
                  "
                >
                  {t(
                    "vehicles.telemetryDirectory.noVehicles",
                    "No vehicles found.",
                  )}
                </td>
              </tr>
            ) : (
              telemetry.map((vehicle, index) => (
                <tr
                  key={vehicle.vehicle_id}
                  className="
                      border-b
                      border-[#ECECF3]
                      hover:bg-[#FAFAFF]
                      transition
                    "
                >
                  {/* NUMBER */}

                  <td
                    className="
                        px-4
                        py-3.5
                        text-[12px]
                        text-[#111827]
                      "
                  >
                    {(page - 1) * limit + index + 1}
                  </td>

                  {/* VEHICLE ID */}

                  <td
                    className="
                        px-4
                        py-3.5
                        text-[12px]
                        font-medium
                        text-[#111827]
                        truncate
                      "
                    title={vehicle.vehicle_id}
                  >
                    {vehicle.vehicle_id}
                  </td>

                  {/* ZONE */}

                  <td
                    className="
                        px-4
                        py-3.5
                        text-[12px]
                        text-[#111827]
                        truncate
                      "
                    title={vehicle.zone || ""}
                  >
                    {vehicle.zone || "—"}
                  </td>

                  {/* LAST UPDATE */}

                  <td
                    className="
                        px-4
                        py-3.5
                        whitespace-nowrap
                        text-[12px]
                        text-[#111827]
                      "
                  >
                    {vehicle.created_at
                      ? new Date(vehicle.created_at).toLocaleString()
                      : "—"}
                  </td>

                  {/* TODAY'S WORK */}

                  <td
                    className="
    px-4
    py-3.5
    text-center
  "
                  >
                    <WorkedTodayBadge workedToday={vehicle.workedToday} t={t} />
                  </td>

                  {/* STATUS */}

                  <td
                    className="
                        px-4
                        py-3.5
                        text-center
                      "
                  >
                    <StatusBadge status={vehicle.status} t={t} />
                  </td>

                  {/* ACTIONS */}

                  <td
                    className="
                        px-4
                        py-3.5
                        text-center
                      "
                  >
                    <select
                      className="
                          border
                          border-gray-300
                          rounded-lg
                          px-2.5
                          py-1.5
                          text-[11px]
                          bg-white
                          focus:outline-none
                          focus:ring-2
                          focus:ring-[#6C2BFF]
                          cursor-pointer
                        "
                      defaultValue="Action"
                      onChange={(e) => {
                        const action = e.target.value;

                        if (action === "edit") {
                          setSelectedVehicle(vehicle);

                          setShowEditModal(true);
                        }

                        if (action === "delete") {
                          setSelectedVehicle(vehicle);

                          setShowDeleteModal(true);
                        }

                        e.target.value = "Action";
                      }}
                    >
                      <option value="Action">
                        {t("vehicles.telemetryDirectory.action", "Action")}
                      </option>

                      <option value="edit">
                        {t("vehicles.telemetryDirectory.update", "Update")}
                      </option>

                      <option value="delete">
                        {t("vehicles.telemetryDirectory.delete", "Delete")}
                      </option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          px-6
          lg:px-7
          py-4
          border-t
          border-[#ECECF3]
        "
      >
        {/* ================= SHOWING ================= */}

        <p
          className="
            text-[11px]
            text-[#374151]
          "
        >
          {t("vehicles.telemetryDirectory.showing", "Showing")} <b>{start}</b>{" "}
          {t("vehicles.telemetryDirectory.to", "to")} <b>{end}</b>{" "}
          {t("vehicles.telemetryDirectory.of", "of")}{" "}
          <b>{pagination.total || 0}</b>{" "}
          {t("vehicles.telemetryDirectory.vehicles", "vehicles")}
        </p>

        {/* ================= ROWS ================= */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <span
            className="
              text-[11px]
              text-[#6B7280]
              whitespace-nowrap
            "
          >
            {t("vehicles.telemetryDirectory.rowsPerPage", "Rows per page:")}
          </span>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));

              setPage(1);
            }}
            className="
              h-[36px]
              rounded-lg
              border
              border-[#E5E7EB]
              px-3
              bg-white
              text-[11px]
              focus:outline-none
              focus:ring-2
              focus:ring-[#6C2BFF]
            "
          >
            <option value={5}>5</option>

            <option value={10}>10</option>

            <option value={20}>20</option>

            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* =====================================================
          CREATE MODAL
      ===================================================== */}

      {showCreateModal && (
        <CreateVehicleModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchVehicles}
        />
      )}

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {showEditModal && (
        <EditVehicleModal
          vehicle={selectedVehicle}
          onClose={() => {
            setShowEditModal(false);
            setSelectedVehicle(null);
          }}
          onSuccess={fetchVehicles}
        />
      )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {showDeleteModal && (
        <DeleteVehicleModal
          vehicle={selectedVehicle}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedVehicle(null);
          }}
          onSuccess={() => {
            setShowDeleteModal(false);
            setSelectedVehicle(null);
            fetchVehicles();
          }}
        />
      )}
    </section>
  );
}
