const colors = {
  purple: {
    bg: "bg-[#F4ECFF]",
    icon: "text-[#8B3DFF]",
    accent: "text-[#8B3DFF]",
  },

  yellow: {
    bg: "bg-[#FFF7E7]",
    icon: "text-[#F5A524]",
    accent: "text-[#F5A524]",
  },

  blue: {
    bg: "bg-[#EDF5FF]",
    icon: "text-[#2979FF]",
    accent: "text-[#2979FF]",
  },

  green: {
    bg: "bg-[#EAFBF3]",
    icon: "text-[#17B26A]",
    accent: "text-[#17B26A]",
  },
};

export default function ComplaintCard({
  icon,
  title,
  value,
  subtitle,
  color = "purple",
}) {
  const theme = colors[color] || colors.purple;

  return (
    <div
      className="
        w-full
        min-w-0
        rounded-2xl
        border
        border-gray-100
        bg-white
        shadow-sm
        transition-all
        duration-200
        hover:shadow-md

        px-4
        py-4

        sm:px-5
        sm:py-4

        lg:h-[88px]
        lg:py-0
      "
    >
      <div
        className="
          flex
          min-w-0
          items-center
          gap-3

          sm:gap-4

          lg:h-full
        "
      >
        {/* =====================================================
            ICON
        ===================================================== */}

        <div
          className={`
            flex
            shrink-0
            items-center
            justify-center
            rounded-2xl
            ${theme.bg}

            h-10
            w-10

            sm:h-11
            sm:w-11

            lg:h-12
            lg:w-12
          `}
        >
          <div
            className={`
              ${theme.icon}

              [&>svg]:h-5
              [&>svg]:w-5

              sm:[&>svg]:h-[21px]
              sm:[&>svg]:w-[21px]

              lg:[&>svg]:h-[22px]
              lg:[&>svg]:w-[22px]
            `}
          >
            {icon}
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div
          className="
            min-w-0
            flex-1
            overflow-hidden
          "
        >
          {/* TITLE */}

          <span
            className="
              block
              truncate
              font-medium
              text-gray-500

              text-[11px]

              sm:text-[12px]
            "
          >
            {title}
          </span>

          {/* VALUE */}

          <span
            className="
              mt-1
              block
              truncate
              leading-none
              font-bold
              text-[#16295A]

              text-[23px]

              sm:text-[25px]

              lg:text-[26px]
            "
          >
            {value}
          </span>

          {/* SUBTITLE */}

          <span
            className={`
              mt-1
              block
              truncate
              font-semibold

              text-[10px]

              sm:text-[11px]

              ${theme.accent}
            `}
          >
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}