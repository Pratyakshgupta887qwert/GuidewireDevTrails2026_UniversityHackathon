from fastapi import APIRouter

from database import get_claims, get_payout_rules
from schemas.claim import ClaimResponse, PayoutRulesResponse

router = APIRouter(prefix="/claims", tags=["claims"])


@router.get("", response_model=list[ClaimResponse])
def read_claims() -> list[ClaimResponse]:
	return [ClaimResponse(**item) for item in get_claims()]


@router.get("/payout-rules", response_model=PayoutRulesResponse)
def read_payout_rules() -> PayoutRulesResponse:
	return PayoutRulesResponse(rules=get_payout_rules())
