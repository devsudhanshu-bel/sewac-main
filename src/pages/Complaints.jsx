import Header from "../components/layouts/Header";
import { useEffect, useRef, useState } from "react";

import ComplaintHeader from "../components/complaints/ComplaintHeader";
import ComplaintKPIs from "../components/complaints/ComplaintKPIs";
import ComplaintFilters from "../components/complaints/ComplaintFilters";
import ComplaintTable from "../components/complaints/ComplaintTable";
import ComplaintDetails from "../components/complaints/ComplaintDetails";

import { useLanguage } from "../i18n";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* =========================================================
   API RESPONSE PARSER
========================================================= */

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
     OTP REQUEST STATE
  ======================================================= */

  const [requestingOTP, setRequestingOTP] = useState(false);

  /*
   * Tracks the current OTP expiry in the Admin UI.
   *
   * This does NOT replace backend expiry validation.
   * Backend remains the source of truth.
   */
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);

  const [otpExpired, setOtpExpired] = useState(false);

  /*
   * Hard lock against duplicate OTP requests.
   */

  const otpRequestInProgressRef = useRef(false);

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
     CHECK OTP EXPIRY
  ======================================================= */

  useEffect(() => {
    if (!otpExpiresAt) {
      setOtpExpired(false);
      return;
    }

    const expiryTime = new Date(otpExpiresAt).getTime();

    if (Number.isNaN(expiryTime)) {
      setOtpExpired(false);
      return;
    }

    const checkExpiry = () => {
      const now = Date.now();

      if (now >= expiryTime) {
        setOtpExpired(true);
      } else {
        setOtpExpired(false);
      }
    };

    checkExpiry();

    const interval = setInterval(checkExpiry, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [otpExpiresAt]);

  /* =======================================================
     SYNC OTP EXPIRY FROM SELECTED COMPLAINT
  ======================================================= */

  useEffect(() => {
    if (!selectedComplaint) {
      setOtpExpiresAt(null);
      setOtpExpired(false);
      return;
    }

    /*
     * Support both possible API naming conventions.
     */

    const expiry =
      selectedComplaint.verification_expires_at ||
      selectedComplaint.verificationExpiresAt ||
      null;

    if (expiry) {
      setOtpExpiresAt(expiry);
    } else if (selectedComplaint.status !== "OTP_SENT") {
      setOtpExpiresAt(null);
      setOtpExpired(false);
    }
  }, [selectedComplaint]);

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

      if (activeFilters.search?.trim()) {
        params.set("search", activeFilters.search.trim());
      }

      if (activeFilters.status) {
        params.set("status", activeFilters.status);
      }

      if (activeFilters.category) {
        params.set("category", activeFilters.category);
      }

      if (activeFilters.dateFrom) {
        params.set("dateFrom", activeFilters.dateFrom);
      }

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

      setComplaints(result.data?.items || []);

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

      const result = await parseApiResponse(response);

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
     SAVE COMPLAINT
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

      const result = await parseApiResponse(response);

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message ||
            t("complaints.errors.update", "Failed to update complaint."),
        );
      }

      setSelectedComplaint(result.data);

      await fetchComplaints(pagination.page, filters);

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
     REQUEST / RESEND VERIFICATION OTP
  ======================================================= */

  const requestVerification = async () => {
    if (!selectedComplaint?.ticket_number) {
      return;
    }

    /*
     * Prevent duplicate requests immediately.
     */

    if (otpRequestInProgressRef.current) {
      return;
    }

    otpRequestInProgressRef.current = true;

    setRequestingOTP(true);

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

      const ticketNumber = selectedComplaint.ticket_number;

      console.log("Requesting OTP for:", ticketNumber);

      const response = await fetch(
        `${API_BASE_URL}/api/complaints/${encodeURIComponent(
          ticketNumber,
        )}/request-verification`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 429) {
        throw new Error(
          t(
            "complaints.errors.tooManyRequests",
            "Too many OTP requests. Please wait a moment before trying again.",
          ),
        );
      }

      const result = await parseApiResponse(response);

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message ||
            t(
              "complaints.errors.verification",
              "Failed to request verification.",
            ),
        );
      }

      /*
       * The backend may return expiresAt.
       *
       * If it does, use it directly.
       * Otherwise calculate the same 5-minute
       * window used by the backend.
       */

      const responseExpiry =
        result.data?.expiresAt ||
        result.data?.verification_expires_at ||
        result.data?.verificationExpiresAt ||
        null;

      const newExpiry =
        responseExpiry || new Date(Date.now() + 5 * 60 * 1000).toISOString();

      setOtpExpiresAt(newExpiry);
      setOtpExpired(false);

      /*
       * Refresh complaint list.
       */

      await fetchComplaints(pagination.page, filters);

      await fetchKPIs();

      /*
       * Refresh selected complaint.
       */

      try {
        const detailResponse = await fetch(
          `${API_BASE_URL}/api/complaints/${encodeURIComponent(ticketNumber)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const detailResult = await parseApiResponse(detailResponse);

        if (detailResponse.ok && detailResult.success === true) {
          const refreshedComplaint = detailResult.data;

          setSelectedComplaint(refreshedComplaint);

          /*
           * If the refreshed complaint
           * contains the real expiry,
           * prefer that over our fallback.
           */

          const refreshedExpiry =
            refreshedComplaint?.verification_expires_at ||
            refreshedComplaint?.verificationExpiresAt ||
            null;

          if (refreshedExpiry) {
            setOtpExpiresAt(refreshedExpiry);
          }
        }
      } catch (detailError) {
        console.error("Refresh complaint details error:", detailError);
      }

      alert(
        otpExpired
          ? t(
              "complaints.messages.otpResent",
              "New OTP sent successfully to the citizen.",
            )
          : t(
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
    } finally {
      otpRequestInProgressRef.current = false;

      setRequestingOTP(false);
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

    /*
     * Prevent frontend submission of an
     * already-expired OTP.
     */

    if (otpExpiresAt && Date.now() >= new Date(otpExpiresAt).getTime()) {
      setOtpExpired(true);

      throw new Error(
        t(
          "complaints.errors.otpExpired",
          "This OTP has expired. Please request a new OTP.",
        ),
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

      const result = await parseApiResponse(response);

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message ||
            t("complaints.errors.verifyOtp", "Failed to verify OTP."),
        );
      }

      /*
       * Complaint is now closed.
       */

      setOtpExpiresAt(null);
      setOtpExpired(false);

      alert(t("complaints.messages.closed", "Complaint closed successfully."));

      await fetchComplaints(pagination.page, filters);

      await fetchKPIs();

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

    if (key === "search") {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      searchTimerRef.current = setTimeout(() => {
        fetchComplaints(1, nextFilters);
      }, 500);

      return;
    }

    fetchComplaints(1, nextFilters);
  };

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const resetFilters = () => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

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

    /*
     * Immediately initialize expiry
     * from the selected complaint.
     */

    const expiry =
      complaint?.verification_expires_at ||
      complaint?.verificationExpiresAt ||
      null;

    if (expiry) {
      setOtpExpiresAt(expiry);
    } else {
      setOtpExpiresAt(null);
      setOtpExpired(false);
    }
  };

  /* =======================================================
     CLOSE DETAILS
  ======================================================= */

  const closeComplaintDetails = () => {
    if (savingComplaint || requestingOTP) {
      return;
    }

    setSelectedComplaint(null);
    setOtpExpiresAt(null);
    setOtpExpired(false);
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    const initialFilters = {
      ...DEFAULT_FILTERS,
    };

    fetchComplaints(1, initialFilters);

    fetchKPIs();
  }, []);

  /* =======================================================
     CLEAN SEARCH TIMER
  ======================================================= */

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  /* =======================================================
     MOBILE SCROLL LOCK
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
      <Header variant="default" />

      <main
        className="
          flex
          min-w-0
          flex-1
          flex-col
        "
      >
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
            <ComplaintHeader />

            <div className="mt-5">
              <ComplaintKPIs kpis={kpis} />
            </div>

            <div className="mt-5">
              <ComplaintFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
              />
            </div>

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
              DESKTOP DETAILS
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
              requestingOTP={requestingOTP}
              otpExpired={otpExpired}
              otpExpiresAt={otpExpiresAt}
              onRequestVerification={requestVerification}
              onVerifyOTP={verifyOTP}
              onSaveChanges={saveComplaintChanges}
            />
          </aside>
        </div>
      </main>

      {/* =====================================================
          MOBILE DETAILS
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
          <button
            type="button"
            aria-label={t(
              "complaints.details.close",
              "Close complaint details",
            )}
            onClick={closeComplaintDetails}
            disabled={savingComplaint || requestingOTP}
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
                disabled={savingComplaint || requestingOTP}
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
                requestingOTP={requestingOTP}
                otpExpired={otpExpired}
                otpExpiresAt={otpExpiresAt}
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
