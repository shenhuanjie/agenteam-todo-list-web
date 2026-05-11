import hmac
import hashlib

from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings


def _compute_token(user_id: str) -> str:
    """计算指定 user_id 对应的 HMAC-SHA256 token。"""
    return hmac.new(
        settings.hmac_secret.encode(),
        user_id.encode(),
        hashlib.sha256,
    ).hexdigest()


def verify_token(user_id: str, token: str) -> bool:
    """HMAC 签名验证（常数时间比较）。"""
    expected = _compute_token(user_id)
    return hmac.compare_digest(expected, token)


async def get_current_user_id(
    x_user_id: str = Header(..., description="用户身份标识符（UUID）"),
    x_user_token: str = Header(..., description="HMAC-SHA256(x_user_id, secret)"),
    db: Session = Depends(get_db),
) -> str:
    """
    验证用户身份：
    1. X-User-ID 存在且非空
    2. X-User-Token = HMAC-SHA256(X-User-ID, server_secret)

    MVP 阶段不校验 user_id 是否真实存在，只需签名匹配即可。
    """
    if not x_user_id or not x_user_id.strip():
        raise HTTPException(status_code=401, detail="Missing X-User-ID header")

    if not verify_token(x_user_id.strip(), x_user_token.strip()):
        raise HTTPException(status_code=401, detail="Invalid X-User-Token")

    return x_user_id.strip()
