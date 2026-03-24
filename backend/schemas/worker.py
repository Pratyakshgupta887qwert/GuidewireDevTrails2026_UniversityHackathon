from pydantic import BaseModel


class WorkerResponse(BaseModel):
	id: str
	name: str
	greeting: str
	city: str
	plan_name: str
