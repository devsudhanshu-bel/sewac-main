import {
  X,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import api from "../../api/axios";

import { useLanguage } from "../../i18n";

export default function DeleteVehicleModal({
  vehicle,
  onClose,
  onSuccess,
}) {
  const { t } = useLanguage();

  /* ===========================================================
     DELETE VEHICLE
  =========================================================== */

  const handleDelete = async () => {
    try {
      if (!vehicle?.vehicle_id) {
        return;
      }

      await api.delete(
        `/api/vehicles/${vehicle.vehicle_id}`
      );

      onSuccess();
    } catch (err) {
      console.error(
        "Delete Vehicle Error:",
        err
      );

      alert(
        t(
          "vehicles.deleteVehicle.errors.deleteFailed",
          "Failed to delete vehicle."
        )
      );
    }
  };

  /* ===========================================================
     RENDER
  =========================================================== */

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-[2px]
        px-4
      "
    >
      {/* =====================================================
          MODAL
      ===================================================== */}

      <div
        className="
          w-full
          max-w-[420px]
          bg-white
          rounded-[24px]
          border
          border-[#ECECF3]
          shadow-[0_20px_60px_rgba(15,23,42,0.18)]
          overflow-hidden
        "
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-[#F0F1F5]
          "
        >
          <div>
            <h2 className="text-[18px] font-semibold text-[#111827]">
              {t(
                "vehicles.deleteVehicle.title",
                "Delete Vehicle"
              )}
            </h2>

            <p className="text-[12px] text-[#6B7280] mt-1">
              {t(
                "vehicles.deleteVehicle.subtitle",
                "This action cannot be undone."
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t(
              "vehicles.deleteVehicle.close",
              "Close"
            )}
            className="
              w-9
              h-9
              rounded-xl
              flex
              items-center
              justify-center
              text-[#6B7280]
              hover:text-[#111827]
              hover:bg-[#F5F6FA]
              transition
            "
          >
            <X size={19} strokeWidth={2} />
          </button>
        </div>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="px-6 py-6">
          {/* ================= WARNING ICON ================= */}

          <div className="flex justify-center">
            <div
              className="
                w-[72px]
                h-[72px]
                rounded-full
                bg-[#FFF1F2]
                flex
                items-center
                justify-center
              "
            >
              <div
                className="
                  w-[52px]
                  h-[52px]
                  rounded-full
                  bg-[#FFE4E6]
                  flex
                  items-center
                  justify-center
                "
              >
                <Trash2
                  size={25}
                  strokeWidth={2}
                  className="text-[#EF4444]"
                />
              </div>
            </div>
          </div>

          {/* ================= MESSAGE ================= */}

          <div className="text-center mt-5">
            <h3 className="text-[16px] font-semibold text-[#111827]">
              {t(
                "vehicles.deleteVehicle.question",
                "Are you sure you want to delete this vehicle?"
              )}
            </h3>

            <p className="text-[13px] leading-5 text-[#6B7280] mt-2 px-4">
              {t(
                "vehicles.deleteVehicle.description",
                "Deleting this vehicle will permanently remove it from the system."
              )}
            </p>
          </div>

          {/* ================= VEHICLE ================= */}

          <div
            className="
              mt-5
              px-4
              py-3
              rounded-xl
              bg-[#F8F9FD]
              border
              border-[#ECECF3]
              flex
              items-center
              justify-between
            "
          >
            <span className="text-[12px] font-medium text-[#6B7280]">
              {t(
                "vehicles.deleteVehicle.vehicleIdLabel",
                "Vehicle ID"
              )}
            </span>

            <span className="text-[13px] font-semibold text-[#111827]">
              {vehicle?.vehicle_id || "-"}
            </span>
          </div>

          {/* ================= WARNING ================= */}

          <div
            className="
              mt-4
              flex
              items-start
              gap-3
              rounded-xl
              bg-[#FFF7ED]
              border
              border-[#FED7AA]
              px-4
              py-3
            "
          >
            <AlertTriangle
              size={17}
              className="text-[#F97316] mt-[1px] flex-shrink-0"
            />

            <p className="text-[11px] leading-4 text-[#9A3412]">
              {t(
                "vehicles.deleteVehicle.warning",
                "All vehicle-related records associated with this vehicle may no longer be available."
              )}
            </p>
          </div>
        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div
          className="
            px-6
            py-5
            bg-[#FAFAFC]
            border-t
            border-[#F0F1F5]
            flex
            justify-end
            gap-3
          "
        >
          {/* ================= CANCEL ================= */}

          <button
            type="button"
            onClick={onClose}
            className="
              h-[40px]
              px-5
              rounded-xl
              border
              border-[#E2E4EA]
              bg-white
              text-[13px]
              font-medium
              text-[#374151]
              hover:bg-[#F8F9FD]
              hover:border-[#D5D8E0]
              transition
            "
          >
            {t(
              "vehicles.deleteVehicle.cancel",
              "Cancel"
            )}
          </button>

          {/* ================= DELETE ================= */}

          <button
            type="button"
            onClick={handleDelete}
            className="
              h-[40px]
              px-5
              rounded-xl
              bg-[#EF4444]
              text-white
              text-[13px]
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              hover:bg-[#DC2626]
              active:scale-[0.98]
              transition
            "
          >
            <Trash2
              size={15}
              strokeWidth={2.2}
            />

            {t(
              "vehicles.deleteVehicle.delete",
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}