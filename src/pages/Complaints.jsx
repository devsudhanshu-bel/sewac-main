import Header from "../components/layouts/Header";
import { useEffect, useRef, useState } from "react";

import ComplaintHeader from "../components/complaints/ComplaintHeader";
import ComplaintKPIs from "../components/complaints/ComplaintKPIs";
import ComplaintFilters from "../components/complaints/ComplaintFilters";
import ComplaintTable from "../components/complaints/ComplaintTable";
import ComplaintDetails from "../components/complaints/ComplaintDetails";

import { useLanguage } from "../i18n";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const parseApiResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();

  return {
    success: response.ok,
    message: text || `Request failed with status ${response.status}`,
  };
};

/* =========================================================
   DEFAULT FILTERS
========================================================= */

const DEFAULT_FILTERS = {
  search: "",
  status: "",
  category: "",
  dateFrom: "",
  dateTo: "",
};

/* =========================================================
   DEFAULT PAGINATION
========================================================= */

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

/* =========================================================
   DEFAULT KPIs
========================================================= */

const DEFAULT_KPIS = {
  total: 0,
  pending: 0,
  readyForVerification: 0,
  otpSent: 0,
  closed: 0,
};

/* =========================================================
   COMPLAINTS PAGE
========================================================= */

export default function Complaints() {
  /* =======================================================
     LANGUAGE
  ======================================================= */

  const { t } = useLanguage();

  /* =======================================================
     COMPLAINT DATA
  ======================================================= */

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     KPI DATA
  ======================================================= */

  const [kpis, setKpis] = useState(DEFAULT_KPIS);

  /* =======================================================
     SELECTED COMPLAINT
  ======================================================= */

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  /* =======================================================
     SAVE STATE
  ======================================================= */

  const [savingComplaint, setSavingComplaint] = useState(false);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  /* =======================================================
     FILTERS
  ======================================================= */

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const searchTimerRef = useRef(null);

  /* =======================================================
     ADMIN TOKEN
  ======================================================= */

  const getAdminToken = () => {
    return sessionStorage.getItem("token");
  };

  /* =======================================================
     FETCH COMPLAINTS
  ======================================================= */

  const fetchComplaints = async (page = 1, activeFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) {
        throw new Error(
          t(
            "complaints.errors.authToken",
            "Admin authentication token not found.",
          ),
        );
      }

      const params = new URLSearchParams();

      params.set("page", page);
      params.set("limit", 10);

      /* ===================================================
         SEARCH
      =================================================== */

      if (activeFilters.search?.trim()) {
        params.set("search", activeFilters.search.trim());
      }

      /* ===================================================
         STATUS
      =================================================== */

      if (activeFilters.status) {
        params.set("status", activeFilters.status);
      }

      /* ===================================================
         CATEGORY
      =================================================== */

      if (activeFilters.category) {
        params.set("category", activeFilters.category);
      }

      /* ===================================================
         DATE FROM
      =================================================== */

      if (activeFilters.dateFrom) {
        params.set("dateFrom", activeFilters.dateFrom);
      }

      /* ===================================================
         DATE TO
      =================================================== */

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

      const result = await parseApiResponse(response);

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message ||
            t("complaints.errors.fetch", "Failed to fetch complaints."),
        );
      }

      /* ===================================================
         UPDATE COMPLAINTS
      =================================================== */

      setComplaints(result.data?.items || []);

      /* ===================================================
         UPDATE PAGINATION
      =================================================== */

      setPagination(result.data?.pagination || DEFAULT_PAGINATION);
    } catch (err) {
      console.error("Fetch complaints error:", err);

      setError(
        err?.message ||
          t("complaints.errors.fetchUnable", "Unable to fetch complaints."),
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     FETCH KPIs
  ======================================================= */

  const fetchKPIs = async () => {
    try {
      const token = getAdminToken();

      if (!token) {
        throw new Error(
          t(
            "complaints.errors.authToken",
            "Admin authentication token not found.",
          ),
        );
      }

      const response = await fetch(`${API_BASE_URL}/api/complaints/kpis`, {
        method: "GET",

        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await parseApiResponse.json(response);

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message ||
            t("complaints.errors.fetchKpis", "Failed to fetch complaint KPIs."),
        );
      }

      setKpis(result.data || DEFAULT_KPIS);
    } catch (err) {
      console.error("Fetch complaint KPIs error:", err);
    }
  };

  /* =======================================================
     SAVE COMPLAINT CHANGES
  ======================================================= */

  const saveComplaintChanges = async (updates) => {
    if (!selectedComplaint?.ticket_number) {
      return;
    }

    try {
      setSavingComplaint(true);

      const token = getAdminToken();

      if (!token) {
        throw new Error(
          t(
            "complaints.errors.authToken",
            "Admin authentication token not found.",
          ),
        );
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

      const result = await parseApiResponse.json(response);

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message ||
            t("complaints.errors.update", "Failed to update complaint."),
        );
      }

      /* =================================================
         UPDATE SELECTED COMPLAINT
      ================================================= */

      setSelectedComplaint(result.data);

      /* =================================================
         REFRESH TABLE
      ================================================= */

      await fetchComplaints(pagination.page, filters);

      /* =================================================
         REFRESH KPIs
      ================================================= */

      await fetchKPIs();

      alert(
        t("complaints.messages.updated", "Complaint updated successfully."),
      );
    } catch (err) {
      console.error("Save complaint changes error:", err);

      alert(
        err?.message ||
          t("complaints.errors.updateUnable", "Unable to update complaint."),
      );
    } finally {
      setSavingComplaint(false);
    }
  };

  /* =======================================================
     REQUEST VERIFICATION OTP
  ======================================================= */

  const requestVerification = async () => {
    if (!selectedComplaint?.ticket_number) {
      return;
    }

    try {
      const token = getAdminToken();

      if (!token) {
        throw new Error(
          t(
            "complaints.errors.authToken",
            "Admin authentication token not found.",
          ),
        );
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
        throw new Error(
          result.message ||
            t(
              "complaints.errors.verification",
              "Failed to request verification.",
            ),
        );
      }

      /* =================================================
           REFRESH TABLE
        ================================================= */

      await fetchComplaints(pagination.page, filters);

      /* =================================================
           REFRESH KPIs
        ================================================= */

      await fetchKPIs();

      /* =================================================
           REFRESH SELECTED COMPLAINT
        ================================================= */

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

        const detailResult = await parseApiResponse.json(detailResponse);

        if (detailResponse.ok && detailResult.success === true) {
          setSelectedComplaint(detailResult.data);
        }
      } catch (detailError) {
        console.error("Refresh complaint details error:", detailError);
      }

      alert(
        t(
          "complaints.messages.otpSent",
          "OTP sent successfully to the citizen.",
        ),
      );
    } catch (err) {
      console.error("Request verification error:", err);

      alert(
        err?.message ||
          t(
            "complaints.errors.verificationUnable",
            "Unable to request verification OTP.",
          ),
      );
    }
  };

  /* =======================================================
     VERIFY OTP
  ======================================================= */

  const verifyOTP = async (otp) => {
    if (!selectedComplaint?.ticket_number) {
      throw new Error(
        t("complaints.errors.noComplaint", "No complaint selected."),
      );
    }

    if (!otp || otp.length !== 6) {
      throw new Error(
        t("complaints.errors.invalidOtp", "Please enter a valid 6-digit OTP."),
      );
    }

    try {
      const token = getAdminToken();

      if (!token) {
        throw new Error(
          t(
            "complaints.errors.authToken",
            "Admin authentication token not found.",
          ),
        );
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

      const result = await parseApiResponse.json(response);

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message ||
            t("complaints.errors.verifyOtp", "Failed to verify OTP."),
        );
      }

      alert(t("complaints.messages.closed", "Complaint closed successfully."));

      /* =================================================
         REFRESH TABLE
      ================================================= */

      await fetchComplaints(pagination.page, filters);

      /* =================================================
         REFRESH KPIs
      ================================================= */

      await fetchKPIs();

      /* =================================================
         CLOSE DETAILS
      ================================================= */

      setSelectedComplaint(null);

      return result;
    } catch (err) {
      console.error("Verify OTP error:", err);

      alert(
        err?.message ||
          t("complaints.errors.verifyOtpUnable", "Unable to verify OTP."),
      );

      throw err;
    }
  };

  /* =======================================================
     FILTER CHANGE
  ======================================================= */

  const handleFilterChange = (key, value) => {
    const nextFilters = {
      ...filters,
      [key]: value,
    };

    setFilters(nextFilters);

    // Search input: wait until the user stops typing
    if (key === "search") {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      searchTimerRef.current = setTimeout(() => {
        fetchComplaints(1, nextFilters);
      }, 500);

      return;
    }

    // Dropdown/date filters can fetch immediately
    fetchComplaints(1, nextFilters);
  };

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const resetFilters = () => {
    const nextFilters = {
      ...DEFAULT_FILTERS,
    };

    setFilters(nextFilters);

    fetchComplaints(1, nextFilters);
  };

  /* =======================================================
     SELECT COMPLAINT
  ======================================================= */

  const handleSelectComplaint = (complaint) => {
    setSelectedComplaint(complaint);
  };

  /* =======================================================
     CLOSE COMPLAINT DETAILS
  ======================================================= */

  const closeComplaintDetails = () => {
    if (savingComplaint) {
      return;
    }

    setSelectedComplaint(null);
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const initialFilters = {
      ...DEFAULT_FILTERS,
    };

    fetchComplaints(1, initialFilters);

    fetchKPIs();
  }, []);

  /* =======================================================
     LOCK BACKGROUND SCROLL ON MOBILE DETAILS
  ======================================================= */

  useEffect(() => {
    if (!selectedComplaint) {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    if (mediaQuery.matches) {
      const previousOverflow = document.body.style.overflow;

      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [selectedComplaint]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        flex
        min-h-screen
        w-full
        min-w-0
        flex-col
        overflow-x-hidden
        bg-[#F8F9FC]
      "
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <Header variant="default" />

      {/* ===================================================
          PAGE BODY
      =================================================== */}

      <main
        className="
          flex
          min-w-0
          flex-1
          flex-col
        "
      >
        {/* =================================================
            RESPONSIVE CONTENT WRAPPER
        ================================================= */}

        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
            gap-5
            px-4
            py-5

            sm:px-5
            sm:py-6

            lg:flex-row
            lg:gap-6
            lg:px-8
            lg:py-6
          "
        >
          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <section
            className="
              min-w-0
              flex-1
            "
          >
            {/* ===============================================
                PAGE HEADER
            =============================================== */}

            <ComplaintHeader />

            {/* ===============================================
                KPI CARDS
            =============================================== */}

            <div className="mt-5">
              <ComplaintKPIs kpis={kpis} />
            </div>

            {/* ===============================================
                FILTERS
            =============================================== */}

            <div className="mt-5">
              <ComplaintFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
              />
            </div>

            {/* ===============================================
                COMPLAINT TABLE
            =============================================== */}

            <div className="mt-5 min-w-0">
              <ComplaintTable
                complaints={complaints}
                loading={loading}
                error={error}
                pagination={pagination}
                onPageChange={(page) => fetchComplaints(page, filters)}
                onSelectComplaint={handleSelectComplaint}
              />
            </div>
          </section>

          {/* =================================================
              DESKTOP COMPLAINT DETAILS
          ================================================= */}

          <aside
            className="
              hidden
              w-[370px]
              shrink-0
              lg:block
            "
          >
            <ComplaintDetails
              complaint={selectedComplaint}
              saving={savingComplaint}
              onRequestVerification={requestVerification}
              onVerifyOTP={verifyOTP}
              onSaveChanges={saveComplaintChanges}
            />
          </aside>
        </div>
      </main>

      {/* =====================================================
          MOBILE COMPLAINT DETAILS DRAWER
      ===================================================== */}

      {selectedComplaint && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            lg:hidden
          "
        >
          {/* ===============================================
              BACKDROP
          =============================================== */}

          <button
            type="button"
            aria-label={t(
              "complaints.details.close",
              "Close complaint details",
            )}
            onClick={closeComplaintDetails}
            disabled={savingComplaint}
            className="
              absolute
              inset-0
              h-full
              w-full
              cursor-default
              bg-black/35
              backdrop-blur-[2px]
            "
          />

          {/* ===============================================
              MOBILE DRAWER
          =============================================== */}

          <aside
            className="
              absolute
              right-0
              top-0
              flex
              h-full
              w-full
              max-w-[430px]
              flex-col
              overflow-hidden
              bg-white
              shadow-2xl

              sm:max-w-[460px]
            "
          >
            {/* =============================================
                MOBILE DRAWER HEADER
            ============================================= */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-gray-100
                bg-white
                px-4
                py-3
                sm:px-5
              "
            >
              <div className="min-w-0">
                <p
                  className="
                    truncate
                    text-[16px]
                    font-semibold
                    text-[#16295A]
                  "
                >
                  {t("complaints.details.title", "Complaint Details")}
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[11px]
                    text-gray-400
                  "
                >
                  {selectedComplaint.ticket_number}
                </p>
              </div>

              <button
                type="button"
                aria-label={t("complaints.details.close", "Close")}
                onClick={closeComplaintDetails}
                disabled={savingComplaint}
                className="
                  ml-3
                  shrink-0
                  rounded-lg
                  p-2
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-gray-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />

                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* =============================================
                MOBILE DETAILS CONTENT
            ============================================= */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                overflow-x-hidden
                bg-white
              "
            >
              <ComplaintDetails
                complaint={selectedComplaint}
                saving={savingComplaint}
                onRequestVerification={requestVerification}
                onVerifyOTP={verifyOTP}
                onSaveChanges={saveComplaintChanges}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
