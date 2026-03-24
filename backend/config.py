import os


class Settings:
	app_name: str = "AegisAI Backend"
	api_prefix: str = "/api"
	cors_origins: list[str]

	def __init__(self) -> None:
		configured = os.getenv("CORS_ORIGINS", "*")
		self.cors_origins = [origin.strip() for origin in configured.split(",") if origin.strip()]


settings = Settings()
