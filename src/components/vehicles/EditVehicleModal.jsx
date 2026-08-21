import { X, Save, Truck } from "lucide-react";
import { useEffect, useState } from "react";

import api from "../../api/axios";
import { useLanguage } from "../../i18n";

export default function EditVehicleModal({
  vehicle,
  onClose,
  onSuccess,
}) {
  const { t } = useLanguage();

  /* ===========================================================
     FORM
  =========================================================== */

  const [form, setForm] = useState({
    vehicle_id: "",
    vehicle_type: "",
    city: "",
    zone: "",
    division: "",
    ward: "",
    status: "ACTIVE",
  });

  /* ===========================================================
     DROPDOWN DATA
  =========================================================== */

  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [wards, setWards] = useState([]);

  /* ===========================================================
     LOADING STATES
  =========================================================== */

  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingZones, setLoadingZones] = useState(false);
  const [loadingDivisions, setLoadingDivisions] =
    useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  /* ===========================================================
     SYNC VEHICLE
  =========================================================== */

  useEffect(() => {
    if (!vehicle) return;

    setForm({
      vehicle_id: vehicle.vehicle_id || "",
      vehicle_type: vehicle.vehicle_type || "",
      city: vehicle.city || "",
      zone: vehicle.zone || "",
      division: vehicle.division || "",
      ward: vehicle.ward || "",
      status: vehicle.status || "ACTIVE",
    });
  }, [vehicle]);

  /* ===========================================================
     FORM CHANGE
  =========================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===========================================================
     LOAD CITIES
  =========================================================== */

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      setLoadingCities(true);

      const res = await api.get(
        "/api/filters/cities"
      );

      setCities(res.data || []);
    } catch (err) {
      console.error(
        "Failed to load cities:",
        err
      );
    } finally {
      setLoadingCities(false);
    }
  };

  /* ===========================================================
     LOAD ZONES
  =========================================================== */

  const loadZones = async (cityId) => {
    if (!cityId) return;

    try {
      setLoadingZones(true);

      const res = await api.get(
        `/api/filters/zones/${cityId}`
      );

      setZones(res.data || []);
    } catch (err) {
      console.error(
        "Failed to load zones:",
        err
      );
    } finally {
      setLoadingZones(false);
    }
  };

  /* ===========================================================
     LOAD DIVISIONS
  =========================================================== */

  const loadDivisions = async (zoneId) => {
    if (!zoneId) return;

    try {
      setLoadingDivisions(true);

      const res = await api.get(
        `/api/filters/divisions/${zoneId}`
      );

      setDivisions(res.data || []);
    } catch (err) {
      console.error(
        "Failed to load divisions:",
        err
      );
    } finally {
      setLoadingDivisions(false);
    }
  };

  /* ===========================================================
     LOAD WARDS
  =========================================================== */

  const loadWards = async (divisionId) => {
    if (!divisionId) return;

    try {
      setLoadingWards(true);

      const res = await api.get(
        `/api/filters/wards/${divisionId}`
      );

      setWards(res.data || []);
    } catch (err) {
      console.error(
        "Failed to load wards:",
        err
      );
    } finally {
      setLoadingWards(false);
    }
  };

  /* ===========================================================
     LOAD EXISTING LOCATION HIERARCHY
  =========================================================== */

  useEffect(() => {
    if (!vehicle || !cities.length) return;

    const selectedCity = cities.find(
      (city) =>
        city.city_name === vehicle.city
    );

    if (!selectedCity?.city_id) return;

    loadZones(selectedCity.city_id);
  }, [vehicle, cities]);

  useEffect(() => {
    if (!vehicle || !zones.length) return;

    const selectedZone = zones.find(
      (zone) =>
        zone.zone_name === vehicle.zone
    );

    if (!selectedZone?.zone_id) return;

    loadDivisions(selectedZone.zone_id);
  }, [vehicle, zones]);

  useEffect(() => {
    if (!vehicle || !divisions.length) return;

    const selectedDivision =
      divisions.find(
        (division) =>
          division.division_name ===
          vehicle.division
      );

    if (!selectedDivision?.division_id) return;

    loadWards(selectedDivision.division_id);
  }, [vehicle, divisions]);

  /* ===========================================================
     CITY CHANGE
  =========================================================== */

  const handleCityChange = (e) => {
    const cityId = e.target.value;

    const selectedCity = cities.find(
      (city) =>
        String(city.city_id) === String(cityId)
    );

    setForm((prev) => ({
      ...prev,
      city: selectedCity?.city_name || "",
      zone: "",
      division: "",
      ward: "",
    }));

    setZones([]);
    setDivisions([]);
    setWards([]);

    if (cityId) {
      loadZones(cityId);
    }
  };

  /* ===========================================================
     ZONE CHANGE
  =========================================================== */

  const handleZoneChange = (e) => {
    const zoneId = e.target.value;

    const selectedZone = zones.find(
      (zone) =>
        String(zone.zone_id) === String(zoneId)
    );

    setForm((prev) => ({
      ...prev,
      zone: selectedZone?.zone_name || "",
      division: "",
      ward: "",
    }));

    setDivisions([]);
    setWards([]);

    if (zoneId) {
      loadDivisions(zoneId);
    }
  };

  /* ===========================================================
     DIVISION CHANGE
  =========================================================== */

  const handleDivisionChange = (e) => {
    const divisionId = e.target.value;

    const selectedDivision =
      divisions.find(
        (division) =>
          String(division.division_id) ===
          String(divisionId)
      );

    setForm((prev) => ({
      ...prev,
      division:
        selectedDivision?.division_name || "",
      ward: "",
    }));

    setWards([]);

    if (divisionId) {
      loadWards(divisionId);
    }
  };

  /* ===========================================================
     WARD CHANGE
  =========================================================== */

  const handleWardChange = (e) => {
    const wardId = e.target.value;

    const selectedWard = wards.find(
      (ward) =>
        String(ward.ward_id) === String(wardId)
    );

    setForm((prev) => ({
      ...prev,
      ward: selectedWard?.ward_name || "",
    }));
  };

  /* ===========================================================
     UPDATE VEHICLE
  =========================================================== */

  const handleSubmit = async () => {
    try {
      if (!vehicle?.vehicle_id) {
        return;
      }

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
            "vehicles.editVehicle.validation",
            "Please fill all fields."
          )
        );

        return;
      }

      setSubmitting(true);

      await api.put(
        `/api/vehicles/${vehicle.vehicle_id}`,
        form
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error(
        "Update Vehicle Error:",
        err
      );

      alert(
        t(
          "vehicles.editVehicle.errors.updateFailed",
          "Failed to update vehicle"
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ===========================================================
     SELECTED IDS
  =========================================================== */

  const selectedCityId =
    cities.find(
      (city) =>
        city.city_name === form.city
    )?.city_id || "";

  const selectedZoneId =
    zones.find(
      (zone) =>
        zone.zone_name === form.zone
    )?.zone_id || "";

  const selectedDivisionId =
    divisions.find(
      (division) =>
        division.division_name ===
        form.division
    )?.division_id || "";

  const selectedWardId =
    wards.find(
      (ward) =>
        ward.ward_name === form.ward
    )?.ward_id || "";

  /* ===========================================================
     RENDER
  =========================================================== */

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-[2px]
        px-4
        py-6
      "
    >
      {/* =====================================================
          MODAL
      ===================================================== */}

      <div
        className="
          w-full
          max-w-[620px]
          max-h-[92vh]
          bg-white
          rounded-[24px]
          border
          border-[#ECECF3]
          shadow-[0_20px_60px_rgba(15,23,42,0.18)]
          overflow-hidden
          flex
          flex-col
        "
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-[#F0F1F5]
            flex-shrink-0
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-[#F4EEFF]
                flex
                items-center
                justify-center
              "
            >
              <Truck
                size={19}
                strokeWidth={2.2}
                className="text-[#6C2BFF]"
              />
            </div>

            <div>
              <h2 className="text-[18px] font-semibold text-[#111827]">
                {t(
                  "vehicles.editVehicle.title",
                  "Update Vehicle"
                )}
              </h2>

              <p className="text-[12px] text-[#6B7280] mt-0.5">
                {t(
                  "vehicles.editVehicle.subtitle",
                  "Update vehicle information and location."
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t(
              "vehicles.editVehicle.close",
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
              hover:text-[#111827]
              hover:bg-[#F5F6FA]
              transition
            "
          >
            <X
              size={19}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* ===================================================
            FORM BODY
        =================================================== */}

        <div className="px-6 py-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* =================================================
                VEHICLE ID
            ================================================= */}

            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
                {t(
                  "vehicles.editVehicle.vehicleIdLabel",
                  "Vehicle ID"
                )}
              </label>

              <input
                name="vehicle_id"
                placeholder={t(
                  "vehicles.editVehicle.vehicleId",
                  "Vehicle ID"
                )}
                value={form.vehicle_id || ""}
                onChange={handleChange}
                className="
                  w-full
                  h-[44px]
                  px-3.5
                  rounded-xl
                  border
                  border-[#E2E4EA]
                  bg-white
                  text-[13px]
                  text-[#111827]
                  outline-none
                  focus:border-[#6C2BFF]
                  focus:ring-2
                  focus:ring-[#6C2BFF]/10
                  transition
                "
              />
            </div>

            {/* =================================================
                VEHICLE TYPE
            ================================================= */}

            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
                {t(
                  "vehicles.editVehicle.vehicleTypeLabel",
                  "Vehicle Type"
                )}
              </label>

              <select
                name="vehicle_type"
                value={form.vehicle_type || ""}
                onChange={handleChange}
                className="
                  w-full
                  h-[44px]
                  px-3.5
                  rounded-xl
                  border
                  border-[#E2E4EA]
                  bg-white
                  text-[13px]
                  text-[#111827]
                  outline-none
                  focus:border-[#6C2BFF]
                  focus:ring-2
                  focus:ring-[#6C2BFF]/10
                  transition
                "
              >
                <option value="">
                  {t(
                    "vehicles.editVehicle.vehicleType",
                    "Vehicle Type"
                  )}
                </option>

                <option value="Mini Truck">
                  {t(
                    "vehicles.editVehicle.types.miniTruck",
                    "Mini Truck"
                  )}
                </option>

                <option value="Auto Tipper">
                  {t(
                    "vehicles.editVehicle.types.autoTipper",
                    "Auto Tipper"
                  )}
                </option>

                <option value="Compactor">
                  {t(
                    "vehicles.editVehicle.types.compactor",
                    "Compactor"
                  )}
                </option>

                <option value="Dumper">
                  {t(
                    "vehicles.editVehicle.types.dumper",
                    "Dumper"
                  )}
                </option>
              </select>
            </div>

            {/* =================================================
                STATUS
            ================================================= */}

            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
                {t(
                  "vehicles.editVehicle.statusLabel",
                  "Status"
                )}
              </label>

              <select
                name="status"
                value={form.status || "ACTIVE"}
                onChange={handleChange}
                className="
                  w-full
                  h-[44px]
                  px-3.5
                  rounded-xl
                  border
                  border-[#E2E4EA]
                  bg-white
                  text-[13px]
                  text-[#111827]
                  outline-none
                  focus:border-[#6C2BFF]
                  focus:ring-2
                  focus:ring-[#6C2BFF]/10
                  transition
                "
              >
                <option value="ACTIVE">
                  {t(
                    "vehicles.editVehicle.active",
                    "Active"
                  )}
                </option>

                <option value="INACTIVE">
                  {t(
                    "vehicles.editVehicle.inactive",
                    "Inactive"
                  )}
                </option>
              </select>
            </div>

            {/* =================================================
                CITY
            ================================================= */}

            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
                {t(
                  "vehicles.editVehicle.cityLabel",
                  "City"
                )}
              </label>

              <select
                value={selectedCityId}
                onChange={handleCityChange}
                disabled={loadingCities}
                className="
                  w-full
                  h-[44px]
                  px-3.5
                  rounded-xl
                  border
                  border-[#E2E4EA]
                  bg-white
                  text-[13px]
                  text-[#111827]
                  outline-none
                  focus:border-[#6C2BFF]
                  focus:ring-2
                  focus:ring-[#6C2BFF]/10
                  disabled:bg-[#F8F9FD]
                  disabled:text-[#9CA3AF]
                  transition
                "
              >
                <option value="">
                  {loadingCities
                    ? t(
                        "vehicles.editVehicle.loading",
                        "Loading..."
                      )
                    : t(
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
            </div>

            {/* =================================================
                ZONE
            ================================================= */}

            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
                {t(
                  "vehicles.editVehicle.zoneLabel",
                  "Zone"
                )}
              </label>

              <select
                value={selectedZoneId}
                onChange={handleZoneChange}
                disabled={
                  !form.city ||
                  loadingZones
                }
                className="
                  w-full
                  h-[44px]
                  px-3.5
                  rounded-xl
                  border
                  border-[#E2E4EA]
                  bg-white
                  text-[13px]
                  text-[#111827]
                  outline-none
                  focus:border-[#6C2BFF]
                  focus:ring-2
                  focus:ring-[#6C2BFF]/10
                  disabled:bg-[#F8F9FD]
                  disabled:text-[#9CA3AF]
                  transition
                "
              >
                <option value="">
                  {loadingZones
                    ? t(
                        "vehicles.editVehicle.loading",
                        "Loading..."
                      )
                    : t(
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
            </div>

            {/* =================================================
                DIVISION
            ================================================= */}

            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
                {t(
                  "vehicles.editVehicle.divisionLabel",
                  "Division"
                )}
              </label>

              <select
                value={selectedDivisionId}
                onChange={handleDivisionChange}
                disabled={
                  !form.zone ||
                  loadingDivisions
                }
                className="
                  w-full
                  h-[44px]
                  px-3.5
                  rounded-xl
                  border
                  border-[#E2E4EA]
                  bg-white
                  text-[13px]
                  text-[#111827]
                  outline-none
                  focus:border-[#6C2BFF]
                  focus:ring-2
                  focus:ring-[#6C2BFF]/10
                  disabled:bg-[#F8F9FD]
                  disabled:text-[#9CA3AF]
                  transition
                "
              >
                <option value="">
                  {loadingDivisions
                    ? t(
                        "vehicles.editVehicle.loading",
                        "Loading..."
                      )
                    : t(
                        "vehicles.editVehicle.selectDivision",
                        "Select Division"
                      )}
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

            {/* =================================================
                WARD
            ================================================= */}

            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1.5">
                {t(
                  "vehicles.editVehicle.wardLabel",
                  "Ward"
                )}
              </label>

              <select
                value={selectedWardId}
                onChange={handleWardChange}
                disabled={
                  !form.division ||
                  loadingWards
                }
                className="
                  w-full
                  h-[44px]
                  px-3.5
                  rounded-xl
                  border
                  border-[#E2E4EA]
                  bg-white
                  text-[13px]
                  text-[#111827]
                  outline-none
                  focus:border-[#6C2BFF]
                  focus:ring-2
                  focus:ring-[#6C2BFF]/10
                  disabled:bg-[#F8F9FD]
                  disabled:text-[#9CA3AF]
                  transition
                "
              >
                <option value="">
                  {loadingWards
                    ? t(
                        "vehicles.editVehicle.loading",
                        "Loading..."
                      )
                    : t(
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
          </div>
        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div
          className="
            px-6
            py-5
            bg-[#FAFAFC]
            border-t
            border-[#F0F1F5]
            flex
            justify-end
            gap-3
            flex-shrink-0
          "
        >
          {/* ================= CANCEL ================= */}

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="
              h-[40px]
              px-5
              rounded-xl
              border
              border-[#E2E4EA]
              bg-white
              text-[13px]
              font-medium
              text-[#374151]
              hover:bg-[#F8F9FD]
              hover:border-[#D5D8E0]
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition
            "
          >
            {t(
              "vehicles.editVehicle.cancel",
              "Cancel"
            )}
          </button>

          {/* ================= UPDATE ================= */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="
              h-[40px]
              px-5
              rounded-xl
              bg-[#6C2BFF]
              text-white
              text-[13px]
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              hover:bg-[#5B21E6]
              active:scale-[0.98]
              disabled:opacity-60
              disabled:cursor-not-allowed
              transition
            "
          >
            <Save
              size={15}
              strokeWidth={2.2}
            />

            {submitting
              ? t(
                  "vehicles.editVehicle.updating",
                  "Updating..."
                )
              : t(
                  "vehicles.editVehicle.update",
                  "Update"
                )}
          </button>
        </div>
      </div>
    </div>
  );
}