from fastapi import APIRouter

from database import get_worker
from schemas.worker import WorkerResponse

router = APIRouter(prefix="/workers", tags=["workers"])


@router.get("/me", response_model=WorkerResponse)
def read_current_worker() -> WorkerResponse:
	return WorkerResponse(**get_worker())
