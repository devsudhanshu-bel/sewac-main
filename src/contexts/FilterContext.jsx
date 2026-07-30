import { createContext, useContext, useState } from "react";

import { useEffect } from "react";

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

  useEffect(() => {
    const loadZones = async () => {
      if (!selectedCity) return;

      try {
        const res = await getZones(selectedCity.city_id);

        setZones(res.data);

        setSelectedZone(res.data.length ? res.data[3] : null);
      } catch (err) {
        console.error(err);
      }
    };

    loadZones();
  }, [selectedCity]);

  useEffect(() => {
    const loadDivisions = async () => {
      if (!selectedZone) return;

      try {
        const res = await getDivisions(selectedZone.zone_id);

        setDivisions(res.data); // <-- THIS WAS MISSING

        const defaultDivision =
          res.data.find((d) => d.division_name === "Bommanahalli Division") ||
          res.data[0];

        setSelectedDivision(defaultDivision || null);
      } catch (err) {
        console.error(err);
      }
    };

    loadDivisions();
  }, [selectedZone]);

  useEffect(() => {
    const loadWards = async () => {
      if (!selectedDivision) return;

      try {
        const res = await getWards(selectedDivision.division_id);

        setWards(res.data);

        const defaultWard =
          res.data.find((w) => w.ward_name === "Ibbalur") || res.data[0];

        setSelectedWard(defaultWard || null);
      } catch (err) {
        console.error(err);
      }
    };

    loadWards();
  }, [selectedDivision]);

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
