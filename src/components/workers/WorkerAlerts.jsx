import {
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";

import { alertsData } from "./workersData";

export default function WorkerAlerts() {
  const getIcon = (type) => {
    switch (type) {
      case "warning":
        return (
          <AlertTriangle
            size={18}
            className="text-orange-500"
          />
        );

      case "success":
        return (
          <CheckCircle2
            size={18}
            className="text-green-500"
          />
        );

      default:
        return (
          <Info
            size={18}
            className="text-blue-500"
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 h-[420px] flex flex-col">

      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Alerts & Notifications
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Latest worker updates
        </p>
      </div>

      {/* Alert List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">

        {alertsData.map((alert) => (
          <div
            key={alert.id}
            className="
              flex
              gap-3
              p-4
              rounded-2xl
              bg-gray-50
              hover:bg-gray-100
              transition
            "
          >
            <div className="mt-1">
              {getIcon(alert.type)}
            </div>

            <div className="flex-1">

              <p className="text-sm text-gray-700 leading-relaxed">
                {alert.message}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {alert.time}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}