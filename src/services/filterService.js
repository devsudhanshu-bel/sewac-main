import api from "../api/axios";

export const getCities = async () => {
  const res = await api.get("/api/master-citizen/cities");

  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getZones = async (cityId) => {
  const res = await api.get(`/api/master-citizen/cities/${cityId}/zones`);

  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getDivisions = async (cityId, zoneId) => {
  const res = await api.get(
    `/api/master-citizen/cities/${cityId}/zones/${zoneId}/divisions`,
  );

  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const getWards = async (cityId, zoneId, divisionId) => {
  const res = await api.get(
    `/api/master-citizen/cities/${cityId}/zones/${zoneId}/divisions/${divisionId}/wards`,
  );

  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};
