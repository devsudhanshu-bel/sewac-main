import {
  ChevronDown,
  Link2,
} from "lucide-react";

export default function SourceList() {
  return (
    <div className="mt-5">

      <button
        className="
          flex
          items-center
          gap-2
          rounded-lg
          bg-violet-50
          px-3
          py-2
          text-[13px]
          font-medium
          text-violet-700
        "
      >
        <Link2 size={15} />

        Sources (3)

        <ChevronDown size={15} />

      </button>

    </div>
  );
}