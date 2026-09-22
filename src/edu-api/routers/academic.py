"""FastAPI Router for Academic Operations (AgentCampus)."""

from typing import Any
from auth import get_current_user
from edu_core.schemas.users import UserDto
from edu_core.services.academic import AcademicService
from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/academic", tags=["Academic Operations"])
service = AcademicService()


class InstitutionCreate(BaseModel):
    name: str
    code: str
    domain: str | None = None
    settings: dict[str, Any] | None = None


class DepartmentCreate(BaseModel):
    name: str
    code: str


class CourseCreate(BaseModel):
    code: str
    name: str
    description: str | None = None
    credits: int = 3
    department_id: str | None = None
    faculty_id: str | None = None


class EnrollmentCreate(BaseModel):
    course_id: str
    student_id: str


class AttendanceRecord(BaseModel):
    course_id: str
    student_id: str
    status: str  # present, absent, late, excused


class AssignmentCreate(BaseModel):
    course_id: str
    title: str
    description: str | None = None
    due_date: str | None = None


class NoticeCreate(BaseModel):
    title: str
    content: str
    target_role: str = "all"


@router.post("/institutions", status_code=status.HTTP_201_CREATED)
def create_institution(
    data: InstitutionCreate,
    current_user: UserDto = Depends(get_current_user),
):
    return service.create_institution(data.name, data.code, data.domain, data.settings)


@router.get("/institutions")
def list_institutions(current_user: UserDto = Depends(get_current_user)):
    return service.list_institutions()


@router.post("/departments", status_code=status.HTTP_201_CREATED)
def create_department(
    data: DepartmentCreate,
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    current_user: UserDto = Depends(get_current_user),
):
    return service.create_department(x_institution_id, data.name, data.code)


@router.get("/departments")
def list_departments(
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    current_user: UserDto = Depends(get_current_user),
):
    return service.list_departments(x_institution_id)


@router.post("/courses", status_code=status.HTTP_201_CREATED)
def create_course(
    data: CourseCreate,
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    current_user: UserDto = Depends(get_current_user),
):
    return service.create_course(
        institution_id=x_institution_id,
        code=data.code,
        name=data.name,
        description=data.description,
        credits=data.credits,
        department_id=data.department_id,
        faculty_id=data.faculty_id,
    )


@router.get("/courses")
def list_courses(
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    department_id: str | None = None,
    faculty_id: str | None = None,
    current_user: UserDto = Depends(get_current_user),
):
    return service.list_courses(x_institution_id, department_id, faculty_id)


@router.post("/enrollments", status_code=status.HTTP_201_CREATED)
def enroll_student(
    data: EnrollmentCreate,
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    current_user: UserDto = Depends(get_current_user),
):
    return service.enroll_student(x_institution_id, data.course_id, data.student_id)


@router.post("/attendance", status_code=status.HTTP_201_CREATED)
def record_attendance(
    data: AttendanceRecord,
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    current_user: UserDto = Depends(get_current_user),
):
    return service.record_attendance(
        x_institution_id, data.course_id, data.student_id, data.status, current_user.id
    )


@router.get("/attendance")
def list_attendance(
    course_id: str,
    student_id: str | None = None,
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    current_user: UserDto = Depends(get_current_user),
):
    return service.list_attendance(x_institution_id, course_id, student_id)


@router.post("/assignments", status_code=status.HTTP_201_CREATED)
def create_assignment(
    data: AssignmentCreate,
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    current_user: UserDto = Depends(get_current_user),
):
    return service.create_assignment(
        x_institution_id, data.course_id, data.title, data.description, created_by=current_user.id
    )


@router.get("/assignments")
def list_assignments(
    course_id: str,
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    current_user: UserDto = Depends(get_current_user),
):
    return service.list_assignments(x_institution_id, course_id)


@router.post("/notices", status_code=status.HTTP_201_CREATED)
def create_notice(
    data: NoticeCreate,
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    current_user: UserDto = Depends(get_current_user),
):
    return service.create_notice(
        x_institution_id, data.title, data.content, data.target_role, created_by=current_user.id
    )


@router.get("/notices")
def list_notices(
    x_institution_id: str = Header(..., alias="X-Institution-Id"),
    current_user: UserDto = Depends(get_current_user),
):
    return service.list_notices(x_institution_id)
