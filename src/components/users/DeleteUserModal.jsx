import { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import api from "../../api/axios";

const DeleteUserModal = ({
  open,
  onClose,
  user,
  onSuccess,
}) => {
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open || !user) return null;

  // =========================================================
  // USER NAME
  // =========================================================

  const userName =
    user.full_name ||
    user.name ||
    t("users.modal.userFallback", "this user");

  // =========================================================
  // DELETE USER
  // =========================================================

  const handleDelete = async () => {
    if (loading) return;

    if (!user.id) {
      setError(
        t(
          "users.modal.errors.userIdMissing",
          "User ID is missing."
        )
      );
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
        t(
          "users.modal.errors.deleteFailed",
          "Failed to delete user."
        );

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleClose = () => {
    if (loading) return;

    setError("");
    onClose();
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        px-4
        py-5
        backdrop-blur-sm
        sm:px-6
        sm:py-6
      "
    >
      {/* Modal */}
      <div
        className="
          w-full
          max-w-[440px]
          overflow-hidden
          rounded-[20px]
          bg-white
          shadow-2xl
          sm:rounded-[24px]
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
            gap-4
            border-b
            border-gray-100
            px-5
            py-5
            sm:px-7
            sm:py-6
          "
        >
          {/* Title + Icon */}
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-red-100
                sm:h-11
                sm:w-11
              "
            >
              <AlertTriangle
                className="
                  h-5
                  w-5
                  text-red-600
                  sm:h-[21px]
                  sm:w-[21px]
                "
              />
            </div>

            <h2
              className="
                min-w-0
                truncate
                text-[18px]
                font-semibold
                text-[#1F3768]
                sm:text-[21px]
              "
            >
              {t(
                "users.modal.deleteTitle",
                "Delete User"
              )}
            </h2>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label={t(
              "users.modal.close",
              "Close"
            )}
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-800
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-9
              sm:w-9
            "
          >
            <X className="h-5 w-5 sm:h-[21px] sm:w-[21px]" />
          </button>
        </div>

        {/* =====================================================
            BODY
        ===================================================== */}

        <div
          className="
            px-5
            py-5
            sm:px-7
            sm:py-6
          "
        >
          {/* Error */}
          {error && (
            <div
              className="
                mb-4
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-[12px]
                leading-5
                text-red-600
                sm:text-[13px]
              "
            >
              {error}
            </div>
          )}

          {/* Confirmation */}
          <p
            className="
              text-[13px]
              leading-6
              text-gray-600
              sm:text-[14px]
            "
          >
            {t(
              "users.modal.deleteConfirmation",
              "Are you sure you want to permanently delete"
            )}{" "}
            <span className="break-words font-semibold text-gray-900">
              {userName}
            </span>
            ?
          </p>

          {/* Warning */}
          <p
            className="
              mt-2
              text-[11px]
              leading-5
              text-gray-400
              sm:text-[12px]
            "
          >
            {t(
              "users.modal.deleteWarning",
              "This action will permanently remove this user from the system and cannot be undone."
            )}
          </p>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            border-t
            border-gray-100
            px-5
            py-5
            sm:flex-row
            sm:justify-end
            sm:px-7
            sm:py-5
          "
        >
          {/* Cancel */}
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="
              h-11
              w-full
              rounded-xl
              border
              border-gray-200
              px-6
              text-[13px]
              font-medium
              text-[#1F3768]
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
              sm:min-w-[100px]
              sm:text-[14px]
            "
          >
            {t(
              "users.modal.cancel",
              "Cancel"
            )}
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="
              flex
              h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-red-600
              px-6
              text-[13px]
              font-medium
              text-white
              transition
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:w-auto
              sm:min-w-[120px]
              sm:text-[14px]
            "
          >
            <Trash2 className="h-4 w-4 shrink-0" />

            {loading
              ? t(
                  "users.modal.deleting",
                  "Deleting..."
                )
              : t(
                  "users.modal.delete",
                  "Delete"
                )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;