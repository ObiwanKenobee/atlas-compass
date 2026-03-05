// Atlas Sanctum — Dashboard Mock Data

export const burnRateData = {
  current: 284000,
  previousMonth: 312000,
  trend: "down" as const,
  history: [
    { month: "Oct", value: 380000 },
    { month: "Nov", value: 355000 },
    { month: "Dec", value: 340000 },
    { month: "Jan", value: 312000 },
    { month: "Feb", value: 298000 },
    { month: "Mar", value: 284000 },
  ],
};

export const runwayData = {
  currentCash: 5_400_000,
  monthlyBurn: 284000,
  runwayMonths: 19,
};

export const mrrData = {
  current: 142000,
  previousMonth: 127000,
  growthPercent: 11.8,
  history: [
    { month: "Apr", value: 62000 },
    { month: "May", value: 71000 },
    { month: "Jun", value: 79000 },
    { month: "Jul", value: 88000 },
    { month: "Aug", value: 97000 },
    { month: "Sep", value: 104000 },
    { month: "Oct", value: 112000 },
    { month: "Nov", value: 118000 },
    { month: "Dec", value: 123000 },
    { month: "Jan", value: 127000 },
    { month: "Feb", value: 134000 },
    { month: "Mar", value: 142000 },
  ],
};

export const revenueStreamsData = [
  { name: "Impact Verification APIs", value: 52000, color: "#3fd68f" },
  { name: "Enterprise Simulations", value: 38000, color: "#4bb8a6" },
  { name: "Regenerative Marketplace", value: 29000, color: "#5a9fd4" },
  { name: "Gov / Institutional Data", value: 23000, color: "#8b7cf8" },
];

export const revenueStreamsMonthly = [
  { month: "Oct", api: 30000, enterprise: 22000, marketplace: 16000, gov: 12000 },
  { month: "Nov", api: 34000, enterprise: 25000, marketplace: 19000, gov: 14000 },
  { month: "Dec", api: 38000, enterprise: 28000, marketplace: 22000, gov: 17000 },
  { month: "Jan", api: 42000, enterprise: 30000, marketplace: 24000, gov: 19000 },
  { month: "Feb", api: 47000, enterprise: 34000, marketplace: 26000, gov: 20000 },
  { month: "Mar", api: 52000, enterprise: 38000, marketplace: 29000, gov: 23000 },
];

export const costStructureData = [
  { name: "Engineering Infra", value: 95000, color: "#3fd68f" },
  { name: "Data Acquisition", value: 62000, color: "#4bb8a6" },
  { name: "Operations & Team", value: 54000, color: "#5a9fd4" },
  { name: "Research & Modeling", value: 42000, color: "#8b7cf8" },
  { name: "Partnerships & Field", value: 31000, color: "#f59e42" },
];

export const cacData = [
  { month: "Oct", value: 8400 },
  { month: "Nov", value: 7900 },
  { month: "Dec", value: 7200 },
  { month: "Jan", value: 6800 },
  { month: "Feb", value: 6200 },
  { month: "Mar", value: 5700 },
];

export const ltvData = {
  current: 284000,
  cac: 5700,
  ratio: 49.8,
};

export const revenuePerEmployee = {
  current: 9467,
  headcount: 15,
  trend: "up" as const,
};

export const impactData = [
  { metric: "Hectares Restored", value: "12,400", unit: "ha", economicValue: 3_720_000, icon: "🌿" },
  { metric: "Carbon Sequestered", value: "48,200", unit: "tCO₂", economicValue: 1_928_000, icon: "🌍" },
  { metric: "Ecosystems Protected", value: "37", unit: "sites", economicValue: 2_590_000, icon: "🦋" },
];

export const investorFeedData = [
  {
    date: "Mar 3, 2025",
    type: "product",
    title: "Carbon Credit API v2.1 Released",
    description: "Enhanced verification endpoints now process 10x more transactions per second.",
  },
  {
    date: "Feb 24, 2025",
    type: "partnership",
    title: "Partnership: Veridian Capital Group",
    description: "3-year enterprise contract for regenerative land intelligence data feeds.",
  },
  {
    date: "Feb 14, 2025",
    type: "data",
    title: "Sentinel-2 Satellite Integration",
    description: "Real-time hyperspectral imagery now powers ecosystem health scoring.",
  },
  {
    date: "Jan 29, 2025",
    type: "verification",
    title: "12,400 Hectares Certified",
    description: "Amazon biome corridor verified and listed on the Regenerative Marketplace.",
  },
  {
    date: "Jan 12, 2025",
    type: "product",
    title: "Government Dashboard Launched",
    description: "Public sector portal for Brazil MMA now live with biodiversity indexes.",
  },
];
