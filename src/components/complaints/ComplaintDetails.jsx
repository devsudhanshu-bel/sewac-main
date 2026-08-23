import { useEffect, useState } from "react";

import {
  Tag,
  FolderOpen,
  Phone,
  MapPin,
  Map,
  Image as ImageIcon,
  Expand,
  FileText,
  ClipboardList,
} from "lucide-react";

import { useLanguage } from "../../i18n/LanguageContext";

export default function ComplaintDetails({
  complaint,
  requestingOTP = false,
  onClose,
  onRequestVerification,
  onVerifyOTP,
  onSaveChanges,
  saving = false,
}) {
  const { t } = useLanguage();

  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);

  /* =========================================================
     SYNC FORM WITH SELECTED COMPLAINT
  ========================================================= */

  useEffect(() => {
    if (!complaint) {
      setStatus("");
      setRemarks("");
      setOtp("");
      setOtpRequested(false);
      return;
    }

    setStatus(complaint.status || "PENDING");
    setRemarks(complaint.remarks || "");
    setOtp("");

    // Preserve OTP input state if backend status is already OTP_SENT.
    setOtpRequested(complaint.status === "OTP_SENT");
  }, [complaint]);

  /* =========================================================
     CURRENT STATUS
  ========================================================= */

  const currentStatus = complaint?.status || "";

  /* =========================================================
     STATUS FLAGS
  ========================================================= */

  const isPending = currentStatus === "PENDING";

  const isReadyForVerification = currentStatus === "READY_FOR_VERIFICATION";

  const isOtpSent = currentStatus === "OTP_SENT";

  const isClosed = currentStatus === "CLOSED";

  /* =========================================================
     ADMIN STATUS OPTIONS
  ========================================================= */

  const adminStatusOptions = [
    {
      value: "PENDING",
      label: t("complaints.details.statusOptions.pending", "Pending"),
    },
    {
      value: "READY_FOR_VERIFICATION",
      label: t(
        "complaints.details.statusOptions.readyForVerification",
        "Ready for Verification",
      ),
    },
  ];

  /* =========================================================
     SAVE CHANGES
  ========================================================= */

  const handleSave = () => {
    if (!complaint?.ticket_number) {
      return;
    }

    const nextStatus = isPending ? status : currentStatus;

    onSaveChanges?.({
      status: nextStatus,
      remarks: remarks || null,
    });
  };

  /* =========================================================
     OTP INPUT
  ========================================================= */

  const handleOTPChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);

    setOtp(value);
  };

  /* =========================================================
     STATUS BADGE CLASS
  ========================================================= */

  const getStatusBadgeClass = () => {
    if (currentStatus === "CLOSED") {
      return "bg-[#E4F8EE] text-[#20A66A]";
    }

    if (currentStatus === "READY_FOR_VERIFICATION") {
      return "bg-[#E7F1FF] text-[#2878D8]";
    }

    if (currentStatus === "OTP_SENT") {
      return "bg-[#F3E8FF] text-[#7C3AED]";
    }

    return "bg-[#FFF5D9] text-[#D99100]";
  };

  /* =========================================================
     STATUS LABEL
  ========================================================= */

  const getStatusLabel = () => {
    switch (currentStatus) {
      case "PENDING":
        return t("complaints.details.statusOptions.pending", "Pending");

      case "READY_FOR_VERIFICATION":
        return t(
          "complaints.details.statusOptions.readyForVerification",
          "Ready for Verification",
        );

      case "OTP_SENT":
        return t("complaints.details.statusOptions.otpSent", "OTP Sent");

      case "CLOSED":
        return t("complaints.details.statusOptions.closed", "Closed");

      default:
        return currentStatus || "—";
    }
  };

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (!complaint) {
    return (
      <div
        className="
          flex
          h-full
          min-h-[420px]
          w-full
          flex-col
          overflow-hidden
          bg-white
        "
      >
        <div
          className="
            flex
            flex-1
            items-center
            justify-center
            px-6
            py-10
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto
                mb-3
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-[#F4ECFF]
                text-[#8B3DFF]
              "
            >
              <ClipboardList size={22} />
            </div>

            <p
              className="
                text-[12px]
                font-semibold
                text-[#16295A]
                sm:text-[13px]
              "
            >
              {t("complaints.details.empty.title", "Select a complaint")}
            </p>

            <p
              className="
                mt-1
                text-[10px]
                leading-5
                text-gray-400
                sm:text-[11px]
              "
            >
              {t(
                "complaints.details.empty.description",
                "Select a complaint from the table to view its details.",
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div
      className="
        flex
        h-full
        min-h-0
        w-full
        flex-col
        overflow-hidden
        bg-white
      "
    >
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain
          px-4
          py-4
          sm:px-5
          sm:py-4
          [scrollbar-width:thin]
        "
      >
        {/* ===================================================
            TICKET
        =================================================== */}

        <div className="mb-4">
          <p
            className="
              mb-1.5
              text-[10px]
              font-semibold
              text-gray-500
            "
          >
            {t("complaints.details.ticketNumber", "Ticket Number")}
          </p>

          <div
            className="
              flex
              min-w-0
              items-center
              justify-between
              gap-2
            "
          >
            <span
              className="
                min-w-0
                max-w-[70%]
                truncate
                rounded-lg
                bg-[#F4ECFF]
                px-2.5
                py-1
                text-[10px]
                font-semibold
                text-violet-700
                sm:text-[11px]
              "
              title={complaint.ticket_number}
            >
              {complaint.ticket_number || "—"}
            </span>

            <span
              className={`
                shrink-0
                rounded-full
                px-2.5
                py-1
                text-[9px]
                font-semibold
                sm:text-[10px]
                ${getStatusBadgeClass()}
              `}
            >
              {getStatusLabel()}
            </span>
          </div>
        </div>

        <div className="mb-4 border-b border-gray-100" />

        {/* ===================================================
            TITLE
        =================================================== */}

        <div className="mb-4 flex gap-2.5">
          <Tag size={14} className="mt-0.5 shrink-0 text-gray-500" />

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-gray-500">
              {t("complaints.details.title", "Title")}
            </p>

            <p
              className="
                mt-1
                break-words
                text-[11px]
                font-medium
                leading-5
                text-[#16295A]
                sm:text-[12px]
              "
            >
              {complaint.title || "—"}
            </p>
          </div>
        </div>

        {/* ===================================================
            CATEGORY
        =================================================== */}

        <div className="mb-4 flex gap-2.5">
          <FolderOpen size={14} className="mt-0.5 shrink-0 text-gray-500" />

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-gray-500">
              {t("complaints.details.category", "Category")}
            </p>

            <p
              className="
                mt-1
                break-words
                text-[11px]
                text-[#16295A]
                sm:text-[12px]
              "
            >
              {complaint.category || "—"}
            </p>
          </div>
        </div>

        {/* ===================================================
            PHONE
        =================================================== */}

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 gap-2.5">
            <Phone size={14} className="mt-0.5 shrink-0 text-gray-500" />

            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-gray-500">
                {t("complaints.details.citizenPhone", "Citizen (Phone)")}
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-[11px]
                  text-[#16295A]
                  sm:text-[12px]
                "
              >
                {complaint.phone_number || "—"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-violet-200
              text-violet-600
              transition
              hover:bg-violet-50
            "
            aria-label={t(
              "complaints.details.actions.callCitizen",
              "Call citizen",
            )}
          >
            <Phone size={14} />
          </button>
        </div>

        {/* ===================================================
            ADDRESS
        =================================================== */}

        <div className="mb-4 flex gap-2.5">
          <MapPin size={14} className="mt-0.5 shrink-0 text-gray-500" />

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-gray-500">
              {t("complaints.details.address", "Address")}
            </p>

            <p
              className="
                mt-1
                break-words
                text-[11px]
                leading-5
                text-[#16295A]
                sm:text-[12px]
              "
            >
              {complaint.address || "—"}
            </p>
          </div>
        </div>

        {/* ===================================================
            COORDINATES
        =================================================== */}

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 gap-2.5">
            <Map size={14} className="mt-0.5 shrink-0 text-gray-500" />

            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-gray-500">
                {t("complaints.details.coordinates", "Coordinates")}
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-[11px]
                  text-[#16295A]
                  sm:text-[12px]
                "
              >
                {complaint.latitude ?? "—"}, {complaint.longitude ?? "—"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-violet-200
              text-violet-600
              transition
              hover:bg-violet-50
            "
            aria-label={t(
              "complaints.details.actions.viewOnMap",
              "View coordinates on map",
            )}
          >
            <Map size={14} />
          </button>
        </div>

        {/* ===================================================
            IMAGE
        =================================================== */}

        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2.5">
            <ImageIcon size={14} className="shrink-0 text-gray-500" />

            <p className="text-[10px] font-semibold text-gray-500">
              {t("complaints.details.complaintImage", "Complaint Image")}
            </p>
          </div>

          <div className="relative overflow-hidden">
            {complaint.image_url ? (
              <img
                src={complaint.image_url}
                alt={
                  complaint.title ||
                  t("complaints.details.imageAlt", "Complaint")
                }
                className="
                  h-[130px]
                  w-full
                  rounded-xl
                  object-cover
                  sm:h-[145px]
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-[130px]
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-gray-100
                  bg-gray-50
                  text-[10px]
                  text-gray-400
                  sm:h-[145px]
                  sm:text-[11px]
                "
              >
                {t("complaints.details.noImage", "No complaint image")}
              </div>
            )}

            {complaint.image_url && (
              <button
                type="button"
                className="
                  absolute
                  bottom-2
                  right-2
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-white
                  text-violet-600
                  shadow-md
                  transition
                  hover:scale-105
                "
                aria-label={t(
                  "complaints.details.actions.expandImage",
                  "Expand complaint image",
                )}
              >
                <Expand size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <div className="mb-4 flex gap-2.5">
          <FileText size={14} className="mt-0.5 shrink-0 text-gray-500" />

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-gray-500">
              {t("complaints.details.description", "Description")}
            </p>

            <p
              className="
                mt-1
                break-words
                text-[11px]
                leading-5
                text-[#16295A]
                sm:text-[12px]
              "
            >
              {complaint.description ||
                t(
                  "complaints.details.noDescription",
                  "No description provided.",
                )}
            </p>
          </div>
        </div>

        {/* ===================================================
            STATUS
        =================================================== */}

        <div className="mb-4">
          <div className="mb-1.5 flex items-center gap-2.5">
            <ClipboardList size={14} className="shrink-0 text-gray-500" />

            <p className="text-[10px] font-semibold text-gray-500">
              {t("complaints.details.status", "Status")}
            </p>
          </div>

          {/* CLOSED */}

          {isClosed ? (
            <div
              className="
                flex
                min-h-9
                w-full
                items-center
                rounded-lg
                border
                border-green-200
                bg-green-50
                px-3
                py-2
                text-[10px]
                font-semibold
                text-green-700
                sm:text-[11px]
              "
            >
              {t(
                "complaints.details.closedVerified",
                "Closed — Citizen Verified",
              )}
            </div>
          ) : isOtpSent ? (
            /* OTP SENT */

            <div
              className="
                flex
                min-h-9
                w-full
                items-center
                rounded-lg
                border
                border-violet-200
                bg-violet-50
                px-3
                py-2
                text-[10px]
                font-semibold
                text-violet-700
                sm:text-[11px]
              "
            >
              {t(
                "complaints.details.verificationOtpSent",
                "Verification OTP Sent",
              )}
            </div>
          ) : (
            /* PENDING / READY */

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              disabled={!complaint || saving || !isPending || requestingOTP}
              className="
                h-9
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                px-3
                text-[10px]
                text-[#16295A]
                outline-none
                transition
                focus:border-violet-400
                focus:ring-2
                focus:ring-violet-100
                disabled:bg-gray-50
                disabled:text-gray-400
                sm:text-[11px]
              "
            >
              {adminStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ===================================================
            REMARKS
        =================================================== */}

        <div className="mb-4">
          <div className="mb-1.5 flex items-center gap-2.5">
            <FileText size={14} className="shrink-0 text-gray-500" />

            <p className="text-[10px] font-semibold text-gray-500">
              {t("complaints.details.remarks", "Remarks")}
            </p>
          </div>

          <textarea
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            disabled={
              !complaint || saving || isClosed || isOtpSent || requestingOTP
            }
            placeholder={
              complaint
                ? t(
                    "complaints.details.placeholders.addRemarks",
                    "Add remarks...",
                  )
                : t(
                    "complaints.details.placeholders.selectComplaint",
                    "Select a complaint first...",
                  )
            }
            className="
              min-h-[58px]
              w-full
              resize-none
              rounded-lg
              border
              border-gray-200
              px-3
              py-2
              text-[10px]
              leading-5
              text-[#16295A]
              outline-none
              placeholder:text-gray-400
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-100
              disabled:bg-gray-50
              disabled:text-gray-400
              sm:text-[11px]
            "
          />
        </div>

        {/* ===================================================
            SAVE / CANCEL
        =================================================== */}

        {!isClosed && !isOtpSent && (
          <div
            className="
                flex
                flex-col
                gap-2
                pt-1
                pb-2
                min-[420px]:flex-row
                min-[420px]:justify-end
              "
          >
            <button
              type="button"
              disabled={!complaint || saving || requestingOTP}
              onClick={() => {
                if (!complaint) {
                  return;
                }

                setStatus(complaint.status || "PENDING");

                setRemarks(complaint.remarks || "");
              }}
              className="
                  h-9
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-4
                  text-[10px]
                  font-semibold
                  text-gray-600
                  transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  min-[420px]:w-auto
                  sm:text-[11px]
                "
            >
              {t("complaints.details.actions.cancel", "Cancel")}
            </button>

            <button
              type="button"
              disabled={!complaint || saving || requestingOTP}
              onClick={handleSave}
              className="
                  h-9
                  w-full
                  rounded-lg
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-600
                  px-4
                  text-[10px]
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:opacity-95
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  min-[420px]:w-auto
                  sm:text-[11px]
                "
            >
              {saving
                ? t("complaints.details.actions.saving", "Saving...")
                : t("complaints.details.actions.saveChanges", "Save Changes")}
            </button>
          </div>
        )}

        {/* ===================================================
            VERIFICATION
        =================================================== */}

        <div
          className="
            mt-2
            border-t
            border-gray-100
            pt-4
          "
        >
          {/* =================================================
              READY → REQUEST OTP
          ================================================= */}

          {isReadyForVerification && (
            <button
              type="button"
              disabled={!complaint || saving || requestingOTP}
              onClick={async () => {
                try {
                  await onRequestVerification?.();
                  setOtpRequested(true);
                } catch (error) {
                  console.error("OTP request failed:", error);
                }
              }}
              className="
                flex
                h-9
                w-full
                items-center
                justify-center
                rounded-lg
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-600
                text-[10px]
                font-semibold
                text-white
                shadow-sm
                transition
                hover:opacity-95
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:text-[11px]
              "
            >
              {requestingOTP
                ? "Sending OTP..."
                : t(
                    "complaints.details.actions.requestVerification",
                    "Request Verification OTP",
                  )}
            </button>
          )}

          {/* =================================================
              OTP INPUT
          ================================================= */}

          {(isOtpSent || otpRequested) && (
            <div className="mt-1">
              <p
                className="
                  mb-1.5
                  text-[10px]
                  font-semibold
                  text-gray-500
                "
              >
                {t("complaints.details.enterOtp", "Enter Verification OTP")}
              </p>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={handleOTPChange}
                placeholder={t(
                  "complaints.details.placeholders.otp",
                  "Enter 6-digit OTP",
                )}
                className="
                  h-9
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
                  text-[11px]
                  tracking-[0.25em]
                  text-[#16295A]
                  outline-none
                  placeholder:text-gray-400
                  placeholder:tracking-normal
                  focus:border-violet-400
                  focus:ring-2
                  focus:ring-violet-100
                  sm:text-[12px]
                "
              />

              <button
                type="button"
                disabled={!complaint || otp.length !== 6}
                onClick={() => onVerifyOTP?.(otp)}
                className="
                  mt-2
                  h-9
                  w-full
                  rounded-lg
                  border
                  border-violet-200
                  bg-violet-50
                  text-[10px]
                  font-semibold
                  text-violet-700
                  transition
                  hover:bg-violet-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:text-[11px]
                "
              >
                {t(
                  "complaints.details.actions.verifyOtp",
                  "Verify OTP & Close Complaint",
                )}
              </button>
            </div>
          )}

          {/* =================================================
              CLOSED
          ================================================= */}

          {isClosed && (
            <div
              className="
                rounded-lg
                border
                border-green-100
                bg-green-50
                px-3
                py-2.5
                text-center
                text-[10px]
                font-semibold
                leading-5
                text-green-700
              "
            >
              {t(
                "complaints.details.closedMessage",
                "Complaint closed after successful citizen verification.",
              )}
            </div>
          )}
        </div>

        <div className="h-2" />
      </div>
    </div>
  );
}
