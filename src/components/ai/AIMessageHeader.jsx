export default function AIMessageHeader({
  title = "SEWAC AI",
  time,
}) {
  return (
    <div className="flex items-center gap-3 mb-4">

      <h4 className="font-semibold text-[#16295A]">
        {title}
      </h4>

      <span className="text-[12px] text-[#98A2B3]">
        {time}
      </span>

    </div>
  );
}