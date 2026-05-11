from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时自动创建所有表（开发/测试用）
    # 生产环境应使用 Alembic 迁移
    Base.metadata.create_all(bind=engine)
    yield


def create_app() -> FastAPI:
    from app.config import settings
    from app.routes.todos import router as todos_router

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

    return app
