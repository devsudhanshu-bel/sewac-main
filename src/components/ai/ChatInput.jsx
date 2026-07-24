import {
  Paperclip,
  Mic,
  Send,
} from "lucide-react";

export default function ChatInput() {
  return (
    <div
      className="
        border-t
        border-[#EEF1F6]
        bg-white
        px-6
        py-5
      "
    >
      <div
        className="
          flex
          h-[60px]
          items-center
          gap-4
          rounded-2xl
          border
          border-[#E8ECF5]
          bg-white
          px-4
        "
      >
        {/* Attachment */}

        <button
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-[#E8ECF5]
            transition
            hover:bg-violet-50
          "
        >
          <Paperclip
            size={18}
            className="text-[#16295A]"
          />
        </button>

        {/* Input */}

        <input
          type="text"
          placeholder="Ask anything about SEWAC..."
          className="
            flex-1
            bg-transparent
            text-[15px]
            text-[#16295A]
            outline-none
            placeholder:text-[#98A2B3]
          "
        />

        {/* Voice */}

        <button
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-violet-50
            text-violet-700
            transition
            hover:bg-violet-100
          "
        >
          <Mic size={18} />
        </button>

        {/* Send */}

        <button
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-gradient-to-r
            from-violet-600
            to-purple-700
            text-white
            transition
            hover:scale-105
          "
        >
          <Send size={18} />
        </button>
      </div>

      <p
        className="
          mt-4
          text-center
          text-[12px]
          text-[#98A2B3]
        "
      >
        SEWAC AI can make mistakes. Please verify important information.
      </p>
    </div>
  );
}