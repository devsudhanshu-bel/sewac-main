import { useEffect, useState } from "react";

import {
  X,
  Tag,
  FolderOpen,
  Phone,
  MapPin,
  Map,
  Image as ImageIcon,
  Expand,
  FileText,
  UserRound,
  ClipboardList,
} from "lucide-react";

export default function ComplaintDetails({
  complaint,
  otpSent,
  onRequestVerification,
  onVerifyOTP,
  onSaveChanges,
  saving = false,
}) {
  const [otp, setOtp] = useState("");

  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [remarks, setRemarks] = useState("");

  /*
   * =========================================================
   * SYNC FORM WITH SELECTED COMPLAINT
   * =========================================================
   */

  useEffect(() => {
    if (!complaint) {
      setStatus("");
      setAssignedTo("");
      setRemarks("");
      setOtp("");
      return;
    }

    setStatus(complaint.status || "PENDING");
    setAssignedTo(complaint.assigned_to || "");
    setRemarks(complaint.remarks || "");
    setOtp("");
  }, [complaint]);

  /*
   * =========================================================
   * CURRENT STATUS
   * =========================================================
   */

  const currentStatus = complaint?.status || "";

  /*
   * =========================================================
   * STATUS FLAGS
   * =========================================================
   */

  const isPending = currentStatus === "PENDING";

  const isReadyForVerification = currentStatus === "READY_FOR_VERIFICATION";

  const isOtpSent = currentStatus === "OTP_SENT" || otpSent;

  const isClosed = currentStatus === "CLOSED";

  /*
   * =========================================================
   * ADMIN-EDITABLE STATUS OPTIONS
   * =========================================================
   *
   * IMPORTANT:
   *
   * We deliberately DO NOT expose:
   *
   * ASSIGNED
   * IN_PROGRESS
   * OTP_SENT
   * CLOSED
   *
   * to the admin status dropdown.
   *
   * The backend/system controls those states.
   */

  const adminStatusOptions = [
    {
      value: "PENDING",
      label: "Pending",
    },
    {
      value: "READY_FOR_VERIFICATION",
      label: "Ready for Verification",
    },
  ];

  /*
   * =========================================================
   * SAVE CHANGES
   * =========================================================
   */

  const handleSave = () => {
    if (!complaint?.ticket_number) {
      return;
    }

    /*
     * Only allow the actual workflow transition:
     *
     * PENDING
     *    ↓
     * READY_FOR_VERIFICATION
     *
     * If the complaint is already in another system-controlled
     * state, don't send a status mutation.
     */

    const nextStatus = isPending ? status : currentStatus;

    onSaveChanges?.({
      status: nextStatus,
      assigned_to: assignedTo || null,
      remarks: remarks || null,
    });
  };

  /*
   * =========================================================
   * OTP INPUT
   * =========================================================
   */

  const handleOTPChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);

    setOtp(value);
  };

  /*
   * =========================================================
   * STATUS BADGE CLASS
   * =========================================================
   */

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

    if (currentStatus === "IN_PROGRESS") {
      return "bg-[#EAF2FF] text-[#2563EB]";
    }

    if (currentStatus === "ASSIGNED") {
      return "bg-[#EEF2FF] text-[#4F46E5]";
    }

    return "bg-[#FFF5D9] text-[#D99100]";
  };

  return (
    <div
      className="
        w-full
        h-[calc(100vh-104px)]
        bg-white
        border
        border-gray-100
        shadow-[0_8px_25px_rgba(15,23,42,0.05)]
        overflow-hidden
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          px-5
          py-4
          border-b
          border-gray-100
        "
      >
        <h2 className="text-[15px] font-bold text-[#16295A]">
          Complaint Details
        </h2>

        <button
          type="button"
          className="
            w-7
            h-7
            rounded-lg
            flex
            items-center
            justify-center
            text-gray-400
            hover:bg-gray-50
            hover:text-gray-700
            transition
          "
        >
          <X size={17} />
        </button>
      </div>

      {/* =====================================================
          SCROLL CONTENT
      ===================================================== */}

      <div
        className="
          h-[calc(100%-65px)]
          overflow-y-auto
          px-5
          py-4
        "
      >
        {/* ===================================================
            TICKET
        =================================================== */}

        <div className="mb-4">
          <p
            className="
              text-[10px]
              font-semibold
              text-gray-500
              mb-1.5
            "
          >
            Ticket Number
          </p>

          <div className="flex items-center justify-between">
            <span
              className="
                px-2.5
                py-1
                rounded-lg
                bg-[#F4ECFF]
                text-[11px]
                font-semibold
                text-violet-700
              "
            >
              {complaint?.ticket_number || "—"}
            </span>

            <span
              className={`
                px-2.5
                py-1
                rounded-full
                text-[10px]
                font-semibold
                ${getStatusBadgeClass()}
              `}
            >
              {currentStatus || "—"}
            </span>
          </div>
        </div>

        <div className="border-b border-gray-100 mb-4" />

        {/* ===================================================
            TITLE
        =================================================== */}

        <div className="flex gap-2.5 mb-4">
          <Tag size={14} className="text-gray-500 mt-0.5 shrink-0" />

          <div>
            <p className="text-[10px] font-semibold text-gray-500">Title</p>

            <p className="text-[12px] font-medium text-[#16295A] mt-1">
              {complaint?.title || "—"}
            </p>
          </div>
        </div>

        {/* ===================================================
            CATEGORY
        =================================================== */}

        <div className="flex gap-2.5 mb-4">
          <FolderOpen size={14} className="text-gray-500 mt-0.5 shrink-0" />

          <div>
            <p className="text-[10px] font-semibold text-gray-500">Category</p>

            <p className="text-[12px] text-[#16295A] mt-1">
              {complaint?.category || "—"}
            </p>
          </div>
        </div>

        {/* ===================================================
            PHONE
        =================================================== */}

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2.5">
            <Phone size={14} className="text-gray-500 mt-0.5 shrink-0" />

            <div>
              <p className="text-[10px] font-semibold text-gray-500">
                Citizen (Phone)
              </p>

              <p className="text-[12px] text-[#16295A] mt-1">
                {complaint?.phone_number || "—"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="
              w-8
              h-8
              rounded-lg
              border
              border-violet-200
              flex
              items-center
              justify-center
              text-violet-600
              hover:bg-violet-50
              transition
            "
          >
            <Phone size={14} />
          </button>
        </div>

        {/* ===================================================
            ADDRESS
        =================================================== */}

        <div className="flex gap-2.5 mb-4">
          <MapPin size={14} className="text-gray-500 mt-0.5 shrink-0" />

          <div>
            <p className="text-[10px] font-semibold text-gray-500">Address</p>

            <p className="text-[12px] leading-5 text-[#16295A] mt-1">
              {complaint?.address || "—"}
            </p>
          </div>
        </div>

        {/* ===================================================
            COORDINATES
        =================================================== */}

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2.5">
            <Map size={14} className="text-gray-500 mt-0.5 shrink-0" />

            <div>
              <p className="text-[10px] font-semibold text-gray-500">
                Coordinates
              </p>

              <p className="text-[12px] text-[#16295A] mt-1">
                {complaint?.latitude ?? "—"}, {complaint?.longitude ?? "—"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="
              w-8
              h-8
              rounded-lg
              border
              border-violet-200
              flex
              items-center
              justify-center
              text-violet-600
              hover:bg-violet-50
              transition
            "
          >
            <Map size={14} />
          </button>
        </div>

        {/* ===================================================
            IMAGE
        =================================================== */}

        <div className="mb-4">
          <div className="flex items-center gap-2.5 mb-2">
            <ImageIcon size={14} className="text-gray-500" />

            <p className="text-[10px] font-semibold text-gray-500">
              Complaint Image
            </p>
          </div>

          <div className="relative">
            {complaint?.image_url ? (
              <img
                src={complaint.image_url}
                alt={complaint?.title || "Complaint"}
                className="
                  w-full
                  h-[145px]
                  rounded-xl
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  w-full
                  h-[145px]
                  rounded-xl
                  bg-gray-50
                  border
                  border-gray-100
                  flex
                  items-center
                  justify-center
                  text-[11px]
                  text-gray-400
                "
              >
                No complaint image
              </div>
            )}

            {complaint?.image_url && (
              <button
                type="button"
                className="
                  absolute
                  bottom-2
                  right-2
                  w-8
                  h-8
                  rounded-lg
                  bg-white
                  shadow-md
                  flex
                  items-center
                  justify-center
                  text-violet-600
                  hover:scale-105
                  transition
                "
              >
                <Expand size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <div className="flex gap-2.5 mb-4">
          <FileText size={14} className="text-gray-500 mt-0.5 shrink-0" />

          <div>
            <p className="text-[10px] font-semibold text-gray-500">
              Description
            </p>

            <p className="text-[12px] leading-5 text-[#16295A] mt-1">
              {complaint?.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* ===================================================
            ASSIGNED TO
        =================================================== */}

        <div className="mb-4">
          <div className="flex items-center gap-2.5 mb-1.5">
            <UserRound size={14} className="text-gray-500" />

            <p className="text-[10px] font-semibold text-gray-500">
              Assigned To
            </p>
          </div>

          <select
            value={assignedTo}
            onChange={(event) => setAssignedTo(event.target.value)}
            disabled={!complaint || saving || isClosed || isOtpSent}
            className="
              w-full
              h-9
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3
              text-[11px]
              text-gray-600
              outline-none
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-100
              disabled:bg-gray-50
              disabled:text-gray-400
            "
          >
            <option value="">Unassigned</option>

            <option value="ramesh">Ramesh K.</option>

            <option value="suresh">Suresh M.</option>

            <option value="mahesh">Mahesh T.</option>
          </select>
        </div>

        {/* ===================================================
            STATUS
        =================================================== */}

        <div className="mb-4">
          <div className="flex items-center gap-2.5 mb-1.5">
            <ClipboardList size={14} className="text-gray-500" />

            <p className="text-[10px] font-semibold text-gray-500">Status</p>
          </div>

          {/* ===============================================
              CLOSED
          =============================================== */}

          {isClosed ? (
            <div
              className="
                w-full
                h-9
                rounded-lg
                border
                border-green-200
                bg-green-50
                px-3
                flex
                items-center
                text-[11px]
                font-semibold
                text-green-700
              "
            >
              Closed — Citizen Verified
            </div>
          ) : isOtpSent ? (
            /* =============================================
               OTP SENT
            ============================================= */

            <div
              className="
                w-full
                h-9
                rounded-lg
                border
                border-violet-200
                bg-violet-50
                px-3
                flex
                items-center
                text-[11px]
                font-semibold
                text-violet-700
              "
            >
              Verification OTP Sent
            </div>
          ) : (
            /* =============================================
               ADMIN STATUS SELECT
            ============================================= */

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              disabled={!complaint || saving || !isPending}
              className="
                w-full
                h-9
                rounded-lg
                border
                border-gray-200
                bg-white
                px-3
                text-[11px]
                text-[#16295A]
                outline-none
                focus:border-violet-400
                focus:ring-2
                focus:ring-violet-100
                disabled:bg-gray-50
                disabled:text-gray-400
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
          <div className="flex items-center gap-2.5 mb-1.5">
            <FileText size={14} className="text-gray-500" />

            <p className="text-[10px] font-semibold text-gray-500">Remarks</p>
          </div>

          <textarea
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            disabled={!complaint || saving || isClosed || isOtpSent}
            placeholder={
              complaint ? "Add remarks..." : "Select a complaint first..."
            }
            className="
              w-full
              h-[58px]
              resize-none
              rounded-lg
              border
              border-gray-200
              px-3
              py-2
              text-[11px]
              text-[#16295A]
              outline-none
              placeholder:text-gray-400
              focus:border-violet-400
              focus:ring-2
              focus:ring-violet-100
              disabled:bg-gray-50
              disabled:text-gray-400
            "
          />
        </div>

        {/* ===================================================
            SAVE / CANCEL
        =================================================== */}

        {!isClosed && !isOtpSent && (
          <div className="flex justify-end gap-2 pt-1 pb-2">
            <button
              type="button"
              disabled={!complaint || saving}
              onClick={() => {
                if (!complaint) {
                  return;
                }

                setStatus(complaint.status || "PENDING");

                setAssignedTo(complaint.assigned_to || "");

                setRemarks(complaint.remarks || "");
              }}
              className="
                  h-8
                  px-4
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  text-[11px]
                  font-semibold
                  text-gray-600
                  hover:bg-gray-50
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!complaint || saving}
              onClick={handleSave}
              className="
                  h-8
                  px-4
                  rounded-lg
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-600
                  text-white
                  text-[11px]
                  font-semibold
                  shadow-sm
                  hover:opacity-95
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* ===================================================
            VERIFICATION
        =================================================== */}

        <div
          className="
            border-t
            border-gray-100
            mt-2
            pt-4
          "
        >
          {/* ===============================================
              READY → REQUEST OTP
          =============================================== */}

          {isReadyForVerification && !otpSent && (
            <button
              type="button"
              disabled={!complaint || saving}
              onClick={() => onRequestVerification?.()}
              className="
                  w-full
                  h-9
                  rounded-lg
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-600
                  text-white
                  text-[11px]
                  font-semibold
                  shadow-sm
                  hover:opacity-95
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
            >
              Request Verification OTP
            </button>
          )}

          {/* ===============================================
              OTP INPUT
          =============================================== */}

          {isOtpSent && (
            <div className="mt-1">
              <p className="text-[10px] font-semibold text-gray-500 mb-1.5">
                Enter Verification OTP
              </p>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={handleOTPChange}
                placeholder="Enter 6-digit OTP"
                className="
                  w-full
                  h-9
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-3
                  text-[12px]
                  tracking-[0.25em]
                  text-[#16295A]
                  outline-none
                  placeholder:text-gray-400
                  placeholder:tracking-normal
                  focus:border-violet-400
                  focus:ring-2
                  focus:ring-violet-100
                "
              />

              <button
                type="button"
                disabled={!complaint || otp.length !== 6}
                onClick={() => onVerifyOTP?.(otp)}
                className="
                  w-full
                  h-9
                  mt-2
                  rounded-lg
                  border
                  border-violet-200
                  bg-violet-50
                  text-violet-700
                  text-[11px]
                  font-semibold
                  hover:bg-violet-100
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Verify OTP & Close Complaint
              </button>
            </div>
          )}

          {/* ===============================================
              CLOSED MESSAGE
          =============================================== */}

          {isClosed && (
            <div
              className="
                rounded-lg
                bg-green-50
                border
                border-green-100
                px-3
                py-2.5
                text-[10px]
                font-semibold
                text-green-700
                text-center
              "
            >
              Complaint closed after successful citizen verification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
