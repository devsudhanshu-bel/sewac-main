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
  color,
}) {
  const theme = colors[color];

  return (
    <div
      className="
        bg-white
        border
        border-gray-100
        rounded-2xl
        h-[88px]
        px-5
        flex
        items-center
        gap-4
        shadow-sm
        hover:shadow-md
        transition-all
      "
    >
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
        <div className={theme.icon}>{icon}</div>
      </div>

      <div className="flex flex-col">
        <span className="text-[12px] text-gray-500 font-medium">
          {title}
        </span>

        <span className="text-[26px] leading-none font-bold text-[#16295A] mt-1">
          {value}
        </span>

        <span className={`text-[11px] font-semibold mt-1 ${theme.accent}`}>
          {subtitle}
        </span>
      </div>
    </div>
  );
}