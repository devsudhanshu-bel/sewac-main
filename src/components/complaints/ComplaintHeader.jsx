import { useLanguage } from "../../i18n/LanguageContext";

export default function ComplaintHeader() {
  const { t } = useLanguage();

  return (
    <div className="w-full">
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