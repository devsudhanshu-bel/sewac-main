import React, { useEffect, useMemo, useState } from "react";
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
  onEdit,
  onDelete,
}) => {
  const { t } = useLanguage();

  /* ============================================================
     STATE
  ============================================================ */

  const [searchTerm, setSearchTerm] = useState("");

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

  const translatedSearchPlaceholder = searchPlaceholderKey
    ? t(
        searchPlaceholderKey,
        searchPlaceholder || ""
      )
    : searchPlaceholder;

  /* ============================================================
     SAFE USERS
  ============================================================ */

  const safeUsers = Array.isArray(users)
    ? users
    : [];

  /* ============================================================
     SEARCH
  ============================================================ */

  const filteredUsers = useMemo(() => {
    const query = searchTerm
      .trim()
      .toLowerCase();

    if (!query) {
      return safeUsers;
    }

    return safeUsers.filter((user) => {
      const searchableValues = [
        user?.name,
        user?.email,
        user?.phone,
        user?.phoneNumber,
        user?.role,
        user?.status,
      ];

      return searchableValues.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [
    safeUsers,
    searchTerm,
  ]);

  /* ============================================================
     RESET SEARCH WHEN USERS CHANGE
  ============================================================ */

  useEffect(() => {
    setSearchTerm("");
  }, [users]);

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
     ADD BUTTON CLASS
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
    "border",
    "px-4",
    "text-[12px]",
    "font-medium",
    "transition",
    "active:scale-[0.98]",

    /*
     * IMPORTANT:
     *
     * Keep search and button stacked until md.
     * This fixes the narrow/tablet layout shown
     * in your screenshot.
     */
    "md:w-auto",
    "md:min-w-[120px]",
    "md:text-[13px]",

    buttonColor || "border-violet-600 bg-violet-600 text-white",
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

              {translatedBadge !== undefined &&
                translatedBadge !== null &&
                translatedBadge !== "" && (
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

            /*
             * IMPORTANT:
             * Stay column layout below md.
             * This prevents the search box and button
             * from squeezing the table.
             */

            md:flex-row
            md:items-center
            md:justify-between
            md:gap-3
          "
        >
          {/* ==================================================
              SEARCH
          ================================================== */}

          <div
            className="
              relative
              w-full
              md:max-w-[360px]
              lg:w-72
              lg:max-w-none
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
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder={
                translatedSearchPlaceholder
              }
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

      <UserTable
        users={filteredUsers}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </section>
  );
};

export default UserSection;