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
        const cityList = await getCities();

        setCities(cityList);

        // Default city = Bangalore
        const defaultCity =
          cityList.find(
            (city) => city.city_name?.toLowerCase() === "bangalore",
          ) || cityList[0];

        setSelectedCity(defaultCity || null);
      } catch (err) {
        console.error("Failed to load cities:", err);

        setCities([]);
        setSelectedCity(null);
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
        const zoneList = await getZones(selectedCity.city_id);

        setZones(zoneList);

        // Default zone = Bangalore South Zone
        const defaultZone =
          zoneList.find(
            (zone) => zone.zone_name?.toLowerCase() === "bangalore south zone",
          ) ||
          zoneList.find((zone) =>
            zone.zone_name?.toLowerCase().includes("south"),
          ) ||
          zoneList[0];

        setSelectedZone(defaultZone || null);
      } catch (err) {
        console.error("Failed to load zones:", err);

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
        const divisionList = await getDivisions(
          selectedCity.city_id,
          selectedZone.zone_id,
        );

        setDivisions(divisionList);

        // Default division = Bommanahalli Division
        const defaultDivision =
          divisionList.find(
            (division) =>
              division.division_name?.toLowerCase() === "bommanahalli division",
          ) || divisionList[0];

        setSelectedDivision(defaultDivision || null);
      } catch (err) {
        console.error("Failed to load divisions:", err);

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
        const wardList = await getWards(
          selectedCity.city_id,
          selectedZone.zone_id,
          selectedDivision.division_id,
        );

        setWards(wardList);

        // Default ward = Ibbalur
        const defaultWard =
          wardList.find(
            (ward) => ward.ward_name?.toLowerCase() === "ibbalur",
          ) || wardList[0];

        setSelectedWard(defaultWard || null);
      } catch (err) {
        console.error("Failed to load wards:", err);

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
    /* Selected values */

    selectedCity,
    setSelectedCity,

    selectedZone,
    setSelectedZone,

    selectedDivision,
    setSelectedDivision,

    selectedWard,
    setSelectedWard,

    /* Available options */

    cities,
    zones,
    divisions,
    wards,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

/* =====================================================
   HOOK
   ===================================================== */

export function useFilters() {
  return useContext(FilterContext);
}
