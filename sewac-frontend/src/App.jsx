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
  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">

        {/* Header */}
        <Header />

        {/* Filters */}
        <FilterBar />

        {/* Stats Cards */}
        <div className="mt-2">
          <StatsCards />
        </div>

        {/* Map + Live Vehicles */}
        <div className="px-8 mt-5 mb-6">
          <div className="flex gap-5">

            {/* Map */}
            <div className="flex-1 min-w-0">
              <MapSection />
            </div>

            {/* Live Vehicles */}
            <div className="w-[330px] shrink-0 flex">
              <LiveVehicles />
            </div>

          </div>
        </div>

        <div className="px-8 mt-6 mb-8">
          <div className="flex gap-5">

            {/* Collection Trend */}
            <div className="w-[28%]">
              <CollectionTrend />
            </div>

            {/* Waste Composition */}
            <div className="w-[22%]">
              <WasteComposition />
            </div>

            {/* Recent Alerts */}
            <div className="w-[22%]">
              <RecentAlerts />
            </div>

            {/* Top Workers */}
            <div className="w-[28%]">
              <TopWorkers />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}