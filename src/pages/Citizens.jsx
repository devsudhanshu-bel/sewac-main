import CitizensFilters from "../components/citizens/CitizensFilters";
import CitizensStats from "../components/citizens/CitizensStats";
import ParticipationChart from "../components/citizens/ParticipationChart";
import WasteContribution from "../components/citizens/WasteContribution";
import CitizensHeatmap from "../components/citizens/CitizensHeatmap";
import CitizensTable from "../components/citizens/CitizensTable";

export default function Citizens() {
  return (
    <div className="px-8 py-6 space-y-6">

      <CitizensFilters />

      <CitizensStats />

      <div className="grid grid-cols-3 gap-5">
        <ParticipationChart />
        <WasteContribution />
        <CitizensHeatmap />
      </div>

      <CitizensTable />

    </div>
  );
}