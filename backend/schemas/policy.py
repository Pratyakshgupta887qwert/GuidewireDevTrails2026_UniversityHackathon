from pydantic import BaseModel


class PolicyResponse(BaseModel):
	id: str
	status: str
	name: str
	holder: str
	end_date: str
	days_left: int
	premium: int
	sum_insured: int
