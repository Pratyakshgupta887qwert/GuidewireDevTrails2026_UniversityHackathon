'use strict';

const CITY_ENVIRONMENTAL_DATA = {
  Mumbai: { rain: 25, temp: 32, aqi: 120, trafficSpeed: 8 },
  Delhi: { rain: 10, temp: 40, aqi: 450, trafficSpeed: 12 },
  Jaipur: { rain: 5, temp: 44, aqi: 180, trafficSpeed: 25 },
  Bangalore: { rain: 12, temp: 29, aqi: 95, trafficSpeed: 18 },
  Hyderabad: { rain: 8, temp: 36, aqi: 160, trafficSpeed: 20 },
  Chennai: { rain: 18, temp: 34, aqi: 130, trafficSpeed: 14 },
  Kolkata: { rain: 22, temp: 33, aqi: 170, trafficSpeed: 10 },
  Pune: { rain: 9, temp: 31, aqi: 110, trafficSpeed: 21 },
  Ahmedabad: { rain: 4, temp: 42, aqi: 210, trafficSpeed: 24 },
  Gurgaon: { rain: 11, temp: 39, aqi: 320, trafficSpeed: 11 },
  Noida: { rain: 13, temp: 38, aqi: 340, trafficSpeed: 10 },
  Lucknow: { rain: 7, temp: 37, aqi: 240, trafficSpeed: 16 },
  Chandigarh: { rain: 6, temp: 35, aqi: 150, trafficSpeed: 22 },
  Indore: { rain: 8, temp: 34, aqi: 140, trafficSpeed: 19 },
};

const SUPPORTED_CITIES = Object.keys(CITY_ENVIRONMENTAL_DATA);

const BASE_PLANS = {
  basic: {
    name: 'Basic',
    premium: 15,
    coverage: 1000,
    features: [
      'Weekly income loss protection',
      'Automated weather disruption monitoring',
      'Best for lower-risk city zones',
    ],
  },
  standard: {
    name: 'Standard',
    premium: 25,
    coverage: 2000,
    popular: true,
    features: [
      'Balanced cover for mixed-risk zones',
      'Better payout capacity per event',
      'Most chosen weekly protection tier',
    ],
  },
  premium: {
    name: 'Premium',
    premium: 35,
    coverage: 3000,
    features: [
      'Highest income loss protection',
      'Built for elevated city disruption risk',
      'Maximum weekly coverage buffer',
    ],
  },
};

