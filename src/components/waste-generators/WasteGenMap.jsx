import { useEffect, useRef } from "react";
import { Plus, Minus } from "lucide-react";
import { gsap } from "gsap";

export default function WasteGenMap() {
  const sectionRef = useRef(null);
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
      }).from(
        collectionCardRef.current,
        {
          opacity: 0,
          y: 55,
          scale: 0.96,
          duration: 1.1,
        },
        "-=0.05",
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="grid grid-cols-1 gap-5 h-full">
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
          w-full
          h-full
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
              <p className="text-slate-400 text-sm">Collection Map</p>

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
