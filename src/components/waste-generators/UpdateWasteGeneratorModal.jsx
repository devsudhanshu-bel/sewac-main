import { X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function UpdateWasteGeneratorModal({
  open,
  onClose,
  citizen,
  refreshData,
}) {
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

  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [wards, setWards] = useState([]);

  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD CITIZEN DATA
  // =====================================================

  useEffect(() => {
    if (!open || !citizen) return;

    setForm({
      personName: citizen.personName || "",
      phoneNumber: citizen.phoneNumber || "",
      wetRFID: citizen.wetRFID || "",
      dryRFID: citizen.dryRFID || "",
      city: citizen.city || "",
      zone: citizen.zone || "",
      division: citizen.division || "",
      ward: citizen.ward || "",
      area: citizen.area || "",
    });

    loadCities();
  }, [open, citizen]);

  // =====================================================
  // LOAD CITIES
  // =====================================================

  const loadCities = async () => {
    try {
      const res = await api.get("/api/filters/cities");

      setCities(res.data.data || []);
    } catch (err) {
      console.error("Failed to load cities:", err);
    }
  };

  // =====================================================
  // LOAD ZONES
  // =====================================================

  const loadZones = async (cityId) => {
    try {
      const res = await api.get(
        `/api/filters/zones/${cityId}`
      );

      setZones(res.data.data || []);

      setDivisions([]);
      setWards([]);
    } catch (err) {
      console.error("Failed to load zones:", err);
    }
  };

  // =====================================================
  // LOAD DIVISIONS
  // =====================================================

  const loadDivisions = async (zoneId) => {
    try {
      const res = await api.get(
        `/api/filters/divisions/${zoneId}`
      );

      setDivisions(res.data.data || []);

      setWards([]);
    } catch (err) {
      console.error("Failed to load divisions:", err);
    }
  };

  // =====================================================
  // LOAD WARDS
  // =====================================================

  const loadWards = async (divisionId) => {
    try {
      const res = await api.get(
        `/api/filters/wards/${divisionId}`
      );

      setWards(res.data.data || []);
    } catch (err) {
      console.error("Failed to load wards:", err);
    }
  };

  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =====================================================
  // UPDATE
  // =====================================================

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await api.put(
        `/api/waste-generators/${citizen.phoneNumber}`,
        form
      );

      alert(
        "Waste Generator updated successfully."
      );

      if (refreshData) {
        await refreshData();
      }

      onClose();

    } catch (err) {
      console.error(
        "UPDATE WASTE GENERATOR ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update waste generator."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DON'T RENDER
  // =====================================================

  if (!open || !citizen) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl p-8 relative shadow-xl">

        {/* CLOSE BUTTON */}

        <button
          onClick={onClose}
          className="
            absolute
            right-6
            top-6
            w-10
            h-10
            rounded-xl
            flex
            items-center
            justify-center
            hover:bg-gray-100
            transition
          "
        >
          <X size={22} />
        </button>

        {/* TITLE */}

        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Update Waste Generator
        </h2>

        {/* FORM */}

        <div className="grid grid-cols-2 gap-5">

          {/* CITIZEN NAME */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Citizen Name
            </label>

            <input
              value={form.personName}
              onChange={(e) =>
                handleChange(
                  "personName",
                  e.target.value
                )
              }
              placeholder="Citizen Name"
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />
          </div>

          {/* PHONE */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>

            <input
              value={form.phoneNumber}
              onChange={(e) =>
                handleChange(
                  "phoneNumber",
                  e.target.value
                )
              }
              placeholder="Phone Number"
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />
          </div>

          {/* WET RFID */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wet RFID
            </label>

            <input
              value={form.wetRFID}
              onChange={(e) =>
                handleChange(
                  "wetRFID",
                  e.target.value
                )
              }
              placeholder="Wet RFID"
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />
          </div>

          {/* DRY RFID */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dry RFID
            </label>

            <input
              value={form.dryRFID}
              onChange={(e) =>
                handleChange(
                  "dryRFID",
                  e.target.value
                )
              }
              placeholder="Dry RFID"
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />
          </div>

          {/* CITY */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>

            <select
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
              value={form.city}
              onChange={(e) => {
                const cityId = e.target.value;

                setForm((prev) => ({
                  ...prev,
                  city: cityId,
                  zone: "",
                  division: "",
                  ward: "",
                }));

                if (cityId) {
                  loadZones(cityId);
                } else {
                  setZones([]);
                  setDivisions([]);
                  setWards([]);
                }
              }}
            >
              <option value="">
                Select City
              </option>

              {cities.map((city) => (
                <option
                  key={city.city_id}
                  value={city.city_id}
                >
                  {city.city_name}
                </option>
              ))}
            </select>
          </div>

          {/* ZONE */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zone
            </label>

            <select
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
              value={form.zone}
              onChange={(e) => {
                const zoneId = e.target.value;

                setForm((prev) => ({
                  ...prev,
                  zone: zoneId,
                  division: "",
                  ward: "",
                }));

                if (zoneId) {
                  loadDivisions(zoneId);
                } else {
                  setDivisions([]);
                  setWards([]);
                }
              }}
            >
              <option value="">
                Select Zone
              </option>

              {zones.map((zone) => (
                <option
                  key={zone.zone_id}
                  value={zone.zone_id}
                >
                  {zone.zone_name}
                </option>
              ))}
            </select>
          </div>

          {/* DIVISION */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Division
            </label>

            <select
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
              value={form.division}
              onChange={(e) => {
                const divisionId =
                  e.target.value;

                setForm((prev) => ({
                  ...prev,
                  division: divisionId,
                  ward: "",
                }));

                if (divisionId) {
                  loadWards(divisionId);
                } else {
                  setWards([]);
                }
              }}
            >
              <option value="">
                Select Division
              </option>

              {divisions.map((division) => (
                <option
                  key={division.division_id}
                  value={division.division_id}
                >
                  {division.division_name}
                </option>
              ))}
            </select>
          </div>

          {/* WARD */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ward
            </label>

            <select
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
              value={form.ward}
              onChange={(e) =>
                handleChange(
                  "ward",
                  e.target.value
                )
              }
            >
              <option value="">
                Select Ward
              </option>

              {wards.map((ward) => (
                <option
                  key={ward.ward_id}
                  value={ward.ward_id}
                >
                  {ward.ward_name}
                </option>
              ))}
            </select>
          </div>

          {/* AREA */}

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area
            </label>

            <input
              value={form.area}
              onChange={(e) =>
                handleChange(
                  "area",
                  e.target.value
                )
              }
              placeholder="Area"
              className="
                w-full
                border
                border-gray-200
                rounded-xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />
          </div>

        </div>

        {/* BUTTONS */}

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            disabled={loading}
            className="
              px-8
              py-3
              rounded-xl
              border
              border-gray-200
              text-gray-700
              hover:bg-gray-50
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="
              px-8
              py-3
              rounded-xl
              bg-[#6D28D9]
              text-white
              hover:bg-[#5B21B6]
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Updating..."
              : "Update"}
          </button>

        </div>

      </div>

    </div>
  );
}