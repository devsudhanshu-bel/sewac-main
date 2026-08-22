import {
  MessageCircleMore,
  Clock3,
  ShieldCheck,
  Check,
} from "lucide-react";

import ComplaintCard from "./ComplaintCard";
import { useLanguage } from "../../i18n/LanguageContext";

export default function ComplaintKPIs({ kpis = {} }) {
  const { t } = useLanguage();

  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-3
        sm:gap-4
        w-full
      "
    >
      {/* =====================================================
          TOTAL
      ===================================================== */}

      <ComplaintCard
        icon={
          <MessageCircleMore
            size={20}
            strokeWidth={2.2}
          />
        }
        title={t(
          "complaints.kpis.total",
          "Total Complaints"
        )}
        value={kpis.total ?? 0}
        subtitle={t(
          "complaints.kpis.allComplaints",
          "All complaints"
        )}
        color="purple"
      />

      {/* =====================================================
          PENDING
      ===================================================== */}

      <ComplaintCard
        icon={
          <Clock3
            size={20}
            strokeWidth={2.2}
          />
        }
        title={t(
          "complaints.kpis.pending",
          "Pending"
        )}
        value={kpis.pending ?? 0}
        color="yellow"
      />

      {/* =====================================================
          READY FOR VERIFICATION
      ===================================================== */}

      <ComplaintCard
        icon={
          <ShieldCheck
            size={20}
            strokeWidth={2.2}
          />
        }
        title={t(
          "complaints.kpis.readyForVerification",
          "Ready for Verification"
        )}
        value={
          kpis.readyForVerification ?? 0
        }
        color="blue"
      />

      {/* =====================================================
          CLOSED
      ===================================================== */}

      <ComplaintCard
        icon={
          <Check
            size={20}
            strokeWidth={2.2}
          />
        }
        title={t(
          "complaints.kpis.closed",
          "Closed"
        )}
        value={kpis.closed ?? 0}
        subtitle={t(
          "complaints.kpis.citizenVerified",
          "Citizen verified"
        )}
        color="green"
      />
    </div>
  );
}