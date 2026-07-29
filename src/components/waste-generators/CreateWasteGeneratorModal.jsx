import { X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function CreateWasteGeneratorModal({
  open,
  onClose,
  refreshData,
}) {
  const [form, setForm] = useState({
    personName: "",
    phoneNumber: "",
    city: "",
    ward: "",
    area: "",
    houseNumber: "",
    floorNumber: "",
    householdType: "",
    contactNumber: "",
    numberOfPeople: "",
    wasteGeneratorTypes: "",
  });

  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (open) {
      loadCities();
    }
  }, [open]);
  if (!open) return null;

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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[900px] rounded-2xl p-8 relative">
        <button onClick={onClose} className="absolute right-6 top-6">
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-8">Create Waste Generator</h2>

        <div className="grid grid-cols-3 gap-5">
          <input
            value={form.personName}
            onChange={(e) =>
              setForm({
                ...form,
                personName: e.target.value,
              })
            }
            placeholder="Citizen Name"
            className="border rounded-xl p-4"
          />

          <input
            value={form.phoneNumber}
            onChange={(e) =>
              setForm({
                ...form,
                phoneNumber: e.target.value,
              })
            }
            placeholder="Phone Number"
            className="border rounded-xl p-4"
          />

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

            {cities?.map((city) => (
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

            {zones?.map((zone) => (
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

            {divisions?.map((division) => (
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

            {wards?.map((ward) => (
              <option key={ward.ward_id} value={ward.ward_id}>
                {ward.ward_name}
              </option>
            ))}
          </select>

          <input
            value={form.area}
            onChange={(e) =>
              setForm({
                ...form,
                area: e.target.value,
              })
            }
            placeholder="Area"
            className="border rounded-xl p-4 col-span-2"
          />
        </div>

        <input
          value={form.houseNumber}
          onChange={(e) =>
            setForm({
              ...form,
              houseNumber: e.target.value,
            })
          }
          placeholder="House Number"
          className="border rounded-xl p-4"
        />

        <input
          value={form.floorNumber}
          onChange={(e) =>
            setForm({
              ...form,
              floorNumber: e.target.value,
            })
          }
          placeholder="Floor Number"
          className="border rounded-xl p-4"
        />

        <input
          value={form.numberOfPeople}
          onChange={(e) =>
            setForm({
              ...form,
              numberOfPeople: e.target.value,
            })
          }
          placeholder="Number Of People"
          className="border rounded-xl p-4"
        />

        <select
          value={form.householdType}
          onChange={(e) =>
            setForm({
              ...form,
              householdType: e.target.value,
            })
          }
          className="border rounded-xl p-4"
        >
          <option value="">Select Household Type</option>

          <option value="Residential">Residential</option>

          <option value="Commercial">Commercial</option>

          <option value="Industrial">Industrial</option>
        </select>

        <select
          value={form.wasteGeneratorTypes}
          onChange={(e) =>
            setForm({
              ...form,
              wasteGeneratorTypes: e.target.value,
            })
          }
          className="border rounded-xl p-4"
        >
          <option value="">Select Waste Generator Type</option>

          <option value="Domestic">Domestic</option>

          <option value="Commercial">Commercial</option>

          <option value="Industrial">Industrial</option>

          <option value="Institutional">Institutional</option>
        </select>

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="px-8 py-3 rounded-xl border">
            Cancel
          </button>

          <button
            onClick={async () => {
              try {
                await api.post("/api/waste-generators", form);

                alert("Waste Generator created successfully.");

                await refreshData();

                onClose();
              } catch (err) {
                console.error(err);

                alert(
                  err.response?.data?.message ||
                    "Failed to create waste generator.",
                );
              }
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
