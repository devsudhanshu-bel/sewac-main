import React from "react";
import { Building2, Plus, Search } from "lucide-react";

import UserTable from "./UserTable";

const contractorUsers = [
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
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-semibold text-gray-900">
                  Contractor Users
                </h2>
              </div>

              <p className="mt-0.5 text-[12px] text-gray-500">
                Manage contractor accounts and permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}

        <div className="mt-4 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search contractors..."
              className="w-full h-10 rounded-lg border border-gray-200 pl-10 pr-3 text-[13px] outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

<button className="h-10 px-5 rounded-lg border border-violet-600 text-violet-700 hover:bg-violet-600 hover:text-white transition text-[13px] font-medium flex items-center gap-2">            <Plus className="w-4 h-4" />

            Add Contractor
          </button>
        </div>
      </div>

      <UserTable users={contractorUsers} />
    </div>
  );
};

export default ContractorUsers;