import RobotIcon from "../../assets/robot_icon.png";

import AIMessageHeader from "./AIMessageHeader";
import MessageActions from "./MessageActions";

export default function AIMessage({
  title = "SEWAC AI",
  time,
  children,
}) {
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
          shrink-0
        "
      >
        <img
          src={RobotIcon}
          alt=""
          className="h-6 w-6"
        />
      </div>

      <div className="flex-1">

        <AIMessageHeader
          title={title}
          time={time}
        />

        <div
          className="
            rounded-2xl
            border
            border-[#E8ECF5]
            bg-white
            p-5
          "
        >
          {children}

          <MessageActions />

        </div>

      </div>

    </div>
  );
}