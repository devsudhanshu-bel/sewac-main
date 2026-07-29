import { useEffect, useState } from "react";
import Header from "../components/layouts/Header";
import api from "../api/axios";

import WasteGenKPIs from "../components/waste-generators/WasteGenKPIs";
import WasteGenMap from "../components/waste-generators/WasteGenMap";
import GVPGen from "../components/waste-generators/GVPGen";
import WasteGenDir from "../components/waste-generators/WasteGenDir";

export default function WasteGenerators() {
  const [summary, setSummary] = useState(null);
  const loadSummary = async () => {
    try {
      const res = await api.get("/api/waste-generators/summary");

      setSummary(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    loadSummary();
  }, []);


  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFC]">
      {/* ================= Header ================= */}

      <Header />

      {/* ================= Page ================= */}

      <div className="w-full px-8 py-7 overflow-x-hidden">
        {/* ================= Title ================= */}

        <div>
          <h1 className="text-[34px] font-bold tracking-tight text-[#16295A]">
            Waste Generators
          </h1>

          <p className="mt-1 text-[14px] text-slate-500">
            Overview of waste generators participation, waste contribution,
            activity, monitoring and collection performance.
          </p>
        </div>

        {/* ================= KPI Cards ================= */}

        <section className="mt-6">
          <WasteGenKPIs summary={summary} />
        </section>

        {/* ================= Maps ================= */}

        <section className="mt-5">
          <WasteGenMap />
        </section>

        {/* ================= GVP Trend ================= */}

        <section className="mt-5">
          <GVPGen />
        </section>

        {/* ================= Directory ================= */}

        <section className="mt-5 mb-8">
          <WasteGenDir />
        </section>
      </div>
    </div>
  );
}
