import { useState } from "react";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";

export default function ChangePasswordCard({ onNotify }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation Error States for individual inputs
  const [errors, setErrors] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Real-time strength criteria checks
  const passwordCriteria = {
    minLength: newPassword.length >= 8,
    hasNumber: /\d/.test(newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>_]/.test(newPassword),
  };

  // Calculate dynamic strength meter score
  const metCriteriaCount = Object.values(passwordCriteria).filter(Boolean).length;
  
  const getStrengthLabel = () => {
    if (!newPassword) return { text: "", color: "text-gray-400", bg: "bg-gray-200" };
    if (metCriteriaCount === 1) return { text: "Weak", color: "text-red-500", bg: "bg-red-500" };
    if (metCriteriaCount === 2) return { text: "Medium", color: "text-orange-500", bg: "bg-orange-500" };
    return { text: "Strong Password", color: "text-green-500", bg: "bg-green-500" };
  };

  const strength = getStrengthLabel();

  const handleUpdatePassword = () => {
    // Reset individual error highlights
    const newErrors = {
      current: !currentPassword,
      new: !newPassword || metCriteriaCount < 3,
      confirm: !confirmPassword || newPassword !== confirmPassword,
    };

    setErrors(newErrors);

    // 1. Check for empty fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      if (onNotify) onNotify("Please fill in all password fields.", "error");
      return;
    }

    // 2. Validate password criteria rules
    if (metCriteriaCount < 3) {
      if (onNotify) onNotify("New password does not meet requirements.", "error");
      return;
    }

    // 3. Check matching confirmation
    if (newPassword !== confirmPassword) {
      if (onNotify) onNotify("New passwords do not match!", "error");
      return;
    }

    // Success flow execution
    if (onNotify) onNotify("Updated successfully", "success");
    
    // Clear state inputs completely
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({ current: false, new: false, confirm: false });
  };

  return (
    <div className="bg-white rounded-[18px] border border-[#f1f1f1] shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[16px] font-semibold text-[#1f2937]">Change Password</h3>
          <p className="text-[12px] text-[#9ca3af] mt-1">Update your password regularly</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
          <Lock size={16} className="text-[#ff4fa3]" />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (errors.current) setErrors(prev => ({ ...prev, current: false }));
              }}
              className={`w-full h-[38px] px-4 pr-10 border rounded-[6px] text-[12px] outline-none transition-colors ${
                errors.current ? "border-red-500 focus:border-red-500 bg-red-50/10" : "border-[#e5e7eb] focus:border-pink-400"
              }`}
            />
            <button 
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1f2937]"
            >
              {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.new) setErrors(prev => ({ ...prev, new: false }));
              }}
              className={`w-full h-[38px] px-4 pr-10 border rounded-[6px] text-[12px] outline-none transition-colors ${
                errors.new ? "border-red-500 focus:border-red-500 bg-red-50/10" : "border-[#e5e7eb] focus:border-pink-400"
              }`}
            />
            <button 
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1f2937]"
            >
              {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {/* Real-Time Password Requirements UI Card Box */}
          {newPassword && (
            <div className="mt-2 p-2.5 bg-slate-50 border border-slate-100 rounded-[8px] space-y-1.5 transition-all">
              <div className="flex items-center justify-between text-[11px] mb-1 font-medium text-[#4b5563]">
                <span>Password Strength:</span>
                <span className={strength.color}>{strength.text}</span>
              </div>
              
              {/* Dynamic Progress Indicator Bar Lines */}
              <div className="grid grid-cols-3 gap-1 h-1 w-full mb-2">
                <div className={`h-full rounded-sm ${metCriteriaCount >= 1 ? strength.bg : "bg-gray-200"}`} />
                <div className={`h-full rounded-sm ${metCriteriaCount >= 2 ? strength.bg : "bg-gray-200"}`} />
                <div className={`h-full rounded-sm ${metCriteriaCount >= 3 ? strength.bg : "bg-gray-200"}`} />
              </div>

              {/* Requirement Bullet Checks */}
              <div className="space-y-1 text-[10px]">
                <div className="flex items-center gap-1.5">
                  {passwordCriteria.minLength ? <Check size={10} className="text-green-500" /> : <X size={10} className="text-gray-400" />}
                  <span className={passwordCriteria.minLength ? "text-green-600 font-medium" : "text-[#9ca3af]"}>At least 8 characters long</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {passwordCriteria.hasNumber ? <Check size={10} className="text-green-500" /> : <X size={10} className="text-gray-400" />}
                  <span className={passwordCriteria.hasNumber ? "text-green-600 font-medium" : "text-[#9ca3af]"}>Contains at least 1 number</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {passwordCriteria.hasSpecial ? <Check size={10} className="text-green-500" /> : <X size={10} className="text-gray-400" />}
                  <span className={passwordCriteria.hasSpecial ? "text-green-600 font-medium" : "text-[#9ca3af]"}>Contains 1 special character (!@#$%)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[11px] text-[#6b7280] mb-2 font-medium">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirm) setErrors(prev => ({ ...prev, confirm: false }));
              }}
              className={`w-full h-[38px] px-4 pr-10 border rounded-[6px] text-[12px] outline-none transition-colors ${
                errors.confirm ? "border-red-500 focus:border-red-500 bg-red-50/10" : "border-[#e5e7eb] focus:border-pink-400"
              }`}
            />
            <button 
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1f2937]"
            >
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-[10px] text-red-500 mt-1 font-medium">Passwords do not match.</p>
          )}
        </div>
      </div>

      <button
        onClick={handleUpdatePassword}
        className="mt-5 w-full h-[38px] rounded-[6px] text-white text-[12px] font-medium bg-gradient-to-r from-[#ff4fa3] to-[#7c3aed] cursor-pointer active:scale-[0.99] transition-all shadow-sm hover:opacity-95"
      >
        Update Password
      </button>
    </div>
  );
}