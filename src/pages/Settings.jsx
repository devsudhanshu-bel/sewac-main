import Header from "../components/layouts/Header";

import ProfileCard from "../components/settings/ProfileCard";
import PersonalInfoForm from "../components/settings/PersonalInfoForm";
import ChangePasswordCard from "../components/settings/ChangePasswordCard";
import PreferencesCard from "../components/settings/PreferencesCard";
import RecentActivity from "../components/settings/RecentActivity";
import ActiveSessions from "../components/settings/ActiveSessions";
import QuickActions from "../components/settings/QuickActions";

export default function Settings() {
  return (
    <div className="min-h-full">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header variant="default" />

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <div className="px-8 py-6">
        {/* ===================================================
            PAGE TITLE
        =================================================== */}

        <div className="mb-6 max-w-[1400px] mx-auto">
          <h1 className="text-[24px] font-bold text-[#0f172a]">
            Account Settings
          </h1>

          <p className="mt-0.5 text-[13px] text-[#64748b]">
            Manage your profile, security, preferences and
            account settings.
          </p>
        </div>

        {/* ===================================================
            MAIN SETTINGS GRID
        =================================================== */}

        <div
          className="
            max-w-[1400px]
            mx-auto
            grid
            grid-cols-[minmax(0,1fr)_320px]
            gap-6
            items-start
          "
        >
          {/* =================================================
              LEFT / CENTER CONTENT
          ================================================= */}

          <div className="flex flex-col gap-6">
            {/* ===============================================
                PROFILE + PERSONAL INFORMATION
            =============================================== */}

            <div
              className="
                grid
                grid-cols-[260px_minmax(0,1fr)]
                gap-6
                items-start
              "
            >
              {/* Profile */}

              <ProfileCard />

              {/* Personal Information */}

              <div className="pl-4">
                <PersonalInfoForm />
              </div>
            </div>

            {/* ===============================================
                ACTIVITY + SESSIONS
            =============================================== */}

            <div
              className="
                grid
                grid-cols-2
                gap-6
              "
            >
              <RecentActivity />

              <ActiveSessions />
            </div>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <div
            className="
              flex
              flex-col
              gap-6
            "
          >
            <ChangePasswordCard />

            <PreferencesCard />

            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}