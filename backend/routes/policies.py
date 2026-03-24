from fastapi import APIRouter, HTTPException

from database import get_policies, get_policy, renew_policy
from schemas.policy import PolicyResponse

router = APIRouter(prefix="/policies", tags=["policies"])


@router.get("", response_model=list[PolicyResponse])
def read_policies() -> list[PolicyResponse]:
	return [PolicyResponse(**item) for item in get_policies()]


@router.get("/{policy_id}", response_model=PolicyResponse)
def read_policy(policy_id: str) -> PolicyResponse:
	policy = get_policy(policy_id)
	if not policy:
		raise HTTPException(status_code=404, detail="Policy not found")
	return PolicyResponse(**policy)


@router.post("/{policy_id}/renew", response_model=PolicyResponse)
def renew_policy_by_id(policy_id: str) -> PolicyResponse:
	policy = renew_policy(policy_id)
	if not policy:
		raise HTTPException(status_code=404, detail="Policy not found")
	return PolicyResponse(**policy)
