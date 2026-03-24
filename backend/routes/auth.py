from fastapi import APIRouter, HTTPException, Query

from services.external_apis import get_live_signals
from services.fraud_detection import get_validation_checks
from services.risk_engine import calculate_disruption_risk

router = APIRouter(prefix="/risk", tags=["risk"])


@router.get("/live")
async def get_live_risk_signals(
	latitude: float = Query(default=28.6139),
	longitude: float = Query(default=77.2090),
) -> dict:
	try:
		signals = await get_live_signals(latitude=latitude, longitude=longitude)
	except Exception as exc:
		raise HTTPException(status_code=502, detail=f"Failed to fetch external risk signals: {exc}") from exc

	risk_score = calculate_disruption_risk(
		precipitation=signals["precipitation"],
		aqi=signals["aqi"],
		wind_speed=signals["wind_speed"],
		pm25=signals["pm25"],
	)

	return {
		**signals,
		"risk_score": risk_score,
		"validation_checks": get_validation_checks(),
	}
