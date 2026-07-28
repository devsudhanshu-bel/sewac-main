import { X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function EditPlantModal({
  plant,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    plant_name: "",
    plant_type: "",
    city: "",
    zone: "",
    division: "",
    ward: "",
    plant_manager: "",
    capacity_ton_per_day: "",
    vehicles_enrolled: "",
    total_waste_collected: "",
    latitude: "",
    longitude: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (plant) {
      setForm(plant);
    }
  }, [plant]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/api/plants/${plant.id}`, {
  ...form,
  capacity_ton_per_day: Number(form.capacity_ton_per_day),
  vehicles_enrolled: Number(form.vehicles_enrolled),
  total_waste_collected: Number(form.total_waste_collected),
  latitude: Number(form.latitude),
  longitude: Number(form.longitude),
});

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update plant.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl p-6 w-[700px]">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-xl font-bold">
            Update Plant
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <input
  name="plant_name"
  value={form.plant_name}
  onChange={handleChange}
  placeholder="Plant Name"
  className="border rounded-lg p-3"
/>

<input
  name="plant_type"
  value={form.plant_type}
  onChange={handleChange}
  placeholder="Plant Type"
  className="border rounded-lg p-3"
/>

<input
  name="city"
  value={form.city}
  onChange={handleChange}
  placeholder="City"
  className="border rounded-lg p-3"
/>

<input
  name="zone"
  value={form.zone}
  onChange={handleChange}
  placeholder="Zone"
  className="border rounded-lg p-3"
/>

<input
  name="division"
  value={form.division}
  onChange={handleChange}
  placeholder="Division"
  className="border rounded-lg p-3"
/>

<input
  name="ward"
  value={form.ward}
  onChange={handleChange}
  placeholder="Ward"
  className="border rounded-lg p-3"
/>

<input
  name="plant_manager"
  value={form.plant_manager}
  onChange={handleChange}
  placeholder="Plant Manager"
  className="border rounded-lg p-3"
/>

<input
  name="capacity_ton_per_day"
  value={form.capacity_ton_per_day}
  onChange={handleChange}
  placeholder="Capacity"
  className="border rounded-lg p-3"
/>

<input
  name="vehicles_enrolled"
  value={form.vehicles_enrolled}
  onChange={handleChange}
  placeholder="Vehicles Enrolled"
  className="border rounded-lg p-3"
/>

<input
  name="total_waste_collected"
  value={form.total_waste_collected}
  onChange={handleChange}
  placeholder="Waste Collected"
  className="border rounded-lg p-3"
/>

<input
  name="latitude"
  value={form.latitude}
  onChange={handleChange}
  placeholder="Latitude"
  className="border rounded-lg p-3"
/>

<input
  name="longitude"
  value={form.longitude}
  onChange={handleChange}
  placeholder="Longitude"
  className="border rounded-lg p-3"
/>

<select
  name="status"
  value={form.status}
  onChange={handleChange}
  className="border rounded-lg p-3"
>
  <option value="ACTIVE">ACTIVE</option>
  <option value="INACTIVE">INACTIVE</option>
</select>

</div>

<div className="flex justify-end gap-3 mt-6">

  <button
    onClick={onClose}
    className="border rounded-lg px-5 py-2"
  >
    Cancel
  </button>

  <button
    onClick={handleSubmit}
    className="bg-[#6C2BFF] text-white rounded-lg px-5 py-2"
  >
    Update
  </button>

</div>

</div>

</div>
);
}