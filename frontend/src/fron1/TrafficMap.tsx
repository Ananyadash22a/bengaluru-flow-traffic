import { MapPin, Radio, Truck } from "lucide-react";
import { motion } from "framer-motion";
import type { TrafficZone } from "../fron2/api";

type Props = {
  zones: TrafficZone[];
  selectedZone: TrafficZone | null;
  onSelect: (zone: TrafficZone) => void;
};
const roads = [
  { d: "M65 16 C58 28 66 36 61 46 S53 61 50 77", kind: "busy" },
  { d: "M20 54 C35 50 45 55 59 47 S76 36 91 39", kind: "busy" },
  { d: "M36 14 C42 27 50 33 61 46 S70 65 82 75", kind: "clear" },
  { d: "M12 75 C26 69 39 72 50 77 S67 84 82 75", kind: "busy" },
  { d: "M22 34 C35 39 48 41 61 46", kind: "clear" },
  { d: "M80 13 C75 24 72 31 70 43 S73 62 82 75", kind: "clear" },
];

export function TrafficMap({ zones, selectedZone, onSelect }: Props) {
  return (
    <div className="map-frame">
      <div className="map-topline">
        <span>
          <Radio size={13} /> SIMULATED CORRIDOR VIEW
        </span>
        <span>
          GREATER BENGALURU <i>·</i> 8 ZONES
        </span>
      </div>
      <div className="map-canvas">
        <div className="map-grid" />
        <svg
          className="map-roads"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="img"
          aria-label="Stylized map of simulated traffic corridors in Bengaluru"
        >
          <path
            className="road-base"
            d="M65 16 C58 28 66 36 61 46 S53 61 50 77 M20 54 C35 50 45 55 59 47 S76 36 91 39 M36 14 C42 27 50 33 61 46 S70 65 82 75 M12 75 C26 69 39 72 50 77 S67 84 82 75 M22 34 C35 39 48 41 61 46 M80 13 C75 24 72 31 70 43 S73 62 82 75"
          />
          {roads.map((road, index) => (
            <path
              className={`traffic-road ${road.kind}`}
              d={road.d}
              key={index}
            />
          ))}
          <path
            className="route-highlight"
            d="M78 30 Q73 35 67 45 Q59 51 51 64 Q50 70 49 77"
          />
          <path
            className="route-highlight route-dash"
            d="M78 30 Q73 35 67 45 Q59 51 51 64 Q50 70 49 77"
          />
        </svg>
        <div className="map-river river-one" />
        <div className="map-river river-two" />
        <span className="map-place place-cbd">CENTRAL BUSINESS DISTRICT</span>
        <span className="map-place place-east">EAST BENGALURU</span>
        <span className="map-place place-south">SOUTH ZONE</span>
        {zones.map((zone) => (
          <button
            key={zone.id}
            className={`map-marker ${zone.status.toLowerCase()} ${selectedZone?.id === zone.id ? "active" : ""}`}
            style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
            onClick={() => onSelect(zone)}
            aria-label={`${zone.name}: ${zone.status}, ${zone.congestion}% congestion`}
          >
            <span className="marker-core" />
            <span className="marker-label">{zone.name}</span>
          </button>
        ))}
        <span
          className="incident-marker incident-one"
          aria-label="Simulated incident at Marathahalli"
        >
          <MapPin size={15} fill="currentColor" />
        </span>
        <span
          className="incident-marker incident-two"
          aria-label="Simulated incident at Silk Board"
        >
          <MapPin size={15} fill="currentColor" />
        </span>
        <motion.span
          className="map-vehicle"
          initial={{ left: "77%", top: "32%" }}
          animate={{
            left: ["77%", "68%", "52%", "49%"],
            top: ["32%", "45%", "63%", "77%"],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Truck size={13} />
        </motion.span>
        <div className="map-compass">
          N<span>↑</span>
        </div>
        {selectedZone && (
          <div className="map-selection">
            <span
              className={`selection-dot ${selectedZone.status.toLowerCase()}`}
            />
            <div>
              <strong>{selectedZone.name}</strong>
              <span>
                {selectedZone.congestion}% congestion · {selectedZone.speed}{" "}
                km/h avg.
              </span>
            </div>
            <button
              onClick={() => onSelect(selectedZone)}
              aria-label={`Keep ${selectedZone.name} selected`}
            >
              <MapPin size={15} />
            </button>
          </div>
        )}
      </div>
      <div className="map-bottomline">
        <span>
          <i className="status-dot is-live" /> SIMULATED DATA LAYER
        </span>
        <span>ROUTE OVERLAY: PRIORITY AMBULANCE</span>
        <span>MAP IS ILLUSTRATIVE, NOT NAVIGATIONAL</span>
      </div>
    </div>
  );
}
