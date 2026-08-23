import { MessageCircleMore, Clock3, ShieldCheck, Check } from "lucide-react";

import { useEffect, useRef } from "react";

import ComplaintCard from "./ComplaintCard";
import { useLanguage } from "../../i18n/LanguageContext";

export default function ComplaintKPIs({ kpis = {} }) {
  const { t } = useLanguage();

  const kpisRef = useRef(null);

  useEffect(() => {
    if (!kpisRef.current) return;

    const cards = kpisRef.current.children;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 24,
          scale: 0.97,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
    }, kpisRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={kpisRef}
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
      <ComplaintCard
        icon={<MessageCircleMore size={20} strokeWidth={2.2} />}
        title={t("complaints.kpis.total", "Total Complaints")}
        value={kpis.total ?? 0}
        subtitle={t("complaints.kpis.allComplaints", "All complaints")}
        color="purple"
      />

      <ComplaintCard
        icon={<Clock3 size={20} strokeWidth={2.2} />}
        title={t("complaints.kpis.pending", "Pending")}
        value={kpis.pending ?? 0}
        color="yellow"
      />

      <ComplaintCard
        icon={<ShieldCheck size={20} strokeWidth={2.2} />}
        title={t(
          "complaints.kpis.readyForVerification",
          "Ready for Verification",
        )}
        value={kpis.readyForVerification ?? 0}
        color="blue"
      />

      <ComplaintCard
        icon={<Check size={20} strokeWidth={2.2} />}
        title={t("complaints.kpis.closed", "Closed")}
        value={kpis.closed ?? 0}
        subtitle={t("complaints.kpis.citizenVerified", "Citizen verified")}
        color="green"
      />
    </div>
  );
}
