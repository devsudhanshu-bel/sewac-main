import Header from "../components/layouts/Header";
import { useEffect, useState } from "react";

import ComplaintHeader from "../components/complaints/ComplaintHeader";
import ComplaintKPIs from "../components/complaints/ComplaintKPIs";
import ComplaintFilters from "../components/complaints/ComplaintFilters";
import ComplaintTable from "../components/complaints/ComplaintTable";
import ComplaintDetails from "../components/complaints/ComplaintDetails";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Complaints() {
  /* =========================================================
     COMPLAINT DATA
  ========================================================= */

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     KPI DATA
  ========================================================= */

  const [kpis, setKpis] = useState({
    total: 0,
    pending: 0,
    readyForVerification: 0,
    otpSent: 0,
    closed: 0,
  });

  /* =========================================================
     SELECTED COMPLAINT
  ========================================================= */

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  /* =========================================================
     SAVE STATE
  ========================================================= */

  const [savingComplaint, setSavingComplaint] = useState(false);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  /* =========================================================
     FILTERS
  ========================================================= */

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    dateFrom: "",
    dateTo: "",
  });

  /* =========================================================
     ADMIN TOKEN
  ========================================================= */

  const getAdminToken = () => {
    return sessionStorage.getItem("token");
  };

  /* =========================================================
     FETCH COMPLAINTS
  ========================================================= */

  const fetchComplaints = async (page = 1, activeFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        throw new Error("Admin authentication token not found.");
      }

      const params = new URLSearchParams();

      params.set("page", page);
      params.set("limit", 10);

      /* SEARCH */

      if (activeFilters.search?.trim()) {
        params.set("search", activeFilters.search.trim());
      }

      /* STATUS */

      if (activeFilters.status) {
        params.set("status", activeFilters.status);
      }

      /* CATEGORY */

      if (activeFilters.category) {
        params.set("category", activeFilters.category);
      }

      /* DATE FROM */

      if (activeFilters.dateFrom) {
        params.set("dateFrom", activeFilters.dateFrom);
      }

      /* DATE TO */

      if (activeFilters.dateTo) {
        params.set("dateTo", activeFilters.dateTo);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/complaints?${params.toString()}`,
        {
          method: "GET",

          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Failed to fetch complaints.");
      }

      setComplaints(result.data?.items || []);

      setPagination(
        result.data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      );
    } catch (err) {
      console.error("Fetch complaints error:", err);

      setError(err.message || "Unable to fetch complaints.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH KPIs
  ========================================================= */

  const fetchKPIs = async () => {
    try {
      const token = getAdminToken();

      if (!token) {
        throw new Error("Admin authentication token not found.");
      }

      const response = await fetch(`${API_BASE_URL}/api/complaints/kpis`, {
        method: "GET",

        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Failed to fetch complaint KPIs.");
      }

      setKpis(
        result.data || {
          total: 0,
          pending: 0,
          readyForVerification: 0,
          otpSent: 0,
          closed: 0,
        },
      );
    } catch (err) {
      console.error("Fetch complaint KPIs error:", err);
    }
  };

  /* =========================================================
     SAVE COMPLAINT
  ========================================================= */

  const saveComplaintChanges = async (updates) => {
    if (!selectedComplaint?.ticket_number) {
      return;
    }

    try {
      setSavingComplaint(true);

      const token = getAdminToken();

      if (!token) {
        throw new Error("Admin authentication token not found.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/complaints/${encodeURIComponent(
          selectedComplaint.ticket_number,
        )}`,
        {
          method: "PATCH",

          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: updates.status,
            remarks: updates.remarks,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Failed to update complaint.");
      }

      /* Update selected complaint */

      setSelectedComplaint(result.data);

      /* Refresh table */

      await fetchComplaints(pagination.page, filters);

      /* Refresh KPI cards */

      await fetchKPIs();

      alert("Complaint updated successfully.");
    } catch (err) {
      console.error("Save complaint changes error:", err);

      alert(err.message || "Unable to update complaint.");
    } finally {
      setSavingComplaint(false);
    }
  };

  /* =========================================================
     REQUEST VERIFICATION OTP
  ========================================================= */

  const requestVerification = async () => {
    if (!selectedComplaint?.ticket_number) {
      return;
    }

    try {
      const token = getAdminToken();

      if (!token) {
        throw new Error("Admin authentication token not found.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/complaints/${encodeURIComponent(
          selectedComplaint.ticket_number,
        )}/request-verification`,
        {
          method: "POST",

          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Failed to request verification.");
      }

      /*
       * IMPORTANT:
       *
       * We intentionally DO NOT store or expose
       * the OTP here.
       *
       * Backend generates it and sends/stores it
       * on the citizen side.
       *
       * Admin only knows that OTP was sent.
       */

      /* Refresh table */

      await fetchComplaints(pagination.page, filters);

      /* Refresh KPI cards */

      await fetchKPIs();

      /* Refresh selected complaint */

      try {
        const detailResponse = await fetch(
          `${API_BASE_URL}/api/complaints/${encodeURIComponent(
            selectedComplaint.ticket_number,
          )}`,
          {
            method: "GET",

            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const detailResult = await detailResponse.json();

        if (detailResponse.ok && detailResult.success === true) {
          setSelectedComplaint(detailResult.data);
        }
      } catch (detailError) {
        console.error("Refresh complaint details error:", detailError);
      }

      alert("OTP sent successfully to the citizen.");
    } catch (err) {
      console.error("Request verification error:", err);

      alert(err.message || "Unable to request verification OTP.");
    }
  };

  /* =========================================================
     VERIFY OTP
  ========================================================= */

  const verifyOTP = async (otp) => {
    if (!selectedComplaint?.ticket_number) {
      throw new Error("No complaint selected.");
    }

    if (!otp || otp.length !== 6) {
      throw new Error("Please enter a valid 6-digit OTP.");
    }

    try {
      const token = getAdminToken();

      if (!token) {
        throw new Error("Admin authentication token not found.");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/complaints/${encodeURIComponent(
          selectedComplaint.ticket_number,
        )}/verify`,
        {
          method: "POST",

          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            otp,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Failed to verify OTP.");
      }

      alert("Complaint closed successfully.");

      /* Refresh table */

      await fetchComplaints(pagination.page, filters);

      /* Refresh KPI cards */

      await fetchKPIs();

      /* Close details */

      setSelectedComplaint(null);

      return result;
    } catch (err) {
      console.error("Verify OTP error:", err);

      alert(err.message || "Unable to verify OTP.");

      throw err;
    }
  };

  /* =========================================================
     FILTER CHANGE
  ========================================================= */

  const handleFilterChange = (key, value) => {
    const nextFilters = {
      ...filters,
      [key]: value,
    };

    setFilters(nextFilters);

    fetchComplaints(1, nextFilters);
  };

  /* =========================================================
     RESET FILTERS
  ========================================================= */

  const resetFilters = () => {
    const nextFilters = {
      search: "",
      status: "",
      category: "",
      dateFrom: "",
      dateTo: "",
    };

    setFilters(nextFilters);

    fetchComplaints(1, nextFilters);
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchComplaints(1, {
      search: "",
      status: "",
      category: "",
      dateFrom: "",
      dateTo: "",
    });

    fetchKPIs();
  }, []);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="flex flex-col h-full bg-[#F8F9FC]">
      <Header variant="default" />

      <div className="flex gap-6 px-8 py-6">
        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <div className="flex-1 min-w-0 space-y-5">
          <ComplaintHeader />

          {/* KPIs */}

          <ComplaintKPIs kpis={kpis} />

          {/* FILTERS */}

          <ComplaintFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />

          {/* TABLE */}

          <ComplaintTable
            complaints={complaints}
            loading={loading}
            error={error}
            pagination={pagination}
            onPageChange={(page) => fetchComplaints(page, filters)}
            onSelectComplaint={(complaint) => {
              setSelectedComplaint(complaint);
            }}
          />
        </div>

        {/* ===================================================
            DETAILS
        =================================================== */}

        <div className="w-[370px] shrink-0">
          <ComplaintDetails
            complaint={selectedComplaint}
            saving={savingComplaint}
            onRequestVerification={requestVerification}
            onVerifyOTP={verifyOTP}
            onSaveChanges={saveComplaintChanges}
          />
        </div>
      </div>
    </div>
  );
}
