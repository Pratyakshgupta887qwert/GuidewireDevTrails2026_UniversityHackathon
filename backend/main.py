from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routes import auth, claims, policies, workers

app = FastAPI(title=settings.app_name)

app.add_middleware(
	CORSMiddleware,
	allow_origins=settings.cors_origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(workers.router, prefix=settings.api_prefix)
app.include_router(policies.router, prefix=settings.api_prefix)
app.include_router(claims.router, prefix=settings.api_prefix)
app.include_router(auth.router, prefix=settings.api_prefix)


@app.get("/")
def healthcheck() -> dict:
	return {"status": "ok", "service": settings.app_name}
