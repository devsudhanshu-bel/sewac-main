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
  const theme = colors[color];

  return (
    <div
      className="
        h-[92px]
        rounded-2xl
        border
        border-gray-100
        bg-white
        px-5
        py-4
        shadow-[0_6px_20px_rgba(0,0,0,0.04)]
        transition-all
        duration-300
        hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)]
      "
    >
      <div className="flex items-center gap-4 h-full">
        <div
          className={`
            w-12
            h-12
            rounded-2xl
            flex
            items-center
            justify-center
            ${theme.bg}
          `}
        >
          <div className={theme.icon}>
            {icon}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-[12px] text-gray-500 font-medium">
            {title}
          </span>

          <h2 className="mt-0.5 text-[28px] font-bold leading-none text-[#16295A]">
            {value}
          </h2>

          <span
            className={`mt-1 text-[11px] font-semibold ${theme.accent}`}
          >
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}