import { useState } from "react";
import ProfileCard from "../components/settings/ProfileCard";
import PersonalInfoForm from "../components/settings/PersonalInfoForm";
import ChangePasswordCard from "../components/settings/ChangePasswordCard";
import PreferencesCard from "../components/settings/PreferencesCard";
import RecentActivity from "../components/settings/RecentActivity";
import ActiveSessions from "../components/settings/ActiveSessions";

export default function Settings() {
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // Lifted state to control the page theme dynamically
  const [theme, setTheme] = useState("Light");

  // Confirmed, committed profile data displayed on the Profile Card
  const [confirmedProfile, setConfirmedProfile] = useState({
    fullName: "Admin",
    email: "metilda.sequiera@btech.christuniversity.in",
    phone: "+91 98765 43210",
    designation: "Super Administrator",
    department: "Waste Management",
    organization: "Bengaluru City Corporation",
    address: "4th Floor, Corporation Office, Bengaluru, Karnataka - 560002"
  });

  const triggerNotification = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  // Safely intercept if dark variant styling needs to be active
  const isDarkActive = theme.includes("Dark");

  return (
    // Conditional inject wrapper applying dark tokens to the nested card components
    <div className={`${isDarkActive ? "dark" : ""}`}>
      
      {/* Background set to remain permanently same (bg-[#fcf8fc]), only text shifts visibility parameters */}
      <div className="min-h-screen bg-[#fcf8fc] text-[#0f172a] dark:text-[#f8fafc] px-6 py-6 font-sans antialiased overflow-x-hidden relative transition-colors duration-300">
        
        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed top-5 right-5 z-50 flex items-center px-5 py-3 rounded-xl shadow-xl text-white text-[13px] font-medium transition-all duration-300 ${
            toast.type === "success" ? "bg-emerald-600 border border-green-400" : "bg-red-500"
          }`}>
            <span className="mr-2">⚡</span>
            {toast.message}
          </div>
        )}

        {/* Header section */}
        <div className="mb-6 max-w-[1400px] mx-auto w-full">
          <h1 className="text-[24px] font-bold text-[#0f172a] dark:text-[#0f172a] transition-colors">
            Account Settings
          </h1>
          <p className="mt-0.5 text-[13px] text-[#64748b]">
            Manage your profile, security, preferences and account settings.
          </p>
        </div>

        {/* Main Layout Container */}
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
          
          {/* LEFT & CENTER CONTENT COLUMN */}
          <div className="flex flex-col gap-6 w-full min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-6 items-start w-full">
              <div className="w-full sm:w-[260px] shrink-0">
                <ProfileCard data={confirmedProfile} />
              </div>
              <div className="w-full min-w-0 sm:pl-4">
                <PersonalInfoForm 
                  initialData={confirmedProfile} 
                  onSave={setConfirmedProfile} 
                  onNotify={triggerNotification} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <RecentActivity />
              <ActiveSessions onNotify={triggerNotification} />
            </div>
          </div>

          {/* RIGHT SIDEBAR COLUMN */}
          <div className="flex flex-col gap-6 w-full xl:w-[320px]">
            <ChangePasswordCard onNotify={triggerNotification} />
            
            <PreferencesCard 
              theme={theme} 
              setTheme={setTheme} 
              onNotify={triggerNotification} 
            />
          </div>

        </div>
      </div>
    </div>
  );
}