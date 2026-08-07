const colors = {
  purple: {
    bg: "bg-[#F5EDFF]",
    icon: "text-[#8B3DFF]",
    accent: "text-[#8B3DFF]",
  },

  yellow: {
    bg: "bg-[#FFF7E6]",
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
        h-[118px]
        rounded-3xl
        border
        border-gray-100
        bg-white
        p-6
        shadow-[0_10px_30px_rgba(15,23,42,0.05)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)]
      "
    >
      <div className="flex items-start gap-4">
        <div
          className={`
            w-14
            h-14
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
          <span className="text-[13px] font-medium text-gray-500">
            {title}
          </span>

          <h2 className="mt-1 text-[36px] leading-none font-bold text-[#16295A]">
            {value}
          </h2>

          <span
            className={`mt-2 text-[13px] font-semibold ${theme.accent}`}
          >
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}