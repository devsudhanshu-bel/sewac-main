export default function ComplaintHeader() {
  return (
    <div className="w-full">
      {/* =====================================================
          PAGE TITLE
      ===================================================== */}

      <h1
        className="
          text-[20px]
          sm:text-[21px]
          lg:text-[22px]
          font-bold
          leading-tight
          text-[#16295A]
        "
      >
        Complaints
      </h1>

      {/* =====================================================
          PAGE DESCRIPTION
      ===================================================== */}

      <p
        className="
          mt-1
          text-[11px]
          sm:text-[12px]
          leading-5
          text-gray-500
        "
      >
        Manage and track citizen complaints
      </p>
    </div>
  );
}