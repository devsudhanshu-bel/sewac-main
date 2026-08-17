import {
  MessageCircleMore,
  Clock3,
 RefreshCcw,
  Check,
} from "lucide-react";

import ComplaintCard from "./ComplaintCard";

export default function ComplaintKPIs({ kpis = {}}) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <ComplaintCard
        icon={<MessageCircleMore size={20} strokeWidth={2.2} />}
        title="Total Complaints"
        value={kpis.total ?? 0}
        subtitle="All time"
        color="purple"
      />

      <ComplaintCard
        icon={<Clock3 size={20} strokeWidth={2.2} />}
        title="Pending"
        value={kpis.pending ?? 0}
        color="yellow"
      />

      <ComplaintCard
        icon={<RefreshCcw size={20} strokeWidth={2.2} />}
        title="In Progress"
        value={kpis.inProgress ?? 0}
        color="blue"
      />

      <ComplaintCard
        icon={<Check size={20} strokeWidth={2.2} />}
        title="Resolved"
        value={kpis.closed ?? 0}
        color="green"
      />
    </div>
  );
}