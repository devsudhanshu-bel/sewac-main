import { X, Trash2 } from "lucide-react";
import api from "../../api/axios";
import { useLanguage } from "../../i18n";

export default function DeletePlantModal({
  plant,
  onClose,
  onSuccess,
}) {
  const { t } = useLanguage();

  // =========================================================
  // DELETE PLANT
  // =========================================================

  const handleDelete = async () => {
    try {
      await api.delete(`/api/plants/${plant.id}`);

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);

      alert(
        t(
          "plants.deletePlant.errors.deleteFailed",
          "Failed to delete plant."
        )
      );
    }
  };

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
        px-4
        py-6
        sm:px-6
        backdrop-blur-[1px]
      "
    >
      {/* =====================================================
          MODAL
      ===================================================== */}

      <div
        className="
          relative
          z-[10000]
          w-full
          max-w-[420px]
          rounded-2xl
          bg-white
          shadow-2xl
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
            gap-4
            border-b
            border-gray-100
            px-5
            py-4
            sm:px-6
            sm:py-5
          "
        >
          <h2
            className="
              min-w-0
              text-[18px]
              sm:text-[20px]
              font-bold
              text-red-600
            "
          >
            {t(
              "plants.deletePlant.title",
              "Delete Plant"
            )}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              shrink-0
              rounded-lg
              p-2
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
              focus:outline-none
              focus:ring-2
              focus:ring-gray-200
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div
          className="
            px-5
            py-6
            sm:px-6
            sm:py-7
          "
        >
          {/* =================================================
              DELETE ICON
          ================================================= */}

          <div className="mb-5 flex justify-center sm:mb-6">
            <div
              className="
                flex
                h-16
                w-16
                sm:h-[72px]
                sm:w-[72px]
                items-center
                justify-center
                rounded-full
                bg-red-50
              "
            >
              <Trash2
                size={34}
                className="text-red-500 sm:h-[38px] sm:w-[38px]"
                strokeWidth={2}
              />
            </div>
          </div>

          {/* =================================================
              CONFIRMATION TEXT
          ================================================= */}

          <p
            className="
              text-center
              text-[14px]
              sm:text-[15px]
              leading-6
              text-gray-600
            "
          >
            {t(
              "plants.deletePlant.confirmation",
              "Are you sure you want to delete this plant?"
            )}
          </p>

          {/* =================================================
              PLANT NAME
          ================================================= */}

          <p
            className="
              mt-3
              break-words
              text-center
              text-[16px]
              sm:text-[17px]
              font-semibold
              leading-6
              text-gray-900
            "
          >
            {plant?.plant_name || "-"}
          </p>

          {/* =================================================
              ZONE
          ================================================= */}

          {plant?.zone && (
            <p
              className="
                mt-1
                break-words
                text-center
                text-[13px]
                sm:text-[14px]
                leading-5
                text-gray-500
              "
            >
              {plant.zone}
            </p>
          )}

          {/* =================================================
              WARNING
          ================================================= */}

          <div
            className="
              mt-5
              rounded-xl
              border
              border-red-100
              bg-red-50/70
              px-4
              py-3
            "
          >
            <p
              className="
                text-center
                text-[12px]
                sm:text-[13px]
                leading-5
                font-medium
                text-red-600
              "
            >
              {t(
                "plants.deletePlant.warning",
                "This action cannot be undone."
              )}
            </p>
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div
            className="
              mt-6
              flex
              flex-col-reverse
              gap-3
              sm:mt-7
              sm:flex-row
              sm:justify-end
            "
          >
            {/* CANCEL */}

            <button
              type="button"
              onClick={onClose}
              className="
                w-full
                sm:w-auto
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                py-2.5
                text-[13px]
                sm:text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
                focus:outline-none
                focus:ring-2
                focus:ring-gray-200
              "
            >
              {t(
                "plants.deletePlant.cancel",
                "Cancel"
              )}
            </button>

            {/* DELETE */}

            <button
              type="button"
              onClick={handleDelete}
              className="
                w-full
                sm:w-auto
                rounded-xl
                bg-red-600
                px-5
                py-2.5
                text-[13px]
                sm:text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-red-700
                focus:outline-none
                focus:ring-2
                focus:ring-red-200
              "
            >
              {t(
                "plants.deletePlant.delete",
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}