const PLAN_ALIASES = {
  low: 'basic',
  medium: 'standard',
  high: 'premium',
  extended: 'premium',
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundCurrency(value) {
  return Math.round(Number(value) * 100) / 100;
}

function normalizeCity(rawCity = '') {
  const match = SUPPORTED_CITIES.find(
    (city) => city.toLowerCase() === String(rawCity).trim().toLowerCase()
  );
  return match || null;
}

function normalizePlanKey(rawPlan = '') {
  const normalized = String(rawPlan).trim().toLowerCase();
  const alias = PLAN_ALIASES[normalized] || normalized;
  return BASE_PLANS[alias] ? alias : null;
}

function getRainScore(rain) {
  if (rain <= 2) return 10;
  if (rain <= 10) return 30;
  if (rain <= 20) return 60;
  if (rain <= 50) return 80;
  return 100;
}

function getHeatScore(temp) {
  if (temp < 30) return 20;
  if (temp <= 35) return 40;
  if (temp <= 40) return 70;
  if (temp <= 45) return 90;
  return 100;
}

function getAqiScore(aqi) {
  if (aqi <= 100) return 20;
  if (aqi <= 200) return 40;
  if (aqi <= 300) return 60;
  if (aqi <= 400) return 80;
  return 100;
}

function getTrafficScore(trafficSpeed) {
  if (trafficSpeed > 30) return 20;
  if (trafficSpeed >= 20) return 40;
  if (trafficSpeed >= 10) return 70;
  if (trafficSpeed >= 5) return 90;
  return 100;
}

function getRiskLevel(riskScore) {
  if (riskScore >= 75) return 'High';
  if (riskScore >= 50) return 'Medium';
  return 'Low';
}

function getCityEnvironmentalData(city) {
  const normalizedCity = normalizeCity(city);
  if (!normalizedCity) {
    return null;
  }

  return {
    city: normalizedCity,
    ...CITY_ENVIRONMENTAL_DATA[normalizedCity],
  };
}

function calculateRiskScoreForCity(city) {
  const environment = getCityEnvironmentalData(city);
  if (!environment) {
    return null;
  }

  const rainScore = getRainScore(environment.rain);
  const heatScore = getHeatScore(environment.temp);
  const aqiScore = getAqiScore(environment.aqi);
  const trafficScore = getTrafficScore(environment.trafficSpeed);

  const riskScore =
    (rainScore * 0.35) +
    (heatScore * 0.25) +
    (aqiScore * 0.20) +
    (trafficScore * 0.20);

  const unclampedMultiplier = 0.7 + (riskScore / 100);
  const multiplier = clamp(unclampedMultiplier, 0.8, 1.3);

  return {
    city: environment.city,
    environmentalData: {
      rain: environment.rain,
      temp: environment.temp,
      aqi: environment.aqi,
      trafficSpeed: environment.trafficSpeed,
    },
    componentScores: {
      rainScore,
      heatScore,
      aqiScore,
      trafficScore,
    },
    risk_score: roundCurrency(riskScore),
    multiplier: roundCurrency(multiplier),
    risk_level: getRiskLevel(riskScore),
  };
}

function calculatePlanCatalogue(city) {
  const riskMetrics = calculateRiskScoreForCity(city);
  if (!riskMetrics) {
    return null;
  }

  const plans = Object.entries(BASE_PLANS).map(([key, plan]) => ({
    key,
    name: plan.name,
    popular: Boolean(plan.popular),
    base_premium: plan.premium,
    base_coverage: plan.coverage,
    premium: roundCurrency(plan.premium * riskMetrics.multiplier),
    coverage: roundCurrency(plan.coverage * riskMetrics.multiplier),
    multiplier: riskMetrics.multiplier,
    risk_score: riskMetrics.risk_score,
    risk_level: riskMetrics.risk_level,
    features: plan.features,
  }));

  return {
    city: riskMetrics.city,
    multiplier: riskMetrics.multiplier,
    risk_score: riskMetrics.risk_score,
    risk_level: riskMetrics.risk_level,
    componentScores: riskMetrics.componentScores,
    environmentalData: riskMetrics.environmentalData,
    plans,
  };
}

function calculateHourlyIncome(avgDailyIncome, workingHours) {
  const safeDailyIncome = Number(avgDailyIncome) || 0;
  const safeWorkingHours = Number(workingHours) || 1;
  return roundCurrency(safeDailyIncome / safeWorkingHours);
}

function calculatePayout({ avgDailyIncome, workingHours, disruptionHours, coverageAmount }) {
  const hourlyIncome = calculateHourlyIncome(avgDailyIncome, workingHours);
  const safeDisruptionHours = Number(disruptionHours) || 0;
  const rawPayout = hourlyIncome * safeDisruptionHours * 0.75;
  const payout = Math.min(roundCurrency(rawPayout), Number(coverageAmount) || 0);

  return {
    hourly_income: hourlyIncome,
    disruption_hours: safeDisruptionHours,
    payout: roundCurrency(payout),
  };
}

function randomDisruptionHours() {
  return Math.floor(Math.random() * 3) + 4;
}

module.exports = {
  BASE_PLANS,
  SUPPORTED_CITIES,
  normalizeCity,
  normalizePlanKey,
  calculateRiskScoreForCity,
  calculatePlanCatalogue,
  calculateHourlyIncome,
  calculatePayout,
  randomDisruptionHours,
  roundCurrency,
};
