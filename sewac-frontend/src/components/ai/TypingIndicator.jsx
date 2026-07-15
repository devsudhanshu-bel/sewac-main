import RobotIcon from "../../assets/robot_icon.png";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-4">

      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-violet-200
          bg-white
        "
      >
        <img
          src={RobotIcon}
          alt=""
          className="h-6 w-6"
        />
      </div>

      <div
        className="
          rounded-2xl
          border
          border-[#E8ECF5]
          bg-white
          px-5
          py-3
        "
      >
        <div className="flex items-center gap-2">

          <span className="text-[14px] text-[#667085]">
            SEWAC AI is typing
          </span>

          <div className="flex gap-1">

            <span className="h-2 w-2 rounded-full bg-violet-600 animate-bounce" />

            <span
              className="h-2 w-2 rounded-full bg-violet-500 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />

            <span
              className="h-2 w-2 rounded-full bg-violet-300 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />

          </div>

        </div>

      </div>

    </div>
  );
}