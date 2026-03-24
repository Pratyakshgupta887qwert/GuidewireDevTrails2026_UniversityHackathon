from pydantic import BaseModel


class ClaimResponse(BaseModel):
	id: str
	event_type: str
	zone: str
	payout: int
	status: str
	date: str


class PayoutRulesResponse(BaseModel):
	rules: list[str]
