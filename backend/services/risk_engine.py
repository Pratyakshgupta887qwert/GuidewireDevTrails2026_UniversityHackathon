def calculate_disruption_risk(precipitation: float, aqi: float, wind_speed: float, pm25: float) -> int:
	rain_score = min(35.0, precipitation * 14.0)
	aqi_score = min(35.0, (aqi / 300.0) * 35.0)
	wind_score = min(20.0, (wind_speed / 30.0) * 20.0)
	pm_score = min(10.0, (pm25 / 80.0) * 10.0)
	total = max(5.0, rain_score + aqi_score + wind_score + pm_score)
	return min(100, round(total))
