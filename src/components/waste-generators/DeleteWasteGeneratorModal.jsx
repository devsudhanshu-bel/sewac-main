import { X, TriangleAlert } from "lucide-react";

export default function DeleteWasteGeneratorModal({ open, onClose, citizen }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[520px] rounded-2xl p-8 relative">
        <button onClick={onClose} className="absolute right-6 top-6">
          <X size={22} />
        </button>

        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <TriangleAlert className="text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center">
          Delete Waste Generator
        </h2>

        <p className="text-center mt-4 text-gray-500">
          Are you sure you want to delete
          <br />
          <b>{citizen?.personName}</b> ?
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <button onClick={onClose} className="px-8 py-3 border rounded-xl">
            Cancel
          </button>

          <button
            onClick={async () => {
              try {
                await api.delete(
                  `/api/waste-generators/${citizen.phoneNumber}`,
                );

                alert("Waste Generator deleted successfully.");

                await refreshData();

                onClose();
              } catch (err) {
                console.error(err);

                alert(
                  err.response?.data?.message ||
                    "Failed to delete waste generator.",
                );
              }
            }}
            className="px-8 py-3 rounded-xl bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
