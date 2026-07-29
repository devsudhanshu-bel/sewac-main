import { X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function CreateWasteGeneratorModal({
  open,
  onClose,
  onRequestPermission,
}) {
  if (!open) return null;
  const [form, setForm] = useState({
    personName: "",
    phoneNumber: "",
    wetRFID: "",
    dryRFID: "",
    city: "",
    zone: "",
    division: "",
    ward: "",
    area: "",
  });
  useEffect(() => {
    if (open) {
      loadCities();
    }
  }, [open]);

  const loadCities = async () => {
    try {
      const res = await api.get("/api/filters/cities");
      setCities(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadZones = async (cityId) => {
    try {
      const res = await api.get(`/api/filters/zones/${cityId}`);
      setZones(res.data.data);

      setDivisions([]);
      setWards([]);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDivisions = async (zoneId) => {
    try {
      const res = await api.get(`/api/filters/divisions/${zoneId}`);
      setDivisions(res.data.data);

      setWards([]);
    } catch (err) {
      console.error(err);
    }
  };

  const loadWards = async (divisionId) => {
    try {
      const res = await api.get(`/api/filters/wards/${divisionId}`);
      setWards(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [wards, setWards] = useState([]);

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

          <select
            className="border rounded-xl p-4"
            value={form.city}
            onChange={(e) => {
              const cityId = e.target.value;

              setForm({
                ...form,
                city: cityId,
                zone: "",
                division: "",
                ward: "",
              });

              loadZones(cityId);
            }}
          >
            <option value="">Select City</option>

            {cities.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.city_name}
              </option>
            ))}
          </select>

          <select
            className="border rounded-xl p-4"
            value={form.zone}
            onChange={(e) => {
              const zoneId = e.target.value;

              setForm({
                ...form,
                zone: zoneId,
                division: "",
                ward: "",
              });

              loadDivisions(zoneId);
            }}
          >
            <option value="">Select Zone</option>

            {zones.map((zone) => (
              <option key={zone.zone_id} value={zone.zone_id}>
                {zone.zone_name}
              </option>
            ))}
          </select>

          <select
            className="border rounded-xl p-4"
            value={form.division}
            onChange={(e) => {
              const divisionId = e.target.value;

              setForm({
                ...form,
                division: divisionId,
                ward: "",
              });

              loadWards(divisionId);
            }}
          >
            <option value="">Select Division</option>

            {divisions.map((division) => (
              <option key={division.division_id} value={division.division_id}>
                {division.division_name}
              </option>
            ))}
          </select>

          <select
            className="border rounded-xl p-4"
            value={form.ward}
            onChange={(e) =>
              setForm({
                ...form,
                ward: e.target.value,
              })
            }
          >
            <option value="">Select Ward</option>

            {wards.map((ward) => (
              <option key={ward.ward_id} value={ward.ward_id}>
                {ward.ward_name}
              </option>
            ))}
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

          <button
            onClick={() => {
              onRequestPermission(form);
            }}
            className="px-8 py-3 rounded-xl bg-[#6D28D9] text-white"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
