"""FastAPI Router for Human-in-the-Loop AI Approval Queue (AgentCampus)."""

from typing import Any
from auth import get_current_user
from edu_core.schemas.users import UserDto
from edu_core.services.ai_workflow import AIWorkflowService
from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/ai-approval", tags=["AI Approval Queue"])
service = AIWorkflowService()


class ApprovalAction(BaseModel):
    comment: str | None = None


class AIWorkflowTaskCreate(BaseModel):
    workflow_type: str  # grade_recommendation, attendance_flag, notice_draft
    payload: dict[str, Any]


@router.get("/queue")
def list_pending_approval_tasks(
    workflow_type: str | None = None,
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    current_user: UserDto = Depends(get_current_user),
):
    return service.list_pending_tasks(x_institution_id, workflow_type)


@router.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_approval_task(
    data: AIWorkflowTaskCreate,
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    current_user: UserDto = Depends(get_current_user),
):
    return service.create_workflow_task(
        institution_id=x_institution_id,
        workflow_type=data.workflow_type,
        payload=data.payload,
        created_by=current_user.id,
    )


@router.post("/tasks/{task_id}/approve")
def approve_task(
    task_id: str,
    action: ApprovalAction,
    current_user: UserDto = Depends(get_current_user),
):
    return service.approve_task(task_id=task_id, approved_by=current_user.id, comment=action.comment)


@router.post("/tasks/{task_id}/reject")
def reject_task(
    task_id: str,
    action: ApprovalAction,
    current_user: UserDto = Depends(get_current_user),
):
    return service.reject_task(task_id=task_id, approved_by=current_user.id, comment=action.comment)
