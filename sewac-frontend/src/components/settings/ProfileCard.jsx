import {
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Camera,
} from "lucide-react";

export default function ProfileCard() {
  return (
    <div className="w-[280px] bg-white rounded-[22px] border border-[#f1f1f1] shadow-sm overflow-hidden self-start">

      {/* Banner */}
      <div className="relative h-[120px] overflow-hidden bg-gradient-to-r from-[#ff4fa3] via-[#e642ff] to-[#8b3dff]">

        {/* White wave */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[100%]" />
      </div>

      <div className="relative px-5 pb-5 flex flex-col items-center">

        {/* Avatar */}
        <div className="-mt-12 relative">
          <div className="w-[90px] h-[90px] rounded-full border-4 border-white overflow-hidden shadow-md">
            <img
              src="https://i.pravatar.cc/300?img=12"
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-1 right-0 w-6 h-6 bg-[#f3ebff] rounded-full flex items-center justify-center border border-white">
            <Camera size={12} className="text-[#8b3dff]" />
          </div>
        </div>

        {/* Name */}
        <h3 className="mt-3 text-[18px] font-semibold text-[#1f2937]">
          Admin
        </h3>

        {/* Badge */}
        <span className="mt-2 px-3 py-1 rounded-full bg-[#f3ebff] text-[#8b3dff] text-[10px] font-medium">
          Super Admin
        </span>

        {/* Info */}
        <div className="w-full mt-6 space-y-4">

          <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
            <Mail size={14} />
            <span>admin@sewac.in</span>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
            <Phone size={14} />
            <span>+91 98765 43210</span>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
            <MapPin size={14} />
            <span>Bengaluru City Corporation</span>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
            <CalendarDays size={14} />
            <span>Joined on 15 Jan 2024</span>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
            <Clock3 size={14} />

            <span>
              Last login: Today, 08:45 AM
            </span>

            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          </div>

        </div>

        {/* Button */}
        <button
          className="
            mt-6
            w-full
            h-[40px]
            rounded-[8px]
            border
            border-[#ffb7d9]
            text-[#ff4fa3]
            text-[12px]
            font-medium
            hover:bg-pink-50
            transition
          "
        >
          View Profile
        </button>

      </div>
    </div>
  );
}