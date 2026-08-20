import { X } from "lucide-react";
import { useState, useEffect } from "react";

import api from "../../api/axios";

import { useLanguage } from "../../i18n";

export default function EditVehicleModal({
  vehicle,
  onClose,
  onSuccess,
}) {
  const { t } = useLanguage();

  const [form, setForm] = useState(
    vehicle || {
      vehicle_id: "",
      vehicle_type: "",
      city: "",
      zone: "",
      division: "",
      ward: "",
      status: "ACTIVE",
    }
  );

  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [wards, setWards] = useState([]);

  /* ===========================================================
     HANDLE CHANGE
  =========================================================== */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ===========================================================
     LOAD CITIES
  =========================================================== */

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    const res = await api.get(
      "/api/filters/cities"
    );

    setCities(res.data);
  };

  /* ===========================================================
     LOAD ZONES
  =========================================================== */

  const loadZones = async (cityId) => {
    const res = await api.get(
      `/api/filters/zones/${cityId}`
    );

    setZones(res.data);
  };

  /* ===========================================================
     LOAD DIVISIONS
  =========================================================== */

  const loadDivisions = async (zoneId) => {
    const res = await api.get(
      `/api/filters/divisions/${zoneId}`
    );

    setDivisions(res.data);
  };

  /* ===========================================================
     LOAD WARDS
  =========================================================== */

  const loadWards = async (divisionId) => {
    const res = await api.get(
      `/api/filters/wards/${divisionId}`
    );

    setWards(res.data);
  };

  /* ===========================================================
     UPDATE VEHICLE
  =========================================================== */

  const handleSubmit = async () => {
    try {
      await api.put(
        `/api/vehicles/${vehicle.vehicle_id}`,
        form
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);

      alert(
        t(
          "vehicles.editVehicle.errors.updateFailed",
          "Failed to update vehicle"
        )
      );
    }
  };

  /* ===========================================================
     SYNC VEHICLE
  =========================================================== */

  useEffect(() => {
    if (vehicle) {
      setForm(vehicle);
    }
  }, [vehicle]);

  /* ===========================================================
     RENDER
  =========================================================== */

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl p-6 w-[600px]">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-xl font-bold">
            {t(
              "vehicles.editVehicle.title",
              "Update Vehicle"
            )}
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <div className="grid grid-cols-2 gap-4">

          {/* Vehicle ID */}

          <input
            name="vehicle_id"
            placeholder={t(
              "vehicles.editVehicle.vehicleId",
              "Vehicle ID"
            )}
            value={form.vehicle_id}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          {/* Vehicle Type */}

          <select
            name="vehicle_type"
            value={form.vehicle_type}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="">
              {t(
                "vehicles.editVehicle.vehicleType",
                "Vehicle Type"
              )}
            </option>

            <option>
              Mini Truck
            </option>

            <option>
              Auto Tipper
            </option>

            <option>
              Compactor
            </option>

            <option>
              Dumper
            </option>
          </select>

          {/* Status */}

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="ACTIVE">
              {t(
                "vehicles.editVehicle.active",
                "ACTIVE"
              )}
            </option>

            <option value="INACTIVE">
              {t(
                "vehicles.editVehicle.inactive",
                "INACTIVE"
              )}
            </option>
          </select>

          {/* City */}

          <select
            className="border rounded-lg p-3"
            value=""
            onChange={(e) => {

              const cityId =
                e.target.value;

              setForm({
                ...form,
                city:
                  e.target.options[
                    e.target.selectedIndex
                  ].text,
                zone: "",
                division: "",
                ward: "",
              });

              loadZones(cityId);
            }}
          >

            <option value="">
              {t(
                "vehicles.editVehicle.selectCity",
                "Select City"
              )}
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

          {/* Zone */}

          <select
            className="border rounded-lg p-3"
            value=""
            onChange={(e) => {

              const zoneId =
                e.target.value;

              setForm({
                ...form,
                zone:
                  e.target.options[
                    e.target.selectedIndex
                  ].text,
                division: "",
                ward: "",
              });

              loadDivisions(zoneId);
            }}
          >

            <option value="">
              {t(
                "vehicles.editVehicle.selectZone",
                "Select Zone"
              )}
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

          {/* Division */}

          <select
            className="border rounded-lg p-3"
            value=""
            onChange={(e) => {

              const divisionId =
                e.target.value;

              setForm({
                ...form,
                division:
                  e.target.options[
                    e.target.selectedIndex
                  ].text,
                ward: "",
              });

              loadWards(divisionId);
            }}
          >

            <option value="">
              {t(
                "vehicles.editVehicle.selectDivision",
                "Select Division"
              )}
            </option>

            {divisions.map(
              (division) => (
                <option
                  key={
                    division.division_id
                  }
                  value={
                    division.division_id
                  }
                >
                  {division.division_name}
                </option>
              )
            )}

          </select>

          {/* Ward */}

          <select
            className="border rounded-lg p-3"
            value=""
            onChange={(e) => {

              setForm({
                ...form,
                ward:
                  e.target.options[
                    e.target.selectedIndex
                  ].text,
              });

            }}
          >

            <option value="">
              {t(
                "vehicles.editVehicle.selectWard",
                "Select Ward"
              )}
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

        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="border rounded-lg px-5 py-2"
          >
            {t(
              "vehicles.editVehicle.cancel",
              "Cancel"
            )}
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#6C2BFF] text-white rounded-lg px-5 py-2"
          >
            {t(
              "vehicles.editVehicle.update",
              "Update"
            )}
          </button>

        </div>

      </div>

    </div>
  );
}