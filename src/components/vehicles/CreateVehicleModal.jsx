import { X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

import { useLanguage } from "../../i18n";

export default function CreateVehicleModal({
  onClose,
  onSuccess,
}) {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    vehicle_id: "",
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

  /* ===========================================================
     HANDLE FORM CHANGE
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
    try {
      const res = await api.get("/api/filters/cities");

      setCities(res.data);
    } catch (error) {
      console.error(
        "Failed to load cities:",
        error
      );
    }
  };

  /* ===========================================================
     LOAD ZONES
  =========================================================== */

  const loadZones = async (cityId) => {
    try {
      const res = await api.get(
        `/api/filters/zones/${cityId}`
      );

      setZones(res.data);
    } catch (error) {
      console.error(
        "Failed to load zones:",
        error
      );
    }
  };

  /* ===========================================================
     LOAD DIVISIONS
  =========================================================== */

  const loadDivisions = async (zoneId) => {
    try {
      const res = await api.get(
        `/api/filters/divisions/${zoneId}`
      );

      setDivisions(res.data);
    } catch (error) {
      console.error(
        "Failed to load divisions:",
        error
      );
    }
  };

  /* ===========================================================
     LOAD WARDS
  =========================================================== */

  const loadWards = async (divisionId) => {
    try {
      const res = await api.get(
        `/api/filters/wards/${divisionId}`
      );

      setWards(res.data);
    } catch (error) {
      console.error(
        "Failed to load wards:",
        error
      );
    }
  };

  /* ===========================================================
     SUBMIT
  =========================================================== */

  const handleSubmit = async () => {
    try {
      if (
        !form.vehicle_id ||
        !form.vehicle_type ||
        !form.city ||
        !form.zone ||
        !form.division ||
        !form.ward ||
        !form.status
      ) {
        alert(
          t(
            "vehicles.createVehicle.validation",
            "Please fill all fields."
          )
        );

        return;
      }

      await api.post(
        "/api/vehicles",
        form
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);

      alert(
        t(
          "vehicles.createVehicle.createFailed",
          "Failed to create vehicle"
        )
      );
    }
  };

  /* ===========================================================
     COMMON FIELD STYLES
  =========================================================== */

  const fieldClassName = `
    w-full
    h-[46px]
    border
    border-[#E5E7EB]
    rounded-xl
    px-3.5
    text-[13px]
    text-[#111827]
    bg-white
    outline-none
    transition
    focus:border-[#6C2BFF]
    focus:ring-2
    focus:ring-[#6C2BFF]/10
    disabled:bg-[#F8F9FC]
    disabled:text-gray-400
    disabled:cursor-not-allowed
  `;

  /* ===========================================================
     RENDER
  =========================================================== */

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/40
        backdrop-blur-[2px]
        flex
        items-center
        justify-center
        p-3
        sm:p-5
      "
    >
      {/* =====================================================
          MODAL
      ===================================================== */}

      <div
        className="
          w-full
          max-w-[600px]
          max-h-[90vh]
          overflow-y-auto
          bg-white
          rounded-2xl
          sm:rounded-[22px]
          shadow-2xl
          border
          border-[#ECECF3]
          p-4
          sm:p-6
        "
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#111827]">
            {t(
              "vehicles.createVehicle.title",
              "Create Vehicle"
            )}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label={t(
              "vehicles.createVehicle.close",
              "Close"
            )}
            className="
              w-9
              h-9
              rounded-xl
              flex
              items-center
              justify-center
              text-[#6B7280]
              hover:bg-[#F3F4F6]
              hover:text-[#111827]
              transition
            "
          >
            <X size={19} />
          </button>

        </div>

        {/* ===================================================
            FORM
        =================================================== */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-3
            sm:gap-4
          "
        >

          {/* =================================================
              VEHICLE ID
          ================================================= */}

          <input
            name="vehicle_id"
            placeholder={t(
              "vehicles.createVehicle.vehicleId",
              "Vehicle ID"
            )}
            value={form.vehicle_id}
            onChange={handleChange}
            className={fieldClassName}
          />

          {/* =================================================
              VEHICLE TYPE
          ================================================= */}

          <select
            name="vehicle_type"
            value={form.vehicle_type}
            onChange={handleChange}
            className={fieldClassName}
          >
            <option value="">
              {t(
                "vehicles.createVehicle.vehicleType",
                "Vehicle Type"
              )}
            </option>

            <option value="Mini Truck">
              {t(
                "vehicles.createVehicle.types.miniTruck",
                "Mini Truck"
              )}
            </option>

            <option value="Auto Tipper">
              {t(
                "vehicles.createVehicle.types.autoTipper",
                "Auto Tipper"
              )}
            </option>

            <option value="Compactor">
              {t(
                "vehicles.createVehicle.types.compactor",
                "Compactor"
              )}
            </option>

            <option value="Dumper">
              {t(
                "vehicles.createVehicle.types.dumper",
                "Dumper"
              )}
            </option>
          </select>

          {/* =================================================
              STATUS
          ================================================= */}

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={fieldClassName}
          >
            <option value="ACTIVE">
              {t(
                "vehicles.createVehicle.active",
                "ACTIVE"
              )}
            </option>

            <option value="INACTIVE">
              {t(
                "vehicles.createVehicle.inactive",
                "INACTIVE"
              )}
            </option>
          </select>

          {/* =================================================
              CITY
          ================================================= */}

          <select
            className={fieldClassName}
            value={
              cities.find(
                (city) =>
                  city.city_name === form.city
              )?.city_id || ""
            }
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

              setZones([]);
              setDivisions([]);
              setWards([]);

              if (cityId) {
                loadZones(cityId);
              }
            }}
          >
            <option value="">
              {t(
                "vehicles.createVehicle.selectCity",
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

          {/* =================================================
              ZONE
          ================================================= */}

          <select
            className={fieldClassName}
            value={
              zones.find(
                (zone) =>
                  zone.zone_name === form.zone
              )?.zone_id || ""
            }
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

              setDivisions([]);
              setWards([]);

              if (zoneId) {
                loadDivisions(zoneId);
              }
            }}
            disabled={!form.city}
          >
            <option value="">
              {t(
                "vehicles.createVehicle.selectZone",
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

          {/* =================================================
              DIVISION
          ================================================= */}

          <select
            className={fieldClassName}
            value={
              divisions.find(
                (division) =>
                  division.division_name ===
                  form.division
              )?.division_id || ""
            }
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

              setWards([]);

              if (divisionId) {
                loadWards(divisionId);
              }
            }}
            disabled={!form.zone}
          >
            <option value="">
              {t(
                "vehicles.createVehicle.selectDivision",
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
                  {
                    division.division_name
                  }
                </option>
              )
            )}
          </select>

          {/* =================================================
              WARD
          ================================================= */}

          <select
            className={fieldClassName}
            value={
              wards.find(
                (ward) =>
                  ward.ward_name ===
                  form.ward
              )?.ward_id || ""
            }
            onChange={(e) => {
              setForm({
                ...form,
                ward:
                  e.target.options[
                    e.target.selectedIndex
                  ].text,
              });
            }}
            disabled={!form.division}
          >
            <option value="">
              {t(
                "vehicles.createVehicle.selectWard",
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

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div
          className="
            flex
            flex-col-reverse
            sm:flex-row
            sm:justify-end
            gap-2.5
            mt-6
          "
        >

          {/* CANCEL */}

          <button
            type="button"
            onClick={onClose}
            className="
              w-full
              sm:w-auto
              h-[44px]
              border
              border-[#E5E7EB]
              rounded-xl
              px-5
              text-[13px]
              font-medium
              text-[#374151]
              hover:bg-gray-50
              transition
            "
          >
            {t(
              "vehicles.createVehicle.cancel",
              "Cancel"
            )}
          </button>

          {/* CREATE */}

          <button
            type="button"
            onClick={handleSubmit}
            className="
              w-full
              sm:w-auto
              h-[44px]
              bg-[#6C2BFF]
              text-white
              rounded-xl
              px-6
              text-[13px]
              font-semibold
              hover:bg-[#5B21E6]
              transition
              shadow-sm
            "
          >
            {t(
              "vehicles.createVehicle.create",
              "Create"
            )}
          </button>

        </div>

      </div>
    </div>
  );
}