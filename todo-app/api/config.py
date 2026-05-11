import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./todo.db"
    app_name: str = "TODO API"
    debug: bool = False
    hmac_secret: str = "dev-secret"

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
