export const workerOverview = {
  name: 'Ananya Verma',
  id: 'W-2026-118',
  zone: 'South Delhi',
  activePolicy: 'Standard Shield',
  weeklyPremium: 25,
  earningsProtected: 6420,
  expectedWeekly: 8900,
  trustScore: 94,
};

export const workerClaims = [
  {
    id: 'CL-9011',
    trigger: 'Heavy Rainfall',
    date: '2026-03-15',
    zone: 'South Delhi',
    payout: 520,
    status: 'Paid',
    lossHours: 2.7,
  },
  {
    id: 'CL-8957',
    trigger: 'AQI Spike',
    date: '2026-03-12',
    zone: 'South Delhi',
    payout: 340,
    status: 'Paid',
    lossHours: 1.9,
  },
  {
    id: 'CL-8902',
    trigger: 'Traffic Gridlock',
    date: '2026-03-08',
    zone: 'South Delhi',
    payout: 0,
    status: 'Review',
    lossHours: 1.1,
  },
];

export const workerEarnings = {
  weekly: [
    { label: 'Mon', actual: 980, insured: 120, target: 1100 },
    { label: 'Tue', actual: 840, insured: 260, target: 1090 },
    { label: 'Wed', actual: 920, insured: 140, target: 1060 },
    { label: 'Thu', actual: 760, insured: 320, target: 1030 },
    { label: 'Fri', actual: 1040, insured: 80, target: 1120 },
    { label: 'Sat', actual: 1150, insured: 0, target: 1150 },
    { label: 'Sun', actual: 650, insured: 410, target: 1030 },
  ],
  monthly: [
    { label: 'Week 1', actual: 6250, insured: 980, target: 7350 },
    { label: 'Week 2', actual: 6710, insured: 640, target: 7420 },
    { label: 'Week 3', actual: 6080, insured: 1230, target: 7360 },
    { label: 'Week 4', actual: 7020, insured: 580, target: 7600 },
  ],
};

export const riskZones = [
  { id: 1, zone: 'South Delhi', score: 8.4, trend: 'Rising', weather: 'Rain warning', aqi: 182, traffic: 'Heavy', incidents: 5 },
  { id: 2, zone: 'North Delhi', score: 5.2, trend: 'Stable', weather: 'Cloudy', aqi: 138, traffic: 'Moderate', incidents: 2 },
  { id: 3, zone: 'East Delhi', score: 3.1, trend: 'Improving', weather: 'Clear', aqi: 92, traffic: 'Light', incidents: 1 },
  { id: 4, zone: 'West Delhi', score: 6.6, trend: 'Rising', weather: 'Pollution alert', aqi: 167, traffic: 'Heavy', incidents: 4 },
];

export const adminMetrics = {
  workers: 1864,
  activePolicies: 1621,
  payoutsThisWeek: 1489300,
  fraudFlags: 9,
};

export const disruptions = [
  {
    id: 'DSP-331',
    zone: 'South Delhi',
    category: 'Heavy Rainfall',
    severity: 'Critical',
    workersImpacted: 284,
    payoutExposure: 186400,
    status: 'Active',
    source: 'IMD + IoT Rain Gauge',
    startedAt: '2026-03-16 14:05',
  },
  {
    id: 'DSP-329',
    zone: 'West Delhi',
    category: 'Traffic Congestion',
    severity: 'High',
    workersImpacted: 152,
    payoutExposure: 94300,
    status: 'Resolved',
    source: 'Google Mobility Feed',
    startedAt: '2026-03-16 09:40',
  },
  {
    id: 'DSP-327',
    zone: 'North Delhi',
    category: 'AQI Spike',
    severity: 'Medium',
    workersImpacted: 108,
    payoutExposure: 61100,
    status: 'Monitoring',
    source: 'CPCB Sensor Grid',
    startedAt: '2026-03-15 17:10',
  },
];

export const workers = [
  { id: 'W-2026-118', name: 'Ananya Verma', zone: 'South Delhi', trust: 94, claims: 4, status: 'Active', phone: '+91 98888 11001', email: 'ananya@aegisai.app' },
  { id: 'W-2026-119', name: 'Rohit Dabas', zone: 'West Delhi', trust: 79, claims: 7, status: 'Flagged', phone: '+91 98888 11002', email: 'rohit@aegisai.app' },
  { id: 'W-2026-120', name: 'Farah Khan', zone: 'North Delhi', trust: 88, claims: 3, status: 'Active', phone: '+91 98888 11003', email: 'farah@aegisai.app' },
  { id: 'W-2026-121', name: 'Ishan Goyal', zone: 'East Delhi', trust: 43, claims: 9, status: 'Suspended', phone: '+91 98888 11004', email: 'ishan@aegisai.app' },
];

export const fraudAlerts = [
  {
    id: 'FR-77',
    worker: 'Rohit Dabas',
    workerId: 'W-2026-119',
    level: 'High',
    pattern: 'Repeated geo-jump during claim windows',
    score: 86,
    status: 'Investigating',
    time: '2026-03-16 12:24',
  },
  {
    id: 'FR-75',
    worker: 'Ishan Goyal',
    workerId: 'W-2026-121',
    level: 'Critical',
    pattern: 'Synthetic ride logs and duplicate outage claims',
    score: 94,
    status: 'Escalated',
    time: '2026-03-16 09:10',
  },
  {
    id: 'FR-71',
    worker: 'Farah Khan',
    workerId: 'W-2026-120',
    level: 'Medium',
    pattern: 'Excessive claims near threshold boundaries',
    score: 63,
    status: 'Watchlist',
    time: '2026-03-15 18:22',
  },
];

export const payoutsByPeriod = {
  weekly: [
    { label: 'Mon', payout: 212000, claims: 132 },
    { label: 'Tue', payout: 189000, claims: 111 },
    { label: 'Wed', payout: 238000, claims: 144 },
    { label: 'Thu', payout: 195000, claims: 127 },
    { label: 'Fri', payout: 261000, claims: 168 },
    { label: 'Sat', payout: 311000, claims: 201 },
    { label: 'Sun', payout: 83000, claims: 53 },
  ],
  monthly: [
    { label: 'Week 1', payout: 1242000, claims: 812 },
    { label: 'Week 2', payout: 1313000, claims: 848 },
    { label: 'Week 3', payout: 1189000, claims: 776 },
    { label: 'Week 4', payout: 1489300, claims: 936 },
  ],
};

export const policyCatalogSeed = [
  {
    id: 'POL-101',
    name: 'Starter Shield',
    premium: 15,
    coverage: 5000,
    triggerTypes: 'Rainfall',
    activeSubscribers: 421,
  },
  {
    id: 'POL-102',
    name: 'Standard Shield',
    premium: 25,
    coverage: 10000,
    triggerTypes: 'Rainfall, AQI',
    activeSubscribers: 884,
  },
  {
    id: 'POL-103',
    name: 'Pro Shield',
    premium: 35,
    coverage: 16000,
    triggerTypes: 'Rainfall, AQI, Traffic',
    activeSubscribers: 316,
  },
];
