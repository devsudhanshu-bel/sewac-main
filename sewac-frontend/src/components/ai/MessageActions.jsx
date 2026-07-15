import {
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

export default function MessageActions() {
  return (
    <div className="mt-5 flex items-center justify-end gap-4">

      <button className="transition hover:scale-110">
        <Copy
          size={17}
          className="text-[#667085] hover:text-violet-600"
        />
      </button>

      <button className="transition hover:scale-110">
        <ThumbsUp
          size={17}
          className="text-[#667085] hover:text-green-600"
        />
      </button>

      <button className="transition hover:scale-110">
        <ThumbsDown
          size={17}
          className="text-[#667085] hover:text-red-600"
        />
      </button>

    </div>
  );
}