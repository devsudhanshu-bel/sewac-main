import Header from "../components/layouts/Header";

import OverviewKPIs from "../components/overview/OverviewKPIs";
import VehicleStats from "../components/overview/VehicleStats";
import CityOverviewMap from "../components/overview/CityOverviewMap";

const Overview = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFC]">
      {/* Header */}
      <Header />

      {/* Dashboard Content */}
      <main className="px-8 py-6 space-y-6">
        {/* KPI Cards */}
        <OverviewKPIs />

        {/* Vehicle Details + Generation Trend */}
        <VehicleStats />

        {/* City Overview Map */}
        <CityOverviewMap />
      </main>
    </div>
  );
};

export default Overview;