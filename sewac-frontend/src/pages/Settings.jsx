import ProfileCard from "../components/settings/ProfileCard";
import PersonalInfoForm from "../components/settings/PersonalInfoForm";
import ChangePasswordCard from "../components/settings/ChangePasswordCard";
import PreferencesCard from "../components/settings/PreferencesCard";
import RecentActivity from "../components/settings/RecentActivity";
import ActiveSessions from "../components/settings/ActiveSessions";
import QuickActions from "../components/settings/QuickActions";

export default function Settings() {
  return (
    <div className="min-h-screen bg-[#fcf8fc] px-8 py-6 font-sans antialiased">

      {/* Header section matching exact text hierarchy */}
      <div className="mb-6 max-w-[1400px] mx-auto">
        <h1 className="text-[24px] font-bold text-[#0f172a]">
          Account Settings
        </h1>

        <p className="mt-0.5 text-[13px] text-[#64748b]">
          Manage your profile, security, preferences and account settings.
        </p>
      </div>

      {/* Main Grid Container - Splitting the dashboard into Left/Center content and Right sidebar cleanly */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-[1fr_320px] gap-6 items-start">
        
        {/* LEFT & CENTER CONTENT COLUMN */}
        <div className="flex flex-col gap-6">
          
          {/* Upper Info Row */}
          <div className="grid grid-cols-[260px_1fr] gap-6 items-start">
            <ProfileCard />
            <div className="pl-4">
              <PersonalInfoForm />
            </div>
          </div>

          {/* Lower Analytics/Sessions Row */}
          <div className="grid grid-cols-2 gap-6">
            <RecentActivity />
            <ActiveSessions />
          </div>

        </div>

        {/* RIGHT SIDEBAR COLUMN - Keeps password and preferences stacked perfectly flush */}
        <div className="flex flex-col gap-6">
          <ChangePasswordCard />
          <PreferencesCard />
          <QuickActions />
        </div>

      </div>

    </div>
  );
}