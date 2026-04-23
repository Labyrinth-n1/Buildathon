import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion } from "motion/react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface GlobalMapProps {
  markers: { id: string; lat: number; lng: number; name: string; size: number; color: string }[];
}

export function GlobalMap({ markers }: GlobalMapProps) {
  return (
    <div className="w-full h-full relative overflow-hidden bg-black/20 rounded-2xl border border-white/5 medical-grid">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-xs font-mono text-neon-blue uppercase tracking-widest">Projection Géospatiale Temporelle</h3>
      </div>
      
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 150 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(30, 41, 59, 0.4)"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "rgba(51, 65, 85, 0.6)", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        {markers.map(({ id, lat, lng, name, size, color }) => (
          <Marker key={id} coordinates={[lng, lat]}>
            <motion.circle
              initial={{ r: 0, opacity: 0 }}
              animate={{ 
                r: size, 
                opacity: 0.6,
                strokeWidth: [1, 3, 1],
                strokeOpacity: [0.6, 0.2, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              fill={color}
              stroke={color}
            />
            <circle r={2} fill={color} />
          </Marker>
        ))}
      </ComposableMap>
      
      <div className="absolute bottom-4 right-4 flex items-center gap-4 bg-black/40 px-3 py-2 rounded-lg border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-red animate-pulse" />
          <span className="text-[10px] font-mono text-slate-400">ALERTE CRITIQUE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_8px_purple]" />
          <span className="text-[10px] font-mono text-slate-400">CLUSTER ACTIF</span>
        </div>
      </div>
    </div>
  );
}
