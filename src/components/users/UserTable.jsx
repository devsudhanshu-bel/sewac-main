import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const UserTable = ({ users }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
              Name
            </th>

            <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
              Email
            </th>

            <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
              Role
            </th>

            <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
              Last Login
            </th>

            <th className="px-5 py-3 text-left text-[12px] font-semibold text-gray-600">
              Status
            </th>

            <th className="px-5 py-3 text-center text-[12px] font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <td className="px-5 py-4">
                <div className="font-medium text-[13px] text-gray-900">
                  {user.name}
                </div>
              </td>

              <td className="px-5 py-4 text-[13px] text-gray-600">
                {user.email}
              </td>

              <td className="px-5 py-4 text-[13px] text-gray-600">
                {user.role}
              </td>

              <td className="px-5 py-4 text-[13px] text-gray-600">
                {user.lastLogin}
              </td>

              <td className="px-5 py-4">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-medium text-green-700">
                  {user.status}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center justify-center gap-3">
                  <button className="text-gray-500 hover:text-violet-600 transition">
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button className="text-gray-500 hover:text-red-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}

      <div className="flex items-center justify-between px-5 py-3 text-[12px] text-gray-500 border-t border-gray-100">
        <span>Showing 1–5 of 5 users</span>

        <div className="flex items-center gap-4">
          <span>Rows per page: 10</span>

          <div className="flex items-center gap-2">
            <button className="w-7 h-7 rounded border border-gray-200 hover:bg-gray-100">
              ←
            </button>

            <button className="w-7 h-7 rounded border border-gray-200 hover:bg-gray-100">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;