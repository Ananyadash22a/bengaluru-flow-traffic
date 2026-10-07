import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bike,
  ChevronDown,
  Clock3,
  Crosshair,
  Flame,
  Gauge,
  HeartPulse,
  MapPin,
  Menu,
  Navigation,
  Radio,
  ShieldCheck,
  Siren,
  Signal,
  TrafficCone,
  TrendingUp,
  Truck,
  X,
} from "lucide-react";
import { TrafficMap } from "./fron1/TrafficMap";
import { api, type Incident, type TrafficZone } from "./fron2/api";
import "./App.css";

const sampleZones: TrafficZone[] = [
  {
    id: 1,
    name: "Whitefield",
    status: "HEAVY",
    congestion: 82,
    speed: 14,
    delay: 18,
    updatedAt: "2 min ago",
    x: 78,
    y: 30,
  },
  {
    id: 2,
    name: "Marathahalli",
    status: "SEVERE",
    congestion: 94,
    speed: 8,
    delay: 26,
    updatedAt: "1 min ago",
    x: 67,
    y: 45,
  },
  {
    id: 3,
    name: "Silk Board",
    status: "SEVERE",
    congestion: 91,
    speed: 9,
    delay: 24,
    updatedAt: "1 min ago",
    x: 49,
    y: 77,
  },
  {
    id: 4,
    name: "Electronic City",
    status: "MODERATE",
    congestion: 56,
    speed: 28,
    delay: 8,
    updatedAt: "3 min ago",
    x: 38,
    y: 92,
  },
  {
    id: 5,
    name: "Indiranagar",
    status: "MODERATE",
    congestion: 48,
    speed: 32,
    delay: 6,
    updatedAt: "2 min ago",
    x: 59,
    y: 43,
  },
  {
    id: 6,
    name: "Koramangala",
    status: "HEAVY",
    congestion: 76,
    speed: 17,
    delay: 15,
    updatedAt: "2 min ago",
    x: 51,
    y: 64,
  },
  {
    id: 7,
    name: "Hebbal",
    status: "LOW",
    congestion: 24,
    speed: 48,
    delay: 2,
    updatedAt: "4 min ago",
    x: 46,
    y: 16,
  },
  {
    id: 8,
    name: "KR Puram",
    status: "HEAVY",
    congestion: 73,
    speed: 19,
    delay: 13,
    updatedAt: "2 min ago",
    x: 72,
    y: 37,
  },
];
const sampleIncidents: Incident[] = [
  {
    id: 101,
    type: "Accident",
    location: "Marathahalli Bridge",
    severity: "HIGH",
    status: "ACTIVE",
    reportedAt: "8 min ago",
  },
  {
    id: 102,
    type: "Signal failure",
    location: "Silk Board Junction",
    severity: "MEDIUM",
    status: "ACTIVE",
    reportedAt: "16 min ago",
  },
  {
    id: 103,
    type: "Road construction",
    location: "Outer Ring Road",
    severity: "LOW",
    status: "MONITORING",
    reportedAt: "31 min ago",
  },
];
const navItems = [
  ["Overview", "#overview"],
  ["Traffic", "#traffic"],
  ["Network map", "#map"],
  ["Emergency", "#emergency"],
  ["Analytics", "#analytics"],
];

