export type TrafficStatus = "LOW" | "MODERATE" | "HEAVY" | "SEVERE";
export type TrafficZone = {
  id: number;
  name: string;
  status: TrafficStatus;
  congestion: number;
  speed: number;
  delay: number;
  updatedAt: string;
  x: number;
  y: number;
};
export type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  status: string;
  reportedAt: string;
};
const baseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api"
).replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message ?? `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

const fallbackZones: TrafficZone[] = [
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
const fallbackIncidents: Incident[] = [
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

export const api = {
  async isAvailable(): Promise<boolean> {
    try {
      await request<TrafficZone[]>("/traffic/zones");
      return true;
    } catch {
      return false;
    }
  },
  async getZones(): Promise<TrafficZone[]> {
    try {
      return await request<TrafficZone[]>("/traffic/zones");
    } catch {
      return fallbackZones;
    }
  },
  async getIncidents(): Promise<Incident[]> {
    try {
      return await request<Incident[]>("/incidents");
    } catch {
      return fallbackIncidents;
    }
  },
  createIncident(payload: {
    type: string;
    location: string;
    severity: string;
    description: string;
  }): Promise<Incident> {
    return request<Incident>("/incidents", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  optimizeRoute(): Promise<{ etaMinutes: number; route: string[] }> {
    return request("/routes/optimize", {
      method: "POST",
      body: JSON.stringify({
        origin: "Whitefield",
        destination: "Manipal Hospital",
        priority: "HIGH",
      }),
    });
  },
};
