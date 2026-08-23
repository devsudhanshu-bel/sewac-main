import { useEffect, useRef, useState } from "react";

import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Trash2,
  X,
  Pencil,
} from "lucide-react";

import api from "../../api/axios";

function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken")
  );
}

function formatCreatedAt(dateValue) {
  if (!dateValue) return "-";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ListOfWorkers() {
  const [workers, setWorkers] = useState([]);

  const [search, setSearch] = useState("");

  const [activeMenu, setActiveMenu] = useState(null);

  // =========================
  // ADD MODAL
  // =========================

  const [showModal, setShowModal] = useState(false);

  // =========================
  // EDIT MODAL
  // =========================

  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedWorker, setSelectedWorker] = useState(null);

  // =========================
  // STATES
  // =========================

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // =========================
  // PAGINATION
  // =========================

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  // =========================
  // ADD FORM
  // =========================

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
  });

  // =========================
  // EDIT FORM
  // =========================

  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });

  const menuRef = useRef(null);

  // =========================================================
  // AUTH HEADERS
  // =========================================================

  const getHeaders = () => {
    const token = getAuthToken();

    return {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  };

  // =========================================================
  // FETCH WORKERS
  // =========================================================

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/users?type=WORKER&page=1&limit=100",
        {
          headers: getHeaders(),
        }
      );

      const data = response.data;

      setWorkers(data?.users || []);
    } catch (err) {
      console.error("Fetch Workers Error:", err);

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to fetch workers."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchWorkers();
  }, []);

  // =========================================================
  // CLICK OUTSIDE ACTION MENU
  // =========================================================

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setActiveMenu(null);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleFormChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =========================================================
  // EDIT FORM CHANGE
  // =========================================================

  const handleEditFormChange = (field, value) => {
    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =========================================================
  // RESET ADD FORM
  // =========================================================

  const resetAddForm = () => {
    setForm({
      full_name: "",
      email: "",
      phone_number: "",
      password: "",
    });
  };

  // =========================================================
  // CLOSE ADD MODAL
  // =========================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);

    resetAddForm();

    setError("");
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditModal = (worker) => {
    setActiveMenu(null);

    setSelectedWorker(worker);

    setEditForm({
      full_name: worker.full_name || "",
      email: worker.email || "",
      phone_number: worker.phone_number || "",
    });

    setError("");

    setSuccessMessage("");

    setShowEditModal(true);
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const closeEditModal = () => {
    if (saving) return;

    setShowEditModal(false);

    setSelectedWorker(null);

    setEditForm({
      full_name: "",
      email: "",
      phone_number: "",
    });

    setError("");
  };

  // =========================================================
  // CREATE WORKER
  // =========================================================

  const handleCreateWorker = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      if (
        !form.full_name.trim() ||
        !form.email.trim() ||
        !form.phone_number.trim() ||
        !form.password
      ) {
        setError("All fields are required.");
        return;
      }

      await api.post(
        "/api/users",
        {
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          phone_number: form.phone_number.trim(),
          password: form.password,
          role: "WORKER",
        },
        {
          headers: getHeaders(),
        }
      );

      setSuccessMessage(
        "Worker created successfully."
      );

      setShowModal(false);

      resetAddForm();

      setCurrentPage(1);

      await fetchWorkers();
    } catch (err) {
      console.error("Create Worker Error:", err);

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to create worker."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // UPDATE WORKER
  // =========================================================

  const handleUpdateWorker = async () => {
    if (!selectedWorker) return;

    try {
      setSaving(true);

      setError("");

      setSuccessMessage("");

      if (!editForm.full_name.trim()) {
        setError("Worker name is required.");
        return;
      }

      if (!editForm.phone_number.trim()) {
        setError("Phone number is required.");
        return;
      }

      await api.put(
        `/api/users/${selectedWorker.id}`,
        {
          full_name: editForm.full_name.trim(),
          phone_number:
            editForm.phone_number.trim(),
        },
        {
          headers: getHeaders(),
        }
      );

      setSuccessMessage(
        "Worker updated successfully."
      );

      setShowEditModal(false);

      setSelectedWorker(null);

      setEditForm({
        full_name: "",
        email: "",
        phone_number: "",
      });

      await fetchWorkers();
    } catch (err) {
      console.error("Update Worker Error:", err);

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to update worker."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE WORKER
  // =========================================================

  const handleDeleteWorker = async (worker) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${worker.full_name}?`
    );

    if (!confirmed) {
      setActiveMenu(null);
      return;
    }

    try {
      setDeleting(true);

      setError("");

      setSuccessMessage("");

      await api.delete(
        `/api/users/${worker.id}`,
        {
          headers: getHeaders(),
        }
      );

      setSuccessMessage(
        "Worker deleted successfully."
      );

      setActiveMenu(null);

      await fetchWorkers();
    } catch (err) {
      console.error("Delete Worker Error:", err);

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to delete worker."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const normalizedSearch = search
    .trim()
    .toLowerCase();

  const filteredWorkers = workers.filter((worker) => {
    if (!normalizedSearch) return true;

    return (
      String(worker.full_name || "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      String(worker.email || "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      String(worker.phone_number || "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      String(worker.status || "")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  });

  // Reset pagination when search changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // =========================================================
  // PAGINATION CALCULATION
  // =========================================================

  const totalEntries = filteredWorkers.length;

  const totalPages =
    totalEntries === 0
      ? 1
      : Math.ceil(totalEntries / rowsPerPage);

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    totalEntries === 0
      ? 0
      : (safeCurrentPage - 1) * rowsPerPage;

  const endIndex = Math.min(
    startIndex + rowsPerPage,
    totalEntries
  );

  const paginatedWorkers = filteredWorkers.slice(
    startIndex,
    endIndex
  );

  // =========================================================
  // ROWS PER PAGE
  // =========================================================

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));

    setCurrentPage(1);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      <div
        className="
          rounded-[24px]
          border
          border-[#E8ECF5]
          bg-white
          p-8
          shadow-sm
        "
      >
        {/* ================= Header ================= */}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-bold text-[#16295A]">
              List of Workers
            </h2>

            <div className="relative w-[500px]">
              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by phone number, name or email..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-[#E4E7EC]
                  bg-white
                  pl-4
                  pr-11
                  text-[14px]
                  text-[#16295A]
                  outline-none
                  placeholder:text-[#98A2B3]
                  focus:border-violet-500
                "
              />

              <Search
                size={18}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-violet-700
                "
              />
            </div>
          </div>

          <button
            onClick={() => {
              setError("");
              setSuccessMessage("");
              resetAddForm();
              setShowModal(true);
            }}
            className="
              mt-1
              mb-3
              flex
              h-10
              items-center
              gap-2
              rounded-xl
              border
              border-violet-500
              bg-white
              px-4
              text-[14px]
              font-semibold
              text-violet-700
              transition-all
              hover:bg-violet-50
            "
          >
            <PlusCircle size={17} />

            Add Worker
          </button>
        </div>

        {/* ================= Messages ================= */}

        {error &&
          !showModal &&
          !showEditModal && (
            <div
              className="
                mb-4
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-[13px]
                font-medium
                text-red-600
              "
            >
              {error}
            </div>
          )}

        {successMessage &&
          !showModal &&
          !showEditModal && (
            <div
              className="
                mb-4
                rounded-xl
                border
                border-green-200
                bg-green-50
                px-4
                py-3
                text-[13px]
                font-medium
                text-green-600
              "
            >
              {successMessage}
            </div>
          )}

        {/* ================= Table ================= */}

        <div
          className="
            mt-7
            overflow-x-auto
            overflow-y-visible
            rounded-2xl
            border
            border-[#EEF2F7]
          "
        >
          <table className="w-full min-w-[1000px]">
            <thead className="bg-[#FAFBFE]">
              <tr>
                <th
                  className="
                    w-[80px]
                    px-4
                    py-4
                    text-left
                    text-[13px]
                    font-semibold
                    text-[#3F51B5]
                  "
                >
                  SL.No
                </th>

                <th
                  className="
                    min-w-[200px]
                    px-4
                    py-4
                    text-left
                    text-[13px]
                    font-semibold
                    text-[#3F51B5]
                  "
                >
                  Name
                </th>

                <th
                  className="
                    min-w-[250px]
                    px-4
                    py-4
                    text-left
                    text-[13px]
                    font-semibold
                    text-[#3F51B5]
                  "
                >
                  Email
                </th>

                <th
                  className="
                    min-w-[170px]
                    px-4
                    py-4
                    text-left
                    text-[13px]
                    font-semibold
                    text-[#3F51B5]
                  "
                >
                  Phone Number
                </th>

                <th
                  className="
                    min-w-[130px]
                    px-4
                    py-4
                    text-left
                    text-[13px]
                    font-semibold
                    text-[#3F51B5]
                  "
                >
                  Status
                </th>

                <th
                  className="
                    min-w-[210px]
                    px-4
                    py-4
                    text-left
                    text-[13px]
                    font-semibold
                    text-[#3F51B5]
                  "
                >
                  Created At
                </th>

                <th
                  className="
                    w-[100px]
                    px-4
                    py-4
                    text-center
                    text-[13px]
                    font-semibold
                    text-[#3F51B5]
                  "
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="
                      px-4
                      py-10
                      text-center
                      text-[14px]
                      text-[#667085]
                    "
                  >
                    Loading workers...
                  </td>
                </tr>
              ) : paginatedWorkers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="
                      px-4
                      py-10
                      text-center
                      text-[14px]
                      text-[#667085]
                    "
                  >
                    {search
                      ? "No workers found."
                      : "No workers have been created yet."}
                  </td>
                </tr>
              ) : (
                paginatedWorkers.map(
                  (worker, index) => (
                    <tr
                      key={worker.id}
                      className="
                        border-t
                        border-[#EEF2F7]
                        transition-all
                        hover:bg-[#FBFCFF]
                      "
                    >
                      {/* SL.NO */}

                      <td
                        className="
                          px-4
                          py-5
                          text-[14px]
                          font-medium
                          text-[#16295A]
                        "
                      >
                        {startIndex + index + 1}
                      </td>

                      {/* NAME */}

                      <td
                        className="
                          px-4
                          py-5
                          text-[14px]
                          text-[#16295A]
                        "
                      >
                        {worker.full_name || "-"}
                      </td>

                      {/* EMAIL */}

                      <td
                        className="
                          px-4
                          py-5
                          text-[14px]
                          text-[#16295A]
                        "
                      >
                        {worker.email || "-"}
                      </td>

                      {/* PHONE */}

                      <td
                        className="
                          px-4
                          py-5
                          text-[14px]
                          text-[#16295A]
                        "
                      >
                        {worker.phone_number || "-"}
                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-5">
                        <span
                          className={`
                            inline-flex
                            rounded-lg
                            px-3
                            py-1.5
                            text-[12px]
                            font-medium
                            ${
                              worker.status ===
                              "ACTIVE"
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-600"
                            }
                          `}
                        >
                          {worker.status ===
                          "ACTIVE"
                            ? "Active"
                            : worker.status || "-"}
                        </span>
                      </td>

                      {/* CREATED AT */}

                      <td
                        className="
                          px-4
                          py-5
                          text-[14px]
                          text-[#16295A]
                        "
                      >
                        {formatCreatedAt(
                          worker.created_at
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td className="relative px-4 py-5">
                        <div className="flex justify-center">
                          <button
                            onClick={() =>
                              setActiveMenu(
                                activeMenu ===
                                  worker.id
                                  ? null
                                  : worker.id
                              )
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-xl
                              text-violet-700
                              transition
                              hover:bg-violet-100
                            "
                          >
                            <MoreHorizontal
                              size={18}
                            />
                          </button>
                        </div>

                        {activeMenu ===
                          worker.id && (
                          <div
                            ref={menuRef}
                            className="
                              absolute
                              right-[65px]
                              top-1/2
                              z-50
                              w-[170px]
                              -translate-y-1/2
                              rounded-2xl
                              border
                              border-[#E8ECF5]
                              bg-white
                              py-2
                              shadow-2xl
                            "
                          >
                            {/* EDIT */}

                            <button
                              onClick={() =>
                                openEditModal(
                                  worker
                                )
                              }
                              className="
                                flex
                                w-full
                                items-center
                                gap-3
                                px-5
                                py-3
                                text-[14px]
                                font-medium
                                text-violet-700
                                transition
                                hover:bg-violet-50
                              "
                            >
                              <Pencil
                                size={16}
                              />

                              Edit
                            </button>

                            {/* DELETE */}

                            <button
                              disabled={deleting}
                              onClick={() =>
                                handleDeleteWorker(
                                  worker
                                )
                              }
                              className="
                                flex
                                w-full
                                items-center
                                gap-3
                                px-5
                                py-3
                                text-[14px]
                                font-medium
                                text-red-500
                                transition
                                hover:bg-red-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                            >
                              <Trash2
                                size={16}
                              />

                              {deleting
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>

          {/* ================= Footer ================= */}

          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-[#EEF2F7]
              bg-white
              px-6
              py-4
            "
          >
            <p className="text-[13px] font-medium text-[#3F51B5]">
              Showing{" "}
              {totalEntries === 0
                ? 0
                : startIndex + 1}{" "}
              to {endIndex} of{" "}
              {totalEntries} entries
            </p>

            <div className="flex items-center gap-6">
              {/* ROWS PER PAGE */}

              <div className="flex items-center gap-3">
                <span className="text-[13px] text-[#3F51B5]">
                  Rows per page:
                </span>

                <select
                  value={rowsPerPage}
                  onChange={(e) =>
                    handleRowsPerPageChange(
                      e.target.value
                    )
                  }
                  className="
                    h-10
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    bg-white
                    px-4
                    text-[14px]
                    font-medium
                    text-[#16295A]
                    outline-none
                    focus:border-violet-500
                  "
                >
                  <option value={10}>
                    10
                  </option>

                  <option value={20}>
                    20
                  </option>

                  <option value={50}>
                    50
                  </option>

                  <option value={100}>
                    100
                  </option>
                </select>
              </div>

              {/* PAGINATION */}

              <div className="flex items-center gap-2">
                <button
                  disabled={safeCurrentPage <= 1}
                  onClick={() =>
                    setCurrentPage(
                      (previous) =>
                        Math.max(
                          previous - 1,
                          1
                        )
                    )
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    bg-white
                    text-[#667085]
                    transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  ‹
                </button>

                <div
                  className="
                    flex
                    h-9
                    min-w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-violet-600
                    px-3
                    text-[13px]
                    font-semibold
                    text-white
                  "
                >
                  {totalEntries === 0
                    ? 1
                    : safeCurrentPage}
                </div>

                <button
                  disabled={
                    safeCurrentPage >=
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (previous) =>
                        Math.min(
                          previous + 1,
                          totalPages
                        )
                    )
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    bg-white
                    text-[#667085]
                    transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================
          ADD WORKER MODAL
      ======================================================= */}

      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-black/25
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              relative
              w-[500px]
              max-w-full
              rounded-[24px]
              border
              border-[#E8ECF5]
              bg-white
              p-7
              shadow-2xl
            "
          >
            {/* CLOSE */}

            <button
              onClick={closeModal}
              disabled={saving}
              className="
                absolute
                right-5
                top-5
                rounded-lg
                p-1
                text-[#667085]
                transition
                hover:bg-gray-100
                hover:text-violet-700
                disabled:opacity-50
              "
            >
              <X size={20} />
            </button>

            <h2 className="text-[26px] font-bold text-[#16295A]">
              Add Worker
            </h2>

            {/* ERROR */}

            {error && (
              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-[13px]
                  font-medium
                  text-red-600
                "
              >
                {error}
              </div>
            )}

            <div className="mt-7 space-y-5">
              {/* NAME */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-[13px]
                    font-medium
                    text-[#16295A]
                  "
                >
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) =>
                    handleFormChange(
                      "full_name",
                      e.target.value
                    )
                  }
                  placeholder="Enter full name"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-[#E4E7EC]
                    px-4
                    text-[14px]
                    outline-none
                    focus:border-violet-500
                  "
                />
              </div>

              {/* EMAIL */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-[13px]
                    font-medium
                    text-[#16295A]
                  "
                >
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    handleFormChange(
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="Enter email"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-[#E4E7EC]
                    px-4
                    text-[14px]
                    outline-none
                    focus:border-violet-500
                  "
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-[13px]
                    font-medium
                    text-[#16295A]
                  "
                >
                  Password
                </label>

                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    handleFormChange(
                      "password",
                      e.target.value
                    )
                  }
                  placeholder="Enter password"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-[#E4E7EC]
                    px-4
                    text-[14px]
                    outline-none
                    focus:border-violet-500
                  "
                />
              </div>

              {/* PHONE */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-[13px]
                    font-medium
                    text-[#16295A]
                  "
                >
                  Phone Number
                </label>

                <input
                  type="text"
                  value={form.phone_number}
                  onChange={(e) =>
                    handleFormChange(
                      "phone_number",
                      e.target.value
                    )
                  }
                  placeholder="Enter phone number"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-[#E4E7EC]
                    px-4
                    text-[14px]
                    outline-none
                    focus:border-violet-500
                  "
                />
              </div>
            </div>

            {/* BUTTONS */}

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={saving}
                className="
                  h-11
                  rounded-xl
                  border
                  border-[#E4E7EC]
                  px-6
                  text-[14px]
                  font-medium
                  text-[#16295A]
                  transition
                  hover:bg-gray-50
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                onClick={handleCreateWorker}
                disabled={saving}
                className="
                  h-11
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-purple-700
                  px-6
                  text-[14px]
                  font-semibold
                  text-white
                  transition
                  hover:opacity-95
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {saving
                  ? "Saving..."
                  : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          EDIT WORKER MODAL
      ======================================================= */}

      {showEditModal && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-black/25
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              relative
              w-[500px]
              max-w-full
              rounded-[24px]
              border
              border-[#E8ECF5]
              bg-white
              p-7
              shadow-2xl
            "
          >
            {/* CLOSE */}

            <button
              onClick={closeEditModal}
              disabled={saving}
              className="
                absolute
                right-5
                top-5
                rounded-lg
                p-1
                text-[#667085]
                transition
                hover:bg-gray-100
                hover:text-violet-700
                disabled:opacity-50
              "
            >
              <X size={20} />
            </button>

            <h2 className="text-[26px] font-bold text-[#16295A]">
              Edit Worker
            </h2>

            <p className="mt-1 text-[13px] text-[#667085]">
              Update the worker details below.
            </p>

            {/* ERROR */}

            {error && (
              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-[13px]
                  font-medium
                  text-red-600
                "
              >
                {error}
              </div>
            )}

            <div className="mt-7 space-y-5">
              {/* NAME */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-[13px]
                    font-medium
                    text-[#16295A]
                  "
                >
                  Full Name
                </label>

                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) =>
                    handleEditFormChange(
                      "full_name",
                      e.target.value
                    )
                  }
                  placeholder="Enter full name"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-[#E4E7EC]
                    px-4
                    text-[14px]
                    outline-none
                    focus:border-violet-500
                  "
                />
              </div>

              {/* EMAIL */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-[13px]
                    font-medium
                    text-[#16295A]
                  "
                >
                  Email
                </label>

                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  className="
                    h-11
                    w-full
                    cursor-not-allowed
                    rounded-xl
                    border
                    border-[#E4E7EC]
                    bg-[#F8F9FC]
                    px-4
                    text-[14px]
                    text-[#667085]
                    outline-none
                  "
                />

                <p className="mt-1.5 text-[11px] text-[#98A2B3]">
                  Email cannot be changed.
                </p>
              </div>

              {/* PHONE */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-[13px]
                    font-medium
                    text-[#16295A]
                  "
                >
                  Phone Number
                </label>

                <input
                  type="text"
                  value={editForm.phone_number}
                  onChange={(e) =>
                    handleEditFormChange(
                      "phone_number",
                      e.target.value
                    )
                  }
                  placeholder="Enter phone number"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-[#E4E7EC]
                    px-4
                    text-[14px]
                    outline-none
                    focus:border-violet-500
                  "
                />
              </div>
            </div>

            {/* BUTTONS */}

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                disabled={saving}
                className="
                  h-11
                  rounded-xl
                  border
                  border-[#E4E7EC]
                  px-6
                  text-[14px]
                  font-medium
                  text-[#16295A]
                  transition
                  hover:bg-gray-50
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateWorker}
                disabled={saving}
                className="
                  h-11
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  to-purple-700
                  px-6
                  text-[14px]
                  font-semibold
                  text-white
                  transition
                  hover:opacity-95
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {saving
                  ? "Updating..."
                  : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}