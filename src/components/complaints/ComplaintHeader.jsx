import { useEffect, useRef } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { gsap } from "gsap";

export default function ComplaintHeader() {
  const { t } = useLanguage();

  const headerRef = useRef(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        {
          opacity: 0,
          y: -18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        },
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={headerRef} className="w-full">
      {/* =====================================================
          PAGE TITLE
      ===================================================== */}

      <h1
        className="
          text-[20px]
          font-bold
          leading-tight
          text-[#16295A]

          sm:text-[21px]

          lg:text-[22px]
        "
      >
        {t("complaints.title")}
      </h1>

      {/* =====================================================
          PAGE DESCRIPTION
      ===================================================== */}

      <p
        className="
          mt-1
          text-[11px]
          leading-5
          text-gray-500

          sm:text-[12px]
        "
      >
        {t("complaints.description")}
      </p>
    </div>
  );
}
