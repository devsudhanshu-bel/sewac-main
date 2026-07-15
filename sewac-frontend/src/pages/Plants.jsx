import Header from "../components/layouts/Header";

import PlantKPICards from "../components/plants/PlantKPICards";
import PlantLocations from "../components/plants/PlantLocations";
import PlantDirectory from "../components/plants/PlantDirectory";

export default function Plants() {
  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FD]">
      {/* Header */}
      <Header variant="dashboard" />

      {/* Page Content */}
      <div className="p-6">

        {/* Heading */}
        <div className="mb-8">

          <h1 className="text-[32px] font-bold text-[#16295A]">
            Plant Overview
          </h1>

          <p className="mt-2 text-[15px] text-[#667085]">
            Monitor all waste processing plants and their operations
          </p>

        </div>

        {/* KPI Cards */}
        <PlantKPICards />

        {/* Plant Locations */}
        <PlantLocations />

        {/* Plant Directory */}
        <PlantDirectory />

      </div>
    </div>
  );
}