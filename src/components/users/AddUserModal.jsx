import { useState } from "react";
import { X } from "lucide-react";

import api from "../../api/axios";
import { useLanguage } from "../../i18n";

const initialForm = {
  full_name: "",
  email: "",
  password: "",
  phone_number: "",
};

const AddUserModal = ({
  open,
  onClose,
  title,
  role,
  onSuccess,
}) => {
  const { t } = useLanguage();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  // =========================================================
  // HANDLE INPUT CHANGE
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
  // RESET + CLOSE
  // =========================================================

  const resetAndClose = () => {
    setForm(initialForm);
    setError("");
    setLoading(false);
    onClose();
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const fullName = form.full_name.trim();
    const email = form.email.trim();
    const phone = form.phone_number.trim();
    const password = form.password;

    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    if (!fullName || !email || !phone || !password) {
      setError(
        t(
          "users.modals.add.validation.allFields",
          "Please fill in all fields."
        )
      );
      return;
    }

    if (!role) {
      setError(
        t(
          "users.modals.add.validation.roleMissing",
          "User role is missing."
        )
      );
      return;
    }

    setLoading(true);
    setError("");

    // ---------------------------------------------------------
    // API REQUEST
    // ---------------------------------------------------------

    try {
      const response = await api.post("/api/users", {
        full_name: fullName,
        email,
        password,
        phone_number: phone,
        role,
      });

      const createdUser = response?.data?.user;

      if (!createdUser) {
        throw new Error(
          t(
            "users.modals.add.errors.noUserData",
            "User was created, but no user data was returned."
          )
        );
      }

      if (onSuccess) {
        onSuccess(createdUser);
      }

      resetAndClose();
    } catch (err) {
      console.error("Create user error:", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        t(
          "users.modals.add.errors.createFailed",
          "Failed to create user."
        );

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

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
        px-3
        py-4
        backdrop-blur-sm
        sm:px-5
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          resetAndClose();
        }
      }}
    >
      {/* =====================================================
          MODAL
      ===================================================== */}

      <div
        className="
          flex
          w-full
          max-w-[560px]
          max-h-[calc(100vh-32px)]
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
          sm:max-h-[calc(100vh-48px)]
          sm:rounded-[24px]
        "
        onMouseDown={(e) => e.stopPropagation()}
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
            px-4
            py-4
            sm:px-7
            sm:py-5
          "
        >
          <h2
            className="
              min-w-0
              pr-3
              text-[20px]
              font-semibold
              leading-6
              text-[#1F3768]
              sm:text-[24px]
              sm:leading-7
              md:text-[26px]
            "
          >
            {title ||
              t(
                "users.modals.add.title",
                "Add User"
              )}
          </h2>

          <button
            type="button"
            onClick={resetAndClose}
            disabled={loading}
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
            aria-label={t(
              "users.modals.add.close",
              "Close"
            )}
            title={t(
              "users.modals.add.close",
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
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* =================================================
              BODY
          ================================================= */}

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              px-4
              py-4
              sm:px-7
              sm:py-5
            "
          >
            <div className="space-y-4 sm:space-y-5">

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <div
                  className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-3
                    py-2.5
                    text-[12px]
                    leading-5
                    text-red-600
                    sm:px-4
                    sm:py-3
                    sm:text-[13px]
                  "
                >
                  {error}
                </div>
              )}

              {/* =================================================
                  FULL NAME
              ================================================= */}

              <div>
                <label
                  htmlFor="add-user-full-name"
                  className="
                    mb-1.5
                    block
                    text-[12px]
                    font-medium
                    text-[#1F3768]
                    sm:mb-2
                    sm:text-[13px]
                  "
                >
                  {t(
                    "users.modals.add.fullName",
                    "Full Name"
                  )}
                </label>

                <input
                  id="add-user-full-name"
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder={t(
                    "users.modals.add.fullNamePlaceholder",
                    "Enter full name"
                  )}
                  disabled={loading}
                  autoComplete="name"
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-3
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
                    sm:h-11
                    sm:rounded-xl
                    sm:px-4
                    sm:text-[14px]
                  "
                />
              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>
                <label
                  htmlFor="add-user-email"
                  className="
                    mb-1.5
                    block
                    text-[12px]
                    font-medium
                    text-[#1F3768]
                    sm:mb-2
                    sm:text-[13px]
                  "
                >
                  {t(
                    "users.modals.add.email",
                    "Email"
                  )}
                </label>

                <input
                  id="add-user-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t(
                    "users.modals.add.emailPlaceholder",
                    "Enter email"
                  )}
                  disabled={loading}
                  autoComplete="email"
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-3
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
                    sm:h-11
                    sm:rounded-xl
                    sm:px-4
                    sm:text-[14px]
                  "
                />
              </div>

              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div>
                <label
                  htmlFor="add-user-password"
                  className="
                    mb-1.5
                    block
                    text-[12px]
                    font-medium
                    text-[#1F3768]
                    sm:mb-2
                    sm:text-[13px]
                  "
                >
                  {t(
                    "users.modals.add.password",
                    "Password"
                  )}
                </label>

                <input
                  id="add-user-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={t(
                    "users.modals.add.passwordPlaceholder",
                    "Enter password"
                  )}
                  disabled={loading}
                  autoComplete="new-password"
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-3
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
                    sm:h-11
                    sm:rounded-xl
                    sm:px-4
                    sm:text-[14px]
                  "
                />
              </div>

              {/* =================================================
                  PHONE
              ================================================= */}

              <div>
                <label
                  htmlFor="add-user-phone"
                  className="
                    mb-1.5
                    block
                    text-[12px]
                    font-medium
                    text-[#1F3768]
                    sm:mb-2
                    sm:text-[13px]
                  "
                >
                  {t(
                    "users.modals.add.phoneNumber",
                    "Phone Number"
                  )}
                </label>

                <input
                  id="add-user-phone"
                  type="tel"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder={t(
                    "users.modals.add.phonePlaceholder",
                    "Enter phone number"
                  )}
                  disabled={loading}
                  autoComplete="tel"
                  inputMode="numeric"
                  className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-3
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
                    sm:h-11
                    sm:rounded-xl
                    sm:px-4
                    sm:text-[14px]
                  "
                />
              </div>
            </div>
          </div>

          {/* ===================================================
              FOOTER
          =================================================== */}

          <div
            className="
              flex
              shrink-0
              flex-col-reverse
              gap-2.5
              border-t
              border-gray-100
              px-4
              py-4
              sm:flex-row
              sm:justify-end
              sm:gap-3
              sm:border-t-0
              sm:px-7
              sm:pb-6
              sm:pt-3
            "
          >
            {/* CANCEL */}

            <button
              type="button"
              onClick={resetAndClose}
              disabled={loading}
              className="
                h-10
                w-full
                rounded-lg
                border
                border-gray-200
                px-5
                text-[13px]
                font-medium
                text-[#1F3768]
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:h-11
                sm:w-auto
                sm:min-w-[100px]
                sm:rounded-xl
                sm:text-[14px]
              "
            >
              {t(
                "users.modals.add.cancel",
                "Cancel"
              )}
            </button>

            {/* SAVE */}

            <button
              type="submit"
              disabled={loading}
              className="
                h-10
                w-full
                min-w-0
                rounded-lg
                bg-violet-600
                px-6
                text-[13px]
                font-medium
                text-white
                transition
                hover:bg-violet-700
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:h-11
                sm:w-auto
                sm:min-w-[110px]
                sm:rounded-xl
                sm:px-7
                sm:text-[14px]
              "
            >
              {loading
                ? t(
                    "users.modals.add.saving",
                    "Saving..."
                  )
                : t(
                    "users.modals.add.save",
                    "Save"
                  )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;