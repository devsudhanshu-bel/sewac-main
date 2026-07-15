import Header from "../components/layouts/Header";

import LogsKPICard from "../components/logs/LogsKPICard";
import SystemLogsTable from "../components/logs/SystemLogsTable";

export default function Logs() {
  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FD]">
      {/* Header */}
      <Header variant="default" />

      {/* Page Content */}
      <div className="p-6">

        {/* Heading */}
        <div className="mb-2">

          <h1 className="text-[32px] font-bold text-[#16295A]">
            Logs Overview
          </h1>

          <p className="mt-2 text-[15px] text-[#667085]">
            Track and monitor all system activities and events
          </p>

        </div>

        {/* KPI Card */}
        <LogsKPICard />

        {/* System Logs */}
        <SystemLogsTable />

      </div>
    </div>
  );
}