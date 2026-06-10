import React, { useState, useEffect, useRef } from "react";
import vietnamPaths from "@/app/data/vietnamPaths.json";
import { useLanguageStore } from "@/stores";

interface ProvincePath {
  id: string;
  label: string;
  d: string;
  centerX: number;
  centerY: number;
}

// Define the 10 traveled hotspots with customized coordinates & labels
const hotspots = [
  { id: "laocai", x: 100.62, y: 57.93, nameVi: "Lào Cai (Sa Pa)", nameEn: "Lao Cai (Sa Pa)", descVi: "Ruộng bậc thang óng vàng & đỉnh Fansipan vươn tầng mây.", descEn: "Golden terraces & Fansipan peak touching the clouds." },
  { id: "hanoi", x: 182.49, y: 134.99, nameVi: "Hà Nội", nameEn: "Hanoi", descVi: "Thủ đô nghìn năm văn hiến, phảng phất vị trà đá vỉa hè.", descEn: "Millennial capital filled with traditional coffee & culture." },
  { id: "quangninh", x: 265.89, y: 121.62, nameVi: "Quảng Ninh (Hạ Long)", nameEn: "Quang Ninh (Ha Long)", descVi: "Kỳ quan đá vôi nhô lên từ làn nước ngọc lục bảo kỳ ảo.", descEn: "Limestone karsts rising from emerald waters." },
  { id: "tthue", x: 284.06, y: 386.61, nameVi: "Thừa Thiên Huế (Huế)", nameEn: "Hue Imperial City", descVi: "Dòng Hương Giang êm đềm trôi qua Kinh thành cổ kính.", descEn: "The peaceful Perfume River flowing by the ancient citadel." },
  { id: "danang", x: 308.62, y: 402.77, nameVi: "Đà Nẵng", nameEn: "Da Nang", descVi: "Thành phố đáng sống bên Cầu Vàng lộng lẫy và biển xanh cát trắng.", descEn: "Modern coastal city famous for the Golden Bridge." },
  { id: "quangnam", x: 303.3, y: 432.66, nameVi: "Quảng Nam (Hội An)", nameEn: "Quang Nam (Hoi An)", descVi: "Phố cổ lung linh đèn lồng soi bóng xuống dòng sông Hoài thơ mộng.", descEn: "Ancient town illuminated by lanterns along Hoai river." },
  { id: "khanhhoa", x: 360.06, y: 601.71, nameVi: "Khánh Hòa (Nha Trang)", nameEn: "Khanh Hoa (Nha Trang)", descVi: "Vịnh biển lộng gió, thiên đường nghỉ dưỡng tràn ngập nắng vàng.", descEn: "Windy coastal bay, a sunny tropical resort paradise." },
  { id: "lamdong", x: 304.46, y: 631.8, nameVi: "Lâm Đồng (Đà Lạt)", nameEn: "Lam Dong (Da Lat)", descVi: "Thành phố ngàn hoa chìm trong làn sương mù thông reo se lạnh.", descEn: "City of flowers shrouded in cool pine forests and mist." },
  { id: "hcm", x: 236.46, y: 684.42, nameVi: "TP. Hồ Chí Minh", nameEn: "Ho Chi Minh City", descVi: "Hòn ngọc Viễn Đông sôi động, rực rỡ sắc màu không bao giờ ngủ.", descEn: "Pearl of the Far East, vibrant and sleepless metropolis." },
  { id: "kiengiang", x: 95.0, y: 705.0, nameVi: "Kiên Giang (Phú Quốc)", nameEn: "Kien Giang (Phu Quoc)", descVi: "Đảo Ngọc hoang sơ, thiên đường ngắm hoàng hôn buông trên biển Tây.", descEn: "Emerald Island, a tropical paradise with beautiful sunsets." }
];

interface VietnamMapProps {
  visitedProvinces?: string[];
}

