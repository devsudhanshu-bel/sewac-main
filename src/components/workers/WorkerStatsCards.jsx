import { workerStats } from "./workersData";
import {
  Users,
  UserCheck,
  MapPin,
  Trash2,
  Activity,
  Route,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const icons = [
  Users,
  UserCheck,
  MapPin,
  Trash2,
  Activity,
  Route,
];

export default function WorkerStatsCards() {
  return (
    <div className="grid grid-cols-6 gap-4">

      {workerStats.map((item, index) => {
        const Icon = icons[index];

        return (
          <div
            key={item.title}
            className="
              bg-white
              rounded-3xl
              p-5
              border
              border-gray-100
              shadow-sm
              hover:shadow-md
              transition
            "
          >

            {/* Top */}
            <div className="flex items-center justify-between">

              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-purple-100
                  flex
                  items-center
                  justify-center
                "
              >
                <Icon
                  size={22}
                  className="text-purple-600"
                />
              </div>

              <div
                className={`
                  flex items-center gap-1 text-xs font-semibold
                  ${
                    item.positive
                      ? "text-green-600"
                      : "text-red-500"
                  }
                `}
              >
                {item.positive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}

                {item.change}
              </div>

            </div>

            {/* Title */}
            <p className="text-gray-500 text-sm mt-4">
              {item.title}
            </p>

            {/* Value */}
            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {item.value}
            </h3>

          </div>
        );
      })}

    </div>
  );
}