import { useEffect, useState } from "react";

import {
  getDevices,
  getBehaviorHistory,
  getRiskHistory,
} from "../services/dashboardService";

const Dashboard = () => {
  const [devices, setDevices] = useState([]);

  const [behavior, setBehavior] = useState([]);

  const [risk, setRisk] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const devicesData = await getDevices();

      const behaviorData = await getBehaviorHistory();

      const riskData = await getRiskHistory();

      setDevices(devicesData.devices || []);

      setBehavior(behaviorData.history || []);

      setRisk(riskData.history || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-4xl font-bold">CMADS Security Dashboard</h1>

        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-900 rounded-2xl p-6">
            <h2>Registered Devices</h2>

            <p className="text-4xl font-bold mt-2">{devices.length}</p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <h2>Behavior Records</h2>

            <p className="text-4xl font-bold mt-2">{behavior.length}</p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <h2>Risk Events</h2>

            <p className="text-4xl font-bold mt-2">{risk.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
