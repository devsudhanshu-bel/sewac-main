import Header from "../components/layouts/Header";

import ComplaintHeader from "../components/complaints/ComplaintHeader";
import ComplaintKPIs from "../components/complaints/ComplaintKPIs";
import ComplaintDetails from "../components/complaints/ComplaintDetails";

export default function Complaints() {
  return (
    <div className="flex flex-col h-full bg-[#F8F9FC]">
      {/* ================= HEADER ================= */}

      <Header variant="default" />

      {/* ================= PAGE CONTENT ================= */}

      <div className="flex gap-6 px-8 py-6">
        {/* ================= LEFT ================= */}

        <div className="flex-1 min-w-0 space-y-6">
          <ComplaintHeader />

          <ComplaintKPIs />

          {/* Filters will go here */}

          {/* Complaint Table will go here */}
        </div>

        {/* ================= RIGHT ================= */}

        <div className="w-[370px] shrink-0">
          <ComplaintDetails />
        </div>
      </div>
    </div>
  );
}