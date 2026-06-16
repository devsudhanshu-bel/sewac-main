import API_BASE_URL from "./api";

export const getDevices = async () => {

  const token =
    sessionStorage.getItem("token");

  const response =
    await fetch(
      `${API_BASE_URL}/api/devices/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  const data = await response.json();

  console.log("DEVICES API:");
  console.log(data);

  return data;
};

export const getBehaviorHistory =
  async () => {

    const token =
      sessionStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API_BASE_URL}/api/behavior/history`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.json();
  };

export const getRiskHistory =
  async () => {

    const token =
      sessionStorage.getItem(
        "token"
      );

    const response =
      await fetch(
        `${API_BASE_URL}/api/risk/history`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.json();
  };