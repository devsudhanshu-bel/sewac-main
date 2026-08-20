import { MessageCircleMore, Clock3, ShieldCheck, Check } from "lucide-react";

import ComplaintCard from "./ComplaintCard";

export default function ComplaintKPIs({ kpis = {} }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* =====================================================
          TOTAL
      ===================================================== */}

      <ComplaintCard
        icon={<MessageCircleMore size={20} strokeWidth={2.2} />}
        title="Total Complaints"
        value={kpis.total ?? 0}
        subtitle="All complaints"
        color="purple"
      />

      {/* =====================================================
          PENDING
      ===================================================== */}

      <ComplaintCard
        icon={<Clock3 size={20} strokeWidth={2.2} />}
        title="Pending"
        value={kpis.pending ?? 0}
        subtitle="Awaiting resolution"
        color="yellow"
      />

      {/* =====================================================
          READY FOR VERIFICATION
      ===================================================== */}

      <ComplaintCard
        icon={<ShieldCheck size={20} strokeWidth={2.2} />}
        title="Ready for Verification"
        value={kpis.readyForVerification ?? 0}
        subtitle="Awaiting citizen verification"
        color="blue"
      />

      {/* =====================================================
          CLOSED
      ===================================================== */}

      <ComplaintCard
        icon={<Check size={20} strokeWidth={2.2} />}
        title="Closed"
        value={kpis.closed ?? 0}
        subtitle="Citizen verified"
        color="green"
      />
    </div>
  );
}
