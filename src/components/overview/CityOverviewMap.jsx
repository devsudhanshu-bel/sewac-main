import { useState, useRef, useEffect } from "react";

import {
  ChevronDown,
  Check,
  Route,
  MapPinned,
  Flame,
  Factory,
  Megaphone,
} from "lucide-react";

import { gsap } from "gsap";

import MapSection from "../dashboard/MapSection";

const mapViews = [
  {
    id: "route",
    label: "Route Map",
    icon: Route,
    color: "text-violet-600",
  },
  {
    id: "gvp",
    label: "Garbage Vulnerable Points (GVP)",
    icon: MapPinned,
    color: "text-green-600",
  },
  {
    id: "heatmap",
    label: "Participation Heatmap",
    icon: Flame,
    color: "text-red-500",
  },
  {
    id: "plants",
    label: "Plants Active",
    icon: Factory,
    color: "text-emerald-600",
  },
  {
    id: "grievances",
    label: "Customer Grievances",
    icon: Megaphone,
    color: "text-pink-500",
  },
];

export default function CityOverviewMap() {
  const [selectedView, setSelectedView] = useState(mapViews[0]);

  const [open, setOpen] = useState(false);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const mapRef = useRef(null);
  const controlsRef = useRef(null);
  const dropdownRef = useRef(null);

  // ================= APPLE STYLE PAGE LOAD =================

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    tl.from(sectionRef.current, {
      opacity: 0,
      y: 28,
      duration: 0.45,
    })
      .from(
        headerRef.current,
        {
          opacity: 0,
          y: 18,
          duration: 0.45,
        },
        "-=0.25",
      )
      .from(
        mapRef.current,
        {
          opacity: 0,
          scale: 0.985,
          duration: 0.8,
        },
        "-=0.2",
      )
      .from(
        controlsRef.current,
        {
          opacity: 0,
          x: -18,
          duration: 0.55,
        },
        "-=0.55",
      );
  }, []);

  // ================= APPLE DROPDOWN =================

  useEffect(() => {
    if (!dropdownRef.current) return;

    if (open) {
      gsap.fromTo(
        dropdownRef.current,
        {
          opacity: 0,
          y: -10,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.28,
          ease: "power2.out",
        },
      );
    }
  }, [open]);

  // ================= MAP TRANSITION =================

  const handleSelect = (item) => {
    if (item.id === selectedView.id) {
      setOpen(false);
      return;
    }

    gsap.to(mapRef.current, {
      opacity: 0,
      scale: 0.992,
      duration: 0.18,
      ease: "power2.out",
      onComplete: () => {
        setSelectedView(item);

        requestAnimationFrame(() => {
          gsap.to(mapRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "power3.out",
          });
        });
      },
    });

    setOpen(false);
  };

  return (
    <section ref={sectionRef} className="mt-6">
      <div className="bg-white rounded-[26px] border border-[#EEF1F6] shadow-sm overflow-hidden">
        {/* ================= HEADER ================= */}

        <div ref={headerRef} className="px-8 pt-6 pb-5">
          <h2 className="text-[18px] font-semibold tracking-wide text-[#171717]">
            CITY OVERVIEW MAP
          </h2>
        </div>

        {/* ================= MAP ================= */}

        <div className="relative mx-2 mb-2 rounded-[22px] overflow-hidden">
          <div ref={mapRef} className="relative h-[460px] z-0">
            <MapSection mapView={selectedView.id} />
          </div>

          {/* MAP VIEW CONTROL */}

          <div
            ref={controlsRef}
            className="absolute top-6 left-6 z-[1000] w-[285px]"
          >
            <p className="text-[13px] font-medium text-gray-700 mb-3">
              Select Map View
            </p>

            <button
              onClick={() => setOpen((prev) => !prev)}
              className="
        w-full
        h-[48px]
        bg-white/95
        backdrop-blur-xl
        rounded-xl
        border
        border-[#E7EAF1]
        px-4
        flex
        items-center
        justify-between
        shadow-[0_12px_35px_rgba(15,23,42,0.12)]
        hover:border-violet-300
        hover:shadow-[0_18px_40px_rgba(15,23,42,0.15)]
        transition-all
        duration-300
      "
            >
              <span className="text-[14px] font-semibold">
                {selectedView.label}
              </span>

              <ChevronDown
                size={18}
                className={`transition-all duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div
                ref={dropdownRef}
                className="
          mt-2
          bg-white/95
          backdrop-blur-2xl
          rounded-2xl
          border
          border-[#EEF1F6]
          shadow-[0_20px_45px_rgba(15,23,42,0.18)]
          overflow-hidden
          origin-top
        "
              >
                {mapViews.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`
                w-full
                h-[54px]
                px-4
                flex
                items-center
                justify-between
                transition-all
                duration-200
                ${
                  selectedView.id === item.id
                    ? "bg-violet-50"
                    : "hover:bg-gray-50"
                }
              `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={item.color} />

                        <span className="text-[13px] font-medium text-gray-700">
                          {item.label}
                        </span>
                      </div>

                      {selectedView.id === item.id && (
                        <Check size={18} className="text-violet-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
