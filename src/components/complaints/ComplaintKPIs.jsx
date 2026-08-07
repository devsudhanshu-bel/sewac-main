import {
  MessageCircleMore,
  Clock3,
  RefreshCcw,
  Check,
} from "lucide-react";

import ComplaintCard from "./ComplaintCard";

export default function ComplaintKPIs() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <ComplaintCard
        icon={<MessageCircleMore size={26} strokeWidth={2.2} />}
        title="Total Complaints"
        value="143"
        subtitle="All time"
        color="purple"
      />

      <ComplaintCard
        icon={<Clock3 size={26} strokeWidth={2.2} />}
        title="Pending"
        value="27"
        subtitle="18.9%"
        color="yellow"
      />

      <ComplaintCard
        icon={<RefreshCcw size={26} strokeWidth={2.2} />}
        title="In Progress"
        value="14"
        subtitle="9.8%"
        color="blue"
      />

      <ComplaintCard
        icon={<Check size={26} strokeWidth={2.2} />}
        title="Resolved"
        value="102"
        subtitle="71.3%"
        color="green"
      />
    </div>
  );
}