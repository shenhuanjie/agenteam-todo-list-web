import sys
import os

_api_dir = os.path.dirname(os.path.abspath(__file__))
if _api_dir not in sys.path:
    sys.path.insert(0, _api_dir)

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.database import engine, Base, get_db, SessionLocal
from api.config import settings
from api.todos import router as todos_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时自动创建所有表
    Base.metadata.create_all(bind=engine)
    yield


# CORS: 同域部署（前后端都在 Vercel），允许同源请求
# 如果前端域名是 xxx.vercel.app，后端是 yyy.vercel.app，
# 需把前端域名加入 allow_origins
app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="TODO Web 应用后端 API — Python + FastAPI + SQLite (Vercel Serverless)",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: 生产环境替换为具体前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


# Vercel serverless handler
# 每次 cold start 时 lifespan 会触发，DB 表自动创建
app_handler = app
