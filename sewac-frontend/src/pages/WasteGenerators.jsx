import Header from "../components/layouts/Header";

import WasteGenKPIs from "../components/waste-generators/WasteGenKPIs";
import WasteGenMap from "../components/waste-generators/WasteGenMap";
import GVPGen from "../components/waste-generators/GVPGen";
import WasteGenDir from "../components/waste-generators/WasteGenDir";

export default function WasteGenerators() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFC]">

      {/* ================= Header ================= */}

      <Header />

      {/* ================= Page ================= */}

      <div className="max-w-[1650px] mx-auto px-8 py-7">

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
          <WasteGenKPIs />
        </section>

        {/* ================= Maps ================= */}

        <section className="mt-5">
          <WasteGenMap />
        </section>

        {/* ================= GVP Generation Trend ================= */}

        <section className="mt-5">
          <GVPGen />
        </section>

        {/* ================= Waste Generator Directory ================= */}

        <section className="mt-5 mb-8">
          <WasteGenDir />
        </section>

      </div>

    </div>
  );
}