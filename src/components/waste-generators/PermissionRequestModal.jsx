import { useState } from "react";
import { X } from "lucide-react";

export default function PermissionRequestModal({
  open,
  onClose,
  action,
  onSubmit,
}) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Please enter a reason.");
      return;
    }

    onSubmit(reason);
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[600px] p-8 relative">
        <button onClick={onClose} className="absolute right-6 top-6">
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-2">Permission Required</h2>

        <p className="text-gray-500 mb-6">
          This <b>{action}</b> operation requires Admin Layer 1 approval.
        </p>

        <textarea
          rows={5}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for this request..."
          className="w-full border rounded-xl p-4 resize-none"
        />

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="border rounded-xl px-6 py-3">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#6D28D9] text-white rounded-xl px-6 py-3"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
}
