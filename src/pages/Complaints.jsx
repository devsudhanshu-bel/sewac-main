import Header from "../components/layouts/Header";

import ComplaintHeader from "../components/complaints/ComplaintHeader";
import ComplaintKPIs from "../components/complaints/ComplaintKPIs";

export default function Complaints() {
  return (
    <div className="flex flex-col h-full bg-[#F8F9FC]">
      <Header variant="default" />

      <div className="flex gap-8 px-8 py-6">
        {/* ================= LEFT ================= */}
        <div className="flex-1 min-w-0 space-y-6">
          <ComplaintHeader />

          <ComplaintKPIs />

          {/* Filters */}

          {/* Complaint Table */}
        </div>

        {/* ================= RIGHT ================= */}
        <div className="w-[370px] shrink-0">
          {/* Complaint Details Drawer */}
        </div>
      </div>
    </div>
  );
}