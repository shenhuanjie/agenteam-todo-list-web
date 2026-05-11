# TODO API

FastAPI 后端服务，支持 TODO 的完整 CRUD 和用户数据隔离。

## 技术栈

- **框架**: Python 3.11 + FastAPI 0.109
- **数据库**: SQLite + SQLAlchemy ORM
- **迁移**: Alembic

## 快速启动

```bash
cd projects/todo-api
uv venv .venv --python 3.11
source .venv/bin/activate
uv pip install -r requirements.txt

# 启动服务（自动建表）
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 或运行迁移（生产环境推荐）
alembic upgrade head
```

## API 文档

启动后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 认证

所有请求必须携带 `X-User-ID` Header（UUID 格式）：

```
X-User-ID: f47ac10b-58cc-4372-a567-0e02b2c3d479
```

MVP 阶段：管理员分配 user_id，不对接完整用户系统。

## 接口一览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/todos | 获取当前用户所有 TODO |
| POST | /api/todos | 创建 TODO |
| GET | /api/todos/{id} | 获取单个 TODO |
| PATCH | /api/todos/{id} | 更新 TODO |
| DELETE | /api/todos/{id} | 删除 TODO |

### 查询参数

```
GET /api/todos?completed=true   # 按完成状态过滤
```

## 数据模型

```
TODO:
  - id: UUID v4
  - user_id: UUID（所属用户）
  - title: str (必填, 1-200字符)
  - description: str (可选, 最多2000字符)
  - completed: bool (默认 false)
  - created_at: datetime (UTC)
  - updated_at: datetime (UTC)
```

## 响应格式

```json
// 单条
{"data": {"id": "...", "title": "...", ...}}

// 列表
{"data": [...], "total": 10}

// 创建/更新成功
{"data": {...}}

// 删除成功
204 No Content

// 错误
{"detail": "..."}
```

## 错误码

| 状态码 | 说明 |
|--------|------|
| 401 | 缺少或无效 X-User-ID |
| 404 | 资源不存在（跨用户访问也返回404，防枚举） |
| 422 | 请求参数校验失败 |

## 数据库迁移

```bash
# 创建新迁移
alembic revision --autogenerate -m "描述"

# 应用迁移
alembic upgrade head

# 回滚
alembic downgrade -1
```

## 环境变量

| 变量 | 要求 | 说明 |
|------|------|------|
| `HMAC_SECRET` | **必填，无默认值** | HMAC 签名密钥（生产必须更换 dev 默认值） |
| `DATABASE_URL` | 可选 | 数据库连接字符串，默认为 `sqlite:///./todo.db` |

**启动前必须设置密钥：**
```bash
export HMAC_SECRET="your-256-bit-secret-here"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