export function VietnamMap({ visitedProvinces = [] }: VietnamMapProps) {
  const { language } = useLanguageStore();
  const [hoveredProvince, setHoveredProvince] = useState<ProvincePath | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<typeof hotspots[0] | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger entrance animation with a tiny delay
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);



  const handleMouseMove = (e: React.MouseEvent) => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      // Calculate position relative to container
      setTooltipPos({
        x: e.clientX - rect.left + 15,
        y: e.clientY - rect.top + 15
      });
    }
  };

  return (
    <div
      ref={mapContainerRef}
      className="relative w-full overflow-hidden bg-gradient-to-br from-[#FFF9F7] to-[#FFEFEA] dark:from-[#1E1210] dark:to-[#2A1D1A] rounded-3xl border border-red-100/30 dark:border-red-950/20 p-4 md:p-6 pb-16 md:pb-20 shadow-inner select-none transition-colors duration-500"
      onMouseMove={handleMouseMove}
    >
      {/* Component Styles Block for Scoped Keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pingGlow {
          0% {
            transform: scale(0.7);
            opacity: 1;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes markerRise {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .pulse-ring {
          animation: pingGlow 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .hotspot-group {
          animation: markerRise 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .province-path {
          transition: fill 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                      stroke 0.3s ease, 
                      opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}} />

      {/* Title Header */}
      <div className="mb-4 select-none">
        <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff3131] animate-pulse"></span>
          {language === "vi" ? "Bản đồ Hành trình Việt Nam" : "Vietnam Travel Log Map"}
        </h4>
      </div>

      {/* SVG Map Canvas */}
      <svg
        viewBox="0 0 812 873"
        className="w-full h-auto max-h-[480px] md:max-h-[580px] mx-auto filter drop-shadow-md dark:drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base Map Provinces (excluding islands) */}
        <g id="vietnam-provinces">
          {(vietnamPaths as ProvincePath[]).filter((p) => p.id !== "hoangsa" && p.id !== "truongsa").map((province, idx) => {
            // Helper to normalize strings for comparison (removes accents, lowercase, removes non-alphabetic chars)
            const normalizeForMapMatch = (str: string): string => {
              if (!str) return "";
              return str
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "d")
                .replace(/tp\.?\s+/gi, "") // remove "tp." or "tp " prefix for HCMC
                .replace(/[^a-z0-9]/gi, ""); // keep only alphanumeric characters
            };

            const isVisited = visitedProvinces.some(p => {
              const keyP = normalizeForMapMatch(p);
              const keyLabel = normalizeForMapMatch(province.label);
              return keyP === keyLabel || keyP.includes(keyLabel) || keyLabel.includes(keyP);
            });
            const isHovered = hoveredProvince?.id === province.id;

            // Set styles and delays dynamically
            const delay = isLoaded ? 0 : idx * 6;
            const pathStyle = {
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(12px)",
              transitionDelay: `${delay}ms`
            };

            // Custom fill palette based on status
            let fill = "#e2b699ff"; // Subtle light gray for unvisited provinces
            if (isVisited) {
              fill = "#fa7b26ff"; // Bold, vibrant coral-pink for visited provinces
            }
            if (isHovered) {
              fill = "url(#hover-gradient)"; // Glow gradient on hover
            }

            return (
              <path
                key={province.id}
                d={province.d}
                style={pathStyle}
                className="province-path cursor-pointer stroke-[#FFF5F3] stroke-[0.8] hover:stroke-white hover:stroke-[1.5]"
                fill={fill}
                onMouseEnter={() => setHoveredProvince(province)}
                onMouseLeave={() => setHoveredProvince(null)}
              />
            );
          })}

          {/* Hoang Sa Islands (simplified to 5 visible points and enlarged with irregular jagged shapes) */}
          {(vietnamPaths as ProvincePath[]).filter((p) => p.id === "hoangsa").map((island) => {
            const isHovered = hoveredProvince?.id === "hoangsa";
            const islandShapes = [
              "M -4,-2 L -2,-4 L 1,-2 L 3,-4 L 4,-2 L 3,1 L 4,3 L 1,2 L -2,4 L -3,1 L -4,1 Z",
              "M 0,-4 L 2,-2 L 4,-3 L 3,0 L 4,2 L 1,1 L 1,4 L -1,2 L -4,3 L -2,0 L -4,-2 L -1,-1 Z",
              "M -3,-3 L 0,-4 L 2,-2 L 4,-2 L 3,1 L 1,1 L 2,3 L -2,2 L -2,1 L -4,1 L -3,-1 Z"
            ];
            const points = [
              { x: 535, y: 440, scale: 1.8, shapeIdx: 0 },
              { x: 575, y: 410, scale: 2.0, shapeIdx: 1 },
              { x: 590, y: 375, scale: 2.0, shapeIdx: 2 },
              { x: 610, y: 425, scale: 2.0, shapeIdx: 0 },
              { x: 618, y: 395, scale: 1.5, shapeIdx: 1 },
            ];

            return (
              <g
                key={island.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredProvince(island)}
                onMouseLeave={() => setHoveredProvince(null)}
              >
                {points.map((pt, idx) => (
                  <path
                    key={idx}
                    d={islandShapes[pt.shapeIdx]}
                    transform={`translate(${pt.x}, ${pt.y}) scale(${pt.scale})`}
                    className="province-path"
                    fill={isHovered ? "url(#hover-gradient)" : "#e2b699ff"}
                    stroke={isHovered ? "#FFF" : "#FFF5F3"}
                    strokeWidth={isHovered ? 0.6 : 0.4}
                    style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.8s ease, fill 0.3s ease" }}
                  />
                ))}
              </g>
            );
          })}

          {/* Truong Sa Islands (simplified to 7 visible points and enlarged with irregular jagged shapes) */}
          {(vietnamPaths as ProvincePath[]).filter((p) => p.id === "truongsa").map((island) => {
            const isHovered = hoveredProvince?.id === "truongsa";
            const islandShapes = [
              "M -4,-2 L -2,-4 L 1,-2 L 3,-4 L 4,-2 L 3,1 L 4,3 L 1,2 L -2,4 L -3,1 L -4,1 Z",
              "M 0,-4 L 2,-2 L 4,-3 L 3,0 L 4,2 L 1,1 L 1,4 L -1,2 L -4,3 L -2,0 L -4,-2 L -1,-1 Z",
              "M -3,-3 L 0,-4 L 2,-2 L 4,-2 L 3,1 L 1,1 L 2,3 L -2,2 L -2,1 L -4,1 L -3,-1 Z"
            ];
            const points = [
              { x: 660, y: 680, scale: 2.0, shapeIdx: 1 },
              { x: 690, y: 730, scale: 1.8, shapeIdx: 2 },
              { x: 740, y: 710, scale: 2.2, shapeIdx: 0 },
              { x: 780, y: 770, scale: 2.0, shapeIdx: 1 },
              { x: 710, y: 800, scale: 1.8, shapeIdx: 2 },
              { x: 800, y: 720, scale: 1.6, shapeIdx: 0 },
              { x: 670, y: 770, scale: 1.5, shapeIdx: 1 },
            ];

            return (
              <g
                key={island.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredProvince(island)}
                onMouseLeave={() => setHoveredProvince(null)}
              >
                {points.map((pt, idx) => (
                  <path
                    key={idx}
                    d={islandShapes[pt.shapeIdx]}
                    transform={`translate(${pt.x}, ${pt.y}) scale(${pt.scale})`}
                    className="province-path"
                    fill={isHovered ? "url(#hover-gradient)" : "#e2b699ff"}
                    stroke={isHovered ? "#FFF" : "#FFF5F3"}
                    strokeWidth={isHovered ? 0.6 : 0.4}
                    style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.8s ease, fill 0.3s ease" }}
                  />
                ))}
              </g>
            );
          })}
        </g>

        {/* Definition Gradients */}
        <defs>
          {/* Light Mode Hover Gradient */}
          <linearGradient id="hover-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="100%" stopColor="#ffb380" />
          </linearGradient>
          {/* Dark Mode Hover Gradient */}
          <linearGradient id="hover-gradient-dark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#cc1111" />
            <stop offset="100%" stopColor="#ff7733" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Interactive Tooltip */}
      {(hoveredProvince || hoveredHotspot) && (
        <div
          className="absolute z-30 pointer-events-none bg-white/95 dark:bg-[#201514]/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-red-100/50 dark:border-red-950/40 text-left animate-scale-up max-w-[240px] md:max-w-[280px]"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`
          }}
        >
          {hoveredHotspot ? (
            <div>
              {/* Highlight Visited Spot Info */}
              <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white text-sm">
                <span className="w-2 h-2 rounded-full bg-[#ff3131]"></span>
                {language === "vi" ? hoveredHotspot.nameVi : hoveredHotspot.nameEn}
              </div>
              <p className="text-xs text-[#ff3131] dark:text-[#ff7a7a] font-semibold mt-0.5">
                {language === "vi" ? "Điểm đã ghé thăm ✓" : "Visited Destination ✓"}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed italic border-t border-gray-100 dark:border-gray-800/80 pt-1.5">
                "{language === "vi" ? hoveredHotspot.descVi : hoveredHotspot.descEn}"
              </p>
            </div>
          ) : hoveredProvince ? (
            <div>
              {/* Regular Province Info */}
              <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                {hoveredProvince.label}
              </div>
            </div>
          ) : null}
        </div>
      )}


    </div>
  );
}
