import {
  Plus,
  MessageSquarePlus,
  ChevronDown,
} from "lucide-react";

const history = {
  today: [
    {
      title: "Show all vehicles in Ward 23",
      time: "10:45 AM",
      messages: 2,
      active: true,
    },
    {
      title: "Plant capacity summary",
      time: "10:20 AM",
      messages: 3,
    },
    {
      title: "Waste generated today",
      time: "09:15 AM",
      messages: 2,
    },
  ],

  yesterday: [
    {
      title: "Collection summary report",
      time: "05:30 PM",
      messages: 4,
    },
    {
      title: "Missed collections analysis",
      time: "04:45 PM",
      messages: 2,
    },
  ],

  week: [
    {
      title: "Zone 5 waste trend",
      time: "16 May",
      messages: 3,
    },
    {
      title: "BBMP guidelines search",
      time: "15 May",
      messages: 2,
    },
    {
      title: "Vehicle VHC1024 details",
      time: "14 May",
      messages: 2,
    },
  ],
};

function Section({ title, chats }) {
  return (
    <div>

      {/* Section Heading */}

      <div className="flex items-center gap-2 mb-3">

        <div className="w-2 h-2 rounded-full bg-violet-600" />

        <p className="text-[15px] font-semibold text-[#374151]">
          {title}
        </p>

      </div>

      <div className="space-y-1">

        {chats.map((chat) => (
          <button
            key={chat.title}
            className={`
              w-full
              rounded-xl
              px-4
              py-3
              text-left
              transition-all

              ${
                chat.active
                  ? "bg-violet-50"
                  : "hover:bg-gray-50"
              }
            `}
          >
            <p
              className={`
                text-[15px]
                font-medium
                truncate

                ${
                  chat.active
                    ? "text-violet-700"
                    : "text-[#16295A]"
                }
              `}
            >
              {chat.title}
            </p>

            <div className="mt-1 flex items-center gap-3 text-[13px] text-[#667085]">

              <span>{chat.time}</span>

              <span>•</span>

              <span>{chat.messages} messages</span>

            </div>

          </button>
        ))}

      </div>

    </div>
  );
}

export default function ChatHistory() {
  return (
    <aside
      className="
        w-[340px]
        h-full
        rounded-[24px]
        border
        border-[#E7EAF4]
        bg-white
        shadow-sm
        flex
        flex-col
      "
    >

      {/* Header */}

      <div className="p-6 border-b border-[#EEF1F6]">

        <div className="flex items-center justify-between">

          <h2 className="text-[20px] font-bold text-[#16295A]">
            Chat History
          </h2>

          <button
            className="
              w-10
              h-10
              rounded-xl
              bg-violet-50
              text-violet-600
              flex
              items-center
              justify-center
              hover:bg-violet-100
              transition
            "
          >
            <MessageSquarePlus size={18} />
          </button>

        </div>

        <button
          className="
            mt-5
            w-full
            h-11
            rounded-xl
            border
            border-violet-400
            bg-white
            text-violet-700
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            hover:bg-violet-50
            transition
          "
        >
          <Plus size={18} />

          New Chat

        </button>

      </div>

      {/* History */}

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">

        <Section
          title="Today"
          chats={history.today}
        />

        <Section
          title="Yesterday"
          chats={history.yesterday}
        />

        <Section
          title="Previous 7 Days"
          chats={history.week}
        />

      </div>

      {/* Footer */}

      <div className="p-6 border-t border-[#EEF1F6]">

        <button
          className="
            w-full
            h-11
            rounded-xl
            border
            border-[#E7EAF4]
            text-violet-700
            font-medium
            flex
            items-center
            justify-center
            gap-2
            hover:bg-violet-50
            transition
          "
        >
          View More History

          <ChevronDown size={16} />

        </button>

      </div>

    </aside>
  );
}