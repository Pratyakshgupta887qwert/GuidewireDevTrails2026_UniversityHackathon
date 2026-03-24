from copy import deepcopy

worker = {
	"id": "worker-1",
	"name": "Rider Rakesh",
	"greeting": "Welcome Back",
	"city": "Delhi NCR",
	"plan_name": "Aegis Income Shield - Weekly",
}

policies = [
	{
		"id": "aegis-weekly-1",
		"status": "Active",
		"name": "Aegis Income Shield - Weekly",
		"holder": "Rider Rakesh",
		"end_date": "13 Nov 2026",
		"days_left": 234,
		"premium": 25,
		"sum_insured": 2000,
	},
	{
		"id": "aegis-weekly-2",
		"status": "Pending",
		"name": "Aegis Monsoon Guard",
		"holder": "Rider Rakesh",
		"end_date": "22 Nov 2026",
		"days_left": 0,
		"premium": 35,
		"sum_insured": 3000,
	},
]

claims = [
	{
		"id": "CLM-201",
		"event_type": "Heavy Rain",
		"zone": "Dwarka Zone 3",
		"payout": 420,
		"status": "Approved",
		"date": "2026-03-18",
	},
	{
		"id": "CLM-174",
		"event_type": "Traffic Gridlock",
		"zone": "Saket Zone 1",
		"payout": 180,
		"status": "Processing",
		"date": "2026-03-12",
	},
]

payout_rules = [
	"If rainfall exceeds threshold for 90+ minutes, payout engine is triggered.",
	"Only workers with active weekly policy during event window are eligible.",
	"Fraud checks include location integrity, delivery activity, and duplicate claim scan.",
	"Approved compensation is transferred automatically without manual claim filing.",
]


def get_worker() -> dict:
	return deepcopy(worker)


def get_policies() -> list[dict]:
	return deepcopy(policies)


def get_policy(policy_id: str) -> dict | None:
	for policy in policies:
		if policy["id"] == policy_id:
			return deepcopy(policy)
	return None


def renew_policy(policy_id: str) -> dict | None:
	for policy in policies:
		if policy["id"] == policy_id:
			policy["status"] = "Active"
			policy["days_left"] = 7
			return deepcopy(policy)
	return None


def get_claims() -> list[dict]:
	return deepcopy(claims)


def get_payout_rules() -> list[str]:
	return deepcopy(payout_rules)
