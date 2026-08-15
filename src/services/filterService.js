import api from "../api/axios";

export const getCities = () => api.get("/api/master-citizen/cities");

export const getZones = (cityId) =>
  api.get(`/api/master-citizen/cities/${cityId}/zones`);

export const getDivisions = (cityId, zoneId) =>
  api.get(`/api/master-citizen/cities/${cityId}/zones/${zoneId}/divisions`);

export const getWards = (cityId, zoneId, divisionId) =>
  api.get(
    `/api/master-citizen/cities/${cityId}/zones/${zoneId}/divisions/${divisionId}/wards`,
  );
