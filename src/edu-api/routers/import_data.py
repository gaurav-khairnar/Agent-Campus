"""FastAPI Router for Academic Bulk Data Import (AgentCampus)."""

import json
from typing import Any
from auth import get_current_user
from edu_core.schemas.users import UserDto
from edu_core.services.academic import AcademicService
from fastapi import APIRouter, Depends, Header, HTTPException, UploadFile, File, status
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/academic/import", tags=["Bulk Data Import"])
service = AcademicService()


@router.post("/json", status_code=status.HTTP_200_OK)
async def import_academic_json(
    file: UploadFile = File(...),
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    current_user: UserDto = Depends(get_current_user),
):
    """Bulk import academic departments, courses, and timetables from JSON file."""
    try:
        content = await file.read()
        data = json.loads(content.decode("utf-8"))

        departments_created = 0
        courses_created = 0

        # Import departments
        for dept in data.get("departments", []):
            service.create_department(x_institution_id, dept["name"], dept["code"])
            departments_created += 1

        # Import courses
        for course in data.get("courses", []):
            service.create_course(
                institution_id=x_institution_id,
                code=course["code"],
                name=course["name"],
                description=course.get("description"),
                credits=course.get("credits", 3),
            )
            courses_created += 1

        return {
            "status": "success",
            "imported": {
                "departments": departments_created,
                "courses": courses_created,
            },
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process import file: {e!s}",
        )
