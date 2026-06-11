import {
  Trophy,
  Medal,
  Award,
} from "lucide-react";

import { rankingData } from "./workersData";

export default function WorkerEfficiencyRanking() {

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy size={18} className="text-yellow-500" />;

      case 2:
        return <Medal size={18} className="text-gray-400" />;

      case 3:
        return <Award size={18} className="text-orange-500" />;

      default:
        return (
          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

      <div className="flex items-center justify-between mb-5">

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Worker Efficiency Ranking
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Top performing workers this week
          </p>
        </div>

        <button className="text-sm font-medium text-purple-600">
          View All
        </button>

      </div>

      <div className="space-y-4">

        {rankingData.map((worker) => (
          <div
            key={worker.rank}
            className="flex items-center justify-between"
          >

            <div className="flex items-center gap-3">

              {getRankIcon(worker.rank)}

              <div>

                <p className="text-sm font-medium text-gray-800">
                  {worker.name}
                </p>

                <p className="text-xs text-gray-500">
                  Rank #{worker.rank}
                </p>

              </div>

            </div>

            <div className="w-32">

              <div className="flex justify-between text-xs mb-1">

                <span className="text-gray-500">
                  {worker.score}%
                </span>

              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${worker.score}%`,
                  }}
                />

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}