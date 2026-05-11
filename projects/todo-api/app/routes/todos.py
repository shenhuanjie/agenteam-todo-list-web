from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user_id
from app.models import TODO
from app.schemas import (
    TODOCreate,
    TODOUpdate,
    TODOResponse,
    TODOListResponse,
    TODOCreateResponse,
)

router = APIRouter(prefix="/api/todos", tags=["TODO"])


@router.get("", response_model=TODOListResponse)
def get_todos(
    completed: Optional[bool] = Query(None, description="按完成状态过滤"),
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    获取当前用户的所有 TODO。
    默认只返回当前用户的记录（数据隔离）。
    """
    query = db.query(TODO).filter(TODO.user_id == user_id)
    if completed is not None:
        query = query.filter(TODO.completed == completed)

    todos = query.order_by(TODO.created_at.desc()).all()
    return TODOListResponse(
        data=[TODOResponse.model_validate(t) for t in todos],
        total=len(todos),
    )


@router.post("", response_model=TODOCreateResponse, status_code=201)
def create_todo(
    todo_in: TODOCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    创建 TODO，自动归属当前用户。
    """
    todo = TODO(
        user_id=user_id,
        title=todo_in.title,
        description=todo_in.description,
    )
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return TODOCreateResponse(data=TODOResponse.model_validate(todo))


@router.get("/{todo_id}", response_model=TODOCreateResponse)
def get_todo(
    todo_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    获取单个 TODO（仅所有者可访问）。
    跨用户访问返回 404（不返回 403，防止枚举探测）。
    """
    todo = db.query(TODO).filter(
        TODO.id == todo_id,
        TODO.user_id == user_id,
    ).first()
    if not todo:
        raise HTTPException(status_code=404, detail="TODO not found")
    return TODOCreateResponse(data=TODOResponse.model_validate(todo))


@router.patch("/{todo_id}", response_model=TODOCreateResponse)
def update_todo(
    todo_id: str,
    todo_in: TODOUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    更新 TODO（仅所有者可操作）。
    支持部分更新，任意字段可单独更新。
    """
    todo = db.query(TODO).filter(
        TODO.id == todo_id,
        TODO.user_id == user_id,
    ).first()
    if not todo:
        raise HTTPException(status_code=404, detail="TODO not found")

    update_data = todo_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(todo, field, value)

    db.add(todo)
    db.commit()
    db.refresh(todo)
    return TODOCreateResponse(data=TODOResponse.model_validate(todo))


@router.delete("/{todo_id}", status_code=204)
def delete_todo(
    todo_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    删除 TODO（仅所有者可操作）。
    """
    todo = db.query(TODO).filter(
        TODO.id == todo_id,
        TODO.user_id == user_id,
    ).first()
    if not todo:
        raise HTTPException(status_code=404, detail="TODO not found")

    db.delete(todo)
    db.commit()
    return None
