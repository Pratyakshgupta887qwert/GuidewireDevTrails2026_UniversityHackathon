export const worker = {
  name: "Rider Rakesh",
  greeting: "Welcome Back",
  policyId: "AEG-2026-004281",
  planName: "Aegis Income Shield - Weekly",
  city: "Delhi NCR",
};

export const services = [
  "Weekly Coverage Plans",
  "Expected Earnings Predictor",
  "Income Drop Detection",
  "Local Risk Heatmap",
  "Fraud Shield Alerts",
  "Instant Payout Tracking",
];

export const discoverProducts = [
  "Basic Weekly Cover - Rs 15",
  "Standard Weekly Cover - Rs 25",
  "Extended Weekly Cover - Rs 35",
  "Monsoon Surge Protection",
  "AQI Spike Protection",
  "Traffic Paralysis Protection",
];

export const policies = [
  {
    id: "aegis-weekly-1",
    status: "Active",
    name: "Aegis Income Shield - Weekly",
    holder: "Rider Rakesh",
    endDate: "13 Nov 2026",
    daysLeft: 234,
    premium: 25,
    sumInsured: 2000,
  },
  {
    id: "aegis-weekly-2",
    status: "Pending",
    name: "Aegis Monsoon Guard",
    holder: "Rider Rakesh",
    endDate: "22 Nov 2026",
    daysLeft: 0,
    premium: 35,
    sumInsured: 3000,
  },
];

export const claimHistory = [
  {
    id: "CLM-201",
    eventType: "Heavy Rain",
    zone: "Dwarka Zone 3",
    payout: 420,
    status: "Approved",
    date: "2026-03-18",
  },
  {
    id: "CLM-174",
    eventType: "Traffic Gridlock",
    zone: "Saket Zone 1",
    payout: 180,
    status: "Processing",
    date: "2026-03-12",
  },
];

export const riskMonitor = {
  zone: "Delhi NCR",
  disruptionProbability: 62,
  trustScore: 91,
  activeSignals: ["Rainfall Intensity", "AQI Level", "Traffic Congestion"],
};

export const payoutRules = [
  "If rainfall exceeds threshold for 90+ minutes, payout engine is triggered.",
  "Only workers with active weekly policy during event window are eligible.",
  "Fraud checks include location integrity, delivery activity, and duplicate claim scan.",
  "Approved compensation is transferred automatically without manual claim filing.",
];

export const riskZones = [
  { zone: "Dwarka Zone 3", risk: "High", trigger: "Heavy Rain" },
  { zone: "Saket Zone 1", risk: "Elevated", trigger: "Traffic Gridlock" },
  { zone: "Noida Sector 62", risk: "Moderate", trigger: "AQI Spike" },
];

export const validationChecks = [
  "GPS path continuity verified",
  "Delivery activity matched with event timeline",
  "Device trust fingerprint valid",
  "No duplicate payout request detected",
];

export const articles = [
  {
    id: "art-1",
    title: "How Rain Alerts Affect Gig Earnings",
    text: "Understand how rainfall thresholds trigger parametric compensation and what data is considered.",
    image: "/ui/WhatsApp Image 2026-03-24 at 2.10.56 PM3.jpeg",
  },
  {
    id: "art-2",
    title: "AQI Spikes and Safe Route Planning",
    text: "Learn how AQI-based risk scores adjust premiums and active disruption windows.",
    image: "/ui/WhatsApp Image 2026-03-24 at 2.10.56 PM5.jpeg",
  },
];

export const coverageIncluded = [
  "Income loss due to heavy rain",
  "Income loss due to extreme AQI disruptions",
  "Income loss during severe traffic paralysis",
  "Emergency payout on high-severity disruption",
];

export const coverageExcluded = [
  "Manual no-show without disruption event",
  "Out-of-zone operations outside registered area",
  "Claims during inactive policy period",
  "Claims flagged for confirmed spoofing fraud",
];
