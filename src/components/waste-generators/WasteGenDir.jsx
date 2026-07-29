import {
  Search,
  Download,
  FileSpreadsheet,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useEffect, useState } from "react";
import api from "../../api/axios";
import CreateWasteGeneratorModal from "./CreateWasteGeneratorModal";
import UpdateWasteGeneratorModal from "./UpdateWasteGeneratorModal";
import DeleteWasteGeneratorModal from "./DeleteWasteGeneratorModal";

export default function WasteGenDir() {
  const [wasteGenerators, setWasteGenerators] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchWasteGenerators(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage, debouncedSearch]);

  const fetchWasteGenerators = async (
    page = currentPage,
    limit = rowsPerPage,
  ) => {
    try {
      setLoading(true);

      const res = await api.get(
        `/api/waste-generators?page=${page}&limit=${limit}&search=${debouncedSearch}`,
      );

      setWasteGenerators(res.data.data.wasteGenerators);
      if (res.data.data.wasteGenerators.length === 1) {
        setSelectedCitizen(res.data.data.wasteGenerators[0]);
      } else {
        setSelectedCitizen(null);
      }

      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const requestPermission = async () => {
    if (!selectedCitizen) {
      alert("Search for a single waste generator first.");

      return;
    }

    try {
      await api.post("/api/permissions/request", {
        requested_by_admin_id: 2,

        module: "waste-generators",

        action: "UPDATE",

        target_identifier: selectedCitizen.phoneNumber,

        reason: "Citizen requested profile update.",
      });

      alert("Permission request sent successfully.");
    } catch (err) {
      console.error(err);

      console.log(err.response);

      console.log(err.response?.data);

      alert(
        err.response?.data?.message || "Failed to send permission request.",
      );
    }
  };
  return (
    <section
      className="
        mt-5
        bg-white
        rounded-[22px]
        border
        border-[#ECECF4]
        shadow-[0_2px_10px_rgba(0,0,0,0.03)]
        overflow-hidden
      "
    >
      {/* ================= Header ================= */}

      <div className="px-6 pt-5 pb-3 flex items-start justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-[#16295A]">
            Waste Generators Directory
          </h2>

          <p className="mt-1 text-[11px] text-[#7B8190]">
            View and manage waste generators based on their waste contribution
            and activity.
          </p>
        </div>

        {/* Right Side */}

        <div className="flex items-center gap-3">
          {/* Search */}

          <div className="relative">
            <Search
              size={15}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setCurrentPage(1);
              }}
              placeholder="Search by name, phone number, Wet RFID or Dry RFID..."
              className="
        w-[300px]
        h-10
        rounded-xl
        border
        border-[#E8E8EF]
        bg-white
        pl-10
        pr-4
        text-[12px]
        outline-none
        placeholder:text-slate-400
    "
            />
          </div>

          {/* Dropdown */}

          <button
            className="
              w-[170px]
              h-10
              rounded-xl
              border
              border-[#E8E8EF]
              bg-white
              flex
              items-center
              justify-between
              px-4
              text-[12px]
              font-medium
              text-[#6D28D9]
            "
          >
            All Waste Generators
            <ChevronDown size={15} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="
    h-10
    px-5
    rounded-xl
    bg-[#6D28D9]
    text-white
    text-[12px]
    font-semibold
    hover:bg-[#5B21B6]
    transition
  "
          >
            + Add Waste Generator
          </button>
        </div>
      </div>

      {/* ================= Table ================= */}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F8FD] border-y border-[#ECECF4]">
              <th className="w-[40px] py-3 pl-4 text-left text-[11px] font-semibold text-[#3B3F53]">
                #
              </th>

              <th className="min-w-[170px] px-3 py-3 text-left text-[11px] font-semibold text-[#3B3F53]">
                Name
              </th>

              <th className="min-w-[120px] px-3 py-3 text-left text-[11px] font-semibold text-[#3B3F53]">
                Phone Number
              </th>

              <th className="min-w-[120px] px-3 py-3 text-left text-[11px] font-semibold text-[#3B3F53]">
                Wet RFID
              </th>

              <th className="min-w-[120px] px-3 py-3 text-left text-[11px] font-semibold text-[#3B3F53]">
                Dry RFID
              </th>

              <th className="min-w-[170px] px-3 py-3 text-left text-[11px] font-semibold text-[#3B3F53]">
                Ward / Area
              </th>

              <th className="min-w-[110px] px-3 py-3 text-left text-[11px] font-semibold text-[#3B3F53]">
                Zone
              </th>

              <th className="min-w-[130px] px-3 py-3 text-center text-[11px] font-semibold text-[#3B3F53]">
                Total Waste Generated
              </th>

              <th className="min-w-[120px] px-3 py-3 text-center text-[11px] font-semibold text-[#3B3F53]">
                Average Waste
              </th>

              <th className="min-w-[165px] px-3 py-3 text-center text-[11px] font-semibold text-[#3B3F53]">
                Last Collection
              </th>

              <th className="min-w-[90px] px-3 py-3 text-center text-[11px] font-semibold text-[#3B3F53]">
                Status
              </th>

              <th className="min-w-[140px] px-3 py-3 text-center text-[11px] font-semibold text-[#3B3F53]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="py-10 text-center text-gray-500">
                  Loading Waste Generators...
                </td>
              </tr>
            ) : (
              wasteGenerators.map((item, index) => (
                <tr
                  key={(pagination.page - 1) * pagination.limit + index + 1}
                  className="
                  border-b
                  border-[#F1F2F7]
                  hover:bg-[#FAFAFD]
                  transition-all
                "
                >
                  {" "}
                  {/* ================= Index ================= */}
                  <td className="pl-4 py-[11px] text-[11px] font-medium text-[#374151]">
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </td>
                  {/* ================= Name ================= */}
                  <td className="px-3 py-[11px]">
                    <span className="text-[11px] font-semibold text-[#16295A]">
                      {item.personName}
                    </span>
                  </td>
                  {/* ================= Phone ================= */}
                  <td className="px-3 py-[11px]">
                    <span className="text-[11px] font-medium text-[#4B5563]">
                      {item.phoneNumber}
                    </span>
                  </td>
                  {/* ================= Wet RFID ================= */}
                  <td className="px-3 py-[11px]">
                    <span className="text-[11px] font-medium text-[#4B5563]">
                      {item.wetRFID}
                    </span>
                  </td>
                  {/* ================= Dry RFID ================= */}
                  <td className="px-3 py-[11px]">
                    <span className="text-[11px] font-medium text-[#4B5563]">
                      {item.dryRFID}
                    </span>
                  </td>
                  {/* ================= Ward ================= */}
                  <td className="px-3 py-[11px]">
                    <span className="text-[11px] text-[#4B5563]">
                      {`${item.ward} ${item.area ?? ""}`}
                    </span>
                  </td>
                  {/* ================= Zone ================= */}
                  <td className="px-3 py-[11px]">
                    <span className="text-[11px] font-medium text-[#16295A]">
                      {"Bengaluru South Zone"}
                    </span>
                  </td>
                  {/* ================= Total Waste ================= */}
                  <td className="px-3 py-[11px] text-center">
                    <span className="text-[11px] font-semibold text-[#16295A]">
                      {"--"}
                    </span>
                  </td>
                  {/* ================= Average Waste ================= */}
                  <td className="px-3 py-[11px] text-center">
                    <span className="text-[11px] font-semibold text-[#16295A]">
                      {"--"}
                    </span>
                  </td>
                  {/* ================= Last Collection ================= */}
                  <td className="px-3 py-[11px] text-center">
                    <span className="text-[11px] text-[#4B5563] whitespace-nowrap">
                      {new Date(item.updatedAt).toLocaleString()}
                    </span>
                  </td>
                  {/* ================= Status ================= */}
                  <td className="px-3 py-[11px] text-center">
                    <span
                      className={`
                    inline-flex
                    items-center
                    justify-center
                    rounded-md
                    px-3
                    py-[4px]
                    text-[10px]
                    font-semibold

                    ${
                      item.status === "Active"
                        ? "bg-[#DCFCE7] text-[#16A34A]"
                        : "bg-[#FEE2E2] text-[#EA580C]"
                    }
                  `}
                    >
                      {"Active"}
                    </span>
                  </td>
                  <td className="px-3 py-[11px] text-center">
                    <select
                      defaultValue=""
                      className="
      w-[120px]
      h-9
      rounded-lg
      border
      border-[#D1D5DB]
      bg-white
      px-3
      text-[11px]
      outline-none
    "
                      onChange={(e) => {
                        if (e.target.value === "update") {
                          setSelectedCitizen(item);
                          setShowUpdateModal(true);
                        }

                        if (e.target.value === "delete") {
                          setSelectedCitizen(item);
                          setShowDeleteModal(true);
                        }

                        e.target.value = "";
                      }}
                    >
                      <option value="">Actions</option>
                      <option value="update">Update</option>
                      <option value="delete">Delete</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= Footer ================= */}

      <div
        className="
          flex
          items-center
          justify-between
          px-6
          py-4
          border-t
          border-[#ECECF4]
          bg-white
        "
      >
        {/* Left */}

        <div className="flex items-center gap-4">
          <span className="text-[11px] text-slate-500">Rows per page</span>

          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="
      h-8
      px-3
      rounded-lg
      border
      border-[#E5E7EB]
      bg-white
      text-[11px]
      outline-none
      cursor-pointer
    "
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <span className="text-[11px] text-slate-500">
            Showing {(currentPage - 1) * rowsPerPage + 1}–
            {Math.min(currentPage * rowsPerPage, pagination.total)} of{" "}
            {pagination.total} entries
          </span>
        </div>

        {/* Pagination */}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="
        w-8
        h-8
        rounded-lg
        border
        border-[#E5E7EB]
        disabled:opacity-40
    "
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(currentPage - 2, 0),
                Math.min(currentPage + 3, pagination.totalPages),
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`

            w-8
            h-8
            rounded-lg
            text-[11px]

            ${
              page === currentPage
                ? "bg-[#6D28D9] text-white"
                : "border border-[#E5E7EB]"
            }

        `}
                >
                  {page}
                </button>
              ))}

            <button
              disabled={currentPage === pagination.totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="
        w-8
        h-8
        rounded-lg
        border
        border-[#E5E7EB]
        disabled:opacity-40
    "
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
      <CreateWasteGeneratorModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <UpdateWasteGeneratorModal
        open={showUpdateModal}
        citizen={selectedCitizen}
        onClose={() => setShowUpdateModal(false)}
      />

      <DeleteWasteGeneratorModal
        open={showDeleteModal}
        citizen={selectedCitizen}
        onClose={() => setShowDeleteModal(false)}
      />
    </section>
  );
}