function App() {
  const [zones, setZones] = useState(sampleZones);
  const [incidents, setIncidents] = useState(sampleIncidents);
  const [selectedZone, setSelectedZone] = useState<TrafficZone | null>(null);
  const [routeResult, setRouteResult] = useState({
    etaMinutes: 21,
    route: ["Whitefield", "Marathahalli", "Manipal Hospital"],
  });
  const [apiOnline, setApiOnline] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [routeReady, setRouteReady] = useState(false);
  const [routeStep, setRouteStep] = useState(0);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([api.getZones(), api.getIncidents(), api.isAvailable()])
      .then(([zoneData, incidentData, online]) => {
        if (!active) return;
        const overviewZones = zoneData.filter((zone) =>
          sampleZones.some((sample) => sample.name === zone.name),
        );
        if (overviewZones.length) setZones(overviewZones);
        if (incidentData.length) setIncidents(incidentData);
        setApiOnline(online);
      })
      .catch(() => {
        if (active) setApiOnline(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  async function optimizeRoute() {
    setOptimizing(true);
    setRouteReady(false);
    setRouteStep(0);
    for (let step = 1; step <= 3; step += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      setRouteStep(step);
    }
    try {
      const result = await api.optimizeRoute();
      setRouteResult({ etaMinutes: result.etaMinutes, route: result.route });
    } catch {
      /* Demo route remains usable while the API is offline. */
    }
    setOptimizing(false);
    setRouteReady(true);
  }

  async function submitIncident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      type: String(form.get("type") ?? ""),
      location: String(form.get("location") ?? "").trim(),
      severity: String(form.get("severity") ?? ""),
      description: String(form.get("description") ?? "").trim(),
    };
    if (!payload.location || payload.description.length < 12) {
      setFormError(
        "Add a location and a description of at least 12 characters.",
      );
      return;
    }
    setSubmitting(true);
    try {
      const created = await api.createIncident(payload);
      setIncidents((current) => [created, ...current]);
      formElement.reset();
      setToast(
        "Incident report received. Thank you for helping Bengaluru move.",
      );
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Could not submit the report. Check your connection.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const activeIncidents = incidents.filter(
    (incident) => incident.status === "ACTIVE",
  ).length;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="BengaluruFlow home">
          <span className="brand-mark">
            <Activity size={19} />
          </span>
          <span className="brand-name">
            Bengaluru<span>Flow</span>
          </span>
          <span className="brand-divider" />
          <span className="brand-caption">CITY OPERATIONS</span>
        </a>
        <button
          className="mobile-menu icon-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
        <nav
          className={`main-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="topbar-right">
          <div className="connection-pill">
            <span className={`status-dot ${apiOnline ? "is-live" : ""}`} />
            {apiOnline ? "API connected" : "DEMO MODE"}
          </div>
          <button
            className="icon-button alert-button"
            aria-label="Incident notifications"
          >
            <Bell size={18} />
            <i>{activeIncidents}</i>
          </button>
          <button className="operator-button">
            <span className="operator-avatar">BO</span>
            <span>City operator</span>
            <ChevronDown size={15} />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="overview">
          <div className="hero-photo" />
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line" /> BENGALURU URBAN MOBILITY{" "}
              <span className="eyebrow-year">EST. 2025</span>
            </div>
            <h1>
              Smarter roads.
              <br />
              <span>Faster response.</span>
            </h1>
            <p className="hero-copy">
              A clearer view of the city, and a faster way to move it forward.
            </p>
            <div className="hero-actions">
              <a href="#traffic" className="button button-primary">
                Explore traffic <ArrowRight size={16} />
              </a>
              <a href="#emergency" className="button button-secondary">
                <Siren size={16} /> Emergency mode
              </a>
            </div>
            <div className="hero-footnote">
              <span className="pulse-ring" /> SIMULATED NETWORK DATA{" "}
              <span className="footnote-divider">/</span> NOT A LIVE TRAFFIC
              FEED
            </div>
          </div>
          <div className="hero-coordinate">
            12°58' N&nbsp; 77°35' E <span>·</span> BENGALURU, IN
          </div>
          <div className="hero-scroll">
            <span /> SCROLL TO EXPLORE
          </div>
        </section>

        <section className="overview-strip" aria-label="Network summary">
          <div className="overview-item">
            <span className="overview-icon">
              <Navigation size={18} />
            </span>
            <div>
              <strong>24</strong>
              <span>MONITORED ROUTES</span>
            </div>
            <span className="overview-change positive">
              <ArrowUpRight size={13} /> 3
            </span>
          </div>
          <div className="overview-item">
            <span className="overview-icon orange">
              <TrafficCone size={19} />
            </span>
            <div>
              <strong>
                {activeIncidents.toString().padStart(2, "0")}
                <small> / 18</small>
              </strong>
              <span>ACTIVE INCIDENTS</span>
            </div>
            <span className="overview-change negative">
              <ArrowDownRight size={13} /> 2
            </span>
          </div>
          <div className="overview-item">
            <span className="overview-icon green">
              <Truck size={19} />
            </span>
            <div>
              <strong>07</strong>
              <span>EMERGENCY UNITS</span>
            </div>
            <span className="overview-change">ON DUTY</span>
          </div>
          <div className="overview-item">
            <span className="overview-icon lime">
              <Gauge size={19} />
            </span>
            <div>
              <strong>
                62<small>%</small>
              </strong>
              <span>NETWORK FLOW</span>
            </div>
            <span className="overview-change positive">
              <TrendingUp size={13} /> 4.8%
            </span>
          </div>
        </section>

        <section className="section traffic-section" id="traffic">
          <div className="section-heading">
            <div>
              <div className="section-kicker">01 / NETWORK PULSE</div>
              <h2>Traffic, at a glance.</h2>
              <p>
                Eight key corridors across Greater Bengaluru. Conditions are
                simulated for demonstration.
              </p>
            </div>
            <div className="updated-label">
              <span className="status-dot is-live" /> SIMULATION{" "}
              <span className="updated-separator">·</span> UPDATED JUST NOW
            </div>
          </div>
          <div className="zone-grid">
            {zones.map((zone, index) => (
              <motion.button
                key={zone.id}
                className={`zone-card status-${zone.status.toLowerCase()} ${selectedZone?.id === zone.id ? "selected" : ""}`}
                onClick={() => setSelectedZone(zone)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.045, duration: 0.38 }}
                whileHover={{ y: -3 }}
              >
                <div className="zone-card-top">
                  <span className="zone-name">{zone.name}</span>
                  <span className={`traffic-tag ${zone.status.toLowerCase()}`}>
                    {zone.status}
                  </span>
                </div>
                <div className="zone-reading">
                  <strong>
                    {zone.congestion}
                    <small>%</small>
                  </strong>
                  <div className="zone-speed">
                    <span>{zone.speed}</span> km/h
                    <br />
                    <small>AVG SPEED</small>
                  </div>
                </div>
                <div className="meter-track">
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: `${zone.congestion}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
                <div className="zone-card-bottom">
                  <span>
                    <Clock3 size={12} /> +{zone.delay} min delay
                  </span>
                  <span>{zone.updatedAt}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="section map-section" id="map">
          <div className="section-heading map-heading">
            <div>
              <div className="section-kicker">02 / CITY NETWORK</div>
              <h2>Read the road ahead.</h2>
              <p>
                A simulated corridor view. Select a zone to inspect its current
                conditions.
              </p>
            </div>
            <div className="map-legend">
              <span>
                <i className="legend-line clear" /> CLEAR
              </span>
              <span>
                <i className="legend-line busy" /> CONGESTED
              </span>
              <span>
                <i className="legend-pin" /> INCIDENT
              </span>
            </div>
          </div>
          <TrafficMap
            zones={zones}
            selectedZone={selectedZone}
            onSelect={setSelectedZone}
          />
        </section>

        <section className="section emergency-section" id="emergency">
          <div className="section-heading">
            <div>
              <div className="section-kicker">03 / PRIORITY RESPONSE</div>
              <h2>Clear the way.</h2>
              <p>
                Explore a sample priority route through today's simulated
                network.
              </p>
            </div>
            <div className="priority-badge">
              <span /> PRIORITY ROUTING
            </div>
          </div>
          <div className="emergency-layout">
            <div className="dispatch-panel">
              <div className="dispatch-panel-head">
                <div>
                  <span className="panel-overline">ACTIVE UNIT</span>
                  <h3>
                    <span className="vehicle-symbol">
                      <HeartPulse size={18} />
                    </span>{" "}
                    AMB-102
                  </h3>
                </div>
                <span className="availability">
                  <i /> AVAILABLE
                </span>
              </div>
              <div className="dispatch-route">
                <div className="route-point">
                  <span className="route-origin" />
                  <div>
                    <small>ORIGIN</small>
                    <strong>Whitefield</strong>
                  </div>
                  <span className="route-meta">12:42 PM</span>
                </div>
                <div className="route-connector">
                  <span />
                </div>
                <div className="route-point">
                  <span className="route-destination">
                    <Crosshair size={13} />
                  </span>
                  <div>
                    <small>DESTINATION</small>
                    <strong>Manipal Hospital</strong>
                  </div>
                  <span className="route-meta">
                    <HeartPulse size={13} /> ER
                  </span>
                </div>
              </div>
              <div className="dispatch-meta">
                <div>
                  <span>PRIORITY</span>
                  <strong className="priority-high">
                    <Flame size={13} /> HIGH
                  </strong>
                </div>
                <div>
                  <span>TRAFFIC LEVEL</span>
                  <strong>
                    HEAVY{" "}
                    <i className="traffic-bars">
                      <b />
                      <b />
                      <b />
                      <b />
                    </i>
                  </strong>
                </div>
                <div>
                  <span>UNIT TYPE</span>
                  <strong>
                    <Bike size={14} /> AMBULANCE
                  </strong>
                </div>
              </div>
              <button
                className="button button-primary optimize-button"
                onClick={optimizeRoute}
                disabled={optimizing}
              >
                {optimizing ? (
                  <>
                    <span className="spinner" />{" "}
                    {
                      [
                        "Analyzing traffic",
                        "Checking available routes",
                        "Calculating ETA",
                      ][Math.max(0, routeStep - 1)]
                    }
                  </>
                ) : (
                  <>
                    <Crosshair size={16} /> Optimize route{" "}
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
            <div
              className={`route-result ${routeReady ? "route-result-ready" : ""}`}
            >
              <div className="route-result-top">
                <span className="panel-overline">ROUTE RECOMMENDATION</span>
                <span className="sim-tag">SIMULATED</span>
              </div>
              <AnimatePresence mode="wait">
                {routeReady ? (
                  <motion.div
                    key="ready"
                    className="route-ready"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="eta-reading">
                      <strong>{routeResult.etaMinutes}</strong>
                      <span>
                        MIN
                        <br />
                        <small>EST. ARRIVAL</small>
                      </span>
                    </div>
                    <div className="route-summary">
                      <span className="route-summary-label">
                        RECOMMENDED ROUTE
                      </span>
                      <p>
                        {routeResult.route.map((stop, index) => (
                          <span key={`${stop}-${index}`}>
                            {index > 0 && <i />}
                            {stop}
                          </span>
                        ))}
                      </p>
                      <span className="route-saved">
                        <TrendingUp size={13} /> Lowest simulated
                        traffic-weighted cost
                      </span>
                    </div>
                    <div className="route-line-art">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    className="route-idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="route-idle-icon">
                      <Radio size={20} />
                    </div>
                    <strong>
                      {optimizing
                        ? "Finding the clearest path"
                        : "Route analysis ready"}
                    </strong>
                    <span>
                      {optimizing
                        ? "Evaluating simulated corridor conditions"
                        : "Optimize to see a priority route recommendation"}
                    </span>
                    <div className="route-skeleton">
                      <i />
                      <i />
                      <i />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="route-result-foot">
                <span>
                  <ShieldCheck size={13} /> PRIORITY CORRIDOR
                </span>
                <span>SIMULATED ROUTE ESTIMATE</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section incident-section" id="incidents">
          <div className="section-heading">
            <div>
              <div className="section-kicker">04 / COMMUNITY SIGNAL</div>
              <h2>Report what you see.</h2>
              <p>Help operators understand what's happening on the ground.</p>
            </div>
            <a className="text-link" href="#report-form">
              Submit a report <ArrowRight size={15} />
            </a>
          </div>
          <div className="incident-layout">
            <div className="incident-feed">
              <div className="feed-header">
                <span>RECENT INCIDENTS</span>
                <span className="feed-count">
                  {incidents.length.toString().padStart(2, "0")} REPORTS
                </span>
              </div>
              {incidents.slice(0, 4).map((incident) => (
                <article className="incident-row" key={incident.id}>
                  <span
                    className={`incident-icon ${incident.severity.toLowerCase()}`}
                  >
                    <TrafficCone size={16} />
                  </span>
                  <div className="incident-main">
                    <strong>{incident.type}</strong>
                    <span>
                      <MapPin size={12} /> {incident.location}
                    </span>
                  </div>
                  <div className="incident-status">
                    <span
                      className={`severity severity-${incident.severity.toLowerCase()}`}
                    >
                      {incident.severity}
                    </span>
                    <span>{incident.reportedAt}</span>
                  </div>
                </article>
              ))}
              {incidents.length === 0 && (
                <div className="empty-state">
                  No incidents to show. Reports will appear here.
                </div>
              )}
              <div className="feed-foot">
                <span>
                  <span className="status-dot is-live" />{" "}
                  {apiOnline ? "CONNECTED TO API" : "DEMO INCIDENTS"}
                </span>
                <span>DATA IS SIMULATED</span>
              </div>
            </div>
            <form
              className="report-form"
              id="report-form"
              onSubmit={submitIncident}
            >
              <div className="form-header">
                <div>
                  <span className="panel-overline">NEW REPORT</span>
                  <h3>Share a road incident</h3>
                </div>
                <span className="required-note">* REQUIRED</span>
              </div>
              <div className="form-row">
                <label>
                  Incident type
                  <select name="type" required defaultValue="">
                    <option value="" disabled>
                      Select type
                    </option>
                    <option>Accident</option>
                    <option>Road construction</option>
                    <option>Signal failure</option>
                    <option>Waterlogging</option>
                    <option>Traffic congestion</option>
                  </select>
                </label>
                <label>
                  Severity
                  <select name="severity" required defaultValue="MEDIUM">
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                    <option>CRITICAL</option>
                  </select>
                </label>
              </div>
              <label>
                Location
                <input
                  name="location"
                  required
                  maxLength={100}
                  placeholder="e.g. Outer Ring Road, Marathahalli"
                />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  required
                  minLength={12}
                  maxLength={500}
                  placeholder="What is happening? Add details that can help responders."
                  rows={3}
                />
              </label>
              {formError && (
                <p className="form-error" role="alert">
                  {formError}
                </p>
              )}
              <button
                className="button button-primary submit-button"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Sending report…" : "Submit incident report"}{" "}
                {!submitting && <ArrowRight size={15} />}
              </button>
              <span className="form-disclaimer">
                <ShieldCheck size={12} /> Reports are stored when the backend
                API is connected.
              </span>
            </form>
          </div>
        </section>

        <section className="analytics-section" id="analytics">
          <div className="section analytics-inner">
            <div className="section-heading">
              <div>
                <div className="section-kicker">05 / NETWORK INTELLIGENCE</div>
                <h2>The city's daily rhythm.</h2>
                <p>Illustrative historical patterns, not live measurements.</p>
              </div>
              <span className="period-select">
                TYPICAL WEEKDAY <ChevronDown size={14} />
              </span>
            </div>
            <div className="analytics-grid">
              <div className="analytics-chart">
                <div className="chart-title">
                  <div>
                    <span className="panel-overline">CONGESTION INDEX</span>
                    <strong>Traffic through the day</strong>
                  </div>
                  <span className="chart-unit">INDEX / 100</span>
                </div>
                <div
                  className="chart-bars"
                  aria-label="Simulated traffic congestion by hour"
                >
                  {[
                    32, 29, 25, 27, 39, 55, 68, 81, 77, 69, 63, 58, 54, 57, 62,
                    71, 86, 94, 91, 82, 68, 56, 43, 35,
                  ].map((height, index) => (
                    <div className="chart-column" key={index}>
                      <span
                        className={`chart-bar ${height > 80 ? "chart-hot" : ""}`}
                        style={{ height: `${height}%` }}
                      />
                      <i>
                        {index % 3 === 0
                          ? `${String(index).padStart(2, "0")}:00`
                          : ""}
                      </i>
                    </div>
                  ))}
                </div>
                <div className="chart-legend">
                  <span>
                    <i /> CONGESTION INDEX
                  </span>
                  <span>
                    PEAK <b>6:00 PM</b>
                  </span>
                </div>
              </div>
              <div className="analytics-stats">
                <div className="stat-card">
                  <span className="stat-icon">
                    <Clock3 size={17} />
                  </span>
                  <span className="panel-overline">AVERAGE DELAY</span>
                  <strong>
                    +12.4 <small>min</small>
                  </strong>
                  <span className="stat-note">
                    <ArrowDownRight size={13} /> 1.8 min vs. prior week
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-icon green">
                    <Siren size={17} />
                  </span>
                  <span className="panel-overline">RESPONSE TIME</span>
                  <strong>
                    08:42 <small>min</small>
                  </strong>
                  <span className="stat-note">
                    <ArrowDownRight size={13} /> 0.6 min vs. prior week
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-icon orange">
                    <Signal size={17} />
                  </span>
                  <span className="panel-overline">ROUTE EFFICIENCY</span>
                  <strong>
                    76<small>%</small>
                  </strong>
                  <span className="stat-note">
                    <ArrowUpRight size={13} /> 4.2% vs. prior week
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section how-section" id="how-it-works">
          <div className="section-heading">
            <div>
              <div className="section-kicker">06 / THE RESPONSE LOOP</div>
              <h2>From signal to action.</h2>
              <p>A simple operating model for this simulated city network.</p>
            </div>
          </div>
          <div className="how-grid">
            <article className="how-step">
              <span className="how-number">01</span>
              <span className="how-icon"><Radio size={18} /></span>
              <h3>See the signal</h3>
              <p>Zone conditions and community incident reports form a shared corridor picture.</p>
            </article>
            <article className="how-step">
              <span className="how-number">02</span>
              <span className="how-icon"><TrafficCone size={18} /></span>
              <h3>Understand impact</h3>
              <p>Operators can review incident severity alongside simulated congestion and delay.</p>
            </article>
            <article className="how-step">
              <span className="how-number">03</span>
              <span className="how-icon"><Siren size={18} /></span>
              <h3>Prioritize response</h3>
              <p>A transparent traffic-weighted heuristic compares sample emergency corridors.</p>
            </article>
            <article className="how-step">
              <span className="how-number">04</span>
              <span className="how-icon"><Activity size={18} /></span>
              <h3>Learn from patterns</h3>
              <p>Illustrative historical analytics help explain where delay tends to concentrate.</p>
            </article>
          </div>
        </section>

        <section className="closing-section">
          <div className="closing-grid">
            <div className="closing-label">
              <span className="section-kicker">
                BUILT FOR THE WAY BENGALURU MOVES
              </span>
              <span className="closing-index">
                12.9716° N<br />
                77.5946° E
              </span>
            </div>
            <div className="closing-copy">
              <h2>
                Every minute
                <br />
                moves us forward.
              </h2>
              <p>
                A portfolio prototype exploring how connected traffic signals
                can support faster, more coordinated city response.
              </p>
              <a className="button button-light" href="#map">
                Explore the network <ArrowRight size={15} />
              </a>
            </div>
            <div className="closing-art" aria-hidden="true">
              <div className="closing-ring ring-one" />
              <div className="closing-ring ring-two" />
              <div className="closing-ring ring-three" />
              <span className="closing-center">
                <Activity size={22} />
              </span>
              <i className="closing-node node-a" />
              <i className="closing-node node-b" />
              <i className="closing-node node-c" />
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <a className="brand footer-brand" href="#overview">
          <span className="brand-mark">
            <Activity size={17} />
          </span>
          <span className="brand-name">
            Bengaluru<span>Flow</span>
          </span>
        </a>
        <span className="footer-tagline">Smarter Roads. Faster Response.</span>
        <span className="footer-disclaimer">
          PORTFOLIO PROTOTYPE · ALL TRAFFIC DATA IS SIMULATED
        </span>
        <span className="footer-copy">© 2025 BENGALURUFLOW</span>
      </footer>
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <ShieldCheck size={18} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
