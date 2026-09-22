"""Human-in-the-Loop AI Workflow Approval Service for AgentCampus."""

from contextlib import contextmanager
from datetime import datetime, timezone
from uuid import uuid4

from edu_db.models import AIWorkflowTask, Notice, Submission
from edu_db.session import get_session_factory
from edu_core.exceptions import NotFoundError


class AIWorkflowService:
    """Service for managing AI Workflow Tasks requiring Human-in-the-Loop Approval."""

    def __init__(self) -> None:
        pass

    @contextmanager
    def _get_db_session(self):
        SessionLocal = get_session_factory()
        db = SessionLocal()
        try:
            yield db
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    def create_workflow_task(
        self,
        institution_id: str,
        workflow_type: str,
        payload: dict,
        created_by: str | None = None,
    ) -> dict:
        """Create a new AI workflow task requiring human review."""
        with self._get_db_session() as db:
            task = AIWorkflowTask(
                id=str(uuid4()),
                institution_id=institution_id,
                workflow_type=workflow_type,
                payload=payload,
                status="pending_approval",
                created_by=created_by,
            )
            db.add(task)
            db.commit()
            return {
                "id": task.id,
                "institution_id": task.institution_id,
                "workflow_type": task.workflow_type,
                "payload": task.payload,
                "status": task.status,
                "created_at": task.created_at.isoformat(),
            }

    def list_pending_tasks(
        self,
        institution_id: str,
        workflow_type: str | None = None,
    ) -> list[dict]:
        """List all pending AI approval tasks for a tenant."""
        with self._get_db_session() as db:
            query = db.query(AIWorkflowTask).filter(
                AIWorkflowTask.institution_id == institution_id,
                AIWorkflowTask.status == "pending_approval",
            )
            if workflow_type:
                query = query.filter(AIWorkflowTask.workflow_type == workflow_type)
            tasks = query.order_by(AIWorkflowTask.created_at.desc()).all()
            return [
                {
                    "id": t.id,
                    "institution_id": t.institution_id,
                    "workflow_type": t.workflow_type,
                    "payload": t.payload,
                    "status": t.status,
                    "created_by": t.created_by,
                    "created_at": t.created_at.isoformat(),
                }
                for t in tasks
            ]

    def approve_task(
        self,
        task_id: str,
        approved_by: str,
        comment: str | None = None,
    ) -> dict:
        """Approve an AI workflow task and execute its side-effects."""
        with self._get_db_session() as db:
            task = db.query(AIWorkflowTask).filter(AIWorkflowTask.id == task_id).first()
            if not task:
                raise NotFoundError(f"AI Workflow Task {task_id} not found")

            task.status = "approved"
            task.approved_by = approved_by
            task.comment = comment
            task.updated_at = datetime.now(timezone.utc)

            # Execute workflow side-effects based on type
            payload = task.payload or {}
            if task.workflow_type == "grade_recommendation":
                submission_id = payload.get("submission_id")
                grade = payload.get("recommended_grade")
                feedback = payload.get("recommended_feedback")
                if submission_id:
                    sub = db.query(Submission).filter(Submission.id == submission_id).first()
                    if sub:
                        sub.grade = grade
                        sub.feedback = feedback
                        sub.approved_by = approved_by

            elif task.workflow_type == "notice_draft":
                notice_id = payload.get("notice_id")
                if notice_id:
                    notice = db.query(Notice).filter(Notice.id == notice_id).first()
                    if notice:
                        notice.is_published = True
                        notice.approved_by = approved_by

            db.commit()
            return {
                "id": task.id,
                "status": task.status,
                "approved_by": task.approved_by,
                "comment": task.comment,
                "message": "AI workflow task approved and executed.",
            }

    def reject_task(
        self,
        task_id: str,
        approved_by: str,
        comment: str | None = None,
    ) -> dict:
        """Reject an AI workflow task."""
        with self._get_db_session() as db:
            task = db.query(AIWorkflowTask).filter(AIWorkflowTask.id == task_id).first()
            if not task:
                raise NotFoundError(f"AI Workflow Task {task_id} not found")

            task.status = "rejected"
            task.approved_by = approved_by
            task.comment = comment
            task.updated_at = datetime.now(timezone.utc)
            db.commit()
            return {
                "id": task.id,
                "status": task.status,
                "approved_by": task.approved_by,
                "comment": task.comment,
                "message": "AI workflow task rejected.",
            }
