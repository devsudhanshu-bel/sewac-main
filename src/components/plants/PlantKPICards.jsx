import {
  Factory,
  Truck,
  Recycle,
} from "lucide-react";

export default function PlantKPICards({ data }) {
  const kpis = [
    {
      title: "Total Plants",
      value: (data?.totalPlants ?? 0).toLocaleString(),
      subtitle: "All registered plants",
      icon: Factory,
      bg: "bg-violet-100",
      color: "text-violet-600",
    },
    {
      title: "Total Vehicles Enrolled",
      value: (data?.totalVehiclesEnrolled ?? 0).toLocaleString(),
      subtitle: "Across all plants",
      icon: Truck,
      bg: "bg-emerald-100",
      color: "text-emerald-600",
    },
    {
      title: "Total Waste Collected",
      value: `${(
        data?.totalWasteCollected ?? 0
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} Ton`,
      subtitle: "All time collection",
      icon: Recycle,
      bg: "bg-orange-100",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-5">
      {kpis.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              bg-white
              border
              border-gray-200
              rounded-xl
              px-4
              py-4
              flex
              items-center
              gap-4
              shadow-sm
              min-h-[115px]
            "
          >
            {/* Icon */}

            <div
              className={`
                w-12
                h-12
                rounded-xl
                flex
                items-center
                justify-center
                shrink-0
                ${card.bg}
              `}
            >
              <Icon
                size={25}
                className={card.color}
                strokeWidth={2}
              />
            </div>

            {/* Text */}

            <div className="min-w-0 flex flex-col">
              <p className="text-[13px] font-medium text-gray-500">
                {card.title}
              </p>

              <h2 className="mt-1 text-[23px] font-bold text-gray-900 leading-tight truncate">
                {card.value}
              </h2>

              <p className="mt-1.5 text-[12px] text-indigo-600 font-medium">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}