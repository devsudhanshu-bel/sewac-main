import React from "react";
import { Plus, Search } from "lucide-react";

import UserTable from "./UserTable";

const UserSection = ({
  title,
  description,
  badge,
  badgeColor,
  buttonColor,
  buttonText,
  searchPlaceholder,
  icon: Icon,
  users,
  onAdd,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

      <div className="border-b border-gray-100 px-5 py-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${badgeColor}`}>
              <Icon className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">

                <h2 className="text-[16px] font-semibold text-gray-900">
                  {title}
                </h2>

                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">
                  {badge}
                </span>

              </div>

              <p className="mt-0.5 text-[12px] text-gray-500">
                {description}
              </p>

            </div>

          </div>

        </div>

        <div className="mt-4 flex items-center justify-between">

          <div className="relative w-72">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>

            <input
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-lg border border-gray-200 pl-10 pr-3 text-[13px]"
            />

          </div>

          <button
            onClick={onAdd}
            className={`${buttonColor} h-10 rounded-lg px-4 text-[13px] font-medium text-white flex items-center gap-2`}
          >
            <Plus className="w-4 h-4"/>

            {buttonText}
          </button>

        </div>

      </div>

      <UserTable users={users} />

    </div>
  );
};

export default UserSection;