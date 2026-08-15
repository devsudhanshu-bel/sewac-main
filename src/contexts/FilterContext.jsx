import { createContext, useContext, useState, useEffect } from "react";

import {
  getCities,
  getZones,
  getDivisions,
  getWards,
} from "../services/filterService";

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [wards, setWards] = useState([]);

  /* =====================================================
     CITY
  ===================================================== */

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await getCities();

        setCities(res.data);

        if (res.data.length > 0) {
          setSelectedCity(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to load cities", err);
      }
    };

    loadCities();
  }, []);

  /* =====================================================
     ZONE
     Depends on CITY
  ===================================================== */

  useEffect(() => {
    const loadZones = async () => {
      if (!selectedCity) {
        setZones([]);
        setSelectedZone(null);
        return;
      }

      try {
        const res = await getZones(selectedCity.city_id);

        setZones(res.data);

        /*
         * Keep your existing default-zone behavior.
         * Currently your code selects the 4th zone.
         */
        setSelectedZone(res.data.length ? res.data[3] : null);
      } catch (err) {
        console.error("Failed to load zones", err);

        setZones([]);
        setSelectedZone(null);
      }
    };

    loadZones();
  }, [selectedCity]);

  /* =====================================================
     DIVISION
     Depends on CITY + ZONE
  ===================================================== */

  useEffect(() => {
    const loadDivisions = async () => {
      if (!selectedCity || !selectedZone) {
        setDivisions([]);
        setSelectedDivision(null);
        return;
      }

      try {
        const res = await getDivisions(
          selectedCity.city_id,
          selectedZone.zone_id,
        );

        setDivisions(res.data);

        const defaultDivision =
          res.data.find((d) => d.division_name === "Bommanahalli Division") ||
          res.data[0];

        setSelectedDivision(defaultDivision || null);
      } catch (err) {
        console.error("Failed to load divisions", err);

        setDivisions([]);
        setSelectedDivision(null);
      }
    };

    loadDivisions();
  }, [selectedCity, selectedZone]);

  /* =====================================================
     WARD
     Depends on CITY + ZONE + DIVISION
  ===================================================== */

  useEffect(() => {
    const loadWards = async () => {
      if (!selectedCity || !selectedZone || !selectedDivision) {
        setWards([]);
        setSelectedWard(null);
        return;
      }

      try {
        const res = await getWards(
          selectedCity.city_id,
          selectedZone.zone_id,
          selectedDivision.division_id,
        );

        setWards(res.data);

        const defaultWard =
          res.data.find((w) => w.ward_name === "Ibbalur") || res.data[0];

        setSelectedWard(defaultWard || null);
      } catch (err) {
        console.error("Failed to load wards", err);

        setWards([]);
        setSelectedWard(null);
      }
    };

    loadWards();
  }, [selectedCity, selectedZone, selectedDivision]);

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */

  const value = {
    selectedCity,
    setSelectedCity,

    selectedZone,
    setSelectedZone,

    selectedDivision,
    setSelectedDivision,

    selectedWard,
    setSelectedWard,

    cities,
    zones,
    divisions,
    wards,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilters() {
  return useContext(FilterContext);
}
