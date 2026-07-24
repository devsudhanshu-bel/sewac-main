import { useEffect, useRef } from "react";
import { Info, Plus, Minus } from "lucide-react";
import { gsap } from "gsap";

export default function WasteGenMap() {
  const sectionRef = useRef(null);
  const heatCardRef = useRef(null);
  const collectionCardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(sectionRef.current, {
        opacity: 0,
        duration: 0.25,
      })
        .from(
          heatCardRef.current,
          {
            opacity: 0,
            y: 55,
            scale: 0.96,
            duration: 1.1,
          },
          "-=0.05"
        )
        .from(
          collectionCardRef.current,
          {
            opacity: 0,
            y: 55,
            scale: 0.96,
            duration: 1.1,
          },
          "-=0.85"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="grid grid-cols-2 gap-5 mt-5"
    >

      {/* ================= Heat Map ================= */}

      <div
        ref={heatCardRef}
        className="
          bg-white
          rounded-3xl
          border
          border-gray-200
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          overflow-hidden
        "
      >

        {/* Header */}

        <div className="px-5 pt-4 pb-3 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <h3 className="text-[14px] font-semibold text-[#16295A]">
              Waste Generation Heat Map
            </h3>

          </div>

          <div className="flex items-center gap-3">

            <span className="text-[11px] text-slate-500">
              View By:
            </span>

            <select
              className="
                h-8
                px-3
                rounded-lg
                border
                border-slate-200
                text-[11px]
                outline-none
              "
            >
              <option>Zone</option>
            </select>

            <span className="text-[11px] text-slate-500">
              Threshold (Kg):
            </span>

            <input
              defaultValue="500"
              className="
                w-16
                h-8
                rounded-lg
                border
                border-slate-200
                text-center
                text-[11px]
                outline-none
              "
            />

            <button
              className="
                h-8
                px-4
                rounded-lg
                bg-violet-600
                text-white
                text-[11px]
                font-semibold
                transition-all
                duration-300
                hover:bg-violet-700
              "
            >
              Apply
            </button>

          </div>

        </div>

        {/* Map */}

        <div className="relative h-[310px] bg-[#F7F8FB]">

          {/* Zoom */}

          <div className="absolute top-4 left-4 z-10">

            <div className="bg-white rounded-xl shadow">

              <button className="w-9 h-9 flex items-center justify-center border-b hover:bg-slate-50 transition-colors">
                <Plus size={16} />
              </button>

              <button className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 transition-colors">
                <Minus size={16} />
              </button>

            </div>

          </div>

          {/* Info */}

          <div className="absolute top-4 right-4">

            <button className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-slate-50 transition-colors">
              <Info size={15} />
            </button>

          </div>

          {/* Placeholder */}

          <div className="absolute inset-0 flex items-center justify-center">

            <div className="text-center">

              <p className="text-slate-400 text-sm">
                Heat Map
              </p>

              <p className="text-xs text-slate-400 mt-2">
                MapLibre map will be integrated here.
              </p>

            </div>

          </div>

        </div>

      </div>
            {/* ================= Collection Point ================= */}

      <div
        ref={collectionCardRef}
        className="
          bg-white
          rounded-3xl
          border
          border-gray-200
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          overflow-hidden
        "
      >

        {/* Header */}

        <div className="px-5 pt-4 pb-3 flex items-center justify-between">

          <h3 className="text-[14px] font-semibold text-[#16295A]">
            Collection Point Monitoring
          </h3>

          <div className="flex items-center gap-6">

            <div className="flex items-center gap-2">

              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>

              <span className="text-[11px] text-slate-500">
                Authorized Point
              </span>

            </div>

            <div className="flex items-center gap-2">

              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>

              <span className="text-[11px] text-slate-500">
                Unauthorized Point
              </span>

            </div>

          </div>

        </div>

        {/* Map */}

        <div className="relative h-[310px] bg-[#F7F8FB]">

          {/* Zoom Controls */}

          <div className="absolute top-4 left-4 z-10">

            <div className="bg-white rounded-xl shadow">

              <button className="w-9 h-9 flex items-center justify-center border-b hover:bg-slate-50 transition-colors duration-300">
                <Plus size={16} />
              </button>

              <button className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 transition-colors duration-300">
                <Minus size={16} />
              </button>

            </div>

          </div>

          {/* Placeholder */}

          <div className="absolute inset-0 flex items-center justify-center">

            <div className="text-center">

              <p className="text-slate-400 text-sm">
                Collection Map
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Vehicle markers will appear here.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}