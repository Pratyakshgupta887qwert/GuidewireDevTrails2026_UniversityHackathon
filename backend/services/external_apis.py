import asyncio
import httpx


async def get_live_signals(latitude: float, longitude: float) -> dict:
	weather_url = (
		"https://api.open-meteo.com/v1/forecast"
		f"?latitude={latitude}&longitude={longitude}"
		"&current=temperature_2m,precipitation,wind_speed_10m,weather_code"
	)
	air_quality_url = (
		"https://air-quality-api.open-meteo.com/v1/air-quality"
		f"?latitude={latitude}&longitude={longitude}&current=us_aqi,pm2_5"
	)

	async with httpx.AsyncClient(timeout=8.0) as client:
		weather_res, air_res = await asyncio.gather(
			client.get(weather_url),
			client.get(air_quality_url),
		)

	weather_res.raise_for_status()
	air_res.raise_for_status()

	weather = weather_res.json().get("current", {})
	air = air_res.json().get("current", {})

	return {
		"temperature": float(weather.get("temperature_2m", 0)),
		"precipitation": float(weather.get("precipitation", 0)),
		"wind_speed": float(weather.get("wind_speed_10m", 0)),
		"weather_code": int(weather.get("weather_code", 0)),
		"aqi": float(air.get("us_aqi", 0)),
		"pm25": float(air.get("pm2_5", 0)),
		"latitude": latitude,
		"longitude": longitude,
	}
