import { jwtDecode } from "jwt-decode";

/*
|--------------------------------------------------------------------------
| FRONTEND RBAC
|--------------------------------------------------------------------------
|
| Keep this aligned with the CURRENT backend permissions.js.
|
| Admin Layer 2 -> Users remains TRUE as requested.
| Settings is removed.
|
|--------------------------------------------------------------------------
*/

const ROLE_ACCESS = {
  ADMIN_LAYER_1: {
    overview: true,
    waste_generators: true,
    vehicles: true,
    plants: true,
    complaints: true,
    users: true,
  },

  ADMIN_LAYER_2: {
    overview: true,
    waste_generators: true,
    vehicles: true,
    plants: true,
    complaints: true,
    users: true,
  },

  WORKER: {
    overview: true,
    waste_generators: false,
    vehicles: true,
    plants: true,
    complaints: false,
    users: false,
  },
};

/*
|--------------------------------------------------------------------------
| PATH → PERMISSION
|--------------------------------------------------------------------------
*/

const getPermissionForPath = (pathname) => {
  if (
    pathname === "/dashboard" ||
    pathname === "/dashboard/" ||
    pathname === "/dashboard/admin" ||
    pathname === "/dashboard/admin/" ||
    pathname === "/dashboard/admin/overview"
  ) {
    return "overview";
  }

  if (pathname.startsWith("/dashboard/admin/waste-generators")) {
    return "waste_generators";
  }

  if (pathname.startsWith("/dashboard/admin/vehicles")) {
    return "vehicles";
  }

  if (pathname.startsWith("/dashboard/admin/plants")) {
    return "plants";
  }

  if (pathname.startsWith("/dashboard/admin/complaints")) {
    return "complaints";
  }

  if (pathname.startsWith("/dashboard/admin/users")) {
    return "users";
  }

  /*
  |--------------------------------------------------------------------------
  | AI
  |--------------------------------------------------------------------------
  |
  | AI exists in App.jsx but is not part of the page
  | permission matrix we currently have.
  |
  | Therefore we do NOT block it here yet.
  |
  |--------------------------------------------------------------------------
  */

  if (pathname.startsWith("/dashboard/admin/ai")) {
    return null;
  }

  return null;
};

/*
|--------------------------------------------------------------------------
| GET ROLE FROM JWT
|--------------------------------------------------------------------------
*/

const getUserRole = (decoded) => {
  const role =
    decoded?.role ||
    decoded?.userRole ||
    decoded?.adminRole ||
    decoded?.user?.role ||
    decoded?.admin?.role;

  if (!role) {
    return null;
  }

  return String(role).trim().toUpperCase();
};

/*
|--------------------------------------------------------------------------
| LOGIN REDIRECT
|--------------------------------------------------------------------------
*/

const redirectToLogin = () => {
  sessionStorage.clear();

  window.location.replace("https://app-authentication-frontend.onrender.com/");
};

/*
|--------------------------------------------------------------------------
| DEFAULT DASHBOARD REDIRECT
|--------------------------------------------------------------------------
*/

const redirectToOverview = () => {
  window.location.replace("/dashboard/admin/overview");
};

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTE
|--------------------------------------------------------------------------
*/

const ProtectedRoute = ({ children }) => {
  let token = sessionStorage.getItem("token");

  /*
  |--------------------------------------------------------------------------
  | RECOVER TOKEN FROM URL
  |--------------------------------------------------------------------------
  */

  if (!token) {
    const params = new URLSearchParams(window.location.search);

    const urlToken = params.get("token");

    if (urlToken) {
      token = urlToken;

      sessionStorage.setItem("token", urlToken);
    }
  }

  console.log("PROTECTED ROUTE TOKEN EXISTS:", !!token);

  console.log("PROTECTED ROUTE PATH:", window.location.pathname);

  /*
  |--------------------------------------------------------------------------
  | NO TOKEN
  |--------------------------------------------------------------------------
  */

  if (!token) {
    console.error("PROTECTED ROUTE: NO TOKEN");

    redirectToLogin();

    return null;
  }

  try {
    /*
    |--------------------------------------------------------------------------
    | DECODE JWT
    |--------------------------------------------------------------------------
    */

    const decoded = jwtDecode(token);

    console.log("PROTECTED ROUTE JWT:", decoded);

    /*
    |--------------------------------------------------------------------------
    | TOKEN EXPIRY
    |--------------------------------------------------------------------------
    */

    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp < currentTime) {
      console.error("PROTECTED ROUTE: TOKEN EXPIRED");

      redirectToLogin();

      return null;
    }

    /*
    |--------------------------------------------------------------------------
    | ROLE
    |--------------------------------------------------------------------------
    */

    const role = getUserRole(decoded);

    console.log("PROTECTED ROUTE ROLE:", role);

    /*
    |--------------------------------------------------------------------------
    | UNKNOWN ROLE
    |--------------------------------------------------------------------------
    */

    if (!role || !ROLE_ACCESS[role]) {
      console.error("PROTECTED ROUTE: UNKNOWN ROLE", role);

      redirectToLogin();

      return null;
    }

    /*
    |--------------------------------------------------------------------------
    | CURRENT PAGE
    |--------------------------------------------------------------------------
    */

    const pathname = window.location.pathname;

    const requiredPermission = getPermissionForPath(pathname);

    console.log("PROTECTED ROUTE REQUIRED PERMISSION:", requiredPermission);

    /*
    |--------------------------------------------------------------------------
    | PAGE PERMISSION
    |--------------------------------------------------------------------------
    */

    if (requiredPermission) {
      const allowed = Boolean(ROLE_ACCESS[role]?.[requiredPermission]);

      console.log("PROTECTED ROUTE PERMISSION:", {
        role,
        requiredPermission,
        allowed,
      });

      if (!allowed) {
        console.error(
          `RBAC DENIED: ${role} cannot access ${requiredPermission}`,
        );

        redirectToOverview();

        return null;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | ACCESS GRANTED
    |--------------------------------------------------------------------------
    */

    return children;
  } catch (error) {
    console.error("PROTECTED ROUTE JWT ERROR:", error);

    redirectToLogin();

    return null;
  }
};

export default ProtectedRoute;
