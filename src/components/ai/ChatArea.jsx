import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function ChatArea() {
  return (
    <div
      className="
        mt-0
        flex
        h-[720px]
        flex-col
        overflow-hidden
        rounded-[24px]
        border
        border-[#E8ECF5]
        bg-white
        shadow-sm
      "
    >
      <ChatMessages />

      <ChatInput />
    </div>
  );
}