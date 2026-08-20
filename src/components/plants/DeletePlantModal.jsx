import { X, Trash2 } from "lucide-react";
import api from "../../api/axios";
import { useLanguage } from "../../i18n";

export default function DeletePlantModal({
  plant,
  onClose,
  onSuccess,
}) {
  const { t } = useLanguage();

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
        p-6
        isolation-auto
      "
    >
      <div
        className="
          relative
          z-[10000]
          w-[420px]
          max-w-full
          rounded-2xl
          bg-white
          p-6
          shadow-2xl
        "
      >
        {/* Header */}

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-red-600">
            {t(
              "plants.deletePlant.title",
              "Delete Plant"
            )}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-1.5
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* Delete Icon */}

        <div className="mb-5 flex justify-center">
          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-red-50
            "
          >
            <Trash2
              size={42}
              className="text-red-500"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Confirmation */}

        <p className="text-center text-gray-700">
          {t(
            "plants.deletePlant.confirmation",
            "Are you sure you want to delete this plant?"
          )}
        </p>

        {/* Plant Name */}

        <p className="mt-2 text-center font-semibold text-gray-900">
          {plant?.plant_name || "-"}
        </p>

        {/* Zone */}

        {plant?.zone && (
          <p className="mt-1 text-center text-sm text-gray-500">
            {plant.zone}
          </p>
        )}

        {/* Buttons */}

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              border
              border-gray-200
              px-5
              py-2
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-50
            "
          >
            {t(
              "plants.deletePlant.cancel",
              "Cancel"
            )}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="
              rounded-lg
              bg-red-600
              px-5
              py-2
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-red-700
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
  );
}