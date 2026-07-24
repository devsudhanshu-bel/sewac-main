import { User } from "lucide-react";

export default function UserMessage({
  message,
  time,
}) {
  return (
    <div className="flex justify-end">

      <div className="max-w-[72%]">

        <div className="mb-2 flex items-center justify-end gap-3">

          <span className="text-[12px] text-[#98A2B3]">
            {time}
          </span>

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-violet-50
            "
          >
            <User
              size={15}
              className="text-violet-700"
            />
          </div>

        </div>

        <div
          className="
            rounded-2xl
            rounded-tr-md
            bg-[#16295A]
            px-5
            py-3
            text-[15px]
            text-white
            shadow-sm
          "
        >
          {message}
        </div>

      </div>

    </div>
  );
}