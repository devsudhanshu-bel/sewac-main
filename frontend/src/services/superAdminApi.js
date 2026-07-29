const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const superAdminLogin = async (email, password) => {
  const res = await fetch(
    `${API_BASE_URL}/api/super-admin/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  return res.json();
};