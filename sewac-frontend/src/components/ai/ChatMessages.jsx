import AIMessage from "./AIMessage";
import SourceList from "./SourceList";
import TypingIndicator from "./TypingIndicator";
import UserMessage from "./UserMessage";
import VehicleTable from "./VehicleTable";

export default function ChatMessages() {
  return (
    <div
      className="
        flex-1
        overflow-y-auto
        bg-[#FCFCFE]
        px-8
        py-8
      "
    >
      <div
        className="
          flex
          min-h-full
          flex-col
          justify-end
          gap-8
          pb-4
        "
      >
        <UserMessage
          time="10:45 AM"
          message="Show all vehicles in Ward 23"
        />

        <AIMessage time="10:45 AM">
          <p className="text-[15px] leading-7 text-[#16295A]">
            Here are the vehicles currently active in Ward 23.
          </p>

          <VehicleTable />

          <SourceList />
        </AIMessage>

        <UserMessage
          time="10:47 AM"
          message="How many are currently collecting waste?"
        />

        <TypingIndicator />
      </div>
    </div>
  );
}