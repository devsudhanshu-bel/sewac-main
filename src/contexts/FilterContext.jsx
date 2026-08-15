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

        const cityList = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setCities(cityList);

        const defaultCity =
          cityList.find(
            (city) => city.city_name?.toLowerCase() === "bangalore",
          ) || cityList[0];

        setSelectedCity(defaultCity || null);
      } catch (err) {
        console.error("Failed to load cities", err);

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
        const res = await getZones(selectedCity.city_id);

        const zoneList = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setZones(zoneList);

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

        const divisionList = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setDivisions(divisionList);

        const defaultDivision =
          divisionList.find(
            (division) => division.division_name === "Bommanahalli Division",
          ) || divisionList[0];

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

        const wardList = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setWards(wardList);

        const defaultWard =
          wardList.find((ward) => ward.ward_name === "Ibbalur") || wardList[0];

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
     CONTEXT
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
