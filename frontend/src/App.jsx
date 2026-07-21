import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ApproveDevice from "./pages/ApproveDevice";
import BehaviorEnrollment from "./pages/BehaviorEnrollment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/behavior-enrollment" element={<BehaviorEnrollment />} />

        <Route path="/approve-device" element={<ApproveDevice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
