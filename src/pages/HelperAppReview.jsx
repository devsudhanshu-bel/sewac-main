import KPISection from "../components/helperReview/KPISection";
import OperationalTrendChart from "../components/helperReview/OperationalTrendChart";
import ActivityContribution from "../components/helperReview/ActivityContribution";
import ActivityFeed from "../components/helperReview/ActivityFeed";
import TopActiveWorkers from "../components/helperReview/TopActiveWorkers";

export default function HelperAppReview() {
  return (
    <div className="px-8 py-6">

      <div>
        <h1 className="text-[34px] font-bold text-gray-900">
          Helper App Review
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Review performance and activity from Sewac Helper App
        </p>
      </div>

      <KPISection />

      <div className="grid grid-cols-[2fr_1fr] gap-5 mt-6">
        <OperationalTrendChart />
        <ActivityContribution />
      </div>

      <div className="grid grid-cols-[2.4fr_1.1fr] gap-5 mt-6 mb-8 items-stretch">
        <ActivityFeed />
        <TopActiveWorkers />
      </div>

    </div>
  );
}