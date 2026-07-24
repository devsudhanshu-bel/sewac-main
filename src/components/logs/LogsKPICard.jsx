import { FileText } from "lucide-react";

export default function LogsKPICard({ data }) {
  console.log("LogsKPICard data:", data);

  return (
    <div className="mt-8 inline-block">
      <div
        className="
          w-[270px]
          bg-white
          border
          border-gray-200
          rounded-2xl
          shadow-sm
          px-7
          py-8
          flex
          items-center
          gap-5
        "
      >
        {/* Icon */}
        <div
          className="
            w-16
            h-16
            rounded-2xl
            bg-violet-100
            flex
            items-center
            justify-center
          "
        >
          <FileText
            size={34}
            strokeWidth={2}
            className="text-violet-600"
          />
        </div>

        {/* Content */}
        <div>
          <p className="text-[15px] font-semibold text-gray-800">
            Total Logs
          </p>

          <h2 className="mt-0 text-[24px] font-bold text-[#111827]">
            {data?.totalLogs?.toLocaleString() || 0}
          </h2>

          <p className="mt-0 text-[14px] font-medium text-indigo-600">
            All time logs
          </p>
        </div>
      </div>
    </div>
  );
}