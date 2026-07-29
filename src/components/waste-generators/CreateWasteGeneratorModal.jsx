import { X } from "lucide-react";

export default function CreateWasteGeneratorModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[900px] rounded-2xl p-8 relative">
        <button onClick={onClose} className="absolute right-6 top-6">
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-8">Create Waste Generator</h2>

        <div className="grid grid-cols-2 gap-5">
          <input placeholder="Citizen Name" className="border rounded-xl p-4" />

          <input placeholder="Phone Number" className="border rounded-xl p-4" />

          <input placeholder="Wet RFID" className="border rounded-xl p-4" />

          <input placeholder="Dry RFID" className="border rounded-xl p-4" />

          <select className="border rounded-xl p-4">
            <option>Bangalore</option>
          </select>

          <select className="border rounded-xl p-4">
            <option>Select Zone</option>
          </select>

          <select className="border rounded-xl p-4">
            <option>Select Division</option>
          </select>

          <select className="border rounded-xl p-4">
            <option>Select Ward</option>
          </select>

          <input
            placeholder="Area"
            className="border rounded-xl p-4 col-span-2"
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="px-8 py-3 rounded-xl border">
            Cancel
          </button>

          <button className="px-8 py-3 rounded-xl bg-[#6D28D9] text-white">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
