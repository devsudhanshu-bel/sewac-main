import api from "../api/axios";

export const getCities = () =>
  api.get("/api/filters/cities");

export const getZones = (cityId) =>
  api.get(`/api/filters/zones/${cityId}`);

export const getDivisions = (zoneId) =>
  api.get(`/api/filters/divisions/${zoneId}`);

export const getWards = (divisionId) =>
  api.get(`/api/filters/wards/${divisionId}`);