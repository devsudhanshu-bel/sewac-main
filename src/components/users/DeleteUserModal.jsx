import { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import api from "../../api/axios";

const DeleteUserModal = ({
  open,
  onClose,
  user,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open || !user) return null;

  const handleDelete = async () => {
    if (loading) return;

    if (!user.id) {
      setError("User ID is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.delete(`/api/users/${user.id}`);

      if (onSuccess) {
        onSuccess(user);
      }

      onClose();
    } catch (err) {
      console.error("Delete user error:", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete user.";

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">

      <div className="w-[440px] rounded-[24px] bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>

            <h2 className="text-[22px] font-semibold text-[#1F3768]">
              Delete User
            </h2>

          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-800 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* Body */}
        <div className="px-7 py-6">

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
              {error}
            </div>
          )}

          <p className="text-[14px] leading-6 text-gray-600">
            Are you sure you want to deactivate{" "}
            <span className="font-semibold text-gray-900">
              {user.full_name || user.name}
            </span>
            ?
          </p>

          <p className="mt-2 text-[12px] text-gray-400">
            This user will be marked as inactive and will no longer appear
            in the active users list.
          </p>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-7 pb-7">

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="
              h-11
              rounded-xl
              border
              border-gray-200
              px-6
              text-[14px]
              font-medium
              text-[#1F3768]
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
            onClick={handleDelete}
            disabled={loading}
            className="
              h-11
              min-w-[120px]
              rounded-xl
              bg-red-600
              px-6
              text-[14px]
              font-medium
              text-white
              hover:bg-red-700
              transition
              disabled:opacity-60
              disabled:cursor-not-allowed
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <Trash2 className="w-4 h-4" />

            {loading ? "Deleting..." : "Delete"}

          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteUserModal;