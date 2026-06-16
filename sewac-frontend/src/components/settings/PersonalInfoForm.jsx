import { useState } from "react";

export default function PersonalInfoForm({ initialData, onSave, onNotify }) {
  // Local standalone state buffer capturing keystrokes without touching the parent system yet
  const [localFields, setLocalFields] = useState({ ...initialData });
  const [isSaving, setIsSaving] = useState(false);

  const handleFieldChange = (e, targetProperty) => {
    setLocalFields(prev => ({ ...prev, [targetProperty]: e.target.value }));
  };

  const handleCommitChanges = () => {
    setIsSaving(true);
    
    // Simulating save persistence window
    setTimeout(() => {
      setIsSaving(false);
      
      // Push localized state to parent, syncing ProfileCard all at once
      if (onSave) {
        onSave(localFields);
      }
      
      // Simplified notification message
      if (onNotify) {
        onNotify("Updated successfully", "success");
      }
    }, 700);
  };

  return (
    <div className="flex-1 self-start bg-white rounded-[18px] border border-[#efefef] shadow-sm overflow-hidden w-full">
      <div className="p-5">
        <h3 className="text-[16px] font-semibold text-[#1f2937]">Personal Information</h3>
        <p className="text-[12px] text-[#9ca3af] mt-1">Update your personal details and contact information.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">Full Name</label>
            <input
              type="text"
              value={localFields.fullName}
              onChange={(e) => handleFieldChange(e, "fullName")}
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">Email Address</label>
            <input
              type="email"
              value={localFields.email}
              onChange={(e) => handleFieldChange(e, "email")}
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">Phone Number</label>
            <input
              type="text"
              value={localFields.phone}
              onChange={(e) => handleFieldChange(e, "phone")}
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">Designation</label>
            <input
              type="text"
              value={localFields.designation}
              onChange={(e) => handleFieldChange(e, "designation")}
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">Department</label>
            <input
              type="text"
              value={localFields.department}
              onChange={(e) => handleFieldChange(e, "department")}
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
            />
          </div>

          {/* Organization */}
          <div>
            <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">Organization</label>
            <input
              type="text"
              value={localFields.organization}
              onChange={(e) => handleFieldChange(e, "organization")}
              className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
            />
          </div>
        </div>

        {/* Address */}
        <div className="mt-3">
          <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">Address</label>
          <input
            type="text"
            value={localFields.address}
            onChange={(e) => handleFieldChange(e, "address")}
            className="w-full h-[38px] px-4 border border-[#e5e7eb] rounded-[6px] text-[12px] text-[#1f2937] outline-none focus:border-pink-400 bg-white transition-colors"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleCommitChanges}
            disabled={isSaving}
            className="h-[36px] px-7 rounded-[6px] text-white text-[12px] font-medium bg-gradient-to-r from-[#ff4fa3] to-[#7c3aed] shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}