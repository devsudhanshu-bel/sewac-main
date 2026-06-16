import { useRef, useState } from "react";
import { CalendarDays, Clock3, Mail, MapPin, Phone, Camera } from "lucide-react";

export default function ProfileCard({ data }) {
  // Local state to manage the avatar image source URL smoothly
  const [avatarUrl, setAvatarUrl] = useState("https://i.pravatar.cc/300?img=12");
  
  // Reference hook connecting the design badge directly to a hidden input stream
  const fileInputRef = useRef(null);

  const handleCameraClick = () => {
    // Triggers the hidden file selector browser view windows seamlessly
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate that the uploaded file type is strictly an image file
      if (!selectedFile.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }
      
      // Create a temporary fluid visual runtime pointer location for rendering
      const temporaryLocalUrl = URL.createObjectURL(selectedFile);
      setAvatarUrl(temporaryLocalUrl);
    }
  };

  return (
    <div className="w-[280px] bg-white rounded-[22px] border border-[#f1f1f1] shadow-sm overflow-hidden self-start">
      {/* Banner */}
      <div className="relative h-[120px] overflow-hidden bg-gradient-to-r from-[#ff4fa3] via-[#e642ff] to-[#8b3dff]">
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-[100%]" />
      </div>

      <div className="relative px-5 pb-8 flex flex-col items-center">
        {/* Avatar */}
        <div className="-mt-12 relative group">
          <div className="w-[90px] h-[90px] rounded-full border-4 border-white overflow-hidden shadow-md bg-gray-100">
            <img
              src={avatarUrl}
              alt="Admin Profile"
              className="w-full h-full object-cover transition-opacity duration-200"
            />
          </div>
          
          {/* Hidden Input Loader for File Tracking streams */}
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Interactive Trigger Badge Layer Overlay */}
          <button
            onClick={handleCameraClick}
            type="button"
            className="absolute bottom-1 right-0 w-6 h-6 bg-[#f3ebff] rounded-full flex items-center justify-center border border-white shadow-sm hover:bg-[#e9daff] active:scale-95 transition-all cursor-pointer group-hover:scale-105"
            title="Change avatar picture"
          >
            <Camera size={12} className="text-[#8b3dff]" />
          </button>
        </div>

        {/* Dynamic Name reading directly from the unified parent hub */}
        <h3 className="mt-3 text-[18px] font-semibold text-[#1f2937] tracking-tight">
          {data.fullName || "Admin"}
        </h3>

        <span className="mt-2 px-3 py-1 rounded-full bg-[#f3ebff] text-[#8b3dff] text-[10px] font-medium">
          Super Admin
        </span>

        {/* Info */}
        <div className="w-full mt-6 space-y-4">
          <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
            <Mail size={14} className="shrink-0" />
            <span className="truncate">{data.email}</span>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
            <Phone size={14} className="shrink-0" />
            <span>{data.phone}</span>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{data.organization}</span>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
            <CalendarDays size={14} className="shrink-0" />
            <span>Joined on 15 Jan 2024</span>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-[#6b7280]">
            <Clock3 size={14} className="shrink-0" />
            <span>Last login: Today, 08:45 AM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}