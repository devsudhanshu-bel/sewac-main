import WorkersHeader from "../components/workers/WorkersHeader";
import WorkerStatsCards from "../components/workers/WorkerStatsCards";
import WorkerPerformanceChart from "../components/workers/WorkerPerformanceChart";
import WasteCollectedByType from "../components/workers/WasteCollectedByType";
import WorkerRouteOverview from "../components/workers/WorkerRouteOverview";
import WorkersTable from "../components/workers/WorkersTable";
import WorkerEfficiencyRanking from "../components/workers/WorkerEfficiencyRanking";
import WorkerAlerts from "../components/workers/WorkerAlerts";

export default function Workers() {
  return (
    <div className="px-8 py-6 bg-[#fafafa]">

      {/* Header */}
      <WorkersHeader />

      {/* Stats */}
      <div className="mt-6">
        <WorkerStatsCards />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-12 gap-5 mt-6">

        <div className="col-span-6">
          <WorkerPerformanceChart />
        </div>

        <div className="col-span-3">
          <WasteCollectedByType />
        </div>

        <div className="col-span-3">
          <WorkerRouteOverview />
        </div>

      </div>

      {/* Bottom */}
      <div className="grid grid-cols-12 gap-5 mt-6 items-start">

        {/* LEFT */}
        <div className="col-span-8">
          <WorkersTable />
        </div>

        {/* RIGHT */}
        <div className="col-span-4 flex flex-col gap-5">

          <WorkerEfficiencyRanking />

          <WorkerAlerts />

        </div>

      </div>

    </div>
  );
}