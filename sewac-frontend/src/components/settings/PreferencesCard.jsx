import {
  Globe,
  Monitor,
  Calendar,
  Clock,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";

export default function PreferencesCard() {
  const Row = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Icon
          size={14}
          className="text-[#7b8194]"
        />

        <span className="text-[12px] font-medium text-[#5f677a]">
          {label}
        </span>
      </div>

      <div className="relative">
        <select
          defaultValue={value}
          className="
            appearance-none
            w-[120px]
            h-[30px]
            rounded-[8px]
            border
            border-[#e6e8ef]
            bg-white
            pl-3
            pr-8
            text-[12px]
            font-medium
            text-[#374151]
            outline-none
            cursor-pointer
            focus:border-[#c084fc]
          "
        >
          <option>{value}</option>
        </select>

        <ChevronDown
          size={13}
          className="
            absolute
            right-2.5
            top-1/2
            -translate-y-1/2
            text-[#9ca3af]
            pointer-events-none
          "
        />
      </div>
    </div>
  );

  return (
    <div
      className="
        bg-white
        rounded-[18px]
        border
        border-[#f2f3f7]
        shadow-sm
        p-5
      "
    >
      <h3 className="text-[15px] font-semibold text-[#1f2937]">
        Preferences
      </h3>

      <p className="text-[11px] text-[#8c95a8] mt-1">
        Customize your experience
      </p>

      <div className="mt-5 space-y-4">
        <Row
          icon={Globe}
          label="Language"
          value="English"
        />

        <Row
          icon={Monitor}
          label="Theme"
          value="Light"
        />

        <Row
          icon={Calendar}
          label="Date Format"
          value="DD MMM YYYY"
        />

        <Row
          icon={Clock}
          label="Time Format"
          value="12 Hour (AM/PM)"
        />

        <Row
          icon={LayoutGrid}
          label="Default Dashboard"
          value="Overview"
        />
      </div>
    </div>
  );
}