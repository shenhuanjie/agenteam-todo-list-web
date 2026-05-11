from fastapi import FastAPI

from app.config import settings
from app.routes.todos import router as todos_router
from app.events import lifespan

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="TODO Web 应用后端 API — Python + FastAPI + SQLite",
    lifespan=lifespan,
)

app.include_router(todos_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
