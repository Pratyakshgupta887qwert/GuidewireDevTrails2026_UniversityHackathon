import { getRiskLiveApi } from "./backendApi";

const DEFAULT_COORDS = { latitude: 28.6139, longitude: 77.209 };

function withTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { signal: controller.signal })
    .finally(() => {
      clearTimeout(timeout);
    });
}

export async function getLiveRiskSignals({ latitude, longitude } = DEFAULT_COORDS) {
  try {
    const backend = await getRiskLiveApi({ latitude, longitude });
    return {
      temperature: Number(backend.temperature ?? 0),
      precipitation: Number(backend.precipitation ?? 0),
      windSpeed: Number(backend.wind_speed ?? backend.windSpeed ?? 0),
      weatherCode: Number(backend.weather_code ?? backend.weatherCode ?? 0),
      aqi: Number(backend.aqi ?? 0),
      pm25: Number(backend.pm25 ?? 0),
      latitude: Number(backend.latitude ?? latitude),
      longitude: Number(backend.longitude ?? longitude),
    };
  } catch {
    // Continue with direct public API fallback if backend is unavailable.
  }

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,wind_speed_10m,weather_code`;
  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5`;

  const [weatherRes, aqiRes] = await Promise.all([
    withTimeout(weatherUrl),
    withTimeout(airQualityUrl),
  ]);

  if (!weatherRes.ok || !aqiRes.ok) {
    throw new Error("Live risk APIs unavailable right now.");
  }

  const [weatherData, aqiData] = await Promise.all([weatherRes.json(), aqiRes.json()]);
  const weather = weatherData.current || {};
  const air = aqiData.current || {};

  return {
    temperature: Number(weather.temperature_2m ?? 0),
    precipitation: Number(weather.precipitation ?? 0),
    windSpeed: Number(weather.wind_speed_10m ?? 0),
    weatherCode: Number(weather.weather_code ?? 0),
    aqi: Number(air.us_aqi ?? 0),
    pm25: Number(air.pm2_5 ?? 0),
    latitude,
    longitude,
  };
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      () => reject(new Error("Location permission denied.")),
      { enableHighAccuracy: false, timeout: 7000 }
    );
  });
}

export function calculateDisruptionRisk(signals) {
  const rainScore = Math.min(35, signals.precipitation * 14);
  const aqiScore = Math.min(35, (signals.aqi / 300) * 35);
  const windScore = Math.min(20, (signals.windSpeed / 30) * 20);
  const pmScore = Math.min(10, (signals.pm25 / 80) * 10);

  const risk = Math.round(Math.max(5, rainScore + aqiScore + windScore + pmScore));
  return Math.min(100, risk);
}

export { DEFAULT_COORDS };
