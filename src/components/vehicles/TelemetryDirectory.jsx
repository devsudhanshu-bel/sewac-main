import {
  RadioTower,
  Search,
  Download,
} from "lucide-react";

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
      className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-[12px] font-semibold ${
        active
          ? "bg-[#E8FBF2] text-[#16A34A]"
          : "bg-[#FFF0E8] text-[#F97316]"
      }`}
    >
      {active
        ? t(
            "vehicles.telemetryDirectory.active",
            "ACTIVE"
          )
        : t(
            "vehicles.telemetryDirectory.inactive",
            "INACTIVE"
          )}
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

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedVehicle, setSelectedVehicle] =
    useState(null);

  const start = telemetry.length
    ? (page - 1) * limit + 1
    : 0;

  const end =
    (page - 1) * limit + telemetry.length;

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

      setTelemetry(
        res.data.data.vehicles
      );

      setPagination(
        res.data.data.pagination
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [page, limit, search, status]);

  /* ===========================================================
     DOWNLOAD CSV
  =========================================================== */

  const downloadCSV = () => {
    const headers = [
      t(
        "vehicles.telemetryDirectory.csv.vehicleId",
        "Vehicle ID"
      ),
      t(
        "vehicles.telemetryDirectory.csv.vehicleNumber",
        "Vehicle Number"
      ),
      t(
        "vehicles.telemetryDirectory.csv.vehicleType",
        "Vehicle Type"
      ),
      t(
        "vehicles.telemetryDirectory.csv.city",
        "City"
      ),
      t(
        "vehicles.telemetryDirectory.csv.zone",
        "Zone"
      ),
      t(
        "vehicles.telemetryDirectory.csv.division",
        "Division"
      ),
      t(
        "vehicles.telemetryDirectory.csv.ward",
        "Ward"
      ),
      t(
        "vehicles.telemetryDirectory.csv.status",
        "Status"
      ),
    ];

    const rows = telemetry.map((v) => [
      v.vehicle_id,
      v.vehicle_type,
      v.city,
      v.zone,
      v.division,
      v.ward,
      v.status,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.join(","))
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

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
    <section className="bg-white rounded-[30px] border border-[#ECECF3] shadow-sm overflow-hidden">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between px-8 py-5 border-b border-[#F3F4F6]">

        {/* LEFT */}

        <div className="flex items-center gap-4">

          <RadioTower
            size={22}
            className="text-[#6C2BFF]"
          />

          <h2 className="text-[18px] font-semibold uppercase tracking-wide text-[#111827]">
            {t(
              "vehicles.telemetryDirectory.title",
              "Telemetry Directory"
            )}
          </h2>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">

          {/* SEARCH */}

          <div className="relative w-[420px]">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
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
                "Search by Vehicle ID"
              )}
              className="
                w-full
                h-12
                pl-12
                pr-4
                border
                border-gray-300
                rounded-xl
                bg-white
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#6C2BFF]
                focus:border-[#6C2BFF]
                transition
              "
            />

          </div>

          {/* STATUS FILTER */}

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="
              h-12
              w-[180px]
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-[#6C2BFF]
            "
          >

            <option value="ALL">
              {t(
                "vehicles.telemetryDirectory.allStatus",
                "All Status"
              )}
            </option>

            <option value="ACTIVE">
              {t(
                "vehicles.telemetryDirectory.active",
                "Active"
              )}
            </option>

            <option value="INACTIVE">
              {t(
                "vehicles.telemetryDirectory.inactive",
                "Inactive"
              )}
            </option>

          </select>

          {/* DOWNLOAD */}

          <button
            type="button"
            onClick={downloadCSV}
            title={t(
              "vehicles.telemetryDirectory.download",
              "Download"
            )}
            className="
              w-12
              h-12
              rounded-xl
              border
              border-gray-300
              flex
              items-center
              justify-center
              hover:bg-gray-50
              transition
            "
          >

            <Download size={20} />

          </button>

          {/* CREATE */}

          <button
            type="button"
            onClick={() =>
              setShowCreateModal(true)
            }
            className="
              h-[48px]
              px-6
              rounded-xl
              bg-[#6C2BFF]
              text-white
              font-semibold
              hover:bg-[#5B21E6]
              transition
            "
          >
            {t(
              "vehicles.telemetryDirectory.createVehicle",
              "Create Vehicle"
            )}
          </button>

        </div>

      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-x-auto">

        <table className="w-full table-fixed">

          {/* =================================================
              TABLE HEADER
          ================================================= */}

          <thead className="bg-[#F8F8FC]">

            <tr>

              <th className="w-[40px] px-4 py-4">
                #
              </th>

              <th className="w-[70px] px-4 py-4">
                {t(
                  "vehicles.telemetryDirectory.vehicleId",
                  "Vehicle ID"
                )}
              </th>

              <th className="w-[120px] px-4 py-4">
                {t(
                  "vehicles.telemetryDirectory.routeZone",
                  "Route / Zone"
                )}
              </th>

              <th className="w-[120px] px-4 py-4">
                {t(
                  "vehicles.telemetryDirectory.lastUpdate",
                  "Last Update"
                )}
              </th>

              <th className="w-[120px] px-4 py-4 text-center">
                {t(
                  "vehicles.telemetryDirectory.status",
                  "Status"
                )}
              </th>

              <th className="w-[140px] px-4 py-4 text-center">
                {t(
                  "vehicles.telemetryDirectory.actions",
                  "Actions"
                )}
              </th>

            </tr>

          </thead>

          {/* =================================================
              TABLE BODY
          ================================================= */}

          <tbody>

            {telemetry.map(
              (vehicle, index) => (
                <tr
                  key={vehicle.vehicle_id}
                  className="
                    border-b
                    border-[#ECECF3]
                    hover:bg-[#FAFAFF]
                  "
                >

                  {/* INDEX */}

                  <td className="w-[60px] px-4 py-4">
                    {(page - 1) *
                      limit +
                      index +
                      1}
                  </td>

                  {/* VEHICLE ID */}

                  <td className="w-[140px] px-4 py-4">
                    {vehicle.vehicle_id}
                  </td>

                  {/* ZONE */}

                  <td className="w-[180px] px-4 py-4">
                    {vehicle.zone}
                  </td>

                  {/* LAST UPDATE */}

                  <td className="w-[220px] px-4 py-4 whitespace-nowrap">

                    {new Date(
                      vehicle.created_at
                    ).toLocaleString()}

                  </td>

                  {/* STATUS */}

                  <td className="w-[120px] px-4 py-4 text-center">

                    <StatusBadge
                      status={vehicle.status}
                      t={t}
                    />

                  </td>

                  {/* ACTIONS */}

                  <td className="w-[140px] px-4 py-4 text-center">

                    <select
                      className="
                        border
                        rounded-lg
                        px-2
                        py-1
                        text-sm
                      "
                      defaultValue="Action"
                      onChange={async (e) => {

                        const action =
                          e.target.value;

                        if (
                          action ===
                          "edit"
                        ) {
                          setSelectedVehicle(
                            vehicle
                          );

                          setShowEditModal(
                            true
                          );
                        }

                        if (
                          action ===
                          "delete"
                        ) {
                          setSelectedVehicle(
                            vehicle
                          );

                          setShowDeleteModal(
                            true
                          );
                        }

                        e.target.value =
                          "Action";
                      }}
                    >

                      <option value="Action">
                        {t(
                          "vehicles.telemetryDirectory.action",
                          "Action"
                        )}
                      </option>

                      <option value="edit">
                        {t(
                          "vehicles.telemetryDirectory.update",
                          "Update"
                        )}
                      </option>

                      <option value="delete">
                        {t(
                          "vehicles.telemetryDirectory.delete",
                          "Delete"
                        )}
                      </option>

                    </select>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="flex items-center justify-between px-8 py-5 border-t border-[#ECECF3]">

        {/* SHOWING */}

        <p className="text-[14px] text-[#374151]">

          {t(
            "vehicles.telemetryDirectory.showing",
            "Showing"
          )}{" "}

          <b>{start}</b>{" "}

          {t(
            "vehicles.telemetryDirectory.to",
            "to"
          )}{" "}

          <b>{end}</b>{" "}

          {t(
            "vehicles.telemetryDirectory.of",
            "of"
          )}{" "}

          <b>
            {pagination.total || 0}
          </b>{" "}

          {t(
            "vehicles.telemetryDirectory.vehicles",
            "vehicles"
          )}

        </p>

        {/* ROWS PER PAGE */}

        <div className="flex items-center gap-4">

          <span className="text-[14px] text-[#6B7280]">
            {t(
              "vehicles.telemetryDirectory.rowsPerPage",
              "Rows per page:"
            )}
          </span>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(
                Number(e.target.value)
              );
              setPage(1);
            }}
            className="
              h-[40px]
              rounded-xl
              border
              border-[#E5E7EB]
              px-3
            "
          >

            <option value={5}>
              5
            </option>

            <option value={10}>
              10
            </option>

            <option value={20}>
              20
            </option>

            <option value={100}>
              100
            </option>

          </select>

        </div>

      </div>

      {/* =====================================================
          CREATE VEHICLE MODAL
      ===================================================== */}

      {showCreateModal && (
        <CreateVehicleModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onSuccess={fetchVehicles}
        />
      )}

      {/* =====================================================
          EDIT VEHICLE MODAL
      ===================================================== */}

      {showEditModal && (
        <EditVehicleModal
          vehicle={selectedVehicle}
          onClose={() =>
            setShowEditModal(false)
          }
          onSuccess={fetchVehicles}
        />
      )}

      {/* =====================================================
          DELETE VEHICLE MODAL
      ===================================================== */}

      {showDeleteModal && (
        <DeleteVehicleModal
          vehicle={selectedVehicle}
          onClose={() =>
            setShowDeleteModal(false)
          }
          onSuccess={() => {
            setShowDeleteModal(false);
            fetchVehicles();
          }}
        />
      )}

    </section>
  );
}