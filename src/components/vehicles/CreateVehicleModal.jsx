import { X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function CreateVehicleModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    vehicle_id: "",
    vehicle_number: "",
    vehicle_type: "",
    city: "",
    zone: "",
    division: "",
    ward: "",
    status: "ACTIVE",
  });
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [wards, setWards] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    const res = await api.get("/api/filters/cities");
    setCities(res.data);
  };

  const loadZones = async (cityId) => {
    const res = await api.get(`/api/filters/zones/${cityId}`);
    setZones(res.data);
  };

  const loadDivisions = async (zoneId) => {
    const res = await api.get(`/api/filters/divisions/${zoneId}`);
    setDivisions(res.data);
  };

  const loadWards = async (divisionId) => {
    const res = await api.get(`/api/filters/wards/${divisionId}`);
    setWards(res.data);
  };

  const handleSubmit = async () => {
    try {
      if (
        !form.vehicle_id ||
        !form.vehicle_number ||
        !form.vehicle_type ||
        !form.city ||
        !form.zone ||
        !form.division ||
        !form.ward ||
        !form.status
      ) {
        alert("Please fill all fields.");
        return;
      }
      await api.post("/api/vehicles", form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create vehicle");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[600px]">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Create Vehicle</h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="vehicle_id"
            placeholder="Vehicle ID"
            value={form.vehicle_id}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            name="vehicle_number"
            placeholder="Vehicle Number"
            value={form.vehicle_number}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <select
            name="vehicle_type"
            value={form.vehicle_type}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="">Vehicle Type</option>
            <option>Mini Truck</option>
            <option>Auto Tipper</option>
            <option>Compactor</option>
            <option>Dumper</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          <select
            className="border rounded-lg p-3"
            onChange={(e) => {
              const cityId = e.target.value;

              setForm({
                ...form,
                city: e.target.options[e.target.selectedIndex].text,
                zone: "",
                division: "",
                ward: "",
              });

              loadZones(cityId);
            }}
          >
            <option>Select City</option>

            {cities.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.city_name}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg p-3"
            onChange={(e) => {
              const zoneId = e.target.value;

              setForm({
                ...form,
                zone: e.target.options[e.target.selectedIndex].text,
                division: "",
                ward: "",
              });

              loadDivisions(zoneId);
            }}
          >
            <option>Select Zone</option>

            {zones.map((zone) => (
              <option key={zone.zone_id} value={zone.zone_id}>
                {zone.zone_name}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg p-3"
            onChange={(e) => {
              const divisionId = e.target.value;

              setForm({
                ...form,
                division: e.target.options[e.target.selectedIndex].text,
                ward: "",
              });

              loadWards(divisionId);
            }}
          >
            <option>Select Division</option>

            {divisions.map((division) => (
              <option key={division.division_id} value={division.division_id}>
                {division.division_name}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg p-3"
            onChange={(e) => {
              setForm({
                ...form,
                ward: e.target.options[e.target.selectedIndex].text,
              });
            }}
          >
            <option>Select Ward</option>

            {wards.map((ward) => (
              <option key={ward.ward_id} value={ward.ward_id}>
                {ward.ward_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="border rounded-lg px-5 py-2">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#6C2BFF] text-white rounded-lg px-5 py-2"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
