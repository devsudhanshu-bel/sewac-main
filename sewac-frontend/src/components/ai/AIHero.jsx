import {
  Sparkles,
  Truck,
  Factory,
  TrendingUp,
  FileText,
} from "lucide-react";

import RobotIcon from "../../assets/robot_icon.png";

const prompts = [
  {
    icon: Truck,
    title: "Show Active",
    subtitle: "Vehicles",
  },
  {
    icon: Factory,
    title: "Plant Capacity",
    subtitle: "Summary",
  },
  {
    icon: TrendingUp,
    title: "Waste Generated",
    subtitle: "Today",
  },
  {
    icon: FileText,
    title: "Weekly",
    subtitle: "Report",
  },
];

export default function AIHero() {
  return (
    <div
      className="
        w-full
        rounded-[24px]
        border
        border-[#E8ECF5]
        bg-white
        shadow-sm
        px-8
        py-7
      "
    >
      {/* ================= HERO ================= */}

      <div className="flex items-center gap-4">

        {/* Robot */}

      <div
        className="
          w-[64px]
          h-[64px]
          rounded-full
          bg-white
          border-2
          border-[#E9DDFF]
          flex
          items-center
          justify-center
          shadow-[0_6px_18px_rgba(123,44,255,0.12)]
          shrink-0
        "
      >
        <img
          src={RobotIcon}
          alt="Robot"
          className="w-[100px] h-[100px] object-contain"
        />
      </div>

        {/* Heading */}

        <div>

          <div className="flex items-center gap-2">

            <h1 className="text-[22px] font-bold text-[#16295A] tracking-tight">
              SEWAC AI Assistant
            </h1>

            <Sparkles
              size={16}
              className="text-violet-600"
              fill="currentColor"
            />

          </div>

          <p className="mt-1 text-[13px] text-[#6B7280]">
            Powered by RAG + BBMP Knowledge Base
          </p>

        </div>

      </div>

      {/* Divider */}

      <div className="my-6 border-t border-[#EEF1F6]" />

      {/* Suggested */}

      <div>

        <div className="flex items-center justify-between">

          <h2 className="text-[17px] font-semibold text-[#16295A]">
            Suggested Prompts
          </h2>

          <span
            className="
              rounded-full
              bg-violet-50
              px-3
              py-1.5
              text-[12px]
              font-medium
              text-violet-600
            "
          >
            Quick Actions
          </span>

        </div>

        {/* Prompt Cards */}

        <div className="mt-5 grid grid-cols-4 gap-4">

          {prompts.map((prompt, index) => {
            const Icon = prompt.icon;

            return (
              <button
                key={index}
                className="
                  group
                  rounded-2xl
                  border
                  border-[#E8ECF5]
                  bg-white
                  p-5
                  transition-all
                  duration-300
                  hover:border-violet-300
                  hover:-translate-y-1
                  hover:shadow-md
                  text-left
                "
              >
                {/* Icon */}

                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-violet-100
                    flex
                    items-center
                    justify-center
                    mb-4
                    transition-all
                    duration-300
                    group-hover:bg-violet-600
                  "
                >
                  <Icon
                    size={20}
                    className="
                      text-violet-600
                      group-hover:text-white
                      transition-all
                      duration-300
                    "
                  />
                </div>

                <h3 className="text-[15px] font-semibold text-[#16295A] leading-5">
                  {prompt.title}
                </h3>

                <p className="mt-1 text-[13px] text-[#667085]">
                  {prompt.subtitle}
                </p>

              </button>
            );
          })}

        </div>

      </div>
    </div>
  );
}