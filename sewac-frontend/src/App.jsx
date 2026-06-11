import { useLocation } from "react-router-dom";

import Citizens from "./pages/Citizens";
import Workers from "./pages/Workers";

import Sidebar from "./components/layouts/Sidebar";
import Header from "./components/layouts/Header";

import FilterBar from "./components/dashboard/FilterBar";
import StatsCards from "./components/dashboard/StatsCards";
import MapSection from "./components/dashboard/MapSection";
import LiveVehicles from "./components/dashboard/LiveVehicles";
import CollectionTrend from "./components/dashboard/CollectionTrend";
import WasteComposition from "./components/dashboard/WasteComposition";
import RecentAlerts from "./components/dashboard/RecentAlerts";
import TopWorkers from "./components/dashboard/TopWorkers";

export default function App() {
  const location = useLocation();

  // ================= OVERVIEW =================
  if (
    location.pathname === "/admin-overview" ||
    location.pathname === "/"
  ) {
    return (
      <div className="flex h-screen bg-[#fafafa] overflow-hidden">

        <Sidebar />

        <div className="flex-1 overflow-y-auto">

          <Header />

          <FilterBar />

          <div className="mt-2">
            <StatsCards />
          </div>

          <div className="px-8 mt-5 mb-6">
            <div className="flex gap-5">

              <div className="flex-1 min-w-0">
                <MapSection />
              </div>

              <div className="w-[330px] shrink-0 flex">
                <LiveVehicles />
              </div>

            </div>
          </div>

          <div className="px-8 mt-6 mb-8">
            <div className="flex gap-5">

              <div className="w-[28%]">
                <CollectionTrend />
              </div>

              <div className="w-[22%]">
                <WasteComposition />
              </div>

              <div className="w-[22%]">
                <RecentAlerts />
              </div>

              <div className="w-[28%]">
                <TopWorkers />
              </div>

            </div>
          </div>

        </div>

      </div>
    );
  }

  // ================= CITIZENS =================
  if (location.pathname === "/admin-citizens") {
    return (
      <div className="flex h-screen bg-[#fafafa] overflow-hidden">

        <Sidebar />

        <div className="flex-1 overflow-y-auto">
          <Header />
          <Citizens />
        </div>

      </div>
    );
  }

  // ================= WORKERS =================
  if (location.pathname === "/admin-workers") {
    return (
      <div className="flex h-screen bg-[#fafafa] overflow-hidden">

        <Sidebar />

        <div className="flex-1 overflow-y-auto">
          <Header />
          <Workers />
        </div>

      </div>
    );
  }

  // ================= FALLBACK =================
  return (
    <div className="flex h-screen bg-[#fafafa]">

      <Sidebar />

      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-2xl font-semibold">
          Page not found
        </h1>
      </div>

    </div>
  );
}