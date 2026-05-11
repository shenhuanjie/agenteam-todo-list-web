from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./todo.db"
    app_name: str = "TODO API"
    debug: bool = False
    # HMAC 签名密钥（必填，通过环境变量注入）
    hmac_secret: str = "dev-secret"


settings = Settings()
