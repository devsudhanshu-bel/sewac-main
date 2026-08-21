import React, { useState } from "react";
import { Building2, Plus, Search, Pencil, Trash2 } from "lucide-react";

import AddUserModal from "./AddUserModal";

const initialContractorUsers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh@abcinfra.com",
    role: "Contractor Manager",
    lastLogin: "1 hour ago",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@greenwaste.com",
    role: "Supervisor",
    lastLogin: "Today",
    status: "Active",
  },
  {
    id: 3,
    name: "Arjun Patel",
    email: "arjun@urbanservices.com",
    role: "Site Manager",
    lastLogin: "Yesterday",
    status: "Active",
  },
];

const ContractorUsers = () => {
  const [showAddContractorModal, setShowAddContractorModal] =
    useState(false);

  const [contractorUsers, setContractorUsers] = useState(
    initialContractorUsers
  );

  const [search, setSearch] = useState("");

  const handleContractorCreated = (createdUser) => {
    const newContractor = {
      id: createdUser.id,
      name: createdUser.full_name,
      email: createdUser.email,
      role: "Contractor",
      lastLogin: "Never",
      status: createdUser.status || "ACTIVE",
    };

    setContractorUsers((prev) => [newContractor, ...prev]);
  };

  const filteredContractors = contractorUsers.filter((user) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value)
    );
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

      {/* Header */}

      <div className="px-5 py-4 border-b border-gray-100">

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-2">

            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">

              <Building2 className="w-4 h-4 text-emerald-600" />

            </div>

            <div>

              <h2 className="text-[16px] font-semibold text-gray-900">
                Contractor Users
              </h2>

              <p className="mt-0.5 text-[12px] text-gray-500">
                Manage contractor accounts and permissions.
              </p>

            </div>

          </div>

        </div>

        {/* Search + Button */}

        <div className="mt-4 flex items-center justify-between">

          <div className="relative w-72">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contractors..."
              className="
                w-full
                h-10
                rounded-lg
                border
                border-gray-200
                pl-10
                pr-3
                text-[13px]
                outline-none
                focus:ring-2
                focus:ring-emerald-500
              "
            />

          </div>

          <button
            onClick={() => setShowAddContractorModal(true)}
            className="
              h-10
              px-5
              rounded-lg
              border
              border-violet-600
              text-violet-700
              hover:bg-violet-600
              hover:text-white
              transition
              text-[13px]
              font-medium
              flex
              items-center
              gap-2
            "
          >

            <Plus className="w-4 h-4" />

            Add Contractor

          </button>

        </div>

      </div>

      {/* Table */}

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

            {filteredContractors.map((user) => (

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

                    <button
                      type="button"
                      className="text-gray-500 hover:text-violet-600 transition"
                      disabled
                      title="Edit will be wired next"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      className="text-gray-500 hover:text-red-600 transition"
                      disabled
                      title="Delete will be wired next"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

            {filteredContractors.length === 0 && (

              <tr>

                <td
                  colSpan="6"
                  className="px-5 py-10 text-center text-[13px] text-gray-500"
                >
                  No contractor users found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="flex items-center justify-between px-5 py-3 text-[12px] text-gray-500 border-t border-gray-100">

        <span>
          Showing {filteredContractors.length} of{" "}
          {contractorUsers.length} users
        </span>

        <div className="flex items-center gap-4">

          <span>
            Rows per page: 10
          </span>

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

      {/* Add Contractor Modal */}

      <AddUserModal
        open={showAddContractorModal}
        onClose={() => setShowAddContractorModal(false)}
        title="Add Contractor"
        role="ADMIN_LAYER_2"
        onSuccess={handleContractorCreated}
      />

    </div>
  );
};

export default ContractorUsers;