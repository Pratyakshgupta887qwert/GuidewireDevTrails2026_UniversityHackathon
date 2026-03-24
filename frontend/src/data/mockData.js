export const worker = {
  name: "Rider Rakesh",
  greeting: "Welcome Back",
  policyId: "AEG-2026-004281",
  planName: "Aegis Income Shield - Weekly",
  city: "Delhi NCR",
};

export const services = [
  "Risk Heatmap",
  "Policy Upgrade",
  "Fraud Alerts",
  "Payout Status",
  "Income Analytics",
  "Support",
];

export const discoverProducts = [
  "Weekly Basic Cover",
  "Standard Disruption Cover",
  "Extended High-Risk Cover",
  "Accident Add-on",
  "Medical Add-on",
  "Emergency Assistance",
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

export const wellnessStats = {
  score: 62,
  target: 100,
  hydrationGoalMl: 2000,
  hydrationDoneMl: 900,
};

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
