import Header from "../components/layouts/Header";

import AIHero from "../components/ai/AIHero";
import ChatArea from "../components/ai/ChatArea";
import ChatHistory from "../components/ai/ChatHistory";

export default function AI() {
  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FD]">
      <Header variant="default" />

      <div className="px-8 py-8">
        <div className="flex gap-8">

          {/* ================= Left Section ================= */}

          <div className="flex-1 flex flex-col gap-2 min-w-0">

            <AIHero />

            <ChatArea />

          </div>

          {/* ================= Right Section ================= */}

          <div className="w-[340px] shrink-0 sticky top-8 self-start">

            <ChatHistory />

          </div>

        </div>
      </div>
    </div>
  );
}