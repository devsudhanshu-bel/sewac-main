import React from "react";
import { Plus, Search } from "lucide-react";

import UserTable from "./UserTable";
import { useLanguage } from "../../i18n";

const UserSection = ({
  title,
  titleKey,

  description,
  descriptionKey,

  badge,
  badgeKey,

  badgeColor,
  buttonColor,

  buttonText,
  buttonTextKey,

  searchPlaceholder,
  searchPlaceholderKey,

  icon: Icon,
  users = [],

  onAdd,
}) => {
  const { t } = useLanguage();

  /* ============================================================
     TRANSLATIONS
     ============================================================ */

  const translatedTitle = titleKey
    ? t(titleKey, title || "")
    : title;

  const translatedDescription = descriptionKey
    ? t(descriptionKey, description || "")
    : description;

  const translatedBadge = badgeKey
    ? t(badgeKey, badge || "")
    : badge;

  const translatedButtonText = buttonTextKey
    ? t(buttonTextKey, buttonText || "")
    : buttonText;

  const translatedSearchPlaceholder =
    searchPlaceholderKey
      ? t(
          searchPlaceholderKey,
          searchPlaceholder || ""
        )
      : searchPlaceholder;

  /* ============================================================
     ICON CLASS
     ============================================================ */

  const iconClassName = [
    "flex",
    "h-8",
    "w-8",
    "shrink-0",
    "items-center",
    "justify-center",
    "rounded-lg",
    badgeColor || "bg-violet-100",
  ].join(" ");

  /* ============================================================
     BUTTON CLASS
     ============================================================ */

  const addButtonClassName = [
    "flex",
    "h-10",
    "w-full",
    "shrink-0",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-lg",
    "px-4",
    "text-[12px]",
    "font-medium",
    "text-white",
    "transition",
    "active:scale-[0.98]",
    "sm:w-auto",
    "sm:min-w-[120px]",
    "sm:text-[13px]",
    buttonColor || "bg-violet-600",
  ].join(" ");

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <section
      className="
        w-full
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          border-b
          border-gray-100
          px-4
          py-4
          sm:px-5
          sm:py-5
        "
      >
        {/* ====================================================
            TITLE AREA
        ==================================================== */}

        <div
          className="
            flex
            min-w-0
            items-start
            gap-3
          "
        >
          {/* ICON */}

          {Icon && (
            <div className={iconClassName}>
              <Icon
                className="
                  h-4
                  w-4
                "
              />
            </div>
          )}

          {/* TITLE + DESCRIPTION */}

          <div
            className="
              min-w-0
              flex-1
            "
          >
            {/* TITLE + BADGE */}

            <div
              className="
                flex
                min-w-0
                flex-wrap
                items-center
                gap-x-2
                gap-y-1
              "
            >
              <h2
                className="
                  min-w-0
                  text-[15px]
                  font-semibold
                  leading-5
                  text-gray-900
                  sm:text-[16px]
                "
              >
                {translatedTitle}
              </h2>

              {badge !== undefined &&
                badge !== null &&
                badge !== "" && (
                  <span
                    className="
                      inline-flex
                      shrink-0
                      items-center
                      rounded-full
                      bg-gray-100
                      px-2
                      py-0.5
                      text-[10px]
                      font-medium
                      leading-4
                      text-gray-600
                      sm:text-[11px]
                    "
                  >
                    {translatedBadge}
                  </span>
                )}
            </div>

            {/* DESCRIPTION */}

            {translatedDescription && (
              <p
                className="
                  mt-1
                  max-w-2xl
                  text-[11px]
                  leading-4
                  text-gray-500
                  sm:text-[12px]
                  sm:leading-5
                "
              >
                {translatedDescription}
              </p>
            )}
          </div>
        </div>

        {/* ====================================================
            SEARCH + ADD BUTTON
        ==================================================== */}

        <div
          className="
            mt-4
            flex
            w-full
            flex-col
            gap-2.5
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:gap-3
          "
        >
          {/* ==================================================
              SEARCH
          ================================================== */}

          <div
            className="
              relative
              w-full
              sm:max-w-[360px]
              md:w-72
              md:max-w-none
            "
          >
            <Search
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder={translatedSearchPlaceholder}
              className="
                h-10
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                pl-10
                pr-3
                text-[12px]
                text-gray-700
                outline-none
                transition
                placeholder:text-gray-400
                hover:border-gray-300
                focus:border-violet-400
                focus:ring-2
                focus:ring-violet-100
                sm:text-[13px]
              "
            />
          </div>

          {/* ==================================================
              ADD BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={onAdd}
            className={addButtonClassName}
          >
            <Plus
              className="
                h-4
                w-4
                shrink-0
              "
            />

            <span>
              {translatedButtonText}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================================
          USER TABLE
      ====================================================== */}

      <UserTable users={users} />
    </section>
  );
};

export default UserSection;