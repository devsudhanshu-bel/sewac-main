import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../api/axios";
import { useLanguage } from "../../i18n";

const EditUserModal = ({
  open,
  onClose,
  user,
  title,
  onSuccess,
}) => {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD USER DATA
  // =========================================================

  useEffect(() => {
    if (open && user) {
      setForm({
        full_name: user.full_name || user.name || "",
        phone_number: user.phone_number || user.phone || "",
      });

      setError("");
      setLoading(false);
    }
  }, [open, user]);

  // =========================================================
  // CLOSE / RESET
  // =========================================================

  const resetAndClose = () => {
    setError("");
    setLoading(false);

    setForm({
      full_name: "",
      phone_number: "",
    });

    onClose();
  };

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const fullName = form.full_name.trim();
    const phone = form.phone_number.trim();

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!fullName) {
      setError(
        t(
          "users.modal.fullNameRequired",
          "Full name is required."
        )
      );
      return;
    }

    if (!phone) {
      setError(
        t(
          "users.modal.phoneRequired",
          "Phone number is required."
        )
      );
      return;
    }

    if (!user?.id) {
      setError(
        t(
          "users.modal.userIdMissing",
          "User ID is missing."
        )
      );
      return;
    }

    setLoading(true);
    setError("");

    // -------------------------------------------------------
    // API
    // -------------------------------------------------------

    try {
      const response = await api.put(`/api/users/${user.id}`, {
        full_name: fullName,
        phone_number: phone,
      });

      const updatedUser = response?.data?.user;

      if (!updatedUser) {
        throw new Error(
          t(
            "users.modal.updateNoData",
            "User was updated, but no user data was returned."
          )
        );
      }

      if (onSuccess) {
        onSuccess(updatedUser);
      }

      resetAndClose();
    } catch (err) {
      console.error("Update user error:", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        t(
          "users.modal.errors.updateFailed",
          "Failed to update user."
        );

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DON'T RENDER
  // =========================================================

  if (!open || !user) return null;

  // =========================================================
  // TRANSLATIONS
  // =========================================================

  const modalTitle =
    title ||
    t(
      "users.contractor.modals.editTitle",
      "Edit User"
    );

  // =========================================================
  // RENDER
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
        py-6
        backdrop-blur-sm
        sm:px-6
      "
    >
      {/* =====================================================
          MODAL
      ===================================================== */}

      <div
        className="
          flex
          max-h-[calc(100vh-3rem)]
          w-full
          max-w-[560px]
          flex-col
          overflow-hidden
          rounded-[20px]
          bg-white
          shadow-2xl
          sm:max-h-[calc(100vh-4rem)]
          sm:rounded-[24px]
        "
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-100
            px-5
            py-4
            sm:px-7
            sm:py-5
          "
        >
          <h2
            className="
              min-w-0
              pr-4
              text-[21px]
              font-semibold
              leading-tight
              text-[#1F3768]
              sm:text-[26px]
              md:text-[28px]
            "
          >
            {modalTitle}
          </h2>

          <button
            type="button"
            onClick={resetAndClose}
            disabled={loading}
            className="
              flex
              h-9
              w-9
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
              sm:h-10
              sm:w-10
            "
            aria-label={t(
              "users.modal.close",
              "Close"
            )}
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* ===================================================
            FORM
        =================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            flex
            min-h-0
            flex-1
            flex-col
          "
        >
          {/* =================================================
              BODY
          ================================================= */}

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              px-5
              py-5
              sm:px-7
              sm:py-6
            "
          >
            <div className="space-y-5 sm:space-y-5">

              {/* =============================================
                  ERROR
              ============================================= */}

              {error && (
                <div
                  className="
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

              {/* =============================================
                  FULL NAME
              ============================================= */}

              <div>
                <label
                  htmlFor="edit-full-name"
                  className="
                    mb-2
                    block
                    text-[12px]
                    font-medium
                    text-[#1F3768]
                    sm:text-[13px]
                  "
                >
                  {t(
                    "users.modal.fullName",
                    "Full Name"
                  )}
                </label>

                <input
                  id="edit-full-name"
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder={t(
                    "users.modal.fullNamePlaceholder",
                    "Enter full name"
                  )}
                  disabled={loading}
                  autoComplete="name"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    text-[13px]
                    text-gray-700
                    outline-none
                    transition
                    placeholder:text-gray-400
                    hover:border-gray-300
                    focus:border-violet-500
                    focus:ring-2
                    focus:ring-violet-100
                    disabled:cursor-not-allowed
                    disabled:bg-gray-50
                    sm:h-12
                    sm:text-[14px]
                  "
                />
              </div>

              {/* =============================================
                  EMAIL
              ============================================= */}

              <div>
                <label
                  htmlFor="edit-email"
                  className="
                    mb-2
                    block
                    text-[12px]
                    font-medium
                    text-[#1F3768]
                    sm:text-[13px]
                  "
                >
                  {t(
                    "users.modal.email",
                    "Email"
                  )}
                </label>

                <input
                  id="edit-email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  readOnly
                  className="
                    h-11
                    w-full
                    cursor-not-allowed
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    text-[13px]
                    text-gray-500
                    outline-none
                    sm:h-12
                    sm:text-[14px]
                  "
                />

                <p
                  className="
                    mt-1.5
                    text-[10px]
                    leading-4
                    text-gray-400
                    sm:text-[11px]
                  "
                >
                  {t(
                    "users.modal.emailCannotChange",
                    "Email cannot be changed."
                  )}
                </p>
              </div>

              {/* =============================================
                  PHONE NUMBER
              ============================================= */}

              <div>
                <label
                  htmlFor="edit-phone-number"
                  className="
                    mb-2
                    block
                    text-[12px]
                    font-medium
                    text-[#1F3768]
                    sm:text-[13px]
                  "
                >
                  {t(
                    "users.modal.phoneNumber",
                    "Phone Number"
                  )}
                </label>

                <input
                  id="edit-phone-number"
                  type="tel"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder={t(
                    "users.modal.phoneNumberPlaceholder",
                    "Enter phone number"
                  )}
                  disabled={loading}
                  autoComplete="tel"
                  inputMode="numeric"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    text-[13px]
                    text-gray-700
                    outline-none
                    transition
                    placeholder:text-gray-400
                    hover:border-gray-300
                    focus:border-violet-500
                    focus:ring-2
                    focus:ring-violet-100
                    disabled:cursor-not-allowed
                    disabled:bg-gray-50
                    sm:h-12
                    sm:text-[14px]
                  "
                />
              </div>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              flex
              shrink-0
              flex-col-reverse
              gap-2.5
              border-t
              border-gray-100
              px-5
              py-4
              sm:flex-row
              sm:justify-end
              sm:gap-3
              sm:px-7
              sm:py-5
            "
          >
            {/* CANCEL */}

            <button
              type="button"
              onClick={resetAndClose}
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
                sm:min-w-[110px]
                sm:text-[14px]
              "
            >
              {t(
                "users.modal.cancel",
                "Cancel"
              )}
            </button>

            {/* UPDATE */}

            <button
              type="submit"
              disabled={loading}
              className="
                h-11
                w-full
                rounded-xl
                bg-violet-600
                px-7
                text-[13px]
                font-medium
                text-white
                transition
                hover:bg-violet-700
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:w-auto
                sm:min-w-[120px]
                sm:text-[14px]
              "
            >
              {loading
                ? t(
                    "users.modal.updating",
                    "Updating..."
                  )
                : t(
                    "users.modal.update",
                    "Update"
                  )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;