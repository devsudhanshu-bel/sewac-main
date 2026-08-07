import Header from "../components/layouts/Header";

import ComplaintHeader from "../components/complaints/ComplaintHeader";
import ComplaintKPIs from "../components/complaints/ComplaintKPIs";

export default function Complaints() {
  return (
    <div className="flex flex-col h-full bg-[#F8F9FC]">
      <Header variant="default" />

      <div className="px-8 py-8 space-y-8">
        <ComplaintHeader />

        <ComplaintKPIs />
      </div>
    </div>
  );
}