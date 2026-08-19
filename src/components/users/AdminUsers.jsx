import React from "react";
import { ShieldCheck, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import AddUserModal from "./AddUserModal";
const adminUsers = [
  {
    id: 1,
    name: "Super Admin",
    email: "superadmin@sewac.com",
    phone: "9876543210",
    status: "Active",
    createdAt: "01 May 2025, 08:30 AM",
  },
  {
    id: 2,
    name: "Ashutosh Kumar",
    email: "ashutosh@sewac.com",
    phone: "9123456780",
    status: "Active",
    createdAt: "05 May 2025, 10:15 AM",
  },
  {
    id: 3,
    name: "Neha Sharma",
    email: "neha@sewac.com",
    phone: "9988776655",
    status: "Active",
    createdAt: "07 May 2025, 02:45 PM",
  },
  {
    id: 4,
    name: "Ravi Verma",
    email: "ravi@sewac.com",
    phone: "9001122334",
    status: "Active",
    createdAt: "10 May 2025, 11:20 AM",
  },
];

const AdminUsers = () => {
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-violet-600" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-semibold text-gray-900">
                  Admin Level 1 Users
                </h2>
              </div>

              <p className="mt-0.5 text-[12px] text-gray-500">
                Manage other Admin Level 1 users who have full access to the
                system.
              </p>
            </div>
          </div>
        </div>

        {/* Search + Button */}
        <div className="mt-4 flex items-center justify-between">
          <div className="relative w-[340px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-600" />

            <input
              type="text"
              placeholder="Search by name, email or phone..."
              className="w-full h-10 rounded-lg border border-gray-200 pl-4 pr-10 text-[13px] outline-none focus:border-violet-500"
            />
          </div>

<button
  onClick={() => setShowAddAdminModal(true)}
  className="h-10 px-5 rounded-lg border border-violet-600 text-violet-700 hover:bg-violet-600 hover:text-white transition text-[13px] font-medium flex items-center gap-2">
                <Plus className="w-4 h-4" />
            Add Admin
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F7F5FF]">
            <tr>
              <th className="px-5 py-3 text-left text-[12px] font-semibold text-violet-700">
                SL.No
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-violet-700">
                Admin Name
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-violet-700">
                Email
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-violet-700">
                Phone Number
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-violet-700">
                Status
              </th>

              <th className="px-5 py-3 text-left text-[12px] font-semibold text-violet-700">
                Created At
              </th>

              <th className="px-5 py-3 text-center text-[12px] font-semibold text-violet-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {adminUsers.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-5 py-4 text-[13px]">{index + 1}</td>

                <td className="px-5 py-4 text-[13px] font-medium">
                  {user.name}
                </td>

                <td className="px-5 py-4 text-[13px] text-gray-600">
                  {user.email}
                </td>

                <td className="px-5 py-4 text-[13px] text-gray-600">
                  {user.phone}
                </td>

                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-[11px] font-medium">
                    {user.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-[13px] text-gray-600">
                  {user.createdAt}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center items-center gap-4">
                    <button className="text-violet-600 hover:text-violet-800">
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}

      <div className="flex items-center justify-between px-5 py-4 text-[12px]">
        <p className="text-violet-700 font-medium">
          Showing 1 to 4 of 4 entries
        </p>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Rows per page:</span>

          <select className="h-8 rounded-md border border-gray-200 px-2 text-[12px] outline-none">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
      </div>
            <AddUserModal
        open={showAddAdminModal}
        onClose={() => setShowAddAdminModal(false)}
        title="Add Admin"
      />
    </div>
  );
};

export default AdminUsers;