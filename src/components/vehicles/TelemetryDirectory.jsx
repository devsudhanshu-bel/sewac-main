import {
  RadioTower,
  Search,
  ChevronDown,
  MoreHorizontal,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import CreateVehicleModal from "./CreateVehicleModal";
import EditVehicleModal from "./EditVehicleModal";
import DeleteVehicleModal from "./DeleteVehicleModal";
/* ===========================================================
   STATUS BADGE
=========================================================== */
function StatusBadge({ status }) {
  const active = status === "ACTIVE";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-[12px] font-semibold ${
        active ? "bg-[#E8FBF2] text-[#16A34A]" : "bg-[#FFF0E8] text-[#F97316]"
      }`}
    >
      {status}
    </span>
  );
}

/* ===========================================================
   COMPONENT
=========================================================== */

export default function TelemetryDirectory() {
  const [telemetry, setTelemetry] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [pagination, setPagination] = useState({});
  const start = telemetry.length ? (page - 1) * limit + 1 : 0;
  const end = (page - 1) * limit + telemetry.length;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
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

      setTelemetry(res.data.data.vehicles);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchVehicles();
  }, [page, limit, search, status]);

  return (
    <section className="bg-white rounded-[30px] border border-[#ECECF3] shadow-sm overflow-hidden">
      {/* ===========================================================
          HEADER
      =========================================================== */}

      <div className="flex items-center justify-between px-8 py-5 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-4">
          <RadioTower size={22} className="text-[#6C2BFF]" />

          <h2 className="text-[18px] font-semibold uppercase tracking-wide text-[#111827]">
            Telemetry Directory
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              type="text"
              placeholder="Search by Vehicle ID or Vehicle No...."
              className="w-[560px] h-[48px] rounded-xl border border-[#E5E7EB] pl-14 pr-5 outline-none text-[14px] placeholder:text-[#94A3B8] focus:border-[#6C2BFF]"
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-[48px] w-[190px] rounded-xl border border-[#E5E7EB] px-4"
          >
            <option value="ALL">All Status</option>

            <option value="ACTIVE">Active</option>

            <option value="INACTIVE">Inactive</option>
          </select>

          <button className="w-[48px] h-[48px] rounded-xl border border-[#E5E7EB] flex items-center justify-center hover:border-[#16A34A]">
            <FileSpreadsheet size={20} className="text-[#16A34A]" />
          </button>

          <button className="w-[48px] h-[48px] rounded-xl border border-[#E5E7EB] flex items-center justify-center">
            <Download size={20} />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="h-[48px] px-6 rounded-xl bg-[#6C2BFF] text-white font-semibold"
          >
            Create Vehicle
          </button>
        </div>
      </div>

      {/* ===========================================================
          TABLE
      =========================================================== */}

      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          {/* Continue Part 2 */}
          <thead className="bg-[#F8F8FC]">
            <tr>
              <th className="w-[40px] px-4 py-4">#</th>
              <th className="w-[70px] px-4 py-4">Vehicle ID</th>
              <th className="w-[100px] px-4 py-4">Vehicle No.</th>
              <th className="w-[120px] px-4 py-4">Route / Zone</th>
              <th className="w-[120px] px-4 py-4">Last Update</th>
              <th className="w-[120px] px-4 py-4 text-center">Status</th>
              <th className="w-[140px] px-4 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {telemetry.map((vehicle, index) => (
              <tr
                key={vehicle.vehicle_id}
                className="border-b border-[#ECECF3] hover:bg-[#FAFAFF]"
              >
                <td className="w-[60px] px-4 py-4">
                  {(page - 1) * limit + index + 1}
                </td>

                <td className="w-[140px] px-4 py-4">{vehicle.vehicle_id}</td>

                <td className="w-[180px] px-4 py-4">
                  {vehicle.vehicle_number}
                </td>

                <td className="w-[180px] px-4 py-4">{vehicle.zone}</td>

                <td className="w-[220px] px-4 py-4 whitespace-nowrap">
                  {new Date(vehicle.created_at).toLocaleString()}
                </td>

                <td className="w-[120px] px-4 py-4 text-center">
                  <StatusBadge status={vehicle.status} />
                </td>

                <td className="w-[140px] px-4 py-4 text-center">
                  <select
                    className="border rounded-lg px-2 py-1 text-sm"
                    defaultValue="Action"
                    onChange={async (e) => {
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
                    <option value="Action">Action</option>
                    <option value="edit">Update</option>
                    <option value="delete">Delete</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===========================================================
          FOOTER
      =========================================================== */}

      {/* Continue Part 3 */}
      <div className="flex items-center justify-between px-8 py-5 border-t border-[#ECECF3]">
        {/* Left */}
        <p>
          Showing <b>{start}</b> to <b>{end}</b> of{" "}
          <b>{pagination.total || 0}</b> vehicles
        </p>
        {/* Rows Per Page */}
        <div className="flex items-center gap-4">
          <span className="text-[14px] text-[#6B7280]">Rows per page:</span>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="h-[40px] rounded-xl border border-[#E5E7EB] px-3"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      {showCreateModal && (
        <CreateVehicleModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchVehicles}
        />
      )}

      {showEditModal && (
        <EditVehicleModal
          vehicle={selectedVehicle}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchVehicles}
        />
      )}
      {showDeleteModal && (
        <DeleteVehicleModal
          vehicle={selectedVehicle}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={() => {
            setShowDeleteModal(false);
            fetchVehicles();
          }}
        />
      )}
    </section>
  );
}
