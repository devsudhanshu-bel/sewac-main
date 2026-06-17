import {
  Crown,
  Medal,
  Award,
  UserCircle2,
} from "lucide-react";

const workers = [
  {
    rank: 1,
    name: "Ramesh Kumar",
    collections: 124,
    score: "92%",
    icon: Crown,
    color: "text-[#F4A940]",
  },
  {
    rank: 2,
    name: "Suresh Babu",
    collections: 118,
    score: "88%",
    icon: Medal,
    color: "text-gray-400",
  },
  {
    rank: 3,
    name: "Mahesh P.",
    collections: 104,
    score: "84%",
    icon: Award,
    color: "text-[#CD7F32]",
  },
  {
    rank: 4,
    name: "Shankar R.",
    collections: 96,
    score: "80%",
    icon: null,
    color: "text-gray-500",
  },
];

export default function TopActiveWorkers() {
  return (
    <div
      className="
        bg-white
        rounded-[28px]
        border
        border-gray-100
        shadow-sm
        h-[440px]
        p-5
        pb-7
        flex
        flex-col
        justify-between
        overflow-hidden
      "
    >
      <div>
        {/* Increased margin bottom here to create space below the header text */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[15px] font-semibold text-gray-900">
            Top Active Workers
          </h3>

          <button 
            className="
              text-[12px] 
              text-gray-500 
              font-medium 
              hover:text-gray-700 
              transition-colors 
              duration-200 
              active:scale-95 
              transform 
              outline-none
            "
          >
            This Week ▼
          </button>
        </div>

        <div className="flex flex-col gap-[18px]">
          {workers.map((worker) => {
            const RankIcon = worker.icon;

            return (
              <div
                key={worker.rank}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-6 flex justify-center items-center shrink-0">
                  {RankIcon ? (
                    <RankIcon
                      size={14}
                      className={`${worker.color} transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6`}
                    />
                  ) : (
                    <span className="text-[12px] font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-800 group-hover:font-bold">
                      {worker.rank}
                    </span>
                  )}
                </div>

                <UserCircle2
                  size={22}
                  className="text-gray-600 shrink-0 transition-colors duration-300 group-hover:text-purple-500"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] font-medium text-gray-900 transition-colors duration-300 group-hover:text-purple-600">
                      {worker.name}
                    </span>

                    <span className="text-[12px] font-semibold text-gray-600">
                      {worker.score}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 mb-2">
                    {worker.collections} Collections Logged
                  </p>

                  <div className="w-full h-[4px] rounded-full bg-purple-100 overflow-hidden">
                    <div
                      className="
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        from-pink-500
                        to-purple-500
                        transition-all
                        duration-1000
                        ease-out
                      "
                      style={{
                        width: worker.score,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        className="
          w-full
          h-[40px]
          rounded-xl
          border
          border-pink-200
          text-pink-500
          text-[13px]
          font-medium
          hover:bg-pink-50
          transition-all
          duration-100
          transform
          active:scale-[0.98]
          active:opacity-90
          outline-none
        "
      >
        View All Workers
      </button>
    </div>
  );
}