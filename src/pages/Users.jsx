import Header from "../components/layouts/Header";

import AdminUsers from "../components/users/AdminUsers";
import ContractorUsers from "../components/users/ContractorUsers";

import { useLanguage } from "../i18n";

const Users = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FD]">
      <Header variant="default" />

      <div className="px-8 py-7">

        {/* Page Header */}

        <div className="mb-6">
          <h1 className="text-[24px] font-semibold text-[#1F2937]">
            {t(
              "users.title",
              "Users"
            )}
          </h1>

          <p className="mt-1 text-[13px] text-gray-500">
            {t(
              "users.description",
              "Create and manage users in the system."
            )}
          </p>
        </div>

        {/* Admin Level 1 */}

        <AdminUsers />

        {/* Contractor */}

        <div className="mt-5">
          <ContractorUsers />
        </div>

        {/* Footer */}

        <div className="mt-8 pb-3 text-center text-[12px] text-gray-500">
          {t(
            "users.footer",
            "© 2025 SEWAC. All rights reserved."
          )}
        </div>

      </div>
    </div>
  );
};

export default Users;