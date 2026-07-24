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
      value: `${(data?.totalWasteCollected ?? 0).toLocaleString(undefined, {
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
    <div className="grid grid-cols-3 gap-6">
      {kpis.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              px-5
              py-5
              flex
              items-center
              gap-5
              shadow-sm
              h-[150px]
            "
          >
            {/* Icon */}

            <div
              className={`
                w-16
                h-16
                rounded-2xl
                flex
                items-center
                justify-center
                ${card.bg}
              `}
            >
              <Icon
                size={34}
                className={card.color}
                strokeWidth={2}
              />
            </div>

            {/* Text */}

            <div className="flex flex-col">
              <p className="text-[16px] font-semibold text-gray-800">
                {card.title}
              </p>

              <h2 className="mt-2 text-[28px] font-bold text-gray-900 leading-none">
                {card.value}
              </h2>

              <p className="mt-3 text-[15px] text-indigo-600 font-medium">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}